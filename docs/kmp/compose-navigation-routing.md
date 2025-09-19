[//]: # (title: 导航与路由)

导航是 UI 应用程序的关键组成部分，它允许用户在不同应用程序屏幕之间移动。
Compose Multiplatform 采用了 [Jetpack Compose 的导航方法](https://developer.android.com/guide/navigation/design#frameworks)。

## 设置

要使用 Navigation 库，请将以下依赖项添加到您的 `commonMain` 源代码集：

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

## 示例项目

要查看 Compose Multiplatform 导航库的实际应用，请查看 [nav_cupcake 项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)，
该项目由 [使用 Compose 在屏幕之间导航](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0)
Android codelab 转换而来。

与 Jetpack Compose 一样，要实现导航，您应该：
1. [列出](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50) 应包含在导航图中的路由。每个路由都必须是定义路径的唯一字符串。
2. [创建](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89) 一个 `NavHostController` 实例作为您的主要可组合属性来管理导航。
3. [将 `NavHost` 可组合项添加](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109) 到您的应用：
    1. 从您之前定义的路由列表中选择起始目标。
    2. 直接创建导航图（作为创建 `NavHost` 的一部分），或者使用 `NavController.createGraph()` 函数以编程方式创建。

每个返回栈条目（图中包含的每个导航路由）都实现了 `LifecycleOwner` 接口。
应用不同屏幕之间的切换会使其状态从 `RESUMED` 变为 `STARTED`，然后再变回。
`RESUMED` 也被称为“稳定状态”：当新屏幕准备就绪并激活时，导航被认为是完成的。
关于 Compose Multiplatform 中当前实现的详细信息，请参见 [生命周期](compose-lifecycle.md) 页面。

## Web 应用中的浏览器导航支持
<secondary-label ref="Experimental"/>

面向 Web 的 Compose Multiplatform 完全支持通用的 Navigation 库 API，
并且在此基础上允许您的应用从浏览器接收导航输入。
用户可以使用浏览器中的“**返回**”和“**前进**”按钮在浏览器历史记录中反映的导航路由之间移动，
也可以使用地址栏来了解当前位置并直接前往某个目标。

要将 Web 应用绑定到公共代码中定义的导航图，
您可以在 Kotlin/Wasm 代码中使用 `NavController.bindToBrowserNavigation()` 方法。
您可以在 Kotlin/JS 中使用相同的方法，但要将其包装在 `onWasmReady {}` 代码块中，以确保 Wasm 应用程序已初始化并且 Skia 已准备好渲染图形。
以下是设置示例：

```kotlin
//commonMain source set
@Composable
fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) {
    val navController = rememberNavController()
    NavHost(...) {
        //...
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}

//wasmJsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
          onNavHostReady = { it.bindToBrowserNavigation() }
        )
    }
}

//jsMain source set
@OptIn(ExperimentalComposeUiApi::class)
@ExperimentalBrowserHistoryApi
fun main() {
    onWasmReady {
        val body = document.body ?: return@onWasmReady
        ComposeViewport(body) {
            App(
                onNavHostReady = { it.bindToBrowserNavigation() }
            )
        }
    }
}
```

调用 `navController.bindToBrowserNavigation()` 后：
* 浏览器中显示的 URL 会反映当前路由（在 URL 片段中，`#` 字符之后）。
* 应用会解析手动输入的 URL，将其转换为应用内的目标。

默认情况下，当使用类型安全导航时，目标会根据
[`kotlinx.serialization` 默认值](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/)
转换为 URL 片段，并附加实参：
`<app package>.<serializable type>/<argument1>/<argument2>`。
例如，`example.org#org.example.app.StartScreen/123/Alice%2520Smith`。

### 自定义路由与 URL 之间的转换

由于 Compose Multiplatform 应用是单页应用，框架会操纵地址栏以模仿常规的 Web 导航。
如果您希望使 URL 更具可读性，并将实现与 URL 模式分离，
您可以直接为屏幕分配名称，或者为目标路由开发完全自定义的处理方式：

* 为了简单地使 URL 可读，请使用 `@SerialName` 注解显式设置可序列化对象或类的序列名称：

    ```kotlin
    // 此路由不会使用应用包名和对象名，
    // 而是直接转换为 URL，例如 “#start”
    @Serializable @SerialName("start") data object StartScreen
    ```
* 要完全构建每个 URL，您可以使用可选的 `getBackStackEntryRoute` lambda。

#### 完整 URL 自定义

要实现完全自定义的路由到 URL 转换：

1. 将可选的 `getBackStackEntryRoute` lambda 传递给 `navController.bindToBrowserNavigation()` 函数
    以指定在必要时应如何将路由转换为 URL 片段。
2. 如有需要，添加代码来捕获地址栏中的 URL 片段（当有人点击或粘贴您的应用 URL 时）
    并将 URL 转换为路由以相应地导航用户。

以下是一个简单的类型安全导航图示例，可与以下 Web 代码示例
（`commonMain/kotlin/org.example.app/App.kt`）一起使用：

```kotlin
// Serializable object and classes for route arguments in the navigation graph
@Serializable data object StartScreen
@Serializable data class Id(val id: Long)
@Serializable data class Patient(val name: String, val age: Long)

@Composable
internal fun App(
    onNavHostReady: suspend (NavController) -> Unit = {}
) = AppTheme {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = StartScreen
    ) {
        composable<StartScreen> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text("Starting screen")
                // 打开“Id”屏幕并带有合适参数的按钮
                Button(onClick = { navController.navigate(Id(222)) }) {
                    Text("将 222 作为参数传递给 ID 屏幕")
                }
                // 打开“Patient”屏幕并带有合适参数的按钮
                Button(onClick = { navController.navigate(Patient( "Jane Smith-Baker", 33)) }) {
                    Text("将 'Jane Smith-Baker' 和 33 传递给 Person 屏幕")
                }
            }
        }
        composable<Id> {...}
        composable<Patient> {...}
    }
    LaunchedEffect(navController) {
        onNavHostReady(navController)
    }
}
```
{default-state="collapsed" collapsible="true" collapsed-title="NavHost(navController = navController, startDestination = StartScreen)"}

在 `wasmJsMain/kotlin/main.kt` 中，将 lambda 添加到 `.bindToBrowserNavigation()` 调用：

```kotlin
@OptIn(
    ExperimentalComposeUiApi::class,
    ExperimentalBrowserHistoryApi::class,
    ExperimentalSerializationApi::class
)
fun main() {
    val body = document.body ?: return
    ComposeViewport(body) {
        App(
            onNavHostReady = { navController ->
                navController.bindToBrowserNavigation() { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // 使用其序列描述符识别路由
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // 将对应的 URL 片段设置为 “#start”
                            // 而不是 “#org.example.app.StartScreen”
                            //
                            // 此字符串必须始终以 `#` 字符开头，以将数据
                            // 保留在 URL 片段中
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // 访问路由实参
                            val args = entry.toRoute<Id>()

                            // 将对应的 URL 片段设置为 “#find_id_222”
                            // 而不是 “#org.example.app.ID%2F222”
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // 将对应的 URL 片段设置为 “#patient_Jane%20Smith-Baker_33”
                            // 而不是 “#org.company.app.Patient%2FJane%2520Smith-Baker%2F33”
                            "#patient_${args.name}_${args.age}"
                        }
                        // 不为所有其他路由设置 URL 片段
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="navController.bindToBrowserNavigation() { entry ->"}-->

