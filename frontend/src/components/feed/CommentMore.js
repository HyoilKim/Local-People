import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import firebase, { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import "./Feed.css";
import { useDetectOutsideClick } from "./useDetectOutsideClick";

const ITEM_HEIGHT = 10;

const CommentMore = ({ isCurrentUser, postId }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState(postId.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await db
        .collection("comments")
        .doc(`${postId}`)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await db.collection("comments").doc(`${postId}`).update({
      text: newComment,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewComment(value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu-container">
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={onChange}
              required
            ></input>
            <input type="submit" value="Update Comment"></input>
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <>
          {isCurrentUser && (
            <>
              <button onClick={onClick} className="menu-trigger">
                <MoreVertIcon />
              </button>
              <nav
                ref={dropdownRef}
                className={`menu ${isActive ? "active" : "inactive"}`}
              >
                <ul>
                  <li>
                    <Link onClick={toggleEditing}>수정하기</Link>
                  </li>
                  <li>
                    <Link onClick={onDeleteClick}>삭제하기</Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CommentMore;