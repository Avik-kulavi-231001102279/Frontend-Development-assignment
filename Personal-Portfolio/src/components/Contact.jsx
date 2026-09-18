import { useState, useEffect, useRef } from 'react';
import { Send, Mail, Phone, MapPin, Github, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/Sections.css';

const contactInfo = [
  { icon: <Mail size={20} />, label: 'Email', value: 'avikkulavi1@gmail.com', href: 'mailto:avikkulavi1@gmail.com' },
  { icon: <Phone size={20} />, label: 'Phone', value: '+91 7319105400', href: 'tel:+91 7319105400' },
  { icon: <MapPin size={20} />, label: 'Location', value: 'Newtown, Kolkata, West Bengal', href: null },
  { icon: <Github size={20} />, label: 'GitHub', value: 'Avik-kulavi-231001102279', href: 'https://github.com/Avik-kulavi-231001102279' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', value: 'LinkedIn Profile', href: 'https://www.linkedin.com/in/avik-kulavi/' },
];

function Contact() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('section--visible');
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    /* Clear error on change */
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    /* Simulate submission */
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="section" ref={sectionRef}>
      <div className="section__container">
        <div className="section__header">
          <span className="section__tag">
            <Send size={14} /> Contact
          </span>
          <h2 className="section__title">Get In Touch</h2>
          <p className="section__subtitle">Have a question or want to work together? Drop me a message!</p>
        </div>

        <div className="contact__grid">
          {/* Contact Info */}
          <div className="contact__info">
            <h3 className="contact__info-title">Let's Connect</h3>
            <p className="contact__info-text">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="contact__details">
              {contactInfo.map((item, index) => (
                <div className="contact__detail" key={index}>
                  <div className="contact__detail-icon">{item.icon}</div>
                  <div>
                    <span className="contact__detail-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact__detail-value">
                        {item.value}
                      </a>
                    ) : (
                      <span className="contact__detail-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            {submitted && (
              <div className="contact__toast contact__toast--success">
                <CheckCircle size={18} />
                Message submitted successfully!
              </div>
            )}

            <div className={`contact__field ${errors.name ? 'contact__field--error' : ''}`}>
              <label htmlFor="contact-name" className="contact__label">Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact__input"
                placeholder="Your name"
                autoComplete="name"
              />
              {errors.name && (
                <span className="contact__error">
                  <AlertCircle size={13} /> {errors.name}
                </span>
              )}
            </div>

            <div className={`contact__field ${errors.email ? 'contact__field--error' : ''}`}>
              <label htmlFor="contact-email" className="contact__label">Email</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact__input"
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className="contact__error">
                  <AlertCircle size={13} /> {errors.email}
                </span>
              )}
            </div>

            <div className={`contact__field ${errors.message ? 'contact__field--error' : ''}`}>
              <label htmlFor="contact-message" className="contact__label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact__input contact__textarea"
                placeholder="Your message..."
                rows="5"
              ></textarea>
              {errors.message && (
                <span className="contact__error">
                  <AlertCircle size={13} /> {errors.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn--primary contact__submit">
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
