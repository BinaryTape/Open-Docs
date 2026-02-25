---
title: 版本与 API 升级指南
custom_edit_url: null
---

:::info
本页面全面概述了每个 Koin 主要版本，详细介绍了我们框架的演进，以帮助您规划升级并保持兼容性。
:::

对于每个版本，文档分为以下几个部分：

- `Kotlin`：指定该版本所使用的 Kotlin 版本，确保语言兼容性清晰，并使您能够利用最新的 Kotlin 功能。
- `New`：突出显示新引入的功能和改进，这些内容增强了功能性并提升了开发体验。
- `Experimental`：列出标记为实验性的 API 和功能。这些功能目前处于活跃开发中，可能会根据社区反馈进行更改。
- `Deprecated`：标识已标记为弃用的 API 和功能，并提供推荐替代方案的指南，帮助您为未来的移除做好准备。
- `Breaking`：详细说明任何可能破坏向后兼容性的更改，确保您了解迁移期间必要的调整。

这种结构化方法不仅阐明了每个版本中的增量更改，还加强了我们在 Koin 项目中对透明度、稳定性以及持续改进的承诺。

有关更多详细信息，请参阅 [Api Stability Contract](api-stability.md)。

## 4.1.1

:::note
使用 Kotlin `2.1.21`
:::

### New 🎉

`koin-compose-viewmodel-navigation`
- 通过可选的 `navGraphRoute` 参数增强了 `sharedKoinViewModel`，以提供更好的 Compose Navigation 支持。

`koin-core`
- 核心解析器性能优化 - 通过单作用域解析避免不必要的扁平化。
- 通过显示关联的作用域 ID 增强了作用域调试。

### Library Updates 📚

- **Kotlin** 2.1.21（从 2.1.20 升级）
- **Ktor** 3.2.3（从 3.1.3 升级） 
- **Jetbrains Compose** 1.8.2（从 1.8.0 升级）
- **AndroidX**：Fragment 1.8.9, WorkManager 2.10.3, Lifecycle 2.9.3, Navigation 2.9.3
- **Testing**：Robolectric 4.15.1, Benchmark 0.4.14
- **Build**：Binary Validator 0.18.1, NMCP 1.1.0

### Bug Fixes 🐛

`koin-core`
- 还原了导致兼容性错误的记录器约束。
- 修复了 Compose 作用域解析，改进了 `LocalKoinApplication`/`LocalKoinScope` 上下文处理。

`koin-build`
- 修复了 Maven Central 发布问题。

## 4.1.0

:::note
使用 Kotlin `2.1.20`
:::

### New 🎉

`koin-core`
- Configuration - 引入 `KoinConfiguration` API 以帮助包装配置。
- Scope - 为作用域类别引入了专用作用域类型限定符的新 *Scope Archetype*。现在可以针对作用域类别（即 Archetype）进行实例解析。
- Feature Option - “Feature Option” 旨在帮助在 Koin 内部对新功能行为进行特性切换（feature flag）。您可以通过 Koin 配置中的 `options` 代码块激活选项：
```kotlin
startKoin {
    options(
        // 激活一个新功能
        viewModelScopeFactory()
    )
}
```
- Core - 引入了新的 `CoreResolver`，允许 `ResolutionExtension` 帮助 Koin 在外部系统或资源中进行解析（用于帮助连接 Ktor 注入）。

`koin-android`
- 升级的库（`androidx.appcompat:appcompat:1.7.0`，`androidx.activity:activity-ktx:1.10.1`）要求将最低 SDK 级别从 14 提高到 21。
- DSL - 添加了新的 Koin 模块 DSL 扩展程序 `activityScope`、`activityRetainedScope` 和 `fragmentScope`，用于在 Activity/Fragment 内声明作用域。
- Scope Functions - `activityScope()`、`activityRetainedScope()` 和 `fragmentScope()` API 函数现在也会触发 Scope Archetype。

`koin-androidx-compose`
- 与 Koin Compose Multiplatform 以及所有 Compose 1.8 和 Lifecycle 2.9 保持一致。

`koin-compose`
- 与 Compose 1.8 和 Lifecycle 2.9 保持一致。
- New Function - `KoinApplicationPreview` 可帮助在 Android Studio 和 IntelliJ 中渲染并行预览。

`koin-compose-viewmodel`
- 添加了 `koinActivityViewModel` 以允许将父级 Activity 设置为 Host。

