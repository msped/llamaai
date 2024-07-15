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
        const streamResult = await chat.sendMessage(message);
        const response = streamResult.response.candidates[0].content;
        const files = JSON.parse(response.parts[0].text);
        return files;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to propagate it
    }
}

const jsonSchema = (message) => {
    const schema = {
        title: "Obtain project dependencies",
        description: message,
        type: "array",
        items: {
            type: "string",
            additionalProperties: false,
        },
        additionalProperties: false
    }
    return schema;
}

async function obtainProjectDependencies(octokit, repository) {
    // Fetch the entire repository structure
    const repoStructure = await fetchRepositoryStructure(octokit, repository.owner.login, repository.name);
    const filePaths = await fetchFilePaths(repoStructure);
    
    if (!filePaths) return null 

    const dependencies = []
    for (const filePath of filePaths) {
        try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: repository.owner.login,
            repo: repository.name,
            path: filePath,
        })
        if (response.status === 200) {
            dependencies.push(Buffer.from(response.data.content, "base64").toString('utf8'))
        }
        } catch (error) {
            console.error("Dependency not populating: ", error)
            throw error;
        }
    }

    return dependencies
}

async function fetchFilePaths(repoStructure) { 
    const message = `With the following repository structure, please return 
    the file paths to the projects dependency files in an array.
    
    Repository Structure: 
    ${JSON.stringify(repoStructure, null, 2)}
    `;

    // Send the prompt to Gemini
    const filePaths = await sendMessage(`Follow JSON Schema.<JSONSchema>${
        (JSON.stringify(jsonSchema(message)))
    }</JSONSchema>`);

    return filePaths
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

export { obtainProjectDependencies };