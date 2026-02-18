/**
 * 一个用于移除Markdown中contribute-url标签和TEST_NAME注释的markdown-it插件
 * 
 * 示例:
 * <contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>
 * <!--- TEST_NAME ChannelsGuideTest -->
 */
export default function markdownItRemoveContributeUrl(md: any) {
  // 保存原始的parse函数
  const originalParse = md.parse;

  // 重写parse函数
  md.parse = function(src: string, env: any) {
    // 使用正则表达式移除<contribute-url>标签及其内容
    let cleanedContent = src.replace(/<contribute-url>.*?<\/contribute-url>\s*/g, '');
    
    // 使用正则表达式移除包含 TEST_NAME 的 HTML 注释
    cleanedContent = cleanedContent.replace(/<!---\s*TEST_NAME\s+.*?-->\s*/g, '');
    
    // 调用原始parse函数处理清理后的内容
    return originalParse.call(this, cleanedContent, env);
  };
}
