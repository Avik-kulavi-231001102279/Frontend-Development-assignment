import { useState } from 'react';
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import './styles/App.css';
import './styles/Responsive.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated background elements */}
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-orb bg-orb--1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb--2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb--3" aria-hidden="true"></div>

      <Header />
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
