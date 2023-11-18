import OpenAI from "openai";
import React, { useEffect, useState } from "react";
import ArtCard from "./ArtCard";
import SearchForm from "./SearchForm";
import OutputCard from "./OutputCard";

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
      const articQuery = `q=${encodeURIComponent(artPiece.artPieceName)}`;
      const articApiURL = `https://api.artic.edu/api/v1/artworks/search?${articQuery}&fields=id,title,artist_display,date_display,image_id,artist_title&limit=5`;

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

    let prompt = `Find the ${artType} with these features. Subject or action: ${inputValue.subject}.`;

    if (inputValue.colors.trim()) {
      prompt += ` Main colors: ${inputValue.colors}.`;
    }
    if (inputValue.styleOrEmotion.trim()) {
      prompt += ` Art style: ${inputValue.styleOrEmotion}.`;
    }
    if (inputValue.location.trim()) {
      prompt += `. Witness at this place: ${inputValue.location}.`;
    }

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
    <div className="p-5 min-h-screen w-full mx-auto">
      <div className="">
        <SearchForm
          onSubmit={handleSubmit}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          artType={artType}
          setArtType={setArtType}
        />

        {outputValue && <OutputCard outputValue={outputValue} />}
        {artworks && (
          <div className="mt-6">
            <h2 className="text-xl text-black font-bold mb-2">Art Details:</h2>
            <div className="">
              <ArtCard artworks={artworks} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Search;
