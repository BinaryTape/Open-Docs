---
title: リリースとAPI互換性ガイド
custom_edit_url: null
---
:::info
このページでは、Koin の主要なリリースを網羅的に概説し、アップグレードの計画や互換性の維持に役立つように、フレームワークの進化について詳しく説明します。
:::

各バージョンについて、ドキュメントは以下のセクションで構成されています。

- `Kotlin`: リリースで使用される Kotlin のバージョンを指定し、言語の互換性を明確にし、最新の Kotlin の機能を活用できるようにします。
- `New`: 新しく導入された機能と改善点を強調し、機能と開発者のエクスペリエンスを向上させます。
- `Experimental`: 試験的な API と機能をリストします。これらは活発に開発されており、コミュニティのフィードバックに基づいて変更される可能性があります。
- `Deprecated`: 非推奨としてマークされた API と機能を特定し、推奨される代替手段に関するガイダンスを提供し、将来の削除に備えるのに役立ちます。
- `Breaking`: 後方互換性を損なう可能性のある変更について詳しく説明し、移行時に必要な調整を認識できるようにします。

この構造化されたアプローチは、各リリースの段階的な変更を明確にするだけでなく、Koin プロジェクトにおける透明性、安定性、継続的な改善への取り組みを強化します。

## 4.0.3

:::note
Kotlin `2.0.21` を使用
:::

使用されているすべてのライブラリのバージョンは、[libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) にあります。

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - この新しいバージョンの Kotlin では、新しい `kotlin.uuid.uuid` API を利用できます。`KoinPlatformTools.generateId()` Koin 関数は、この新しい API を使用して、プラットフォーム上で実際の UUID を生成します。

`koin-viewmodel`
 - Koin 4.0 では、Google/Jetbrains KMP API を相互利用する新しい ViewModel DSL と API が導入されました。コードベース全体での重複を避けるために、ViewModel API は `koin-core-viewmodel` および `koin-core-viewmodel-navigation` プロジェクトに配置されるようになりました。
 - ViewModel DSL のインポートは `org.koin.core.module.dsl.*` です。

指定されたプロジェクトの以下の API は、安定版になりました。

