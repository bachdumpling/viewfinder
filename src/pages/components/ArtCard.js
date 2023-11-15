import React, { useEffect, useState } from "react";

const ArtCard = ({ artworks }) => {
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    artwork: null,
  });
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = (event, artwork) => {
    const timeout = setTimeout(() => {
      setTooltip({ show: true, x: event.clientX, y: event.clientY, artwork });
    }, 1000); // Delay of 2 seconds
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout); // Clear the timeout if mouse leaves before tooltip shows
    setTooltip({ ...tooltip, show: false });
  };

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
                onMouseEnter={(event) => handleMouseEnter(event, artwork)}
                onMouseLeave={handleMouseLeave}
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

      {tooltip.show && (
        <div
          style={{
            top: tooltip.y + 15,
            left: tooltip.x + 15,
            position: "fixed",
            zIndex: 50,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          }}
          className="text-black"
        >
          <h2 className="text-xl font-bold mb-2">{tooltip.artwork.title}</h2>
          <p>
            Artist:{" "}
            {tooltip.artwork.artist_display ||
              tooltip.artwork.artistDisplayName}
          </p>
          <p>
            Date: {tooltip.artwork.date_display || tooltip.artwork.objectDate}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtCard;
