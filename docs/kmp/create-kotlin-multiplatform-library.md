[//]: # (title: 创建你的 Kotlin Multiplatform 库 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 — 两款 IDE 都拥有相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，你将学习如何在 IntelliJ IDEA 中创建一个多平台库，将该库发布到本地 Maven 版本库，并将其添加为另一个项目中的依赖项。

本教程基于我们的 [multiplatform library template](https://github.com/Kotlin/multiplatform-library-template)，这是一个包含用于生成 Fibonacci 序列的函数的简单库。

## 设置环境

[安装所有必要的工具并将其更新到最新版本](quickstart.md)。

## 创建项目

1.  在 IntelliJ IDEA 中，选择 **File** | **New** | **Project from Version Control**。
2.  输入 [multiplatform library template project](https://github.com/Kotlin/multiplatform-library-template) 的 URL：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```

3.  点击 **Clone**。

## 检查项目结构

Kotlin Multiplatform 库模板项目为开发 Kotlin Multiplatform 库提供了基础结构。此模板有助于创建可在各种平台运行的库。

在模板项目中，`library` 作为核心模块，包含 Multiplatform 库的主要源代码和构建资源。

![Multiplatform library project structure](multiplatform-library-template-project.png){width=350}

`library` 模块的结构旨在同时容纳共享代码和平台特有的实现。以下是其主要源代码（`src`）内容的分解：

*   **`commonMain`**：包含所有目标平台共享的 Kotlin 代码。你可以在此处放置不依赖于任何平台特有 API 的代码。
*   **`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main`**：包含 Android、iOS、JVM 和 Linux 平台特有的代码。你可以在此处实现这些平台独有的功能。
*   **`commonTest`、`androidUnitTest`、`iosTest`、`jvmTest` 和 `linuxX64Test`**：分别包含共享 `commonMain` 代码的测试以及 Android、iOS、JVM 和 Linux 平台特有的测试。

让我们关注 `library` 中跨所有平台共享的代码。在 `src/commonMain/kotlin` 目录下，你可以找到 `CustomFibi.kt` 文件，其中包含定义 Fibonacci 序列生成器的 Kotlin Multiplatform 代码：

```kotlin
package io.github.kotlin.fibonacci

// Defines the function to generate the Fibonacci sequence
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

// Declares the expected values for `firstElement` and `secondElement`
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 和 `secondElement` 属性是平台特有代码可以实现的占位符。每个目标应通过在其各自的源代码集中使用 `actual` 关键字来提供实际值。

`expect` 声明与 `actual` 实现[匹配](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。这种机制在编写需要平台特有行为的跨平台代码时非常有用。

在这种情况下，多平台库模板包含了 `firstElement` 和 `secondElement` 属性的平台特有实现。`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main` 目录包含为这些属性提供值的 `actual` 声明。

例如，以下是 `androidMain/kotlin/fibiprops.android.kt` 中包含的 Android 实现：

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

其他平台遵循相同的模式，`firstElement` 和 `secondElement` 属性的值有所不同。

## 添加新平台

既然你已经熟悉了模板中共享代码和平台特有代码的工作方式，现在让我们通过添加对附加平台的支持来扩展项目。

使用 [`expect`/`actual` 机制](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)配置对 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 平台的支持。你可以为 `firstElement` 和 `secondElement` 属性实现平台特有功能。

### 将 Kotlin/Wasm 目标添加到你的项目

1.  在 `library/build.gradle.kts` 文件中，添加 Kotlin/Wasm 目标（`wasmJs`）和源代码集：

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
                    // Wasm-specific dependencies
                }
            }
        }
    }
    ```

2.  通过点击构建文件中出现的 **Sync Gradle Changes** 图标（![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}）来同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

### 为 Wasm 创建平台特有代码

添加 Wasm 目标后，你需要一个 Wasm 目录来存放 `firstElement` 和 `secondElement` 的平台特有实现：

1.  右键点击 `library/src` 目录，然后选择 **New | Directory**。
2.  从 **Gradle Source Sets** 列表中选择 **wasmJsMain/kotlin**。

    ![Gradle source sets list](gradle-source-sets-list.png){width=450}

3.  右键点击新创建的 `wasmJsMain/kotlin` 目录，然后选择 **New | Kotlin Class/File**。
4.  输入 **fibiprops.wasm** 作为文件名并选择 **File**。
5.  将以下代码添加到 `fibiprops.wasm.kt` 文件中：

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    此代码设置了 Wasm 特有实现，将 `firstElement` 的 `actual` 值定义为 `3`，将 `secondElement` 定义为 `5`。

### 构建项目

确保你的项目能用新平台正确编译：

1.  通过选择 **View** | **Tool Windows** | **Gradle** 打开 Gradle 工具窗口。
2.  在 **multiplatform-library-template** | **library** | **Tasks** | **build** 中，运行 **build** 任务。

    ![Gradle tool window](library-gradle-build-window-tasks.png){width=450}

    或者，在 `multiplatform-library-template` 根目录的终端中运行以下命令：

    ```bash
    ./gradlew build
    ```

你可以在 **Build** 工具窗口中看到成功的输出。

## 将你的库发布到本地 Maven 版本库

你的多平台库已准备好在本地发布，以便你可以在同一台机器上的其他项目中引用它。

要发布你的库，请使用 `maven-publish` Gradle 插件，如下所示：

1.  在 `library/build.gradle.kts` 文件中，找到 `plugins { }` 代码块并应用 `maven-publish` 插件：

    ```kotlin
       plugins {
           // ...
           // Add the following line:
           id("maven-publish")
       }
    ```

2.  找到 `mavenPublishing { }` 代码块并注释掉 `signAllPublications()` 方法，以表明该发布仅限于本地：

    ```kotlin
    mavenPublishing{
        // ...
        // Comment out the following method:
        // signAllPublications()
    }
    ```

3.  通过点击构建文件中出现的 **Sync Gradle Changes** 图标（![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}）来同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

4.  在 Gradle 工具窗口中，转到 **multiplatform-library-template** | **Tasks** | **publishing** 并运行 **publishToMavenLocal** Gradle 任务。

    ![Multiplatform library Gradle tool window](publish-maven-local-gradle-task.png){width=450}

    或者，在 `multiplatform-library-template` 根目录的终端中运行以下命令：

    ```bash
    ./gradlew publishToMavenLocal
    ```

你的库已发布到本地 Maven 版本库。

要定位你发布的库，请使用你的文件浏览器或终端，并导航到用户主目录中的 `.m2\repository\io\github\kotlin\library\1.0.0\`。

## 将你的库添加为另一个项目的依赖项

将 Multiplatform 库发布到本地 Maven 版本库后，你可以在同一台机器上的其他 Kotlin 项目中使用它。

在你的消费者项目的 `build.gradle.kts` 文件中，添加对已发布库的依赖项：

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

`repositories{}` 代码块告诉 Gradle 从本地 Maven 版本库解析库，并使其在共享代码中可用。

`implementation` 依赖项包含你的库的 group 和版本，这些是在其 `build.gradle.kts` 文件中指定的。

如果你要将其添加到另一个多平台项目，可以将其添加到共享或平台特有源代码集：

```kotlin
kotlin {
    //...
    sourceSets {
        // For all platforms
        val commonMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
        // Or for specific platforms
        val wasmJsMain by getting {
            dependencies {
                implementation("io.github.kotlin:library:1.0.0")
            }
        }
    }
}
```

同步消费者项目并开始使用你的库！

## 接下来

我们鼓励你进一步探索多平台开发：

*   [将你的库发布到 Maven Central](multiplatform-publish-libraries.md)
*   [查阅库作者指南](https://kotlinlang.org/docs/api-guidelines-introduction.html)

加入社区：

*   ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：给[版本库](https://github.com/JetBrains/compose-multiplatform)加星并贡献
*   ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
*   ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：订阅 ["kotlin-multiplatform" 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
*   ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube channel**：订阅并观看有关[Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的视频