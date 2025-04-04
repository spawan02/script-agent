import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function voiceAgent(scripts: { sceneId: number, narration: string }[]) {
  const audioFiles: string[] = [];

  for (const { sceneId, narration } of scripts) {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/your-voice-id',
      { text: narration, voice_settings: { stability: 0.3, similarity_boost: 0.7 } },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const filePath = `output/scene-${sceneId}.mp3`;
    fs.writeFileSync(filePath, response.data);
    audioFiles.push(filePath);
  }

  return audioFiles;
}
