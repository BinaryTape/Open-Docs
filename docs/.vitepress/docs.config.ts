export type DocsItemConfig = {
    type: "koin" | "kotlin";
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
    }
}

export const DOCS_TYPES = Object.keys(DocsTypeConfig)
