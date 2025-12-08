import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Award, LogOut, ExternalLink } from 'lucide-react';
import './Certificates.css';

const Certificates = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const certificates = [
    {
      id: 'CERT-2024-001',
      courseTitle: 'React Development Masterclass',
      completionDate: '2024-12-01',
      score: 96,
      instructor: 'Dr. Alex Teacher',
      hours: 24
    },
    {
      id: 'CERT-2024-002',
      courseTitle: 'Python Programming Complete',
      completionDate: '2024-11-15',
      score: 88,
      instructor: 'Prof. Sarah Chen',
      hours: 32
    },
    {
      id: 'CERT-2024-003',
      courseTitle: 'JavaScript Advanced Techniques',
      completionDate: '2024-10-28',
      score: 92,
      instructor: 'Dr. Mike Johnson',
      hours: 28
    }
  ];

  const downloadCertificate = (certId) => {
    alert(`Downloading certificate ${certId} as PDF... (Demo)`);
  };

  const shareCertificate = (certId) => {
    alert(`Share certificate ${certId} to LinkedIn (Demo)`);
  };

  const verifyCertificate = (certId) => {
    alert(`Verify certificate at: https://iqdidactic.app/verify/${certId} (Demo)`);
  };

  return (
    <div className="certificates-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>My Certificates</h2>
            <p>{certificates.length} certificates earned</p>
          </div>
        </div>
        <nav className="header-nav">
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="certificates-main fade-in">
        <div className="certificates-grid">
          {certificates.map(cert => (
            <div key={cert.id} className="certificate-preview">
              <div className="certificate-card glass-strong">
                <div className="cert-badge">
                  <Award size={48} />
                </div>
                <div className="cert-border" />
                <div className="cert-content">
                  <div className="cert-logo">IQ DIDACTIC</div>
                  <h2>Certificate of Completion</h2>
                  <p className="cert-text">This is to certify that</p>
                  <h3 className="student-name">{user.name}</h3>
                  <p className="cert-text">has successfully completed</p>
                  <h4 className="course-name">{cert.courseTitle}</h4>
                  <div className="cert-details">
                    <div className="detail-item">
                      <span className="detail-label">Completion Date</span>
                      <span className="detail-value">{cert.completionDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Final Score</span>
                      <span className="detail-value">{cert.score}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Hours</span>
                      <span className="detail-value">{cert.hours}h</span>
                    </div>
                  </div>
                  <div className="cert-signature">
                    <div className="signature-line">
                      <div className="signature">{cert.instructor}</div>
                      <div className="signature-title">Course Instructor</div>
                    </div>
                  </div>
                  <div className="cert-footer">
                    <p className="cert-id">Certificate ID: {cert.id}</p>
                  </div>
                </div>
              </div>
              <div className="certificate-actions">
                <button className="btn btn-primary" onClick={() => downloadCertificate(cert.id)}>
                  <Download size={16} />
                  Download PDF
                </button>
                <button className="btn btn-secondary" onClick={() => shareCertificate(cert.id)}>
                  <Share2 size={16} />
                  Share to LinkedIn
                </button>
                <button className="btn btn-secondary" onClick={() => verifyCertificate(cert.id)}>
                  <ExternalLink size={16} />
                  Verify
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Certificates;