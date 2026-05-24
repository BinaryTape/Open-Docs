---
title: Koin Annotations を使い始める
---

:::info Koin Annotations のステータス
**Koin Annotations は現在 Koin プロジェクトの一部となっています。** `koin-annotations` ライブラリはメインの Koin バージョンとして提供されており、完全にサポートされています。

レガシーな KSP プロセッサ（`koin-ksp-compiler`）は、**Koin Compiler Plugin** の登場により**非推奨（deprecated）**となりました。アノテーション自体は変わりません。ビルド設定のみが変更されます。[KSP から Compiler Plugin への移行](/docs/migration/from-ksp-to-compiler-plugin)を参照してください。
:::

Koin Annotations を使用すると、クラスにアノテーションを付与することで定義（definitions）を宣言できます。Koin コンパイラプラグインはこれらのアノテーションを処理し、基盤となるすべての Koin DSL をコンパイル時に自動生成します。

## はじめに (Getting Started)

Koin に詳しくない場合は、まず [Koin Getting Started](https://insert-koin.io/docs/quickstart/kotlin/) をご覧ください。

### セットアップ (Setup)

プロジェクトに Koin コンパイラプラグインを追加します。詳細な手順については、[Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

### コンポーネントへのアノテーション付与

コンポーネントに定義アノテーション（definition annotations）でタグを付けます：

```kotlin
@Singleton
class MyRepository

@Singleton
class MyService(val repository: MyRepository)

@Factory
class MyUseCase(val service: MyService)
```

### モジュールの宣言

定義を整理するためのモジュールを作成します：

```kotlin
@Module
@ComponentScan("com.myapp")
class AppModule
```

### Koin の開始

型付けされたスタートアップ API（typed startup API）と共に `@KoinApplication` を使用します：

```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp> {
        printLogger()
    }

    // 通常通り Koin API を使用します
    KoinPlatform.getKoin().get<MyService>()
}
```

## 設定ラベル (Configuration Labels)

ラベルに基づいてロードされるモジュールを作成するために `@Configuration` を使用します：

```kotlin
@Module
@Configuration  // デフォルト設定
class CoreModule

@Module
@Configuration("prod")
class ProdModule

@Module
@Configuration("test")
class TestModule
```

特定の構成（configurations）をロードする：

```kotlin
@KoinApplication(
    modules = [CoreModule::class],
    configurations = ["prod"]  // @Configuration("prod") が付与されたモジュールのみをロードします
)
class ProdApp

fun main() {
    startKoin<ProdApp>()
}
```

## 型付けされたスタートアップ API (Typed Startup APIs)

コンパイラプラグインは、Koin を開始するための型付けされた API を提供します：

| API | 説明 |
|-----|-------------|
| `startKoin<T>()` | Koin をグローバルに開始する |
| `startKoin<T> { }` | 設定ブロックを使用して開始する |
| `koinApplication<T>()` | 隔離された KoinApplication を作成する |
| `koinConfiguration<T>()` | 設定を作成する（Compose、Ktor 用） |
| `module<T>()` | 単一の `@Module` クラスをロードする |
| `modules(A::class, B::class)` | 複数の `@Module` クラスをロードする |

ここで `T` は、`@KoinApplication`（スタートアップ API 用）または `@Module`（モジュールロード API 用）が付与されたクラスです。

### 個別モジュールのロード

`@KoinApplication` を使用せずに、`@Module` クラスを直接ロードすることもできます：

```kotlin
startKoin {
    module<NetworkModule>()
    modules(DataModule::class, CacheModule::class)
}
```

これは特に**テスト**において有用です：

```kotlin
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## コンパイル時の安全性 (Compile-Time Safety)

コンパイラプラグインは、コンパイル時に Koin 設定を検証し、すべての依存関係が宣言され、アクセス可能であることをチェックします。

### @Provided によるバイパス

依存関係が外部から提供されていることを示すには、`@Provided` を使用します：

```kotlin
class ExternalComponent  // 別の場所で宣言されている

@Factory
class MyPresenter(@Provided val external: ExternalComponent)
```

## コンパイラプラグインのオプション

すべての設定オプションについては、**[Compiler Plugin Options](/docs/reference/koin-annotations/options)** を参照してください。

## ProGuard ルール

ProGuard/R8 を使用した SDK 開発の場合：

```
# アノテーション定義を保持する
-keep class org.koin.core.annotation.** { *; }

# Koin アノテーションが付与されたクラスを保持する
-keep @org.koin.core.annotation.* class * { *; }
```

## 関連項目

- **[Compiler Plugin Setup](/docs/setup/compiler-plugin)** - 完全なセットアップガイド
- **[Definitions](/docs/reference/koin-annotations/definitions)** - すべての定義アノテーション
- **[Modules](/docs/reference/koin-annotations/modules)** - モジュールの整理
- **[KMP Support](/docs/reference/koin-annotations/kmp)** - Kotlin Multiplatform サポート