[//]: # (title: Kotlin/JS 编译器功能)

Kotlin/JS 包含多项编译器功能，用于在性能、大小和开发速度方面优化代码。这是通过编译过程实现的，在生成 JavaScript 代码之前，该过程会将 Kotlin 代码转换为中间表示 (IR)。

## 顶级属性的延迟初始化

为了获得更好的应用启动性能，Kotlin/JS 编译器会延迟初始化顶级属性。这样，应用程序在加载时无需初始化代码中使用的所有顶级属性。它仅初始化启动时需要的属性；其他属性会在使用它们的代码实际运行时再接收其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // 值在首次使用时计算
```

如果出于某种原因，您需要主动初始化属性（在应用启动时），请使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 注解对其进行标记。

## 开发二进制文件的增量编译

Kotlin/JS 编译器提供了“开发二进制文件的增量编译模式”，以加快开发过程。在此模式下，编译器会在模块级别缓存 `compileDevelopmentExecutableKotlinJs` Gradle 任务的结果。在随后的编译中，它会对未更改的源文件使用缓存的编译结果，从而加快编译完成速度，尤其是在只有细微更改时。

增量编译默认处于启用状态。要为开发二进制文件禁用增量编译，请在项目的 `gradle.properties` 或 `local.properties` 中添加以下行：

```none
kotlin.incremental.js.ir=false // 默认为 true
```

> 由于需要创建并填充缓存，增量编译模式下的全新构建 (clean build) 通常会更慢。
>
{style="note"}

## 生产环境中的成员名称缩减

Kotlin/JS 编译器利用其关于 Kotlin 类和函数之间关系的内部信息来应用更高效的缩减 (minification)，缩短函数、属性和类的名称。这减小了最终捆绑的应用程序的大小。

当您在 [生产 (production)](js-project-setup.md#building-executables) 模式下构建 Kotlin/JS 应用程序时，会自动应用此类缩减，且默认处于启用状态。要禁用成员名称缩减，请使用 `-Xir-minimized-member-names` 编译器选项：

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 无效代码消除

[无效代码消除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 通过移除未使用的属性、函数和类来减小生成的 JavaScript 代码的大小。

未使用的声明可能出现在以下情况：

*   函数被内联且从未被直接调用（除少数情况外，这种情况总会发生）。
*   模块使用共享库。如果没有 DCE，库中未使用的部分仍会包含在最终捆绑包中。例如，Kotlin 标准库包含用于操作列表、数组、字符序列的函数，以及 DOM 适配器等。所有这些功能作为 JavaScript 文件将需要约 1.3 MB。而一个简单的 "Hello, world" 应用程序仅需要控制台例程，整个文件只有几 KB。

在 Kotlin/JS 编译器中，DCE 会自动处理：

*   在“开发 (development)”捆绑任务中禁用 DCE，这些任务对应以下 Gradle 任务：

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   名称中包含 "development" 的其他 Gradle 任务

*   如果您构建“生产 (production)”捆绑包，则会启用 DCE，这对应以下 Gradle 任务：

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   名称中包含 "production" 的其他 Gradle 任务

通过使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解，您可以指定希望 DCE 视为根 (root) 的声明。