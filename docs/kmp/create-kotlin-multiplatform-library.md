[//]: # (title: 创建您的 Kotlin Multiplatform library – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中学习 – 这两个 IDE 都具有相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，您将学习如何在 IntelliJ IDEA 中创建多平台 library，将该 library 发布到本地 Maven 仓库，并将其作为依赖项添加到另一个项目中。

本教程基于我们的 [multiplatform library 模板](https://github.com/Kotlin/multiplatform-library-template)，这是一个包含用于生成 Fibonacci 数列的函数的简单 library。

## 设置环境

[安装所有必要的工具并将其更新到最新版本](quickstart.md)。

## 创建项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project from Version Control**。
2. 输入 [multiplatform library 模板项目](https://github.com/Kotlin/multiplatform-library-template) 的 URL：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. 点击 **Clone**。

## 检查项目结构

Kotlin Multiplatform library 模板项目为开发 Kotlin Multiplatform library 提供了基础结构。此模板有助于创建可在各种平台运行的 library。

在模板项目中，`library` 作为核心模块，包含 Multiplatform library 的主要源代码和构建资源。

![Multiplatform library project structure](multiplatform-library-template-project.png){width=350}

`library` 模块的结构旨在容纳共享代码以及平台特有的实现。以下是其主要源代码 (`src`) 内容的详细说明：

* **`commonMain`：** 包含所有目标平台共用的 Kotlin 代码。这是您放置不依赖于任何平台特有 API 的代码的位置。
* **`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main`：** 包含 Android、iOS、JVM 和 Linux 平台特有的代码。这是您实现这些平台独有功能的位置。
* **`commonTest`、`androidUnitTest`、`iosTest`、`jvmTest` 和 `linuxX64Test`：** 分别包含共享 `commonMain` 代码的测试以及 Android、iOS、JVM 和 Linux 平台特有的测试。

让我们重点关注所有平台共享的 `library` 代码。在 `src/commonMain/kotlin` 目录中，您可以找到 `CustomFibi.kt` 文件，其中包含定义 Fibonacci 数列生成器的 Kotlin Multiplatform 代码：

```kotlin
package io.github.kotlin.fibonacci

// 定义生成 Fibonacci 数列的函数
fun generateFibi() = sequence {
    var a = firstElement
    yield(a)
    
    var b = secondElement
    yield(b)
    
    while (true) {
        val c = a + b
        yield(c)
        a = b
        b = c
    }
}

// 声明 `firstElement` 和 `secondElement` 的预期值
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 和 `secondElement` 属性是平台特有代码可以实现的占位符。每个目标平台都应通过在其各自的源代码集中使用 `actual` 关键字来提供实际值。

`expect` 声明与 `actual` 实现[匹配](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。这种机制在编写需要平台特有行为的跨平台代码时非常有用。

在这种情况下，多平台 library 模板包含 `firstElement` 和 `secondElement` 属性的平台特有实现。`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main` 目录包含为这些属性提供值的 `actual` 声明。

例如，以下是 `androidMain/kotlin/fibiprops.android.kt` 中包含的 Android 实现：

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

其他平台遵循相同的模式，`firstElement` 和 `secondElement` 属性的值有所不同。

## 添加新平台

既然您已熟悉共享代码和平台特有代码在模板中的工作方式，那么让我们通过添加对其他平台的支持来扩展项目。

使用 [`expect`/`actual` 机制](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties) 配置对 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 平台的支持。您可以为 `firstElement` 和 `secondElement` 属性实现平台特有的功能。

### 将 Kotlin/Wasm 目标添加到您的项目

1. 在 `library/build.gradle.kts` 文件中，添加 Kotlin/Wasm 目标 (`wasmJs`) 和源代码集：

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            // ...
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            val wasmJsMain by getting {
                dependencies {
                    // Wasm 特有的依赖项
                }
            }
        }
    }
    ```

2. 点击构建文件中出现的 **Sync Gradle Changes** 图标 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 以同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

### 为 Wasm 创建平台特有代码

添加 Wasm 目标后，您需要一个 Wasm 目录来存放 `firstElement` 和 `secondElement` 的平台特有实现：

1. 右键点击 `library/src` 目录，然后选择 **New | Directory**。
2. 从 **Gradle Source Sets** 列表中选择 **wasmJsMain/kotlin**。

   ![Gradle source sets list](gradle-source-sets-list.png){width=450}

3. 右键点击新创建的 `wasmJsMain/kotlin` 目录，然后选择 **New | Kotlin Class/File**。
4. 输入 **fibiprops.wasm** 作为文件名，然后选择 **File**。
5. 将以下代码添加到 `fibiprops.wasm.kt` 文件中：

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    此代码设置了一个 Wasm 特有的实现，将 `firstElement` 的 `actual` 值定义为 `3`，将 `secondElement` 的 `actual` 值定义为 `5`。

### 构建项目

确保您的项目在新平台上正确编译：

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 Gradle 工具窗口。
2. 在 **multiplatform-library-template** | **library** | **Tasks** | **build** 中，运行 **build** 任务。

   ![Gradle tool window](library-gradle-build-window-tasks.png){width=450}

   或者，在 `multiplatform-library-template` 根目录的终端中运行以下命令：

   ```bash
   ./gradlew build
   ```

您可以在 **Build** 工具窗口中看到成功的输出。

## 将您的 library 发布到本地 Maven 仓库

您的多平台 library 已准备好进行本地发布，以便您可以在同一台机器上的其他项目中使用它。

要发布您的 library，请使用 [`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradle 插件，具体如下：

1. 在 `library/build.gradle.kts` 文件中，找到 `plugins { }` 代码块并应用 `maven-publish` 插件：

   ```kotlin
      plugins {
          // ...
          // 添加以下行：
          id("maven-publish")
      }
   ```

2. 找到 `mavenPublishing { }` 代码块并注释掉 `signAllPublications()` 方法，以表明该发布仅限本地：

    ```kotlin
    mavenPublishing{
        // ...
        // 注释掉以下方法：
        // signAllPublications()
    }
    ```

3. 点击构建文件中出现的 **Sync Gradle Changes** 图标 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 以同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

4. 在 Gradle 工具窗口中，转到 **multiplatform-library-template** | **Tasks** | **publishing** 并运行 **publishToMavenLocal** Gradle 任务。

   ![Multiplatform library Gradle tool window](publish-maven-local-gradle-task.png){width=450}

   或者，在 `multiplatform-library-template` 根目录的终端中运行以下命令：

   ```bash
   ./gradlew publishToMavenLocal
   ```

您的 library 已发布到本地 Maven 仓库。

要找到您已发布的 library，请使用文件资源管理器或终端导航到用户主目录中的 `.m2\repository\io\github\kotlin\library\1.0.0\`。

## 将您的 library 作为依赖项添加到另一个项目

将您的 Multiplatform library 发布到本地 Maven 仓库后，您可以在同一台机器上的其他 Kotlin 项目中使用它。

在您的消费者项目的 `build.gradle.kts` 文件中，添加对已发布 library 的依赖项：

```kotlin
repositories {
    // ...
    mavenLocal()
}

dependencies {
    // ...
    implementation("io.github.kotlin:library:1.0.0")
}
```

`repositories{}` 代码块告诉 Gradle 从本地 Maven 仓库解析 library，并使其在共享代码中可用。

`implementation` 依赖项由您的 library 的 group 和版本组成，这些信息在其 `build.gradle.kts` 文件中指定。

如果您将其添加到另一个多平台项目，您可以将其添加到共享或平台特有的源代码集：

```kotlin
kotlin {
    //...
    sourceSets {
        // 适用于所有平台
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // 或适用于特定平台
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

同步消费者项目并开始使用您的 library！

## 后续内容

我们鼓励您进一步探索多平台开发：

* [将您的 library 发布到 Maven Central](multiplatform-publish-libraries.md)
* [查看 library 作者指南](https://kotlinlang.org/docs/api-guidelines-introduction.html)

加入社区：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：给 [版本库](https://github.com/JetBrains/compose-multiplatform) 点星并贡献代码
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：订阅 [“kotlin-multiplatform” 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 频道**：订阅并观看有关 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的视频