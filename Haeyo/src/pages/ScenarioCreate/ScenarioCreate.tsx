import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Report } from '../../types/report';
import { fetchAvailableReportsForScenario } from '../../api/reports';
import { ReportSelectModal } from '../../components/ReportSelectModal';
import styles from './ScenarioCreate.module.css';

export const ScenarioCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    startDate: '2025-01-15',
    startTime: '14:30',
  });
  
  const [availableReports, setAvailableReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoadingReports(true);
        const response = await fetchAvailableReportsForScenario();
        if (response.success && response.data.length > 0) {
          setAvailableReports(response.data);
          // Default to first report
          setSelectedReport(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setIsLoadingReports(false);
      }
    };

    loadReports();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!selectedReport) {
      alert('제보를 선택해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      alert('시나리오 제목을 입력해주세요.');
      return;
    }

    if (formData.situation.length < 10) {
      alert('시나리오 상황을 최소 10자 이상 입력해주세요.');
      return;
    }

    const startDatetime = `${formData.startDate}T${formData.startTime}:00`;

    navigate('/scenario/result', {
      state: {
        selectedReport,
        scenarioTitle: formData.title,
        scenarioDescription: formData.situation,
        startDate: startDatetime,
      },
    });
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
  };

  const characterCount = formData.situation.length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 8H3.83L9.42 2.41L8 1L0 9L8 17L9.41 15.59L3.83 10H15V8Z" fill="#171717"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>시나리오 생성</h1>
      </header>

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        <div className={styles.form}>
          {/* Title Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>시나리오 제목 *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="제목을 입력해주세요"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          {/* Selected Report */}
          <div className={styles.formGroup}>
            <label className={styles.label}>제보 불러오기 *</label>
            {isLoadingReports ? (
              <div className={styles.reportCardLoading}>
                <p>제보를 불러오는 중...</p>
              </div>
            ) : selectedReport ? (
              <div className={styles.reportCard}>
                <div className={styles.reportIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#FF4444"/>
                    <path d="M16 8V18M16 22V24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className={styles.reportInfo}>
                  <p className={styles.reportContent}>{selectedReport.content}</p>
                  <p className={styles.reportAuthor}>{selectedReport.author.name}</p>
                </div>
                <button 
                  className={styles.changeBtn}
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  변경
                </button>
              </div>
            ) : (
              <div className={styles.reportCardEmpty}>
                <p>선택 가능한 제보가 없습니다.</p>
              </div>
            )}
          </div>

          {/* Situation Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>시나리오 상황 *</label>
            <textarea
              className={styles.textarea}
              placeholder={`시나리오 상황 가정 (예\n• 구명조끼 미착용\n• 심장질환\n• 적색/황색 깃발 무시`}
              value={formData.situation}
              onChange={(e) => handleChange('situation', e.target.value)}
              rows={6}
              maxLength={500}
            />
            <div className={styles.textareaFooter}>
              <span className={styles.hint}>최소 10자 이상 입력해주세요</span>
              <span className={styles.charCount}>{characterCount}/500</span>
            </div>
          </div>

          {/* Start Time Field */}
          <div className={styles.formGroup}>
            <label className={styles.label}>시나리오 시작 시간</label>
            <div className={styles.dateTimeRow}>
              <div className={styles.dateInput}>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
                <svg className={styles.inputIcon} width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="#737373"/>
                </svg>
              </div>
              <div className={styles.timeInput}>
                <input
                  type="time"
                  className={styles.input}
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
                <svg className={styles.inputIcon} width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#737373"/>
                </svg>
              </div>
            </div>
            <p className={styles.hint}>시나리오를 시작할 시간을 선택해주세요.</p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className={styles.bottomBar}>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="white" fillOpacity="0.2"/>
            <path d="M14 8L14 20M8 14L20 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          시나리오에서 생존하기
        </button>
      </div>

      {/* Report Selection Modal */}
      {isModalOpen && (
        <ReportSelectModal
          reports={availableReports}
          selectedReportId={selectedReport?.id || null}
          onSelect={handleSelectReport}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoadingReports}
        />
      )}
    </div>
  );
};
