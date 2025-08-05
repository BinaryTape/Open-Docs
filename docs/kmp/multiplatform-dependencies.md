[//]: # (title: 将依赖项添加到你的项目)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中遵循此教程 – 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>   
    <p>这是 **使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用程序** 教程的第三部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="multiplatform-create-first-app.md">创建你的 Kotlin Multiplatform 应用程序</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="multiplatform-update-ui.md">更新用户界面</a><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>添加依赖项</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多逻辑<br/>
        <img src="icon-5-todo.svg" width="20" alt="第五步"/> 结束你的项目<br/>
    </p>
</tldr>

你已经创建了你的第一个跨平台 Kotlin Multiplatform 项目！现在，我们来学习如何为第三方库添加依赖项，这对于构建成功的跨平台应用程序是必不可少的。

## 依赖项类型

你可以在 Kotlin Multiplatform 项目中使用两种类型的依赖项：

*   _多平台依赖项_。这些是支持多个目标并可在 `commonMain` 公共源代码集 中使用的多平台库。

    许多现代 Android 库已经支持多平台，例如 [Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/) 和 [Okio](https://square.github.io/okio/)。在 [klibs.io] 上查找更多多平台库，这是 JetBrains 提供的一项用于发现 Kotlin Multiplatform 库的实验性的搜索服务。

*   _原生依赖项_。这些是来自相关生态系统的常规库。在原生项目中，你通常会通过适用于 Android 的 Gradle 以及适用于 iOS 的 CocoaPods 或其他依赖项管理器来使用它们。

    当你使用共享模块时，通常当你想要使用诸如安全存储等平台 API 时，仍然需要原生依赖项。你可以将原生依赖项添加到原生源代码集 `androidMain` 和 `iosMain` 中。

对于这两种类型的依赖项，你都可以使用本地和外部版本库。

## 添加多平台依赖项

> 如果你有 Android 应用开发经验，添加多平台依赖项与在常规 Android 项目中添加 Gradle 依赖项类似。唯一的区别是，你需要指定源代码集。
>
{style="tip"}

我们回到应用程序，让问候语更具节日气氛。除了设备信息，添加一个函数来显示距离元旦的天数。`kotlinx-datetime` 库拥有完整的跨平台支持，是你在共享代码中处理日期最便捷的方式。

1.  打开 `shared` 目录中的 `build.gradle.kts` 文件。
2.  将以下依赖项和 Kotlin 时间选择加入项添加到 `commonMain` 源代码集依赖项中：

    ```kotlin
    kotlin {
        //... 
        sourceSets
            languageSettings.optIn("kotlin.time.ExperimentalTime")
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            } 
        }
    }
    ```

3.  点击 **Sync Gradle Changes** 按钮以同步 Gradle 文件： ![同步 Gradle 文件](gradle-sync.png){width=50}
4.  在 `shared/src/commonMain/kotlin` 中，在 `Greeting.kt` 文件所在的项目目录中创建一个新文件 `NewYear.kt`。
5.  使用一个简短的函数更新该文件，该函数使用 `date-time` 日期算术计算从今天到新年的天数：
   
   ```kotlin
   import kotlinx.datetime.*
   import kotlin.time.Clock
   
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   
   fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   ```

6.  在 `Greeting.kt` 中，更新 `Greeting` 类以查看结果：
    
    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
   
        fun greet(): List<String> = buildList {
            add(if (Random.nextBoolean()) "Hi!" else "Hello!")
            add("Guess what this is! > ${platform.name.reversed()}!")
            add(daysPhrase())
        }
    }
    ```

7.  要查看结果，请从 IntelliJ IDEA 中重新运行你的 **composeApp** 和 **iosApp** 配置：

![已更新的带有外部依赖项的移动多平台应用程序](first-multiplatform-project-3.png){width=500}

## 下一步

本教程的下一部分中，你将向项目中添加更多依赖项和更复杂的逻辑。

**[继续下一部分](multiplatform-upgrade-app.md)**

### 另请参见

*   了解如何使用各种多平台依赖项：[Kotlin 库、Kotlin Multiplatform 库以及其他多平台项目](multiplatform-add-dependencies.md)。
*   了解如何[添加 Android 依赖项](multiplatform-android-dependencies.md)以及[在有或没有 CocoaPods 的情况下添加 iOS 依赖项](multiplatform-ios-dependencies.md)，以便在平台特有的源代码集 中使用。
*   查看在示例项目中[如何使用 Android 和 iOS 库](multiplatform-samples.md)的示例。

## 获取帮助

*   **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin 问题追踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。