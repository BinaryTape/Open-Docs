import {defaultStrategy} from "./strategy.mjs";
import {copyFlatten} from "./fsUtils.mjs";
import path from "path";
import fs from "fs-extra";
import {processTopicFile} from "./TopicProcessor.mjs";
import {generateSidebar} from "./SidebarProcessor.mjs";

export const kmpStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["topic/*.md"],

    /**
     * @override
     */
    onSyncEnd: async (repoPath) => {
        console.log(`  Running KMP onSyncEnd: Flattening directory - ${repoPath}...`);
        const docsPath = path.join(repoPath, "topics");
        if (await fs.pathExists(docsPath)) {
            await copyFlatten(docsPath, docsPath);
        }
        console.log(`  Flattening finished - ${docsPath}`);

        console.log(` Running KMP onSyncEnd: Convert topic files - ${repoPath}`);
        const docs = await fs.readdir(docsPath);
        const topicFiles = docs.filter(doc => doc.endsWith(".topic"));
        for (const topic in topicFiles) {
            const topicPath = path.join(docsPath, topicFiles[topic]);
            await processTopicFile(topicPath, docsPath)
            await fs.remove(topicPath);
        }
        console.log(`  Convert topic files finished - ${repoPath}`);

        console.log(`  Running KMP onSyncEnd: Generate sidebar - ${repoPath}...`);
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
    onTranslateEnd: async (context, repoConfig) => {
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