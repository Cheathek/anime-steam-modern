import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0933] via-[#2a1155] to-[#0e0522] relative overflow-hidden">
      {/* Anime-style background elements matching ZenkaIza's palette */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic particles */}
        {[...Array(30)].map(() => {
          // Generate unique properties for each particle
          const width = Math.random() * 4 + 1;
          const height = Math.random() * 4 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const backgroundColor = `hsl(${Math.random() * 30 + 260}, 80%, 70%)`;
          const opacity = Math.random() * 0.5 + 0.1;
          const duration = Math.random() * 5 + 3;
          const delay = Math.random() * 5;
          // Create a unique key based on these properties
          const key = `${width}-${height}-${left}-${top}-${backgroundColor}-${opacity}-${duration}-${delay}-${Math.random().toString(36).substring(2, 11)}`;
          return (
            <motion.div
              key={key}
              className="absolute rounded-full"
              style={{
                width: width + 'px',
                height: height + 'px',
                left: left + '%',
                top: top + '%',
                backgroundColor,
                opacity
              }}
              animate={{
                y: [0, -50],
                opacity: [0.8, 0],
                scale: [1, 0.2]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay
              }}
            />
          );
        })}

        {/* ZenkaIza-style energy waves */}
        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-[#5a2b9d]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#3d1a6e]/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/2 w-32 h-32 bg-[#e94584]/30 rounded-full blur-2xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        {/* ZenkaIza-style ghost character */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 relative"
        >
          <Ghost className="w-32 h-32 text-[#c77dff]" />
          {/* Glowing eyes */}
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-[#ff4d8d] rounded-full blur-xs animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#ff4d8d] rounded-full blur-xs animate-pulse" />
          {/* Anime-style sweat drop */}
          <motion.div
            animate={{
              y: [0, 10],
              opacity: [1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeIn"
            }}
            className="absolute top-1/4 right-1/4 w-2 h-3 bg-[#4cc9f0] rounded-full"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
        </motion.div>

        {/* Glowing title with ZenkaIza colors */}
        <motion.h1
          className="text-7xl md:text-8xl font-extrabold mb-4 tracking-tight relative"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d8d] to-[#c77dff]">404</span>
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4d8d] to-transparent"></span>
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl font-bold text-[#c77dff] mb-4"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          ページが見つかりません!
        </motion.p>

        <motion.p
          className="text-lg text-[#b8b8ff] mb-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="inline-block mb-2">ZenkaIzaエラー!</span><br />
          The page you're looking for has been<br />
          lost in the seasonal anime rotation...
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white font-bold shadow-lg transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></span>
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span className="relative">Back to Home Page</span>
            {/* Button shine effect */}
            <span className="absolute top-0 left-[-20px] w-10 h-full bg-white/30 transform -skew-x-12 transition-all duration-500 group-hover:left-[95%]"></span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}