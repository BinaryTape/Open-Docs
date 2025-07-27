import { koinStrategy } from "./strategy-koin.mjs";
import { sqlDelightStrategy } from "./strategy-sqldelight.mjs";
import {kotlinStrategy} from "./strategy-kotlin.mjs";

export const REPOS = [
  // {
  //   name: "koin",
  //   repo: "InsertKoinIO/koin",
  //   branch: "origin/main",
  //   path: "koin-repo",
  //   lastCheckFile: ".github/last_check_koin.txt",
  //   strategy: koinStrategy,
  // },
  // {
  //   name: "koin",
  //   repo: "InsertKoinIO/koin-annotations",
  //   branch: "origin/main",
  //   path: "koin-annotations-repo",
  //   lastCheckFile: ".github/last_check_koin_annotations.txt",
  //   strategy: koinStrategy,
  // },
  // {
  //   name: "sqldelight",
  //   repo: "sqldelight/sqldelight",
  //   branch: "origin/master",
  //   path: "sqldelight-repo",
  //   lastCheckFile: ".github/last_check_sqldelight.txt",
  //   assets: {
  //     src: "docs/images",
  //     dest: "docs/public/sqldelight",
  //   },
  //   strategy: sqlDelightStrategy,
  // },
  {
    name: "kotlin",
    repo: "JetBrains/kotlin-web-site",
    branch: "origin/main",
    path: "kotlin-repo",
    lastCheckFile: ".github/last_check_kotlin.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  },
  {
    name: "kotlin",
    repo: "Kotlin/kotlinx.coroutines",
    branch: "origin/main",
    path: "kotlinx-coroutines-repo",
    lastCheckFile: ".github/last_check_kotlinx_coroutines.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  },
  {
    name: "kotlin",
    repo: "Kotlin/dokka",
    branch: "origin/main",
    path: "dokka-repo",
    lastCheckFile: ".github/last_check_dokka.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  },
  {
    name: "kotlin",
    repo: "JetBrains/lincheck",
    branch: "origin/main",
    path: "lincheck-repo",
    lastCheckFile: ".github/last_check_lincheck.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  }
];
