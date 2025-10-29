---
title: Koin 注解入门
---

Koin Annotations 项目的目标是帮助开发者以一种快速直观的方式声明 Koin 定义，并为你生成所有底层的 Koin DSL。其目标是借助 Kotlin 编译器，帮助开发者实现效率提升并加速 🚀。

## 入门

对 Koin 不熟悉？首先了解一下 [Koin 入门](https://insert-koin.io/docs/quickstart/kotlin/)

使用定义和模块注解为你的组件打上标签，然后使用常规的 Koin API。

```kotlin
// 为你的组件打上标签以声明一个定义
@Single
class MyComponent
```

### 基本模块设置

```kotlin
// 声明一个模块并扫描注解
@Module
class MyModule
```

现在你可以使用 `@KoinApplication` 启动你的 Koin 应用程序，并显式指定要使用的模块：

```kotlin
// 下面的 import 语句让你能够访问生成的扩展函数
// 例如 MyModule.module 和 MyApp.startKoin() 
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一样使用你的 Koin API
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 基于配置的模块设置

或者，你可以使用 `@Configuration` 创建会自动加载的模块：

```kotlin
// 带有配置的模块 - 自动包含在默认配置中
@Module
@Configuration
class MyModule
```

有了配置，你无需显式指定模块：

```kotlin
// 下面的 import 语句让你能够访问生成的扩展函数
// 这种方法会自动加载所有带有 @Configuration 标记的模块
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一样使用你的 Koin API
    KoinPlatform.getKoin().get<MyComponent>()
}
```

就是这样，你可以在 Koin 中配合[常规 Koin API](https://insert-koin.io/docs/reference/introduction) 使用你的新定义了。

## KSP 选项

Koin 编译器提供了一些配置选项。遵循官方文档，你可以为你的项目添加以下选项：[Ksp 快速入门文档](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 编译时安全 - 在编译期检测你的 Koin 配置（自 1.3.0 起）

Koin Annotations 允许编译器插件在编译期验证你的 Koin 配置。可以通过以下 KSP 选项激活此功能，将其添加到你的 Gradle 模块中：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

编译器将检测你的配置中使用的所有依赖项是否都已声明，并且所有使用的模块都可访问。

### 使用 @Provided 绕过编译时安全检查（自 1.4.0 起）

除了编译器忽略的类型（Android 常见类型）之外，编译器插件可以在编译期验证你的 Koin 配置。如果你想将某个参数排除在检测之外，你可以在参数上使用 `@Provided` 以表明此类型是由当前 Koin Annotations 配置外部提供的。

以下示例表明 `MyProvidedComponent` 已在 Koin 中声明：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 默认模块（自 1.3.0 起已弃用）

:::warning
默认模块方法自 Annotations 1.3.0 起已弃用。我们建议使用带有 `@Module` 和 `@Configuration` 注解的显式模块，以实现更好的组织和清晰度。
:::

以前，Koin 编译器会检测任何未绑定到模块的定义，并将其放入一个“默认模块”中。现在此方法已弃用，取而代之的是使用 `@Configuration` 和 `@KoinApplication` 注解。

**已弃用方法**（避免使用）：
```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**推荐方法**：按照上述示例所示，使用 `@Configuration` 和 `@KoinApplication` 进行显式模块组织。

### Kotlin KMP 设置

请按照官方文档中描述的 KSP 设置进行操作：[KSP 与 Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

你还可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，其中包含了 Koin Annotations 的基本设置。

### Pro-Guard

如果你打算将 Koin Annotations 应用程序嵌入为 SDK，请查阅以下 ProGuard 规则：

```
# 保留注解定义
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 注解标记的类
-keep @org.koin.core.annotation.* class * { *; }
```