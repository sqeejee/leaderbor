import { Fragment, useContext, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { UserContext } from "../../contexts/users.context";
import { doesUserHavePost } from "../../utils/firebase/firebase.utils";

import { ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import './navigation.styles.scss';

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const [userHasPost, setUserHasPost] = useState(false);

  useEffect(() => {
    const checkUserPost = async () => {
      if (currentUser) {
        const hasPost = await doesUserHavePost(currentUser.uid);
        setUserHasPost(hasPost);
      } else {
        setUserHasPost(false); // Reset state when there is no user logged in
      }
    };

    checkUserPost();
  }, [currentUser]);

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to='/'>
          <CrwnLogo className="logo" />
        </Link>
        <div className="nav-links-container">
          {/* Dynamically change the text based on whether the user has a post */}
          <Link className='nav-link' to="/purchase">
            {userHasPost ? "Edit your post" : "Get on the board"}
          </Link>
          <Link className='nav-link' to="/user">Top Users</Link>
          {currentUser ? (
            <Link className='nav-link' to={`/user/${currentUser.displayName}`}>Hi {currentUser.displayName}</Link>
          ) : (
            <Link className='nav-link' to="/auth">Sign In</Link>
          )}
        </div>   
      </div>
      <Outlet />
    </Fragment>
  );
}

export default Navigation;
