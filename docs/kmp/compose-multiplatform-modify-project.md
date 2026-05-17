[//]: # (title: 修改项目)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习 —— 这两款 IDE 拥有相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是**使用共享逻辑和 UI 创建 Compose Multiplatform 应用**教程的第三部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习 —— 这两款 IDE 拥有相同的核心功能和 Kotlin Multiplatform 支持。这是使用共享逻辑和 UI 创建 Compose Multiplatform 应用教程的第一部分。创建你的 Compose Multiplatform 应用、探索可组合代码、修改项目、创建你自己的应用程序">创建你的 Compose Multiplatform 应用</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="第二步"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习 —— 这两款 IDE 拥有相同的核心功能和 Kotlin Multiplatform 支持。这是使用共享逻辑和 UI 创建 Compose Multiplatform 应用教程的第二部分。在继续之前，请确保你已完成之前的步骤。创建你的 Compose Multiplatform 应用、探索可组合代码、修改项目、创建你自己的应用程序">探索可组合代码</Links><br/>
       <img src="icon-3.svg" width="20" alt="第三步"/> <strong>修改项目</strong><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 创建你自己的应用程序<br/>
    </p>
</tldr>

让我们修改由 Kotlin Multiplatform 向导生成的代码，并在 `App` 可组合项中显示当前日期。为此，你将向项目添加一个新的依赖项，改进 UI，并在每个平台上重新运行应用程序。

## 添加新依赖项

你可以使用特定于平台的库和[预期声明与实际声明](multiplatform-expect-actual.md)来获取日期。但我们建议仅在没有可用的 Kotlin Multiplatform 库时才使用这种方法。在这种情况下，你可以依赖 [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) 库。

> 你可以在 [klibs.io](https://klibs.io/) 上探索适用于你目标平台的 Kotlin Multiplatform 库，这是 JetBrains 提供的用于发现多平台库的实验性搜索服务。
>
{style="tip"}

要使用 `kotlinx-datetime` 库：

1. 打开 `gradle/libs.versions.toml` 文件并将 `kotlinx-datetime` 依赖项添加到版本编目中：

    ```text
    [versions]
    kotlinx-datetime = "0.8.0"
    
    [libraries]
    kotlinx-datetime = { module = "org.jetbrains.kotlinx:kotlinx-datetime", version.ref = "kotlinx-datetime" }
    ```

2. 打开 `shared/build.gradle.kts` 文件，并在配置公共代码源集的区域添加对该库条目的引用：
      
    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation(libs.kotlinx.datetime)
            }
        }
    }
    
    ```
3. 对于 Web 目标，时区支持需要 `js-joda` 库。在 `webApp/build.gradle.kts` 文件中添加对 `js-joda` npm 软件包的引用：

    ```kotlin
    kotlin {
        // ...
        sourceSets {
            // ...
            commonMain.dependencies {
                // ...
                implementation(npm("@js-joda/timezone", "2.25.1"))
            }
        }
    }
    
    ```

    将依赖项添加到 `webMain` 源集会使该库对 `wasmJs` 和 `js` 目标均可用。

4. 添加依赖项后，接受 IDE 的建议以同步 Gradle 配置，或按两次 **Shift** 键并执行 **Sync Project with Gradle Files** 命令。

5. 在 **Terminal** 工具窗口中，运行以下命令以确保 `yarn.lock` 文件已更新为最新的依赖项版本：

    ```shell
    ./gradlew kotlinUpgradeYarnLock kotlinWasmUpgradeYarnLock
    ```
 
6. 在 `webApp/src/webMain/kotlin/.../main.kt` 文件中，使用 `@JsModule` 注解导入 `js-joda` npm 软件包： 

    ```kotlin
    import androidx.compose.ui.ExperimentalComposeUiApi
    import androidx.compose.ui.window.ComposeViewport
    import kotlin.js.ExperimentalWasmJsInterop
    import kotlin.js.JsModule

    @OptIn(ExperimentalWasmJsInterop::class)
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    
    @OptIn(ExperimentalComposeUiApi::class)
    fun main() {
        ComposeViewport {
            App()
        }
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title='@JsModule("@js-joda/timezone")'}

> 将项目提交到版本控制时，请包含在 `kotlin-js-store` 目录中生成的 `yarn.lock` 文件。这有助于确保在任何构建项目的地方都使用相同版本的 JavaScript 依赖项。
> 
{style="note"}

## 改进用户界面

1. 打开 `shared/src/commonMain/kotlin/App.kt` 文件，在 `App()` 可组合项之后添加以下函数，该函数返回一个包含当前日期的字符串：

   ```kotlin
   fun todaysDate(): String {
       fun LocalDateTime.format() = toString().substringBefore('T')

       val now = Clock.System.now()
       val zone = TimeZone.currentSystemDefault()
       return now.toLocalDateTime(zone).format()
   }
   ```
2. 添加 IDE 建议的导入。
   
   确保从 `kotlin.time` 导入 `Clock` 类，而**不是** `kotlinx.datetime`。 
3. 在同一文件中，修改 `App()` 可组合项以包含调用此函数并显示结果的 `Text()` 可组合项：
   
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
                    text = "Today's date is ${todaysDate()}",
                    modifier = Modifier.padding(20.dp),
                    fontSize = 24.sp,
                    textAlign = TextAlign.Center
                )
                Button(onClick = { showContent = !showContent }) {
                    Text("Click me!")
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

4. 按照 IDE 的建议导入缺失的依赖项。

   ![未解析的引用](compose-unresolved-references.png)

## 重新运行应用程序

你现在可以使用相同的运行配置针对 Android、iOS、桌面和 Web [重新运行应用程序](compose-multiplatform-create-first-app.md#run-your-application)：

<Tabs>
    <TabItem id="mobile-app" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-2.png" alt="Android 和 iOS 上的第一个 Compose Multiplatform 应用" width="500"/>
    </TabItem>
    <TabItem id="desktop-app" title="桌面">
        <img src="first-compose-project-on-desktop-2.png" alt="桌面上的第一个 Compose Multiplatform 应用" width="600"/>
    </TabItem>
    <TabItem id="web-app" title="Web">
        <img src="first-compose-project-on-web-2.png" alt="Web 上的第一个 Compose Multiplatform 应用" width="600"/>
    </TabItem>
</Tabs>

## 下一步

在教程的下一部分中，你将学习新的 Compose Multiplatform 概念，并从头开始创建你自己的应用程序。

**[继续下一步](compose-multiplatform-new-project.md)**

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。