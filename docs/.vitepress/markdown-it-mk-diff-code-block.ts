// Process Material MKDocs flavored diff code block

export default function markdownItMkDiffCodeBlock(md) {
  // Store the original fence renderer
  const defaultFenceRenderer = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''; // Unescape and trim info string

    let langName = '';
    let titleValue = null;

    if (info) {
      const langParts = info.split(/\s+/g);
      if (langParts.length > 0) {
        langName = langParts[0]; // First word is the language
      }

      // Regex to extract title="some value"
      // \b ensures "title" is a whole word
      // "([^"]*)" captures content within double quotes. Allows empty title.
      const titleMatch = info.match(/\btitle="([^"]*)"/);
      if (titleMatch && typeof titleMatch[1] !== 'undefined') {
        titleValue = md.utils.escapeHtml(titleMatch[1]); // Escape HTML special chars in title
      }
    }

    // Check if it's a 'diff' code block and a title was successfully extracted
    if (langName === 'diff' && titleValue !== null) {
      // Construct the title HTML element
      const titleHtml = `<div class="vp-code-block-title-bar">${titleValue}</div>\n`;

      // Get the default rendering of the fenced code block
      const codeBlockHtml = defaultFenceRenderer(tokens, idx, options, env, self);

      // Wrap the title and the code block in a new div
      // Added a specific class for styling the diff wrapper
      return `<div class="vp-code-block-title">\n${titleHtml}${codeBlockHtml}</div>\n`;
    }

    // If it's not a 'diff' block with a title, or if parsing failed,
    // use the default renderer.
    return defaultFenceRenderer(tokens, idx, options, env, self);
  };
}