---
title: "发布 & API 兼容性指南"
custom_edit_url: null
---
:::info
本页面提供了 Koin 主要版本的全面概述，详细介绍了我们框架的演变，以帮助您规划升级并保持兼容性。
:::

对于每个版本，文档都将组织成以下几个部分：

- `Kotlin`: 指定用于发布的 Kotlin 版本，确保语言兼容性的清晰度，并使您能够利用最新的 Kotlin 功能。
- `New`: 突出显示了新引入的功能和改进，这些功能和改进增强了功能和开发人员体验。
- `Experimental`: 列出了标记为实验性的 API 和功能。这些都在积极开发中，并会根据社区反馈进行更改。
- `Deprecated`: 标识已标记为弃用的 API 和功能，以及有关推荐替代方案的指南，帮助您为将来的删除做好准备。
- `Breaking`: 详细说明了可能破坏向后兼容性的任何更改，确保您了解迁移期间的必要调整。

这种结构化的方法不仅阐明了每个版本中的增量更改，而且还加强了我们对 Koin 项目中透明度、稳定性和持续改进的承诺。

## 4.0.3

:::note
使用 Kotlin `2.0.21`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 借助这个新版本的 Kotlin，我们受益于新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函数现在使用这个新的 API 在平台上生成真实的 UUID。

`koin-viewmodel`
 - Koin 4.0 引入了新的 ViewModel DSL & API，它们相互共享 Google/Jetbrains KMP API。为了避免在代码库中重复，ViewModel API 现在位于 `koin-core-viewmodel` 和 `koin-core-viewmodel-navigation` 项目中。
 - ViewModel DSL 的导入是 `org.koin.core.module.dsl.*`

给定项目中的以下 API 现在是稳定的。

`koin-core-coroutines` - 所有 API 现在都是稳定的
  - 所有 `lazyModules`
  - `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
  - `waitAllStartJobs`, `runOnKoinStarted`
  - `KoinApplication.coroutinesEngine`
  - `Module.includes(lazy)`
  - `lazyModule()`
  - `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - 新的 API，用于帮助设计 `Verify` API 的动态参数注入

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `androidx.startup.Initializer` API 通过 `AndroidX Startup` 启动 Koin 的新功能。`koin-androidx-startup` 中的所有 API 都是实验性的

`koin-compose`
- `rememberKoinModules` - 加载/卸载给定 @Composable 组件的 Koin 模块
- `rememberKoinScope` - 加载/卸载给定 @Composable 组件的 Koin Scope（作用域）
- `KoinScope` - 为所有底层 Composable 子项加载 Koin 作用域

### Deprecation ⚠️

以下 API 已被弃用，不应再使用：

- `koin-test`
  - `checkModules` 的所有 API。迁移到 `Verify` API。

- `koin-android`
  - ViewModel DSL，支持 koin-core 中新的集中式 DSL

- `koin-compose-viewmodel`
  - ViewModel DSL，支持 koin-core 中新的集中式 DSL
  - 函数 `koinNavViewModel` 现在已弃用，支持 `koinViewModel`

### Breaking 💥

由于上次里程碑中的弃用，以下 API 已被删除：

:::note
所有使用 `@KoinReflectAPI` 注释的 API 都已被删除
:::

