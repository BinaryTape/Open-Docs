---
title: Koin Annotations
---

プロジェクトでKoin Annotationsをセットアップする

## 現在のバージョン

すべてのKoinパッケージは[Maven Central](https://search.maven.org/search?q=io.insert-koin)で見つけることができます。

現在利用可能なKoin Annotationsのバージョンは以下の通りです。

-   **安定版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 本番環境のアプリケーションで使用してください
-   **ベータ版/RC版**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 今後の機能のプレビュー

## KSPプラグイン

動作には[Google KSP](https://github.com/google/ksp)が必要です。公式の[KSPセットアップドキュメント](https://kotlinlang.org/docs/ksp-quickstart.html)に従ってください。

Gradleプラグインを追加するだけです。
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP互換性**: 最新のKoin/KSP互換バージョンは`2.1.21-2.0.2` (KSP2) です。

:::info
KSPのバージョン形式: `[Kotlinバージョン]-[KSPバージョン]`。ご使用のKSPバージョンがKotlinバージョンと互換性があることを確認してください。
:::

## AndroidおよびKtorアプリのKSPセットアップ

-   KSP Gradleプラグインを使用する
-   Koin annotationsとKoin KSPコンパイラの依存関係を追加する
-   sourceSetを設定する

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

## Kotlinマルチプラットフォームのセットアップ

標準的なKotlin/Kotlin Multiplatformプロジェクトでは、KSPを次のようにセットアップする必要があります。

-   KSP Gradleプラグインを使用する
-   commonMainにKoin annotationsの依存関係を追加する
-   commonMainのsourceSetを設定する
-   KoinコンパイラでKSPの依存関係タスクを追加する
-   `kspCommonMainKotlinMetadata`へのコンパイルタスクの依存関係を設定する

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