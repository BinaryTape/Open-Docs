[//]: # (title: Kotlin/Native)

Kotlin/Native 是一项将 Kotlin 代码编译成原生二进制文件（无需虚拟机即可运行）的技术。
Kotlin/Native 包含一个基于 [LLVM](https://llvm.org/) 的 Kotlin 编译器后端以及 Kotlin 标准库的原生实现。

## 为什么选择 Kotlin/Native？

Kotlin/Native 主要设计用于编译到不希望或不可能使用_虚拟机_的平台，例如嵌入式设备或 iOS。当你需要生成一个不依赖额外运行时或虚拟机的自包含程序时，它是理想的选择。

你可以轻松地将编译后的 Kotlin 代码包含在 C、C++、Swift、Objective-C 及其他语言编写的现有项目中。你也可以直接从 Kotlin/Native 中使用现有的原生代码、静态或动态 C 库、Swift/Objective-C 框架、图形引擎以及其他任何内容。

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="开始使用 Kotlin/Native" style="block"/></a>

## 目标平台

Kotlin/Native 支持以下平台：

* Linux
* Windows（通过 [MinGW](https://www.mingw-w64.org/)）
* [Android NDK](https://developer.android.com/ndk)
* 适用于 macOS、iOS、tvOS 和 watchOS 的 Apple 目标

  > 要编译 Apple 目标，你需要安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
  > 及其命令行工具。
  >
  {style="note"}

[查看支持的目标完整列表](native-target-support.md)。

## 互操作性

Kotlin/Native 支持与不同操作系统的原生编程语言进行双向互操作。
编译器可以为多种平台创建可执行文件、静态或动态 C 库以及 Swift/Objective-C 框架。

### 与 C 的互操作性

Kotlin/Native 提供[与 C 的互操作性](native-c-interop.md)。你可以直接从 Kotlin 代码中使用现有的 C 库。

要了解更多信息，请完成以下教程：

* [为 C/C++ 项目创建包含 C 头文件的动态库](native-dynamic-libraries.md)
* [了解 C 类型如何映射到 Kotlin](mapping-primitive-data-types-from-c.md)
* [使用 C 互操作和 libcurl 创建原生 HTTP 客户端](native-app-with-c-and-libcurl.md)

### 与 Swift/Objective-C 的互操作性

Kotlin/Native 提供[通过 Objective-C 与 Swift 的互操作性](native-objc-interop.md)。你可以在 macOS 和 iOS 上直接从 Swift/Objective-C 应用程序中使用 Kotlin 代码。

要了解更多信息，请完成[Kotlin/Native 作为 Apple 框架](apple-framework.md)教程。

## 跨平台代码共享

Kotlin/Native 包含一组预构建的[平台库](native-platform-libs.md)，有助于在项目之间共享 Kotlin 代码。POSIX、gzip、OpenGL、Metal、Foundation 以及许多其他流行的库和 Apple 框架都已预导入并作为 Kotlin/Native 库包含在编译器包中。

Kotlin/Native 是 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 技术的一部分，该技术有助于在多个平台（包括 Android、iOS、JVM、Web 和原生平台）之间共享通用代码。多平台库为通用 Kotlin 代码提供必要的 API，并允许在一个地方用 Kotlin 编写项目的共享部分。

## 内存管理器

Kotlin/Native 使用一种类似于 JVM 和 Go 的自动[内存管理器](native-memory-manager.md)。
它拥有自己的追踪式垃圾回收器，并与 Swift/Objective-C 的 ARC 集成。

内存消耗由自定义内存分配器控制。它优化了内存使用，并有助于防止内存分配突然激增。