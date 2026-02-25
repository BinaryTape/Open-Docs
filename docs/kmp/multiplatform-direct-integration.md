[//]: # (title: 直接集成)

<tldr>
   这是一种本地集成方法。如果满足以下条件，该方法可能适合您：<br/>

   * 您已经在本地机器上设置了一个以 iOS 为目标的 Kotlin 多平台项目。
   * 您的 Kotlin 多平台项目没有 CocoaPods 依赖项。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

如果您想通过在 Kotlin 多平台项目和 iOS 项目之间共享代码来同时开发它们，可以使用特殊脚本设置直接集成。

该脚本会自动完成在 Xcode 中将 Kotlin 框架连接到 iOS 项目的过程：

![直接集成图示](direct-integration-scheme.svg){width=700}

该脚本使用专门为 Xcode 环境设计的 `embedAndSignAppleFrameworkForXcode` Gradle 任务。在设置过程中，您将其添加到 iOS 应用构建的运行脚本阶段。之后，在运行 iOS 应用构建之前，Kotlin 工件将被构建并包含在派生数据中。

通常，该脚本会：

* 将编译后的 Kotlin 框架复制到 iOS 项目结构中的正确目录中。
* 处理嵌入框架的代码签名过程。
* 确保 Kotlin 框架中的代码更改能反映在 Xcode 的 iOS 应用中。

## 如何设置

如果您当前正在使用 CocoaPods 插件连接 Kotlin 框架，请先进行迁移。如果您的项目没有 CocoaPods 依赖项，请[跳过此步骤](#connect-the-framework-to-your-project)。

### 从 CocoaPods 插件迁移

要从 CocoaPods 插件迁移：

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 或使用 <shortcut>Cmd + Shift + K</shortcut> 快捷键清理构建目录。
2. 在包含 Podfile 的目录中，运行以下命令：

    ```none
   pod deintegrate
   ```

3. 从 `build.gradle(.kts)` 文件中移除 `cocoapods {}` 代码块。
4. 删除 `.podspec` 文件和 Podfile。

### 将框架连接到您的项目

要将从多平台项目生成的 Kotlin 框架连接到您的 Xcode 项目：

1. 只有在声明了 `binaries.framework` 配置选项的情况下，`embedAndSignAppleFrameworkForXcode` 任务才会注册。在您的 Kotlin 多平台项目中，检查 `build.gradle.kts` 文件中的 iOS 目标声明。
2. 在 Xcode 中，通过双击项目名称打开 iOS 项目设置。
3. 在左侧的 **Targets** 部分，选择您的目标，然后导航到 **Build Phases** 选项卡。
4. 点击 **+** 并选择 **New Run Script Phase**。

   ![添加运行脚本阶段](xcode-run-script-phase-1.png){width=700}

5. 调整以下脚本并将其粘贴到新阶段的脚本文本字段中：

   ```bash
   if [ "YES" = "$OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED" ]; then
       echo "Skipping Gradle build task invocation due to OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED environment variable set to \"YES\""
       exit 0
   fi
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   * 在 `cd` 命令中，指定 Kotlin 多平台项目根目录的路径，例如 `$SRCROOT/..`。
   * 在 `./gradlew` 命令中，指定共享模块的名称，例如 `:shared` 或 `:composeApp`。
   
   当您启动 iOS 运行配置时，IntelliJ IDEA 和 Android Studio 会在开始 Xcode 构建之前构建 Kotlin 框架依赖项，并将 `OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED` 环境变量设置为 "YES"。提供的 shell 脚本会检查此变量，并防止从 Xcode 再次构建 Kotlin 框架。
     
   > 当您为不支持此功能的项目启动 iOS 运行配置时，IDE 会建议修复以设置构建保护。
   >
   {style="note"}

6. 禁用 **Based on dependency analysis** 选项。

   ![添加脚本](xcode-run-script-phase-2.png){width=700}

   这可以确保 Xcode 在每次构建期间都运行该脚本，并且不会在每次都警告缺少输出依赖项。

7. 将 **Run Script** 阶段向上移动，放在 **Compile Sources** 阶段之前。

   ![拖动 Run Script 阶段](xcode-run-script-phase-3.png){width=700}

8. 在 **Build Settings** 选项卡上，禁用 **Build Options** 下的 **User Script Sandboxing** 选项：

   ![用户脚本沙盒化](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果您在未先禁用沙盒化的情况下构建了 iOS 项目，则可能需要重启 Gradle 守护进程。停止可能已被沙盒化的 Gradle 守护进程：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. 在 Xcode 中构建项目。如果一切设置正确，项目将成功构建。

> 如果您有不同于默认 `Debug` 或 `Release` 的自定义构建配置，请在 **Build Settings** 选项卡的 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设为 `Debug` 或 `Release`。
>
{style="note"}

## 下一步是什么？

在使用 Swift 软件包管理器时，您也可以利用本地集成。[了解如何在本地包中添加对 Kotlin 框架的依赖项](multiplatform-spm-local-integration.md)。