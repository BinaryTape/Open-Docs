[//]: # (title: Kotlin/JS 入門)

本教學將展示如何使用 Kotlin/JavaScript (Kotlin/JS) 建立用於瀏覽器的 Web 應用程式。
要建立您的應用程式，請選擇最符合您工作流程的工具：

* **[IntelliJ IDEA](#在-intellij-idea-中建立您的應用程式)**：從版本控制中複製專案樣板，並在 IntelliJ IDEA 中進行開發。
* **[Gradle 建置系統](#使用-gradle-建立您的應用程式)**：手動為您的專案建立建置檔案，以更深入了解其底層運作原理。

> 除了針對瀏覽器外，您還可以使用 Kotlin/JS 為其他環境進行編譯。
> 欲了解更多資訊，請參閱[執行環境](js-project-setup.md#execution-environments)。
> 
{style="tip"}

## 在 IntelliJ IDEA 中建立您的應用程式

要建立您的 Kotlin/JS Web 應用程式，您可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)。

### 設定環境

1. 下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 安裝 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)（請勿與 Kotlin Multiplatform Gradle 外掛程式混淆）。

### 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project from Version Control**。
2. 輸入 [Kotlin/JS 樣板專案](https://github.com/Kotlin/kmp-js-wizard) 的 URL：

   ```text
   https://github.com/Kotlin/kmp-js-wizard
   ```   
   
3. 點擊 **Clone**。

### 配置您的專案

1. 開啟 `kmp-js-wizard/gradle/libs.versions.toml` 檔案。它包含了專案相依性的版本目錄。
2. 確保 Kotlin 版本與 Kotlin Multiplatform Gradle 外掛程式的版本相符，這是建立針對 Kotlin/JS 的 Web 應用程式所必需的：

   ```text
   [versions]
   kotlin = "%kotlinVersion%"
   
   [plugins]
   kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
   ```

3. 同步 Gradle 檔案（如果您更新了 `libs.versions.toml` 檔案）。點擊出現在建置檔案中的 **Load Gradle Changes** 圖示。

   ![載入 Gradle 變更按鈕](load-gradle-changes.png){width=300}

   或者，點擊 Gradle 工具視窗中的重新整理按鈕。

關於多平台專案的 Gradle 配置之更多資訊，請參閱 [Multiplatform Gradle DSL 參考](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。

### 組建並執行應用程式

1. 開啟 `src/jsMain/kotlin/Main.kt` 檔案。

   * `src/jsMain/kotlin/` 目錄包含專案 JavaScript 目標的主要 Kotlin 原始碼檔案。
   * `Main.kt` 檔案包含使用 [`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API 在瀏覽器頁面上渲染 "Hello, Kotlin/JS!" 的程式碼。

2. 點擊 `main()` 函式中的 **Run** 圖示以執行程式碼。

   ![執行應用程式](js-run-gutter.png){width=500}

Web 應用程式會自動在您的瀏覽器中開啟。
或者，您可以在執行完成後在瀏覽器中開啟以下 URL：

```text
   http://localhost:8080/
```

您可以看到 Web 應用程式：

![應用程式輸出](js-output-gutter-1.png){width=600}

在您第一次執行應用程式後，IntelliJ IDEA 會在頂端列建立其對應的运行配置 (**jsMain [js]**)：

![Gradle 运行配置](js-run-config.png){width=500}

> 在具有 Ultimate 訂閱的 IntelliJ IDEA 中，
> 您可以使用 [JS 偵錯工具](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> 直接從 IDE 偵錯程式碼。
> 
> {style="tip"}

### 啟用持續建置

每當您進行變更時，Gradle 可以自動重新組建您的專案：

1. 在运行配置清單中選擇 **jsMain [js]**，然後點擊 **More Actions** | **Edit**。

    ![編輯 Gradle 运行配置](js-edit-run-config.png){width=500}

2. 在 **运行配置** 對話方塊中，在 **Run** 欄位輸入 `jsBrowserDevelopmentRun --continuous`。

    ![持續运行配置](js-continuous-run-config.png){width=500}

3. 點擊 **OK**。

現在，當您執行應用程式並進行任何變更時，每當您儲存 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 或變更類別檔案時，Gradle 都會自動對專案執行漸進式建置並即時重載瀏覽器。

### 修改應用程式

修改應用程式以新增一個計算單字中字母數量的功能。

#### 新增 input 元素

1. 在 `src/jsMain/kotlin/Main.kt` 檔案中，透過 [擴充方法](extensions.md#extension-functions) 新增一個 [HTML input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) 來讀取使用者輸入：

   ```kotlin
   // 替換 Element.appendMessage() 函式
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```

2. 在 `main()` 中呼叫 `appendInput()` 函式。它會在頁面上顯示一個 input 元素：

   ```kotlin
   fun main() {
       // 替換 document.body!!.appendMessage(message)
       document.body?.appendInput()
   }
   ```

3. [再次執行應用程式](#組建並執行應用程式)。

    您的應用程式看起來像這樣：

   ![包含 input 元素的應用程式](js-added-input-element.png){width=600}

#### 新增輸入事件處理

1. 在 `appendInput()` 函式內部新增一個監聽器，以讀取輸入值並對變更做出反應：

    ```kotlin
   // 替換目前的 appendInput() 函式
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2. 按照 IDE 的建議匯入 `HTMLInputElement` 相依性。

   ![匯入相依性](js-import-dependency.png){width=600}

3. 在 `main()` 中呼叫 `onChange` 回呼。它會讀取並處理輸入值：

    ```kotlin
    fun main() {
        // 替換 document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

#### 新增 output 元素

1. 透過定義一個建立段落的 [擴充方法](extensions.md#extension-functions) 來新增一個文字元素以顯示輸出：

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```
   
2. 在 `main()` 中呼叫 `appendTextContainer()` 函式。它會建立輸出元素：

   ```kotlin
    fun main() {
        // 為我們的輸出建立一個文字容器
        // 替換 val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()
   
        // 讀取輸入值
        document.body?.appendInput(onChange = { println(it) })
    }
   ```
   
#### 處理輸入以計算字母數量

透過移除空白字元並顯示包含字母數量的輸出來處理輸入。

在 `main()` 函式的 `appendInput()` 函式中加入以下程式碼：

```kotlin
fun main() {
    // 為我們的輸出建立一個文字容器
    val output = document.body?.appendTextContainer()

    // 讀取輸入值
    // 替換目前的 appendInput() 函式
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

在上述程式碼中：

* [`replace()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 移除了名稱中的空格。
* [`let{}` 作用域函式](scope-functions.md#let) 在物件內容中執行函式。
* [字串模板](strings.md#string-templates) (`${it.length}`) 透過在單字長度前加上美元符號 (`$`) 並將其括在花括號 (`{}`) 中，將其插入字串。
* 而 `it` 是 [Lambda 參數](coding-conventions.md#lambda-parameters) 的預設名稱。

#### 執行應用程式

1. [執行應用程式](#組建並執行應用程式)。
2. 輸入您的名字。
3. 按下 <shortcut>Enter 鍵</shortcut>。 

您可以看到結果：

![應用程式輸出](js-output-gutter-2.png){width=600}

#### 處理輸入以計算不重複字母的數量

作為額外的練習，讓我們處理輸入以計算並顯示單字中不重複字母的數量：

1. 在 `src/jsMain/kotlin/Main.kt` 檔案中，為 `String` 新增 `.countDistinctCharacters()` [擴充方法](extensions.md#extension-functions)：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   在上述程式碼中：

   * [`.lowercase()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 將名稱轉換為小寫。
   * [`toList()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 將輸入字串轉換為字元列表。
   * [`distinct()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/distinct.html) 從單字中僅選取不重複的字元。
   * [`count()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/count.html) 計算不重複字元的數量。

2. 在 `main()` 中呼叫 `.countDistinctCharacters()` 函式。它會計算您名字中不重複字母的數量：

   ```kotlin
    fun main() {
        // 為我們的輸出建立一個文字容器
        val output = document.body?.appendTextContainer()
   
        // 讀取輸入值
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // 列印不重複字母的數量
                // 替換 output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. 按照步驟[執行應用程式並輸入您的名字](#執行應用程式)。

您可以看到結果：

![應用程式輸出](js-output-gutter-3.png){width=600}

## 使用 Gradle 建立您的應用程式

在本節中，您可以學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/JS 應用程式。

Gradle 是 Kotlin/JS 和 Kotlin Multiplatform 專案的預設建置系統。
它也常用於 Java、Android 和其他生態系統。

### 建立專案檔案

1. 確保您使用的 Gradle 版本與 Kotlin Gradle 外掛程式 (KGP) 相容。
   請參閱[相容性表](gradle-configure-project.md#apply-the-plugin)了解更多詳細資訊。
2. 使用您的檔案管理員、命令列或任何您偏好的工具為您的專案建立一個空目錄。 
3. 在專案目錄中，建立一個具有以下內容的 `build.gradle.kts` 檔案：

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
           // 使用 browser() 在瀏覽器中執行，或使用 nodejs() 在 Node.js 中執行
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
           // 使用 browser() 在瀏覽器中執行，或使用 nodejs() 在 Node.js 中執行
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > 您可以使用不同的[執行環境](js-project-setup.md#execution-environments)，
   > 例如 `browser()` 或 `nodejs()`。 
   > 每個環境定義了您的程式碼執行位置，並決定了 Gradle 如何在專案中產生任務名稱。
   >
   > {style="note"}

4. 在專案目錄中，建立一個空的 `settings.gradle.kts` 檔案。
5. 在專案目錄中，建立一個 `src/jsMain/kotlin` 目錄。
6. 在 `src/jsMain/kotlin` 目錄中，新增一個具有以下內容的 `hello.kt` 檔案：

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   按照慣例，所有原始碼都位於 `src/<target name>[Main|Test]/kotlin` 目錄中： 
   * `Main` 是原始碼的位置。
   * `Test` 是測試的位置。 
   * `<target name>` 對應於目標平台（在此案例中為 `js`）。

**對於 `browser` 環境**

> 如果您正在使用 `browser` 環境，請遵循接下來的步驟。
> 如果您正在使用 `nodejs` 環境，
> 請前往[組建並執行專案](#組建並執行專案)章節。
> 
> {style="note"}

1. 在專案目錄中，建立一個 `src/jsMain/resources` 目錄。
2. 在 `src/jsMain/resources` 目錄中，建立一個具有以下內容的 `index.html` 檔案：

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Application title</title>
   </head>
   <body>
       <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
   </body>
   </html>
   ```

3. 將 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 占位符號替換為您的專案目錄名稱。

### 組建並執行專案

要組建專案，請從專案根目錄執行以下指令：

```bash
# 對於瀏覽器
gradle jsBrowserDevelopmentRun

# 或者

# 對於 Node.js
gradle jsNodeDevelopmentRun 
```

如果您使用的是 `browser` 環境，
您可以看到瀏覽器開啟了 `index.html` 檔案，並在瀏覽器主控台列印出 `"Hello, Kotlin/JS!"`。
您可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 指令開啟主控台。

![應用程式輸出](js-output-gutter-4.png){width=600}

如果您使用的是 `nodejs`環境，您可以看到終端機列印出 `"Hello, Kotlin/JS!"`。

![應用程式輸出](js-output-gutter-5.png){width=500}

### 在 IDE 中開啟專案

您可以在任何支援 Gradle 的 IDE 中開啟您的專案。 

如果您使用 IntelliJ IDEA：

1. 選擇 **File** | **Open**。
2. 找到專案目錄。
3. 點擊 **Open**。

IntelliJ IDEA 會自動偵測這是否為 Kotlin/JS 專案。
如果您在專案中遇到問題， 
IntelliJ IDEA 會在 **Build** 面板中顯示錯誤訊息。

## 下一步

<!-- * 完成 [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) 教學，其中解釋了如何與 JavaScript/TypeScript 應用程式共用您的 Kotlin 程式碼。]: -->

* [設定您的 Kotlin/JS 專案](js-project-setup.md)。
* 了解如何[偵錯 Kotlin/JS 應用程式](js-debugging.md)。
* 了解如何[使用 Kotlin/JS 編寫並執行測試](js-running-tests.md)。
* 了解如何[為真實的 Kotlin/JS 專案編寫 Gradle 建置指令碼](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
* 閱讀更多關於 [Gradle 建置系統](gradle.md) 的資訊。