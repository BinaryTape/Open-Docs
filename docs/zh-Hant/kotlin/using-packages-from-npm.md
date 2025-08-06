[//]: # (title: 使用 npm 依賴套件)

在 Kotlin/JS 專案中，所有依賴項都可以透過 Gradle 外掛程式管理。這包括 Kotlin/多平台函式庫，例如 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client`。

若要依賴來自 [npm](https://www.npmjs.com/) 的 JavaScript 套件，Gradle DSL 提供了一個 `npm` 函數，讓您可以指定要從 npm 匯入的套件。讓我們考慮匯入一個名為 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 NPM 套件。

Gradle 建置檔案中對應的部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由於 JavaScript 模組通常是動態型別的，而 Kotlin 是一種靜態型別語言，您需要提供一種轉接器。在 Kotlin 中，這類轉接器稱為 _外部宣告_。對於只提供一個函數的 `is-sorted` 套件，這個宣告寫起來很簡單。在原始碼資料夾內，建立一個名為 `is-sorted.kt` 的新檔案，並填入以下內容：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

請注意，如果您使用 CommonJS 作為目標，`@JsModule` 和 `@JsNonModule` 註解需要相應地調整。

這個 JavaScript 函數現在可以像常規的 Kotlin 函數一樣使用。因為我們在標頭檔案中提供了型別資訊（而不是簡單地將參數和回傳型別定義為 `dynamic`），所以也提供了適當的編譯器支援和型別檢查。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

無論是在瀏覽器中還是 Node.js 中執行這三行程式碼，輸出顯示對 `sorted` 的呼叫已正確對映到 `is-sorted` 套件匯出的函數：

```kotlin
Hello, Kotlin/JS!
true
false
```

由於 JavaScript 生態系統有多種方式在套件中公開函數（例如透過具名或預設匯出），其他 npm 套件的外部宣告可能需要稍微修改的結構。

若要了解更多關於如何編寫宣告的資訊，請參閱 [從 Kotlin 呼叫 JavaScript](js-interop.md)。