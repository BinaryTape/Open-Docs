[//]: # (title: 在 iOS 和 Android 之間共享更多邏輯)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行，這兩個 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是「<strong>建立具有共享邏輯和原生 UI 的 Kotlin Multiplatform 應用程式</strong>」教學的第四部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">建立您的 Kotlin Multiplatform 應用程式</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">更新使用者介面</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-dependencies.md">新增依賴項</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>共享更多邏輯</strong><br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成您的專案<br/>
    </p>
</tldr>

現在您已經使用外部依賴項實作了通用邏輯，您可以開始新增更複雜的邏輯。網路請求和資料序列化是使用 Kotlin Multiplatform 共享程式碼的[最受歡迎的用途](https://kotlinlang.org/lp/multiplatform/)。了解如何在您的第一個應用程式中實作這些功能，以便在完成此入門旅程後，您可以在未來的專案中使用它們。

更新後的應用程式將透過網路從 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) 擷取資料，並顯示 SpaceX 火箭上次成功發射的日期。

> 您可以在我們 GitHub 儲存庫的兩個分支中找到專案的最終狀態，它們具有不同的協程解決方案：
> * `main` 分支包含 KMP-NativeCoroutines 實作，
> * `main-skie` 分支包含 SKIE 實作。
>
{style="note"}

## 新增更多依賴項

您需要在專案中新增以下多平台函式庫：

* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)，用於在非同步程式碼中使用協程，這允許同時操作。
* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)，用於將 JSON 回應反序列化為實體類別的物件，以處理網路操作。
* [Ktor](https://ktor.io/)，一個用於建立 HTTP 用戶端以透過網路擷取資料的框架。

### kotlinx.coroutines

要將 `kotlinx.coroutines` 新增到您的專案中，請在通用原始碼集中指定依賴項。為此，請將以下行新增到共享模組的 `build.gradle.kts` 檔案中：

```kotlin
kotlin {
    // ... 
    sourceSets {
        commonMain.dependencies {
           // ...
           implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

多平台 Gradle 外掛程式會自動將依賴項新增到 `kotlinx.coroutines` 的平台特定（iOS 和 Android）部分。

### kotlinx.serialization

要使用 `kotlinx.serialization` 函式庫，請設定對應的 Gradle 外掛程式。為此，請將以下行新增到共享模組的 `build.gradle.kts` 檔案開頭的現有 `plugins {}` 區塊中：

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

您需要將核心依賴項 (`ktor-client-core`) 新增到共享模組的通用原始碼集。您還需要新增支援依賴項：

* 新增 `ContentNegotiation` 功能 (`ktor-client-content-negotiation`)，它允許以特定格式序列化和反序列化內容。
* 新增 `ktor-serialization-kotlinx-json` 依賴項，以指示 Ktor 使用 JSON 格式和 `kotlinx.serialization` 作為序列化函式庫。Ktor 將預期 JSON 資料並在接收回應時將其反序列化為資料類別。
* 透過在平台原始碼集中新增對應 Artifact 的依賴項 (`ktor-client-android`、`ktor-client-darwin`)，提供平台引擎。

```kotlin
kotlin {
    // ...
    val ktorVersion = "%ktorVersion%"

    sourceSets {
        commonMain.dependencies {
            // ...

            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

點擊 **Sync Gradle Changes** 按鈕同步 Gradle 檔案。

## 建立 API 請求

您將需要 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) 來擷取資料，並且將使用單一方法從 **v4/launches** 端點取得所有發射的列表。

### 新增資料模型

在 `shared/src/commonMain/kotlin/.../greetingkmp` 目錄中，建立一個新的 `RocketLaunch.kt` 檔案並新增一個資料類別，該類別儲存來自 SpaceX API 的資料：

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

* `RocketLaunch` 類別標記為 `@Serializable` 註解，以便 `kotlinx.serialization` 外掛程式可以自動為其產生預設序列化器。
* `@SerialName` 註解允許您重新定義欄位名稱，從而可以在資料類別中宣告屬性時使用更具可讀性的名稱。

### 連接 HTTP 用戶端

1. 在 `shared/src/commonMain/kotlin/.../greetingkmp` 目錄中，建立一個新的 `RocketComponent` 類別。
2. 新增 `httpClient` 屬性以透過 HTTP GET 請求擷取火箭發射資訊：

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class RocketComponent {
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

   * [ContentNegotiation Ktor 外掛程式](https://ktor.io/docs/serialization-client.html#register_json)和 JSON 序列化器會反序列化 GET 請求的結果。
   * 這裡的 JSON 序列化器配置為使用 `prettyPrint` 屬性以更具可讀性的方式印出 JSON。它在使用 `isLenient` 讀取格式不正確的 JSON 時更具彈性，並且使用 `ignoreUnknownKeys` 忽略在火箭發射模型中尚未宣告的鍵。

3. 將 `getDateOfLastSuccessfulLaunch()` 掛起函式新增到 `RocketComponent`：

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
       
       }
   }
   ```

4. 呼叫 `httpClient.get()` 函式以擷取有關火箭發射的資訊：

   ```kotlin
   import io.ktor.client.request.*
   import io.ktor.client.call.*

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
       }
   }
   ```

   * `httpClient.get()` 也是一個掛起函式，因為它需要非同步地透過網路擷取資料而不會阻塞執行緒。
   * 掛起函式只能從協程或其他掛起函式中呼叫。這就是 `getDateOfLastSuccessfulLaunch()` 標記為 `suspend` 關鍵字的原因。網路請求在 HTTP 用戶端的執行緒池中執行。

5. 再次更新函式以在列表中尋找上次成功發射：

   ```kotlin
   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
       }
   }
   ```

   火箭發射列表按日期從最舊到最新排序。

6. 將發射日期從 UTC 轉換為您的本地日期並格式化輸出：

   ```kotlin
   import kotlinx.datetime.TimeZone
   import kotlinx.datetime.toLocalDateTime
   import kotlin.time.Instant

   class RocketComponent {
       // ...
       
       private suspend fun getDateOfLastSuccessfulLaunch(): String {
           val rockets: List<RocketLaunch> =
               httpClient.get("https://api.spacexdata.com/v4/launches").body()
           val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
           val date = Instant.parse(lastSuccessLaunch.launchDateUTC)
               .toLocalDateTime(TimeZone.currentSystemDefault())
       
           return "${date.month} ${date.day}, ${date.year}"
       }
   }
   ```

   日期將是「MMMM DD, YYYY」格式，例如，OCTOBER 5, 2022。

7. 新增另一個掛起函式 `launchPhrase()`，它將使用 `getDateOfLastSuccessfulLaunch()` 函式建立訊息：

    ```kotlin
    class RocketComponent {
        // ...
    
        suspend fun launchPhrase(): String =
            try {
                "The last successful launch was on ${getDateOfLastSuccessfulLaunch()} 🚀"
            } catch (e: Exception) {
                println("Exception during getting the date of the last successful launch $e")
                "Error occurred"
            }
    }
    ```

### 建立流程

您可以使用流程（Flows）而不是掛起函式（suspending functions）。它們發出一系列值，而不是掛起函式回傳的單一值。

1. 開啟 `shared/src/commonMain/kotlin` 目錄中的 `Greeting.kt` 檔案。
2. 將 `rocketComponent` 屬性新增到 `Greeting` 類別。該屬性將儲存包含上次成功發射日期的訊息：

   ```kotlin
   private val rocketComponent = RocketComponent()
   ```

3. 將 `greet()` 函式變更為回傳一個 `Flow`：

    ```kotlin
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.flow
    import kotlin.time.Duration.Companion.seconds
    
    class Greeting {
        // ...
        fun greet(): Flow<String> = flow {
            emit(if (Random.nextBoolean()) "Hi!" else "Hello!")
            delay(1.seconds)
            emit("Guess what this is! > ${platform.name.reversed()}")
            delay(1.seconds)
            emit(daysPhrase())
            emit(rocketComponent.launchPhrase())
        }
    }
    ```

   * 這裡使用 `flow()` 建構器函式建立 `Flow`，它包裝了所有陳述式。
   * `Flow` 以一秒的延遲發出字串，每次發出之間間隔一秒。最後一個元素只有在網路回應返回後才會發出，因此確切的延遲取決於您的網路。

### 新增網際網路存取權限

要存取網際網路，Android 應用程式需要適當的權限。由於所有網路請求都來自共享模組，因此將網際網路存取權限新增到其 Manifest 中是合乎情理的。

使用存取權限更新您的 `composeApp/src/androidMain/AndroidManifest.xml` 檔案：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    ...
</manifest>
```

