---
title: Koin Annotations
---

プロジェクトに Koin Annotations をセットアップします。

## 現在のバージョン

すべての Koin パッケージは [Maven Central](https://search.maven.org/search?q=io.insert-koin) で確認できます。

現在利用可能な Koin Annotations のバージョンは以下の通りです：

- **安定版 (Stable)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 本番アプリケーションに使用してください
- **ベータ/RC版 (Beta/RC)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 今後追加される機能のプレビューです

## KSP プラグイン

動作には [Google KSP](https://github.com/google/ksp) が必要です。公式の [KSP セットアップ ドキュメント](https://kotlinlang.org/docs/ksp-quickstart.html)に従ってください。

Gradle プラグインを追加します：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP の互換性**: 最新の Koin/KSP 互換バージョンは `2.1.21-2.0.2` (KSP2) です。

:::info
KSP バージョンの形式: `[Kotlin バージョン]-[KSP バージョン]`。使用している Kotlin バージョンと KSP バージョンに互換性があることを確認してください。
:::

## Android および Ktor アプリの KSP セットアップ

- KSP Gradle プラグインを使用する
- Koin Annotations と Koin KSP コンパイラの依存関係を追加する
- sourceSet を設定する

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

## Kotlin Multiplatform のセットアップ

標準的な Kotlin/Kotlin Multiplatform プロジェクトでは、次のように KSP をセットアップする必要があります：

- KSP Gradle プラグインを使用する
- commonMain に Koin Annotations の依存関係を追加する
- commonMain の sourceSet を設定する
- Koin コンパイラを使用した KSP 依存関係タスクを追加する
- コンパイルタスクの依存関係を `kspCommonMainKotlinMetadata` に設定する

```kotlin
plugins {
    id("com.google.devtools.ksp")
}

kotlin {

    sourceSets {
        
        // Koin Annotations を追加
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

// KSP タスク
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}

// Native タスクから Common メタデータの生成をトリガー
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}