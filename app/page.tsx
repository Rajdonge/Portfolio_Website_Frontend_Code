'use client'
import Image from 'next/image';
import '../public/css/header.css';
import '../public/css/body.css';
import '../public/css/about.css';
import '../public/css/contact.css';
import '../public/css/portfolio.css';
import '../public/css/footer.css';
import '../public/css/cv.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../public/config/constants';
import defaultLogo from '../public/images/logo.png';
import defaultBanner from '../public/images/Pic.jpg';

library.add(faLinkedin, faFacebook, faGithub, faBars, faTimes, faEye, faDownload);

type SocialMediaLinks = {
  facebook: string;
  github: string;
  linkedin: string;
};

type Project = {
  id: number;
  project_title: string;
  project_description: string;
  project_image: string;
};

type SubmissionStatus = 'success' | 'error' | null;


export default function Home() {

  const [activeLink, setActiveLink] = useState("#home")
  const [charCount, setCharCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const scrollToSection = (id: string)=> {
    const section = document.getElementById(id);
    if(section) {
      section.scrollIntoView({behavior: 'smooth'});
      setActiveLink(`#${id}`);
      setIsMenuOpen(false);
    }
  };

  useEffect(()=> {
    const fetchLogo = async () => {
      try{
        const response = await axios.get(`${API_BASE_URL}logo/`);
        if (response.data.logo_url) {
          setLogoUrl(response.data.logo_url);
        } 
      } catch (error) {
        console.error('Error fetching logo: ', error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}cv/`);
        setCvUrl(response.data.cv_url);
      } catch (error) {
        setError('Failed to fetch CV.');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);


  useEffect(()=> {
    const fetchBanner = async () => {
      try{
        const response = await axios.get(`${API_BASE_URL}banner/`);
        if (response.data.banner_url) {
          setBannerUrl(response.data.banner_url);
        }
      } catch (error) {
        console.error('Error fetching banner: ', error);
      }
    };
    fetchBanner();
  }, []);


  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}social-media/`);
        setSocialMedia(response.data);
      } catch (error) {
        setError('Failed to fetch social media links.');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}projects/`);
        setProjects(response.data);
      } catch (error) {
        setError('Failed to fetch projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Handle input changes for all fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update character count for the message field
    if (name === 'visitor_message') {
      setCharCount(value.length);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}enquiry/`, formData);

      if (response.status === 200 || response.status === 201) {
        setSubmissionStatus('success');
        setFormData({ visitor_name: '', visitor_email: '', visitor_message: '' }); // Fix the typo here
        setCharCount(0);
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error submitting form:', error);
    }
  };


  return (
    <>
      {/* Header Section */}
      <div className="header_section">
        <div className="container">
          <nav className="navbar">
            {/* Logo Container */}
            <div className="logo-container">
              {logoUrl ? ( // Only render the Image if logoUrl is valid
                <img
                  src={logoUrl || '../public/images/logo.png'}
                  alt="logo"
                  className="logo"
                  width={100} // Set appropriate width
                  height={50} // Set appropriate height
                />
              ) : (
                <p>Loading logo...</p> // Optional: Display a loading message or placeholder
              )}
            </div>

            {/* Navigation Links */}
            <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <a
                href="/"
                className={activeLink == "#home" ? "active" : ""}
                onClick={() => setActiveLink("#home")}
              >
                Home
              </a>
              <a
                href="#about-section"
                className={activeLink == "#about-section" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about-section");
                }}
              >
                About
              </a>
              <a
                href="#portfolio-section"
                className={activeLink == "#portfolio-section" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("portfolio-section");
                }}
              >
                Portfolio
              </a>
              <a
                href="#contact-section"
                className={activeLink == "#contact-section" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact-section");
                }}
              >
                Contact
              </a>
            </div>

            {/* Menu Icon */}
            <div className="menu-icon" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </div>

            {/* Close Icon */}
            <div
              className={`close-icon ${isMenuOpen ? "open" : ""}`}
              onClick={toggleMenu}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </div>
          </nav>
        </div>
      </div>

      {/* Body Section */}
      <div className="body-container">
        <div className="home-section">
          <div className="intro-container">
            {/* Social Icons */}
            <div className="social-icon">
              <a
                href={socialMedia?.linkedin || 'https://www.linkedin.com/in/rajdonge/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} size="1x" />
              </a>
              <a
                href={socialMedia?.github || 'https://github.com/Rajdonge'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} size="1x" />
              </a>
              <a
                href={socialMedia?.facebook || 'https://www.facebook.com/RajdongeDhimalBibek'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} size="1x" />
              </a>
            </div>

            {/* Introduction Text */}
            <div className="intro-text">
              <p className="intro-title">I'm a Software Developer</p>
              <p className="intro-name">Bibek Dhimal</p>
              <p className="intro-desc">
                Passionate about building scalable and user-friendly
                applications using Django and React Native. I specialize in
                backend API development with Django REST Framework and mobile
                app development with Expo.
              </p>
            </div>

            {/* Profile Image */}
            <div className="intro-img">
            {bannerUrl ? ( // Only render the Image if logoUrl is valid
                <img
                  src={bannerUrl}
                  alt="banner"
                  className="profile-img"
                  width={100} // Set appropriate width
                  height={50} // Set appropriate height
                />
              ) : (
                <p>Loading banner...</p> // Optional: Display a loading message or placeholder
              )}
            </div>
          </div>
        </div>

        <section id="cv-section">
          {cvUrl ? (
            <div className='cv-buttons'>
              <a href={cvUrl || '../public/images/Bibek Dhimal_Software Developer.pdf'}
                target='_blank'
              rel='noopener noreferrer'
              className='cv-link'
              >
                View or Download CV
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </div>
          ) : (<p>No CV available</p>)}
        </section>

        <section id="about-section">
          <h2>About me</h2>
          <p>
            I’m Bibek Dhimal, a Software Developer passionate about building
            scalable and user-friendly applications. With expertise in Django
            REST Framework for backend API development and React Native (Expo)
            for mobile applications, I focus on creating seamless and efficient
            digital experiences.
          </p>
          <h2>My Approach</h2>
          <p>
            I believe that technology should simplify and enhance everyday life.
            My approach to development is centered around:
          </p>
          <li>
            Performance & Scalability – Ensuring applications run smoothly and
            grow with demand.
          </li>
          <li>
            User-Centric Design – Crafting intuitive experiences that engage
            users.
          </li>
          <li>
            Clean & Maintainable Code – Writing efficient, reusable, and
            well-documented code.
          </li>
          <h2>What I Do</h2>
          <li>
            Backend Development – Building secure and scalable APIs using Django
            & Django REST Framework.
          </li>
          <li>
            Mobile App Development – Creating cross-platform mobile apps with
            React Native (Expo).
          </li>
          <li>
            Full-Stack Solutions – Integrating frontend and backend for
            complete, high-quality applications.
          </li>
          <p>
            I’m always exploring new technologies and pushing the boundaries of
            what’s possible in software development. Whether it’s an innovative
            mobile app or a powerful API, I strive to deliver solutions that
            make a difference. 🚀 Let’s build something amazing together!
          </p>
        </section>

        <section id="portfolio-section">
      <h2>Portfolio</h2>
      <p>Check out some of my recent projects.</p>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div className="portfolio-item" key={project.id}>
            <img src={project.project_image} alt={project.project_title} />
            <h3>{project.project_title}</h3>
            <p>{project.project_description}</p>
          </div>
        ))}
      </div>
    </section>

        {/* Contact Section */}
