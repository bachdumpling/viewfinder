// pages/api/search.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const artSearchSchema = {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                artPieceName: { type: "string" },
                artist: { type: "string" },
                year: { type: "integer" },
              },
              required: ["artPieceName", "artist", "year"],
            },
          },
        },
        required: ["results"],
      };

      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
            //   "You are a helpful art assistant. Format the response as a JSON array of objects with keys 'artPieceName: string', 'artist: string', 'year: integer', and dateBegin and dateEnd: JSON date. Return 2-3 possible answers",
            "You are a helpful art assistant. Format the response as a JSON array of objects with keys 'artPieceName: string', 'artist: string', 'year: integer'. Only return 1 response.",
          },
          {
            role: "user",
            content: req.body.inputValue,
          },
        ],
        model: "gpt-4",
        // functions: [
        //   {
        //     name: "search_art",
        //     description:
        //       "Search for art based on a query and return results in a structured format.",
        //     parameters: artSearchSchema,
        //   },
        // ],
      });

      res.status(200).json({ result: response.choices });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
