---
title: Koin 註解
---

為你的專案設定 Koin 註解

## 目前版本

你可以在 [Maven Central](https://search.maven.org/search?q=io.insert-koin) 找到所有 Koin 套件。

以下是目前可用的 Koin Annotations 版本：

- **穩定版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 用於正式應用程式
- **Beta/RC 版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 預覽即將推出的功能

## KSP 外掛

我們需要 [Google KSP](https://github.com/google/ksp) 才能運作。請遵循官方的 [KSP 設定文件](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需加入 Gradle 外掛：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 相容性**: 最新 Koin/KSP 相容版本為 `2.1.21-2.0.2` (KSP2)

:::info
KSP 版本格式為：`[Kotlin version]-[KSP version]`。請確保您的 KSP 版本與您的 Kotlin 版本相容。
:::

## Android 與 Ktor 應用程式的 KSP 設定

- 使用 KSP Gradle 外掛
- 加入 Koin 註解與 Koin KSP 編譯器的依賴項
- 設定 sourceSet

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

## Kotlin 多平台設定

在標準的 Kotlin/Kotlin 多平台專案中，你需要依照以下方式設定 KSP：

- 使用 KSP Gradle 外掛
- 在 commonMain 中加入 Koin 註解的依賴項
- 為 commonMain 設定 sourceSet
- 加入 KSP 依賴項任務與 Koin 編譯器
- 設定編譯任務依賴項至 `kspCommonMainKotlinMetadata`

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
```