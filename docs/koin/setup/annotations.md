---
title: Koin 注解
---

为您的项目设置 Koin 注解

## 当前版本

您可以在 [maven central](https://search.maven.org/search?q=io.insert-koin) 上找到所有 Koin 软件包。

以下是当前可用的 Koin 注解版本：

- **稳定版**：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 用于生产环境应用程序
- **Beta/RC 版**：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 即将推出的功能预览

## KSP 插件

我们需要 [Google KSP](https://github.com/google/ksp) 才能工作。请遵循官方的 [KSP 设置文档](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需添加 Gradle 插件：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 兼容性**：最新的 Koin/KSP 兼容版本为 `2.1.21-2.0.2` (KSP2)

:::info
KSP 版本格式：`[Kotlin 版本]-[KSP 版本]`。请确保您的 KSP 版本与您的 Kotlin 版本兼容。
:::

## Android 和 Ktor 应用 KSP 设置

- 使用 KSP Gradle 插件
- 添加 koin annotations 和 koin ksp compiler 的依赖项
- 设置源集

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

## Kotlin Multiplatform 设置

在标准的 Kotlin/Kotlin Multiplatform 项目中，您需要按如下方式设置 KSP：

- 使用 KSP Gradle 插件
- 在 commonMain 中为 koin annotations 添加依赖项
- 为 commonMain 设置源集
- 使用 koin 编译器添加 KSP 依赖项任务
- 将编译任务依赖关系设置为 `kspCommonMainKotlinMetadata`

```kotlin
plugins {
    id("com.google.devtools.ksp")
}

kotlin {

    sourceSets {
        
        // 添加 Koin 注解
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin Annotations
            api("io.insert-koin:koin-annotations:$koin_annotations_version")
        }
    }
    
    // KSP Common 源集
    sourceSets.named("commonMain").configure {
        kotlin.srcDir("build/generated/ksp/metadata/commonMain/kotlin")
    }       
}

// KSP 任务
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}

// 从 Native 任务触发 Common 元数据生成
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}