import { useEffect, useRef, useState } from 'react';
import { Cpu } from 'lucide-react';
import '../styles/Sections.css';

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'React.js', level: 75 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 60 },
      { name: 'Express.js', level: 55 },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'MongoDB', level: 55 },
      { name: 'MySQL', level: 50 },
    ],
  },
  {
    title: 'Programming',
    skills: [
      { name: 'Python', level: 65 },
      { name: 'JavaScript', level: 80 },
      { name: 'C', level: 60 },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', level: 70 },
      { name: 'GitHub', level: 75 },
      { name: 'VS Code', level: 90 },
    ],
  },
];

function SkillBar({ name, level, animate }) {
  return (
    <div className="skill-bar">
      <div className="skill-bar__header">
        <span className="skill-bar__name">{name}</span>
        <span className="skill-bar__percent">{level}%</span>
      </div>
      <div className="skill-bar__track">
        <div
          className="skill-bar__fill"
          style={{ width: animate ? `${level}%` : '0%' }}
        ></div>
      </div>
    </div>
  );
}

function Skills() {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section--visible');
            setAnimate(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="section__container">
        <div className="section__header">
          <span className="section__tag">
            <Cpu size={14} /> Skills
          </span>
          <h2 className="section__title">My Tech Stack</h2>
          <p className="section__subtitle">Technologies and tools I work with</p>
        </div>

        <div className="skills__grid">
          {skillCategories.map((category, catIdx) => (
            <div className="skills__category" key={catIdx} style={{ animationDelay: `${catIdx * 0.1}s` }}>
              <h3 className="skills__category-title">{category.title}</h3>
              <div className="skills__list">
                {category.skills.map((skill, skillIdx) => (
                  <SkillBar
                    key={skillIdx}
                    name={skill.name}
                    level={skill.level}
                    animate={animate}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
