"use client";

import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

export default function Resume() {
  const { ref, isVisible } = useInView();

  return (
    <section
      id="resume"
      className="py-24"
      style={{ background: "linear-gradient(180deg, #f8f7ff 0%, #eef2ff 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">我的简历</span> 📄
          </h2>
          <p className="text-center text-gray-500 mb-10">点击下方可全屏查看或直接下载</p>

          {/* Download button */}
          <div className="flex justify-center mb-8">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
            >
              ⬇️ 下载简历 PDF
            </a>
          </div>

          {/* PDF Embed */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-purple-100">
            <iframe
              src="/resume.pdf"
              className="w-full"
              style={{ height: "80vh", minHeight: "600px" }}
              title="个人简历"
            />
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            若 PDF 无法显示，请点击上方「下载简历 PDF」按钮查看
          </p>
        </motion.div>
      </div>
    </section>
  );
}
