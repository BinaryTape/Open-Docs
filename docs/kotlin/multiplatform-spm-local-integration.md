---
title: "从本地 Swift 包中使用 Kotlin"
---
:::info

   这是一种本地集成方法。如果以下情况，它可能适合你：<br/>

   * 你有一个带有本地 SPM 模块的 iOS 应用程序。
   * 你已经在本地机器上设置了一个以 iOS 为目标的 Kotlin Multiplatform 项目。
   * 你现有的 iOS 项目具有静态链接类型。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview)

:::

在本教程中，你将学习如何使用 Swift 包管理器（SPM）将 Kotlin Multiplatform 项目中的 Kotlin 框架集成到本地包中。

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

要设置集成，你将添加一个特殊脚本，该脚本使用 `embedAndSignAppleFrameworkForXcode` Gradle 任务作为项目构建设置中的预操作（pre-action）。要查看在公共代码中所做的更改反映在你的 Xcode 项目中，你只需重新构建 Kotlin Multiplatform 项目。

这样，与常规的直接集成方法相比，你可以更轻松地在本地 Swift 包中使用 Kotlin 代码，该方法将脚本添加到构建阶段，并且需要重新构建 Kotlin Multiplatform 和 iOS 项目才能获取公共代码中的更改。

:::note
如果你不熟悉 Kotlin Multiplatform，请首先学习如何[设置环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)和[从头开始创建跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)。

## 设置项目

此功能从 Kotlin 2.0.0 开始可用。

要检查 Kotlin 版本，请导航到 Kotlin Multiplatform 项目根目录下的 `build.gradle(.kts)` 文件。你将在文件顶部的 `plugins {}` 块中看到当前版本。

或者，检查 `gradle/libs.versions.toml` 文件中的版本目录。

本教程假定你的项目正在使用[直接集成](multiplatform-direct-integration)方法，并在项目的构建阶段使用 `embedAndSignAppleFrameworkForXcode` 任务。如果你的项目是通过 CocoaPods 插件或带有 `binaryTarget` 的 Swift 包连接 Kotlin 框架，请先进行迁移。

### 从 SPM binaryTarget 集成迁移

要从带有 `binaryTarget` 的 SPM 集成迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用快捷键 <shortcut>Cmd + Shift + K</shortcut> 清理构建目录。
2. 在每个 `Package.swift` 文件中，删除对包含 Kotlin 框架的包的依赖以及对产品的目标依赖。

### 从 CocoaPods 插件迁移

如果你的 `cocoapods {}` 块中有对其他 Pod 的依赖，则必须采用 CocoaPods 集成方法。目前，在多模式 SPM 项目中，不可能同时依赖 Pod 和 Kotlin 框架。

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用快捷键 <shortcut>Cmd + Shift + K</shortcut> 清理构建目录。
2. 在包含 `Podfile` 的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从你的 `build.gradle(.kts)` 文件中删除 `cocoapods {}` 块。
4. 删除 `.podspec` 和 `Podfile` 文件。

## 将框架连接到你的项目

目前不支持集成到 `swift build` 中。

:::

为了能够在本地 Swift 包中使用 Kotlin 代码，请将从 multiplatform 项目生成的 Kotlin 框架连接到你的 Xcode 项目：

1. 在 Xcode 中，转到 **Product** | **Scheme** | **Edit scheme** 或单击顶部栏中的 scheme 图标并选择 **Edit scheme**：

   <img src="/img/xcode-edit-schemes.png" alt="Edit scheme" width="700" style={{verticalAlign: 'middle'}}/>

2. 选择 **Build** | **Pre-actions** 项，然后单击 **+** | **New Run Script Action**：

   <img src="/img/xcode-new-run-script-action.png" alt="New run script action" width="700" style={{verticalAlign: 'middle'}}/>

3. 调整以下脚本并将其添加为操作：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定你的 Kotlin Multiplatform 项目的根路径，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:composeApp`。
  
4. 在 **Provide build settings from** 部分中，选择你的应用程序的目标：

   <img src="/img/xcode-filled-run-script-action.png" alt="Filled run script action" width="700" style={{verticalAlign: 'middle'}}/>

5. 你现在可以将共享模块导入到你的本地 Swift 包中并使用 Kotlin 代码。

   在 Xcode 中，导航到你的本地 Swift 包并定义一个带有模块导入的函数，例如：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() `->` String {
       return Greeting.greet()
   }
   ```

   <img src="/img/xcode-spm-usage.png" alt="SPM usage" width="700" style={{verticalAlign: 'middle'}}/>

6. 在你的 iOS 项目的 `ContentView.swift` 文件中，你现在可以通过导入本地包来使用此函数：

   ```Swift
   import SwiftUI
   import SpmLocalPackage
   
   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }
   
   #Preview {
       ContentView()
   }
   ```
   
7. 在 Xcode 中构建项目。如果一切设置正确，项目构建将成功。
   
还有一些值得考虑的因素：

* 如果你有与默认的 `Debug` 或 `Release` 不同的自定义构建配置，请在 **Build Settings** 选项卡上，在 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。
* 如果你遇到脚本沙盒错误，请双击项目名称打开 iOS 项目设置，然后在 **Build Settings** 选项卡上，禁用 **Build Options** 下的 **User Script Sandboxing**。

## 接下来做什么

* [选择你的集成方法](multiplatform-ios-integration-overview)
* [学习如何设置 Swift 包导出](native-spm)