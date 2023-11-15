import OpenAI from "openai";
import React, { useEffect, useState } from "react";
import ArtCard from "./ArtCard";

function Search({}) {
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    styleOrEmotion: "",
    location: "",
  });
  const [outputValue, setOutputValue] = useState("");
  const [artworks, setArtworks] = useState(null);
  const [artType, setArtType] = useState("painting");

  // Function to call both Art Institute and Met Museum APIs
  const fetchArtworks = async (artPieces) => {
    let combinedArtworks = [];

    for (const artPiece of artPieces) {
      // const articQuery = `q=${encodeURIComponent(
      //   artPiece.artPieceName
      // )}&q=${encodeURIComponent(artPiece.artist)}`;
      const articQuery = `q=${encodeURIComponent(artPiece.artPieceName)}`;
      const articApiURL = `https://api.artic.edu/api/v1/artworks/search?${articQuery}&fields=id,title,artist_display,date_display,image_id,artist_title&limit=5`;

      // const metApiQuery = `title=true&q=${encodeURIComponent(
      //   artPiece.artPieceName
      // )}&artistOrCulture=true&hasImages=true`;
      const metApiQuery = `title=true&q=${encodeURIComponent(
        artPiece.artPieceName
      )}`;
      const metApiURL = `https://collectionapi.metmuseum.org/public/collection/v1/search?${metApiQuery}`;

      console.log("Met API URL:", metApiURL);
      console.log("Artic API URL:", articApiURL);

      try {
        // Fetch data from both APIs concurrently
        const [articResponse, metResponse] = await Promise.all([
          fetch(articApiURL),
          fetch(metApiURL),
        ]);
        const articData = await articResponse.json();
        const metData = await metResponse.json();
        console.log("Art details fetched:", articData, metData);

        // If there are Met objects, fetch the first one to get its details
        let metObjectDetails = null;
        if (metData.objectIDs && metData.objectIDs.length > 0) {
          const metObjectDetailsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${metData.objectIDs[0]}`;
          const metObjectResponse = await fetch(metObjectDetailsUrl);
          metObjectDetails = await metObjectResponse.json();
        }

        // Combine and interleave the results
        if (articData.data && articData.data.length > 0) {
          combinedArtworks = combinedArtworks.concat(
            articData.data.map((item) => {
              return { source: "artic", data: item };
            })
          );
        }
        if (metObjectDetails) {
          combinedArtworks.push({ source: "met", data: metObjectDetails });
        }
      } catch (error) {
        console.error(
          "Error fetching art details for",
          artPiece.artPieceName,
          error
        );
      }
    }

    console.log("Combined Artworks:", combinedArtworks);
    setArtworks(combinedArtworks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if input has at least 5 words
    if (inputValue.subject.trim().split(/\s+/).length < 5) {
      alert("Please enter at least 5 words for the subject.");
      return;
    }

    let prompt = `What is a ${artType} of a ${inputValue.subject}`;

    if (inputValue.colors.trim()) {
      prompt += ` with ${inputValue.colors} as main color(s)`;
    }
    if (inputValue.styleOrEmotion.trim()) {
      prompt += ` having ${inputValue.styleOrEmotion} as the main style or emotion`;
    }
    if (inputValue.location.trim()) {
      prompt += `. I saw it in ${inputValue.location}`;
    }
    prompt += ".";

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
        fetchArtworks(gptResponse);
      }
    } catch (error) {
      console.error("Failed to fetch from API:", error);
      setOutputValue("Failed to fetch");
    }
  };

  const handleInputChange = (event) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
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
            <div>
              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Subject:
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={inputValue.subject}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Subject and/or action (e.g., 'woman in a blue dress reaching for the sky')"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="colors"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Main Colors:
                </label>
                <input
                  id="colors"
                  name="colors"
                  type="text"
                  value={inputValue.colors}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Main Colors"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="styleOrEmotion"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Style or Emotion:
                </label>
                <input
                  id="styleOrEmotion"
                  name="styleOrEmotion"
                  type="text"
                  value={inputValue.styleOrEmotion}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Style or Emotion (e.g., 'Renaissance', 'joyful', 'abstract')"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Location:
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={inputValue.location}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Where You Saw It (e.g., 'museum', 'book', 'website')"
                />
              </div>
            </div>
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
