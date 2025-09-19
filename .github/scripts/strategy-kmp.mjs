import {defaultStrategy} from "./strategy.mjs";
import {copyFlatten} from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFileAsync} from "./TopicProcessor.mjs";
import {generateSidebar} from "./SidebarProcessor.mjs";
import {processMarkdownFile} from "./MarkdownProcessor.mjs";

export const kmpStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["topics/**/*.md", "topics/**/*.topic"],

    postSync: async (repoPath) => {},

    /**
     * @override
     */
    postDetect: async (repoConfig, task) => {
        const repoPath = repoConfig.path

        console.log(`  Running KMP postDetect: Flattening directory - ${repoPath}...`);
        const docsPath = path.join(repoPath, "topics");
        if (await fs.pathExists(docsPath)) {
            await copyFlatten(docsPath, docsPath);
        }
        console.log(`  Flattening finished - ${docsPath}`);

        console.log(` Running KMP postDetect: Process markdown files - ${repoPath}`);
        const docs = await fs.readdir(docsPath);
        const mdFiles = docs.filter(doc => doc.endsWith(".md"));
        for (const md in mdFiles) {
            const mdPath = path.join(docsPath, mdFiles[md]);
            await processMarkdownFile(mdPath);
        }
        console.log(`  Process markdown files finished - ${repoPath}`);

        console.log(` Running KMP postDetect: Convert topic files - ${repoPath}`);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic"));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFileAsync(topicPath, docsPath)
            await fs.remove(topicPath);
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(` Running KMP postDetect: Change detected path - ${repoPath}`);
        // Map to flattened doc path, convert .topic -> .md
        task.files = await Promise.all(
            task.files.map(async (file) => {
                const base = file.split('/');
                let target = path.join('topics', base[base.length - 1]);
                if (target.endsWith('.topic')) {
                    target = target.replace('.topic', '.md');
                }
                return target;})
        );
        console.log(`  Mapped files: ${task.files.join("\n")}`);
        console.log(`  Change detected path finished - ${repoPath}`);

        console.log(`  Running KMP postDetect: Generate sidebar - ${repoPath}...`);
        const sidebarPath = path.join(repoPath, "mpd.tree");
        const docType = repoPath.replace("-repo", "");
        if (await fs.pathExists(sidebarPath)) {
            await generateSidebar(sidebarPath, docType);
        }
        console.log(`  Generate sidebar finished - ${repoPath}`);
    },

    /**
     * @override
     */
    postTranslate: async (context, repoConfig) => {
        console.log(`  Copying KMP version file... `);
        const versionFile = `${repoConfig.path}/v.list`;
        if (await fs.pathExists(versionFile)) {
            await fs.copy(versionFile, "docs/.vitepress/kmp.v.list", {overwrite: true});
            context.gitAddPaths.add("docs/.vitepress/kmp.v.list")
            console.log(`  Copying Kotlin version file finished - ${repoConfig.path}`);
        }

        console.log(`  Handling KMP assets: Copying images - ${repoConfig.path}... `);
        const {src, dest} = repoConfig.assets;
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