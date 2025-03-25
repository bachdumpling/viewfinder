import { useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import SearchContainer from "./components/SearchContainer";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    style: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [artType, setArtType] = useState("painting");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.subject.trim().split(/\s+/).length < 5) {
      setErrorMessage("Please enter at least 5 words for the subject.");
      return;
    } else {
      setErrorMessage("");
    }

    setLoading(true);

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
      setLoading(false);
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

    return promptParts.flatMap((part, index) => [
      part,
      index < promptParts.length - 1 ? "" : "",
    ]);
  };

  return (
    <main className="grid place-items-center relative min-h-screen min-w-[375px] w-screen overflow-x-hidden">
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>

      <div className="fixed inset-0 w-full">
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
        <h1 className="absolute top-10 md:top-20 right-0 left-0 flex justify-center items-center font-sans text-5xl md:text-5xl lg:text-9xl text-zinc-300 font-extrabold tracking-widest text-center mix-blend-difference isolation-auto">
          VIEWFINDER
        </h1>
      </Link>

      <SearchContainer
        loading={loading}
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        artType={artType}
        setArtType={setArtType}
        errorMessage={errorMessage}
        generatePrompt={generatePrompt}
        setInputValue={setInputValue}
      />
    </main>
  );
}
