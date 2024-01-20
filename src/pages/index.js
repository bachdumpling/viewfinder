import Image from "next/image";
import Search from "./components/Search";
import { useState } from "react";
import { useRouter } from "next/router";
import SearchForm from "./components/SearchForm";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    style: "",
    location: "",
  });
  const [loading, setLoading] = useState(false); // State to track loading
  const [artType, setArtType] = useState("painting");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ... validation and GPT API call ...
    // Check if input has at least 5 words
    // if (inputValue.subject.trim().split(/\s+/).length < 5) {
    //   alert("Please enter at least 5 words for the subject.");
    //   return;
    // }
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
      console.log(prompt);
      console.log(JSON.stringify(prompt));
      console.log({ inputValue: prompt });

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
      const dalleImageUrl = data.dalleImageUrl || "";
      console.log(gptResponse);

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
      setLoading(false); // Stop loading on error
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
    <main className="relative min-h-screen min-w-[375px] w-screen overflow-x-hidden">
      {/* <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script> */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed z-0 w-full h-full object-cover"
        style={{ top: 0, left: 0 }}
      >
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="z-20 grid bg-black bg-opacity-50 w-full min-h-screen p-4 md:p-8 absolute">
        <h1 className="flex justify-center items-center text-3xl md:text-5xl text-zinc-50 font-bold text-center my-10">
          <Link href="/">Viewfinder</Link>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-1ustify-center items-center md:mb-0 mb-20">
          <div className="flex flex-col justify-center items-center space-y-4 md:space-y-6">
            <h2 className="text-xl text-zinc-50 md:text-3xl flex justify-center">
              <span>Find the</span>
              <select
                id="artType"
                name="artType"
                value={artType}
                onChange={(e) => setArtType(e.target.value)}
                className="text-neutral-400 bg-zinc-50 text-base md:text-xl shadow-sm py-1 px-3 ml-4 focus:outline-none focus:border-none rounded-none border-none outline-none"
              >
                <option value="painting">&#128444;&#65039; Painting</option>
                <option value="sculpture">🗿 Sculpture</option>
              </select>
            </h2>
            <h3 className="text-justify px-4 md:px-10 leading-relaxed text-zinc-50">
              {generatePrompt().length > 0
                ? generatePrompt()
                : "Enter details to start your search"}
            </h3>
          </div>
          <div className="flex flex-col justify-center items-center p-4">
            <SearchForm
              loading={loading}
              onSubmit={handleSubmit}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              artType={artType}
              setArtType={setArtType}
              errorMessage={errorMessage}
              styles={{
                inputClass:
                  "text-black text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none rounded-none",
                labelClass:
                  "text-zinc-50  text-base md:text-lg leading-6 mt-4 md:mt-8",
                buttonContainerClass: "w-full",
                buttonClass:
                  "text-zinc-50 bg-[#DF9D51] w-full mt-6 md:mt-10 p-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300 text-base md:text-lg",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
