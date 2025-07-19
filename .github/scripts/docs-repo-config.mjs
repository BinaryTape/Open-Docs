import { koinStrategy } from "./strategy-koin.mjs";
import { sqlDelightStrategy } from "./strategy-sqldelight.mjs";

export const REPOS = [
  {
    name: "koin",
    repo: "InsertKoinIO/koin",
    branch: "origin/main",
    path: "koin-repo",
    lastCheckFile: ".github/last_check_koin.txt",
    strategy: koinStrategy,
  },
  {
    name: "koin",
    repo: "InsertKoinIO/koin-annotations",
    branch: "origin/main",
    path: "koin-annotations-repo",
    lastCheckFile: ".github/last_check_koin_annotations.txt",
    strategy: koinStrategy,
  },
  {
    name: "sqldelight",
    repo: "sqldelight/sqldelight",
    branch: "origin/master",
    path: "sqldelight-repo",
    lastCheckFile: ".github/last_check_sqldelight.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/sqldelight",
    },
    strategy: sqlDelightStrategy,
  },
];
