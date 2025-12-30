import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { useKakaoMapLoader } from '../../hooks/useKakaoMapLoader';
import { isAuthenticated, getCurrentUser, logout } from '../../api/auth';
import styles from './HomeMobile.module.css';

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
}

export const HomeMobile = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isFabOpen, setIsFabOpen] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const isMapLoaded = useKakaoMapLoader();

  const filterOptions = ['전체', '위험', '생물', '쓰레기'];
  
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      navigate('/home');
    }
  };
  const mapMarkers: MapMarker[] = useMemo(() => {
    return posts.map((post: Post) => ({
      id: post.id,
      lat: post.latitude,
      lng: post.longitude
    }));
  }, [posts]);

  const handlePostClick = useCallback((postId: number) => {
    navigate(`/report/${postId}`);
  }, [navigate]);
 

  useEffect(() => {
    if (!isMapLoaded || !window.kakao || !mapContainer.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756), // 부산
        level: 7
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      mapMarkers.forEach(markerPos => {
        const position = new window.kakao.maps.LatLng(markerPos.lat, markerPos.lng);

        const content = document.createElement('div');
        content.className = styles.marker; // Reusing .marker from HomeMobile.module.css
        content.innerText = markerPos.id.toString();
        content.onclick = () => handlePostClick(markerPos.id);
        
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: content,
          yAnchor: 0.5
        });

        customOverlay.setMap(map);
      });
    } catch (error) {
      console.error('Mobile Map init error:', error);
    }
  }, [isMapLoaded, handlePostClick, mapMarkers]);

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
        () => alert('현재 위치를 가져올 수 없습니다.')
      );
    } else {
      alert('위치 서비스를 지원하지 않습니다.');
    }
  };

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.menuBtn}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="#171717"/>
          </svg>
        </button>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Haeyo Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>해요</span>
        </div>
        <div className={styles.headerRight}>
          {isLoggedIn && currentUser ? (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser.userId}님</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>로그인</button>
          )}
          <button className={styles.notificationBtn}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M8 18C9.1 18 10 17.1 10 16H6C6 17.1 6.9 18 8 18ZM14 12V7.5C14 4.93 12.37 2.77 10 2.21V1.5C10 0.67 9.33 0 8.5 0C7.67 0 7 0.67 7 1.5V2.21C4.64 2.77 3 4.92 3 7.5V12L1 14V15H16V14L14 12Z" fill="#171717"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Map Section */}
        <div className={styles.mapSection}>
          <div ref={mapContainer} className={styles.mapPlaceholder}>
            {!isMapLoaded && <span className={styles.mapText}>지도를 불러오는 중...</span>}
          </div>

          {/* Filter button */}
          <div className={styles.filterContainer}>
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
          
          {/* Map controls */}
          <div className={styles.mapControls}>
            <button className={styles.controlBtn} onClick={() => handleZoom(-1)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#171717"/>
              </svg>
            </button>
            <button className={styles.controlBtn} onClick={() => handleZoom(1)}>
              <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                <path d="M0 0H14V2H0V0Z" fill="#171717"/>
              </svg>
            </button>
            <button className={styles.controlBtn} onClick={handleCurrentLocation}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C5.24 0 3 2.24 3 5C3 8.5 8 15 8 15C8 15 13 8.5 13 5C13 2.24 10.76 0 8 0ZM8 6.5C7.17 6.5 6.5 5.83 6.5 5C6.5 4.17 7.17 3.5 8 3.5C8.83 3.5 9.5 4.17 9.5 5C9.5 5.83 8.83 6.5 8 6.5Z" fill="#171717"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn} onClick={() => navigate('/reportform')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L12.5 7.5H20L14 12L16.5 19.5L10 15L3.5 19.5L6 12L0 7.5H7.5L10 0Z" fill="#525252"/>
              </svg>
              <span>제보하기</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/scenario/create')}>
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M12 0H3C1.9 0 1 0.9 1 2V18C1 19.1 1.9 20 3 20H12C13.1 20 14 19.1 14 18V2C14 0.9 13.1 0 12 0ZM7.5 1.5C8.05 1.5 8.5 1.95 8.5 2.5C8.5 3.05 8.05 3.5 7.5 3.5C6.95 3.5 6.5 3.05 6.5 2.5C6.5 1.95 6.95 1.5 7.5 1.5ZM7.5 18.5C6.67 18.5 6 17.83 6 17C6 16.17 6.67 15.5 7.5 15.5C8.33 15.5 9 16.17 9 17C9 17.83 8.33 18.5 7.5 18.5Z" fill="#525252"/>
              </svg>
              <span>시나리오 생성</span>
            </button>
            <button className={styles.actionBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 5H11V11H9V5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 13H11V15H9V13Z" fill="#525252"/>
              </svg>
              <span>안전 가이드</span>
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className={styles.reportsSection}>
          <div className={styles.sectionHeader}>
            <h2>최근 제보</h2>
            <button className={styles.moreBtn} onClick={() => navigate('/community')}>더보기</button>
          </div>
          
          {isLoading ? (
            <div className={styles.loadingState}>
              <p>제보를 불러오는 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>최근 제보가 없습니다.</p>
            </div>
          ) : (
            <div className={styles.reportsList}>
              {posts.map((post: Post) => (
                <div 
                  key={post.id} 
                  className={styles.reportCard}
                  onClick={() => handlePostClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.reportAvatar}>
                    👤
                  </div>
                  <div className={styles.reportContent}>
                    <div className={styles.reportHeader}>
                      <span className={styles.reportName}>{post.username}</span>
                      <span className={styles.reportTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.reportText}>{post.description}</p>
                    <div className={styles.reportStats}>
                      <span className={styles.stat}>
                        {post.category}
                      </span>
                      <span className={styles.stat}>
                        {post.resolved ? '해결됨' : '미해결'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navBtn} ${styles.active}`}>
          <div className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
          </div>
          <span>지도</span>
        </button>
        <button className={styles.navBtn} onClick={() => navigate('/community')}>
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
            <path d="M16 9C17.66 9 18.99 7.66 18.99 6C18.99 4.34 17.66 3 16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9ZM7 9C8.66 9 9.99 7.66 9.99 6C9.99 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM16 11C15.71 11 15.38 11.02 15.03 11.05C16.19 11.89 17 13.02 17 14.5V17H23V14.5C23 12.17 18.33 11 16 11Z" fill="#737373"/>
          </svg>
          <span>커뮤니티</span>
        </button>
        <button className={styles.navBtn}>
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
            <path d="M18 2H14.82C14.4 0.84 13.3 0 12 0C10.7 0 9.6 0.84 9.18 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2ZM14 14H7V12H14V14ZM17 10H7V8H17V10ZM17 6H7V4H17V6Z" fill="#737373"/>
          </svg>
          <span>학습</span>
        </button>
        <button className={styles.navBtn}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16C0 17.1 0.9 18 2 18H14C15.1 18 16 17.1 16 16V14C16 11.34 10.67 10 8 10Z" fill="#737373"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* Floating Action Button Wrapper */}
      <div className={styles.fabWrapper}>
        {isFabOpen && (
          <div className={styles.fabMenu}>
            <button className={styles.fabItem} onClick={() => navigate('/scenario/create')}>
              <div className={styles.fabItemCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#404040">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span className={styles.fabItemLabel}>시나리오</span>
            </button>
            <button className={styles.fabItem} onClick={() => navigate('/reportform')}>
              <div className={styles.fabItemCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#404040">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <span className={styles.fabItemLabel}>제보하기</span>
            </button>
          </div>
        )}
        <button 
          className={`${styles.fab} ${isFabOpen ? styles.active : ''}`}
          onClick={() => setIsFabOpen(!isFabOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};
