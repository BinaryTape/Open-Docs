[//]: # (title: 建立你的應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中跟隨操作 – 這兩個 IDE 共享相同的核心功能並支援 Kotlin Multiplatform。</p>
    <br/>
    <p>這是 **使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式** 教學課程的最後一部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-create-first-app.md">建立您的 Compose Multiplatform 應用程式</a><br/>
       <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="compose-multiplatform-explore-composables.md">探索可組合程式碼</a><br/>
       <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="compose-multiplatform-modify-project.md">修改專案</a><br/>
       <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>建立您自己的應用程式</strong><br/>
    </p>
</tldr>

既然您已經探索並強化了精靈建立的範例專案，您現在可以使用您已知悉的概念並引入一些新概念，從零開始建立您自己的應用程式。

您將建立一個「本地時間應用程式」，使用者可以在其中輸入他們的國家和城市，應用程式將顯示該國家首都的時間。您的 Compose Multiplatform 應用程式的所有功能都將使用多平台函式庫在共通程式碼中實作。它將在下拉式選單中載入並顯示圖片，並將使用事件、樣式、主題、修飾符和版面配置。

在每個階段，您都可以在所有三個平台 (iOS、Android 和桌面) 上執行應用程式，或者您可以專注於最適合您需求的特定平台。

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到專案的最終狀態。
>
{style="note"}

## 奠定基礎

首先，實作一個新的 `App` 可組合項：

1. 在 `composeApp/src/commonMain/kotlin` 中，打開 `App.kt` 檔案，並將程式碼替換為以下 `App` 可組合項：

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

   * 版面配置是一個包含兩個可組合項的 `Column`。第一個是 `Text` 可組合項，第二個是 `Button`。
   * 這兩個可組合項由一個共享狀態連結，即 `timeAtLocation` 屬性。`Text` 可組合項是此狀態的觀察者。
   * `Button` 可組合項使用 `onClick` 事件處理器來更改狀態。

2. 在 Android 和 iOS 上執行應用程式：

   ![New Compose Multiplatform app on Android and iOS](first-compose-project-on-android-ios-3.png){width=500}

   當您執行應用程式並點擊按鈕時，將顯示硬編碼的時間。

3. 在桌面上執行應用程式。它運作正常，但視窗顯然對於 UI 來說太大：

   ![New Compose Multiplatform app on desktop](first-compose-project-on-desktop-3.png){width=400}

4. 為了修正這個問題，請在 `composeApp/src/desktopMain/kotlin` 中，如下更新 `main.kt` 檔案：

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

    在這裡，您設定了視窗的標題，並使用 `WindowState` 類型來為視窗提供螢幕上的初始大小和位置。

    > 要在桌面應用程式中即時查看您的更改，請使用 [Compose 熱重載](compose-hot-reload.md)：
    > 1. 在 `main.kt` 檔案中，點擊邊緣列中的 **執行** 圖示。
    > 2. 選擇 **執行 'main [desktop]' 並啟用 Compose 熱重載 (Alpha)**。
    > ![Run Compose Hot Reload from gutter](compose-hot-reload-gutter-run.png){width=350}
    >
    > 要查看應用程式自動更新，請儲存任何修改過的檔案 (<shortcut>⌘ S</shortcut> / <shortcut>Ctrl+S</shortcut>)。
    >
    > Compose 熱重載目前處於 [Alpha](https://kotlinlang.org/components-stability.html#stability-levels-explained) 階段，因此其功能可能會有所變動。
    >
    {style="tip"}

5. 依照 IDE 的指示導入缺少的依賴項。
6. 再次執行桌面應用程式。它的外觀應該會有所改善：

   ![Improved appearance of the Compose Multiplatform app on desktop](first-compose-project-on-desktop-4.png){width=350}

   ### Compose 熱重載示範 {initial-collapse-state="collapsed" collapsible="true"}

   ![Compose Hot Reload](compose-hot-reload-resize.gif)

## 支援使用者輸入

現在讓使用者輸入城市名稱以查看該位置的時間。最簡單的方法是添加一個 `TextField` 可組合項：

1. 將 `App` 的當前實作替換為以下內容：

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

    新程式碼同時添加了 `TextField` 和 `location` 屬性。當使用者在文字欄位中輸入時，屬性的值會使用 `onValueChange` 事件處理器進行增量更新。

2. 依照 IDE 的指示導入缺少的依賴項。
3. 在您目標的每個平台上執行應用程式：

<tabs>
    <tab id="mobile-user-input" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-4.png" alt="User input in the Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-user-input" title="桌面">
        <img src="first-compose-project-on-desktop-5.png" alt="User input in the Compose Multiplatform app on desktop" width="350"/>
    </tab>
</tabs>

## 計算時間

下一步是使用給定的輸入來計算時間。為此，請建立一個 `currentTimeAt()` 函式：

1. 返回 `App.kt` 檔案並添加以下函式：

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

    此函式類似於您之前建立的 `todaysDate()`，而該函式不再需要。

2. 依照 IDE 的指示導入缺少的依賴項。
3. 調整您的 `App` 可組合項以調用 `currentTimeAt()`：

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

4. 在 `wasmJsMain/kotlin/main.kt` 檔案中，在 `main()` 函式之前添加以下程式碼，以初始化網頁的時區支援：

    ```kotlin
    @JsModule("@js-joda/timezone")
    external object JsJodaTimeZoneModule
    
    private val jsJodaTz = JsJodaTimeZoneModule
    ```

5. 再次執行應用程式並輸入一個有效的時區。
6. 點擊按鈕。您應該會看到正確的時間：

<tabs>
    <tab id="mobile-time-display" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-5.png" alt="Time display in the Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-time-display" title="桌面">
        <img src="first-compose-project-on-desktop-6.png" alt="Time display in the Compose Multiplatform app on desktop" width="350"/>
    </tab>
</tabs>

## 改善樣式

應用程式正在運作，但它的外觀存在一些問題。可組合項之間的間距可以更好，時間訊息可以呈現得更醒目。

1. 為了解決這些問題，請使用以下版本的 `App` 可組合項：

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

    * `modifier` 參數在 `Column` 周圍以及 `Button` 和 `TextField` 的頂部添加了內邊距。
    * `Text` 可組合項填滿可用水平空間並使其內容居中。
    * `style` 參數自訂 `Text` 的外觀。

2. 依照 IDE 的指示導入缺少的依賴項。
    對於 `Alignment`，請使用 `androidx.compose.ui` 版本。

3. 執行應用程式以查看外觀的改善：

<tabs>
    <tab id="mobile-improved-style" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-6.png" alt="Improved style of the Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-improved-style" title="桌面">
        <img src="first-compose-project-on-desktop-7.png" alt="Improved style of the Compose Multiplatform app on desktop" width="350"/>
    </tab>
</tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage2).
>
{style="tip"}
-->

## 重構設計

應用程式正在運作，但它容易受到錯字的影響。例如，如果使用者輸入「Franse」而不是「France」，應用程式將無法處理該輸入。最好要求使用者從預定義清單中選擇國家。

1. 為了實現這一點，請在 `App` 可組合項中更改設計：

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

   * 存在一個 `Country` 類型，由名稱和時區組成。
   * `currentTimeAt()` 函式將 `TimeZone` 作為其第二個參數。
   * `App` 現在需要一個國家列表作為參數。`countries()` 函式提供了該列表。
   * `DropdownMenu` 已取代了 `TextField`。`showCountries` 屬性的值決定了 `DropdownMenu` 的可見性。每個國家都有一個 `DropdownMenuItem`。

2. 依照 IDE 的指示導入缺少的依賴項。
3. 執行應用程式以查看重新設計的版本：

<tabs>
    <tab id="mobile-country-list" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-7.png" alt="The country list in the Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-country-list" title="桌面">
        <img src="first-compose-project-on-desktop-8.png" alt="The country list in the Compose Multiplatform app on desktop" width="350"/>
    </tab>
</tabs>

<!--
> You can find this state of the project in our [GitHub repository](https://github.com/kotlin-hands-on/get-started-with-cm/tree/main/ComposeDemoStage3).
>
{style="tip"}
-->

> 您可以使用依賴注入框架 (例如 [Koin](https://insert-koin.io/)) 來進一步改善設計，以建置和注入位置表格。如果資料儲存在外部，您可以使用 [Ktor](https://ktor.io/docs/create-client.html) 函式庫透過網路擷取資料，或使用 [SQLDelight](https://github.com/cashapp/sqldelight) 函式庫從資料庫擷取資料。
>
{style="note"}

## 引入圖片

國家名稱列表可以運作，但視覺上並不好看。您可以通過將名稱替換為國旗圖片來改善它。

Compose Multiplatform 提供了一個函式庫，用於透過所有平台的共通程式碼存取資源。Kotlin Multiplatform 精靈已經添加並配置了此函式庫，因此您可以開始載入資源，而無需修改建置檔案。

為了在您的專案中支援圖片，您需要下載圖片檔案、將它們儲存在正確的目錄中，並添加程式碼來載入和顯示它們：

1. 使用外部資源，例如 [Flag CDN](https://flagcdn.com/)，下載與您已建立的國家列表相符的國旗。在本例中，這些是 [日本](https://flagcdn.com/w320/jp.png)、[法國](https://flagcdn.com/w320/fr.png)、[墨西哥](https://flagcdn.com/w320/mx.png)、[印尼](https://flagcdn.com/w320/id.png) 和 [埃及](https://flagcdn.com/w320/eg.png)。

2. 將圖片移動到 `composeApp/src/commonMain/composeResources/drawable` 目錄，以便在所有平台上都可以使用相同的國旗：

   ![Compose Multiplatform resources project structure](compose-resources-project-structure.png){width=300}

3. 建置或執行應用程式以產生帶有新增資源存取器的 `Res` 類別。

4. 更新 `commonMain/kotlin/.../App.kt` 檔案中的程式碼以支援圖片：

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

    * `Country` 類型儲存了相關圖片的路徑。
    * 傳遞給 `App` 的國家列表包含這些路徑。
    * `App` 在每個 `DropdownMenuItem` 中顯示一個 `Image`，其後是一個帶有國家名稱的 `Text` 可組合項。
    * 每個 `Image` 都需要一個 `Painter` 物件來擷取資料。

5. 依照 IDE 的指示導入缺少的依賴項。
6. 執行應用程式以查看新行為：

<tabs>
    <tab id="mobile-flags" title="Android 和 iOS">
        <img src="first-compose-project-on-android-ios-8.png" alt="The country flags in the Compose Multiplatform app on Android and iOS" width="500"/>
    </tab>
    <tab id="desktop-flags" title="桌面">
        <img src="first-compose-project-on-desktop-9.png" alt="The country flags in the Compose Multiplatform app on desktop" width="350"/>
    </tab>
</tabs>

> 您可以在我們的 [GitHub 儲存庫](https://github.com/kotlin-hands-on/get-started-with-cm/) 中找到專案的最終狀態。
>
{style="note"}

## 下一步

我們鼓勵您進一步探索多平台開發並嘗試更多專案：

* [讓您的 Android 應用程式跨平台](multiplatform-integrate-in-existing-app.md)
* [使用 Ktor 和 SQLDelight 建立多平台應用程式](multiplatform-ktor-sqldelight.md)
* [在 iOS 和 Android 之間共享業務邏輯，同時保持 UI 原生](multiplatform-create-first-app.md)
* [使用 Kotlin/Wasm 建立 Compose Multiplatform 應用程式](https://kotlinlang.org/docs/wasm-get-started.html)
* [查看精選的範例專案列表](multiplatform-samples.md)

加入社群：

* ![GitHub](git-hub.svg){width=25}{type="joined"} **Compose Multiplatform GitHub**：為 [儲存庫](https://github.com/JetBrains/compose-multiplatform) 加星並貢獻
* ![Slack](slack.svg){width=25}{type="joined"} **Kotlin Slack**：獲取 [邀請函](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道
* ![Stack Overflow](stackoverflow.svg){width=25}{type="joined"} **Stack Overflow**：訂閱 ["kotlin-multiplatform" 標籤](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* ![YouTube](youtube.svg){width=25}{type="joined"} **Kotlin YouTube 頻道**：訂閱並觀看有關 [Kotlin Multiplatform](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的影片