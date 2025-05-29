[//]: # (title: 執行程式碼片段)

Kotlin 程式碼通常組織成專案，您可以在 IDE、文字編輯器或其他工具中處理這些專案。然而，如果您想快速了解某個函式的運作方式或找出某個運算式的值，則無需建立新專案並進行建置。請參考以下三種在不同環境中立即執行 Kotlin 程式碼的便捷方法：

*   IDE 中的 [暫存檔和工作表](#ide-scratches-and-worksheets)。
*   瀏覽器中的 [Kotlin Playground](#browser-kotlin-kotlin-playground)。
*   命令列中的 [ki shell](#command-line-ki-shell)。

## IDE：暫存檔和工作表

IntelliJ IDEA 和 Android Studio 支援 Kotlin [暫存檔和工作表](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

*   _暫存檔_（或簡稱_暫存_）可讓您在與專案相同的 IDE 視窗中建立程式碼草稿並即時執行。暫存檔不與專案綁定；您可以從作業系統上任何 IntelliJ IDEA 視窗存取並執行所有暫存檔。

    要建立 Kotlin 暫存檔，請點擊 **File** | **New** | **Scratch File** 並選擇 **Kotlin** 類型。

*   _工作表_是專案檔案：它們儲存在專案目錄中並與專案模組綁定。工作表對於編寫實際上不構成軟體單元但仍應儲存在專案中的程式碼片段非常有用，例如教學或示範材料。

    要在專案目錄中建立 Kotlin 工作表，請在專案樹中右鍵點擊該目錄並選擇 **New** | **Kotlin Class/File** | **Kotlin Worksheet**。

    > Kotlin 工作表在 [K2 模式](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)中不受支援。我們正在努力提供具備類似功能的替代方案。
    >
    {style="warning"}

暫存檔和工作表支援語法突顯、自動補齊以及其他 IntelliJ IDEA 程式碼編輯功能。無需宣告 `main()` 函式 – 您編寫的所有程式碼都將像在 `main()` 主體中一樣執行。

在暫存檔或工作表中完成程式碼編寫後，點擊 **Run**。執行結果將顯示在程式碼旁的行中。

![執行暫存檔](scratch-run.png){width=700}

### 互動模式

IDE 可以自動執行暫存檔和工作表中的程式碼。要讓您停止輸入後立即獲得執行結果，請開啟 **Interactive mode**。

![暫存檔互動模式](scratch-interactive.png){width=700}

### 使用模組

您可以在暫存檔和工作表中使用 Kotlin 專案中的類別或函式。

工作表會自動存取其所屬模組中的類別和函式。

要在暫存檔中使用專案中的類別或函式，請像往常一樣使用 `import` 陳述式將它們匯入暫存檔。然後編寫程式碼並在 **Use classpath of module** 清單中選取適當的模組後執行它。

暫存檔和工作表都使用已連接模組的編譯版本。因此，如果您修改了模組的原始碼檔案，這些更改將在您重建模組時傳播到暫存檔和工作表。要在每次執行暫存檔或工作表之前自動重建模組，請選擇 **Make module before Run**。

![暫存檔選擇模組](scratch-select-module.png){width=700}

### 以 REPL 執行

若要評估暫存檔或工作表中的每個特定運算式，請選擇 **Use REPL** 執行它。程式碼行將按順序執行，並提供每次呼叫的結果。您稍後可以透過參照其自動產生的 `res*` 名稱（它們顯示在相應的行中）來在同一檔案中使用結果。

![暫存檔 REPL](scratch-repl.png){width=700}

## 瀏覽器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一個線上應用程式，用於在瀏覽器中編寫、執行和分享 Kotlin 程式碼。

### 編寫和編輯程式碼

在 Playground 的編輯器區域中，您可以像在原始碼檔案中一樣編寫程式碼：
*   以任意順序新增您自己的類別、函式和頂層宣告。
*   在 `main()` 函式的主體中編寫可執行部分。

與典型的 Kotlin 專案一樣，Playground 中的 `main()` 函式可以有 `args` 參數或根本沒有參數。要在執行時傳遞程式引數，請將它們寫在 **Program arguments** 欄位中。

![Playground：程式碼自動補齊](playground-completion.png){width=700}

Playground 會在您輸入時突顯程式碼並顯示程式碼自動補齊選項。它會自動從標準函式庫和 [`kotlinx.coroutines`](coroutines-overview.md) 匯入宣告。

### 選擇執行環境

Playground 提供了自訂執行環境的方法：
*   多個 Kotlin 版本，包括可用的[未來版本預覽](eap.md)。
*   用於執行程式碼的多個後端：JVM、JS（傳統或 [IR 編譯器](js-ir-compiler.md)，或 Canvas）、或 JUnit。

![Playground：環境設定](playground-env-setup.png){width=700}

對於 JS 後端，您還可以查看產生出的 JS 程式碼。

![Playground：產生出的 JS](playground-generated-js.png){width=700}

### 線上分享程式碼

使用 Playground 與他人分享您的程式碼 – 點擊 **Copy link** 並將其傳送給任何您想展示程式碼的人。

您還可以將 Playground 中的程式碼片段嵌入到其他網站中，甚至使其可執行。點擊 **Share code** 將您的範例嵌入到任何網頁或 [Medium](https://medium.com/) 文章中。

![Playground：分享程式碼](playground-share.png){width=700}

## 命令列：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell)（_Kotlin 互動式 Shell_）是一個命令列工具，用於在終端機中執行 Kotlin 程式碼。它適用於 Linux、macOS 和 Windows。

ki shell 提供了基本的程式碼評估功能，以及進階功能，例如：
*   程式碼自動補齊
*   型別檢查
*   外部相依性
*   程式碼片段的貼上模式
*   腳本支援

有關更多詳細資訊，請參閱 [ki shell GitHub 儲存庫](https://github.com/Kotlin/kotlin-interactive-shell)。

### 安裝和執行 ki shell

要安裝 ki shell，請從 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下載其最新版本並將其解壓縮到您選擇的目錄中。

在 macOS 上，您也可以透過執行以下命令使用 Homebrew 安裝 ki shell：

```shell
brew install ki
```

要啟動 ki shell，在 Linux 和 macOS 上執行 `bin/ki.sh`（如果 ki shell 是用 Homebrew 安裝的，則只需 `ki`），或在 Windows 上執行 `bin\ki.bat`。

一旦 shell 執行，您就可以立即在終端機中開始編寫 Kotlin 程式碼。輸入 `:help`（或 `:h`）以查看 ki shell 中可用的命令。

### 程式碼自動補齊和突顯

當您按下 **Tab** 鍵時，ki shell 會顯示程式碼自動補齊選項。它還會在您輸入時提供語法突顯。您可以透過輸入 `:syntax off` 來禁用此功能。

![ki shell 突顯和自動補齊](ki-shell-highlight-completion.png){width=700}

當您按下 **Enter** 鍵時，ki shell 會評估輸入的行並列印結果。運算式值會以自動產生名稱的變數形式列印，例如 `res*`。您稍後可以在執行的程式碼中使用此類變數。如果輸入的建構不完整（例如，一個有條件但沒有主體的 `if`），shell 會列印三個點並等待剩餘部分。

![ki shell 結果](ki-shell-results.png){width=700}

### 檢查運算式的型別

對於複雜的運算式或您不熟悉的 API，ki shell 提供了 `:type`（或 `:t`）命令，該命令顯示運算式的型別：

![ki shell 型別](ki-shell-type.png){width=700}

### 載入程式碼

如果您需要的程式碼儲存在其他地方，有兩種方式可以載入並在 ki shell 中使用它：
*   使用 `:load`（或 `:l`）命令載入原始碼檔案。
*   使用 `:paste`（或 `:p`）命令在貼上模式中複製並貼上程式碼片段。

![ki shell 載入檔案](ki-shell-load.png){width=700}

`ls` 命令顯示可用的符號（變數和函式）。

### 新增外部相依性

除了標準函式庫之外，ki shell 還支援外部相依性。這讓您可以在其中嘗試第三方函式庫，而無需建立整個專案。

要在 ki shell 中新增第三方函式庫，請使用 `:dependsOn` 命令。預設情況下，ki shell 與 Maven Central 配合使用，但如果您使用 `:repository` 命令連接其他儲存庫，也可以使用它們：

![ki shell 外部相依性](ki-shell-dependency.png){width=700}