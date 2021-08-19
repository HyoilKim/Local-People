import React, { useState, useRef } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import "./Feed.css";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import Modal from "react-modal";
import FeedUpdate from "../feedupdate/FeedUpdate";
import Button from "@material-ui/core/Button";

const ITEM_HEIGHT = 30;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");
const FeedMore = ({ isCurrentUser, postId, description }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await db
        .collection("feeds")
        .doc(`${postId}`)
        .delete()
        .then(() => {
          console.log("삭제되었습니다!");
          setModalIsOpen(true);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  const [editing, setEditing] = useState(false);
  //editing or not
  const [newFeed, setNewFeed] = useState(postId.description);
  // for update description
  // const [image, setImage] = useState(postId.imageURL);
  // for update image

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleEditing = () => setEditing((prev) => !prev);

  // const handleChange = (e) => {
  //   if (e.target.files[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewFeed(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await db.collection("feeds").doc(`${postId}`).update({
      description: newFeed,
      // imageUrl: image
    });
    setModalIsOpen(false);
    setEditing(false);
  };

  return (
    <div className="menu-container">
      {editing ? (
        <>
          <Modal
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={() => {
              setModalIsOpen(false);
              toggleEditing();
            }}
          >
            <form onSubmit={onSubmit}>
              <h3
                style={{
                  color: "#9575cd",
                  fontSize: "25px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                게시물 수정
              </h3>
              <div className="X_button">
                <button
                  className="exit__button"
                  onClick={() => {
                    setModalIsOpen(false);
                    setIsActive(false);
                    toggleEditing();
                  }}
                >
                  X
                </button>
              </div>
              <hr style={{ marginTop: "8px" }}></hr>
              <div className="feedEdit">
                <textarea
                  type="text"
                  placeholder={description}
                  value={newFeed}
                  required
                  onChange={onChange}
                  className="feedEdit__description"
                ></textarea>
                {/* <div className="feedEdit__image">
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleChange}
                />
              </div> */}
                <div className="feedEdit__button">
                  <Button
                    variant="contained"
                    type="submit"
                    value="Update Feed"
                    backgroundcolor="primary"
                    id="edit__button"
                  >
                    수정하기
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
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
                style={{ width: "105px", textAlign: "center" }}
                id="button_nav"
              >
                <ul>
                  <li>
                    <Link
                      onClick={() => {
                        setModalIsOpen(true);
                        setIsActive(false);
                        toggleEditing();
                      }}
                    >
                      수정하기
                    </Link>
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
      )}
    </div>
  );
};

export default FeedMore;