`koin-core`
  - `ApplicationAlreadyStartedException` 已重命名为 `KoinApplicationAlreadyStartedException`
  - `KoinScopeComponent.closeScope()` 已删除，因为内部不再使用
  - 移动了内部 `ResolutionContext` 以替换 `InstanceContext`
  - `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已删除，改为使用 Kotlin Time API
  - `KoinContextHandler` 已删除，支持 `GlobalContext`

`koin-android`
  - 所有状态 ViewModel API 都在错误级别被弃用：
    - `stateViewModel()`,`getStateViewModel()`，请改用 `viewModel()`
    - `getSharedStateViewModel()`, `sharedStateViewModel()`，对于共享实例，请改用 `viewModel()` 或 `activityViewModel()`
  - 函数 `fun Fragment.createScope()` 已删除
  - ViewModel 工厂（主要是内部）的所有 API 都已针对新的内部结构进行了重新设计

`koin-compose`
  - 旧的 compose API 函数在错误级别被弃用：
    - 函数 `inject()` 已被删除，支持 `koinInject()`
    - 函数 `getViewModel()` 已被删除，支持 `koinViewModel()`
    - 函数 `rememberKoinInject()` 已移至 `koinInject()`
  - 删除了 `StableParametersDefinition`，因为内部不再使用
  - 删除了所有 Lazy ViewModel API - 旧的 `viewModel()`
  - 删除了 `rememberStableParametersDefinition()`，因为内部不再使用

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中

### New 🎉

`koin-core`
  - `KoinContext` 现在具有以下功能：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
  - `koinApplication()` 函数现在使用多种格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
  - `KoinAppDeclaration` 有助于打开声明样式
  - `KoinPlatformTimeTools` 用于 JS 的 API Time
  - iOS - `synchronized` API 用于 Touchlab Lockable API

`koin-androidx-compose`
  - 新的 `KoinAndroidContext` 从 Android 环境绑定到当前 Koin 上下文

`koin-compose`
  - 新的 `KoinContext` 上下文启动器，带有当前默认上下文

`koin-ktor`
  - 现在为 Ktor 实例使用隔离的上下文（使用 `Application.getKoin()` 而不是默认上下文）
  - Koin 插件引入了新的监控
  - `RequestScope` 允许将作用域实例绑定到 Ktor 请求

### Experimental 🚧

`koin-android`
  - `ViewModelScope` 引入了 ViewModel 作用域的实验性 API

`koin-core-coroutines` - 引入了在后台加载模块的新 API

### Deprecation ⚠️

`koin-android`
  - `getLazyViewModelForClass()` API 非常复杂，并且调用默认的全局上下文。最好坚持使用 Android/Fragment API
  - `resolveViewModelCompat()` 已弃用，支持 `resolveViewModel()`

`koin-compose`
  - 函数 `get()` 和 `inject()` 已弃用，支持 `koinInject()`
  - 函数 `getViewModel()` 已弃用，支持 `koinViewModel()`
  - 函数 `rememberKoinInject()` 已弃用，支持 `koinInject()`

### Breaking 💥

`koin-core`
  - `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 正在替换 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`
  - 将属性 `KoinExtension.koin` 移动到函数 `KoinExtension.onRegister()`
  - iOS - `internal fun globalContextByMemoryModel(): KoinContext` 使用 `MutableGlobalContext`

`koin-compose`
  - 函数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)` 已删除，支持 `KoinContext`, 和 `KoinAndroidContext`

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### New 🎉

`koin-core`
  - 新的 ExtensionManager API，用于帮助为 Koin 编写扩展引擎 - `ExtensionManager` + `KoinExtension`
  - 使用 `parameterArrayOf` 和 `parameterSetOf` 更新参数 API

`koin-test`
  - `Verification` API - 帮助在模块上运行 `verify`。

`koin-android`
  - ViewModel 注入的内部结构
  - 添加 `AndroidScopeComponent.onCloseScope()` 函数回调

`koin-android-test`
  - `Verification` API - 帮助在模块上运行 `androidVerify()`。

`koin-androidx-compose`
  - 新的 `get()`
  - 新的 `getViewModel()`
  - 新的作用域 `KoinActivityScope`, `KoinFragmentScope`

`koin-androidx-compose-navigation` - 用于导航的新模块
  - 新的 `koinNavViewModel()`

`koin-compose` - 用于 Compose 的新多平台 API
  - `koinInject`, `rememberKoinInject`
  - `KoinApplication`

### Experimental 🚧

`koin-compose` - 用于 Compose 的新实验性多平台 API
  - `rememberKoinModules`
  - `KoinScope`, `rememberKoinScope`

### Deprecation ⚠️

`koin-compose`
- 函数 `get()` 用于替换 `inject()` 的使用，避免 Lazy 函数
- 函数 `getViewModel()` 用于替换 `viewModel()` 函数，避免 Lazy 函数

### Breaking 💥

`koin-android`
  - `LifecycleScopeDelegate` is now removed

`koin-androidx-compose`
  - Removed `getStateViewModel` in favor of `koinViewModel`