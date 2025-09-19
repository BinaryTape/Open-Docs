[//]: # (title: 導覽與路由)

導覽是 UI 應用程式的關鍵部分，允許使用者在不同的應用程式畫面之間移動。Compose Multiplatform 採用 [Jetpack Compose 的導覽方法](https://developer.android.com/guide/navigation/design#frameworks)。

## 設定

若要使用導覽函式庫，請將以下依賴項新增至您的 `commonMain` 原始碼集：

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

## 範例專案

若要查看 Compose Multiplatform 導覽函式庫的實際運作，請查看 [nav_cupcake 專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)，該專案是從 [Navigate between screens with Compose](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0) Android 程式碼研究室轉換而來。

如同 Jetpack Compose，若要實作導覽，您應該：
1. [列出路由](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50)，這些路由應包含在導覽圖中。每個路由必須是定義路徑的唯一字串。
2. [建立 `NavHostController` 實例](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89) 作為您的主要可組合屬性以管理導覽。
3. [將 `NavHost` 可組合項新增至您的應用程式](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109)：
    1. 從您先前定義的路由清單中選擇起始目的地。
    2. 建立導覽圖，可以直接建立作為建立 `NavHost` 的一部分，或透過程式碼使用 `NavController.createGraph()` 函式建立。

每個返回堆疊項目 (圖中包含的每個導覽路由) 都實作 `LifecycleOwner` 介面。應用程式不同畫面之間的切換使其狀態從 `RESUMED` 變為 `STARTED` 再變回原狀。`RESUMED` 也被描述為「已穩定」：當新畫面準備就緒並處於啟用狀態時，導覽即被視為完成。請參閱 [生命週期](compose-lifecycle.md) 頁面，了解 Compose Multiplatform 中目前實作的詳細資訊。

## 對於網頁應用程式中的瀏覽器導覽支援
<secondary-label ref="Experimental"/>

適用於網頁的 Compose Multiplatform 完全支援通用導覽函式庫 API，除此之外，還允許您的應用程式從瀏覽器接收導覽輸入。使用者可以使用瀏覽器中的「上一頁」和「下一頁」按鈕在反映在瀏覽器歷史記錄中的導覽路由之間移動，以及使用網址列了解他們目前的位置並直接前往目的地。

若要將網頁應用程式綁定到通用程式碼中定義的導覽圖，您可以在 Kotlin/Wasm 程式碼中使用 `NavController.bindToBrowserNavigation()` 方法。您也可以在 Kotlin/JS 中使用相同的方法，但必須將其包裝在 `onWasmReady {}` 區塊中，以確保 Wasm 應用程式已初始化且 Skia 已準備好繪製圖形。以下是如何設定此項的範例：

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

在呼叫 `navController.bindToBrowserNavigation()` 之後：
* 瀏覽器中顯示的 URL 反映目前的路由 (在 URL 片段中，即 `#` 字元之後)。
* 應用程式會解析手動輸入的 URL，將其轉換為應用程式內的目標位置。

預設情況下，使用型別安全導覽時，目的地會根據 [`kotlinx.serialization` 預設值](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-core/kotlinx.serialization/-serial-name/) 並附加引數轉換為 URL 片段：
`<app package>.<serializable type>/<argument1>/<argument2>`。
例如：`example.org#org.example.app.StartScreen/123/Alice%2520Smith`。

### 自訂路由與 URL 之間的轉換

由於 Compose Multiplatform 應用程式是單頁應用程式，框架會操作網址列以模擬一般的網路導覽。
如果您希望讓您的 URL 更具可讀性並將實作與 URL 模式分離，您可以直接為畫面指派名稱或為目標路由開發完全自訂的處理方式：

* 若要使 URL 簡單易讀，請使用 `@SerialName` 註解以明確設定可序列化物件或類別的序列名稱：

    ```kotlin
    // Instead of using the app package and object name,
    // this route will be translated to the URL simply as "#start"
    @Serializable @SerialName("start") data object StartScreen
    ```
* 若要完整建構每個 URL，您可以使用選用的 `getBackStackEntryRoute` lambda。

#### 完整 URL 自訂

若要實作完全自訂的路由到 URL 轉換：

1. 將選用的 `getBackStackEntryRoute` lambda 傳遞給 `navController.bindToBrowserNavigation()` 函式，以指定在必要時應如何將路由轉換為 URL 片段。
2. 如果需要，新增程式碼以捕捉網址列中的 URL 片段 (當有人點擊或貼上您應用程式的 URL 時)，並將 URL 轉換為路由以相應地導覽使用者。

以下是一個簡單的型別安全導覽圖範例，可與以下網頁程式碼範例一起使用 (`commonMain/kotlin/org.example.app/App.kt`)：

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
                // Button that opens the 'Id' screen with a suitable parameter
                Button(onClick = { navController.navigate(Id(222)) }) {
                    Text("Pass 222 as a parameter to the ID screen")
                }
                // Button that opens the 'Patient' screen with suitable parameters
                Button(onClick = { navController.navigate(Patient( "Jane Smith-Baker", 33)) }) {
                    Text("Pass 'Jane Smith-Baker' and 33 to the Person screen")
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

在 `wasmJsMain/kotlin/main.kt` 中，將 lambda 新增至 `.bindToBrowserNavigation()` 呼叫：

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
                        // Identifies the route using its serial descriptor
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // Sets the corresponding URL fragment to "#start"
                            // instead of "#org.example.app.StartScreen"
                            //
                            // This string must always start with the `#` character to keep
                            // the processing at the front end
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // Accesses the route arguments
                            val args = entry.toRoute<Id>()

                            // Sets the corresponding URL fragment to "#find_id_222"
                            // instead of "#org.example.app.ID%2F222"
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // Sets the corresponding URL fragment to "#patient_Jane%20Smith-Baker_33"
                            // instead of "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33"
                            "#patient_${args.name}_${args.age}"
                        }
                        // Doesn't set a URL fragment for all other routes
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="navController.bindToBrowserNavigation() { entry ->"}-->

> 請確保每個對應於路由的字串都以 `#` 字元開頭，以便將資料保留在 URL 片段中。
> 否則，當使用者複製並貼上 URL 時，瀏覽器會嘗試存取錯誤的端點，而不是將控制權傳遞給您的應用程式。
>
{style="note"}

如果您的 URL 具有自訂格式，您應該新增反向處理以將手動輸入的 URL 與目的地路由進行匹配。
執行匹配的程式碼需要在 `navController.bindToBrowserNavigation()` 呼叫將 `window.location` 綁定到導覽圖之前執行：

<Tabs>
    <TabItem title="Kotlin/Wasm">
        <code-block lang="Kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            val body = document.body ?: return&#10;            ComposeViewport(body) {&#10;                App(&#10;                    onNavHostReady = { navController -&gt;&#10;                        // 存取目前 URL 的片段子字串&#10;                        val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                        when {&#10;                            // 識別對應的路由並導覽至該路由&#10;                            initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                navController.navigate(StartScreen)&#10;                            }&#10;                            initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                // 在導覽至該路由之前，解析字串以提取路由參數&#10;                                val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                navController.navigate(Id(id))&#10;                            }&#10;                            initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                navController.navigate(Patient(name, id))&#10;                            }&#10;                        }&#10;                        navController.bindToBrowserNavigation() { ... }&#10;                    }&#10;                )&#10;            }&#10;        }"/>
    </TabItem>
    <TabItem title="Kotlin/JS">
        <code-block lang="kotlin" code="        @OptIn(&#10;            ExperimentalComposeUiApi::class,&#10;            ExperimentalBrowserHistoryApi::class,&#10;            ExperimentalSerializationApi::class&#10;        )&#10;        fun main() {&#10;            onWasmReady {&#10;                val body = document.body ?: return@onWasmReady&#10;                ComposeViewport(body) {&#10;                    App(&#10;                        onNavHostReady = { navController -&gt;&#10;                            // 存取目前 URL 的片段子字串&#10;                            val initRoute = window.location.hash.substringAfter('#', &quot;&quot;)&#10;                            when {&#10;                                // 識別對應的路由並導覽至該路由&#10;                                initRoute.startsWith(&quot;start&quot;) -&gt; {&#10;                                    navController.navigate(StartScreen)&#10;                                }&#10;                                initRoute.startsWith(&quot;find_id&quot;) -&gt; {&#10;                                    // 在導覽至該路由之前，解析字串以提取路由參數&#10;                                    val id = initRoute.substringAfter(&quot;find_id_&quot;).toLong()&#10;                                    navController.navigate(Id(id))&#10;                                }&#10;                                initRoute.startsWith(&quot;patient&quot;) -&gt; {&#10;                                    val name = initRoute.substringAfter(&quot;patient_&quot;).substringBefore(&quot;_&quot;)&#10;                                    val id = initRoute.substringAfter(&quot;patient_&quot;).substringAfter(&quot;_&quot;).toLong()&#10;                                    navController.navigate(Patient(name, id))&#10;                                }&#10;                            }&#10;                            navController.bindToBrowserNavigation() { ... }&#10;                        }&#10;                    )&#10;                }&#10;            }&#10;        }"/>
    </TabItem>
</Tabs>