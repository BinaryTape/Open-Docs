// Process Material MKDocs flavored Code Tabs to VitePress Code Group
export default function markdownItMkCodeTabs(md) {
  function transformContentTabs(state) {
    const src = state.src;
    const lines = src.split('\n');
    const newLines = [];
    let i = 0; // Current line index in the original `lines` array

    // Regex for the start of an MKDocs content tab header
    // Captures: 1: blockIndent, 2: tabTitle
    const tabStartRegex = /^(\s*)===\s*"([^"]+)"\s*$/;

    while (i < lines.length) {
      const currentLine = lines[i];
      const firstTabMatch = currentLine.match(tabStartRegex);

      if (firstTabMatch) {
        const blockIndent = firstTabMatch[1] || ''; // Indentation of the '===' line itself
        let currentGroupLineIndex = i; // Line index for iterating through potential tabs in a group
        const collectedTabs = []; // Stores data for each tab in the current group

        // Loop to collect all contiguous tabs belonging to this group
        while (currentGroupLineIndex < lines.length) {
          const lineForGroupCheck = lines[currentGroupLineIndex];
          const tabMatch = lineForGroupCheck.match(tabStartRegex);

          // Check if this line is a tab header at the same blockIndent level
          if (tabMatch && (tabMatch[1] || '') === blockIndent) {
            const tabTitle = tabMatch[2];
            let codeLinesForThisTab = [];
            let currentTabLang = '';
            let currentTabActualIndent = ''; // Indentation of the '```' line itself
            let inCodeBlockForThisTab = false;
            // Start scanning for this tab's content from the line *after* the '===' header
            let tabContentEndLineIndex = currentGroupLineIndex + 1;

            let contentScanIndex = currentGroupLineIndex + 1;
            while (contentScanIndex < lines.length) {
              const contentLine = lines[contentScanIndex];

              if (!inCodeBlockForThisTab) {
                // Allow blank lines (at least blockIndent deep) before the code block starts
                if (contentLine.trim() === '' && contentLine.startsWith(blockIndent) && !contentLine.substring(blockIndent.length).trimStart()) {
                  contentScanIndex++;
                  tabContentEndLineIndex = contentScanIndex;
                  continue;
                }

                // Regex for '```lang', capturing its own indent and lang
                // Expects code block to be more indented than the '===' line
                const codeBlockStartMatch = contentLine.match(/^(\s*)```(\w*)/);
                if (codeBlockStartMatch && codeBlockStartMatch[1].length > blockIndent.length) {
                  inCodeBlockForThisTab = true;
                  currentTabActualIndent = codeBlockStartMatch[1]; // Full indent of the ``` line
                  currentTabLang = codeBlockStartMatch[2] || '';
                  tabContentEndLineIndex = contentScanIndex + 1; // Consume the opening ``` line
                } else {
                  // Not a valid indented code block start for this tab. This tab definition ends here.
                  break;
                }
              } else { // We are inside a code block, looking for content or the closing ```
                // Check for closing fence, it must match currentTabActualIndent
                if (contentLine.startsWith(currentTabActualIndent + "```")) {
                  tabContentEndLineIndex = contentScanIndex + 1; // Consume the closing ``` line
                  break; // End of this tab's content
                }
                // Add the code line, de-dented relative to the ``` fence's own indentation
                codeLinesForThisTab.push(contentLine.substring(currentTabActualIndent.length));
                tabContentEndLineIndex = contentScanIndex + 1;
              }
              contentScanIndex++;
            } // End while loop for a single tab's content

            if (inCodeBlockForThisTab) {
              collectedTabs.push({
                title: tabTitle,
                lang: currentTabLang,
                codeLines: codeLinesForThisTab,
              });
              currentGroupLineIndex = tabContentEndLineIndex; // Move to the line after this tab's content
            } else {
              // This '===' line was not followed by a valid code block.
              // End the current group collection. The '===' line will be handled as plain text.
              break;
            }
          } else {
            // This line is not part of the current tab group (e.g. different indent or not a tab header)
            break;
          }
        } // End while loop for collecting a group of tabs

        if (collectedTabs.length > 0) {
          // Construct the VitePress code-group
          newLines.push(`${blockIndent}::: code-group`);
          for (const tab of collectedTabs) {
            newLines.push(`${blockIndent}\`\`\`${tab.lang} [${tab.title}]`);
            for (const codeLine of tab.codeLines) {
              // Prepend original blockIndent to the already de-dented code line
              newLines.push(blockIndent + codeLine);
            }
            newLines.push(`${blockIndent}\`\`\``);
          }
          newLines.push(`${blockIndent}:::`);
          i = currentGroupLineIndex; // Update main loop index to after the processed group
        } else {
          // No valid tab group was formed from the initial '===' line (e.g., malformed content).
          // Push the original '===' line and let it be handled as plain text.
          newLines.push(currentLine);
          i++;
        }
      } else {
        // Line is not a tab start, keep it as is
        newLines.push(currentLine);
        i++;
      }
    } // End while loop for all lines in the source

    state.src = newLines.join('\n');
  }

  md.core.ruler.before('normalize', 'content_tabs_to_code_group', transformContentTabs);
}
