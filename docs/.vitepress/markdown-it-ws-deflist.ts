// Process Writerside flavored Deflist
//

export default function markdownItWsDeflist(md) {
  // Regular expression to match the opening <deflist collapsible="true"> tag
  const DEFLIST_OPEN_REGEX = /^<deflist\s+collapsible="true"\s*>/i;
  // Regular expression to match the closing </deflist> tag
  const DEFLIST_CLOSE_REGEX = /<\/deflist\s*>\s*$/i;
  // Regular expression to parse individual <def> elements.
  // Captures title and the raw content.
  const DEF_REGEX = /<def\s+title="(?<title>[^"]+)"\s*>\s*(?<content>[\s\S]*?)\s*<\/def>/gi;
  // Regular expression to parse <code-block lang="xxx"> elements.
  const CODE_BLOCK_REGEX = /<code-block\s+lang="(?<lang>[^"]+)"\s*>\s*(?<content>[\s\S]*?)\s*<\/code-block>/gi;

  function customDeflistRule(state, startLine, endLine, silent) {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    let currentLineText = state.src.slice(pos, max);

    // Check if the current line starts with <deflist collapsible="true">
    if (!DEFLIST_OPEN_REGEX.test(currentLineText)) {
      return false;
    }

    // If in silent mode, we've confirmed the block structure.
    if (silent) {
      return true;
    }

    let openTagLine = startLine;
    let closeTagLine = -1;
    let blockContentString = "";

    // Extract the content of the <deflist> block
    const firstLineRaw = state.src.slice(state.bMarks[openTagLine] + state.tShift[openTagLine], state.eMarks[openTagLine]);
    const openTagMatch = DEFLIST_OPEN_REGEX.exec(firstLineRaw);
    if (!openTagMatch) return false; // Should not happen due to initial check
    const openTagLength = openTagMatch[0].length;

    // Check if <deflist> and </deflist> are on the same line
    if (firstLineRaw.search(DEFLIST_CLOSE_REGEX) > -1) {
      const closeTagIndex = firstLineRaw.search(DEFLIST_CLOSE_REGEX);
      if (closeTagIndex > openTagLength) {
        blockContentString = firstLineRaw.substring(openTagLength, closeTagIndex);
        closeTagLine = openTagLine;
      } else {
        return false; // Malformed: </deflist> before or inside <deflist>
      }
    } else {
      // Multi-line block
      let contentLines = [];
      // Content from the first line (after <deflist...>)
      contentLines.push(firstLineRaw.substring(openTagLength));

      for (let currentLineIdx = startLine + 1; currentLineIdx < endLine; currentLineIdx++) {
        const lineText = state.src.slice(state.bMarks[currentLineIdx] + state.tShift[currentLineIdx], state.eMarks[currentLineIdx]);
        if (DEFLIST_CLOSE_REGEX.test(lineText)) {
          closeTagLine = currentLineIdx;
          // Content before closing tag on its line
          contentLines.push(lineText.substring(0, lineText.search(DEFLIST_CLOSE_REGEX)));
          break;
        }
        contentLines.push(lineText);
      }
      if (closeTagLine === -1) return false; // No closing tag found
      blockContentString = contentLines.join('\n').trim();
    }

    const defsData = [];
    let match;
    DEF_REGEX.lastIndex = 0; // Reset lastIndex for global regex

    while ((match = DEF_REGEX.exec(blockContentString)) !== null) {
      if (match.groups) {
        defsData.push({
          title: match.groups.title,
          content: match.groups.content ? match.groups.content.trim() : ''
        });
      }
    }

    if (defsData.length === 0) {
      // If no <def> elements found, treat as empty or pass through.
      // For now, just advance past the block.
      state.line = closeTagLine + 1;
      return true;
    }

    let htmlOutput = '<dl>\n';

    defsData.forEach((def) => {
      htmlOutput += '  <details class="details custom-block">\n';
      htmlOutput += `    <summary>${md.utils.escapeHtml(def.title)}</summary>\n`;
      htmlOutput += '    <div class="ws-def-content">\n';

      // Pre-process def content:
      // 1. Replace <list> with <ul> and </list> with </ul>
      let processedDefContent = def.content.replace(/<list\s*>/gi, '<ul>').replace(/<\/list\s*>/gi, '</ul>');

      // 2. Replace <code-block lang="xxx">...</code-block> with ```xxx ... ```
      // The arguments to the replacer function are: fullMatch, p1, p2, ..., offset, string, namedCaptureGroups
      // The last argument is the object with named capture groups.
      processedDefContent = processedDefContent.replace(CODE_BLOCK_REGEX, (...args) => {
        const groups = args[args.length - 1];
        // Ensure the content is trimmed and placed correctly within the Markdown fence
        return `\n\`\`\`${groups.lang}\n${groups.content.trim()}\n\`\`\`\n`;
      });

      // Render the processed content of <def> as Markdown
      // This allows standard Markdown, HTML, and other custom elements
      // to be rendered correctly by VitePress/Vue or other plugins.
      const defEnv = { ...state.env };
      delete defEnv.frontmatter;
      htmlOutput += md.render(processedDefContent, defEnv);
      htmlOutput += '    </div>\n';
      htmlOutput += '  </details>\n';
    });

    htmlOutput += '</dl>\n';

    // Create a single html_block token with the generated HTML
    const token = state.push('html_block', '', 0);
    token.map = [startLine, closeTagLine + 1];
    token.content = htmlOutput;
    token.block = true;

    state.line = closeTagLine + 1; // Advance the parser past this block

    return true;
  }

  // Register the rule. It should run before 'html_block' to ensure it captures
  // the <deflist> structure first.
  md.block.ruler.before('html_block', 'custom_deflist_to_details', customDeflistRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
}