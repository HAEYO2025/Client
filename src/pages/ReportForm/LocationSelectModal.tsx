import { useEffect, useRef, useState } from 'react';
import { useKakaoMapLoader } from '../../hooks/useKakaoMapLoader';
import styles from './LocationSelectModal.module.css';

interface LocationData {
  address: string;
  detailAddress: string;
  lat: number;
  lng: number;
}

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationData) => void;
  currentLocation?: LocationData;
}

// Kakao Maps Types (Local to this file scope to avoid conflicts and 'any')
interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  setPosition(position: KakaoLatLng): void;
}

interface GeocoderResult {
  address: {
    address_name: string;
  };
  road_address: {
    address_name: string;
  } | null;
}

interface PlaceResult {
  address_name: string;
  road_address_name: string;
  place_name: string;
  x: string;
  y: string;
}

interface KakaoStatus {
  OK: string;
  ZERO_RESULT: string;
  ERROR: string;
}

interface KakaoGeocoder {
  coord2Address(lng: number, lat: number, callback: (result: GeocoderResult[], status: string) => void): void;
}

interface KakaoPlaces {
  keywordSearch(keyword: string, callback: (data: PlaceResult[], status: string) => void): void;
}

interface KakaoMaps {
  LatLng: { new (lat: number, lng: number): KakaoLatLng };
  Map: { new (container: HTMLElement, options: KakaoMapOptions): KakaoMap };
  Marker: { new (options: KakaoMarkerOptions): KakaoMarker };
  event: {
    addListener(target: unknown, type: string, callback: (e: { latLng: KakaoLatLng }) => void): void;
  };
  services: {
    Status: KakaoStatus;
    Geocoder: { new (): KakaoGeocoder };
    Places: { new (): KakaoPlaces };
  };
}

interface WindowWithKakao extends Window {
  kakao: {
    maps: KakaoMaps;
  };
}

