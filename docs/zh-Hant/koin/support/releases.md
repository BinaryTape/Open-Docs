---
title: 版本與 API 升級指南
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

更多細節請參閱 [Api 穩定性契約](api-stability.md)。

## 4.1.1

### 新功能 🎉

`koin-ktor`
- 整合 – 提供 `KtorDIExtension` 以整合 Ktor 3.2 預設的 DI 引擎
```kotlin
fun Application.setupDatabase(config: DbConfig) {
    // ...
    dependencies {
        provide<Database> { database }
    }
}

class CustomerRepositoryImpl(private val database: Database) : CustomerRepository
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```

## 4.1.0

:::note
使用 Kotlin `2.1.20`
:::

### 新功能 🎉

`koin-core`
- 配置 – `KoinConfiguration` API 協助封裝配置。
- 作用域 – 引入新的 *作用域原型 (Scope Archetype)*，即為作用域類別引入專用的作用域類型限定符。實例解析現在可以根據作用域類別（亦稱為原型）進行。
- 功能選項 – 「功能選項」可協助為 Koin 內部的新功能行為設定功能標記。您可以在 Koin 配置中使用 `options` 區塊來啟用選項：
```kotlin
startKoin {
    options(
        // activate a new feature
        viewModelScopeFactory()
    )
}
```
- 核心 – 引入新的 `CoreResolver`，允許 `ResolutionExtension` 協助 Koin 在外部系統或資源中進行解析（用於協助連接 Ktor DI）。

`koin-android`
- 升級後的函式庫（`androidx.appcompat:appcompat:1.7.0`、`androidx.activity:activity-ktx:1.10.1`）要求將最低 SDK 等級從 14 提高到 21。
- DSL – 新增 Koin 模組 DSL 擴充功能 `activityScope`、`activityRetainedScope` 和 `fragmentScope`，以在 Activity/Fragment 中宣告作用域。
- 作用域函數 – `activityScope()`、`activityRetainedScope()` 和 `fragmentScope()` API 函數現在也會觸發作用域原型。

`koin-androidx-compose`
- 與 Koin Compose 多平台及所有 Compose 1.8 和 Lifecycle 2.9 對齊。

`koin-compose`
- 與 Compose 1.8 和 Lifecycle 2.9 對齊。
- 新函數 – `KoinApplicationPreview` 可協助在 Android Studio 和 IntelliJ 中渲染平行預覽。

`koin-compose-viewmodel`
- 新增 `koinActivityViewModel`，以允許將父級 Activity 設定為主機。

`koin-ktor`
- 多平台 – 該模組現在以 Kotlin KMP 格式編譯。您可以從多平台專案中指向 `koin-ktor`。
- 合併 – 先前的 `koin-ktor3` 模組已合併到 `koin-ktor` 中。
- 擴充功能 – 引入 `Application.koinModule { }` 和 `Application.koinModules()`，讓您可以直接將 Koin 模組宣告與 Ktor 模組連接。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- 作用域 – `Module.requestScope` – 允許在 Ktor 請求作用域內宣告定義（避免手動宣告 `scope<RequestScope>`）。
注入的作用域也允許在建構函式中注入 `ApplicationCall`。

`koin-core-coroutines`
- 模組 DSL – 引入新的 `ModuleConfiguration`，協助將模組配置匯集到一個結構中，以便稍後更好地驗證。
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
- 配置 DSL – Koin 配置現在可以使用 `ModuleConfiguration` 來載入模組：
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// or even
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- 新增 `koin-test-coroutines` Koin 模組，以引入與協程相關的新測試 API。
- 擴充功能 – 擴展 Verify API，讓您可以透過 `moduleConfiguration` 檢查 Koin 配置，然後驗證模組/惰性模組的混合配置：
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// if you want Android types (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- 註解 – `@InjectedParam` 或 `@Provided` 用於標記一個屬性，使其被視為注入參數或動態提供。目前用於 `Verify` API，但未來可能用於協助更輕量的 DSL 宣告。

### 實驗性功能 🚧

`koin-core`
- Wasm – 使用 Kotlin 2.1.20 UUID 生成。

