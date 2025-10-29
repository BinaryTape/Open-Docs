---
title: Koin 注解
---

为你的项目设置 Koin 注解

## 当前版本

你可以在 [Maven Central](https://search.maven.org/search?q=io.insert-koin) 上找到所有 Koin 包。

以下是当前可用的 Koin 注解版本：

-   **稳定版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 用于生产应用
-   **Beta/RC 版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 即将推出的特性预览

## KSP 插件

我们需要 [Google KSP](https://github.com/google/ksp) 才能工作。请遵循官方的 [KSP 设置文档](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需添加 Gradle 插件：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 兼容性**: 最新 Koin/KSP 兼容版本为 `2.1.21-2.0.2` (KSP2)

:::info
KSP 版本格式为：`[Kotlin 版本]-[KSP 版本]`。请确保你的 KSP 版本与 Kotlin 版本兼容。
:::

## Android 及 Ktor 应用的 KSP 设置

-   使用 KSP Gradle 插件
-   添加 Koin 注解和 Koin KSP 编译器的依赖项
-   设置源代码集

```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}

dependencies {
    // Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    // Koin Annotations KSP Compiler
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## Kotlin 多平台设置

在标准的 Kotlin/Kotlin 多平台项目中，你需要按如下方式设置 KSP：

-   使用 KSP Gradle 插件
-   在 `commonMain` 中添加 Koin 注解的依赖项
-   为 `commonMain` 设置源代码集
-   添加带 Koin 编译器的 KSP 依赖项任务
-   设置编译任务依赖于 `kspCommonMainKotlinMetadata`

```kotlin
plugins {
    id("com.google.devtools.ksp")
}

kotlin {

    sourceSets {
        
        // Add Koin Annotations
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin Annotations
            api("io.insert-koin:koin-annotations:$koin_annotations_version")
        }
    }
    
    // KSP Common sourceSet
    sourceSets.named("commonMain").configure {
        kotlin.srcDir("build/generated/ksp/metadata/commonMain/kotlin")
    }       
}

// KSP Tasks
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}

// Trigger Common Metadata Generation from Native tasks
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}