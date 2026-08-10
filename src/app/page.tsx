'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import TechStack from '@/components/TechStack/TechStack';
import Projects from '@/components/Projects/Projects';
import Contact from '@/components/Contact/Contact';
import FullpageWrapper from '@/components/Fullpage/FullpageWrapper';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'works', 'contact'];
    const container = document.getElementById('fullpage-container');
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: container,
        threshold: 0.4,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <Header activeSection={activeSection} />
      <FullpageWrapper>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Contact />
      </FullpageWrapper>
    </>
  );
}
