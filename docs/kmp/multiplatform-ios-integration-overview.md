[//]: # (title: iOS 集成方法)

您可以将 Kotlin Multiplatform 共享模块集成到您的 iOS 应用中。为此，您可以从共享模块生成一个 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然后将其作为依赖项添加到 iOS 项目中：

![iOS 集成示意图](ios-integration-scheme.svg)

可以将此 framework 作为本地或远程依赖项使用。如果您想完全控制整个代码库，并在公共代码更改时即时更新最终应用，请选择本地集成。

如果您想将最终应用的代码库与公共代码库显式分离，请设置远程集成。在这种情况下，共享代码将像常规第三方依赖项一样集成到最终应用中。

## 本地集成

在本地设置中，有两种主要的集成选项。您可以使用通过特殊脚本的直接集成，这使得 Kotlin 构建成为 iOS 构建的一部分。如果您的 Kotlin Multiplatform 项目中包含 Pod 依赖项，请采用 CocoaPods 集成方法。

### 直接集成

您可以通过向 Xcode 项目添加特殊脚本，直接从 Kotlin Multiplatform 项目连接 iOS framework。该脚本集成在项目构建设置的构建阶段中。

如果您的 Kotlin Multiplatform 项目中**不**导入 CocoaPods 依赖项，则此集成方法可以适用。

如果您在 Android Studio 中创建项目，请选择 **Regular framework** 选项以自动生成此设置。如果您使用 [Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com/)，则默认应用直接集成。

关于直接集成，请参见[Direct integration](multiplatform-direct-integration.md)。

### CocoaPods 通过本地 podspec 集成

您可以通过 [CocoaPods](https://cocoapods.org/)（一个流行的 Swift 和 Objective-C 项目依赖项管理器），从 Kotlin Multiplatform 项目连接 iOS framework。

此集成方法适用于您，如果：

* 您有一个使用 CocoaPods 的 iOS 项目的单一版本库设置
* 您在 Kotlin Multiplatform 项目中导入 CocoaPods 依赖项

要设置使用本地 CocoaPods 依赖项的工作流，您可以手动编辑脚本，或在 Android Studio 中使用向导生成项目。

关于 CocoaPods 概述和设置，请参见[CocoaPods overview and setup](multiplatform-cocoapods-overview.md)。

## 远程集成

对于远程集成，您的项目可以使用 Swift Package Manager (SPM) 或 CocoaPods 依赖项管理器，从 Kotlin Multiplatform 项目连接 iOS framework。

### Swift package manager 与 XCFrameworks

您可以设置一个使用 XCFrameworks 的 Swift package manager (SPM) 依赖项，以从 Kotlin Multiplatform 项目连接 iOS framework。

关于 Swift 包导出设置，请参见[Swift package export setup](multiplatform-spm-export.md)。

### CocoaPods 与 XCFrameworks 集成

您可以使用 Kotlin CocoaPods Gradle 插件构建 XCFrameworks，然后通过 CocoaPods 将项目的共享部分与移动应用分开分发。

关于构建最终原生二进制文件，请参见[Build final native binaries](multiplatform-build-native-binaries.md#build-frameworks)。