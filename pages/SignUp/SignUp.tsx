import { useState, FormEvent } from 'react';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SignUpFormData } from '../../types/auth';
import styles from './SignUp.module.css';

export const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Sign up data:', formData);
    // TODO: Implement sign up API call
  };

  const handleChange = (field: keyof SignUpFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleLoginClick = () => {
    // TODO: Navigate to login page
    console.log('Navigate to login');
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <h1 className={styles.title}>회원가입</h1>
        
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
            <Button type="submit">가입</Button>
            <Button 
              type="button" 
              variant="secondary"
              onClick={handleLoginClick}
            >
              로그인하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
