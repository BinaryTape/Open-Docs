---
title: "为什么选择 Koin？"
---
Koin 提供了一种简单有效的方法，将依赖注入整合到任何 Kotlin 应用程序中（多平台、Android、后端……）。

Koin 的目标是：
- 使用智能 API 简化您的依赖注入基础设施
- Kotlin DSL 易于阅读、易于使用，可让您编写任何类型的应用程序
- 提供来自 Android 生态系统的各种集成，以满足更多后端需求，如 Ktor
- 允许与注解一起使用

## Koin 简述

### 让您的 Kotlin 开发变得简单高效

Koin 是一个智能的 Kotlin 依赖注入库，让您专注于您的应用程序，而不是您的工具。

```kotlin

class MyRepository()
class MyPresenter(val repository : MyRepository) 

// 只需声明它
val myModule = module { 
  singleOf(::MyPresenter)
  singleOf(::MyRepository)
}
```

Koin 为您提供简单的工具和 API，让您可以构建 Kotlin 相关技术并将其组装到您的应用程序中，并让您轻松扩展业务。

```kotlin
fun main() { 
  
  // 只需启动 Koin
  startKoin {
    modules(myModule)
  }
} 
```

### 为 Android 做好准备

得益于 Kotlin 语言，Koin 扩展了 Android 平台，并提供了作为原始平台一部分的新功能。

```kotlin
class MyApplication : Application() {
  override fun onCreate() {
    super.onCreate()

    startKoin {
      modules(myModule)
    }
  } 
}
```

Koin 提供了简单而强大的 API，只需使用 `by inject()` 或 `by viewModel()` 即可在 Android 组件中的任何位置检索您的依赖项。

```kotlin
class MyActivity : AppCompatActivity() {

  val myPresenter : MyPresenter by inject()

} 
```

### 赋能 Kotlin 多平台

在移动平台之间共享代码是 Kotlin 多平台的主要用例之一。 使用 Kotlin Multiplatform Mobile，您可以构建跨平台移动应用程序，并在 Android 和 iOS 之间共享通用代码。

Koin 提供多平台依赖注入，并帮助您在原生移动应用程序和 Web/后端应用程序中构建组件。

### 性能和生产力

Koin 是一个纯 Kotlin 框架，旨在用法和执行方面都简单明了。 它易于使用，不会影响您的编译时间，也不需要任何额外的插件配置。

## Koin：一个依赖注入框架

Koin 是一个流行的 Kotlin 依赖注入（Dependency Injection, DI）框架，它提供了一个现代且轻量级的解决方案，以最少的样板代码来管理应用程序的依赖关系。

### 依赖注入 vs. 服务定位器

虽然 Koin 可能看起来类似于服务定位器（Service Locator）模式，但它们之间存在关键差异：

- 服务定位器：服务定位器本质上是一个可用服务注册表，您可以在其中根据需要请求服务的实例。 它负责创建和管理这些实例，通常使用静态的全局注册表。

- 依赖注入：相比之下，Koin 是一个纯粹的依赖注入框架。 使用 Koin，您可以在模块中声明依赖项，Koin 会处理对象的创建和连接。 它允许创建具有自己作用域的多个独立模块，从而使依赖项管理更加模块化，并避免潜在的冲突。

### Koin 的方法：灵活性和最佳实践的结合

Koin 支持 DI 和服务定位器模式，为开发人员提供灵活性。 但是，它强烈鼓励使用 DI，特别是构造函数注入，其中依赖项作为构造函数参数传递。 这种方法提高了可测试性，并使您的代码更易于理解。

Koin 的设计理念围绕简单易用，同时在必要时允许进行复杂的配置。 通过使用 Koin，开发人员可以有效地管理依赖项，DI 是大多数情况下推荐和首选的方法。

### 透明度和设计概述

Koin 旨在成为一个通用的控制反转（Inversion of Control, IoC）容器，支持依赖注入（DI）和服务定位器（Service Locator, SL）模式。 为了清楚地了解 Koin 的运作方式并指导您有效地使用它，让我们探讨以下几个方面：

#### Koin 如何平衡 DI 和 SL

Koin 结合了 DI 和 SL 的元素，这可能会影响您使用该框架的方式：

1. **全局上下文使用：** 默认情况下，Koin 提供一个全局可访问的组件，其作用类似于服务定位器。 这允许您使用 `KoinComponent` 或 `inject` 函数从中央注册表检索依赖项。

2. **隔离组件：** 尽管 Koin 鼓励使用依赖注入，特别是构造函数注入，但它也允许使用隔离组件。 这种灵活性意味着您可以配置您的应用程序以在最有意义的地方使用 DI，同时仍然可以利用 SL 来处理特定情况。

3. **Android 组件中的 SL：** 在 Android 开发中，Koin 通常在 `Application` 和 `Activity` 等组件内部使用 SL，以简化设置。 从这一点来看，Koin 建议使用 DI，特别是构造函数注入，以更结构化的方式管理依赖项。 但是，这不是强制执行的，开发人员可以灵活地在需要时使用 SL。

#### 这对您为何重要

了解 DI 和 SL 之间的区别有助于有效地管理应用程序的依赖项：

- **依赖注入：** Koin 鼓励使用，因为它在可测试性和可维护性方面具有优势。 构造函数注入是首选，因为它使依赖项显式化并增强了代码的清晰度。

- **服务定位器：** 虽然 Koin 支持 SL 以提供便利，尤其是在 Android 组件中，但仅依赖 SL 可能会导致更紧密的耦合和降低的可测试性。 Koin 的设计提供了一种平衡的方法，允许您在实际情况下使用 SL，但提倡 DI 作为最佳实践。

#### 充分利用 Koin

为了有效地使用 Koin：

- **遵循最佳实践：** 在可能的情况下使用构造函数注入，以符合依赖项管理方面的最佳实践。 这种方法提高了可测试性和可维护性。

- **利用 Koin 的灵活性：** 在简化设置的情况下利用 Koin 对 SL 的支持，但目标是依赖 DI 来管理核心应用程序依赖项。

- **参考文档和示例：** 查看 Koin 的文档和示例，以了解如何根据您的项目需求配置和使用 DI 和 SL。

- **可视化依赖项管理：** 图表和示例可以帮助说明 Koin 如何解析依赖项并在不同上下文中管理它们。 这些视觉辅助工具可以更清楚地了解 Koin 的内部工作原理。

> 通过提供此指导，我们旨在帮助您有效地浏览 Koin 的功能和设计选择，确保您可以充分利用其潜力，同时遵守依赖项管理方面的最佳实践。