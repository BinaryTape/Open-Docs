[//]: # (title: 執行程式碼片段)

Kotlin 程式碼通常以專案的形式組織，並在 IDE、文字編輯器或其他工具中進行操作。然而，
如果您想快速了解某個函式的運作方式或找出某個運算式的值，則無需建立新專案
並建置它。請查看以下三種在不同環境中即時執行 Kotlin 程式碼的便捷方式：

*   IDE 中的[暫存檔和工作表](#ide-scratches-and-worksheets)。
*   瀏覽器中的 [Kotlin Playground](#browser-kotlin-playground)。
*   命令列中的 [ki shell](#command-line-ki-shell)。

## IDE：暫存檔和工作表

IntelliJ IDEA 和 Android Studio 支援 Kotlin [暫存檔和工作表](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

*   _暫存檔_（或簡稱 _scratches_）讓您可以在專案的同一 IDE 視窗中建立程式碼草稿，並即時執行它們。
    暫存檔不與專案綁定；您可以從作業系統上任何 IntelliJ IDEA 視窗存取並執行所有暫存檔。

    要建立 Kotlin 暫存檔，請按一下 **File** | **New** | **Scratch File** 並選擇 **Kotlin** 型別。

*   _工作表_ 是專案檔：它們儲存在專案目錄中並與專案模組綁定。
    工作表適用於編寫不構成軟體單元，但仍應一同儲存在專案中的程式碼片段，例如教學或示範材料。

    要在專案目錄中建立 Kotlin 工作表，請在專案樹中右鍵點擊該目錄並選擇
    **New** | **Kotlin Class/File** | **Kotlin Worksheet**。

    > Kotlin 工作表在 [K2 模式](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)中不支援。我們正在努力提供具有類似功能的替代方案。
    >
    {style="warning"}

語法高亮、程式碼補齊以及其他
IntelliJ IDEA 程式碼編輯功能在暫存檔和工作表中均受支援。無需宣告 `main()` 函式 
— 您編寫的所有程式碼都將像在 `main()` 主體中一樣執行。

在暫存檔或工作表中完成程式碼編寫後，請按一下 **Run**。
執行結果將顯示在程式碼對應的行中。

![Run scratch](scratch-run.png){width=700}

### 互動模式

IDE 可以自動從暫存檔和工作表中執行程式碼。要一停止
鍵入即可獲得執行結果，請開啟 **Interactive mode**。

![Scratch interactive mode](scratch-interactive.png){width=700}

### 使用模組

您可以在暫存檔和工作表中，使用 Kotlin 專案中的類別或函式。

工作表會自動存取其所在模組中的類別和函式。

要在暫存檔中使用專案中的類別或函式，請像往常一樣，使用 `import` 陳述式將它們匯入到暫存檔中。然後編寫您的程式碼，並在 **Use classpath of module** 列表中選取適當的模組來執行。

暫存檔和工作表都使用已連接模組的編譯版本。因此，如果您修改了模組的原始碼檔案，
當您重新建置模組時，這些變更將傳播到暫存檔和工作表。
要在每次執行暫存檔或工作表之前自動重新建置模組，請選取 **Make module before Run**。

![Scratch select module](scratch-select-module.png){width=700}

### 作為 REPL 執行 

若要評估暫存檔或工作表中的每個特定運算式，請選取 **Use REPL** 來執行。程式碼行
將按順序執行，並提供每個呼叫的結果。
您可以稍後在同一檔案中透過其自動生成的 `res*` 名稱（它們顯示在對應的行中）來使用這些結果。

![Scratch REPL](scratch-repl.png){width=700}

## 瀏覽器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一個線上應用程式，用於在瀏覽器中編寫、執行和分享
Kotlin 程式碼。

### 編寫和編輯程式碼

在 Playground 的編輯器區域，您可以像在原始碼檔案中一樣編寫程式碼：
*   以任意順序新增您自己的類別、函式和頂層宣告。
*   在 `main()` 函式的主體中編寫可執行部分。

與典型的 Kotlin 專案一樣，Playground 中的 `main()` 函式可以有 `args` 參數或完全沒有參數。
要在執行時傳遞程式引數，請將它們寫入 **Program arguments** 欄位。

![Playground: code completion](playground-completion.png){width=700}

當您輸入時，Playground 會高亮顯示程式碼並顯示程式碼補齊選項。它會自動匯入來自標準函式庫和 [`kotlinx.coroutines`](coroutines-overview.md) 的宣告。

### 選擇執行環境

Playground 提供了自訂執行環境的方式：
*   多個 Kotlin 版本，包括未來版本的可用[預覽版本](eap.md)。
*   用於執行程式碼的多個後端：JVM、JS（傳統或 [IR 編譯器](js-ir-compiler.md)，或 Canvas），或 JUnit。

![Playground: environment setup](playground-env-setup.png){width=700}

對於 JS 後端，您還可以查看生成的 JS 程式碼。

![Playground: generated JS](playground-generated-js.png){width=700}

### 線上分享程式碼 

使用 Playground 與他人分享您的程式碼 — 按一下 **Copy link** 並將其傳送給任何您想展示程式碼的人。

您還可以將 Playground 中的程式碼片段嵌入到其他網站中，甚至使其可執行。按一下 **Share code** 以
將您的範例嵌入到任何網頁或 [Medium](https://medium.com/) 文章中。

![Playground: share code](playground-share.png){width=700}

## 命令列：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin 互動式 Shell_）是一個命令列
工具程式，用於在終端機中執行 Kotlin 程式碼。它適用於 Linux、macOS 和 Windows。

ki shell 提供了基本的程式碼評估功能，以及進階功能，例如：
*   程式碼補齊
*   型別檢查
*   外部依賴項
*   程式碼片段的貼上模式
*   腳本支援

有關更多詳細資訊，請參閱 [ki shell GitHub 儲存庫](https://github.com/Kotlin/kotlin-interactive-shell)。

### 安裝和執行 ki shell

要安裝 ki shell，請從 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下載其最新版本，並將其
解壓縮到您選擇的目錄中。

在 macOS 上，您也可以透過執行以下命令來使用 Homebrew 安裝 ki shell：

```shell
brew install ki
```

要啟動 ki shell，請在 Linux 和 macOS 上執行 `bin/ki.sh`（如果 ki shell 是透過 Homebrew 安裝的，則只需 `ki`），或在 Windows 上執行
`bin\ki.bat`。

shell 執行後，您可以立即開始在終端機中編寫 Kotlin 程式碼。鍵入 `:help`（或 `:h`）以查看
ki shell 中可用的命令。

### 程式碼補齊和高亮顯示

當您按下 **Tab** 鍵時，ki shell 會顯示程式碼補齊選項。它還會在您鍵入時提供語法高亮顯示。 
您可以透過輸入 `:syntax off` 來禁用此功能。

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

當您按下 **Enter** 鍵時，ki shell 會評估輸入的行並列印結果。運算式的值會
以自動生成的名稱（如 `res*`）作為變數列印出來。您可以稍後在您執行的程式碼中使用這些變數。
如果輸入的結構不完整（例如，一個帶有條件但沒有主體的 `if`），shell 會列印
三個點並等待剩餘部分。

![ki shell results](ki-shell-results.png){width=700}

### 檢查運算式的型別

對於複雜的運算式或您不熟悉的 API，ki shell 提供了 `:type`（或 `:t`）命令，用於顯示
運算式的型別：

![ki shell type](ki-shell-type.png){width=700}

### 載入程式碼

如果您需要的程式碼儲存在其他地方，有兩種方法可以載入並在 ki shell 中使用它：
*   使用 `:load`（或 `:l`）命令載入原始碼檔案。
*   使用 `:paste`（或 `:p`）命令在貼上模式下複製並貼上程式碼片段。

![ki shell load file](ki-700]{width=700}

`ls` 命令顯示可用的符號（變數和函式）。

### 新增外部依賴項

除了標準函式庫，ki shell 還支援外部依賴項。
這使您無需建立整個專案即可嘗試其中的第三方函式庫。

要在 ki shell 中新增第三方函式庫，請使用 `:dependsOn` 命令。預設情況下，ki shell 與 Maven Central 配合使用，
但如果使用 `:repository` 命令連接其他儲存庫，您也可以使用它們：

![ki shell external dependency](ki-shell-dependency.png){width=700}