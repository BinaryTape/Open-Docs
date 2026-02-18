import {defaultStrategy} from "./strategy.mjs";
import path from "path";
import fs from "fs-extra";
import {generateSidebar} from "../processors/SidebarProcessor.mjs";

export const koogStrategy = {
    ...defaultStrategy,

    /**
     * @override
     */
    getDocPatterns: () => ["docs/docs/**/*.md"],

    postSync: async (repoPath) => {},

    /**
     * @override
     */
    postDetect: async (repoConfig, task) => {
        const repoPath = repoConfig.path;
        console.log(`  Running Koog postSync: Generate sidebar - ${repoPath}...`);
        const sidebarPath = path.join(repoPath, 'docs/mkdocs.yml');
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
        console.log(`  Handling Koog assets: Copying images - ${repoConfig.path}... `);
        const {src, dest} = repoConfig.assets;
        const srcPath = path.join(repoConfig.path, src);
        if (await fs.pathExists(srcPath)) {
            await fs.ensureDir(dest);
            await fs.copy(srcPath, dest, { overwrite: true });
            context.gitAddPaths.add(dest); // 将目标目录加入待提交列表
        } else {
            console.warn(
                `  ⚠️  Warning: Asset source directory not found: ${srcPath}`
            );
        }
    },
};