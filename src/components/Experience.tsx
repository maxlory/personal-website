"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../hooks/useInView";

const EXPERIENCES = [
  {
    id: 1,
    title: "AI 投研产品竞品分析",
    type: "独立研究项目",
    period: "2026年3月",
    tags: ["竞品分析", "金融科技", "AI产品", "用户体验"],
    tagColors: ["#8b5cf6", "#3b82f6", "#ec4899", "#06b6d4"],
    summary:
      "独立设计并执行一套针对 AI 投研产品的系统性竞品评测框架，对 WindClaw 与东方财富妙想 Skills 两款产品进行全面横向对比，输出可量化的分析报告。",
    gradient: "from-purple-500 via-blue-500 to-cyan-400",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    accentColor: "text-purple-700",
    sections: [
      {
        icon: "🎯",
        title: "项目背景",
        content:
          "国内 AI 投研赛道竞争激烈，但缺乏系统的产品横评标准。本项目旨在建立一套可复用的金融分析型 AI 产品评测体系，对市面上主流产品做出客观、可量化的对比判断。",
      },
      {
        icon: "📐",
        title: "方法论设计",
        content:
          "自主设计《金融分析型产品体验评判标准》，从 4 个维度建立量化评分体系：\n• 内容完整性与准确性（1-5分）\n• 结构清晰度（1-5分）\n• 格式可用性（表格/清单/无格式）\n• 解读质量（1-5分）\n\n同时制定严格的测试控制规则：提问口径一致、追问轮数一致、测试时间尽量同日完成，确保对比公平。",
      },
      {
        icon: "🔬",
        title: "研究执行",
        content:
          "覆盖 5 大任务类别、27道测试题，涵盖新闻检索、事件追踪、政策研究、金融数据查询、条件筛选、横向比较、策略分析等典型投研场景，对两款产品进行完整的并行测试。",
      },
      {
        icon: "📊",
        title: "核心发现",
        content:
          "东方财富 Skills 整体优于 WindClaw（综合均分 3.74 vs 3.44）。东方财富优势集中在政策梳理、舆情追踪、多条件筛选等任务上，输出「成品感」更强；WindClaw 在基础数据快查上与之差距不大，但在任务对准度和解读深度上存在明显短板。两款产品共同存在的问题：检索错位后不愿停止生成，边界控制不足。",
      },
      {
        icon: "💡",
        title: "产品改进建议",
        content:
          "针对两款产品各提出4条优先级改进项。核心洞察：AI 投研产品的关键能力缺口不在于「能否生成」，而在于「知道什么时候不该往下写」——即检索命中置信度判断与内容边界控制。",
      },
    ],
    metrics: [
      { label: "测试题目", value: "27 题" },
      { label: "覆盖场景", value: "5 大类" },
      { label: "评分维度", value: "4 维度" },
      { label: "对比产品", value: "2 款" },
    ],
    files: [
      { name: "金融分析型产品体验评判标准.md", desc: "评测方法论文档" },
      { name: "AI投研产品具体使用体验测试.md", desc: "完整测试记录与评分表" },
      { name: "WindClaw产品深度分析.md", desc: "5层分析框架深度报告" },
      { name: "东方财富Skills产品深度分析.md", desc: "功能拆解与体验评测" },
      { name: "WindClaw_vs_东方财富skills_对比文档.md", desc: "综合对比结论报告" },
    ],
  },
];

export default function Experience() {
  const { ref, isVisible } = useInView();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section
      id="experience"
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
            <span className="gradient-text">项目经历</span> 💼
          </h2>
          <p className="text-center text-gray-500 mb-12">独立研究与实践项目</p>

          <div className="space-y-6">
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl border-2 ${exp.borderColor} ${exp.bgColor} overflow-hidden`}
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Gradient bar */}
                      <div
                        className={`h-1 w-16 rounded-full bg-gradient-to-r ${exp.gradient} mb-4`}
                      />
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full bg-white border ${exp.borderColor} ${exp.accentColor}`}
                        >
                          {exp.type}
                        </span>
                        <span className="text-xs text-gray-400">{exp.period}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{exp.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{exp.summary}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.tags.map((tag, ti) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-white text-xs font-medium"
                            style={{ backgroundColor: exp.tagColors[ti] }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-3">
                        {exp.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="bg-white rounded-xl p-3 text-center border border-gray-100"
                          >
                            <div className={`text-lg font-bold ${exp.accentColor}`}>
                              {m.value}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                    className={`mt-4 flex items-center gap-2 text-sm font-medium ${exp.accentColor} hover:opacity-70 transition-opacity`}
                  >
                    {expanded === exp.id ? "收起详情 ↑" : "展开详情 ↓"}
                  </button>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-purple-100 pt-6 space-y-6">
                        {/* Sections */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {exp.sections.map((sec) => (
                            <div
                              key={sec.title}
                              className="bg-white rounded-xl p-4 border border-gray-100"
                            >
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <span>{sec.icon}</span>
                                {sec.title}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {sec.content}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Key conclusion highlight */}
                        <div
                          className={`rounded-xl p-4 bg-gradient-to-r ${exp.gradient} text-white`}
                        >
                          <p className="text-sm font-medium">
                            💡 核心结论：AI 投研产品的关键能力缺口不在于
                            &quot;能否生成&quot;，而在于
                            <strong>
                              &quot;知道什么时候不该往下写&quot;
                            </strong>{" "}
                            ——即检索命中置信度判断与内容边界控制。
                          </p>
                        </div>

                        {/* File list */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            📁 项目输出文档
                          </h4>
                          <div className="space-y-2">
                            {exp.files.map((f) => (
                              <div
                                key={f.name}
                                className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 border border-gray-100"
                              >
                                <span className="text-gray-400 text-lg">📄</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">{f.name}</p>
                                  <p className="text-xs text-gray-400">{f.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
