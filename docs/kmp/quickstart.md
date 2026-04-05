[//]: # (title: Kotlin Multiplatform 快速入门)

<web-summary>JetBrains 为 IntelliJ IDEA 和 Android Studio 提供官方 Kotlin IDE 支持。</web-summary>

通过本教程，您将学习如何构建并运行一个带 Compose Multiplatform UI 的简单 Kotlin Multiplatform 应用。

## 设置环境

首先从 IDE 和必要的插件开始：

1. 选择并安装 IDE：IntelliJ IDEA 和 Android Studio 都完全支持 Kotlin Multiplatform。
    
    推荐使用 [JetBrains Toolbox App](https://www.jetbrains.com/toolbox/app/) 来安装 IDE。
    它可以让您管理多个产品或版本，包括[抢先体验计划](https://www.jetbrains.com/resources/eap/) (EAP) 和 Nightly 版本。

    对于独立安装，请下载 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 或 [Android Studio](https://developer.android.com/studio) 的安装程序。

    Kotlin Multiplatform 要求的插件版本至少为 **IntelliJ IDEA 2025.2.2** 或 **Android Studio Otter 2025.2.1**。

2. 安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)。
    
   IDE 插件还会安装您的 IDE 尚未安装的任何必要依赖项。
    
3. 如果您尚未设置 `ANDROID_HOME` 环境变量，请配置您的系统以识别它：

    <Tabs>
    <TabItem title= "Bash 或 Zsh">
   
    将以下命令添加到您的 `.profile` 或 `.zprofile` 中：
        
    ```shell
    export ANDROID_HOME=~/Library/Android/sdk
    ```
   
    </TabItem>
    <TabItem title= "Windows PowerShell 或 CMD">

    对于 PowerShell，您可以使用以下命令添加持久环境变量（详情请参阅 [PowerShell 文档](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables)）：

    ```shell
    [Environment]::SetEnvironmentVariable('ANDROID_HOME', '<path to the SDK>', 'Machine')
    ```

    对于 CMD，请使用 [`setx`](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/setx) 命令：
    
    ```shell
    setx ANDROID_HOME "<path to the SDK>"
    ```
    </TabItem>
    </Tabs>

4. 若要创建 iOS 应用程序，您需要一台安装了 [Xcode](https://apps.apple.com/us/app/xcode/id497799835) 的 macOS 主机。
    您的 IDE 将在后台运行 Xcode 以构建 iOS 框架。

    在开始处理 KMP 项目之前，请确保至少启动过一次 Xcode，以便它完成初始设置。

    > 每次 Xcode 更新后，您都需要手动启动它并下载更新的工具包。
    > Kotlin Multiplatform IDE 插件会进行预检，并在 Xcode 处于非正常工作状态时向您发出警报。
    >
    {style="note"}

## 创建项目 

<Tabs>
<TabItem title= "IntelliJ IDEA">

使用 IDE 向导创建一个新的 KMP 项目：

1. 在主菜单中选择 **File** | **New** | **Project**。
2. 在左侧列表中选择 **Kotlin Multiplatform**。
3. 根据需要设置项目名称、位置和其他基本属性。
4. 我们建议选择一个版本的 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 作为项目的 JDK，因为它提供了重要的修复，特别是能够提高桌面端 KMP 应用的兼容性。
   每个 IntelliJ IDEA 分发版中都包含相关的 JBR 版本，因此无需额外设置。
5. 若要创建一个完整的演示，请选择所有可用平台：Android、iOS、Desktop、Web 和 Server。
   保留已选中的 **Share UI** 选项，以便在相应的目标平台上使用 Compose Multiplatform 作为 UI 框架。

   > 桌面端目标自动包含 [Compose Hot Reload](compose-hot-reload.md) 功能，让您在保存代码更改后即可看到 UI 变化。
   > 即使您不打算制作桌面应用，可能也想在项目中添加桌面目标，以加速 UI 代码的迭代。
   > 
   {style="note"}

6. 选择完平台后，点击 **Create** 按钮并等待 IDE 生成并导入项目。

![IntelliJ IDEA 向导，采用默认设置并选择了 Android、iOS、桌面和 Web 平台](idea-wizard-1step.png){width=600}

</TabItem>
<TabItem title= "Android Studio">

使用 IDE 向导创建一个新的 KMP 项目：

1. 在主菜单中选择 **File** | **New** | **New project**。
2. 在默认的 **Phone and Tablet** 模板类别中选择 **Kotlin Multiplatform**。

    ![Android Studio 中新建项目的第一步](as-wizard-1.png){width="400"}

3. 根据需要设置项目名称、位置和其他基本属性，然后点击 **Next**。
4. 若要创建一个完整的演示，请选择所有可用平台：Android、iOS、Desktop、Web 和 Server。
   保留已选中的 **Share UI** 选项，以便在相应的目标平台上使用 Compose Multiplatform 作为 UI 框架。

   > 桌面端目标自动包含 [Compose Hot Reload](compose-hot-reload.md) 功能，让您在保存代码更改后即可看到 UI 变化。
   > 即使您不打算制作桌面应用，可能也想在项目中添加桌面目标，以加速 UI 代码的迭代。
   >
   {style="note"}

5. 选择完平台后，点击 **Finish** 按钮并等待 IDE 生成并导入项目。

![Android Studio 向导的最后一步，选择了 Android、iOS、桌面和 Web 平台](as-wizard-3step.png){width=600}

</TabItem>
</Tabs>

## 查看预检

您可以通过打开 **Project Environment Preflight Checks** 工具窗口，确保项目设置没有环境问题：
点击右侧边栏或底部栏上的预检图标 ![带飞机的项目环境预检图标](ide-preflight-checks.png){width="20"}

在此工具窗口中，您可以查看与这些检查相关的消息、重新运行检查或更改其设置。 

预检命令在 **Search Everywhere** 对话框中也可用。
双击 <shortcut>Shift</shortcut> 键并搜索包含“preflight”一词的命令：

![输入了“preflight”一词的随处搜索菜单](double-shift-preflight-checks.png){width=600}

## 运行示例应用

IDE 向导创建的项目包含为 iOS、Android、桌面和 Web 应用程序生成的运行配置，以及用于运行服务器应用的 Gradle 任务。下面列出了每个平台的具体 Gradle 命令。

<Tabs>
<TabItem title="Android">

要运行 Android 应用，请启动 **composeApp** 运行配置：

![高亮显示 Android 运行配置的下拉菜单](run-android-configuration.png){width=250}

若要手动创建 Android 运行配置，请选择 **Android App** 作为运行配置模板，并选择模块 **[项目名称].composeApp**。

默认情况下，它在第一个可用的虚拟设备上运行：

![在虚拟设备上运行的 Android 应用](run-android-app.png){width=300}

</TabItem>
<TabItem title="iOS">

> 您需要一台 macOS 主机并安装 Xcode 才能构建 iOS 应用。
>
{style="note"}

如果您为项目选择了 iOS 目标，并在一台安装了 Xcode 的 macOS 计算机上进行了设置，则可以选择 **iosApp** 运行配置并选择一个模拟设备：

![高亮显示 iOS 运行配置的下拉菜单](run-ios-configuration.png){width=250}

当您运行 iOS 应用时，它会在后台由 Xcode 构建并在 iOS 模拟器中启动。第一次构建会收集用于编译的原生依赖项，并为后续运行预热构建：

![在虚拟设备上运行的 iOS 应用](run-ios-app.png){width=350}

</TabItem>
<TabItem title="Desktop">

桌面应用的默认运行配置创建为 **composeApp [desktop]**：

![高亮显示默认桌面运行配置的下拉菜单](run-desktop-configuration.png){width=250}

若要手动创建桌面运行配置，请选择 **Gradle** 运行配置模板，并使用以下命令指向 **[应用名称]:composeApp** Gradle 项目：

```shell
desktopRun -DmainClass=com.example.myapplication.MainKt --quiet
```

使用此配置，您可以运行 JVM 桌面应用：

![在虚拟设备上运行的 JVM 应用](run-desktop-app.png){width=600}

</TabItem>
<TabItem title="Web">

Web 应用的默认运行配置创建为 **composeApp [wasmJs]**：

![高亮显示默认 Wasm 运行配置的下拉菜单](run-wasm-configuration.png){width=250}

若要手动创建 Web 运行配置，请选择 **Gradle** 运行配置模板，并使用以下命令指向 **[应用名称]:composeApp** Gradle 项目：

```shell
wasmJsBrowserDevelopmentRun
```

运行此配置时，IDE 会构建 Kotlin/Wasm 应用并在默认浏览器中将其打开：

![在虚拟设备上运行的 Web 应用](run-wasm-app.png){width=600}

</TabItem>
</Tabs>

## 故障排除

### Java 和 JDK

Java 的常见问题：

* 某些工具可能找不到要运行的 Java 版本，或者使用了错误的版本。
  要解决此问题：
    * 将 `JAVA_HOME` 环境变量设置为安装了适当 JDK 的目录。
  
      > 我们建议使用 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime)，这是一个支持类重定义的 OpenJDK 分支。
      >
      {style="note"}
  
    * 将 `JAVA_HOME` 内 `bin` 文件夹的路径添加到 `PATH` 变量中，以便在终端中使用 JDK 中包含的工具。
* 如果在 Android Studio 中遇到 Gradle JDK 问题，请确保其配置正确：选择 **Settings** | **Build, Execution, Deployment** | **Build Tools** | **Gradle**。

### Android 工具

与 JDK 相同，如果您在启动 `adb` 等 Android 工具时遇到困难，请确保 `ANDROID_HOME/tools`、`ANDROID_HOME/tools/bin` 和 `ANDROID_HOME/platform-tools` 的路径已添加到您的 `PATH` 环境变量中。

### Xcode

如果您的 iOS 运行配置报告没有可运行的虚拟设备，或者预检失败，请务必启动 Xcode 并查看 iOS 模拟器是否有任何更新。

### 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin Multiplatform 工具问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KMT)。

## 下一步

详细了解 KMP 项目的结构以及编写共享代码：
* 关于使用 Compose Multiplatform 处理共享 UI 代码的一系列教程：[创建您的 Compose Multiplatform 应用](compose-multiplatform-create-first-app.md)
* 关于在带原生 UI 的项目中处理共享代码的一系列教程：[创建您的 Kotlin Multiplatform 应用](multiplatform-create-first-app.md)
* 深入研究 Kotlin Multiplatform 文档：
  * [项目配置](multiplatform-project-configuration.md)
  * [处理多平台依赖项](https://kotlinlang.org/docs/multiplatform-add-dependencies.html)
* 了解 Compose Multiplatform UI 框架、其基础知识以及特定于平台的特性：
    [Compose Multiplatform 与 Jetpack Compose 之间的关系](compose-multiplatform-and-jetpack-compose.md)。

发现已经为 KMP 编写的代码：
* 我们的[示例](multiplatform-samples.md)页面，包含 JetBrains 官方示例以及展示 KMP 能力的精选项目列表。
* GitHub 话题：
  * [kotlin-multiplatform](https://github.com/topics/kotlin-multiplatform)，使用 Kotlin Multiplatform 实现的项目。
  * [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)，使用 KMP 编写的示例项目列表。
* [klibs.io](https://klibs.io) – KMP 库搜索平台，目前已索引 2000 多个库，包括 OkHttp、Ktor、Coil、Koin、SQLDelight 等。