import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { useKakaoMapLoader } from '../../hooks/useKakaoMapLoader';
import { isAuthenticated, getCurrentUser, logout } from '../../api/auth';
import styles from './HomeWeb.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
}

export const HomeWeb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  
  // 카카오 지도 로더
  const isMapLoaded = useKakaoMapLoader();

  // 로그인 상태 체크 - 페이지 방문/변경 시마다 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      const user = getCurrentUser();
      
      console.log('Auth status check:', { authStatus, user });
      
      setIsLoggedIn(authStatus);
      setCurrentUser(user);
    };

    // 초기 체크
    checkAuthStatus();

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'username') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // location 변경 시에도 체크

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      navigate('/home');
    }
  };

  const filterOptions = ['전체', '위험', '생물', '쓰레기'];

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

  // Kakao Map Initialization
  useEffect(() => {
    if (!isMapLoaded || !window.kakao || !mapContainer.current) return;

    try {
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 7
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      mapMarkers.forEach(markerPos => {
        const position = new window.kakao.maps.LatLng(markerPos.lat, markerPos.lng);

        const content = document.createElement('div');
        content.className = styles.mapMarker;
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
      console.error('지도 초기화 오류:', error);
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

  console.log('HomeWeb Render:', { isLoggedIn, currentUser });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Haeyo Logo" className={styles.anchorIcon} />
          <span className={styles.logoText}>해요</span>
        </div>
        <nav className={styles.navMenu}>
          <button className={styles.navItem} style={{fontWeight: 900}} onClick={() => handleNavigation('/home')}>지도</button>
          <button className={styles.navItem} onClick={() => handleNavigation('/community')}>커뮤니티</button>
          <button className={styles.navItem}>학습</button>
          <button className={styles.navItem}>프로필</button>
          {isLoggedIn && currentUser ? (
            <>
              <span className={styles.userName}>{currentUser.username}님</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className={styles.navBtn} onClick={() => handleNavigation('/login')}>로그인</button>
              <button className={styles.navBtn} onClick={() => handleNavigation('/signup')}>회원 가입</button>
            </>
          )}
        </nav>
      </header>

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
            ) : posts.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center' }}>최근 제보가 없습니다.</div>
            ) : (
              posts.map((post: Post) => (
                <div 
                  key={post.id} 
                  className={styles.commentItem}
                  onClick={() => handlePostClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.commentAvatar}>
                    👤
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentName}>{post.username}</span>
                      <span className={styles.commentTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.commentText}>{post.description}</p>
                    <div className={styles.commentFooter}>
                      <span className={styles.commentStat}>
                        {post.category}
                      </span>
                      <span className={styles.commentStat}>
                        {post.resolved ? '해결됨' : '미해결'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.announcementBox}>
            <div className={styles.announcementIcon}>📢</div>
            <div className={styles.announcementContent}>
              <strong>안전 안내</strong>
              <p>현재 실종과 제보를 분석한 결과,<br />A 항로로 유하하는 것이 더 안전합니다.</p>
              <button className={styles.detailBtn}>자세히 보기</button>
            </div>
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
            <button className={styles.footerBtn}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M9 5H11V11H9V5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 13H11V15H9V13Z" fill="#525252"/>
              </svg>
              <span>안전 가이드</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};