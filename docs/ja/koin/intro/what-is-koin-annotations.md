---
title: Koin Annotationsとは？
---

# Koin Annotationsとは？

### 馴染みのあるアノテーションスタイル — Koinメインプロジェクトの一部

**Koin Annotations**は、Koinにおいてアノテーションベースで依存関係を定義する方法です。Kotlin DSLよりも、`@Singleton`、`@Factory`、`@KoinViewModel`といったスタイルを好む場合に適しています。

これは**メインのKoinプロジェクトの一部**であり、GitHubリポジトリ、リリースサイクル、Koinのバージョン、メンテナーはすべて共通です。サイドプロジェクトやコミュニティによるフォーク、別個のフレームワークではありません。DSLと同様に、**Koin Compiler Plugin**によって処理され、コンパイル時の安全性が確保されます。

## 概要

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

コンセプトは非常にシンプルです。クラスにアノテーションを付与し、モジュールを宣言すれば、ビルド時にKoin Compiler Pluginが残りの接続（ワイヤリング）を自動で行います。

## メインのKoinプロジェクトの一部

`koin-annotations`ライブラリは、**メインのKoinプロジェクトの一部**です。同じリポジトリに存在し、`koin-core`と**同じKoinバージョン**で提供され、同じリリースサイクルに従い、Koin BOMに含まれています。

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 同じKoinバージョン、同じBOM
}
```

実務上の意味：

- **非推奨ではない** — アノテーションはファーストクラスの、完全にサポートされたスタイルです。
- **独立した製品ではない** — 個別に追跡が必要な「Koin Annotations」という別のプロジェクトはありません。
- **バージョンが同期される** — `koin-core`と`koin-annotations`は常に一致します。
- **DSLとの完全な機能パリティ** — DSLでできることは、すべてアノテーションでも実行可能です。

## Koin Compiler Pluginによる強力なサポート

Koin Annotationsは、Kotlinコンパイラに直接統合されるネイティブな**Kotlin Compiler Plugin (K2)**である**Koin Compiler Plugin**によって処理されます。KSPは不要で、コミットが必要な生成ファイルや追加の処理ステップもありません。

得られるメリット：

- **自動ワイヤリング** — コンストラクタの引数が自動的に検出され、解決されます。
- **コンパイル時の安全性** — 依存関係の欠落、修飾子（qualifier）の不一致、誤ったバインディングがビルド時に検出されます。
- **KMPセットアップの簡素化** — ターゲットごとのKSP設定が不要になります。
- **同じアノテーション** — `@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan`、`@Named`、`@InjectedParam`などをそのまま使用できます。

動作の仕組みや生成される内容の詳細については、[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)を参照してください。

## `koin-ksp-compiler`は非推奨になりました

:::warning
レガシーなKSPプロセッサである`koin-ksp-compiler`は**非推奨**となり、将来のKoinバージョンで削除される予定です。
:::

アノテーション自体は**非推奨ではありません**。それらを処理していたKSPベースのプロセッサのみが非推奨となります。移行は機械的な手順で完了します：

- **同じアノテーション** — `@Singleton`、`@Module`、`@ComponentScan`などのコードはそのまま維持されます。
- **KSPプラグインの削除** — 代わりにKoin Compiler Pluginを導入します。
- **生成ファイルの削除** — Compiler Pluginは、目に見える形の生成ソースコードを作成しません。

ステップバイステップの手順については、[KSPからCompiler Pluginへの移行](/docs/migration/from-ksp-to-compiler-plugin)を参照してください。

## アノテーションを選択するタイミング

アノテーションとDSLは、どちらも主要な（ファーストクラスの）機能です。以下の場合にアノテーションを選択してください：

- Hilt、Dagger、Springなどから移行しており、馴染みのあるスタイルを好む場合
- クラスとその定義を同じ場所に記述したい（co-location）場合
- チーム内でアノテーションベースの設定が標準化されている場合

Kotlinネイティブな、コードのみのスタイルを好む場合はDSLを選択してください。また、これらは同じCompiler Pluginによって処理されるため、**同じプロジェクト内で両方を併用する**ことも可能です。

## 次のステップ

- **[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)** — プラグインがどのようにアノテーションを動作させるか
- **[アノテーションリファレンス](/docs/reference/koin-annotations/start)** — アノテーションの全カタログとパターン
- **[KSPからCompiler Pluginへの移行](/docs/migration/from-ksp-to-compiler-plugin)** — `koin-ksp-compiler`からのアップグレードパス
- **[Koinとは？](/docs/intro/what-is-koin)** — 全体像の把握