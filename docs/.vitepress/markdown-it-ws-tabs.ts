export default function markdownItWsTabs(md) {
  // Regular expression to match the opening <tabs> tag
  const TABS_OPEN_REGEX = /^<tabs\s*>/i;
  // Regular expression to match the closing </tabs> tag
  const TABS_CLOSE_REGEX = /<\/tabs\s*>\s*$/i; // Allow trailing whitespace on the closing line
  // Regular expression to parse individual <tab> elements.
  // It captures id, title, and the raw content of each tab.
  const TAB_REGEX = /<tab\s+id="(?<id>[^"]+)"\s+title="(?<title>[^"]+)"\s*>\s*([\s\S]*?)\s*<\/tab>/gi;

  function customTabsRule(state, startLine, endLine, silent) {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    let currentLineText = state.src.slice(pos, max);

    // Check if the current line starts with <tabs>
    if (!TABS_OPEN_REGEX.test(currentLineText)) {
      return false;
    }

    // If in silent mode, we've confirmed the block structure, so return true
    if (silent) {
      return true;
    }

    let openTagLine = startLine;
    let closeTagLine = -1;
    let blockContentString = "";

    // Extract the content of the <tabs> block
    const firstLineRaw = state.src.slice(state.bMarks[openTagLine] + state.tShift[openTagLine], state.eMarks[openTagLine]);
    const openTagMatch = TABS_OPEN_REGEX.exec(firstLineRaw);
    // This should always match due to the initial check, but good for safety
    if (!openTagMatch) return false;
    const openTagLength = openTagMatch[0].length;

    // Check if <tabs> and </tabs> are on the same line
    if (firstLineRaw.search(TABS_CLOSE_REGEX) > -1) {
      const closeTagIndex = firstLineRaw.search(TABS_CLOSE_REGEX);
      if (closeTagIndex > openTagLength) {
        blockContentString = firstLineRaw.substring(openTagLength, closeTagIndex);
        closeTagLine = openTagLine;
      } else {
        return false; // Malformed: </tabs> before or inside <tabs>
      }
    } else {
      // Multi-line block
      let contentLines = [];
      contentLines.push(firstLineRaw.substring(openTagLength)); // Content from the first line (after <tabs>)

      for (let currentLineIdx = startLine + 1; currentLineIdx < endLine; currentLineIdx++) {
        const lineText = state.src.slice(state.bMarks[currentLineIdx] + state.tShift[currentLineIdx], state.eMarks[currentLineIdx]);
        if (TABS_CLOSE_REGEX.test(lineText)) {
          closeTagLine = currentLineIdx;
          contentLines.push(lineText.substring(0, lineText.search(TABS_CLOSE_REGEX))); // Content before closing tag
          break;
        }
        contentLines.push(lineText);
      }
      if (closeTagLine === -1) return false; // No closing tag found
      blockContentString = contentLines.join('\n').trim();
    }

    const tabsData = [];
    let match;
    TAB_REGEX.lastIndex = 0; // Reset lastIndex before using exec in a loop for global regex

    while ((match = TAB_REGEX.exec(blockContentString)) !== null) {
      if (match.groups) {
        tabsData.push({
          id: match.groups.id,
          title: match.groups.title,
          // match[3] is the content between <tab ...> and </tab>
          content: match[3] ? match[3].trim() : ''
        });
      }
    }

    // If no valid <tab> elements are found, don't generate anything specific for tabs.
    // The content might be handled by other rules or just passed through if it's not Markdown.
    if (tabsData.length === 0) {
      state.line = closeTagLine + 1;
      return true;
    }

    let htmlOutput = '<div class="ws-tabs-container">\n';

    // Generate Tablist (buttons)
    htmlOutput += '  <div class="ws-tablist">\n';
    tabsData.forEach((tab, index) => {
      const isSelected = index === 0;
      const tabId = `tab-${md.utils.escapeHtml(tab.id)}`;
      htmlOutput += `    <input type="radio" id="${tabId}" ${isSelected ? ' checked=""' : ''}><label class="ws-tab" for="${tabId}">${md.utils.escapeHtml(tab.title)}</label>\n`;
    });
    htmlOutput += '  </div>\n';

    // Generate Tab Panels (content)
    htmlOutput += '  <div class="ws-tabcontents">\n';
    tabsData.forEach((tab, index) => {
      const isSelected = index === 0;
      const panelId = `panel-${md.utils.escapeHtml(tab.id)}`;
      htmlOutput += `  <div class="ws-tabcontent ${isSelected ? ' active' : ''}">\n`;
      const tabEnv = { ...state.env };
      delete tabEnv.frontmatter;
      htmlOutput += md.render(tab.content, tabEnv);
      htmlOutput += '  </div>\n';
    });
    htmlOutput += '  </div>\n';

    htmlOutput += '</div>\n';

    // Create a single html_block token with the generated HTML
    const token = state.push('html_block', '', 0);
    token.map = [startLine, closeTagLine + 1];
    token.content = htmlOutput;
    token.block = true; // Important for html_block tokens

    state.line = closeTagLine + 1; // Advance the parser past this block

    return true;
  }

  // Register the rule. It should run before 'html_block' to ensure it captures
  // the <tabs> structure first, as it resembles HTML but is custom.
  md.block.ruler.before('html_block', 'custom_xml_tabs', customTabsRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
}