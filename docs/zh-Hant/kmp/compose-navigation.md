[//]: # (title: Compose 中的導覽)

[Android 的 Navigation 函式庫](https://developer.android.com/guide/navigation) 支援 Jetpack Compose 中的導覽。
Compose Multiplatform 團隊為 AndroidX Navigation 函式庫貢獻了多平台支援。

除了應用程式內內容之間的實際導覽之外，該函式庫還解決了基本的導覽問題：

*   以型別安全的方式在目的地之間傳遞資料。
*   透過保持清晰易懂的導覽歷史記錄，輕鬆追蹤使用者在應用程式中的旅程。
*   支援深層連結（deep linking）機制，允許使用者在一般工作流程之外導覽至應用程式中的特定位置。
*   支援導覽時的統一動畫與轉場，並允許像返回手勢（back gestures）這類常見模式，且只需最少額外工作。

如果您對基礎知識已足夠熟悉，請繼續閱讀 [](compose-navigation-routing.md)，以了解如何在跨平台專案中利用 Navigation 函式庫。
否則，請繼續閱讀以了解該函式庫所使用的基本概念。

> 您可以在我們的 [最新消息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) 中追蹤 Navigation 函式庫多平台版本的變更，或在 [Compose Multiplatform 變更日誌](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中關注特定的 EAP 版本發布。
>
{style="tip"}

## Compose Navigation 的基本概念

Navigation 函式庫使用以下概念來對應導覽使用情境：

*   一個 _導覽圖（navigation graph）_ 描述了應用程式中所有可能的目的地以及它們之間的連接。導覽圖可以巢狀化以適應應用程式中的子流程。
*   一個 _目的地（destination）_ 是導覽圖中可以導覽到的節點。這可以是一個可組合項（composable）、一個巢狀導覽圖，或一個對話方塊。當使用者導覽至該目的地時，應用程式會顯示其內容。
*   一個 _路由（route）_ 識別一個目的地，並定義導覽到該目的地所需的引數（arguments），但它不描述 UI。透過這種方式，資料與呈現分離，這允許您保持每個 UI 實作部分獨立於整體應用程式結構。這使得，例如，測試和重新排列專案中的可組合項變得更容易。

考量到這些概念，Navigation 函式庫實作了基本規則來引導您的導覽架構：

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   應用程式將使用者的路徑表示為目的地的堆疊，或稱 _返回堆疊（back stack）_。預設情況下，每當使用者導覽到一個新目的地時，該目的地會被加入堆疊的頂部。您可以使用返回堆疊使導覽更直接：無需直接來回導覽，您可以將目前目的地從堆疊頂部彈出，並自動返回到前一個目的地。
*   每個目的地可以關聯一組 _深層連結（deep links）_：當應用程式從作業系統接收到連結時，應導向該目的地的 URI 模式。

## 基本導覽範例

若要使用 Navigation 函式庫，請將以下依賴項加入您的 `commonMain` 原始碼集：

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

> Compose Multiplatform %org.jetbrains.compose% 需要 Navigation 函式庫版本 %org.jetbrains.androidx.navigation%。
>
{style="note"}

按以下順序處理設定導覽的必要步驟是合理的：

1.  定義您的路由。為每個目的地建立一個 [可序列化（serializable）](https://kotlinlang.org/docs/serialization.html) 物件或資料類別，以保存對應目的地所需的引數。
2.  建立一個 `NavController`，它將是您的導覽介面，位於可組合項層級結構中足夠高的位置，以便所有可組合項都能存取它。NavController 負責維護應用程式的返回堆疊，並提供在導覽圖中目的地之間轉換的方法。
3.  設計您的導覽圖，選擇其中一個路由作為起始目的地。為此，建立一個 `NavHost` 可組合項，它包含導覽圖（描述所有可導覽的目的地）。

以下是應用程式內部導覽基礎的入門範例：

```kotlin
// 建立路由
@Serializable
object Profile
@Serializable
object FriendsList

// 建立 NavController
val navController = rememberNavController()

// 使用提供的目的地建立包含導覽圖的 NavHost
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // 您可以類似地添加更多目的地
}
```

### Navigation 函式庫的主要類別

Navigation 函式庫提供了以下核心型別：

*   `NavController`。
    提供核心導覽功能的 API：目的地之間的轉換、處理深層連結、管理返回堆疊等。
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`。根據導覽圖顯示目前目的地內容的可組合項。
    每個 NavHost 都有一個必需的 `startDestination` 參數：此目的地對應於使用者啟動應用程式時應看到的第一個畫面。
*   `NavGraph`。
    描述應用程式中所有可能目的地及其之間的連接。導覽圖通常被定義為傳回 `NavGraph` 的建構器 lambda，例如在 `NavHost` 宣告中。

除了核心型別功能之外，Navigation 元件還提供動畫與轉場、深層連結支援、型別安全、`ViewModel` 支援，以及其他改善開發體驗的功能，用於處理應用程式導覽。

## 導覽使用情境

### 導覽至目的地

若要導覽至目的地，請呼叫 `NavController.navigate()` 函式。繼續上述範例：

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("前往個人資料")
}
```

### 將引數傳遞至目的地

設計導覽圖時，您可以將路由定義為帶有參數的資料類別，例如：

```kotlin
@Serializable
data class Profile(val name: String)
```

若要將引數傳遞至目的地，請在導覽至目的地時，將引數傳遞給對應的類別建構函式。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("前往個人資料")
}
```

然後在目的地處擷取資料：

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // 在需要使用者名稱的地方使用 `profile.name`
}
```

### 導覽時擷取複雜資料

在目的地之間導覽時，請考慮僅傳遞之間所需的最少資訊。反映應用程式一般狀態的檔案或複雜物件應儲存在資料層：當使用者到達目的地時，UI 應從單一資料來源載入實際資料。

例如：

*   **不要**傳遞整個使用者個人資料；**要**傳遞使用者 ID 以便在目的地擷取個人資料。
*   **不要**傳遞圖片物件；**要**傳遞 URI 或檔案名稱，以便在目的地從來源載入圖片。
*   **不要**傳遞應用程式狀態或 ViewModels；**要**僅傳遞目的地畫面運作所需的資訊。

這種方法有助於防止在組態變更期間的資料遺失，以及在參照物件更新或變異時的任何不一致。

請參閱 [Android 關於資料層的文章](https://developer.android.com/topic/architecture/data-layer)，以獲取有關在應用程式中正確實作資料層的指導。

### 管理返回堆疊

返回堆疊由 `NavController` 類別控制。就像任何其他堆疊一樣，`NavController` 將新項目推入堆疊頂部並從頂部彈出它們：

*   當應用程式啟動時，返回堆疊中顯示的第一個條目是在 NavHost 中定義的起始目的地。
*   每個 `NavController.navigate()` 呼叫預設都會將指定目的地推入堆疊頂部。
*   使用返回手勢、返回按鈕或 `NavController.popBackStack()` 方法會將目前目的地從堆疊中彈出，並將使用者返回到前一個目的地。如果使用者透過深層連結到達目前目的地，彈出堆疊會將他們返回到上一個應用程式。另外，`NavController.navigateUp()` 函式僅在 `NavController` 的上下文中將使用者導覽至應用程式內部。

Navigation 函式庫允許在處理返回堆疊時具有一定的靈活性。您可以：

*   指定返回堆疊中的特定目的地並導覽至該處，彈出堆疊中位於該目的地之上（在其之後出現）的所有內容。
*   導覽至目的地 X，同時將返回堆疊彈出至目的地 Y（透過向 `.navigate()` 呼叫添加 `popUpTo()` 引數）。
*   處理彈出空返回堆疊（這將使使用者進入空白畫面）。
*   為應用程式的不同部分維護多個返回堆疊。例如，對於帶有底部導覽的應用程式，您可以在切換標籤時為每個標籤維護單獨的巢狀圖，同時儲存和恢復導覽狀態。另外，您可以為每個標籤建立單獨的 NavHosts，這會使設定稍微複雜一些，但在某些情況下可能更容易追蹤。

有關詳細資訊和使用情境，請參閱 [Jetpack Compose 關於返回堆疊的說明文件](https://developer.android.com/guide/navigation/backstack)。

### 深層連結

Navigation 函式庫允許您將特定的 URI、動作或 MIME 類型與目的地關聯。這種關聯稱為 _深層連結（deep link）_。

預設情況下，深層連結不會暴露給外部應用程式：您需要為每個目標發行版向作業系統註冊適當的 URI 方案。

有關建立、註冊和處理深層連結的詳細資訊，請參閱 [](compose-navigation-deep-links.md)。

### 返回手勢

多平台 Navigation 函式庫將每個平台上的返回手勢轉換為導覽到前一個畫面（例如，在 iOS 上這是一個簡單的向後滑動，而在桌面端則是 <shortcut>Esc</shortcut> 鍵）。

預設情況下，在 iOS 上，返回手勢會觸發類似原生的滑動轉場動畫到另一個畫面。如果您使用 `enterTransition` 或 `exitTransition` 引數自訂 NavHost 動畫，預設動畫將不會觸發：

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // 明確指定轉場會關閉預設動畫
    // 而偏好選定的動畫
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

在 Android 上，您可以在 [manifest 檔案](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive) 中啟用或停用返回手勢處理器。

在 iOS 上，處理器預設為啟用。若要停用它，請在 ViewController 配置中設定此旗標：

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 替代導覽方案

如果基於 Compose 的導覽實作不適合您，可以評估以下第三方替代方案：

| Name                                                | Description                                                  |
|:----------------------------------------------------|:-------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 一種實用的導覽方法                                           |
| [Decompose](https://arkivanov.github.io/Decompose/) | 一種進階的導覽方法，涵蓋完整的生命週期和任何潛在的依賴注入   |
| [Circuit](https://slackhq.github.io/circuit/)       | 一種針對 Kotlin 應用程式的 Compose 驅動架構，具備導覽和進階狀態管理功能。 |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 模型驅動的導覽，具備手勢控制                                 |
| [PreCompose](https://tlaster.github.io/PreCompose/) | 一種受 Jetpack Lifecycle、ViewModel、LiveData 和 Navigation 啟發的導覽和檢視模型 |

## 後續步驟

Compose 導覽在 Android Developer 入口網站上有深入的介紹。儘管這些說明文件有時僅使用 Android 範例，但基本指導和導覽原則對於多平台而言是相同的：

*   [Compose 導覽概述](https://developer.android.com/develop/ui/compose/navigation)。
*   [Jetpack Navigation 的起始頁面](https://developer.android.com/guide/navigation)，其中包含關於導覽圖、如何在其中移動以及其他導覽使用情境的子頁面。