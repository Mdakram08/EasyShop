// Import React hooks
import React, { useEffect, useState } from "react";

// Import CSS file
import "../componentsStyling/ImageSlider.css"

// Array containing image paths
// Images should be stored inside public/images folder
const images = [
  "/download.jpg",
  "/b.jpg",
  "/c.jpg",
  "/b3.jpg"
];

function ImageSlider() {

  // currentIndex stores which image is currently visible
  // Starts from 0 (first image)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {

    // Runs every 2 seconds
    const interval = setInterval(() => {

      // Move to next image
      // If last image is reached, go back to first image
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % images.length
      );

    }, 3000);

    // Cleanup function
    // Removes timer when component unmounts
    return () => clearInterval(interval);

  }, []);

  return (
    <div className="image-slider">

      {/* Slider Track */}
      <div
        className="slider-images"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {/* Loop through all images */}
        {images.map((image, index) => (
          <div
            className="slider-item"
            key={index}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${
              currentIndex === index ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

    </div>
  );
}

export default ImageSlider;