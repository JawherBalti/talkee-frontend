import React from 'react';

function LoadingSmall(props) {
  return (
    <div className="loading-logo">
      <svg width={props.width} height={props.height} viewBox="0 0 40 50">
        <polygon
          stroke="#fff"
          strokeWidth="5"
          fill="none"
          points="20,1 40,40 1,40"
        />
        <text fill="#000" x="5" y="47">
          {props.text}
        </text>
      </svg>
    </div>
  );
}

export default LoadingSmall;
