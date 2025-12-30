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
              <div style={{ padding: '20px', textAlign: 'center' }}>제보를 불러오는 중...</div>
            ) : recentPosts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>제보가 없습니다.</div>
            ) : (
              recentPosts.map((post: Post) =>   {
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
                    className={styles.communityPostCard}
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
        </div>

        {/* Popular Posts */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>신뢰도 높은 제보</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>

          <div className={styles.postsList}>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>제보를 불러오는 중...</div>
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
                    className={styles.communityPostCard}
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
