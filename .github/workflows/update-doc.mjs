import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { translateFiles } from "./translate.mjs";

// --- 配置 ---
const REPOS = [
  //   {
  //     name: "koin",
  //     repo: "InsertKoinIO/koin",
  //     path: "koin-repo",
  //     lastCheckFile: ".github/last_check_koin.txt",
  //     docPath: "docs/**/*.md",
  //   },
  {
    name: "koin",
    repo: "InsertKoinIO/koin-annotations",
    branch: "origin/main",
    path: "koin-annotations-repo",
    lastCheckFile: ".github/last_check_koin_annotations.txt",
    docPath: "docs/**/*.md",
  },
];

// --- 辅助函数 ---

async function getCommitSha(repoPath) {
  const { stdout } = await execa("git", ["rev-parse", "HEAD"], {
    cwd: repoPath,
  });
  return stdout.trim();
}

// 已修正：添加了 .trim()
async function getLastCommitSha(filePath) {
  if (await fs.pathExists(filePath)) {
    const content = await fs.readFile(filePath, "utf-8");
    return content.trim();
  }
  return null;
}

async function getChangedFiles(repoPath, baseSha, filePattern) {
  // 确保 baseSha 存在
  try {
    await execa("git", ["cat-file", "-e", baseSha], { cwd: repoPath });
  } catch (error) {
    console.warn(
      `Warning: Base SHA ${baseSha} not found in repository. Treating as first run.`
    );
    return getAllFiles(repoPath, filePattern);
  }

  const { stdout } = await execa(
    "git",
    ["diff", "--name-only", baseSha, "HEAD"],
    { cwd: repoPath }
  );
  const allChanged = stdout.split("\n").filter((line) => line.length > 0);

  // 使用 glob 筛选出符合模式的 markdown 文件
  const matchedFiles = await glob(
    path.join(repoPath, filePattern).replace(/\\/g, "/")
  );
  const relativeMatchedFiles = matchedFiles.map((p) =>
    path.relative(repoPath, p).replace(/\\/g, "/")
  );

  return allChanged.filter((file) =>
    relativeMatchedFiles.includes(file.replace(/\\/g, "/"))
  );
}

async function getAllFiles(repoPath, filePattern) {
  const files = await glob(
    path.join(repoPath, filePattern).replace(/\\/g, "/")
  );
  return files.map((p) => path.relative(repoPath, p).replace(/\\/g, "/"));
}

// --- 主逻辑 ---
async function main() {
  for (const repoConfig of REPOS) {
    try {
      const translationTask = await syncRepo(repoConfig);
      if (translationTask) {
        await translateAndPush(repoConfig, translationTask);
      } else {
        console.log(`No changes detected for ${repoConfig.name}.`);
      }
    } catch (error) {
      console.error(`Error processing repository ${repoConfig.name}:`, error);
      continue; // 跳过当前仓库，继续下一个
    }
  }
}

async function syncRepo(repoConfig) {
  let task = undefined;
  console.log(`\n--- Processing repository: ${repoConfig.name} ---`);
  if (!(await fs.pathExists(repoConfig.path))) {
    console.log(`Cloning full history of ${repoConfig.repo}...`);
    await execa("git", [
      "clone",
      `https://github.com/${repoConfig.repo}.git`,
      repoConfig.path,
    ]);
  } else {
    console.log(`Repository ${repoConfig.repo} already exists, fetching latest changes...`);
    await execa("git", ["fetch", "--all"], { cwd: repoConfig.path });
    await execa("git", ["reset", "--hard", repoConfig.branch], { cwd: repoConfig.path });
    await execa("git", ["clean", "-fd"], { cwd: repoConfig.path });
  }

  const lastSha = await getLastCommitSha(repoConfig.lastCheckFile);
  const currentSha = await getCommitSha(repoConfig.path);

  console.log(`Last checked SHA: ${lastSha || "N/A (First Run)"}`);
  console.log(`Current SHA: ${currentSha}`);

  const isFirstRun = !lastSha;
  const hasChanged = lastSha !== currentSha;

  if (isFirstRun || hasChanged) {
    console.log(
      isFirstRun
        ? "First run, processing all doc files."
        : "Repository has changed, finding changed doc files."
    );

    const changedFiles = isFirstRun
      ? await getAllFiles(repoConfig.path, repoConfig.docPath)
      : await getChangedFiles(repoConfig.path, lastSha, repoConfig.docPath);

    if (changedFiles.length > 0) {
      console.log(`Found ${changedFiles.length} files to process:`);
      console.log(changedFiles.map((f) => `  - ${f}`).join("\n"));

      task = {
        docType: repoConfig.name,
        repoPath: repoConfig.path,
        files: changedFiles,
        newSha: currentSha,
        checkFile: repoConfig.lastCheckFile,
      };
    } else {
      console.log(
        "Commit has changed, but no relevant document files were modified."
      );
      // 即使没有文档变更，也更新 SHA，避免重复检查相同的无变更范围
      await fs.outputFile(repoConfig.lastCheckFile, currentSha);
      console.log(
        `Updated ${repoConfig.lastCheckFile} to ${currentSha} to prevent re-checking.`
      );
    }
  } else {
    console.log("No new commits detected in the repository.");
  }
  return task;
}

async function translateAndPush(repoConfig, task) {
  console.log("\n--- Starting translation process ---");
  console.log(`Translating ${task.files.length} files for ${task.docType}...`);
  await translateFiles(task.docType, task.repoPath, task.files);
    cwd: repoConfig.path,

  // 在翻译成功后更新 SHA 记录文件
  await fs.outputFile(task.checkFile, task.newSha);
  console.log(`Updated ${task.checkFile} with new SHA: ${task.newSha}`);

  console.log("\n--- Committing and pushing changes ---");
  await execa("git", ["config", "user.name", "github-actions[bot]"]);
  await execa("git", [
    "config",
    "user.email",
    "github-actions[bot]@users.noreply.github.com",
  ]);
  // 假设翻译后的文件放在了 docs/zh/koin... 等路径下
  await execa("git", [
    "add",
    ".", // 1. 添加当前目录的所有内容
    // 2. 以下是排除规则 (Pathspecs)
    ":!package.json",
    ":!package-lock.json",
    `:!${repoConfig.path}`, // 排除 last_check 文件
    `:!${repoConfig.path}/**`, // 排除 koin-annotations-repo 目录内的所有内容
  ]);

  const { stdout: status } = await execa("git", ["status", "--porcelain"]);
  if (status) {
    await execa("git", [
      "commit",
      "-m",
      `docs: [${task.docType}] Add translated files and update check record`,
    ]);
    await execa("git", ["push", "origin", "main"]);
    console.log("Changes committed and pushed successfully.");
  } else {
    console.log("No changes to commit.");
  }
}

main().catch((error) => {
  console.error("Workflow failed:", error);
  process.exit(1);
});
