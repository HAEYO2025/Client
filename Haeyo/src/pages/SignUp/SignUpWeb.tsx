import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import type { SignUpFormData } from '../../types/auth';
import { signUp } from '../../api/auth';
import styles from './SignUpWeb.module.css';

export const SignUpWeb = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
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
      const response = await signUp(formData);
      console.log('Sign up success:', response);
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SignUpFormData) => (
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
        <h1 className={styles.title}>회원가입</h1>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="아이디"
            type="text"
            value={formData.username}
            onChange={handleChange('username')}
            placeholder="아이디를 입력하세요"
            required
          />

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
          {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
          
          <div className={styles.actions}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '가입 중...' : '가입'}
            </Button>
            <button 
              type="button"
              className={styles.link}
              onClick={() => navigate('/login')}
            >
              로그인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
