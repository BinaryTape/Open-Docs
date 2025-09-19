[//]: # (title: 開始使用 Kotlin/JVM)

本教學將示範如何使用 IntelliJ IDEA 建立一個主控台應用程式。

首先，請下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 來開始。

## 建立專案

1. 在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
2. 在左側清單中，選擇 **Kotlin**。
3. 為新專案命名，並在需要時更改其位置。

   > 勾選 **Create Git repository** 核取方塊，將新專案置於版本控制之下。您可以在任何時候稍後再進行此操作。
   >
   {style="tip"}
   
   ![Create a console application](jvm-new-project.png){width=700}

4. 選擇 **IntelliJ** 建置系統。這是一個原生建置器，不需要下載額外的構件。

   如果您想建立一個需要進一步設定的更複雜專案，請選擇 Maven 或 Gradle。對於 Gradle，
   請選擇建置腳本的語言：Kotlin 或 Groovy。
5. 從 **JDK** 清單中，選擇您想在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果 JDK 已安裝在您的電腦上，但未在 IDE 中定義，請選擇 **Add JDK** 並指定 JDK 家目錄的路徑。 
   * 如果您的電腦上沒有必要的 JDK，請選擇 **Download JDK**。

6. 啟用 **Add sample code** 選項，以建立一個包含範例 `"Hello World!"` 應用程式的檔案。

    > 您還可以啟用 **Generate code with onboarding tips** 選項，為您的範例程式碼添加一些額外有用的註釋。
    >
    {style="tip"}

7. 點擊 **Create**。

    > 如果您選擇了 Gradle 建置系統，您的專案中會有一個建置腳本檔案：`build.gradle(.kts)`。它包含
    > `kotlin("jvm")` 外掛程式和您的主控台應用程式所需的依賴項。請確保您使用最新版本的外掛程式：
    > 
    > <tabs group="build-script">
    > <tab title="Kotlin" group-key="kotlin">
    > 
    > ```kotlin
    > plugins {
    >     kotlin("jvm") version "%kotlinVersion%"
    >     application
    > }
    > ```
    > 
    > </tab>
    > <tab title="Groovy" group-key="groovy">
    > 
    > ```groovy
    > plugins {
    >     id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    >     id 'application'
    > }
    > ```
    > 
    > </tab>
    > </tabs>
    > 
    {style="note"}

## 建立應用程式

1. 開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。  
   `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含將印出 
   `Hello, Kotlin!` 以及數行帶有迴圈迭代器值的範例程式碼。

   ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2. 修改程式碼，使其請求您的姓名並向您說 `Hello`：

   * 建立一個輸入提示，並將 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函數返回的值指派給 `name` 變數。
   * 讓我們使用字串範本而不是串接，透過在變數名稱前直接加上一個美元符號，就像這樣 – `$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 執行應用程式

現在應用程式已準備好執行。最簡單的方法是點擊側邊的綠色 **Run** 圖示，然後選擇 **Run 'MainKt'**。

![Running a console app](jvm-run-app.png){width=350}

您可以在 **Run** 工具視窗中看到結果。

![Kotlin run output](jvm-output-1.png){width=600}
   
輸入您的姓名，並接受應用程式的問候！ 

![Kotlin run output](jvm-output-2.png){width=600}

恭喜！您剛剛執行了您的第一個 Kotlin 應用程式。

## 接下來是什麼？

建立此應用程式後，您可以開始更深入地了解 Kotlin 語法：

* 進行 [Kotlin 導覽](kotlin-tour-welcome.md) 
* 為 IDEA 安裝 [JetBrains Academy 外掛程式](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) 並完成 
  [Kotlin Koans 課程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的練習