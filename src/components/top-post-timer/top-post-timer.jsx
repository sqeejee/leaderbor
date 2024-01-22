import { useEffect, useState } from 'react';
import { getTopPosts } from '../../utils/firebase/firebase.utils';

const TopPostTimer = () => {
  const [topPost, setTopPost] = useState(null);

  useEffect(() => {
    const fetchTopPost = async () => {
      try {
        const topPosts = await getTopPosts();
        setTopPost(topPosts.find(post => post.isNumberOne));
      } catch (error) {
        console.error('Error fetching top post:', error.message);
      }
    };

    fetchTopPost();
  }, []);

  return (
    <div>
      {topPost && (
        <p>Top Post Timer: {topPost.timer}</p>
      )}
    </div>
  );
};

export default TopPostTimer;
