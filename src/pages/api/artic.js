import fetch from "node-fetch";

export default async function getArtDetails(req, res) {
  if (req.method === "POST") {
    try {
      // Destructure the data received from the GPT API call
      const { artPieceName, artist, year } = req.body;

      // Construct the query part of the URL
      const query = `q=${artPieceName.split(" ").join("+")}&q=${artist
        .split(" ")
        .join("+")}&q=${year}`;

      // Construct the fields part of the URL
      const fields = `fields=id,title,artist_display,date_display,image_id,artist_title,artist_id`;

      // Construct the Art Institute API endpoint with the received parameters
      const apiURL = `https://api.artic.edu/api/v1/artworks/search?${query}&${fields}`;

      // Make the API call to the Art Institute API
      const artResponse = await fetch(apiURL);
      const artData = await artResponse.json();

      // If the API call was successful, return the detailed information
      if (artData.data) {
        res.status(200).json(artData.data[0]);
      } else {
        res.status(404).json({ message: "Artwork not found" });
      }
    } catch (error) {
      console.error("Error fetching art details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
