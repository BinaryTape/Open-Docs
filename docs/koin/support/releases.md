---
title: 版本发布与 API 升级指南
custom_edit_url: null
---

:::info
本页面全面概述了 Koin 的每次主要版本发布，详细阐述了我们框架的演进，以帮助您规划升级并保持兼容性。
:::

对于每个版本，文档结构如下：

- `Kotlin`: 指定该版本使用的 Kotlin 版本，确保语言兼容性清晰，并使您能够利用最新的 Kotlin 特性。
- `New`: 突出新引入的特性和改进，这些改进增强了功能性并提升了开发者体验。
- `Experimental`: 列出标记为实验性的 API 和特性。这些功能正在积极开发中，并可能根据社区反馈进行更改。
- `Deprecated`: 识别已标记为废弃的 API 和特性，并提供关于推荐替代方案的指导，帮助您为未来的移除做准备。
- `Breaking`: 详细说明任何可能破坏向后兼容性的更改，确保您在迁移过程中了解必要的调整。

这种结构化方法不仅阐明了每个版本中的增量变化，也强化了我们在 Koin 项目中对透明度、稳定性与持续改进的承诺。

关于 [Api 稳定性契约](api-stability.md) 的更多详情请参见。

## 4.1.1

:::note
使用 Kotlin `2.1.21`
:::

### 新增 🎉

`koin-compose-viewmodel-navigation`
- 增强了 `sharedKoinViewModel`，为其添加可选的 `navGraphRoute` 形参，以更好地支持 Compose Navigation。

`koin-core`
- 核心解析器性能优化 – 避免单作用域解析中不必要的扁平化。
- 增强了作用域调试功能，支持显示链式作用域 ID。

### 库更新 📚

- **Kotlin** 2.1.21 (from 2.1.20)
- **Ktor** 3.2.3 (from 3.1.3)
- **Jetbrains Compose** 1.8.2 (from 1.8.0)
- **AndroidX**: Fragment 1.8.9, WorkManager 2.10.3, Lifecycle 2.9.3, Navigation 2.9.3
- **Testing**: Robolectric 4.15.1, Benchmark 0.4.14
- **Build**: Binary Validator 0.18.1, NMCP 1.1.0

### 错误修复 🐛

`koin-core`
- 还原了导致兼容性错误的 logger 约束。
- 修复了 Compose 作用域解析问题，改进了 `LocalKoinApplication`/`LocalKoinScope` 的上下文处理。

`koin-build`
- 修复了 Maven Central 发布问题。

## 4.1.0

:::note
使用 Kotlin `2.1.20`
:::

### 新增 🎉

`koin-core`
- 配置 - `KoinConfiguration` API 旨在帮助封装配置。
- 作用域 - 引入了一种新的**作用域原型 (Scope Archetype)**，用于针对作用域类别的专用作用域类型限定符。实例解析现在可以针对作用域类别（即原型）进行。
- 特性选项 - “特性选项 (Feature Option)”旨在帮助在 Koin 内部进行特性标记新特性行为。您可以通过 Koin 配置中的 `options` 代码块激活一个选项：
```kotlin
startKoin {
    options(
        // 激活一个新特性
        viewModelScopeFactory()
    )
}
```
- 核心 - 引入新的 `CoreResolver`，它允许 `ResolutionExtension` 帮助 Koin 在外部系统或资源中解析（它用于帮助连接 Ktor DI）。

`koin-android`
- 升级后的库（`androidx.appcompat:appcompat:1.7.0`、`androidx.activity:activity-ktx:1.10.1`）要求将最低 SDK 级别从 14 提高到 21。
- DSL - 添加了新的 Koin 模块 DSL 扩展 `activityScope`、`activityRetainedScope` 和 `fragmentScope`，以在 Activity/Fragment 中声明作用域。
- 作用域函数 - `activityScope()`、`activityRetainedScope()` 和 `fragmentScope()` API 函数现在也触发作用域原型。

`koin-androidx-compose`
- 与 Koin Compose 多平台以及所有 Compose 1.8 & Lifecycle 2.9 对齐。

`koin-compose`
- 与 Compose 1.8 & Lifecycle 2.9 对齐。
- 新增函数 - `KoinApplicationPreview` 帮助在 Android Studio 和 IntelliJ 中渲染并行预览。

