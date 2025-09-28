`[//]: # (title: 建立您自己的應用程式)`

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作 – 這兩個 IDE 共享相同的核心功能並支援 Kotlin Multiplatform。</p>
    <br/>
    <p>這是**使用共享邏輯和使用者介面建立 Compose Multiplatform 應用程式**教學課程的最後一部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一個步驟"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">建立您的 Compose Multiplatform 應用程式</Links><br/>
       <img src="icon-2-done.svg" width="20" alt="第二個步驟"/> <Links href="/kmp/compose-multiplatform-explore-composables" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">探索可組合程式碼</Links><br/>
       <img src="icon-3-done.svg" width="20" alt="第三個步驟"/> <Links href="/kmp/compose-multiplatform-modify-project" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the third part of the Create a Compose Multiplatform app with shared logic and UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Compose Multiplatform app Explore composable code Modify the project Create your own application">修改專案</Links><br/>
       <img src="icon-4.svg" width="20" alt="第四個步驟"/> <strong>建立您自己的應用程式</strong><br/>
    </p>
</tldr>

現在您已經探索並增強了由精靈建立的範例專案，您可以使用您已知的概念並引入一些新概念，從頭開始建立您自己的應用程式。

您將建立一個「本地時間應用程式」，使用者可以在其中輸入他們的國家和城市，應用程式將顯示該國家首都的時間。您的 Compose Multiplatform 應用程式的所有功能都將使用多平台函式庫在通用程式碼中實作。它將在下拉式選單中載入並顯示影像，並將使用事件、樣式、主題、修改器和佈局。

在每個階段，您都可以在所有三個平台 (iOS、Android 和桌面) 上執行應用程式，或者您可以專注於最適合您需求的特定平台。

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到專案的最終狀態。
>
{style="note"}

## 奠定基礎

首先，實作一個新的 `App` 可組合函式：

1. 在 `composeApp/src/commonMain/kotlin` 中，開啟 `App.kt` 檔案並將程式碼替換為以下 `App` 可組合函式：

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

   * 此佈局是一個包含兩個可組合函式的欄位。第一個是 `Text` 可組合函式，第二個是 `Button`。
   * 這兩個可組合函式由一個共享狀態，即 `timeAtLocation` 屬性連結。`Text` 可組合函式是此狀態的觀察者。
   * `Button` 可組合函式使用 `onClick` 事件處理器來改變狀態。

2. 在 Android 和 iOS 上執行應用程式：

   ![Android 和 iOS 上的新 Compose Multiplatform 應用程式](first-compose-project-on-android-ios-3.png){width=500}

   當您執行應用程式並按一下按鈕時，將顯示硬編碼的時間。

3. 在桌面上執行應用程式。它運作正常，但視窗對於使用者介面來說顯然太大了：

   ![桌面上的新 Compose Multiplatform 應用程式](first-compose-project-on-desktop-3.png){width=400}

