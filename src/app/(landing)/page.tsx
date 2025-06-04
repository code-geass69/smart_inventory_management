"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/scrollmain.module.css";

export default function HomePage(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col min-h-screen bg-[#0B0F19] text-white font-sans ${styles.scrollArea}`}
      style={{ height: "100vh", overflowY: "auto" }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <div className="text-2xl font-extrabold">Zaiko</div>
        <div className="space-x-6 text-base">
          <Link href="/signup" className="hover:text-blue-400">
            Admin
          </Link>
          <Link href="/register" className="hover:text-emerald-400">
            Customer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-6"
        style={{
          background: "linear-gradient(135deg, #0B0F19 0%, #111B2E 40%, #1A237E 100%)",
        }}
      >
        {/* Left: Text */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 md:pl-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Powering E-commerce Logistics with{" "}
            <span className="text-blue-400">Zaiko</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Zaiko is your smart logistics and inventory management solution— built for
            modern e-commerce brands. From real-time stock updates to seamless order
            tracking and invoice access, we help you manage it all in one intuitive
            platform.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
            >
              Get Started
            </Link>
            <Link
              href="#learn-more"
              className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all"
            >
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
        <h2 className="text-3xl font-semibold text-center mb-12">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image
              src="/images/rename.jpg"
              alt="Tracking"
              width={1000}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-400">
              Monitor every movement with live tracking across your entire
              supply chain—from warehouse to doorstep.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image
              src="/images/logistic.jpg"
              alt="Custom Solutions"
              width={400}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Smart Order Handling</h3>
            <p className="text-gray-400">
              Streamline customer orders with automated processing, delivery
              updates, and seamless invoice sharing.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#1F2937] p-6 rounded-lg shadow-md hover:shadow-blue-500/20 transition-shadow"
          >
            <Image
              src="/images/hero-warehouse.jpg"
              alt="Security"
              width={400}
              height={60}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Inventory Intelligence</h3>
            <p className="text-gray-400">
              Get insights on stock levels, avoid overstocking or shortages, and
              plan smarter with predictive analytics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B0F19] py-6 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>© 2025 Zaiko Technologies</p>
        <p>123 Fictional Lane, Dreamtown, Example State, 98765</p>
        <p>Contact: support@zaiko.io | +91-XXXXXXXXXX</p>
      </footer>
    </motion.div>
  );
}