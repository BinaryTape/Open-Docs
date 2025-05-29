[//]: # (title: 建立你的第一個 Kotlin 筆記本)

<tldr>
   <p>這是「<strong>Kotlin 筆記本入門</strong>」教學的第二部分。在繼續之前，請確保你已完成上一個步驟。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="kotlin-notebook-set-up-env.md">設定環境</a><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>建立 Kotlin 筆記本</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 為 Kotlin 筆記本新增相依性<br/>
  </p>
</tldr>

在這裡，你將學習如何建立你的第一個 [Kotlin 筆記本](kotlin-notebook-overview.md)，執行簡單的操作，並執行程式碼儲存格。

## 建立空專案

1.  在 IntelliJ IDEA 中，選擇 **File | New | Project**。
2.  在左側面板中，選擇 **New Project**。
3.  為新專案命名，並在必要時更改其位置。

    > 勾選 **Create Git repository** 核取方塊，將新專案置於版本控制之下。你可以隨時在之後進行此操作。
    >
    {style="tip"}

4.  從 **Language** 清單中，選擇 **Kotlin**。

    ![建立新的 Kotlin 筆記本專案](new-notebook-project.png){width=700}

5.  選擇 **IntelliJ** 建置系統。
6.  從 **JDK** 清單中，選擇你想要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7.  啟用 **Add sample code** 選項，以建立一個包含範例 `"Hello World!"` 應用程式的檔案。

    > 你也可以啟用 **Generate code with onboarding tips** 選項，為你的範例程式碼新增一些額外有用的註解。
    >
    {style="tip"}

8.  點擊 **Create**。

## 建立 Kotlin 筆記本

1.  要建立新的筆記本，請選擇 **File | New | Kotlin Notebook**，或右鍵點擊資料夾並選擇 **New | Kotlin Notebook**。

    ![建立新的 Kotlin 筆記本](new-notebook.png){width=700}

2.  設定新筆記本的名稱，例如 **first-notebook**，然後按下 **Enter**。
    一個新的 Kotlin 筆記本索引標籤 **first-notebook.ipynb** 將會開啟。
3.  在開啟的索引標籤中，在程式碼儲存格中輸入以下程式碼：

    ```kotlin
    println("Hello, this is a Kotlin Notebook!")
    ```
4.  若要執行程式碼儲存格，請點擊 **Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} 按鈕，或按下 **Shift** + **Return**。
5.  點擊 **Add Markdown Cell** 按鈕以新增一個 Markdown 儲存格。
6.  在儲存格中輸入 `# 範例操作`，並以執行程式碼儲存格的相同方式執行它以進行渲染。
7.  在新的程式碼儲存格中，輸入 `10 + 10` 並執行它。
8.  在程式碼儲存格中定義一個變數。例如，`val a = 100`。

    > 一旦你執行了定義變數的程式碼儲存格，這些變數就可以在所有其他程式碼儲存格中存取。
    >
    {style="tip"}

9.  建立一個新的程式碼儲存格並新增 `println(a * a)`。
10. 使用 **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"} 按鈕執行筆記本中的所有程式碼和 Markdown 儲存格。

    ![第一個筆記本](first-notebook.png){width=700}

恭喜！你剛剛建立了你的第一個 Kotlin 筆記本。

## 建立暫存 Kotlin 筆記本

從 IntelliJ IDEA 2024.1.1 開始，你也可以將 Kotlin 筆記本建立為暫存檔。

[暫存檔](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允許你測試小段程式碼，而無需建立新專案或修改現有專案。

若要建立暫存 Kotlin 筆記本：

1.  點擊 **File | New | Scratch File**。
2.  從 **New Scratch File** 清單中選擇 **Kotlin Notebook**。

    ![暫存筆記本](kotlin-notebook-scratch-file.png){width=400}

## 下一步

在本教學的下一部分中，你將學習如何為 Kotlin 筆記本新增相依性。

**[前往下一章](kotlin-notebook-add-dependencies.md)**