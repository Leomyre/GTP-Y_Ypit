// services/service-gemini.ts
type GeminiResponse = {
    candidates: {
        content: {
            parts: {
                text: string
            }[]
        }
    }[]
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

export default async function generateWithGemini(prompt: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Clé API Gemini non configurée")
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        topP: 0.95,
                        maxOutputTokens: 2000
                    }
                })
            }
        )

        if (!response.ok) {
            throw new Error(`Erreur Gemini: ${response.statusText}`)
        }

        const data: GeminiResponse = await response.json()
        return data.candidates[0].content.parts[0].text
    } catch (error) {
        console.error("Erreur lors de l'appel à Gemini:", error)
        throw error
    }
}
