---
title: 问题排查
---
:::note
Kotlin/Wasm 处于 [Alpha 阶段](components-stability)。它可能随时更改。请在生产环境前使用。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供的反馈。

:::

Kotlin/Wasm 依赖于新的 [WebAssembly 提案](https://webassembly.org/roadmap/)，例如 [垃圾回收](#garbage-collection-proposal) 和 [异常处理](#exception-handling-proposal)，以便在 WebAssembly 中引入改进和新功能。

但是，为了确保这些功能正常工作，您需要一个支持新提案的环境。在某些情况下，您可能需要设置环境以使其与提案兼容。

## 浏览器版本

要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序，您需要一个支持新的 [WebAssembly 垃圾回收 (WasmGC) 功能](https://github.com/WebAssembly/gc) 的浏览器版本。检查浏览器版本是否默认支持新的 WasmGC，或者是否需要更改环境。

### Chrome

* **对于 119 或更高版本：**

  默认情况下有效。

* **对于旧版本：**

  > 要在旧版本的浏览器中运行应用程序，您需要低于 1.9.20 的 Kotlin 版本。
  >
  

  1. 在浏览器中，转到 `chrome://flags/#enable-webassembly-garbage-collection`。
  2. 启用 **WebAssembly Garbage Collection**。
  3. 重新启动浏览器。

### 基于 Chromium 的浏览器

包括基于 Chromium 的浏览器，例如 Edge、Brave、Opera 或 Samsung Internet。

* **对于 119 或更高版本：**

  默认情况下有效。

* **对于旧版本：**

   > 要在旧版本的浏览器中运行应用程序，您需要低于 1.9.20 的 Kotlin 版本。
   >
   

  使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序。

### Firefox

* **对于 120 或更高版本：**

  默认情况下有效。

* **对于 119 版本：**

  1. 在浏览器中，转到 `about:config`。
  2. 启用 `javascript.options.wasm_gc` 选项。
  3. 刷新页面。

### Safari/WebKit

* **对于 18.2 或更高版本：**

  默认情况下有效。

* **对于旧版本：**

   不支持。

:::note
Safari 18.2 适用于 iOS 18.2、iPadOS 18.2、visionOS 2.2、macOS 15.2、macOS Sonoma 和 macOS Ventura。
在 iOS 和 iPadOS 上，Safari 18.2 与操作系统捆绑在一起。要获取它，请将您的设备更新到 18.2 或更高版本。

有关更多信息，请参见 [Safari 发行说明](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview)。

:::

## Wasm 提案支持

Kotlin/Wasm 的改进基于 [WebAssembly 提案](https://webassembly.org/roadmap/)。 您可以在这里找到有关 WebAssembly 的垃圾回收和（旧版）异常处理提案的支持的详细信息。

### 垃圾回收提案

自 Kotlin 1.9.20 以来，Kotlin 工具链使用最新版本的 [Wasm 垃圾回收](https://github.com/WebAssembly/gc) (WasmGC) 提案。

因此，我们强烈建议您将 Wasm 项目更新到最新版本的 Kotlin。 我们还建议您使用具有 Wasm 环境的浏览器的最新版本。

### 异常处理提案

Kotlin 工具链默认使用 [旧版异常处理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions)，这允许在更广泛的环境中运行生成的 Wasm 二进制文件。

自 Kotlin 2.0.0 以来，我们已经在 Kotlin/Wasm 中引入了对新版本的 Wasm [异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions) 的支持。

此更新确保新的异常处理提案与 Kotlin 要求保持一致，从而可以在仅支持最新版本提案的虚拟机上使用 Kotlin/Wasm。

新的异常处理提案使用 `-Xwasm-use-new-exception-proposal` 编译器选项激活。 默认情况下，它是关闭的。
<p>
   &nbsp;
</p>
:::note
通过我们的 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples#readme) 了解有关设置项目、使用依赖项和其他任务的更多信息。

## 使用默认导入

[将 Kotlin/Wasm 代码导入到 Javascript 中](wasm-js-interop) 已转移到命名导出，从而摆脱了默认导出。

如果您仍然想使用默认导入，请生成一个新的 JavaScript 包装器模块。 创建一个 `.mjs` 文件，其中包含以下代码段：

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

您可以将新的 `.mjs` 文件放置在 resources 文件夹中，它将在构建过程中自动放置在主 `.mjs` 文件旁边。

您也可以将 `.mjs` 文件放置在自定义位置。 在这种情况下，您需要手动将其移动到主 `.mjs` 文件旁边，或者调整导入语句中的路径以匹配其位置。

## Kotlin/Wasm 编译缓慢

在处理 Kotlin/Wasm 项目时，您可能会遇到编译时间缓慢的问题。 发生这种情况是因为 Kotlin/Wasm 工具链每次进行更改时都会重新编译整个代码库。

为了缓解此问题，Kotlin/Wasm targets 支持增量编译，这使编译器可以仅重新编译与上次编译的更改相关的文件。

使用增量编译可以减少编译时间。 目前，它可以使开发速度提高一倍，并计划在将来的版本中进一步改进。

在当前设置中，默认情况下禁用 Wasm targets 的增量编译。
要启用它，请将以下行添加到项目的 `local.properties` 或 `gradle.properties` 文件中：

```text
kotlin.incremental.wasm=true
```

试用 Kotlin/Wasm 增量编译并[分享您的反馈](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)。
您的见解有助于使该功能更快地稳定并默认启用。

:::