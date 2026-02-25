[//]: # (title: 创建您的 Compose Multiplatform 应用)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中进行——这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是<strong>使用共享逻辑与 UI 创建 Compose Multiplatform 应用</strong>教程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>创建您的 Compose Multiplatform 应用</strong><br/>
        <img src="icon-2-todo.svg" width="20" alt="第二步"/> 探索可组合代码 <br/>
        <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改项目 <br/>      
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> 创建您自己的应用 <br/>
    </p>
</tldr>

在这里，您将学习如何使用 IntelliJ IDEA 创建并运行您的第一个 Compose Multiplatform 应用程序。

借助 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) UI 框架，您可以将 Kotlin Multiplatform 的代码共享能力扩展到应用逻辑之外。您可以实现一次用户界面，然后将其用于 Compose Multiplatform 支持的所有平台。

在本教程中，您将构建一个在 Android、iOS、桌面端和 Web 上运行的示例应用。为了创建用户界面，您将使用 Compose Multiplatform 框架并了解其基础知识：可组合函数、主题、布局、事件和修饰符。

本教程的注意事项：
* 不需要具备 Compose Multiplatform、Android 或 iOS 的经验。我们建议您在开始之前先熟悉 [Kotlin 基础知识](https://kotlinlang.org/docs/getting-started.html)。
* 要完成本教程，您只需要 IntelliJ IDEA。它允许您在 Android 和桌面端尝试多平台开发。对于 iOS，您需要一台安装了 Xcode 的 macOS 机器。这是 iOS 开发的通用限制。
* 如果愿意，您可以将选择限制在您感兴趣的特定平台，并忽略其他平台。

## 创建项目

1. 在[快速入门](quickstart.md)中，按照说明[设置您的 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。

    > 如果您没有使用 Kotlin Multiplatform IDE 插件，可以使用 [KMP Web 向导](https://kmp.jetbrains.com/?android=true&ios=true&iosui=compose&desktop=true&web=true&includeTests=true)生成相同的项目。
    >
    {style="note"}

4. 在 **New Project** 窗口中指定以下字段：

    * **Name**: ComposeDemo
    * **Group**: compose.project
    * **Artifact**: demo

    > 如果使用 Web 向导，请指定 "ComposeDemo" 作为 **Project Name**，"compose.project.demo" 作为 **Project ID**。
    >
    {style="note"}

5. 选择 **Android**、**iOS**、**Desktop** 和 **Web** 目标。
    确保为 iOS 和 Web 选中了 **Share UI** 选项。
6. 指定所有字段和目标后，点击 **Create**（在 Web 向导中为 **Download**）。

   ![创建 Compose Multiplatform 项目](create-compose-multiplatform-project.png){width=800}

## 检查项目结构

在 IntelliJ IDEA 中，导航到 `ComposeDemo` 文件夹。
如果您在向导中没有选择 iOS，则不会有名称以 "ios" 或 "apple" 开头的文件夹。

> IDE 可能会自动建议将项目中的 Android Gradle 插件升级到最新版本。
> 我们不建议升级，因为 Kotlin Multiplatform 与最新的 AGP 版本不兼容
> （请参阅 [兼容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

该项目包含两个模块：

* _composeApp_ 是一个 Kotlin 模块，包含 Android、桌面端、iOS 和 Web 应用之间共享的逻辑——即您在所有平台中使用的代码。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作为构建系统，帮助您自动化构建过程。
* _iosApp_ 是一个 Xcode 项目，可构建为 iOS 应用。它依赖并使用共享模块作为 iOS 框架。

  ![Compose Multiplatform 项目结构](compose-project-structure.png)

**composeApp** 模块由以下源集组成：`androidMain`、`commonMain`、`iosMain`、`jsMain`、`jvmMain`、`wasmJsMain` 和 `webMain`（如果您选择包含测试，还会有 `commonTest`）。
_源集_ 是一个 Gradle 概念，指一组在逻辑上组合在一起的文件，每组都有自己的依赖项。在 Kotlin Multiplatform 中，不同的源集可以针对不同的平台。

`commonMain` 源集使用通用的 Kotlin 代码，而平台源集使用针对每个目标的特定 Kotlin 代码：

* `jvmMain` 是桌面端的源文件，使用 Kotlin/JVM。
* `androidMain` 同样使用 Kotlin/JVM。
* `iosMain` 使用 Kotlin/Native。
* `jsMain` 使用 Kotlin/JS。
* `wasmJsMain` 使用 Kotlin/Wasm。
* `webMain` 是 Web [中间源集](multiplatform-hierarchy.md#manual-configuration)，包含了 `jsMain` 和 `wasmJsMain`。

当共享模块被构建为 Android 库时，通用的 Kotlin 代码会被视为 Kotlin/JVM。当它被构建为 iOS 框架时，通用的 Kotlin 代码会被视为 Kotlin/Native。当共享模块被构建为 Web 应用时，通用的 Kotlin 代码可以被视为 Kotlin/Wasm 和 Kotlin/JS。

![通用 Kotlin、Kotlin/JVM 和 Kotlin/Native](module-structure.svg){width=700}

通常，只要有可能，请将实现编写为通用代码，而不是在平台特定的源集中重复功能。

在 `composeApp/src/commonMain/kotlin` 目录中，打开 `App.kt` 文件。它包含 `App()` 函数，该函数实现了一个极简但完整的 Compose Multiplatform UI：

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="fun App()"}

让我们在所有支持的平台上运行该应用。

## 运行您的应用

您可以在 Android、iOS、桌面端和 Web 上运行该应用。您不必按任何特定顺序运行这些应用，因此可以从您最熟悉的任何平台开始。

> 您不需要使用 Gradle 构建任务。在多平台应用中，这将构建所有受支持目标的调试版和发布版。根据在 Multiplatform 向导中选择的平台，这可能会花费一些时间。
> 使用运行配置要快得多；在这种情况下，只有选定的目标会被构建。
>
{style="tip"}

### 在 Android 上运行应用

1. 在运行配置列表中，选择 **composeApp**。
2. 选择您的 Android 虚拟设备，然后点击 **Run**：如果选定的虚拟设备处于关机状态，IDE 将启动它并运行应用。

![在 Android 上运行 Compose Multiplatform 应用](compose-run-android.png){width=350}

![Android 上的第一个 Compose Multiplatform 项目](first-compose-project-on-android-1.png){width=300}

<snippet id="run_android_other_devices">

#### 在不同的 Android 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置 Android Emulator 并在不同的模拟设备上运行您的应用](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真实的 Android 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何 [配置并连接硬件设备并在其上运行您的应用](https://developer.android.com/studio/run/device)。

</snippet>

### 在 iOS 上运行应用

如果您在初始设置中未启动过 Xcode，请在运行 iOS 应用之前启动它。

在 IntelliJ IDEA 中，在运行配置列表中选择 **iosApp**，在运行配置旁边选择一个模拟设备，然后点击 **Run**。
如果列表中没有可用的 iOS 配置，请添加一个[新的运行配置](#run-on-a-new-ios-simulated-device)。

![在 iOS 上运行 Compose Multiplatform 应用](compose-run-ios.png){width=350}

![iOS 上的第一个 Compose Multiplatform 项目](first-compose-project-on-ios-1.png){width=300}

<snippet id="run_ios_other_devices">

#### 在新的 iOS 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

如果您想在模拟设备上运行应用，可以添加一个新的运行配置。

1. 在运行配置列表中，点击 **Edit Configurations**。

   ![编辑运行配置](ios-edit-configurations.png){width=450}

2. 点击配置列表上方的 **+** 按钮，然后选择 **Xcode Application**。

   ![iOS 应用的新运行配置](ios-new-configuration.png)

3. 为您的配置命名。
4. 选择 **Working directory**。为此，请导航到您的项目（例如 **KotlinMultiplatformSandbox**）中的 `iosApp` 文件夹。

5. 点击 **Run** 以在新的模拟设备上运行您的应用。

#### 在真实的 iOS 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在真实的 iOS 设备上运行您的多平台应用。在开始之前，您需要设置与您的 [Apple ID](https://support.apple.com/en-us/HT204316) 关联的 Team ID。

##### 设置您的 Team ID

要在项目中设置 Team ID，您可以使用 IntelliJ IDEA 中的 KDoctor 工具，也可以在 Xcode 中选择您的团队。

对于 KDoctor：

1. 在 IntelliJ IDEA 中，在终端运行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 将列出您系统上当前配置的所有 Team ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，打开 `iosApp/Configuration/Config.xcconfig` 并指定您的 Team ID。

或者，在 Xcode 中选择团队：

1. 转到 Xcode 并选择 **Open a project or file**。
2. 导航到项目的 `iosApp/iosApp.xcworkspace` 文件。
3. 在左侧菜单中，选择 `iosApp`。
4. 导航到 **Signing & Capabilities**。
5. 在 **Team** 列表中，选择您的团队。

   如果您尚未设置团队，请使用 **Team** 列表中的 **Add an Account** 选项并按照 Xcode 的说明进行操作。

6. 确保 Bundle Identifier 是唯一的，并且 Signing Certificate 已成功分配。

##### 运行应用

用电缆连接您的 iPhone。如果您已经在 Xcode 中注册了该设备，IntelliJ IDEA 应该会将其显示在运行配置列表中。运行相应的 `iosApp` 配置。

如果您尚未在 Xcode 中注册您的 iPhone，请按照 [Apple 的建议](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-device/)进行操作。
简而言之，您应该：

1. 用电缆连接您的 iPhone。
2. 在您的 iPhone 上，通过 **Settings** | **Privacy & Security** 启用开发者模式。
3. 在 Xcode 中，转到顶部菜单并选择 **Window** | **Devices and Simulators**。
4. 点击加号。选择您连接的 iPhone，然后点击 **Add**。
5. 使用您的 Apple ID 登录以在设备上启用开发功能。
6. 按照屏幕上的说明完成配对过程。

在 Xcode 中注册 iPhone 后，在 IntelliJ IDEA 中[创建一个新的运行配置](#run-on-a-new-ios-simulated-device)，并在 **Execution target** 列表中选择您的设备。运行相应的 `iosApp` 配置。

</snippet>

### 在桌面端运行应用

在运行配置列表中选择 **composeApp [desktop]**，然后点击 **Run**。默认情况下，运行配置会在其自己的操作系统窗口中启动桌面应用：

![在桌面端运行 Compose Multiplatform 应用](compose-run-desktop.png){width=350}

![桌面端上的第一个 Compose Multiplatform 项目](first-compose-project-on-desktop-1.png){width=500}

### 运行 Web 应用

1. 在运行配置列表中，选择：

   * **composeApp[js]**：运行您的 Kotlin/JS 应用。
   * **composeApp[wasmJs]**：运行您的 Kotlin/Wasm 应用。

   ![在 Web 上运行 Compose Multiplatform 应用](web-run-configuration.png){width=400}

2. 点击 **Run**。

Web 应用会自动在您的浏览器中打开。 
或者，您可以在运行完成后在浏览器中输入以下 URL：

```shell
   http://localhost:8080/
```
> 端口号可能会有所不同，因为 8080 端口可能不可用。
> 您可以在 Gradle 构建控制台中找到实际的端口号。
>
{style="tip"}

![Compose Web 应用](first-compose-project-on-web.png){width=600}

#### Web 目标的兼容模式

您可以为 Web 应用启用兼容模式，以确保它能在所有浏览器上开箱即用。
在这种模式下，现代浏览器使用 Wasm 版本，而旧版本则回退到 JS 版本。
这种模式是通过对 `js` 和 `wasmJs` 目标进行交叉编译来实现的。

要为您的 Web 应用启用兼容模式：

1. 选择 **View | Tool Windows | Gradle** 打开 Gradle 工具窗口。
2. 在 **composedemo | Tasks | compose** 中，选择并运行 **composeCompatibilityBrowserDistribution** 任务。

   > 您至少需要 Java 11 作为 Gradle JVM 才能成功加载任务，通常我们建议为 Compose Multiplatform 项目至少使用 JetBrains Runtime 17。
   >
   {style="note"}

   ![运行兼容性任务](web-compatibility-gradle-task.png){width=500}

   或者，您可以在终端中从 `ComposeDemo` 根目录运行以下命令：

    ```bash
    ./gradlew composeCompatibilityBrowserDistribution
    ```

Gradle 任务完成后，兼容的工件将在 `composeApp/build/dist/composeWebCompatibility/productionExecutable` 目录中生成。
您可以使用这些工件来[发布您的应用](https://kotlinlang.org/docs/wasm-get-started.html#publish-the-application)，使其在 `js` 和 `wasmJs` 目标上均可运行。

## 下一步

在教程的下一部分，您将学习如何实现可组合函数并在各个平台上启动应用。

**[继续进行下一部分](compose-multiplatform-explore-composables.md)**

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。