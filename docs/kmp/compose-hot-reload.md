[//]: # (title: Compose Hot Reload)

Compose Hot Reload 帮助你在开发 Compose Multiplatform 项目时，实时查看并尝试 UI 更改。
与标准的 [Compose previews](compose-previews.md)（适用于使用测试数据查看独立组件）不同，Compose Hot Reload 会直接将你的代码更改应用到运行中的应用程序。

捆绑的 Compose Hot Reload Gradle 插件需要 Kotlin 2.1.20+ 以及与 Java 21 或更早版本兼容的 JVM 目标。
为了使用 Compose Hot Reload 的完整功能，我们建议安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)，该插件适用于 IntelliJ IDEA 2025.2.2 及以上版本，以及 Android Studio Otter 2025.2.1 及以上版本。

在我们探索为其他目标提供支持的同时，你已经可以利用桌面应用作为沙盒，在不中断流程的情况下快速尝试公共代码中的 UI 更改。

<img src="KotlinConf-hot-reload.animated.gif" alt="Compose Hot Reload" width="600" preview-src="KotlinConf-hot-reload.png"/>

## 将 Compose Hot Reload 添加到你的项目

可以通过以下两种方式添加 Compose Hot Reload：

* [在 IntelliJ IDEA 或 Android Studio 中从头创建项目](#from-scratch)
* [向现有项目添加 Gradle 插件](#to-an-existing-project)

### 从头创建

本节将引导你在 IntelliJ IDEA 和 Android Studio 中创建一个带有桌面目标的多平台项目。项目创建后，系统会自动添加 Compose Hot Reload。

1. 在[快速入门指南](quickstart.md)中，按照说明[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)。
2. 在 IDE 中，选择 **File** | **New** | **Project**。
3. 在左侧面板中，选择 **Kotlin Multiplatform**。
4. 在 **New Project** 窗口中指定 **Name**、**Group** 和 **Artifact** 字段。
5. 选择 **Desktop** 目标并点击 **Create**。
   ![使用桌面目标创建多平台项目](create-desktop-project.png){width=600 style="block"}

### 向现有项目添加

从 Compose Multiplatform 1.10.0 开始，Compose Hot Reload 插件已[捆绑](whats-new-compose-110.md#compose-hot-reload-integration)，并对所有包含**桌面目标**的项目默认启用。

如果你的项目已经包含桌面目标，你可以升级到 Compose Multiplatform 1.10.0 或更高版本，即可开箱即用体验 Compose Hot Reload 功能。

虽然它是默认启用的，但你仍然可以显式声明 Compose Hot Reload 插件以使用特定的旧版本。

#### 早期版本的 Compose Multiplatform {initial-collapse-state="collapsed" collapsible="true"}

对于使用 1.10.0 之前版本的 Compose Multiplatform 的多平台项目，你必须配置桌面目标，然后显式添加 Compose Hot Reload 插件。以下步骤以[使用共享逻辑和 UI 创建应用](compose-multiplatform-create-first-app.md)教程中的项目作为参考。

1. 引入桌面目标：创建 `jvmMain` 目录，定义 `main()` 函数，并提供 `actual` 实现。
   如果你的项目已经包含桌面目标，可以跳过此步骤。
   参考示例请参阅[添加 JVM 入口点](migrate-from-android.md#optional-add-a-jvm-entry-point)。
 
2. 使用最新版本的 Compose Hot Reload 更新版本目录（参见 [Releases](https://github.com/JetBrains/compose-hot-reload/releases)）。
   在 `gradle/libs.versions.toml` 中添加以下代码：
   ```text
   composeHotReload = { id = "org.jetbrains.compose.hot-reload", version.ref = "composeHotReload"}
   ```

   > 要了解更多关于如何使用版本目录在整个项目中集中管理依赖项的信息，请参阅我们的 [Gradle 最佳做法](https://kotlinlang.org/gradle-best-practices.html)。

3. 在父项目的 `build.gradle.kts`（`ComposeDemo/build.gradle.kts`）中，将以下代码添加到 `plugins {}` 块：
   ```kotlin
   plugins {
       alias(libs.plugins.composeHotReload) apply false
   }
   ```
   这可以防止 Compose Hot Reload 插件在每个子项目中被多次加载。

4. 在包含多平台应用的子项目的 `build.gradle.kts`（`ComposeDemo/composeApp/build.gradle.kts`）中，将以下代码添加到 `plugins {}` 块：
   ```kotlin
   plugins { 
       alias(libs.plugins.composeHotReload)
   }
   ```

5. 你的项目必须运行在 [JetBrains Runtime](https://github.com/JetBrains/JetBrainsRuntime) (JBR) 上，这是一个支持增强型类重定义的 OpenJDK 分叉版本。Compose Hot Reload 可以为你的项目自动配置兼容的 JBR。

   > 最新的 JetBrains Runtime 仅支持 Java 21：如果你将 Compose Hot Reload 添加到仅与 Java 22 或更高版本兼容的项目中，运行该项目将导致链接错误。
   > 
   {style="warning"}

   要允许自动配置，请将以下 Gradle 插件添加到你的 `settings.gradle.kts` 文件中：

   ```kotlin
   plugins {
       id("org.gradle.toolchains.foojay-resolver-convention") version "%foojayResolverConventionVersion%"
   }
   ```

6. 点击 **Sync Gradle Changes** 按钮以同步 Gradle 文件： ![同步 Gradle 文件](gradle-sync.png){width=50}

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
   通过将 `alwaysOnTop` 变量设置为 `true`，生成的桌面应用将保持在所有窗口的最顶层，方便你编辑代码并实时查看更改。

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

4. 打开 `main.kt` 文件，点击装订区域中的 **Run** 图标。
   选择 **Run 'composeApp [jvm]' with Compose Hot Reload**。

    ![从装订区域运行 Compose Hot Reload](compose-hot-reload-gutter-run.png){width=350}

    ![桌面应用上的首次 Compose Hot Reload 运行](compose-hot-reload-hello.png){width=500}

5. 更新 `greet()` 函数返回的字符串，然后保存所有文件（<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>），即可看到桌面应用自动更新。

   ![Compose Hot Reload](compose-hot-reload.gif){width=350}

   或者，通过按下指定的快捷键或点击 **Reload UI** 按钮来显式触发热重载。
   你可以在 **Settings | Tools | Compose Hot Reload** 页面修改触发行为。

恭喜！你已经见证了 Compose Hot Reload 的实际效果。现在你可以尝试更改文本、图像、格式、UI 结构等，而无需在每次更改后都重新启动桌面运行配置。

## 获取帮助

如果你在使用 Compose Hot Reload 时遇到任何问题，请通过[创建 GitHub 问题](https://github.com/JetBrains/compose-hot-reload/issues)告知我们。