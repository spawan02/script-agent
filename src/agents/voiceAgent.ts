import axios from "axios";
import fs from "fs";
import path from "path";
import { uploadToSupabase } from "../utils/uploadToSupabase";
import { v4 as uuidv4 } from "uuid";

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const uniqueId = uuidv4()
async function voiceAgent(scripts: { sceneId: number; narration: string }[]) {
    const audioFiles: string[] = [];

    for (const { sceneId, narration } of scripts) {
        if (!narration || narration.toLowerCase().startsWith("i'm sorry")) {
            console.warn(` Skipping scene ${sceneId}: Invalid narration`);
            continue;
        }
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: narration,
                model_id: "eleven_monolingual_v1",
                voice_settings: { stability: 0.3, similarity_boost: 0.7 },
            },
            {
                headers: {
                    "xi-api-key": process.env.ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
            }
        );
        
        const fileName = `scene-${sceneId}-${uniqueId}.mp3`;
        const publicUrl = await uploadToSupabase(fileName, response.data);
        audioFiles.push(publicUrl);
    }

    return audioFiles;
}

export { voiceAgent };
