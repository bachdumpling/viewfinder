import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Updated prompt to request the new information
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an art expert. Format the response as a JSON array of objects with keys 'artPieceName: string' (name of the art), 'artist: string' (name of the artist), 'medium: string', 'dalleDescription: string' (Detailed description of the art for Dalle to recreate). Return 1 to 3 responses.",
          },
          {
            role: "user",
            content: req.body.inputValue,
          },
        ],
        model: "gpt-4",
        temperature: 0.8,
      });

      // console.log(
      //   JSON.parse(response.choices[0].message.content)[0].dalleDescription
      // );

      const dalleDescription = JSON.parse(
        response.choices[0].message.content
      )[0].dalleDescription;

      // DALL·E API request for image generation
      if (dalleDescription) {
        const dalleResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: dalleDescription,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });
        // console.log(dalleResponse);
        const imageUrl = dalleResponse.data[0].url;

        // Send both GPT and DALL·E responses
        res
          .status(200)
          .json({ result: response.choices, dalleImageUrl: imageUrl });
      } else {
        res.status(200).json({ result: response.choices });
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
