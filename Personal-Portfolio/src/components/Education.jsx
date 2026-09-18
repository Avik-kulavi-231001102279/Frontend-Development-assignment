import { useEffect, useRef } from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import '../styles/Sections.css';

const educationData = [
  {
    year: '2023 – 2027',
    degree: 'Bachelor of Computer Application (BCA)',
    institution: 'Techno India University, Kolkata',
    description:
      'Currently pursuing BCA with a focus on web technologies, data structures, and software engineering. Actively involved in projects and coding communities.',
  },
  {
    year: '2023',
    degree: 'Higher Secondary (12th)',
    institution: 'West Bengal Council of Higher Secondary Education',
    description:
      'Completed higher secondary education with Arts.',
  },
  {
    year: '2021',
    degree: 'Secondary (10th)',
    institution: 'West Bengal Board of Secondary Education',
    description:
      'Completed secondary education with excellent academic performance, which laid the groundwork for pursuing a career in technology.',
  },
];

function Education() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline__item--visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  /* Section-level reveal */
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

  return (
    <section id="education" className="section" ref={sectionRef}>
      <div className="section__container">
        <div className="section__header">
          <span className="section__tag">
            <GraduationCap size={14} /> Education
          </span>
          <h2 className="section__title">My Academic Journey</h2>
          <p className="section__subtitle">A timeline of my educational milestones</p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <div className="timeline__line" aria-hidden="true"></div>

          {educationData.map((item, index) => (
            <div
              className="timeline__item"
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="timeline__dot" aria-hidden="true">
                <GraduationCap size={14} />
              </div>

              <div className="timeline__card">
                <div className="timeline__year">
                  <Calendar size={13} />
                  {item.year}
                </div>
                <h3 className="timeline__degree">{item.degree}</h3>
                <p className="timeline__institution">{item.institution}</p>
                <p className="timeline__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
