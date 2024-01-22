import PostPurchase from "../../components/purchase-entry/purchase-entry.component";
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../contexts/users.context';
import { doesUserHavePost } from "../../utils/firebase/firebase.utils";

const Leaderboard = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [hasPost, setHasPost] = useState(null);

  useEffect(() => {
    const checkUserPost = async () => {
      try {
        if (currentUser) {
          const userHasPost = await doesUserHavePost(currentUser.uid);
          setHasPost(userHasPost);
        }
      } catch (error) {
        console.error("Error checking user post:", error.message);
      }
    };

    checkUserPost();
  }, [currentUser]);

  return (
    <div className="leaderboard-container">
      {currentUser ? (
        hasPost === null ? (
          <h1>Loading...</h1>
        ) : hasPost ? (
          <>
            <h1>You have a post</h1>
            {/* Render additional content for users with posts */}
          </>
        ) : (
          <>
            <h1>You do not have a post</h1>
            <PostPurchase />
          </>
        )
      ) : (
        <h1>You are not logged in</h1>
      )}
    </div>
  );
};

export default Leaderboard;
