---
title: Koin 註解
---

為您的專案設定 Koin 註解

## 目前版本

您可以在 [maven central](https://search.maven.org/search?q=io.insert-koin) 上找到所有 Koin 套件。

以下是目前可用的 Koin 註解版本：

- **穩定版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 用於正式環境應用程式
- **最新版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 即將推出功能的預覽

## KSP 外掛程式

我們需要 [Google KSP](https://github.com/google/ksp) 才能運作。請遵循官方的 [KSP 設定文件](https://kotlinlang.org/docs/ksp-quickstart.html)。

只需加入 Gradle 外掛程式：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 相容性**：Koin 註解 2.3.1 需要 KSP `2.3.2`

:::info
**KSP 版本控制變更**：從 KSP 2.x 開始，版本編號現在獨立於 Kotlin 版本。請為 Koin 註解 2.3.1 使用 KSP 2.3.2。
:::

## 使用版本目錄 (建議使用)

在您的 `gradle/libs.versions.toml` 中：

```toml
[versions]
koin-annotations = "2.3.1"  # 穩定版本
ksp = "2.3.2"  # Koin 註解 2.3.1 所需版本

[libraries]
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-annotations" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-annotations" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## Android 與 Ktor 應用程式 KSP 設定

- 使用 KSP Gradle 外掛程式
- 加入 Koin 註解與 Koin KSP 編譯器的相依性
- 設定 `sourceSet`

```kotlin
plugins {
    alias(libs.plugins.ksp)
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

或使用版本目錄：

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // Koin
    implementation(libs.koin.android)
    // Koin Annotations
    implementation(libs.koin.annotations)
    // Koin Annotations KSP Compiler
    ksp(libs.koin.ksp.compiler)
}
```

## Kotlin 多平台設定

在標準的 Kotlin/Kotlin 多平台專案中，您需要依照以下方式設定 KSP：

- 使用 KSP Gradle 外掛程式
- 在 `commonMain` 中加入 Koin 註解的相依性
- 設定 `commonMain` 的 `sourceSet`
- 加入包含 Koin 編譯器的 KSP 相依性任務
- 將編譯任務相依性設定為 `kspCommonMainKotlinMetadata`

```kotlin
plugins {
    alias(libs.plugins.ksp)
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
    add("kspCommonMainMetadata", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}

// Trigger Common Metadata Generation from Native tasks
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}
```

:::info
如需完整的 KMP 設定與架構模式，請參閱 [Koin 註解 KMP](/docs/reference/koin-annotations/kmp)。
:::

## 後續步驟

設定完成！請繼續閱讀：

- [Koin 註解快速入門](/docs/reference/koin-annotations/start) - 了解如何在程式碼中使用註解
- [註解定義](/docs/reference/koin-annotations/definitions) - 詳細的註解參考資料
- [註解清單](/docs/reference/koin-annotations/annotations-inventory) - 所有可用註解的完整清單