`koin-compose-viewmodel`
- 添加了 `koinActivityViewModel`，允许将父 Activity 设置为主机。

`koin-ktor`
- 多平台 - 该模块现在以 Kotlin KMP 格式编译。您可以从多平台项目中使用 `koin-ktor`。
- 合并 - 先前的 `koin-ktor3` 模块已合并到 `koin-ktor` 中。
- 扩展 - 引入了 `Application.koinModule { }` 和 `Application.koinModules()`，允许您直接将 Koin 模块声明到 Ktor 模块中。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- 作用域 - `Module.requestScope` - 允许在 Ktor 请求作用域内声明定义（避免手动声明 `scope<RequestScope>`）。
注入的作用域也允许在构造函数中注入 `ApplicationCall`。

`koin-core-coroutines`
- 模块 DSL - 引入新的 `ModuleConfiguration`，以帮助将模块配置集中到一个结构中，便于后续更好地验证。
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
- 配置 DSL - Koin 配置现在可以使用 `ModuleConfiguration` 来加载模块：
```kotlin
startKoin {
    moduleConfiguration {
        modules(m1)
        lazyModules(lm1)
    }
}

// 或者
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

startKoin {
    moduleConfiguration(conf)
}
```

`koin-test-coroutines`
- 新增 `koin-test-coroutines` Koin 模块，以引入与协程相关的新测试 API。
- 扩展 - 扩展 Verify API，让您可以使用 `moduleConfiguration` 检测 Koin 配置，然后验证模块/惰性模块 (Lazy Modules) 的混合配置：
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// 如果您需要 Android 类型（koin-android-test）
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- 注解 - `@InjectedParam` 或 `@Provided` 用于标记一个属性，使其被视为注入形参或动态提供。目前用于 `Verify` API，但未来可能用于更轻量级的 DSL 声明。

### 实验性 🚧

`koin-core`
- Wasm - 使用 Kotlin 2.1.20 UUID 生成。

`koin-core-viewmodel`
- DSL - 添加了模块 DSL 扩展 `viewModelScope`，以声明作用域为 ViewModel 作用域原型 (ViewModel scope archetype) 的组件。
- 作用域函数 - 添加了函数 `viewModelScope()`，为 ViewModel 创建作用域（绑定到 ViewModel 类）。此 API 现在使用 `ViewModelScopeAutoCloseable` 来利用 `AutoCloseable` API 帮助声明和关闭作用域。不再需要手动关闭 ViewModel 作用域。
- 类 - 更新了 `ScopeViewModel` 类，以支持即用型 ViewModel 作用域类（处理作用域创建和关闭）。
- 特性选项 - 使用 ViewModel 作用域的构造函数 ViewModel 注入，需要激活 Koin 选项 `viewModelScopeFactory`：
```kotlin
startKoin {
    options(
        // 激活一个新的 ViewModel 作用域创建
        viewModelScopeFactory()
    )
}

// 将从 MyScopeViewModel 的作用域中注入 Session
class MyScopeViewModel(val session: Session) : ViewModel()

module {
    viewModelOf(::MyScopeViewModel)
    viewModelScope {
        scopedOf(::Session)
    }
}
```

`koin-compose`
- Compose 函数 - 添加了新的 `KoinMultiplatformApplication` 函数，尝试提出一个多平台 Compose 入口点。

`koin-core-viewmodel-navigation`
- 导航扩展 - 添加了 `sharedViewModel`，以从导航的 `NavbackEntry` 重用 ViewModel 实例。

