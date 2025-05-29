// Process comments and convert title to markdown heading

export default function markdownItWsFrontmatter(md) {
  const originalRender = md.render.bind(md);
  const titleCommentRegex = /\[\/\/\]: # \(title:\s*(.*?)\)/i;

  md.render = function(src: string, env?: any): any[] {
    // 查找 title 注释
    const titleMatch = src.match(titleCommentRegex);
    
    if (titleMatch && titleMatch[1]) {
      // 提取标题内容
      const titleContent = titleMatch[1].trim();
      
      // 将标题内容转换为 Markdown 标题
      const modifiedSource = `# ${titleContent}\n\n${src}`;
      
      return originalRender(modifiedSource, env);
    }
    
    // 没有找到标题，直接处理原始内容
    return originalRender(src, env);
  };
}