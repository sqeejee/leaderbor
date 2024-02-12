import React, { useState, useEffect } from 'react';
import { getTopUsersByPostTimer, getPostByUserName, getTopUsersByMoneySpent } from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component'; // Assuming Button is your custom component
import './user-preview.component.scss'; // Make sure the path matches

// Helper function to format time from seconds
const formatTime = (totalSeconds) => {
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds > 0 ? `${seconds}s` : ''}`;
};

const UserPreview = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [filter, setFilter] = useState('time'); // 'time' or 'money'

  useEffect(() => {
    const fetchTopUsers = async () => {
      let users;
      if (filter === 'time') {
        users = await getTopUsersByPostTimer();
      } else if (filter === 'money') {
        users = await getTopUsersByMoneySpent();
      }
  
      const usersWithDetails = (await Promise.all(users.map(async (user) => {
        try {
          const post = await getPostByUserName(user.displayName);
          if (post) {
            const totalTimeAtTop = formatTime(post.timer);
            const totalSpent = post.value.toFixed(2); 
            return { ...user, totalTimeAtTop, totalSpent, rawTime: post.timer }; // Include rawTime for filtering
          }
        } catch (error) {
          console.error("Error fetching details for user:", user.displayName, error);
        }
        return null;
      }))).filter(user => user !== null && !(filter === 'time' && user.rawTime <= 0)); // Filter based on condition

      setTopUsers(usersWithDetails);
    };
  
    fetchTopUsers();
  }, [filter]);

  return (
    <div className="user-preview">
      <h1>Top Users</h1>
      <div>
        <Button onClick={() => setFilter('time')} className={filter === 'time' ? 'active' : ''}>Sort by Time</Button>
        <Button onClick={() => setFilter('money')} className={filter === 'money' ? 'active' : ''}>Sort by Money</Button>
      </div>
      <ul>
        {topUsers.map((user, index) => (
          <li key={index}>
            {user.displayName} - 
            {filter === 'time' ? `Time: ${user.totalTimeAtTop} - Money Spent: $${user.totalSpent}` : `Money Spent: $${user.totalSpent} - Time: ${user.totalTimeAtTop}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPreview;
