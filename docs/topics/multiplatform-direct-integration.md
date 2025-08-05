[//]: # (title: 直接集成)

<tldr>
   这是一种本地集成方法。如果你满足以下条件，它可能适合你：<br/>

   * 你已经在本地机器上设置了一个面向 iOS 的 Kotlin Multiplatform 项目。
   * 你的 Kotlin Multiplatform 项目没有 CocoaPods 依赖项。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

如果你想通过在 Kotlin Multiplatform 项目和 iOS 项目之间共享代码来同时开发它们，你可以使用一个特殊脚本来设置直接集成。

此脚本可自动将 Kotlin framework 连接到 Xcode 中的 iOS 项目：

![直接集成图](direct-integration-scheme.svg){width=700}

该脚本使用专为 Xcode 环境设计的 `embedAndSignAppleFrameworkForXcode` Gradle 任务。在设置过程中，你将其添加到 iOS 应用构建的运行脚本阶段。之后，Kotlin 构件会在运行 iOS 应用构建之前被构建并包含在派生数据中。

总的来说，该脚本会：

* 将编译后的 Kotlin framework 复制到 iOS 项目结构中的正确目录。
* 处理嵌入式 framework 的代码签名过程。
* 确保 Kotlin framework 中的代码更改反映在 Xcode 中的 iOS 应用中。

## 如何设置

如果你当前正在使用 CocoaPods 插件连接 Kotlin framework，请先进行迁移。如果你的项目没有 CocoaPods 依赖项，请[跳过此步骤](#connect-the-framework-to-your-project)。

### 从 CocoaPods 插件迁移

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或快捷键 <shortcut>Cmd + Shift + K</shortcut> 清理构建目录。
2. 在 Podfile 所在的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从你的 `build.gradle(.kts)` 文件中移除 `cocoapods {}` 代码块。
4. 删除 `.podspec` 文件和 Podfile。

### 将 framework 连接到你的项目

要将从 multiplatform 项目生成的 Kotlin framework 连接到你的 Xcode 项目：

1. `embedAndSignAppleFrameworkForXcode` 任务仅在声明了 `binaries.framework` 配置选项时才注册。在你的 Kotlin Multiplatform 项目中，检测 `build.gradle.kts` 文件中的 iOS 目标声明。
2. 在 Xcode 中，双击项目名称以打开 iOS 项目设置。
3. 在左侧的 **Targets** 部分中，选择你的目标，然后导航到 **Build Phases** 选项卡。
4. 点击 **+** 并选择 **New Run Script Phase**。

   ![添加运行脚本阶段](xcode-run-script-phase-1.png){width=700}

5. 调整以下脚本并将其结果粘贴到运行脚本字段中：

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * 在 `cd` 命令中，指定你的 Kotlin Multiplatform 项目根目录的路径，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:composeApp`。

   ![添加脚本](xcode-run-script-phase-2.png){width=700}

6. 禁用 **Based on dependency analysis** 选项。

   这可确保 Xcode 在每次构建期间都运行该脚本，并且不会每次都警告缺少输出依赖项。
7. 将 **Run Script** 阶段上移，放置在 **Compile Sources** 阶段之前。

   ![拖动运行脚本阶段](xcode-run-script-phase-3.png){width=700}

8. 在 **Build Settings** 选项卡上，在 **Build Options** 下禁用 **User Script Sandboxing** 选项：

   ![用户脚本沙盒](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果你未先禁用沙盒就构建了 iOS 项目，这可能需要重新启动你的 Gradle daemon。
   > 停止可能已被沙盒化的 Gradle daemon 进程：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. 在 Xcode 中构建项目。如果一切设置正确，项目将成功构建。

> 如果你的自定义构建配置与默认的 `Debug` 或 `Release` 不同，请在 **Build Settings** 选项卡上的 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。
>
{style="note"}

## 接下来是什么？

在使用 Swift 包管理器时，你还可以利用本地集成。 [了解如何在本地包中添加对 Kotlin framework 的依赖项](multiplatform-spm-local-integration.md)。