`koin-test`
- 注解 - Koin 配置验证 API `Verify` 现在帮助您检测可空、惰性 (lazy) 和列表形参。只需使用 `@InjectedParam` 或 `@Provided` 标记一个属性，使其被视为注入形参或动态提供。这避免了 Verify API 中的复杂声明。
```kotlin
// 现在在 Verify 中被检测到
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### 废弃 ⚠️

`koin-android`
- `ScopeViewModel` 现已废弃，请改用 `koin-core-viewmodel` 中的 `ScopeViewModel` 类。

`koin-compose`
- Compose 上下文 API 不再需要，因为 Koin 上下文已在当前默认上下文中正确准备。以下 API 已废弃，可以移除：`KoinContext`。

`koin-androidx-compose`
- Jetpack Compose 上下文 API 不再需要，因为 Koin 上下文已在当前默认上下文中正确准备。以下 API 已废弃，可以移除：`KoinAndroidContext`。

`koin-androidx-compose-navigation`
- 由于生命周期库更新，函数 `koinNavViewModel` 不再需要，可替换为 `koinViewModel`。

`koin-core-viewmodel-navigation`
- 由于生命周期库更新，函数 `koinNavViewModel` 不再需要，可替换为 `koinViewModel`。

`koin-ktor`
- 扩展 - `Application.koin` 现已废弃，请改用 `Application.koinModules` 和 `Application.koinModule`。

### 破坏性变更 💥

`koin-android`
- 所有旧的状态 ViewModel API 现已移除：
    - `stateViewModel()`、`getStateViewModel()`，请改用 `viewModel()`。
    - `getSharedStateViewModel()`、`sharedViewModel()`，请改用 `viewModel()` 或 `activityViewModel()` 获取共享实例。

`koin-compose`
- 旧的 Compose API 函数已移除：
    - 函数 `inject()` 已被移除，倾向于 `koinInject()`。
    - 函数 `getViewModel()` 已被移除，倾向于 `koinViewModel()`。
    - 函数 `rememberKoinInject()` 已移至 `koinInject()`。
- 函数 `rememberKoinApplication` 已被标记为 `@KoinInternalAPI`。

## 4.0.4

:::note
使用 Kotlin `2.0.21`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中。

### 新增 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 借助此新版本的 Kotlin，我们受益于新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函数现在使用此新 API 在跨平台上生成真实的 UUID。

`koin-viewmodel`
- Koin 4.0 引入了 ViewModel DSL 和 API，这些 API 统一了 Google/Jetbrains KMP API。为了避免代码库中的重复，ViewModel API 现在位于 `koin-core-viewmodel` 和 `koin-core-viewmodel-navigation` 项目中。
- ViewModel DSL 的导入是 `org.koin.core.module.dsl.*`。

以下给定项目中的 API 现已稳定。

`koin-core-coroutines` - 所有 API 现已稳定
- 所有 `lazyModules`
- `awaitAllStartJobs`、`onKoinStarted`、`isAllStartedJobsDone`
- `waitAllStartJobs`、`runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### 实验性 🚧

`koin-test`
- `ParameterTypeInjection` - 新 API，用于帮助设计 `Verify` API 的动态形参注入。

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `AndroidX Startup`（通过 `androidx.startup.Initializer` API）启动 Koin 的新能力。`koin-androidx-startup` 中的所有 API 都是实验性的。

`koin-compose`
- `rememberKoinModules` - 根据 `@Composable` 组件加载/卸载 Koin 模块。
- `rememberKoinScope` - 根据 `@Composable` 组件加载/卸载 Koin Scope。
- `KoinScope` - 为所有底层 Composable 子组件加载 Koin 作用域。

### 废弃 ⚠️

以下 API 已被废弃，不应再使用：

- `koin-test`
    - 所有 `checkModules` 的 API。请迁移到 `Verify` API。

- `koin-android`
    - ViewModel DSL，倾向于 `koin-core` 中新的集中式 DSL。
    - 所有状态 ViewModel API 在错误级别上已废弃：
        - `stateViewModel()`、`getStateViewModel()`，请改用 `viewModel()`。
        - `getSharedViewModel()`、`sharedViewModel()`，请改用 `viewModel()` 或 `activityViewModel()` 获取共享实例。

`koin-compose`
- 旧的 Compose API 函数在错误级别上已废弃：
    - 函数 `inject()` 已废弃（错误级别），倾向于 `koinInject()`。
    - 函数 `getViewModel()` 已废弃（错误级别），倾向于 `koinViewModel()`。
    - 函数 `rememberKoinInject()` 已废弃（错误级别），倾向于 `koinInject()`。

- `koin-compose-viewmodel`
    - ViewModel DSL，倾向于 `koin-core` 中新的集中式 DSL。
    - 函数 `koinNavViewModel` 现已废弃，倾向于 `koinViewModel`。

### 破坏性变更 💥

以下 API 因上一个里程碑中的废弃已被移除：

:::note
所有使用 `@KoinReflectAPI` 注解的 API 都已被移除。
:::

