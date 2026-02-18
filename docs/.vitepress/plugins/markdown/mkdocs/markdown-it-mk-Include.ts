// Process Material MKDocs flavored include
export default function markdownItMKInclude(md) {
  /**
   * Replace Liquid include syntax with VitePress include syntax
   * For example: {% include 'common/coroutines-multiplatform.md' %}
   * Replace with: <!--@include: common/coroutines-multiplatform.md-->
   */
  function replaceLiquidIncludes(state) {
    let currentSrc = state.src;

    // Use regular expression to find {% include '...' %} format
    // Handle both single and double quotes cases
    const includeRegex = /{%\s*include\s+['"]([^'"]+)['"]\s*%}/g;

    // Replace with VitePress include syntax
    currentSrc = currentSrc.replace(includeRegex, (match, path) => {
      return `<!--@include: ../${path}-->`;
    });

    state.src = currentSrc;
  }

  // Add the processor to the core ruler
  // Run before block parsing to ensure the conversion happens at an early stage of Markdown processing
  md.core.ruler.before('normalize', 'liquid_include_replacer', replaceLiquidIncludes);
}
