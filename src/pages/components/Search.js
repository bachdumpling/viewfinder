import OpenAI from "openai";
import React, { useEffect, useState } from "react";
import ArtCard from "./ArtCard";

function Search({ apiKey }) {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [artworks, setArtworks] = useState(null);

  // Function to call the Art Institute API
  const fetchArtworks = async (artPieceName, artist, year) => {
    // Encode the search terms for use in a URL
    // const query = `q=${encodeURIComponent(artPieceName)}
    // &q=${encodeURIComponent(artist)}&q=${encodeURIComponent(year)}`;
    const query = `q=${encodeURIComponent(artPieceName)}`;
    const apiURL = `https://api.artic.edu/api/v1/artworks/search?${query}&fields=id,title,artist_display,date_display,image_id,artist_title,artist_id`;

    try {
      const artResponse = await fetch(apiURL);
      const artData = await artResponse.json();
      setArtworks(artData.data); // Assuming the response has a 'data' key
      console.log("Art details fetched:", artData);
    } catch (error) {
      console.error("Error fetching art details:", error);
      setArtworks("Failed to fetch art details");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const prompt = `what is the painting of ${inputValue}? The answers should have the name of the art piece, the artist, the date in which it is displayed. Return only json, do not write normal text. Give from 3 to 5 answers.`;

    const prompt = `what is this painting: ${inputValue}?`;

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputValue: prompt }),
      });
      const data = await response.json();
      const gptResponse = JSON.parse(data.result[0].message.content);

      setOutputValue(gptResponse);
      console.log("gpt output", gptResponse);

      // Fetch art details using the data from GPT API
      if (gptResponse) {
        fetchArtworks(
          gptResponse[0].artPieceName,
          gptResponse[0].artist,
          gptResponse[0].year
        );
      }
    } catch (error) {
      console.error("Failed to fetch from API:", error);
      setOutputValue("Failed to fetch");
    }
  };

  return (
    <div className="bg-gray-700 p-5 min-h-screen w-full mx-auto">
      <div className="">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Viewfinder
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Input:
            </label>
            <input
              id="search"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Search for an artwork..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-xl text-white mb-2">Output:</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <pre className="text-gray-800">
              {JSON.stringify(outputValue, null, 2)}
            </pre>
          </div>
        </div>

        {artworks && (
          <div className="mt-6">
            <h2 className="text-xl text-white mb-2">Art Details:</h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <ArtCard artworks={artworks} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Search;
