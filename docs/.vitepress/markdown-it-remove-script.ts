/**
 * Markdown-it plugin to remove script tags
 */
export default function markdownItRemoveScript(md) {
  // 保存原始的HTML block解析器
  const originalHTMLBlock = md.renderer.rules.html_block;
  const originalHTMLInline = md.renderer.rules.html_inline;

  // 替换HTML block解析器，移除script标签
  md.renderer.rules.html_block = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    const content = tokens[idx].content;
    // 检查是否包含script标签
    if (content.includes('<script')) {
      // 移除所有script标签及其内容
      return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    // 如果没有script标签，使用原始渲染器
    return originalHTMLBlock(tokens, idx, options, env, self);
  };

  // 替换HTML inline解析器，移除script标签
  md.renderer.rules.html_inline = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    const content = tokens[idx].content;
    // 检查是否包含script标签
    if (content.includes('<script')) {
      // 移除所有script标签及其内容
      return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    // 如果没有script标签，使用原始渲染器
    return originalHTMLInline(tokens, idx, options, env, self);
  };
}