import fs from "fs";
import path from "path";

/**
 * Topic Processor
 * Extracts content from <topic> tags in .topic files and saves it to markdown files
 *
 * @param {string} inputFile - Input file path
 * @param {string} outputPath - Output file path
 * @param isKtor
 */
export function processTopicFile(inputFile, outputPath, isKtor = false) {
    // Read the .topic file content
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read file:', err);
            return;
        }

        // Use regex to match <topic> tag and its content
        const match = data.match(/<topic\s*([^>]*)>([\s\S]*?)<\/topic>/);
        if (match) {
            let topicContent = match[0];

            // Create output directory if it doesn't exist
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }

            if (isKtor) {
                topicContent = processTopicContent(outputPath, topicContent)
            }

            // Remove any empty lines from the extracted topic content
            topicContent = topicContent
                .split(/\r?\n/)       // split into lines
                .filter(line => line.trim() !== '') // keep non-blank lines
                .join('\n');          // join back without blanks

            if (topicContent.includes('<section-starting-page>')) {
                topicContent = "---\naside: false\n---\n" + topicContent
            }

            const inputFileName = path.basename(inputFile).replace('.topic', '');
            const outputFile = path.join(outputPath, `${inputFileName}.md`);

            // Write the extracted content to the output file
            fs.writeFile(outputFile, topicContent, (err) => {
                if (err) {
                    console.error('Failed to write file:', err);
                } else {
                    console.log(`Successfully exported <topic> content to ${outputFile}`);
                }
            });
        } else {
            console.log('No <topic> tag found');
        }
    });
}

