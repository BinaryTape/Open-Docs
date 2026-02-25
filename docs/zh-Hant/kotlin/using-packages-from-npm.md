[//]: # (title: 使用來自 npm 的相依性)

在 Kotlin/JS 專案中，所有的相依性都可以透過 Gradle 外掛程式進行管理。這包括 Kotlin/Multiplatform 程式庫，例如 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client`。

針對來自 [npm](https://www.npmjs.com/) 的 JavaScript 軟件包相依性，Gradle DSL 提供了 `npm` 函式，讓您可以指定要從 npm 匯入的軟件包。讓我們以匯入名為 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 npm 軟件包為例。

Gradle 建置檔案中的對應部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由於 JavaScript 模組通常是動態型別的，而 Kotlin 則是靜態型別語言，因此您需要提供一種轉接器。在 Kotlin 中，這類轉接器被稱為「外部宣告」(_external declarations_)。對於僅提供一個函式的 `is-sorted` 軟件包來說，編寫這個宣告非常簡單。在原始碼資料夾中，建立一個名為 `is-sorted.kt` 的新檔案，並填入以下內容：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

請注意，如果您使用 CommonJS 作為目標，則需要相應地調整 `@JsModule` 與 `@JsNonModule` 註解。

現在可以像使用一般的 Kotlin 函式一樣使用這個 JavaScript 函式。因為我們在標頭檔案中提供了型別資訊（而不是簡單地將參數和傳回型別定義為 `dynamic`），所以也可以使用完善的編譯器支援和型別檢查。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

在瀏覽器或 Node.js 中執行這三行程式碼，輸出結果顯示對 `sorted` 的呼叫已正確對應到 `is-sorted` 軟件包匯出的函式：

```kotlin
Hello, Kotlin/JS!
true
false
```

由於 JavaScript 生態系統有多種在軟件包中公開函式的方式（例如透過具名匯出或預設匯出），其他 npm 軟件包的外部宣告結構可能需要進行微調。

若要進一步了解如何編寫宣告，請參閱[從 Kotlin 呼叫 JavaScript](js-interop.md)。