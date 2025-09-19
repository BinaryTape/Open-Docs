[//]: # (title: Kotlin/JS 編譯器功能)

Kotlin/JS 包含編譯器功能，可最佳化程式碼的效能、大小和開發速度。這透過編譯過程實現，該過程在生成 JavaScript 程式碼之前，將 Kotlin 程式碼轉換為中介表示 (IR)。

## 頂層屬性的延遲初始化

為了提升應用程式啟動效能，Kotlin/JS 編譯器會延遲初始化頂層屬性。透過這種方式，應用程式在載入時無需初始化其程式碼中使用的所有頂層屬性。它只初始化啟動時所需的屬性；其他屬性稍後會在實際執行使用它們的程式碼時才取得其值。

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

如果出於某種原因，您需要立即（在應用程式啟動時）初始化一個屬性，請使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} 註解來標記它。

## 開發二進位檔案的增量編譯

Kotlin/JS 編譯器為**開發二進位檔案**提供了**增量編譯模式**，這可以加速開發流程。在此模式下，編譯器會在模組層級快取 `compileDevelopmentExecutableKotlinJs` Gradle 任務的結果。它會在後續編譯期間使用未變更原始檔的快取編譯結果，從而使編譯完成得更快，特別是在只有少量變更的情況下。

增量編譯預設為啟用。若要停用開發二進位檔案的增量編譯，請將以下行新增到專案的 `gradle.properties` 或 `local.properties` 中：

```none
kotlin.incremental.js.ir=false // true by default
```

> 由於需要建立和填充快取，增量編譯模式下的乾淨建置通常會較慢。
>
{style="note"}

## 生產環境中成員名稱的最小化

Kotlin/JS 編譯器利用其關於 Kotlin 類別和函式關係的內部資訊，來應用更高效的最小化，縮短函式、屬性和類別的名稱。這減少了產生套件化應用程式的大小。

當您在 [生產](js-project-setup.md#building-executables) 模式下建置您的 Kotlin/JS 應用程式時，會自動應用此類型的最小化，並且預設為啟用。若要停用成員名稱最小化，請使用 `-Xir-minimized-member-names` 編譯器選項：

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