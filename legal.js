import express from "express";
import { askGemini } from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { problem, language } = req.body;

        if (!problem) {
            return res.status(400).json({
                result: "Problem description is required."
            });
        }

        // Map frontend language selection to AI instructions
        let langInstruction = "Respond in English using simple words";
        if (language === "ta-IN") langInstruction = "Respond in Tamil using simple words";
        else if (language === "hi-IN") langInstruction = "Respond in Hindi using simple words";

        const prompt = `
You are an expert Indian legal advisor on a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}.
- Do NOT mix languages.
- Explain clearly for a common person in India.

User problem:
${problem}

Provide:
1. Applicable Indian laws
2. Explanation in simple language
3. Rights of the user
4. Step-by-step legal solution
5. Precautions
`;

        const response = await askGemini(prompt);

        res.json({ result: response });

    } catch (error) {
        console.error("Legal Route Error:", error);
        res.status(500).json({
            result: "Unable to generate legal guidance at the moment."
        });
    }
});

export default router;
