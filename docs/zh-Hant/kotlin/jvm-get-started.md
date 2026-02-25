[//]: # (title: 建立主控台應用程式 – 教學)

本教學示範如何使用 IntelliJ IDEA 建立主控台應用程式。

若要開始使用，請先下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 建立專案

1. 在 IntelliJ IDEA 中，選取 **File** | **New** | **Project**。
2. 在左側清單中，選取 **Kotlin**。
3. 為新專案命名，並在必要時變更其位置。

   > 選取 **Create Git repository** 核取方塊，將新專案置於版本控制之下。您之後隨時都可以執行此操作。
   >
   {style="tip"}
   
   ![Create a console application](jvm-new-project.png){width=700}

4. 選取 **IntelliJ** 建構系統。這是一個原生建置器，不需要下載額外的構件。

   如果您想建立一個需要進一步配置的更複雜專案，請選取 Maven 或 Gradle。對於 Gradle，請為建置指令碼選擇一種語言：Kotlin 或 Groovy。
5. 從 **JDK** 清單中，選取您想在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
   * 如果您的電腦上已安裝 JDK，但尚未在 IDE 中定義，請選取 **Add JDK** 並指定 JDK 根目錄的路徑。 
   * 如果您的電腦上沒有所需的 JDK，請選取 **Download JDK**。

6. 啟用 **Add sample code** 選項，以建立包含範例 `"Hello World!"` 應用程式的檔案。

    > 您也可以啟用 **Generate code with onboarding tips** 選項，在您的範例程式碼中加入一些額外的實用註解。
    >
    {style="tip"}

7. 點擊 **Create**。

    > 如果您選擇了 Gradle 建構系統，您的專案中會有一個建置指令碼檔案：`build.gradle(.kts)`。它包含了主控台應用程式所需的 `kotlin("jvm")` 外掛程式和相依性。請確保您使用的是最新版本的外掛程式：
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
   `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含範例程式碼，會列印 `Hello, Kotlin!` 以及包含循環反覆運算器值的數行內容。

   ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2. 修改程式碼，讓它詢問您的姓名並向您打招呼：

   * 建立一個輸入提示，並將 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函式傳回的值指派給 `name` 變數。
   * 讓我們使用字串範本而不是字串連接，方法是在文字輸出中直接在變數名稱前加上美元符號 `$`，如下所示 – `$name`。
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   
       // ...
   }
   ```

## 執行應用程式

現在應用程式已準備好執行。最簡單的方法是點擊邊欄中的綠色 **Run** 圖示，然後選取 **Run 'MainKt'**。

![Running a console app](jvm-run-app.png){width=350}

您可以在 **Run** 工具視窗中看到結果。

![Kotlin run output](jvm-output-1.png){width=600}
   
輸入您的姓名並接受來自應用程式的問候！ 

![Kotlin run output](jvm-output-2.png){width=600}

恭喜！您剛剛執行了您的第一個 Kotlin 應用程式。

## 下一步？

建立此應用程式後，您可以開始深入研究 Kotlin 語法：

* 進行 [Kotlin 導覽](kotlin-tour-welcome.md) 
* 為 IDEA 安裝 [JetBrains Academy 外掛程式](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy)，並完成 [Kotlin Koans 課程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的練習