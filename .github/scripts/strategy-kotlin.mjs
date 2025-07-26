import {defaultStrategy} from "./strategy.mjs";
import { copyFlatten } from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFile} from "./TopicProcessor.mjs";

export const kotlinStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["docs/topics/**/*.md"],

    /**
     * @override
     */
    onSyncEnd: async (repoPath) => {
        console.log(`  Running Kotlin onSyncEnd: Flattening directory - ${repoPath}...`);
        const docsPath = path.join(repoPath, "docs/topics");
        if (await fs.pathExists(docsPath)) {
            await copyFlatten(docsPath, docsPath);
        }
        console.log(`  Flattening finished - ${repoPath}`);

        console.log(`  Running Kotlin onSyncEnd: Remove redundant files - ${repoPath}...`);
        const redundantFiles = ["kotlin-mascot.md", "debugging.md"];
        for (const file of redundantFiles) {
            const filePath = path.join(docsPath, file);
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
            }
        }
        console.log(`  Remove redundant files finished - ${repoPath}`);

        console.log(` Running Kotlin onSyncEnd: Convert topic files - ${repoPath}`);
        const docs = await fs.readdir(docsPath);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic"));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFile(topicPath, docsPath)
            await fs.remove(topicPath);
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(`  Running Kotlin onSyncEnd: Resolve includes - ${repoPath}`);
        const includeMD = path.join(docsPath, "kotlin-language-features-and-proposals.md");
        let content = await fs.readFile(includeMD, "utf8");
        const includeFilterRe = /<include\s+element-id="([^"]+)"\s+use-filter="([^"]+)"\s+from="([^"]+)"\s*\/?>/g;

        content = content.replace(includeFilterRe, (match, elementId, filterMatch, from) => {
            const filter = filterMatch.split(',')[1]
            const trMatch = content.match(new RegExp(`<tr\\s+filter="${filter}">([\\s\\S]*?)<\\/tr>`, 'g'));
            if (!trMatch) return '';

            const tr = trMatch.join('\n\n');
            return `<table>\n${tr}\n</table>`
        })

        await fs.writeFile(includeMD, content, "utf8");
        console.log(`  Resolve includes finished - ${repoPath}`);
    },

    /**
     * @override
     */
    onTranslateEnd: async (context, repoConfig) => {
        console.log(`  Copying Kotlin version file... `);
        const versionFile = "kotlin-repo/docs/v.list";
        if (await fs.pathExists(versionFile)) {
            await fs.copy(versionFile, "docs/.vitepress", { overwrite: true });
            console.log(`  Copying Kotlin version file finished - ${repoConfig.path}`);
        }

        console.log(`  Handling Kotlin assets: Copying images - ${repoConfig.path}... `);
        const { src, dest } = repoConfig.assets;
        const srcPath = path.join(repoConfig.path, src);
        if (await fs.pathExists(srcPath)) {
            await fs.ensureDir(dest);
            await copyFlatten(srcPath, dest);
            context.gitAddPaths.add(dest); // 将目标目录加入待提交列表
        } else {
            console.warn(
                `  ⚠️  Warning: Asset source directory not found: ${srcPath}`
            );
        }
    },
};