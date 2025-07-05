---
title: リリースとAPIアップグレードガイド
custom_edit_url: null
---

:::info
このページでは、Koinの主要なリリースごとに包括的な概要を提供し、フレームワークの進化を詳しく説明することで、アップグレードの計画と互換性の維持に役立てることができます。
:::

各バージョンについて、ドキュメントは以下のセクションで構成されています。

- `Kotlin`: リリースで使用されるKotlinのバージョンを指定し、言語の互換性を明確にし、最新のKotlin機能を利用できるようにします。
- `New`: 機能性と開発者エクスペリエンスを向上させるために新しく導入された機能と改善点を強調します。
- `Experimental`: 実験的としてマークされたAPIと機能を一覧表示します。これらは現在活発に開発中であり、コミュニティからのフィードバックに基づいて変更される可能性があります。
- `Deprecated`: 非推奨とマークされたAPIと機能を特定し、推奨される代替案に関するガイダンスとともに、将来の削除に備えるのに役立ちます。
- `Breaking`: 後方互換性を損なう可能性のある変更点を詳しく説明し、移行中に必要な調整を把握できるようにします。

この構造化されたアプローチは、各リリースにおける段階的な変更を明確にするだけでなく、Koinプロジェクトにおける透明性、安定性、継続的な改善への私たちのコミットメントを強化します。

詳細については、[API安定性契約](api-stability.md)を参照してください。

## 4.1.1

### New 🎉

`koin-ktor`
- 統合 - Ktor 3.2のデフォルトDIエンジンを統合するための`KtorDIExtension`を提供
```kotlin
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}

class CustomerRepositoryImpl(private val database: Database) : CustomerRepository
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

## 4.1.0

:::note
Kotlin `2.1.20` を使用
:::

### New 🎉

`koin-core`
- 設定 - 設定をラップするのに役立つ`KoinConfiguration` API
- スコープ - スコープのカテゴリに対する専用のスコープ型クオリファイアの新しい*スコープアーキタイプ*を導入します。インスタンスの解決は、スコープカテゴリ（別名アーキタイプ）に対して行えるようになりました。
- 機能オプション - Koin内の新しい機能の挙動を機能フラグとして設定するのに役立つ「機能オプション」。Koin設定の`options`ブロックでオプションを有効化できます。
```kotlin
startKoin {
    options(
        // activate a new feature
        viewModelScopeFactory()
    )
}
```
- コア - `ResolutionExtension`がKoinを外部システムやリソースで解決するのに役立つ新しい`CoreResolver`を導入します（これはKtor DIの接続に役立ちます）。

`koin-android`
- アップグレードされたライブラリ（`androidx.appcompat:appcompat:1.7.0`、`androidx.activity:activity-ktx:1.10.1`）は、最小SDKレベルを14から21に引き上げる必要があります。
- DSL - Activity/Fragment内でスコープを宣言するための新しいKoinモジュールDSL拡張機能`activityScope`、`activityRetainedScope`、`fragmentScope`を追加しました。
- スコープ関数 - また、`activityScope()`、`activityRetainedScope()`、`fragmentScope()` API関数がスコープアーキタイプをトリガーするようになりました。

`koin-androidx-compose`
- Koin Compose MultiplatformおよびCompose 1.8 & Lifecycle 2.9すべてに準拠

`koin-compose`
- Compose 1.8 & Lifecycle 2.9に準拠
- 新関数 - Android Studio & IntelliJでの並行プレビューのレンダリングに役立つ`KoinApplicationPreview`

`koin-compose-viewmodel`
- 親Activityをホストとして設定できるように`koinActivityViewModel`を追加

`koin-ktor`
- マルチプラットフォーム - このモジュールは現在Kotlin KMP形式でコンパイルされています。マルチプラットフォームプロジェクトから`koin-ktor`をターゲットにできます。
- マージ - 以前のkoin-ktor3モジュールはkoin-ktorにマージされました。
- 拡張機能 - `Application.koinModule { }`および`Application.koinModules()`を導入し、Ktorモジュールに直接結合されたKoinモジュールを宣言できるようにします。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- スコープ - `Module.requestScope` - Ktorリクエストスコープ内で定義を宣言することを可能にします（`scope<RequestScope>`を手動で宣言するのを避けます）。
注入されたスコープは、コンストラクタで`ApplicationCall`を注入することも可能です。

`koin-core-coroutines`
- モジュールDSL - モジュール設定を単一の構造にまとめるのに役立つ新しい`ModuleConfiguration`を導入し、後でより適切に検証できるようにします。
```kotlin
val m1 = module {
    single { Simple.ComponentA() }
}
val lm1 = lazyModule {
    single { Simple.ComponentB(get()) }
}
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}
```
- 設定DSL - Koinの設定で`ModuleConfiguration`を使用してモジュールをロードできるようになりました。
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// or even
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- 新しいコルーチン関連のテストAPIを導入するために、新しい`koin-test-coroutines` Koinモジュールを追加しました。
- 拡張機能 - `Verify` APIを拡張し、`moduleConfiguration`を使用してKoin設定をチェックし、モジュールと遅延モジュールの混合設定を検証できるようにします。
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// if you want Android types (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- アノテーション - `@InjectedParam`または`@Provided`を使用して、プロパティを注入されたパラメータまたは動的に提供されたものとしてタグ付けします。現在のところ`Verify` APIで使用されていますが、将来的にはより軽量なDSL宣言に役立つ可能性があります。

### Experimental 🚧

`koin-core`
- Wasm - Kotlin 2.1.20 UUID生成の使用

`koin-core-viewmodel`
- DSL - ViewModelスコープアーキタイプにスコープ指定されたコンポーネントを宣言するためのモジュールDSL拡張機能`viewModelScope`を追加
- スコープ関数 - ViewModel用のスコープを作成する関数`viewModelScope()`を追加しました（ViewModelクラスに紐付けられます）。このAPIは現在`ViewModelScopeAutoCloseable`を使用して`AutoCloseable` APIを使用し、スコープを宣言して閉じることができます。ViewModelスコープを手動で閉じる必要がなくなりました。
- クラス - `ScopeViewModel`クラスを更新し、すぐに使用できるViewModelスコープクラスのサポートを提供します（スコープの作成と閉じを処理）。
- 機能オプション - ViewModelのスコープによるコンストラクタViewModelインジェクションには、Koinオプション`viewModelScopeFactory`の有効化が必要です。
```kotlin
startKoin {
    options(
        // activate a new ViewModel scope creation
        viewModelScopeFactory()
    )
}

