import type { ShikijiTransformer, ShikiLine } from 'shikiji';

// Remove {++/--/==, ++/--/==}
export default function shikiRemoveDiffMarker(): ShikijiTransformer {
  const markerRegex = /\{\+\+|\+\+\}|\{--|\--\}|\{==|==\}/g;
  return {
    name: 'shikiji-transformer:remove-diff-markers',
    tokens(lines: ShikiLine[]) {
      lines.forEach(lineTokens => {
        for (const token of lineTokens) {
          token.content = token.content.replace(markerRegex, '');
        }
      });
    },
  };
}