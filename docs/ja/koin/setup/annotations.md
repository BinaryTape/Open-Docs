---
title: Koin Annotations
---

プロジェクトに Koin Annotations をセットアップします。

## 現在のバージョン

すべての Koin パッケージは [Maven Central](https://search.maven.org/search?q=io.insert-koin) で確認できます。

現在利用可能な Koin Annotations のバージョンは以下の通りです：

- **安定版 (Stable)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations?label=stable)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 本番アプリケーションに使用してください
- **最新版 (Latest)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 今後追加される機能のプレビューです

## KSP プラグイン

動作には [Google KSP](https://github.com/google/ksp) が必要です。公式の [KSP セットアップ ドキュメント](https://kotlinlang.org/docs/ksp-quickstart.html)に従ってください。

Gradle プラグインを追加します：
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP の互換性**: Koin Annotations 2.3.1 には KSP `2.3.2` が必要です。

:::info
**KSP バージョンの変更**: KSP 2.x 以降、バージョン番号は Kotlin のバージョンから独立しました。Koin Annotations 2.3.1 には KSP 2.3.2 を使用してください。
:::

## バージョンカタログの使用 (推奨)

`gradle/libs.versions.toml` ファイル内：

```toml
[versions]
koin-annotations = "2.3.1"  # 安定版
ksp = "2.3.2"  # Koin Annotations 2.3.1 に必要

[libraries]
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-annotations" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-annotations" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

## Android および Ktor アプリの KSP セットアップ

- KSP Gradle プラグインを使用する
- Koin Annotations と Koin KSP コンパイラの依存関係を追加する
- sourceSet を設定する

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

またはバージョンカタログを使用する場合：

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

## Kotlin Multiplatform のセットアップ

標準的な Kotlin/Kotlin Multiplatform プロジェクトでは、次のように KSP をセットアップする必要があります：

- KSP Gradle プラグインを使用する
- commonMain に Koin Annotations の依存関係を追加する
- commonMain の sourceSet を設定する
- Koin コンパイラを使用した KSP 依存関係タスクを追加する
- コンパイルタスクの依存関係を `kspCommonMainKotlinMetadata` に設定する

```kotlin
plugins {
    alias(libs.plugins.ksp)
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
    add("kspCommonMainMetadata", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}

// Native タスクから Common メタデータの生成をトリガー
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}
```

:::info
KMP の完全なセットアップとアーキテクチャパターンについては、[Koin Annotations KMP](/docs/reference/koin-annotations/kmp) を参照してください。
:::

## 次のステップ

セットアップが完了しました！次へ進みましょう：

- [Koin Annotations を使い始める](/docs/reference/koin-annotations/start) - コードでアノテーションを使用する方法を学びます
- [アノテーションの定義](/docs/reference/koin-annotations/definitions) - 詳細なアノテーションリファレンス
- [アノテーション一覧](/docs/reference/koin-annotations/annotations-inventory) - 利用可能なアノテーションの完全なリスト