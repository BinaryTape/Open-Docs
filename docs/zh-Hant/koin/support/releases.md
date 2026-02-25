---
title: 版本發布與 API 升級指南
custom_edit_url: null
---

:::info
此頁面全面概述了每個 Koin 的主要版本，詳細介紹了我們架構的演進，以協助您規劃升級並維持相容性。
:::

針對每個版本，文件結構分為以下幾個部分：

- `Kotlin`：指定該版本使用的 Kotlin 版本，確保語言相容性清晰，並讓您能利用最新的 Kotlin 特性。
- `New`：醒目提示新引入的功能與改進，以增強功能性與開發人員體驗。
- `Experimental`：列出標記為實驗性的 API 和功能。這些功能正處於積極開發中，可能會根據社群回饋進行變更。
- `Deprecated`：識別已標記為棄用的 API 和功能，並提供建議替代方案的指引，協助您為未來的移除做準備。
- `Breaking`：詳細說明任何可能破壞回溯相容性的變更，確保您了解遷移過程中必要的調整。

這種結構化方法不僅釐清了每個版本中的增量變更，還強化了我們對 Koin 專案透明度、穩定性以及持續改進的承諾。

若要了解更多，請參閱 [API 穩定性合約](api-stability.md)。

## 4.1.1

:::note
使用 Kotlin `2.1.21`
:::

### 新增功能 🎉

`koin-compose-viewmodel-navigation`
- 加強了 `sharedKoinViewModel` 並增加選用的 `navGraphRoute` 參數以提供更好的 Compose Navigation 支援。

`koin-core`
- 核心解析器效能優化 —— 避免在單一作用域解析時進行不必要的展平。
- 加強了作用域偵錯，顯示連結的作用域 ID。

### 程式庫更新 📚

- **Kotlin** 2.1.21 (原為 2.1.20)
- **Ktor** 3.2.3 (原為 3.1.3) 
- **Jetbrains Compose** 1.8.2 (原為 1.8.0)
- **AndroidX**: Fragment 1.8.9, WorkManager 2.10.3, Lifecycle 2.9.3, Navigation 2.9.3
- **測試**: Robolectric 4.15.1, Benchmark 0.4.14
- **組建**: Binary Validator 0.18.1, NMCP 1.1.0

### 錯誤修復 🐛

`koin-core`
- 還原了導致相容性錯誤的 logger 約束。
- 修正了 Compose 作用域解析，改進了 `LocalKoinApplication`/`LocalKoinScope` 的上下文處理。

`koin-build`
- 修正了 Maven Central 發布問題。

## 4.1.0

:::note
使用 Kotlin `2.1.20`
:::

### 新增功能 🎉

`koin-core`
- 配置 - `KoinConfiguration` API 協助封裝配置。
- 作用域 - 引入新的 *作用域原型 (Scope Archetype)*，即針對該類別作用域的專用作用域類型限定符。現在可以針對作用域類別（又稱原型）進行執行個體解析。
- 功能選項 - "功能選項" 協助在 Koin 內部對新功能行為進行功能開關。您可以在 Koin 配置中使用 `options` 區塊來啟用選項：
```kotlin
startKoin {
    options(
        // 啟用新功能
        viewModelScopeFactory()
    )
}
```
- 核心 - 引入新的 `CoreResolver`，允許 `ResolutionExtension` 協助 Koin 在外部系統或資源中進行解析（用於協助連接 Ktor DI）。

`koin-android`
- 升級的程式庫（`androidx.appcompat:appcompat:1.7.0`、`androidx.activity:activity-ktx:1.10.1`）要求將最低 SDK 版本從 14 提升至 21。
- DSL - 新增 Koin 模組 DSL 擴充功能 `activityScope`、`activityRetainedScope` 和 `fragmentScope`，用於在 Activity/Fragment 內宣告作用域。
- 作用域函式 - `activityScope()`、`activityRetainedScope()` 和 `fragmentScope()` API 函式現在也會觸發作用域原型。

`koin-androidx-compose`
- 與 Koin Compose 多平台及所有 Compose 1.8 和 Lifecycle 2.9 版本保持一致。

`koin-compose`
- 與 Compose 1.8 和 Lifecycle 2.9 保持一致。
- 新函式 - `KoinApplicationPreview` 協助在 Android Studio 和 IntelliJ 中呈現平行預覽。

