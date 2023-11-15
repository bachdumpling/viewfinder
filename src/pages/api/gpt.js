import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Expanded schema to include additional details for the Met API search
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
                medium: { type: "string" },
                // dateDisplay: { type: "date" },
              },
              required: ["artPieceName", "artist", "medium"],
            },
          },
        },
        required: ["results"],
      };

      // Updated prompt to request the new information
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful art expert. Format the response as a JSON array of objects with keys 'artPieceName: string', 'artist: string', 'medium: string'. Return 1 to 3 responses.",
          },
          {
            role: "user",
            content: req.body.inputValue,
          },
        ],
        model: "gpt-4",
        temperature: 0.5,
        // function_call: artSearchSchema,
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
