import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>제보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const [date, time] = post.createdAt.split(' ');

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Title Section */}
        <section className={styles.titleSection}>
          <div className={styles.categoryBadge}>{post.category}</div>
          <h1 className={styles.title}>{post.category} 제보</h1>
          <div className={styles.meta}>
            <span className={styles.date}>{date}</span>
            <span className={styles.time}>{time}</span>
          </div>
        </section>

        {/* Image Section */}
        {post.imageUrl && (
          <section className={styles.imagesSection}>
            <div className={styles.imageScroll}>
                <div className={styles.imageWrapper}>
                  <img src={post.imageUrl} alt="Report" className={styles.image} />
                </div>
            </div>
          </section>
        )}

        {/* Info Grid */}
        <section className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>📍</div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>위치</div>
              <div className={styles.infoValue}>{post.address}</div>
              <div className={styles.infoDetail}>상세 정보 없음</div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={styles.contentSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.subTitle}>상세 내용</h2>
            {currentUser.authenticated && currentUser.username === post.username && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff' }}
                  onClick={handleToggleResolve}
                  disabled={isActionLoading}
                >
                  {post.resolved ? '취소' : '해결'}
                </button>
                <button 
                  style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: 'none', background: '#ff4d4f', color: '#fff' }}
                  onClick={handleDelete}
                  disabled={isActionLoading}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          <div className={styles.contentText}>{post.description}</div>
        </section>

        {/* Author Section */}
        <section className={styles.authorSection}>
          <div className={styles.authorBox}>
            <div className={styles.avatar}>👤</div>
            <div className={styles.authorDetails}>
              <div className={styles.authorName}>{post.username}</div>
              <div className={styles.authorLabel}>제보자 | {post.resolved ? '해결됨' : '미해결'}</div>
            </div>
          </div>
        </section>
      </main>

      {/* Action Tabs/Footer */}
      <footer className={styles.footer}>
        <button className={styles.mainAction} onClick={() => navigate('/reportform')}>
          제보하기
        </button>
        <div className={styles.tabBar}>
          <button className={styles.tabItem} onClick={() => navigate('/scenario/create')}>
            <span className={styles.tabIcon}>🌟</span>
            <span className={styles.tabLabel}>시나리오</span>
          </button>
          <button className={styles.tabItem}>
            <span className={styles.tabIcon}>🛡️</span>
            <span className={styles.tabLabel}>안전가이드</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
