---
title: "開始使用 Kotlin/JVM"
---
本教學示範如何使用 IntelliJ IDEA 建立主控台應用程式。

首先，下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File**（檔案） | **New**（新增） | **Project**（專案）。
2. 在左側的清單中，選擇 **Kotlin**。
3. 命名新專案，並在必要時變更其位置。

   > 勾選 **Create Git repository**（建立 Git 儲存庫）核取方塊，將新專案置於版本控制之下。 您可以隨時稍後執行此操作。
   >
   
   
   <img src="/img/jvm-new-project.png" alt="Create a console application" width="700" style={{verticalAlign: 'middle'}}/>

4. 選擇 **IntelliJ** 建置系統。 這是一個原生建置器，不需要下載額外的 Artifacts（成品）。

   如果您想要建立一個更複雜、需要進一步設定的專案，請選擇 Maven 或 Gradle。 對於 Gradle，請選擇建置腳本的語言：Kotlin 或 Groovy。
5. 從 **JDK list**（JDK 清單）中，選擇您想要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **Add JDK**（新增 JDK）並指定 JDK Home Directory（JDK 主目錄）的路徑。
   * 如果您的電腦上沒有必要的 JDK，請選擇 **Download JDK**（下載 JDK）。

6. 啟用 **Add sample code**（新增範例程式碼）選項以建立一個包含範例 `"Hello World!"` 應用程式的檔案。

    > 您也可以啟用 **Generate code with onboarding tips**（產生包含新手提示的程式碼）選項，以將一些額外有用的註解新增到您的範例程式碼中。
    >
    

7. 按一下 **Create**（建立）。

    > 如果您選擇了 Gradle 建置系統，您的專案中會有一個建置腳本檔案：`build.gradle(.kts)`。 它包含 `kotlin("jvm")` 外掛程式和您的主控台應用程式所需的依賴項目。 請確保您使用最新版本的外掛程式：
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "2.1.20"
    >     application
    > }
    > ```
    > 
    

## 建立應用程式

1. 在 `src/main/kotlin` 中開啟 `Main.kt` 檔案。
   `src` 目錄包含 Kotlin 原始程式檔和資源。 `Main.kt` 檔案包含範例程式碼，該程式碼將列印 `Hello, Kotlin!` 以及帶有迴圈迭代器值的幾行。

   <img src="/img/jvm-main-kt-initial.png" alt="Main.kt with main fun" width="700" style={{verticalAlign: 'middle'}}/>

2. 修改程式碼，使其請求您的姓名並向您說 `Hello`：

   * 建立一個輸入提示，並將 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函數傳回的值分配給 `name` 變數。
   * 讓我們使用字串模板而不是串連，方法是在文字輸出中直接在變數名稱之前新增一個貨幣符號 `$`，例如 `$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 執行應用程式

現在應用程式已準備好執行。 最簡單的方法是按一下裝訂邊中的綠色 **Run**（執行）圖示，然後選擇 **Run 'MainKt'**。

<img src="/img/jvm-run-app.png" alt="Running a console app" width="350" style={{verticalAlign: 'middle'}}/>

您可以在 **Run**（執行）工具視窗中看到結果。

<img src="/img/jvm-output-1.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>
   
輸入您的姓名並接受來自您應用程式的問候！

<img src="/img/jvm-output-2.png" alt="Kotlin run output" width="600" style={{verticalAlign: 'middle'}}/>

恭喜！ 您剛剛執行了您的第一個 Kotlin 應用程式。

## 接下來呢？

建立此應用程式後，您可以開始更深入地研究 Kotlin 語法：

* 從 [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 新增範例程式碼
* 安裝 IDEA 的 [JetBrains Academy plugin](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)，並完成 [Kotlin Koans course](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 的練習