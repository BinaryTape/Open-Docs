---
title: 隔離されたコンテキスト
---

# Composeにおける隔離されたコンテキスト

Koinの隔離されたコンテキスト（isolated context）を使用すると、ホストアプリケーションのKoin設定に干渉することなく、別のKoinインスタンスを実行できます。これは、SDK、ライブラリ、およびホワイトラベルアプリケーションにとって不可欠です。

## ユースケース

- **SDK開発** - ホストアプリに影響を与えずに、SDK独自の依存関係を持たせることができます。
- **ホワイトラベルアプリ** - 構成の異なる複数のアプリバリアントを扱えます。
- **テスト** - 隔離されたテスト設定を利用できます。
- **機能モジュール** - 独自のDIを備えた自己完結型の機能モジュールを構築できます。

## 隔離されたコンテキストの作成

### コンテキストホルダーの定義

隔離されたKoinインスタンスを保持するためのオブジェクトを作成します：

```kotlin
object MySDKKoinContext {
    val koinApp = koinApplication {
        // SDKのモジュール
        modules(
            sdkCoreModule,
            sdkNetworkModule,
            sdkRepositoryModule
        )
    }

    // 便利なアクセサ
    val koin: Koin get() = koinApp.koin
}
```

### SDKモジュールの例

```kotlin
val sdkCoreModule = module {
    single<SDKConfiguration>()
    single<SDKLogger>()
}

val sdkNetworkModule = module {
    single<SDKApiClient>()
    single<SDKAuthManager>()
}

val sdkRepositoryModule = module {
    single<SDKDataRepository>()
}
```

## Composeでの使用

### KoinIsolatedContext

SDKのCompose UIを `KoinIsolatedContext` でラップします：

```kotlin
@Composable
fun MySDKScreen() {
    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // すべてのKoin APIは隔離されたコンテキストを使用します
        SDKContent()
    }
}

@Composable
private fun SDKContent() {
    // これらは隔離されたコンテキストから解決されます
    val config = koinInject<SDKConfiguration>()
    val viewModel = koinViewModel<SDKViewModel>()

    Column {
        Text("SDK Version: ${config.version}")
        SDKFeatureScreen(viewModel)
    }
}
```

### ネストされたコンテキスト

隔離されたコンテキストを入れ子にすることができます：

```kotlin
@Composable
fun HostApp() {
    // ホストアプリのKoinコンテキスト（startKoinから）
    val hostService = koinInject<HostService>()

    Column {
        Text("Host App")

        // SDKは独自の隔離されたコンテキストを使用
        KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
            MySDKScreen()
        }

        // ホストコンテキストに戻る
        AnotherHostScreen()
    }
}
```

## ライフサイクル管理

### 手動初期化

必要に応じてSDKコンテキストを初期化します：

```kotlin
object MySDK {
    private var _koinContext: KoinApplication? = null
    val koinContext: KoinApplication
        get() = _koinContext ?: error("SDK not initialized")

    fun initialize(config: SDKConfig) {
        _koinContext = koinApplication {
            modules(
                module {
                    single { config }
                },
                sdkCoreModule,
                sdkNetworkModule
            )
        }
    }

    fun shutdown() {
        _koinContext?.close()
        _koinContext = null
    }
}
```

### 手動ライフサイクルでの使用

```kotlin
// ホストアプリがSDKを初期化
class HostApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // ホストアプリのKoin
        startKoin {
            androidContext(this@HostApplication)
            modules(hostAppModule)
        }

        // SDKの隔離されたKoin
        MySDK.initialize(SDKConfig(apiKey = "xxx"))
    }

    override fun onTerminate() {
        super.onTerminate()
        MySDK.shutdown()
    }
}

// Compose内
@Composable
fun SDKFeature() {
    KoinIsolatedContext(context = MySDK.koinContext) {
        SDKScreen()
    }
}
```

## 両方のコンテキストへのアクセス

ホストとSDKの両方の依存関係にアクセスする必要がある場合があります：

```kotlin
@Composable
fun BridgeScreen() {
    // ホストコンテキストから取得（KoinIsolatedContextの外側）
    val hostAnalytics = koinInject<HostAnalytics>()

    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // SDKコンテキストから取得（KoinIsolatedContextの内側）
        val sdkService = koinInject<SDKService>()

        // 両方を使用
        SDKFeature(
            service = sdkService,
            onEvent = { hostAnalytics.track(it) }
        )
    }
}
```

## SDKの完全な例

```kotlin
// SDKのパブリックAPI
object PaymentSDK {
    private lateinit var koinApp: KoinApplication

    fun initialize(config: PaymentConfig) {
        koinApp = koinApplication {
            modules(
                module { single { config } },
                paymentCoreModule,
                paymentUIModule
            )
        }
    }

    @Composable
    fun PaymentScreen(
        amount: Double,
        onSuccess: (PaymentResult) -> Unit,
        onCancel: () -> Unit
    ) {
        KoinIsolatedContext(context = koinApp) {
            PaymentFlow(
                amount = amount,
                onSuccess = onSuccess,
                onCancel = onCancel
            )
        }
    }
}

// SDKの内部モジュール
private val paymentCoreModule = module {
    single<PaymentProcessor>()
    single<PaymentValidator>()
}

private val paymentUIModule = module {
    viewModel<PaymentViewModel>()
}

// SDKの内部UI
@Composable
private fun PaymentFlow(
    amount: Double,
    onSuccess: (PaymentResult) -> Unit,
    onCancel: () -> Unit
) {
    val viewModel = koinViewModel<PaymentViewModel>()

    PaymentUI(
        amount = amount,
        state = viewModel.state,
        onPay = { viewModel.processPayment(amount, onSuccess) },
        onCancel = onCancel
    )
}

// ホストアプリでの使用
@Composable
fun CheckoutScreen() {
    var showPayment by remember { mutableStateOf(false) }

    if (showPayment) {
        PaymentSDK.PaymentScreen(
            amount = 99.99,
            onSuccess = { result ->
                showPayment = false
                // 成功時の処理
            },
            onCancel = { showPayment = false }
        )
    } else {
        Button(onClick = { showPayment = true }) {
            Text("Pay Now")
        }
    }
}
```

## ベストプラクティス

1. **早期に初期化する** - Composeがレンダリングされる前に、隔離されたコンテキストをセットアップします。

2. **リソースをクリーンアップする** - 終了時に `KoinApplication` の `close()` を呼び出します。

3. **インスタンスを共有しない** - SDKとホストの依存関係を分離したままにします。

4. **インターフェース境界を使用する** - 共有されたKoinインスタンスではなく、コールバックまたはインターフェースを介して通信します。

5. **初期化をドキュメント化する** - ホストアプリの開発者に対して、SDKのセットアップ要件を明確にします。

## 次のステップ

- **[Composeの概要](/docs/reference/koin-compose/compose)** - 基本的なComposeのセットアップ
- **[コンテキストの隔離](/docs/reference/koin-core/context-isolation)** - 隔離のコア概念
- **[スコープ](/docs/reference/koin-compose/compose-scopes)** - Composeにおけるスコープ管理