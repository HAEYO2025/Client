/**
 * Safety Guide Request Interface
 */
export interface SafetyGuideRequest {
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 검색 기준 날짜 (YYYYMMDD) */
  date: string;
  /** KHOA 데이터 타입 */
  data_type?: string;
  /** 관측소 목록 조회용 데이터 타입 */
  station_data_type?: string;
}

/**
 * Safety Guide Response Interface
 */
export interface SafetyGuideResponse {
  success: boolean;
  data?: SafetyGuideData;
  error?: string;
}

/**
 * Safety Guide Data Interface
 */
export interface SafetyGuideData {
  location: {
    latitude: number;
    longitude: number;
  };
  date: string;
  risk_level?: string;
  risk_score?: number;
  summary?: string;
  warnings?: string[];
  recommendations?: string[];
  emergency_contacts?: string[];
  ocean_data?: {
    result?: {
      data?: Array<{
        tide_level: string;
        record_time: string;
      }>;
      meta?: {
        obs_post_id?: string;
        obs_last_req_cnt?: string;
        obs_lat?: string;
        obs_post_name?: string;
        obs_lon?: string;
      };
    };
  };
  station_info?: {
    obs_code?: string;
    obs_name?: string;
    station_latitude?: number;
    station_longitude?: number;
    distance_km?: number;
  };
}
