---
title: セットアップとバージョン
---

# Koin のセットアップ

このガイドでは、プロジェクトに Koin を追加するために必要なすべての事項について説明します。

## クイックセットアップ {id="quick-setup"}

開始するには、プラットフォームを選択してください：

| プラットフォーム | パッケージ | ガイド |
|----------|---------|-------|
| **Kotlin/JVM** | `koin-core` | [Gradle のセットアップ](/docs/setup/gradle#kotlin) |
| **Android** | `koin-android` | [Gradle のセットアップ](/docs/setup/gradle#android) |
| **Android + Jetpack Compose** | `koin-android` + `koin-compose` | [Gradle のセットアップ](/docs/setup/gradle#compose-android) |
| **Compose Multiplatform** | `koin-compose` | [Gradle のセットアップ](/docs/setup/gradle#compose) |
| **Kotlin Multiplatform** | `koin-core` | [Gradle のセットアップ](/docs/setup/gradle#kotlin-multiplatform) |
| **Ktor** | `koin-ktor` | [Gradle のセットアップ](/docs/setup/gradle#ktor) |

## 推奨セットアップ: BOM + コンパイラプラグイン {id="recommended-setup-bom-compiler-plugin"}

最良のエクスペリエンスを得るために、以下を推奨します：

1. **Koin BOM を使用する** - すべての Koin ライブラリのバージョンを一括管理します
2. **Koin コンパイラプラグインを使用する** - コンパイル時の安全性を確保します

詳細な手順については、**[コンパイラプラグインのセットアップガイド](/docs/setup/compiler-plugin)**を参照してください。

## セットアップガイド {id="setup-guides"}

### [Gradle のセットアップ](/docs/setup/gradle) {id="gradle-setup"}

すべてのプラットフォーム向けの完全な依存関係設定：
- Koin BOM (推奨)
- バージョンカタログ (Version catalogs)
- プラットフォーム固有のパッケージ
- テスト用の依存関係

### [コンパイラプラグインのセットアップ](/docs/setup/compiler-plugin) {id="compiler-plugin-setup"}

Koin コンパイラプラグインの詳細ガイド：
- Gradle プラグインの設定
- 設定オプション
- Kotlin バージョンの要件
- トラブルシューティング

### [KSP プロセッサのセットアップ](/docs/setup/annotations-ksp) (非推奨) {id="ksp-processor-setup-deprecated"}

Koin Annotations 向けの KSP ベースのプロセッサである `koin-ksp-compiler` のレガシーなセットアップ：
- ⚠️ `koin-ksp-compiler` は非推奨です — Koin コンパイラプラグインへ移行してください
- Koin Annotations 自体は非推奨ではありません。`koin-annotations` は現在、メインの Koin プロジェクトの一部となっています
- 移行ガイドが含まれています

## バージョンの互換性 {id="version-compatibility"}

| Koin バージョン | Kotlin バージョン | Koin コンパイラプラグイン |
|--------------|----------------|----------------------|
| 4.2.x | 2.3+ | ✅ 推奨 |
| 4.1.x | 2.1/2.2+ | ⚠️ KSP プロセッサのみ |
| 4.0.x | 1.9/2.0+ | ⚠️ KSP プロセッサのみ |
| 3.5.x | 1.8+ | ❌ 利用不可 |

## 現在のバージョン {id="current-version"}

- **Koin**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- **Koin コンパイラプラグイン**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

[Maven Central](https://central.sonatype.com/search?q=io.insert-koin+koin-core&sort=name) ですべての Koin パッケージを確認できます。

## 次のステップ {id="next-steps"}

セットアップの後に：
- **[コアコンセプト](/docs/reference/koin-core/starting-koin)** - Koin の使い方を学ぶ
- **[チュートリアル](/docs/quickstart/kotlin)** - 初めてのアプリを作成する
- **[Android との統合](/docs/reference/koin-android/start)** - Android 固有の機能