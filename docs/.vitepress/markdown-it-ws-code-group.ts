// Process Writerside flavored Code Group
//
export default function markdownItWsCodeGroup (md) {
  // 存储原始的 render 函数
  const originalRender = md.render.bind(md);

  // 覆盖 render 函数
  md.render = (src: string, env?: any): string => {
    // 处理 <tabs> 标签
    let processedSrc = src.replace(
      /<tabs\s+group="([^"]+)">([\s\S]*?)<\/tabs>/g,
      (match: string, groupName: string, tabsContent: string): string => {
        // 创建代码组开始标记
        let codeGroup = '::: code-group\n';

        // 处理每个 tab
        const tabRegex = /<tab\s+title="([^"]+)"\s+group-key="([^"]+)">([\s\S]*?)<\/tab>/g;
        let tabMatch: RegExpExecArray | null;

        while ((tabMatch = tabRegex.exec(tabsContent)) !== null) {
          const tabTitle = tabMatch[1];
          const tabKey = tabMatch[2];
          const tabContent = tabMatch[3].trim();

          // 提取代码块
          const codeBlockMatch = /```(\w+)\s*\n([\s\S]*?)```/g.exec(tabContent);

          if (codeBlockMatch) {
            const lang = codeBlockMatch[1];
            const code = codeBlockMatch[2];

            // 添加到代码组
            codeGroup += `\`\`\`${lang} [${tabTitle}]\n${code}\`\`\`\n`;
          }
        }

        // 添加代码组结束标记
        codeGroup += ':::';

        return codeGroup;
      }
    );

    // 使用原始 render 函数处理修改后的内容
    return originalRender(processedSrc, env);
  };
};