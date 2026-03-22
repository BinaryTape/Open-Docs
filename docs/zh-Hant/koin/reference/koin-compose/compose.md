---
title: Koin for Compose
---

# Koin for Compose

Koin 為 Jetpack Compose 與 Compose Multiplatform 應用程式提供完整的支援，並配有專用的相依性注入軟件包。

## 軟件包總覽 (Packages Overview)

| 軟件包 | 使用案例 |
|---------|----------|
| `koin-compose` | 基礎 Compose API (多平台) |
| `koin-compose-viewmodel` | ViewModel 注入 (多平台) |
| `koin-compose-viewmodel-navigation` | ViewModel + Navigation 2.x |
| `koin-compose-navigation3` | Navigation 3 整合 (多平台) |
| `koin-androidx-compose` | Android 便利包 (包含 koin-compose + koin-compose-viewmodel) |

:::info
所有 Compose API 皆定義於 `koin-compose` 與 `koin-compose-viewmodel`。`koin-androidx-compose` 軟件包是一個便利的包裝函式，為 Android 專案同時包含了兩者。
:::

### 我該選用哪個軟件包？

**對於純 Android 專案：**
```kotlin
// 選項 1：Android 便利軟件包 (包含 koin-compose + koin-compose-viewmodel)
implementation("io.insert-koin:koin-androidx-compose:$koin_version")

// 選項 2：直接使用多平台軟件包
implementation("io.insert-koin:koin-compose:$koin_version")
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

// 選填：Navigation 整合
implementation("io.insert-koin:koin-androidx-compose-navigation:$koin_version")
```

**對於 Compose Multiplatform 專案：**
```kotlin
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose:$koin_version")
    implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")

    // 選填：Navigation 整合
    implementation("io.insert-koin:koin-compose-viewmodel-navigation:$koin_version")
}
```

## 平台支援 (Platform Support)

| 平台 | Compose 類型 | 狀態 |
|----------|-------------|--------|
| Android | Jetpack Compose | 完整支援 |
| iOS | Compose Multiplatform | 完整支援 |
| Desktop | Compose Desktop | 完整支援 |
| Web | Compose for Web | 實驗性 |

## 啟動 Koin

### 選項 1：startKoin (僅限 Android 或外部設定)

在 Compose 外部初始化 Koin 以獲得完整控制權：

```kotlin
// Android Application 類別
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

// Compose UI 自動使用 Koin
@Composable
fun App() {
    val viewModel = koinViewModel<MyViewModel>()
}
```

**適用時機：** 您需要對 Koin 生命週期、自訂配置或與其他架構的整合進行完整控制。

### 選項 2：KoinApplication (由 Compose 管理)

讓 Compose 自動處理 Koin 設定：

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

**優點：**
- 無需外部設定 (不需要 Application 類別)
- 自動注入 Android Context
- 根據組合 (composition) 生命週期處理啟動/停止
- 管理 Android 上的配置變更

**適用時機：** 您希望以最簡單的設定進行開發，且不需要過多的控制權。

在 Android 上會自動注入 `androidContext` 與 `androidLogger`。

:::note
`KoinMultiplatformApplication` 已被棄用。請改用帶有 `koinConfiguration` 的 `KoinApplication`。
:::

## 基礎注入

### koinInject() - 取得相依性

注入任何由 Koin 管理的相依性：

```kotlin
@Composable
fun UserScreen() {
    val repository = koinInject<UserRepository>()
    // 使用 repository ...
}
```

**最佳實務** - 作為預設參數注入：

```kotlin
@Composable
fun UserScreen(
    repository: UserRepository = koinInject()
) {
    // 無需 Koin 即可測試
}
```

### koinViewModel() - 取得 ViewModel

注入具備適當生命週期管理的 ViewModel：

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    val state by viewModel.state.collectAsState()
}
```

:::info
請參閱 [Compose 中的 ViewModel](/docs/reference/koin-compose/compose-viewmodel) 以了解所有 ViewModel API。
:::

### 搭配參數使用

傳遞執行時參數：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel> {
        parametersOf(itemId)
    }
}
```

為了在頻繁重組 (recomposition) 時獲得更好的效能：

```kotlin
@Composable
fun DetailScreen(itemId: String) {
    val viewModel = koinViewModel<DetailViewModel>(
        parameters = parametersOf(itemId)
    )
}
```

## 定義模組

### 編譯器外掛程式 DSL

```kotlin
val appModule = module {
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### 註解 (Annotations)

```kotlin
@Singleton
class UserRepository

@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 傳統 DSL

```kotlin
val appModule = module {
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

## 快速參考 (Quick Reference)

| 函式 | 用途 |
|----------|---------|
| `koinInject<T>()` | 注入任何相依性 |
| `koinViewModel<T>()` | 注入 ViewModel |
| `koinNavViewModel<T>()` | 帶有 Navigation 引數的 ViewModel |
| `koinActivityViewModel<T>()` | Activity 作用域的 ViewModel (Android) |
| `rememberKoinModules()` | 隨組合載入模組 |
| `KoinScope {}` | 建立作用域上下文 |

## 文件

| 主題 | 說明 |
|-------|-------------|
| **[ViewModel](/docs/reference/koin-compose/compose-viewmodel)** | 所有 ViewModel 注入 API |
| **[生命週期與狀態](/docs/reference/koin-compose/compose-lifecycle)** | 重組、狀態、副作用 |
| **[動態模組](/docs/reference/koin-compose/compose-modules)** | rememberKoinModules、延遲載入 |
| **[作用域](/docs/reference/koin-compose/compose-scopes)** | KoinScope、KoinNavigationScope、UnboundKoinScope |
| **[測試](/docs/reference/koin-compose/compose-testing)** | 預覽、單元測試 |
| **[隔離上下文](/docs/reference/koin-compose/isolated-context)** | SDK 隔離 |
| **[Navigation 3](/docs/reference/koin-compose/navigation3)** | 型別安全導覽 (多平台) |

## 相關內容

- **[核心 ViewModel](/docs/reference/koin-core/viewmodel)** - ViewModel 宣告 DSL
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 特定功能
- **[KMP 設定](/docs/reference/koin-core/kmp-setup)** - 多平台配置