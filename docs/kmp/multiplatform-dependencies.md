[//]: # (title: 向项目添加依赖项)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 —— 这两款 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>   
    <p>这是**使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用**教程的第三部分。在继续之前，请确保你已完成前述步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">创建你的 Kotlin Multiplatform 应用</Links><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <Links href="/kmp/multiplatform-update-ui" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">更新用户界面</Links><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>添加依赖项</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多逻辑<br/>
        <img src="icon-5-todo.svg" width="20" alt="第五步"/> 完成你的项目<br/>
    </p>
</tldr>

你已经创建了第一个跨平台 Kotlin Multiplatform 项目！现在，让我们学习如何向第三方库添加依赖项，这对于构建成功的跨平台应用程序至关重要。

## 依赖项类型

在 Kotlin Multiplatform 项目中，你可以使用两种类型的依赖项：

*   _Multiplatform 依赖项_。这些是支持多个目标平台并可在公共源代码集 `commonMain` 中使用的 Multiplatform 库。

    许多现代 Android 库已经支持 Multiplatform，例如 [Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/) 和 [Okio](https://square.github.io/okio/)。在 [klibs.io](https://klibs.io/) 上查找更多 Multiplatform 库，这是一个 JetBrains 提供的用于发现 Kotlin Multiplatform 库的实验性的搜索服务。

*   _原生依赖项_。这些是来自相关生态系统的常规库。在原生项目中，你通常使用 Gradle（针对 Android）以及 CocoaPods 或其他依赖项管理器（针对 iOS）来处理它们。

    当你使用共享模块时，通常当你想要使用平台 API（例如安全存储）时，仍然需要原生依赖项。你可以将原生依赖项添加到原生源代码集 `androidMain` 和 `iosMain` 中。

对于这两种类型的依赖项，你可以使用本地和外部版本库。

## 添加 Multiplatform 依赖项

> 如果你拥有 Android 应用开发经验，添加 Multiplatform 依赖项类似于在常规 Android 项目中添加 Gradle 依赖项。唯一的区别是你需要指定源代码集。
>
{style="tip"}

让我们回到应用，让问候语更喜庆一些。除了设备信息之外，再添加一个函数来显示距离元旦剩余的天数。`kotlinx-datetime` 库拥有完整的 Multiplatform 支持，是你在共享代码中处理日期最便捷的方式。

1.  打开位于 `shared` 目录下的 `build.gradle.kts` 文件。
2.  将以下依赖项和 Kotlin 时间 opt-in 添加到 `commonMain` 源代码集依赖项中：

    ```kotlin
    kotlin {
        //... 
        sourceSets {
            all { languageSettings.optIn("kotlin.time.ExperimentalTime") }
   
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            } 
        }
    }
    ```

3.  选择 **Build | Sync Project with Gradle Files** 菜单项，或点击构建脚本编辑器中的 **Sync Gradle Changes** 按钮来同步 Gradle 文件：![Synchronize Gradle files](gradle-sync.png){width=50}
4.  在 `shared/src/commonMain/.../greetingkmp` 目录上右键，选择 **New | Kotlin Class/File** 来创建新文件 `NewYear.kt`。
5.  使用一个简短函数更新该文件，该函数使用 `datetime` 日期算术计算从今天到新年的天数：
   
   ```kotlin
   @OptIn(ExperimentalTime::class)
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   
   fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   ```
6.  根据 IDE 的建议添加所有必要的 import。
7.  在 `Greeting.kt` 文件中，更新 `Greeting` 类以查看结果：
    
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

8.  要查看结果，请从 IntelliJ IDEA 重新运行你的 **composeApp** 和 **iosApp** 配置：

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## 下一步

在教程的下一部分，你将为项目添加更多依赖项和更复杂的逻辑。

**[继续下一部分](multiplatform-upgrade-app.md)**

### 另请参阅

*   了解如何使用所有类型的 Multiplatform 依赖项：[Kotlin 库、Kotlin Multiplatform 库以及其他 Multiplatform 项目](multiplatform-add-dependencies.md)。
*   学习如何[添加 Android 依赖项](multiplatform-android-dependencies.md)以及[使用或不使用 CocoaPods 添加 iOS 依赖项](multiplatform-ios-dependencies.md)以在平台特有的源代码集中使用。
*   查看在示例项目中[如何使用 Android 和 iOS 库](multiplatform-samples.md)的示例。

## 获取帮助

*   **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin 问题追踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。