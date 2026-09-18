import { useEffect, useRef } from 'react';
import { FolderGit2, Github, ExternalLink } from 'lucide-react';
import '../styles/Projects.css';

const projectsData = [
  {
    title: 'Advanced Learning Management System',
    description:
      'A comprehensive Library Management and Online Class System designed for modern education. Features book cataloging, class scheduling, and student management.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/Anubhav2321/Advane-LMS-portal',
    live: null,
    color: '#6366f1',
  },
  {
    title: 'Weather Dashboard',
    description:
      'A sleek React weather forecasting application with real-time data, interactive charts, and location-based weather updates using external APIs.',
    tech: ['React', 'API', 'CSS3', 'JavaScript'],
    github: 'https://github.com/Avik-kulavi-231001102279/Frontend-Development-assignment/tree/main/Weather-Dashboard',
    live: null,
    color: '#06b6d4',
  },
  {
    title: 'Smart Task Manager',
    description:
      'A feature-rich task management application with drag-and-drop, priority levels, due dates, and productivity analytics built with React.',
    tech: ['React', 'JavaScript', 'CSS3'],
    github: 'https://github.com/Avik-kulavi-231001102279/Frontend-Development-assignment/tree/main/Smart-Task-Manager',
    live: null,
    color: '#8b5cf6',
  },
  {
    title: 'Online Shopping Cart',
    description:
      'A modern e-commerce shopping cart interface with product browsing, cart management, filtering, and a responsive checkout flow.',
    tech: ['React', 'JavaScript', 'CSS3'],
    github: 'https://github.com/Avik-kulavi-231001102279/Frontend-Development-assignment/tree/main/Online-Shopping-Cart',
    live: null,
    color: '#f59e0b',
  },
  {
    title: 'Employee Directory',
    description:
      'A React-based employee management interface with search, sort, filter capabilities, and detailed employee profile views.',
    tech: ['React', 'JavaScript', 'CSS3'],
    github: 'https://github.com/Avik-kulavi-231001102279/Frontend-Development-assignment/tree/main/Farm-Employee-Directory-Management-System',
    live: null,
    color: '#10b981',
  },
  {
    title: 'Tic-Tac-Toe AI',
    description:
      'An intelligent Tic-Tac-Toe game featuring an unbeatable AI opponent using Minimax algorithm with Alpha-Beta pruning optimization.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'AI'],
    github: 'https://github.com/Avik-kulavi-231001102279/Tic-Tac-Toe-AI---Minimax-Game',
    live: null,
    color: '#ef4444',
  },
];

function Projects() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section--visible');
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('project-card--visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="section__container">
        <div className="section__header">
          <span className="section__tag">
            <FolderGit2 size={14} /> Projects
          </span>
          <h2 className="section__title">Featured Work</h2>
          <p className="section__subtitle">Some of the projects I have worked on</p>
        </div>

        <div className="projects__grid">
          {projectsData.map((project, index) => (
            <article
              className="project-card"
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                '--accent': project.color,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Color accent bar */}
              <div className="project-card__accent" aria-hidden="true"></div>

              <div className="project-card__content">
                <div className="project-card__icon">
                  <FolderGit2 size={24} />
                </div>

                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">{project.description}</p>

                {/* Tech badges */}
                <div className="project-card__tech">
                  {project.tech.map((t, i) => (
                    <span className="project-card__badge" key={i}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="project-card__links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github size={16} />
                    Code
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card__link project-card__link--live"
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink size={16} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
