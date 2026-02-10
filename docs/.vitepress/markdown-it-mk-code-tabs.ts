// Process Material MKDocs flavored Content Tabs to VitePress Custom Containers

interface TabStackItem {
  indent: string;
  outputIndent: string;
  type: 'tabs' | 'tab';
}

export default function markdownItMkCodeTabs(md: any) {
  md.core.ruler.before('normalize', 'mk_tabs_to_container', (state: any) => {
    const lines = state.src.split('\n');
    const newLines: string[] = [];
    const stack: TabStackItem[] = []; // Stack of { indent: string, type: 'tabs' | 'tab' }

    function closeLevels(targetIndentLen: number) {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (top.indent.length >= targetIndentLen) {
          // Close the level
          if (top.type === 'tabs') {
            newLines.push(`${top.outputIndent}</tabs>`);
            // Add blank line after closing tabs to ensure subsequent markdown content is parsed correctly
            newLines.push('');
          } else {
            newLines.push(`${top.outputIndent}</tab>`);
          }
          stack.pop();
        } else {
          break;
        }
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(\s*)===\s*"(.*)"\s*$/);

      if (match) {
        const indent = match[1];
        const title = match[2];

        // Close strictly deeper levels first
        closeLevels(indent.length + 1);

        // Check if we are at the same level as a current tab
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          if (top.indent.length === indent.length && top.type === 'tab') {
            // Close sibling tab
            newLines.push(`${top.outputIndent}</tab>`);
            stack.pop();
          }
        }

        // Calculate output indent
        let outputIndent = indent;
        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          // Parent content is indented by parent.indent + 4 spaces
          // We want to dedent relative to that.
          // Actually, we want to simply use the parent's outputIndent?
          // No, if list item... 
          // Logic: source indent - (parent.indent + 4) + parent.outputIndent ??
          // Simpler: If in a tab, we dedent by (parent.indent + 4).
          // But we need to keep any base indentation from list items.
          // If parent is at Source=0, Output=0.
          // Inner is Source=4. Dedent=4. Output=0.

          // If Parent is Source=4 (List), Output=4.
          // Inner is Source=8. Dedent=8 (absolute?) or 4 relative?
          // Inner Source 8. Parent Content Start = 4+4=8.
          // So dedent 8? 
          // Result 0 relative to parent... so 0 + ParentOutput(4) = 4?

          // Wait, simply: the indentation we strip from source is `parent.indent.length + 4`.
          // But we need to prepend `parent.outputIndent`?
          // If we strictly flatten:
          // Top level tabs -> OutputIndent = indent.
          // Nested tabs -> OutputIndent = parent.outputIndent.
          // Because content starts at parent.outputIndent.

          // Let's try: Nested tabs always align with their container.
          // Container for Inner is Outer. Outer starts at 0.
          // Inner should start at 0.
          // Container for List Tab is List Item (0). Tab starts at 4.

          // So:
          if (parent.type === 'tab') {
            // If nested inside a tab, align with parent tab's content start (which is effectively parent.outputIndent)
            outputIndent = parent.outputIndent;
          } else {
            // inside 'tabs' group?
            // 'tabs' group has same indent as 'tab'.
            outputIndent = parent.outputIndent;
          }
        }

        // Check if we need to start a new group
        let inGroup = false;
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          if (top.indent.length === indent.length && top.type === 'tabs') {
            inGroup = true;
          }
        }

        if (!inGroup) {
          newLines.push(`${outputIndent}<tabs>`);
          stack.push({ indent: indent, type: 'tabs', outputIndent: outputIndent });
        }

        // Start tab
        newLines.push(`${outputIndent}<tab title="${title}">`);
        stack.push({ indent: indent, type: 'tab', outputIndent: outputIndent });

      } else {
        // Content or outside
        if (line.trim() === '') {
          newLines.push(line);
          continue;
        }

        const currentIndentMatch = line.match(/^(\s*)/);
        const currentIndentLen = currentIndentMatch ? currentIndentMatch[1].length : 0;

        // Check if valid content for current tab
        let isContent = false;
        if (stack.length > 0) {
          const top = stack[stack.length - 1];
          // If we are in a tab (top.type === 'tab')
          // Valid content must be deeper than header indent.
          if (currentIndentLen > top.indent.length && top.type === 'tab') {
            isContent = true;

            // Dedent logic: remove 4 spaces relative to parent, if possible.
            let content = line;
            if (content.startsWith(top.indent)) {
              content = content.slice(top.indent.length);
              // Remove up to 4 spaces
              if (content.startsWith('    ')) {
                content = content.slice(4);
              } else if (content.startsWith('\t')) {
                content = content.slice(1);
              } else {
                // fallback
              }
              newLines.push(top.outputIndent + content);
            } else {
              newLines.push(line);
            }
          }
        }

        if (!isContent) {
          // Not content for current tab (or stack empty)
          // Close levels that are >= currentIndent
          closeLevels(currentIndentLen);
          newLines.push(line);
        }
      }
    }

    // End of doc, close all
    closeLevels(0);

    state.src = newLines.join('\n');
  });
}
