[//]: # (title: Kotlin/JVM 入門)

本教學課程將示範如何使用 IntelliJ IDEA 建立一個主控台應用程式。

若要開始，請先下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1.  在 IntelliJ IDEA 中，選擇 **檔案** | **新增** | **專案**。
2.  在左側清單中，選擇 **Kotlin**。
3.  命名新專案，並在必要時變更其位置。

    > 勾選「**建立 Git 儲存庫**」核取方塊，將新專案置於版本控制之下。您可以隨時在之後進行此操作。
    >
    {style="tip"}

    ![Create a console application](jvm-new-project.png){width=700}

4.  選擇 **IntelliJ** 建置系統。它是一個原生建置器，不需要下載額外的構件 (artifact)。

    如果您想建立一個需要進一步配置的更複雜專案，請選擇 Maven 或 Gradle。對於 Gradle，請選擇建置腳本 (build script) 的語言：Kotlin 或 Groovy。
5.  從 **JDK** 清單中，選擇您想在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
    *   如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **新增 JDK** 並指定 JDK 主目錄的路徑。
    *   如果您的電腦上沒有必要的 JDK，請選擇 **下載 JDK**。

6.  啟用「**新增範例程式碼**」選項，以建立一個包含 `"Hello World!"` 範例應用程式的檔案。

    > 您也可以啟用「**產生包含入門提示的程式碼**」選項，為您的範例程式碼新增一些額外有用的註解。
    >
    {style="tip"}

7.  點擊「**建立**」。

    > 如果您選擇了 Gradle 建置系統，您的專案中會有一個建置腳本檔案：`build.gradle(.kts)`。它包含 `kotlin("jvm")` 外掛程式和您的主控台應用程式所需的依賴項。請確保您使用最新版本的外掛程式：
    >
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    >
    {style="note"}

## 建立應用程式

1.  開啟 `src/main/kotlin` 目錄中的 `Main.kt` 檔案。
    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含範例程式碼，該程式碼將會印出 `Hello, Kotlin!` 以及數行帶有迴圈迭代器 (cycle iterator) 值的內容。

    ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2.  修改程式碼，使其詢問您的姓名並向您問好：

    *   建立一個輸入提示，並將 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函數返回的值賦給 `name` 變數。
    *   讓我們使用字串模板 (string template) 而非字串串接 (concatenation)，方法是在文字輸出中直接在變數名稱前加上一個錢號 `$name`。

    ```kotlin
    fun main() {
        println("What's your name?")
        val name = readln()
        println("Hello, $name!")

        // ...
    }
    ```

## 執行應用程式

現在應用程式已準備好執行。最簡單的方法是點擊邊欄 (gutter) 中綠色的「**執行**」圖示，並選擇「**執行 'MainKt'**」。

![Running a console app](jvm-run-app.png){width=350}

您可以在「**執行**」工具視窗中看到結果。

![Kotlin run output](jvm-output-1.png){width=600}

輸入您的姓名並接受來自您應用程式的問候！

![Kotlin run output](jvm-output-2.png){width=600}

恭喜！您剛剛執行了您的第一個 Kotlin 應用程式。

## 下一步？

建立此應用程式後，您可以開始深入了解 Kotlin 語法：

*   從 [Kotlin 範例](https://play.kotlinlang.org/byExample/overview) 中新增範例程式碼
*   為 IDEA 安裝 [JetBrains Academy 外掛程式](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)，並完成 [Kotlin Koans 課程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的練習。