> 确保每个对应于路由的字符串都以 `#` 字符开头，以将数据保留在 URL 片段中。
> 否则，当用户复制和粘贴 URL 时，浏览器将尝试访问错误的端点，而不是将控制权传递给您的应用。
> 
{style="note"}

如果您的 URL 具有自定义格式，则应添加反向处理
以将手动输入的 URL 与目标路由进行匹配。
执行匹配的代码需要在 `navController.bindToBrowserNavigation()` 调用将浏览器位置
绑定到导航图之前运行：

<Tabs>
    <TabItem title="Kotlin/Wasm">
        <code-block lang="Kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            val body = document.body ?: return&#10;            ComposeViewport(body) {&#10;                App(&#10;                    onNavHostReady = { navController -&gt;&#10;                        // 访问当前 URL 的片段子字符串&#10;                        val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                        when {&#10;                            // 识别对应的路由并导航到它&#10;                            initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                navController.navigate(StartScreen)&#10;                            }&#10;                            initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                // 在导航到路由之前解析字符串以提取路由参数&#10;                                val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                navController.navigate(Id(id))&#10;                            }&#10;                            initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                navController.navigate(Patient(name, id))&#10;                            }&#10;                        }&#10;                        navController.bindToBrowserNavigation() { ... }&#10;                    }&#10;                )&#10;            }&#10;        }"/>
    </TabItem>
    <TabItem title="Kotlin/JS">
        <code-block lang="kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            onWasmReady {&#10;                val body = document.body ?: return@onWasmReady&#10;                ComposeViewport(body) {&#10;                    App(&#10;                        onNavHostReady = { navController -&gt;&#10;                            // 访问当前 URL 的片段子字符串&#10;                            val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                            when {&#10;                                // 识别对应的路由并导航到它&#10;                                initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                    navController.navigate(StartScreen)&#10;                                }&#10;                                initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                    // 在导航到路由之前解析字符串以提取路由参数&#10;                                    val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                    navController.navigate(Id(id))&#10;                                }&#10;                                initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                    val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                    val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                    navController.navigate(Patient(name, id))&#10;                                }&#10;                            }&#10;                            navController.bindToBrowserNavigation() { ... }&#10;                        }&#10;                    )&#10;                }&#10;            }&#10;        }"/>
    </TabItem>
</Tabs>