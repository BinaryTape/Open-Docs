[//]: # (title: Kotlin Multiplatform 快速入门)

<web-summary>JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支持。</web-summary>

通过本教程，你可以让一个简单的 Kotlin Multiplatform 应用程序运行起来。

## 设置环境

Kotlin Multiplatform (KMP) 项目需要特定的环境，但大多数要求都会通过 IDE 中的预检得到明确。

从 IDE 和必要的插件开始：

1.  选择并安装 IDE。
    IntelliJ IDEA 和 Android Studio 都支持 Kotlin Multiplatform，因此你可以使用你偏好的 IDE。

    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) 是安装 IDE 的推荐工具。它允许你管理多个产品或版本，包括 [抢先体验计划](https://www.jetbrains.com/resources/eap/) (EAP) 和每夜构建版本。

    对于独立安装，请下载 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 或 [Android Studio](https://developer.android.com/studio) 的安装程序。

    Kotlin Multiplatform 所需的插件需要 **IntelliJ IDEA 2025.1.1.1** 或 **Android Studio Narwhal 2025.1.1**。

2.  安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)（不要与 Kotlin Multiplatform Gradle 插件混淆）。

    > Kotlin Multiplatform 插件尚未在 Windows 或 Linux 上的 IDE 中提供。但它在这些平台上也并非绝对必要：你仍然可以按照教程生成并运行 KMP 项目。
    > {style="note"}

3.  为 IntelliJ IDEA 安装 Kotlin Multiplatform IDE 插件还会安装所有必要的依赖项（如果你还没有安装），Android Studio 已捆绑所有必要的插件。

    如果你在 Windows 或 Linux 上使用 IntelliJ IDEA，请确保手动安装所有必要的插件：
    *   [Android](https://plugins.jetbrains.com/plugin/22989-android)
    *   [Android Design Tools](https://plugins.jetbrains.com/plugin/22990-android-design-tools)
    *   [Jetpack Compose](https://plugins.jetbrains.com/plugin/18409-jetpack-compose)
    *   [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
    *   [Compose Multiplatform for Desktop IDE Support](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-for-desktop-ide-support)（仅当你没有 Kotlin Multiplatform 插件时才需要）。

4.  如果你的 `ANDROID_HOME` 环境变量未设置，请配置你的系统以识别它：

    <Tabs>
    <TabItem title= "Bash 或 Zsh">

    将以下命令添加到你的 `.profile` 或 `.zprofile`：

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </TabItem>
    <TabItem title= "Windows PowerShell 或 CMD">

    对于 PowerShell，你可以使用以下命令添加一个持久性环境变量（详见 [PowerShell 文档](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)）：

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    对于 CMD，使用 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 命令：

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </TabItem>
    </Tabs>

5.  要创建 iOS 应用程序，你需要一台安装了 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 的 macOS 主机。你的 IDE 会在后台运行 Xcode 来构建 iOS framework。

    确保在开始使用 KMP 项目之前至少启动 Xcode 一次，以便它完成初始设置。

    > 每次 Xcode 更新时，你都需要手动启动它并下载更新的工具。Kotlin Multiplatform IDE 插件会进行预检，在 Xcode 未处于正确工作状态时提醒你。
    > {style="note"}

## 创建项目

### 在 macOS 上

在 macOS 上，Kotlin Multiplatform 插件在 IDE 内部提供了一个项目生成向导：

<Tabs>
<TabItem title= "IntelliJ IDEA">

使用 IDE 向导创建新的 KMP 项目：

1.  在主菜单中选择 **File** | **New** | **Project**。
2.  在左侧列表中选择 **Kotlin Multiplatform**。
3.  根据需要设置项目的名称、位置和其他基本属性。
4.  我们建议选择一个版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 作为项目的 JDK，因为它提供了重要的修复，特别是为了提高桌面 KMP 应用程序的兼容性。
    每个 IntelliJ IDEA 发行版都包含相关版本的 JBR，因此无需额外设置。
5.  选择你希望作为项目一部分的平台：
    *   所有目标平台都可以设置为使用 Compose Multiplatform 从一开始就共享 UI 代码（服务器模块除外，因为它没有 UI 代码）。
    *   对于 iOS，你可以选择两种实现之一：
        *   共享 UI 代码，使用 Compose Multiplatform，
        *   完全原生的 UI，使用 SwiftUI 构建并与共享逻辑的 Kotlin 模块连接。
    *   桌面目标包含 [Compose Hot Reload](compose-hot-reload.md) 功能的 Alpha 版本，它允许你在更改相应代码后立即看到 UI 更改。
        即使你没有计划制作桌面应用程序，你也可能希望使用桌面版本来加速编写 UI 代码。

选择完平台后，点击 **Create** 按钮，等待 IDE 生成并导入项目。

![IntelliJ IDEA 向导，包含默认设置并选择了 Android、iOS、桌面和 Web 平台](idea-wizard-1step.png){width=800}

</TabItem>
<TabItem title= "Android Studio">

Kotlin Multiplatform IDE 插件高度依赖 K2 功能，如果没有 K2 功能将无法按所述工作。
因此，在开始之前，请确保 K2 模式已启用：**Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**。

使用 IDE 向导创建新的 KMP 项目：

1.  在主菜单中选择 **File** | **New** | **New project**。
2.  在默认的 **Phone and Tablet** 模板类别中选择 **Kotlin Multiplatform**。

    ![Android Studio 中的新项目第一步](as-wizard-1.png){width="400"}

3.  根据需要设置项目的名称、位置和其他基本属性，然后点击 **Next**。
4.  选择你希望作为项目一部分的平台：
    *   所有目标平台都可以设置为使用 Compose Multiplatform 从一开始就共享 UI 代码（服务器模块除外，因为它没有 UI 代码）。
    *   对于 iOS，你可以选择两种实现之一：
        *   共享 UI 代码，使用 Compose Multiplatform，
        *   完全原生的 UI，使用 SwiftUI 构建并与共享逻辑的 Kotlin 模块连接。
    *   桌面目标包含 hot reload 功能的 alpha 版本，它允许你在更改相应代码后立即看到 UI 更改。
        即使你没有计划制作桌面应用程序，你也可能希望使用桌面版本来加速编写 UI 代码。
5.  项目生成后，我们建议选择一个版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 作为项目的 JDK，因为它提供了重要的修复，特别是为了提高桌面 KMP 应用程序的兼容性。
    每个 IntelliJ IDEA 发行版都包含相关版本的 JBR，因此无需额外设置。

选择完平台后，点击 **Finish** 按钮，等待 IDE 生成并导入项目。

![Android Studio 向导的最后一步，选择了 Android、iOS、桌面和 Web 平台](as-wizard-3step.png){width=800}

</TabItem>
</Tabs>

### 在 Windows 或 Linux 上

如果你在 Windows 或 Linux 上：

1.  使用 [web KMP 向导](https://kmp.jetbrains.com/) 生成项目。
2.  解压归档文件并在你的 IDE 中打开生成的文件夹。
3.  等待导入完成，然后前往 [运行示例应用](#run-the-sample-apps) 部分，了解如何构建和运行应用程序。

## 查阅预检

你可以通过打开 **Project Environment Preflight Checks** 工具窗口来确保项目设置没有环境问题：点击右侧边栏或底部栏上的预检图标 ![带有飞机的预检图标](ide-preflight-checks.png){width="20"}

在这个工具窗口中，你可以查看与这些检测相关的消息，重新运行它们，或更改它们的设置。

预检命令也可以在 **Search Everywhere** 对话框中找到。
按下双重 <shortcut>Shift</shortcut> 并搜索包含“preflight”一词的命令：

![Search Everywhere 菜单，输入了“preflight”一词](double-shift-preflight-checks.png)

## 运行示例应用

IDE 向导创建的项目包含为 iOS、Android、桌面和 Web 应用程序生成的运行配置，以及用于运行服务器应用程序的 Gradle 任务。
在 Windows 和 Linux 上，请参阅下方每个平台的 Gradle 命令。

<Tabs>
<TabItem title="Android">

要运行 Android 应用程序，请启动 **composeApp** 运行配置：

![突出显示 Android 运行配置的下拉菜单](run-android-configuration.png){width=250}

要在 Windows 或 Linux 上运行 Android 应用程序，请创建 **Android App** 运行配置，并选择模块 **[项目名称].composeApp**。

默认情况下，它会在第一个可用的虚拟设备上运行：

![在虚拟设备上运行的 Android 应用程序](run-android-app.png){width=350}

</TabItem>
<TabItem title="iOS">

> 你需要 macOS 主机来构建 iOS 应用程序。
> {style="note"}

如果你为项目选择了 iOS 目标并设置了带有 Xcode 的 macOS 机器，你可以选择 **iosApp** 运行配置并选择一个模拟设备：

![突出显示 iOS 运行配置的下拉菜单](run-ios-configuration.png){width=250}

当你运行 iOS 应用程序时，它会在后台使用 Xcode 构建，并在 iOS 模拟器中启动。
第一次构建会收集编译所需的原生依赖项，并为后续运行预热构建：

![在虚拟设备上运行的 iOS 应用程序](run-ios-app.png){width=350}

</TabItem>
<TabItem title="Desktop">

桌面应用程序的默认运行配置创建为 **composeApp [desktop]**：

![突出显示默认桌面运行配置的下拉菜单](run-desktop-configuration.png){width=250}

要在 Windows 或 Linux 上运行桌面应用程序，请创建一个 **Gradle** 运行配置，指向 **[app name]:composeApp** Gradle 项目，并使用以下命令：

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

通过此配置，你可以运行 JVM 桌面应用程序：

![在虚拟设备上运行的 JVM 应用程序](run-desktop-app.png){width=600}

</TabItem>
<TabItem title="Web">

Web 应用程序的默认运行配置创建为 **composeApp [wasmJs]**：

![突出显示默认 Wasm 运行配置的下拉菜单](run-wasm-configuration.png){width=250}

要在 Windows 或 Linux 上运行 Web 应用程序，请创建一个 **Gradle** 运行配置，指向 **[app name]:composeApp** Gradle 项目，并使用以下命令：

```shell
wasmJsBrowserDevelopmentRun
```

当你运行此配置时，IDE 会构建 Kotlin/Wasm 应用程序并在默认浏览器中打开它：

![在虚拟设备上运行的 Web 应用程序](run-wasm-app.png){width=600}

</TabItem>
</Tabs>

## 故障排除

### Java 和 JDK

Java 常见问题：

*   某些工具可能找不到要运行的 Java 版本或使用了错误的版本。
    解决此问题：
    *   将 `JAVA_HOME` 环境变量设置为安装了相应 JDK 的目录。

        > 我们建议使用 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)，这是一个支持类重定义的 OpenJDK 分支。
        > {style="note"}

    *   将 `JAVA_HOME` 目录内的 `bin` 文件夹路径附加到 `PATH` 变量，以便 JDK 中包含的工具在终端中可用。
*   如果在 Android Studio 中遇到 Gradle JDK 问题，请确保其配置正确：
    选择 **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**。

### Android 工具

与 JDK 类似，如果你在启动 `adb` 等 Android 工具时遇到问题，请确保已将 `ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin` 和 `ANDROID_HOME/platform-tools` 的路径添加到你的 `PATH` 环境变量中。

### Xcode

如果你的 iOS 运行配置报告没有可运行的虚拟设备，请确保启动 Xcode 并查看是否有 iOS 模拟器的任何更新。

### 获取帮助

*   **Kotlin Slack**。获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin Multiplatform Tooling 问题跟踪器**。 [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KMT)。

## 后续步骤

了解更多关于 KMP 项目结构和编写共享代码的信息：
*   关于使用共享 UI 代码的系列教程：[创建你的 Compose Multiplatform 应用程序](compose-multiplatform-create-first-app.md)
*   关于将共享代码与原生 UI 结合使用的系列教程：[创建你的 Kotlin Multiplatform 应用程序](multiplatform-create-first-app.md)
*   深入研究 Kotlin Multiplatform 文档：
    *   [项目配置](multiplatform-project-configuration.md)
    *   [使用多平台依赖项](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
*   了解 Compose Multiplatform UI 框架、其基础知识和平台特有的特性：
    [Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)。

发现已为 KMP 编写的代码：
*   我们的 [示例](multiplatform-samples.md) 页面，包含 JetBrains 官方示例以及精心策划的展示 KMP 功能的项目列表。
*   GitHub 主题：
    *   [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)，用 Kotlin Multiplatform 实现的项目。
    *   [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)，
        用 KMP 编写的示例项目列表。
*   [klibs.io](https://klibs.io) – KMP 库搜索平台，迄今已收录 2000 多个库，包括 OkHttp、Ktor、Coil、Koin、SQLDelight 等。