import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../../types/auth';
import { login } from '../../api/auth';
import styles from './LoginMobile.module.css';

export const LoginMobile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(formData);
      console.log('Login success:', response);
      navigate('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.logoIcon}>
          <path d="M8 0L9.5 5L15 5L10.5 8.5L12 13.5L8 10.5L4 13.5L5.5 8.5L1 5L6.5 5L8 0Z" fill="#171717"/>
        </svg>
        <span className={styles.logoText}>해요</span>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.title}>로그인</h1>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              value={formData.username}
              onChange={handleChange('username')}
              placeholder=""
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange('password')}
              placeholder=""
              required
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          
          <div className={styles.signupContainer}>
            <button 
              type="button"
              className={styles.signupLink}
              onClick={handleSignUpClick}
            >
              회원가입하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
