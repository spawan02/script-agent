import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { directorAgent } from './agents/directorAgent';
import { scriptAgent } from './agents/scriptAgent';
import { visualAgent } from './agents/visualAgent';
import { voiceAgent } from './agents/voiceAgent';
import { editorAgent } from './agents/editorAgent';
import { uploaderAgent } from './agents/uploaderAgent';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

app.post('/generate-video', async (req, res) => {
  try {
    const { prompt, sceneCount = 3 } = req.body;
    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return
    }

    const { scenes } = await directorAgent(prompt, sceneCount);
    const scripts = await scriptAgent(scenes);
    const visuals = await visualAgent(scenes);
    const audios = await voiceAgent(scripts);
    const finalVideo = await editorAgent(visuals, audios);
    const videoUrl = await uploaderAgent(finalVideo);

    res.json({ videoUrl });
  } catch (err) {
    console.error("Error in /generate-video:", err);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