`koin-compose-viewmodel`
- 新增 `koinActivityViewModel` 以允許設定父級 Activity 為主機。

`koin-ktor`
- 多平台 - 此模組現在以 Kotlin KMP 格式編譯。您可以從多平台專案中指向 `koin-ktor`。
- 合併 - 先前的 koin-ktor3 模組已合併至 koin-ktor。
- 擴充功能 - 引入 `Application.koinModule { }` 和 `Application.koinModules()`，讓您能直接宣告加入 Ktor 模組的 Koin 模組。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- 作用域 - `Module.requestScope` - 允許在 Ktor 請求作用域內宣告定義（避免手動宣告 `scope<RequestScope>`）。
插入的作用域也允許在建構函式中插入 `ApplicationCall`。

`koin-core-coroutines`
- 模組 DSL - 引入新的 `ModuleConfiguration` 協助將模組配置收集在一個結構中，以便稍後進行更好的驗證。
```kotlin
val m1 = module {
    single { Simple.ComponentA() }
}
val lm1 = lazyModule {
    single { Simple.ComponentB(get()) }
}
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}
```
- 配置 DSL - Koin 配置現在可以使用 `ModuleConfiguration` 來載入模組：
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// 甚至可以
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- 新增 `koin-test-coroutines` Koin 模組以引入新的協程相關測試 API。
- 擴充功能 - 擴展 Verify API，讓您能使用 `moduleConfiguration` 檢查 Koin 配置，進而驗證模組/延遲模組混合配置：
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// 如果您需要 Android 型別 (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- 註解 - `@InjectedParam` 或 `@Provided` 用於標記一個屬性被視為插入參數或動態提供。目前用於 `Verify` API，但稍後可能用於協助更輕量的 DSL 宣告。

### 實驗性 🚧

`koin-core`
- Wasm - 使用 Kotlin 2.1.20 UUID 產生。

`koin-core-viewmodel`
- DSL - 新增模組 DSL 擴充功能 `viewModelScope`，用於宣告範圍限定在 ViewModel 作用域原型的元件。
- 作用域函式 - 新增函式 `viewModelScope()`，用於為 ViewModel 建立作用域（繫結至 ViewModel 類別）。此 API 現在使用 `ViewModelScopeAutoCloseable` 來利用 `AutoCloseable` API 協助宣告作用域並關閉它。不再需要手動關閉 ViewModel 作用域。
- 類別 - 更新了 `ScopeViewModel` 類別，為開箱即用的 ViewModel 作用域限定類別提供支援（處理作用域建立與關閉）。
- 功能選項 - 帶有 ViewModel 作用域的建構函式 ViewModel 插入，需要啟用 Koin 選項 `viewModelScopeFactory`：
```kotlin
startKoin {
    options(
        // 啟用新的 ViewModel 作用域建立
        viewModelScopeFactory()
    )
}

// 將從 MyScopeViewModel 的作用域中插入 Session
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose 函式 - 新增 `KoinMultiplatformApplication` 函式，嘗試提出一個多平台 Compose 入口點。

`koin-core-viewmodel-navigation`
- Navigation 擴充功能 - 新增 `sharedViewModel` 以重複使用導覽中 NavbackEntry 的 ViewModel 執行個體。

`koin-test`
- 註解 - Koin 配置驗證 API `Verify` 現在可協助您檢查可為 null、延遲以及列表參數。只需使用 `@InjectedParam` 或 `@Provided` 標記一個屬性，使其被視為插入參數或動態提供。這能避免在 Verify API 中進行複雜的宣告。
```kotlin
// 現在能在 Verify 中偵測到
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### 棄用 ⚠️

`koin-android`
- `ScopeViewModel` 現在已棄用，請改用 `koin-core-viewmodel` 的 `ScopeViewModel` 類別。

`koin-compose`
- 不再需要 Compose 上下文 API，因為 Koin 上下文已在目前的預設上下文中正確準備。以下內容已棄用且可以移除：`KoinContext`。

`koin-androidx-compose`
- 不再需要 Jetpack Compose 上下文 API，因為 Koin 上下文已在目前的預設上下文中正確準備。以下內容已棄用且可以移除：`KoinAndroidContext`。

`koin-androidx-compose-navigation`
- 由於 lifecycle 程式庫更新，不再需要 `koinNavViewModel` 函式，可用 `koinViewModel` 替代。

