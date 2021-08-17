import React, { useState, useRef } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import "./Feed.css";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import Modal from "react-modal";
import FeedUpdate from "../feedupdate/FeedUpdate";

const ITEM_HEIGHT = 30;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const FeedMore = ({ isCurrentUser, postId }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [newFeed, setNewFeed] = useState(postId.description);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await db
        .collection("feeds")
        .doc(`${postId}`)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          setModalIsOpen(true);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  
  const onSubmit = async (event) => {
    event.preventDefault();
    await db.collection("feeds").doc(`${postId}`).update({
      description: newFeed,
    });
    setModalIsOpen(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewFeed(value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu-container">
      
        <>
          {isCurrentUser && (
            <>
              <button onClick={onClick} className="menu-trigger">
                <MoreVertIcon />
              </button>
              <nav
                ref={dropdownRef}
                className={`menu ${isActive ? "active" : "inactive"}`}
                style={{width:"105px", textAlign:"center"}}
              >
                <ul>
                  <li>
                    {/* <Link onClick={()=> setModalIsOpen(true)}>
                      수정하기
                    </Link>*/}
                    
                    <Modal
                      style={customStyles}
                      isOpen={modalIsOpen}
                      onRequestClose={()=>setModalIsOpen(false)}
                    >
                      <h3
                        style={{ color: "#9575cd", fontSize: "25px", fontWeight: "bold", textAlign:"center"}}
                      >
                        게시물 수정하기
                      </h3>
                      <div className="X_button">
                        <button 
                        className="exit__button" 
                        onClick={() => {setModalIsOpen(false)
                        setIsActive(false)}}>X</button>
                      </div>
                      <hr style={{marginTop:"5px"}}></hr>
                      <FeedUpdate></FeedUpdate>
                    </Modal>
                  </li>
                  <li>
                    <Link to="/" onClick={onDeleteClick}>
                      삭제하기
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </>
      
    </div>
  );
};

export default FeedMore;
