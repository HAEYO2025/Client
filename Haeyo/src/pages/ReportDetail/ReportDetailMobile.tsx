import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Post } from '../../types/post';
import { getPostById, toggleResolvePost, deletePost, checkAuth } from '../../api/posts';
import styles from './ReportDetailMobile.module.css';

export const ReportDetailMobile = () => {
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
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>제보 상세</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      <main className={styles.main}>
        {/* Scrollable Content */}
        <div className={styles.content}>
          {post.imageUrl && (
            <div className={styles.imageSection}>
              <img src={post.imageUrl} alt="제보 이미지" className={styles.image} />
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.categoryBadge}>{post.category}</div>
            <h2 className={styles.sectionTitle}>제보 내용</h2>
            <p className={styles.description}>{post.description}</p>
          </div>

          <div className={styles.section}>
            <div className={styles.infoRow}>
              <span className={styles.label}>위치</span>
              <span className={styles.value}>{post.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>일시</span>
              <span className={styles.value}>{date} {time}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>작성자</span>
              <span className={styles.value}>{post.username}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>상태</span>
              <span className={styles.value} style={{ color: post.resolved ? '#4caf50' : '#ff9800' }}>
                {post.resolved ? '해결됨' : '미해결'}
              </span>
            </div>
          </div>

          {currentUser.authenticated && currentUser.username === post.username && (
            <div className={styles.actionSection}>
              <button 
                className={styles.actionButton}
                onClick={handleToggleResolve}
                disabled={isActionLoading}
              >
                {post.resolved ? '미해결로 변경' : '해결 완료'}
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDelete}
                disabled={isActionLoading}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
