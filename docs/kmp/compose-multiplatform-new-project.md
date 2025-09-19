[//]: # (title: 创建你自己的应用程序)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中遵循它——这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是 **使用共享逻辑和 UI 创建 Compose Multiplatform 应用** 教程的最后一部分。在继续之前，请确保你已完成前述步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">创建你的 Compose Multiplatform 应用</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">探索可组合代码</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="Third step"/> <Links href="/kmp/compose-multiplatform-modify-project" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the third part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">修改项目</Links><br/>
       <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>创建你自己的应用程序</strong><br/>
    </p>
</tldr>

现在你已经探索并增强了向导创建的示例项目，你可以使用你已知的概念并引入一些新概念，从头开始创建你自己的应用程序。

你将创建一个“本地时间应用程序”，用户可以在其中输入其国家和城市，应用程序将显示该国家首都的时间。你的 Compose Multiplatform 应用的所有功能都将使用多平台库在公共代码中实现。它将在下拉菜单中加载并显示图片，并将使用事件、样式、主题、修饰符和布局。

在每个阶段，你都可以在所有三个平台（iOS、Android 和桌面）上运行应用程序，或者你可以专注于最适合你需求的特定平台。

> 你可以在我们的 [GitHub 版本库](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到项目的最终状态。
>
{style="note"}

## 奠定基础

要开始，请实现一个新的 `App` 可组合项：

1.  在 `composeApp/src/commonMain/kotlin` 中，打开 `App.kt` 文件并将代码替换为以下 `App` 可组合项：

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

    *   布局是一个包含两个可组合项的列。第一个是 `Text` 可组合项，第二个是 `Button`。
    *   这两个可组合项由单个共享状态链接，即 `timeAtLocation` 属性。`Text` 可组合项是此状态的观察者。
    *   `Button` 可组合项使用 `onClick` 事件处理程序改变状态。

2.  在 Android 和 iOS 上运行应用程序：

    ![New Compose Multiplatform app on Android and iOS](first-compose-project-on-android-ios-3.png){width=500}

    当你运行应用程序并点击按钮时，将显示硬编码的时间。

3.  在桌面上运行应用程序。它正常工作，但窗口明显过大，不适合 UI：

    ![New Compose Multiplatform app on desktop](first-compose-project-on-desktop-3.png){width=400}

4.  要解决此问题，在 `composeApp/src/jvmMain/kotlin` 中，按如下方式更新 `main.kt` 文件：

    ```kotlin
   fun main() = application {
       val state = rememberWindowState(
           size = DpSize(400.dp, 250.dp),
           position = WindowPosition(300.dp, 300.dp)
       )
       Window(
           title = "Local Time App",
           onCloseRequest = ::exitApplication,
           state = state,
           alwaysOnTop = true
       ) {
           App()
       }
   }
    ```

    在这里，你设置了窗口的标题，并使用 `WindowState` 类型为窗口提供屏幕上的初始大小和位置。

    > 要在桌面应用中实时查看你的更改，请使用 [Compose 热重载](compose-hot-reload.md)：
    > 1.  在 `main.kt` 文件中，点击边栏中的 **运行** 图标。
    > 2.  选择 **使用 Compose 热重载（Beta）运行 'composeApp [hotRunJvm]'**。
    > ![Run Compose Hot Reload from gutter](compose-hot-reload-gutter-run.png){width=350}
    >
    > 要查看应用自动更新，请保存任何修改的文件（<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>）。
    >
    > Compose 热重载目前处于 [Beta](https://kotlinlang.org/components-stability.html#stability-levels-explained) 阶段，因此其功能可能会发生变化。
    >
    {style="tip"}

5.  遵循 IDE 的指示导入缺失的依赖项。
6.  再次运行桌面应用程序。其外观应有所改善：

    ![Improved appearance of the Compose Multiplatform app on desktop](first-compose-project-on-desktop-4.png){width=350}

<!--
   ### Compose Hot Reload demo {initial-collapse-state="collapsed" collapsible="true"}

   ![Compose Hot Reload](compose-hot-reload-resize.gif)
-->

## 支持用户输入

现在让用户输入城市名称以查看该位置的时间。实现此目的的最简单方法是添加一个 `TextField` 可组合项：

1.  将 `App` 的当前实现替换为以下内容：

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(timeAtLocation)
                TextField(value = location, onValueChange = { location = it })
                Button(onClick = { timeAtLocation = "13:30" }) {
                    Text("Show Time At Location")
                }
            }
        }
    }
    ```

    新代码添加了 `TextField` 和 `location` 属性。当用户在文本字段中输入时，属性的值会使用 `onValueChange` 事件处理程序逐渐更新。

2.  遵循 IDE 的指示导入缺失的依赖项。
3.  在你所面向的每个平台上运行应用程序：

<Tabs>
    <TabItem id="mobile-user-input" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-4.png" alt="User input in the Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-user-input" title="桌面">
        <img src="first-compose-project-on-desktop-5.png" alt="User input in the Compose Multiplatform app on desktop" width="350"/>
    </TabItem>
</Tabs>

## 计算时间

下一步是使用给定输入计算时间。为此，请创建 `currentTimeAt()` 函数：

1.  返回 `App.kt` 文件并添加以下函数：

    ```kotlin
    fun currentTimeAt(location: String): String? {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        return try {
            val time = Clock.System.now()
            val zone = TimeZone.of(location)
            val localTime = time.toLocalDateTime(zone).time
            "The time in $location is ${localTime.formatted()}"
        } catch (ex: IllegalTimeZoneException) {
            null
        }
    }
    ```

    此函数类似于你之前创建的 `todaysDate()`，后者已不再需要。

2.  遵循 IDE 的指示导入缺失的依赖项。
3.  调整你的 `App` 可组合项以调用 `currentTimeAt()`：

    ```kotlin
   @Composable
   @Preview
   fun App() {
   MaterialTheme {
       var location by remember { mutableStateOf("Europe/Paris") }
       var timeAtLocation by remember { mutableStateOf("No location selected") }
   
       Column(
           modifier = Modifier
               .safeContentPadding()
               .fillMaxSize()
           ) {
               Text(timeAtLocation)
               TextField(value = location, onValueChange = { location = it })
               Button(onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" }) {
                   Text("Show Time At Location")
               }
           }
       }
   }
    ```

4.  在 `wasmJsMain/kotlin/main.kt` 文件中，在 `main()` 函数之前添加以下代码以初始化 Web 的时区支持：

    ```kotlin
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    ```

5.  再次运行应用程序并输入有效的时区。
6.  点击按钮。你应该会看到正确的时间：

<Tabs>
    <TabItem id="mobile-time-display" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-5.png" alt="Time display in the Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-time-display" title="桌面">
        <img src="first-compose-project-on-desktop-6.png" alt="Time display in the Compose Multiplatform app on desktop" width="350"/>
    </TabItem>
</Tabs>

## 改进样式

应用程序正在工作，但其外观存在问题。可组合项的间距可以更好，并且时间消息可以更突出地显示。

1.  为了解决这些问题，请使用以下版本的 `App` 可组合项：

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            var location by remember { mutableStateOf("Europe/Paris") }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
   
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                TextField(
                    value = location,
                    onValueChange = { location = it },
                    modifier = Modifier.padding(top = 10.dp)
                )
                Button(
                    onClick = { timeAtLocation = currentTimeAt(location) ?: "Invalid Location" },
                    modifier = Modifier.padding(top = 10.dp)
                ) {
                    Text("Show Time")
                }
            }
        }
    }
    ```

    *   `modifier` 形参在 `Column` 周围以及 `Button` 和 `TextField` 的顶部添加了内边距。
    *   `Text` 可组合项填充可用的水平空间并居中其内容。
    *   `style` 形参自定义了 `Text` 的外观。

