---
title: Koin DSL
---

Koin DSLのクイックリファレンスです。詳細なガイドについては、**[Core - Definitions](/docs/reference/koin-core/definitions)** および **[Core - Modules](/docs/reference/koin-core/modules)** を参照してください。

## DSL のアプローチ

| アプローチ | 構文 | パッケージ |
|----------|--------|---------|
| **クラシック DSL (Classic DSL)** | `single { Class(get()) }` | `org.koin.dsl` |
| **クラシックな自動ワイヤリング (Classic Autowire)** | `singleOf(::Class)` | `org.koin.dsl` |
| **コンパイラプラグイン (Compiler Plugin)** | `single<Class>()` | `org.koin.plugin.module.dsl` |

:::tip
**コンパイラプラグイン DSL** は、自動ワイヤリングとコンパイル時の安全性を提供します。[コンパイラプラグインのセットアップ](/docs/setup/compiler-plugin)を参照してください。
:::

## Application DSL

`KoinApplication` インスタンスは、設定済みの Koin コンテナを表します。これにより、ロギングの設定、プロパティのロード、およびモジュールの登録が可能になります。

### KoinApplication の作成

2つのアプローチから選択できます：

* `koinApplication { }` - スタンドアロンの `KoinApplication` インスタンスを作成します。
* `startKoin { }` - `KoinApplication` を作成し、それを `GlobalContext` に登録します。

```kotlin
// スタンドアロンインスタンス（テストやカスタムコンテキストに便利です）
val koinApp = koinApplication {
    modules(myModule)
}

// グローバルインスタンス（アプリケーションの標準的なアプローチ）
startKoin {
    logger()
    modules(myModule)
}
```

### 設定関数

`koinApplication` または `startKoin` 内では、以下の関数を使用できます：

* `logger()` - ログレベルと `Logger` 実装を設定します（デフォルト：`EmptyLogger`）。
* `modules()` - モジュールをコンテナにロードします（リストまたは可変引数を受け取ります）。
* `properties()` - プロパティの `HashMap` をロードします。
* `fileProperties()` - ファイルからプロパティをロードします。
* `environmentProperties()` - OS の環境変数からプロパティをロードします。
* `createEagerInstances()` - `createdAtStart` とマークされたすべての定義をインスタンス化します。
* `allowOverride(Boolean)` - 定義の上書きの有効化/無効化を切り替えます（3.1.0 以降のデフォルトは `true`）。

### グローバルコンテキスト vs ローカルコンテキスト

`koinApplication` と `startKoin` の主な違いは以下の通りです：

- **`startKoin`** - コンテナを `GlobalContext` に登録し、`KoinComponent`、`by inject()`、およびその他のグローバル API を介してアクセス可能にします。
- **`koinApplication`** - 直接制御する、分離されたインスタンスを作成します。

```kotlin
// グローバルコンテキスト - 標準的な使用法
startKoin {
    logger()
    modules(appModule)
}

// 後ほど、アプリ内のどこからでも:
class MyClass : KoinComponent {
    val service: Service by inject() // GlobalContext を使用
}
```

```kotlin
// ローカルコンテキスト - 高度な使用法（テスト、マルチコンテキストアプリ）
val customKoin = koinApplication {
    modules(testModule)
}.koin

val service = customKoin.get<Service>() // 特定のインスタンスを使用
```

### Koin の開始

Koin セットアップの完全な例：

```kotlin
startKoin {
    // ロギングの設定
    logger(Level.INFO)

    // プロパティのロード
    environmentProperties()

    // モジュールの宣言
    modules(
        networkModule,
        databaseModule,
        repositoryModule,
        viewModelModule
    )

    // Eager（先行）シングルトンの作成
    createEagerInstances()
}
```

## Module DSL

モジュールと定義に関する包括的なドキュメントについては、以下を参照してください：
- **[Definitions](/docs/reference/koin-core/definitions)** - DSL とアノテーションを使用したすべての定義タイプ
- **[Modules](/docs/reference/koin-core/modules)** - モジュールの構成と合成
- **[Definitions Reference](/docs/reference/koin-core/definitions)** - クイックルックアップテーブル

### クイックリファレンス

| 定義 | クラシックラムダ | クラシックな自動ワイヤリング | コンパイラプラグイン |
|------------|----------------|------------------|-----------------|
| シングルトン | `single { Class(get()) }` | `singleOf(::Class)` | `single<Class>()` |
| ファクトリ | `factory { Class(get()) }` | `factoryOf(::Class)` | `factory<Class>()` |
| スコープ | `scoped { Class(get()) }` | `scopedOf(::Class)` | `scoped<Class>()` |
| ViewModel | `viewModel { VM(get()) }` | `viewModelOf(::VM)` | `viewModel<VM>()` |
| ファンクションビルダー (Function Builder) | `single { fn(get()) }` | — | `single { create(::fn) }` |

### 基本的なモジュール

```kotlin
val myModule = module {
    single<Database>()
    single<UserRepository>()
    factory<UserPresenter>()
}
```

### モジュールの合成

```kotlin
val appModule = module {
    includes(networkModule, databaseModule)
    single<AppConfig>()
}

startKoin {
    modules(appModule)
}
```

詳細は **[Modules - includes()](/docs/reference/koin-core/modules#module-composition-with-includes)** を参照してください。