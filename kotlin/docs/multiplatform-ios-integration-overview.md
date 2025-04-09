---
title: "iOS 集成方法"
---
你可以将 Kotlin Multiplatform 共享模块集成到你的 iOS 应用程序中。为此，你需要从共享模块生成一个 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)，然后将其作为依赖项添加到 iOS 项目：

<img src="/img/ios-integration-scheme.svg" alt="iOS integration scheme" style={{verticalAlign: 'middle'}}/>

可以作为本地或远程依赖使用此框架。如果希望完全控制整个代码库，并在通用代码更改时立即更新到最终应用程序，请选择本地集成。

如果希望将最终应用程序的代码库与通用代码库显式分离，请设置远程集成。在这种情况下，共享代码将像常规第三方依赖项一样集成到最终应用程序中。

## 本地集成

在本地设置中，有两种主要的集成选项。你可以通过一个特殊的脚本使用直接集成，该脚本使 Kotlin 构建成为 iOS 构建的一部分。如果你的 Kotlin Multiplatform 项目中有 Pod 依赖项，请采用 CocoaPods 集成方法。

### 直接集成

你可以通过将一个特殊的脚本添加到 Xcode 项目中，直接从 Kotlin Multiplatform 项目连接 iOS 框架。该脚本已集成到项目构建设置的构建阶段。

如果你的 Kotlin Multiplatform 项目中**没有**导入 CocoaPods 依赖项，则此集成方法可能适合你。

如果你在 Android Studio 中创建一个项目，请选择 **Regular framework (常规框架)** 选项以自动生成此设置。如果你使用 [Kotlin Multiplatform web wizard](https://kmp.jetbrains.com/)，则默认应用直接集成。

有关更多信息，请参见 [Direct integration (直接集成)](multiplatform-direct-integration)。

### 使用本地 podspec 的 CocoaPods 集成

你可以通过 [CocoaPods](https://cocoapods.org/)（一种流行的 Swift 和 Objective-C 项目的依赖项管理器）从 Kotlin Multiplatform 项目连接 iOS 框架。

如果满足以下条件，此集成方法适合你：

*  你有一个使用 CocoaPods 的 iOS 项目的单体仓库 (mono repository) 设置
*  你在 Kotlin Multiplatform 项目中导入 CocoaPods 依赖项

要设置具有本地 CocoaPods 依赖项的工作流程，你可以手动编辑脚本，也可以使用 Android Studio 中的向导生成项目。

有关更多信息，请参见 [CocoaPods overview and setup (CocoaPods 概述和设置)](native-cocoapods)。

## 远程集成

对于远程集成，你的项目可以使用 Swift Package Manager (SPM) 或 CocoaPods 依赖项管理器来连接 Kotlin Multiplatform 项目中的 iOS 框架。

### 带有 XCFrameworks 的 Swift package manager

你可以使用带有 XCFrameworks 的 Swift package manager (SPM) 依赖项来连接 Kotlin Multiplatform 项目中的 iOS 框架。

有关更多信息，请参见 [Swift package export setup (Swift 包导出设置)](native-spm)。

### 带有 XCFrameworks 的 CocoaPods 集成

你可以使用 Kotlin CocoaPods Gradle 插件构建 XCFrameworks，然后通过 CocoaPods 将项目的共享部分与移动应用程序分开分发。

有关更多信息，请参见 [Build final native binaries (构建最终原生二进制文件)](multiplatform-build-native-binaries#build-frameworks)。