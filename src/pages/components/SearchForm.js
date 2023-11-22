import React from "react";
import { CirclePicker, SketchPicker, SwatchesPicker } from "react-color";
import { newtonsCradle } from 'ldrs'

newtonsCradle.register()

function SearchForm({
  onSubmit,
  inputValue = { subject: "", colors: "", style: "", location: "" },
  handleInputChange,
  artType,
  setArtType,
  styles = {},
  loading,
}) {
  const defaultLayoutStyles = {
    formClass: "w-full",
    inputContainerClass: "flex flex-col",
    labelClass: "text-zinc-50 text-base leading-4 mt-7",
    inputClass:
      "text-neutral-400 text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none",
    buttonContainerClass: "md:col-span-2 flex justify-center md:justify-end",
    buttonClass:
      "text-zinc-50 bg-[#DF9D51] w-[200px] mt-10 p-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300",
  };
  const layoutStyles = { ...defaultLayoutStyles, ...styles };

  return (
    <>
      <form
        id="searchform"
        onSubmit={onSubmit}
        className={layoutStyles.formClass}
      >
        <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="subject" className={layoutStyles.labelClass}>
            Subject or Action:
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
        <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="colors" className={layoutStyles.labelClass}>
            Main Color Palette:
          </label>
          {/* <div className="bg-zinc-50"> */}
          <CirclePicker
            id="colors"
            name="colors"
            value={inputValue.colors}
            onChange={handleInputChange}
            className="mt-4 flex items-center justify-center"
            {...layoutStyles.inputClass}
            width={160}
            circleSpacing={12}
            circleSize={26}
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
            ]}
          />
          {/* </div> */}

          {/* <input
            type="text"
            id="colors"
            name="colors"
            value={inputValue.colors}
            onChange={handleInputChange}
            className={layoutStyles.inputClass}
            placeholder="grey, blue, etc."
          /> */}
        </div>
        <div className={layoutStyles.inputContainerClass}>
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
        </div>
        <div className={layoutStyles.inputContainerClass}>
          <label htmlFor="location" className={layoutStyles.labelClass}>
            Seen it Here:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={inputValue.location}
            onChange={handleInputChange}
            className={layoutStyles.inputClass}
            placeholder="museum, book, website, etc."
          />
        </div>
      </form>
      <div className={layoutStyles.buttonContainerClass}>
        {loading ? (
          <button className={"h-fit" + layoutStyles.buttonClass}>
            <l-newtons-cradle
              size="60"
              speed="1.4"
              color="white"
            ></l-newtons-cradle>
          </button>
        ) : (
          <button
            onSubmit={onSubmit}
            type="submit"
            form="searchform"
            className={layoutStyles.buttonClass}
          >
            Search
          </button>
        )}
      </div>
    </>
  );
}

export default SearchForm;