4. 為了解決這個問題，請在 `composeApp/src/jvmMain/kotlin` 中，將 `main.kt` 檔案更新如下：

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

    在這裡，您設定了視窗標題並使用 `WindowState` 類型為視窗設定初始大小和螢幕位置。

    > 若要在桌面應用程式中即時查看您的變更，請使用 [Compose 熱重載](compose-hot-reload.md)：
    > 1. 在 `main.kt` 檔案中，按一下邊槽中的 **執行** 圖示。
    > 2. 選擇 **使用 Compose 熱重載 (Beta) 執行 'composeApp [hotRunJvm]'**。
    > ![從邊槽執行 Compose 熱重載](compose-hot-reload-gutter-run.png){width=350}
    >
    > 若要讓應用程式自動更新，請儲存任何修改過的檔案 (<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>)。
    >
    > Compose 熱重載目前處於 [Beta](https://kotlinlang.org/components-stability.html#stability-levels-explained) 階段，因此其功能可能會有所變更。
    >
    {style="tip"}

5. 遵循 IDE 的指示匯入缺少的依賴項。
6. 再次執行桌面應用程式。其外觀應會改善：

   ![Compose Multiplatform 應用程式在桌面上的外觀改善](first-compose-project-on-desktop-4.png){width=350}

<!--
   ### Compose Hot Reload demo {initial-collapse-state="collapsed" collapsible="true"}

   ![Compose Hot Reload](compose-hot-reload-resize.gif)
-->

## 支援使用者輸入

現在讓使用者輸入城市名稱以查看該位置的時間。最簡單的方法是新增一個 `TextField` 可組合函式：

1. 將 `App` 的目前實作替換為以下內容：

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

    新程式碼新增了 `TextField` 和 `location` 屬性。當使用者在文字欄位中輸入時，屬性的值會使用 `onValueChange` 事件處理器遞增更新。

2. 遵循 IDE 的指示匯入缺少的依賴項。
3. 在您鎖定的每個平台上執行應用程式：

<Tabs>
    <TabItem id="mobile-user-input" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-4.png" alt="Android 和 iOS 上 Compose Multiplatform 應用程式中的使用者輸入" width="500"/>
    </TabItem>
    <TabItem id="desktop-user-input" title="桌面">
        <img src="first-compose-project-on-desktop-5.png" alt="桌面上的 Compose Multiplatform 應用程式中的使用者輸入" width="350"/>
    </TabItem>
</Tabs>

## 計算時間

下一步是使用給定的輸入來計算時間。為此，請建立一個 `currentTimeAt()` 函式：

1. 返回 `App.kt` 檔案並新增以下函式：

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

    此函式類似於您之前建立且不再需要的 `todaysDate()`。

2. 遵循 IDE 的指示匯入缺少的依賴項。
3. 調整您的 `App` 可組合函式以呼叫 `currentTimeAt()`：

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

4. 在 `wasmJsMain/kotlin/main.kt` 檔案中，在 `main()` 函式之前新增以下程式碼，以初始化對網路時區的支援：

    ```kotlin
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    ```

5. 再次執行應用程式並輸入有效的時區。
6. 按一下按鈕。您應該會看到正確的時間：

<Tabs>
    <TabItem id="mobile-time-display" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-5.png" alt="Android 和 iOS 上 Compose Multiplatform 應用程式中的時間顯示" width="500"/>
    </TabItem>
    <TabItem id="desktop-time-display" title="桌面">
        <img src="first-compose-project-on-desktop-6.png" alt="桌面上的 Compose Multiplatform 應用程式中的時間顯示" width="350"/>
    </TabItem>
</Tabs>

## 改善樣式

應用程式正在運作，但在外觀上存在一些問題。可組合函式之間的間距可以更好，並且時間訊息可以更突出地呈現。

1. 為了解決這些問題，請使用以下版本的 `App` 可組合函式：

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

    * `modifier` 參數為 `Column` 周圍以及 `Button` 和 `TextField` 的頂部添加了內邊距。
    * `Text` 可組合函式填滿可用的水平空間並將其內容居中。
    * `style` 參數自訂 `Text` 的外觀。

2. 遵循 IDE 的指示匯入缺少的依賴項。
    對於 `Alignment`，請使用 `androidx.compose.ui` 版本。

3. 執行應用程式以查看外觀的改善：

<Tabs>
    <TabItem id="mobile-improved-style" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-6.png" alt="Android 和 iOS 上 Compose Multiplatform 應用程式的樣式改善" width="500"/>
    </TabItem>
    <TabItem id="desktop-improved-style" title="桌面">
        <img src="first-compose-project-on-desktop-7.png" alt="桌面上的 Compose Multiplatform 應用程式的樣式改善" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage2).
>
{style="tip"}
-->

## 重構設計

應用程式運作正常，但容易出現拼寫錯誤。例如，如果使用者輸入「Franse」而不是「France」，應用程式將無法處理該輸入。最好是要求使用者從預定義列表中選擇國家。

1. 為此，請變更 `App` 可組合函式中的設計：

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

   * 有一個 `Country` 類型，由名稱和時區組成。
   * `currentTimeAt()` 函式將 `TimeZone` 作為其第二個參數。
   * `App` 現在需要一個國家/地區列表作為參數。`countries()` 函式提供了此列表。
   * `DropdownMenu` 已取代 `TextField`。`showCountries` 屬性的值決定了 `DropdownMenu` 的可見性。每個國家都有一個 `DropdownMenuItem`。

2. 遵循 IDE 的指示匯入缺少的依賴項。
3. 執行應用程式以查看重新設計的版本：

