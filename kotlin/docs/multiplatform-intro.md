---
title: "Kotlin Multiplatform 简介"
---
多平台编程的支持是 Kotlin 的主要优势之一。它减少了为[不同平台](multiplatform-dsl-reference#targets)编写和维护相同代码所花费的时间，同时保留了原生编程的灵活性和优势。

<img src="/img/kotlin-multiplatform.svg" alt="Kotlin Multiplatform" width="700" style={{verticalAlign: 'middle'}}/>

## 了解关键概念

Kotlin Multiplatform 允许你在不同的平台（无论是移动端、Web 端还是桌面端）之间共享代码。代码编译到的平台由 _targets_ （目标平台）列表定义。

每个目标平台都有一个对应的 *source set*（源码集），它代表一组具有自身依赖项和编译器选项的源文件。特定于平台的源码集，例如 JVM 的 `jvmMain`，可以使用特定于平台的库和 API。

为了在目标平台的子集之间共享代码，可以使用中间源码集。例如，`appleMain` 源码集代表在所有 Apple 平台之间共享的代码。在所有平台之间共享并编译到所有声明的目标平台的代码拥有自己的源码集 `commonMain`。它不能使用特定于平台的 API，但可以利用多平台库。

当为特定目标平台进行编译时，Kotlin 会组合通用源码集、相关的中间源码集和特定于目标的源码集。

有关此主题的更多详细信息，请参阅：

* [Kotlin Multiplatform 项目结构的基础知识](multiplatform-discover-project)
* [多平台项目结构的高级概念](multiplatform-advanced-project-structure)

## 使用代码共享机制

有时，在相似目标平台的子集之间共享代码会更方便。Kotlin Multiplatform 提供了一种使用 *default hierarchy template*（默认层级模板）简化创建过程的方法。它包含一个预定义的中间源码集列表，这些源码集是根据你在项目中指定的目标平台创建的。

要从共享代码中访问特定于平台的 API，你可以使用另一种 Kotlin 机制，*expected and actual declarations*（预期和实际声明）。通过这种方式，你可以声明在通用代码中 `expect`（预期）一个特定于平台的 API，但为每个目标平台提供单独的 `actual`（实际）实现。你可以将此机制与不同的 Kotlin 概念一起使用，包括函数、类和接口。例如，你可以在通用代码中定义一个函数，但使用相应源码集中的特定于平台的库来提供其实现。

有关此主题的更多详细信息，请参阅：

* [在平台上共享代码](multiplatform-share-on-platforms)
* [预期和实际声明](multiplatform-expect-actual)
* [分层项目结构](multiplatform-hierarchy)

## 添加依赖项

Kotlin Multiplatform 项目可以依赖于外部库和其他多平台项目。对于通用代码，你可以在通用源码集中添加对多平台库的依赖项。Kotlin 会自动解析并将适当的特定于平台的部分添加到其他源码集。如果只需要特定于平台的 API，请将依赖项添加到相应的源码集。

将特定于 Android 的依赖项添加到 Kotlin Multiplatform 项目类似于在纯 Android 项目中添加它们。在使用特定于 iOS 的依赖项时，你可以无缝集成 Apple SDK 框架，而无需额外的配置。对于外部库和框架，Kotlin 提供了与 Objective-C 和 Swift 的互操作性。

有关此主题的更多详细信息，请参阅：

* [添加对多平台库的依赖项](multiplatform-add-dependencies)
* [添加对 Android 库的依赖项](multiplatform-android-dependencies)
* [添加对 iOS 库的依赖项](multiplatform-ios-dependencies)

## 设置与 iOS 的集成

如果你的多平台项目以 iOS 为目标平台，你可以设置 Kotlin Multiplatform 共享模块与你的 iOS 应用的集成。

为此，你需要生成一个 iOS 框架，然后将其作为本地或远程依赖项添加到 iOS 项目：

* **Local integration**（本地集成）：使用特殊脚本直接连接你的多平台项目和 Xcode 项目，或者使用 CocoaPods 依赖管理工具进行涉及本地 Pod 依赖项的设置。
* **Remote integration**（远程集成）：使用 XCFramework 设置 SPM 依赖项，或者通过 CocoaPods 分发共享模块。

有关此主题的更多详细信息，请参阅 [iOS 集成方法](multiplatform-ios-integration-overview)。

## 配置编译

每个目标平台都可以有多个用于不同目的的编译，通常用于生产或测试，但你也可以定义自定义编译。

使用 Kotlin Multiplatform，你可以配置项目中的所有编译，在目标平台内设置特定的编译，甚至创建单独的编译。在配置编译时，你可以修改编译器选项、管理依赖项或配置与原生语言的互操作性。

有关此主题的更多详细信息，请参阅 [配置编译](multiplatform-configure-compilations)。

## 构建最终二进制文件

默认情况下，目标平台会被编译为 `.klib` 文件，Kotlin/Native 本身可以将其作为依赖项使用，但不能执行或用作原生库。但是，Kotlin Multiplatform 提供了构建最终原生二进制文件的其他机制。

你可以创建可执行二进制文件、共享库和静态库或 Objective-C 框架，每个都可以为不同的构建类型进行配置。Kotlin 还提供了一种构建用于 iOS 集成的通用（胖）框架和 XCFramework 的方法。

有关此主题的更多详细信息，请参阅 [构建原生二进制文件](multiplatform-build-native-binaries)。

## 创建多平台库

你可以创建一个多平台库，其中包含通用代码及其 JVM、Web 和原生平台的特定于平台的实现。

发布 Kotlin Multiplatform 库需要在你的 Gradle 构建脚本中进行特定的配置。你可以使用 Maven 仓库和 `maven-publish` 插件进行发布。发布后，多平台库可以在其他跨平台项目中用作依赖项。

有关此主题的更多详细信息，请参阅 [发布多平台库](multiplatform-publish-lib)。

## 参考

* [Kotlin Multiplatform Gradle 插件的 DSL 参考](multiplatform-dsl-reference)
* [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide)