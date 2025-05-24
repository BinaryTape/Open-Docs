---
title: "Kotlin/JS 無效程式碼消除 (dead code elimination)"
---
:::note
已棄用無效程式碼消除 (Dead Code Elimination, DCE) 工具。DCE 工具是為舊版 JS 後端設計的，該後端現已過時。目前的 [JS IR 後端](#dce-and-javascript-ir-compiler) 支援開箱即用的 DCE，並且 [@JsExport 註釋](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 允許指定在 DCE 期間要保留哪些 Kotlin 函數和類別。

Kotlin Multiplatform Gradle 外掛程式包含一個_[無效程式碼消除](https://wikipedia.org/wiki/Dead_code_elimination)_ (Dead Code Elimination, DCE) 工具。
無效程式碼消除通常也稱為 _tree shaking_。它透過移除未使用的屬性、函數和類別來減少產生的 JavaScript 程式碼的大小。

在以下情況下，可能會出現未使用的宣告：

* 函數被內聯並且從未被直接呼叫（除了少數情況外，總是會發生）。
* 模組使用共用函式庫。如果沒有 DCE，您不使用的函式庫部分仍然會包含在產生的套件中。
  例如，Kotlin 標準函式庫包含用於操作列表、陣列、字元序列、DOM 轉接器等的函數。所有這些功能作為 JavaScript 檔案將需要約 1.3 MB。一個簡單的 "Hello, world" 應用程式只需要 console 常式，整個檔案只需要幾 KB。

當您建置**生產套件**時，Kotlin Multiplatform Gradle 外掛程式會自動處理 DCE，例如使用 `browserProductionWebpack` 任務。**開發套件**任務（例如 `browserDevelopmentWebpack`）不包含 DCE。

## DCE 和 JavaScript IR 編譯器

將 DCE 與 IR 編譯器結合使用的過程如下：

* 為開發進行編譯時，DCE 會停用，這對應於以下 Gradle 任務：
  * `browserDevelopmentRun`
  * `browserDevelopmentWebpack`
  * `nodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 名稱中包含 "development" 的其他 Gradle 任務
* 為生產進行編譯時，DCE 會啟用，這對應於以下 Gradle 任務：
  * `browserProductionRun`
  * `browserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 名稱中包含 "production" 的其他 Gradle 任務

使用 @JsExport 註釋，您可以指定您希望 DCE 視為根目錄的宣告。

## 從 DCE 中排除宣告

有時您可能需要在產生的 JavaScript 程式碼中保留函數或類別，即使您不在模組中使用它，例如，如果您打算在用戶端 JavaScript 程式碼中使用它。

若要防止某些宣告被消除，請將 `dceTask` 區塊新增至您的 Gradle 建置腳本，並將宣告列為 `keep` 函數的引數。引數必須是宣告的完整名稱，並以模組名稱作為前綴：`moduleName.dot.separated.package.name.declarationName`

除非另有說明，否則函數和模組的名稱可以在產生的 JavaScript 程式碼中被 [mangled](js-to-kotlin-interop#jsname-annotation)。若要防止此類函數被消除，請在 `keep` 引數中使用產生的 JavaScript 程式碼中顯示的 mangled 名稱。

:::

```groovy
kotlin {
    js {
        browser {
            dceTask {
                keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
            }
            binaries.executable()
        }
    }
}
```

如果您想要防止整個套件或模組被消除，您可以使用其在產生的 JavaScript 程式碼中顯示的完整名稱。

:::note
防止整個套件或模組被消除可能會阻止 DCE 移除許多未使用的宣告。因此，最好逐一選擇應從 DCE 中排除的個別宣告。

:::

## 停用 DCE

若要完全關閉 DCE，請在 `dceTask` 中使用 `devMode` 選項：

```groovy
kotlin {
    js {
        browser {
            dceTask {
                dceOptions.devMode = true
            }
        }
        binaries.executable()
    }
}
```