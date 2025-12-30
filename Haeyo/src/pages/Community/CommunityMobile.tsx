import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { BottomNavigation } from '../../components/BottomNavigation';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import styles from './CommunityMobile.module.css';

export const CommunityMobile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  
  // 제보 클릭 핸들러 추가
  const handleReportClick = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };
  
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts();
        setRecentPosts(data);
        setPopularPosts([...data].reverse());
      } catch (error) {
        console.error('Failed to fetch mobile community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePostSubmit = () => {
    navigate('/reportform');
  };

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <header className={styles.header}>
        <button className={styles.iconBtn}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="#171717"/>
          </svg>
        </button>
        <div className={styles.logo} onClick={() => navigate('/home')}>
          <img src="/logo.png" alt="Haeyo Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>해요</span>
        </div>
        <button className={styles.iconBtn}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 18C9.1 18 10 17.1 10 16H6C6 17.1 6.9 18 8 18ZM14 12V7.5C14 4.93 12.37 2.77 10 2.21V1.5C10 0.67 9.33 0 8.5 0C7.67 0 7 0.67 7 1.5V2.21C4.64 2.77 3 4.92 3 7.5V12L1 14V15H16V14L14 12Z" fill="#171717"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Recent Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>최근 제보</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>
          <div className={styles.postList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
            ) : recentPosts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>제보가 없습니다.</div>
            ) : (
              recentPosts.map((post: Post) => {
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
                
                // Extract title (first line)
                const title = post.description.split('\n')[0];

                return (
                  <div 
                    key={post.id} 
                    className={styles.postCard} 
                    onClick={() => handleReportClick(post.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.postAvatar}>👤</div>
                        <div className={styles.headerText}>
                          <span className={styles.postName}>{post.username}</span>
                          <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
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
                        <p className={styles.postText}>{title}</p>
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
        </section>

        {/* High Trust Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>신뢰도 높은 제보</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>
          <div className={styles.postList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
            ) : popularPosts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>제보가 없습니다.</div>
            ) : (
              popularPosts.map((post: Post) => {
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

                // Extract title (first line)
                const title = post.description.split('\n')[0];

                return (
                  <div 
                    key={post.id} 
                    className={styles.postCard} 
                    onClick={() => handleReportClick(post.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.postAvatar}>👤</div>
                        <div className={styles.headerText}>
                          <span className={styles.postName}>{post.username}</span>
                          <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
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
                        <p className={styles.postText}>{title}</p>
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
        </section>
      </main>

      <FloatingActionButton />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activePage="community" />
      {/* 
      <nav className={styles.bottomNav}>
        <button className={styles.navBtn} onClick={() => navigate('/home')}>
          <div className={styles.navIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
          </div>
          <span>지도</span>
        </button>
        <button className={`${styles.navBtn} ${styles.active}`} onClick={() => navigate('/community')}>
          <div className={styles.navIcon}>
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
              <path d="M16 9C17.66 9 18.99 7.66 18.99 6C18.99 4.34 17.66 3 16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9ZM7 9C8.66 9 9.99 7.66 9.99 6C9.99 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM16 11C15.71 11 15.38 11.02 15.03 11.05C16.19 11.89 17 13.02 17 14.5V17H23V14.5C23 12.17 18.33 11 16 11Z" fill="#171717"/>
            </svg>
          </div>
          <span>커뮤니티</span>
        </button>
        <button className={styles.navBtn}>
          <div className={styles.navIcon}>
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
              <path d="M18 2H14.82C14.4 0.84 13.3 0 12 0C10.7 0 9.6 0.84 9.18 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2ZM14 14H7V12H14V14ZM17 10H7V8H17V10ZM17 6H7V4H17V6Z" fill="#737373"/>
            </svg>
          </div>
          <span>학습</span>
        </button>
        <button className={styles.navBtn}>
          <div className={styles.navIcon}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16C0 17.1 0.9 18 2 18H14C15.1 18 16 17.1 16 16V14C16 11.34 10.67 10 8 10Z" fill="#737373"/>
            </svg>
          </div>
          <span>프로필</span>
        </button>
      </nav>
      */}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>새 게시물 작성</h3>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="내용을 입력하세요..."
              className={styles.modalTextarea}
            />
            <div className={styles.modalActions}>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalCancelBtn}>
                취소
              </button>
              <button onClick={handlePostSubmit} disabled={!newPost.trim()} className={styles.modalSubmitBtn}>
                게시
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
