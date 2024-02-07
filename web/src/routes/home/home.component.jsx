import {useState} from 'react';
import { getTopPosts } from '../../utils/firebase/firebase.utils';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import './home.styles.scss';
import LeaderboardEntry from '../../components/leaderboard-entry/leaderboard-entry.component';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const grabPosts = async () => {
    try {
      const retrievedPosts = await getTopPosts();
      setPosts(retrievedPosts);  // Update state with retrieved posts
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  useEffect(() => {
    grabPosts();
  }, []); 

  let pos = 0;

  return (
    <div>
      <Outlet />
      <div className='entry-containers'>
        {posts.length > 0 &&
          posts.map((post) => (
            <LeaderboardEntry key={post.id} entry={post} position={pos++} />
          ))}
      </div>
    </div>
  );
};

export default Home;