import React from "react";
import { ReactComponent as PreviousImageIcon } from "../assets/previousImageIcon.svg";
import { ReactComponent as NextImageIcon } from "../assets/nextImageIcon.svg";

class ImageSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: 0,
    };
    this.thumbnailRefs = [];
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  handlePreviousClick() {
    this.setState((prevState) => ({
      currentImageIndex:
        prevState.currentImageIndex === 0
          ? this.props.images.length - 1
          : prevState.currentImageIndex - 1,
    }));
  }

  handleNextClick() {
    this.setState((prevState) => ({
      currentImageIndex:
        prevState.currentImageIndex === this.props.images.length - 1
          ? 0
          : prevState.currentImageIndex + 1,
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentImageIndex !== this.state.currentImageIndex &&
      this.thumbnailRefs[this.state.currentImageIndex]
    ) {
      this.thumbnailRefs[this.state.currentImageIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }

  render() {
    const { images = [] } = this.props;
    const { currentImageIndex } = this.state;

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
              onClick={() => this.setState({ currentImageIndex: index })}
              ref={(el) => (this.thumbnailRefs[index] = el)}
            />
          ))}
        </div>
        <div className="relative flex flex-row items-center">
          {images.length > 1 && (
            <PreviousImageIcon
              className="absolute left-0 cursor-pointer z-10"
              onClick={this.handlePreviousClick}
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
              onClick={this.handleNextClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ImageSlider;
