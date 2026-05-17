[//]: # (title: 发布您的应用)

一旦您的应用准备好发布，就可以通过发布它们将其交付给用户。

对于移动应用，每个平台都有多个商店可用。不过，在本文中，我们将重点关注官方商店：
[Google Play 商店](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/)。对于 Web 应用，我们将使用 [GitHub Pages](https://pages.github.com/)。

您将学习如何为发布准备 Kotlin Multiplatform 应用程序，我们将重点介绍此流程中值得特别关注的部分。

## Android 应用

由于 [Kotlin 是 Android 开发的主要语言](https://developer.android.com/kotlin)，Kotlin Multiplatform 对项目编译和构建 Android 应用没有明显影响。从共享模块生成的 Android 库和 Android 应用本身都是典型的 Android Gradle 模块；它们与其他 Android 库和应用没有什么不同。因此，从 Kotlin Multiplatform 项目发布 Android 应用与 [Android 开发者文档](https://developer.android.com/studio/publish)中描述的通常流程没有区别。

## iOS 应用

Kotlin Multiplatform 项目中的 iOS 应用是基于典型的 Xcode 项目构建的，因此发布涉及的主要阶段与 [iOS 开发者文档](https://developer.apple.com/ios/submit/)中描述的相同。

> 随着 2024 年春季 App Store 政策的变化，隐私清单缺失或不完整可能会导致您的应用收到警告甚至被拒。
> 有关详细信息和解决方法，特别是针对 Kotlin Multiplatform 应用，请参阅 [iOS 应用的隐私清单](https://kotlinlang.org/docs/apple-privacy-manifest.html)。
>
{style="note"}

Kotlin Multiplatform 项目的特殊之处在于将共享的 Kotlin 模块编译成框架并将其链接到 Xcode 项目。通常，共享模块与 Xcode 项目之间的集成是由 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)自动完成的。但是，如果您不使用该插件，在 Xcode 中构建和捆绑 iOS 项目时请注意以下几点：

*   共享的 Kotlin 库会编译为原生框架。
*   您需要将为特定平台编译的框架连接到 iOS 应用项目。
*   在 Xcode 项目设置中，指定框架的路径以便构建系统进行搜索。
*   构建项目后，您应该启动并测试应用，以确保在运行时使用框架时没有问题。

有两种方法可以将共享的 Kotlin 模块连接到 iOS 项目：
*   使用 [Kotlin CocoaPods Gradle 插件](multiplatform-cocoapods-overview.md)，该插件允许您将具有原生目标的多平台项目作为 CocoaPods 依赖项在 iOS 项目中使用。
*   手动配置您的 Multiplatform 项目以创建 iOS 框架，并配置 Xcode 项目以获取其最新版本。Kotlin Multiplatform 向导或 Kotlin Multiplatform IDE 插件通常会负责此项配置。请参阅[将框架连接到您的 iOS 项目](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)了解如何直接在 Xcode 中添加框架。

### 配置您的 iOS 应用程序

您可以在不使用 Xcode 的情况下配置影响最终应用的基本属性。

#### Bundle ID

[Bundle ID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion) 在操作系统中唯一标识您的应用。要更改它，请在 Android Studio 中打开 `iosApp/Configuration/Config.xcconfig` 文件并更新 `BUNDLE_ID`。

#### 应用名称

应用名称设置目标可执行文件和应用程序包名称。要更改您的应用名称：

*   如果您*尚未*在 Android Studio 中打开项目，可以直接在任何文本编辑器中更改 `iosApp/Configuration/Config.xcconfig` 文件中的 `APP_NAME` 选项。
*   如果您已经在 Android Studio 中打开了项目，请执行以下操作：

  1. 关闭项目。
  2. 在任何文本编辑器中，更改 `iosApp/Configuration/Config.xcconfig` 文件中的 `APP_NAME` 选项。
  3. 在 Android Studio 中重新打开项目。

如果您需要配置其他设置，请使用 Xcode：在 Android Studio 中打开项目后，在 Xcode 中打开 `iosApp/iosApp.xcworkspace` 文件并在其中进行更改。

### 符号化崩溃报告

为了帮助开发者改进其应用，iOS 提供了一种分析应用崩溃的手段。对于详细的崩溃分析，它使用特殊的调试符号 (`.dSYM`) 文件，这些文件将崩溃报告中的内存地址与源代码中的位置（如函数或行号）相匹配。

默认情况下，从共享 Kotlin 模块生成的 iOS 框架的发布版本附带一个 `.dSYM` 文件。这有助于您分析共享模块代码中发生的崩溃。

有关崩溃报告符号化的更多信息，请参阅 [Kotlin/Native 文档](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)。

## Web 应用

要发布您的 Web 应用程序，请创建包含构成您的应用程序的编译文件和资源的工件。这些工件是将您的应用程序部署到 GitHub Pages 等 Web 托管平台所必需的。

### 生成工件

创建用于运行 **wasmJsBrowserDistribution** 任务的运行配置：

1. 选择 **Run | Edit Configurations** 菜单项。
2. 点击加号按钮，并在下拉列表中选择 **Gradle**。
3. 在 **Tasks and arguments** 字段中，粘贴以下命令：

   ```shell
   wasmJsBrowserDistribution
   ```

4. 点击 **OK**。

现在，您可以使用此配置来运行任务：

![运行 Wasm 分发任务](compose-run-wasm-distribution-task.png){width=350}

任务完成后，您可以在 `sharedUI/build/dist/wasmJs/productionExecutable` 目录中找到生成的工件：

![工件目录](compose-web-artifacts.png){width=400}

### 在 GitHub Pages 上发布您的应用程序

准备好工件后，您可以将应用程序部署到 Web 托管平台：

1. 将 `productionExecutable` 目录的内容复制到您要创建站点的仓库中。
2. 按照 GitHub 关于[创建您的站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)的说明进行操作。

   > 在您将更改推送到 GitHub 后，站点更改可能需要长达 10 分钟才能发布。
   >
   {style="note"}

3. 在浏览器中，导航到您的 GitHub Pages 域名。

   ![导航到 GitHub Pages](publish-your-application-on-web.png){width=650}

   恭喜！您已在 GitHub Pages 上发布了您的工件。

### 调试您的 Web 应用程序

您可以开箱即用地在浏览器中调试 Web 应用程序，无需额外配置。要了解如何在浏览器中进行调试，请参阅 Kotlin 文档中的[在浏览器中调试](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)指南。