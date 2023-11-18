// src/pages/results.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArtCard from "./components/ArtCard";
import SearchForm from "./components/SearchForm";
import Link from "next/link";

const Result = () => {
  const [artworks, setArtworks] = useState(null);
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    style: "",
    location: "",
  });

  const [artType, setArtType] = useState("painting");
  const router = useRouter();

  const {
    data,
    subject,
    colors,
    style,
    location,
    artType: queryArtType,
  } = router.query;

  useEffect(() => {
    if (data) {
      const gptResponse = JSON.parse(data);
      fetchArtworks(gptResponse);
    }

    // Pre-populate the form with the initial search input
    setInputValue({
      subject: subject || "",
      colors: colors || "",
      style: style || "",
      location: location || "",
    });

    if (queryArtType) {
      setArtType(queryArtType);
    }
  }, [data, subject, colors, style, location, queryArtType]);

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
    // ... validation and GPT API call ...
    // Check if input has at least 5 words
    if (inputValue.subject.trim().split(/\s+/).length < 5) {
      alert("Please enter at least 5 words for the subject.");
      return;
    }

    let prompt = `Find the ${artType} with these features. Subject or action: ${inputValue.subject}.`;

    if (inputValue.colors.trim()) {
      prompt += ` Main colors: ${inputValue.colors}.`;
    }
    if (inputValue.style.trim()) {
      prompt += ` Art style: ${inputValue.style}.`;
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

      // Assuming gptResponse is the data to be sent to the results page
      router.push({
        pathname: "/result",
        query: { data: JSON.stringify(gptResponse) }, // pass data as query param
      });
    } catch (error) {
      console.error("Failed to fetch from API:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
  };

  return (
    <div className="bg-zinc-100 min-h-screen w-full mx-auto p-6">
      <h1 className="text-5xl w-full h-fit text-center font-semibold text-black pt-16 pb-20">
        <Link href="/">viewfinder</Link>
      </h1>
      <SearchForm
        onSubmit={handleSubmit}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        artType={artType}
        setArtType={setArtType}
        styles={{
          formClass: "w-full grid grid-flow-row gap-4 grid-rows-1 grid-cols-4",
          inputContainerClass: "flex flex-col bg-white",
          labelClass: "text-neutral-400 text-base leading-4 pt-4 px-4",
          inputClass:
            "text-black text-base leading-4 p-4 focus:outline-none focus:border-none h-14 w-full inline-block",
          buttonContainerClass: "flex justify-end",
          buttonClass:
            "text-zinc-50 bg-[#DF9D51] w-[200px] mt-10 px-5 py-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300",
        }}
      />

      {artworks && (
        <div>
          <h2 className="text-3xl text-black font-bold my-6">Art Details:</h2>
          <ArtCard artworks={artworks} />
        </div>
      )}
    </div>
  );
};

export default Result;
