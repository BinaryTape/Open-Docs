/**
 * One-off repair for documents translated before the pipeline started
 * preserving upstream heading anchors.
 *
 * Walks every translated document, finds the upstream English file it came
 * from, and stamps the upstream anchor onto each translated heading.
 *
 *   node --import tsx scripts/backfill-heading-anchors.mjs [--dry-run] [--doc-type kotlin]
 *
 * Upstream clones are expected where the pipeline puts them; see
 * tools/pipeline/utils/upstream-pairs.mjs.
 */
import fs from "fs";
import { eachTranslatedDoc } from "../tools/pipeline/utils/upstream-pairs.mjs";
import { applySourceAnchors } from "../tools/pipeline/utils/heading-anchors.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const docTypeFlag = args.indexOf("--doc-type");
const onlyDocType = docTypeFlag === -1 ? null : args[docTypeFlag + 1];

const totals = { written: 0, anchors: 0, skipped: 0, unmatched: 0 };
const skipReasons = [];
const unmatched = new Set();
const perDocType = new Map();

for await (const { docType, targetPath, sourcePath, relative } of eachTranslatedDoc({
  onlyDocType,
  onMissingClone: (type) => console.warn(`— ${type}: no upstream clone available, skipping`),
})) {
  if (!perDocType.has(docType)) perDocType.set(docType, { files: 0, anchors: 0 });
  const tally = perDocType.get(docType);

  if (!sourcePath) {
    totals.unmatched++;
    unmatched.add(relative);
    continue;
  }

  const result = applySourceAnchors(
    fs.readFileSync(targetPath, "utf8"),
    fs.readFileSync(sourcePath, "utf8")
  );
  if (result.skipped) {
    totals.skipped++;
    skipReasons.push(`${targetPath}: ${result.skipped}`);
    continue;
  }
  if (result.added === 0) continue;

  if (!dryRun) fs.writeFileSync(targetPath, result.content);
  tally.files++;
  tally.anchors += result.added;
  totals.written++;
  totals.anchors += result.added;
}

for (const [docType, { files, anchors }] of perDocType) {
  console.log(`${docType.padEnd(14)} ${String(files).padStart(5)} files, ${String(anchors).padStart(6)} anchors`);
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
