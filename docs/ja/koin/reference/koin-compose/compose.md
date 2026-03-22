---
title: Compose向けのKoin
---

# Compose向けのKoin

Koinは、依存関係を注入するための専用パッケージにより、Jetpack ComposeおよびCompose Multiplatformアプリケーションを完全にサポートしています。

## パッケージの概要

| パッケージ | ユースケース |
|---------|----------|
| `koin-compose` | Compose基本API (マルチプラットフォーム) |
| `koin-compose-viewmodel` | ViewModelの注入 (マルチプラットフォーム) |
| `koin-compose-viewmodel-navigation` | ViewModel + Navigation 2.x |
| `koin-compose-navigation3` | Navigation 3との統合 (マルチプラットフォーム) |
| `koin-androidx-compose` | Android向けの便利なパッケージ (`koin-compose` + `koin-compose-viewmodel` を含む) |

:::info
すべてのCompose APIは `koin-compose` と `koin-compose-viewmodel` で定義されています。`koin-androidx-compose` パッケージは、Androidプロジェクト向けにこれら両方を含む便利なラッパーです。
:::

### どのパッケージを使用すべきか？

**Androidのみのプロジェクトの場合：**
```kotlin
// オプション 1: Android向けの便利なパッケージ (koin-compose + koin-compose-viewmodel を含む)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// オプション 2: マルチプラットフォームパッケージを直接使用する
implementation("io.insert-koin:koin-compose:$koin_version")
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// オプション: Navigationとの統合
implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
```

**Compose Multiplatformプロジェクトの場合：**
```kotlin
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

    // オプション: Navigationとの統合
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

## プラットフォームのサポート

| プラットフォーム | Composeの種類 | ステータス |
|----------|-------------|--------|
| Android | Jetpack Compose | フルサポート |
| iOS | Compose Multiplatform | フルサポート |
| Desktop | Compose Desktop | フルサポート |
| Web | Compose for Web | 実験的 |

## Koinを開始する

### オプション1: startKoin (Androidのみ、または外部セットアップ)

完全に制御するために、Composeの外側でKoinを初期化します。

```kotlin
// Android Applicationクラス
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            androidLogger()
            modules(appModule)
        }
    }
}

// Compose UIは自動的にKoinを使用します
@Composable
fun App() {
    val viewModel = koinViewModel<MyViewModel>()
}
```

**使用場面：** Koinのライフサイクル、カスタム設定、または他のフレームワークとの統合を完全に制御する必要がある場合。

### オプション2: KoinApplication (Composeによる管理)

ComposeにKoinのセットアップを自動的に処理させます。

```kotlin
@Composable
fun App() {
    KoinApplication(configuration = koinConfiguration {
        modules(appModule)
    }) {
        MyScreen()
    }
}
```

**利点：**
- 外部セットアップが不要（Applicationクラスが不要）
- Androidの `Context` が自動的に注入される
- コンポジションのライフサイクルに基づいて開始/停止を処理する
- Androidでの設定変更（configuration changes）を管理する

**使用場面：** 制御を少なくし、最もシンプルなセットアップを行いたい場合。

Androidでは自動的に `androidContext` と `androidLogger` を注入します。

:::note
`KoinMultiplatformApplication` は非推奨（deprecated）です。代わりに `KoinApplication` と `koinConfiguration` を使用してください。
:::

## 基本的な注入

### koinInject() - 依存関係の取得

Koinが管理する任意の依存関係を注入します。

```kotlin
@Composable
fun UserScreen() {
    val repository = koinInject<UserRepository>()
    // repositoryを使用...
}
```

**ベストプラクティス** - デフォルト引数として注入する：

```kotlin
@Composable
fun UserScreen(
    repository: UserRepository = koinInject()
) {
    // Koinなしでテスト可能
}
```

### koinViewModel() - ViewModelの取得

適切なライフサイクル管理でViewModelを注入します。

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    val state by viewModel.state.collectAsState()
}
```

:::info
すべてのViewModel APIについては、[ComposeでのViewModel](/docs/reference/koin-compose/compose-viewmodel) を参照してください。
:::

### パラメータを使用する場合

実行時パラメータを渡します。

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

頻繁な再コンポーズ（recomposition）が発生する場合のパフォーマンス向上のために：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel>(
        parameters = parametersOf(itemId)
    )
}
```

## モジュールの定義

### コンパイラプラグインDSL

```kotlin
val appModule = module {
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### アノテーション

```kotlin
@Singleton
class UserRepository

@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### クラシックDSL

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

## クイックリファレンス

| 関数 | 目的 |
|----------|---------|
| `koinInject<T>()` | 任意の依存関係を注入する |
| `koinViewModel<T>()` | ViewModelを注入する |
| `koinNavViewModel<T>()` | Navigation引数を持つViewModelを注入する |
| `koinActivityViewModel<T>()` | ActivityスコープのViewModelを注入する (Android) |
| `rememberKoinModules()` | コンポジションに合わせてモジュールをロードする |
| `KoinScope {}` | スコープ設定されたコンテキストを作成する |

## ドキュメント

| トピック | 説明 |
|-------|-------------|
| **[ViewModel](/docs/reference/koin-compose/compose-viewmodel)** | すべてのViewModel注入API |
| **[ライフサイクルと状態](/docs/reference/koin-compose/compose-lifecycle)** | 再コンポーズ、状態、サイドエフェクト |
| **[動的モジュール](/docs/reference/koin-compose/compose-modules)** | rememberKoinModules、遅延ロード |
| **[スコープ](/docs/reference/koin-compose/compose-scopes)** | KoinScope, KoinNavigationScope, UnboundKoinScope |
| **[テスト](/docs/reference/koin-compose/compose-testing)** | プレビュー、ユニットテスト |
| **[分離されたコンテキスト](/docs/reference/koin-compose/isolated-context)** | SDKの分離 |
| **[Navigation 3](/docs/reference/koin-compose/navigation3)** | 型安全なナビゲーション (マルチプラットフォーム) |

## 関連

- **[コアViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel宣言DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android固有の機能
- **[KMPセットアップ](/docs/reference/koin-core/kmp-setup)** - マルチプラットフォーム設定