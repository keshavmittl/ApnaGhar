import { useEffect, useState } from "react";
import "./slider.scss";

const Slider = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    // Reading from the previous value keeps the arrows correct even when several
    // clicks land in the same render.
    setImageIndex((prev) => {
      if (prev === null) return prev;

      if (direction === "left") {
        return prev === 0 ? images.length - 1 : prev - 1;
      }

      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (imageIndex === null) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setImageIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageIndex]);

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow">
            <button
              type="button"
              className="arrowButton"
              aria-label="Previous photo"
              onClick={() => changeSlide("left")}
            >
              <img src="/arrow.png" alt="" />
            </button>
          </div>
          <div className="imgContainer">
            <img
              src={images[imageIndex]}
              alt={`Property photo ${imageIndex + 1} of ${images.length}`}
            />
          </div>
          <div className="arrow">
            <button
              type="button"
              className="arrowButton"
              aria-label="Next photo"
              onClick={() => changeSlide("right")}
            >
              <img src="/arrow.png" alt="" className="right" />
            </button>
          </div>
          <button
            type="button"
            className="close"
            aria-label="Close photo viewer"
            onClick={() => setImageIndex(null)}
          >
            X
          </button>
        </div>
      )}
      <div className="bigImage">
        <button
          type="button"
          className="imageButton"
          aria-label="Open photo 1 in full screen"
          onClick={() => setImageIndex(0)}
        >
          <img src={images[0]} alt={`Property photo 1 of ${images.length}`} />
        </button>
      </div>
      <div className="smallImages">
        {images.slice(1).map((image, index) => (
          <button
            type="button"
            className="imageButton"
            key={index}
            aria-label={`Open photo ${index + 2} in full screen`}
            onClick={() => setImageIndex(index + 1)}
          >
            <img
              src={image}
              alt={`Property photo ${index + 2} of ${images.length}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
