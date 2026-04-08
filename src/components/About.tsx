"use client";

import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const SKILLS = [
  { name: "Python", color: "#3b82f6" },
  { name: "金融分析", color: "#8b5cf6" },
  { name: "AI产品设计", color: "#ec4899" },
  { name: "数据可视化", color: "#06b6d4" },
  { name: "Next.js", color: "#f59e0b" },
  { name: "SQL", color: "#10b981" },
  { name: "竞品分析", color: "#f97316" },
  { name: "舆情监控", color: "#6366f1" },
  { name: "机器学习", color: "#14b8a6" },
  { name: "产品需求文档", color: "#e11d48" },
];

export default function About() {
  const { ref, isVisible } = useInView();

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">关于我</span> 👋
          </h2>
          <p className="text-center text-gray-500 mb-12">了解我的故事与技能</p>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Bio */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border-2 border-purple-100 bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">🎓 教育背景</h3>
                <p className="text-gray-700 leading-relaxed">
                  上海理工大学 / 中国社会科学院研究生院<br />
                  金融学 · 硕士 · 2027届
                </p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-blue-100 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">💡 关于我</h3>
                <p className="text-gray-700 leading-relaxed">
                  [个人简介占位符 - 请在此填写你的个人介绍，包括研究方向、工作经历、兴趣爱好等内容。]
                </p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-pink-100 bg-pink-50">
                <h3 className="text-lg font-semibold text-pink-700 mb-3">🎯 目标方向</h3>
                <p className="text-gray-700 leading-relaxed">
                  [目标方向占位符 - 请填写你的职业目标、期望从事的领域等。]
                </p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">🛠 技能标签</h3>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="px-4 py-2 rounded-full text-white text-sm font-medium cursor-default hover:scale-110 transition-transform"
                    style={{ backgroundColor: skill.color }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 text-white">
                <h3 className="text-lg font-semibold mb-3">📬 联系我</h3>
                <div className="space-y-2 text-sm">
                  <p>📧 strun916@gmail.com</p>
                  <p>🐙 GitHub: <a href="https://github.com/maxlory" target="_blank" rel="noopener noreferrer" className="underline">@maxlory</a></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
