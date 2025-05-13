/**
 * Plugin for markdown-it to convert <tldr> tags to <div class='ws-tldr'> tags
 * This preserves the content inside the tags
 */
export default function markdownItWsTldr(md) {
  // Get reference to the original renderer
  const defaultRender = md.renderer.rules.html_block || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  // Add a rule to replace <tldr> tags with <div class='ws-tldr'> tags in block HTML
  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    let content = tokens[idx].content;

    // Replace opening and closing tldr tags
    content = content.replace(/<tldr>/g, '<div class=\'ws-tldr\'>');
    content = content.replace(/<\/tldr>/g, '</div>');

    // Update token content
    tokens[idx].content = content;

    // Call the default renderer
    return defaultRender(tokens, idx, options, env, self);
  };

  // For multi-block handling, we need to intercept the parsing process
  const originalProcess = md.core.process.bind(md.core);

  md.core.process = function (state) {
    // First, apply normal processing
    originalProcess(state);

    // Then look for multiline tldr tags
    let inTldr = false;
    let tldrStart = -1;
    let tldrContent = [];

    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];

      if (token.type === 'html_block') {
        // Check for opening tldr tag
        if (!inTldr && /<tldr>/.test(token.content)) {
          inTldr = true;
          tldrStart = i;

          // If it's a complete tldr block in one token, we've already handled it
          if (/<\/tldr>/.test(token.content)) {
            inTldr = false;
            tldrStart = -1;
            continue;
          }

          // Start collecting content
          tldrContent = [token.content.replace(/<tldr>/, '<div class=\'ws-tldr\'>')];
        }
        // Check for closing tldr tag
        else if (inTldr && /<\/tldr>/.test(token.content)) {
          inTldr = false;

          // Add final content part
          tldrContent.push(token.content.replace(/<\/tldr>/, '</div>'));

          // Create a new combined token
          const newToken = new state.Token('html_block', '', 0);
          newToken.content = tldrContent.join('');
          newToken.block = true;

          // Replace the span of tokens with our new combined token
          state.tokens.splice(tldrStart, i - tldrStart + 1, newToken);

          // Reset the index as we've modified the array
          i = tldrStart;
          tldrStart = -1;
          tldrContent = [];
        }
        // Collect content inside tldr tags
        else if (inTldr) {
          tldrContent.push(token.content);
        }
      } else if (inTldr) {

        const rendered = md.renderer.renderToken([token], 0, md.options);
        if (rendered) {
          tldrContent.push(rendered);
        }

      }
    }

    return state;
  };
}
