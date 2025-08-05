[//]: # (title: iOS 集成方法)

你可以将 Kotlin Multiplatform 共享模块集成到你的 iOS 应用中。为此，你需要从该共享模块生成一个 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然后将其作为依赖项添加到 iOS 项目中：

![iOS 集成方案](ios-integration-scheme.svg)

你可以将此 framework 作为本地或远程依赖项使用。如果你希望完全控制整个代码库，并在公共代码更改时即时更新最终应用程序，请选择本地集成。

如果你想将最终应用程序的代码库与公共代码库显式分离，请设置远程集成。在这种情况下，共享代码将像常规的第三方依赖项一样集成到最终应用程序中。

## 本地集成

在本地设置中，有两种主要的集成选项。你可以通过一个特殊脚本使用直接集成，这使得 Kotlin 构建成为 iOS 构建的一部分。如果你的 Kotlin Multiplatform 项目中有 Pod 依赖项，请采用 CocoaPods 集成方法。

### 直接集成

你可以通过向 Xcode 项目添加一个特殊脚本，直接从 Kotlin Multiplatform 项目连接 iOS framework。该脚本会集成到你项目的构建设置的构建阶段中。

如果你的 Kotlin Multiplatform 项目中**没有**导入 CocoaPods 依赖项，这种集成方法对你来说是可行的。

如果你在 Android Studio 中创建项目，请选择 **Regular framework** 选项以自动生成此设置。如果你使用 [Kotlin Multiplatform web wizard](https://kmp.jetbrains.com/)，则默认应用直接集成。

关于更多信息，请参见[直接集成](multiplatform-direct-integration.md)。

### 使用本地 podspec 的 CocoaPods 集成

你可以通过 [CocoaPods](https://cocoapods.org/)（一个流行的 Swift 和 Objective-C 项目依赖管理器）连接 Kotlin Multiplatform 项目中的 iOS framework。

这种集成方法适用于以下情况：

* 你有一个使用 CocoaPods 的 iOS 项目的单一版本库设置
* 你在 Kotlin Multiplatform 项目中导入了 CocoaPods 依赖项

要设置使用本地 CocoaPods 依赖项的工作流程，你可以手动编辑脚本，或在 Android Studio 中使用向导生成项目。

关于更多信息，请参见[CocoaPods 概述与设置](multiplatform-cocoapods-overview.md)。

## 远程集成

对于远程集成，你的项目可以使用 Swift Package Manager (SPM) 或 CocoaPods 依赖管理器来连接 Kotlin Multiplatform 项目中的 iOS framework。

### 使用 XCFrameworks 的 Swift Package Manager

你可以使用 XCFrameworks 设置 Swift Package Manager (SPM) 依赖项，以连接 Kotlin Multiplatform 项目中的 iOS framework。

关于更多信息，请参见[Swift 包导出设置](multiplatform-spm-export.md)。

### 使用 XCFrameworks 的 CocoaPods 集成

你可以使用 Kotlin CocoaPods Gradle 插件构建 XCFrameworks，然后通过 CocoaPods 将项目的共享部分与移动应用分开分发。

关于更多信息，请参见[构建最终原生二进制文件](multiplatform-build-native-binaries.md#build-frameworks)。