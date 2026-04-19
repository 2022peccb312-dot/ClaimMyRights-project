import express from "express";
import { askGemini } from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { issue, language } = req.body;

        if (!issue) {
            return res.status(400).json({
                result: "Issue description is required."
            });
        }

        // Map frontend language selection to prompt instruction
        let langInstruction = "Respond in English";
        if (language === "ta-IN") langInstruction = "Respond in Tamil";
        else if (language === "hi-IN") langInstruction = "Respond in Hindi";

        const prompt = `
You are a legal document drafting assistant in India for a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}.
- Use professional legal language.
- Make the complaint easy to understand for a common person.
- Do not mix languages.

User Issue:
${issue}

Complaint must include:
- Heading
- To address authority
- Subject
- Description of facts
- Applicable laws
- Prayer / request
- Closing statement
`;

        const response = await askGemini(prompt);

        res.json({ result: response });

    } catch (error) {
        console.error("Complaint Route Error:", error);
        res.status(500).json({
            result: "Complaint generation failed."
        });
    }
});

export default router;
