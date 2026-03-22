---
title: 공유 패턴
---

# 공유 패턴 (Sharing Patterns)

이 가이드는 Kotlin Multiplatform 프로젝트에서 Koin 모듈을 구성하는 패턴을 다룹니다.

:::info
기본적인 KMP 설정은 [KMP 설정](/docs/reference/koin-core/kmp-setup)을 참고하세요. 정의 타입에 대해서는 [정의(Definitions)](/docs/reference/koin-core/definitions)를 참고하세요.
:::

## 공유 모듈 패턴 (The Shared Module Pattern)

각 플랫폼에서 확장할 수 있는 공통 초기화 함수를 생성합니다:

```kotlin
// commonMain/kotlin/di/KoinHelper.kt
fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)  // 플랫폼별 확장
        modules(
            sharedModule,
            dataModule,
            domainModule,
            platformModule
        )
    }
}
```

## 모듈 구성 (Module Organization)

예제에서는 컴파일러 플러그인(Compiler Plugin) DSL을 사용합니다. 어노테이션(Annotations)이나 클래식 DSL을 사용할 수도 있습니다.

### 레이어별 구성 (By Layer)

```kotlin
// commonMain/kotlin/di/modules/

// 데이터 레이어
val dataModule = module {
    single<ApiClient>()
    single<UserRepository>()
    single<ProductRepository>()
}

// 도메인 레이어
val domainModule = module {
    factory<GetUserUseCase>()
    factory<GetProductsUseCase>()
    factory<CreateOrderUseCase>()
}

// 공유 모듈이 모두 통합함
val sharedModule = module {
    includes(dataModule, domainModule)
}
```

### 기능별 구성 (By Feature)

```kotlin
// 사용자 기능
val userModule = module {
    single<UserRepository>()
    factory<GetUserUseCase>()
    factory<UpdateUserUseCase>()
}

// 상품 기능
val productModule = module {
    single<ProductRepository>()
    factory<GetProductsUseCase>()
    factory<SearchProductsUseCase>()
}

// 주문 기능
val orderModule = module {
    single<OrderRepository>()
    factory<CreateOrderUseCase>()
    factory<GetOrderHistoryUseCase>()
}
```

## 플랫폼 확장 (Platform Extensions)

커스텀 생성 로직이 필요한 경우, 플랫폼 모듈은 람다와 함께 클래식 DSL을 사용합니다.

### Android 확장

```kotlin
// androidMain/kotlin/di/KoinAndroid.kt
fun initKoinAndroid(context: Context) {
    initKoin {
        androidContext(context)
        androidLogger()
        modules(androidModule)
    }
}

val androidModule = module {
    single<PlatformContext> { AndroidContext(get()) }
    single<FileStorage> { AndroidFileStorage(get()) }
    single<NetworkMonitor> { AndroidNetworkMonitor(get()) }
}
```

### iOS 확장

```kotlin
// iosMain/kotlin/di/KoinIos.kt
fun initKoinIos() {
    initKoin {
        modules(iosModule)
    }
}

val iosModule = module {
    single<PlatformContext> { IosContext() }
    single<FileStorage> { IosFileStorage() }
    single<NetworkMonitor> { IosNetworkMonitor() }
}
```

### Desktop 확장

```kotlin
// desktopMain/kotlin/di/KoinDesktop.kt
fun initKoinDesktop() {
    initKoin {
        printLogger()
        modules(desktopModule)
    }
}

val desktopModule = module {
    single<PlatformContext> { DesktopContext() }
    single<FileStorage> { DesktopFileStorage() }
}
```

## Expect/Actual 모듈 패턴

### 공통 정의 (Common Definition)

```kotlin
// commonMain/kotlin/di/PlatformModule.kt
expect val platformModule: Module
```

### 플랫폼 구현체 (Platform Implementations)

```kotlin
// androidMain
actual val platformModule = module {
    single<DatabaseDriver> { AndroidSqliteDriver(AppDatabase.Schema, get(), "app.db") }
    single<HttpEngine> { Android.create() }
    single<Settings> { AndroidSettings(get()) }
}

// iosMain
actual val platformModule = module {
    single<DatabaseDriver> { NativeSqliteDriver(AppDatabase.Schema, "app.db") }
    single<HttpEngine> { Darwin.create() }
    single<Settings> { NSUserDefaultsSettings(NSUserDefaults.standardUserDefaults) }
}

// jsMain
actual val platformModule = module {
    single<DatabaseDriver> { JsSqliteDriver() }
    single<HttpEngine> { Js.create() }
    single<Settings> { LocalStorageSettings() }
}
```

## Compose Multiplatform

멀티플랫폼 ViewModel에 대해서는 [ViewModel](/docs/reference/koin-core/viewmodel)을 참고하세요.

### 공유 ViewModel

```kotlin
// commonMain
@KoinViewModel
class UserViewModel(
    private val getUserUseCase: GetUserUseCase
) : ViewModel() {
    private val _state = MutableStateFlow<UserState>(UserState.Loading)
    val state = _state.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _state.value = UserState.Success(getUserUseCase(id))
        }
    }
}
```

### 공유 UI

```kotlin
// commonMain
@Composable
fun UserScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()

    when (val s = state) {
        is UserState.Loading -> LoadingIndicator()
        is UserState.Success -> UserContent(s.user)
        is UserState.Error -> ErrorMessage(s.message)
    }
}
```

## 테스트 (Testing)

KMP 테스트 패턴에 대해서는 [테스트(Testing)](/docs/reference/koin-test/testing)를 참고하세요.

## 권장 사항 (Best Practices)

1. **단일 초기화 함수** - `commonMain`에 하나의 `initKoin()`을 둡니다.
2. **설정을 통한 플랫폼 확장** - `includes(config)` 패턴을 사용합니다.
3. **플랫폼 모듈 최소화** - 실제 플랫폼별로 다른 코드만 포함합니다.
4. **ViewModel 로직 공유** - 비즈니스 로직은 `commonMain`에 둡니다.
5. **팩토리에 expect/actual 사용** - 플랫폼별 인스턴스 생성 시 활용합니다.
6. **commonTest에서 테스트** - 대부분의 테스트는 공유가 가능합니다.

## 다음 단계

- **[KMP 설정](/docs/reference/koin-core/kmp-setup)** - 기본적인 KMP 구성
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 멀티플랫폼 ViewModel
- **[고급 패턴](/docs/reference/koin-mp/kmp)** - 아키텍처 패턴, 테스트, 플랫폼 통합
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose Multiplatform