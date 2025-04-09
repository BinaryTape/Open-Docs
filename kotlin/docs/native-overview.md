---
title: "Kotlin Native"
---
Kotlin/Native 是一种将 Kotlin 代码编译为无需虚拟机即可运行的本地二进制文件的技术。Kotlin/Native 包括一个基于 [LLVM](https://llvm.org/) 的 Kotlin 编译器后端和一个 Kotlin 标准库的本地实现。

## 为什么选择 Kotlin/Native？

Kotlin/Native 的主要设计目的是允许在不希望或不可能使用 _虚拟机_ 的平台上进行编译，例如嵌入式设备或 iOS。对于开发者需要生成不需要额外运行时或虚拟机的独立程序的情况，它是理想的选择。

## 目标平台

Kotlin/Native 支持以下平台：
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

:::note
要编译 Apple 目标平台（macOS、iOS、tvOS 和 watchOS），你需要安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 及其命令行工具。

:::

[查看支持目标的完整列表](native-target-support)。

## 互操作性

Kotlin/Native 支持与不同操作系统的本地编程语言的双向互操作性。编译器创建：
* 适用于许多 [平台](#target-platforms) 的可执行文件
* 适用于 C/C++ 项目的带有 C 头文件的静态库或[动态](native-dynamic-libraries)库
* 适用于 Swift 和 Objective-C 项目的 [Apple framework](apple-framework)

Kotlin/Native 支持互操作性，以便直接从 Kotlin/Native 使用现有库：
* 静态或动态 [C 语言库](native-c-interop)
* C 语言，[Swift 和 Objective-C](native-objc-interop) 框架

将编译后的 Kotlin 代码包含到用 C、C++、Swift、Objective-C 和其他语言编写的现有项目中非常容易。也可以轻松地直接从 Kotlin/Native 使用现有的本地代码、静态或动态 [C 语言库](native-c-interop)、Swift/Objective-C [框架](native-objc-interop)、图形引擎以及任何其他内容。

Kotlin/Native [平台库](native-platform-libs) 有助于在项目之间共享 Kotlin 代码。POSIX、gzip、OpenGL、Metal、Foundation 和许多其他流行的库和 Apple 框架都已预先导入，并作为 Kotlin/Native 库包含在编译器包中。

## 在平台之间共享代码

[Kotlin Multiplatform](multiplatform-intro) 有助于在多个平台（包括 Android、iOS、JVM、Web 和 Native）之间共享通用代码。多平台库为通用 Kotlin 代码提供必要的 API，并允许在一个地方用 Kotlin 编写项目的共享部分。

你可以使用 [Create your Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) 教程来创建应用程序并在 iOS 和 Android 之间共享业务逻辑。要在 iOS、Android、桌面和 Web 之间共享 UI，请完成 [Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html) 教程，Compose Multiplatform 是 JetBrains 基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的声明式 UI 框架。

## 如何开始

Kotlin 新手？请查看 [Getting started with Kotlin](getting-started)。

推荐文档：

* [Introduction to Kotlin Multiplatform](multiplatform-intro)
* [Interoperability with C](native-c-interop)
* [Interoperability with Swift/Objective-C](native-objc-interop)

推荐教程：

* [Get started with Kotlin/Native](native-get-started)
* [Create your Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* [Mapping primitive data types from C](mapping-primitive-data-types-from-c)
* [Kotlin/Native as a dynamic Library](native-dynamic-libraries)
* [Kotlin/Native as an Apple framework](apple-framework)