// will inject Session from MyScopeViewModel's scope
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose関数 - マルチプラットフォームComposeエントリポイントを提案するために、新しい`KoinMultiplatformApplication`関数を追加しました。

`koin-core-viewmodel-navigation`
- ナビゲーション拡張機能 - ナビゲーションの`NavbackEntry`からViewModelインスタンスを再利用するために`sharedViewModel`を追加

`koin-test`
- アノテーション - Koin設定検証APIの`Verify`は、nullable、lazy、およびリストパラメータのチェックに役立つようになりました。単に`@InjectedParam`または`@Provided`を使用して、プロパティを注入されたパラメータまたは動的に提供されたものとしてタグ付けします。これにより、`Verify` APIでの複雑な宣言を回避できます。
```kotlin
// now detected in Verify
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### Deprecation ⚠️

`koin-android`
- `ScopeViewModel`は非推奨となり、代わりに`koin-core-viewmodel`の`ScopeViewModel`クラスを使用するようになりました。

`koin-compose`
- Koinコンテキストが現在のデフォルトコンテキストで適切に準備されるため、ComposeコンテキストAPIは不要になりました。以下は非推奨であり、削除できます：`KoinContext`

`koin-androidx-compose`
- Koinコンテキストが現在のデフォルトコンテキストで適切に準備されるため、Jetpack ComposeコンテキストAPIは不要になりました。以下は非推奨であり、削除できます：`KoinAndroidContext`

`koin-androidx-compose-navigation`
- ライフサイクルライブラリの更新により、関数`koinNavViewModel`は不要となり、`koinViewModel`に置き換えられます。

`koin-core-viewmodel-navigation`
- ライフサイクルライブラリの更新により、関数`koinNavViewModel`は不要となり、`koinViewModel`に置き換えられます。

`koin-ktor`
- 拡張機能 - `Application.koin`は非推奨となり、`Application.koinModules`および`Application.koinModule`が推奨されます。

### Breaking 💥

`koin-android`
- すべての古いState ViewModel APIは削除されました。
    - `stateViewModel()`、`getStateViewModel()` は、代わりに`viewModel()`を使用してください。
    - `getSharedStateViewModel()`、`sharedStateViewModel()` は、代わりに`viewModel()`または共有インスタンスには`activityViewModel()`を使用してください。

`koin-compose`
- 古いCompose API関数は削除されました。
    - 関数`inject()`は`koinInject()`に置き換えられ削除されました。
    - 関数`getViewModel()`は`koinViewModel()`に置き換えられ削除されました。
    - 関数`rememberKoinInject()`は`koinInject()`に移動されました。
- 関数`rememberKoinApplication`は`@KoinInternalAPI`としてマークされました。

## 4.0.4

:::note
Kotlin `2.0.21` を使用
:::

使用されているすべてのライブラリバージョンは [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) にあります。

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - この新しいKotlinバージョンにより、新しい`kotlin.uuid.uuid` APIの恩恵を受けることができます。`KoinPlatformTools.generateId()` Koin関数は、この新しいAPIを使用してプラットフォーム間で実際のUUIDを生成するようになりました。

`koin-viewmodel`
- Koin 4.0では、Google/Jetbrains KMP APIを共通化するViewModel DSL & APIが導入されました。コードベース全体での重複を避けるため、ViewModel APIは現在`koin-core-viewmodel`および`koin-core-viewmodel-navigation`プロジェクトに配置されています。
- ViewModel DSLのインポートは`org.koin.core.module.dsl.*`です。

指定されたプロジェクトにおける以下のAPIは、現在安定版です。

`koin-core-coroutines` - すべてのAPIが現在安定版です
- すべての`lazyModules`
- `awaitAllStartJobs`、`onKoinStarted`、`isAllStartedJobsDone`
- `waitAllStartJobs`、`runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - `Verify` APIのための動的なパラメータインジェクションを設計するのに役立つ新しいAPI

