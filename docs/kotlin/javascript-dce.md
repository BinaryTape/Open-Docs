[//]: # (title: Kotlin/JS 消除死代码)

> 死代码消除 (DCE) 工具已弃用。DCE 工具是为旧版 JS 后端设计的，该后端现已淘汰。当前的 [JS IR 后端](#dce-and-javascript-ir-compiler) 原生支持 DCE，并且 [`@JsExport` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 允许指定在 DCE 期间要保留哪些 Kotlin 函数和类。
>
{style="warning"}

Kotlin 多平台 Gradle 插件包含一个 [死代码消除](https://wikipedia.org/wiki/Dead_code_elimination) (_DCE_) 工具。
死代码消除通常也称为_摇树优化_。它通过移除未使用的属性、函数和类来减小生成的 JavaScript 代码的大小。

未使用的声明可能出现在以下情况：

*   函数被内联且从不直接调用（除了少数情况外，这种情况总是发生）。
*   模块使用共享库。如果没有 DCE，您未使用的部分库仍然会包含在生成的包中。
    例如，Kotlin 标准库包含用于操作列表、数组、字符序列、DOM 适配器等的函数。所有这些功能大约需要 1.3 MB 的 JavaScript 文件。一个简单的 "Hello, world" 应用程序只需要控制台例程，整个文件只有几千字节。

Kotlin 多平台 Gradle 插件在您构建**生产构建包**时（例如使用 `browserProductionWebpack` 任务）会自动处理 DCE。**开发构建包**任务（如 `browserDevelopmentWebpack`）不包含 DCE。

## DCE 与 JavaScript IR 编译器

IR 编译器下 DCE 的应用如下：

*   编译开发版本时禁用 DCE，这对应于以下 Gradle 任务：
    *   `browserDevelopmentRun`
    *   `browserDevelopmentWebpack`
    *   `nodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   其他名称中包含 “development” 的 Gradle 任务
*   编译生产版本时启用 DCE，这对应于以下 Gradle 任务：
    *   `browserProductionRun`
    *   `browserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   其他名称中包含 “production” 的 Gradle 任务

使用 `@JsExport` 注解，您可以指定希望 DCE 作为根处理的声明。

## 从 DCE 中排除声明

有时，即使您未在模块中使用某个函数或类，您也可能需要将其保留在生成的 JavaScript 代码中，例如，如果计划在客户端 JavaScript 代码中使用它。

为了防止某些声明被消除，请将 `dceTask` 块添加到您的 Gradle 构建脚本中，并将声明作为 `keep` 函数的参数列出。参数必须是声明的完全限定名，以模块名作为前缀：`moduleName.dot.separated.package.name.declarationName`

> 除非另有说明，函数和模块的名称在生成的 JavaScript 代码中可能会被 [混淆](js-to-kotlin-interop.md#jsname-annotation)。为了防止此类函数被消除，请在 `keep` 参数中使用它们在生成的 JavaScript 代码中显示的混淆名称。
>
{style="note"}

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

如果您想阻止整个包或模块被消除，可以使用其在生成的 JavaScript 代码中显示的完全限定名。

> 阻止整个包或模块被消除可能会阻止 DCE 移除许多未使用的声明。因此，最好逐个选择应从 DCE 中排除的单个声明。
>
{style="note"}

## 禁用 DCE

要完全关闭 DCE，请在 `dceTask` 中使用 `devMode` 选项：

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}
```