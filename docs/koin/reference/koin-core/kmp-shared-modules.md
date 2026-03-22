---
title: 共享模式
---

# 共享模式

本指南涵盖了在 Kotlin Multiplatform 项目中组织 Koin 模块的模式。

:::info
有关基础 KMP 设置，请参阅 [KMP 设置](/docs/reference/koin-core/kmp-setup)。有关定义类型，请参阅 [定义](/docs/reference/koin-core/definitions)。
:::

## 共享模块模式 (The Shared Module Pattern)

创建一个通用的初始化函数，该函数可以由每个平台进行扩展：

```kotlin
// commonMain/kotlin/di/KoinHelper.kt
fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)  // 平台特定扩展
        modules(
            sharedModule,
            dataModule,
            domainModule,
            platformModule
        )
    }
}
```

## 模块组织

示例使用了编译器插件 DSL。您也可以使用注解或经典 DSL。

### 按层划分

```kotlin
// commonMain/kotlin/di/modules/

// 数据层
val dataModule = module {
    single<ApiClient>()
    single<UserRepository>()
    single<ProductRepository>()
}

// 领域层
val domainModule = module {
    factory<GetUserUseCase>()
    factory<GetProductsUseCase>()
    factory<CreateOrderUseCase>()
}

// 共享模块聚合所有内容
val sharedModule = module {
    includes(dataModule, domainModule)
}
```

### 按功能划分

```kotlin
// 用户功能
val userModule = module {
    single<UserRepository>()
    factory<GetUserUseCase>()
    factory<UpdateUserUseCase>()
}

// 产品功能
val productModule = module {
    single<ProductRepository>()
    factory<GetProductsUseCase>()
    factory<SearchProductsUseCase>()
}

// 订单功能
val orderModule = module {
    single<OrderRepository>()
    factory<CreateOrderUseCase>()
    factory<GetOrderHistoryUseCase>()
}
```

## 平台扩展

当需要自定义构建逻辑时，平台模块使用带 lambda 的经典 DSL。

### Android 扩展

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

### iOS 扩展

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

### 桌面扩展

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

## Expect/Actual 模块模式

### 通用定义

```kotlin
// commonMain/kotlin/di/PlatformModule.kt
expect val platformModule: Module
```

### 平台实现

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

有关多平台 ViewModel，请参阅 [ViewModel](/docs/reference/koin-core/viewmodel)。

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

## 测试

有关 KMP 测试模式，请参阅 [测试](/docs/reference/koin-test/testing)。

## 最佳做法

1. **单一初始化函数** - 在 `commonMain` 中提供一个 `initKoin()`
2. **通过配置进行平台扩展** - 使用 `includes(config)` 模式
3. **最小化平台模块** - 仅包含真正特定于平台的代码
4. **共享 ViewModel 逻辑** - 业务逻辑位于 `commonMain`
5. **为工厂使用 expect/actual** - 平台特定的实例创建
6. **在 commonTest 中进行测试** - 大多数测试都可以共享

## 后续步骤

- **[KMP 设置](/docs/reference/koin-core/kmp-setup)** - 基础 KMP 配置
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel
- **[高级模式](/docs/reference/koin-mp/kmp)** - 架构模式、测试、平台集成
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose Multiplatform