import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import type { LoginFormData } from '../../types/auth';
import { login } from '../../api/auth';
import styles from './LoginWeb.module.css';

export const LoginWeb = () => {
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

    console.log('=== LOGIN FORM SUBMIT ===');
    console.log('Submitting login with:', formData.username);

    try {
      const response = await login(formData);
      console.log('Login API response:', response);

      if (response.success) {
        console.log('✅ Login successful, verifying localStorage...');

        // localStorage 저장 확인
        const savedToken = localStorage.getItem('authToken');
        const savedUsername = localStorage.getItem('username');
        const savedUserId = localStorage.getItem('userId');

        console.log('Verification:');
        console.log('- authToken:', savedToken ? 'EXISTS' : 'MISSING');
        console.log('- username:', savedUsername || 'MISSING');
        console.log('- userId:', savedUserId || 'MISSING');

        if (!savedToken) {
          console.error('❌ authToken not found in localStorage after login!');
          setError('로그인 정보 저장에 실패했습니다. 다시 시도해주세요.');
          setIsLoading(false);
          return;
        }

        if (!savedUsername) {
          console.warn('⚠️ username not found, but token exists');
        }

        console.log('✅ localStorage verified, navigating to home...');

        // localStorage 저장이 완료되도록 약간의 지연
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 100);

      } else {
        const errorMsg = response.message || '로그인에 실패했습니다.';
        console.error('Login failed:', errorMsg);
        setError(errorMsg);
        alert(errorMsg);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error caught:', err);
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      alert(errorMessage);
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

  return (
    <div className={styles['page-container']}>
      <div className={styles['form-container']}>
        <div className={styles['form-box']}>
          <h2 className={styles['form-title']}>로그인</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="아이디"
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange('username')}
              required
            />

            <Input
              label="비밀번호"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
            />

            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          <div className={styles['link-container']}>
            <Button 
              variant="secondary"
              onClick={() => navigate('/signup')} 
              className={styles['link-btn']}
            >
              회원가입하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
