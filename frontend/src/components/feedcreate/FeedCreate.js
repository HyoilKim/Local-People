import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { db, storage } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Nav from "../nav/Nav";
import { useHistory } from "react-router-dom";
import "./FeedCreate.css";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const FeedCreate = ({ username }) => {
  function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
    //두 점의 위경도좌표를 받아 거리 return
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
  }
  const currentUser = firebase.auth().currentUser;
  console.log(currentUser.metadata.a);
  const [signUpCoords, setSignUpCoords] = useState({});
  const classes = useStyles();
  const [isCoords, setIsCoords] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({
    lat: 33.450701,
    lon: 126.570667,
  });
  let history = useHistory();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    db.collection("users")
      .doc(currentUser.displayName)
      .get()
      .then((doc) => {
        setSignUpCoords(doc.data().coords);
      });
  }, [currentUser]);

  const handleClick = () => {
    const locationButton = document.getElementById("locationButton");
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    let map = new window.kakao.maps.Map(container, options);

    var geocoder = new window.kakao.maps.services.Geocoder();

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }
    function displayMarker(locPosition) {
      // 지도 중심좌표를 회원가입 당시 설정한 위치로 변경합니다
      map.setCenter(locPosition);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            setAddress(result[i].address_name);
            break;
          }
        }
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        var locPosition = new window.kakao.maps.LatLng(
          signUpCoords.lat,
          signUpCoords.lon
        ); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        displayMarker(locPosition);
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        setIsCoords(true);
        locationButton.innerText = "위치인증완료";
      });
    } else {
      console.log("Can't load currentPosition");
      locationButton.innerText = "위치인증실패";
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (
      getDistanceFromLatLonInKm(
        currentCoords.lat,
        currentCoords.lon,
        signUpCoords.lat,
        signUpCoords.lon
      ) > 6 &&
      isCoords === true
    ) {
      alert(
        "가입하신 곳의 위치와 너무 떨어져 있어요..동네에서 게시물을 업로드해주세요!"
      );
      return;
    }
    if (image == null) {
      alert("이미지를 업로드해주세요.");
      return;
    }
    if (isCoords === true) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          //Error function
          console.log(error);
          alert(error.message);
        },
        () => {
          //complete function...

          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              //post image inside db
              db.collection("feeds").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                description: description,
                imageUrl: url,
                username: currentUser.displayName,
                likes: [],
                location: currentCoords,
                address: address,
                userCreatedTime: Number(currentUser.metadata.a),
              });

              setDescription("");
              setImage(null);
              history.push("/");
            });
        }
      );
    } else {
      alert("위치인증이 필요합니다.");
    }
  };

  return (
    <div className="container">
      <Nav></Nav>
      <div className="feedCreate">
        <div className="feedCreate__comment">
          <h3
            style={{ color: "#fb8267", fontSize: "25px", fontWeight: "bold" }}
          >
            게시물 만들기
          </h3>
        </div>

        <textarea
          name="textarea"
          id="textarea"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="당신의 로컬 정보를 공유해주세요!"
          value={description}
          className="feedCreate__description"
        ></textarea>
      </div>
      <div className="feedCreate__bottom">
        <div className="feedCreate__buttons">
          <div className="feedCreate__image">
            <input accept="image/*" type="file" onChange={handleChange} />
          </div>
          <Button
            variant="contained"
            className="feedCreate__button__location"
            color="primary"
            onClick={handleClick}
            className={classes.button}
            id="locationButton"
          >
            위치인증하기
          </Button>
          <Button
            variant="contained"
            background
            color="primary"
            onClick={handleUpload}
            className={classes.button}
          >
            업로드
          </Button>
        </div>
      </div>
      {/* <div className="feedCreate__progress">
        <progress value={progress} max="100"></progress>
      </div> */}
    </div>
  );
};

export default FeedCreate;