`koin-androidx-startup`
- `koin-androidx-startup` - `AndroidX Startup`を使用してKoinを開始する新しい機能で、`androidx.startup.Initializer` APIを使用します。`koin-androidx-startup`内のすべてのAPIは実験的です。

`koin-compose`
- `rememberKoinModules` - @Composableコンポーネントに基づいてKoinモジュールをロード/アンロード
- `rememberKoinScope` - @Composableコンポーネントに基づいてKoinスコープをロード/アンロード
- `KoinScope` - すべての下層のComposable子孫のためにKoinスコープをロード

### Deprecation ⚠️

以下のAPIは非推奨となり、もはや使用すべきではありません。

- `koin-test`
    - `checkModules`のすべてのAPI。`Verify` APIに移行してください。

- `koin-android`
    - `koin-core`の新しい一元化されたDSLを優先するViewModel DSL
    - すべての状態ViewModel APIはエラーレベルで非推奨です。
        - `stateViewModel()`、`getStateViewModel()` は、代わりに`viewModel()`を使用してください。
        - `getSharedStateViewModel()`、`sharedStateViewModel()` は、代わりに`viewModel()`または共有インスタンスには`activityViewModel()`を使用してください。

`koin-compose`
- 古いCompose API関数はエラーレベルで非推奨です。
    - 関数`inject()`は`koinInject()`を優先して非推奨（エラーレベル）となりました。
    - 関数`getViewModel()`は`koinViewModel()`を優先して非推奨（エラーレベル）となりました。
    - 関数`rememberKoinInject()`は`koinInject()`を優先して非推奨（エラーレベル）となりました。

- `koin-compose-viewmodel`
    - `koin-core`の新しい一元化されたDSLを優先するViewModel DSL
    - 関数`koinNavViewModel`は非推奨となり、`koinViewModel`が推奨されます。

### Breaking 💥

以下のAPIは、前回のマイルストーンでの非推奨化により削除されました。

:::note
`@KoinReflectAPI`でアノテーションされたすべてのAPIは削除されました。
:::

`koin-core`
- `ApplicationAlreadyStartedException` は `KoinApplicationAlreadyStartedException` に名称変更されました。
- `KoinScopeComponent.closeScope()` は内部的に使用されなくなったため削除されました。
- 内部の`ResolutionContext` が `InstanceContext` を置き換えるために移動されました。
- `KoinPlatformTimeTools`、`Timer`、`measureDuration` は削除され、代わりにKotlin Time APIを使用するようになりました。
- `KoinContextHandler` は `GlobalContext` を優先して削除されました。