export function processTopicContent(docsPath, topicContent) {
    const docName = docsPath.split('/')[0].split('-')[0]
    const docRoot = `/${docName}/`

    function docHref(href) {
        return `${docRoot}${href.split('.')[0]}`
    }

    // Replace <path> tags
    topicContent = topicContent.replace(/<path>([\s\S]*?)<\/path>/g, '<Path>$1</Path>');

    topicContent = replaceInclude(topicContent, docsPath);

    topicContent = topicContent.replace(
        /<card\s*([^>]*)\/>/g,
        (match, attrs) => {
            const href = attrs.match(/href="([^"]+)"/)[1];
            if (href.startsWith('http')) {
                return match;
            }

            const topicPath = path.join(docsPath, href);
            const summary = getCardSummary(topicPath);
            const inner = getTopicTitle(topicPath);

            return `<card href="${docHref(href)}" summary="${summary}">${inner}</card>`;
        }
    )

    topicContent = topicContent.replace(
        /<card\b\s*([^>]*)>([\s\S]*?)<\/card>/g,
        (match, attrs, inner) => {
            const href = attrs.match(/href="([^"]+)"/)[1];
            const summaryMatch = attrs.match(/summary="([^"]+)"/);

            if (href.startsWith('http')) {
                return match;
            }

            const topicPath = path.join(docsPath, href);
            const summary = summaryMatch ? summaryMatch[1] : getCardSummary(topicPath);

            return `<card href="${docHref(href)}" summary="${summary}">${inner}</card>`;
        }
    )

    topicContent = topicContent.replace(
        /<a\s*([^>]*)\/>/g,
        (match, attrs) => {
            const anchor = attrs.match(/anchor="([^"]+)"/);
            const href = attrs.match(/href="([^"]+)"/);

            if (anchor && href) {
                return `<a href="${href[1]}#${anchor[1]}"></a>`;
            } else if (href) {
                return `<a href="${href[1]}"></a>`;
            }
        }
    )

    topicContent = topicContent.replace(
        /<a\b\s*([^>]*)>([\s\S]*?)<\/a>/g,
        (match, attrs, inner) => {

            const anchor = attrs.match(/anchor="([^"]+)"/);
            if (anchor) {
                return `<a href="#${anchor[1]}">${inner}</a>`;
            }

            const summaryMatch = attrs.match(/summary="([^"]+)"/);
            const href = attrs.match(/href="([^"]+)"/)[1];
            if (summaryMatch && summaryMatch[1] !== undefined) {
                return `<card href="${docHref(href)}" summary="${summaryMatch[1]}">${inner}</card>`;
            }

            if (href.startsWith('http')) {
                return match;
            }

            if (href.startsWith('#')) {
                return match;
            } else if (href.includes('#')) {
                const topicPath = path.join(docsPath, href.split('#')[0]);
                inner = getChapterTitle(topicPath, href.split('#')[1]);
                return `<a href="${href}">${inner}</a>`;
            }

            const topicPath = path.join(docsPath, href);
            if (inner === '') {
                inner = getTopicTitle(topicPath);
            }

            const summary = getLinkSummary(topicPath);

            return `<Links href="${docHref(href)}" summary="${summary}">${inner}</Links>`;
        }
    );

    // 1) Transform self-closing <code-block src="..." include-lines="..."/>
    topicContent = topicContent.replace(
        /<code-block\b([^>]*?)\s+src="([^"]+)"([^>]*)\/>/gi,
        async (match, beforeAttrs, srcPath, afterAttrs) => {

            let ranges = [];
            // apply include-lines if present
            const inc = /include-lines="([^"]+)"/.exec(beforeAttrs + afterAttrs);
            if (inc) {
                ranges = inc[1].split(',');
            }

            const snippetsPath = path.join(docsPath.split('/')[0], 'codeSnippets');
            let codeText = await fetchSnippet(snippetsPath, srcPath, ranges);

            // trim blank lines
            codeText = codeText.replace(/^\s*\n/, '').replace(/\n\s*$/, '');
            // escape and encode newlines
            const escaped = codeText
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '&#10;');

            // rebuild attributes without src/include-lines
            const cleanAttrs = (beforeAttrs + afterAttrs)
                .replace(/\s+src="[^"]+"/, '')
                .replace(/\s+include-lines="[^"]+"/, '')
                .trim();
            const space = cleanAttrs ? ' ' : '';
            return `<code-block${space}${cleanAttrs} code="${escaped}"/>`;
        }
    );
    // Transform <code-block ...>...</code-block>, skipping those with src attribute

    topicContent = topicContent.replace(
        /<code-block\b(?![^>]*\/>)\s*([^>]*)>([\s\S]*?)<\/code-block>/gi,
        async (match, rawAttrs, inner) => {

            if (/\s+code="[\s\S]*?"/.test(rawAttrs)) {
                return match;
            }

            let rawCode;
            if (/\bsrc=/i.test(rawAttrs)) {
                const src = /src="([^"]+)"/.exec(rawAttrs);
                const include_lines = /include-lines="([^"]+)"/.exec(rawAttrs);
                const ranges = include_lines ? include_lines[1].split(',') : [];
                const snippetsPath = path.join(docsPath.split('/')[0], "codeSnippets");
                rawCode = await fetchSnippet(snippetsPath, src[1], ranges);
                rawAttrs = rawAttrs.replace(/\s+src="[^"]+"/, '')
                    .replace(/\s+include-lines="[^"]+"/, '')
                    .trim();
            } else {
                rawCode = inner.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '');
            }

            // Extract raw code, handle CDATA
            // Remove leading/trailing blank lines inside code
            rawCode = rawCode.replace(/^\s*\n/, '').replace(/\n\s*$/, '');

            // Escape HTML entities and encode newlines as &#10;
            const escaped = rawCode
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/\n/g, '&#10;');

            // Rebuild self-closing tag
            const space = rawAttrs ? ' ' : '';
            return `<code-block${space}${rawAttrs} code="${escaped}"/>`;
        }
    );

    return topicContent;
}

export function replaceInclude(source, docsPath) {
    return source.replace(
        /<include\s+from="([^"]+)"\s+element-id="([^"]+)"\s*\/?>/g,
        (match, from, elementId) => {
            let file = fs.readFileSync(`${docsPath}/${from}`, 'utf8');

            let reg = ''
            if (from.endsWith('.md')) {
                reg = new RegExp(`<([^\\s>]+)(?:\\s+[^>]*?)?\\s+id="${elementId}">([\\s\\S]*?)<\\/\\1>$`, 'm');
                const match = file.match(reg);
                if (match) {
                    return removeSingleIndention(match[0]);
                }
            } else {
                reg = new RegExp(`<snippet\\b[^>]*\\bid="${elementId}"[^>]*>([\\s\\S]*?)<\\/snippet>`);
                const match = file.match(reg);
                if (match) {
                    return removeSingleIndention(match[1]);
                }
            }
        }
    );
}

