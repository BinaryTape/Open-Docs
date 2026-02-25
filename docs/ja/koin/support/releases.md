---
title: リリースおよび API アップグレードガイド
custom_edit_url: null
---

:::info
このページでは、Koin の各メインリリースの包括的な概要を提供し、フレームワークの進化を詳しく説明することで、アップグレードの計画や互換性の維持を支援します。
:::

各バージョンについて、ドキュメントは以下のセクションで構成されています：

- `Kotlin`: リリースで使用されている Kotlin のバージョンを指定し、言語の互換性を明確にするとともに、最新の Kotlin 機能を利用できるようにします。
- `New`: 機能性や開発者体験を向上させる、新しく導入された機能や改善点を紹介します。
- `Experimental`: 実験的（experimental）としてマークされた API や機能のリストです。これらは活発に開発中であり、コミュニティのフィードバックに基づいて変更される可能性があります。
- `Deprecated`: 非推奨（deprecated）としてマークされた API や機能、および推奨される代替案を特定し、将来の削除に備えるためのガイドを提供します。
- `Breaking`: 後方互換性を損なう可能性のある変更の詳細を説明し、移行中に必要な調整を把握できるようにします。

この構造化されたアプローチは、各リリースの段階的な変更を明確にするだけでなく、Koin プロジェクトにおける透明性、安定性、および継続的な改善への取り組みを強化するものです。

詳細は [API の安定性に関する規約](api-stability.md) を参照してください。

## 4.1.1

:::note
Kotlin `2.1.21` を使用
:::

### New 🎉

`koin-compose-viewmodel-navigation`
- Compose Navigation のサポートを向上させるため、オプションの `navGraphRoute` パラメータを備えた `sharedKoinViewModel` を強化しました。

`koin-core`
- コア・リゾルバーのパフォーマンス最適化 - シングル・スコープ解決時の不要なフラット化を回避。
- リンクされたスコープ ID の表示による、スコープ・デバッグの強化。

### Library Updates 📚

- **Kotlin** 2.1.21 (2.1.20 から更新)
- **Ktor** 3.2.3 (3.1.3 から更新) 
- **Jetbrains Compose** 1.8.2 (1.8.0 から更新)
- **AndroidX**: Fragment 1.8.9, WorkManager 2.10.3, Lifecycle 2.9.3, Navigation 2.9.3
- **Testing**: Robolectric 4.15.1, Benchmark 0.4.14
- **Build**: Binary Validator 0.18.1, NMCP 1.1.0

### Bug Fixes 🐛

`koin-core`
- 互換性エラーの原因となっていたロガーの制約を元に戻しました。
- `LocalKoinApplication`/`LocalKoinScope` のコンテキスト・ハンドリングの改善により、Compose のスコープ解決を修正しました。

`koin-build`
- Maven Central への公開に関する問題を修正しました。

## 4.1.0

:::note
Kotlin `2.1.20` を使用
:::

### New 🎉

`koin-core`
- Configuration - 設定をラップしやすくするための `KoinConfiguration` API。
- Scope - スコープのカテゴリに対する専用のスコープ・タイプ修飾子（qualifier）である、新しい *Scope Archetype*（スコープ・アーキタイプ）を導入。インスタンスの解決がスコープ・カテゴリ（別名アーキタイプ）に対して行えるようになりました。
- Feature Option - Koin 内部の新しい機能の振る舞いを機能フラグ（feature flag）で制御するための「Feature Option」。Koin 設定の `options` ブロックでオプションを有効にできます：
```kotlin
startKoin {
    options(
        // 新しい機能を有効化
        viewModelScopeFactory()
    )
}
```
- Core - `ResolutionExtension` によって Koin が外部システムやリソースで解決を行うことを可能にする新しい `CoreResolver` を導入（Ktor DI の連携などに使用されています）。

`koin-android`
- アップグレードされたライブラリ (`androidx.appcompat:appcompat:1.7.0`, `androidx.activity:activity-ktx:1.10.1`) により、Min SDK レベルを 14 から 21 に引き上げる必要があります。
- DSL - Activity/Fragment 内でスコープを宣言するための新しい Koin モジュール DSL 拡張 `activityScope`、`activityRetainedScope`、および `fragmentScope` を追加しました。
- Scope Functions - `activityScope()`、`activityRetainedScope()` および `fragmentScope()` API 関数も Scope Archetype をトリガーするようになりました。

`koin-androidx-compose`
- Koin Compose Multiplatform およびすべての Compose 1.8 & Lifecycle 2.9 と整合性を合わせました。

