---
title: 執行程式碼片段
---
Kotlin 程式碼通常會組織成專案，您可以在 IDE、文字編輯器或其他工具中使用這些專案。但是，如果您想快速了解某個函式的工作原理或找到運算式的值，則無需建立新專案並進行建置。請查看以下三種方便的方法，可以在不同環境中立即執行 Kotlin 程式碼：

* IDE 中的 [Scratch 檔案和工作表](#ide-scratches-and-worksheets)。
* 瀏覽器中的 [Kotlin Playground](#browser-kotlin-playground)。
* 命令列中的 [ki shell](#command-line-ki-shell)。

## IDE：Scratch 檔案和工作表

IntelliJ IDEA 和 Android Studio 支援 Kotlin [Scratch 檔案和工作表](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)。

* _Scratch 檔案_（或僅稱為 _scratches_）可讓您在與專案相同的 IDE 視窗中建立程式碼草稿，並即時執行它們。Scratch 檔案不與專案相關聯；您可以從作業系統上的任何 IntelliJ IDEA 視窗存取和執行所有 Scratch 檔案。

  若要建立 Kotlin Scratch 檔案，請點擊 **File** | **New** | **Scratch File**，然後選取 **Kotlin** 類型。

* _工作表_是專案檔案：它們儲存在專案目錄中，並與專案模組相關聯。工作表對於編寫實際上不構成軟體單元，但仍應儲存在專案中的程式碼片段非常有用，例如教育或示範材料。

  若要在專案目錄中建立 Kotlin 工作表，請在專案樹狀結構中右鍵點擊該目錄，然後選取 **New** | **Kotlin Class/File** | **Kotlin Worksheet**。

    > [K2 模式](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 不支援 Kotlin 工作表。我們正在努力提供具有類似功能的替代方案。
    >
    

Scratch 檔案和工作表支援語法醒目顯示、自動完成和其他 IntelliJ IDEA 程式碼編輯功能。無需宣告 `main()` 函式 – 您編寫的所有程式碼都會像在 `main()` 的主體中一樣執行。

在 Scratch 檔案或工作表中完成程式碼編寫後，請點擊 **Run**。執行結果會顯示在程式碼對面的行中。

<img src="/img/scratch-run.png" alt="Run scratch" width="700" style={{verticalAlign: 'middle'}}/>

### 互動模式 (Interactive mode)

IDE 可以自動執行 Scratch 檔案和工作表中的程式碼。若要在停止輸入後立即獲得執行結果，請開啟 **Interactive mode**（互動模式）。

<img src="/img/scratch-interactive.png" alt="Scratch interactive mode" width="700" style={{verticalAlign: 'middle'}}/>

### 使用模組 (Use modules)

您可以在 Scratch 檔案和工作表中使用 Kotlin 專案中的類別或函式。

工作表會自動存取其所在模組中的類別和函式。

若要在 Scratch 檔案中使用專案中的類別或函式，請使用 `import` 語句將它們匯入 Scratch 檔案，就像平常一樣。然後編寫程式碼，並在 **Use classpath of module**（使用模組的類別路徑）清單中選取適當的模組來執行它。

Scratch 檔案和工作表都使用已編譯版本的已連線模組。因此，如果您修改模組的原始檔，則當您重建模組時，變更會傳播到 Scratch 檔案和工作表。若要在每次執行 Scratch 檔案或工作表之前自動重建模組，請選取 **Make module before Run**（在執行前建置模組）。

<img src="/img/scratch-select-module.png" alt="Scratch select module" width="700" style={{verticalAlign: 'middle'}}/>

### 以 REPL 執行 (Run as REPL)

若要評估 Scratch 檔案或工作表中的每個特定運算式，請在選取 **Use REPL**（使用 REPL）的情況下執行它。程式碼行將依序執行，並提供每次呼叫的結果。您可以稍後在同一檔案中透過引用它們的自動產生 `res*` 名稱（它們顯示在相應的行中）來使用這些結果。

<img src="/img/scratch-repl.png" alt="Scratch REPL" width="700" style={{verticalAlign: 'middle'}}/>

## 瀏覽器：Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) 是一個線上應用程式，用於在瀏覽器中編寫、執行和分享 Kotlin 程式碼。

### 編寫和編輯程式碼

在 Playground 的編輯器區域中，您可以像在原始檔中一樣編寫程式碼：
* 以任意順序新增您自己的類別、函式和頂層宣告。
* 在 `main()` 函式的主體中編寫可執行部分。

與典型的 Kotlin 專案一樣，Playground 中的 `main()` 函式可以具有 `args` 參數，也可以沒有任何參數。若要在執行時傳遞程式引數，請將它們寫入 **Program arguments**（程式引數）欄位。

<img src="/img/playground-completion.png" alt="Playground: code completion" width="700" style={{verticalAlign: 'middle'}}/>

Playground 會在您輸入時醒目顯示程式碼，並顯示程式碼完成選項。它會自動匯入標準程式庫和 [`kotlinx.coroutines`](coroutines-overview) 中的宣告。

### 選擇執行環境 (Choose execution environment)

Playground 提供了自訂執行環境的方法：
* 多個 Kotlin 版本，包括未來版本的可用[預覽版](eap)。
* 多個後端可用於執行程式碼：JVM、JS（傳統或 [IR 編譯器](js-ir-compiler)，或 Canvas）或 JUnit。

<img src="/img/playground-env-setup.png" alt="Playground: environment setup" width="700" style={{verticalAlign: 'middle'}}/>

對於 JS 後端，您還可以查看產生的 JS 程式碼。

<img src="/img/playground-generated-js.png" alt="Playground: generated JS" width="700" style={{verticalAlign: 'middle'}}/>

### 在線上分享程式碼 (Share code online)

使用 Playground 與他人分享您的程式碼 – 點擊 **Copy link**（複製連結），然後將其傳送給您想向其展示程式碼的任何人。

您還可以將 Playground 中的程式碼片段嵌入到其他網站中，甚至使它們可執行。點擊 **Share code**（分享程式碼）以將您的範例嵌入到任何網頁或 [Medium](https://medium.com/) 文章中。

<img src="/img/playground-share.png" alt="Playground: share code" width="700" style={{verticalAlign: 'middle'}}/>

## 命令列：ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) 是一個命令列公用程式，用於在終端機中執行 Kotlin 程式碼。它適用於 Linux、macOS 和 Windows。

ki shell 提供了基本的程式碼評估功能，以及進階功能，例如：
* 程式碼完成
* 類型檢查
* 外部依賴項
* 程式碼片段的貼上模式
* 腳本支援

有關更多詳細資訊，請參閱 [ki shell GitHub 儲存庫](https://github.com/Kotlin/kotlin-interactive-shell)。

### 安裝並執行 ki shell

若要安裝 ki shell，請從 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下載最新版本，然後將其解壓縮到您選擇的目錄中。

在 macOS 上，您也可以使用 Homebrew 透過執行以下命令來安裝 ki shell：

```shell
brew install ki
```

若要啟動 ki shell，請在 Linux 和 macOS 上執行 `bin/ki.sh`（如果 ki shell 是使用 Homebrew 安裝的，則只需執行 `ki`），或在 Windows 上執行 `bin\ki.bat`。

shell 執行後，您可以立即開始在終端機中編寫 Kotlin 程式碼。鍵入 `:help`（或 `:h`）以查看 ki shell 中可用的命令。

### 程式碼完成和醒目顯示 (Code completion and highlighting)

當您按下 **Tab** 鍵時，ki shell 會顯示程式碼完成選項。它還會在您輸入時提供語法醒目顯示。您可以輸入 `:syntax off` 來停用此功能。

<img src="/img/ki-shell-highlight-completion.png" alt="ki shell highlighting and completion" width="700" style={{verticalAlign: 'middle'}}/>

當您按下 **Enter** 鍵時，ki shell 會評估輸入的行並列印結果。運算式值會以自動產生的名稱（如 `res*`）的變數列印。您可以稍後在您執行的程式碼中使用這些變數。如果輸入的結構不完整（例如，具有條件但沒有主體的 `if`），則 shell 會列印三個點，並期望剩餘部分。

<img src="/img/ki-shell-results.png" alt="ki shell results" width="700" style={{verticalAlign: 'middle'}}/>

### 檢查運算式的類型 (Check an expression's type)

對於您不太了解的複雜運算式或 API，ki shell 提供了 `:type`（或 `:t`）命令，該命令會顯示運算式的類型：

<img src="/img/ki-shell-type.png" alt="ki shell type" width="700" style={{verticalAlign: 'middle'}}/>

### 載入程式碼 (Load code)

如果您需要的程式碼儲存在其他地方，則有兩種方法可以載入它並在 ki shell 中使用它：
* 使用 `:load`（或 `:l`）命令載入原始檔。
* 使用 `:paste`（或 `:p`）命令在貼上模式下複製並貼上程式碼片段。

<img src="/img/ki-shell-load.png" alt="ki shell load file" width="700" style={{verticalAlign: 'middle'}}/>

`ls` 命令會顯示可用的符號（變數和函式）。

### 新增外部依賴項 (Add external dependencies)

除了標準程式庫之外，ki shell 還支援外部依賴項。這可讓您在其中試用第三方程式庫，而無需建立整個專案。

若要在 ki shell 中新增第三方程式庫，請使用 `:dependsOn` 命令。預設情況下，ki shell 與 Maven Central 搭配使用，但如果您使用 `:repository` 命令連接它們，則可以使用其他儲存庫：

<img src="/img/ki-shell-dependency.png" alt="ki shell external dependency" width="700" style={{verticalAlign: 'middle'}}/>