<section id="contact-section">
  <h1>Contact</h1>
  <form id="contact-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="visitor_name">Enter your name</label>
      <input
        type="text"
        id="visitor_name"
        name="visitor_name"
        placeholder="Your Name"
        value={formData.visitor_name}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="visitor_email">Enter email address</label>
      <input
        type="email"
        id="visitor_email"
        name="visitor_email"
        placeholder="Your Email"
        value={formData.visitor_email}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="visitor_message">Enter your message</label>
      <textarea
        id="visitor_message"
        name="visitor_message"
        placeholder="Your Message"
        value={formData.visitor_message}
        onChange={handleInputChange}
        maxLength={1000}
        required
      ></textarea>
      <span id="char-count">{charCount} of 1000 max characters.</span>
    </div>
    <button type="submit">Send Message</button>
  </form>

  {/* Display submission status */}
  {submissionStatus === 'success' && (
    <p className="success-message">Message sent successfully!</p>
  )}
  {submissionStatus === 'error' && (
    <p className="error-message">Failed to send message. Please try again.</p>
  )}

  <div className="contact-info">
    <p>+977 9810184342</p>
    <p>Monday - Friday from 7am - 5pm</p>
    <p>Damak, Jhapa, Nepal</p>
    <p>www.bibekdhimal.com</p>
  </div>
</section>

        {/* Footer Section */}
        <footer className="footer-section">
          <div className="footer-container">
            {/* Social Media Links */}
            <div className="footer-social">
              <a
                href={socialMedia?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} size="1x" />
              </a>
              <a
                href={socialMedia?.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} size="1x" />
              </a>
              <a
                href={socialMedia?.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} size="1x" />
              </a>
            </div>

            {/* Copyright Information */}
            <div className="footer-copyright">
              <p>
                &copy; {new Date().getFullYear()} Bibek Dhimal. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
