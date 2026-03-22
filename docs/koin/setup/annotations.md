---
title: Koin 注解
---

为您的项目设置 Koin 注解

## 当前版本

您可以在 [Maven Central](https://search.maven.org/search?q=io.insert-koin) 上找到所有 Koin 软件包。

以下是当前可用的 Koin 注解版本：

- **稳定版**：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 用于生产环境应用程序
- **最新版**：[![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 即将推出的功能预览

## KSP 插件

我们需要 [Google KSP](https://github.com/google/ksp) 才能工作。请遵循官方的 [KSP 设置文档](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需添加 Gradle 插件：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 兼容性**：Koin 注解 2.3.1 需要 KSP `2.3.2`

:::info
**KSP 版本控制变更**：从 KSP 2.x 开始，版本编号现在独立于 Kotlin 版本。对于 Koin 注解 2.3.1，请使用 KSP 2.3.2。
:::

## 使用版本目录 (推荐)

在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin-annotations = "2.3.1"  # 稳定版
ksp = "2.3.2"  # Koin 注解 2.3.1 所需版本

[libraries]
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-annotations" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-annotations" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## Android 和 Ktor 应用 KSP 设置

- 使用 KSP Gradle 插件
- 添加 Koin 注解和 Koin KSP 编译器的依赖项
- 设置源集 (sourceSet)

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin 注解
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    // Koin 注解 KSP 编译器
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

或者使用版本目录：

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // Koin
    implementation(libs.koin.android)
    // Koin 注解
    implementation(libs.koin.annotations)
    // Koin 注解 KSP 编译器
    ksp(libs.koin.ksp.compiler)
}
```

## Kotlin Multiplatform 设置

在标准的 Kotlin/Kotlin Multiplatform 项目中，您需要按如下方式设置 KSP：

- 使用 KSP Gradle 插件
- 在 commonMain 中为 Koin 注解添加依赖项
- 为 commonMain 设置源集 (sourceSet)
- 使用 Koin 编译器添加 KSP 依赖项任务
- 将编译任务依赖关系设置为 `kspCommonMainKotlinMetadata`

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

kotlin {

    sourceSets {

        // 添加 Koin 注解
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin 注解
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
    add("kspCommonMainMetadata", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}

// 从 Native 任务触发 Common 元数据生成
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}
```

:::info
有关完整的 KMP 设置和架构模式，请参阅 [Koin 注解 KMP](/docs/reference/koin-annotations/kmp)。
:::

## 后续步骤

设置完成！请继续阅读：

- [Koin 注解快速入门](/docs/reference/koin-annotations/start) - 了解如何在代码中使用注解
- [注解定义](/docs/reference/koin-annotations/definitions) - 详细的注解参考
- [注解清单](/docs/reference/koin-annotations/annotations-inventory) - 可用注解的完整列表