---
title: "Koin 注解入门"
---
Koin Annotations 项目的目标是以非常快速和直观的方式帮助声明 Koin definition（定义），并为你生成所有底层 Koin DSL。 借助 Kotlin 编译器，我们的目标是帮助开发者提升开发体验，从而快速扩展 🚀。

## 快速开始

不熟悉 Koin？ 首先看看 [Koin 快速入门](https://insert-koin.io/docs/quickstart/kotlin)

使用 definition（定义） & module（模块）注解标记你的组件，并使用常规的 Koin API。

```kotlin
// 标记你的组件来声明一个 definition（定义）
@Single
class MyComponent
```

```kotlin
// 声明一个 module（模块）并扫描注解
@Module
@ComponentScan
class MyModule
```

使用 `org.koin.ksp.generated.*` 导入，如下所示，以便能够使用生成的代码：

```kotlin
// 使用 Koin 代码生成
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 在这里使用你的 modules（模块），在 Module 类上使用生成的 ".module" 扩展
          MyModule().module
        )
    }

    // 像往常一样使用你的 Koin API
    koin.get<MyComponent>()
}
```

就是这样，你可以在 Koin 中使用你的新 definitions（定义），使用 [常规 Koin API](https://insert-koin.io/docs/reference/introduction)

## KSP 选项

Koin 编译器提供了一些选项来配置。 按照官方文档，你可以将以下选项添加到你的项目中： [Ksp 快速入门文档](https://kotlinlang.org/docs/ksp-quickstart.html)

### 编译时安全 - 在编译时检查你的 Koin 配置（自 1.3.0 起）

Koin Annotations 允许编译器插件在编译时验证你的 Koin 配置。 可以使用以下 Ksp 选项激活此功能，将其添加到你的 Gradle 模块：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

编译器将检查你的配置中使用的所有依赖项是否已声明，以及所有使用的 modules（模块）是否可访问。

### 使用 @Provided 绕过编译时安全（自 1.4.0 起）

在编译器忽略的类型中（Android 常见类型），编译器插件可以验证你的 Koin 配置。 如果你想排除对某个参数的检查，你可以在该参数上使用 `@Provided`，以表明此类型是在当前 Koin Annotations 配置之外提供的。

以下代码表明 `MyProvidedComponent` 已经在 Koin 中声明：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 禁用默认 Module（模块）（自 1.3.0 起）

默认情况下，Koin 编译器会检测到任何未绑定到 module（模块）的 definition（定义），并将其放入一个“默认 module（模块）”中，这是一个在你的项目根目录生成的 Koin module（模块）。 你可以使用以下选项禁用默认 module（模块）的使用和生成：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 设置

请按照官方文档中的描述进行 KSP 设置： [KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

你还可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，其中包含 Koin Annotations 的基本设置。