[//]: # (title: Kotlin/JS IR 編譯器)

Kotlin/JS IR 編譯器後端是 Kotlin/JS 創新開發的主要重點，並為該技術鋪平了前進的道路。

Kotlin/JS IR 編譯器後端不直接從 Kotlin 原始碼生成 JavaScript 程式碼，而是採用了一種新方法。Kotlin 原始碼首先被轉換為 [Kotlin 中介表示 (IR)](whatsnew14.md#unified-backends-and-extensibility)，然後再編譯成 JavaScript。對於 Kotlin/JS 而言，這使得激進的優化成為可能，並允許改進之前編譯器中存在的痛點，例如生成的程式碼大小（透過死碼消除）以及 JavaScript 和 TypeScript 生態系統的互通性等。

從 Kotlin 1.4.0 開始，IR 編譯器後端可透過 Kotlin Multiplatform Gradle 外掛程式使用。要在您的專案中啟用它，請在您的 Gradle 建置腳本中將編譯器類型傳遞給 `js` 函數：

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

*   `IR` 使用用於 Kotlin/JS 的新 IR 編譯器後端。
*   `LEGACY` 使用舊的編譯器後端。
*   `BOTH` 使用新的 IR 編譯器以及預設編譯器後端來編譯您的專案。使用此模式適用於[為同時支援兩種後端的函式庫撰寫程式碼](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

> 舊的編譯器後端已自 Kotlin 1.8.0 起廢棄。從 Kotlin 1.9.0 開始，使用編譯器類型 `LEGACY` 或 `BOTH` 將導致錯誤。
>
{style="warning"}

編譯器類型也可以在 `gradle.properties` 檔案中設定，鍵為 `kotlin.js.compiler=ir`。然而，此行為會被 `build.gradle(.kts)` 中的任何設定覆寫。

## 頂層屬性的惰性初始化

為了更好的應用程式啟動效能，Kotlin/JS IR 編譯器會惰性初始化頂層屬性。透過這種方式，應用程式在載入時無需初始化其程式碼中使用的所有頂層屬性。它只會初始化啟動時所需的屬性；其他屬性則在實際執行使用它們的程式碼時才獲得其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果由於某些原因您需要及早（在應用程式啟動時）初始化屬性，請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 註解標記它。

## 用於開發二進位檔的增量編譯

JS IR 編譯器提供了「用於開發二進位檔的增量編譯模式」，可加速開發過程。在此模式下，編譯器在模組層級快取 `compileDevelopmentExecutableKotlinJs` Gradle 任務的結果。它在後續編譯期間會對未更改的原始檔使用快取的編譯結果，從而使編譯更快完成，特別是對於小型變更。

增量編譯預設啟用。要禁用用於開發二進位檔的增量編譯，請將以下行添加到專案的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // true by default
```

> 由於需要建立和填充快取，增量編譯模式下的全新建置通常會較慢。
>
{style="note"}

## 輸出模式

您可以選擇 JS IR 編譯器如何在您的專案中輸出 `.js` 檔案：

*   **每個模組一個檔案**。預設情況下，JS 編譯器會為專案的每個模組輸出單獨的 `.js` 檔案作為編譯結果。
*   **每個專案一個檔案**。您可以將整個專案編譯為一個單一的 `.js` 檔案，方法是將以下行添加到 `gradle.properties` 中：

    ```none
    kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
    ```

*   **每個檔案一個檔案**。您可以設定更細粒度的輸出，為每個 Kotlin 檔案生成一個（或兩個，如果檔案包含匯出的宣告）JavaScript 檔案。要啟用每檔案編譯模式：

    1.  將 `useEsModules()` 函數添加到您的建置檔案中以支援 ECMAScript 模組：

        ```kotlin
        // build.gradle.kts
        kotlin {
            js(IR) {
                useEsModules() // Enables ES2015 modules
                browser()
            }
        }
        ```

        或者，您可以使用 `es2015` [編譯目標](js-project-setup.md#support-for-es2015-features)來支援專案中的 ES2015 功能。

    2.  應用 `-Xir-per-file` 編譯器選項或使用以下內容更新您的 `gradle.properties` 檔案：

        ```none
        # gradle.properties
        kotlin.js.ir.output.granularity=per-file // 'per-module' is the default
        ```

## 生產環境中成員名稱的精簡化

Kotlin/JS IR 編譯器利用其關於 Kotlin 類別和函數之間關係的內部資訊來應用更高效的精簡化，縮短函數、屬性和類別的名稱。這減少了結果綑綁應用程式的大小。

當您以[生產](js-project-setup.md#building-executables)模式建置 Kotlin/JS 應用程式時，此類型的精簡化會自動應用，並預設啟用。要禁用成員名稱精簡化，請使用 `-Xir-minimized-member-names` 編譯器選項：

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

## 預覽：TypeScript 宣告檔 (d.ts) 的生成

> TypeScript 宣告檔 (`d.ts`) 的生成是 [實驗性功能](components-stability.md)。它可能隨時被移除或更改。
> 需要選擇啟用（詳情見下文），並且您應該僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 上提供相關回饋。
>
{style="warning"}

Kotlin/JS IR 編譯器能夠從您的 Kotlin 程式碼生成 TypeScript 定義。當處理混合應用程式時，這些定義可用於 JavaScript 工具和 IDE，以提供自動完成、支援靜態分析器，並使 Kotlin 程式碼更容易包含在 JavaScript 和 TypeScript 專案中。

如果您的專案產生可執行檔 (`binaries.executable()`)，Kotlin/JS IR 編譯器會收集任何用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 標記的頂層宣告，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

如果您想生成 TypeScript 定義，則必須在 Gradle 建置檔案中明確配置。將 `generateTypeScriptDefinitions()` 添加到您的 `build.gradle.kts` 檔案的 [`js` 區段](js-project-setup.md#execution-environments)中。例如：

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

這些定義可以在 `build/js/packages/<package_name>/kotlin` 中找到，與對應的未經 webpack 處理的 JavaScript 程式碼一起。

## IR 編譯器的目前限制

新 IR 編譯器後端的一個主要變化是與預設後端**缺少二進位相容性**。使用新 IR 編譯器創建的函式庫使用 `klib` 格式，不能從預設後端使用。同時，使用舊編譯器創建的函式庫是帶有 `js` 檔案的 `jar`，不能從 IR 後端使用。

如果您的專案要使用 IR 編譯器後端，您需要**將所有 Kotlin 依賴項更新到支援此新後端的版本**。JetBrains 為 Kotlin 1.4+ 發布的針對 Kotlin/JS 的函式庫已經包含了與新 IR 編譯器後端一起使用所需的所有構件。

**如果您是函式庫作者**，希望同時提供與當前編譯器後端和新 IR 編譯器後端的相容性，請另外查看[關於為 IR 編譯器撰寫函式庫](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)以及向後相容性的章節。

IR 編譯器後端與預設後端相比也存在一些差異。嘗試新後端時，最好注意這些潛在的陷阱。

*   一些**依賴於預設後端特定特徵的函式庫**，例如 `kotlin-wrappers`，可能會顯示一些問題。您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上關注調查和進度。
*   IR 後端**預設情況下完全不將 Kotlin 宣告提供給 JavaScript 使用**。要使 Kotlin 宣告對 JavaScript 可見，它們**必須**使用 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 註解。

## 將現有專案遷移到 IR 編譯器

由於兩種 Kotlin/JS 編譯器之間的顯著差異，使您的 Kotlin/JS 程式碼與 IR 編譯器配合使用可能需要一些調整。了解如何在 [Kotlin/JS IR 編譯器遷移指南](js-ir-migration.md)中將現有的 Kotlin/JS 專案遷移到 IR 編譯器。

## 為 IR 編譯器撰寫具備向後相容性的函式庫

如果您是函式庫維護者，希望同時提供與預設後端和新 IR 編譯器後端的相容性，則有一個編譯器選擇設定可用，允許您為兩種後端創建構件，讓您能夠為現有用戶保持相容性，同時為下一代 Kotlin 編譯器提供支援。這種所謂的 `both` 模式可以透過在您的 `gradle.properties` 檔案中設定 `kotlin.js.compiler=both` 來啟用，或者可以設定為您 `build.gradle(.kts)` 檔案中 `js` 區塊內的專案特定選項之一：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，從您的原始碼建置函式庫時，IR 編譯器後端和預設編譯器後端都會使用（因此得名）。這意味著將生成帶有 Kotlin IR 的 `klib` 檔案以及用於預設編譯器的 `jar` 檔案。當以相同的 Maven 座標發布時，Gradle 將根據使用情況自動選擇正確的構件 — 舊編譯器使用 `js`，新編譯器使用 `klib`。這使您能夠為使用兩種編譯器後端的專案編譯和發布您的函式庫。