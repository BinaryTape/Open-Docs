[//]: # (title: Dynamic 型別)

> 在針對 JVM 的程式碼中不支援 `dynamic` 型別。
>
{style="note"}

作為一種靜態型別語言，Kotlin 仍須與無型別或弱型別的環境（例如 JavaScript 生態系統）進行互通。為了支援這些使用案例，語言中提供了 `dynamic` 型別：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 型別基本上會關閉 Kotlin 的型別檢查器：

- `dynamic` 型別的值可以指派給任何變數，或作為參數傳遞到任何地方。
- 任何值都可以指派給 `dynamic` 型別的變數，或傳遞給以 `dynamic` 作為參數的函式。
- 針對 `dynamic` 型別的值，`null` 檢查會被停用。

`dynamic` 最特殊的特性是，我們可以在 `dynamic` 變數上呼叫 **任何** 屬性或函式，並傳入任何參數：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' 未在任何地方定義
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，這段程式碼將會「原樣」編譯：Kotlin 中的 `dyn.whatever(1)` 會變成產生的 JavaScript 程式碼中的 `dyn.whatever(1)`。

當對 `dynamic` 型別的值呼叫以 Kotlin 編寫的函式時，請記住 Kotlin 轉 JavaScript 編譯器所執行的名稱修飾 (name mangling)。你可能需要使用 [@JsName 註解](js-to-kotlin-interop.md#jsname-annotation) 來為需要呼叫的函式指派定義明確的名稱。

`dynamic` 呼叫一律傳回 `dynamic` 作為結果，因此你可以自由地串接這些呼叫：

```kotlin
dyn.foo().bar.baz()
```

當你將 Lambda 傳遞給 `dynamic` 呼叫時，預設情況下其所有參數的型別均為 `dynamic`：

```kotlin
dyn.foo {
    x -> x.bar() // x 為 dynamic
}
```

使用 `dynamic` 型別值的運算式會「原樣」轉換為 JavaScript，且不使用 Kotlin 的運算子慣例。支援以下運算子：

* 二元：`+`、`-`、`*`、`/`、`%`、`>`、`<` `>=`、`<=`、`==`、`!=`、`===`、`!==`、`&&`、`||`
* 一元
    * 前綴：`-`、`+`、`!`
    * 前綴與後綴：`++`、`--`
* 指派：`+=`、`-=`、`*=`、`/=`、`%=`
* 索引存取：
    * 讀取：`d[a]`，超過一個引數會發生錯誤
    * 寫入：`d[a1] = a2`，`[]` 中超過一個引數會發生錯誤

禁止對 `dynamic` 型別的值使用 `in`、`!in` 和 `..` 運算。

如需更技術性的說明，請參閱 [規格文件](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。