// Process Material MKDocs flavored admonition

export default function markdownItMkAdmonition(md) {
  function transformAdmonitions(state) {
    let src = state.src;
    const lines = src.split('\n');
    const newLines = [];
    let i = 0;

    // Regex to find the start of an MKDocs admonition
    // ^(\s*)!!!             - Start of line, optional leading whitespace (capture 1), then !!!
    // \s+                   - One or more spaces
    // (\w+)                 - The admonition type (e.g., note, warning) (capture 2)
    // (?:\s+"([^"]*)")?     - Optional: space, then a quoted title (capture 3 is the title content)
    // \s*$                  - Optional trailing whitespace, end of line
    const admonitionStartRegex = /^(\s*)!!!\s+(\w+)(?:\s+"([^"]*)")?\s*$/;

    while (i < lines.length) {
      const currentLine = lines[i];
      const match = currentLine.match(admonitionStartRegex);

      if (match) {
        const leadingWhitespace = match[1] || ''; // Whitespace before !!!
        const type = match[2];
        const title = match[3] || ''; // Title content, or empty string if not present

        const content = [];
        let admonitionContentStartIndex = i + 1;
        let hasActualContent = false;

        // Determine the expected indentation for content lines.
        // MKDocs admonition content is typically indented by 4 spaces
        // relative to the '!!!' line's indentation.
        const expectedContentIndent = leadingWhitespace + '    ';

        // Find content lines
        for (let j = admonitionContentStartIndex; j < lines.length; j++) {
          const contentLine = lines[j];
          // Check if the line has the expected indentation for content
          if (contentLine.startsWith(expectedContentIndent)) {
            content.push(contentLine.substring(expectedContentIndent.length));
            hasActualContent = true;
          }
          // Empty or whitespace-only line
          else if (contentLine.trim() === '' && contentLine.startsWith(leadingWhitespace)) {
            // Check if the next line continues the admonition or if this is an empty line at the end.
            if (j + 1 < lines.length && lines[j + 1].startsWith(expectedContentIndent)) {
              content.push(''); // Preserve blank line within content
              hasActualContent = true;
            } else if (hasActualContent) {
              content.push('');
            } else {
              break;
            }
          }
          else {
            break;
          }
          admonitionContentStartIndex = j + 1; // Update line counter
        }

        if (hasActualContent) {
          // Construct VitePress container
          newLines.push(`${leadingWhitespace}::: ${type}${title ? ' ' + title.trim() : ''}`);
          newLines.push(...content.map(line => {
            return line;
          }));
          newLines.push(`${leadingWhitespace}:::`);
          i = admonitionContentStartIndex; // Move master index past processed admonition
        } else {
          // No valid content found, treat as regular line
          newLines.push(currentLine);
          i++;
        }
      } else {
        // Not an admonition start, keep line as is
        newLines.push(currentLine);
        i++;
      }
    }
    state.src = newLines.join('\n');
  }

  md.core.ruler.before('normalize', 'ws_admonition_transform', transformAdmonitions);
}