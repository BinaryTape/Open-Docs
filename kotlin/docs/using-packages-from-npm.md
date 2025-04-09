---
title: "使用 npm 中的依赖项"
---
在 Kotlin/JS 项目中，所有依赖项都可以通过 Gradle 插件进行管理。这包括 Kotlin/Multiplatform 库，例如 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client`。

要依赖来自 [npm](https://www.npmjs.com/) 的 JavaScript 包，Gradle DSL 公开了一个 `npm` 函数，允许你指定要从 npm 导入的包。 让我们考虑导入一个名为 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 NPM 包。

Gradle 构建文件中对应的部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由于 JavaScript 模块通常是动态类型的，而 Kotlin 是一种静态类型的语言，因此你需要提供一种适配器（adapter）。 在 Kotlin 中，此类适配器称为 _外部声明_（external declarations）。 对于只提供一个函数的 `is-sorted` 包，这个声明写起来很简单。 在源文件夹中，创建一个名为 `is-sorted.kt` 的新文件，并用以下内容填充它：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

请注意，如果你使用 CommonJS 作为目标，则需要相应地调整 `@JsModule` 和 `@JsNonModule` 注解。

这个 JavaScript 函数现在可以像常规 Kotlin 函数一样使用。 因为我们在头文件中提供了类型信息（而不是简单地将参数和返回类型定义为 `dynamic`），所以也可以使用适当的编译器支持和类型检查。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

在浏览器或 Node.js 中运行这三行代码，输出表明对 `sorted` 的调用已正确映射到 `is-sorted` 包导出的函数：

```kotlin
Hello, Kotlin/JS!
true
false
```

由于 JavaScript 生态系统有多种在包中公开函数的方式（例如，通过命名导出或默认导出），因此其他 npm 包可能需要对其外部声明进行稍微修改的结构。

要了解有关如何编写声明的更多信息，请参阅 [从 Kotlin 调用 JavaScript](js-interop)。