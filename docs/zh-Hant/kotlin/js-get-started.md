) 並將其括在花括號 (`{}`) 中。
  而 `it` 是 [Lambda 參數](coding-conventions.md#lambda-parameters) 的預設名稱。

#### 執行應用程式

1. [執行應用程式](#build-and-run-the-application)。
2. 輸入您的名字。
3. 按下 <shortcut>Enter 鍵</shortcut>。

您可以看到結果：

![Application output](js-output-gutter-2.png){width=600}

#### 處理輸入以計算不重複字母的數量

作為額外的練習，讓我們處理輸入以計算並顯示單字中不重複字母的數量：

1. 在 `src/jsMain/kotlin/Main.kt` 檔案中，為 `String` 新增 `.countDistinctCharacters()` [擴充方法](extensions.md#extension-functions)：

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   在上述程式碼中：

   * [`.lowercase()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 將名稱轉換為小寫。
   * [`toList()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 將輸入字串轉換為字元列表。
   * [`distinct()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 從單字中僅選取不重複的字元。
   * [`count()` 函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 計算不重複字元的數量。

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

3. 按照步驟[執行應用程式並輸入您的名字](#run-the-application)。

您可以看到結果：

![Application output](js-output-gutter-3.png){width=600}

## 使用 Gradle 建立您的應用程式

在本節中，您可以學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/JS 應用程式。

Gradle 是 Kotlin/JS 和 Kotlin Multiplatform 專案的預設建置系統。
它也常用於 Java、Android 和其他生態系統。

### 建立專案檔案

1. 確保您使用的 Gradle 版本與 Kotlin Gradle 外掛程式 (KGP) 相容。請參閱[相容性表](gradle-configure-project.md#apply-the-plugin)了解更多詳細資訊。
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

   > 您可以使用不同的[執行環境](js-project-setup.md#execution-environments)，例如 `browser()` 或 `nodejs()`。每個環境定義了您的程式碼執行位置，並決定了 Gradle 如何在專案中產生任務名稱。
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

> 如果您正在使用 `browser` 環境，請遵循接下來的步驟。如果您正在使用 `nodejs` 環境，請前往[建置並執行專案](#build-and-run-the-project)章節。
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

3. 將 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 佔位符號替換為您的專案目錄名稱。

### 建置並執行專案

要建置專案，請從專案根目錄執行以下指令：

```bash
# 對於瀏覽器
gradle jsBrowserDevelopmentRun

# 或者

# 對於 Node.js
gradle jsNodeDevelopmentRun 
```

如果您使用的是 `browser` 環境，您可以看到瀏覽器開啟了 `index.html` 檔案，並在瀏覽器主控台列印出 `"Hello, Kotlin/JS!"`。您可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 指令開啟主控台。

![Application output](js-output-gutter-4.png){width=600}

如果您使用的是 `nodejs` 環境，您可以看到終端機列印出 `"Hello, Kotlin/JS!"`。

![Application output](js-output-gutter-5.png){width=500}

### 在 IDE 中開啟專案

您可以在任何支援 Gradle 的 IDE 中開啟您的專案。

如果您使用 IntelliJ IDEA：

1. 選擇 **File** | **Open**。
2. 找到專案目錄。
3. 點擊 **Open**。

IntelliJ IDEA 會自動偵測這是否為 Kotlin/JS 專案。如果您在專案中遇到問題，IntelliJ IDEA 會在 **Build** 面板中顯示錯誤訊息。

## 下一步

<!-- * 完成 [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) 教學，其中解釋了如何與 JavaScript/TypeScript 應用程式共用您的 Kotlin 程式碼。]: -->

* [設定您的 Kotlin/JS 專案](js-project-setup.md)。
* 了解如何[偵錯 Kotlin/JS 應用程式](js-debugging.md)。
* 了解如何[使用 Kotlin/JS 編寫並執行測試](js-running-tests.md)。
* 了解如何[為真實的 Kotlin/JS 專案編寫 Gradle 建置指令碼](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)。
* 閱讀更多關於 [Gradle 建置系統](gradle.md) 的資訊。