`koin-core-coroutines` - すべての API が安定版になりました
  - すべての `lazyModules`
  - `awaitAllStartJobs`、`onKoinStarted`、`isAllStartedJobsDone`
  - `waitAllStartJobs`、`runOnKoinStarted`
  - `KoinApplication.coroutinesEngine`
  - `Module.includes(lazy)`
  - `lazyModule()`
  - `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - `Verify` API の動的パラメータインジェクションの設計を支援する新しい API

`koin-androidx-startup`
- `koin-androidx-startup` - `androidx.startup.Initializer` API を使用して、`AndroidX Startup` で Koin を起動する新しい機能。`koin-androidx-startup` 内のすべての API は Experimental です。

`koin-compose`
- `rememberKoinModules` - @Composable コンポーネントを指定して Koin モジュールをロード/アンロードします
- `rememberKoinScope` - @Composable コンポーネントを指定して Koin Scope (Koinのスコープ)をロード/アンロードします
- `KoinScope` - すべての基盤となる Composable (コンポーザブル)の子に対して Koin スコープをロードします

### Deprecation ⚠️

以下の API は非推奨になり、使用すべきではありません。

- `koin-test`
  - `checkModules` のすべての API。`Verify` API に移行してください。

- `koin-android`
  - koin-core の新しい集中型 DSL を優先して、ViewModel DSL を使用してください

- `koin-compose-viewmodel`
  - koin-core の新しい集中型 DSL を優先して、ViewModel DSL を使用してください
  - 関数 `koinNavViewModel` は非推奨になり、`koinViewModel` を優先して使用してください

### Breaking 💥

以下の API は、最後のマイルストーンでの非推奨により削除されました。

:::note
`@KoinReflectAPI` で注釈が付けられたすべての API は削除されました
:::

`koin-core`
  - `ApplicationAlreadyStartedException` は `KoinApplicationAlreadyStartedException` に名前が変更されました
  - `KoinScopeComponent.closeScope()` は内部で使用されなくなったため削除されました
  - 内部 `ResolutionContext` を移動して `InstanceContext` を置き換えました
  - `KoinPlatformTimeTools`、`Timer`、`measureDuration` を削除し、代わりに Kotlin Time API を使用するようにしました
  - `KoinContextHandler` は `GlobalContext` を優先して削除されました

`koin-android`
  - すべての状態 ViewModel API はエラーレベルで非推奨になりました。
    - `stateViewModel()`,`getStateViewModel()` の代わりに `viewModel()` を使用してください
    - `getSharedStateViewModel()`、`sharedStateViewModel()` の代わりに、共有インスタンスの場合は `viewModel()` または `activityViewModel()` を使用してください
  - 関数 `fun Fragment.createScope()` が削除されました
  - ViewModel ファクトリ (主に内部) に関するすべての API は、新しい内部構造のために再設計されました

`koin-compose`
  - 古い compose API 関数はエラーレベルで非推奨になりました。
    - 関数 `inject()` は削除され、`koinInject()` を優先して使用してください
    - 関数 `getViewModel()` は削除され、`koinViewModel()` を優先して使用してください
    - 関数 `rememberKoinInject()` は `koinInject()` に移動されました
  - 内部で使用されなくなったため、`StableParametersDefinition` が削除されました
  - 古い Lazy ViewModel API - `viewModel()` が削除されました
  - 内部で使用されなくなったため、`rememberStableParametersDefinition()` が削除されました

## 3.5.6

:::note
Kotlin `1.9.22` を使用
:::

使用されているすべてのライブラリのバージョンは、[libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) にあります。

### New 🎉

`koin-core`
  - `KoinContext` に以下が追加されました。
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
  - `koinApplication()` 関数は、いくつかの形式で使用されるようになりました。
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
  - 宣言スタイルをオープンにするのに役立つ `KoinAppDeclaration`
  - JS で API Time を使用するための `KoinPlatformTimeTools`
  - iOS - Touchlab Lockable API を使用するための `synchronized` API

`koin-androidx-compose`
  - Android 環境から現在の Koin コンテキストにバインドするための新しい `KoinAndroidContext`

`koin-compose`
  - 現在のデフォルトコンテキストを使用した新しい `KoinContext` コンテキストスターター

`koin-ktor`
  - Ktor インスタンスに分離されたコンテキストを使用するようになりました (デフォルトのコンテキストの代わりに `Application.getKoin()` を使用します)
  - Koin プラグインに新しいモニタリングが導入されました
  - Ktor リクエストへのスコープインスタンスを許可する `RequestScope`

### Experimental 🚧

`koin-android`
  - `ViewModelScope` は ViewModel スコープの実験的な API を導入します

`koin-core-coroutines` - バックグラウンドでモジュールをロードするための新しい API を導入

### Deprecation ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API は非常に複雑で、デフォルトのグローバルコンテキストを呼び出します。Android/Fragment API に固執することをお勧めします
  - `resolveViewModelCompat()` は `resolveViewModel()` を優先して非推奨になりました

`koin-compose`
  - 関数 `get()` および `inject()` は `koinInject()` を優先して非推奨になりました
  - 関数 `getViewModel()` は `koinViewModel()` を優先して非推奨になりました
  - 関数 `rememberKoinInject()` は `koinInject()` に対して非推奨になりました

### Breaking 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` は `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)` を置き換えます
  - プロパティ `KoinExtension.koin` を関数 `KoinExtension.onRegister()` に移動しました
  - iOS - `MutableGlobalContext` を使用するための `internal fun globalContextByMemoryModel(): KoinContext`

`koin-compose`
  - 関数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` は `KoinContext` および `KoinAndroidContext` を優先して削除されました

## 3.4.3

:::note
Kotlin `1.8.21` を使用
:::

### New 🎉

`koin-core`
  - Koin の拡張エンジンを作成するのに役立つ新しい ExtensionManager API - `ExtensionManager` + `KoinExtension`
  - `parameterArrayOf` と `parameterSetOf` によるパラメータ API の更新

`koin-test`
  - Module (モジュール)で `verify` を実行するのに役立つ `Verification` API

`koin-android`
  - ViewModel インジェクションの内部構造
  - `AndroidScopeComponent.onCloseScope()` 関数コールバックを追加

`koin-android-test`
  - Module で `androidVerify()` を実行するのに役立つ `Verification` API

`koin-androidx-compose`
  - 新しい `get()`
  - 新しい `getViewModel()`
  - 新しい スコープ `KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - ナビゲーション用の新しいモジュール
  - 新しい `koinNavViewModel()`

`koin-compose` - Compose 用の新しいマルチプラットフォーム API
  - `koinInject`、`rememberKoinInject`
  - `KoinApplication`

### Experimental 🚧

`koin-compose` - Compose 用の新しい Experimental マルチプラットフォーム API
  - `rememberKoinModules`
  - `KoinScope`、`rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- Lazy (遅延)関数を回避する使用法として `inject()` の代わりに `get()` 関数を使用します
- Lazy 関数を回避する使用法として `viewModel()` 関数の代わりに `getViewModel()` 関数を使用します

### Breaking 💥

`koin-android`
  - `LifecycleScopeDelegate` が削除されました

`koin-androidx-compose`
  - `koinViewModel` を優先して `getStateViewModel` が削除されました