`koin-compose`
- Compose 1.8 & Lifecycle 2.9 と整合性を合わせました。
- New Function - Android Studio および IntelliJ での並列プレビューのレンダリングを支援する `KoinApplicationPreview`。

`koin-compose-viewmodel`
- 親 Activity をホストとして設定できるようにする `koinActivityViewModel` を追加しました。

`koin-ktor`
- Multiplatform - このモジュールは Kotlin KMP フォーマットでコンパイルされるようになりました。マルチプラットフォーム・プロジェクトから `koin-ktor` をターゲットにできます。
- Merge - 以前の `koin-ktor3` モジュールは `koin-ktor` に統合されました。
- Extension - Ktor モジュールに直接結合された Koin モジュールを宣言できるようにする `Application.koinModule { }` および `Application.koinModules()` を導入しました。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- Scope - `Module.requestScope` - Ktor リクエスト・スコープ内での定義の宣言を可能にします（`scope<RequestScope>` を手動で宣言する手間を省けます）。
注入されたスコープは、コンストラクタで `ApplicationCall` を注入することも可能です。

`koin-core-coroutines`
- Module DSL - モジュールの設定を一つの構造にまとめ、後で検証しやすくするための新しい `ModuleConfiguration` を導入しました。
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
- Configuration DSL - Koin の設定で `ModuleConfiguration` を使用してモジュールをロードできるようになりました：
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// または以下のように記述
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- コルーチン関連の新しいテスト API を導入するため、新しい `koin-test-coroutines` モジュールを追加しました。
- Extension - `moduleConfiguration` で Koin の設定をチェックし、通常のモジュールと Lazy モジュールの混合設定を検証できるように Verify API を拡張しました：
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// Android の型が必要な場合 (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- Annotations - プロパティを注入されたパラメータ（injected parameter）または動的に提供されるもの（dynamically provided）としてタグ付けするための `@InjectedParam` または `@Provided`。現在は `Verify` API で使用されていますが、将来的に軽量な DSL 宣言を支援するために使用される可能性があります。

### Experimental 🚧

`koin-core`
- Wasm - Kotlin 2.1.20 の UUID 生成を利用。

`koin-core-viewmodel`
- DSL - ViewModel スコープ・アーキタイプにスコープされたコンポーネントを宣言するためのモジュール DSL 拡張 `viewModelScope` を追加しました。
- Scope Function - ViewModel のスコープを作成するための関数 `viewModelScope()` を追加しました（ViewModel クラスに関連付けられます）。この API は現在、`AutoCloseable` API を使用してスコープの宣言とクローズを支援する `ViewModelScopeAutoCloseable` を使用しています。手動で ViewModel スコープをクローズする必要はもうありません。
- Class - ViewModel スコープのクラス（スコープの作成とクローズを処理）をすぐに使用できるように `ScopeViewModel` クラスを更新しました。
- Feature Option - ViewModel のスコープを使用したコンストラクタ ViewModel 注入。Koin オプションの `viewModelScopeFactory` を有効にする必要があります：
```kotlin
startKoin {
    options(
        // 新しい ViewModel スコープの作成を有効化
        viewModelScopeFactory()
    )
}

// MyScopeViewModel のスコープから Session を注入します
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose Function - マルチプラットフォーム Compose のエントリポイントを提案するための新しい `KoinMultiplatformApplication` 関数を追加しました。

`koin-core-viewmodel-navigation`
- Navigation Extension - ナビゲーションの `NavBackStackEntry` から ViewModel インスタンスを再利用するための `sharedViewModel` を追加しました。

`koin-test`
- Annotations - Koin 設定検証 API である `Verify` が、nullable、lazy、および list パラメータのチェックを支援するようになりました。注入されたパラメータまたは動的に提供されるものとしてプロパティをタグ付けするには、`@InjectedParam` または `@Provided` を使用してください。これにより、Verify API での複雑な宣言を回避できます。
```kotlin
// Verify で検出されるようになります
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### Deprecation ⚠️

`koin-android`
- `ScopeViewModel` は非推奨となり、代わりに `koin-core-viewmodel` の `ScopeViewModel` クラスを使用してください。

`koin-compose`
- Koin コンテキストは現在のデフォルト・コンテキスト上で適切に準備されるようになったため、Compose コンテキスト API は不要になりました。以下のものは非推奨であり、削除可能です：`KoinContext`

`koin-androidx-compose`
- Koin コンテキストは現在のデフォルト・コンテキスト上で適切に準備されるようになったため、Jetpack Compose コンテキスト API は不要になりました。以下のものは非推奨であり、削除可能です：`KoinAndroidContext`

`koin-androidx-compose-navigation`
- lifecycle ライブラリのアップデートにより、`koinNavViewModel` 関数は不要になりました。`koinViewModel` で代用可能です。

