import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-root">
      <div className="loader-bg" />
      <div className="loader-glow" />
      <div className="loader-core glass-strong scale-in">
        <div className="loader-orbit">
          <div className="loader-planet" />
          <div className="loader-orbit-ring" />
        </div>
        <div className="loader-text">
          <span className="brand">IQ</span>
          <span className="brand-sub">Didactic</span>
        </div>
        <div className="loader-progress">
          <div className="loader-bar" />
        </div>
        <p className="loader-caption">Designing your learning universe...</p>
      </div>
    </div>
  );
};

export default Loader;