`koin-android`
- 関数`fun Fragment.createScope()` は削除されました。
- ViewModelファクトリに関するすべてのAPI（主に内部的なもの）は、新しい内部構造のために再構築されました。

`koin-compose`
- 内部的に使用されなくなったため、`StableParametersDefinition` は削除されました。
- すべてのLazy ViewModel API（古い`viewModel()`）は削除されました。
- 内部的に使用されなくなったため、`rememberStableParametersDefinition()` は削除されました。

## 3.5.6

:::note
Kotlin `1.9.22` を使用
:::

使用されているすべてのライブラリバージョンは [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) にあります。

### New 🎉

`koin-core`
- `KoinContext` に以下の機能が追加されました。
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 関数は現在、複数の形式で使用可能です。
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- 宣言スタイルを開くのに役立つ`KoinAppDeclaration`
- JS向けAPI Timeを使用するための`KoinPlatformTimeTools`
- iOS - Touchlab Lockable APIを使用するための`synchronized` API

`koin-androidx-compose`
- Android環境から現在のKoinコンテキストにバインドするための新しい`KoinAndroidContext`

`koin-compose`
- 現在のデフォルトコンテキストで新しい`KoinContext` コンテキストを起動

`koin-ktor`
- 現在、Ktorインスタンスに隔離されたコンテキストを使用します（デフォルトコンテキストの代わりに`Application.getKoin()`を使用）。
- Koinプラグインに新しいモニタリング機能が導入されました。
- Ktorリクエストにスコープインスタンスを許可する`RequestScope`

### Experimental 🚧

`koin-android`
- `ViewModelScope` はViewModelスコープ向けの実験的なAPIを導入します。

`koin-core-coroutines` - バックグラウンドでモジュールをロードするための新しいAPIを導入

### Deprecation ⚠️

`koin-android`
- `getLazyViewModelForClass()` APIは非常に複雑であり、デフォルトのグローバルコンテキストを呼び出します。Android/Fragment APIにこだわることをお勧めします。
- `resolveViewModelCompat()` は `resolveViewModel()` を優先して非推奨となりました。

`koin-compose`
- 関数`get()` と `inject()` は `koinInject()` を優先して非推奨となりました。
- 関数`getViewModel()` は `koinViewModel()` を優先して非推奨となりました。
- 関数`rememberKoinInject()` は `koinInject()` を優先して非推奨となりました。

### Breaking 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` は `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)` を置き換えます。
- プロパティ`KoinExtension.koin` は関数`KoinExtension.onRegister()` に移動されました。
- iOS - `internal fun globalContextByMemoryModel(): KoinContext` は `MutableGlobalContext` を使用するようになりました。

`koin-compose`
- 関数`KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` は `KoinContext` および `KoinAndroidContext` を優先して削除されました。

## 3.4.3

:::note
Kotlin `1.8.21` を使用
:::

### New 🎉

`koin-core`
- Koinのエクステンションエンジンを記述するのに役立つ新しいExtensionManager API - `ExtensionManager` + `KoinExtension`
- `parameterArrayOf` と `parameterSetOf` を用いたParameters APIの更新

`koin-test`
- `Verification` API - モジュールに対して`verify`を実行するのに役立ちます。

`koin-android`
- ViewModelインジェクションのための内部実装
- `AndroidScopeComponent.onCloseScope()` 関数コールバックを追加

`koin-android-test`
- `Verification` API - モジュールに対して`androidVerify()`を実行するのに役立ちます。

`koin-androidx-compose`
- 新しい`get()`
- 新しい`getViewModel()`
- 新しいスコープ`KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - ナビゲーション用の新しいモジュール
- 新しい`koinNavViewModel()`

`koin-compose` - Compose向けの新しいマルチプラットフォームAPI
- `koinInject`、`rememberKoinInject`
- `KoinApplication`

### Experimental 🚧

`koin-compose` - Compose向けの新しい実験的なマルチプラットフォームAPI
- `rememberKoinModules`
- `KoinScope`、`rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- `get()` 関数は、Lazy関数を避けつつ`inject()` の使用を置き換えるもの
- `getViewModel()` 関数は、Lazy関数を避けつつ`viewModel()` 関数を置き換えるもの

### Breaking 💥

`koin-android`
- `LifecycleScopeDelegate` は削除されました。

`koin-androidx-compose`
- `getStateViewModel` は `koinViewModel` を優先して削除されました。