import React from "react";

const ArtCard = ({ artworks }) => {
  // Function to construct image URL for Art Institute of Chicago
  const getArticImageUrl = (imageId) => {
    return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {artworks &&
        artworks.map((item, index) => {
          const artwork = item.data;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {item.source === "artic" && artwork.image_id ? (
                <img
                  src={getArticImageUrl(encodeURIComponent(artwork.image_id))}
                  alt={`Artwork titled ${artwork.title}`}
                  className="w-full h-auto object-contain"
                />
              ) : item.source === "met" && artwork.primaryImage ? (
                <img
                  src={artwork.primaryImage}
                  alt={`Artwork titled ${artwork.title}`}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="bg-gray-100 h-64 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-gray-700 font-semibold text-lg mb-2">{artwork.title}</h3>
                <p className="text-gray-700 text-sm">
                  Artist:{" "}
                  {item.source === "artic"
                    ? artwork.artist_display
                    : artwork.artistDisplayName}
                </p>
                <p className="text-gray-600 text-xs">
                  Date:{" "}
                  {item.source === "artic"
                    ? artwork.date_display
                    : artwork.objectDate}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ArtCard;
