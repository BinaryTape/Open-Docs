[//]: # (title: 支持的版本和配置)

<primary-label ref="beta"/>

本页面详细介绍了 [WebAssembly 提案](https://webassembly.org/roadmap/)、支持的浏览器以及使用 Kotlin/Wasm 进行高效开发的配置建议。

## 浏览器版本

Kotlin/Wasm 依赖于最新的 WebAssembly 提案，例如 [垃圾回收 (WasmGC)](#garbage-collection-proposal) 和 [异常处理](#exception-handling-proposal)，以在 WebAssembly 中引入改进和新特性。

为确保这些特性正常运行，请提供一个支持最新提案的环境。请检查您的浏览器版本是否默认支持新的 WasmGC，或者您是否需要对环境进行更改。

### Chrome

*   **对于版本 119 或更高：**

    默认即可使用。

*   **对于旧版本：**

    > 要在旧版本浏览器中运行应用程序，您需要使用低于 1.9.20 的 Kotlin 版本。
    >
    {style="note"}

    1.  在浏览器中，前往 `chrome://flags/#enable-webassembly-garbage-collection`。
    2.  启用 **WebAssembly Garbage Collection**。
    3.  重新启动浏览器。

### 基于 Chromium 的浏览器

包括 Edge、Brave、Opera 或 Samsung Internet 等基于 Chromium 的浏览器。

*   **对于版本 119 或更高：**

    默认即可使用。

*   **对于旧版本：**

    > 要在旧版本浏览器中运行应用程序，您需要使用低于 1.9.20 的 Kotlin 版本。
    >
    {style="note"}

    使用 `--js-flags=--experimental-wasm-gc` 命令行实参运行应用程序。

### Firefox

*   **对于版本 120 或更高：**

    默认即可使用。

*   **对于版本 119：**

    1.  在浏览器中，前往 `about:config`。
    2.  启用 `javascript.options.wasm_gc` 选项。
    3.  刷新页面。

### Safari/WebKit

*   **对于版本 18.2 或更高：**

    默认即可使用。

*   **对于旧版本：**

    不支持。

> Safari 18.2 适用于 iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma 和 macOS Ventura。在 iOS 和 iPadOS 上，Safari 18.2 与操作系统捆绑。要获取它，请将您的设备更新到版本 18.2 或更高。
>
> 关于更多信息，请参见 [Safari 发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)。
>
{style="note"}

## Wasm 提案支持

Kotlin/Wasm 的改进基于 [WebAssembly 提案](https://webassembly.org/roadmap/)。您可以在此处找到有关 WebAssembly 垃圾回收和（旧版）异常处理提案支持的详细信息。

### 垃圾回收提案

自 Kotlin 1.9.20 起，Kotlin 工具链使用 [Wasm 垃圾回收](https://github.com/WebAssembly/gc) (WasmGC) 提案的最新版本。

因此，我们强烈建议您将 Wasm 项目更新到最新版本的 Kotlin。我们还建议您使用搭载 Wasm 环境的最新版本浏览器。

### 异常处理提案

Kotlin 工具链支持异常处理提案的 [旧版](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md) 和 [新版](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)。这使得 Kotlin 生成的 Wasm 二进制文件能够在更广泛的环境中运行。

[`wasmJs` 目标](wasm-overview.md#kotlin-wasm-and-compose-multiplatform) 默认使用旧版异常处理提案。要为 `wasmJs` 目标启用新的异常处理提案，请使用 `-Xwasm-use-new-exception-proposal` 编译器选项。

相比之下，[`wasmWasi` 目标](wasm-overview.md#kotlin-wasm-and-wasi) 默认使用新提案，以确保与现代 WebAssembly 运行时更好的兼容性。要切换到旧版提案，请使用 `-Xwasm-use-new-exception-proposal=false` 编译器选项。

对于 `wasmWasi` 目标，采用新的异常处理提案是安全的。面向此环境的应用程序通常在较不多样化的运行时环境（通常运行在单个特定的虚拟机上）中运行，该环境通常由用户控制，从而降低了兼容性问题的风险。

> 了解更多关于项目设置、使用依赖项和我们 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples#readme) 中的其他任务。
>
{style="tip"}

## 使用默认导入

将 [Kotlin/Wasm 代码导入到 Javascript](wasm-js-interop.md) 已转向具名导出，不再使用默认导出。

如果您仍想使用默认导入，请生成一个新的 JavaScript 包装器模块。创建一个 `.mjs` 文件，其中包含以下代码片段：

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

您可以将新的 `.mjs` 文件放在资源文件夹中，它将在构建过程中自动放置在主 `.mjs` 文件旁边。

您也可以将 `.mjs` 文件放置在自定义位置。在这种情况下，您需要手动将其移动到主 `.mjs` 文件旁边，或调整导入声明中的路径以匹配其位置。

## Kotlin/Wasm 编译缓慢

在处理 Kotlin/Wasm 项目时，您可能会遇到编译时间缓慢的问题。这是因为 Kotlin/Wasm 工具链在您每次进行更改时都会重新编译整个代码库。

为了缓解此问题，Kotlin/Wasm 目标支持增量编译，这使得编译器仅重新编译与自上次编译以来更改相关的文件。

使用增量编译可以缩短编译时间。目前，它可将开发速度提高一倍，并计划在未来的版本中进一步改进。

在当前设置中，Wasm 目标的增量编译默认禁用。要启用它，请将以下行添加到项目的 `local.properties` 或 `gradle.properties` 文件中：

```text
kotlin.incremental.wasm=true
```

> 尝试 Kotlin/Wasm 增量编译并 [分享您的反馈](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。您的见解有助于该特性更快地稳定并默认启用。
>
{style="note"}

## 完全限定类名中的诊断

在 Kotlin/Wasm 中，编译器默认不将类的完全限定名 (FQN) 存储在生成的二进制文件中，以避免增加应用程序大小。

因此，当您在 Kotlin/Wasm 项目中调用 `KClass::qualifiedName` 属性时，编译器会报告错误，除非您显式启用完全限定名特性。

此诊断默认启用，并且会自动报告错误。要禁用此诊断并在 Kotlin/Wasm 中允许 `qualifiedName`，请通过将以下选项添加到 `build.gradle.kts` 文件来指示编译器为所有类存储完全限定名：

```kotlin
// build.gradle.kts
kotlin {
   wasmJs {
       ...
       compilerOptions {
           freeCompilerArgs.add("-Xwasm-kclass-fqn")
       }
   }
}
```

请记住，启用此选项会增加应用程序大小。

### 完全限定名

在 Kotlin/Wasm 目标上，完全限定名 (FQN) 在运行时可用，无需任何额外配置。这意味着 `KClass.qualifiedName` 属性默认是启用的。

使用 FQN 可以提高从 JVM 到 Wasm 目标的代码可移植性，并通过显示完全限定名使运行时错误更具信息性。

## 数组越界访问和陷阱

在 Kotlin/Wasm 中，使用超出其边界的索引访问数组会触发 WebAssembly 陷阱，而不是常规的 Kotlin 异常。该陷阱会立即停止当前的执行栈。

在 JavaScript 环境中运行时，这些陷阱表现为 `WebAssembly.RuntimeError`，可以在 JavaScript 侧捕获。

您可以通过在命令行中链接可执行文件时使用以下编译器选项来避免 Kotlin/Wasm 环境中的此类陷阱：

```
-Xwasm-enable-array-range-checks
```

或者将其添加到您的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

启用此编译器选项后，将抛出 `IndexOutOfBoundsException` 而不是陷阱。

关于更多详细信息并分享您的反馈，请参见此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default)。

## 实验性注解

Kotlin/Wasm 提供了多个用于通用 WebAssembly 互操作性的实验性注解。

[`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/) 和 [`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/) 分别允许您调用在 Kotlin/Wasm 模块外部定义的函数，并将 Kotlin 函数暴露给宿主或其他 Wasm 模块。

由于这些机制仍在演进中，所有注解都标记为实验性的。您必须显式 [选择启用它们](opt-in-requirements.md)，并且它们的设计或行为可能会在未来的 Kotlin 版本中发生变化。

## 调试期间的重新加载

在 [现代浏览器](#browser-versions) 中 [调试](wasm-debugging.md) 您的应用程序是开箱即用的。当您运行开发 Gradle 任务 (`*DevRun`) 时，Kotlin 会自动将源文件提供给浏览器。

然而，默认提供源文件可能会导致 [在 Kotlin 编译和打包完成之前，应用程序在浏览器中重复重新加载](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)。作为一种变通方法，请调整您的 webpack 配置以忽略 Kotlin 源文件并禁用对所提供的静态文件的监视。在项目根目录的 `webpack.config.d` 目录中添加一个包含以下内容的 `.js` 文件：

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            }
        } else {
            return file
        }
    })
}