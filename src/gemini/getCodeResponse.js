import { VertexAI } from "@google-cloud/vertexai";

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'llamaai-425119', location: 'europe-west2'});
const model = 'gemini-1.5-pro-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 0.5,
        'topP': 0.95,
        'responseMimeType': 'application/json'
    },
    safetySettings: [
        {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        }
    ],
});

const chat = generativeModel.startChat({});

async function sendMessage(message) {
    try {
        for (let attempt = 1; attempt <= 5; attempt++) {
            const streamResult = await chat.sendMessage(message);
            if (streamResult.response.finishReason !== 'RECITATION') {
                const response = streamResult.response.candidates[0].content;
                const files = JSON.parse(response.parts[0].text);
                return files;
            } else {
                console.warn(`Recitation response received. Attempt ${attempt} of 5.`);
                if (attempt === 5) {
                    throw new Error('Failed to get a non-recitation response after 5 attempts.');
                }
                // Modify the message to explicitly ask for a non-recitation response
                message = `Please provide a response that is not a recitation. 
                ${message}`;
            }
        }
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it
    }
}

const jsonSchema = (message) => {
    const schema = {
        title: "Generate Files and solutions",
        description: message,
        type: "array",
        items: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                },
                contents: {
                    type: "string",
                },
                commitMessage: {
                    type: "string",
                },
            },
            required: ["filePath", "contents", "commitMessage"],
            additionalProperties: false,
        },
        additionalProperties: false
    }
    return schema;
}

async function getExistingFileSha(octokit, ) {
    try {
        const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            owner,
            repo,
            path,
        });
        return response.data.sha;
    } catch (error) {
        console.error(error)
        throw error; // Re-throw the error to propagate it
    }
}

async function generateContent(octokit, issue, repository, dependencies) {
    // Fetch the entire repository structure
    const repoStructure = await fetchRepositoryStructure(octokit, repository.owner.login, repository.name);

    // Construct the prompt with the repository structure
    const message = `Generate a solution for the issue in the ${repository.name} repository. 
    The project dependencies are listed below so that you can return an accurate response.

    The issue is: ${issue.title}
    Use this information to assist you in providing your solution: ${issue.body}
    
    Please return the files you wish to modify/create and the solution in full. 
    If you need to modify an existing file, please return the full file with the updated code. 
    Where possible, use existing files. If no files exist, return the file path from the repository 
    root with the file name and extension.

    If required to install extra dependencies, modify the dependency file to add the required 
    dependencies you have used.
    
    Do not provide recited responses.

    You should return an array of JSON objects where each object has a filePath, contents, 
    and commitMessage property like so: 
    [
        {
            "filePath": "path/to/file.js",
            "contents": "Modified file contents",
            "commitMessage": "Commit message"
        },
        ...
    ]
    
    Repository Structure: 
    ${JSON.stringify(repoStructure, null, 2)}

    Project Dependencies: 
    ${JSON.stringify(dependencies, null, 2)}
    `;

    // Send the prompt to Gemini
    const files = await sendMessage(`Follow JSON Schema.<JSONSchema>${
        (JSON.stringify(jsonSchema(message)))
    }</JSONSchema>`);

    // Process the response
    for (const file of files) {
        // Check if the file already exists using repoStructure
        const existingFile = repoStructure.find(f => f.path === file.filePath);

        // If the file exists, get its contents and send another prompt to Gemini
        if (existingFile) {
            // Construct the prompt for modification
            const modificationPrompt = `Modify the following file to accomodate the new code: \n\n` +
                existingFile.content
            
            const sha = await getExistingFileSha(
                octokit,
                repository.owner.login,
                repository.name,
                file.filePath
            )

            // Send the modification prompt to Gemini
            const modifiedFiles = await sendMessage(`Follow JSON Schema.<JSONSchema>${
                (JSON.stringify(jsonSchema(modificationPrompt)))
            }</JSONSchema>`);

            // Update the file contents
            file.contents = modifiedFiles[0].contents; // Assuming the response is in the expected format
            file.commitMessage = modifiedFiles[0].commitMessage; // Assuming the response is in the expected format
            file.sha = sha ? sha : null; // pass the sha for the file to be modified 
        }
    }

    return files;
}

async function fetchRepositoryStructure(octokit, owner, repo) {
    const structure = [];
    await fetchDirectoryStructure(octokit, owner, repo, '', structure);
    return structure;
}

async function fetchDirectoryStructure(octokit, owner, repo, path, structure) {
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path,
    });

    for (const file of response.data) {
        structure.push(file);
        if (file.type === 'dir') {
            await fetchDirectoryStructure(octokit, owner, repo, file.path, structure);
        }
    }
}

export { generateContent };