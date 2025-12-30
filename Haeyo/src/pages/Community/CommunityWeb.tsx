import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPosts } from '../../api/posts';
import { WebHeader } from '../../components/WebHeader';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import styles from './CommunityWeb.module.css';

export const CommunityWeb = () => {
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

      <FloatingActionButton />

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
