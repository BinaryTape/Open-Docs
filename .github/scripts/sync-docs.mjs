import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { translateFiles } from "./translate.mjs";
import { REPOS } from "./repo-config.mjs";

async function getCommitSha(repoPath) {
  const { stdout } = await execa("git", ["rev-parse", "HEAD"], {
    cwd: repoPath,
  });
  return stdout.trim();
}

async function getLastCommitSha(filePath) {
  if (await fs.pathExists(filePath)) {
    const content = await fs.readFile(filePath, "utf-8");
    return content.trim();
  }
  return null;
}

async function getChangedFiles(repoPath, baseSha, filePattern) {
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
    console.log(
      `Repository ${repoConfig.repo} already exists, fetching latest changes...`
    );
    await execa("git", ["fetch", "--all"], { cwd: repoConfig.path });
    await execa("git", ["reset", "--hard", repoConfig.branch], {
      cwd: repoConfig.path,
    });
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
  await fs.outputFile(task.checkFile, task.newSha);
  console.log(`Updated ${task.checkFile} with new SHA: ${task.newSha}`);

  console.log("\n--- Committing and pushing changes ---");
  await execa("git", ["config", "user.name", "github-actions[bot]"]);
  await execa("git", [
    "config",
    "user.email",
    "github-actions[bot]@users.noreply.github.com",
  ]);
  await execa("git", [
    "add",
    "--force",
    ".",
    ":!package.json",
    ":!package-lock.json",
    `:!${repoConfig.path}`,
    `:!${repoConfig.path}/**`,
  ]);

  const { stdout: status } = await execa("git", ["status", "--porcelain"]);
  if (status) {
    await execa("git", [
      "commit",
      "-m",
      `docs: [${task.docType}] Add translated files and update check record`,
    ]);
    const { stdout: currentBranch } = await execa("git", [
      "symbolic-ref",
      "--short",
      "HEAD",
    ]);

    await execa("git", ["push", "origin", currentBranch]);
    console.log(
      `Changes committed and push to ${currentBranch} branch successfully.`
    );
  } else {
    console.log("No changes to commit.");
  }
}

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
      continue;
    }
  }
}

main().catch((error) => {
  console.error("Workflow failed:", error);
  process.exit(1);
});
