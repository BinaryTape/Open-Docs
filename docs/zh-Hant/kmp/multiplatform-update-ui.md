[//]: # (title: 更新使用者介面)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作 – 這兩個 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>
    <p>這是<strong>使用共享邏輯和原生 UI 建立 Kotlin Multiplatform 應用程式</strong>教程的第二部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作 – 這兩個 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。這是使用共享邏輯和原生 UI 建立 Kotlin Multiplatform 應用程式教程的第一部分。建立您的 Kotlin Multiplatform 應用程式 更新使用者介面 新增依賴項 共享更多邏輯 完成您的專案">建立您的 Kotlin Multiplatform 應用程式</Links><br/>
       <img src="icon-2.svg" width="20" alt="第二步"/> <strong>更新使用者介面</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> 新增依賴項<br/>       
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多邏輯<br/>
       <img src="icon-5-todo.svg" width="20" alt="第五步"/> 完成您的專案<br/>
    </p>
</tldr>

為了建立使用者介面，您將使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 工具包來構建專案的 Android 部分，並使用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 來構建 iOS 部分。
這兩者都是宣告式 UI 框架，您會在 UI 實作中看到相似之處。在這兩種情況下，您都會將資料儲存在 `phrases` 變數中，然後對其進行迭代以產生 `Text` 項目的清單。

## 更新 Android 部分

`composeApp` 模組包含一個 Android 應用程式，定義其主要活動和 UI 視圖，並將 `shared` 模組作為常規 Android 程式庫使用。該應用程式的 UI 使用 Compose Multiplatform 框架。

進行一些變更，看看它們如何反映在 UI 中：

1. 導覽至 `composeApp/src/androidMain/.../greetingkmp` 目錄中的 `App.kt` 檔案。
2. 找到 `Greeting` 類別的呼叫。選取 `greet()` 函式，右鍵點擊它，然後選取 **Go To** | **Declaration or Usages**。
   您會看到它是您在上一步編輯的 `shared` 模組中的相同類別。
3. 在 `Greeting.kt` 檔案中，更新 `Greeting` 類別，使 `greet()` 函式回傳一個字串清單：

   ```kotlin
   class Greeting {
   
       private val platform: Platform = getPlatform()
   
       fun greet(): List<String> = buildList {
           add(if (Random.nextBoolean()) "Hi!" else "Hello!")
           add("Guess what this is! > ${platform.name.reversed()}!")
       }
   }
   ```

4. 返回 `App.kt` 檔案並更新 `App()` 實作：

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

   在這裡，`Column` 可組合項顯示每個 `Text` 項目，在它們周圍新增邊距並在它們之間新增空間。

5. 遵循 IntelliJ IDEA 的建議匯入缺少的依賴項。
6. 現在您可以執行 Android 應用程式，查看它如何顯示字串清單：

   ![更新後的 Android 多平台應用程式 UI](first-multiplatform-project-on-android-2.png){width=300}

## 使用 iOS 模組

`iosApp` 目錄構建為一個 iOS 應用程式。它依賴並使用 `shared` 模組作為 iOS 框架。應用程式的 UI 以 Swift 編寫。

實作與 Android 應用程式相同的變更：

1. 在 IntelliJ IDEA 中，在 **Project** 工具視窗的專案根目錄中找到 `iosApp/iosApp` 資料夾。
2. 開啟 `iosApp/ContentView.swift` 檔案，右鍵點擊 `Greeting().greet()` 呼叫，然後選取 **Go To** | **Definition**。

    您會看到 `shared` 模組中定義的 Kotlin 函式的 Objective-C 宣告。從 Objective-C/Swift 使用 Kotlin 型別時，它們會表示為 Objective-C 型別。在這裡，`greet()` 函式在 Kotlin 中回傳 `List<String>`，從 Swift 看來則回傳 `NSArray<NSString>`。有關型別映射的更多資訊，請參閱[與 Swift/Objective-C 的互通性](https://kotlinlang.org/docs/native-objc-interop.html)。

3. 更新 SwiftUI 程式碼，以與 Android 應用程式相同的方式顯示項目清單：

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

    * `greet()` 呼叫的結果儲存在 `phrases` 變數中（Swift 中的 `let` 類似於 Kotlin 的 `val`）。
    * `List` 函式產生 `Text` 項目的清單。

4. 啟動 iOS 執行配置以查看變更：

    ![更新後的 iOS 多平台應用程式 UI](first-multiplatform-project-on-ios-2.png){width=300}

## 可能的問題與解決方案

### Xcode 報告呼叫共享框架的程式碼中存在錯誤

如果您正在使用 Xcode，您的 Xcode 專案可能仍在使用舊版本的框架。若要解決此問題，請返回 IntelliJ IDEA 並重建專案或啟動 iOS 執行配置。

### Xcode 在匯入共享框架時報告錯誤

如果您正在使用 Xcode，它可能需要清除快取二進位檔：嘗試在主選單中選擇 **Product | Clean Build Folder** 來重設環境。

## 下一步

在教程的下一部分中，您將了解依賴項並新增第三方程式庫以擴展專案的功能。

**[繼續到下一部分](multiplatform-dependencies.md)**

## 取得協助

* **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
* **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。