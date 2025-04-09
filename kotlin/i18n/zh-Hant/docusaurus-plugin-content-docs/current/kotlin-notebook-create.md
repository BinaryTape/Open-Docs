---
title: "建立您的第一個 Kotlin Notebook"
---
:::info
<p>
   這是 <strong>Kotlin Notebook 入門</strong>教學的第二部分。在繼續之前，請確保您已完成先前的步驟。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">設定環境 (Set up an environment)</a><br/>
      <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>建立 Kotlin Notebook</strong><br/>
      <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 將依賴項新增至 Kotlin Notebook<br/>
</p>

:::

在這裡，您將學習如何建立您的第一個 [Kotlin Notebook](kotlin-notebook-overview)、執行簡單的操作，以及執行程式碼儲存格 (code cells)。

## 建立一個空的專案 (project)

1. 在 IntelliJ IDEA 中，選取 **File | New | Project**。
2. 在左側的面板中，選取 **New Project**。
3. 命名新的專案，並在必要時更改其位置。

   > 選取 **Create Git repository** 核取方塊，將新的專案置於版本控制之下。
   > 您稍後可以隨時執行此操作。
   > 
   

4. 從 **Language** 清單中，選取 **Kotlin**。

   <img src="/img/new-notebook-project.png" alt="Create a new Kotlin Notebook project" width="700" style={{verticalAlign: 'middle'}}/>

5. 選取 **IntelliJ** 建置系統 (build system)。
6. 從 **JDK list** 中，選取您想要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7. 啟用 **Add sample code** 選項，以建立一個包含範例 `"Hello World!"` 應用程式的檔案。

   > 您也可以啟用 **Generate code with onboarding tips** 選項，以將一些額外的實用註解新增到您的範例程式碼。
   > 
   

8. 按一下 **Create**。

## 建立 Kotlin Notebook

1. 若要建立新的 notebook，請選取 **File | New | Kotlin Notebook**，或在資料夾上按一下滑鼠右鍵，然後選取 **New | Kotlin Notebook**。

   <img src="/img/new-notebook.png" alt="Create a new Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

2. 設定新 notebook 的名稱，例如 **first-notebook**，然後按 **Enter**。
   將會開啟一個新的分頁，其中包含 Kotlin Notebook **first-notebook.ipynb**。
3. 在開啟的分頁中，於程式碼儲存格 (code cell) 中鍵入以下程式碼：

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. 若要執行程式碼儲存格 (code cell)，請按一下 **Run Cell and Select Below** <img src="/img/run-cell-and-select-below.png" alt="Run Cell and Select Below" width="30" style={{verticalAlign: 'middle'}}/> 按鈕，或按 **Shift** + **Return**。
5. 透過按一下 **Add Markdown Cell** 按鈕來新增一個 markdown 儲存格。
6. 在儲存格中鍵入 `# Example operations`，並以與執行程式碼儲存格 (code cells) 相同的方式執行它，以進行轉譯 (render)。
7. 在新的程式碼儲存格 (code cell) 中，鍵入 `10 + 10` 並執行它。
8. 在程式碼儲存格 (code cell) 中定義一個變數。例如，`val a = 100`。

   > 一旦您執行了包含已定義變數的程式碼儲存格 (code cell)，這些變數就可以在所有其他程式碼儲存格 (code cells) 中存取。
   > 
   

9. 建立一個新的程式碼儲存格 (code cell) 並新增 `println(a * a)`。
10. 使用 **Run All** <img src="/img/run-all-button.png" alt="Run all button" width="30" style={{verticalAlign: 'middle'}}/> 按鈕執行 notebook 中的所有程式碼和 markdown 儲存格。

    <img src="/img/first-notebook.png" alt="First notebook" width="700" style={{verticalAlign: 'middle'}}/>

恭喜！您剛剛建立了您的第一個 Kotlin Notebook。

## 建立一個草稿 Kotlin Notebook (scratch Kotlin Notebook)

從 IntelliJ IDEA 2024.1.1 開始，您也可以建立一個 Kotlin Notebook 作為草稿檔案 (scratch file)。

[草稿檔案 (Scratch files)](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允許
您測試小段程式碼，而無需建立新的專案或修改現有的專案。

若要建立草稿 Kotlin Notebook (scratch Kotlin Notebook)：

1. 按一下 **File | New | Scratch File**。
2. 從 **New Scratch File** 清單中選取 **Kotlin Notebook**。

   <img src="/img/kotlin-notebook-scratch-file.png" alt="Scratch notebook" width="400" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教學的下一部分，您將學習如何將依賴項新增至 Kotlin Notebook。

**[前往下一章](kotlin-notebook-add-dependencies)**