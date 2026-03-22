---
title: 隔离上下文
---

# Compose 中的隔离上下文

Koin 的隔离上下文允许你运行一个独立的 Koin 实例，它不会干扰宿主应用程序的 Koin 配置。这对于 SDK、库和白标应用至关重要。

## 使用场景

- **SDK 开发** - 你的 SDK 拥有自己的依赖项，且不会影响宿主应用。
- **白标应用** - 具有不同配置的多个应用变体。
- **测试** - 隔离的测试配置。
- **功能模块** - 带有其自身 DI 的独立功能模块。

## 创建一个隔离上下文

### 定义上下文持有者

创建一个对象来持有你的隔离 Koin 实例：

```kotlin
object MySDKKoinContext {
    val koinApp = koinApplication {
        // 你的 SDK 模块
        modules(
            sdkCoreModule,
            sdkNetworkModule,
            sdkRepositoryModule
        )
    }

    // 便捷访问器
    val koin: Koin get() = koinApp.koin
}
```

### SDK 模块示例

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

用 `KoinIsolatedContext` 包装你 SDK 的 Compose UI：

```kotlin
@Composable
fun MySDKScreen() {
    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // 所有 Koin API 都使用该隔离上下文
        SDKContent()
    }
}

@Composable
private fun SDKContent() {
    // 这些从隔离上下文中解析
    val config = koinInject<SDKConfiguration>()
    val viewModel = koinViewModel<SDKViewModel>()

    Column {
        Text("SDK Version: ${config.version}")
        SDKFeatureScreen(viewModel)
    }
}
```

### 嵌套上下文

你可以嵌套隔离上下文：

```kotlin
@Composable
fun HostApp() {
    // 宿主应用的 Koin 上下文（来自 startKoin）
    val hostService = koinInject<HostService>()

    Column {
        Text("Host App")

        // SDK 使用其自身的隔离上下文
        KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
            MySDKScreen()
        }

        // 返回宿主上下文
        AnotherHostScreen()
    }
}
```

## 生命周期管理

### 手动初始化

在需要时初始化你的 SDK 上下文：

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

### 结合手动生命周期使用

```kotlin
// 宿主应用初始化 SDK
class HostApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // 宿主应用的 Koin
        startKoin {
            androidContext(this@HostApplication)
            modules(hostAppModule)
        }

        // SDK 的隔离 Koin
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

## 同时访问两个上下文

有时你需要同时访问宿主和 SDK 的依赖项：

```kotlin
@Composable
fun BridgeScreen() {
    // 从宿主上下文获取（在 KoinIsolatedContext 之外）
    val hostAnalytics = koinInject<HostAnalytics>()

    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // 从 SDK 上下文获取（在 KoinIsolatedContext 之内）
        val sdkService = koinInject<SDKService>()

        // 同时使用两者
        SDKFeature(
            service = sdkService,
            onEvent = { hostAnalytics.track(it) }
        )
    }
}
```

## 完整 SDK 示例

```kotlin
// SDK 公共 API
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

// SDK 内部模块
private val paymentCoreModule = module {
    single<PaymentProcessor>()
    single<PaymentValidator>()
}

private val paymentUIModule = module {
    viewModel<PaymentViewModel>()
}

// SDK 内部 UI
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

// 宿主应用用法
@Composable
fun CheckoutScreen() {
    var showPayment by remember { mutableStateOf(false) }

    if (showPayment) {
        PaymentSDK.PaymentScreen(
            amount = 99.99,
            onSuccess = { result ->
                showPayment = false
                // 处理成功
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

## 最佳实践

1. **及早初始化** - 在 Compose 渲染之前设置隔离上下文。

2. **清理资源** - 完成后对 `KoinApplication` 调用 `close()`。

3. **不要共享实例** - 保持 SDK 和宿主依赖项相互独立。

4. **使用接口边界** - 通过回调或接口进行通信，而不是共享 Koin 实例。

5. **记录初始化文档** - 向宿主应用开发者明确 SDK 的设置要求。

## 后续步骤

- **[Compose 概览](/docs/reference/koin-compose/compose)** - 基础 Compose 设置
- **[上下文隔离](/docs/reference/koin-core/context-isolation)** - 核心隔离概念
- **[作用域](/docs/reference/koin-compose/compose-scopes)** - Compose 中的作用域管理