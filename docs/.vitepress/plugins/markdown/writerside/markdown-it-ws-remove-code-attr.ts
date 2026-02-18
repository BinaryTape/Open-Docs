export default function markdownItWsRemoveCodeAttr(md) {
    md.core.ruler.after("normalize", "remove-code-attrs", function (state) {
        state.src = state.src.replace(
            /([ \t]*)```\n[ \t]*\{[\s\S]*?\}/gm,
            (match, indention) => {
                return `${indention}\`\`\`\n`
            }
        );
    });
}