'use client';

import React from 'react';
import styles from './FullpageWrapper.module.css';

interface FullpageWrapperProps {
  children: React.ReactNode;
}

export default function FullpageWrapper({ children }: FullpageWrapperProps) {
  return (
    <div className={styles.fullpageContainer} id="fullpage-container">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div className={styles.section}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
