---
title: Koin Annotations 入门
---

Koin Annotations 项目的目标是帮助以快速直观的方式声明 Koin 定义，并为您生成所有底层 Koin DSL。得益于 Kotlin 编译器，其目标是帮助开发者体验扩展并实现快速开发 🚀。

## 开始使用

还不熟悉 Koin？首先，请查看 [Koin 快速入门](https://insert-koin.io/docs/quickstart/kotlin/)

使用定义和模块注解标记您的组件，并使用常规的 Koin API。

```kotlin
// 标记您的组件以声明定义
@Single
class MyComponent
```

### 基础模块设置

```kotlin
// 声明一个模块并扫描注解
@Module
class MyModule
```

现在，您可以使用 `@KoinApplication` 启动您的 Koin 应用程序，并显式指定要使用的模块：

```kotlin
// 下面的导入让您可以访问生成的扩展函数
// 例如 MyModule.module 和 MyApp.startKoin() 
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一样使用您的 Koin API
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 基于配置的模块设置

或者，您可以使用 `@Configuration` 来创建自动加载的模块：

```kotlin
// 带有配置的模块 - 自动包含在默认配置中
@Module
@Configuration
class MyModule
```

使用配置后，您无需显式指定模块：

```kotlin
// 下面的导入让您可以访问生成的扩展函数
// 这种方法会自动加载所有标记有 @Configuration 的模块
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 像往常一样使用您的 Koin API
    KoinPlatform.getKoin().get<MyComponent>()
}
```

就是这样，您可以通过 [常规 Koin API](https://insert-koin.io/docs/reference/introduction) 在 Koin 中使用您的新定义。

## KSP 选项

Koin 编译器提供了一些配置选项。根据官方文档，您可以为项目添加以下选项：[KSP 快速入门文档](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 编译安全性 - 在编译时检查您的 Koin 配置（自 1.3.0 起）

Koin Annotations 允许编译器插件在编译时验证您的 Koin 配置。可以通过在 Gradle 模块中添加以下 KSP 选项来激活：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

编译器将检查配置中使用的所有依赖项是否已声明，以及所有使用的模块是否可访问。

### 使用 @Provided 绕过编译安全性（自 1.4.0 起）

除了编译器忽略的类型（Android 通用类型）外，编译器插件可以在编译时验证您的 Koin 配置。如果您想排除某个参数不进行检查，可以在参数上使用 `@Provided`，以指示此类型是从当前 Koin Annotations 配置外部提供的。

以下示例表示 `MyProvidedComponent` 已在 Koin 中声明：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 默认模块（自 1.3.0 起弃用）

:::warning
自 Annotations 1.3.0 起，默认模块方法已被弃用。我们建议使用带有 `@Module` 和 `@Configuration` 注解的显式模块，以获得更好的组织结构和清晰度。
:::

以前，Koin 编译器会检测任何未绑定到模块的定义，并将其放入“默认模块”中。现在弃用此方法，改为使用 `@Configuration` 和 `@KoinApplication` 注解。

**弃用的方法**（避免使用）：
```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**推荐的方法**：使用如上例所示的带有 `@Configuration` 和 `@KoinApplication` 的显式模块组织。

### Kotlin KMP 设置

请按照官方文档中的说明进行 KSP 设置：[带有 Kotlin 多平台的 KSP](https://kotlinlang.org/docs/ksp-multiplatform.html)

您还可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，其中包含 Koin Annotations 的基础设置。

### Pro-Guard

如果您打算将 Koin Annotations 应用程序作为 SDK 嵌入，请查看这些 Pro-Guard 规则：

```
# 保留注解定义
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 注解标记的类
-keep @org.koin.core.annotation.* class * { *; }