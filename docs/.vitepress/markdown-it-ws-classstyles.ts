export default function markdownItWsClassstyles(md) {
  // 在 markdown-it 解析前拦截原始内容
  const originalParse = md.parse;

  md.parse = function(src, env) {
    // 直接替换所有匹配的样式标记
    const cleanedSrc = src.replace(/\{:\.[\w\-_]+(\.[\w\-_]+)*\}/g, '');

    // 将处理后的内容传递给原始解析器
    return originalParse.call(this, cleanedSrc, env);
  };
}
