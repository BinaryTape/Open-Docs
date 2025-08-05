[//]: # (title: Kotlin Multiplatform 简介)

对多平台编程的支持是 Kotlin 的关键优势之一。它减少了为[不同平台](multiplatform-dsl-reference.md#targets)编写和维护相同代码所需的时间，同时保留了原生编程的灵活性和优势。

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 学习关键概念

Kotlin Multiplatform 允许你在不同平台（无论是移动端、Web 端还是桌面端）之间共享代码。代码所编译的平台由 _目标平台_ 的列表定义。

每个目标平台都有一个对应的 *源代码集*，它代表一组具有自身依赖项和编译器选项的源文件。平台特有的源代码集（例如 JVM 的 `jvmMain`）可以使用平台特有的库和 API。

为了在目标平台的子集之间共享代码，会使用中间源代码集。例如，`appleMain` 源代码集代表所有 Apple 平台之间共享的代码。所有平台之间共享并编译到所有已声明目标平台的代码，有其自己的源代码集 `commonMain`。它不能使用平台特有的 API，但可以利用多平台库。

为特定目标平台编译时，Kotlin 会结合公共源代码集、相关的中间源代码集以及目标平台特有的源代码集。

关于此主题的更多详细信息，请参见：

*   [Kotlin Multiplatform 项目结构基础](multiplatform-discover-project.md)
*   [多平台项目结构的高级概念](multiplatform-advanced-project-structure.md)

## 使用代码共享机制

有时，在类似目标平台的子集之间共享代码会更方便。Kotlin Multiplatform 提供了一种通过 *默认层级模板* 来简化其创建的方式。它包含一个预定义列表的中间源代码集，这些源代码集是根据你在项目中所指定的目标平台创建的。

要从共享代码中访问平台特有的 API，你可以使用另一种 Kotlin 机制，即 *预期与实际声明*。通过这种方式，你可以在公共代码中声明你 `expect` 一个平台特有的 API，但为每个目标平台提供一个单独的 `actual` 实现。你可以将此机制用于不同的 Kotlin 概念，包括函数、类和接口。例如，你可以在公共代码中定义一个函数，但使用相应源代码集中的平台特有库提供其实现。

关于此主题的更多详细信息，请参见：

*   [在平台间共享代码](multiplatform-share-on-platforms.md)
*   [预期与实际声明](multiplatform-expect-actual.md)
*   [层级项目结构](multiplatform-hierarchy.md)

## 添加依赖项

Kotlin Multiplatform 项目可以依赖外部库和其他多平台项目。对于公共代码，你可以在公共源代码集中添加对多平台库的依赖项。Kotlin 会自动解析并把相应的平台特有部分添加到其他源代码集。如果只需要平台特有的 API，则将依赖项添加到相应的源代码集。

将 Android 特有的依赖项添加到 Kotlin Multiplatform 项目中，与在纯 Android 项目中添加它们类似。在使用 iOS 特有的依赖项时，你可以无缝集成 Apple SDK frameworks，无需额外配置。对于外部库和框架，Kotlin 提供了与 Objective-C 和 Swift 的互操作性。

关于此主题的更多详细信息，请参见：

*   [添加对多平台库的依赖项](multiplatform-add-dependencies.md)
*   [添加对 Android 库的依赖项](multiplatform-android-dependencies.md)
*   [添加对 iOS 库的依赖项](multiplatform-ios-dependencies.md)

## 设置与 iOS 的集成

如果你的多平台项目面向 iOS，你可以设置 Kotlin Multiplatform 共享模块与你的 iOS 应用的集成。

为此，你需要生成一个 iOS framework，然后将其作为本地或远程依赖项添加到 iOS 项目中：

*   **本地集成**：通过特殊脚本直接连接你的多平台项目和 Xcode 项目，或者在使用本地 Pod 依赖项的设置中，使用 CocoaPods 依赖管理器。
*   **远程集成**：使用 XCFrameworks 设置 SPM 依赖项，或通过 CocoaPods 分发共享模块。

关于此主题的更多详细信息，请参见[iOS 集成方法](multiplatform-ios-integration-overview.md)。

## 配置编译项

每个目标平台都可以有多个编译项，用于不同的目的，通常用于生产或测试，但你也可以定义自定义编译项。

使用 Kotlin Multiplatform，你可以在项目中配置所有编译项，在目标平台内设置特定编译项，甚至创建独立的编译项。配置编译项时，你可以修改编译器选项、管理依赖项，或配置与原生语言的互操作性。

关于此主题的更多详细信息，请参见[配置编译项](multiplatform-configure-compilations.md)。

## 构建最终二进制文件

默认情况下，目标平台会编译成一个 `.klib` artifact，它可以被 Kotlin/Native 自身作为依赖项使用，但不能被执行或用作原生库。然而，Kotlin Multiplatform 提供了构建最终原生二进制文件的额外机制。

你可以创建可执行二进制文件、共享库和静态库，或 Objective-C frameworks，每个都可以配置不同的构建类型。Kotlin 还提供了一种构建通用（fat）frameworks 和 XCFrameworks 的方式，用于 iOS 集成。

关于此主题的更多详细信息，请参见[构建原生二进制文件](multiplatform-build-native-binaries.md)。

## 创建多平台库

你可以创建一个多平台库，包含公共代码及其针对 JVM、Web 和原生平台的平台特有实现。

发布 Kotlin Multiplatform 库涉及到 Gradle 构建脚本中的特定配置。你可以使用 Maven 版本库和 `maven-publish` 插件进行发布。发布后，多平台库可以在其他跨平台项目中作为依赖项使用。

关于此主题的更多详细信息，请参见[发布多平台库](multiplatform-publish-lib-setup.md)。

## 参考

*   [Kotlin Multiplatform Gradle 插件的 DSL 参考](multiplatform-dsl-reference.md)
*   [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide.md)