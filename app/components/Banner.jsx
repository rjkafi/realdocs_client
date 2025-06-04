'use client';

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Banner() {
  return (
    <>
    <section className='py-12'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div  className="mb-4 w-[300px] md:w-[380px] mx-auto text-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">
              🚀 Real-time collaboration made simple
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Create, Collaborate,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Connect
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience seamless document collaboration with RealDocs. Write together in real-time, share instantly,
              and bring your team's ideas to life with our powerful yet simple editor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="flex  text-white items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3 rounded-full"
              >
                Start Writing Now
               <span> <FaArrowRight className="ml-2 w-5 h-5" /></span>
              </Link>
              
            </div>
          </div>
        </div>
    </section>
    </>
  )
}
