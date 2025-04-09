---
title: "版本發布 & API 相容性指南"
custom_edit_url: null
---
:::info
本頁面提供了每個 Koin 主要版本的全面概述，詳細介紹了我們框架的演進，以幫助您規劃升級並保持相容性。
:::

對於每個版本，文件都分為以下幾個部分：

- `Kotlin`：指定了該版本使用的 Kotlin 版本，確保語言相容性的清晰度，並讓您能夠利用最新的 Kotlin 功能。
- `New`：重點介紹了新引入的功能和改進，這些功能和改進增強了功能和開發人員體驗。
- `Experimental`：列出了標記為實驗性的 API 和功能。 這些正在積極開發中，並會根據社群回饋進行更改。
- `Deprecated`：識別已標記為棄用的 API 和功能，以及有關推薦替代方案的指南，幫助您為將來的移除做好準備。
- `Breaking`：詳細說明了可能破壞向後相容性的任何更改，確保您了解遷移期間的必要調整。

這種結構化的方法不僅闡明了每個版本中的增量變更，而且加強了我們對 Koin 專案中透明度、穩定性和持續改進的承諾。

## 4.0.3

:::note
使用 Kotlin `2.0.21`
:::

所有使用的函式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 透過這個新版本的 Kotlin，我們可以從新的 `kotlin.uuid.uuid` API 中受益。 `KoinPlatformTools.generateId()` Koin 函式現在使用這個新的 API 來跨平台產生真正的 UUID。

`koin-viewmodel`
 - Koin 4.0 引入了新的 ViewModel DSL & API，它們互相通用 Google/Jetbrains KMP API。 為了避免在程式碼庫中重複，ViewModel API 現在位於 `koin-core-viewmodel` & `koin-core-viewmodel-navigation` 專案中。
 - ViewModel DSL 的匯入是 `org.koin.core.module.dsl.*`

以下給定專案中的 API 現在已穩定。

`koin-core-coroutines` - 所有 API 現在都已穩定
  - 所有 `lazyModules`
  - `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
  - `waitAllStartJobs`, `runOnKoinStarted`
  - `KoinApplication.coroutinesEngine`
  - `Module.includes(lazy)`
  - `lazyModule()`
  - `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - 新的 API，可幫助設計用於 `Verify` API 的動態參數注入

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `androidx.startup.Initializer` API 透過 `AndroidX Startup` 啟動 Koin 的新功能。 `koin-androidx-startup` 內的所有 API 均為實驗性

`koin-compose`
- `rememberKoinModules` - 載入/卸載給定 @Composable 元件的 Koin 模組
- `rememberKoinScope` - 載入/卸載給定 @Composable 元件的 Koin Scope（作用域）
- `KoinScope` - 為所有底層 Composable 子項載入 Koin 作用域

### Deprecation ⚠️

以下 API 已被棄用，不應再使用：

- `koin-test`
  - `checkModules` 的所有 API。 遷移到 `Verify` API。

- `koin-android`
  - ViewModel DSL 有利於 koin-core 中新的集中式 DSL

- `koin-compose-viewmodel`
  - ViewModel DSL 有利於 koin-core 中新的集中式 DSL
  - 函式 `koinNavViewModel` 現在已棄用，建議使用 `koinViewModel`

### Breaking 💥

由於上次里程碑中的棄用，以下 API 已被移除：

:::note
所有使用 `@KoinReflectAPI` 註釋的 API 都已被移除
:::

`koin-core`
  - `ApplicationAlreadyStartedException` 已重新命名為 `KoinApplicationAlreadyStartedException`
  - 已移除 `KoinScopeComponent.closeScope()`，因為不再在內部使用
  - 移動了內部 `ResolutionContext` 以取代 `InstanceContext`
  - 已移除 `KoinPlatformTimeTools`、`Timer`、`measureDuration`，改為使用 Kotlin Time API
  - 已移除 `KoinContextHandler`，改為使用 `GlobalContext`

`koin-android`
  - 所有狀態 ViewModel API 都在錯誤級別被棄用：
    - `stateViewModel()`,`getStateViewModel()`，改為使用 `viewModel()`
    - `getSharedStateViewModel()`, `sharedStateViewModel()`，改為使用 `viewModel()` 或 `activityViewModel()` 作為共享實例
  - 函式 `fun Fragment.createScope()` 已被移除
  - 所有圍繞 ViewModel 工廠的 API（主要在內部）都已針對新的內部結構進行了重新設計

