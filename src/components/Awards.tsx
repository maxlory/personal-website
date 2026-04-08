"use client";

import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const AWARDS = [
  {
    emoji: "🏆",
    title: "[奖项名称占位符]",
    org: "[颁奖机构占位符]",
    date: "[时间占位符]",
    desc: "[奖项描述占位符 - 请填写获奖原因、奖项级别等信息]",
    color: "from-yellow-400 to-orange-400",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
  },
  {
    emoji: "🥇",
    title: "[竞赛名称占位符]",
    org: "[主办方占位符]",
    date: "[时间占位符]",
    desc: "[竞赛成就描述占位符 - 请填写参赛项目、获奖等级等]",
    color: "from-blue-400 to-purple-400",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  {
    emoji: "🎖️",
    title: "[荣誉称号占位符]",
    org: "[颁发机构占位符]",
    date: "[时间占位符]",
    desc: "[荣誉描述占位符 - 请填写荣誉内容、评选标准等]",
    color: "from-pink-400 to-rose-400",
    border: "border-pink-200",
    bg: "bg-pink-50",
  },
];

export default function Awards() {
  const { ref, isVisible } = useInView();

  return (
    <section
      id="awards"
      className="py-24"
      style={{ background: "linear-gradient(180deg, #fdf4ff 0%, #f0f9ff 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">奖项 & 荣誉</span> 🏅
          </h2>
          <p className="text-center text-gray-500 mb-12">所获得的奖项与荣誉认可</p>

          <div className="grid md:grid-cols-3 gap-6">
            {AWARDS.map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className={`rounded-2xl border-2 ${award.border} ${award.bg} p-6 hover:-translate-y-1 transition-transform`}
              >
                {/* Gradient header */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4 bg-gradient-to-br ${award.color}`}>
                  {award.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{award.title}</h3>
                <p className="text-sm text-purple-600 font-medium mb-1">{award.org}</p>
                <p className="text-xs text-gray-400 mb-3">{award.date}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{award.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-400 text-sm mt-8"
          >
            💡 以上奖项为占位符，请更新 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/components/Awards.tsx</code> 中的内容
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
