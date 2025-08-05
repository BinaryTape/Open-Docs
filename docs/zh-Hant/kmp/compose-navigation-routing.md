[//]: # (title: 導航與路由)

導航是 UI 應用程式的關鍵部分，它允許使用者在應用程式的不同螢幕之間移動。
Compose Multiplatform 採用了 [Jetpack Compose 的導航方法](https://developer.android.com/guide/navigation/design#frameworks)。

> 導航函式庫目前處於 [Beta](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 階段。
> 歡迎您在 Compose Multiplatform 專案中嘗試使用它。
> 我們將非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 中提供的回饋。
>
{style="tip"}

## 設定

要使用導航函式庫，請將以下依賴項新增到您的 `commonMain` 原始碼集中：

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

> Compose Multiplatform %org.jetbrains.compose% 需要導航函式庫版本 %org.jetbrains.androidx.navigation%。
>
{style="note"}

## 範例專案

要查看 Compose Multiplatform 導航函式庫的實際應用，請查看 [nav_cupcake 專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/nav_cupcake)，
該專案是從 [使用 Compose 在螢幕之間導航](https://developer.android.com/codelabs/basic-android-kotlin-compose-navigation#0)
Android Codelab 轉換而來。

就像 Jetpack Compose 一樣，要實作導航，您應該：
1. [列出應包含在導航圖中的路由](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L50)。每個路由都必須是一個定義路徑的唯一字串。
2. [建立一個 `NavHostController` 實例](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L89) 作為您的主要可組合屬性（composable property）以管理導航。
3. [將 `NavHost` 可組合項](https://github.com/JetBrains/compose-multiplatform/blob/a6961385ccf0dee7b6d31e3f73d2c8ef91005f1a/examples/nav_cupcake/composeApp/src/commonMain/kotlin/org/jetbrains/nav_cupcake/CupcakeScreen.kt#L109) 新增到您的應用程式中：
    1. 從您先前定義的路由清單中選擇起始目的地。
    2. 建立導航圖，可以直接作為建立 `NavHost` 的一部分，或透過程式碼使用 `NavController.createGraph()` 函數來建立。

每個返回堆疊條目（導航圖中包含的每個導航路由）都實作了 `LifecycleOwner` 介面。
應用程式不同螢幕之間的切換會使其狀態從 `RESUMED` 變為 `STARTED` 再返回。
`RESUMED` 也被描述為「穩定」：當新螢幕準備就緒並啟用時，導航被視為完成。
有關 Compose Multiplatform 中當前實作的詳細資訊，請參閱 [](compose-lifecycle.md) 頁面。

## 網頁應用程式中的瀏覽器導航支援
<secondary-label ref="Experimental"/>

Compose Multiplatform for web 完全支援通用的導航函式庫 API，
此外還允許您的應用程式從瀏覽器接收導航輸入。
使用者可以使用瀏覽器中的**返回**和**前進**按鈕在瀏覽器歷史記錄中反映的導航路由之間移動，
並使用位址列來了解他們目前的位置並直接前往目的地。

要將網頁應用程式綁定到您通用程式碼中定義的導航圖，
您可以在 Kotlin/Wasm 程式碼中使用 `window.bindToNavigation()` 方法。
您也可以在 Kotlin/JS 中使用相同的方法，但需將其包裹在 `onWasmReady {}` 區塊中，以確保
Wasm 應用程式已初始化且 Skia 已準備好渲染圖形。
以下是設定此項的範例：

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
          onNavHostReady = { window.bindToNavigation(it) }
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
                onNavHostReady = { window.bindToNavigation(it) }
            )
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

在 `wasmJsMain/kotlin/main.kt` 中，將 Lambda 函式新增到 `.bindToNavigation()` 呼叫中：

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
                window.bindToNavigation(navController) { entry ->
                    val route = entry.destination.route.orEmpty()
                    when {
                        // 使用其序列描述符識別路由
                        route.startsWith(StartScreen.serializer().descriptor.serialName) -> {
                            // 將對應的 URL 片段設定為 "#start"
                            // 而非 "#org.example.app.StartScreen"
                            //
                            // 此字串必須始終以 `#` 字元開頭，以保持
                            // 前端處理
                            "#start"
                        }
                        route.startsWith(Id.serializer().descriptor.serialName) -> {
                            // 存取路由引數
                            val args = entry.toRoute<Id>()

                            // 將對應的 URL 片段設定為 "#find_id_222"
                            // 而非 "#org.example.app.ID%2F222"
                            "#find_id_${args.id}"
                        }
                        route.startsWith(Patient.serializer().descriptor.serialName) -> {
                            val args = entry.toRoute<Patient>()
                            // 將對應的 URL 片段設定為 "#patient_Jane%20Smith-Baker_33"
                            // 而非 "#org.company.app.Patient%2FJane%2520Smith-Baker%2F33"
                            "#patient_${args.name}_${args.age}"
                        }
                        // 不為所有其他路由設定 URL 片段
                        else -> ""
                    }
                }
            }
        )
    }
}
```
<!--{default-state="collapsed" collapsible="true" collapsed-title="window.bindToNavigation(navController) { entry ->"}-->

> 確保每個對應於路由的字串都以 `#` 字元開頭，以將資料保留在 URL 片段中。
> 否則，當使用者複製和貼上 URL 時，瀏覽器會嘗試存取錯誤的端點，而非將控制權傳遞給您的應用程式。
>
{style="note"}

如果您的 URL 具有自訂格式，您應該新增反向處理，以將手動輸入的 URL 匹配到目的地路由。
執行匹配的程式碼需要在 `window.bindToNavigation()` 呼叫將 `window.location` 綁定到導航圖之前執行：

<tabs>
    <tab title="Kotlin/Wasm">
        <code-block lang="Kotlin">
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
                        // 存取當前 URL 的片段子字串
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // 識別對應的路由並導航到該路由
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // 在導航到該路由之前，解析字串以提取路由參數
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }
        </code-block>
    </tab>
    <tab title="Kotlin/JS">
        <code-block lang="kotlin">
        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // 存取當前 URL 的片段子字串
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // 識別對應的路由並導航到該路由
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // 在導航到該路由之前，解析字串以提取路由參數
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }
        </code-block>
    </tab>
</tabs>