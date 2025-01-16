import React from 'react';

const Spinner = () => {
  return (
    <div className="text-center">
      <div className="spinner-border my-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
