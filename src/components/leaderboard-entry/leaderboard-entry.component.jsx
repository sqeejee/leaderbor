import React, { useEffect, useState } from 'react';
import './leaderboard-entry.styles.scss';
import { formatTimeDuration } from '../../utils/firebase/methods/formatTimeduration.utils';

const LeaderboardEntry = ({ entry, position }) => {
  const { username, message, image, value, isNumberOne } = entry;
  const pos = position + 1;

  const [displayedTimer, setDisplayedTimer] = useState(0);

  useEffect(() => {
    let isMounted = true;

    // Create an interval to update the displayed timer every second
    const intervalId = setInterval(() => {
      if (isMounted) {
        setDisplayedTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

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
        {isNumberOne && (
          <p>
            This post has been number one for{' '}
            {formatTimeDuration(displayedTimer)}.
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardEntry;
