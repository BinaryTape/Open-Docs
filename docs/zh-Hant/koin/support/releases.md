---
title: 版本與 API 相容性指南
custom_edit_url: null
---

:::info
本頁提供 Koin 各主要版本的全面概覽，詳述我們框架的演進，以協助您規劃升級並維持相容性。
:::

對於每個版本，文件皆依循以下章節結構編排：

- `Kotlin`：指定該版本使用的 Kotlin 版本，確保語言相容性清晰明瞭，並讓您能夠利用最新的 Kotlin 功能。
- `New`：強調新引入的功能和改進，以提升功能性與開發者體驗。
- `Experimental`：列出標記為實驗性的 API 和功能。這些功能正積極開發中，並可能依據社群回饋進行變更。
- `Deprecated`：識別已標記為棄用的 API 和功能，並提供建議的替代方案指南，協助您為未來的移除做好準備。
- `Breaking`：詳細說明任何可能破壞向後相容性的變更，確保您在遷移期間知悉必要的調整。

這種結構化的方法不僅闡明了每個版本中的增量變更，也強化了我們對 Koin 專案透明度、穩定性及持續改進的承諾。

## 4.0.3

:::note
使用 Kotlin `2.0.21`
:::

所有使用的函式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中

### 新功能 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 隨著 Kotlin 的新版本，我們受益於新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函數現在使用這個新 API，以跨平台生成真實的 UUID。

`koin-viewmodel`
 - Koin 4.0 引入了新的 ViewModel DSL 和 API，這些共同利用了 Google/Jetbrains KMP API。為了避免程式碼庫中的重複，ViewModel API 現在位於 `koin-core-viewmodel` 和 `koin-core-viewmodel-navigation` 專案中。
 - ViewModel DSL 的導入是 `org.koin.core.module.dsl.*`

以下專案中的 API 現已穩定。

`koin-core-coroutines` - 所有 API 現已穩定
  - 所有 `lazyModules` 
  - `awaitAllStartJobs`、`onKoinStarted`、`isAllStartedJobsDone`
  - `waitAllStartJobs`、`runOnKoinStarted`
  - `KoinApplication.coroutinesEngine`
  - `Module.includes(lazy)`
  - `lazyModule()`
  - `KoinPlatformCoroutinesTools`

### 實驗性功能 🚧

`koin-test`
- `ParameterTypeInjection` - 協助為 `Verify` API 設計動態參數注入的新 API

`koin-androidx-startup`
- `koin-androidx-startup` - 能夠使用 `AndroidX Startup` 啟動 Koin 的新功能，利用 `androidx.startup.Initializer` API。`koin-androidx-startup` 內的所有 API 均為實驗性。

`koin-compose`
- `rememberKoinModules` - 載入/卸載給定 @Composable 組件的 Koin 模組
- `rememberKoinScope` - 載入/卸載給定 @Composable 組件的 Koin Scope
- `KoinScope` - 為所有底層 Composable 子項載入 Koin scope

### 棄用 ⚠️

以下 API 已被棄用，不應再使用：

- `koin-test`
  - `checkModules` 的所有 API。請遷移至 `Verify` API。

- `koin-android` 
  - ViewModel DSL，轉而使用 koin-core 中新的集中式 DSL

- `koin-compose-viewmodel` 
  - ViewModel DSL，轉而使用 koin-core 中新的集中式 DSL
  - 函數 `koinNavViewModel` 現已棄用，轉而使用 `koinViewModel`

### 破壞性變更 💥

以下 API 已被移除，原因是上一里程碑中的棄用：

:::note
所有標記為 `@KoinReflectAPI` 的 API 都已移除
:::