function removeSingleIndention(content) {
    const lines = content.split('\n');

    const dedentedLines = lines.map(line => {
        if (line.trim().length === 0) {
            return line;
        }

        if (line.startsWith('    ')) {
            return line.slice(4);
        } else if (line.startsWith('\t')) {
            return line.slice(1);
        } else {
            return line;
        }
    });

    return dedentedLines.join('\n');
}

export async function fetchSnippet(snippetsPath, srcPath, include_lines) {
    // load external file //http file
    let codeText;

    if (srcPath.startsWith('http')) {
        try {
            if (typeof fetch === "function") {
                const res = await fetch(srcPath, {redirect: "follow"});
                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
                codeText = await res.text();
            }
        } catch (e) {
            console.warn("Unable to load snippet from URL.", srcPath, e?.message || e);
            return "";
        }
    } else {
        try {
            const snippetFile = path.join(snippetsPath, srcPath);
            codeText = fs.readFileSync(snippetFile, 'utf8');
        } catch (e) {
            console.warn('Unable to load snippet from file.', srcPath);
            return '';
        }
    }

    if (include_lines.length > 0) {
        const lines = codeText.split(/\r?\n/);
        const sel = [];
        include_lines.forEach(r => {
            if (r.includes('-')) {
                const [s, e] = r.split('-').map(n => parseInt(n, 10) - 1);
                sel.push(...lines.slice(s, e + 1));
            } else {
                const idx = parseInt(r, 10) - 1;
                if (lines[idx] !== undefined) sel.push(lines[idx]);
            }
        });
        codeText = sel.join('\n');
    }

    return codeText;
}

export function getTopicTitle(fileUrl) {
    try {
        const file = fs.readFileSync(fileUrl, 'utf8');

        let match;
        if (fileUrl.includes('.md')) {
            match = file.match(/^\[\/\/\]:\s*#\s*\(title:\s*(.+?)\s*\)/);
            return match ? match[1] : '';
        } else {
            match = file.match(/<topic\b([^>]*?)\s+title="([^"]+)"([^>]*?)>/);
            return match ? match[2] : '';
        }
    } catch (e) {
        console.error('Failed to get topic title', fileUrl, e);
        return '';
    }
}

export function getChapterTitle(fileUrl, chapterId) {
    try {
        const file = fs.readFileSync(fileUrl, 'utf8');

        let match;
        if (fileUrl.includes('.md')) {
            match = file.match(new RegExp(`#{1,6}\\s*(.+?)\\s*\\{id="${chapterId}"\\}`));
        } else {
            match = file.match(new RegExp(`<chapter\\s+title="([^"]+)"\\s+id="${chapterId}">([\\s\\S]*?)<\\/chapter>`));
        }
        if (match && match[1] !== undefined) {
            return match[1];
        }
    } catch (e) {
        console.error('Failed to get chapter title', fileUrl, e);
    }
}

function getCardSummary(fileUrl) {
    try {
        const file = fs.readFileSync(fileUrl, 'utf8');
        const match = file.match(/<card-summary>([\s\S]*?)<\/card-summary>/);
        if (match && match[1] !== undefined) {
            return match[1].trim();
        }
    } catch (e) {
        console.error('Failed to get link summary', fileUrl, e);
    }
}

export function getLinkSummary(fileUrl) {
    try {
        const file = fs.readFileSync(fileUrl, 'utf8');
        const match = file.match(/<link-summary>([\s\S]*?)<\/link-summary>/);
        if (match && match[1] !== undefined) {
            return match[1].trim();
        } else {
            const match = file.match(/<tldr>([\s\S]*?)<\/tldr>/);
            if (match && match[1] !== undefined) {
                match[1] = match[1].replace(/<([\s\S]*?)>/g, '')
                return match[1].trim();
            }
        }
    } catch (e) {
        console.error('Failed to get link summary', fileUrl, e);
    }
}

