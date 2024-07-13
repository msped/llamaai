'use server'

import { z } from 'zod';

const feedbackSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    feedback: z.string(),
    label: z.string(),
    luckyllama: z.string()
})

export async function feedbackAction(formData) {
    try {
        const rawFormData = JSON.parse(formData);
        const validatedBody = feedbackSchema.parse(rawFormData);

        if (validatedBody.luckyllama.length > 0) {
            return { status: 201}
        }

        const response = await fetch("https://projectplannerai.com/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectId: process.env.PROJECTPLANNERAI_PROJECT_ID,
                feedback: validatedBody.feedback,
                name: validatedBody.name,
                email: validatedBody.email,
                luckyllama: validatedBody.luckyllama,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Failed to submit feedback');
        }

        return { status: 201 }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: JSON.stringify({ errors: error.issues }),
                status: 400 
            }
        } else {
            return {
                message: JSON.stringify({ errors: error.message }),
                status: 500
            }
        }
    }
}