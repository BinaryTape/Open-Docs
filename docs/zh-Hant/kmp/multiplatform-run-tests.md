[//]: # (title: 測試你的多平台應用程式 – 教學)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教學使用 IntelliJ IDEA，但你也可以在 Android Studio 中進行——這兩款 IDE 共享相同的核心功能與 Kotlin Multiplatform 支援。</p>
</tldr>

在本教學中，你將學習如何在 Kotlin Multiplatform 應用程式中建立、配置和執行測試。

多平台專案的測試可以分為兩類：

* **共通程式碼測試**：這些測試可以使用任何支援的架構在任何平台上執行。
* **平台特定程式碼測試**：這些對於測試平台特定邏輯至關重要。它們使用平台特定的架構，並可受益於其額外功能，例如更豐富的 API 和更廣泛的斷言。

多平台專案同時支援這兩類測試。本教學將首先向你展示如何為一個簡單的 Kotlin Multiplatform 專案設定、建立並執行共通程式碼的單元測試。接著，你將處理一個更複雜的範例，該範例需要同時針對共通程式碼和平台特定程式碼進行測試。

> 本教學假設你已熟悉：
> * Kotlin Multiplatform 專案的配置。如果還不熟悉，請在開始之前先完成[此教學](multiplatform-create-first-app.md)。
> * 常見單元測試架構的基礎知識，例如 [JUnit](https://junit.org/junit5/)。
>
{style="tip"}

## 測試簡單的多平台專案

### 建立專案

1. 在[快速入門](quickstart.md)中，完成[設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment)的說明。
2. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3. 在左側面板中，選擇 **Kotlin Multiplatform**。
4. 在 **New Project** 視窗中指定以下欄位：

    * **Name**: KMP testing
    * **Project ID**: kmp.project.testing

5. 選擇 **Android** 目標。
   如果你使用的是 Mac，也請選擇 **iOS**。確保已選取 **Do not share UI** 選項。
6. 取消勾選 **Include tests** 並點擊 **Create**。

   ![建立簡單的多平台專案](create-test-multiplatform-project.png){width=800}

### 編寫程式碼

在 `sharedLogic/src/commonMain/kotlin` 目錄中，建立一個新的 `common.example.search` 封裝。
在此封裝中，建立一個 Kotlin 檔案 `Grep.kt`，並包含以下函式：

```kotlin
fun grep(lines: List<String>, pattern: String, action: (String) -> Unit) {
    val regex = pattern.toRegex()
    lines.filter(regex::containsMatchIn)
        .forEach(action)
}
```

此函式的設計旨在模仿 [UNIX `grep` 指令](https://en.wikipedia.org/wiki/Grep)。在這裡，該函式接收多行文字、一個用作正規表示式的模式，以及一個在每當某行與模式比對成功時就會被呼叫的函式。

### 新增測試

現在，讓我們測試共通程式碼。一個關鍵部分是共通測試的原始碼集，它將 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 程式庫作為相依性。

1. 在 `sharedLogic/build.gradle.kts` 檔案中，檢查是否已有對 `kotlin.test` 程式庫的相依性：

    ```kotlin
   sourceSets {
       //...
       commonTest.dependencies {
           implementation(libs.kotlin.test)
       }
   }
   ```
   
2. `commonTest` 原始碼集儲存所有共通測試。你需要在專案中建立一個同名的目錄：

    1. 以右鍵點擊 `sharedLogic/src` 目錄，然後選擇 **New | Directory**。IDE 會顯示選項清單。
    2. 開始輸入 `commonTest/kotlin` 路徑以縮小選擇範圍，然後從清單中選擇它：

      ![建立共通測試目錄](create-common-test-dir.png){width=350}

3. 在 `commonTest/kotlin` 目錄中，建立一個新的 `common.example.search` 封裝。
4. 在此封裝中，建立 `Grep.kt` 檔案並使用以下單元測試進行更新：

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

如你所見，匯入的註解和斷言既不特定於平台，也不特定於架構。當你稍後執行此測試時，平台特定的架構將提供測試執行器。

#### 探索 `kotlin.test` API {initial-collapse-state="collapsed" collapsible="true"}

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 程式庫提供了平台無關的註解和斷言供你在測試中使用。註解（例如 `Test`）會對應到所選架構提供的註解或其最接近的等效項。

斷言是透過 [`Asserter` 介面](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)的實作來執行的。此介面定義了測試中常用的各種檢查。該 API 有一個預設實作，但通常你會使用架構特定的實作。

例如，JVM 支援 JUnit 4、JUnit 5 和 TestNG 架構。在 Android 上，呼叫 `assertEquals()` 可能會導致呼叫 `asserter.assertEquals()`，其中 `asserter` 物件是 `JUnit4Asserter` 的執行個體。在 iOS 上，`Asserter` 型別的預設實作會與 Kotlin/Native 測試執行器搭配使用。

### 執行測試

你可以透過以下方式執行測試：

* 使用裝訂邊中的 **執行** 圖示來執行 `shouldFindMatches()` 測試函式。
* 使用測試檔案的操作功能表來執行。
* 使用裝訂邊中的 **執行** 圖示來執行 `GrepTest` 測試類別。

還有一個方便的快速鍵 <shortcut>⌃ ⇧ F10</shortcut>/<shortcut>Ctrl+Shift+F10</shortcut>。無論你選擇哪種方式，你都會看到一個要執行測試的目標清單：

![執行測試任務](run-test-tasks.png){width=300}

對於 `android` 選項，測試是使用 JUnit 4 執行的。對於 `iosSimulatorArm64`，Kotlin 編譯器會偵測測試註解並建立一個由 Kotlin/Native 自己的測試執行器執行的 *測試二進位檔*。

以下是成功執行測試後產生的輸出範例：

![測試輸出](run-test-results.png){width=700}

## 處理更複雜的專案

### 編寫共通程式碼測試

你已經透過 `grep()` 函式建立了共通程式碼的測試。現在，讓我們考慮一個更進階的共通程式碼測試，使用 `CurrentRuntime` 類別。此類別包含程式碼執行平台的詳細資訊。例如，對於在本地 JVM 上執行的 Android 單元測試，它可能具有值 "OpenJDK" 和 "17.0"。

`CurrentRuntime` 的執行個體應使用平台的名稱和版本（字串形式）來建立，其中版本是選填的。當版本存在時，如果可用，你只需要字串開頭的數字。

1. 在 `commonMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 封裝。
2. 在此封裝中，建立 `CurrentRuntime.kt` 檔案並使用以下實作進行更新：

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

3. 在 `commonTest/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 封裝。
4. 在此封裝中，建立 `CurrentRuntimeTest.kt` 檔案並使用以下平台和架構無關的測試進行更新：

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

你可以使用 [IDE 中提供的](#run-tests)任何方式執行此測試。

### 新增平台特定測試

> 為了簡潔起見，此處使用了[預期與實際宣告的機制](multiplatform-connect-to-apis.md)。在更複雜的程式碼中，更好的方法是使用介面和工廠函式。
>
{style="note"}

現在你已具備編寫共通程式碼測試的經驗，讓我們來探索如何為 Android 和 iOS 編寫平台特定測試。

要建立 `CurrentRuntime` 的執行個體，請在共通的 `CurrentRuntime.kt` 檔案中宣告一個函式如下：

```kotlin
expect fun determineCurrentRuntime(): CurrentRuntime
```

該函式應為每個支援的平台提供個別的實作。否則，組建將失敗。除了在每個平台上實作此函式外，你還應該提供測試。讓我們為 Android 和 iOS 建立它們。

#### 對於 Android

1. 在 `androidMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 封裝。
2. 在此封裝中，建立 `AndroidRuntime.kt` 檔案，並使用預期函式 `determineCurrentRuntime()` 的實際實作進行更新：

    ```kotlin
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = System.getProperty("java.vm.name") ?: "Android"
    
        val version = System.getProperty("java.version")
    
        return CurrentRuntime(name, version)
    }
    ```

3. 在 `sharedLogic/src` 目錄中建立測試目錄：
 
   1. 以右鍵點擊 `sharedLogic/src` 目錄，然後選擇 **New | Directory**。IDE 會顯示選項清單。
   2. 開始輸入 `androidHostTest/kotlin` 路徑以縮小選擇範圍，然後從清單中選擇它：

      ![建立 Android 測試目錄](create-android-test-dir.png){width=350}

4. 在 `androidHostTest/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 封裝。
5. 在此封裝中，建立 `AndroidRuntimeTest.kt` 檔案並使用以下 Android 測試進行更新。為了讓測試通過，請確保設定執行時的實際名稱和版本（但查看測試如何失敗也是有用的）：

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertContains
    import kotlin.test.assertEquals
    
    class AndroidRuntimeTest {
        @Test
        fun shouldDetectAndroid() {
            val runtime = determineCurrentRuntime()
            assertContains(runtime.name, "OpenJDK")
            assertEquals(runtime.version, "21.0")
        }
    }
    ```
   
Android 特定的測試在本地 JVM 上執行可能看起來很奇怪。這是因為這些測試是以本地單元測試的形式在當前電腦上執行的。正如 [Android Studio 文件](https://developer.android.com/studio/test/test-in-android-studio)中所述，這些測試與在裝置或模擬器上執行的檢測測試 (instrumented tests) 不同。

你可以向專案新增其他型別的測試。要了解檢測測試，請參閱這份 [Touchlab 指南](https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/)。

#### 對於 iOS

1. 在 `iosMain/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 目錄。
2. 在此目錄中，建立 `IOSRuntime.kt` 檔案，並使用預期函式 `determineCurrentRuntime()` 的實際實作進行更新：

    ```kotlin
    import kotlin.experimental.ExperimentalNativeApi
    import kotlin.native.Platform
    
    @OptIn(ExperimentalNativeApi::class)
    actual fun determineCurrentRuntime(): CurrentRuntime {
        val name = Platform.osFamily.name.lowercase()
        return CurrentRuntime(name, null)
    }
    ```

3. 在 `sharedLogic/src` 目錄中建立一個新目錄：
   
   1. 以右鍵點擊 `sharedLogic/src` 目錄，然後選擇 **New | Directory**。IDE 會顯示選項清單。
   2. 開始輸入 `iosTest/kotlin` 路徑以縮小選擇範圍，然後從清單中選擇它：

4. 在 `iosTest/kotlin` 目錄中，建立一個新的 `org.kmp.testing` 目錄。
5. 在此目錄中，建立 `IOSRuntimeTest.kt` 檔案並使用以下 iOS 測試進行更新：

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

在此階段，你已經擁有了共通、Android 和 iOS 實作的程式碼及其測試。專案中的目錄結構應如下所示：

![整體專案結構](code-and-test-structure.png){width=300}

你可以從操作功能表執行單個測試或使用快速鍵。另一個選擇是使用 Gradle 任務。例如，如果你執行 `allTests` Gradle 任務，專案中的每個測試都將使用相應的測試執行器來執行：

![Gradle 測試任務](gradle-alltests.png){width=700}

執行測試時，除了 IDE 中的輸出外，還會產生 HTML 報告。你可以在 `sharedLogic/build/reports/tests` 目錄中找到它們：

![多平台測試的 HTML 報告](shared-tests-folder-reports.png){width=300}

執行 `allTests` 任務並檢查其產生的報告：

* `allTests/index.html` 檔案包含共通測試和 iOS 測試的合併報告（iOS 測試依賴於共通測試，並在其後執行）。
* `testDebugUnitTest` 和 `testReleaseUnitTest` 資料夾包含兩種預設 Android 組建變體的報告。（目前，Android 測試報告不會自動與 `allTests` 報告合併。）

![多平台測試的 HTML 報告](multiplatform-test-report.png){width=700}

## 在多平台專案中使用測試的規則

你現在已經在 Kotlin Multiplatform 應用程式中建立、配置和執行了測試。在未來的專案中處理測試時，請記住：

* 編寫共通程式碼測試時，僅使用多平台程式庫，如 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)。將相依性新增至 `commonTest` 原始碼集。
* `kotlin.test` API 中的 `Asserter` 型別應僅間接使用。雖然 `Asserter` 執行個體是可見的，但你不需要在測試中使用它。
* 始終保持在測試程式庫 API 的範圍內。幸運的是，編譯器和 IDE 會防止你使用架構特定的功能。
* 雖然在 `commonTest` 中使用哪個架構執行測試並不重要，但建議使用你打算使用的每個架構來執行測試，以檢查開發環境是否已正確設定。
* 考慮物理特性差異。例如，捲動慣性和摩擦力值會因平台和裝置而異，因此設定相同的捲動速度可能會導致不同的捲動位置。務必在目標平台上測試你的組件，以確保符合預期的行為。
* 編寫平台特定程式碼的測試時，你可以使用相應架構的功能，例如註解和擴充。
* 你可以從 IDE 執行測試，也可以使用 Gradle 任務。
* 執行測試時，會自動產生 HTML 測試報告。

## 下一步

* 在[了解多平台專案結構](multiplatform-discover-project.md)中探索多平台專案的配置。
* 查看 [Kotest](https://kotest.io/)，這是 Kotlin 生態系統提供的另一個多平台測試架構。Kotest 允許以多種風格編寫測試，並支援常規測試之外的補充方法。其中包括[資料驅動測試](https://kotest.io/docs/framework/datatesting/data-driven-testing.html)和[基於屬性的測試](https://kotest.io/docs/proptest/property-based-testing.html)。