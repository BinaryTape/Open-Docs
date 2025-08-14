[//]: # (title: 创建跨平台移动应用程序)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

<p>
<b>视频</b>: <a href="https://youtu.be/_Q62iJoNOfg">Ktor 在 Kotlin Multiplatform Mobile 项目中的网络应用</a>
</p>
</tldr>

<link-summary>
了解如何创建 Kotlin Multiplatform Mobile 应用程序。
</link-summary>

Ktor HTTP 客户端可用于多平台项目。在本教程中，我们将创建一个简单的 Kotlin Multiplatform Mobile 应用程序，它将发送请求并接收纯 HTML 文本的响应体。

> 要了解如何创建你的第一个 Kotlin Multiplatform Mobile 应用程序，请参见 [创建你的第一个跨平台移动应用程序](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)。

## 先决条件 {id="prerequisites"}

首先，你需要通过在合适的操作系统上安装必要的工具来设置跨平台移动开发环境。关于如何操作，请参见 [设置环境](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 章节。

> 你需要一台装有 macOS 的 Mac 电脑才能完成本教程中的某些步骤，其中包括编写 iOS 特有的代码和运行 iOS 应用程序。
>
{style="note"}

## 创建新项目 {id="new-project"}

要启动新的 Kotlin Multiplatform 项目，有两种可用方法：

- 你可以在 Android Studio 中从模板创建项目。
- 或者，你可以使用 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) 来生成新项目。该向导提供了自定义项目设置的选项，例如，允许你排除 Android 支持或包含 Ktor Server。

为了本教程的目的，我们将演示从模板创建项目的过程：

1. 在 Android Studio 中，选择 **File | New | New Project**。
2. 在项目模板列表中选择 **Kotlin Multiplatform App**，然后点击 **Next**。
3. 为你的应用程序指定名称，然后点击 **Next**。在本教程中，应用程序名为 `KmmKtor`。
4. 在下一页，保留默认设置，然后点击 **Finish** 创建新项目。现在，请等待项目设置完成。首次执行时，下载和设置所需组件可能需要一些时间。
   > 要查看生成的跨平台项目的完整结构，请在 [项目视图](https://developer.android.com/studio/projects#ProjectView) 中从 **Android** 切换到 **Project**。

## 配置构建脚本 {id="build-script"}

### 更新 Kotlin Gradle 插件 {id="update_gradle_plugins"}

打开 `gradle/libs.versions.toml` 文件，并将 Kotlin 版本更新到最新：

[object Promise]

undefined

### 添加 Ktor 依赖项 {id="ktor-dependencies"}

要在你的项目中使用 Ktor HTTP 客户端，你需要添加至少两个依赖项：一个客户端依赖项和一个引擎依赖项。

在 `gradle/libs.versions.toml` 文件中添加 Ktor 版本：

[object Promise]

undefined

然后，定义 Ktor 客户端和引擎库：

[object Promise]

要添加这些依赖项，打开 `shared/build.gradle.kts` 文件并按照以下步骤操作：

1. 若要在公共代码中使用 Ktor 客户端，请将 `ktor-client-core` 依赖项添加到 `commonMain` 源代码集：
   [object Promise]

2. 为每个所需平台添加一个[引擎依赖项](client-engines.md)到对应的源代码集：
    - 对于 Android，将 `ktor-client-okhttp` 依赖项添加到 `androidMain` 源代码集：
      [object Promise]

      对于 Android，你还可以使用[其他引擎类型](client-engines.md#jvm-android)。
    - 对于 iOS，将 `ktor-client-darwin` 依赖项添加到 `iosMain`：
      [object Promise]

### 添加协程 {id="coroutines"}

要在 [Android 代码](#android-activity) 中使用协程，你需要将 `kotlinx.coroutines` 添加到你的项目：

1. 打开 `gradle/libs.versions.toml` 文件并指定协程版本和库：

    [object Promise]

2. 打开 `build.gradle.kts` 文件，并将 `kotlinx-coroutines-core` 依赖项添加到 `commonMain` 源代码集：

    [object Promise]

3. 然后，打开 `androidApp/build.gradle.kts` 并添加 `kotlinx-coroutines-android` 依赖项：

[object Promise]

点击 `gradle.properties` 文件右上角的 **Sync Now** 以安装添加的依赖项。

## 更新你的应用程序 {id="code"}

### 共享代码 {id="shared-code"}

若要更新 Android 和 iOS 之间共享的代码，打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 文件，并将以下代码添加到 `Greeting` 类中：

[object Promise]

- 要创建 HTTP 客户端，会调用 `HttpClient` 构造函数。
- 挂起函数 `greeting` 用于发起[请求](client-requests.md)并接收[响应](client-responses.md)体作为字符串值。

### Android 代码 {id="android-activity"}

若要从 Android 代码中调用挂起函数 `greeting`，我们将使用 [rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))。

打开 `androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 文件，并按如下方式更新 `MainActivity` 代码：

[object Promise]

在创建的作用域内，我们可以调用共享的 `greeting` 函数并处理可能的异常。

### iOS 代码 {id="ios-view"}

1. 打开 `iosApp/iosApp/iOSApp.swift` 文件，并更新应用程序的入口点：
   [object Promise]

2. 打开 `iosApp/iosApp/ContentView.swift` 文件，并按以下方式更新 `ContentView` 代码：
   [object Promise]

   在 iOS 上，挂起函数 `greeting` 作为带有回调的函数可用。

## 在 Android 上启用互联网访问 {id="android-internet"}

我们需要做的最后一件事是为 Android 应用程序启用互联网访问。打开 `androidApp/src/main/AndroidManifest.xml` 文件，并使用 `uses-permission` 元素启用所需的权限：

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest>
```

## 运行你的应用程序 {id="run"}

要在 Android 或 iOS 模拟器上运行创建的多平台应用程序，请选择 **androidApp** 或 **iosApp** 并点击 **Run**。
模拟器应将收到的 HTML 文档显示为纯文本。

<tabs>
<tab title="Android">

![Android 模拟器](tutorial_client_kmm_android.png){width="381"}

</tab>
<tab title="iOS">

![iOS 模拟器](tutorial_client_kmm_ios.png){width="351"}

</tab>
</tabs>