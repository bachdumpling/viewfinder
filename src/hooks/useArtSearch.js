// src/hooks/useArtSearch.js
import { useRouter } from "next/router";

const useArtSearch = () => {
  const router = useRouter();

  const handleSearchSubmit = async (inputValue, artType) => {
    // ... validation and GPT API call ...
    if (inputValue.subject.trim().split(/\s+/).length < 5) {
      alert("Please enter at least 5 words for the subject.");
      return;
    }

    let prompt = `Find the ${artType} with these features. Subject or action: ${inputValue.subject}.`;
    // Add other parts of the prompt...

    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputValue: prompt }),
      });
      const data = await response.json();
      const gptResponse = JSON.parse(data.result[0].message.content);

      // Redirect to results page with query params
      router.push({
        pathname: "/results",
        query: {
          data: JSON.stringify(gptResponse),
          ...inputValue,
          artType,
        },
      });
    } catch (error) {
      console.error("Failed to fetch from API:", error);
    }
  };

  return { handleSearchSubmit };
};

export default useArtSearch;
