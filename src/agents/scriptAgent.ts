import OpenAI from "openai";
import { Scene } from "./directorAgent";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function scriptAgent(scenes: Scene[]) {
    const scripts = [];

    for (const scene of scenes) {
        const { scene_title, description: details } = scene.description;
        const userPrompt = `Scene Title: ${scene_title}\nVisual Description: ${details}\n\nWrite a 1-2 sentence cinematic narration for this scene.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a professional voiceover scriptwriter for cinematic videos.",
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            temperature: 0.7,
        });
        console.log(response.choices);
        const narration = response.choices[0].message?.content?.trim() || "";

        if ( !narration || narration.toLowerCase().includes("please describe the scene")) {
            throw new Error(`Invalid narration for scene ${scene.id}`);
        }
        const content = response.choices[0].message?.content || "";
        scripts.push({ sceneId: scene.id, narration: content.trim() });
    }

    return scripts;
}

export { scriptAgent };
