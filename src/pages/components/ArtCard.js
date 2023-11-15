import React, { useEffect, useState } from "react";

const ArtCard = ({ artworks }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const getArticImageUrl = (imageId) => {
    return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  };

  useEffect(() => {
    if (selectedArtwork) {
      console.log(selectedArtwork.title);
    }
  }, [selectedArtwork]); // This effect runs whenever selectedArtwork changes

  const handleImageClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  return (
    <div className="w-full mx-auto gap-10 columns-3 space-y-10">
      {artworks &&
        artworks.map((item, index) => {
          const artwork = item.data;

          // Check if the item has an image
          const hasImage =
            (item.source === "artic" && artwork.image_id) ||
            (item.source === "met" && artwork.primaryImage);

          if (!hasImage) return null;

          return (
            <div
              key={index}
              className="shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <div
                onClick={() => handleImageClick(artwork)}
                className="cursor-pointer overflow-hidden"
              >
                {item.source === "artic" && artwork.image_id && (
                  <img
                    src={getArticImageUrl(encodeURIComponent(artwork.image_id))}
                    alt={`Artwork titled ${artwork.title}`}
                    className="w-full h-auto object-contain"
                  />
                )}
                {item.source === "met" && artwork.primaryImage && (
                  <img
                    src={artwork.primaryImage}
                    alt={`Artwork titled ${artwork.title}`}
                    className="w-full h-auto object-contain"
                  />
                )}
              </div>
            </div>
          );
        })}

      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">{selectedArtwork.title}</h2>
            <p>
              Artist:{" "}
              {selectedArtwork.artist_display ||
                selectedArtwork.artistDisplayName}
            </p>
            <p>
              Date: {selectedArtwork.date_display || selectedArtwork.objectDate}
            </p>
            <button
              onClick={() => setSelectedArtwork(null)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtCard;
