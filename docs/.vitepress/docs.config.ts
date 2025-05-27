export type DocsItemConfig = {
    type: "koin" | "kotlin" | "sqldelight";
    title: string;
    description: string;
    path: string;
}
export const DocsTypeConfig: { [key: string]: DocsItemConfig } = {
    koin: {
        type: "koin",
        title: "Koin",
        description: "Koin",
        path: "/koin/",
    },
    kotlin: {
        type: "kotlin",
        title: "Kotlin",
        description: "Kotlin",
        path: "/kotlin/",
    },
    sqldelight: {
        type: "sqldelight",
        title: "SQLDelight",
        description: "SQLDelight",
        path: "/sqldelight/",
    }
}

export const DOCS_TYPES = Object.keys(DocsTypeConfig)
