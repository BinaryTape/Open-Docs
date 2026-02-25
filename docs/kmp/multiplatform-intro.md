[//]: # (title: Kotlin Multiplatform 简介)

对多平台编程的支持是 Kotlin 的核心优势之一。它减少了为[不同平台](multiplatform-dsl-reference.md#targets)编写和维护相同代码的时间，同时保留了原生编程的灵活性和优势。

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 学习核心概念

Kotlin Multiplatform 允许你在不同平台（无论是移动端、Web 端还是桌面端）之间共享代码。代码编译到的平台由 *目标 (target)* 列表定义。

每个目标都有一个对应的*源集 (source set)*，它代表一组具有自己的依赖项和编译器选项的源文件。特定于平台的源集（例如用于 JVM 的 `jvmMain`）可以使用特定于平台的库和 API。

要在目标的子集之间共享代码，可以使用中间源集。例如，`appleMain` 源集代表在所有 Apple 平台之间共享的代码。在所有平台之间共享并编译到所有已声明目标的代码拥有自己的源集 `commonMain`。它不能使用特定于平台的 API，但可以利用多平台库。

当为特定目标进行编译时，Kotlin 会组合通用源集、相关的中间源集以及特定于目标的源集。

有关此主题的更多详情，请参阅：

* [Kotlin Multiplatform 项目结构基础](multiplatform-discover-project.md)
* [多平台项目结构的高级概念](multiplatform-advanced-project-structure.md)

## 使用代码共享机制

有时在相似目标的子集之间共享代码会更方便。Kotlin Multiplatform 提供了一种通过*默认层次结构模板*简化其创建的方法。它包含一个预定义的中间源集列表，这些源集是根据你在项目中指定的目标创建的。

要从共享代码访问特定于平台的 API，你可以使用另一种 Kotlin 机制：*expect 和 actual 声明*。通过这种方式，你可以声明在通用代码中 `expect`（预期）一个特定于平台的 API，但为每个目标平台提供单独的 `actual`（实际）实现。你可以将此机制与不同的 Kotlin 概念结合使用，包括函数、类和接口。例如，你可以在通用代码中定义一个函数，但在对应的源集中使用特定于平台的库提供其实现。

有关此主题的更多详情，请参阅：

* [在平台间共享代码](multiplatform-share-on-platforms.md)
* [expect 和 actual 声明](multiplatform-expect-actual.md)
* [分层项目结构](multiplatform-hierarchy.md)

## 添加依赖项

Kotlin Multiplatform 项目可以依赖外部库和其他多平台项目。对于通用代码，你可以在通用源集中添加对多平台库的依赖项。Kotlin 会自动解析并为其他源集添加适当的特定于平台的的部分。如果只需要特定于平台的 API，请将依赖项添加到对应的源集中。

向 Kotlin Multiplatform 项目添加特定于 Android 的依赖项与在纯 Android 项目中添加它们类似。在处理特定于 iOS 的依赖项时，你可以无缝集成 Apple SDK 框架而无需额外配置。对于外部库和框架，Kotlin 提供了与 Objective-C 和 Swift 的互操作性。

有关此主题的更多详情，请参阅：

* [添加对多平台库的依赖项](multiplatform-add-dependencies.md)
* [添加对 Android 库的依赖项](multiplatform-android-dependencies.md)
* [添加对 iOS 库的依赖项](multiplatform-ios-dependencies.md)

## 设置与 iOS 的集成

如果你的多平台项目以 iOS 为目标，你可以设置 Kotlin Multiplatform 共享模块与 iOS 应用的集成。

为此，你需要生成一个 iOS 框架，然后将其作为本地或远程依赖项添加到 iOS 项目中：

* **本地集成**：通过特殊脚本直接连接你的多平台项目和 Xcode 项目，或者对于涉及本地 Pod 依赖项的设置使用 CocoaPods 依赖管理器。
* **远程集成**：使用 XCFrameworks 设置 SPM 依赖项，或通过 CocoaPods 分发共享模块。

有关此主题的更多详情，请参阅 [iOS 集成方法](multiplatform-ios-integration-overview.md)。

## 配置编译

每个目标都可以为不同目的拥有多个编译，通常用于生产或测试，但你也可以定义自定义编译。

通过 Kotlin Multiplatform，你可以配置项目中的所有编译，在目标内设置特定编译，甚至创建单个编译。在配置编译时，你可以修改编译器选项、管理依赖项或配置与原生语言的互操作性。

有关此主题的更多详情，请参阅[配置编译](multiplatform-configure-compilations.md)。

## 构建最终二进制文件

默认情况下，目标会被编译为 `.klib` 工件，它可以被 Kotlin/Native 本身作为依赖项使用，但不能作为原生库执行或使用。然而，Kotlin Multiplatform 提供了额外的机制来构建最终的原生二进制文件。

你可以创建可执行二进制文件、动态库和静态库或 Objective-C 框架，每个都可以为不同的构建类型进行配置。Kotlin 还提供了一种为 iOS 集成构建通用 (fat) 框架和 XCFrameworks 的方法。

有关此主题的更多详情，请参阅[构建原生二进制文件](multiplatform-build-native-binaries.md)。

## 创建多平台库

你可以创建一个包含通用代码及其针对 JVM、Web 和原生平台特定实现的多平台库。

发布 Kotlin Multiplatform 库涉及在 Gradle 构建脚本中进行特定配置。你可以使用 Maven 仓库和 `maven-publish` 插件进行发布。发布后，多平台库可以作为依赖项在其他跨平台项目中使用。

有关此主题的更多详情，请参阅[发布多平台库](multiplatform-publish-lib-setup.md)。

## 参考

* [Kotlin Multiplatform Gradle 插件的 DSL 参考](multiplatform-dsl-reference.md)
* [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide.md)