您已經透過將 `greet()` 函式的回傳型別更改為 `Flow` 來更新了共享模組的 API。現在您需要更新專案的原生部分，以便它們可以正確處理呼叫 `greet()` 函式的結果。

## 更新原生 Android UI

由於共享模組和 Android 應用程式都是用 Kotlin 編寫的，因此從 Android 使用共享程式碼非常簡單。

### 引入 ViewModel

現在應用程式變得更加複雜，是時候為名為 `MainActivity` 的 [Android 活動](https://developer.android.com/guide/components/activities/intro-activities)引入一個 ViewModel 了。它調用實作 UI 的 `App()` 函式。ViewModel 將管理來自活動的資料，並且在活動經歷生命週期變更時不會消失。

1. 將以下依賴項新增到您的 `composeApp/build.gradle.kts` 檔案中：

    ```kotlin
    androidMain.dependencies {
        // ...
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
        implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.2")
        implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    }
    ```

2. 在 `composeApp/src/androidMain/kotlin/com/jetbrains/greeting/greetingkmp` 目錄中，建立一個新的 `MainViewModel` Kotlin 類別：

    ```kotlin
    import androidx.lifecycle.ViewModel
    
    class MainViewModel : ViewModel() {
        // ...
    }
    ```

   此類別擴展 Android 的 `ViewModel` 類別，這確保了生命週期和配置變更的正確行為。

3. 建立一個 [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/) 型別的 `greetingList` 值及其支援屬性：

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```

   * 這裡的 `StateFlow` 擴展 `Flow` 介面，但只有單一值或狀態。
   * 私有支援屬性 `_greetingList` 確保只有此類別的用戶端可以存取唯讀的 `greetingList` 屬性。

4. 在 ViewModel 的 `init` 函式中，收集來自 `Greeting().greet()` 流程的所有字串：

    ```kotlin
   import androidx.lifecycle.viewModelScope
   import kotlinx.coroutines.launch
   
   class MainViewModel : ViewModel() {
       private val _greetingList = MutableStateFlow<List<String>>(listOf())
       val greetingList: StateFlow<List<String>> get() = _greetingList
       
       init {
           viewModelScope.launch {
               Greeting().greet().collect { phrase ->
                    //...
               }
           }
       }
    }
    ```

   由於 `collect()` 函式是掛起的，因此 `launch` 協程在 ViewModel 的作用域內使用。這意味著 `launch` 協程將僅在 ViewModel 生命週期的正確階段執行。

5. 在 `collect` 後置 Lambda 內部，更新 `_greetingList` 的值，將收集到的 `phrase` 附加到 `list` 中的詞組列表：

    ```kotlin
    import kotlinx.coroutines.flow.update
   
    class MainViewModel : ViewModel() {
        //...
   
        init {
            viewModelScope.launch {
                Greeting().greet().collect { phrase ->
                    _greetingList.update { list -> list + phrase }
                }
            }
        }
    }
    ```

   `update()` 函式將自動更新值。

### 使用 ViewModel 的流程

1. 在 `composeApp/src/androidMain/kotlin` 中，開啟 `App.kt` 檔案並更新它，替換先前的實作：

    ```kotlin
    import androidx.lifecycle.compose.collectAsStateWithLifecycle
    import androidx.compose.runtime.getValue
    import androidx.lifecycle.viewmodel.compose.viewModel
    
    @Composable
    fun App(mainViewModel: MainViewModel = viewModel()) {
        MaterialTheme {
            val greetings by mainViewModel.greetingList.collectAsStateWithLifecycle()
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greetings.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

   * `collectAsStateWithLifecycle()` 函式呼叫 `greetingList` 以從 ViewModel 的流程中收集值，並以生命週期感知方式將其表示為可組合狀態。
   * 當建立新的流程時，組合狀態將會改變，並顯示一個可滾動的 `Column`，其中包含垂直排列並由分隔線分隔的問候語詞組。

2. 要查看結果，請重新執行您的 **composeApp** 配置：

   ![Final results](multiplatform-mobile-upgrade-android.png){width=300}

## 更新原生 iOS UI

對於專案的 iOS 部分，您將再次利用 [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model–view–viewmodel) 模式來連接 UI 到包含所有業務邏輯的共享模組。

該模組已在 `ContentView.swift` 檔案中透過 `import Shared` 宣告匯入。

### 引入 ViewModel

在 `iosApp/ContentView.swift` 中，為 `ContentView` 建立一個 `ViewModel` 類別，它將為其準備和管理資料。在 `task()` 呼叫內呼叫 `startObserving()` 函式以支援並行：

```swift
import SwiftUI
import Shared

struct ContentView: View {
    @ObservedObject private(set) var viewModel: ViewModel

    var body: some View {
        ListView(phrases: viewModel.greetings)
            .task { await self.viewModel.startObserving() }
    }
}

extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: Array<String> = []
        
        func startObserving() {
            // ...
        }
    }
}

struct ListView: View {
    let phrases: Array<String>

    var body: some View {
        List(phrases, id: \.self) {
            Text($0)
        }
    }
}
```

* `ViewModel` 宣告為 `ContentView` 的擴展，因為它們密切相關。
* `ViewModel` 有一個 `greetings` 屬性，它是一個 `String` 詞組的陣列。
  SwiftUI 將 ViewModel (`ContentView.ViewModel`) 與視圖 (`ContentView`) 連接起來。
* `ContentView.ViewModel` 宣告為 `ObservableObject`。
* `@Published` 包裝器用於 `greetings` 屬性。
* `@ObservedObject` 屬性包裝器用於訂閱 ViewModel。

這個 ViewModel 將在該屬性變更時發出訊號。現在您需要實作 `startObserving()` 函式來消費流程。

### 選擇一個函式庫來從 iOS 消費流程

在本教學中，您可以使用 [SKIE](https://skie.touchlab.co/) 或 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 函式庫來幫助您在 iOS 中使用流程。
兩者都是開源解決方案，支援流程的取消和泛型，而 Kotlin/Native 編譯器尚未預設提供這些功能：

* SKIE 函式庫增強了 Kotlin 編譯器產生的 Objective-C API：SKIE 將流程轉換為 Swift `AsyncSequence` 的等效形式。SKIE 直接支援 Swift 的 `async`/`await`，沒有執行緒限制，並具有自動雙向取消功能（Combine 和 RxSwift 需要轉接器）。SKIE 提供其他功能，可從 Kotlin 產生 Swift 友善的 API，包括將各種 Kotlin 型別橋接至 Swift 等效型別。它也不需要在 iOS 專案中新增額外的依賴項。
* KMP-NativeCoroutines 函式庫透過產生必要的包裝器，幫助您從 iOS 消費掛起函式和流程。
  KMP-NativeCoroutines 支援 Swift 的 `async`/`await` 功能以及 Combine 和 RxSwift。
  使用 KMP-NativeCoroutines 需要在 iOS 專案中新增 SPM 或 CocoaPod 依賴項。

### 選項 1. 配置 KMP-NativeCoroutines {initial-collapse-state="collapsed" collapsible="true"}

> 我們建議使用此函式庫的最新版本。
> 查看 [KMP-NativeCoroutines 儲存庫](https://github.com/rickclephas/KMP-NativeCoroutines/releases)以查看是否有更新版本的外掛程式可用。
>
{style="note"}

1. 在專案的根 `build.gradle.kts` 檔案中（**不是** `shared/build.gradle.kts` 檔案），將 KSP (Kotlin Symbol Processor) 和 KMP-NativeCoroutines 外掛程式新增到 `plugins {}` 區塊：

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp").version("%kspVersion%").apply(false)
        id("com.rickclephas.kmp.nativecoroutines").version("%kmpncVersion%").apply(false)
    }
    ```

2. 在 `shared/build.gradle.kts` 檔案中，新增 KMP-NativeCoroutines 外掛程式：

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp")
        id("com.rickclephas.kmp.nativecoroutines")
    }
    ```

3. 也在 `shared/build.gradle.kts` 檔案中，選擇啟用實驗性的 `@ObjCName` 註解：

    ```kotlin
    kotlin {
        // ...
        sourceSets{
            all {
                languageSettings {
                    optIn("kotlin.experimental.ExperimentalObjCName")
                    optIn("kotlin.time.ExperimentalTime")
                }
            }
            // ...
        }
    }
    ```

4. 點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案。

#### 使用 KMP-NativeCoroutines 標記流程

1. 開啟 `shared/src/commonMain/kotlin` 目錄中的 `Greeting.kt` 檔案。
2. 將 `@NativeCoroutines` 註解新增到 `greet()` 函式。這將確保外掛程式產生正確的程式碼以支援 iOS 上正確的流程處理：

   ```kotlin
    import com.rickclephas.kmp.nativecoroutines.NativeCoroutines
    
    class Greeting {
        // ...
       
        @NativeCoroutines
        fun greet(): Flow<String> = flow {
            // ...
        }
    }
    ```

#### 在 XCode 中使用 SPM 匯入函式庫

1. 前往 **File** | **Open Project in Xcode**。
2. 在 Xcode 中，右鍵點擊左側選單中的 `iosApp` 專案，然後選擇 **Add Package Dependencies**。
3. 在搜尋欄中，輸入套件名稱：

     ```none
    https://github.com/rickclephas/KMP-NativeCoroutines.git
    ```

   ![Importing KMP-NativeCoroutines](multiplatform-import-kmp-nativecoroutines.png){width=700}

4. 在 **Dependency Rule** 下拉選單中，選擇 **Exact Version** 項目，並在相鄰欄位中輸入 `%kmpncVersion%` 版本。
5. 點擊 **Add Package** 按鈕：Xcode 將從 GitHub 擷取套件並開啟另一個視窗以選擇套件產品。
6. 將「KMPNativeCoroutinesAsync」和「KMPNativeCoroutinesCore」新增到您的應用程式中，如圖所示，然後點擊 **Add Package**：

   ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=500}

這應該會安裝 KMP-NativeCoroutines 套件中用於使用 `async/await` 機制所需的部分。

#### 使用 KMP-NativeCoroutines 函式庫消費流程

1. 在 `iosApp/ContentView.swift` 中，更新 `startObserving()` 函式以使用 KMP-NativeCoroutines 的 `asyncSequence()` 函式來消費 `Greeting().greet()` 函式的流程：

    ```Swift
    func startObserving() async {
        do {
            let sequence = asyncSequence(for: Greeting().greet())
            for try await phrase in sequence {
                self.greetings.append(phrase)
            }
        } catch {
            print("Failed with error: \(error)")
        }
    }
    ```

   這裡的迴圈和 `await` 機制用於遍歷流程，並在每次流程發出值時更新 `greetings` 屬性。

2. 確保 `ViewModel` 標記為 `@MainActor` 註解。該註解確保 `ViewModel` 內的所有非同步操作在主執行緒上執行，以符合 Kotlin/Native 要求：

    ```Swift
    // ...
    import KMPNativeCoroutinesAsync
    import KMPNativeCoroutinesCore
    
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
    
            func startObserving() async {
                do {
                    let sequence = asyncSequence(for: Greeting().greet())
                    for try await phrase in sequence {
                        self.greetings.append(phrase)
                    }
                } catch {
                    print("Failed with error: \(error)")
                }
            }
        }
    }
    ```

### 選項 2. 配置 SKIE {initial-collapse-state="collapsed" collapsible="true"}

要設定該函式庫，請在 `shared/build.gradle.kts` 中指定 SKIE 外掛程式，然後點擊 **Sync Gradle Changes** 按鈕。

```kotlin
plugins {
   id("co.touchlab.skie") version "%skieVersion%"
}
```

#### 使用 SKIE 消費流程

您將使用迴圈和 `await` 機制來遍歷 `Greeting().greet()` 流程，並在每次流程發出值時更新 `greetings` 屬性。

確保 `ViewModel` 標記為 `@MainActor` 註解。
該註解確保 `ViewModel` 內的所有非同步操作在主執行緒上執行，以符合 Kotlin/Native 要求：

```Swift
// ...
extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: [String] = []

        func startObserving() async {
            for await phrase in Greeting().greet() {
                self.greetings.append(phrase)
            }
        }
    }
}
```

### 消費 ViewModel 並執行 iOS 應用程式

在 `iosApp/iOSApp.swift` 中，更新應用程式的進入點：

```swift
@main
struct iOSApp: App {
   var body: some Scene {
       WindowGroup {
           ContentView(viewModel: ContentView.ViewModel())
       }
   }
}
```

從 IntelliJ IDEA 執行 **iosApp** 配置，以確保應用程式邏輯已同步：

![Final results](multiplatform-mobile-upgrade-ios.png){width=300}

> 您可以在我們 GitHub 儲存庫的兩個分支中找到專案的最終狀態，它們具有不同的協程解決方案：
> * `main` 分支包含 KMP-NativeCoroutines 實作，
> * `main-skie` 分支包含 SKIE 實作。
>
{style="note"}

## 下一步

在本教學的最後部分，您將完成您的專案並查看接下來要採取的步驟。

**[繼續前往下一部分](multiplatform-wrap-up.md)**

### 另請參閱

* 探索[掛起函式的組合](https://kotlinlang.org/docs/composing-suspending-functions.html)的各種方法。
* 了解更多關於與 [Objective-C 框架和函式庫的互通性](https://kotlinlang.org/docs/native-objc-interop.html)。
* 完成本教學關於[網路和資料儲存](multiplatform-ktor-sqldelight.md)。

## 尋求協助

* **Kotlin Slack**。[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[回報新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。