`koin-compose`
  - 舊的 compose API 函式在錯誤級別被棄用：
    - 函式 `inject()` 已被移除，改為使用 `koinInject()`
    - 函式 `getViewModel()` 已被移除，改為使用 `koinViewModel()`
    - 函式 `rememberKoinInject()` 已移至 `koinInject()`
  - 由於不再在內部使用，因此已移除 `StableParametersDefinition`
  - 已移除所有 Lazy ViewModel API - 舊的 `viewModel()`
  - 由於不再在內部使用，因此已移除 `rememberStableParametersDefinition()`

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的函式庫版本都位於 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中

### New 🎉

`koin-core`
  - `KoinContext` 現在具有以下內容：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
  - `koinApplication()` 函式現在使用多種格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
  - `KoinAppDeclaration` 幫助開放宣告樣式
  - `KoinPlatformTimeTools` 使用於 JS 的 API Time
  - iOS - `synchronized` API 使用 Touchlab Lockable API

`koin-androidx-compose`
  - 新的 `KoinAndroidContext` 以從 Android 環境繫結到目前的 Koin 內容

`koin-compose`
  - 新的 `KoinContext` 上下文啟動器與目前的預設上下文

`koin-ktor`
  - 現在對 Ktor 實例使用隔離的上下文 (使用 `Application.getKoin()` 而不是預設上下文)
  - Koin 外掛程式引入新的監控
  - `RequestScope` 允許將作用域實例化到 Ktor 請求

### Experimental 🚧

`koin-android`
  - `ViewModelScope` 引入 ViewModel 作用域的實驗性 API

`koin-core-coroutines` - 引入新的 API 以在背景載入模組

### Deprecation ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API 超級複雜，並且呼叫到預設的全域上下文。 建議堅持使用 Android/Fragment API
  - `resolveViewModelCompat()` 已棄用，建議使用 `resolveViewModel()`

`koin-compose`
  - 函式 `get()` 和 `inject()` 已棄用，建議使用 `koinInject()`
  - 函式 `getViewModel()` 已棄用，建議使用 `koinViewModel()`
  - 函式 `rememberKoinInject()` 已棄用，建議使用 `koinInject()`

### Breaking 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 正在取代 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`
  - 已將屬性 `KoinExtension.koin` 移至函式 `KoinExtension.onRegister()`
  - iOS - `internal fun globalContextByMemoryModel(): KoinContext` 使用 `MutableGlobalContext`

`koin-compose`
  - 函式 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已移除，建議使用 `KoinContext` 和 `KoinAndroidContext`

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### New 🎉

`koin-core`
  - 新的 ExtensionManager API 幫助為 Koin 編寫擴充引擎 - `ExtensionManager` + `KoinExtension`
  - 使用 `parameterArrayOf` 和 `parameterSetOf` 更新參數 API

`koin-test`
  - `Verification` API - 幫助在模組上執行 `verify`。

`koin-android`
  - ViewModel 注入的內部結構
  - 新增 `AndroidScopeComponent.onCloseScope()` 函式回呼

`koin-android-test`
  - `Verification` API - 幫助在模組上執行 `androidVerify()`。

`koin-androidx-compose`
  - 新的 `get()`
  - 新的 `getViewModel()`
  - 新的 Scopes（作用域） `KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - 用於導航的新模組
  - 新的 `koinNavViewModel()`

`koin-compose` - 用於 Compose 的新多平台 API
  - `koinInject`, `rememberKoinInject`
  - `KoinApplication`

### Experimental 🚧

`koin-compose` - 用於 Compose 的新實驗性多平台 API
  - `rememberKoinModules`
  - `KoinScope`, `rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- 函式 `get()` 取代 `inject()` 用法，避免 Lazy 函式
- 函式 `getViewModel()` 取代 `viewModel()` 函式，避免 Lazy 函式

### Breaking 💥

`koin-android`
  - `LifecycleScopeDelegate` 現在已移除

`koin-androidx-compose`
  - 移除 `getStateViewModel` 建議使用 `koinViewModel`