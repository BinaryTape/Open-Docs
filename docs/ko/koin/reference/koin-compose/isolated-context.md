---
title: 격리된 컨텍스트(Isolated Context)
---

# Compose에서의 격리된 컨텍스트

Koin의 격리된 컨텍스트(isolated context)를 사용하면 호스트 애플리케이션의 Koin 구성과 간섭하지 않는 별도의 Koin 인스턴스를 실행할 수 있습니다. 이는 SDK, 라이브러리 및 화이트 라벨(white-label) 애플리케이션 개발에 필수적입니다.

## 사용 사례

- **SDK 개발** - 호스트 앱에 영향을 주지 않고 SDK 자체의 의존성을 가짐
- **화이트 라벨(White-Label) 앱** - 구성이 서로 다른 여러 앱 변형(variant) 처리
- **테스트** - 격리된 테스트 구성
- **기능 모듈(Feature Modules)** - 자체 DI를 가진 독립적인 기능 모듈

## 격리된 컨텍스트 만들기

### 컨텍스트 홀더 정의하기

격리된 Koin 인스턴스를 유지할 객체를 생성합니다.

```kotlin
object MySDKKoinContext {
    val koinApp = koinApplication {
        // SDK 모듈 정의
        modules(
            sdkCoreModule,
            sdkNetworkModule,
            sdkRepositoryModule
        )
    }

    // 편의 액세서(Convenience accessor)
    val koin: Koin get() = koinApp.koin
}
```

### SDK 모듈 예시

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

## Compose에서 사용하기

### KoinIsolatedContext

SDK의 Compose UI를 `KoinIsolatedContext`로 감쌉니다.

```kotlin
@Composable
fun MySDKScreen() {
    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // 모든 Koin API는 격리된 컨텍스트를 사용합니다.
        SDKContent()
    }
}

@Composable
private fun SDKContent() {
    // 격리된 컨텍스트로부터 의존성을 해결합니다.
    val config = koinInject<SDKConfiguration>()
    val viewModel = koinViewModel<SDKViewModel>()

    Column {
        Text("SDK Version: ${config.version}")
        SDKFeatureScreen(viewModel)
    }
}
```

### 중첩된 컨텍스트 (Nested Contexts)

격리된 컨텍스트를 중첩하여 사용할 수 있습니다.

```kotlin
@Composable
fun HostApp() {
    // 호스트 앱의 Koin 컨텍스트 (startKoin에서 생성됨)
    val hostService = koinInject<HostService>()

    Column {
        Text("Host App")

        // SDK는 자체 격리된 컨텍스트를 사용함
        KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
            MySDKScreen()
        }

        // 다시 호스트 컨텍스트로 돌아감
        AnotherHostScreen()
    }
}
```

## 생명주기 관리 (Lifecycle Management)

### 수동 초기화

필요할 때 SDK 컨텍스트를 초기화합니다.

```kotlin
object MySDK {
    private var _koinContext: KoinApplication? = null
    val koinContext: KoinApplication
        get() = _koinContext ?: error("SDK가 초기화되지 않았습니다")

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

### 수동 생명주기와 함께 사용하기

```kotlin
// 호스트 앱에서 SDK 초기화
class HostApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // 호스트 앱의 Koin
        startKoin {
            androidContext(this@HostApplication)
            modules(hostAppModule)
        }

        // SDK의 격리된 Koin
        MySDK.initialize(SDKConfig(apiKey = "xxx"))
    }

    override fun onTerminate() {
        super.onTerminate()
        MySDK.shutdown()
    }
}

// Compose에서 사용
@Composable
fun SDKFeature() {
    KoinIsolatedContext(context = MySDK.koinContext) {
        SDKScreen()
    }
}
```

## 두 컨텍스트에 모두 접근하기

때로는 호스트와 SDK의 의존성 모두에 접근해야 할 때가 있습니다.

```kotlin
@Composable
fun BridgeScreen() {
    // 호스트 컨텍스트에서 가져오기 (KoinIsolatedContext 외부)
    val hostAnalytics = koinInject<HostAnalytics>()

    KoinIsolatedContext(context = MySDKKoinContext.koinApp) {
        // SDK 컨텍스트에서 가져오기 (KoinIsolatedContext 내부)
        val sdkService = koinInject<SDKService>()

        // 둘 다 사용하기
        SDKFeature(
            service = sdkService,
            onEvent = { hostAnalytics.track(it) }
        )
    }
}
```

## 전체 SDK 예시

```kotlin
// SDK 공개 API
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

// SDK 내부 모듈
private val paymentCoreModule = module {
    single<PaymentProcessor>()
    single<PaymentValidator>()
}

private val paymentUIModule = module {
    viewModel<PaymentViewModel>()
}

// SDK 내부 UI
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

// 호스트 앱 사용 예시
@Composable
fun CheckoutScreen() {
    var showPayment by remember { mutableStateOf(false) }

    if (showPayment) {
        PaymentSDK.PaymentScreen(
            amount = 99.99,
            onSuccess = { result ->
                showPayment = false
                // 성공 처리
            },
            onCancel = { showPayment = false }
        )
    } else {
        Button(onClick = { showPayment = true }) {
            Text("지금 결제")
        }
    }
}
```

## 모범 사례 (Best Practices)

1. **조기 초기화** - Compose가 렌더링되기 전에 격리된 컨텍스트를 설정하십시오.

2. **리소스 정리** - 사용이 끝나면 `KoinApplication`에서 `close()`를 호출하십시오.

3. **인스턴스 공유 금지** - SDK와 호스트의 의존성을 분리하여 유지하십시오.

4. **인터페이스 경계 사용** - 공유된 Koin 인스턴스가 아닌 콜백이나 인터페이스를 통해 통신하십시오.

5. **초기화 문서화** - 호스트 앱 개발자가 SDK 설정 요구 사항을 명확히 알 수 있도록 하십시오.

## 다음 단계

- **[Compose 개요](/docs/reference/koin-compose/compose)** - 기본 Compose 설정
- **[컨텍스트 격리](/docs/reference/koin-core/context-isolation)** - 핵심 격리 개념
- **[스코프](/docs/reference/koin-compose/compose-scopes)** - Compose에서의 스코프 관리