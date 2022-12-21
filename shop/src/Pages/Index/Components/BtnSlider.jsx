/* eslint-disable react/prop-types */
import React from 'react';

function BtnSlider({ direction, moveSlide }) {
  // console.log({ direction, moveSlide });
  return (
    <button type="button" className={direction === 'next' ? 'btn-slide next' : 'btn-slide prev'} onClick={moveSlide}>
      <i className={direction === 'next' ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-left'} />
    </button>
  );
}

export default BtnSlider;
