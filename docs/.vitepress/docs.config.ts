import { coilRewriteHref } from "./rewrite/coil-rewrite-strategy";

export type DocsItemConfig = {
    type: "koin" | "kotlin" | "sqldelight" | "ktor" | "kmp" | "koog" |  "coil";
    title: string;
    path: string;
    framework: "Docusaurus" | "Writerside" | "MKDocs";
    rewriteHref?: (env: any, href: string) => string;
}
export const DocsTypeConfig: { [key: string]: DocsItemConfig } = {
    koin: {
        type: "koin",
        title: "Koin",
        path: "/koin/",
        framework: "Docusaurus"
    },
    kotlin: {
        type: "kotlin",
        title: "Kotlin",
        path: "/kotlin/",
        framework: "Writerside"
    },
    ktor: {
        type: "ktor",
        title: "Ktor",
        path: "/ktor/",
        framework: "Writerside"
    },
    sqldelight: {
        type: "sqldelight",
        title: "SQLDelight",
        path: "/sqldelight/",
        framework: "MKDocs"
    },
    kmp: {
        type: "kmp",
        title: "KMP",
        path: "/kmp/",
        framework: "Writerside"
    },
    koog: {
        type: "koog",
        title: "Koog",
        path: "/koog/",
        framework: "MKDocs"
    },
    coil: {
        type: "coil",
        title: "Coil",
        path: "/coil/",
        framework: "MKDocs",
        rewriteHref: coilRewriteHref
    }
}

export const DOCS_TYPES = Object.keys(DocsTypeConfig)