2.  遵循 IDE 的指示导入缺失的依赖项。
    对于 `Alignment`，请使用 `androidx.compose.ui` 版本。

3.  运行应用程序以查看外观如何改善：

<Tabs>
    <TabItem id="mobile-improved-style" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-6.png" alt="Improved style of the Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-improved-style" title="桌面">
        <img src="first-compose-project-on-desktop-7.png" alt="Improved style of the Compose Multiplatform app on desktop" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage2).
>
{style="tip"}
-->

## 重构设计

应用程序可以工作，但它容易出现拼写错误。例如，如果用户输入“Franse”而不是“France”，应用程序将无法处理该输入。最好要求用户从预定义列表中选择国家。

1.  为了实现这一点，请更改 `App` 可组合项中的设计：

    ```kotlin
    data class Country(val name: String, val zone: TimeZone)
    
    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"
    
        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time
    
        return "The time in $location is ${localTime.formatted()}"
    }
    
    fun countries() = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo")),
        Country("France", TimeZone.of("Europe/Paris")),
        Country("Mexico", TimeZone.of("America/Mexico_City")),
        Country("Indonesia", TimeZone.of("Asia/Jakarta")),
        Country("Egypt", TimeZone.of("Africa/Cairo")),
    )
    
    @Composable
    @Preview
    fun App(countries: List<Country> = countries()) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }
    
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries().forEach { (name, zone) ->
                            DropdownMenuItem(
                                text = {   Text(name)},
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }
    
                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```

    *   有一个 `Country` 类型，由名称和时区组成。
    *   `currentTimeAt()` 函数将 `TimeZone` 作为其第二个形参。
    *   `App` 现在需要一个国家列表作为形参。`countries()` 函数提供此列表。
    *   `DropdownMenu` 已替换 `TextField`。`showCountries` 属性的值决定了 `DropdownMenu` 的可见性。每个国家都有一个 `DropdownMenuItem`。

