import React, { PropTypes } from 'react';

const Book = ({ message }) => (
  <div className="book">
    <h2>{message}</h2>
  </div>
);

Book.propTypes = {
  message: PropTypes.string,
};

export default Book;
