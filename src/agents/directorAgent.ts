import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Scene {
    id: number;
    description: {
        scene_title: string;
        description: string;
    };
}

export interface DirectorResponse {
    sceneCount: number;
    scenes: Scene[];
}

/**
 * Director Agent: Splits a video idea into scenes
 * @param prompt string - user prompt
 * @param sceneCount number - number of scenes to split into (default: 3)
 * @returns DirectorResponse - structured scene data
 */
async function directorAgent(
    prompt: string,
    sceneCount: number = 3
): Promise<DirectorResponse> {
    const systemPrompt = `You are a creative video director. Your job is to split a video idea into ${sceneCount} distinct visual scenes. Each scene should be imaginative, specific, and detailed. Return only a JSON array of scene descriptions.`;

    const userPrompt = `Video Idea: "${prompt}"\n\nSplit this into ${sceneCount} distinct scenes with strong visual storytelling.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    try {
        const cleanJson = (content || "")
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const sceneDescriptions: string[] = JSON.parse(cleanJson);
        console.log("scene", sceneDescriptions);
        const scenes: Scene[] = sceneDescriptions.map((desc: any, index) => ({
            id: index + 1,
            description: desc,
        }));

        return {
            sceneCount: scenes.length,
            scenes,
        };
    } catch (err) {
        console.error("Failed to parse response from Director Agent:", err);
        console.error("Raw response:", content);
        throw new Error("Director Agent failed to parse scene breakdown.");
    }
}

export { directorAgent };
