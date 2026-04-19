import express from "express";
import { askGemini } from "../gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { category, state, issue, language } = req.body;

    if (!category || !state || !issue) {
      return res.status(400).json({
        result: "Please provide your details or issue."
      });
    }

    let langInstruction = "Respond in English";
    if (language === "ta-IN") langInstruction = "Respond in Tamil";
    else if (language === "hi-IN") langInstruction = "Respond in Hindi";

    const prompt = `
You are an Indian government legal aid advisor for a platform called Claim My Rights.

IMPORTANT INSTRUCTIONS:
- ${langInstruction}
- Use simple, clear words.
- Do not mix languages.

User Category: ${category}
State: ${state}
Issue:
${issue}

Provide:
1. Eligibility for free legal aid
2. Applicable government schemes
3. Authorities to approach
4. Required documents
5. Next steps
`;

    const response = await askGemini(prompt);
    res.json({ result: response });

  } catch (error) {
    console.error("Government Aid Route Error:", error);
    res.status(500).json({
      result: "Unable to fetch government legal aid details."
    });
  }
});

export default router;
