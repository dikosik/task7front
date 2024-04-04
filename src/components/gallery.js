import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UnsplashImages from './unsplash';
import './style.css';


const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loadTime, setLoadTime] = useState(null);
  const [resources, setResources] = useState([]);
  const imageRefs = useRef([]);
  const [resourceTimings, setResourceTimings] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://api.unsplash.com/photos', {
          params: {
            client_id: 'K-br54yv9ElnR2i2vYt2CvIwgT-g0sSRlGeHV-ZH0F8',
            per_page: 30, 
          },
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images from Unsplash:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const imageRef = imageRefs.current.find((ref) => ref.id === entry.target.id);
          if (imageRef) {
            imageRef.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        }
      });
    });

    imageRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    const onLoad = () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setLoadTime(loadTime);
      const resources = performance.getEntriesByType('resource');
      setResources(resources);
    };

    window.addEventListener('load', onLoad);

    return () => {
      imageRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    const fetchResourceTimings = () => {
      const resources = performance.getEntriesByType('resource');
      setResourceTimings(resources);
    };

    fetchResourceTimings();

    // Обновляем информацию о времени загрузки ресурсов каждые 5 секунд
    const interval = setInterval(fetchResourceTimings, 5000);

    return () => clearInterval(interval);
  }, []);

  const generatePreloadLinks = () => {
    const preloadLinks = [];
    for (let i = 0; i < 5 && i < images.length; i++) {
      preloadLinks.push(<link key={i} rel="preload" as="image" href={images[i].urls.small} />);
    }
    return preloadLinks;
  };

  return (
    <div>
      <h1>Image Gallery</h1>
      <UnsplashImages images={images} />
      {generatePreloadLinks()}
      {loadTime && (
        <div>
          <h2>Performance Analysis</h2>
          <p>Load Time: {loadTime}ms</p>
          <h3>Resource Timing</h3>
          <ul>
            {resourceTimings.map((resource, index) => (
              <li key={index}>{resource.name} - {resource.duration}ms</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Gallery;
