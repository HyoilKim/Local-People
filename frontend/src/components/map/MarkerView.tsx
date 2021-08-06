import { KeyboardCapslockOutlined } from "@material-ui/icons";
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
}

const MarkerView = ({ feeds }) => {
  useEffect(() => {
    let container = document.getElementById("mapview");
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    let map = new window.kakao.maps.Map(container, options);
    let positions: Array<MarkerInfo> = [];
    console.log(feeds);
    for (var i = 0; i < feeds.length; i++) {
      positions.push({
        title: "sample",
        latlng: new window.kakao.maps.LatLng(
          feeds[i].feed.location.lat,
          feeds[i].feed.location.lon
        ),
      });
    }
    // 주소-좌표 변환 객체를 생성합니다
    let geocoder = new window.kakao.maps.services.Geocoder();
    console.log(positions); //for Debug
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i++) {
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
        position: positions[i].latlng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
      console.log(marker1);
      marker1.setMap(map);
    }
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
          message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

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

    console.log(feeds);
  }, []);

  return (
    <div className="map">
      <div className=""></div>
      <div id="mapview"></div>
    </div>
  );
};

export default MarkerView;
