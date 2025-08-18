// Process Writerside flavored Container
//
export default function markdownItWsContainer(md) {
  const originalParse = md.parse.bind(md);

  md.parse = function(src: string, env?: any): any[] {
    const blockquoteStyleRegex = /^([ \t]*)((?:[ \t]*>[^\r\n]*\r\n)*[ \t]*>[^\r\n]*)\r\n([ \t]*\{(?:style|type)="([a-z0-9_-]+)"\}\s*)$/gm;

    const processedSrc = src.replace(blockquoteStyleRegex, (
      match,
      indentation,
      blockquoteContent,
      styleAttribute,
      styleName
    ) => {
      const cleanedContent = blockquoteContent.replace(/^\s*>\s?/gm, '').split('\r').join(' ');

      const containerizedBlock = `::: ${styleName}\n${cleanedContent.trim()}\n:::`;

      return containerizedBlock.split('\n').map(line => indentation + line).join('\n');
    });

    return originalParse(processedSrc, env);
  };
}