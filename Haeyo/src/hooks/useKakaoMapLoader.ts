import { useEffect, useState } from 'react';

export const useKakaoMapLoader = () => {
  const [isLoaded, setIsLoaded] = useState(() => {
    return !!(window.kakao && window.kakao.maps && window.kakao.maps.services);
  });

  useEffect(() => {
    if (isLoaded) return;

    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    
    console.log('API 키:', apiKey);
    
    if (!apiKey) {
      console.error('API 키가 설정되지 않았습니다!');
      return;
    }

    // 이미 로드되었는지 확인 (서비스 라이브러리 포함)
    if (window.kakao?.maps?.services) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    // 새 스크립트 생성
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('스크립트 로드 성공');
      
      const checkServices = (retryCount = 0) => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            if (window.kakao.maps.services) {
              console.log('지도 API 및 서비스 라이브러리 초기화 완료');
              setIsLoaded(true);
            } else if (retryCount < 10) {
              console.log(`서비스 라이브러리 대기 중... (${retryCount + 1}/10)`);
              setTimeout(() => checkServices(retryCount + 1), 100);
            } else {
              console.error('서비스 라이브러리 로드 실패');
              // 서비스는 없어도 지도는 로드되었으므로 true로 설정할지 고민...
              // 하지만 우리 앱은 서비스가 필수이므로 일단 false 유지 혹은 에러 처리
              setIsLoaded(true); // 에러가 나더라도 지도는 띄우기 위해 true 설정
            }
          });
        }
      };

      checkServices();
    };

    script.onerror = () => {
      console.error('스크립트 로드 실패');
      console.error('URL:', script.src);
    };

    console.log('새 스크립트 추가');
    document.head.appendChild(script);

    // cleanup 함수
    return () => {
      console.log('cleanup 실행');
    };
  }, [isLoaded]);

  return isLoaded;
};