`koin-core-viewmodel-navigation`
- 由於 lifecycle 程式庫更新，不再需要 `koinNavViewModel` 函式，可用 `koinViewModel` 替代。

`koin-ktor`
- 擴充功能 - `Application.koin` 現在已棄用，建議改用 `Application.koinModules` 和 `Application.koinModule`。

### 破壞性變更 💥

`koin-android`
- 所有舊的狀態 ViewModel API 現在已被移除：
    - `stateViewModel()`、`getStateViewModel()`，請改用 `viewModel()`。
    - `getSharedStateViewModel()`、`sharedStateViewModel()`，如果是共享執行個體，請改用 `viewModel()` 或 `activityViewModel()`。

`koin-compose`
- 舊的 Compose API 函式已移除：
    - 函式 `inject()` 已移除，建議改用 `koinInject()`。
    - 函式 `getViewModel()` 已移除，建議改用 `koinViewModel()`。
    - 函式 `rememberKoinInject()` 已移至 `koinInject()`。
- 函式 `rememberKoinApplication` 被標記為 `@KoinInternalAPI`。

## 4.0.4

:::note
使用 Kotlin `2.0.21`
:::

所有使用的程式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中。

### 新增功能 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 透過這個新版本的 Kotlin，我們受益於新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函式現在使用此新 API 在各平台上產生真實的 UUID。

`koin-viewmodel`
- Koin 4.0 引入了通用化 Google/Jetbrains KMP API 的 ViewModel DSL 與 API。為了避免程式碼庫重複，ViewModel API 現在位於 `koin-core-viewmodel` 與 `koin-core-viewmodel-navigation` 專案中。
- ViewModel DSL 的匯入路徑為 `org.koin.core.module.dsl.*`

以下給定專案中的 API 現在已穩定。

`koin-core-coroutines` - 所有 API 現在已穩定
- 所有 `lazyModules`
- `awaitAllStartJobs`、`onKoinStarted`、`isAllStartedJobsDone`
- `waitAllStartJobs`、`runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### 實驗性 🚧

`koin-test`
- `ParameterTypeInjection` - 新的 API，協助為 `Verify` API 設計動態參數插入。

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `androidx.startup.Initializer` API 透過 `AndroidX Startup` 啟動 Koin 的新能力。`koin-androidx-startup` 內的所有 API 皆為實驗性。

`koin-compose`
- `rememberKoinModules` - 針對給定的 @Composable 元件載入/卸載 Koin 模組。
- `rememberKoinScope` - 針對給定的 @Composable 元件載入/卸載 Koin 作用域。
- `KoinScope` - 為所有底層 Composable 子元件載入 Koin 作用域。

### 棄用 ⚠️

以下 API 已被棄用且不應再使用：

- `koin-test`
    - `checkModules` 的所有 API。請遷移至 `Verify` API。

- `koin-android`
    - 棄用 ViewModel DSL，建議改用 koin-core 中新的集中式 DSL。
    - 所有狀態 ViewModel API 皆在錯誤層級被棄用：
        - `stateViewModel()`、`getStateViewModel()`，請改用 `viewModel()`。
        - `getSharedStateViewModel()`、`sharedStateViewModel()`，如果是共享執行個體，請改用 `viewModel()` 或 `activityViewModel()`。

`koin-compose`
- 舊的 Compose API 函式在錯誤層級被棄用：
    - 函式 `inject()` 已棄用（錯誤層級），建議改用 `koinInject()`。
    - 函式 `getViewModel()` 已棄用（錯誤層級），建議改用 `koinViewModel()`。
    - 函式 `rememberKoinInject()` 已棄用（錯誤層級），建議改用 `koinInject()`。

- `koin-compose-viewmodel`
    - 棄用 ViewModel DSL，建議改用 koin-core 中新的集中式 DSL。
    - 函式 `koinNavViewModel` 現在已棄用，建議改用 `koinViewModel`。

### 破壞性變更 💥

由於上一階段的棄用，以下 API 已被移除：

:::note
所有標註為 `@KoinReflectAPI` 的 API 皆已移除。
:::

`koin-core`
- `ApplicationAlreadyStartedException` 已重新命名為 `KoinApplicationAlreadyStartedException`。
- `KoinScopeComponent.closeScope()` 已移除，因為內部不再使用。
- 移動了內部的 `ResolutionContext` 以取代 `InstanceContext`。
- `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已移除，改用 Kotlin Time API。
- `KoinContextHandler` 已移除，改用 `GlobalContext`。

