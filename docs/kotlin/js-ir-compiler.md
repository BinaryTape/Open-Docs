[//]: # (title: Kotlin/JS 编译器特性)

Kotlin/JS 包含编译器特性，用于优化代码的性能、大小和开发速度。
这是通过编译过程实现的，该过程在生成 JavaScript 代码之前将 Kotlin 代码转换为中间表示 (IR)。

## 顶层属性的惰性初始化

为了更好的应用程序启动性能，Kotlin/JS 编译器会惰性初始化顶层属性。通过这种方式，
应用程序加载时无需初始化其代码中使用的所有顶层属性。它只初始化
启动时需要的属性；其他属性在实际运行使用它们的代码时才获得其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // 值在首次使用时计算
```

如果由于某种原因，您需要急切地初始化属性（在应用程序启动时），请使用
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 注解标记它。

## 用于开发二进制文件的增量编译

Kotlin/JS 编译器提供_用于开发二进制文件的增量编译模式_，可加快开发过程。
在此模式下，编译器在模块级别缓存 `compileDevelopmentExecutableKotlinJs` Gradle 任务的结果。
它在后续编译期间对未更改的源文件使用缓存的编译结果，使其更快完成，
特别是对于小型更改。

增量编译默认启用。要禁用开发二进制文件的增量编译，请将以下行添加到项目的 `gradle.properties`
或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // 默认为 true
```

> 增量编译模式下的清理构建通常会更慢，因为需要创建和填充缓存。
>
{style="note"}

## 生产环境中成员名称的混淆

Kotlin/JS 编译器利用其关于 Kotlin 类和函数之间关系的内部信息，应用更高效的混淆，缩短函数、属性和类的名称。这减少了生成的捆绑应用程序的大小。

当您在[生产](js-project-setup.md#building-executables)模式下构建 Kotlin/JS 应用程序时，此类混淆会自动应用，并默认启用。要禁用成员名称混淆，请使用 `-Xir-minimized-member-names` 编译器选项：

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

## 无用代码消除

[无用代码消除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 通过移除未使用的属性、函数和类，
减少生成的 JavaScript 代码的大小。

未使用的声明可能出现在以下情况：

*   函数被内联且从不直接调用（除了少数情况外，这种情况总是发生）。
*   模块使用共享库。如果没有 DCE，即使您不使用库的某些部分，它们仍会包含在生成的捆绑包中。
    例如，Kotlin 标准库包含用于操作 list、数组、字符序列、
    DOM 适配器等的函数。所有这些功能性大约需要 1.3 MB 的 JavaScript 文件大小。一个简单的
    “Hello, world”应用程序只依赖控制台例程，整个文件只有几千字节。

在 Kotlin/JS 编译器中，DCE 会自动处理：

*   DCE 在 _开发_ 捆绑任务中被禁用，这对应于以下 Gradle 任务：

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   名称中包含“development”的其他 Gradle 任务

*   如果您构建 _生产_ 捆绑包，DCE 则会启用，这对应于以下 Gradle 任务：

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   名称中包含“production”的其他 Gradle 任务

通过 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 注解，您可以指定希望 DCE 视为根的声明。