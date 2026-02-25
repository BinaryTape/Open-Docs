[//]: # (title: Kotlin/JS 編譯器特性)

Kotlin/JS 包含編譯器特性，用於優化程式碼的效能、大小和開發速度。
這透過編譯程序運作，在產生 JavaScript 程式碼之前，將 Kotlin 程式碼轉換為中間表示 (IR)。

## 頂層屬性的延遲初始化

為了獲得更好的應用程式啟動效能，Kotlin/JS 編譯器會延遲初始化頂層屬性。透過這種方式，
應用程式載入時不需要初始化其程式碼中使用的所有頂層屬性。它僅初始化
啟動時需要的屬性；其他屬性則在實際執行使用它們的程式碼時才獲得其值。

```kotlin
val a = run {
    val result = // 密集運算
    println(result)
    result
} // 值在首次使用時計算
```

如果出於某種原因您需要立即初始化屬性（在應用程式啟動時），請使用
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 註解對其進行標記。

## 開發二進位檔的增量編譯

Kotlin/JS 編譯器提供了「開發二進位檔的增量編譯模式」，可加速開發過程。
在該模式下，編譯器會在模組層級快取 `compileDevelopmentExecutableKotlinJs` Gradle 任務的結果。
在後續編譯期間，它會對未變更的原始檔使用快取的編譯結果，從而加快編譯完成的速度，
特別是在僅有微小變更的情況下。

增量編譯預設為啟用。若要停用開發二進位檔的增量編譯，請將以下行新增到專案的 `gradle.properties`
或 `local.properties`：

```none
kotlin.incremental.js.ir=false // 預設為 true
```

> 在增量編譯模式下進行清理組建通常較慢，因為需要建立並填充快取。
>
{style="note"}

## 生產環境中的成員名稱縮減

Kotlin/JS 編譯器利用有關 Kotlin 類別和函式關係的內部資訊來套用更有效的縮減，縮短函式、屬性和類別的名稱。這可以減少最終打包應用程式的大小。

當您在 [生產](js-project-setup.md#building-executables) 模式下建置 Kotlin/JS 應用程式時，會自動套用這種類型的縮減，並且預設為啟用。若要停用成員名稱縮減，請使用 `-Xir-minimized-member-names` 編譯器選項：

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## 無效程式碼刪除

[無效程式碼刪除](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) 藉由移除未使用的屬性、函式和類別，來減少產生的 JavaScript 程式碼大小。

未使用的宣告可能會出現在以下情況：

* 函式被內嵌且從未被直接呼叫（除了少數情況外，這種情況經常發生）。
* 模組使用共用程式庫。如果沒有 DCE，您未使用的程式庫部分仍會包含在產生的組合包中。
  例如，Kotlin 標準程式庫包含用於操作清單、陣列、字元序列、DOM 配接器等函式。所有這些功能作為 JavaScript 檔案大約需要 1.3 MB。一個簡單的
  "Hello, world" 應用程式只需要主控台常式，整個檔案僅需幾 KB。

在 Kotlin/JS 編譯器中，DCE 會自動處理：

* 在「開發 (development)」打包任務中停用 DCE，這些任務對應於以下 Gradle 任務：

  * `jsBrowserDevelopmentRun`
  * `jsBrowserDevelopmentWebpack`
  * `jsNodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * 其他名稱中包含 "development" 的 Gradle 任務

* 如果您建置「生產 (production)」組合包，則會啟用 DCE，這對應於以下 Gradle 任務：

  * `jsBrowserProductionRun`
  * `jsBrowserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * 其他名稱中包含 "production" 的 Gradle 任務

透過 [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) 註解，您可以指定希望 DCE 視為根 (roots) 的宣告。