import { coilStrategy } from "./strategies/strategy-coil.mjs";
import { koinStrategy } from "./strategies/strategy-koin.mjs";
import { sqlDelightStrategy } from "./strategies/strategy-sqldelight.mjs";
import { kotlinStrategy } from "./strategies/strategy-kotlin.mjs";
import { kmpStrategy } from "./strategies/strategy-kmp.mjs";
import { koogStrategy } from "./strategies/strategy-koog.mjs";
import { ktorStrategy } from "./strategies/strategy-ktor.mjs";

export const REPOS = [
  {
    name: "koin",
    repo: "InsertKoinIO/koin",
    branch: "origin/main",
    path: "koin-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_koin.txt",
    strategy: koinStrategy,
  },
  {
    name: "koin",
    repo: "InsertKoinIO/koin-annotations",
    branch: "origin/main",
    path: "koin-annotations-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_koin_annotations.txt",
    strategy: koinStrategy,
  },
  {
    name: "sqldelight",
    repo: "sqldelight/sqldelight",
    branch: "origin/master",
    path: "sqldelight-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_sqldelight.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/sqldelight",
    },
    strategy: sqlDelightStrategy,
  },
  {
    name: "kotlin",
    repo: "JetBrains/kotlin-web-site",
    branch: "origin/main",
    path: "kotlin-repo",
    docPath: "./docs",
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
    path: "coroutines-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_coroutines.txt",
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
    docPath: "./docs",
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
    docPath: "./docs",
    lastCheckFile: ".github/last_check_lincheck.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  },
  {
    name: "kotlin",
    repo: "Kotlin/api-guidelines",
    branch: "origin/main",
    path: "api-guidelines-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_api-guidelines.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/kotlin",
    },
    strategy: kotlinStrategy
  },
  {
    name: "ktor",
    repo: "ktorio/ktor-documentation",
    branch: "origin/main",
    path: "ktor-repo",
    docPath: "./topics",
    lastCheckFile: ".github/last_check_ktor.txt",
    assets: {
      src: "images",
      dest: "docs/public/ktor",
    },
    strategy: ktorStrategy
  },
  {
    name: "kmp",
    repo: "JetBrains/kotlin-multiplatform-dev-docs",
    branch: "origin/main",
    path: "kmp-repo",
    docPath: "./topics",
    lastCheckFile: ".github/last_check_kmp.txt",
    assets: {
      src: "images",
      dest: "docs/public/kmp",
    },
    strategy: kmpStrategy
  },
  {
    name: "koog",
    repo: "JetBrains/koog",
    branch: "origin/develop",
    path: "koog-repo",
    docPath: "./docs/docs",
    lastCheckFile: ".github/last_check_koog.txt",
    assets: {
      src: "docs/docs/img",
      dest: "docs/public/koog",
    },
    strategy: koogStrategy
  },
  {
    name: "coil",
    repo: "coil-kt/coil",
    branch: "origin/main",
    path: "coil-repo",
    docPath: "./docs",
    lastCheckFile: ".github/last_check_coil.txt",
    assets: {
      src: "docs/images",
      dest: "docs/public/coil",
    },
    strategy: coilStrategy,
  },
];
