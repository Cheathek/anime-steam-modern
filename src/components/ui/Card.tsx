import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, hover = true, gradient = false }: Readonly<CardProps>) {
  const baseClasses = 'rounded-xl backdrop-blur-sm border transition-all duration-300';
  
  const variants = gradient
    ? 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50'
    : 'bg-slate-900/80 border-slate-800/50';

  const hoverClasses = hover
    ? 'hover:bg-slate-800/90 hover:border-slate-700/70 hover:shadow-2xl hover:shadow-primary-500/10'
    : '';

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      className={clsx(baseClasses, variants, hoverClasses, className)}
    >
      {children}
    </motion.div>
  );
}