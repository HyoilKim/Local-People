import { useEffect } from "react";
import "./Map.css";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MarkerInfo {
  title: string;
  latlng: any;
  username: string;
  imageUrl: string;
  description: string;
  id: string;
}

const MarkerView = ({ feeds, userCoords }) => {
  useEffect(() => {
    let container = document.getElementById("mapview");
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    let map = new window.kakao.maps.Map(container, options);
    var zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    let positions: Array<MarkerInfo> = [];

    for (var i = 0; i < feeds.length; i++) {
      positions.push({
        title: "sample",
        latlng: new window.kakao.maps.LatLng(
          feeds[i].feed.location.lat,
          feeds[i].feed.location.lon
        ),
        username: feeds[i].feed.username,
        imageUrl: feeds[i].feed.imageUrl,
        description: feeds[i].feed.description,
        id: feeds[i].id,
      });
    }
    // 주소-좌표 변환 객체를 생성합니다
    let geocoder = new window.kakao.maps.services.Geocoder();

    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    positions.forEach((pos) => {
      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new window.kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );

      // 마커를 생성합니다
      let marker1 = new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: pos.latlng, // 마커를 표시할 위치
        title: pos.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
      // 커스텀 오버레이에 표시할 컨텐츠 입니다
      // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
      // 별도의 이벤트 메소드를 제공하지 않습니다
      var content =
        '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        pos.username +
        "        </div>" +
        '        <div class="body">' +
        '            <div class="img">' +
        "                <img src=" +
        pos.imageUrl +
        ' width="73" height="70">' +
        "           </div>" +
        '            <div class="desc">' +
        '                <div class="ellipsis">' +
        pos.description +
        "</div>" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";

      // 마커 위에 커스텀오버레이를 표시합니다
      // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
      var overlay = new window.kakao.maps.CustomOverlay({
        content: content,
        map: map,
        position: marker1.getPosition(),
      });
      window.kakao.maps.event.addListener(marker1, "mouseover", function () {
        overlay.setMap(map);
      });
      window.kakao.maps.event.addListener(marker1, "mouseout", function () {
        overlay.setMap(null);
      });

      window.kakao.maps.event.addListener(marker1, "click", function () {
        const feedId = document.getElementById(pos.id);
        if (feedId) {
          feedId.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }
      });
      overlay.setMap(null);
      marker1.setMap(map); //지도에 마커를 표시
    });
    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      let marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      let iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성합니다
      let infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 인포윈도우를 마커위에 표시합니다
      //infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      const infoDiv = document.getElementById("dong");
      if (status === window.kakao.maps.services.Status.OK) {
        for (let i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === "H") {
            if (!infoDiv) {
              break;
            }
            infoDiv.innerHTML = result[i].address_name;
            break;
          }
        }
      }
    }
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        let locPosition = new window.kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          message = '<div style="padding:5px;"></div>'; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      let locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667),
        message = "geolocation을 사용할수 없어요..";

      displayMarker(locPosition, message);
    }
  }, [feeds.length]);

  return (
    <div className="map">
      <div className="mapview__container">
        <div className="mapview__header">
          <p className="mapview__header__quote">우리 동네 로컬 생활</p>
        </div>
        <div id="mapview"></div>
        <div className="mapview__footer">
          <div style={{ textAlign: "center", marginTop: "3px" }}>
            <span>
              코로나 블루로 멀어진 이웃 사이,
              <br></br>
              ‘로컬피플’로 조금 더 가까이 다가가보세요!
            </span>
          </div>
          {/*<div className="ixdEe">
            <div className="K5OFK">
              <a className="l93RR">소개</a>
            </div>
            <div className="K5OFK">
              도움말
              <a className="l93RR">소개</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">홍보 센터</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">API</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">채용 정보</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">개인정보처리방침</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">약관위치</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">인기 계정</a>
            </div>
            <div className="K5OFK">
              <a className="l93RR">해시태그언어</a>
            </div>
          </div>
          © 2021 INSTAGRAM FROM FACEBOOK */}
        </div>
      </div>
    </div>
  );
};

export default MarkerView;
