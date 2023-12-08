import React, { useEffect, useState } from "react";
import { CirclePicker, SketchPicker, SwatchesPicker } from "react-color";
import Loader from "./Loader";
import Select from "react-select";
import { Listbox } from "@headlessui/react";
import { Fragment } from "react";
import { Check, ChevronDown } from "lucide-react";

function SearchForm({
  onSubmit,
  inputValue = { subject: "", colors: "", style: "", location: "" },
  handleInputChange,
  artType,
  setArtType,
  styles = {},
  loading,
  errorMessage
}) {
  const defaultLayoutStyles = {
    formClass: "w-full",
    inputContainerClass: "flex flex-col",
    labelClass: "text-zinc-50 text-base leading-4 mt-7",
    inputClass:
      "text-neutral-400 text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none max-w-[500px] w-full",
    buttonContainerClass: "md:col-span-2 flex justify-center md:justify-end",
    buttonClass:
      "text-zinc-50 bg-[#DF9D51] w-[200px] mt-10 p-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300",
  };
  const layoutStyles = { ...defaultLayoutStyles, ...styles };

  const popularArtStyles = [
    "Impressionism",
    "Surrealism",
    "Abstract Expressionism",
    "Cubism",
    "Realism",
    "Baroque",
    "Renaissance",
    "Neo-Classicism",
    "Romanticism",
    "Art Nouveau",
    "Art Deco",
    "Pop Art",
    "Gothic",
    "Minimalism",
    "Fauvism",
  ];

  const artLocations = [
    "Museums",
    "Art Galleries",
    "Public Parks",
    "Historical Sites",
    "Cultural Events",
    "Theaters",
    "Libraries",
    "Places of Worship",
    "Educational Institutions",
    "Government Buildings",
    "Outdoor Murals and Street Art",
    "Online Art Platforms",
    "Community Art Centers",
    "Festivals and Fairs",
    "Commercial Spaces",
  ];

  // Convert popularArtStyles to format required by react-select
  const artStyleOptions = popularArtStyles.map((style) => ({
    value: style,
    label: style,
  }));

  // Custom function to handle art style change
  const handleArtStyleChange = (selectedOption) => {
    handleInputChange({
      target: { name: "style", value: selectedOption.value },
    });
  };

  // Convert artLocations to format required by Listbox
  const locationOptions = artLocations.map((location) => ({
    value: location,
    label: location,
  }));

  const [circlePickerWidth, setCirclePickerWidth] = useState("100%"); // Default width

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth > 500 ? 460 : window.innerWidth - 40; // Adjust this logic as needed
      setCirclePickerWidth(width);
    };

    window.addEventListener("resize", updateWidth);

    // Set width on initial render
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <>
      <form
        id="searchform"
        onSubmit={onSubmit}
        className={layoutStyles.formClass}
      >
        <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="subject" className={layoutStyles.labelClass}>
            🧑‍🎨 Subject or Action:
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={inputValue.subject}
            onChange={handleInputChange}
            className={layoutStyles.inputClass}
            placeholder="a woman in black looking at me with a smile ..."
          />
        </div>
        <div className={`${layoutStyles.inputContainerClass} w-full`}>
          <label htmlFor="colors" className={layoutStyles.labelClass}>
            🎨 Main Color Palette:
          </label>
          <div className="w-full">
            <CirclePicker
              id="colors"
              name="colors"
              value={inputValue.colors}
              onChange={handleInputChange}
              className="mt-4 flex justify-center items-center"
              width={"100%"}
              circleSpacing={14}
              circleSize={28}
              // styles={{display: "flex", justifyContent: "center", alignItems: "center"}}
              colors={[
                "#FF0000", // Bright Red
                "#FFA500", // Orange
                "#FFFF00", // Bright Yellow
                "#9ACD32", // Yellow-Green
                "#008000", // Green
                "#00FFFF", // Cyan
                "#0000FF", // Bright Blue
                "#4B0082", // Indigo
                "#EE82EE", // Bright Purple
                "#FFC0CB", // Pink
                "#C0C0C0", // Silver
                "#000000", // Black
                "#800000", // Maroon
                "#808000", // Olive
                "#008080", // Teal
                "#800080", // Purple
                "#FF4500", // Orange Red
                "#2E8B57", // Sea Green
                "#DAA520", // Golden Rod
                "#D2691E", // Chocolate
                "#CD5C5C", // Indian Red
                "#20B2AA", // Light Sea Green
                "#4682B4", // Steel Blue
                "#6A5ACD", // Slate Blue
              ]}
            />
          </div>
        </div>
        {/* <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="style" className={layoutStyles.labelClass}>
            Art Style:
          </label>
          <input
            type="text"
            id="style"
            name="style"
            value={inputValue.style}
            onChange={handleInputChange}
            className={layoutStyles.inputClass}
            placeholder="renaissance, surrealism, oil painting, etc."
          />
        </div> */}
        {/* <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="style" className={layoutStyles.labelClass}>
            Art Style:
          </label>
          <Select
            id="style"
            name="style"
            value={artStyleOptions.find(
              (option) => option.value === inputValue.style
            )}
            onChange={handleArtStyleChange}
            options={artStyleOptions}
            className={{
            }}
            placeholder="select or search an art style"
            isSearchable
          />
        </div> */}

        <div className={layoutStyles.inputContainerClass}>
          <Listbox
            value={inputValue.style}
            onChange={(value) =>
              handleInputChange({ target: { name: "style", value } })
            }
          >
            {({ open }) => (
              <Fragment>
                <Listbox.Label className={layoutStyles.labelClass}>
                  🖌️ Art Style:
                </Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button
                    className={
                      inputValue.style
                        ? `text-black text-start w-full text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none`
                        : `text-neutral-400 text-start w-full text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none`
                    }
                  >
                    {inputValue.style || "select an art style"}
                    <span className="absolute right-4 pointer-events-none">
                      <ChevronDown
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-32 md:max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {popularArtStyles.map((style, styleIdx) => (
                      <Listbox.Option
                        key={styleIdx}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-4 ${
                            active
                              ? "text-amber-900 bg-amber-100 font-extrabold"
                              : "text-gray-600"
                          }`
                        }
                        value={style}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {style}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Fragment>
            )}
          </Listbox>
        </div>

        <div className={layoutStyles.inputContainerClass}>
          <Listbox
            value={inputValue.location}
            onChange={(value) =>
              handleInputChange({ target: { name: "location", value } })
            }
          >
            {({ open }) => (
              <Fragment>
                <Listbox.Label className={layoutStyles.labelClass}>
                  📍 Seen it Here:
                </Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button
                    className={
                      inputValue.location
                        ? "text-black text-start w-full text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none"
                        : "text-neutral-400 text-start w-full text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none"
                    }
                  >
                    {inputValue.location || "Select a location"}
                    <span className="absolute right-4 pointer-events-none">
                      <ChevronDown
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white shadow-lg max-h-32 md:max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {locationOptions.map((location, locationIdx) => (
                      <Listbox.Option
                        key={locationIdx}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-4 ${
                            active
                              ? "text-amber-900 bg-amber-100 font-extrabold"
                              : "text-gray-600"
                          }`
                        }
                        value={location.value}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {location.label}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Fragment>
            )}
          </Listbox>
        </div>
      </form>
      <div className={layoutStyles.buttonContainerClass}>
        {loading ? (
          <button className={"h-fit" + layoutStyles.buttonClass}>
            <Loader />
          </button>
        ) : (
          <button
            onSubmit={onSubmit}
            type="submit"
            form="searchform"
            className={layoutStyles.buttonClass}
          >
            find that art 🤖
          </button>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 md:text-center text-justify">
            {errorMessage}
          </p> // Styling for error message
        )}
      </div>
    </>
  );
}

export default SearchForm;