`koin-core-viewmodel-navigation`
- lifecycle ライブラリのアップデートにより、`koinNavViewModel` 関数は不要になりました。`koinViewModel` で代用可能です。

`koin-ktor`
- Extension - `Application.koin` は非推奨となり、`Application.koinModules` および `Application.koinModule` が推奨されます。

### Breaking 💥

`koin-android`
- すべての状態（state）保持に関連する古い ViewModel API が削除されました：
    - `stateViewModel()`、`getStateViewModel()`。代わりに `viewModel()` を使用してください。
    - `getSharedStateViewModel()`、`sharedStateViewModel()`。共有インスタンスには代わりに `viewModel()` または `activityViewModel()` を使用してください。

`koin-compose`
- 古い Compose API 関数が削除されました：
    - 関数 `inject()` は削除されました。代わりに `koinInject()` を使用してください。
    - 関数 `getViewModel()` は削除されました。代わりに `koinViewModel()` を使用してください。
    - 関数 `rememberKoinInject()` は `koinInject()` に統合されました。
- 関数 `rememberKoinApplication` は `@KoinInternalAPI` としてマークされました。

## 4.0.4

:::note
Kotlin `2.0.21` を使用
:::

使用されているすべてのライブラリのバージョンは [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) に記載されています。

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - Kotlin のこの新しいバージョンでは、新しい `kotlin.uuid.uuid` API の恩恵を受けられます。Koin の `KoinPlatformTools.generateId()` 関数は、プラットフォームを越えて本物の UUID を生成するために、この新しい API を使用するようになりました。

`koin-viewmodel`
- Koin 4.0 では、Google/Jetbrains の KMP API を共通化した ViewModel DSL & API を導入しました。コードベース内での重複を避けるため、ViewModel API は現在 `koin-core-viewmodel` および `koin-core-viewmodel-navigation` プロジェクトに配置されています。
- ViewModel DSL のインポートは `org.koin.core.module.dsl.*` です。

以下のプロジェクト内の API が安定版（stable）になりました。

`koin-core-coroutines` - すべての API が安定版になりました
- すべての `lazyModules`
- `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
- `waitAllStartJobs`, `runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - `Verify` API 用の動的パラメータ注入を設計するための新しい API。

`koin-androidx-startup`
- `koin-androidx-startup` - `androidx.startup.Initializer` API を使用して `AndroidX Startup` で Koin を開始する新しい機能。`koin-androidx-startup` 内のすべての API は実験的です。

`koin-compose`
- `rememberKoinModules` - @Composable コンポーネントに応じて Koin モジュールをロード/アンロード。
- `rememberKoinScope` - @Composable コンポーネントに応じて Koin スコープをロード/アンロード。
- `KoinScope` - 基になるすべての Composable 子要素に対して Koin スコープをロード。

### Deprecation ⚠️

以下の API は非推奨となり、今後は使用しないでください：

- `koin-test`
    - `checkModules` 用のすべての API。`Verify` API に移行してください。

- `koin-android`
    - koin-core の新しい集中型 DSL が推奨されるため、ViewModel DSL は非推奨。
    - すべての状態（state）ViewModel API はエラーレベルで非推奨です：
        - `stateViewModel()`、`getStateViewModel()`。代わりに `viewModel()` を使用してください。
        - `getSharedStateViewModel()`、`sharedStateViewModel()`。共有インスタンスには代わりに `viewModel()` または `activityViewModel()` を使用してください。

`koin-compose`
- 古い Compose API 関数はエラーレベルで非推奨です：
    - 関数 `inject()` はエラーレベルで非推奨。代わりに `koinInject()` を使用してください。
    - 関数 `getViewModel()` はエラーレベルで非推奨。代わりに `koinViewModel()` を使用してください。
    - 関数 `rememberKoinInject()` はエラーレベルで非推奨。代わりに `koinInject()` を使用してください。

- `koin-compose-viewmodel`
    - koin-core の新しい集中型 DSL が推奨されるため、ViewModel DSL は非推奨。
    - 関数 `koinNavViewModel` は非推奨となり、代わりに `koinViewModel` を使用してください。

### Breaking 💥

前回のマイルストーンでの非推奨により、以下の API は削除されました：

:::note
`@KoinReflectAPI` アノテーションが付いたすべての API は削除されました。
:::

`koin-core`
- `ApplicationAlreadyStartedException` は `KoinApplicationAlreadyStartedException` に名称変更されました。
- `KoinScopeComponent.closeScope()` は内部で不要になったため削除されました。
- 内部の `ResolutionContext` が `InstanceContext` を置き換えるように移動されました。
- `KoinPlatformTimeTools`、`Timer`、`measureDuration` は削除され、代わりに Kotlin Time API を使用するようになりました。
- `KoinContextHandler` は `GlobalContext` に置き換えられ削除されました。