<Tabs>
    <TabItem id="mobile-country-list" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-7.png" alt="Android 和 iOS 上 Compose Multiplatform 應用程式中的國家/地區列表" width="500"/>
    </TabItem>
    <TabItem id="desktop-country-list" title="桌面">
        <img src="first-compose-project-on-desktop-8.png" alt="桌面上的 Compose Multiplatform 應用程式中的國家/地區列表" width="350"/>
    </TabItem>
</Tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage3).
>
{style="tip"}
-->

> 您可以使用依賴注入框架，例如 [Koin](https://insert-koin.io/)，進一步改善設計，以建構和注入位置表格。如果資料儲存在外部，您可以使用 [Ktor](https://ktor.io/docs/create-client.html) 函式庫透過網路擷取，或使用 [SQLDelight](https://github.com/cashapp/sqldelight) 函式庫從資料庫擷取。
>
{style="note"}

## 引入影像

國家名稱列表運作正常，但視覺上不夠吸引人。您可以透過將名稱替換為國旗影像來改善它。

Compose Multiplatform 提供了一個函式庫，用於透過所有平台上的通用程式碼存取資源。Kotlin Multiplatform 精靈已經新增並配置了此函式庫，因此您可以開始載入資源，而無需修改建置檔案。

為了在專案中支援影像，您需要下載影像檔，將它們儲存在正確的目錄中，並新增程式碼來載入和顯示它們：

1. 使用外部資源，例如 [Flag CDN](https://flagcdn.com/)，下載符合您已建立的國家/地區列表的國旗。在此情況下，這些是 [日本](https://flagcdn.com/w320/jp.png)、[法國](https://flagcdn.com/w320/fr.png)、[墨西哥](https://flagcdn.com/w320/mx.png)、[印尼](https://flagcdn.com/w320/id.png) 和 [埃及](https://flagcdn.com/w320/eg.png)。

2. 將影像移動到 `composeApp/src/commonMain/composeResources/drawable` 目錄，以便所有平台都可使用相同的國旗：

   ![Compose Multiplatform 資源專案結構](compose-resources-project-structure.png){width=300}

3. 建置或執行應用程式以產生帶有新增資源存取器的 `Res` 類別。

4. 更新 `commonMain/kotlin/.../App.kt` 檔案中的程式碼以支援影像：

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

    * `Country` 類型儲存相關影像的路徑。
    * 傳遞給 `App` 的國家/地區列表包含這些路徑。
    * `App` 在每個 `DropdownMenuItem` 中顯示一個 `Image`，其後跟隨一個包含國家/地區名稱的 `Text` 可組合函式。
    * 每個 `Image` 都需要一個 `Painter` 物件來擷取資料。

5. 遵循 IDE 的指示匯入缺少的依賴項。
6. 執行應用程式以查看新行為：

<Tabs>
    <TabItem id="mobile-flags" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-8.png" alt="Android 和 iOS 上 Compose Multiplatform 應用程式中的國旗" width="500"/>
    </TabItem>
    <TabItem id="desktop-flags" title="桌面">
        <img src="first-compose-project-on-desktop-9.png" alt="桌面上的 Compose Multiplatform 應用程式中的國旗" width="350"/>
    </TabItem>
</Tabs>

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到專案的最終狀態。
>
{style="note"}

## 後續步驟

我們鼓勵您進一步探索多平台開發並嘗試更多專案：

* [讓您的 Android 應用程式跨平台](multiplatform-integrate-in-existing-app.md)
* [使用 Ktor 和 SQLDelight 建立多平台應用程式](multiplatform-ktor-sqldelight.md)
* [在 iOS 和 Android 之間共享業務邏輯同時保持原生 UI](multiplatform-create-first-app.md)
* [使用 Kotlin/Wasm 建立 Compose Multiplatform 應用程式](https://kotlinlang.org/docs/wasm-get-started.html)
* [查看精選範例專案列表](multiplatform-samples.md)

加入社群：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：為 [儲存庫](https://github.com/JetBrains/compose-multiplatform) 加星並貢獻
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：獲取 [邀請函](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：訂閱 ["kotlin-multiplatform" 標籤](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 頻道**：訂閱並觀看有關 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的影片