// Process Writerside flavored Container
//
export default function markdownItWsContainer(md) {
  const originalParse = md.parse.bind(md);

  md.parse = function(src: string, env?: any): any[] {
    const blockquoteStyleRegex = /^(\s*)(>\s*[\s\S]*?)(\s*\{style="([a-z0-9_-]+)"\}\s*)$/gm;

    const processedSrc = src.replace(blockquoteStyleRegex, (
      match,
      indentation,
      blockquoteContent,
      styleAttribute,
      styleName
    ) => {
      const cleanedContent = blockquoteContent.replace(/^\s*>\s?/gm, '');

      const containerizedBlock = `::: ${styleName}\n${cleanedContent.trim()}\n:::`;

      return containerizedBlock.split('\n').map(line => indentation + line).join('\n');
    });

    return originalParse(processedSrc, env);
  };
}