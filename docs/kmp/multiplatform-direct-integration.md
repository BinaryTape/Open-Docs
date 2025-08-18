[//]: # (title: 直接集成)

<tldr>
   这是一个本地集成方法。它适用于以下情况：<br/>

   * 你已在本地机器上设置好面向 iOS 的 Kotlin Multiplatform 项目。
   * 你的 Kotlin Multiplatform 项目没有 CocoaPods 依赖项。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

如果你想在 Kotlin Multiplatform 项目和 iOS 项目之间共享代码，从而同时开发它们，你可以使用一个特殊脚本设置直接集成。

该脚本可自动完成将 Kotlin framework 连接到 Xcode 中的 iOS 项目的过程：

![直接集成图](direct-integration-scheme.svg){width=700}

该脚本使用专门为 Xcode 环境设计的 `embedAndSignAppleFrameworkForXcode` Gradle 任务。
在设置过程中，你会将其添加到 iOS 应用构建的运行脚本阶段。之后，在运行 iOS 应用构建之前，Kotlin artifact 会被构建并包含在派生数据中。

一般来说，该脚本：

*   将编译后的 Kotlin framework 复制到 iOS project 结构内的正确目录中。
*   处理嵌入式 framework 的代码签名过程。
*   确保 Kotlin framework 中的代码更改反映在 Xcode 中的 iOS 应用中。

## 如何设置

如果你当前正在使用 CocoaPods 插件连接你的 Kotlin framework，请先进行迁移。
如果你的 project 没有 CocoaPods 依赖项，[跳过此步骤](#connect-the-framework-to-your-project)。

### 从 CocoaPods 插件迁移

要从 CocoaPods 插件迁移：

1.  在 Xcode 中，使用 **Product** | **Clean Build Folder** 或 <shortcut>Cmd + Shift + K</shortcut> 快捷键清理构建目录。
2.  在包含 Podfile 的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3.  从你的 `build.gradle(.kts)` 文件中移除 `cocoapods {}` 代码块。
4.  删除 `.podspec` 文件和 Podfile。

### 将 framework 连接到你的 project

要将多平台 project 生成的 Kotlin framework 连接到你的 Xcode project：

1.  `embedAndSignAppleFrameworkForXcode` 任务仅在声明 `binaries.framework` 配置选项时注册。在你的 Kotlin Multiplatform 项目中，检查 `build.gradle.kts` 文件中的 iOS 目标声明。
2.  在 Xcode 中，双击 project 名称打开 iOS project 设置。
3.  在左侧的 **Targets** 部分，选择你的目标，然后导航到 **Build Phases** 标签页。
4.  点击 **+** 并选择 **New Run Script Phase**。

   ![添加运行脚本阶段](xcode-run-script-phase-1.png){width=700}

5.  调整以下脚本，并将结果粘贴到运行脚本字段中：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   *   在 `cd` 命令中，指定你的 Kotlin Multiplatform 项目的根路径，例如 `$SRCROOT/..`。
   *   在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:composeApp`。

   ![添加脚本](xcode-run-script-phase-2.png){width=700}

6.  禁用 **Based on dependency analysis** 选项。

   这可确保 Xcode 在每次构建期间都运行脚本，并且不会每次都警告缺少输出依赖项。
7.  将 **Run Script** 阶段上移，放置在 **Compile Sources** 阶段之前。

   ![拖动运行脚本阶段](xcode-run-script-phase-3.png){width=700}

8.  在 **Build Settings** 标签页上，在 **Build Options** 下禁用 **User Script Sandboxing** 选项：

   ![用户脚本沙盒](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果你在未首先禁用沙盒的情况下构建了 iOS project，这可能需要重启你的 Gradle daemon。停止可能已被沙盒化的 Gradle daemon 进程：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9.  在 Xcode 中构建 project。如果一切设置正确，project 将成功构建。

> 如果你的构建配置与默认的 `Debug` 或 `Release` 不同，请在 **Build Settings** 标签页的 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设为 `Debug` 或 `Release`。
>
{style="note"}

## 接下来是什么？

在使用 Swift package manager 时，你也可以利用本地集成。 [了解如何在本地 package 中添加对 Kotlin framework 的依赖项](multiplatform-spm-local-integration.md)。