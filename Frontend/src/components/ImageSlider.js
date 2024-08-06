import React from "react";
import { ReactComponent as PreviousImageIcon } from "../assets/previousImageIcon.svg";
import { ReactComponent as NextImageIcon } from "../assets/nextImageIcon.svg";

function ImageSlider({ images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const thumbnailRefs = React.useRef([]);

  const handlePreviousClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  React.useEffect(() => {
    if (thumbnailRefs.current[currentImageIndex]) {
      thumbnailRefs.current[currentImageIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentImageIndex]);

  return (
    <div className="flex">
      <div className="flex flex-col mr-4 h-80 md:h-96 lg:h-128 xl:h-160 overflow-y-auto hide-scrollbar">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imageUrl}
            alt={`Thumbnail ${index + 1}`}
            className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain mb-2 cursor-pointer ${
              currentImageIndex === index ? "border-2 border-black" : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
            ref={(el) => (thumbnailRefs.current[index] = el)}
          />
        ))}
      </div>
      <div className="relative flex flex-row items-center">
        {images.length > 1 && (
          <PreviousImageIcon
            className="absolute left-0 cursor-pointer z-10"
            onClick={handlePreviousClick}
          />
        )}
        <img
          src={images[currentImageIndex].imageUrl}
          alt="Main"
          className="w-80 h-80 md:w-96 md:h-96 lg:w-128 lg:h-128 xl:w-160 xl:h-160 object-contain mx-auto"
        />
        {images.length > 1 && (
          <NextImageIcon
            className="absolute right-0 cursor-pointer z-10"
            onClick={handleNextClick}
          />
        )}
      </div>
    </div>
  );
}

export default ImageSlider;
