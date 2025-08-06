[//]: # (title: 更新使用者介面)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 — 兩個 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是 **建立具有共用邏輯和原生使用者介面的 Kotlin Multiplatform 應用程式** 教學的第二部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">建立您的 Kotlin Multiplatform 應用程式</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>更新使用者介面</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 新增依賴項<br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共用更多邏輯<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 總結您的專案<br/>
    </p>
</tldr>

為了建構使用者介面，您將使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 工具包來處理專案的 Android 部分，並使用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 來處理 iOS 部分。
這兩者都是宣告式使用者介面框架，您將在使用者介面實作中看到相似之處。在這兩種情況下，
您將資料儲存在 `phrases` 變數中，然後迭代該變數以產生 `Text` 項目列表。

## 更新 Android 部分

`composeApp` 模組包含一個 Android 應用程式，定義其主活動和使用者介面視圖，並將 `shared` 模組作為常規 Android 函式庫使用。應用程式的使用者介面使用 Compose Multiplatform 框架。

進行一些更改，看看它們如何在使用者介面中反映出來：

1.  導覽至 `composeApp/src/androidMain/kotlin` 中的 `App.kt` 檔案。
2.  找到 `Greeting` 類別的呼叫。選取 `greet()` 函數，右鍵點擊它，然後選擇 **Go To** | **Declaration or Usages**。
    您會看到它是您在上一步中編輯的 `shared` 模組中的相同類別。
3.  在 `Greeting.kt` 檔案中，更新 `greet()` 函數：

    ```kotlin
    import kotlin.random.Random

    fun greet(): List<String> = buildList {
        add(if (Random.nextBoolean()) "Hi!" else "Hello!")
        add("Guess what this is! > ${platform.name.reversed()}!")
    }
    ```

    現在它傳回一個字串列表。

4.  回到 `App.kt` 檔案並更新 `App()` 實作：

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            val greeting = remember { Greeting().greet() }

            Column(
                modifier = Modifier
                    .padding(all = 10.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greeting.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

    這裡的 `Column` 可組合項顯示每個 `Text` 項目，並在它們周圍新增邊距，以及它們之間新增間距。

5.  遵循 IntelliJ IDEA 的建議來匯入缺少的依賴項。
6.  現在您可以執行 Android 應用程式，看看它如何顯示字串列表：

    ![Updated UI of Android multiplatform app](first-multiplatform-project-on-android-2.png){width=300}

## 使用 iOS 模組

`iosApp` 目錄會建構為一個 iOS 應用程式。它依賴並使用 `shared` 模組作為一個 iOS 框架。應用程式的使用者介面是用 Swift 編寫的。

實作與 Android 應用程式中相同的更改：

1.  在 IntelliJ IDEA 中，在 **Project** 工具視窗中找到專案根目錄下的 `iosApp` 資料夾。
2.  開啟 `ContentView.swift` 檔案，右鍵點擊 `Greeting().greet()` 呼叫，然後選擇 **Go To** | **Definition**。

    您將看到 `shared` 模組中定義的 Kotlin 函數的 Objective-C 宣告。當從 Objective-C/Swift 使用 Kotlin 類型時，它們會被表示為 Objective-C 類型。在這裡，`greet()` 函數在 Kotlin 中傳回 `List<String>`，從 Swift 來看則傳回 `NSArray<NSString>`。有關類型映射的更多資訊，請參閱 [Interoperability with Swift/Objective-C](https://kotlinlang.org/docs/native-objc-interop.html)。

3.  更新 SwiftUI 程式碼，以與 Android 應用程式相同的方式顯示項目列表：

    ```Swift
    struct ContentView: View {
       let phrases = Greeting().greet()

       var body: some View {
           List(phrases, id: \.self) {
               Text($0)
           }
       }
    }
    ```

    *   `greet()` 呼叫的結果儲存在 `phrases` 變數中（Swift 中的 `let` 類似於 Kotlin 的 `val`）。
    *   `List` 函數產生一個 `Text` 項目列表。

4.  啟動 iOS 執行設定以查看更改：

    ![Updated UI of your iOS multiplatform app](first-multiplatform-project-on-ios-2.png){width=300}

## 可能的問題與解決方案

### Xcode 報告呼叫共用框架的程式碼中存在錯誤

如果您正在使用 Xcode，您的 Xcode 專案可能仍在使用舊版框架。
為了解決此問題，請返回 IntelliJ IDEA 並重建專案或啟動 iOS 執行設定。

### Xcode 在匯入共用框架時報告錯誤

如果您正在使用 Xcode，它可能需要清除快取的二進位檔：嘗試透過在主選單中選擇 **Product | Clean Build Folder** 來重設環境。

## 下一步

在本教學的下一部分中，您將了解依賴項並新增第三方函式庫以擴展專案的功能。

**[繼續前往下一部分](multiplatform-dependencies.md)**

## 取得協助

*   **Kotlin Slack**。取得 [邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並加入
    [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。 [報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。