import express from "express";
import { askGemini } from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { problem, location, type, language } = req.body;

        if (!problem || !location) {
            return res.status(400).json({
                result: "Missing legal problem or location."
            });
        }

        // Map frontend language selection to prompt instruction
        let langInstruction = "Respond in English";
        if (language === "ta-IN") langInstruction = "Respond in Tamil";
        else if (language === "hi-IN") langInstruction = "Respond in Hindi";

        const prompt = `
You are a legal assistant for a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}.
- Use simple, clear words.
- Provide recommendations suitable for common citizens.
- Do not mix languages.

User details:
- Legal problem: ${problem}
- Location: ${location}
- Preference: ${type}

Task:
Recommend suitable lawyers or legal NGOs.

Response format:
1. Lawyer/NGO Name
2. Area of specialization
3. Phone number
4. Email address
5. Office address

Note: This is for academic/demo purposes.
`;

        const result = await askGemini(prompt);

        res.json({ result });

    } catch (error) {
        console.error("Lawyer Route Error:", error);
        res.status(500).json({
            result: "Unable to generate lawyer recommendations."
        });
    }
});

export default router;
