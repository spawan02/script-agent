import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { directorAgent } from "./agents/directorAgent";
import { scriptAgent } from "./agents/scriptAgent";
import { voiceAgent } from "./agents/voiceAgent";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.get("/",(_,res)=>{
    res.json("server is healthy")
})
app.post("/generate-audio", async (req, res) => {
    try {
        const { prompt, sceneCount = 3 } = req.body;
        if (!prompt) {
            res.status(400).json({ error: "Prompt is required" });
            return;
        }

        const { scenes } = await directorAgent(prompt, sceneCount);
        const narrations = await scriptAgent(scenes);
        const audios = await voiceAgent(narrations);

        res.json({ prompt, scenes, narrations, audios });
    } catch (err) {
        console.error("Error in /generate-audio:", err);
        res.status(500).json({ error: "Failed to generate audio" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
