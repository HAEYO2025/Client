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
    email: '',
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="이메일"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="이메일을 입력하세요"
            required
          />
          
          <Input
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="비밀번호를 입력하세요"
            required
          />
          
          {error && <p className={styles.error}>{error}</p>}
          
          <div className={styles.actions}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
            <button 
              type="button"
              className={styles.link}
              onClick={() => navigate('/signup')}
            >
              회원가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
