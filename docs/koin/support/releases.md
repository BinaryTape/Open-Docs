---
title: 版本发布与 API 兼容性指南
custom_edit_url: null
---

:::info
本页面全面概述了 Koin 的每次主要版本发布，详细阐述了我们框架的演变，以帮助您规划升级并保持兼容性。
:::

每个版本文档的结构如下：

- `Kotlin`: 指定该版本使用的 Kotlin 版本，确保语言兼容性清晰，并使您能够利用最新的 Kotlin 特性。
- `New`: 突出新引入的功能和改进，这些改进增强了功能性并提升了开发者体验。
- `Experimental`: 列出标记为实验性的 API 和功能。这些功能正在积极开发中，并可能根据社区反馈进行更改。
- `Deprecated`: 识别已标记为废弃的 API 和功能，并提供关于推荐替代方案的指导，帮助您为未来的移除做好准备。
- `Breaking`: 详细说明任何可能破坏向后兼容性的更改，确保您在迁移过程中了解必要的调整。

这种结构化方法不仅阐明了每个版本中的增量变化，也强化了我们在 Koin 项目中对透明度、稳定性与持续改进的承诺。

## 4.0.3

:::note
使用 Kotlin `2.0.21`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中。

### 新增 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 借助此新版本的 Kotlin，我们受益于新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函数现在使用此新 API 在跨平台上生成真实的 UUID。

`koin-viewmodel`
 - Koin 4.0 引入了新的 ViewModel DSL 和 API，这些 API 统一了 Google/Jetbrains KMP API。为了避免代码库中的重复，ViewModel API 现在位于 `koin-core-viewmodel` 和 `koin-core-viewmodel-navigation` 项目中。
 - ViewModel DSL 的导入是 `org.koin.core.module.dsl.*`

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
- `ParameterTypeInjection` - 新 API，用于帮助设计 `Verify` API 的动态参数注入

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `AndroidX Startup`（通过 `androidx.startup.Initializer` API）启动 Koin 的新能力。`koin-androidx-startup` 中的所有 API 都是实验性的。

`koin-compose`
- `rememberKoinModules` - 根据 `@Composable` 组件加载/卸载 Koin 模块
- `rememberKoinScope` - 根据 `@Composable` 组件加载/卸载 Koin Scope
- `KoinScope` - 为所有底层 Composable 子组件加载 Koin 作用域

### 废弃 ⚠️

以下 API 已被废弃，不应再使用：

- `koin-test`
  - 所有 `checkModules` 的 API。请迁移到 `Verify` API。

- `koin-android`
  - ViewModel DSL，倾向于 `koin-core` 中新的集中式 DSL

- `koin-compose-viewmodel`
  - ViewModel DSL，倾向于 `koin-core` 中新的集中式 DSL
  - 函数 `koinNavViewModel` 现已废弃，倾向于 `koinViewModel`

### 破坏性变更 💥

以下 API 因上一个里程碑中的废弃已被移除：

:::note
所有使用 `@KoinReflectAPI` 注解的 API 都已被移除
:::

`koin-core`
  - `ApplicationAlreadyStartedException` 已重命名为 `KoinApplicationAlreadyStartedException`
  - `KoinScopeComponent.closeScope()` 已移除，因为它在内部不再使用
  - 内部 `ResolutionContext` 已移至替换 `InstanceContext`
  - `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已移除，转而使用 Kotlin Time API
  - `KoinContextHandler` 已移除，倾向于 `GlobalContext`

`koin-android`
  - 所有状态 ViewModel API 在错误级别上已废弃：
    - `stateViewModel()`、`getStateViewModel()`，请改用 `viewModel()`
    - `getSharedStateViewModel()`、`sharedStateViewModel()`，请改用 `viewModel()` 或 `activityViewModel()` 获取共享实例
  - 函数 `fun Fragment.createScope()` 已移除
  - 所有围绕 ViewModel 工厂的 API（主要是内部）都为新的内部机制进行了重构

`koin-compose`
  - 旧的 Compose API 函数在错误级别上已废弃：
    - 函数 `inject()` 已移除，倾向于 `koinInject()`
    - 函数 `getViewModel()` 已移除，倾向于 `koinViewModel()`
    - 函数 `rememberKoinInject()` 已移至 `koinInject()`
  - 移除 `StableParametersDefinition`，因为它在内部不再使用
  - 移除所有 Lazy ViewModel API - 旧的 `viewModel()`
  - 移除 `rememberStableParametersDefinition()`，因为它在内部不再使用

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
  - `KoinAppDeclaration` 用于帮助开放声明样式
  - `KoinPlatformTimeTools` 用于 JS 的 API Time
  - iOS - `synchronized` API 用于 Touchlab Lockable API

`koin-androidx-compose`
  - 新的 `KoinAndroidContext`，用于从 Android 环境绑定到当前的 Koin 上下文

`koin-compose`
  - 新的 `KoinContext` 上下文启动器，带当前的默认上下文

`koin-ktor`
  - 现在为 Ktor 实例使用隔离的上下文（使用 `Application.getKoin()` 而非默认上下文）
  - Koin 插件引入了新的监控功能
  - `RequestScope` 允许 Ktor 请求的作用域实例

### 实验性 🚧

`koin-android`
  - `ViewModelScope` 引入了 ViewModel 作用域的实验性 API

`koin-core-coroutines` - 引入新 API 以在后台加载模块

### 废弃 ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API 非常复杂，并会调用默认的全局上下文。建议坚持使用 Android/Fragment API
  - `resolveViewModelCompat()` 已废弃，倾向于 `resolveViewModel()`

`koin-compose`
  - 函数 `get()` 和 `inject()` 已废弃，倾向于 `koinInject()`
  - 函数 `getViewModel()` 已废弃，倾向于 `koinViewModel()`
  - 函数 `rememberKoinInject()` 已废弃，倾向于 `koinInject()`

### 破坏性变更 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 替换了 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`
  - 属性 `KoinExtension.koin` 已移至函数 `KoinExtension.onRegister()`
  - iOS - `internal fun globalContextByMemoryModel(): KoinContext` 用于使用 `MutableGlobalContext`

`koin-compose`
  - 函数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已移除，倾向于 `KoinContext` 和 `KoinAndroidContext`

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### 新增 🎉

`koin-core`
  - 新的 ExtensionManager API，用于帮助为 Koin 编写扩展引擎 - `ExtensionManager` + `KoinExtension`
  - Parameters API 更新，新增 `parameterArrayOf` 和 `parameterSetOf`

`koin-test`
  - `Verification` API - 帮助在模块上运行 `verify`。

`koin-android`
  - ViewModel 注入的内部机制
  - 添加 `AndroidScopeComponent.onCloseScope()` 函数回调

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
- 函数 `get()` 替换 `inject()` 的用法，避免 Lazy 函数
- 函数 `getViewModel()` 替换 `viewModel()` 函数的用法，避免 Lazy 函数

### 破坏性变更 💥

`koin-android`
  - `LifecycleScopeDelegate` 现已移除

`koin-androidx-compose`
  - 移除 `getStateViewModel`，倾向于 `koinViewModel`