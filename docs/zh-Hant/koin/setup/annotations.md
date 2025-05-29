---
title: Koin 註解
---

為你的專案設定 Koin 註解

## 版本

你可以在 [Maven Central](https://search.maven.org/search?q=io.insert-koin) 找到所有 Koin 套件。

以下是目前可用的版本：

## 設定與目前版本

以下是目前可用的 Koin 專案版本：

| 專案 | 版本 |
|---|:---:|
| koin-annotations-bom | [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations-bom) |
| koin-annotations | [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) |
| koin-ksp-compiler | [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ksp-compiler)](https://mvnrepository.com/artifact/io.insert-koin/koin-ksp-compiler) |

## KSP 外掛

我們需要 KSP 外掛才能運作 ([https://github.com/google/ksp](https://github.com/google/ksp))。請遵循官方的 [KSP 設定文件](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需加入 Gradle 外掛：
```groovy
plugins {
    id "com.google.devtools.ksp" version "$ksp_version"
}
```

最新的 KSP 相容版本：`1.9.24-1.0.20`

## Kotlin 與多平台

在標準的 Kotlin/Kotlin 多平台 (Multiplatform) 專案中，你需要依照以下方式設定 KSP：

- 使用 KSP Gradle 外掛
- 在 `commonMain` 中加入 Koin 註解的依賴項
- 為 `commonMain` 設定 sourceSet
- 加入 KSP 依賴項任務與 Koin 編譯器
- 設定編譯任務依賴項至 `kspCommonMainKotlinMetadata`

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

## Android 應用程式設定

- 使用 KSP Gradle 外掛
- 加入 Koin 註解與 Koin KSP 編譯器的依賴項
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