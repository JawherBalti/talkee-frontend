import React from 'react';

function LoadingSmall(props) {
  return (
    <div className={`loading-small ${props.loadingClass}`}>
      <svg width={props.width} height={props.height} viewBox="0 0 40 50">
        <polygon
          stroke="#fff"
          strokeWidth="5"
          fill="none"
          points="20,1 40,40 1,40"
        />
        <text fill="#fff" x="5" y="47" fontSize="0.3rem">
          {props.text}
        </text>
      </svg>
    </div>
  );
}

export default LoadingSmall;
