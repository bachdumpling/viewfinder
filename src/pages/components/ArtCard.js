import React from "react";

const ArtCard = ({ artworks }) => {
  // Function to construct image URL
  const getImageUrl = (imageId) => {
    return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {artworks && artworks.map((artwork, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          {artwork.image_id ? (
            <img
              src={getImageUrl(encodeURIComponent(artwork.image_id))}
              alt={`Artwork titled ${artwork.title}`}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
            <p className="text-gray-700 text-sm">
              Artist: {artwork.artist_display}
            </p>
            <p className="text-gray-600 text-xs">
              Date: {artwork.date_display}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtCard;
