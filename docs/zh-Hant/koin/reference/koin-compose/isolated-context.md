---
title: 隔離上下文
---

# Compose 中的隔離上下文

Koin 的隔離上下文 (Isolated Context) 允許您執行一個獨立的 Koin 執行個體，該執行個體不會干擾宿主應用程式 (host application) 的 Koin 配置。這對於 SDK、程式庫和白牌 (white-label) 應用程式至關重要。

## 使用案例

- **SDK 開發**：您的 SDK 擁有自己的相依性，且不會影響到宿主應用程式。
- **白牌應用程式**：具有不同配置的多個應用程式變體。
- **測試**：隔離的測試配置。
- **功能模組**：帶有自有 DI 的自包含功能模組。

## 建立隔離上下文

### 定義上下文持有者

建立一個物件來持有您的隔離 Koin 執行個體：

```kotlin
object MySDKKoinContext {
    val koinApp = koinApplication {
        // 您的 SDK 模組
        modules(
            sdkCoreModule,
            sdkNetworkModule,
            sdkRepositoryModule
        )
    }

    // 便利存取子
    val koin: Koin get() = koinApp.koin
}
```

### SDK 模組範例

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

## 在 Compose 中使用

### KoinIsolatedContext

使用 `KoinIsolatedContext` 包裝您 SDK 的 Compose UI：

```kotlin
@Composable
fun MySDKScreen() {
    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // 所有 Koin API 都會使用隔離上下文
        SDKContent()
    }
}

@Composable
private fun SDKContent() {
    // 這些會從隔離上下文中解析
    val config = koinInject<SDKConfiguration>()
    val viewModel = koinViewModel<SDKViewModel>()

    Column {
        Text("SDK Version: ${config.version}")
        SDKFeatureScreen(viewModel)
    }
}
```

### 巢狀上下文

您可以巢狀隔離上下文：

```kotlin
@Composable
fun HostApp() {
    // 宿主應用程式的 Koin 上下文 (來自 startKoin)
    val hostService = koinInject<HostService>()

    Column {
        Text("Host App")

        // SDK 使用其自有的隔離上下文
        KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
            MySDKScreen()
        }

        // 回到宿主上下文
        AnotherHostScreen()
    }
}
```

## 生命週期管理

### 手動初始化

在需要時初始化您的 SDK 上下文：

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

### 搭配手動生命週期使用

```kotlin
// 宿主應用程式初始化 SDK
class HostApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // 宿主應用程式的 Koin
        startKoin {
            androidContext(this@HostApplication)
            modules(hostAppModule)
        }

        // SDK 的隔離 Koin
        MySDK.initialize(SDKConfig(apiKey = "xxx"))
    }

    override fun onTerminate() {
        super.onTerminate()
        MySDK.shutdown()
    }
}

// 在 Compose 中
@Composable
fun SDKFeature() {
    KoinIsolatedContext(context = MySDK.koinContext) {
        SDKScreen()
    }
}
```

## 存取兩個上下文

有時您需要同時存取宿主和 SDK 的相依性：

```kotlin
@Composable
fun BridgeScreen() {
    // 從宿主上下文取得 (在 KoinIsolatedContext 之外)
    val hostAnalytics = koinInject<HostAnalytics>()

    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // 從 SDK 上下文取得 (在 KoinIsolatedContext 之內)
        val sdkService = koinInject<SDKService>()

        // 同時使用兩者
        SDKFeature(
            service = sdkService,
            onEvent = { hostAnalytics.track(it) }
        )
    }
}
```

## 完整的 SDK 範例

```kotlin
// SDK 公開 API
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

// SDK 內部模組
private val paymentCoreModule = module {
    single<PaymentProcessor>()
    single<PaymentValidator>()
}

private val paymentUIModule = module {
    viewModel<PaymentViewModel>()
}

// SDK 內部 UI
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

// 宿主應用程式使用方式
@Composable
fun CheckoutScreen() {
    var showPayment by remember { mutableStateOf(false) }

    if (showPayment) {
        PaymentSDK.PaymentScreen(
            amount = 99.99,
            onSuccess = { result ->
                showPayment = false
                // 處理成功
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

## 最佳實務

1.  **提早初始化**：在 Compose 渲染之前設定好隔離上下文。
2.  **清理資源**：完成後在 `KoinApplication` 上呼叫 `close()`。
3.  **不要共用執行個體**：保持 SDK 和宿主相依性相互分離。
4.  **使用介面邊界**：透過回呼 (callback) 或介面進行通訊，而非共用 Koin 執行個體。
5.  **記錄初始化文件**：向宿主應用程式開發人員清楚說明 SDK 的設定需求。

## 下一步

- **[Compose 概覽](/docs/reference/koin-compose/compose)** – 基本 Compose 設定
- **[上下文隔離](/docs/reference/koin-core/context-isolation)** – 核心隔離概念
- **[作用域](/docs/reference/koin-compose/compose-scopes)** – Compose 中的作用域管理