`koin-core`
- `ApplicationAlreadyStartedException` 已重命名为 `KoinApplicationAlreadyStartedException`。
- `KoinScopeComponent.closeScope()` 已移除，因为它在内部不再使用。
- 内部 `ResolutionContext` 已移至替换 `InstanceContext`。
- `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已移除，转而使用 Kotlin Time API。
- `KoinContextHandler` 已移除，倾向于 `GlobalContext`。

`koin-android`
- 函数 `fun Fragment.createScope()` 已移除。
- 所有围绕 ViewModel 工厂的 API（主要是内部）都为新的内部机制进行了重构。

`koin-compose`
- 移除了 `StableParametersDefinition`，因为它在内部不再使用。
- 移除了所有 Lazy ViewModel API - 旧的 `viewModel()`。
- 移除了 `rememberStableParametersDefinition()`，因为它在内部不再使用。

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中。

### 新增 🎉

`koin-core`
- `KoinContext` 现在包含以下内容：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 函数现在支持多种格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- `KoinAppDeclaration` 用于帮助开放声明样式。
- `KoinPlatformTimeTools` 用于 JS 的 API Time。
- iOS - `synchronized` API 用于 Touchlab Lockable API。

`koin-androidx-compose`
- 新的 `KoinAndroidContext`，用于从 Android 环境绑定到当前的 Koin 上下文。

`koin-compose`
- 新的 `KoinContext` 上下文启动器，带当前的默认上下文。

`koin-ktor`
- 现在为 Ktor 实例使用隔离的上下文（使用 `Application.getKoin()` 而非默认上下文）。
- Koin 插件引入了新的监控功能。
- `RequestScope` 允许 Ktor 请求的作用域实例。

### 实验性 🚧

`koin-android`
- `ViewModelScope` 引入了 ViewModel 作用域的实验性 API。

`koin-core-coroutines` - 引入新 API 以在后台加载模块。

### 废弃 ⚠️

`koin-android`
- `getLazyViewModelForClass()` API 非常复杂，并会调用默认的全局上下文。建议坚持使用 Android/Fragment API。
- `resolveViewModelCompat()` 已废弃，倾向于 `resolveViewModel()`。

`koin-compose`
- 函数 `get()` 和 `inject()` 已废弃，倾向于 `koinInject()`。
- 函数 `getViewModel()` 已废弃，倾向于 `koinViewModel()`。
- 函数 `rememberKoinInject()` 已废弃，倾向于 `koinInject()`。

### 破坏性变更 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 替换了 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`。
- 属性 `KoinExtension.koin` 已移至函数 `KoinExtension.onRegister()`。
- iOS - `internal fun globalContextByMemoryModel(): KoinContext` 用于使用 `MutableGlobalContext`。

`koin-compose`
- 函数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已移除，倾向于 `KoinContext` 和 `KoinAndroidContext`。

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### 新增 🎉

`koin-core`
- 新的 ExtensionManager API，用于帮助为 Koin 编写扩展引擎 - `ExtensionManager` + `KoinExtension`。
- Parameters API 更新，新增 `parameterArrayOf` 和 `parameterSetOf`。

`koin-test`
- `Verification` API - 帮助在模块上运行 `verify`。

`koin-android`
- ViewModel 注入的内部机制。
- 添加 `AndroidScopeComponent.onCloseScope()` 函数回调。

`koin-android-test`
- `Verification` API - 帮助在模块上运行 `androidVerify()`。

`koin-androidx-compose`
- 新增 `get()`
- 新增 `getViewModel()`
- 新增 Scopes `KoinActivityScope`、`KoinFragmentScope`

`koin-androidx-compose-navigation` - 用于导航的新模块
- 新增 `koinNavViewModel()`

`koin-compose` - 用于 Compose 的新多平台 API
- `koinInject`、`rememberKoinInject`
- `KoinApplication`

### 实验性 🚧

`koin-compose` - 用于 Compose 的新实验性多平台 API
- `rememberKoinModules`
- `KoinScope`、`rememberKoinScope`

### 废弃 ⚠️

`koin-compose`
- 函数 `get()` 替换 `inject()` 的用法，避免 Lazy 函数。
- 函数 `getViewModel()` 替换 `viewModel()` 函数的用法，避免 Lazy 函数。

### 破坏性变更 💥

`koin-android`
- `LifecycleScopeDelegate` 现已移除。

`koin-androidx-compose`
- 移除 `getStateViewModel`，倾向于 `koinViewModel`。