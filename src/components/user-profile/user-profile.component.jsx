import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react'; // Import useEffect and useState
import { UserContext } from '../../contexts/users.context';
import './user-page.styles.scss'
import { signOutUser } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import { getPostByUserName  } from '../../utils/firebase/firebase.utils';
import LeaderboardEntry from '../leaderboard-entry/leaderboard-entry.component';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [userPost, setUserPost] = useState(null); // State to store user post data
  const { user } = useParams();
  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const post = await getPostByUserName(user);
        setUserPost(post);
      } catch (error) {
        console.error('Error fetching post:', error.message);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchUserPost();
  }, [user]); // useEffect will run whenever username changes

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
  }

  return (
    <>
      <div className="profile-header-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
                      <>
                          <h1>This user has spent {userPost.timer} seconds at number one </h1>
                          <h1>This user has spent ${userPost.value} on their post</h1>
                          {/* <img src={userPost.image} alt=''></img> */}
                          {console.log(userPost)}   
                      
                      </>   
        )}
        <Button onClick={signOutHandler}>Sign Out</Button>
      </div>
    </>
  );
};

export default UserProfile;
