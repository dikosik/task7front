import React from 'react';
import './style.css'

const UnsplashImages = ({ images }) => {
  return (
    <div>
      <div className="image-list">
        {images.map(image => (
          <img key={image.id} src={image.urls.small} alt={image.alt_description} />
        ))}
      </div>
    </div>
  );
};

export default UnsplashImages;
