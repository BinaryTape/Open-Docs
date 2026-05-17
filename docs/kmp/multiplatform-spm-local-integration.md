[//]: # (title: 从本地 Swift 软件包使用 Kotlin)

<tldr>
   这是一个本地集成方法。如果满足以下条件，它可能适合您：<br/>

   * 您拥有一个带有本地 SwiftPM 模块的 iOS 应用。
   * 您已经在本地机器上设置了一个面向 iOS 的 Kotlin Multiplatform 项目。
   * 您现有的 iOS 项目具有静态链接类型。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

在本教程中，您将学习如何使用 Swift 软件包管理器 (SwiftPM) 将 Kotlin Multiplatform 项目中的 Kotlin 框架集成到本地软件包中。

![直接集成图示](direct-integration-scheme.svg){width=700}

要设置集成，您将添加一个特殊的脚本，该脚本在项目的构建设置中将 `embedAndSignAppleFrameworkForXcode` Gradle 任务用作预操作。要查看 Xcode 项目中反映的公共代码更改，您只需重新构建 Kotlin Multiplatform 项目即可。

通过这种方式，您可以轻松地在本地 Swift 软件包中使用 Kotlin 代码。相比之下，常规的直接集成方法会将脚本添加到构建阶段，并且需要重新构建 Kotlin Multiplatform 和 iOS 项目才能获取公共代码的更改。

> 如果您还不熟悉 Kotlin Multiplatform，请先学习如何[设置环境](quickstart.md)以及[从头开始创建跨平台应用程序](compose-multiplatform-create-first-app.md)。
>
{style="tip"}

## 设置项目

该功能自 Kotlin 2.0.0 起可用。

> 要检查 Kotlin 版本，请导航至 Kotlin Multiplatform 项目根目录下的 `build.gradle(.kts)` 文件。您将在文件顶部的 `plugins {}` 代码块中看到当前版本。
> 
> 或者，检查 `gradle/libs.versions.toml` 文件中的版本编目。
> 
{style="tip"}

本教程假设您的项目正在使用[直接集成](multiplatform-direct-integration.md)方法，即在项目的构建阶段使用 `embedAndSignAppleFrameworkForXcode` 任务。如果您正在通过 CocoaPods 插件或通过带有 `binaryTarget` 的 Swift 软件包连接 Kotlin 框架，请先进行迁移。

### 从 SwiftPM binaryTarget 集成迁移 {initial-collapse-state="collapsed" collapsible="true"}

要从带有 `binaryTarget` 的 SwiftPM 集成迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或通过 <shortcut>Cmd + Shift + K</shortcut> 快捷键清理构建目录。
2. 在每个 `Package.swift` 文件中，删除对包含 Kotlin 框架的软件包的依赖项，以及对产品的目标依赖项。

### 从 CocoaPods 插件迁移 {initial-collapse-state="collapsed" collapsible="true"}

> 如果您在 `cocoapods {}` 代码块中依赖了其他 Pod，则必须采用 CocoaPods 集成方法。目前，在多模块 SwiftPM 项目中无法同时依赖 Pod 和 Kotlin 框架。
>
{style="warning"}

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或通过 <shortcut>Cmd + Shift + K</shortcut> 快捷键清理构建目录。
2. 在包含 Podfile 的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从 `build.gradle(.kts)` 文件中删除 `cocoapods {}` 代码块。
4. 删除 `.podspec` 文件和 Podfile。

## 将框架连接到您的项目

> 目前不支持集成到 `swift build`。
>
{style="note"}

要在本地 Swift 软件包中使用 Kotlin 代码，请将多平台项目生成的 Kotlin 框架连接到您的 Xcode 项目：

1. 在 Xcode 中，转到 **Product** | **Scheme** | **Edit scheme**，或点击顶部栏中的方案图标并选择 **Edit scheme**：

   ![编辑方案](xcode-edit-schemes.png){width=700}

2. 选择 **Build** | **Pre-actions** 项，然后点击 **+** | **New Run Script Action**：

   ![新建运行脚本操作](xcode-new-run-script-action.png){width=700}

3. 调整以下脚本并将其添加为操作：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定 Kotlin Multiplatform 项目根目录的路径，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:sharedLogic`。
  
4. 在 **Provide build settings from** 部分中选择应用的目标：

   ![填充后的运行脚本操作](xcode-filled-run-script-action.png){width=700}

5. 现在您可以将共享模块导入本地 Swift 软件包并使用 Kotlin 代码。

   In Xcode, navigate to your local Swift package and define a function with a module import, for example:

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SwiftPM 用法](xcode-spm-usage.png){width=700}

6. 在 iOS 项目的 `ContentView.swift` 文件中，您现在可以通过导入本地软件包来使用此函数：

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
   
还有几点值得考虑的因素：

* 如果您有不同于默认 `Debug` 或 `Release` 的自定义构建配置，请在 **Build Settings** 选项卡的 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。
* 如果遇到脚本沙盒化错误，请通过双击项目名称打开 iOS 项目设置，然后在 **Build Settings** 选项卡下禁用 **Build Options** 中的 **User Script Sandboxing**。

## 下一步

* [选择您的集成方法](multiplatform-ios-integration-overview.md)
* [了解如何设置 Swift 软件包导出](multiplatform-spm-export.md)