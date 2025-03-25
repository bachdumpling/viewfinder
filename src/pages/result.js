// src/pages/results.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArtCard from "./components/ArtCard";
import SearchForm from "./components/SearchForm";
import Link from "next/link";
import Footer from "./components/Footer";
import SearchContainer from "./components/SearchContainer";

const Result = () => {
  const [artworks, setArtworks] = useState(null);
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    style: "",
    location: "",
  });
  const [dalleImage, setDalleImage] = useState(null); // State for DALL·E image
  const [artType, setArtType] = useState("painting");
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to track loading
  const [errorMessage, setErrorMessage] = useState("");
  const [gptArtworks, setGptArtworks] = useState([]);
  // console.log("GPT Artworks:", gptArtworks);

  const {
    data,
    subject,
    colors,
    style,
    location,
    artType: queryArtType,
    dalleImageUrl,
  } = router.query;

  useEffect(() => {
    if (data) {
      const gptResponse = JSON.parse(data);
      setGptArtworks(gptResponse);
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

    if (dalleImageUrl) {
      setDalleImage(dalleImageUrl); // Set the DALL·E image URL
    }
  }, [data, subject, colors, style, location, queryArtType, dalleImageUrl]);

  // Function to call both Art Institute and Met Museum APIs
  const fetchArtworks = async (artPieces) => {
    let combinedArtworks = [];
    if (dalleImageUrl) {
      // Add the DALL·E generated image as a new artwork object
      combinedArtworks.push({
        source: "dalle",
        data: {
          image_id: null, // No image ID since it's not from Art Institute or Met Museum
          primaryImage: dalleImageUrl, // Use the DALL·E image URL
          title: `Generated Artwork Inspired by ${artPieces[0].artPieceName}}`,
          artist_display: "AI Generated",
          date_display: "Contemporary",
        },
      });
    }

    for (const artPiece of artPieces) {
      const articQuery = `q=${encodeURIComponent(artPiece.artPieceName)}`;
      const articApiURL = `https://api.artic.edu/api/v1/artworks/search?${articQuery}&fields=id,title,artist_display,date_display,image_id,artist_title&limit=5`;

      const metApiQuery = `title=true&q=${encodeURIComponent(
        artPiece.artPieceName
      )}`;
      const metApiURL = `https://collectionapi.metmuseum.org/public/collection/v1/search?${metApiQuery}`;

      // console.log("Met API URL:", metApiURL);
      // console.log("Artic API URL:", articApiURL);

      try {
        // Fetch data from both APIs concurrently
        const [articResponse, metResponse] = await Promise.all([
          fetch(articApiURL),
          fetch(metApiURL),
        ]);
        const articData = await articResponse.json();
        const metData = await metResponse.json();
        // console.log("Art details fetched:", articData, metData);

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

    // console.log("Combined Artworks:", combinedArtworks);
    setArtworks(combinedArtworks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ... validation and GPT API call ...
    // Check if input has at least 5 words
    if (inputValue.subject.trim().split(/\s+/).length < 5) {
      setErrorMessage("Please enter at least 5 words for the subject.");
      return;
    } else {
      setErrorMessage(""); // Clear error message if validation passes
    }

    setLoading(true); // Start loading

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
      // console.log(prompt);
      // console.log(JSON.stringify(prompt));
      // console.log({ inputValue: prompt });

      const response = await fetch(
        "https://ajxoej606i.execute-api.us-east-2.amazonaws.com/viewfinder-gpt-api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prompt),
        }
      );
      const data = await response.json();

      const gptResponse = JSON.parse(data.result[0].message.content);
      const dalleImageUrl = data.dalleImageUrl;
      // console.log(gptResponse);

      router.push({
        pathname: "/result",
        query: {
          data: JSON.stringify(gptResponse),
          subject: inputValue.subject,
          colors: inputValue.colors,
          style: inputValue.style,
          location: inputValue.location,
          artType: artType,
          dalleImageUrl: dalleImageUrl,
        },
      });
    } catch (error) {
      console.error("Failed to fetch from API:", error);
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };

  const handleInputChange = (event) => {
    if (event.hex) {
      setInputValue({ ...inputValue, colors: event.hex });
    } else {
      setInputValue({ ...inputValue, [event.target.name]: event.target.value });
    }
  };

  const generatePrompt = () => {
    let promptParts = [];
    const underlineClass = "underline decoration-wavy decoration-1";

    if (inputValue.subject) {
      promptParts.push(`I'm looking for a ${artType} of `);
      promptParts.push(
        <span key="subject" className={underlineClass}>
          {inputValue.subject}
        </span>
      );
      promptParts.push(`, `);
    }

    // Colors dictionary
    const colors = {
      "#FF0000": "Bright Red",
      "#FFA500": "Orange",
      "#FFFF00": "Bright Yellow",
      "#9ACD32": "Yellow-Green",
      "#008000": "Green",
      "#00FFFF": "Cyan",
      "#0000FF": "Bright Blue",
      "#4B0082": "Indigo",
      "#EE82EE": "Bright Purple",
      "#FFC0CB": "Pink",
      "#C0C0C0": "Silver",
      "#000000": "Black",
      "#800000": "Maroon",
      "#808000": "Olive",
      "#008080": "Teal",
      "#800080": "Purple",
      "#FF4500": "Orange Red",
      "#2E8B57": "Sea Green",
      "#DAA520": "Golden Rod",
      "#D2691E": "Chocolate",
      "#CD5C5C": "Indian Red",
      "#20B2AA": "Light Sea Green",
      "#4682B4": "Steel Blue",
      "#6A5ACD": "Slate Blue",
    };

    if (inputValue.colors) {
      promptParts.push(`with a color palette featuring `);
      promptParts.push(
        <span key="colors" className={underlineClass}>
          {/* get the value of the color dictionary with the inputValue.colors as key  */}
          {colors[inputValue.colors.toUpperCase()]}
        </span>
      );
      promptParts.push(`, `);
    }
    if (inputValue.style) {
      promptParts.push(`in the style of `);
      promptParts.push(
        <span key="style" className={underlineClass}>
          {inputValue.style}
        </span>
      );
      promptParts.push(`, `);
    }
    if (inputValue.location) {
      promptParts.push(`last seen in this location: `);
      promptParts.push(
        <span key="location" className={underlineClass}>
          {inputValue.location}
        </span>
      );
      promptParts.push(`.`);
    }

    // Combine the text elements and JSX elements into a single array
    // JSX elements will be rendered, and strings will be joined
    return promptParts.flatMap((part, index) => [
      part,
      index < promptParts.length - 1 ? "" : "",
    ]);
  };

  return (
    <main className="min-h-screen min-w-[375px] w-screen overflow-x-hidden">
      <div className="fixed top-0 w-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed z-0 w-full h-full object-cover brightness-50"
          style={{ top: 0, left: 0 }}
        >
          <source src="/assets/home.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <Link href="/">
        <h1 className="absolute top-10 right-0 left-0 flex justify-center items-center font-sans text-5xl md:text-5xl lg:text-9xl text-zinc-300 font-extrabold tracking-widest text-center mix-blend-difference isolation-auto">
          VIEWFINDER
        </h1>
      </Link>

      <SearchContainer
        absolute={true}
        result={true}
        exampleSearches={true}
        footer={true}
        loading={loading}
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        artType={artType}
        setArtType={setArtType}
        errorMessage={errorMessage}
        generatePrompt={generatePrompt}
        setInputValue={setInputValue}
        artworks={artworks}
        dalleImage={dalleImage}
        gptArtworks={gptArtworks}
      />
    </main>
  );
};

export default Result;
