import Link from "next/link";
import SearchForm from "./SearchForm";
import Footer from "./Footer";
import ArtCard from "./ArtCard";
export default function SearchContainer({
  absolute = false,
  loading,
  handleSubmit,
  inputValue,
  handleInputChange,
  artType,
  setArtType,
  errorMessage,
  generatePrompt,
  setInputValue,
  footer = true,
  exampleSearches = true,
  result = false,
  artworks = null,
  dalleImage = null,
  gptArtworks = [],
}) {
  return (
    <>
      <div
        className={`z-20 w-full px-4 md:px-10 md:pt-20 mt-10 ${
          absolute ? "absolute" : ""
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-center items-center my-20 md:p-10">
          <div className="col-span-1 w-full flex flex-col justify-center items-center space-y-4 md:space-y-6 mb-10 md:mb-0">
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
            <h3 className="text-center leading-relaxed text-zinc-50 w-full">
              {typeof generatePrompt === "function"
                ? generatePrompt().length > 0
                  ? generatePrompt()
                  : "Enter details to start your search"
                : "Enter details to start your search"}
            </h3>
          </div>
          <div className="col-span-2 flex flex-col justify-center items-center lg:ml-20">
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

            {exampleSearches && (
              <div className="mt-8 w-full">
                <h3 className="text-zinc-50 text-lg mb-4">
                  Try these examples:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Example 1 */}
                  <button
                    onClick={() => {
                      setInputValue({
                        subject:
                          "a dramatic scene of the Virgin Mary ascending to heaven surrounded by cherubs and angels in flowing robes with golden light streaming from above",
                        colors: "#DAA520",
                        style: "Baroque",
                        location: "Museums",
                      });
                      setArtType("painting");
                    }}
                    className="bg-zinc-50 bg-opacity-10 hover:bg-opacity-20 p-4 rounded transition-all duration-300"
                  >
                    <h4 className="text-zinc-50 font-semibold mb-2">
                      The Assumption of the Virgin
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      The Virgin Mary flies to the sky
                    </p>
                  </button>

                  {/* Example 2 */}
                  <button
                    onClick={() => {
                      setInputValue({
                        subject:
                          "a couple standing in a farm field with a pitchfork looking straight ahead serious faces",
                        colors: "#000000",
                        style: "Realism",
                        location: "Art Galleries",
                      });
                      setArtType("painting");
                    }}
                    className="bg-zinc-50 bg-opacity-10 hover:bg-opacity-20 p-4 rounded transition-all duration-300"
                  >
                    <h4 className="text-zinc-50 font-semibold mb-2">
                      American Gothic
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      A farmer couple with a pitchfork
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* footer */}
        {footer && (
          <div className="mb-10 md:mt-10 pb-1">
            <Footer />
          </div>
        )}
        {/* Results Section */}
        {result && (
          <div className="z-10 pt-2 md:pt-6 md:mt-10 bg-[#FFFFF0] w-full">
            {gptArtworks.length > 0 && (
              <div className="px-4 md:px-10">
                <h2 className="text-3xl text-black font-bold my-10">
                  Possible Artworks:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gptArtworks.map((artwork, index) => (
                    <div
                      key={index}
                      className="p-6 shadow-lg text-zinc-50 bg-[#556B2F]"
                    >
                      <h3 className="">
                        <strong>Artwork:</strong> {artwork.artPieceName}
                      </h3>
                      <p>
                        <strong>Artist:</strong> {artwork.artist}
                      </p>
                      <p>
                        <strong>Medium:</strong> {artwork.medium}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {artworks && (
              <div className="px-4 md:px-10">
                <h2 className="text-3xl text-black font-bold my-10">Images:</h2>
                <ArtCard artworks={artworks} dalleImage={dalleImage} />
              </div>
            )}

            {footer && (
              <div className="mb-10 md:mt-10 pb-1">
                <Footer textColor="text-black" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
