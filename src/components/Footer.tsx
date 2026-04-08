export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-12 text-white text-center"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-2xl font-bold mb-2 gradient-text">苏天润</p>
        <p className="text-gray-400 text-sm mb-6">金融 · AI · 产品 · 开发</p>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://github.com/maxlory"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            🐙 GitHub
          </a>
          <a
            href="mailto:strun916@gmail.com"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            📧 Email
          </a>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-gray-500 text-xs">
            © {currentYear} 苏天润. Built with Next.js & Tailwind CSS. ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
