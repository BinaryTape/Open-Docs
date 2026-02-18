import { DOCS_TYPES, DocsTypeConfig } from "../../../docs.config";

export default function markdownItWsRename(md) {
    const defaultRender = md.renderer.rules.html_block || function (tokens, idx, options, env, self) {
        return tokens[idx].content;
    };

    md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
        const parts = env.relativePath.split('/')
        const docType = parts.find(p => DOCS_TYPES.includes(p))
        const docTypeConfig = DocsTypeConfig[docType];
        if (docTypeConfig.framework === "Writerside") {
            tokens[idx].content = tokens[idx].content.replace(/<video/g, '<YouTubeVideo');
        }
        return defaultRender(tokens, idx, options, env, self);
    };
}