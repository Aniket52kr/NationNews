import React from 'react';

const Spinner = ({ loading }) => {
  if (!loading) return null; // Only show the spinner if loading is true
  return (
    <div className="text-center">
      <div className="spinner-border my-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