`koin-core-viewmodel`
- DSL – 新增模組 DSL 擴充功能 `viewModelScope`，以宣告作用域限定為 ViewModel 作用域原型的組件。
- 作用域函數 – 新增函數 `viewModelScope()`，用於為 ViewModel 建立作用域（綁定到 ViewModel 類別）。此 API 現在使用 `ViewModelScopeAutoCloseable` 以利用 `AutoCloseable` API 協助宣告和關閉作用域，不再需要手動關閉 ViewModel 作用域。
- 類別 – 更新了 `ScopeViewModel` 類別，以支援一個即用型 ViewModel 作用域類別（處理作用域的建立和關閉）。
- 功能選項 – 使用 ViewModel 作用域進行建構函式 ViewModel 注入，需要啟用 Koin 選項 `viewModelScopeFactory`：
```kotlin
startKoin {
    options(
        // activate a new ViewModel scope creation
        viewModelScopeFactory()
    )
}

// will inject Session from MyScopeViewModel's scope
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose 函數 – 新增函數 `KoinMultiplatformApplication`，嘗試提出一個多平台 Compose 入口點。

`koin-core-viewmodel-navigation`
- 導航擴充功能 – 新增 `sharedViewModel` 以從導航的 NavbackEntry 重用 ViewModel 實例。

`koin-test`
- 註解 – Koin 配置驗證 API `Verify` 現在可協助您檢查可空、惰性及列表參數。只需使用 `@InjectedParam` 或 `@Provided` 標記一個屬性，使其被視為注入參數或動態提供。這避免了 Verify API 中複雜的宣告。
```kotlin
// now detected in Verify
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### 棄用 ⚠️

`koin-android`
- `ScopeViewModel` 現已棄用，應改用 `koin-core-viewmodel` 的 `ScopeViewModel` 類別。

`koin-compose`
- Compose context API 不再需要，因為 Koin context 已在當前預設 context 上正確準備。以下已棄用並可移除：`KoinContext`。

`koin-androidx-compose`
- Jetpack Compose context API 不再需要，因為 Koin context 已在當前預設 context 上正確準備。以下已棄用並可移除：`KoinAndroidContext`。

`koin-androidx-compose-navigation`
- 由於 lifecycle 函式庫更新，函數 `koinNavViewModel` 不再需要，可替換為 `koinViewModel`。

`koin-core-viewmodel-navigation`
- 由於 lifecycle 函式庫更新，函數 `koinNavViewModel` 不再需要，可替換為 `koinViewModel`。

`koin-ktor`
- 擴充功能 – `Application.koin` 現已棄用，應改用 `Application.koinModules` 和 `Application.koinModule`。

### 破壞性變更 💥

`koin-android`
- 所有舊的狀態 ViewModel API 現已移除：
    - `stateViewModel()`、`getStateViewModel()`，請改用 `viewModel()`
    - `getSharedStateViewModel()`、`sharedStateViewModel()`，請改用 `viewModel()` 或 `activityViewModel()` 來取得共享實例

`koin-compose`
- 舊的 Compose API 函數已移除：
    - 函數 `inject()` 已移除，轉而使用 `koinInject()`
    - 函數 `getViewModel()` 已移除，轉而使用 `koinViewModel()`
    - 函數 `rememberKoinInject()` 已移入 `koinInject()`，
- 函數 `rememberKoinApplication` 已標記為 `@KoinInternalAPI`

## 4.0.4

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
    - 所有狀態 ViewModel API 均已在錯誤級別棄用：
        - `stateViewModel()`、`getStateViewModel()`，請改用 `viewModel()`
        - `getSharedStateViewModel()`、`sharedStateViewModel()`，請改用 `viewModel()` 或 `activityViewModel()` 來取得共享實例

`koin-compose`
- 舊的 Compose API 函數已在錯誤級別棄用：
    - 函數 `inject()` 已棄用（錯誤級別），轉而使用 `koinInject()`
    - 函數 `getViewModel()` 已棄用（錯誤級別），轉而使用 `koinViewModel()`
    - 函數 `rememberKoinInject()` 已棄用（錯誤級別），轉而使用 `koinInject()`，

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
- 函數 `fun Fragment.createScope()` 已移除
- 所有關於 ViewModel 工廠的 API (主要為內部) 已針對新的內部結構進行重寫

`koin-compose`
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