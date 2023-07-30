import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const ImageLightbox = ({ isOpen, onClose, imageBase64, imageCaption }) => {
  return isOpen ? (
    <Lightbox mainSrc={imageBase64} onCloseRequest={onClose} imageCaption={imageCaption} />
  ) : null;
};

export default ImageLightbox;