import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Post } from '../../types/post';
import { getPostById, toggleResolvePost, deletePost, checkAuth } from '../../api/posts';
import styles from './ReportDetailWeb.module.css';



export const ReportDetailWeb = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<{ authenticated: boolean; username?: string }>({ authenticated: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [postData, authData] = await Promise.all([
          getPostById(Number(id)),
          checkAuth()
        ]);
        setPost(postData);
        setCurrentUser(authData);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleToggleResolve = async () => {
    if (!id || isActionLoading) return;
    try {
      setIsActionLoading(true);
      const updatedPost = await toggleResolvePost(id);
      setPost(updatedPost);
      alert(updatedPost.resolved ? '해결 완료로 변경되었습니다.' : '미해결 상태로 변경되었습니다.');
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isActionLoading) return;
    if (!window.confirm('정말로 이 제보를 삭제하시겠습니까?')) return;

    try {
      setIsActionLoading(true);
      await deletePost(id);
      alert('제보가 삭제되었습니다.');
      navigate('/home');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>제보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const [date, time] = post.createdAt.split(' ');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>
          제보 상세<br />
          <span className={styles.headerSubtitle}>{post.category}</span>
        </h1>
        <div className={styles.headerSpacer}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          {post.imageUrl && (
            <div className={styles.imagesSection}>
                <div className={styles.imageBox}>
                  <img src={post.imageUrl} alt="제보 이미지" className={styles.image} />
                </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>카테고리</h3>
            <div className={styles.categoryBox}>
              {post.category}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.locationBox}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.locationIcon}>
                <path d="M10 0C6.55 0 3.75 2.8 3.75 6.25C3.75 10.625 10 18.75 10 18.75C10 18.75 16.25 10.625 16.25 6.25C16.25 2.8 13.45 0 10 0ZM10 8.125C8.9625 8.125 8.125 7.2875 8.125 6.25C8.125 5.2125 8.9625 4.375 10 4.375C11.0375 4.375 11.875 5.2125 11.875 6.25C11.875 7.2875 11.0375 8.125 10 8.125Z" fill="currentColor"/>
              </svg>
              <div className={styles.locationText}>
                <div className={styles.locationAddress}>{post.address}</div>
                <div className={styles.locationDetail}>상세 정보 없음</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionLabel}>제보 시간</h3>
            <div className={styles.dateTimeRow}>
              <div className={styles.dateBox}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                  <path d="M16 2H15V0H13V2H7V0H5V2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM16 18H4V7H16V18Z" fill="#999"/>
                </svg>
                <span>{date}</span>
              </div>
              <div className={styles.timeBox}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="#999"/>
                </svg>
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.contentBox}>
            <h3 className={styles.contentLabel}>제보 내용</h3>
            <div className={styles.contentText}>
              {post.description}
            </div>
            <div style={{ marginTop: '20px', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>작성자: {post.username} | 상태: {post.resolved ? '해결됨' : '미해결'}</div>
              {currentUser.authenticated && currentUser.username === post.username && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                    onClick={handleToggleResolve}
                    disabled={isActionLoading}
                  >
                    {post.resolved ? '미해결로 변경' : '해결 완료'}
                  </button>
                  <button 
                    style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: '#ff4d4f', color: '#fff', cursor: 'pointer' }}
                    onClick={handleDelete}
                    disabled={isActionLoading}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.actionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
          </svg>
          제보하기
        </button>
        <button className={styles.actionButton} onClick={() => navigate('/scenario/create')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z"/>
          </svg>
          시나리오 생성
        </button>
        <button className={styles.actionButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"/>
          </svg>
          안전 가이드
        </button>
      </div>
    </div>
  );
};
