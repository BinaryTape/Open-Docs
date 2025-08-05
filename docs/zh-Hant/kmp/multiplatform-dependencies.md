[//]: # (title: 將依賴項新增至您的專案)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教學課程使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循，這兩個 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
    <br/>   
    <p>這是**使用共享邏輯和原生 UI 建立 Kotlin Multiplatform 應用程式**教學課程的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">建立您的 Kotlin Multiplatform 應用程式</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">更新使用者介面</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>新增依賴項</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共享更多邏輯<br/>
        <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成您的專案<br/>
    </p>
</tldr>

您已經建立您的第一個跨平台 Kotlin Multiplatform 專案了！現在讓我們學習如何將依賴項新增到第三方函式庫，這對於建立成功的跨平台應用程式至關重要。

## 依賴項類型

您可以在 Kotlin Multiplatform 專案中使用兩種依賴項類型：

*   _Multiplatform 依賴項_。這些是支援多個目標並可用於 `commonMain` 共同原始碼集的 Multiplatform 函式庫。

    許多現代 Android 函式庫已支援 Multiplatform，例如 [Koin](https://insert-koin.io/)、[Apollo](https://www.apollographql.com/) 和 [Okio](https://square.github.io/okio/)。在 [klibs.io](https://klibs.io/) 上尋找更多 Multiplatform 函式庫，這是 JetBrains 推出的一項實驗性搜尋服務，用於探索 Kotlin Multiplatform 函式庫。

*   _原生依賴項_。這些是來自相關生態系統的常規函式庫。在原生專案中，您通常使用 Gradle 處理 Android 應用程式，並使用 CocoaPods 或其他依賴項管理器處理 iOS 應用程式。
    
    當您使用共享模組時，通常在您想要使用平台 API（例如安全儲存）時，仍然需要原生依賴項。您可以將原生依賴項新增到原生原始碼集 `androidMain` 和 `iosMain` 中。

對於這兩種依賴項類型，您可以使用本地和外部儲存庫。

## 新增 Multiplatform 依賴項

> 如果您有開發 Android 應用程式的經驗，新增 Multiplatform 依賴項與在常規 Android 專案中新增 Gradle 依賴項相似。唯一的區別是您需要指定原始碼集。
>
{style="tip"}

讓我們回到應用程式，讓問候語更具節日氣氛。除了設備資訊之外，新增一個函數來顯示距離元旦還有多少天。`kotlinx-datetime` 函式庫具有完整的 Multiplatform 支援，是在您的共享程式碼中處理日期最便捷的方式。

1.  開啟位於 `shared` 目錄中的 `build.gradle.kts` 檔案。
2.  將以下依賴項和 Kotlin 時間選擇加入新增到 `commonMain` 原始碼集依賴項中：

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

3.  點擊 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案： ![Synchronize Gradle files](gradle-sync.png){width=50}
4.  在 `shared/src/commonMain/kotlin` 中，在您的 `Greeting.kt` 檔案所在的專案目錄中建立一個新檔案 `NewYear.kt`。
5.  使用一個簡短的函數更新檔案，該函數使用 `date-time` 日期算術計算從今天到新年還有多少天：
    
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

7.  要查看結果，請從 IntelliJ IDEA 重新執行您的 **composeApp** 和 **iosApp** 配置：

![Updated mobile multiplatform app with external dependencies](first-multiplatform-project-3.png){width=500}

## 下一步

在本教學課程的下一部分，您將為專案新增更多依賴項和更複雜的邏輯。

**[繼續下一部分](multiplatform-upgrade-app.md)**

### 另請參閱

*   了解如何處理各種 Multiplatform 依賴項：[Kotlin 函式庫、Kotlin Multiplatform 函式庫和其他 Multiplatform 專案](multiplatform-add-dependencies.md)。
*   了解如何[新增 Android 依賴項](multiplatform-android-dependencies.md)以及[使用或不使用 CocoaPods 新增 iOS 依賴項](multiplatform-ios-dependencies.md)，以用於平台特定的原始碼集。
*   查看在範例專案中[如何使用 Android 和 iOS 函式庫](multiplatform-samples.md)的範例。

## 取得協助

*   **Kotlin Slack**。取得[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)並加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 頻道。
*   **Kotlin 問題追蹤器**。[報告新問題](https://youtrack.jetbrains.com/newIssue?project=KT)。