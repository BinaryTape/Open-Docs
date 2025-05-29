[//]: # (title: dynamic 型別)

> 以 JVM 為目標的程式碼不支援 dynamic 型別。
>
{style="note"}

Kotlin 作為一種靜態型別語言，仍然必須與非型別或鬆散型別的環境（例如 JavaScript 生態系統）互通。為了這些使用情境提供便利，語言中提供了 `dynamic` 型別：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 型別基本上會關閉 Kotlin 的型別檢查器：

- `dynamic` 型別的值可以賦值給任何變數，或作為參數傳遞到任何地方。
- 任何值都可以賦值給 `dynamic` 型別的變數，或傳遞給接收 `dynamic` 作為參數的函數。
- `dynamic` 型別值的 null 檢查會被禁用。

`dynamic` 最獨特之處在於，我們可以在一個 `dynamic` 變數上呼叫**任何**屬性或函數，並傳遞任何參數：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，這段程式碼將「原樣」編譯：Kotlin 中的 `dyn.whatever(1)` 會變成生成的 JavaScript 程式碼中的 `dyn.whatever(1)`。

當在 `dynamic` 型別的值上呼叫用 Kotlin 編寫的函數時，請記住 Kotlin 到 JavaScript 編譯器執行的名稱混淆。您可能需要使用 [@JsName 註解](js-to-kotlin-interop.md#jsname-annotation) 來為您需要呼叫的函數賦予明確定義的名稱。

dynamic 呼叫總是回傳 `dynamic` 作為結果，因此您可以自由地鏈接此類呼叫：

```kotlin
dyn.foo().bar.baz()
```

當您傳遞一個 lambda 給 dynamic 呼叫時，其所有參數預設都具有 `dynamic` 型別：

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

使用 `dynamic` 型別值的表達式會「原樣」翻譯為 JavaScript，並且不使用 Kotlin 運算子慣例。支援以下運算子：

* 二元：`+`、`-`、`*`、`/`、`%`、`>`、`<` `>=`、`<=`、`==`、`!=`、`===`、`!==`、`&&`、`||`
* 一元
    * 前綴：`-`、`+`、`!`
    * 前綴和後綴：`++`、`--`
* 賦值：`+=`、`-=`、`*=`、`/=`、`%=`
* 索引存取：
    * 讀取：`d[a]`，多於一個參數是錯誤
    * 寫入：`d[a1] = a2`，方括號中多於一個參數是錯誤

`in`、`!in` 和 `..` 運算與 `dynamic` 型別的值一起使用是被禁止的。

有關更詳細的技術描述，請參閱[規範文件](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。