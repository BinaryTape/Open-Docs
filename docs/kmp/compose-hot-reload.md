[//]: # (title: Compose 热重载)

<primary-label ref="beta"/>

[Compose 热重载](https://github.com/JetBrains/compose-hot-reload) 帮助您在处理 Compose Multiplatform 项目时可视化并实验 UI 变更。

Compose 热重载 目前仅在您的多平台项目包含 desktop 目标平台且兼容 Java 21 或更早版本时可用。

我们正在探索未来增加对其他目标平台的支持。同时，使用 desktop 应用作为您的沙盒可以帮助您快速实验通用代码中的 UI 变更，而不会中断您的工作流。

![Compose 热重载](compose-hot-reload.gif){width=350}

## 将 Compose Hot Reload 添加到您的项目

Compose 热重载 可通过两种方式添加，即：

* [在 IntelliJ IDEA 或 Android Studio 中从头创建项目](#from-scratch)
* [将其作为 Gradle 插件添加到现有项目](#to-an-existing-project)

### 从头开始

本节将引导您完成在 IntelliJ IDEA 和 Android Studio 中创建包含 desktop 目标平台的多平台项目的步骤。当您的项目创建后，Compose 热重载 将自动添加。

1. 在 [快速入门](quickstart.md) 中，完成以下说明以 [为 Kotlin Multiplatform 开发设置环境](quickstart.md#set-up-the-environment)。
2. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在 **New Project** 窗口中指定 **Name**、**Group** 和 **Artifact** 字段
5. 选择 **Desktop** 目标平台，然后点击 **Create**。
   ![创建包含 desktop 目标平台的多平台项目](create-desktop-project.png){width=600 style="block"}

### 添加到现有项目

本节将引导您完成将 Compose 热重载 添加到现有多平台项目的步骤。这些步骤参考了 [使用共享逻辑和 UI 创建应用](compose-multiplatform-create-first-app.md) 教程中的项目。

> 从 Compose Multiplatform 1.10.0 开始，您不再需要单独配置 Compose Hot Reload 插件，因为它已 [捆绑](whats-new-compose-110.md#compose-hot-reload-integration) 并默认启用，适用于包含 desktop 目标平台的项目。但是，您仍然可以显式声明 Compose Hot Reload 插件以使用特定版本。
> 
{style="note"}

1. 在您的项目中，使用最新版本的 Compose Hot Reload 更新版本目录（请参见 [发行版本](https://github.com/JetBrains/compose-hot-reload/releases)）。
   在 `gradle/libs.versions.toml` 中，添加以下代码：
   ```kotlin
   composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
   ```

   > 要了解有关如何使用版本目录以集中管理项目中的依赖项的更多信息，请参见我们的 [Gradle 最佳实践](https://kotlinlang.org/gradle-best-practices.html)。

2. 在您的父项目 (`ComposeDemo/build.gradle.kts`) 的 `build.gradle.kts` 中，将以下代码添加到您的 `plugins {}` 代码块中：
   ```kotlin
   plugins {
       alias(libs.plugins.composeHotReload) apply false
   }
   ```
   这可以防止 Compose Hot Reload 插件在您的每个子项目中被多次加载。

3. 在包含您的多平台应用程序的子项目 (`ComposeDemo/composeApp/build.gradle.kts`) 的 `build.gradle.kts` 中，将以下代码添加到您的 `plugins {}` 代码块中：
   ```kotlin
   plugins { 
       alias(libs.plugins.composeHotReload)
   }
   ```

4. 要使用 Compose Hot Reload 的全部功能，您的项目必须运行在 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 上，这是一个支持增强类重定义的 OpenJDK 分支。
   Compose Hot Reload 可以自动提供兼容的 JBR 给您的项目。

   > 最新的 JetBrains Runtime 仅支持 Java 21：
   > 如果您将 Compose Hot Reload 添加到仅兼容 Java 22 或更高版本的项目，
   > 运行项目将导致链接错误。
   > 
   {style="warning"}

   为了实现此目的，请将以下 Gradle 插件添加到您的 `settings.gradle.kts` 文件中：

   ```kotlin
   plugins {
       id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
   }
   ```

5. 点击 **Sync Gradle Changes** 按钮以同步 Gradle 文件： ![同步 Gradle 文件](gradle-sync.png){width=50}

## 使用 Compose Hot Reload

1. 在 `jvmMain` 目录中，打开 `main.kt` 文件并更新 `main()` 函数：
   ```kotlin
   fun main() = application {
       Window(
           onCloseRequest = ::exitApplication,
           alwaysOnTop = true,
           title = "composedemo",
       ) {
           App()
       }
   }
   ```
   通过将 `alwaysOnTop` 变量设置为 `true`，生成的 desktop 应用将保持在所有窗口的顶部，使您更轻松地编辑代码并实时查看更改。

2. 打开 `App.kt` 文件并更新 `Button` 可组合项：
   ```kotlin
   Button(onClick = { showContent = !showContent }) {
       Column {
           Text(Greeting().greet())
       }
   }
   ```
   现在，按钮的文本由 `greet()` 函数控制。

3. 打开 `Greeting.kt` 文件并更新 `greet()` 函数：
   ```kotlin
    fun greet(): String {
        return "Hello!"
    }
   ```

4. 打开 `main.kt` 文件并点击边栏中的 **Run** 图标。
   选择 **Run 'composeApp [hotRunJvm]' with Compose Hot Reload (Beta)**。

   ![从边栏运行 Compose 热重载](compose-hot-reload-gutter-run.png){width=350}

   ![desktop 应用上的首次 Compose 热重载](compose-hot-reload-hello.png){width=500}

5. 更新 `greet()` 函数返回的字符串，然后保存所有文件 (<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>) 以查看 desktop 应用自动更新。

   ![Compose 热重载](compose-hot-reload.gif){width=350}

恭喜！您已看到 Compose 热重载 的实际效果。现在，您可以尝试更改文本、图像、格式、UI 结构等内容，无需在每次更改后重新启动 desktop 运行配置。

## 获取帮助

如果您在使用 Compose 热重载 时遇到任何问题，请通过 [创建 GitHub Issue](https://github.com/JetBrains/compose-hot-reload/issues) 告诉我们。