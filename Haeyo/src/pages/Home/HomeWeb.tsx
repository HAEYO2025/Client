import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { useKakaoMapLoader } from '../../hooks/useKakaoMapLoader';
import { isAuthenticated } from '../../api/auth';
import { fetchSafetyGuide } from '../../api/safetyGuide';
import type { SafetyGuideRequest } from '../../types/safetyGuide';
import { WebHeader } from '../../components/WebHeader';
import styles from './HomeWeb.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}



export const HomeWeb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  
  // 카카오 지도 로더
  const isMapLoaded = useKakaoMapLoader();



  const filterOptions = ['전체', '위험', '생물', '쓰레기'];



  const filterMap: { [key: string]: string } = {
    '전체': 'ALL',
    '위험': 'DAMAGE',
    '생물': 'ANIMAL',
    '쓰레기': 'TRASH'
  };

  // Separate memo for filtered posts to use in the list
  const filteredPosts = useMemo(() => {
    const backendCategory = filterMap[selectedFilter];
    return selectedFilter === '전체' 
      ? posts 
      : posts.filter(post => post.category === backendCategory);
  }, [posts, selectedFilter]);

  const handlePostClick = useCallback((postId: number) => {
    navigate(`/report/${postId}`);
  }, [navigate]);

  // Kakao Map Initialization & Clustering
  useEffect(() => {
    if (!isMapLoaded || !window.kakao || !mapContainer.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 7
      };

      // Only initialize map if it doesn't exist
      if (!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(mapContainer.current, { ...options, draggable: true });
        mapInstance.current.setDraggable(true);
      }
      
      const map = mapInstance.current;

      // Initialize Clusterer
      const clusterer = new window.kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 5,
        disableClickZoom: true // 클러스터 클릭 시 줌 동작 제어
      });

      // Clear existing overlays/markers (If we were tracking them. Clusterer handles its own)
      clusterer.clear();

      // Create Markers for Clusterer
      const markers = filteredPosts.map(post => {
        const position = new window.kakao.maps.LatLng(post.latitude, post.longitude);
        const marker = new window.kakao.maps.Marker({
          position: position
        });
        
        // Add click event to marker
        window.kakao.maps.event.addListener(marker, 'click', () => handlePostClick(post.id));
        
        return marker;
      });

      // Add markers to clusterer
      clusterer.addMarkers(markers);
      
      // Cluster click event
        window.kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster: any) {
            const level = map.getLevel() - 1;
            map.setLevel(level, {anchor: cluster.getCenter()});
        });

      // Cleanup function to clear markers when dependencies change
      return () => {
        clusterer.clear();
      };

    } catch (error) {
      console.error('지도 초기화 오류:', error);
    }
  }, [isMapLoaded, filteredPosts, handlePostClick]);

  const handleZoom = (delta: number) => {
    if (!mapInstance.current) return;
    const currentLevel = mapInstance.current.getLevel();
    mapInstance.current.setLevel(currentLevel + delta);
  };

  const handleCurrentLocation = () => {
    if (!mapInstance.current) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lng);
          
          mapInstance.current.setCenter(locPosition);
          mapInstance.current.setLevel(3);
          
          new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: locPosition
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          alert('현재 위치를 가져올 수 없습니다.');
        }
      );
    } else {
      alert('이 브라우저에서는 위치 서비스를 지원하지 않습니다.');
    }
  };

  // Fetch reports on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSafetyGuideClick = async () => {
    if (isGuideLoading) {
      return;
    }
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없습니다.');
      return;
    }

    try {
      setIsGuideLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const request: SafetyGuideRequest = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        data_type: 'tideObs',
        station_data_type: 'ObsServiceObj',
      };

      const response = await fetchSafetyGuide(request);
      if (response.success) {
        sessionStorage.setItem('safetyGuideData', JSON.stringify(response.data));
        navigate('/safety-guide');
      } else {
        console.error('Failed to fetch safety guide:', response.error);
        alert('안전 가이드 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to get current position:', error);
      alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    } finally {
      setIsGuideLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <WebHeader activePage="home" />

      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitleGroup}>
              <h2>최근 제보</h2>
            </div>
            <button className={styles.moreBtn} onClick={() => handleNavigation('/community')}>더보기</button>
          </div>

          <div className={styles.commentsList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>제보를 불러오는 중...</div>
            ) : filteredPosts.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center' }}>최근 제보가 없습니다.</div>
            ) : (
              filteredPosts.map((post: Post) => {
                const categoryMap: { [key: string]: string } = {
                  'DAMAGE': '위험',
                  'ANIMAL': '생물',
                  'TRASH': '쓰레기',
                  'OTHER': '기타'
                };
                const categoryKorean = categoryMap[post.category] || post.category;
                const imageUrl = post.imageUrl 
                  ? (post.imageUrl.startsWith('http') || post.imageUrl.startsWith('/uploads') 
                      ? post.imageUrl 
                      : `/uploads/${post.imageUrl}`)
                  : null;
                
                // Extract title
                const title = post.description.split('\n')[0];

                return (
                  <div 
                    key={post.id} 
                    className={styles.commentItem}
                    onClick={() => handlePostClick(post.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.commentAvatar}>👤</div>
                        <div className={styles.headerText}>
                          <span className={styles.commentName}>{post.username}</span>
                          <span className={styles.commentTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', color: '#888' }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M14 9V5C14 3.34 12.66 2 11 2C10.45 2 10 2.45 10 3V9H4C2.9 9 2 9.9 2 11V20C2 21.1 2.9 22 4 22H14C15.52 22 17.5 21.55 18.25 19.74L21.38 12.44C21.45 12.28 21.49 12.11 21.49 11.94C21.49 11.42 21.07 11 20.55 11H14V9ZM4 20V11H12V5.41C12 5.06 12.15 4.79 12.35 4.59L12.7 4.94L7 10.64V20H4Z" fill="#8C8C8C"/>
                           </svg>
                           <span>{post.likes || 12}</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '12px', color: '#888' }}>
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M10 15V19C10 20.66 11.34 22 13 22C13.55 22 14 21.55 14 21V15H20C21.1 15 22 14.1 22 13V4C22 2.9 21.1 2 20 2H10C8.48 2 6.5 2.45 5.75 4.26L2.62 11.56C2.55 11.72 2.51 11.89 2.51 12.06C2.51 12.58 2.93 13 3.45 13H10V15ZM20 4V13H12V18.59C12 18.94 11.85 19.21 11.65 19.41L11.3 19.06L17 13.36V4H20Z" fill="#8C8C8C"/>
                           </svg>
                           <span>{post.dislikes || 12}</span>
                         </div>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.textContent}>
                        <p className={styles.commentText}>{title}</p>
                        <div className={styles.metaInfo}>
                          <span className={`${styles.categoryBadge} ${styles[post.category]}`}>
                            {categoryKorean}
                          </span>
                          {post.address && <span className={styles.addressText}>{post.address}</span>}
                        </div>
                      </div>
                      {imageUrl && (
                        <div className={styles.thumbnailContainer}>
                          <img src={imageUrl} alt="제보 이미지" className={styles.thumbnail} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Map Area */}
        <main className={styles.mapSection}>
          <div className={styles.mapFilterContainer}>
            <button 
              className={`${styles.filterBtn} ${isFilterOpen ? styles.active : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.5 14H8.5V11.67H5.5V14ZM0.5 0V2.33H13.5V0H0.5ZM2.5 8.17H11.5V5.83H2.5V8.17Z" fill="currentColor"/>
              </svg>
              <span>{selectedFilter === '전체' ? '필터' : selectedFilter}</span>
            </button>
            
            {isFilterOpen && (
              <div className={styles.filterDropdown}>
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`${styles.dropdownItem} ${selectedFilter === option ? styles.selected : ''}`}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsFilterOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.mapControls}>
            <button className={styles.controlBtn} onClick={() => handleZoom(-1)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#525252"/>
              </svg>
            </button>
            <button className={styles.controlBtn} onClick={() => handleZoom(1)}>
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                <path d="M0 0H14V2H0V0Z" fill="#525252"/>
              </svg>
            </button>
            <button className={styles.controlBtn} onClick={handleCurrentLocation}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C5.24 0 3 2.24 3 5C3 8.5 8 15 8 15C8 15 13 8.5 13 5C13 2.24 10.76 0 8 0ZM8 6.5C7.17 6.5 6.5 5.83 6.5 5C6.5 4.17 7.17 3.5 8 3.5C8.83 3.5 9.5 4.17 9.5 5C9.5 5.83 8.83 6.5 8 6.5Z" fill="#525252"/>
              </svg>
            </button>
          </div>

          <div ref={mapContainer} className={styles.mapContainer}>
            {!isMapLoaded && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666'
              }}>
                지도를 불러오는 중...
              </div>
            )}
          </div>

          <div className={styles.mapFooter}>
            <button className={styles.footerBtn} onClick={() => navigate('/reportform')}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L12.5 7.5H20L14 12L16.5 19.5L10 15L3.5 19.5L6 12L0 7.5H7.5L10 0Z" fill="#525252"/>
              </svg>
              <span>제보하기</span>
            </button>
            <button className={styles.footerBtn} onClick={() => navigate('/scenario/create')}>
              <svg width="20" height="24" viewBox="0 0 15 20" fill="none">
                <path d="M12 0H3C1.9 0 1 0.9 1 2V18C1 19.1 1.9 20 3 20H12C13.1 20 14 19.1 14 18V2C14 0.9 13.1 0 12 0ZM7.5 1.5C8.05 1.5 8.5 1.95 8.5 2.5C8.5 3.05 8.05 3.5 7.5 3.5C6.95 3.5 6.5 3.05 6.5 2.5C6.5 1.95 6.95 1.5 7.5 1.5ZM7.5 18.5C6.67 18.5 6 17.83 6 17C6 16.17 6.67 15.5 7.5 15.5C8.33 15.5 9 16.17 9 17C9 17.83 8.33 18.5 7.5 18.5Z" fill="#525252"/>
              </svg>
              <span>시나리오 생성</span>
            </button>
            <button className={styles.footerBtn} onClick={handleSafetyGuideClick}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M9 5H11V11H9V5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 13H11V15H9V13Z" fill="#525252"/>
              </svg>
              <span>안전 가이드</span>
            </button>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {isGuideLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>맞춤형 안전 가이드 생성 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};