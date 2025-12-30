import type { SafetyGuideRequest, SafetyGuideResponse } from '../types/safetyGuide';
import { getAuthHeaders } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch safety guide information
 * 
 * @param request - Safety guide request parameters
 * @returns Safety guide response
 */
export const fetchSafetyGuide = async (
  request: SafetyGuideRequest
): Promise<SafetyGuideResponse> => {
  try {
    const params = new URLSearchParams({
      latitude: request.latitude.toString(),
      longitude: request.longitude.toString(),
      date: request.date,
      data_type: request.data_type || 'tideObs',
      station_data_type: request.station_data_type || 'ObsServiceObj',
    });

    const response = await fetch(`${API_BASE_URL}/api/ocean/safety-guide?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch safety guide:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
