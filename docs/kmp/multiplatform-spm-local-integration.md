[//]: # (title: 在本地 Swift 包中使用 Kotlin)

<tldr>
   这是一种本地集成方法。如果符合以下情况，它可能对您有用：<br/>

   * 您的 iOS 应用包含本地 SPM 模块。
   * 您已在本地机器上设置了一个面向 iOS 的 Kotlin Multiplatform 项目。
   * 您现有的 iOS 项目采用静态链接类型。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

在本教程中，您将学习如何使用 Swift package manager (SPM) 将 Kotlin Multiplatform 项目中的 Kotlin framework 集成到本地包中。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

为了设置集成，您将添加一个特殊脚本，该脚本在您项目的构建设置中将 `embedAndSignAppleFrameworkForXcode` Gradle task 用作预操作。要查看通用代码中的更改在您的 Xcode 项目中得到反映，您只需重新构建 Kotlin Multiplatform 项目。

通过这种方式，您可以轻松地在本地 Swift 包中使用 Kotlin 代码，与常规的直接集成方法（该方法将脚本添加到构建阶段并需要重新构建 Kotlin Multiplatform 和 iOS 项目以获取通用代码中的更改）相比，更为便捷。

> 如果您不熟悉 Kotlin Multiplatform，请先了解如何[设置环境](quickstart.md)以及[从零开始创建跨平台应用程序](compose-multiplatform-create-first-app.md)。
>
{style="tip"}

## 设置项目

此特性自 Kotlin 2.0.0 起可用。

> 要检测 Kotlin 版本，请导航到 Kotlin Multiplatform 项目根目录下的 `build.gradle(.kts)` 文件。您将在文件顶部的 `plugins {}` 代码块中看到当前版本。
> 
> 或者，查看 `gradle/libs.versions.toml` 文件中的版本目录。
> 
{style="tip"}

本教程假定您的项目使用[直接集成](multiplatform-direct-integration.md)方法，并在项目的构建阶段使用 `embedAndSignAppleFrameworkForXcode` task。如果您通过 CocoaPods 插件或带有 `binaryTarget` 的 Swift 包连接 Kotlin framework，请先进行迁移。

### 从 SPM binaryTarget 集成迁移 {initial-collapse-state="collapsed" collapsible="true"}

要从带有 `binaryTarget` 的 SPM 集成迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷键 <shortcut>Cmd + Shift + K</shortcut> 清理构建目录。
2. 在每个 `Package.swift` 文件中，移除对包含 Kotlin framework 的包的依赖项，以及对产品的目标依赖项。

### 从 CocoaPods 插件迁移 {initial-collapse-state="collapsed" collapsible="true"}

> 如果您的 `cocoapods {}` 代码块中存在对其他 Pod 的依赖项，则必须采用 CocoaPods 集成方法。目前，在多模态 SPM 项目中，不可能同时依赖 Pod 和 Kotlin framework。
>
{style="warning"}

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷键 <shortcut>Cmd + Shift + K</shortcut> 清理构建目录。
2. 在 Podfile 所在目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从您的 `build.gradle(.kts)` 文件中移除 `cocoapods {}` 代码块。
4. 删除 `.podspec` 文件和 Podfile。

## 将 framework 连接到您的项目

> 目前不支持集成到 `swift build`。
>
{style="note"}

为了能够在本地 Swift 包中使用 Kotlin 代码，请将从 multiplatform 项目生成的 Kotlin framework 连接到您的 Xcode 项目：

1. 在 Xcode 中，转到 **Product** | **Scheme** | **Edit scheme**，或点击顶部栏中的 scheme 图标并选择 **Edit scheme**：

   ![Edit scheme](xcode-edit-schemes.png){width=700}

2. 选择 **Build** | **Pre-actions** 项，然后点击 **+** | **New Run Script Action**：

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. 调整以下脚本并将其添加为操作：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定 Kotlin Multiplatform 项目的根目录路径，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:composeApp`。
  
4. 在 **Provide build settings from** 部分中选择您的应用目标：

   ![Filled run script action](xcode-filled-run-script-action.png){width=700}

5. 现在您可以将共享模块导入到本地 Swift 包中并使用 Kotlin 代码。

   在 Xcode 中，导航到您的本地 Swift 包并定义一个包含模块导入的函数，例如：

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM usage](xcode-spm-usage.png){width=700}

6. 在您的 iOS 项目的 `ContentView.swift` 文件中，现在可以通过导入本地包来使用此函数：

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
   
还有几个值得考虑的因素： 

* 如果您有不同于默认 `Debug` 或 `Release` 的自定义构建配置，请在 **Build Settings** 选项卡上，在 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。
* 如果您遇到脚本沙盒错误，请双击项目名称打开 iOS 项目设置，然后在 **Build Settings** 选项卡上，在 **Build Options** 下禁用 **User Script Sandboxing**。

## 后续步骤

* [选择您的集成方法](multiplatform-ios-integration-overview.md)
* [了解如何设置 Swift 包导出](multiplatform-spm-export.md)