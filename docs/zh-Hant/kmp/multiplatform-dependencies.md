[//]: # (title: 將依賴項新增至您的專案)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 — 兩個 IDE 都共用相同的核心功能和 Kotlin 多平台支援。</p>
    <br/>   
    <p>這是「**使用共享邏輯和原生 UI 建立 Kotlin 多平台應用程式**」教學的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/multiplatform-create-first-app" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the first part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">建立您的 Kotlin 多平台應用程式</Links><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <Links href="/kmp/multiplatform-update-ui" summary="This tutorial uses IntelliJ IDEA, but you can also follow it in Android Studio – both IDEs share the same core functionality and Kotlin Multiplatform support. This is the second part of the Create a Kotlin Multiplatform app with shared logic and native UI tutorial. Before proceeding, make sure you've completed previous steps. Create your Kotlin Multiplatform app Update the user interface Add dependencies Share more logic Wrap up your project">更新使用者介面</Links><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>新增依賴項</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 分享更多邏輯<br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 結束您的專案<br/>
    </p>
</tldr>

您已建立了您的第一個跨平台 Kotlin 多平台專案！現在，讓我們學習如何將依賴項新增至第三方函式庫，這對於建構成功的跨平台應用程式是必要的。

## 依賴項類型

在 Kotlin 多平台專案中，您可以使用兩種類型的依賴項：

*   _多平台依賴項_。這些是支援多個目標的多平台函式庫，可以在 `common` 原始碼集 (`commonMain`) 中使用。

    許多現代 Android 函式庫已經支援多平台，例如 [Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/) 和 [Okio](https://square.github.io/okio/)。在 [klibs.io](https://klibs.io/) 上尋找更多多平台函式庫，這是 JetBrains 用於發現 Kotlin 多平台函式庫的實驗性搜尋服務。

*   _原生依賴項_。這些是來自相關生態系統的常規函式庫。在原生專案中，您通常使用 Android 的 Gradle 和 iOS 的 CocoaPods 或其他依賴項管理器來使用它們。
  
    當您使用共享模組時，通常在您想要使用平台 API（例如安全儲存）時，仍然需要原生依賴項。您可以將原生依賴項新增至原生原始碼集 (`androidMain` 和 `iosMain`)。

對於這兩種依賴項類型，您可以使用本機和外部儲存庫。

## 新增多平台依賴項

> 如果您有開發 Android 應用程式的經驗，新增多平台依賴項與在常規 Android 專案中新增 Gradle 依賴項類似。唯一的區別是您需要指定原始碼集。
>
{style="tip"}

讓我們回到應用程式，讓問候語更具節日氣氛。除了設備資訊外，新增一個函數來顯示距離新年還有多少天。`kotlinx-datetime` 函式庫具有完整的多平台支援，是您在共享程式碼中處理日期的最便捷方式。

1.  開啟位於 `shared` 目錄中的 `build.gradle.kts` 檔案。
2.  將以下依賴項和 Kotlin 時間 opt-in 新增至 `commonMain` 原始碼集依賴項：

    ```kotlin
    kotlin {
        //... 
        sourceSets
            languageSettings.optIn("kotlin.time.ExperimentalTime")
            commonMain.dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.7.1")
            } 
        }
    }
    ```

3.  按一下「**同步 Gradle 變更**」按鈕以同步 Gradle 檔案：![同步 Gradle 檔案](gradle-sync.png){width=50}
4.  在 `shared/src/commonMain/kotlin` 中，在您的 `Greeting.kt` 檔案所在的專案目錄中建立一個新檔案 `NewYear.kt`。
5.  使用一個簡短的函數更新檔案，該函數使用日期時間（`date-time`）日期算術計算從今天到新年的天數：
   
   ```kotlin
   import kotlinx.datetime.*
   import kotlin.time.Clock
   
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   
   fun daysPhrase(): String = "There are only ${daysUntilNewYear()} days left until New Year! 🎆"
   ```

6.  在 `Greeting.kt` 中，更新 `Greeting` 類別以查看結果：
    
    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()
   
        fun greet(): List<String> = buildList {
            add(if (Random.nextBoolean()) "Hi!" else "Hello!")
            add("Guess what this is! > ${platform.name.reversed()}!")
            add(daysPhrase())
        }
    }
    ```

7.  要查看結果，請從 IntelliJ IDEA 重新執行您的 `composeApp` 和 `iosApp` 配置：

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## 下一步

在本教學的下一部分，您將為專案新增更多依賴項和更複雜的邏輯。

**[繼續到下一部分](multiplatform-upgrade-app.md)**

### 另請參閱

*   了解如何使用各種多平台依賴項：[Kotlin 函式庫、Kotlin 多平台函式庫和其他多平台專案](multiplatform-add-dependencies.md)。
*   了解如何[新增 Android 依賴項](multiplatform-android-dependencies.md)以及[使用或不使用 CocoaPods 的 iOS 依賴項](multiplatform-ios-dependencies.md)，以便在平台特定的原始碼集中使用。
*   查看[如何在範例專案中使用 Android 和 iOS 函式庫](multiplatform-samples.md)的範例。

## 取得協助

*   **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。