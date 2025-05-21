---
title: "Kotlin/JS 死代码消除 (dead code elimination)"
---
:::note
死代码消除（Dead Code Elimination, DCE）工具已被弃用。DCE 工具是为遗留的 JS 后端设计的，该后端现已过时。当前的 [JS IR 后端](#dce-and-javascript-ir-compiler) 开箱即用地支持 DCE，并且 [@JsExport 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 允许指定在 DCE 期间要保留的 Kotlin 函数和类。

Kotlin Multiplatform Gradle 插件包含一个 _[死代码消除](https://wikipedia.org/wiki/Dead_code_elimination)_ (DCE) 工具。死代码消除通常也称为 _tree shaking_ (摇树优化)。它通过删除未使用的属性、函数和类来减小生成的 JavaScript 代码的大小。

未使用的声明可能出现在以下情况中：

* 一个函数被内联并且从未被直接调用（除了少数情况外，总是会发生这种情况）。
* 一个模块使用一个共享库。如果没有 DCE，你没有使用的库的部分仍然包含在生成的文件包中。例如，Kotlin 标准库包含用于操作列表、数组、字符序列、DOM 适配器等的函数。所有这些功能将需要大约 1.3 MB 作为 JavaScript 文件。一个简单的“Hello, world”应用程序只需要控制台例程，这对于整个文件来说只有几 KB。

当你构建**生产文件包**时，例如通过使用 `browserProductionWebpack` 任务，Kotlin Multiplatform Gradle 插件会自动处理 DCE。**开发打包**任务（如 `browserDevelopmentWebpack`）不包含 DCE。

## DCE 和 JavaScript IR 编译器

DCE 与 IR 编译器的应用如下：

* 为开发进行编译时，DCE 处于禁用状态，这对应于以下 Gradle 任务：
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 其他名称中包含“development”的 Gradle 任务
* 为生产进行编译时，DCE 处于启用状态，这对应于以下 Gradle 任务：
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 其他名称中包含“production”的 Gradle 任务

使用 @JsExport 注解，你可以指定希望 DCE 将哪些声明视为根。

## 从 DCE 中排除声明

有时你可能需要在生成的 JavaScript 代码中保留一个函数或类，即使你不在你的模块中使用它，例如，如果你打算在客户端 JavaScript 代码中使用它。

为了防止某些声明被消除，请将 `dceTask` 块添加到你的 Gradle 构建脚本，并将这些声明作为 `keep` 函数的参数列出。参数必须是声明的完全限定名称，模块名称作为前缀：`moduleName.dot.separated.package.name.declarationName`

除非另有说明，否则函数和模块的名称可以在生成的 JavaScript 代码中被 [mangled](js-to-kotlin-interop#jsname-annotation) (混淆)。为了防止此类函数被消除，请在 `keep` 参数中使用生成的 JavaScript 代码中显示的混淆名称。

:::

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

如果你想防止整个包或模块被消除，你可以使用其完全限定名称，因为它出现在生成的 JavaScript 代码中。

:::note
防止整个包或模块被消除可能会阻止 DCE 删除许多未使用的声明。因此，最好选择应从 DCE 中单独排除的单个声明。

:::

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