/**
 * One-off repair for documents translated before the pipeline started
 * preserving upstream heading anchors.
 *
 * Walks every translated document, finds the upstream English file it came
 * from, and stamps the upstream anchor onto each translated heading.
 *
 *   node --import tsx scripts/backfill-heading-anchors.mjs [--dry-run] [--doc-type kotlin]
 *
 * Upstream clones are expected where the pipeline puts them (`cloneDir` in
 * tools/pipeline/repos.config.mjs). Clone what you need first, for example:
 *
 *   git clone --depth 1 https://github.com/JetBrains/kotlin-web-site.git kotlin-repo
 */
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { REPOS } from "../tools/pipeline/repos.config.mjs";
import { CONTENT_LOCALES, splitLocalePath } from "../shared/content-paths.ts";
import { applySourceAnchors } from "../tools/pipeline/utils/heading-anchors.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const docTypeFlag = args.indexOf("--doc-type");
const onlyDocType = docTypeFlag === -1 ? null : args[docTypeFlag + 1];

/**
 * Upstream candidates for one docType, indexed both by their path under the
 * source doc root and by bare file name. Several repos can feed one docType
 * (five of them feed `kotlin`), and the Kotlin strategy flattens
 * `docs/topics/**` into the doc root before translating, so the path index
 * alone does not resolve those files — hence the name index as a fallback.
 * A name claimed by more than one upstream file is dropped rather than guessed.
 */
async function indexUpstream(docType) {
  const byPath = new Map();
  const byName = new Map();
  const ambiguous = new Set();
  let repos = 0;

  for (const repoConfig of REPOS) {
    if (repoConfig.docType !== docType) continue;
    if (!fs.existsSync(repoConfig.cloneDir)) continue;
    repos++;

    const sourceRoot = path.resolve(repoConfig.cloneDir, repoConfig.sourceDocRoot);
    const patterns = repoConfig.syncStrategy.getDocPatterns();
    const found = (
      await Promise.all(patterns.map((p) => glob(p, { cwd: repoConfig.cloneDir, nodir: true })))
    ).flat();

    for (const file of new Set(found)) {
      // `.topic` files are Writerside XML; the pipeline converts them to
      // Markdown and there are no Markdown headings to pair with here.
      if (!file.endsWith(".md")) continue;
      const absolute = path.resolve(repoConfig.cloneDir, file);
      const relative = path.relative(sourceRoot, absolute).replaceAll("\\", "/");
      if (relative.startsWith("..")) continue;

      if (!byPath.has(relative)) byPath.set(relative, absolute);
      const name = path.basename(relative);
      if (byName.has(name) && byName.get(name) !== absolute) ambiguous.add(name);
      else byName.set(name, absolute);
    }
  }

  for (const name of ambiguous) byName.delete(name);
  return { byPath, byName, repos, ambiguous };
}

const docTypes = [...new Set(REPOS.map((r) => r.docType))].filter(
  (t) => !onlyDocType || t === onlyDocType
);

const totals = { written: 0, anchors: 0, skipped: 0, unmatched: 0 };
const skipReasons = [];
const unmatched = new Set();

for (const docType of docTypes) {
  const upstream = await indexUpstream(docType);
  if (upstream.repos === 0) {
    console.warn(`— ${docType}: no upstream clone available, skipping`);
    continue;
  }

  const localeGlobs = ["", ...CONTENT_LOCALES.filter((l) => l !== "zh-Hans").map((l) => `${l}/`)];
  const translated = (
    await Promise.all(localeGlobs.map((prefix) => glob(`docs/${prefix}${docType}/**/*.md`)))
  ).flat();

  let written = 0;
  let anchors = 0;
  for (const targetPath of translated) {
    const { contentPath } = splitLocalePath(path.relative("docs", targetPath).replaceAll("\\", "/"));
    const relative = contentPath.slice(docType.length + 1);
    const source = upstream.byPath.get(relative) ?? upstream.byName.get(path.basename(relative));
    if (!source) {
      totals.unmatched++;
      unmatched.add(relative);
      continue;
    }

    const result = applySourceAnchors(
      fs.readFileSync(targetPath, "utf8"),
      fs.readFileSync(source, "utf8")
    );
    if (result.skipped) {
      totals.skipped++;
      skipReasons.push(`${targetPath}: ${result.skipped}`);
      continue;
    }
    if (result.added === 0) continue;

    if (!dryRun) fs.writeFileSync(targetPath, result.content);
    written++;
    anchors += result.added;
  }

  console.log(
    `${docType.padEnd(14)} ${String(written).padStart(5)} files, ${String(anchors).padStart(6)} anchors` +
      (upstream.ambiguous.size ? `  (${upstream.ambiguous.size} ambiguous upstream names)` : "")
  );
  totals.written += written;
  totals.anchors += anchors;
}

console.log(
  `\n${dryRun ? "[dry run] " : ""}${totals.written} files, ${totals.anchors} anchors stamped; ` +
    `${totals.skipped} skipped (structure drift), ${totals.unmatched} without an upstream match`
);
report("Skipped", skipReasons);
report("No upstream match", [...unmatched]);

function report(label, entries) {
  if (!entries.length) return;
  console.log(`\n${label}:`);
  entries.slice(0, 25).forEach((e) => console.log(`  ${e}`));
  if (entries.length > 25) console.log(`  … and ${entries.length - 25} more`);
}
