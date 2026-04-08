"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import type { GitHubRepo } from "../lib/github";

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#2b7489",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  Go: "#00ADD8",
  Rust: "#dea584",
  default: "#8b949e",
};

// Featured repos to show first
const FEATURED = [
  "TrendRadar",
  "jobmatch",
  "lets-go-rss-workflow-publish",
];

export default function Projects() {
  const { ref, isVisible } = useInView();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/maxlory/repos?sort=updated&per_page=20")
      .then((r) => r.json())
      .then((data: GitHubRepo[]) => {
        const nonForks = data.filter((r) => !r.fork);
        const featured = nonForks.filter((r) =>
          FEATURED.includes(r.name)
        );
        const rest = nonForks.filter((r) => !FEATURED.includes(r.name));
        setRepos([...featured, ...rest]);
      })
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">GitHub 项目</span> 🚀
          </h2>
          <p className="text-center text-gray-500 mb-12">
            我的开源项目与实践 ·{" "}
            <a
              href="https://github.com/maxlory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              @maxlory
            </a>
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo, i) => {
                const isFeatured = FEATURED.includes(repo.name);
                return (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`group block rounded-2xl p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl ${
                      isFeatured
                        ? "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50"
                        : "border-gray-100 bg-gray-50 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isFeatured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                            ⭐ 精选
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-lg group-hover:text-purple-500 transition-colors">↗</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {repo.description || "暂无描述"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                LANG_COLORS[repo.language] ??
                                LANG_COLORS.default,
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span>⭐ {repo.stargazers_count}</span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
