[//]: # (title: 動態類型)

> 目標 JVM 的程式碼不支援 `dynamic` 型別。
>
{style="note"}

作為一種靜態型別語言，Kotlin 仍然需要與無型別或鬆散型別的環境（例如 JavaScript 生態系統）進行互通。為促進這些使用場景，語言中提供了 `dynamic` 型別：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 型別基本上會關閉 Kotlin 的型別檢查器：

- `dynamic` 型別的值可以賦值給任何變數或作為參數傳遞到任何地方。
- 任何值都可以賦值給 `dynamic` 型別的變數，或傳遞給接收 `dynamic` 作為參數的函式。
- 對於 `dynamic` 型別的值，`null` 檢查已停用。

`dynamic` 最獨特的功能是，我們被允許在 `dynamic` 變數上呼叫**任何**屬性或函式，並傳遞任何參數：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' 未在任何地方定義
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台，這段程式碼將「按原樣」編譯：Kotlin 中的 `dyn.whatever(1)` 在生成的 JavaScript 程式碼中會變成 `dyn.whatever(1)`。

當在 `dynamic` 型別的值上呼叫用 Kotlin 編寫的函式時，請記住 Kotlin 到 JavaScript 編譯器執行的名稱混淆。您可能需要使用 [@JsName 註解](js-to-kotlin-interop.md#jsname-annotation) 來為您需要呼叫的函式指定明確定義的名稱。

動態呼叫總是回傳 `dynamic` 作為結果，因此您可以自由地鏈接此類呼叫：

```kotlin
dyn.foo().bar.baz()
```

當您將 Lambda 傳遞給動態呼叫時，其所有參數預設都具有 `dynamic` 型別：

```kotlin
dyn.foo {
    x -> x.bar() // x 是 dynamic 型別
}
```

使用 `dynamic` 型別值的表達式會「按原樣」翻譯成 JavaScript，並且不使用 Kotlin 運算子慣例。支援以下運算子：

*   二元運算子: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
*   一元運算子
    *   前置: `-`, `+`, `!`
    *   前置和後置: `++`, `--`
*   賦值運算子: `+=`, `-=`, `*=`, `/=`, `%=`
*   索引存取:
    *   讀取: `d[a]`，多於一個引數是錯誤
    *   寫入: `d[a1] = a2`，`[]` 中多於一個引數是錯誤

使用 `dynamic` 型別值的 `in`、`!in` 和 `..` 運算被禁止。

有關更詳細的技術描述，請參閱[規範文件](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。