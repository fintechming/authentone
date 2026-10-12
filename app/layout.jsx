export const metadata = {
  title: "AuthenTone — 写得像你，而不是像 AI",
  description: "去 AI 味的文本工具：先学习你的写作 DNA，再改写 AI 草稿，保留你的声音。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
