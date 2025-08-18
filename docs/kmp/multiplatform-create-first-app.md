[//]: # (title: 创建你的 Kotlin Multiplatform 应用程序)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中跟随操作——这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是“<strong>使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用</strong>”教程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>创建你的 Kotlin Multiplatform 应用程序</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> 更新用户界面<br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> 添加依赖项<br/>       
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多逻辑<br/>
       <img src="icon-5-todo.svg" width="20" alt="第五步"/> 总结你的项目<br/>
    </p>
</tldr>

在这里，你将学习如何使用 IntelliJ IDEA 创建并运行你的第一个 Kotlin Multiplatform 应用程序。

Kotlin Multiplatform 技术简化了跨平台项目的开发。Kotlin Multiplatform 应用程序可以在多种平台上运行，例如 iOS、Android、macOS、Windows、Linux、Web 等。

Kotlin Multiplatform 的主要用例之一是在移动平台之间共享代码。你可以在 iOS 和 Android 应用之间共享应用程序逻辑，并且只在需要实现原生 UI 或使用平台 API 时才编写平台特有的代码。

## 创建项目

1. 在[快速入门](quickstart.md)中，完成[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)的说明。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在**新建项目**窗口中指定以下字段：
   * **名称**：GreetingKMP
   * **组**：com.jetbrains.greeting
   * **Artifact**：greetingkmp
   
   ![创建 Compose Multiplatform 项目](create-first-multiplatform-app.png){width=800}

5. 选择 **Android** 和 **iOS** 目标平台。
6. 对于 iOS，选择**不共享 UI** 选项以保持 UI 原生。
7. 指定所有字段和目标平台后，点击 **Create**。

> IntelliJ IDEA 可能会自动建议将项目中的 Android Gradle 插件升级到最新版本。
> 我们不建议升级，因为 Kotlin Multiplatform 与最新的 AGP 版本不兼容
> (关于兼容性，请参见[兼容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility))。
>
{style="note"}

## 检查项目结构

在 IntelliJ IDEA 中，展开 `GreetingKMP` 文件夹。

这个 Kotlin Multiplatform 项目包含三个模块：

* _shared_ 是一个 Kotlin 模块，包含 Android 和 iOS 应用程序共用的逻辑——你可以在平台之间共享的代码。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作为构建系统来帮助自动化你的构建过程。
* _composeApp_ 是一个 Kotlin 模块，可构建为一个 Android 应用程序。它使用 Gradle 作为构建系统。composeApp 模块依赖于 shared 模块并将其作为常规 Android 库使用。
* _iosApp_ 是一个 Xcode 项目，可构建为一个 iOS 应用程序。它依赖于 shared 模块并将其作为 iOS framework 使用。shared 模块可以作为常规 framework 或 [CocoaPods 依赖项](multiplatform-cocoapods-overview.md)使用。默认情况下，在 IntelliJ IDEA 中创建的 Kotlin Multiplatform 项目使用常规 framework 依赖项。

![基本 Multiplatform 项目结构](basic-project-structure.svg){width=700}

shared 模块包含三个源代码集：`androidMain`、`commonMain` 和 `iosMain`。_源代码集_是 Gradle 的一个概念，指一组逻辑上组合在一起的文件，每组都有自己的依赖项。在 Kotlin Multiplatform 中，shared 模块中的不同源代码集可以面向不同的平台。

common 源代码集包含共享的 Kotlin 代码，平台源代码集则使用每个目标平台特有的 Kotlin 代码。`androidMain` 使用 Kotlin/JVM，`iosMain` 使用 Kotlin/Native：

![源代码集和模块结构](basic-project-structure-2.png){width=350}

当 shared 模块构建为一个 Android 库时，common Kotlin 代码被视为 Kotlin/JVM。当它构建为一个 iOS framework 时，common Kotlin 被视为 Kotlin/Native：

![Common Kotlin、Kotlin/JVM 和 Kotlin/Native](modules-structure.png)

### 编写通用声明

common 源代码集包含可在多个目标平台使用的共享代码。它旨在包含平台无关的代码。如果你尝试在 common 源代码集中使用平台特有的 API，IDE 将显示警告：

1. 打开 `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt` 文件，你可以在其中找到自动生成的 `Greeting` 类以及 `greet()` 函数：

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 为问候语增加一些变化。从 Kotlin 标准库导入 `kotlin.random.Random`。这是一个可在所有平台上工作并自动作为依赖项包含的多平台库。
3. 使用 Kotlin 标准库中的 `reversed()` 调用更新共享代码以反转文本：

    ```kotlin
    import kotlin.random.Random
    
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord Guess what this is! > ${platform.name.reversed()}!"
        }
    }
    ```

仅在 common Kotlin 中编写代码具有明显的局限性，因为它无法使用任何平台特有的功能。使用接口和 [expect/actual](multiplatform-connect-to-apis.md) 机制可以解决此问题。

### 查看平台特有实现

common 源代码集可以定义预期声明（接口、类等）。然后，每个平台源代码集，在此示例中是 `androidMain` 和 `iosMain`，都必须为预期声明提供实际的平台特有实现。

在为特定平台生成代码时，Kotlin 编译器会合并预期声明和实际声明，并生成一个带有实际实现的单一声明。

1. 使用 IntelliJ IDEA 创建 Kotlin Multiplatform 项目时，你会在 `commonMain` 模块中得到一个包含 `Platform.kt` 文件的模板：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   这是一个通用 `Platform` 接口，包含有关平台的信息。

2. 在 `androidMain` 和 `iosMain` 模块之间切换。你会看到它们为 Android 和 iOS 源代码集提供了相同功能的不同实现：
    
    ```kotlin
    // Platform.android.kt in the androidMain module:
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain module:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` 中的 `name` 属性实现使用了 Android 特有的代码，即 `android.os.Build` 依赖项。这段代码是用 Kotlin/JVM 编写的。如果你尝试在此处访问 JVM 特有的类（例如 `java.util.Random`），这段代码将编译。
    * `IOSPlatform` 中的 `name` 属性实现使用了 iOS 特有的代码，即 `platform.UIKit.UIDevice` 依赖项。它用 Kotlin/Native 编写，这意味着你可以用 Kotlin 编写 iOS 代码。这段代码成为 iOS framework 的一部分，你稍后将在 iOS 应用程序中从 Swift 调用它。

3. 检查不同源代码集中的 `getPlatform()` 函数。它的预期声明没有函数体，实际实现是在平台代码中提供的：

    ```kotlin
    // Platform.kt in the commonMain source set
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.android.kt in the androidMain source set
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.ios.kt in the iosMain source set
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

在这里，common 源代码集定义了一个预期 `getPlatform()` 函数，并在平台源代码集中为 Android 应用提供了 `AndroidPlatform()` 实际实现，为 iOS 应用提供了 `IOSPlatform()` 实际实现。

在为特定平台生成代码时，Kotlin 编译器会将预期声明和实际声明合并为一个带有实际实现的 `getPlatform()` 函数。

这就是为什么预期声明和实际声明应该在同一个包中定义——它们在生成的平台代码中合并为一个声明。在生成的平台代码中对预期 `getPlatform()` 函数的任何调用都会调用正确的实际实现。

现在你可以运行这些应用程序，并查看这一切的实际效果。

#### 探索 expect/actual 机制（可选） {initial-collapse-state="collapsed" collapsible="true"}

模板项目对函数使用了 expect/actual 机制，但它也适用于大多数 Kotlin 声明，例如属性和类。我们来尝试实现一个预期属性：

1. 打开 `commonMain` 模块中的 `Platform.kt`，并在文件末尾添加以下内容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 编译器会报错说此属性在平台模块中没有对应的实际声明。

2. 尝试立即提供实现：

   ```kotlin
   expect val num: Int = 42
   ```

   你会收到一个错误，提示预期声明不得有函数体，在此示例中是初始化器。实现必须在实际平台模块中提供。移除初始化器。
3. 将鼠标悬停在 `num` 属性上并点击 **Create missed actuals...**。选择 `androidMain` 源代码集。然后你可以在 `androidMain/Platform.android.kt` 中完成实现：

   ```kotlin
   actual val num: Int = 1
    ```

4. 现在为 `iosMain` 模块提供实现。将以下内容添加到 `iosMain/Platform.ios.kt`：

   ```kotlin
   actual val num: Int = 2
   ```

5. 在 `commonMain/Greeting.kt` 文件中，将 `num` 属性添加到 `greet()` 函数中以查看差异：

   ```kotlin
   fun greet(): String {
       val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
  
       return "$firstWord [$num] Guess what this is! > ${platform.name.reversed()}!"
   }
   ```

## 运行你的应用程序

你可以从 IntelliJ IDEA 运行你的多平台应用程序，支持 [Android](#run-your-application-on-android) 或 [iOS](#run-your-application-on-ios)。

如果你之前探索了 expect/actual 机制，你会看到 Android 的问候语中添加了“[1]”，iOS 的问候语中添加了“[2]”。

### 在 Android 上运行你的应用程序

1. 在运行配置列表中，选择 **composeApp**。
2. 在配置列表旁边选择一个 Android 虚拟设备，然后点击 **Run**。

   如果列表中没有设备，请创建[一个新的 Android 虚拟设备](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![在 Android 上运行多平台应用程序](compose-run-android.png){width=350}

   ![Android 上的第一个移动多平台应用程序](first-multiplatform-project-on-android-1.png){width=300}

#### 在不同的 Android 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置 Android 模拟器并在不同的模拟设备上运行你的应用程序](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真实的 Android 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置并连接硬件设备并在其上运行你的应用程序](https://developer.android.com/studio/run/device)。

### 在 iOS 上运行你的应用程序

如果你尚未在初始设置中启动 Xcode，请在运行 iOS 应用之前执行此操作。

在 IntelliJ IDEA 中，在运行配置列表中选择 **iosApp**，在运行配置旁边选择一个模拟设备，然后点击 **Run**。

如果列表中没有可用的 iOS 配置，请添加[一个新的运行配置](#run-on-a-new-ios-simulated-device)。

![在 iOS 上运行多平台应用程序](compose-run-ios.png){width=350}

![iOS 上的第一个移动多平台应用程序](first-multiplatform-project-on-ios-1.png){width=300}

#### 在新的 iOS 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

如果你想在模拟设备上运行你的应用程序，你可以添加一个新的运行配置。

1. 在运行配置列表中，点击 **Edit Configurations**。

   ![编辑运行配置](ios-edit-configurations.png){width=450}

2. 点击配置列表上方的 **+** 按钮，然后选择 **Xcode Application**。

   ![iOS 应用程序的新运行配置](ios-new-configuration.png)

3. 命名你的配置。
4. 选择**工作目录**。为此，导航到你的项目，例如 **KotlinMultiplatformSandbox**，在 `iosApp` 文件夹中。

5. 点击 **Run** 在新的模拟设备上运行你的应用程序。

#### 在真实的 iOS 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

你可以在真实的 iOS 设备上运行你的多平台应用程序。在开始之前，你需要设置与你的 [Apple ID](https://support.apple.com/en-us/HT204316) 相关联的团队 ID。

##### 设置你的团队 ID

要在你的项目中设置团队 ID，你可以使用 IntelliJ IDEA 中的 KDoctor 工具，或者在 Xcode 中选择你的团队。

对于 KDoctor：

1. 在 IntelliJ IDEA 中，在终端中运行以下命令：

   ```none
   kdoctor --team-ids 
   ```

   KDoctor 将列出当前在你的系统上配置的所有团队 ID，例如：

   ```text
   3ABC246XYZ (Max Sample)
   ZABCW6SXYZ (SampleTech Inc.)
   ```

2. 在 IntelliJ IDEA 中，打开 `iosApp/Configuration/Config.xcconfig` 并指定你的团队 ID。

或者，在 Xcode 中选择团队：

1. 转到 Xcode 并选择 **Open a project or file**。
2. 导航到你项目中的 `iosApp/iosApp.xcworkspace` 文件。
3. 在左侧菜单中，选择 `iosApp`。
4. 导航到 **Signing & Capabilities**。
5. 在**团队**列表中，选择你的团队。

   如果你尚未设置你的团队，请在**团队**列表中使用**添加账户**选项并遵循 Xcode 说明。

6. 确保 Bundle Identifier 是唯一的，并且 Signing Certificate 已成功分配。

##### 运行应用程序

用数据线连接你的 iPhone。如果你已在 Xcode 中注册该设备，IntelliJ IDEA 应该会在运行配置列表中显示它。运行对应的 `iosApp` 配置。

如果你尚未在 Xcode 中注册你的 iPhone，请遵循 [Apple 建议](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)。简而言之，你应该：

1. 用数据线连接你的 iPhone。
2. 在你的 iPhone 上，在 **Settings** | **Privacy & Security** 中启用开发者模式。
3. 在 Xcode 中，转到顶部菜单并选择 **Window** | **Devices and Simulators**。
4. 点击加号。选择你连接的 iPhone 并点击 **Add**。
5. 使用你的 Apple ID 登录以在设备上启用开发能力。
6. 遵循屏幕上的说明以完成配对过程。

一旦你在 Xcode 中注册了你的 iPhone，在 IntelliJ IDEA 中[创建一个新的运行配置](#run-on-a-new-ios-simulated-device)并在**执行目标**列表中选择你的设备。运行对应的 `iosApp` 配置。

## 下一步

在教程的下一部分中，你将学习如何使用平台特有的库更新 UI 元素。

**[继续到下一部分](multiplatform-update-ui.md)**

### 另请参见

* 了解如何[创建并运行多平台测试](multiplatform-run-tests.md)以检测代码是否正常工作。
* 了解更多关于[项目结构](multiplatform-discover-project.md)的信息。
* 如果你想将你现有的 Android 项目转换为跨平台应用程序，请[完成本教程以使你的 Android 应用跨平台](multiplatform-integrate-in-existing-app.md)。

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。