import React, { useEffect, useState } from 'react';
import './leaderboard-entry.styles.scss';
import TopPost from '../top-post/top-post.component';


const LeaderboardEntry = ({ entry, position }) => {
  const { username, message, image, value, isNumberOne } = entry;
  const pos = position + 1;

  const [rerenderFlag, setRerenderFlag] = useState(false);

  useEffect(() => {
    // Create an interval to update the state every second
    const intervalId = setInterval(() => {
      setRerenderFlag((prevFlag) => !prevFlag);
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); 


  return (
    <div className='entry-container'>
      {(() => {
        switch (pos) {
          case 1:
            return (
              <TopPost post={entry} />
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
      {isNumberOne ? null :
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
      </div>
}
    </div>
  );
};

export default LeaderboardEntry;
