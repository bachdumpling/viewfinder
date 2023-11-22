import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // GPT response to get the description for DALL·E
      const gptResponse = await openai.chat.completions.create({
        // ... existing GPT prompt and configuration
      });

      // Assuming the first response contains 'dalleDescription'
      const dalleDescription =
        gptResponse.choices[0].message.content.dalleDescription;

      // DALL·E API request for image generation
      if (dalleDescription) {
        const dalleResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: dalleDescription,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });

        const imageUrl = dalleResponse.data[0].url;

        // Send both GPT and DALL·E responses
        res
          .status(200)
          .json({ gptResult: gptResponse.choices, dalleImageUrl: imageUrl });
      } else {
        res.status(200).json({ gptResult: gptResponse.choices });
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
