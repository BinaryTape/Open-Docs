[//]: # (title: 创建你的 Kotlin Multiplatform 应用)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习——这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是《**使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用**》教程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>创建你的 Kotlin Multiplatform 应用</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> 更新用户界面<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 添加依赖项<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共享更多逻辑<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成你的项目<br/>
    </p>
</tldr>

在此你将学习如何使用 IntelliJ IDEA 创建并运行你的第一个 Kotlin Multiplatform 应用程序。

Kotlin Multiplatform 技术简化了跨平台项目的开发。Kotlin Multiplatform 应用程序可在多种平台（如 iOS、Android、macOS、Windows、Linux、Web 等）上运行。

Kotlin Multiplatform 的主要用例之一是在移动平台之间共享代码。你可以在 iOS 和 Android 应用之间共享应用程序逻辑，并仅在需要实现原生 UI 或使用平台 API 时编写平台特有的代码。

## 创建项目

1. 在[快速入门](quickstart.md)中，完成[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)的说明。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在 **New Project** 窗口中指定以下字段：
   * **Name**: GreetingKMP
   * **Group**: com.jetbrains.greeting
   * **Artifact**: greetingkmp
   
   ![创建 Compose Multiplatform 项目](create-first-multiplatform-app.png){width=800}

5. 选择 **Android** 和 **iOS** 目标。
6. 对于 iOS，选择 **Do not share UI** 选项以保持 UI 原生。
7. 指定所有字段和目标后，点击 **Create**。

> IntelliJ IDEA 可能会自动建议将项目中的 Android Gradle 插件升级到最新版本。
> 我们不推荐升级，因为 Kotlin Multiplatform 与最新的 AGP 版本不兼容（请参见[兼容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

## 检查项目结构

在 IntelliJ IDEA 中，展开 `GreetingKMP` 文件夹。

此 Kotlin Multiplatform 项目包含三个模块：

* _shared_ 是一个 Kotlin 模块，包含 Android 和 iOS 应用程序的通用逻辑——即你在平台之间共享的代码。它使用 [Gradle](https://kotlinlang.org/docs/gradle.html) 作为构建系统，以帮助自动化你的构建过程。
* _composeApp_ 是一个 Kotlin 模块，可构建为 Android 应用程序。它使用 Gradle 作为构建系统。
  composeApp 模块依赖并使用 shared 模块作为一个常规 Android 库。
* _iosApp_ 是一个 Xcode 项目，可构建为 iOS 应用程序。它依赖并使用 shared 模块作为一个 iOS framework。shared 模块可以用作常规 framework 或 [CocoaPods 依赖项](multiplatform-cocoapods-overview.md)。默认情况下，在 IntelliJ IDEA 中创建的 Kotlin Multiplatform 项目使用常规 framework 依赖项。

![基本的 Multiplatform 项目结构](basic-project-structure.svg){width=700}

shared 模块包含三个源代码集：`androidMain`、`commonMain` 和 `iosMain`。_源代码集_ 是一个 Gradle 概念，用于逻辑上将一组文件分组，其中每组都有自己的依赖项。
在 Kotlin Multiplatform 中，shared 模块中的不同源代码集可以面向不同的平台。

通用源代码集包含共享的 Kotlin 代码，而平台源代码集则使用每个目标特有的 Kotlin 代码。
Kotlin/JVM 用于 `androidMain`，Kotlin/Native 用于 `iosMain`：

![源代码集和模块结构](basic-project-structure-2.png){width=350}

当 shared 模块构建为 Android 库时，通用 Kotlin 代码被视为 Kotlin/JVM。
当它构建为 iOS framework 时，通用 Kotlin 被视为 Kotlin/Native：

![通用 Kotlin、Kotlin/JVM 和 Kotlin/Native](modules-structure.png)

### 编写通用声明

通用源代码集包含可用于多个目标平台的共享代码。
它旨在包含平台无关的代码。如果你尝试在通用源代码集中使用平台特有的 API，IDE 将显示警告：

1. 打开 `shared/src/commonMain/kotlin/com/jetbrains/greeting/greetingkmp/Greeting.kt` 文件，你可以在其中找到一个自动生成的 `Greeting` 类及其 `greet()` 函数：

    ```kotlin
    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 为问候语增加一些多样性。从 Kotlin 标准库导入 `kotlin.random.Random`。
    这是一个可在所有平台运行的多平台库，并自动作为依赖项包含在内。
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

仅在通用 Kotlin 中编写代码有明显的局限性，因为它无法使用任何平台特有的功能性。
使用接口和 [expect/actual](multiplatform-connect-to-apis.md) 机制可以解决此问题。

### 查看平台特有的实现

通用源代码集可以定义预期声明（例如接口、类等）。
然后，每个平台源代码集（在本例中为 `androidMain` 和 `iosMain`）必须为预期声明提供实际的平台特有实现。

在为特定平台生成代码时，Kotlin 编译器会合并预期声明和实际声明，并生成一个包含实际实现的单个声明。

1. 使用 IntelliJ IDEA 创建 Kotlin Multiplatform 项目时，
   你会在 `commonMain` 模块中获得一个包含 `Platform.kt` 文件的模板：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   这是一个包含平台信息的通用 `Platform` 接口。

2. 在 `androidMain` 和 `iosMain` 模块之间切换。
   你会看到它们对 Android 和 iOS 源代码集具有相同功能性的不同实现：
    
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

    * 来自 `AndroidPlatform` 的 `name` 属性实现使用了 Android 特有的代码，即 `android.os.Build` 依赖项。此代码是用 Kotlin/JVM 编写的。如果你尝试在此处访问 JVM 特有的类（例如 `java.util.Random`），此代码将编译。
    * 来自 `IOSPlatform` 的 `name` 属性实现使用了 iOS 特有的代码，即 `platform.UIKit.UIDevice` 依赖项。它用 Kotlin/Native 编写，这意味着你可以用 Kotlin 编写 iOS 代码。此代码成为 iOS framework 的一部分，你稍后将在 iOS 应用程序中从 Swift 调用它。

3. 检查不同源代码集中的 `getPlatform()` 函数。它的预期声明没有函数体，
   实际实现是在平台代码中提供的：

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

在这里，通用源代码集定义了一个预期 `getPlatform()` 函数，并在平台源代码集中为 Android 应用提供了实际实现 `AndroidPlatform()`，为 iOS 应用提供了 `IOSPlatform()`。

在为特定平台生成代码时，Kotlin 编译器会将预期声明和实际声明合并为一个 `getPlatform()` 函数及其实际实现。

这就是为什么预期声明和实际声明应该定义在同一个包中——它们在结果平台代码中合并为一个声明。生成的平台代码中对预期 `getPlatform()` 函数的任何调用都会调用正确的实际实现。

现在你可以运行这些应用，并看到这一切的实际效果。

#### 探索 expect/actual 机制（可选） {initial-collapse-state="collapsed" collapsible="true"}

模板项目使用 expect/actual 机制来实现函数，但它也适用于大多数 Kotlin 声明，例如属性和类。让我们实现一个预期属性：

1. 打开 `commonMain` 模块中的 `Platform.kt` 文件，并在文件末尾添加以下内容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 编译器会报错，指出此属性在平台模块中没有对应的实际声明。

2. 尝试立即提供实现：

   ```kotlin
   expect val num: Int = 42
   ```

   你会收到一个错误，提示预期声明不能有函数体，在本例中是初始化器。
   实现必须在实际平台模块中提供。移除初始化器。
3. 将鼠标悬停在 `num` 属性上，然后点击 **Create missed actuals...**。
   选择 `androidMain` 源代码集。然后你可以在 `androidMain/Platform.android.kt` 中完成实现：

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

你可以从 IntelliJ IDEA 运行你的多平台应用程序，无论是 [Android](#run-your-application-on-android) 还是 [iOS](#run-your-application-on-ios)。

如果你之前探索过 expect/actual 机制，你会看到 Android 的问候语中添加了 "[1]"，iOS 的问候语中添加了 "[2]"。

### 在 Android 上运行你的应用程序

1. 在运行配置列表中，选择 **composeApp**。
2. 在配置列表旁边选择一个 Android 虚拟设备，然后点击 **Run**。

   如果列表中没有设备，请[创建一个新的 Android 虚拟设备](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![运行 Android 上的多平台应用](compose-run-android.png){width=350}

   ![Android 上的第一个移动多平台应用](first-multiplatform-project-on-android-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_android_other_devices"/>

### 在 iOS 上运行你的应用程序

如果你在初始设置中尚未启动 Xcode，请在运行 iOS 应用之前执行此操作。

在 IntelliJ IDEA 中，在运行配置列表中选择 **iosApp**，在运行配置旁边选择一个模拟设备，然后点击 **Run**。

如果列表中没有可用的 iOS 配置，请添加[一个新的运行配置](#run-on-a-new-ios-simulated-device)。

![运行 iOS 上的多平台应用](compose-run-ios.png){width=350}

![iOS 上的第一个移动多平台应用](first-multiplatform-project-on-ios-1.png){width=300}

<include from="compose-multiplatform-create-first-app.md" element-id="run_ios_other_devices"/>

## 下一步

在教程的下一部分，你将学习如何使用平台特有的库更新 UI 元素。

**[继续下一部分](multiplatform-update-ui.md)**

### 另请参阅

* 查看如何[创建并运行多平台测试](multiplatform-run-tests.md)以检测代码是否正常工作。
* 了解更多关于[项目结构](multiplatform-discover-project.md)的信息。
* 如果你想将现有 Android 项目转换为跨平台应用，请[完成此教程以使你的 Android 应用跨平台](multiplatform-integrate-in-existing-app.md)。

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题追踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。