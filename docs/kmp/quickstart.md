[//]: # (title: Kotlin Multiplatform 快速入门)

<web-summary>JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支持。</web-summary>

通过本教程，您可以轻松启动并运行一个简单的 Kotlin Multiplatform 应用。

## 设置环境

Kotlin Multiplatform (KMP) 项目需要一个特定的环境，但大多数要求都会通过 IDE 中的预检而明确。

从 IDE 和必要的插件开始：

1. 选择并安装 IDE。
    IntelliJ IDEA 和 Android Studio 支持 Kotlin Multiplatform，因此您可以使用您偏好的 IDE。

    [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) 是安装 IDE 的推荐工具。
    它允许您管理多个产品或版本，包括
    [抢先体验计划](https://www.jetbrains.com/resources/eap/) (EAP) 和每夜构建版本。

    对于独立安装，请下载 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
    或 [Android Studio](https://developer.android.com/studio) 的安装程序。

    Kotlin Multiplatform 所需的插件需要 **IntelliJ IDEA 2025.1.1.1**
    或 **Android Studio Narwhal 2025.1.1**。

2. 安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
    （不要与 Kotlin Multiplatform Gradle 插件混淆）。

    > Kotlin Multiplatform 插件尚未在 Windows 或 Linux 上的 IDE 中提供。
    > 但在这些平台上它也并非严格必要：
    > 您仍然可以遵循本教程生成并运行 KMP 项目。
    >
    {style="note"}

3. 为 IntelliJ IDEA 安装 Kotlin Multiplatform IDE 插件也会同时安装所有必要的依赖项（如果尚未安装）；
    Android Studio 则捆绑了所有必要的插件。

    如果您在 Windows 或 Linux 上使用 IntelliJ IDEA，请确保手动安装所有必要的插件：
    * [Android](https://plugins.jetbrains.com/plugin/22989-android)
    * [Android Design Tools](https://plugins.jetbrains.com/plugin/22990-android-design-tools)
    * [Jetpack Compose](https://plugins.jetbrains.com/plugin/18409-jetpack-compose)
    * [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
    * [Compose Multiplatform for Desktop IDE Support](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-for-desktop-ide-support)
      (仅在没有 Kotlin Multiplatform 插件时需要)。

4. 如果您没有设置 `ANDROID_HOME` 环境变量，请配置您的系统以识别它：

    <tabs>
    <tab title= "Bash 或 Zsh">

    将以下命令添加到您的 `.profile` 或 `.zprofile` 文件中：

    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```

    </tab>
    <tab title= "Windows PowerShell 或 CMD">

    对于 PowerShell，您可以使用以下命令添加持久性环境变量
    （有关详细信息，请参阅 [PowerShell 文档](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)）：

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    对于 CMD，使用 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 命令：

    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </tab>
    </tabs>

5. 要创建 iOS 应用程序，您需要一台安装了 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 的 macOS 主机。
    您的 IDE 将在幕后运行 Xcode 以构建 iOS frameworks。

    在开始使用 KMP 项目之前，请确保至少启动一次 Xcode，以便它完成初始设置。

    > 每次 Xcode 更新时，您都需要手动启动它并下载更新的工具。
    > Kotlin Multiplatform IDE 插件会进行预检，当 Xcode 无法正常工作时会提醒您。
    >
    {style="note"}

## 创建项目

### 在 macOS 上

在 macOS 上，Kotlin Multiplatform 插件在 IDE 内部提供了一个项目生成向导：

<tabs>
<tab title= "IntelliJ IDEA">

使用 IDE 向导创建新的 KMP 项目：

1. 在主菜单中选择 **File** | **New** | **Project**。
2. 在左侧列表中选择 **Kotlin Multiplatform**。
3. 根据需要设置项目的名称、位置和其他基本属性。
4. 我们建议选择 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 的一个版本作为您项目的 JDK，因为它提供了重要的修复，特别是为了提高桌面 KMP 应用的兼容性。
   IntelliJ IDEA 的每个发行版都包含相关版本的 JBR，因此无需额外设置。
5. 选择您希望作为项目一部分的平台：
    * 所有目标平台都可以设置为使用 Compose Multiplatform 从一开始就共享 UI 代码（没有 UI 代码的服务器模块除外）。
    * 对于 iOS，您可以选择以下两种实现之一：
        * 共享 UI 代码，使用 Compose Multiplatform，
        * 完全原生 UI，使用 SwiftUI 构建并与具有共享逻辑的 Kotlin 模块连接。
    * 桌面目标包含 [](compose-hot-reload.md) 功能的 Alpha 版本，它允许您在修改相应代码后立即看到 UI 更改。
      即使您不打算制作桌面应用，您可能也希望使用桌面版本来加快编写 UI 代码的速度。

完成平台选择后，单击 **Create** 按钮，然后等待 IDE 生成并导入项目。

![IntelliJ IDEA Wizard with default settings and Android, iOS, desktop, and web platforms selected](idea-wizard-1step.png){width=800}

</tab>
<tab title= "Android Studio">

Kotlin Multiplatform IDE 插件严重依赖于 K2 功能，如果没有它将无法按所述方式工作。
因此，在开始之前，请确保 K2 模式已启用：
**Settings** | **Languages & Frameworks** | **Kotlin** | **Enable K2 mode**。

使用 IDE 向导创建新的 KMP 项目：

1. 在主菜单中选择 **File** | **New** | **New project**。
2. 在默认的 **Phone and Tablet** 模板类别中选择 **Kotlin Multiplatform**。

    ![First new project step in Android Studio](as-wizard-1.png){width="400"}

3. 根据需要设置项目的名称、位置和其他基本属性，然后单击 **Next**。
4. 选择您希望作为项目一部分的平台：
    * 所有目标平台都可以设置为使用 Compose Multiplatform 从一开始就共享 UI 代码（没有 UI 代码的服务器模块除外）。
    * 对于 iOS，您可以选择以下两种实现之一：
      * 共享 UI 代码，使用 Compose Multiplatform，
      * 完全原生 UI，使用 SwiftUI 构建并与具有共享逻辑的 Kotlin 模块连接。
    * 桌面目标包含热重载功能的 alpha 版本，它允许您在修改相应代码后立即看到 UI 更改。
      即使您不打算制作桌面应用，您可能也希望使用桌面版本来加快编写 UI 代码的速度。
5. 项目生成后，我们建议选择 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)
   (JBR) 的一个版本作为您项目的 JDK，因为它提供了重要的修复，特别是为了提高桌面 KMP 应用的兼容性。
   IntelliJ IDEA 的每个发行版都包含相关版本的 JBR，因此无需额外设置。

完成平台选择后，单击 **Finish** 按钮，然后等待 IDE 生成并导入项目。

![Last step in the Android Studio wizard with Android, iOS, desktop, and web platforms selected](as-wizard-3step.png){width=800}

</tab>
</tabs>

### 在 Windows 或 Linux 上

如果您在 Windows 或 Linux 上：

1. 使用 [web KMP 向导](https://kmp.jetbrains.com/) 生成项目。
2. 解压存档并在您的 IDE 中打开生成的文件夹。
3. 等待导入完成，然后前往 [](#run-the-sample-apps) 部分了解如何构建和运行应用。

## 查看预检

您可以通过打开 **Project Environment Preflight Checks** 工具窗口来确保项目设置没有环境问题：
单击右侧边栏或底部栏上的预检图标 ![Preflight checks icon with a plane](ide-preflight-checks.png){width="20"}

在此工具窗口中，您可以查看与这些检查相关的消息，重新运行它们，或更改其设置。

预检命令也可在 **Search Everywhere** 对话框中找到。
按两次 <shortcut>Shift</shortcut> 并搜索包含单词 "preflight" 的命令：

![The Search Everywhere menu with the word "preflight" entered](double-shift-preflight-checks.png)

## 运行示例应用

IDE 向导创建的项目包含为 iOS、Android、桌面和 Web 应用程序生成的运行配置，以及用于运行服务器应用的 Gradle 任务。
在 Windows 和 Linux 上，请参阅下方每个平台的 Gradle 命令。

<tabs>
<tab title="Android">

要运行 Android 应用，请启动 **composeApp** 运行配置：

![Dropdown with the Android run configuration highlighted](run-android-configuration.png){width=250}

要在 Windows 或 Linux 上运行 Android 应用，请创建一个 **Android App** 运行配置，
并选择模块 **[project name].composeApp**。

默认情况下，它会在第一个可用的虚拟设备上运行：

![Android app ran on a virtual device](run-android-app.png){width=350}

</tab>
<tab title="iOS">

> 您需要 macOS 主机来构建 iOS 应用。
>
{style="note"}

如果您为项目选择了 iOS 目标并设置了安装有 Xcode 的 macOS 机器，
则可以选择 **iosApp** 运行配置并选择一个模拟设备：

![Dropdown with the iOS run configuration highlighted](run-ios-configuration.png){width=250}

运行 iOS 应用时，它会在幕后通过 Xcode 构建并在 iOS 模拟器中启动。
第一次构建会收集用于编译的原生依赖项，并为后续运行预热构建：

![iOS app ran on a virtual device](run-ios-app.png){width=350}

</tab>
<tab title="Desktop">

桌面应用的默认运行配置创建为 **composeApp [desktop]**：

![Dropdown with the default desktop run configuration highlighted](run-desktop-configuration.png){width=250}

要在 Windows 或 Linux 上运行桌面应用，请创建一个指向 **[app name]:composeApp** Gradle 项目的 **Gradle** 运行配置，并使用以下命令：

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

使用此配置，您可以运行 JVM 桌面应用：

![JVM app ran on a virtual device](run-desktop-app.png){width=600}

</tab>
<tab title="Web">

Web 应用的默认运行配置创建为 **composeApp [wasmJs]**：

![Dropdown with the default Wasm run configuration highlighted](run-wasm-configuration.png){width=250}

要在 Windows 或 Linux 上运行 Web 应用，请创建一个指向 **[app name]:composeApp** Gradle 项目的 **Gradle** 运行配置，并使用以下命令：

```shell
wasmJsBrowserDevelopmentRun
```

运行此配置时，IDE 会构建 Kotlin/Wasm 应用并在默认浏览器中打开它：

![Web app ran on a virtual device](run-wasm-app.png){width=600}

</tab>
</tabs>

## 故障排除

### Java 和 JDK

常见的 Java 问题：

* 某些工具可能找不到要运行的 Java 版本或使用了错误的版本。
  解决此问题的方法：
    * 将 `JAVA_HOME` 环境变量设置为安装了相应 JDK 的目录。

      > 我们建议使用 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)，
      > 这是一个支持类重定义的 OpenJDK 分支。
      >
      {style="note"}

    * 将 `JAVA_HOME` 内部 `bin` 文件夹的路径添加到 `PATH` 变量中，
      以便 JDK 中包含的工具可在终端中使用。
* 如果您在 Android Studio 中遇到 Gradle JDK 的问题，请确保其配置正确：
  选择 **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**。

### Android 工具

与 JDK 类似，如果您在启动 `adb` 等 Android 工具时遇到问题，
请确保 `ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin` 和
`ANDROID_HOME/platform-tools` 的路径已添加到您的 `PATH` 环境变量中。

### Xcode

如果您的 iOS 运行配置报告没有可运行的虚拟设备，请确保启动 Xcode 并查看 iOS 模拟器是否有任何更新。

### 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin Multiplatform Tooling 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KMT)。

## 下一步

了解有关 KMP 项目结构和编写共享代码的更多信息：
* 使用共享 UI 代码的系列教程：[](compose-multiplatform-create-first-app.md)
* 结合原生 UI 使用共享代码的系列教程：[](multiplatform-create-first-app.md)
* 深入探究 Kotlin Multiplatform 文档：
  * [项目配置](multiplatform-project-configuration.md)
  * [使用多平台依赖项](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
* 了解 Compose Multiplatform UI 框架、其基础知识以及平台特有的特性：
    [](compose-multiplatform-and-jetpack-compose.md)。

发现已为 KMP 编写的代码：
* 我们的[示例](multiplatform-samples.md)页面，其中包含官方 JetBrains 示例以及展示 KMP 功能的精选项目列表。
* GitHub 主题：
  * [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)，使用 Kotlin Multiplatform 实现的项目。
  * [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)，
      使用 KMP 编写的示例项目列表。
* [klibs.io](https://klibs.io) – KMP 库的搜索平台，迄今已收录 2000 多个库，
    包括 OkHttp、Ktor、Coil、Koin、SQLDelight 等。