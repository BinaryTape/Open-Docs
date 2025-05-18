export type DocsItemConfig = {
    title: string;
    description: string;
    path: string;
}
export const DocsTypeConfig: { [key: string]: DocsItemConfig } = {
    koin: {
        title: "Koin",
        description: "Koin",
        path: "/koin/",
    },
    kotlin: {
        title: "Kotlin",
        description: "Kotlin",
        path: "/kotlin/",
    }
}

export const DOCS_TYPES = Object.keys(DocsTypeConfig)
