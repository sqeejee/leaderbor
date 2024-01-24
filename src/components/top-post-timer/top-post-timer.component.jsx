import { useEffect, useState } from 'react';
import { onSnapshot, collection, getFirestore } from 'firebase/firestore';
import { formatTimeDuration } from '../../utils/firebase/methods/formatTimeduration.utils';
import { getTopPosts } from '../../utils/firebase/firebase.utils';

const db = getFirestore();

const TopPostTimer = () => {
  const [topPost, setTopPost] = useState(null);
  const [displayedTimer, setDisplayedTimer] = useState(0);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchTopPost = async () => {
      try {
        const topPosts = await getTopPosts();
        const latestTopPost = topPosts.find((post) => post.isNumberOne);
        setTopPost(latestTopPost);
      } catch (error) {
        console.error('Error fetching top post:', error.message);
      }
    };

    // Fetch the initial top post
    fetchTopPost();

    // Create an interval to update the displayed timer every second
    const intervalId = setInterval(() => {
      if (isMounted) {
        setDisplayedTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);

    // Cleanup the interval and unsubscribe from the Firestore listener when the component unmounts
    return () => {
      isMounted = false; // Set the flag to false when the component is unmounted
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {topPost && (
        <p>
          This post has been number one for{' '}
          {formatTimeDuration(displayedTimer)}.
        </p>
      )}
    </div>
  );
};

export default TopPostTimer;
