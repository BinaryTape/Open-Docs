export default function markdownItWsRename(md) {
    const defaultRender = md.renderer.rules.html_block || function (tokens, idx, options, env, self) {
        return tokens[idx].content;
    };

    md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
        tokens[idx].content = tokens[idx].content.replace(/<video/g, '<YouTubeVideo');
        return defaultRender(tokens, idx, options, env, self);
    };
}