"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../hooks/useInView";

// Social media posts - add screenshot filenames to public/social/ and update this array
const SOCIAL_POSTS: {
  id: number;
  platform: string;
  platformColor: string;
  image: string | null;
  caption: string;
  link?: string;
}[] = [
  {
    id: 1,
    platform: "小红书",
    platformColor: "#FF2442",
    image: null, // Replace with: "/social/xiaohongshu-1.jpg"
    caption: "[帖子内容占位符 - 请将截图放入 public/social/ 目录]",
    link: undefined,
  },
  {
    id: 2,
    platform: "微博",
    platformColor: "#E6162D",
    image: null,
    caption: "[微博帖子占位符]",
    link: undefined,
  },
  {
    id: 3,
    platform: "Twitter/X",
    platformColor: "#1DA1F2",
    image: null,
    caption: "[Twitter帖子占位符]",
    link: undefined,
  },
];

const PLATFORM_ICONS: Record<string, string> = {
  "小红书": "📕",
  "微博": "🌐",
  "Twitter/X": "🐦",
  "知乎": "💬",
  "B站": "📺",
};

export default function Social() {
  const { ref, isVisible } = useInView();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="social" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">社交媒体</span> 📱
          </h2>
          <p className="text-center text-gray-500 mb-12">我在各平台分享的内容与见解</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOCIAL_POSTS.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1"
                onClick={() => setSelected(post.id)}
              >
                {/* Image area */}
                <div
                  className="relative aspect-video flex items-center justify-center text-5xl"
                  style={{
                    background: `linear-gradient(135deg, ${post.platformColor}22, ${post.platformColor}44)`,
                  }}
                >
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-4xl">{PLATFORM_ICONS[post.platform] ?? "📸"}</span>
                      <span className="text-xs">截图待上传</span>
                    </div>
                  )}

                  {/* Platform badge */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: post.platformColor }}
                  >
                    {post.platform}
                  </span>
                </div>

                {/* Caption */}
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:underline mt-1 block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      查看原帖 ↗
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upload hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-10 p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-center"
          >
            <p className="text-gray-500 text-sm">
              📁 将社交媒体截图放入 <code className="bg-gray-200 px-1.5 py-0.5 rounded">public/social/</code> 目录，
              然后更新 <code className="bg-gray-200 px-1.5 py-0.5 rounded">src/components/Social.tsx</code> 中的 image 字段
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const post = SOCIAL_POSTS.find((p) => p.id === selected);
                if (!post) return null;
                return (
                  <>
                    <div
                      className="aspect-video flex items-center justify-center text-6xl"
                      style={{ background: `${post.platformColor}22` }}
                    >
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.image} alt={post.caption} className="w-full h-full object-contain" />
                      ) : (
                        <span>{PLATFORM_ICONS[post.platform] ?? "📸"}</span>
                      )}
                    </div>
                    <div className="p-6">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-3"
                        style={{ backgroundColor: post.platformColor }}
                      >
                        {post.platform}
                      </span>
                      <p className="text-gray-700">{post.caption}</p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
