[//]: # (title: Kotlin/JS 死碼消除)

> 死碼消除 (DCE) 工具已棄用。DCE 工具是為舊版 JS 後端設計的，而該後端現已淘汰。目前的 [JS IR 後端](#dce-and-javascript-ir-compiler) 已原生支援 DCE，且 [`@JsExport` 註解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 允許指定在 DCE 期間應保留哪些 Kotlin 函數和類別。
>
{style="warning"}

Kotlin 多平台 Gradle 外掛程式包含一個 [死碼消除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 工具。
死碼消除通常也稱為 _tree shaking_。它透過移除未使用的屬性、函數和類別，來縮減或最終生成的 JavaScript 程式碼的大小。

未使用的宣告可能出現在以下情況：

*   函數被內聯 (inlined) 且從未直接呼叫 (除了少數情況外，這種情況總是發生)。
*   模組使用共享函式庫。如果沒有 DCE，您未使用的函式庫部分仍會被包含在最終的套件中。
    例如，Kotlin 標準函式庫包含用於操作列表、陣列、字元序列、DOM 適配器等函數。所有這些功能將需要約 1.3 MB 的 JavaScript 檔案。一個簡單的「Hello, world」應用程式只需要控制台例程，而整個檔案只佔用幾千位元組。

當您建置**生產環境套件**時，Kotlin 多平台 Gradle 外掛程式會自動處理 DCE，例如透過使用 `browserProductionWebpack` 任務。**開發環境套件**任務 (例如 `browserDevelopmentWebpack`) 不包含 DCE。

## DCE 與 JavaScript IR 編譯器

DCE 在 IR 編譯器中的應用如下：

*   為開發環境編譯時，DCE 會被禁用，這對應以下 Gradle 任務：
    *   `browserDevelopmentRun`
    *   `browserDevelopmentWebpack`
    *   `nodeDevelopmentRun`
    *   `compileDevelopmentExecutableKotlinJs`
    *   `compileDevelopmentLibraryKotlinJs`
    *   其他名稱中包含「development」的 Gradle 任務
*   為生產環境編譯時，DCE 會被啟用，這對應以下 Gradle 任務：
    *   `browserProductionRun`
    *   `browserProductionWebpack`
    *   `compileProductionExecutableKotlinJs`
    *   `compileProductionLibraryKotlinJs`
    *   其他名稱中包含「production」的 Gradle 任務

透過 `@JsExport` 註解，您可以指定您希望 DCE 視為根的宣告。

## 從 DCE 中排除宣告

有時您可能需要在最終生成的 JavaScript 程式碼中保留某個函數或類別，即使您未在模組中使用它，例如，如果您打算在客戶端 JavaScript 程式碼中使用它。

為了防止某些宣告被消除，請將 `dceTask` 區塊加入您的 Gradle 建置腳本，並將這些宣告列為 `keep` 函數的參數。參數必須是宣告的完整限定名稱，並以模組名稱作為前綴：`moduleName.dot.separated.package.name.declarationName`

> 除非另有指定，否則函數和模組的名稱在生成的 JavaScript 程式碼中可能會被 [混淆 (mangled)](js-to-kotlin-interop.md#jsname-annotation)。為了防止這類函數被消除，請在 `keep` 參數中使用混淆後的名稱，即它們在生成的 JavaScript 程式碼中顯示的名稱。
>
{style="note"}

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

如果您想防止整個套件或模組被消除，您可以使用其在生成的 JavaScript 程式碼中顯示的完整限定名稱。

> 防止整個套件或模組被消除，可能會導致 DCE 無法移除許多未使用的宣告。因此，建議逐一選擇應從 DCE 中排除的個別宣告。
>
{style="note"}

## 禁用 DCE

要完全關閉 DCE，請在 `dceTask` 中使用 `devMode` 選項：

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