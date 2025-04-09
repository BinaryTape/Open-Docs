---
title: "Kotlin/JS IR 編譯器"
---
Kotlin/JS IR 編譯器後端是圍繞 Kotlin/JS 創新的主要焦點，並為該技術鋪平了前進的道路。

Kotlin/JS IR 編譯器後端沒有直接從 Kotlin 原始碼產生 JavaScript 程式碼，而是採用了一種新方法。Kotlin 原始碼首先被轉換為 [Kotlin 中間表示法 (IR)](whatsnew14#unified-backends-and-extensibility)，然後再編譯成 JavaScript。對於 Kotlin/JS 來說，這可以實現積極的優化，並允許改進先前編譯器中存在的痛點，例如產生的程式碼大小（透過無效程式碼消除）、JavaScript 和 TypeScript 生態系統互操作性等。

IR 編譯器後端可從 Kotlin 1.4.0 開始透過 Kotlin Multiplatform Gradle 外掛程式使用。若要在專案中啟用它，請將編譯器類型傳遞給 Gradle 建置腳本中的 `js` 函數：

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
        binaries.executable() // not applicable to BOTH, see details below
    }
}
```

* `IR` 為 Kotlin/JS 使用新的 IR 編譯器後端。
* `LEGACY` 使用舊的編譯器後端。
* `BOTH` 使用新的 IR 編譯器以及預設編譯器後端編譯您的專案。使用此模式[撰寫與兩個後端相容的程式庫](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)。

:::note
舊的編譯器後端自 Kotlin 1.8.0 起已棄用。從 Kotlin 1.9.0 開始，使用編譯器類型 `LEGACY` 或 `BOTH` 會導致錯誤。

編譯器類型也可以在 `gradle.properties` 檔案中設定，金鑰為 `kotlin.js.compiler=ir`。但是，此行為會被 `build.gradle(.kts)` 中的任何設定覆寫。

## 頂層屬性的延遲初始化 (Lazy initialization)

為了獲得更好的應用程式啟動效能，Kotlin/JS IR 編譯器會延遲初始化頂層屬性。這樣，應用程式在載入時不會初始化其程式碼中使用的所有頂層屬性。它只會初始化啟動時需要的屬性；其他屬性會在稍後使用它們的程式碼實際執行時收到它們的值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果由於某種原因您需要急切地初始化屬性（在應用程式啟動時），請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/) 註解標記它。

## 開發二進位檔的增量編譯 (Incremental compilation)

JS IR 編譯器為_開發二進位檔_提供_增量編譯模式_，從而加快了開發過程。在此模式下，編譯器會在模組層級快取 `compileDevelopmentExecutableKotlinJs` Gradle 任務的結果。它會在後續編譯期間使用未變更原始檔的快取編譯結果，從而使它們完成得更快，尤其是在進行小變更時。

增量編譯預設為啟用。若要停用開發二進位檔的增量編譯，請將以下行新增至專案的 `gradle.properties` 或 `local.properties`：

```none
kotlin.incremental.js.ir=false // true by default
```

由於需要建立和填入快取，因此增量編譯模式下的清除建置通常會較慢。

:::

## 輸出模式 (Output mode)

您可以選擇 JS IR 編譯器在專案中輸出 `.js` 檔案的方式：

* **每個模組一個 (One per module)**。預設情況下，JS 編譯器會為專案的每個模組輸出單獨的 `.js` 檔案，作為編譯結果。
* **每個專案一個 (One per project)**。您可以透過將以下行新增至 `gradle.properties`，將整個專案編譯為單個 `.js` 檔案：

  ```none
  kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
  ```
  
* **每個檔案一個 (One per file)**。您可以設定更精細的輸出，為每個 Kotlin 檔案產生一個（或兩個，如果該檔案包含匯出的宣告）JavaScript 檔案。若要啟用每個檔案編譯模式：

  1. 將 `useEsModules()` 函數新增至您的建置檔案以支援 ECMAScript 模組：

     ```kotlin
     // build.gradle.kts
     kotlin {
         js(IR) {
             useEsModules() // Enables ES2015 modules
             browser()
         }
     }
     ```
  
     或者，您可以使用 `es2015` [編譯目標](js-project-setup#support-for-es2015-features)
     以支援專案中的 ES2015 功能。
  
  2. 應用 `-Xir-per-file` 編譯器選項或使用以下內容更新您的 `gradle.properties` 檔案：
  
     ```none
     # gradle.properties
     kotlin.js.ir.output.granularity=per-file // `per-module` is the default
     ```

## 生產環境中成員名稱的最小化 (Minification)

Kotlin/JS IR 編譯器使用其關於 Kotlin 類別和函數之間關係的內部資訊來應用更有效的最小化 (minification)，縮短函數、屬性和類別的名稱。這減少了產生的綁定應用程式的大小。

當您在 [生產](js-project-setup#building-executables) 模式下建置 Kotlin/JS 應用程式時，會自動套用此類型的最小化 (minification)，並且預設為啟用。若要停用成員名稱最小化 (minification)，請使用 `-Xir-minimized-member-names` 編譯器選項：

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

## 預覽：產生 TypeScript 宣告檔案 (d.ts)

:::caution
TypeScript 宣告檔案 (`d.ts`) 的產生是 [實驗性的 (Experimental)](components-stability)。它可能會隨時被刪除或更改。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues?q=%23%7BKJS:%20d.ts%20generation%7D) 上提供有關它的回饋。

:::

Kotlin/JS IR 編譯器能夠從您的 Kotlin 程式碼產生 TypeScript 定義。當處理混合應用程式時，JavaScript 工具和 IDE 可以使用這些定義來提供自動完成、支援靜態分析器，並使其更容易在 JavaScript 和 TypeScript 專案中包含 Kotlin 程式碼。

如果您的專案產生可執行檔 (`binaries.executable()`)，則 Kotlin/JS IR 編譯器會收集使用 [`@JsExport`](js-to-kotlin-interop#jsexport-annotation) 標記的任何頂層宣告，並在 `.d.ts` 檔案中自動產生 TypeScript 定義。

如果您想產生 TypeScript 定義，則必須在 Gradle 建置檔案中明確配置此選項。將 `generateTypeScriptDefinitions()` 新增至 [`js 區段`](js-project-setup#execution-environments)中的 `build.gradle.kts` 檔案。例如：

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

這些定義可以在 `build/js/packages/<package_name>/kotlin` 中與相應的未 webpacked JavaScript 程式碼一起找到。

## IR 編譯器目前的限制

新的 IR 編譯器後端的一個主要變更是**與預設後端不具備二進位檔相容性**。使用新的 IR 編譯器建立的程式庫使用 [`klib 格式`](native-libraries#library-format)，並且無法從預設後端使用。同時，使用舊編譯器建立的程式庫是一個包含 `js` 檔案的 `jar`，無法從 IR 後端使用。

如果您想為您的專案使用 IR 編譯器後端，您需要**將所有 Kotlin 依賴項更新為支援這個新後端的版本**。JetBrains 發布的針對 Kotlin/JS 的 Kotlin 1.4+ 程式庫已經包含使用新的 IR 編譯器後端所需的所有工件。

**如果您是程式庫作者**，希望提供與目前編譯器後端以及新的 IR 編譯器後端的相容性，請另外查看關於[為 IR 編譯器撰寫程式庫](#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)的章節。

與預設後端相比，IR 編譯器後端也存在一些差異。在嘗試新的後端時，最好注意這些可能的陷阱。

* 一些**依賴於預設後端的特定特性的程式庫**，例如 `kotlin-wrappers`，可能會顯示一些問題。您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-40525) 上追蹤調查和進度。
* 預設情況下，IR 後端**不會使 Kotlin 宣告對 JavaScript 可用**。為了使 Kotlin 宣告對 JavaScript 可見，**必須**使用 [`@JsExport`](js-to-kotlin-interop#jsexport-annotation) 進行註解。

## 將現有專案遷移到 IR 編譯器

由於兩個 Kotlin/JS 編譯器之間存在顯著差異，因此使您的 Kotlin/JS 程式碼與 IR 編譯器一起工作可能需要進行一些調整。在 [Kotlin/JS IR 編譯器遷移指南](js-ir-migration)中瞭解如何將現有的 Kotlin/JS 專案遷移到 IR 編譯器。

## 為 IR 編譯器撰寫具有向後相容性的程式庫

如果您是一位程式庫維護者，希望提供與預設後端以及新的 IR 編譯器後端的相容性，則可以使用編譯器選擇的設定，讓您可以為兩個後端建立工件，從而讓您可以保持與現有使用者的相容性，同時為下一代 Kotlin 編譯器提供支援。可以使用 `gradle.properties` 檔案中的 `kotlin.js.compiler=both` 設定來開啟這種所謂的 `both` 模式，也可以在 `build.gradle(.kts)` 檔案中 `js` 區塊內的專案特定選項中設定為其中一個：

```groovy
kotlin {
    js(BOTH) {
        // ...
    }
}
```

在 `both` 模式下，當從您的來源建置程式庫時，會同時使用 IR 編譯器後端和預設編譯器後端（因此得名）。這意味著將會產生具有 Kotlin IR 的 `klib` 檔案以及用於預設編譯器的 `jar` 檔案。當在同一個 Maven 座標下發布時，Gradle 將會根據用例自動選擇正確的工件 – 舊編譯器的 `js`，新編譯器的 `klib`。這使您可以為使用兩個編譯器後端中任何一個的專案編譯和發布您的程式庫。