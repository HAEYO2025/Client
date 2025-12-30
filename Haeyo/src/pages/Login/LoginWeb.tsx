import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import type { LoginFormData } from '../../types/auth';
import styles from './LoginWeb.module.css';

export const LoginWeb = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // TODO: Implement login API call
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
            label="아이디"
            type="text"
            value={formData.username}
            onChange={handleChange('username')}
            placeholder="아이디를 입력하세요"
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
          
          <div className={styles.actions}>
            <Button type="submit">로그인</Button>
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
