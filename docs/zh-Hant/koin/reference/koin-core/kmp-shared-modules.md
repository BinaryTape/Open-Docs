---
title: 共享模式
---

# 共享模式

本指南涵蓋了在 Kotlin Multiplatform 專案中組織 Koin 模組的模式。

:::info
對於基本 KMP 設定，請參閱 [KMP Setup](/docs/reference/koin-core/kmp-setup)。對於定義類型，請參閱 [Definitions](/docs/reference/koin-core/definitions)。
:::

## 共用模組模式 (The Shared Module Pattern)

建立一個可由各個平台擴充的通用初始化函式：

```kotlin
// commonMain/kotlin/di/KoinHelper.kt
fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)  // 平台特定擴充
        modules(
            sharedModule,
            dataModule,
            domainModule,
            platformModule
        )
    }
}
```

## 模組組織

範例使用編譯器外掛程式 DSL。你也可以使用註解或經典 DSL。

### 依層級 (By Layer)

```kotlin
// commonMain/kotlin/di/modules/

// 資料層
val dataModule = module {
    single<ApiClient>()
    single<UserRepository>()
    single<ProductRepository>()
}

// 領域層
val domainModule = module {
    factory<GetUserUseCase>()
    factory<GetProductsUseCase>()
    factory<CreateOrderUseCase>()
}

// 共用模組聚合所有內容
val sharedModule = module {
    includes(dataModule, domainModule)
}
```

### 依功能 (By Feature)

```kotlin
// 使用者功能
val userModule = module {
    single<UserRepository>()
    factory<GetUserUseCase>()
    factory<UpdateUserUseCase>()
}

// 產品功能
val productModule = module {
    single<ProductRepository>()
    factory<GetProductsUseCase>()
    factory<SearchProductsUseCase>()
}

// 訂單功能
val orderModule = module {
    single<OrderRepository>()
    factory<CreateOrderUseCase>()
    factory<GetOrderHistoryUseCase>()
}
```

## 平台擴充

當需要自訂建構邏輯時，平台模組會使用帶有 Lambda 的經典 DSL。

### Android 擴充

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

### iOS 擴充

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

### Desktop 擴充

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

## Expect/Actual 模組模式

### 通用宣告

```kotlin
// commonMain/kotlin/di/PlatformModule.kt
expect val platformModule: Module
```

### 平台實作

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

關於多平台 ViewModel，請參閱 [ViewModel](/docs/reference/koin-core/viewmodel)。

### 共享 ViewModel

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

### 共享 UI

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

## 測試

關於 KMP 測試模式，請參閱 [Testing](/docs/reference/koin-test/testing)。

## 最佳實務

1. **單一初始化函式** - 在 commonMain 中僅使用一個 `initKoin()`。
2. **透過設定進行平台擴充** - 使用 `includes(config)` 模式。
3. **最小化平台模組** - 僅保留真正平台特定的程式碼。
4. **共享 ViewModel 邏輯** - 將商務邏輯放在 commonMain。
5. **針對工廠使用 expect/actual** - 處理平台特定的執行個體建立。
6. **在 commonTest 中測試** - 大多數測試都可以共享。

## 後續步驟

- **[KMP Setup](/docs/reference/koin-core/kmp-setup)** - 基本 KMP 組態
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel
- **[Advanced Patterns](/docs/reference/koin-mp/kmp)** - 架構模式、測試、平台整合
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose Multiplatform