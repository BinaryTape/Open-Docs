[//]: # (title: Kotlin/JS IR 編譯器)

Kotlin/JS IR 編譯器後端是 Kotlin/JS 創新開發的重點，並為該技術鋪平了前進的道路。

Kotlin/JS IR 編譯器後端採用了一種新的方法，而不是直接從 Kotlin 原始碼生成 JavaScript 程式碼。Kotlin 原始碼首先被轉換為 [Kotlin 中介表示 (IR)](whatsnew14.md#unified-backends-and-extensibility)，然後再編譯為 JavaScript。對於 Kotlin/JS 而言，這實現了大幅優化，並改善了舊版編譯器中存在的痛點，例如生成的程式碼大小（透過 [死程式碼消除](#dead-code-elimination)）以及 JavaScript 和 TypeScript 生態系互通性等。

IR 編譯器後端從 Kotlin 1.4.0 開始透過 Kotlin Multiplatform Gradle 外掛程式提供。若要在您的專案中啟用它，請在您的 Gradle 建置指令碼中將編譯器類型傳遞給 `js` 函式：

```groovy
kotlin {
    js(IR) { // 或：LEGACY, BOTH
        // ...
        binaries.executable() // 不適用於 BOTH，詳情請參閱下方
    }
}
```

*   `IR` 使用新的 Kotlin/JS IR 編譯器後端。
*   `LEGACY` 使用舊版編譯器後端。
*   `BOTH` 使用新的 IR 編譯器和預設編譯器後端來編譯您的專案。請使用此模式來 [撰寫與兩個後端都相容的函式庫](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

> 舊版編譯器後端自 Kotlin 1.8.0 起已棄用。從 Kotlin 1.9.0 開始，使用編譯器類型 `LEGACY` 或 `BOTH` 將導致錯誤。
>
{style="warning"}

編譯器類型也可以在 `gradle.properties` 檔案中設定，鍵為 `kotlin.js.compiler=ir`。然而，此行為會被 `build.gradle(.kts)` 中的任何設定覆寫。

## 頂層屬性的延遲初始化

為了提升應用程式啟動效能，Kotlin/JS IR 編譯器會延遲初始化頂層屬性。透過這種方式，應用程式在載入時無需初始化其程式碼中使用的所有頂層屬性。它只初始化啟動時所需的屬性；其他屬性稍後會在實際執行使用它們的程式碼時才取得其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果出於某種原因，您需要立即（在應用程式啟動時）初始化一個屬性，請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 註解來標記它。

## 開發二進位檔案的增量編譯

JS IR 編譯器為**開發二進位檔案**提供了**增量編譯模式**，這可以加速開發流程。在此模式下，編譯器會在模組層級快取 `compileDevelopmentExecutableKotlinJs` Gradle 任務的結果。它會在後續編譯期間使用未變更原始檔的快取編譯結果，從而使編譯完成得更快，特別是在只有少量變更的情況下。

增量編譯預設為啟用。若要停用開發二進位檔案的增量編譯，請將以下行新增到專案的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // true by default
```

> 由於需要建立和填充快取，增量編譯模式下的乾淨建置通常會較慢。
>
{style="note"}

## 輸出模式

您可以選擇 JS IR 編譯器如何在您的專案中輸出 `.js` 檔案：

*   **每模組一個**。預設情況下，JS 編譯器會為專案的每個模組輸出單獨的 `.js` 檔案作為編譯結果。
*   **每專案一個**。您可以將整個專案編譯為單一的 `.js` 檔案，方法是將以下行新增到 `gradle.properties` 中：

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **每檔案一個**。您可以設定更精細的輸出，為每個 Kotlin 檔案生成一個 (或兩個，如果檔案包含匯出宣告) JavaScript 檔案。若要啟用每檔案編譯模式：

    1.  將 `useEsModules()` 函式新增到您的建置檔案中以支援 ECMAScript 模組：

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        或者，您可以使用 `es2015` [編譯目標](js-project-setup.md#support-for-es2015-features) 來支援專案中的 ES2015 功能。

    2.  應用 `-Xir-per-file` 編譯器選項或更新您的 `gradle.properties` 檔案：

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## 生產環境中成員名稱的最小化

Kotlin/JS IR 編譯器利用其關於 Kotlin 類別和函式關係的內部資訊，來應用更高效的最小化，縮短函式、屬性和類別的名稱。這減少了產生套件化應用程式的大小。

當您在 [生產](js-project-setup.md#building-executables) 模式下建置您的 Kotlin/JS 應用程式時，會自動應用此類型的最小化，並且預設為啟用。若要停用成員名稱最小化，請使用 `-Xir-minimized-member-names` 編譯器選項：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 死程式碼消除

[死程式碼消除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 透過移除未使用的屬性、函式和類別來減少產生的 JavaScript 程式碼的大小。

未使用的宣告可能出現在以下情況：

*   函式被行內化並且從未被直接呼叫（除了少數情況外總是如此）。
*   模組使用了共享函式庫。如果沒有 DCE，您未使用的函式庫部分仍會包含在產生的套件中。例如，Kotlin 標準函式庫包含用於操作列表、陣列、字元序列、DOM 的轉接器等函式。所有這些功能將需要大約 1.3 MB 的 JavaScript 檔案。一個簡單的「Hello, world」應用程式只需要主控台常式，而整個檔案僅需幾千位元組。

在 Kotlin/JS 編譯器中，DCE 會自動處理：

*   DCE 在**開發**套件化任務中停用，這對應於以下 Gradle 任務：

    *   `jsBrowserDevelopmentRun`
    *   `jsBrowserDevelopmentWebpack`
    *   `jsNodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   其他名稱中包含「development」的 Gradle 任務

*   如果您建置**生產**套件，DCE 會啟用，這對應於以下 Gradle 任務：

    *   `jsBrowserProductionRun`
    *   `jsBrowserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   其他名稱中包含「production」的 Gradle 任務

使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 註解，您可以指定希望 DCE 視為根的宣告。

## 預覽：TypeScript 宣告檔 (d.ts) 的生成

> TypeScript 宣告檔 (`d.ts`) 的生成是 [實驗性](components-stability.md) 功能。它可能隨時被刪除或更改。需要選擇啟用（詳情見下文），您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 上提供相關回饋。
>
{style="warning"}

Kotlin/JS IR 編譯器能夠從您的 Kotlin 程式碼生成 TypeScript 定義。這些定義可供 JavaScript 工具和 IDE 在開發混合應用程式時使用，以提供自動完成、支援靜態分析器，並使 Kotlin 程式碼更容易整合到 JavaScript 和 TypeScript 專案中。

如果您的專案產生可執行檔案 (`binaries.executable()`)，Kotlin/JS IR 編譯器會收集任何標記有 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 的頂層宣告，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

如果您想生成 TypeScript 定義，您必須在 Gradle 建置檔案中明確配置此項。在 [`js` 區段](js-project-setup.md#execution-environments) 中將 `generateTypeScriptDefinitions()` 新增到您的 `build.gradle.kts` 檔案。例如：

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

這些定義可以在 `build/js/packages/<package_name>/kotlin` 中找到，與對應的未經 webpack 打包的 JavaScript 程式碼並存。

## IR 編譯器的當前限制

新 IR 編譯器後端的一個主要變化是**不具備與預設後端的二進位相容性**。使用新 IR 編譯器建立的函式庫使用 [`klib` 格式](native-libraries.md#library-format)，無法從預設後端使用。同時，使用舊版編譯器建立的函式庫是帶有 `js` 檔案的 `jar`，無法從 IR 後端使用。

如果您想為您的專案使用 IR 編譯器後端，您需要**將所有 Kotlin 依賴項更新到支援此新後端的版本**。JetBrains 為 Kotlin 1.4+ 發佈的 Kotlin/JS 目標函式庫已包含與新 IR 編譯器後端一起使用所需的所有構件。

**如果您是函式庫作者**，希望提供與當前編譯器後端以及新 IR 編譯器後端的相容性，請另外查閱 [關於為 IR 編譯器撰寫函式庫](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) 部分。

IR 編譯器後端與預設後端相比也存在一些差異。嘗試新後端時，最好留意這些可能的陷阱。

*   某些**依賴預設後端特定特性**的函式庫，例如 `kotlin-wrappers`，可能會顯示一些問題。您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上追蹤調查和進度。
*   IR 後端**預設不會使 Kotlin 宣告對 JavaScript 可用**。若要使 Kotlin 宣告對 JavaScript 可見，它們**必須**使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 註解。

## 將現有專案遷移到 IR 編譯器

由於兩種 Kotlin/JS 編譯器之間存在顯著差異，使您的 Kotlin/JS 程式碼與 IR 編譯器協同工作可能需要進行一些調整。了解如何在 [Kotlin/JS IR 編譯器遷移指南](js-ir-migration.md) 中將現有 Kotlin/JS 專案遷移到 IR 編譯器。

## 為 IR 編譯器撰寫具備向下相容性的函式庫

如果您是函式庫維護者，希望提供與預設後端以及新 IR 編譯器後端的相容性，則編譯器選擇設定可用，允許您為兩個後端建立構件，使您能夠保持與現有使用者的相容性，同時為下一代 Kotlin 編譯器提供支援。這種所謂的 `both` 模式可以透過在 `gradle.properties` 檔案中設定 `kotlin.js.compiler=both` 來開啟，也可以在 `build.gradle(.kts)` 檔案中的 `js` 區塊內設定為專案特定選項之一：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，當從您的原始碼建置函式庫時，IR 編譯器後端和預設編譯器後端都會被使用（因此得名）。這意味著將生成包含 Kotlin IR 的 `klib` 檔案以及用於預設編譯器的 `jar` 檔案。當在相同的 Maven 座標下發佈時，Gradle 將根據使用案例自動選擇正確的構件 – 舊版編譯器使用 `js`，新版編譯器使用 `klib`。這使您能夠為使用兩種編譯器後端任一者的專案編譯和發佈您的函式庫。