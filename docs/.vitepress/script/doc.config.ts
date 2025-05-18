export type DocsItemConfig = {
    title: string;
    description: string;
    path: string;
}
export const docsConfig: { [key: string]: DocsItemConfig } = {
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