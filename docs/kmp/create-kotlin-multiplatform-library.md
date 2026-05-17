[//]: # (title: 创建您的 Kotlin Multiplatform 库 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中参考本教程进行操作 – 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

在本教程中，您将学习如何在 IntelliJ IDEA 中创建多平台库，将该库发布到本地 Maven 仓库，并将其作为依赖项添加到另一个项目中。

本教程基于我们的 [多平台库模板](https://github.com/Kotlin/multiplatform-library-template)，这是一个包含生成斐波那契数列函数的简单库。

## 设置环境 

[安装所有必要的工具并将其更新到最新版本](quickstart.md)。

## 创建项目

1. 在 IntelliJ IDEA 中，选择 **File** | **New** | **Project from Version Control**。
2. 输入 [多平台库模板项目](https://github.com/Kotlin/multiplatform-library-template) 的 URL：

    ```text
    https://github.com/Kotlin/multiplatform-library-template
    ```
   
3. 点击 **Clone**。

## 检查项目结构

Kotlin Multiplatform 库模板项目为开发 Kotlin Multiplatform 库提供了基础结构。此模板有助于创建可以跨各种平台运行的库。

在模板项目中，`library` 作为核心模块，包含了该多平台库的主要源代码和构建资源。

![多平台库项目结构](multiplatform-library-template-project.png){width=350}

`library` 模块的结构旨在容纳共享代码以及特定平台的实现。以下是其源代码的详细说明：

* **`commonMain`**：包含在所有目标平台之间共享的 Kotlin 代码。这是您放置不依赖于任何平台特定 API 的代码的地方。
* **`androidMain`**、**`iosMain`**、**`jvmMain`** 和 **`linuxX64Main`**：包含特定于 Android、iOS、JVM 和 Linux 平台的代码。这是您实现这些平台特有功能的地方。
* **`commonTest`**、**`androidUnitTest`**、**`iosTest`**、**`jvmTest`** 和 **`linuxX64Test`**：分别包含针对共享 `commonMain` 代码的测试，以及特定于 Android、iOS、JVM 和 Linux 平台的测试。

让我们关注在所有平台之间共享的 `library` 代码。在 `src/commonMain/kotlin` 目录中，您可以找到 `CustomFibi.kt` 文件，其中的 Kotlin Multiplatform 代码定义了一个斐波那契数列生成器：

```kotlin
package io.github.kotlin.fibonacci

// 定义生成斐波那契数列的函数
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

// 声明 firstElement 和 secondElement 的预期值
expect val firstElement: Int
expect val secondElement: Int
```

`firstElement` 和 `secondElement` 属性是平台特定代码可以实现的占位符。每个目标都应通过在各自的源集中使用 `actual` 关键字来提供实际值。

`expect` 声明与 `actual` 实现相[匹配](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties)。当编写需要平台特定行为的跨平台代码时，这种机制非常有用。 

在这种情况下，多平台库模板包含了 `firstElement` 和 `secondElement` 属性的平台特定实现。`androidMain`、`iosMain`、`jvmMain` 和 `linuxX64Main` 目录包含为这些属性提供值的 `actual` 声明。

例如，以下是包含在 `androidMain/kotlin/fibiprops.android.kt` 中的 Android 实现：

```kotlin
package io.github.kotlin.fibonacci

actual val firstElement: Int = 1
actual val secondElement: Int = 2
```

其他平台遵循相同的模式，只是 `firstElement` 和 `secondElement` 属性的值有所变化。

## 添加新平台

现在您已经熟悉了共享代码和平台特定代码在模板中是如何工作的，让我们通过添加对额外平台的支持来扩展项目。

通过使用 [expect / actual 机制](multiplatform-connect-to-apis.md#expected-and-actual-functions-and-properties) 配置对 [Kotlin/Wasm](https://kotlinlang.org/docs/wasm-overview.html) 平台的支持，然后为 `firstElement` 和 `secondElement` 属性实现平台特定的功能。

### 将 Kotlin/Wasm 目标添加到您的项目

1. 在 `library/build.gradle.kts` 文件中，添加 Kotlin/Wasm 目标 (`wasmJs`) 和源集：

    ```kotlin
    kotlin {
        // ...
        @OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
        wasmJs {
            browser()
            binaries.executable()
        }
        // ...
        sourceSets {
            //...
            wasmJsMain.dependencies {
                // Wasm 特有的依赖项
            }
        }
    }
    ```

2. 点击构建文件中显示的 **Sync Gradle Changes** 图标 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

### 为 Wasm 创建平台特定代码

添加 Wasm 目标后，您需要一个 Wasm 目录来存放 `firstElement` 和 `secondElement` 的平台特定实现：

1. 右键点击 `library/src` 目录，然后选择 **New | Directory**。 
2. 从 **Gradle Source Sets** 列表中选择 **wasmJsMain/kotlin**。

   ![Gradle 源集列表](gradle-source-sets-list.png){width=450}

3. 右键点击新建的 `wasmJsMain/kotlin` 目录，然后选择 **New | Kotlin Class/File**。 
4. 输入 **fibiprops.wasm** 作为文件名，并选择 **File**。
5. 将以下代码添加到 `fibiprops.wasm.kt` 文件中：

    ```kotlin
    package io.github.kotlin.fibonacci
    
    actual val firstElement: Int = 3
    actual val secondElement: Int = 5
    ```

    此代码设置了 Wasm 特有的实现，将 `firstElement` 的 `actual` 值定义为 `3`，将 `secondElement` 定义为 `5`。

### 构建项目

确保您的项目在新平台上能够正确编译：

1. 通过选择 **View** | **Tool Windows** | **Gradle** 打开 Gradle 工具窗口。
2. 在 **multiplatform-library-template** | **library** | **Tasks** | **build** 中，运行 **build** 任务。

   ![Gradle 工具窗口](library-gradle-build-window-tasks.png){width=450}

   或者，在终端中从 `multiplatform-library-template` 根目录运行以下命令：

   ```bash
   ./gradlew build
   ```

您可以在 **Build** 工具窗口中看到成功的输出。 

## 将库发布到本地 Maven 仓库

您的多平台库已准备好进行本地发布，以便您可以在同一台机器上的其他项目中使用它。

要发布您的库，请按以下步骤使用 [`maven-publish`](https://docs.gradle.org/current/userguide/publishing_maven.html) Gradle 插件：

1. 在 `library/build.gradle.kts` 文件中，找到 `plugins { }` 块并应用 `maven-publish` 插件：

   ```kotlin
      plugins {
          // ...
          // 添加以下行：
          id("maven-publish")
      }
   ```

2. 找到 `mavenPublishing {}` 块并注释掉 `signAllPublications()` 调用，以表明发布仅限本地：

    ```kotlin
    mavenPublishing {
        // ...
        // 注释掉以下调用：
        // signAllPublications()
    }
    ```

3. 点击构建文件中显示的 **Sync Gradle Changes** 图标 (![Gradle sync icon](gradle-sync-icon.png){width=30}{type="joined"}) 同步 Gradle 文件。或者，点击 Gradle 工具窗口中的刷新按钮。

4. 在 Gradle 工具窗口中，转到 **multiplatform-library-template** | **Tasks** | **publishing** 并运行 **publishToMavenLocal** Gradle 任务。

   ![多平台库 Gradle 工具窗口](publish-maven-local-gradle-task.png){width=450}

   或者，在终端中从 `multiplatform-library-template` 根目录运行以下命令：

   ```bash
   ./gradlew publishToMavenLocal
   ```

您的库已发布到本地 Maven 仓库。 

要找到已发布的构件，请使用文件浏览器或终端并导航到 `~\.m2\repository\io\github\kotlin\library\1.0.0\` 目录。

## 将库作为依赖项添加到另一个项目中

将多平台库发布到本地 Maven 仓库后，您就可以在同一台机器上的其他 Kotlin 项目中使用它。

在消费者项目的 `settings.gradle.kts` 文件中，添加在本地仓库中查找软件包的选项： 

```kotlin
dependencyResolutionManagement {
    repositories {
        // ...
        mavenLocal()
    }
}
```

在一个模块的 `build.gradle.kts` 文件中，添加对已发布库的依赖项。如果您是将其添加到另一个多平台项目中，可以将其添加到共享源集或特定平台的源集中：

```kotlin
kotlin {
    //...
    sourceSets {
        // 对于所有平台
        commonMain.dependencies {
                implementation("io.github.kotlin:library:1.0.0")
        }
        // 或对于特定平台
        wasmJsMain.dependencies {
            implementation("io.github.kotlin:library:1.0.0")
        }
    }
}
```

`implementation()` 调用接受您库的 `build.gradle.kts` 文件中指定的 group、name 和 version。

同步消费者项目并开始使用您的库，例如：

```kotlin
import io.github.kotlin.fibonacci.generateFibi

val seq = generateFibi()
println(seq.elementAt(3))
```

## 后续步骤

我们鼓励您进一步探索多平台开发：

* [将您的库发布到 Maven Central](multiplatform-publish-libraries-to-maven.md)
* [查看库作者指南](https://kotlinlang.org/docs/api-guidelines-introduction.html)

加入社区：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：收藏 [该仓库](https://github.com/JetBrains/compose-multiplatform) 并做出贡献
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：订阅 ["kotlin-multiplatform" 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 频道**：订阅并观看关于 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的视频