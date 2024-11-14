import React from 'react';
import '../styles/footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 FoodTrack</p>
        
        <div className="contact-info">
          <p><strong>Teléfono:</strong> +1 (234) 567-890</p>
          <p><strong>Dirección:</strong> Unibertsitate Etorb., 24, Deusto, 48007 Bilbo, Bizkaia.</p>
        </div>
        
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebook size={30} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter size={30} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
