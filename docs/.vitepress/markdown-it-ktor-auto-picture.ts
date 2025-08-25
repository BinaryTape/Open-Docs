// .vitepress/plugins/markdownItKtorAutoPicture.js

/**
 * 用于自动处理 ktor 图片的深浅色主题。
 * 此版本增加了路径判断逻辑，仅对 'ktor' 目录下的 Markdown 文件生效。
 *
 * 它会同时处理：
 * 1. 原始 HTML 块 (html_block) 中的 <img> 标签。
 * 2. 标准 Markdown 语法 (image) 的 ![alt](src)。
 */
export const markdownItKtorAutoPicture = (md) => {
  console.log('[AutoPicture] 插件已初始化 (v2，带 ktor 路径过滤)');

  // 定义一个正则表达式来匹配所有 'ktor' 目录下的路径
  // /(^|\/)ktor\// 匹配 "ktor/" 或 ".../ktor/"
  const ktorPathRegex = /(^|\/)ktor\//;

  // --- 1. 修改原始 HTML 块的渲染规则 ---
  const defaultHtmlBlockRenderer = md.renderer.rules.html_block;
  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const pagePath = env.relativePath || ''; // 获取当前处理的 md 文件路径

    // [新增逻辑] 如果文件路径不符合要求，则直接跳过，不进行任何处理
    if (!ktorPathRegex.test(pagePath)) {
      return defaultHtmlBlockRenderer(tokens, idx, options, env, self);
    }

    const content = tokens[idx].content;
    const imgTagRegex = /<img[^>]*>/g;

    if (!content.match(imgTagRegex)) {
      return defaultHtmlBlockRenderer(tokens, idx, options, env, self);
    }

    console.log(`[AutoPicture] ✅ 在 Ktor 路径 (${pagePath}) 下发现 <img> 块，开始处理...`);

    const newContent = content.replace(imgTagRegex, (imgTag) => {
      if (imgTag.includes('data-light-src')) return imgTag;

      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (!srcMatch || !srcMatch[1] || srcMatch[1].startsWith('http')) {
        return imgTag;
      }
      const src = srcMatch[1];

      const dotIndex = src.lastIndexOf('.');
      if (dotIndex === -1) return imgTag;

      const lightSrc = src;
      const darkSrc = `${src.substring(0, dotIndex)}_dark${src.substring(dotIndex)}`;

      console.log(`[AutoPicture]  - 正在处理: ${lightSrc} -> 生成暗色版路径: ${darkSrc}`);

      let modifiedTag = imgTag;
      if (/class="[^"]+"/.test(modifiedTag)) {
        modifiedTag = modifiedTag.replace(/class="([^"]+)"/, 'class="$1 themed-image"');
      } else {
        modifiedTag = modifiedTag.replace('<img ', '<img class="themed-image" ');
      }

      const closingTag = modifiedTag.endsWith('/>') ? '/>' : '>';
      let tagBody = modifiedTag.slice(0, modifiedTag.length - closingTag.length).trim();
      tagBody += ` data-light-src="${lightSrc}" data-dark-src="${darkSrc}"`;

      return tagBody + ' ' + closingTag;
    });

    tokens[idx].content = newContent;
    return defaultHtmlBlockRenderer(tokens, idx, options, env, self);
  };

  // --- 2. 修改标准 Markdown 图片的渲染规则 ---
  const defaultImageRenderer = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const pagePath = env.relativePath || ''; // 获取当前处理的 md 文件路径

    // [新增逻辑] 同样在这里添加路径判断
    if (!ktorPathRegex.test(pagePath)) {
      return defaultImageRenderer(tokens, idx, options, env, self);
    }

    const token = tokens[idx];
    const src = token.attrGet('src');

    if (src && !src.startsWith('http')) {
        const dotIndex = src.lastIndexOf('.');
        if (dotIndex !== -1) {
            console.log(`[AutoPicture] ✅ 正在处理 Ktor 路径 (${pagePath})下的 Markdown 图片: ${src}`);
            const lightSrc = src;
            const darkSrc = `${src.substring(0, dotIndex)}_dark${src.substring(dotIndex)}`;

            token.attrSet('data-light-src', lightSrc);
            token.attrSet('data-dark-src', darkSrc);
            token.attrJoin('class', 'themed-image');
        }
    }
    return defaultImageRenderer(tokens, idx, options, env, self);
  };
};
