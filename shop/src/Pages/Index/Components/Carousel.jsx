/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { v4 as uuidv4 } from 'uuid';
import { MY_HOST } from '../../../my-config';
import BtnSlider from './BtnSlider';

function Carousel() {
  const carouselItem = [
    {
      id: uuidv4(),
      img: 'images/cat1-feed2_1.png',
    },
    {
      id: uuidv4(),
      img: 'images/cat1-snack3_1.png',
    },
    {
      id: uuidv4(),
      img: 'images/dog-can2.png',
    },
  ];
  const [slideIndex, setSlideIndex] = useState(1);

  const nextSlide = () => {
    if (slideIndex !== carouselItem.length) {
      setSlideIndex(slideIndex + 1);
    } else if (slideIndex === carouselItem.length) {
      setSlideIndex(1);
    }
  };

  const prevSlide = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
    } else if (slideIndex === 1) {
      setSlideIndex(carouselItem.length);
    }
  };

  const moveDot = (index) => {
    setSlideIndex(index);
  };

  return (
    <div className="container-slider">
      {carouselItem.map((obj, index) => (
        <div key={obj.id} className={slideIndex === index + 1 ? 'slide active-anim' : 'slide'}>
          <img src={`${MY_HOST}/${obj.img}`} alt="product" />
        </div>
      ))}
      <BtnSlider moveSlide={nextSlide} direction="next" />
      <BtnSlider moveSlide={prevSlide} direction="prev" />
      <div className="container-dots">
        {Array.from({ length: 3 }).map((item, index) => (
          <div role="presentation" className={slideIndex === index + 1 ? 'dot active' : 'dot cursor-pointer'} onClick={() => moveDot(index + 1)} />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
