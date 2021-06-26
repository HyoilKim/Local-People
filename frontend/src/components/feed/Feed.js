import React from "react";
import "./Feed.css";
import Avatar from "@material-ui/core/Avatar";

const Feed = ({ username, description, imageUrl }) => {
  return (
    <div className="feed">
      <div className="feed__header">
        <Avatar
          className="feed__avatar"
          alt={username}
          src="/static/images/avatar/1.jpeg"
        ></Avatar>
        <h3>{username}</h3>
        {/*header -> profileimage + username */}
      </div>

      <img className="feed__image" src={imageUrl} alt="feed__image" />
      {/*image*/}
      <h4 className="feed__text">
        <strong>{username}</strong>: {description}
      </h4>
      {/*username + description */}
    </div>
  );
};

export default Feed;
