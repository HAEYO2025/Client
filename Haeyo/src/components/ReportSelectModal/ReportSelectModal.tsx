import type { Report } from '../../types/report';
import styles from './ReportSelectModal.module.css';

interface ReportSelectModalProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelect: (report: Report) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ReportSelectModal = ({
  reports,
  selectedReportId,
  onSelect,
  onClose,
  isLoading = false,
}: ReportSelectModalProps) => {
  const handleSelectReport = (report: Report) => {
    onSelect(report);
    onClose();
  };

  const getReportTitle = (report: Report) => {
    if (!report.content) {
      return '제목 없음';
    }
    return report.content.length > 50 ? `${report.content.slice(0, 50)}...` : report.content;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>제보 선택</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#171717"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <p>제보를 불러오는 중...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className={styles.emptyState}>
              <p>선택 가능한 제보가 없습니다.</p>
            </div>
          ) : (
            <div className={styles.reportList}>
              {reports.map((report) => (
                <button
                  key={report.id}
                  className={`${styles.reportItem} ${
                    selectedReportId === report.id ? styles.selected : ''
                  }`}
                  onClick={() => handleSelectReport(report)}
                >
                  <div className={styles.reportIcon}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#FF4444"/>
                      <path d="M16 8V18M16 22V24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className={styles.reportInfo}>
                    <p className={styles.reportContent}>{getReportTitle(report)}</p>
                    <div className={styles.reportMeta}>
                      <span className={styles.reportAuthor}>{report.author.name}</span>
                    </div>
                  </div>
                  {selectedReportId === report.id && (
                    <div className={styles.checkIcon}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#171717"/>
                        <path d="M8 10L9.5 11.5L12.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
