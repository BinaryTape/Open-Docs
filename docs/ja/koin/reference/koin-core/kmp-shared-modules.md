---
title: 共有パターン
---

# 共有パターン

このガイドでは、Kotlin Multiplatform プロジェクトにおける Koin モジュールの構成パターンについて説明します。

:::info
基本的な KMP のセットアップについては、[KMP セットアップ](/docs/reference/koin-core/kmp-setup) を参照してください。定義の種類については、[定義](/docs/reference/koin-core/definitions) を参照してください。
:::

## 共有モジュールパターン

各プラットフォームによって拡張可能な、共通の初期化関数を作成します。

```kotlin
// commonMain/kotlin/di/KoinHelper.kt
fun initKoin(config: KoinAppDeclaration? = null): KoinApplication {
    return startKoin {
        includes(config)  // プラットフォーム固有の拡張
        modules(
            sharedModule,
            dataModule,
            domainModule,
            platformModule
        )
    }
}
```

## モジュールの構成

例ではコンパイラプラグイン DSL を使用していますが、アノテーションやクラシック DSL も使用できます。

### レイヤー別

```kotlin
// commonMain/kotlin/di/modules/

// データレイヤー
val dataModule = module {
    single<ApiClient>()
    single<UserRepository>()
    single<ProductRepository>()
}

// ドメインレイヤー
val domainModule = module {
    factory<GetUserUseCase>()
    factory<GetProductsUseCase>()
    factory<CreateOrderUseCase>()
}

// 共有モジュールですべてを集約
val sharedModule = module {
    includes(dataModule, domainModule)
}
```

### 機能別

```kotlin
// ユーザー機能
val userModule = module {
    single<UserRepository>()
    factory<GetUserUseCase>()
    factory<UpdateUserUseCase>()
}

// 製品機能
val productModule = module {
    single<ProductRepository>()
    factory<GetProductsUseCase>()
    factory<SearchProductsUseCase>()
}

// 注文機能
val orderModule = module {
    single<OrderRepository>()
    factory<CreateOrderUseCase>()
    factory<GetOrderHistoryUseCase>()
}
```

## プラットフォーム拡張

カスタムの構築ロジックが必要な場合、プラットフォームモジュールはラムダを伴うクラシック DSL を使用します。

### Android 拡張

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

### iOS 拡張

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

### デスクトップ拡張

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

## Expect/Actual モジュールパターン

### 共通の定義

```kotlin
// commonMain/kotlin/di/PlatformModule.kt
expect val platformModule: Module
```

### プラットフォームごとの実装

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

マルチプラットフォーム向けの ViewModel については、[ViewModel](/docs/reference/koin-core/viewmodel) を参照してください。

### 共有 ViewModel

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

### 共有 UI

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

## テスト

KMP のテストパターンについては、[テスト](/docs/reference/koin-test/testing) を参照してください。

## ベストプラクティス

1. **単一の初期化関数** - `commonMain` に 1 つの `initKoin()` を配置する
2. **config によるプラットフォーム拡張** - `includes(config)` パターンを使用する
3. **プラットフォームモジュールを最小限にする** - 真にプラットフォーム固有のコードのみに限定する
4. **ViewModel ロジックの共有** - ビジネスロジックを `commonMain` に配置する
5. **ファクトリに expect/actual を使用する** - プラットフォーム固有のインスタンス生成に利用する
6. **commonTest でテストする** - ほとんどのテストは共有可能である

## 次のステップ

- **[KMP セットアップ](/docs/reference/koin-core/kmp-setup)** - 基本的な KMP 構成
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - マルチプラットフォーム ViewModel
- **[高度なパターン](/docs/reference/koin-mp/kmp)** - アーキテクチャパターン、テスト、プラットフォーム統合
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose Multiplatform