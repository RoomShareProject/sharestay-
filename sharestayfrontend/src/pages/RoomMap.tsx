import React, { useEffect, useState, useRef } from "react";

interface Room {
  roomId: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const RoomMap: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const myLocation = { lat: 37.123, lng: 126.123 };

  // 1) 방 정보 가져오기
  useEffect(() => {
    fetch(`http://localhost:8080/api/map/rooms/near?lat=${myLocation.lat}&lng=${myLocation.lng}&radiusKm=3`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  // 2) 지도 초기화 (한 번만)
  useEffect(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng),
      level: 4,
    };
    mapRef.current = new window.kakao.maps.Map(container, options);

    // 내 위치 마커
    new window.kakao.maps.Marker({
      map: mapRef.current,
      position: new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng),
      title: "내 위치",
    });
  }, []);

  // 3) rooms 업데이트 시 마커 갱신
  useEffect(() => {
    if (!mapRef.current || rooms.length === 0) return;

    // 기존 마커 삭제
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    rooms.forEach((room) => {
      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position: new window.kakao.maps.LatLng(room.latitude, room.longitude),
        title: room.title,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${room.title}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [rooms]);

  return <div id="map" style={{ width: "100%", height: "600px" }} />;
};

export default RoomMap;