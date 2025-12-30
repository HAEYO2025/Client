import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/posts';
import type { PostCategory } from '../../types/post';
import styles from './ReportFormMobile.module.css';
import { LocationSelectModal } from './LocationSelectModal';

export const ReportFormMobile = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('서울특별시 강남구 역삼동');
  const [locationDetail, setLocationDetail] = useState('테헤란로 123');
  const [coordinates, setCoordinates] = useState({ lat: 37.5665, lng: 126.9780 });
  const [date, setDate] = useState('2025-01-15');
  const [time, setTime] = useState('14:30');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const categories = [
    '카테고리를 선택해주세요',
    '위험',
    '생물',
    '쓰레기',
    '기타'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length <= 3) {
        setImages([...images, ...newImages]);
      } else {
        alert('최대 3장까지 업로드 가능합니다.');
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSelectLocation = (addressData: any) => {
    setLocation(addressData.address);
    setLocationDetail(addressData.detailAddress);
    setCoordinates({
      lat: addressData.lat,
      lng: addressData.lng
    });
  };

  const handleSubmit = async () => {
    if (!category || category === '카테고리를 선택해주세요') {
      alert('카테고리를 선택해주세요');
      return;
    }
    if (!title.trim()) {
      alert('제보 제목을 입력해주세요');
      return;
    }
    if (!content.trim() || content.length < 10) {
      alert('세부 내용을 최소 10자 이상 입력해주세요');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let base64Image = '';
      if (images.length > 0) {
        base64Image = await fileToBase64(images[0]);
      }

      const categoryMap: Record<string, PostCategory> = {
        '위험': 'DAMAGE',
        '생물': 'ANIMAL',
        '쓰레기': 'TRASH',
        '기타': 'OTHER'
      };

      await createPost({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        category: (categoryMap[category] || 'OTHER') as PostCategory,
        description: `${title}\n\n${content}`,
        imageBase64: base64Image,
        address: `${location} ${locationDetail}`.trim()
      });

      alert('제보가 성공적으로 제출되었습니다!');
      navigate('/home');
    } catch (error) {
      console.error('제보 제출 실패:', error);
      alert('제보 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
          </svg>
        </button>
        <h1 className={styles.title}>제보하기</h1>
        <div style={{ width: '24px' }}></div>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>사진 첨부</h3>
          <div className={styles.imageUploadContainer}>
            <label className={styles.imageUploadBtn}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#999"/>
              </svg>
              <span>사진 추가</span>
            </label>

            {images.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
                <button 
                  className={styles.removeImageBtn}
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className={styles.helperText}>최대 3장까지 업로드 가능합니다</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            카테고리 선택 <span className={styles.required}>*</span>
          </h3>
          <select 
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            제보 제목 <span className={styles.required}>*</span>
          </h3>
          <input
            type="text"
            className={styles.input}
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            위치 정보 <span className={styles.required}>*</span>
          </h3>
          <div className={styles.locationBox}>
            <div className={styles.locationInfo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#333"/>
              </svg>
              <div>
                <p className={styles.locationMain}>{location}</p>
                <p className={styles.locationSub}>{locationDetail}</p>
              </div>
            </div>
            <button 
              className={styles.changeBtn}
              onClick={() => setIsLocationModalOpen(true)}
            >
              변경
            </button>
          </div>
          <button 
            className={styles.mapSelectBtn}
            onClick={() => setIsLocationModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20.5 3L20.34 3.03L15 5.1L9 3L3.36 4.9C3.15 4.97 3 5.15 3 5.38V20.5C3 20.78 3.22 21 3.5 21L3.66 20.97L9 18.9L15 21L20.64 19.1C20.85 19.03 21 18.85 21 18.62V3.5C21 3.22 20.78 3 20.5 3ZM15 19L9 16.89V5L15 7.11V19Z" fill="#666"/>
            </svg>
            지도에서 위치 선택
          </button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            세부 제목 내용 <span className={styles.required}>*</span>
          </h3>
          <textarea
            className={styles.textarea}
            placeholder="제보 내용을 상세히 작성해주세요 (최소 10자 이상)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
          <div className={styles.charCount}>
            <span className={styles.helperText}>최소 10자 이상 입력해주세요</span>
            <span>{content.length}/500</span>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>제보 시간</h3>
          <div className={styles.dateTimeContainer}>
            <div className={styles.dateInput}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="#666"/>
              </svg>
            </div>
            <div className={styles.timeInput}>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#666"/>
              </svg>
            </div>
          </div>
          <p className={styles.helperText}>발견한 시간을 입력해주세요</p>
        </section>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.submitBtn} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
          </svg>
          {isSubmitting ? '제출 중...' : '제보하기'}
        </button>
      </div>

      <LocationSelectModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={{ 
          address: location, 
          detailAddress: locationDetail, 
          lat: coordinates.lat, 
          lng: coordinates.lng 
        }}
      />
    </div>
  );
};