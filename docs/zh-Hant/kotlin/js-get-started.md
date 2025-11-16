[//]: # (title: 開始使用 Kotlin/JS)

本教學將示範如何使用 Kotlin/JavaScript (Kotlin/JS) 為瀏覽器建立網頁應用程式。
若要建立您的應用程式，請選擇最符合您工作流程的工具：

*   **[IntelliJ IDEA](#create-your-application-in-intellij-idea)**：從版本控制複製專案範本並在 IntelliJ IDEA 中進行開發。
*   **[Gradle 建置系統](#create-your-application-using-gradle)**：手動為您的專案建立建置檔案，以更好地理解其底層的設定運作方式。

> 除了針對瀏覽器之外，您還可以使用 Kotlin/JS 編譯其他環境。
> 更多資訊，請參閱 [執行環境](js-project-setup.md#execution-environments)。
>
{style="tip"}

## 在 IntelliJ IDEA 中建立您的應用程式

若要建立您的 Kotlin/JS 網頁應用程式，您可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/?section=mac) 的 Community 或 Ultimate 版本。

### 設定環境

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  [設定您的 Kotlin 多平台開發環境](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。

### 建立您的專案

1.  在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project from Version Control** (檔案 | 新增 | 從版本控制建立專案)。
2.  輸入 [Kotlin/JS 範本專案](https://github.com/Kotlin/kmp-js-wizard) 的 URL：

    ```text
    https://github.com/Kotlin/kmp-js-wizard
    ```

3.  點擊 **Clone** (複製)。

### 設定您的專案

1.  開啟 `kmp-js-wizard/gradle/libs.versions.toml` 檔案。它包含專案依賴項的版本目錄。
2.  確保 Kotlin 版本與 Kotlin Multiplatform Gradle plugin 的版本相符，這是建立針對 Kotlin/JS 的網頁應用程式所必需的：

    ```kotlin
    [versions]
    kotlin = "%kotlinVersion%"

    [plugins]
    kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    ```

3.  同步 Gradle 檔案 (如果您更新了 `libs.versions.toml` 檔案)。點擊建置檔案中出現的 **Load Gradle Changes** (載入 Gradle 變更) 圖示。

    ![Load the Gradle changes button](load-gradle-changes.png){width=300}

    或者，點擊 Gradle 工具視窗中的重新整理按鈕。

更多關於多平台專案的 Gradle 設定資訊，請參閱 [多平台 Gradle DSL 參考資料](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。

### 建置並執行應用程式

1.  開啟 `src/jsMain/kotlin/Main.kt` 檔案。

    *   `src/jsMain/kotlin/` 目錄包含您專案 JavaScript 目標的主要 Kotlin 原始程式檔。
    *   `Main.kt` 檔案包含使用 [`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API 在瀏覽器頁面上渲染「Hello, Kotlin/JS!」的程式碼。

2.  點擊 `main()` 函式中的 **Run** (執行) 圖示來執行程式碼。

    ![Run the application](js-run-gutter.png){width=500}

網頁應用程式會自動在您的瀏覽器中開啟。
或者，當執行完成後，您可以在瀏覽器中開啟以下 URL：

```text
   http://localhost:8080/
```

您可以看到網頁應用程式：

![Application output](js-output-gutter-1.png){width=600}

首次執行應用程式後，IntelliJ IDEA 會在頂部工具列建立其對應的執行設定 (**jsMain [js]**)：

![Gradle run configuration](js-run-config.png){width=500}

> 在 IntelliJ IDEA Ultimate 中，
> 您可以使用 [JS 除錯器](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> 直接從 IDE 除錯程式碼。
>
{style="tip"}

### 啟用持續建置

當您進行變更時，Gradle 可以自動重建您的專案：

1.  在執行設定清單中選擇 **jsMain [js]**，然後點擊 **More Actions** (更多動作) | **Edit** (編輯)。

    ![Gradle edit run configuration](js-edit-run-config.png){width=500}

2.  在 **Run/Debug Configurations** (執行/除錯設定) 對話框中，在 **Run** (執行) 欄位內輸入 `jsBrowserDevelopmentRun --continuous`。

    ![Continuous run configuration](js-continuous-run-config.png){width=500}

3.  點擊 **OK** (確定)。

現在，當您執行應用程式並進行任何變更時，
只要您儲存 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 或變更類別檔案，
Gradle 就會自動執行專案的增量建置並熱重新載入瀏覽器。

### 修改應用程式

修改應用程式以新增一個計算單字中字母數量的功能。

#### 新增輸入元素

1.  在 `src/jsMain/kotlin/Main.kt` 檔案中，
    透過 [擴充函式](extensions.md#extension-functions) 新增一個 [HTML input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
    以讀取使用者輸入：

    ```kotlin
    // Replace the Element.appendMessage() function
    fun Element.appendInput() {
        val input = document.createElement("input")
        appendChild(input)
    }
    ```

2.  在 `main()` 中呼叫 `appendInput()` 函式。它會在頁面上顯示一個輸入元素：

    ```kotlin
    fun main() {
        // Replace document.body!!.appendMessage(message)
        document.body?.appendInput()
    }
    ```

3.  [再次執行應用程式](#build-and-run-the-application)。

    您的應用程式會像這樣：

    ![Application with an input element](js-added-input-element.png){width=600}

#### 新增輸入事件處理

1.  在 `appendInput()` 函式內部新增一個監聽器以讀取輸入值並對變更做出反應：

    ```kotlin
    // Replace the current appendInput() function
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2.  依照 IDE 的建議匯入 `HTMLInputElement` 依賴項。

    ![Import dependencies](js-import-dependency.png){width=600}

3.  在 `main()` 中呼叫 `onChange` 回呼。它會讀取並處理輸入值：

    ```kotlin
    fun main() {
        // Replace document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
    ```

#### 新增輸出元素

1.  透過定義一個 [擴充函式](extensions.md#extension-functions)
    來新增一個文字元素以顯示輸出，該函式會建立一個段落：

    ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
    ```

2.  在 `main()` 中呼叫 `appendTextContainer()` 函式。它會建立輸出元素：

    ```kotlin
    fun main() {
        // Creates a text container for our output
        // Replace val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()

        // Reads the input value
        document.body?.appendInput(onChange = { println(it) })
    }
    ```

#### 處理輸入以計算字母數量

透過移除空白字元並顯示帶有字母數量的輸出來處理輸入。

將以下程式碼新增到 `main()` 函式內的 `appendInput()` 函式中：

```kotlin
fun main() {
    // Creates a text container for our output
    val output = document.body?.appendTextContainer()

    // Reads the input value
    // Replace the current appendInput() function
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "您的姓名包含 ${it.length} 個字母"
        }
    })
}
```

從上面的程式碼來看：

*   [`replace()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 會移除名稱中的空白字元。
*   [`let{}` 作用域函式](scope-functions.md#let) 在物件上下文 (object context) 中執行函式。
*   [字串模板](strings.md#string-templates) (`${it.length}`) 透過在其前面加上一個錢號 (`$`) 並將其括在花括號 (`{}`) 中，將單字的長度插入到字串中。而 `it` 是 [lambda 參數](coding-conventions.md#lambda-parameters) 的預設名稱。

#### 執行應用程式

1.  [執行應用程式](#build-and-run-the-application)。
2.  輸入您的姓名。
3.  按下 <shortcut>Enter</shortcut> (輸入鍵)。

您可以看到結果：

![Application output](js-output-gutter-2.png){width=600}

#### 處理輸入以計算唯一字母的數量

作為額外練習，我們來處理輸入以計算並顯示單字中唯一字母的數量：

1.  在 `src/jsMain/kotlin/Main.kt` 檔案中，為 `String` 新增 `.countDistinctCharacters()` [擴充函式](extensions.md#extension-functions)：

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
    ```

    從上面的程式碼來看：

    *   [`.lowercase()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 會將名稱轉換為小寫。
    *   [`toList()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 會將輸入字串轉換為字元列表。
    *   [`distinct()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 會從單字中選擇唯一的字元。
    *   [`count()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 會計算唯一的字元。

2.  在 `main()` 中呼叫 `.countDistinctCharacters()` 函式。它會計算您姓名中唯一字母的數量：

    ```kotlin
    fun main() {
        // Creates a text container for our output
        val output = document.body?.appendTextContainer()

        // Reads the input value
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // Prints the number of unique letters
                // Replace output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "您的姓名包含 ${it.countDistinctCharacters()} 個唯一字母"
            }
        })
    }
    ```

3.  按照步驟 [執行應用程式並輸入您的姓名](#run-the-application)。

您可以看到結果：

![Application output](js-output-gutter-3.png){width=600}

## 使用 Gradle 建立您的應用程式

在本節中，您將學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/JS 應用程式。

Gradle 是 Kotlin/JS 和 Kotlin Multiplatform 專案的預設建置系統。
它也常被用於 Java、Android 和其他生態系統中。

### 建立專案檔案

1.  確保您使用的 Gradle 版本與 Kotlin Gradle plugin (KGP) 相容。
    請參閱 [相容性表格](gradle-configure-project.md#apply-the-plugin) 以獲取更多詳細資訊。
2.  使用您的檔案總管、命令列或任何您偏好的工具，為您的專案建立一個空目錄。
3.  在專案目錄中，建立一個 `build.gradle.kts` 檔案，內容如下：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        js {
            // Use browser() for running in a browser or nodejs() for running in Node.js
            browser() 
            binaries.executable()
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    // build.gradle
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        js {
            // Use browser() for running in a browser or nodejs() for running in Node.js
            browser() 
            binaries.executable()
        }
    }
    ```

    </tab>
    </tabs>

    > 您可以使用不同的 [執行環境](js-project-setup.md#execution-environments)，
    > 例如 `browser()` 或 `nodejs()`。
    > 每個環境都會定義您的程式碼執行位置，並決定 Gradle 如何在專案中產生任務名稱。
    >
    {style="note"}

4.  在專案目錄中，建立一個空的 `settings.gradle.kts` 檔案。
5.  在專案目錄中，建立一個 `src/jsMain/kotlin` 目錄。
6.  在 `src/jsMain/kotlin` 目錄中，新增一個 `hello.kt` 檔案，內容如下：

    ```kotlin
    fun main() {
        println("Hello, Kotlin/JS!")
    }
    ```

    依照慣例，所有原始碼都位於 `src/<target name>[Main|Test]/kotlin` 目錄中：
    *   `Main` 是原始碼的位置。
    *   `Test` 是測試的位置。
    *   `<target name>` 對應於目標平台 (在本例中為 `js`)。

**針對 `browser` 環境**

> 如果您正在使用 `browser` 環境，請遵循以下步驟。
> 如果您正在使用 `nodejs` 環境，
> 請跳到 [建置並執行專案](#build-and-run-the-project) 一節。
>
{style="note"}

1.  在專案目錄中，建立一個 `src/jsMain/resources` 目錄。
2.  在 `src/jsMain/resources` 目錄中，建立一個 `index.html` 檔案，內容如下：

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>應用程式標題</title>
    </head>
    <body>
        <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
    </body>
    </html>
    ```

3.  將 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 佔位符替換為您的專案目錄名稱。

### 建置並執行專案

若要建置專案，請從專案根目錄執行以下命令：

```bash
# For browser
gradle jsBrowserDevelopmentRun

# OR

# For Node.js
gradle jsNodeDevelopmentRun 
```

如果您正在使用 `browser` 環境，
您會看到瀏覽器開啟 `index.html` 檔案並在瀏覽器主控台中印出「Hello, Kotlin/JS!」。
您可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 命令開啟主控台。

![Application output](js-output-gutter-4.png){width=600}

如果您正在使用 `nodejs` 環境，您會看到終端機印出「Hello, Kotlin/JS!」。

![Application output](js-output-gutter-5.png){width=500}

### 在 IDE 中開啟專案

您可以在任何支援 Gradle 的 IDE 中開啟您的專案。

如果您使用 IntelliJ IDEA：

1.  選擇 **File** | **Open** (檔案 | 開啟)。
2.  尋找專案目錄。
3.  點擊 **Open** (開啟)。

IntelliJ IDEA 會自動偵測它是否是一個 Kotlin/JS 專案。
如果您遇到專案問題，
IntelliJ IDEA 會在 **Build** (建置) 窗格中顯示錯誤訊息。

## 接下來是什麼？

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

*   [設定您的 Kotlin/JS 專案](js-project-setup.md)。
*   學習如何 [除錯 Kotlin/JS 應用程式](js-debugging.md)。
*   學習如何 [使用 Kotlin/JS 編寫和執行測試](js-running-tests.md)。
*   學習如何 [為實際的 Kotlin/JS 專案編寫 Gradle 建置腳本](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
*   閱讀更多關於 [Gradle 建置系統](gradle.md) 的資訊。