[//]: # (title: iOS 集成方法)

您可以将 Kotlin Multiplatform 共享模块集成到您的 iOS 应用中。为此，您可以从共享模块生成 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然后将其作为依赖项添加到 iOS 项目中：

![iOS 集成方案](ios-integration-scheme.svg)

您可以将此框架作为本地或远程依赖项使用。如果您希望完全控制整个代码库，并在通用代码更改时让最终应用程序获得实时更新，请选择本地集成。

如果您希望将最终应用程序的代码库与通用代码库明确分开，请设置远程集成。在这种情况下，共享代码将像常规第三方依赖项一样集成到最终应用程序中。

## 本地集成

在本地设置中，主要有两种集成选项。您可以通过专用脚本进行直接集成，这会使 Kotlin 构建成为 iOS 构建的一部分。如果您的 Kotlin Multiplatform 项目中有 Pod 依赖项，请采用 CocoaPods 集成方式。

### 直接集成

通过在 Xcode 项目中添加专用脚本，您可以直接连接来自 Kotlin Multiplatform 项目的 iOS 框架。该脚本会集成到项目构建设置的构建阶段中。

如果您在 Kotlin Multiplatform 项目中**没有**导入 CocoaPods 依赖项，这种集成方法可能适合您。

如果您使用 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，则默认应用直接集成。

有关更多信息，请参阅[直接集成](multiplatform-direct-integration.md)。

### 使用本地软件包的 SwiftPM 集成

您的 KMP iOS 框架可以通过 [Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) 依赖本地 Swift 软件包。

这种集成方法适用于以下情况：

* 您拥有包含使用 Swift 软件包的 iOS 项目的单仓库设置。
* 您的 Kotlin Multiplatform 项目中没有不可替代的 CocoaPods 依赖项。

要了解如何向您的项目添加本地 Swift 软件包依赖项，请参阅[添加 Swift 软件包作为依赖项](multiplatform-spm-import.md#importing-local-swift-packages)。

### 使用本地 podspec 的 CocoaPods 集成

您可以通过 [CocoaPods](https://cocoapods.org/)（Swift 和 Objective-C 项目流行的依赖管理器）连接来自 Kotlin Multiplatform 项目的 iOS 框架。

此集成方法适用于以下情况：

* 您拥有包含使用 CocoaPods 的 iOS 项目的单仓库设置。
* 您在 Kotlin Multiplatform 项目中导入了 CocoaPods 依赖项。

要了解如何设置使用本地 CocoaPods 依赖项的工作流，请参阅 [CocoaPods 概述与设置](multiplatform-cocoapods-overview.md)。

## 远程集成

对于远程集成，您的项目可能会使用 Swift Package Manager (SwiftPM) 或 CocoaPods 依赖管理器来连接来自 Kotlin Multiplatform 项目的 iOS 框架。

### 使用 XCFrameworks 的 SwiftPM

您既可以从 Kotlin Multiplatform 项目导出 XCFramework，也可以将远程 Swift 软件包作为依赖项导入 KMP 项目：
* 有关如何根据您的 XCFramework 制作和分发 Swift 软件包的说明，请参阅 [Swift 软件包导出设置](multiplatform-spm-export.md)。
* 要了解如何添加 Swift 软件包作为依赖项，请参阅 [Swift PM 导入文档](multiplatform-spm-import.md)。

### 使用 XCFrameworks 的 CocoaPods 集成

您可以使用 Kotlin CocoaPods Gradle 插件构建 XCFrameworks，然后通过 CocoaPods 将项目的共享部分与移动应用分开分发。

有关更多信息，请参阅[构建最终原生二进制文件](multiplatform-build-native-binaries.md#build-xcframeworks)。