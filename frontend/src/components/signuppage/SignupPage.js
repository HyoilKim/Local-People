import { useRef, useState} from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase, { db } from "../firebase/firebase";
import "./SignupPage.css"

import NicknameButton from "./NicknameButton";


function SignupPage() {
  
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const [address, setAddress] = useState();
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({
    lat: 33.450701,
    lon: 126.570667,
  });
  const password = useRef();
  password.current = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      //firebase에서 이메일과 비밀번호로 유저 생성
      let createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);

      //firebase에서 생성한 유저에 추가 정보 입력
      await createdUser.user.updateProfile({
        displayName: data.nickname,
        photoURL: address,
        
      });
      
      //firebase 데이터베이스에 저장 (이메일 통해)
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        email: createdUser.user.email,
        nickname: createdUser.user.displayName,
        creationTime: createdUser.user.metadata.a,
        location: createdUser.user.photoURL
      });

      await db.collection("users").doc(data.nickname).set({
        username: data.nickname,
        coords: currentCoords,
      });
      
      console.log("createdUser", createdUser);
      
      } catch (error) {
        // 이미 생성된 이메일일 때 에러 메세지
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };
  
  let completed = false;
  const handleClick = () => {
    let container = document.getElementById("map");
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    let map = new window.kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new window.kakao.maps.services.Geocoder();

    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      var marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성합니다
      var infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      // const infoDiv = document.getElementById("dong");
      if (status === window.kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            setAddress(result[i].address_name)
            break;
          }
        }
      }
    }

    const authButton = document.getElementById("authButton");

    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도
        
        var locPosition = new window.kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        setCurrentCoords({lat: lat, lon: lon});
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        completed = true;
        if (authButton) {
          authButton.innerText = "위치 인증 완료";
        }
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      
      var locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667),
        message = "geolocation을 사용할수 없어요..";

      displayMarker(locPosition, message);
      if (authButton) {
        authButton.innerText = "위치 인증 실패";
      }
    }
  };

  // const onClick = async (event) => {
    // const [nickNameCheck, setNickNameCheck] = useState(false);
    // const [checkError, setCheckError] = useState("");

    // let createdNickname = await firebase.database().ref("users").once("value", gotUserData);
    
    // function gotUserData(snapshot) {
    //   snapshot.forEach(userSnapshot => {
    //     var nickname = userSnapshot.val().nickname;
    //     console.log(nickname);
    //   });
    // }

    // if (createdUser.user.displayName == createdNickname) {
    //   setCheckError("사용가능");
    // }
    // else {
    //   setCheckError("이미 다른 사용자가 사용 중입니다.");
    // }
  // }

  // const [dpNameCheck, setDpNameCheck] = useState(false);
  // const onClick = async (data) => {
  //   let userNickname = await firebase.database.nickname

  //   if (data.nickname == userNickname) {
  //     const IDcheck = await db
  //       .collection(data.nickname)
  //       .get();
  //     if (IDcheck.docs.length == 0 && data.nickname.length > 0 ) {
  //       setDpNameCheck(true);
  //       setErrorFromSubmit("사용가능");
  //     }
  //     else {
  //       if (data.nickname.length != 0) setErrorFromSubmit("이미 다른 사용자가 사용 중 입니다.");
  //       else setErrorFromSubmit("");
  //       setDpNameCheck(false);
  //     }
  //   }

  // }


  return (


      <div className="auth-wrapper">
        <div className="form">
          <div
            style={{ textAlign: "center",fontWeight: "bold", height: "40px" }}
          >
            <h1>회원가입</h1>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <hr></hr>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="map" style={{alignItems:"center"}}>
              <div id="map"></div>
              <div id="map__button">
                <button
                  style={{backgroundColor:"#5b63ac", borderRadius:"5px"}}
                  id="authButton"
                  value=""
                  onClick={handleClick}
                  disabled={completed}
                >
                  위치 인증하기
                </button>
                {errors.authButton &&
                errors.authButton.type === "required" && (
                  <span>위치 인증을 클릭해주세요.</span>
                 )}
              </div>
              <div name="address" style={{
                color:"white", textAlign:"center", fontSize:"15px"
              }}>{address}</div>
            </div>
            <label>이메일</label>
            <input
              name="email"
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && errors.email.type === "required" && (
              <span>이메일을 입력해주세요.</span>
            )}


            <label>닉네임</label>
            <div className="name">
              <div>
                <input
                id = "nickname"
                name="nickname"
                type="nickname"
                {...register("nickname", { required: true })}
                />
              </div>
              {/* <NicknameButton></NicknameButton> */}
            </div>
            {errors.nickname && errors.nickname.type === "required" && (
              <span>닉네임을 입력해주세요.</span>
            )}

            <label>비밀번호</label>
            <input
              name="password"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && errors.password.type === "required" && (
              <span>비밀번호를 입력해주세요.</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span>비밀번호는 6자 이상이어야 합니다.</span>
            )}

            <label>비밀번호 확인</label>
            <input
              name="password_confirm"
              type="password"
              {...register("password_confirm", {
                required: true,
                validate: (value) => value === password.current,
              })}
            />
            {errors.password_confirm &&
              errors.password_confirm.type === "required" && (
                <span>비밀번호를 입력해주세요.</span>
              )}
            {errors.password_confirm &&
              errors.password_confirm.type === "validate" && (
                <span>비밀번호가 일치하지 않습니다.</span>
              )}

            {errorFromSubmit && <span>{errorFromSubmit}</span>}

            <input
              value="회원가입"
              type="submit"
              style={{ marginTop: "40px" }}
              disabled={loading}
            />
            <Link
              style={{
                paddingLeft: "115px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
              }}
              to="login"
            >
              계정이 있으신가요?
            </Link>
          </form>
        </div>
      </div>
  );
}

export default SignupPage;
