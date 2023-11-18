import React from "react";

function SearchForm({
  onSubmit,
  inputValue,
  handleInputChange,
  artType,
  setArtType,
  styles = {},
}) {
  const defaultLayoutStyles = {
    formClass: "w-full",
    inputContainerClass: "flex flex-col",
    labelClass: "text-zinc-50 text-base leading-4 mt-7",
    inputClass:
      "text-neutral-400 text-base leading-4 shadow-lg bg-zinc-50 mt-2 p-4 focus:outline-none focus:border-none",
    buttonContainerClass: "md:col-span-2 flex justify-center md:justify-end",
    buttonClass:
      "text-zinc-50 bg-[#DF9D51] w-[200px] mt-10 px-5 py-4 shadow-lg hover:bg-[#AE6818] transition-colors duration-300",
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
          <input
            type="text"
            id="colors"
            name="colors"
            value={inputValue.colors}
            onChange={handleInputChange}
            className={layoutStyles.inputClass}
            placeholder="grey, blue, etc."
          />
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
        <button
          onSubmit={onSubmit}
          type="submit"
          form="searchform"
          className={layoutStyles.buttonClass}
        >
          Search
        </button>
      </div>
    </>
  );
}

export default SearchForm;
