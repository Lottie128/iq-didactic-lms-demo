import React, { useState, useEffect } from 'react';
import { Award, Download, Calendar, ExternalLink, Loader, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { certificateAPI, courseAPI } from '../services/api';

const Certificates = ({ user, onLogout }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateAPI.getUserCertificates();
      setCertificates(response.data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (courseId) => {
    try {
      setGenerating(courseId);
      await certificateAPI.generateCertificate(courseId);
      await loadCertificates();
    } catch (error) {
      alert(error.message || 'Failed to generate certificate');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = (certificate) => {
    // In production, this would download the actual PDF
    alert(`Certificate ${certificate.certificateNumber} downloaded!`);
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader className="spin" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h1>My Certificates 🎓</h1>
          <p>Download and share your course completion certificates</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <Award size={24} color="#22c55e" />
          </div>
          <div>
            <p className="stat-value">{certificates.length}</p>
            <p className="stat-label">Certificates Earned</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <CheckCircle size={24} color="#3b82f6" />
          </div>
          <div>
            <p className="stat-value">{certificates.length}</p>
            <p className="stat-label">Courses Completed</p>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="glass" style={{ padding: '80px 20px', textAlign: 'center', borderRadius: '16px' }}>
          <Award size={64} style={{ opacity: 0.2, marginBottom: '24px' }} />
          <h3 style={{ marginBottom: '12px' }}>No Certificates Yet</h3>
          <p style={{ opacity: 0.6, marginBottom: '24px' }}>Complete courses to earn your first certificate!</p>
        </div>
      ) : (
        <div className="certificates-grid">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="certificate-card glass scale-in">
              <div className="certificate-header">
                <div className="certificate-badge">
                  <Award size={32} color="#fbbf24" />
                </div>
                <div className="certificate-seal">Verified</div>
              </div>

              <div className="certificate-content">
                <h3>{certificate.Course?.title || 'Course Certificate'}</h3>
                <p className="certificate-meta">
                  <Calendar size={14} />
                  Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="certificate-number">#{certificate.certificateNumber}</p>
              </div>

              <div className="certificate-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(certificate)}
                  style={{ flex: 1 }}
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => window.open(`/certificates/${certificate.id}`, '_blank')}
                >
                  <ExternalLink size={16} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Certificates;