`koin-android`
- 函式 `fun Fragment.createScope()` 已移除。
- ViewModel 工廠（主要是內部）相關的所有 API 皆已針對新內部機制進行重構。

`koin-compose`
- 移除了內部不再使用的 `StableParametersDefinition`。
- 移除了所有延遲 ViewModel API - 舊的 `viewModel()`。
- 移除了內部不再使用的 `rememberStableParametersDefinition()`。

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的程式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中。

### 新增功能 🎉

`koin-core`
- `KoinContext` 現在包含以下內容：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 函式現在支援多種格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- `KoinAppDeclaration` 協助開放宣告樣式。
- `KoinPlatformTimeTools` 以在 JS 中使用 API Time。
- iOS - `synchronized` API 以使用 Touchlab Lockable API。

`koin-androidx-compose`
- 新的 `KoinAndroidContext` 用於從 Android 環境繫結至目前的 Koin 上下文。

`koin-compose`
- 新的 `KoinContext` 上下文啟動器，使用目前的預設上下文。

`koin-ktor`
- 現在針對 Ktor 執行個體使用隔離上下文（使用 `Application.getKoin()` 而非預設上下文）。
- Koin 外掛程式引入了新的監控。
- `RequestScope` 允許將作用域執行個體限定在一個 Ktor 請求中。

### 實驗性 🚧

`koin-android`
- `ViewModelScope` 為 ViewModel 作用域引入實驗性 API。

`koin-core-coroutines` - 引入用於在背景載入模組的新 API。

### 棄用 ⚠️

`koin-android`
- `getLazyViewModelForClass()` API 非常複雜，且呼叫預設的全域上下文。建議堅持使用 Android/Fragment API。
- `resolveViewModelCompat()` 已棄用，建議改用 `resolveViewModel()`。

`koin-compose`
- 函式 `get()` 和 `inject()` 已棄用，建議改用 `koinInject()`。
- 函式 `getViewModel()` 已棄用，建議改用 `koinViewModel()`。
- 函式 `rememberKoinInject()` 已棄用，改用 `koinInject()`。

### 破壞性變更 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 取代了 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`。
- 將屬性 `KoinExtension.koin` 移動到函式 `KoinExtension.onRegister()`。
- iOS - `internal fun globalContextByMemoryModel(): KoinContext` 以使用 `MutableGlobalContext`。

`koin-compose`
- 函式 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已移除，改用 `KoinContext` 和 `KoinAndroidContext`。

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### 新增功能 🎉

`koin-core`
- 新的 ExtensionManager API 協助編寫 Koin 的擴充引擎 - `ExtensionManager` + `KoinExtension`。
- 參數 API 更新，新增 `parameterArrayOf` 與 `parameterSetOf`。

`koin-test`
- `Verification` API - 協助在模組上執行 `verify`。

`koin-android`
- ViewModel 插入的內部機制。
- 新增 `AndroidScopeComponent.onCloseScope()` 函式回呼。

`koin-android-test`
- `Verification` API - 協助在模組上執行 `androidVerify()`。

`koin-androidx-compose`
- 新的 `get()`。
- 新的 `getViewModel()`。
- 新的作用域 `KoinActivityScope`、`KoinFragmentScope`。

`koin-androidx-compose-navigation` - 新的導覽模組。
- 新的 `koinNavViewModel()`。

`koin-compose` - 新的 Compose 多平台 API。
- `koinInject`、`rememberKoinInject`。
- `KoinApplication`。

### 實驗性 🚧

`koin-compose` - 新的 Compose 實驗性多平台 API。
- `rememberKoinModules`。
- `KoinScope`、`rememberKoinScope`。

### 棄用 ⚠️

`koin-compose`
- 函式 `get()` 用於取代 `inject()` 的使用，避免使用延遲函式。
- 函式 `getViewModel()` 用於取代 `viewModel()` 函式，避免使用延遲函式。

### 破壞性變更 💥

`koin-android`
- `LifecycleScopeDelegate` 現在已移除。

`koin-androidx-compose`
- 移除了 `getStateViewModel`，改用 `koinViewModel`。