[//]: # (title: 使用 npm 依赖)

在 Kotlin/JS 项目中，所有依赖都可以通过 Gradle 插件进行管理。这包括 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client` 等 Kotlin/多平台库。

为了依赖来自 [npm](https://www.npmjs.com/) 的 JavaScript 包，Gradle DSL 暴露了一个 `npm` 函数，你可以使用它来指定想要从 npm 导入的包。让我们以导入一个名为 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 NPM 包为例。

Gradle 构建文件中的相应部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由于 JavaScript 模块通常是动态类型的，而 Kotlin 是一种静态类型语言，因此你需要提供一种适配器。在 Kotlin 中，这种适配器被称为 _外部声明 (external declarations)_。对于只提供一个函数的 `is-sorted` 包，这个声明编写起来很简单。在源文件夹内，创建一个名为 `is-sorted.kt` 的新文件，并填充以下内容：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

请注意，如果你将 CommonJS 作为目标，则 `@JsModule` 和 `@JsNonModule` 注解需要相应调整。

这个 JavaScript 函数现在可以像普通的 Kotlin 函数一样使用了。因为我们在头文件中提供了类型信息（而不是简单地将参数和返回类型定义为 `dynamic`），所以也提供了适当的编译器支持和类型检查。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

无论是在浏览器还是 Node.js 中运行这三行代码，输出都显示对 `sorted` 的调用已正确映射到 `is-sorted` 包导出的函数：

```kotlin
Hello, Kotlin/JS!
true
false
```

由于 JavaScript 生态系统有多种在包中暴露函数的方式（例如通过命名导出或默认导出），因此其他 npm 包可能需要对其外部声明采用稍微不同的结构。

要了解有关如何编写声明的更多信息，请参阅 [从 Kotlin 调用 JavaScript](js-interop.md)。