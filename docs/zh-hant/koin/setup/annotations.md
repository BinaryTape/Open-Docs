---
title: "Koin 注解 (Annotations)"
---
為你的專案設定 Koin Annotations

## 版本

你可以在 [maven central](https://search.maven.org/search?q=io.insert-koin) 找到所有 Koin 的套件（packages）。

以下是目前可用的版本：

## 設定 & 目前版本

以下是目前可用的 Koin 專案版本：

| 專案（Project）   |      版本（Version）      |
|----------|:-------------:|
| koin-annotations-bom |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations-bom) |
| koin-annotations |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) |
| koin-ksp-compiler |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ksp-compiler)](https://mvnrepository.com/artifact/io.insert-koin/koin-ksp-compiler) |

## KSP 外掛程式（Plugin）

我們需要 KSP 外掛程式才能運作 (https://github.com/google/ksp)。請依照官方 (KSP 設定文件)[https://kotlinlang.org/docs/ksp-quickstart.html] 的指示。

只需新增 Gradle 外掛程式：
```groovy
plugins {
    id "com.google.devtools.ksp" version "$ksp_version"
}
```

最新的 KSP 相容版本：`1.9.24-1.0.20`

## Kotlin & 多平台（Multiplatform）

在標準的 Kotlin/Kotlin 多平台專案中，你需要如下設定 KSP：

- 使用 KSP Gradle 外掛程式
- 在 commonMain 中新增 Koin annotations 的相依性（dependency）
- 為 commonMain 設定 sourceSet
- 新增具有 Koin 編譯器（compiler）的 KSP 相依性任務（dependencies tasks）
- 設定編譯任務相依性到 `kspCommonMainKotlinMetadata`

```groovy
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
project.tasks.withType(KotlinCompilationTask::class.java).configureEach {
    if(name != "kspCommonMainKotlinMetadata") {
        dependsOn("kspCommonMainKotlinMetadata")
    }
}

```

## Android 應用程式設定（App Setup）

- 使用 KSP Gradle 外掛程式
- 新增 Koin annotations 和 Koin KSP 編譯器（compiler）的相依性（dependency）
- 設定 sourceSet

```groovy
plugins {
   id("com.google.devtools.ksp")
}

android {

    dependencies {
        // Koin
        implementation("io.insert-koin:koin-android:$koin_version")
        // Koin Annotations
        implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
        // Koin Annotations KSP Compiler
        ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    }

    // Set KSP sourceSet
    applicationVariants.all {
        val variantName = name
        sourceSets {
            getByName("main") {
                java.srcDir(File("build/generated/ksp/$variantName/kotlin"))
            }
        }
    }
}

```