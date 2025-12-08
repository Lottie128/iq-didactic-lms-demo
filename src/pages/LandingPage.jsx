import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Award, Users, TrendingUp, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import ThemeToggler from '../components/ThemeToggler';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video size={32} />,
      title: 'Video Lessons',
      description: 'High-quality video content from expert instructors'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Interactive Courses',
      description: 'Engage with hands-on projects and real-world examples'
    },
    {
      icon: <Award size={32} />,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements and skills'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'AI-Powered Learning',
      description: 'Personalized assistance from our AI teacher'
    },
    {
      icon: <Users size={32} />,
      title: 'Community Support',
      description: 'Connect with learners and instructors worldwide'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '500+', label: 'Expert Instructors' },
    { value: '1,200+', label: 'Video Courses' },
    { value: '95%', label: 'Success Rate' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Developer',
      image: 'S',
      text: 'IQ Didactic transformed my career! The AI teacher feature is revolutionary.'
    },
    {
      name: 'Michael Torres',
      role: 'Data Scientist',
      image: 'M',
      text: 'Best online learning platform I\'ve used. The courses are practical and engaging.'
    },
    {
      name: 'Priya Sharma',
      role: 'UX Designer',
      image: 'P',
      text: 'The certificate I earned helped me land my dream job. Highly recommend!'
    }
  ];

  return (
    <div className="landing-root">
      <div className="landing-bg" />

      {/* Header */}
      <header className="landing-header glass">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-mark glass-strong">IQ</div>
            <span className="logo-text">IQ Didactic</span>
          </div>
          <nav className="landing-nav">
            <ThemeToggler />
            <button className="nav-link" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn Anything,
            <br />
            <span className="gradient-text">Anytime, Anywhere</span>
          </h1>
          <p className="hero-subtitle">
            Master new skills with our AI-powered learning platform.
            Join thousands of students learning from expert instructors worldwide.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/signup')}>
              Start Learning Free
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/login')}>
              Explore Courses
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose IQ Didactic?</h2>
          <p>Everything you need to succeed in your learning journey</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card glass scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section glass-strong">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Start your learning journey in 3 simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds and get instant access to all courses</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Choose Course</h3>
            <p>Browse our extensive library and pick what interests you</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Start Learning</h3>
            <p>Watch videos, complete quizzes, and earn certificates</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <p>Join thousands of satisfied learners</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card glass" style={{ animationDelay: `${idx * 0.15}s` }}>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.image}</div>
                <div>
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section glass-strong">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join IQ Didactic today and unlock your potential</p>
          <div className="cta-features">
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Free to get started</span>
            </div>
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Cancel anytime</span>
            </div>
            <div className="cta-feature">
              <CheckCircle size={20} />
              <span>Certificate of completion</span>
            </div>
          </div>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/signup')}>
            Create Free Account
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-mark glass-strong">IQ</div>
              <span>IQ Didactic</span>
            </div>
            <p>Empowering learners worldwide with quality education</p>
          </div>
          <div className="footer-section">
            <h4>Platform</h4>
            <a href="#">Browse Courses</a>
            <a href="#">Become Instructor</a>
            <a href="#">AI Teacher</a>
            <a href="#">Mobile App</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 IQ Didactic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;