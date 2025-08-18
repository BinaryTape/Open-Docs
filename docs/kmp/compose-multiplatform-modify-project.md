[//]: # (title: 修改项目)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 — 这两个 IDE 共享相同的核心功能性以及 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是**使用共享逻辑和 UI 创建 Compose Multiplatform 应用**教程的第三部分。在继续之前，请确保你已完成了之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 — 这两个 IDE 共享相同的核心功能性以及 Kotlin Multiplatform 支持。这是使用共享逻辑和 UI 创建 Compose Multiplatform 应用教程的第一部分。创建你的 Compose Multiplatform 应用 探索可组合代码 修改项目 创建你自己的应用程序">创建你的 Compose Multiplatform 应用</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="第二步"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 — 这两个 IDE 共享相同的核心功能性以及 Kotlin Multiplatform 支持。这是使用共享逻辑和 UI 创建 Compose Multiplatform 应用教程的第二部分。在继续之前，请确保你已完成了之前的步骤。创建你的 Compose Multiplatform 应用 探索可组合代码 修改项目 创建你自己的应用程序">探索可组合代码</Links><br/>
       <img src="icon-3.svg" width="20" alt="第三步"/> <strong>修改项目</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 创建你自己的应用程序<br/>
    </p>
</tldr>

让我们修改由 Kotlin Multiplatform 向导生成的代码，并在 `App` 可组合项中显示当前日期。为此，你将向项目添加一个新的依赖项，增强 UI，并在每个平台重新运行应用程序。

## 添加一个新依赖项

你可以使用平台特有的库以及[预期与实际声明](multiplatform-expect-actual.md)来获取日期。但我们建议你仅在没有可用的 Kotlin Multiplatform 库时才使用此方法。在这种情况下，你可以依赖于 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 库。

> 你可以在 [klibs.io](https://klibs.io/) 上探索适用于你的目标平台的 Kotlin Multiplatform 库，这是 JetBrains 提供的一项实验性的搜索服务，用于发现多平台库。
>
{style="tip"}

要使用 `kotlinx-datetime` 库：

1. 打开 `composeApp/build.gradle.kts` 文件，并将其添加为项目的依赖项。

    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%")
            }
            wasmJsMain.dependencies {
                implementation(npm("@js-joda/timezone", "2.22.0"))
            }
        }
    }
    
    ```

    * 主要依赖项已添加到配置公共代码源代码集的部分。
    * 为简单起见，版本号直接包含在内，而不是添加到版本目录。
    * 为了支持 Web 目标平台中的时区，所需的 npm 包引用已包含在 `wasmJsMain` 依赖项中。

2. 依赖项添加完成后，系统会提示你重新同步项目。点击“**同步 Gradle 变更**”按钮以同步 Gradle 文件： ![同步 Gradle 文件](gradle-sync.png){width=50}

3. 在“**终端**”工具窗口中，运行以下命令：

    ```shell
    ./gradlew kotlinUpgradeYarnLock
    ```

   此 Gradle 任务可确保 `yarn.lock` 文件已更新为最新依赖项版本。

## 增强用户界面

1. 打开 `composeApp/src/commonMain/kotlin/App.kt` 文件，并添加以下函数，该函数返回一个包含当前日期的字符串：

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```

2. 在同一文件中，修改 `App()` 可组合项，以包含调用此函数并显示结果的 `Text()` 可组合项：
   
    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var showContent by remember { mutableStateOf(false) }
            val greeting = remember { Greeting().greet() }
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "今天的日期是 ${todaysDate()}",
                    modifier = Modifier.padding(20.dp),
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                )
                Button(onClick = { showContent = !showContent }) {
                    Text("点击我！")
                }
                AnimatedVisibility(showContent) {
                    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Image(painterResource(Res.drawable.compose_multiplatform), null)
                        Text("Compose: $greeting")
                    }
                }
            }
        }
    }
    ```

3. 按照 IDE 的建议导入缺失的依赖项。请确保从 `kotlinx.datetime` 包导入 `todaysDate()` 函数的所有缺失依赖项，**不是** `kotlin.time`。

   ![未解析的引用](compose-unresolved-references.png)

4. 将 Web 应用从使用 `Element` 作为容器切换到使用具有外部指定 `id` 的 HTML 元素：

    1. 在 `composeApp/src/wasmJsMain/resources/index.html` 文件中，在 `<body>` 中添加一个命名元素：

        ```html
        <body>
        <div id="composeApplication" style="width:400px; height: 600px;"></div>
        </body>
        ```
    2. 在 `composeApp/src/wasmJsMain/kotlin/main.kt` 文件中，将 `ComposeViewport` 调用更改为 `String` 变体，指向你在 HTML 文件中指定的 ID：

        ```kotlin
        @OptIn(ExperimentalComposeUiApi::class)
        fun main() {
            ComposeViewport(viewportContainerId = "composeApplication") {
                App()
            }
        }
        ```

## 重新运行应用程序

你现在可以使用相同的运行配置在 Android、iOS、桌面和 Web 上重新运行应用程序：

<Tabs>
    <TabItem id="mobile-app" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="首个在 Android 和 iOS 上运行的 Compose Multiplatform 应用" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="桌面">
        <img src="first-compose-project-on-desktop-2.png" alt="首个在桌面平台运行的 Compose Multiplatform 应用" width="400"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="首个在 Web 平台运行的 Compose Multiplatform 应用" width="400"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage1).
>
{style="tip"}
-->

## 下一步

在本教程的下一部分，你将学习新的 Compose Multiplatform 概念，并从头开始创建你自己的应用程序。

**[继续下一部分](compose-multiplatform-new-project.md)**

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。 [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。