2.  遵循 IDE 的指示导入缺失的依赖项。
3.  运行应用程序以查看重新设计版本：

<Tabs>
    <TabItem id="mobile-country-list" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-7.png" alt="The country list in the Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-country-list" title="桌面">
        <img src="first-compose-project-on-desktop-8.png" alt="The country list in the Compose Multiplatform app on desktop" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage3).
>
{style="tip"}
-->

> 你可以使用依赖注入框架，例如 [Koin](https://insert-koin.io/)，进一步改进设计，以构建并注入位置表。如果数据存储在外部，你可以使用 [Ktor](https://ktor.io/docs/create-client.html) 库通过网络获取数据，或者使用 [SQLDelight](https://github.com/cashapp/sqldelight) 库从数据库获取数据。
>
{style="note"}

## 引入图片

国家名称列表有效，但视觉上不吸引人。你可以通过用国旗图片替换名称来改进它。

Compose Multiplatform 提供了一个库，用于通过公共代码跨所有平台访问资源。Kotlin Multiplatform 向导已经添加并配置了此库，因此你可以开始加载资源而无需修改构建文件。

为了在你的项目中支持图片，你需要下载图片文件，将它们存储在正确的目录中，并添加代码来加载和显示它们：

1.  使用外部资源，例如 [Flag CDN](https://flagcdn.com/)，下载与你已创建的国家列表相匹配的国旗。在这种情况下，它们是 [Japan](https://flagcdn.com/w320/jp.png)、[France](https://flagcdn.com/w320/fr.png)、[Mexico](https://flagcdn.com/w320/mx.png)、[Indonesia](https://flagcdn.com/w320/id.png) 和 [Egypt](https://flagcdn.com/w320/eg.png)。

2.  将图片移动到 `composeApp/src/commonMain/composeResources/drawable` 目录，以便所有平台都可使用相同的国旗：

    ![Compose Multiplatform resources project structure](compose-resources-project-structure.png){width=300}

3.  构建或运行应用程序以生成包含已添加资源访问器的 `Res` 类。

4.  更新 `commonMain/kotlin/.../App.kt` 文件中的代码以支持图片：

    ```kotlin
    import compose.project.demo.generated.resources.eg
    import compose.project.demo.generated.resources.fr
    import compose.project.demo.generated.resources.id
    import compose.project.demo.generated.resources.jp
    import compose.project.demo.generated.resources.mx
   
    data class Country(val name: String, val zone: TimeZone, val image: DrawableResource)

    fun currentTimeAt(location: String, zone: TimeZone): String {
        fun LocalTime.formatted() = "$hour:$minute:$second"

        val time = Clock.System.now()
        val localTime = time.toLocalDateTime(zone).time

        return "The time in $location is ${localTime.formatted()}"
    }

    val defaultCountries = listOf(
        Country("Japan", TimeZone.of("Asia/Tokyo"), Res.drawable.jp),
        Country("France", TimeZone.of("Europe/Paris"), Res.drawable.fr),
        Country("Mexico", TimeZone.of("America/Mexico_City"), Res.drawable.mx),
        Country("Indonesia", TimeZone.of("Asia/Jakarta"), Res.drawable.id),
        Country("Egypt", TimeZone.of("Africa/Cairo"), Res.drawable.eg)
    )

    @Composable
    @Preview
    fun App(countries: List<Country> = defaultCountries) {
        MaterialTheme {
            var showCountries by remember { mutableStateOf(false) }
            var timeAtLocation by remember { mutableStateOf("No location selected") }

            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
            ) {
                Text(
                    timeAtLocation,
                    style = TextStyle(fontSize = 20.sp),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().align(Alignment.CenterHorizontally)
                )
                Row(modifier = Modifier.padding(start = 20.dp, top = 10.dp)) {
                    DropdownMenu(
                        expanded = showCountries,
                        onDismissRequest = { showCountries = false }
                    ) {
                        countries.forEach { (name, zone, image) ->
                            DropdownMenuItem(
                                text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                    Image(
                                        painterResource(image),
                                        modifier = Modifier.size(50.dp).padding(end = 10.dp),
                                        contentDescription = "$name flag"
                                    )
                                    Text(name)
                                } },
                                onClick = {
                                    timeAtLocation = currentTimeAt(name, zone)
                                    showCountries = false
                                }
                            )
                        }
                    }
                }

                Button(modifier = Modifier.padding(start = 20.dp, top = 10.dp),
                    onClick = { showCountries = !showCountries }) {
                    Text("Select Location")
                }
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true"  collapsed-title="data class Country(val name: String, val zone: TimeZone, val image: DrawableResource)"}

    *   `Country` 类型存储相关图片的路径。
    *   传递给 `App` 的国家列表包含这些路径。
    *   `App` 在每个 `DropdownMenuItem` 中显示一个 `Image`，后跟一个包含国家名称的 `Text` 可组合项。
    *   每个 `Image` 都需要一个 `Painter` 对象来获取数据。

5.  遵循 IDE 的指示导入缺失的依赖项。
6.  运行应用程序以查看新行为：

<Tabs>
    <TabItem id="mobile-flags" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-8.png" alt="The country flags in the Compose Multiplatform app on Android and iOS" width="500"/>
    </TabItem>
    <TabItem id="desktop-flags" title="桌面">
        <img src="first-compose-project-on-desktop-9.png" alt="The country flags in the Compose Multiplatform app on desktop" width="350"/>
    </TabItem>
</Tabs>

> 你可以在我们的 [GitHub 版本库](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到项目的最终状态。
>
{style="note"}

## 下一步

我们鼓励你进一步探索多平台开发并尝试更多项目：

*   [让你的 Android 应用跨平台](multiplatform-integrate-in-existing-app.md)
*   [使用 Ktor 和 SQLDelight 创建多平台应用](multiplatform-ktor-sqldelight.md)
*   [在 iOS 和 Android 之间共享业务逻辑，同时保持 UI 原生](multiplatform-create-first-app.md)
*   [使用 Kotlin/Wasm 创建 Compose Multiplatform 应用](https://kotlinlang.org/docs/wasm-get-started.html)
*   [查看精选示例项目列表](multiplatform-samples.md)

加入社区：

*   ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：给 [版本库](https://github.com/JetBrains/compose-multiplatform) 加星并贡献
*   ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
*   ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：订阅“kotlin-multiplatform”[标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
*   ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 频道**：订阅并观看关于 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的视频