`koin-android`
- 関数 `fun Fragment.createScope()` は削除されました。
- ViewModel ファクトリ周りのすべての API（主に内部的なもの）が新しい内部構造のために刷新されました。

`koin-compose`
- 内部で使用されなくなったため `StableParametersDefinition` を削除しました。
- すべての Lazy ViewModel API（古い `viewModel()`）を削除しました。
- 内部で使用されなくなったため `rememberStableParametersDefinition()` を削除しました。

## 3.5.6

:::note
Kotlin `1.9.22` を使用
:::

使用されているすべてのライブラリのバージョンは [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) に記載されています。

### New 🎉

`koin-core`
- `KoinContext` に以下が追加されました：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 関数はいくつかの形式をサポートするようになりました：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- 宣言スタイルを広げるための `KoinAppDeclaration`。
- JS 用に Time API を使用するための `KoinPlatformTimeTools`。
- iOS - Touchlab Lockable API を使用するための `synchronized` API。

`koin-androidx-compose`
- Android 環境から現在の Koin コンテキストにバインドするための新しい `KoinAndroidContext`。

`koin-compose`
- 現在のデフォルト・コンテキストでコンテキストを開始するための新しい `KoinContext`。

`koin-ktor`
- Ktor インスタンスに隔離されたコンテキストを使用するようになりました（デフォルトのコンテキストの代わりに `Application.getKoin()` を使用）。
- Koin プラグインに新しいモニタリングを導入しました。
- スコープ・インスタンスを Ktor リクエストに紐付けるための `RequestScope`。

### Experimental 🚧

`koin-android`
- `ViewModelScope` - ViewModel スコープ用の実験的な API を導入。

`koin-core-coroutines` - バックグラウンドでモジュールをロードするための新しい API を導入。

### Deprecation ⚠️

`koin-android`
- `getLazyViewModelForClass()` API は非常に複雑で、デフォルトのグローバル・コンテキストを呼び出します。Android/Fragment API を優先してください。
- `resolveViewModelCompat()` は非推奨となり、代わりに `resolveViewModel()` を使用してください。

`koin-compose`
- 関数 `get()` および `inject()` は非推奨となり、代わりに `koinInject()` を使用してください。
- 関数 `getViewModel()` は非推奨となり、代わりに `koinViewModel()` を使用してください。
- 関数 `rememberKoinInject()` は非推奨となり、`koinInject()` が推奨されます。

### Breaking 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` が `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)` を置き換えました。
- プロパティ `KoinExtension.koin` を関数 `KoinExtension.onRegister()` に移動しました。
- iOS - `MutableGlobalContext` を使用するために `internal fun globalContextByMemoryModel(): KoinContext` に変更。

`koin-compose`
- 関数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` は `KoinContext` および `KoinAndroidContext` に置き換えられ、削除されました。

## 3.4.3

:::note
Kotlin `1.8.21` を使用
:::

### New 🎉

`koin-core`
- Koin の拡張エンジンを記述するための新しい ExtensionManager API - `ExtensionManager` + `KoinExtension`
- `parameterArrayOf` および `parameterSetOf` による Parameters API のアップデート。

`koin-test`
- `Verification` API - モジュールに対して `verify` を実行できるようにしました。

`koin-android`
- ViewModel 注入のための内部構造。
- `AndroidScopeComponent.onCloseScope()` 関数コールバックの追加。

`koin-android-test`
- `Verification` API - モジュールに対して `androidVerify()` を実行できるようにしました。

`koin-androidx-compose`
- 新しい `get()`
- 新しい `getViewModel()`
- 新しいスコープ `KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - ナビゲーション用の新しいモジュール
- 新しい `koinNavViewModel()`

`koin-compose` - Compose 用の新しいマルチプラットフォーム API
- `koinInject`、`rememberKoinInject`
- `KoinApplication`

### Experimental 🚧

`koin-compose` - Compose 用の新しい実験的なマルチプラットフォーム API
- `rememberKoinModules`
- `KoinScope`、`rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- Lazy 関数の使用を避けるため、`inject()` の代わりに `get()` 関数を使用してください。
- Lazy 関数の使用を避けるため、`viewModel()` の代わりに `getViewModel()` 関数を使用してください。

### Breaking 💥

`koin-android`
- `LifecycleScopeDelegate` が削除されました。

`koin-androidx-compose`
- `getStateViewModel` を削除し、`koinViewModel` が推奨されます。