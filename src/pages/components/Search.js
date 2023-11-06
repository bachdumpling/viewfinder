import OpenAI from "openai";
import React, { useEffect, useState } from "react";
import ArtCard from "./ArtCard";

function Search({}) {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [artworks, setArtworks] = useState(null);
  const [artType, setArtType] = useState("painting");

  // Function to call the Art Institute API
  // Function to call both Art Institute and Met Museum APIs
  const fetchArtworks = async (artPieceName, artist) => {
    const articQuery = `q=${encodeURIComponent(
      artPieceName
    )}&q=${encodeURIComponent(artist)}`;
    const articApiURL = `https://api.artic.edu/api/v1/artworks/search?${articQuery}&fields=id,title,artist_display,date_display,image_id,artist_title,artist_id`;

    const metApiQuery = `q=${encodeURIComponent(
      artPieceName
    )}+${encodeURIComponent(artist)}`;
    const metApiURL = `https://collectionapi.metmuseum.org/public/collection/v1/search?title=true&${metApiQuery}}`;

    console.log("met:", metApiURL);
    console.log("artic:", articApiURL);

    try {
      // Fetch data from both APIs concurrently
      const [articResponse, metResponse] = await Promise.all([
        fetch(articApiURL),
        fetch(metApiURL),
      ]);
      const articData = await articResponse.json();
      const metData = await metResponse.json();

      // If there are Met objects, fetch the first one to get its details
      let metObjectDetails = null;
      if (metData.objectIDs && metData.objectIDs.length > 0) {
        const metObjectDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${metData.objectIDs[0]}`;
        const metObjectResponse = await fetch(metObjectDetailsUrl);
        metObjectDetails = await metObjectResponse.json();
      }

      // Combine and interleave the results
      const combinedArtworks = [];
      for (
        let i = 0;
        i < Math.max(articData.data.length, metObjectDetails ? 1 : 0);
        i++
      ) {
        if (articData.data[i]) {
          combinedArtworks.push({ source: "artic", data: articData.data[i] });
        }
        if (i === 0 && metObjectDetails) {
          combinedArtworks.push({ source: "met", data: metObjectDetails });
        }
      }

      setArtworks(combinedArtworks); // Set the combined results
      console.log("Art details fetched:", articData, metData);
    } catch (error) {
      console.error("Error fetching art details:", error);
      setArtworks("Failed to fetch art details");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if input has at least 5 words
    const words = inputValue.trim().split(/\s+/);
    if (words.length < 5) {
      alert("Please enter at least 5 words for the search.");
      return;
    }

    // const prompt = `what is the painting of ${inputValue}? The answers should have the name of the art piece, the artist, the date in which it is displayed. Return only json, do not write normal text. Give from 3 to 5 answers.`;

    const prompt = `what is this ${artType}: ${inputValue}?`;

    try {
      console.log(prompt);
      const response = await fetch("/api/gpt", {
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
              <span className="">
                What is this
                <select
                  onChange={(e) => setArtType(e.target.value)}
                  className="mx-2 rounded"
                  value={artType}
                >
                  <option>painting</option>
                  <option>sculpture</option>
                </select>
                :
              </span>
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
