'use client'; // If you're using App Router in Next.js

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black border-b py-20 md:py-32 text-white text-center min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex items-center justify-center"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="container mx-auto px-4"
      >
        <motion.h1
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1 },
          }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl md:text-8xl font-bold mb-4 text-emerald-500"
        >
          404
        </motion.h1>

        <motion.h2
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="text-3xl md:text-5xl font-semibold mb-6"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300"
        >
          Oops! It looks like you&apos;ve wandered off the path. The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>

        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center bg-emerald-600 text-white font-bold px-8 py-4 rounded-full text-xl shadow-lg hover:bg-emerald-700 transition duration-300"
          >
            <Home className="w-6 h-6 mr-3" /> Go to Homepage
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center border border-white text-white font-semibold px-8 py-4 rounded-full text-xl hover:bg-white hover:text-black transition duration-300"
          >
            Explore Our Rooms <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
