export type DocsItemConfig = {
    type: "koin" | "kotlin" | "sqldelight" | "ktor";
    title: string;
    path: string;
    framework: "Docusaurus" | "Writerside" | "MKDocs";
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
    }
}

export const DOCS_TYPES = Object.keys(DocsTypeConfig)
