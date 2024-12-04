import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/sentiment", async (req, res) => {
    const { text } = req.body;
    console.log("Request received: ",req.body);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that analyzes the sentiment of text.",
                },
                {
                    role: "user",
                    content: `Analyze the sentiment of the following text: "${text}"`,
                },
            ],
            max_tokens: 50,
        });

        const sentiment = response.choices[0].message.content.trim();
        res.json({ sentiment });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