`koin-core`
  - `ApplicationAlreadyStartedException` 已更名為 `KoinApplicationAlreadyStartedException`
  - `KoinScopeComponent.closeScope()` 已移除，因其在內部不再使用
  - 內部 `ResolutionContext` 已移入，以取代 `InstanceContext`
  - `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已移除，轉而使用 Kotlin Time API
  - `KoinContextHandler` 已移除，轉而使用 `GlobalContext`

`koin-android` 
  - 所有狀態 ViewModel API 均已在錯誤級別棄用： 
    - `stateViewModel()`、`getStateViewModel()`，請改用 `viewModel()`
    - `getSharedStateViewModel()`、`sharedStateViewModel()`，請改用 `viewModel()` 或 `activityViewModel()` 來取得共享實例
  - 函數 `fun Fragment.createScope()` 已移除
  - 所有關於 ViewModel 工廠的 API (主要為內部) 已針對新的內部結構進行重寫

`koin-compose`
  - 舊的 Compose API 函數已在錯誤級別棄用：
    - 函數 `inject()` 已移除，轉而使用 `koinInject()`
    - 函數 `getViewModel()` 已移除，轉而使用 `koinViewModel()`
    - 函數 `rememberKoinInject()` 已移入 `koinInject()`， 
  - 移除 `StableParametersDefinition`，因其在內部不再使用
  - 移除所有 Lazy ViewModel API - 舊的 `viewModel()`
  - 移除 `rememberStableParametersDefinition()`，因其在內部不再使用

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的函式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中

### 新功能 🎉

`koin-core`
  - `KoinContext` 現在包含以下內容：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
  - `koinApplication()` 函數現在支援多種格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
  - `KoinAppDeclaration` 以協助開啟聲明風格
  - `KoinPlatformTimeTools` 用於 JS 的時間 API
  - iOS - `synchronized` API 用於 Touchlab Lockable API

`koin-androidx-compose`
  - 新的 `KoinAndroidContext` 用於從 Android 環境綁定到當前的 Koin context

`koin-compose`
  - 新的 `KoinContext` context 啟動器，帶有當前預設的 context

`koin-ktor`
  - 現在為 Ktor 實例使用獨立的 context (使用 `Application.getKoin()` 而非預設 context)
  - Koin 插件引入了新的監控功能
  - `RequestScope` 允許 scope 實例綁定到 Ktor 請求

### 實驗性功能 🚧

`koin-android`
  - `ViewModelScope` 引入了用於 ViewModel scope 的實驗性 API

`koin-core-coroutines` - 引入新 API 以在背景載入模組

### 棄用 ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API 極為複雜，且呼叫預設的全域 context。建議堅持使用 Android/Fragment API
  - `resolveViewModelCompat()` 已棄用，轉而使用 `resolveViewModel()`

`koin-compose`
  - 函數 `get()` 和 `inject()` 已棄用，轉而使用 `koinInject()`
  - 函數 `getViewModel()` 已棄用，轉而使用 `koinViewModel()`
  - 函數 `rememberKoinInject()` 已棄用，轉而使用 `koinInject()`

### 破壞性變更 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 取代了 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`
  - 已將屬性 `KoinExtension.koin` 移至函數 `KoinExtension.onRegister()` 
  - iOS - `internal fun globalContextByMemoryModel(): KoinContext` 用於 `MutableGlobalContext`

`koin-compose`
  - 函數 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已移除，轉而使用 `KoinContext` 和 `KoinAndroidContext`

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### 新功能 🎉

`koin-core`
  - 新的 ExtensionManager API，用於協助為 Koin 編寫擴充引擎 - `ExtensionManager` + `KoinExtension`
  - Parameters API 更新，包含 `parameterArrayOf` 及 `parameterSetOf` 

`koin-test`
  - `Verification` API - 協助在模組上執行 `verify`。

`koin-android`
  - ViewModel 注入的內部機制
  - 新增 `AndroidScopeComponent.onCloseScope()` 函數回呼

`koin-android-test`
  - `Verification` API - 協助在模組上執行 `androidVerify()`。

`koin-androidx-compose`
  - 新增 `get()`
  - 新增 `getViewModel()`
  - 新的 Scopes `KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - 用於導航的新模組
  - 新增 `koinNavViewModel()`

`koin-compose` - 用於 Compose 的新多平台 API
  - `koinInject`、`rememberKoinInject`
  - `KoinApplication`

### 實驗性功能 🚧

`koin-compose` - 用於 Compose 的新實驗性多平台 API
  - `rememberKoinModules`
  - `KoinScope`、`rememberKoinScope`

### 棄用 ⚠️

`koin-compose`
- 函數 `get()` 取代 `inject()` 的使用，避免了 Lazy 函數
- 函數 `getViewModel()` 取代 `viewModel()` 函數，使用時避免了 Lazy 函數

### 破壞性變更 💥

`koin-android`
  - `LifecycleScopeDelegate` 現已移除

`koin-androidx-compose`
  - 移除 `getStateViewModel`，轉而使用 `koinViewModel`