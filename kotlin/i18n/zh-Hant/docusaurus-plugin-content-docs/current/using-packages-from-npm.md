---
title: "使用來自 npm 的依賴項"
---
在 Kotlin/JS 專案中，所有依賴項都可以通過 Gradle 外掛程式進行管理。 這包括 Kotlin/Multiplatform 函式庫，例如 `kotlinx.coroutines`、`kotlinx.serialization` 或 `ktor-client`。

為了依賴來自 [npm](https://www.npmjs.com/) 的 JavaScript 套件，Gradle DSL 公開了一個 `npm` 函數，可讓您指定要從 npm 導入的套件。 讓我們考慮導入一個名為 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的 NPM 套件。

Gradle 組建檔案中對應的部分如下所示：

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由於 JavaScript 模組通常是動態型別的，而 Kotlin 是一種靜態型別的語言，因此您需要提供一種轉接器（adapter）。 在 Kotlin 中，此類轉接器稱為 _外部宣告_（external declarations）。 對於僅提供一個函數的 `is-sorted` 套件，這個宣告寫起來很小。 在原始碼資料夾中，建立一個名為 `is-sorted.kt` 的新檔案，並填寫以下內容：

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

請注意，如果您使用 CommonJS 作為目標，則需要相應地調整 `@JsModule` 和 `@JsNonModule` 註解。

這個 JavaScript 函數現在可以像常規 Kotlin 函數一樣使用。 因為我們在標頭檔案中提供了型別資訊（而不是簡單地將參數和返回型別定義為 `dynamic`），所以還可以使用適當的編譯器支援和型別檢查。

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

在瀏覽器或 Node.js 中執行這三行程式碼，輸出顯示對 `sorted` 的呼叫已正確對應到 `is-sorted` 套件匯出的函數：

```kotlin
Hello, Kotlin/JS!
true
false
```

由於 JavaScript 生態系統有多種在套件中公開函數的方式（例如，通過命名或預設匯出），因此其他 npm 套件可能需要稍微修改其外部宣告的結構。

要了解有關如何編寫宣告的更多資訊，請參閱 [從 Kotlin 呼叫 JavaScript](js-interop)。