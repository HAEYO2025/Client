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
