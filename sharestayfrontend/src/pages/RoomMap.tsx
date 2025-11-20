import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Alert, Paper, Select, MenuItem, Slider, TextField, Button, Typography, SelectChangeEvent } from "@mui/material";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { api } from "../lib/api";
import type { RoomSummary } from "../types/room";
import { mapRoomFromApi } from "../types/room";

declare global {
  interface Window {
    kakao: any;         // 카카오맵 SDK가 타입스크립트용 타입 정의를 제공하지 않기 때문에 any 사용
  }
}

const RoomMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);       // 지도 인스턴스를 저장할 ref
  const clustererRef = useRef<any>(null);         // 클러스터러 인스턴스를 저장할 ref
  const location = useLocation();                 // 현재 경로 정보를 가져옵니다.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [buildingType, setBuildingType] = useState<string>("ALL");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]); // 예: 0만원 ~ 100만원
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleBuildingTypeChange = (event: SelectChangeEvent<string>) => {
    setBuildingType(event.target.value);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      setError("카카오맵 SDK를 불러오지 못했습니다.");
      setIsLoading(false);
      return;
    }


    window.kakao.maps.load(() => {
      const mapContainer = mapRef.current;
      if (!mapContainer) return;


      // 1. 사용자의 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userPosition = new window.kakao.maps.LatLng(latitude, longitude);

            // 2. 지도 생성 및 중심 설정
            const map = new window.kakao.maps.Map(mapContainer, {
              center: userPosition,
              level: 5,
            });
            mapInstanceRef.current = map; // 생성된 지도 인스턴스를 ref에 저장

            // 2-1. 마커 클러스터러 생성
            clustererRef.current = new window.kakao.maps.MarkerClusterer({
              map: map, // 클러스터러를 적용할 지도
              averageCenter: true, // 클러스터 마커의 위치를 마커들의 평균 좌표로 설정
              minLevel: 6, // 클러스터링을 시작할 최소 지도 레벨
            });

            // 현재 위치에 특별한 마커 표시
            new window.kakao.maps.Marker({
              map,
              position: userPosition,
              title: "현재 위치",
            });

            // 4. 지도 이동이 멈추면 주변 방 데이터를 다시 불러오는 이벤트 리스너 추가
            window.kakao.maps.event.addListener(map, 'idle', () => {
              if (mapInstanceRef.current) {
                const center = mapInstanceRef.current.getCenter();
                fetchRoomsNearby(center.getLat(), center.getLng());
              }
            });
            // 3. 현재 위치 기반으로 주변 방 데이터 요청
            fetchRoomsNearby(latitude, longitude);
          },
          () => {
            // 위치 정보 가져오기 실패 시 기본 위치(서울)로 설정
            setError("위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.");
            const defaultLat = 37.5665; // 서울 시청 위도
            const defaultLng = 126.9780; // 서울 시청 경도
            const defaultPosition = new window.kakao.maps.LatLng(defaultLat, defaultLng);
            const map = new window.kakao.maps.Map(mapContainer, {
              center: defaultPosition,
              level: 5,
            });
            mapInstanceRef.current = map; // 생성된 지도 인스턴스를 ref에 저장

            // 2-1. 마커 클러스터러 생성
            clustererRef.current = new window.kakao.maps.MarkerClusterer({
              map: map,
              averageCenter: true,
              minLevel: 6,
            });

            // 4. 지도 이동이 멈추면 주변 방 데이터를 다시 불러오는 이벤트 리스너 추가
            window.kakao.maps.event.addListener(map, 'idle', () => {
              if (mapInstanceRef.current) {
                const center = mapInstanceRef.current.getCenter();
                fetchRoomsNearby(center.getLat(), center.getLng());
              }
            });
            // 기본 위치 주변 방 데이터 요청
            fetchRoomsNearby(defaultLat, defaultLng);
          }
        );
      } else {
        setError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
        setIsLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 렌더링 시에만 지도를 초기화합니다.

  const fetchRoomsNearby = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        lat,
        lng,
        radiusKm: 3, // 반경을 3km로 설정합니다.
        minPrice: priceRange[0] * 10000, // API 명세에 맞게 단위를 조정해야 합니다. (예: 만원 -> 원)
        maxPrice: priceRange[1] * 10000,
      };
      if (buildingType !== "ALL") {
        params.buildingType = buildingType;
      }

      const { data } = await api.get("/map/rooms/near", { params });

      console.log("API 응답 데이터:", data); // [추가] API 응답을 콘솔에서 확인

      const roomList: RoomSummary[] = Array.isArray(data) ? data.map(mapRoomFromApi) : [];

      console.log("매핑된 방 목록:", roomList); // [추가] 매핑된 데이터를 콘솔에서 확인

      updateMarkers(roomList);
    } catch (err) {
      console.error("주변 방 정보 로딩 실패:", err); // [추가] 실제 에러를 콘솔에 출력
      setError("주변 방 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMarkers = (rooms: RoomSummary[]) => {
    if (!clustererRef.current) return;

    console.log(`${rooms.length}개의 마커를 생성합니다.`); // [추가] 생성될 마커 수 확인

    // 방(숙소) 마커에 사용할 커스텀 아이콘을 설정합니다.
    const roomMarkerImageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'; // 주황색 마커 아이콘
    const imageSize = new window.kakao.maps.Size(33, 36); // 마커 이미지의 크기
    const imageOption = { offset: new window.kakao.maps.Point(16, 36) }; // 마커의 좌표에 일치시킬 이미지 안의 좌표

    const roomMarkerImage = new window.kakao.maps.MarkerImage(roomMarkerImageSrc, imageSize, imageOption);


    const markers = rooms.map((room) => {
      if (room.latitude && room.longitude) {
        const markerPosition = new window.kakao.maps.LatLng(room.latitude, room.longitude);
        return new window.kakao.maps.Marker({
          position: markerPosition,
          title: room.title,
          image: roomMarkerImage, // 커스텀 마커 아이콘을 적용합니다.
        });
      }
      return null;
    }).filter((marker): marker is any => marker !== null);

    clustererRef.current.clear();
    clustererRef.current.addMarkers(markers);
  };

  // 지도 컨테이너의 크기 변경을 감지하고 relayout을 호출하는 useEffect
  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    // ResizeObserver를 생성하고 콜백 함수를 정의합니다.
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        // 지도 컨테이너 크기가 변경될 때마다 relayout 함수를 호출합니다.
        mapInstanceRef.current.relayout();
      }
    });

    // mapContainer에 대한 관찰을 시작합니다.
    observer.observe(mapContainer);

    // 컴포넌트가 언마운트될 때 관찰을 중단합니다.
    return () => observer.disconnect();
  }, []);

  const handleApplyFilter = () => {
    if (!mapInstanceRef.current) return;
    const center = mapInstanceRef.current.getCenter();
    fetchRoomsNearby(center.getLat(), center.getLng());
  };

  const handleResetFilter = () => {
    setBuildingType("ALL");
    setPriceRange([0, 100]);
    setSearchQuery("");
    // 필터 초기화 후, '적용' 버튼을 누르면 현재 지도 중심 기준으로 다시 검색됩니다.
    // 또는 handleApplyFilter()를 호출하여 즉시 적용할 수도 있습니다.
    handleApplyFilter();
  };

  const handleSearch = () => {
    if (!searchQuery || !window.kakao) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchQuery, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const newPos = new window.kakao.maps.LatLng(data[0].y, data[0].x);
        mapInstanceRef.current.setCenter(newPos);
        fetchRoomsNearby(newPos.getLat(), newPos.getLng());
      } else {
        setError("검색 결과가 없습니다.");
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };




  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteHeader activePath="/rooms" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: "relative",
          width: "100%",
          height: "calc(100vh - 65px)", // 전체 화면 높이에서 헤더 높이(약 65px)를 뺌
        }}
      >
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 300,
          }}
        >
          <Box>
            <Typography gutterBottom>건물 유형</Typography>
            <Select value={buildingType} onChange={handleBuildingTypeChange} fullWidth size="small">
              <MenuItem value="ALL">전체</MenuItem>
              <MenuItem value="APARTMENT">아파트</MenuItem>
              <MenuItem value="VILLA">빌라</MenuItem>
              <MenuItem value="OFFICETEL">오피스텔</MenuItem>
            </Select>
          </Box>
          <Box>
            <Typography gutterBottom>가격 범위 (만원)</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              marks={[{ value: 0, label: '0' }, { value: 100, label: '100+' }]}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField label="지역 검색" variant="outlined" size="small" fullWidth value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKeyPress} />
            <Button variant="contained" onClick={handleSearch} sx={{ whiteSpace: 'nowrap' }}>검색</Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="outlined" onClick={handleResetFilter} fullWidth>초기화</Button>
            <Button variant="contained" color="primary" onClick={handleApplyFilter} fullWidth>적용</Button>
          </Box>
        </Paper>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {(isLoading || error) && (
          <Box position="absolute" top={16} right={16} p={2} zIndex={10}>
            {isLoading && <CircularProgress />}
            {error && <Alert severity="warning" onClose={() => setError(null)}>{error}</Alert>}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RoomMap;
