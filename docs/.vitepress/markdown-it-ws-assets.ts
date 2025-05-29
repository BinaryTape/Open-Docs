export default function markdownItWsAssets(md) {

  /**
   * Checks if a given src attribute value should be prepended with a slash.
   * @param {string} src The source attribute value.
   * @returns {boolean} True if a slash should be prepended, false otherwise.
   */
  function shouldPrependSlash(src) {
    if (!src) {
      return false; // Ignore empty or null src
    }
    // Do not prepend if it's an absolute URL, already starts with a slash,
    // is an anchor link, or a data URI.
    return !(
      src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('/') ||
      src.startsWith('#') ||
      src.startsWith('data:')
    );
  }

  /**
   * Processes the token stream to modify image 'src' attributes.
   * @param {Object} state The Markdown-it state object.
   */
  function prefixImageSrcInTokens(state) {
    state.tokens.forEach(token => {
      // Handle Markdown images: ![]()
      if (token.type === 'image') {
        const attrs = token.attrs;
        if (attrs) {
          for (let i = 0; i < attrs.length; i++) {
            if (attrs[i][0] === 'src') {
              const originalSrc = attrs[i][1];
              if (shouldPrependSlash(originalSrc)) {
                attrs[i][1] = '/' + originalSrc;
              }
              break; // Found src, no need to check other attributes
            }
          }
        }
      }
      // Handle HTML <img> tags within html_block or html_inline tokens
      else if (token.type === 'html_block' || token.type === 'html_inline') {
        // Regex to find <img> tags and their src attributes.
        // Group 1: Everything before the src value, including `src=` and the opening quote.
        // Group 2: The src value itself.
        // Group 3: The closing quote and the rest of the tag.
        const imgTagRegex = /(<img\s+(?:[^>]*?\s+)?src=(["']))([^"']+)(\2[^>]*>)/gi;

        token.content = token.content.replace(imgTagRegex, (match, g1BeforeSrc, quoteChar, g3SrcValue, g4AfterSrc) => {
          if (shouldPrependSlash(g3SrcValue)) {
            // Reconstruct the tag with the prepended slash
            return `${g1BeforeSrc}/${g3SrcValue}${g4AfterSrc}`;
          }
          // If no modification is needed, return the original match
          return match;
        });
      }
    });
  }

  // Add the rule to the core ruler.
  // This allows the plugin to modify tokens after parsing but before rendering.
  md.core.ruler.push('image_src_prefixer', prefixImageSrcInTokens);
}
