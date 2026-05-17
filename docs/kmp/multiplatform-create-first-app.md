[//]: # (title: 创建您的 Kotlin Multiplatform 应用)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中参考——这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是<strong>使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用</strong>教程的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>创建您的 Kotlin Multiplatform 应用</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> 更新用户界面<br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> 添加依赖项<br/>       
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多逻辑<br/>
       <img src="icon-5-todo.svg" width="20" alt="第五步"/> 完成您的项目<br/>
    </p>
</tldr>

在此您将学习如何使用 IntelliJ IDEA 创建并运行您的第一个 Kotlin Multiplatform 应用程序。

Kotlin Multiplatform 技术简化了跨平台项目的开发。
Kotlin Multiplatform 应用程序可以在 iOS、Android、macOS、Windows、Linux、Web 等多种平台上运行。

Kotlin Multiplatform 的主要用例之一是在移动平台之间共享代码。
您可以在 iOS 和 Android 应用之间共享应用逻辑，并且仅在需要实现原生 UI 或使用平台 API 时编写平台特定代码。

## 创建项目

1. 在[快速入门指南](quickstart.md)中，按照说明[为 Kotlin Multiplatform 开发设置环境](quickstart.md#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File**（文件） | **New**（新建） | **Project**（项目）。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在 **New Project**（新项目）窗口中指定以下字段：
   * **Name**: GreetingKMP
   * **Project ID**: com.jetbrains.greetingkmp

5. 选择 **Android** 和 **iOS** 目标。
6. 对于 iOS，选择 **Do not share UI** 选项以保持 UI 原生。
7. 指定所有字段和目标后，点击 **Create**。

![创建 Kotlin Multiplatform 项目](create-first-multiplatform-app.png){width=700}

> IDE 可能会自动建议将项目中的 Android Gradle 插件升级到最新版本。
> 我们不建议升级，因为 Kotlin Multiplatform 可能与最新的 AGP 版本不兼容
> （请参阅[兼容性表](https://kotlinlang.org/docs/multiplatform-compatibility-guide.html#version-compatibility)）。
>
{style="note"}

## 检查项目结构

在 IntelliJ IDEA 中，展开 `GreetingKMP` 文件夹。

这个 Kotlin Multiplatform 项目包含以下模块：

* _androidApp_ 是一个构建为 Android 应用程序的 Kotlin 模块。它使用 Gradle 作为构建系统。
  composeApp 模块依赖并像使用常规 Android 库一样使用 shared 模块。
* _iosApp_ 是一个构建为 iOS 应用程序的 Xcode 项目。
  它依赖于 `sharedLogic` 模块，该模块被导出为 iOS 框架。
  使用 IDE 向导创建的 Kotlin Multiplatform 项目通过[直接集成](multiplatform-direct-integration.md)使用常规框架依赖项。
* _sharedLogic_ 是多平台模块，包含 Android 和 iOS 应用程序通用的逻辑。
* _sharedUI_ 是包含 Compose Multiplatform UI 代码的模块：在此项目中，它仅供 Android 应用使用，
  但它是一个多平台模块，只要您准备就绪，就可以供其他目标使用。

除 `iosApp` 外，每个模块都使用 Gradle 作为构建系统。

![基本 Multiplatform 项目结构](basic-project-structure.svg){width=700}
<!-- TODO need to redo the diagram: ios depends on sharedLogic while android on both sharedLogic and sharedUI -->

_源集 (source set)_ 是一个 Gradle 概念，用于将多个文件在逻辑上分组在一起，每个组都有自己的依赖项。
在 Kotlin Multiplatform 中，共享模块中的不同源集可以针对不同的平台。

`sharedLogic` 模块包含 `androidMain`、`commonMain` 和 `iosMain` 源集。
`commonMain` 源集包含共享的 Kotlin 代码，而平台源集使用针对每个目标的特定 Kotlin 代码。
`androidMain` 使用 Kotlin/JVM，`iosMain` 使用 Kotlin/Native：

![源集和模块结构](basic-project-structure-2.png){width=350}

当共享模块被构建为 Android 库时，公共 Kotlin 代码被视为 Kotlin/JVM。
当它被构建为 iOS 框架时，公共 Kotlin 被视为 Kotlin/Native：

![公共 Kotlin、Kotlin/JVM 和 Kotlin/Native](modules-structure.png)

### 编写公共声明

common 源集包含可在多个目标平台间使用的共享代码。
它旨在包含与平台无关的代码。如果您尝试在 common 源集中使用平台特定的 API，IDE 将显示警告：

1. 打开 `sharedLogic/src/commonMain/.../Greeting.kt` 文件，
    您可以在其中找到带有 `greet()` 函数的生成的 `Greeting` 类。
2. 让我们给问候语增加一点变化。导航到 `GreetingUtil.kt` 文件中 `sayHello()` 函数的定义。

3. 使用随机化和来自 Kotlin 标准库的 `reversed()` 调用来反转接收到的字符串，从而更新共享代码：

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord Guess what this is! > ${to.reversed()}!"
    }
    ```
4. 根据 IDE 的建议导入 `kotlin.random.Random` 类。

仅在 common Kotlin 中编写代码有明显的局限性，因为它无法使用任何平台特定的功能。
使用具有平台特定实现的通用接口，并配合 [expect/actual](multiplatform-connect-to-apis.md) 机制可以解决这个问题。

### 查看平台特定实现

common 源集可以定义期望声明 (expected declaration) —— 接口、类等。
在每个平台源集（在这种情况下为 `androidMain` 和 `iosMain`）中，
您必须为期望声明提供实际的平台特定实现 (actual implementation)。

在为特定平台生成代码时，Kotlin 编译器会合并期望声明和实际声明，
并生成一个带有实际实现的单一声明。

1. 使用 IntelliJ IDEA 创建 Kotlin Multiplatform 项目时，
   您会在 `sharedLogic/src/commonMain` 模块中获得一个 `Platform.kt` 文件：

    ```kotlin
    interface Platform {
        val name: String
    }
    ```

   这是一个通用的 `Platform` 接口，旨在包含有关平台的信息。

2. 您可以在 `androidMain` 和 `iosMain` 源集中找到实现该接口的平台特定类：
    
    ```kotlin
    // androidMain 源集中的 Platform.android.kt
    import android.os.Build

    class AndroidPlatform : Platform {
        override val name: String = "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // iosMain 源集中的 Platform.ios.kt
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * `AndroidPlatform` 类的 `name` 属性使用了 Android 特定的代码，即 `android.os.Build` 依赖项。此代码被解释为 Kotlin/JVM。如果您尝试在此处访问 JVM 特定的类（如 `java.util.Random`），此代码将可以编译。
    * `IOSPlatform` 类的 `name` 属性使用了 iOS 特定的代码，即 `platform.UIKit.UIDevice` 依赖项。此代码被解释为 Kotlin/Native，这意味着您可以在 Kotlin 中引用 iOS 声明。该代码将成为 iOS 框架的一部分，并在 `iosApp` 模块的 Swift 代码中导入。

3. 每个源集都包含一个 `getPlatform()` 函数。
   它的期望声明没有函数体，而实际实现是在平台代码中提供的：

    ```kotlin
    // commonMain 源集中的 Platform.kt
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // androidMain 源集中的 Platform.android.kt
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // iosMain 源集中的 Platform.ios.kt
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

在这里，common 源集定义了一个期望的 `getPlatform()` 函数，并在平台源集中拥有实际实现（Android 应用为 `AndroidPlatform()`，iOS 应用为 `IOSPlatform()`）。

在为特定平台生成代码时，Kotlin 编译器会将期望声明和实际声明
合并为具有正确实现的单一 `getPlatform()` 函数。

这就是为什么期望声明和实际声明应该定义在同一个包中的原因 —— 它们在生成的平台代码中被合并为一个声明。生成的平台代码中对期望 `getPlatform()` 函数的任何调用随后都会引用正确的实际实现。

现在您可以运行应用并查看其实际效果。

#### 创建 expect/actual 变量 (可选) {initial-collapse-state="collapsed" collapsible="true"}

模板项目对函数使用了 expect/actual 机制，但它也适用于大多数 Kotlin 声明，
例如属性和类。让我们实现一个期望属性：

1. 打开 `commonMain` 模块中的 `Platform.kt`，并在文件末尾添加以下内容：

   ```kotlin
   expect val num: Int
   ```

   Kotlin 编译器会提示该属性在平台模块中没有对应的实际声明。

2. 尝试立即提供实现：

   ```kotlin
   expect val num: Int = 42
   ```

   您会收到一个错误，指出“期望属性不能有初始值设定项”，
   因为 `expect` 声明不能有主体。
   实现必须在实际平台模块中提供。
3. 移除初始值设定项。
4. 在 `androidMain/.../Platform.android.kt` 中添加 Android 实现如下：

    ```kotlin
    actual val num: Int = 1
    ```

5. 现在为 `iosMain` 模块中的 `num` 提供实际实现。
   将以下内容添加到 `iosMain/.../Platform.ios.kt` 文件：

    ```kotlin
    actual val num: Int = 2
    ```

6. 在 `commonMain/.../GreetingUtil.kt` 文件中，在 `sayHello()` 函数生成的字符串中使用 `num` 属性：

    ```kotlin
    fun sayHello(to: String): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

        return "$firstWord [$num] Guess what this is! > ${to.reversed()}!"
    }
    ```

## 运行您的应用程序

您可以从 IntelliJ IDEA 中为 Android 和 iOS 运行您的多平台应用程序。

如果您之前创建了可选的 expect/actual 属性，您应该会看到 Android 的问候语中添加了 "[1]"，
而 iOS 的问候语中添加了 "[2]"。

### 在 Android 上运行您的应用程序

1. 在运行配置列表中，选择 **androidApp**。
2. 在配置列表旁边选择一个 Android 虚拟设备，然后点击 **Run**（运行）。

   如果列表中没有设备，请创建一个[新的 Android 虚拟设备](https://developer.android.com/studio/run/managing-avds#createavd)。

   ![在 Android 上运行多平台应用](compose-run-android.png){width=350}

   ![Android 上的第一个移动多平台应用](first-multiplatform-project-on-android-1.png){width=300}

#### 在不同的 Android 模拟设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置 Android 模拟器并在不同的模拟设备上运行您的应用程序](https://developer.android.com/studio/run/emulator#runningapp)。

#### 在真实 Android 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

了解如何[配置并连接硬件设备并在其上运行您的应用程序](https://developer.android.com/studio/run/device)。

### 在 iOS 上运行您的应用程序

如果您尚未将 Xcode 作为初始设置的一部分启动，请在运行 iOS 应用之前启动它。

在 IntelliJ IDEA 中，在运行配置列表中选择 **iosApp**，在运行配置旁边选择一个模拟设备，
然后点击 **Run**（运行）。

如果列表中没有可用的 iOS 配置，请启动 Xcode 以填充可用的模拟器并重新启动 IntelliJ IDEA。

![在 iOS 上运行多平台应用](compose-run-ios.png){width=350}

![iOS 上的第一个移动多平台应用](first-multiplatform-project-on-ios-1.png){width=350}

#### 在真实 iOS 设备上运行 {initial-collapse-state="collapsed" collapsible="true"}

您可以在真实的 iOS 设备上运行您的多平台应用程序。在开始之前，
您需要设置与您的 [Apple ID](https://support.apple.com/en-us/HT204316) 关联的 Team ID。

##### 设置您的 Team ID

要首次为项目设置新的 Team ID，请在 Xcode 中打开项目
（**File | Open Project in Xcode**）：

1. 在左侧的 Project 导航器中，选择 **iosApp**。
2. 选择 **Targets** 下的 **iosApp** 并切换到 **Signing & Capabilities** 选项卡。
3. 在 **Team** 列表中，选择您的团队。

   如果您尚未设置团队，请使用 **Team** 列表中的 **Add an Account** 选项并按照 Xcode 说明进行操作。

4. 确保 Bundle Identifier 是唯一的，并且已成功分配 Signing Certificate。

在 Xcode 中设置团队后，您可以在 IntelliJ IDEA 中设置或更改团队：

1. 编辑 **iosApp** 的运行配置：

   ![编辑 iOS 运行配置](ios-edit-configurations.png){width=450}

2. 切换到 **Options** 选项卡，在 **Development team** 下拉菜单中进行必要的更改，然后点击 **OK**。

##### 运行应用

使用线缆连接您的 iPhone。如果您已经在 Xcode 中注册了该设备，IntelliJ IDEA 应该会将其显示
在运行配置列表中。运行相应的 `iosApp` 配置。

如果您尚未在 Xcode 中注册您的 iPhone，请按照 [Apple 的建议](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)操作。
简而言之，您应该：

1. 使用线缆连接您的 iPhone。
2. 在您的 iPhone 上，在 **Settings**（设置） | **Privacy & Security**（隐私与安全性）中启用开发者模式。
3. 在 Xcode 中，转到顶部菜单并选择 **Window** | **Devices and Simulators**。
4. 如果您的 iPhone 未显示为已连接，请点击左下角的加号并选择它。
5. 按照屏幕上的说明完成配对过程。

在 Xcode 中注册 iPhone 后，当您选择 **iosApp** 运行配置时，它将出现在 IntelliJ IDEA 的可用设备列表中。

## 下一步

在教程的下一部分中，您将学习如何使用平台特定的库来更新 UI 元素。

**[继续下一部分](multiplatform-update-ui.md)**

### 另请参阅

* 查看如何[创建并运行多平台测试](multiplatform-run-tests.md)以检查代码是否正常工作。
* 详细了解[项目结构](multiplatform-discover-project.md)。
* 如果您想将现有的 Android 项目转换为跨平台应用，请[完成本教程以使您的 Android 应用跨平台](multiplatform-integrate-in-existing-app.md)。

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入
  [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。