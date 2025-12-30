import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import type { LoginFormData } from '../../types/auth';
import styles from './LoginMobile.module.css';

export const LoginMobile = () => {
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

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
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
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleSignUpClick}
            >
              회원가입하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
