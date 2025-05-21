---
title: "Direct integration"
---
:::info

   这是一种本地集成方法。如果满足以下条件，它可以为您工作：<br/>

   * 您已经在本地机器上设置了一个以 iOS 为目标的 Kotlin Multiplatform 项目。
   * 您的 Kotlin Multiplatform 项目没有 CocoaPods 依赖项。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview)

:::

如果您想通过在 Kotlin Multiplatform 项目和 iOS 项目之间共享代码来同时开发它们，您可以使用一个特殊的脚本来设置直接集成。

此脚本自动化了将 Kotlin framework 连接到 Xcode 中 iOS 项目的过程：

<img src="/img/direct-integration-scheme.svg" alt="Direct integration diagram" width="700" style={{verticalAlign: 'middle'}}/>

该脚本使用专门为 Xcode 环境设计的 `embedAndSignAppleFrameworkForXcode` Gradle 任务。在设置过程中，您将其添加到 iOS 应用构建的运行脚本阶段 (run script phase)。之后，Kotlin artifact 在运行 iOS 应用构建之前被构建并包含在派生数据 (derived data) 中。

一般来说，该脚本：

* 将编译后的 Kotlin framework 复制到 iOS 项目结构中的正确目录。
* 处理嵌入式 framework 的代码签名过程。
* 确保 Kotlin framework 中的代码更改反映在 Xcode 的 iOS 应用中。

## 如何设置

如果您目前正在使用 CocoaPods 插件来连接您的 Kotlin framework，请先进行迁移。如果您的项目没有 CocoaPods 依赖项，请[跳过此步骤](#connect-the-framework-to-your-project)。

### 从 CocoaPods 插件迁移

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或 <shortcut>Cmd + Shift + K</shortcut> 快捷方式清除构建目录。
2. 在包含 `Podfile` 文件的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从您的 `build.gradle(.kts)` 文件中删除 `cocoapods {}` 代码块。
4. 删除 `.podspec` 和 `Podfile` 文件。

### 将 framework 连接到您的项目

要将从 multiplatform 项目生成的 Kotlin framework 连接到您的 Xcode 项目：

1. 只有在声明了 `binaries.framework` 配置选项时，`embedAndSignAppleFrameworkForXcode` 任务才会注册。在您的 Kotlin Multiplatform 项目中，检查 `build.gradle.kts` 文件中的 iOS target 声明。
2. 在 Xcode 中，双击项目名称以打开 iOS 项目设置。
3. 在项目设置的 **Build Phases** 选项卡上，单击 **+** 并选择 **New Run Script Phase**。

   <img src="/img/xcode-run-script-phase-1.png" alt="Add run script phase" width="700" style={{verticalAlign: 'middle'}}/>

4. 调整以下脚本，并将结果复制到运行脚本阶段：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定 Kotlin Multiplatform 项目的根路径，例如，`$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如，`:shared` 或 `:composeApp`。

   <img src="/img/xcode-run-script-phase-2.png" alt="Add the script" width="700" style={{verticalAlign: 'middle'}}/>

5. 将 **Run Script** 阶段拖到 **Compile Sources** 阶段之前。

   <img src="/img/xcode-run-script-phase-3.png" alt="Drag the Run Script phase" width="700" style={{verticalAlign: 'middle'}}/>

6. 在 **Build Settings** 选项卡上，禁用 **Build Options** 下的 **User Script Sandboxing** 选项：

   <img src="/img/disable-sandboxing-in-xcode-project-settings.png" alt="User Script Sandboxing" width="700" style={{verticalAlign: 'middle'}}/>

   > 如果您在未先禁用沙盒的情况下构建了 iOS 项目，这可能需要重新启动 Gradle 守护进程。
   > 停止可能已被沙盒化的 Gradle 守护进程进程：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > 

7. 在 Xcode 中构建项目。如果一切设置正确，项目将成功构建。

:::note
如果您有一个与默认的 `Debug` 或 `Release` 不同的自定义构建配置，请在 **Build Settings**
选项卡上，在 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。

:::

## 接下来做什么？

当使用 Swift Package Manager 时，您还可以利用本地集成。[了解如何在本地 package 中添加对 Kotlin framework 的依赖](multiplatform-spm-local-integration)。