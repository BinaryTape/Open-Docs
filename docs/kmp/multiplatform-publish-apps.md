[//]: # (title: 发布您的应用程序)

当您的应用准备好发布时，是时候通过发布将它们交付给用户了。

对于移动应用，每个平台都有多个商店可用。然而，在本文中，我们将重点关注官方渠道：
[Google Play Store](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/)。对于 Web 应用，我们将使用 [GitHub pages](https://pages.github.com/)。

您将学习如何准备 Kotlin Multiplatform 应用程序以进行发布，我们将重点介绍
此过程中需要特别注意的部分。

## Android 应用

由于 [Kotlin 是 Android 开发的主要语言](https://developer.android.com/kotlin)，
Kotlin Multiplatform 对项目编译和 Android 应用构建没有明显影响。从
共享模块生成的 Android 库以及 Android 应用本身都是典型的 Android Gradle 模块；它们与其他 Android
库和应用无异。因此，从 Kotlin Multiplatform 项目发布 Android 应用与 [Android 开发者文档](https://developer.android.com/studio/publish) 中描述的通常过程无异。

## iOS 应用

Kotlin Multiplatform 项目中的 iOS 应用是基于典型的 Xcode 项目构建的，因此发布它所涉及的主要阶段
与 [iOS 开发者文档](https://developer.apple.com/ios/submit/) 中描述的相同。

> 随着 Spring'24 对 App Store 政策的更改，缺少或不完整的隐私清单可能会导致您的应用收到警告甚至被拒。
> 有关详细信息和变通方法，特别是针对 Kotlin Multiplatform 应用，请参阅 [iOS 应用的隐私清单](https://kotlinlang.org/docs/apple-privacy-manifest.html)。
>
{style="note"}

Kotlin Multiplatform 项目的特殊之处在于，它会将共享的 Kotlin 模块编译成一个 framework 并将其链接到 Xcode 项目中。
通常，共享模块与 Xcode 项目之间的集成是由 [Kotlin Multiplatform plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile) 自动完成的。
但是，如果您不使用该插件，在 Xcode 中构建和打包 iOS 项目时请牢记以下几点：

* 共享的 Kotlin 库会编译为原生 framework。
* 您需要将为特定平台编译的 framework 连接到 iOS 应用项目。
* 在 Xcode 项目设置中，指定 framework 的路径以供构建系统搜索。
* 构建项目后，您应该启动并测试应用，确保在运行时使用该 framework 没有问题。

有两种方法可以将共享的 Kotlin 模块连接到 iOS 项目：
* 使用 [Kotlin CocoaPods Gradle plugin](multiplatform-cocoapods-overview.md)，它允许您在 iOS 项目中使用带有原生目标的 Multiplatform 项目作为 CocoaPods 依赖项。
* 手动配置您的 Multiplatform 项目以创建 iOS framework，并配置 Xcode 项目以获取其最新版本。
  Kotlin Multiplatform 向导或 Kotlin Multiplatform plugin for Android Studio 通常会执行此配置。
  关于 [连接 framework 到您的 iOS 项目](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)
  请参阅，了解如何在 Xcode 中直接添加该 framework。

### 配置您的 iOS 应用程序

您可以在不使用 Xcode 的情况下配置影响最终应用的基本属性。

#### Bundle ID

[bundle ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion)
在操作系统中唯一标识您的应用。要更改它，
在 Android Studio 中打开 `iosApp/Configuration/Config.xcconfig` 文件并更新 `BUNDLE_ID`。

#### 应用名称

应用名称设置目标可执行文件和应用程序 Bundle 名称。要更改您的应用名称：

* 如果您尚未在 Android Studio 中打开过该项目，您可以直接在任何文本编辑器中更改 `iosApp/Configuration/Config.xcconfig` 文件中的 `APP_NAME` 选项。
* 如果您已经打开了 Android Studio 中的项目，请执行以下操作：

  1. 关闭项目。
  2. 在任何文本编辑器中，更改 `iosApp/Configuration/Config.xcconfig` 文件中的 `APP_NAME` 选项。
  3. 重新在 Android Studio 中打开项目。

如果您需要配置其他设置，请使用 Xcode：在 Android Studio 中打开项目后，
在 Xcode 中打开 `iosApp/iosApp.xcworkspace` 文件并在其中进行更改。

### 符号化崩溃报告

为了帮助开发者改进其应用，iOS 提供了一种分析应用崩溃的方法。为了进行详细的崩溃分析，
它使用特殊的调试符号 (`.dSYM`) 文件，将崩溃报告中的内存地址与源代码中的位置（例如函数或行号）进行匹配。

默认情况下，从共享 Kotlin 模块生成的 iOS framework 的发布版本都附带一个 `.dSYM` 文件。
这有助于您分析共享模块代码中发生的崩溃。

有关崩溃报告符号化的更多信息，请参阅 [Kotlin/Native 文档](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)。

## Web 应用

要发布您的 Web 应用程序，请创建包含已编译文件
和组成您应用程序的资源的构件。这些构件是将您的应用程序部署到 GitHub Pages 等网络托管平台所需。

### 生成构件

创建用于运行 **wasmJsBrowserDistribution** 任务的运行配置：

1. 选择 **运行 | 编辑配置** 菜单项。
2. 点击加号按钮，从下拉列表中选择 **Gradle**。
3. 在 **任务与参数** 字段中，粘贴此命令：

   ```shell
   wasmJsBrowserDistribution
   ```

4. 点击 **OK**。

现在，您可以使用此配置来运行任务：

![Run the Wasm distribution task](compose-run-wasm-distribution-task.png){width=350}

任务完成后，您可以在 `composeApp/build/dist/wasmJs/productionExecutable`
目录中找到生成的构件：

![Artifacts directory](compose-web-artifacts.png){width=400}

### 在 GitHub Pages 上发布您的应用程序

构件准备就绪后，您可以在网络托管平台部署您的应用程序：

1. 将 `productionExecutable` 目录的内容复制到您想要创建站点的版本库中。
2. 按照 GitHub 关于 [创建您的站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) 的说明进行操作。

   > 在您将更改推送到 GitHub 后，您的站点可能需要长达 10 分钟才能发布。
   >
   {style="note"}

3. 在浏览器中，导航到您的 GitHub Pages 域名。

   ![Navigate to GitHub pages](publish-your-application-on-web.png){width=650}

   恭喜！您已在 GitHub Pages 上发布了您的构件。

### 调试您的 Web 应用程序

您可以开箱即用地在浏览器中调试您的 Web 应用程序，无需额外配置。要了解如何在浏览器中调试，
请参阅 Kotlin 文档中的 [在浏览器中调试](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser) 指南。