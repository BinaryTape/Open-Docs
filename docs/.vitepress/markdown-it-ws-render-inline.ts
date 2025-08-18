export default function markdownItWsRenderInline(md) {
    const originalHtmlBlockRule = md.renderer.rules.html_block;

    const componentRegex =
        /^<(deflist|def|tldr|tabs|tab|topic|Var|include)([^>]*)>([\s\S]*?)<\/\1>\s*$/m;

    md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const content = token.content.trim();

        const match = content.match(componentRegex);

        if (match) {
            const tagName = match[1];
            const attributes = match[2];
            const innerContent = match[3].trim();

            const renderedInnerContent = md.renderInline(innerContent, env);

            return `<${tagName}${attributes}>${renderedInnerContent}</${tagName}>`;
        }

        return originalHtmlBlockRule(tokens, idx, options, env, self);
    };
}