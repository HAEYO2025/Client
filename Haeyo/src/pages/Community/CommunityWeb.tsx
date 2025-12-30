import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { WebHeader } from '../../components/WebHeader';
import styles from './CommunityWeb.module.css';

export const CommunityWeb = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);

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
        // For popular posts, we can just sort by category or just use the same data for now
        // or just shuffle/slice it to look different.
        setPopularPosts([...data].reverse());
      } catch (error) {
        console.error('Failed to fetch community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // The original modal code is redundant as we have a dedicated ReportForm page.
  // We'll keep the function signature to avoid errors but redirect to the form instead.
  const handlePostSubmit = () => {
    navigate('/reportform');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <WebHeader activePage="community" />

      {/* Main Content */}
      <div className={styles.content}>
        {/* Recent Posts */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>최근 게시</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>

          <div className={styles.postsList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
            ) : recentPosts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>게시물이 없습니다.</div>
            ) : (
              recentPosts.map((post: Post) => (
                <div 
                  key={post.id} 
                  className={styles.postItem}
                  onClick={() => handleReportClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.postAvatar}>👤</div>
                  <div className={styles.postContent}>
                    <div className={styles.postHeader}>
                      <span className={styles.postName}>{post.username}</span>
                      <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.postText}>{post.description}</p>
                    <div className={styles.postFooter}>
                      <span className={styles.postStat}>{post.category}</span>
                      <span className={styles.postStat}>{post.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Posts */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>신뢰도 높은 게시</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>

          <div className={styles.postsList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
            ) : popularPosts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>게시물이 없습니다.</div>
            ) : (
              popularPosts.map((post: Post) => (
                <div 
                  key={post.id} 
                  className={styles.postItem}
                  onClick={() => handleReportClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.postAvatar}>👤</div>
                  <div className={styles.postContent}>
                    <div className={styles.postHeader}>
                      <span className={styles.postName}>{post.username}</span>
                      <span className={styles.postTime}>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.postText}>{post.description}</p>
                    <div className={styles.postFooter}>
                        <span className={styles.postStat}>{post.category}</span>
                        <span className={styles.postStat}>{post.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
            <button className={styles.fabItem} onClick={() => {
              setIsFabOpen(false);
              navigate('/reportform');
            }}>
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
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCancelBtn}
              >
                취소
              </button>
              <button
                onClick={handlePostSubmit}
                disabled={!newPost.trim()}
                className={styles.modalSubmitBtn}
              >
                게시
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};