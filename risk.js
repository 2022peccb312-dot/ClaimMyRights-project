import express from "express";
import { askGemini } from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { issue, language } = req.body;

        if (!issue) {
            return res.status(400).json({
                result: "Please provide an issue for risk analysis."
            });
        }

        // Map frontend language selection to AI instructions
        let langInstruction = "Respond in English using simple words";
        if (language === "ta-IN") langInstruction = "Respond in Tamil using simple words";
        else if (language === "hi-IN") langInstruction = "Respond in Hindi using simple words";

        const prompt = `
You are a legal risk analysis expert for a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}.
- Provide analysis understandable by a common person.
- Do not mix languages.

Analyze the following issue:
${issue}

Provide:
1. Legal risk level (Low / Medium / High)
2. Financial risk
3. Possible legal consequences
4. Chances of success
5. Recommendation
`;

        const response = await askGemini(prompt);

        res.json({ result: response });

    } catch (error) {
        console.error("Risk Route Error:", error);
        res.status(500).json({
            result: "Risk analysis could not be generated."
        });
    }
});

export default router;
