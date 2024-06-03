import { validateSignature } from "@/octokit/gh_utils";
import IssueWebhookHandlers from "@/octokit/webhook-handlers/issue-handlers";

export default async function handler(req, res) {
    if (req.method === 'POST') {
    // Verify the webhook signature for security
    const signature = req.headers['x-hub-signature-256'];

    if (!validateSignature(req.rawBody, signature)) {
        return res.status(401).send('Invalid signature');
    }

    const event = req.headers['x-github-event'];
    const {payload, action, issue, repository} = req.body;

    switch (event) {
        case 'issues':
            IssueWebhookHandlers(payload, action, issue, repository);
            break;
        // case '':

        //     break;
        
        // case '':

        //     break;
        case 'ping':
            console.log('GitHub sent the ping event')
            break;
        default:
            return res.status(200).send('Event type not handled');
    }

        res.status(200).json({ message: 'Webhook processed successfully' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
