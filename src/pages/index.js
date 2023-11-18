import Image from "next/image";
import { Inter } from "next/font/google";
import Search from "./components/Search";
import { useState } from "react";
import { useRouter } from "next/router";
import SearchForm from "./components/SearchForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [inputValue, setInputValue] = useState({
    subject: "",
    colors: "",
    style: "",
    location: "",
  });
  const [artType, setArtType] = useState("painting");
  const router = useRouter();

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
        query: {
          data: JSON.stringify(gptResponse),
          subject: inputValue.subject,
          colors: inputValue.colors,
          style: inputValue.style,
          location: inputValue.location,
          artType: artType,
        },
      });
    } catch (error) {
      console.error("Failed to fetch from API:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
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
    if (inputValue.colors) {
      promptParts.push(`with a color palette featuring `);
      promptParts.push(
        <span key="colors" className={underlineClass}>
          {inputValue.colors}
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
    <main className="relative min-h-screen w-full">
      <h1 className="text-5xl w-full h-fit text-center absolute top-20 inset-0 z-30 font-semibold">
        viewfinder
      </h1>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-10 w-full h-full object-cover"
      >
        <source src="/assets/home.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-20 flex bg-black bg-opacity-40 w-screen h-screen p-16 gap-10">
        <div className="flex flex-col flex-1 justify-center items-center space-y-6">
          <h2 className="text-3xl flex justify-center">
            <span>Find the</span>
            <select
              id="artType"
              name="artType"
              value={artType}
              onChange={(e) => setArtType(e.target.value)}
              className="text-neutral-400 text-xl shadow-sm py-1 px-3 ml-4  focus:outline-none focus:border-none"
            >
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
            </select>
          </h2>
          <h3 className="text-justify px-10 leading-relaxed">
            {generatePrompt().length > 0
              ? generatePrompt()
              : "Enter details to start your search"}
          </h3>
        </div>

        <div className="flex flex-1 flex-col justify-center items-center">
          <SearchForm
            onSubmit={handleSubmit}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            artType={artType}
            setArtType={setArtType}
            styles={{
              buttonContainerClass: "w-full",
              buttonClass:
                "text-zinc-50 bg-[#DF9D51] w-full mt-10 px-5 py-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300",
            }}
          />
        </div>
      </div>
    </main>
  );
}
