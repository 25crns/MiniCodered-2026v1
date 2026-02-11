"use client"

import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/styles/LandingPage.module.css';

export default function Page() {
  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        redirect('/level_0', RedirectType.replace)
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
  <>
    <Image
      src="/assets/landing-page-background.jpg"
      alt=""
      fill
      style={{ objectFit: "contain", objectPosition: "center", "zIndex": -1}}
      priority
    />
    <div className={styles.title}> Press Enter To Start </div>
  </>
  )
}