[//]: # (title: 測試您的多平台應用程式 – 教學)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教學 – 這兩個 IDE 共享相同的核心功能和 Kotlin Multiplatform 支援。</p>
</tldr>

在本教學中，您將學習如何在 Kotlin Multiplatform 應用程式中建立、配置和執行測試。

多平台專案的測試可以分為兩類：

*   通用程式碼的測試。這些測試可以使用任何支援的框架在任何平台上執行。
*   平台專屬程式碼的測試。這些對於測試平台專屬邏輯至關重要。它們使用平台專屬的框架，並可受益於其附加功能，例如更豐富的 API 和更廣泛的斷言。

多平台專案支援這兩種類別。本教學將首先展示如何在簡單的 Kotlin Multiplatform 專案中設定、建立和執行通用程式碼的單元測試。然後，您將處理一個更複雜的範例，該範例需要通用和平台專屬程式碼的測試。

> 本教學假設您熟悉：
> *   Kotlin Multiplatform 專案的佈局。如果不是，請在開始前完成[此教學](multiplatform-create-first-app.md)。
> *   流行單元測試框架的基礎知識，例如 [JUnit](https://junit.org/junit5/)。
>
{style="tip"}

## 測試一個簡單的多平台專案

### 建立專案

1.  在[快速入門](quickstart.md)中，完成[設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的說明。
2.  在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3.  在左側面板中，選擇 **Kotlin Multiplatform**。
4.  在 **New Project** 視窗中指定以下欄位：

    *   **Name**: KotlinProject
    *   **Group**: kmp.project.demo
    *   **Artifact**: kotlinproject
    *   **JDK**: Amazon Corretto version 17
        > 這個 JDK 版本是為了讓您稍後新增的一個測試能夠成功執行所必需的。
        >
        {style="note"}

5.  選擇 **Android** 目標。
    *   如果您使用的是 Mac，也請選擇 **iOS**。確保已選擇 **Do not share UI** 選項。
6.  取消選擇 **Include tests** 並點擊 **Create**。

   ![Create simple multiplatform project](create-test-multiplatform-project.png){width=800}

### 編寫程式碼

在 `shared/src/commonMain/kotlin` 目錄中，建立一個新的 `common.example.search` 目錄。
在此目錄中，建立一個 Kotlin 檔案 `Grep.kt`，其中包含以下函數：

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

此函數旨在模仿 [UNIX `grep` 命令](https://en.wikipedia.org/wiki/Grep)。這裡，該函數接收多行文字、一個用作正規表達式的模式，以及一個每當某行符合該模式時都會被調用的函數。

### 新增測試

現在，讓我們測試通用程式碼。其中一個重要部分將是通用測試的來源集，它將 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 函式庫作為依賴項。

1.  在 `shared/build.gradle.kts` 檔案中，檢查是否存在對 `kotlin.test` 函式庫的依賴：

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2.  `commonTest` 來源集儲存所有通用測試。您需要在專案中建立一個同名目錄：

    1.  右鍵點擊 `shared/src` 目錄，然後選擇 **New | Directory**。IDE 將顯示一個選項列表。
    2.  開始輸入 `commonTest/kotlin` 路徑以縮小選擇範圍，然後從列表中選擇它：

      ![Creating common test directory](create-common-test-dir.png){width=350}

3.  在 `commonTest/kotlin` 目錄中，建立一個新的 `common.example.search` 軟體包。
4.  在此軟體包中，建立 `Grep.kt` 檔案並使用以下單元測試更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class GrepTest {
        companion object {
            val sampleData = listOf(
                "123 abc",
                "abc 123",
                "123 ABC",
                "ABC 123"
            )
        }
    
        @Test
        fun shouldFindMatches() {
            val results = mutableListOf<String>()
            grep(sampleData, "[a-z]+") {
                results.add(it)
            }
    
            assertEquals(2, results.size)
            for (result in results) {
                assertContains(result, "abc")
            }
        }
    }
    ```

如您所見，匯入的註解和斷言既不是平台專屬的，也不是框架專屬的。當您稍後執行此測試時，平台專屬的框架將提供測試執行器。

#### 探索 `kotlin.test` API {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫提供與平台無關的註解和斷言，供您在測試中使用。諸如 `Test` 之類的註解，會對應到所選框架提供的註解或其最接近的等效項。

斷言透過 [`Asserter` 介面](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/) 的實作來執行。此介面定義了測試中通常執行的不同檢查。該 API 有一個預設實作，但通常您會使用特定於框架的實作。

例如，JUnit 4、JUnit 5 和 TestNG 框架都在 JVM 上受支援。在 Android 上，呼叫 `assertEquals()` 可能會導致呼叫 `asserter.assertEquals()`，其中 `asserter` 物件是 `JUnit4Asserter` 的實例。在 iOS 上，`Asserter` 類型的預設實作與 Kotlin/Native 測試執行器結合使用。

### 執行測試

您可以透過執行以下方式來執行測試：

*   使用邊緣（gutter）中的 **Run** 圖示執行 `shouldFindMatches()` 測試函數。
*   使用其上下文選單執行測試檔案。
*   使用邊緣中的 **Run** 圖示執行 `GrepTest` 測試類別。

還有一個方便的 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut> 快捷鍵。無論您選擇哪種選項，您都會看到一個要執行測試的目標列表：

![Run test task](run-test-tasks.png){width=300}

對於 `android` 選項，測試使用 JUnit 4 執行。對於 `iosSimulatorArm64`，Kotlin 編譯器會檢測測試註解並建立一個 _測試二進位檔_，該二進位檔由 Kotlin/Native 自己的測試執行器執行。

以下是成功測試執行所產生的輸出範例：

![Test output](run-test-results.png){width=700}

## 使用更複雜的專案

### 為通用程式碼編寫測試

您已經為使用 `grep()` 函數的通用程式碼建立了一個測試。現在，讓我們考慮一個使用 `CurrentRuntime` 類別的更進階通用程式碼測試。此類別包含程式碼執行的平台的詳細資訊。例如，對於在本地 JVM 上執行的 Android 單元測試，它可能具有 "OpenJDK" 和 "17.0" 的值。

應使用平台的名稱和版本字串建立 `CurrentRuntime` 的實例，其中版本是可選的。當版本存在時，如果可用，您只需要字串開頭的數字。

1.  在 `commonMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 目錄。
2.  在此目錄中，建立 `CurrentRuntime.kt` 檔案並使用以下實作更新它：

    ```kotlin
    class CurrentRuntime(val name: String, rawVersion: String?) {
        companion object {
            val versionRegex = Regex("^[0-9]+(\\.[0-9]+)?")
        }
    
        val version = parseVersion(rawVersion)
    
        override fun toString() = "$name version $version"
    
        private fun parseVersion(rawVersion: String?): String {
            val result = rawVersion?.let { versionRegex.find(it) }
            return result?.value ?: "unknown"
        }
    }
    ```

3.  在 `commonTest/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 軟體包。
4.  在此軟體包中，建立 `CurrentRuntimeTest.kt` 檔案並使用以下與平台和框架無關的測試更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals

    class CurrentRuntimeTest {
        @Test
        fun shouldDisplayDetails() {
            val runtime = CurrentRuntime("MyRuntime", "1.1")
            assertEquals("MyRuntime version 1.1", runtime.toString())
        }
    
        @Test
        fun shouldHandleNullVersion() {
            val runtime = CurrentRuntime("MyRuntime", null)
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    
        @Test
        fun shouldParseNumberFromVersionString() {
            val runtime = CurrentRuntime("MyRuntime", "1.2 Alpha Experimental")
            assertEquals("MyRuntime version 1.2", runtime.toString())
        }
    
        @Test
        fun shouldHandleMissingVersion() {
            val runtime = CurrentRuntime("MyRuntime", "Alpha Experimental")
            assertEquals("MyRuntime version unknown", runtime.toString())
        }
    }
    ```

您可以使用 [IDE 中可用](#run-tests) 的任何方式執行此測試。

### 新增平台專屬測試

> 為了簡潔和簡化，此處使用了[預期和實際宣告的機制](multiplatform-connect-to-apis.md)。在更複雜的程式碼中，更好的方法是使用介面和工廠函數。
>
{style="note"}

現在您已經有編寫通用程式碼測試的經驗，讓我們探索為 Android 和 iOS 編寫平台專屬測試。

若要建立 `CurrentRuntime` 的實例，請在通用 `CurrentRuntime.kt` 檔案中宣告一個函數，如下所示：

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

該函數應對每個受支援的平台都有單獨的實作。否則，建置將失敗。除了在每個平台上實作此函數之外，您還應提供測試。讓我們為 Android 和 iOS 建立它們。

#### 對於 Android

1.  在 `androidMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 軟體包。
2.  在此軟體包中，建立 `AndroidRuntime.kt` 檔案並使用預期的 `determineCurrentRuntime()` 函數的實際實作更新它：

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3.  在 `shared/src` 目錄內建立一個測試目錄：
 
   1.  右鍵點擊 `shared/src` 目錄，然後選擇 **New | Directory**。IDE 將顯示一個選項列表。
   2.  開始輸入 `androidUnitTest/kotlin` 路徑以縮小選擇範圍，然後從列表中選擇它：

   ![Creating Android test directory](create-android-test-dir.png){width=350}

4.  在 `kotlin` 目錄中，建立一個新的 `org.kmp.testing` 軟體包。
5.  在此軟體包中，建立 `AndroidRuntimeTest.kt` 檔案並使用以下 Android 測試更新它：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "17.0")
        }
    }
    ```
   
   > 如果您在教學開始時選擇了不同的 JDK 版本，您可能需要更改 `name` 和 `version`，以便測試能夠成功執行。
   > 
   {style="note"}

Android 專屬測試在本地 JVM 上執行可能看起來很奇怪。這是因為這些測試作為本地單元測試在當前機器上執行。正如 [Android Studio 文件](https://developer.android.com/studio/test/test-in-android-studio)中所述，這些測試與在設備或模擬器上運行的儀器化測試不同。

您可以向您的專案新增其他類型的測試。要了解儀器化測試，請參閱此 [Touchlab 指南](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)。

#### 對於 iOS

1.  在 `iosMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 目錄。
2.  在此目錄中，建立 `IOSRuntime.kt` 檔案並使用預期的 `determineCurrentRuntime()` 函數的實際實作更新它：

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3.  在 `shared/src` 目錄中建立一個新目錄：
   
   1.  右鍵點擊 `shared/src` 目錄，然後選擇 **New | Directory**。IDE 將顯示一個選項列表。
   2.  開始輸入 `iosTest/kotlin` 路徑以縮小選擇範圍，然後從列表中選擇它：

   ![Creating iOS test directory](create-ios-test-dir.png){width=350}

4.  在 `iosTest/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 目錄。
5.  在此目錄中，建立 `IOSRuntimeTest.kt` 檔案並使用以下 iOS 測試更新它：

    ```kotlin 
    import kotlin.test.Test
    import kotlin.test.assertEquals
    
    class IOSRuntimeTest {
        @Test
        fun shouldDetectOS() {
            val runtime = determineCurrentRuntime()
            assertEquals(runtime.name, "ios")
            assertEquals(runtime.version, "unknown")
        }
    }
    ```

### 執行多個測試並分析報告

在此階段，您已擁有通用、Android 和 iOS 實作的程式碼，以及它們的測試。您的專案目錄結構應如下所示：

![Whole project structure](code-and-test-structure.png){width=300}

您可以從上下文選單執行個別測試或使用快捷鍵。另一個選項是使用 Gradle 任務。例如，如果您執行 `allTests` Gradle 任務，專案中的每個測試都將與相應的測試執行器一起執行：

![Gradle test tasks](gradle-alltests.png){width=700}

當您執行測試時，除了 IDE 中的輸出之外，還會產生 HTML 報告。您可以在 `shared/build/reports/tests` 目錄中找到它們：

![HTML reports for multiplatform tests](shared-tests-folder-reports.png){width=300}

執行 `allTests` 任務並檢查它產生的報告：

*   `allTests/index.html` 檔案包含通用測試和 iOS 測試的合併報告（iOS 測試依賴於通用測試，並在通用測試之後執行）。
*   `testDebugUnitTest` 和 `testReleaseUnitTest` 資料夾包含兩種預設 Android 建置變體（build flavors）的報告。（目前，Android 測試報告不會自動與 `allTests` 報告合併。）

![HTML report for multiplatform tests](multiplatform-test-report.png){width=700}

## 在多平台專案中使用測試的規則

您現在已經在 Kotlin Multiplatform 應用程式中建立、配置和執行了測試。
在您未來的專案中使用測試時，請記住：

*   為通用程式碼編寫測試時，僅使用多平台函式庫，例如 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/)。將依賴項新增到 `commonTest` 來源集。
*   來自 `kotlin.test` API 的 `Asserter` 類型應僅間接使用。儘管 `Asserter` 實例是可見的，但您不需要在測試中使用它。
*   始終保持在測試函式庫 API 範圍內。幸運的是，編譯器和 IDE 會阻止您使用框架專屬的功能。
*   儘管在 `commonTest` 中使用哪個框架來執行測試並不重要，但最好使用您打算使用的每個框架來執行測試，以檢查您的開發環境是否已正確設定。
*   考慮物理差異。例如，滾動慣性 (scrolling inertia) 和摩擦力 (friction) 值因平台和設備而異，因此設定相同的滾動速度可能會導致不同的滾動位置。務必在目標平台上測試您的組件，以確保預期的行為。
*   為平台專屬程式碼編寫測試時，您可以使用相應框架的功能，例如註解和擴充。
*   您可以從 IDE 和使用 Gradle 任務執行測試。
*   當您執行測試時，HTML 測試報告會自動產生。

## 接下來是什麼？

*   在[了解多平台專案結構](multiplatform-discover-project.md)中探索多平台專案的佈局。
*   查看 [Kotest](https://kotest.io/)，這是 Kotlin 生態系統提供的另一個多平台測試框架。Kotest 允許以多種風格編寫測試，並支援對常規測試的補充方法。這些包括[資料驅動](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)和[屬性驅動](https://kotest.io/docs/proptest/property-based-testing.html)測試。