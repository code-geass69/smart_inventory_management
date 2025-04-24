"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function HomePage(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-[#0B0F19] text-white font-sans"
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <div className="text-2xl font-extrabold">Arcline</div>
        <div className="space-x-6 text-base">
          <Link href="/signup" className="hover:text-blue-400">Admin</Link>
          <Link href="/register" className="hover:text-emerald-400">Customer</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-6">
        {/* Left: Text */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 md:pl-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Revolutionizing Logistics with <span className="text-blue-400">Arcline</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Arcline Logistics and Warehousing Pvt. Ltd. provides end-to-end supply chain solutions tailored to your business.
            From reliable deliveries to real-time tracking, we ensure your goods are safe, fast, and efficiently handled.
          </p>
          <div className="space-x-4">
            <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full">
              Get Started
            </Link>
            <Link href="#learn-more" className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 pl-44"
        >
          <Image
            src="/images/warehouse.jpg"
            alt="Warehouse"
            width={500}
            height={400}
            className="rounded-lg"
          />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="learn-more" className="bg-[#111827] py-16 px-8">
        <h2 className="text-3xl font-semibold text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image src="/images/rename.jpg" alt="Tracking" width={1000} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-400">Track shipments with precision across locations and timelines.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image src="/images/logistic.jpg" alt="Custom Solutions" width={400} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Customized Logistics</h3>
            <p className="text-gray-400">Tailored strategies to meet the exact needs of your business operations.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image src="/images/hero-warehouse.jpg" alt="Security" width={400} height={60} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Warehousing</h3>
            <p className="text-gray-400">Advanced safety protocols for handling and storing your goods.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0F19] py-6 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>© 2025 Arcline Logistics and Warehousing Pvt. Ltd.</p>
        <p>Unit-112, Sahar Cargo Estate, V.M. Shah Marg, Andheri East, Mumbai, MH - 400099</p>
        <p>Contact: support@arcline.io | +91-XXXXXXXXXX</p>
      </footer>
    </motion.div>
  )
}