[//]: # (title: Compose 中的導航)

[Android 的 Navigation 函式庫](https://developer.android.com/guide/navigation) 支援 Jetpack Compose 中的導航。Compose Multiplatform 團隊為 AndroidX Navigation 函式庫貢獻多平台支援。

除了應用程式中內容片段之間的實際導航之外，此函式庫解決基本的導航問題：

*   在目的地之間以型別安全的方式傳遞資料。
*   透過維護清晰且可存取的導航歷史記錄，輕鬆追蹤使用者在應用程式中的旅程。
*   支援深度連結機制，該機制允許在一般工作流程之外將使用者導航至應用程式中的特定位置。
*   在導航時支援統一的動畫和轉場效果，並允許常見模式（例如只需最少額外工作即可實現返回手勢）。

如果您對基礎知識感到足夠熟悉，請繼續閱讀[導航與路由](compose-navigation-routing.md)，以了解如何在跨平台專案中利用 Navigation 函式庫。否則，請繼續閱讀以了解此函式庫運作的基本概念。

> 您可以在我們的 [最新功能](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) 中追蹤 Navigation 函式庫多平台版本的變更，或在 [Compose Multiplatform 更新日誌](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) 中追蹤特定的 EAP 發行版本。
>
{style="tip"}

## Compose 導航的基本概念

Navigation 函式庫使用以下概念將導航使用案例對應到：

*   一個**導航圖**描述了應用程式中所有可能的目的地以及它們之間的連接。導航圖可以巢狀化以適應應用程式中的子流程。
*   一個**目的地**是導航圖中可以導航到的節點。這可以是 Composable、巢狀導航圖或對話方塊。當使用者導航到目的地時，應用程式會顯示其內容。
*   一個**路由**識別一個目的地並定義導航到它所需的引數，但它不描述 UI。如此一來，資料與表示分離，這讓您可以使每個 UI 實作片段獨立於整體應用程式結構。例如，這使得在您的專案中測試和重新排列 Composable 變得更容易。

請記住這些概念，Navigation 函式庫實作基本規則來引導您的導航架構：

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   應用程式將使用者的路徑表示為一個目的地堆疊，或**返回堆疊**。預設情況下，每當使用者導航到新目的地時，該目的地會被新增到堆疊的頂部。您可以利用返回堆疊使導航更直接：無需直接來回導航，您可以將目前目的地從堆疊頂部彈出，並自動返回到前一個目的地。
*   每個目的地都可以擁有一組與其關聯的**深度連結**：當應用程式從作業系統接收連結時，應導向該目的地的 URI 模式。

## 基本導航範例

若要使用 Navigation 函式庫，請將以下依賴項新增至您的 `commonMain` 原始碼集：

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

設定導航所需步驟的順序如下：

1.  定義您的路由。為每個目的地建立一個[可序列化](https://kotlinlang.org/docs/serialization.html)的物件或資料類別，以容納對應目的地所需的引數。
2.  建立一個 `NavController`，它將是您的導航介面，在 Composable 階層中足夠高，以便所有 Composable 都能存取它。`NavController` 負責維護應用程式的返回堆疊，並提供在導航圖中目的地之間轉換的方法。
3.  設計您的導航圖，選擇其中一個路由作為起始目的地。為此，建立一個 `NavHost` Composable，它包含導航圖（描述所有可導航的目的地）。

以下是在應用程式內導航基礎的簡單範例：

```kotlin
// Creates routes
@Serializable
object Profile
@Serializable
object FriendsList

// Creates the NavController
val navController = rememberNavController()

// Creates the NavHost with the navigation graph consisting of supplied destinations
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // You can add more destinations similarly
}
```

### Navigation 函式庫的主要類別

Navigation 函式庫提供以下核心型別：

*   `NavController`。提供核心導航功能的 API：目的地之間的轉換、處理深度連結、管理返回堆疊等。
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`。根據導航圖顯示目前目的地內容的 Composable。每個 `NavHost` 都有一個必需的 `startDestination` 參數：此目的地對應於使用者啟動應用程式時應看到的第一個畫面。
*   `NavGraph`。描述應用程式中所有可能的目的地以及它們之間的連接。導航圖通常定義為返回 `NavGraph` 的建構器 lambda，例如在 `NavHost` 宣告中。

除了核心型別功能之外，Navigation 元件提供動畫和轉場效果、深度連結支援、型別安全、`ViewModel` 支援，以及其他用於處理應用程式導航的品質生活功能。

## 導航使用案例

### 前往目的地

若要導航到目的地，請呼叫 `NavController.navigate()` 函式。繼續上述範例：

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 將引數傳遞給目的地

在設計導航圖時，您可以將路由定義為帶有參數的資料類別，例如：

```kotlin
@Serializable
data class Profile(val name: String)
```

若要將引數傳遞給目的地，請在導航到目的地時將引數傳遞給對應的類別建構函式。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

然後在目的地檢索資料：

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // Use `profile.name` wherever a user's name is needed
}
```

### 導航時檢索複雜資料

在目的地之間導航時，請考慮僅傳遞之間所需的最小資訊。一般而言，反映應用程式狀態的檔案或複雜物件應儲存在資料層：當使用者到達目的地時，UI 應從單一事實來源載入實際資料。

例如：

*   **不要**傳遞整個使用者設定檔；**請**傳遞使用者 ID 以在目的地檢索設定檔。
*   **不要**傳遞圖片物件；**請**傳遞 URI 或檔案名稱，以便從目的地來源載入圖片。
*   **不要**傳遞應用程式狀態或 ViewModels；**請**僅傳遞目的地畫面運作所需的資訊。

這種方法有助於防止在配置變更期間的資料遺失，以及在參照物件更新或變異時的任何不一致。

請參閱 [Android 關於資料層的文章](https://developer.android.com/topic/architecture/data-layer)，以獲取有關在應用程式中正確實作資料層的指導。

### 管理返回堆疊

返回堆疊由 `NavController` 類別控制。如同任何其他堆疊，`NavController` 將新項目推入堆疊頂部並從頂部彈出：

*   當應用程式啟動時，返回堆疊中顯示的第一個項目是 `NavHost` 中定義的起始目的地。
*   每個 `NavController.navigate()` 呼叫預設將給定目的地推送到堆疊頂部。
*   使用返回手勢、返回按鈕或 `NavController.popBackStack()` 方法會將目前目的地從堆疊中彈出，並將使用者返回到前一個目的地。如果使用者透過深度連結到達目前目的地，彈出堆疊會將他們返回到上一個應用程式。或者，`NavController.navigateUp()` 函式僅在 `NavController` 的上下文中在應用程式內導航使用者。

Navigation 函式庫允許在處理返回堆疊方面具有一些靈活性。您可以：

*   指定返回堆疊中的特定目的地並導航到它，彈出堆疊中位於該目的地之上（在其之後出現）的所有內容。
*   導航到目的地 X，同時將返回堆疊彈出至目的地 Y（透過向 `.navigate()` 呼叫新增 `popUpTo()` 引數）。
*   處理彈出空的返回堆疊（這會讓使用者停留在空白畫面）。
*   為應用程式的不同部分維護多個返回堆疊。例如，對於帶有底部導航的應用程式，您可以在每個分頁中維護單獨的巢狀圖，同時在分頁之間切換時儲存和恢復導航狀態。或者，您可以為每個分頁建立單獨的 NavHosts，這會使設定稍微複雜一些，但在某些情況下可能更容易追蹤。

請參閱 [Jetpack Compose 關於返回堆疊的說明文件](https://developer.android.com/guide/navigation/backstack) 以了解詳細資訊和使用案例。

### 深度連結

Navigation 函式庫可讓您將特定的 URI、動作或 MIME 型別與目的地關聯。此關聯稱為**深度連結**。

預設情況下，深度連結不會暴露給外部應用程式：您需要為每個目標發行版向作業系統註冊適當的 URI 方案。

有關建立、註冊和處理深度連結的詳細資訊，請參閱 [深度連結](compose-navigation-deep-links.md)。

### 返回手勢

多平台 Navigation 函式庫將每個平台上的返回手勢轉換為導航到前一個畫面（例如，在 iOS 上這是簡單的向後滑動，而在桌面上則是 <shortcut>Esc</shortcut> 鍵）。

預設情況下，在 iOS 上，返回手勢會觸發類似原生的滑動轉場到另一個畫面的動畫。如果您使用 `enterTransition` 或 `exitTransition` 引數自訂 NavHost 動畫，預設動畫將不會觸發：

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // Explicitly specifying transitions turns off default animations
    // in favor of the selected ones 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

在 Android 上，您可以在[資訊清單檔案](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)中啟用或禁用返回手勢處理程式。

在 iOS 上，處理程式預設為啟用。若要禁用它，請在 ViewController 配置中設定此旗標：

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 其他導航解決方案

如果基於 Compose 的導航實作不適合您，有第三方替代方案可供評估：

| 名稱                                                | 描述                                                                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | 實用的導航方法                                                                                                                              |
| [Decompose](https://arkivanov.github.io/Decompose/) | 涵蓋完整生命週期和任何潛在依賴注入的進階導航方法                                                        |
| [Circuit](https://slackhq.github.io/circuit/)       | 一種由 Compose 驅動的 Kotlin 應用程式架構，具備導航和進階狀態管理。                                                            |
| [Appyx](https://bumble-tech.github.io/appyx/)       | 帶手勢控制的模型驅動導航                                                                                                                    |
| [PreCompose](https://tlaster.github.io/PreCompose/) | 受 Jetpack Lifecycle、ViewModel、LiveData 和 Navigation 啟發的導航和視圖模型                                                                  |

## 接下來

Compose 導航在 Android 開發者入口網站上有深入涵蓋。儘管此說明文件有時使用僅限 Android 的範例，但基本指導和導航原則對於多平台是相同的：

*   [使用 Compose 進行導航概述](https://developer.android.com/develop/ui/compose/navigation)。
*   [Jetpack Navigation 起始頁面](https://developer.android.com/guide/navigation)，其中包含關於導航圖、在其中移動以及其他導航使用案例的子頁面。