---
title: Koin 注解入门
---

Koin 注解项目的目标是帮助开发者以一种非常快速直观的方式声明 Koin 定义，并为你生成所有底层的 Koin DSL。借助 Kotlin 编译器，其目标是帮助开发者体验提升效率并加速 🚀。

## 入门

对 Koin 不熟悉？首先了解一下 [Koin 入门](https://insert-koin.io/docs/quickstart/kotlin)

使用定义和模块注解为你的组件打上标签，然后使用常规的 Koin API。

```kotlin
// 为你的组件打上标签以声明一个定义
@Single
class MyComponent
```

```kotlin
// 声明一个模块并扫描注解
@Module
@ComponentScan
class MyModule
```

按照如下方式使用 `org.koin.ksp.generated.*` 导入，以便能够使用生成的代码：

```kotlin
// 使用 Koin 生成
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 在这里使用你的模块，配合模块类上生成的 ".module" 扩展属性
          MyModule().module
        )
    }

    // 像往常一样使用你的 Koin API
    koin.get<MyComponent>()
}
```

就是这样，你可以在 Koin 中配合[常规 Koin API](https://insert-koin.io/docs/reference/introduction) 使用你的新定义了。

## KSP 选项

Koin 编译器提供了一些配置选项。遵循官方文档，你可以为你的项目添加以下选项：[Ksp 快速入门文档](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 编译时安全 - 在编译时检查你的 Koin 配置（自 1.3.0 起）

Koin 注解允许编译器插件在编译时验证你的 Koin 配置。可以通过以下 KSP 选项激活此功能，将其添加到你的 Gradle 模块中：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

编译器将检查你的配置中使用的所有依赖是否都已声明，并且所有使用的模块都可访问。

### 使用 @Provided 绕过编译时安全检查（自 1.4.0 起）

除了编译器忽略的类型（Android 常见类型）之外，编译器插件可以验证你的 Koin 配置在编译时是否正确。如果你想将某个参数排除在检查之外，你可以在参数上使用 `@Provided` 以表明此类型是当前 Koin 注解配置外部提供的。

以下示例表明 `MyProvidedComponent` 已在 Koin 中声明：

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 禁用默认模块（自 1.3.0 起）

默认情况下，Koin 编译器会检测任何未绑定到模块的定义，并将其放入一个“默认模块”中，这是一个在项目根目录生成的 Koin 模块。你可以使用以下选项禁用默认模块的使用和生成：

```groovy
// 在 build.gradle 或 build.gradle.kts 中

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 设置

请按照官方文档中描述的 KSP 设置进行操作：[KSP 与 Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

你还可以查看 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 项目，它包含了 Koin 注解的基本设置。

### Pro-Guard

如果你打算将 Koin 注解应用程序嵌入为 SDK，请查阅以下 ProGuard 规则：

```
# 保留注解定义
-keep class org.koin.core.annotation.** { *; }

# 保留使用 Koin 注解标记的类
-keep @org.koin.core.annotation.* class * { *; }
```