`koin-ktor`
- Multiplatform - 该模块现在以 Kotlin KMP 格式编译。您可以从多平台项目中使用 `koin-ktor`。
- Merge - 之前的 `koin-ktor3` 模块已合并到 `koin-ktor`。
- Extension - 引入了 `Application.koinModule { }` 和 `Application.koinModules()`，允许您声明直接加入到 Ktor 模块的 Koin 模块。
```kotlin
fun Application.customerDataModule() {
    koinModule {
        singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    }
}
```
- Scope - `Module.requestScope` - 允许在 Ktor 请求作用域内声明定义（避免手动声明 `scope<RequestScope>`）。
被注入的作用域还允许在构造函数中注入 `ApplicationCall`。

`koin-core-coroutines`
- Module DSL - 引入新的 `ModuleConfiguration` 以帮助在一个结构中收集模块配置，以便稍后更好地进行验证。
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
- Configuration DSL - Koin 配置现在可以使用 `ModuleConfiguration` 来加载模块：
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
- 添加了新的 `koin-test-coroutines` Koin 模块，以引入新的协程相关测试 API。
- Extension - 扩展了 Verify API，让您可以使用 `moduleConfiguration` 检查 Koin 配置，然后验证模块/延迟加载模块的混合配置：
```kotlin
val conf = moduleConfiguration {
    modules(m1)
    lazyModules(lm1)
}

conf.verify()

// 如果您需要 Android 类型 (koin-android-test)
conf.verify(extraTypes = androidTypes)
```

`koin-core-annotations`
- Annotations - 使用 `@InjectedParam` 或 `@Provided` 标记一个属性，使其被视为注入参数或动态提供的内容。目前用于 `Verify` API，但以后可能会用于辅助更轻量级的 DSL 声明。

### Experimental 🚧

`koin-core`
- Wasm - 使用 Kotlin 2.1.20 的 UUID 生成。

