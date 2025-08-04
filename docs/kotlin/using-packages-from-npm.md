[//]: # (title: 使用 npm 依赖项)

在 Kotlin/JS 项目中，所有依赖项都可以通过 Gradle 插件进行管理。这包括 Kotlin/Multiplatform 库，例如 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client`。

为了依赖 [npm](https://www.npmjs.com/) 中的 JavaScript 包，Gradle DSL 暴露了一个 `npm` 函数，允许你指定要从 npm 导入的包。让我们考虑导入一个名为 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 NPM 包。

Gradle 构建文件中的相应部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由于 JavaScript 模块通常是动态类型的，而 Kotlin 是一种静态类型语言，你需要提供一种适配器。在 Kotlin 中，此类适配器称为 _外部声明_。对于只提供一个函数的 `is-sorted` 包，此声明编写起来很简单。在源代码文件夹中，创建一个名为 `is-sorted.kt` 的新文件，并填充以下内容：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

请注意，如果你正在使用 CommonJS 作为目标，则需要相应地调整 `@JsModule` 和 `@JsNonModule` 注解。

现在，这个 JavaScript 函数可以像常规 Kotlin 函数一样使用。因为我们在头文件中提供了类型信息（而不是简单地将形参和返回类型定义为 `dynamic`），所以适当的编译器支持和类型检测也可用。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

无论是在浏览器还是 Node.js 中运行这三行代码，输出都表明对 `sorted` 的调用已正确映射到由 `is-sorted` 包导出的函数：

```kotlin
Hello, Kotlin/JS!
true
false
```

由于 JavaScript 生态系统有多种在包中暴露函数的方式（例如，通过命名导出或默认导出），因此其他 npm 包的外部声明可能需要略微修改的结构。

要了解更多关于如何编写声明的信息，请参考 [从 Kotlin 调用 JavaScript](js-interop.md)。