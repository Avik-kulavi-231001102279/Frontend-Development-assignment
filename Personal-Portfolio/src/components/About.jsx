import { useEffect, useRef } from 'react';
import { User, Target, Code, Rocket } from 'lucide-react';
import '../styles/Sections.css';

const stats = [
  { icon: <Rocket size={22} />, value: '10+', label: 'Projects' },
  { icon: <Code size={22} />, value: '10+', label: 'Technologies' },
  { icon: <Target size={22} />, value: '∞', label: 'Learning' },
];

function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section--visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="section__container">
        {/* Section heading */}
        <div className="section__header">
          <span className="section__tag">
            <User size={14} /> About Me
          </span>
          <h2 className="section__title">Get to Know Me</h2>
          <p className="section__subtitle">A brief introduction about who I am and what I do</p>
        </div>

        {/* Content grid */}
        <div className="about__grid">
          {/* Text side */}
          <div className="about__text">
            <p>
              I'm <strong>Avik Kulavi</strong>, a passionate BCA student at{' '}
              <strong>Techno India University, Kolkata</strong>. I specialize in
              building modern, interactive web applications using React.js and
              the MERN stack.
            </p>
            <p>
              My journey in tech started with curiosity about how websites work,
              and has since evolved into a deep passion for frontend development,
              UI/UX design, and creating seamless digital experiences.
            </p>
            <p>
              I believe in continuous learning and enjoy taking on new challenges
              that push me to grow as a developer. When I'm not coding, you'll
              find me exploring new technologies, contributing to open-source, or
              working on personal projects.
            </p>
          </div>

          {/* Stats cards */}
          <div className="about__stats">
            {stats.map((stat, index) => (
              <div className="about__stat-card" key={index} style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="about__stat-icon">{stat.icon}</div>
                <div className="about__stat-value">{stat.value}</div>
                <div className="about__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