`koin-core-viewmodel`
- DSL - 添加了模块 DSL 扩展程序 `viewModelScope`，用于声明作用于 ViewModel 作用域原型的组件。
- Scope Function - 添加了函数 `viewModelScope()`，用于为 ViewModel 创建作用域（绑定到 ViewModel 类）。该 API 现在使用 `ViewModelScopeAutoCloseable` 来利用 `AutoCloseable` API 辅助声明作用域并关闭它。不再需要手动关闭 ViewModel 作用域。
- Class - 更新了 `ScopeViewModel` 类，为开箱即用的 ViewModel 作用域类提供支持（处理作用域的创建和关闭）。
- Feature Option - 带有 ViewModel 作用域的构造函数 ViewModel 注入，需要激活 Koin 选项 `viewModelScopeFactory`：
```kotlin
startKoin {
    options(
        // 激活新的 ViewModel 作用域创建
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
- Compose Function - 添加了新的 `KoinMultiplatformApplication` 函数，尝试提出一个多平台 Compose 入口点。

`koin-core-viewmodel-navigation`
- Navigation Extension - 添加了 `sharedViewModel` 以重用来自导航 `NavbackEntry` 的 ViewModel 实例。

`koin-test`
- Annotations - Koin 配置验证 API `Verify` 现在可以帮助您检查可空、延迟和列表参数。只需使用 `@InjectedParam` 或 `@Provided` 标记属性，即可将其视为注入参数或动态提供的内容。这避免了在 Verify API 中进行复杂的声明。
```kotlin
// 现在可以在 Verify 中检测到
class ComponentB(val a: ComponentA? = null)
class ComponentBParam(@InjectedParam val a: ComponentA)
class ComponentBProvided(@Provided val a: ComponentA)
```

### Deprecation ⚠️

`koin-android`
- `ScopeViewModel` 现已弃用，应改用 `koin-core-viewmodel` 中的 `ScopeViewModel` 类。

`koin-compose`
- Compose context API 不再需要，因为 Koin 上下文已在当前默认上下文中妥善准备。以下内容已弃用，可以移除：`KoinContext`。

`koin-androidx-compose`
- Jetpack Compose context API 不再需要，因为 Koin 上下文已在当前默认上下文中妥善准备。以下内容已弃用，可以移除：`KoinAndroidContext`。

`koin-androidx-compose-navigation`
- 由于 lifecycle 库更新，不再需要 `koinNavViewModel` 函数，可以用 `koinViewModel` 代替。

`koin-core-viewmodel-navigation`
- 由于 lifecycle 库更新，不再需要 `koinNavViewModel` 函数，可以用 `koinViewModel` 代替。

`koin-ktor`
- Extension - `Application.koin` 现已弃用，建议使用 `Application.koinModules` 和 `Application.koinModule`。

### Breaking 💥

`koin-android`
- 所有旧的状态 ViewModel API 现已移除：
    - `stateViewModel()`、`getStateViewModel()`，请改用 `viewModel()`。
    - `getSharedStateViewModel()`、`sharedStateViewModel()`，共享实例请改用 `viewModel()` 或 `activityViewModel()`。

`koin-compose`
- 旧的 Compose API 函数已移除：
    - `inject()` 函数已移除，建议使用 `koinInject()`。
    - `getViewModel()` 函数已移除，建议使用 `koinViewModel()`。
    - `rememberKoinInject()` 函数已移动到 `koinInject()`。
- `rememberKoinApplication` 函数被标记为 `@KoinInternalAPI`。

## 4.0.4

:::note
使用 Kotlin `2.0.21`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/main/projects/gradle/libs.versions.toml) 中。

### New 🎉

`koin-core`
- `KoinPlatformTools.generateId()` - 借助新版本的 Kotlin，我们受益于新的 `kotlin.uuid.uuid` API。`KoinPlatformTools.generateId()` Koin 函数现在使用这个新 API 跨平台生成真正的 UUID。

`koin-viewmodel`
- Koin 4.0 引入了通用化 Google/Jetbrains KMP API 的 ViewModel DSL 和 API。为了避免代码库重复，ViewModel API 现在位于 `koin-core-viewmodel` 和 `koin-core-viewmodel-navigation` 项目中。
- ViewModel DSL 的导入路径为 `org.koin.core.module.dsl.*`。

以下项目中给出的 API 现在已稳定。

`koin-core-coroutines` - 所有 API 现在都已稳定
- 所有的 `lazyModules`
- `awaitAllStartJobs`, `onKoinStarted`, `isAllStartedJobsDone`
- `waitAllStartJobs`, `runOnKoinStarted`
- `KoinApplication.coroutinesEngine`
- `Module.includes(lazy)`
- `lazyModule()`
- `KoinPlatformCoroutinesTools`

### Experimental 🚧

`koin-test`
- `ParameterTypeInjection` - 用于为 `Verify` API 设计动态参数注入的新 API。

`koin-androidx-startup`
- `koin-androidx-startup` - 使用 `androidx.startup.Initializer` API 通过 `AndroidX Startup` 启动 Koin 的新能力。`koin-androidx-startup` 内部的所有 API 都是实验性的。

`koin-compose`
- `rememberKoinModules` - 根据 @Composable 组件加载/卸载 Koin 模块。
- `rememberKoinScope` - 根据 @Composable 组件加载/卸载 Koin 作用域。
- `KoinScope` - 为所有底层的 Composable 子组件加载 Koin 作用域。

### Deprecation ⚠️

以下 API 已被弃用，不应再使用：

- `koin-test`
    - 所有 `checkModules` 的 API。请迁移到 `Verify` API。

- `koin-android`
    - ViewModel DSL，建议使用 koin-core 中新的中心化 DSL。
    - 所有状态 ViewModel API 均已在错误级别弃用：
        - `stateViewModel()`、`getStateViewModel()`，请改用 `viewModel()`。
        - `getSharedStateViewModel()`、`sharedStateViewModel()`，共享实例请改用 `viewModel()` 或 `activityViewModel()`。

`koin-compose`
- 旧的 Compose API 函数在错误级别弃用：
    - `inject()` 函数已弃用（错误级别），建议使用 `koinInject()`。
    - `getViewModel()` 函数已弃用（错误级别），建议使用 `koinViewModel()`。
    - `rememberKoinInject()` 函数已弃用（错误级别），建议使用 `koinInject()`。

- `koin-compose-viewmodel`
    - ViewModel DSL，建议使用 koin-core 中新的中心化 DSL。
    - `koinNavViewModel` 函数现已弃用，建议使用 `koinViewModel`。

### Breaking 💥

由于上一个阶段的弃用，以下 API 已被移除：

:::note
所有带有 `@KoinReflectAPI` 注解的 API 均已移除。
:::

`koin-core`
- `ApplicationAlreadyStartedException` 已更名为 `KoinApplicationAlreadyStartedException`。
- `KoinScopeComponent.closeScope()` 已移除，因为内部不再使用。
- 移动了内部 `ResolutionContext` 以替代 `InstanceContext`。
- `KoinPlatformTimeTools`、`Timer`、`measureDuration` 已移除，改为使用 Kotlin Time API。
- `KoinContextHandler` 已移除，建议使用 `GlobalContext`。

`koin-android`
- 函数 `fun Fragment.createScope()` 已移除。
- 围绕 ViewModel 工厂的所有 API（主要是内部 API）都针对新的内部机制进行了重新设计。

`koin-compose`
- 移除了 `StableParametersDefinition`，因为内部不再使用。
- 移除了所有延迟加载 ViewModel API - 旧的 `viewModel()`。
- 移除了 `rememberStableParametersDefinition()`，因为内部不再使用。

## 3.5.6

:::note
使用 Kotlin `1.9.22`
:::

所有使用的库版本都位于 [libs.versions.toml](https://github.com/InsertKoinIO/koin/blob/3.5.6/projects/gradle/libs.versions.toml) 中。

### New 🎉

`koin-core`
- `KoinContext` 现在具有以下内容：
    - `fun loadKoinModules(module: Module, createEagerInstances: Boolean = false)`
    - `fun loadKoinModules(modules: List<Module>, createEagerInstances: Boolean = false)`
- `koinApplication()` 函数现在支持多种格式：
    - `koinApplication(createEagerInstances: Boolean = true, appDeclaration: KoinAppDeclaration? = null)`
    - `koinApplication(appDeclaration: KoinAppDeclaration?)`
    - `koinApplication(createEagerInstances: Boolean)`
- `KoinAppDeclaration` 辅助开启声明样式。
- `KoinPlatformTimeTools` 用于 JS 的 API Time。
- iOS - `synchronized` API 以使用 Touchlab Lockable API。

`koin-androidx-compose`
- 新的 `KoinAndroidContext` 用于绑定 Android 环境中的当前 Koin 上下文。

`koin-compose`
- 使用当前默认上下文的新 `KoinContext` 上下文启动器。

`koin-ktor`
- 现在为 Ktor 实例使用隔离上下文（使用 `Application.getKoin()` 而不是默认上下文）。
- Koin 插件引入了新的监控。
- `RequestScope` 允许将作用域实例限定在 Ktor 请求中。

### Experimental 🚧

`koin-android`
- `ViewModelScope` 引入了 ViewModel 作用域的实验性 API。

`koin-core-coroutines` - 引入了在后台加载模块的新 API。

### Deprecation ⚠️

`koin-android`
- `getLazyViewModelForClass()` API 非常复杂，且会调用默认全局上下文。建议坚持使用 Android/Fragment API。
- `resolveViewModelCompat()` 已弃用，建议使用 `resolveViewModel()`。

`koin-compose`
- `get()` 和 `inject()` 函数已弃用，建议使用 `koinInject()`。
- `getViewModel()` 函数已弃用，建议使用 `koinViewModel()`。
- `rememberKoinInject()` 函数已弃用，建议使用 `koinInject()`。

### Breaking 💥

`koin-core`
- `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true, createEagerInstances : Boolean = false)` 替代了 `Koin.loadModules(modules: List<Module>, allowOverride: Boolean = true)`。
- 将属性 `KoinExtension.koin` 移动到了函数 `KoinExtension.onRegister()`。
- iOS - `internal fun globalContextByMemoryModel(): KoinContext` 以使用 `MutableGlobalContext`。

`koin-compose`
- 移除了函数 `KoinApplication(moduleList: () -> List<Module>, content: @Composable () -> Unit)`，建议使用 `KoinContext` 和 `KoinAndroidContext`。

## 3.4.3

:::note
使用 Kotlin `1.8.21`
:::

### New 🎉

`koin-core`
- 新的 ExtensionManager API 用于帮助编写 Koin 的扩展引擎 - `ExtensionManager` + `KoinExtension`。
- 参数 API 更新，增加了 `parameterArrayOf` 和 `parameterSetOf`。

`koin-test`
- `Verification` API - 帮助对模块运行 `verify`。

`koin-android`
- ViewModel 注入的内部机制。
- 添加了 `AndroidScopeComponent.onCloseScope()` 函数回调。

`koin-android-test`
- `Verification` API - 帮助对模块运行 `androidVerify()`。

`koin-androidx-compose`
- 新的 `get()`。
- 新的 `getViewModel()`。
- 新的作用域 `KoinActivityScope`、`KoinFragmentScope`。

`koin-androidx-compose-navigation` - 导航的新模块
- 新的 `koinNavViewModel()`。

`koin-compose` - 适用于 Compose 的新多平台 API
- `koinInject`、`rememberKoinInject`。
- `KoinApplication`。

### Experimental 🚧

`koin-compose` - 适用于 Compose 的新实验性多平台 API
- `rememberKoinModules`。
- `KoinScope`、`rememberKoinScope`。

### Deprecation ⚠️

`koin-compose`
- `get()` 函数用于取代 `inject()` 的用法，以避免使用延迟加载函数。
- `getViewModel()` 函数用于取代 `viewModel()` 函数，以避免使用延迟加载函数。

### Breaking 💥

`koin-android`
- `LifecycleScopeDelegate` 现已移除。

`koin-androidx-compose`
- 移除了 `getStateViewModel`，建议使用 `koinViewModel`。