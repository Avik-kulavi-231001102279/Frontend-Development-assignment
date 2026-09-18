import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import '../styles/Sections.css';

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: <Github size={18} />, href: 'https://github.com/Avik-kulavi-231001102279', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://www.linkedin.com/in/avik-kulavi/', label: 'LinkedIn' },
  { icon: <Mail size={18} />, href: 'mailto:avikkulavi2005@outlook.com', label: 'Email' },
];

function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        {/* Top section */}
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#home" className="footer__logo" onClick={(e) => handleClick(e, '#home')}>
              <span className="footer__logo-bracket">&lt;</span>
              AK
              <span className="footer__logo-bracket"> /&gt;</span>
            </a>
            <p className="footer__tagline">Building the web, one component at a time.</p>
          </div>

          {/* Quick links */}
          <div className="footer__nav">
            <h4 className="footer__nav-title">Quick Links</h4>
            <ul className="footer__nav-list">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__nav-link" onClick={(e) => handleClick(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="footer__social">
            <h4 className="footer__nav-title">Connect</h4>
            <div className="footer__social-links">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider"></div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">
            Built with React & <Heart size={14} className="footer__heart" /> by Avik Kulavi
          </p>
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Avik Kulavi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