export const LocationSelectModal = ({ 
  isOpen, 
  onClose, 
  onSelectLocation,
  currentLocation 
}: LocationSelectModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [marker, setMarker] = useState<KakaoMarker | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<LocationData>({
    address: currentLocation?.address || '',
    detailAddress: currentLocation?.detailAddress || '',
    lat: currentLocation?.lat || 37.5665,
    lng: currentLocation?.lng || 126.9780
  });

  const isLoaded = useKakaoMapLoader();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isInitialized.current = false;
      return;
    }

    if (!isLoaded || !mapRef.current || isInitialized.current) return;

    const kakaoWin = window as unknown as WindowWithKakao;
    const kakao = kakaoWin.kakao;
    
    // services 라이브러리 확인
    if (!kakao.maps.services) {
      console.error('카카오맵 services 라이브러리가 로드되지 않았습니다!');
      return;
    }

    console.log('카카오맵 초기화 시작');
    
    try {
      const container = mapRef.current;
      if (!container) return;

      const options: KakaoMapOptions = {
        center: new kakao.maps.LatLng(
          selectedAddress.lat, 
          selectedAddress.lng
        ),
        level: 3
      };

      const kakaoMap = new kakao.maps.Map(container, options);
      setMap(kakaoMap);
      isInitialized.current = true;

      // 마커 생성
      const kakaoMarker = new kakao.maps.Marker({
        position: kakaoMap.getCenter()
      });
      kakaoMarker.setMap(kakaoMap);
      setMarker(kakaoMarker);

      // 지도 클릭 이벤트
      kakao.maps.event.addListener(kakaoMap, 'click', (mouseEvent: { latLng: KakaoLatLng }) => {
        const latlng = mouseEvent.latLng;
        kakaoMarker.setPosition(latlng);
        
        try {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: GeocoderResult[], status: string) => {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              const roadAddress = result[0].road_address?.address_name || '';
              
              setSelectedAddress({
                address: address,
                detailAddress: roadAddress,
                lat: latlng.getLat(),
                lng: latlng.getLng()
              });
            }
          });
        } catch (error) {
          console.error('Geocoder 생성 오류:', error);
        }
      });

      // 현재 위치로 이동
      if (navigator.geolocation && !currentLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lng);
            
            kakaoMap.setCenter(locPosition);
            kakaoMarker.setPosition(locPosition);
            
            try {
              const geocoder = new kakao.maps.services.Geocoder();
              geocoder.coord2Address(lng, lat, (result: GeocoderResult[], status: string) => {
                if (status === kakao.maps.services.Status.OK) {
                  setSelectedAddress({
                    address: result[0].address.address_name,
                    detailAddress: result[0].road_address?.address_name || '',
                    lat: lat,
                    lng: lng
                  });
                }
              });
            } catch (error) {
              console.error('현재 위치 Geocoder 생성 오류:', error);
            }
          }
        );
      }
    } catch (error) {
      console.error('지도 초기화 오류:', error);
    }
  }, [isOpen, isLoaded, currentLocation, selectedAddress.lat, selectedAddress.lng]);

  const handleSearch = () => {
    if (!map || !marker || !searchKeyword.trim()) {
      console.log('검색 조건 불충족:', { map: !!map, marker: !!marker, keyword: searchKeyword });
      return;
    }

    const kakaoWin = window as unknown as WindowWithKakao;
    const kakao = kakaoWin.kakao;

    if (!kakao?.maps?.services) {
      alert('검색 서비스를 사용할 수 없습니다. 페이지를 새로고침 해주세요.');
      return;
    }

    console.log('검색 시작:', searchKeyword);

    try {
      const ps = new kakao.maps.services.Places();
      
      ps.keywordSearch(searchKeyword, (data: PlaceResult[], status: string) => {
        console.log('검색 결과:', data, status);
        
        if (status === kakao.maps.services.Status.OK) {
          const place = data[0];
          console.log('첫 번째 결과:', place);
          
          const position = new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
          
          map.setCenter(position);
          marker.setPosition(position);
          
          setSelectedAddress({
            address: place.address_name,
            detailAddress: place.road_address_name || place.place_name,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x)
          });
        } else {
          console.log('검색 실패 status:', status);
          alert('검색 결과가 없습니다.');
        }
      });
    } catch (error) {
      console.error('검색 오류:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleConfirm = () => {
    if (!selectedAddress.address) {
      alert('위치를 선택해주세요.');
      return;
    }
    console.log('위치 선택 완료:', selectedAddress);
    onSelectLocation(selectedAddress);
    onClose();
  };

  const handleCurrentLocation = () => {
    if (!map || !marker) {
      console.log('지도나 마커가 없음');
      return;
    }

    if (!window.kakao?.maps?.services) {
      alert('위치 서비스를 사용할 수 없습니다.');
      return;
    }
    
    if (navigator.geolocation) {
      console.log('현재 위치 버튼 클릭');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('현재 위치 가져오기 성공:', position.coords);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const kakao = window.kakao;
          const locPosition = new kakao.maps.LatLng(lat, lng);
          
          map.setCenter(locPosition);
          map.setLevel(3);
          marker.setPosition(locPosition);
          
          try {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.coord2Address(lng, lat, (result: GeocoderResult[], status: string) => {
              if (status === kakao.maps.services.Status.OK) {
                console.log('현재 위치 주소:', result[0]);
                setSelectedAddress({
                  address: result[0].address.address_name,
                  detailAddress: result[0].road_address?.address_name || '',
                  lat: lat,
                  lng: lng
                });
              }
            });
          } catch (error) {
            console.error('Geocoder 생성 오류:', error);
          }
        },
        (error) => {
          console.error('위치 가져오기 오류:', error);
          alert('현재 위치를 가져올 수 없습니다.');
        }
      );
    } else {
      alert('위치 서비스를 지원하지 않습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>위치 선택</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="주소 또는 장소를 검색하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            className={styles.searchInput}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#666"/>
            </svg>
          </button>
          <button className={styles.currentLocationBtn} onClick={handleCurrentLocation}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="#666"/>
            </svg>
          </button>
        </div>
        
        <div ref={mapRef} className={styles.map}></div>
        
        <div className={styles.addressInfo}>
          <div className={styles.addressLabel}>선택된 위치</div>
          <p className={styles.mainAddress}>{selectedAddress.address || '지도를 클릭하여 위치를 선택하세요'}</p>
          {selectedAddress.detailAddress && (
            <p className={styles.subAddress}>{selectedAddress.detailAddress}</p>
          )}
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};