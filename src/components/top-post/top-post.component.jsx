import React, { useEffect, useState } from 'react';
import { formatTimeDuration } from "../../utils/firebase/methods/formatTimeduration.utils";

const TopPost = ({ post }) => {
    const { username, message, image, value, timer } = post;

    const [displayedTimer, setDisplayedTimer] = useState(timer);

    useEffect(() => {
        // Create an interval to update the displayed timer every second
        const intervalId = setInterval(() => {
            setDisplayedTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        // Cleanup the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <div className='num'>
                <p>1</p>
            </div>
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
                <div>
                    <p>
                        This post has been number one for{' '}
                        {formatTimeDuration(displayedTimer)}.
                    </p>
                </div>
            </div>
        </>
    )
}

export default TopPost;
