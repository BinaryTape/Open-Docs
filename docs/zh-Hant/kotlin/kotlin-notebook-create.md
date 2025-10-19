[//]: # (title: 建立您的第一個 Kotlin 筆記本)

<tldr>
   <p>這是「**Kotlin 筆記本入門**」教學的第二部分。在繼續之前，請確保您已完成上一步。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">設定環境</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>建立 Kotlin 筆記本</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> 將依賴項新增到 Kotlin 筆記本<br/>
  </p>
</tldr>

您可透過三種主要方式開始使用您的 [Kotlin 筆記本](kotlin-notebook-overview.md)：

* [建立包含 Kotlin 筆記本的新專案](#create-a-new-project) 
* [將 Kotlin 筆記本新增至現有專案](#add-a-new-kotlin-notebook-to-your-project)
* [建立暫存 Kotlin 筆記本](#create-a-scratch-kotlin-notebook)

## 建立新專案 

若要建立包含 Kotlin 筆記本的新專案：

1. 在 IntelliJ IDEA 的歡迎畫面中，從左側面板選取 **Kotlin Notebook** | **New Notebook**。
2. 輸入新筆記本的 **Name**，並選取 **Type** | **In Folder**。
   * **Scratch：** 此選項用於建立暫存筆記本，而不將其新增至專案。
   * **In Folder：** 此選項用於在專案中建立筆記本。您必須指定專案的位置。
3. 按一下「**Create**」。

![從 IntelliJ IDEA 建立新的 Kotlin 筆記本](create-notebook-welcome.png){width=700}

您的新 Kotlin 筆記本將在新專案中建立。

或者，您可以建立一個空專案，然後 [新增 Kotlin 筆記本](#add-a-new-kotlin-notebook-to-your-project)：

1. 在 IntelliJ IDEA 中，選取 **File | New | Project**。
2. 在左側面板中，選取 **New Project**。 
3. 命名新專案，並在必要時變更其位置。

   > 選取「**Create Git repository**」核取方塊，將新專案置於版本控制之下。 
   > 您可以隨時在之後進行此操作。
   > 
   {style="tip"}

4. 從「**Language**」清單中，選取 **Kotlin**。

   ![建立新的 Kotlin 筆記本專案](new-notebook-project.png){width=700}

5. 選取 **IntelliJ** 建置系統。
6. 從「**JDK**」清單中，選取您要在專案中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/)。
7. 啟用「**Add sample code**」選項，以建立一個包含 `"Hello World!"` 範例應用程式的檔案。

   > 您也可以啟用「**Generate code with onboarding tips**」選項，為您的範例程式碼新增一些額外的實用註解。
   > 
   {style="tip"}

8. 按一下「**Create**」。

專案建立後，新增一個 Kotlin 筆記本（請參閱下一節）。

## 將新的 Kotlin 筆記本新增至您的專案

若要將新的 Kotlin 筆記本新增至現有專案： 

1. 選取 **File | New | Kotlin Notebook**，或在資料夾上按一下滑鼠右鍵並選取 **New | Kotlin Notebook**。

   ![建立新的 Kotlin 筆記本](new-notebook.png){width=700}

2. 設定新筆記本的名稱，例如 **first-notebook**。
3. 按下 **Enter**。將會開啟一個帶有 Kotlin 筆記本 **first-notebook.ipynb** 的新分頁。

## 建立暫存 Kotlin 筆記本

您也可以將 Kotlin 筆記本建立為暫存檔。[暫存檔](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file) 允許您測試小段程式碼，而無需建立新專案或修改現有專案。

若要建立暫存 Kotlin 筆記本：

1. 按一下 **File | New | Scratch File**。
2. 從「**New Scratch File**」清單中選擇 **Kotlin Notebook**。

   ![暫存筆記本](kotlin-notebook-scratch-file.png){width=400}

## 執行基本操作

1. 在新的 Kotlin 筆記本中，在程式碼儲存格中輸入以下程式碼：

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```

2. 若要執行程式碼儲存格，請按一下「**Run Cell and Select Below**」![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} 按鈕，或按下 **Shift** + **Return**。
3. 按一下「**Add Markdown Cell**」按鈕，新增一個 Markdown 儲存格。
4. 在儲存格中輸入 `# Example operations`，然後以執行程式碼儲存格相同的方式執行它以進行渲染。
5. 在新的程式碼儲存格中，輸入 `10 + 10` 並執行它。
6. 在程式碼儲存格中定義一個變數。例如，`val a = 100`。

   > 一旦您執行了一個包含已定義變數的程式碼儲存格，這些變數將在所有其他程式碼儲存格中變得可存取。
   >
   {style="tip"}

7. 建立一個新的程式碼儲存格並加入 `println(a * a)`。
8. 使用「**Run All**」![Run all button](run-all-button.png){width=30}{type="joined"} 按鈕執行筆記本中的所有程式碼和 Markdown 儲存格。

   ![第一個筆記本](first-notebook.png){width=700}

恭喜！您已成功建立並試用您的第一個 Kotlin 筆記本。

## 下一步

在教學的下一個部分中，您將學習如何將依賴項新增到 Kotlin 筆記本中。

**[繼續閱讀下一章](kotlin-notebook-add-dependencies.md)**