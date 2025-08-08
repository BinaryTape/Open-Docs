[//]: # (title: 创建你的 Compose Multiplatform 应用)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 —— 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是**创建具有共享逻辑和 UI 的 Compose Multiplatform 应用**教程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>创建你的 Compose Multiplatform 应用</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="Second step"/> 探索可组合代码 <br/>
        <img src="icon-3-todo.svg" width="20" alt="Third step"/> 修改项目 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 创建你自己的应用程序 <br/>
    </p>
</tldr>

在这里，你将学习如何使用 IntelliJ IDEA 创建并运行你的第一个 Compose Multiplatform 应用程序。

借助 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 框架，你可以将 Kotlin Multiplatform 的代码共享能力扩展到应用程序逻辑之外。你可以一次实现用户界面，然后将其用于 Compose Multiplatform 支持的所有平台。

在本教程中，你将构建一个可在 Android、iOS、桌面和 Web 上运行的示例应用程序。为了创建用户界面，你将使用 Compose Multiplatform 框架并了解其基础知识：可组合函数、主题、布局、事件和修饰符。

本教程的注意事项：
* 无需具备 Compose Multiplatform、Android 或 iOS 的经验。我们建议你在开始前熟悉 [Kotlin 基础知识](https://kotlinlang.org/docs/getting-started.html)。
* 要完成本教程，你只需 IntelliJ IDEA。它允许你在 Android 和桌面端尝试多平台开发。对于 iOS，你需要一台安装了 Xcode 的 macOS 机器。这是 iOS 开发的普遍限制。
* 如果你愿意，可以将你的选择限制在你感兴趣的特定平台，并省略其他平台。

## 创建项目

1. 在 [快速入门](quickstart.md) 中，完成 [设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment) 的说明。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。

    > 如果你没有使用 Kotlin Multiplatform IDE 插件，可以使用 [KMP Web 向导](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true) 生成相同的项目。
    >
    {style="note"}

4. 在 **New Project** 窗口中指定以下字段：

    * **Name**: ComposeDemo
    * **Group**: compose.project
    * **Artifact**: demo

    > 如果使用 Web 向导，请将 "ComposeDemo" 指定为 **Project Name**，将 "compose.project.demo" 指定为 **Project ID**。
    >
    {style="note"}

5. 选择 **Android**、**iOS**、**Desktop** 和 **Web** 目标平台。确保为 iOS 选中了 **Share UI** 选项。
6. 指定所有字段和目标平台后，点击 **Create**（在 Web 向导中是 **Download**）。

   ![Create Compose Multiplatform project](create-compose-multiplatform-project.png){width=800}

## 检查项目结构

在 IntelliJ IDEA 中，导航到 "ComposeDemo" 文件夹。如果你没有在向导中选择 iOS，则不会有以 "ios" 或 "apple" 开头的文件夹。

> IntelliJ IDEA 可能会自动建议将项目中的 Android Gradle 插件升级到最新版本。我们不建议升级，因为 Kotlin Multiplatform 与最新 AGP 版本不兼容（请参阅 [兼容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

该项目包含两个模块：

* _composeApp_ 是一个 Kotlin 模块，包含 Android、桌面、iOS 和 Web 应用程序之间共享的逻辑——你用于所有平台上的代码。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作为构建系统，帮助你自动化构建过程。
* _iosApp_ 是一个 Xcode 项目，它被构建成一个 iOS 应用程序。它依赖于共享模块，并将其用作一个 iOS framework。

  ![Compose Multiplatform project structure](compose-project-structure.png){width=350}

**composeApp** 模块包含以下源代码集：`androidMain`、`commonMain`、`desktopMain`、`iosMain` 和 `wasmJsMain`。_源代码集_ 是一个 Gradle 概念，指一组逻辑上组合在一起的文件，每个组都有自己的依赖项。在 Kotlin Multiplatform 中，不同的源代码集可以面向不同的平台。

 `commonMain` 源代码集使用通用 Kotlin 代码，而平台源代码集则使用每个目标平台特有的 Kotlin 代码。Kotlin/JVM 用于 `androidMain` 和 `desktopMain`。Kotlin/Native 用于 `iosMain`。另一方面，Kotlin/Wasm 用于 `wasmJsMain`。

当共享模块被构建成 Android 库时，通用 Kotlin 代码被视为 Kotlin/JVM。当它被构建成 iOS framework 时，通用 Kotlin 代码被视为 Kotlin/Native。当共享模块被构建成 Web 应用时，通用 Kotlin 代码被视为 Kotlin/Wasm。

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](module-structure.png){width=700}

通常，尽可能将你的实现编写为通用代码，而不是在平台特有的源代码集中重复功能。

在 `composeApp/src/commonMain/kotlin` 目录下，打开 `App.kt` 文件。它包含 `App()` 函数，该函数实现了一个极简但完整的 Compose Multiplatform UI：

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

让我们在所有支持的平台运行应用程序。

## 运行你的应用程序

你可以在 Android、iOS、桌面和 Web 上运行应用程序。你无需按照任何特定顺序运行应用程序，因此可以从你最熟悉的平台开始。

> 你无需使用 Gradle 构建任务。在多平台应用程序中，这将构建所有受支持目标平台的调试和发布版本。根据 Multiplatform 向导中选择的平台，这可能需要一些时间。使用运行配置会快得多；在这种情况下，只会构建所选的目标平台。
>
{style="tip"}

### 在 Android 上运行你的应用程序

1. 在运行配置列表中，选择 **composeApp**。
2. 选择你的 Android 虚拟设备，然后点击 **Run**：如果所选虚拟设备已关机，你的 IDE 将启动它并运行应用程序。

![Run the Compose Multiplatform app on Android](compose-run-android.png){width=350}

![First Compose Multiplatform app on Android](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 在不同的 Android 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置 Android 模拟器并在不同的模拟设备上运行你的应用程序](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真实的 Android 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置和连接硬件设备并在其上运行你的应用程序](https://developer.android.com/studio/run/device)。

</snippet>

### 在 iOS 上运行你的应用程序

如果你尚未作为初始设置的一部分启动 Xcode，请在运行 iOS 应用之前执行此操作。

在 IntelliJ IDEA 中，在运行配置列表中选择 **iosApp**，选择运行配置旁边的模拟设备，然后点击 **Run**。如果列表中没有可用的 iOS 配置，请添加 [新的运行配置](#run-on-a-new-ios-simulated-device)。

![Run the Compose Multiplatform app on iOS](compose-run-ios.png){width=350}

![First Compose Multiplatform app on iOS](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 在新的 iOS 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

如果你想在模拟设备上运行你的应用程序，可以添加新的运行配置。

1. 在运行配置列表中，点击 **Edit Configurations**。

   ![Edit run configurations](ios-edit-configurations.png){width=450}

2. 点击配置列表上方的 **+** 按钮，然后选择 **Xcode Application**。

   ![New run configuration for iOS application](ios-new-configuration.png)

3. 命名你的配置。
4. 选择 **Working directory**。为此，请导航到你的项目，例如 **KotlinMultiplatformSandbox**，在 `iosApp` 文件夹中。

5. 点击 **Run** 以在新模拟设备上运行你的应用程序。

#### 在真实的 iOS 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

你可以在真实的 iOS 设备上运行你的多平台应用程序。在开始之前，你需要设置与你的 [Apple ID](https://support.apple.com/en-us/HT204316) 关联的 Team ID。

##### 设置你的 Team ID

要在项目中设置 Team ID，你可以在 IntelliJ IDEA 中使用 KDoctor 工具，或者在 Xcode 中选择你的团队。

对于 KDoctor：

1. 在 IntelliJ IDEA 中，在终端中运行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 将列出当前系统上配置的所有 Team ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，打开 `iosApp/Configuration/Config.xcconfig` 并指定你的 Team ID。

或者，在 Xcode 中选择团队：

1. 进入 Xcode 并选择 **Open a project or file**。
2. 导航到你项目的 `iosApp/iosApp.xcworkspace` 文件。
3. 在左侧菜单中，选择 `iosApp`。
4. 导航到 **Signing & Capabilities**。
5. 在 **Team** 列表中，选择你的团队。

   如果你尚未设置你的团队，请使用 **Team** 列表中的 **Add an Account** 选项并按照 Xcode 说明操作。

6. 确保 Bundle Identifier 是唯一的，并且 Signing Certificate 已成功分配。

##### 运行应用

用数据线连接你的 iPhone。如果你的设备已在 Xcode 中注册，IntelliJ IDEA 应该会在运行配置列表中显示它。运行相应的 `iosApp` 配置。

如果你尚未在 Xcode 中注册你的 iPhone，请遵循 [Apple 的建议](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。
简而言之，你应该：

1. 用数据线连接你的 iPhone。
2. 在你的 iPhone 上，在 **Settings** | **Privacy & Security** 中启用开发者模式。
3. 在 Xcode 中，转到顶部菜单并选择 **Window** | **Devices and Simulators**。
4. 点击加号。选择你连接的 iPhone，然后点击 **Add**。
5. 使用你的 Apple ID 登录，以在该设备上启用开发功能。
6. 按照屏幕上的说明完成配对过程。

在 Xcode 中注册你的 iPhone 后，在 IntelliJ IDEA 中 [创建新的运行配置](#run-on-a-new-ios-simulated-device)，并在 **Execution target** 列表中选择你的设备。运行相应的 `iosApp` 配置。

</snippet>

### 在桌面端运行你的应用程序

在运行配置列表中选择 **composeApp [desktop]**，然后点击 **Run**。默认情况下，该运行配置会在其自己的操作系统窗口中启动桌面应用程序：

![Run the Compose Multiplatform app on desktop](compose-run-desktop.png){width=350}

![First Compose Multiplatform app on desktop](first-compose-project-on-desktop-1.png){width=500}

### 运行你的 Web 应用程序

在运行配置列表中选择 **composeApp [wasmJs]**，然后点击 **Run**。

![Run the Compose Multiplatform app on web](compose-run-web.png){width=350}

Web 应用程序将在你的浏览器中自动打开。或者，当运行完成后，你可以在浏览器中输入以下 URL：

```shell
   http://localhost:8080/
```
> 端口号可能会有所不同，因为 8080 端口可能不可用。你可以在 Gradle 构建控制台中找到实际的端口号。
>
{style="tip"}

![Compose web application](first-compose-project-on-web.png){width=550}

## 下一步

在本教程的下一部分，你将学习如何实现可组合函数并在每个平台启动你的应用程序。

**[继续下一部分](compose-multiplatform-explore-composables.md)**

## 获取帮助

* **Kotlin Slack**。获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin issue tracker**。 [报告新 issue](https://youtrack.jetbrains.com/newIssue?project=KT)。