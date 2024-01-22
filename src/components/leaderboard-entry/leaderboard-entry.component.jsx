// LeaderboardEntry.jsx

import React from 'react';
import './leaderboard-entry.styles.scss';

const LeaderboardEntry = ({ entry, position }) => {
  const { username, message, image, value, isNumberOne } = entry;
  const pos = position += 1;


  return (
    <div className='entry-container'>
      {(() => {
        switch (pos) {
          case 1:
            return (
              <div className='num'>
                <p>1</p>
              </div>
            );
          case 2:
            return (
              <div className='num'>
                <p>2</p>
              </div>
            );
          case 3:
            return (
              <div className='num'>
                <p>3</p>
              </div>
            );
          case 69:
            return (
              <div className='small-num'>
                <p>Nice</p>
              </div>
            );
          default:
            return (
              <div className='small-num'>
                <p>{pos}th</p>
              </div>
            );
        }
      })()}
      <div className='entry-content'>
        <div className='entry-username'>
            <p>{username}</p>
        </div>
        <div className='entry-message'>
            <p>{message}</p>
        </div>
        <div className='entry-image'>
            {image ? <img src={image} alt='image' /> : null}
        </div>
        <div className='entry-value'>
            <p>${value}</p>
        </div>
        {
            isNumberOne ? <p>Number 1 for 1 hour</p> : null
        }
      </div>
    </div>
  );
};

export default LeaderboardEntry;
