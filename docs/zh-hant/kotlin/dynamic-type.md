---
title: "動態類型 (Dynamic type)"
---
:::note
在以 JVM 為目標的程式碼中，不支援動態型別（dynamic type）。

:::

Kotlin 作為一種靜態型別語言，仍然需要與非型別或鬆散型別的環境（例如 JavaScript 生態系統）進行互通。為了方便這些使用案例，該語言提供了 `dynamic` 型別：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 型別基本上關閉了 Kotlin 的型別檢查器：

- `dynamic` 型別的值可以賦給任何變數或作為參數傳遞到任何地方。
- 任何值都可以賦給 `dynamic` 型別的變數或傳遞給以 `dynamic` 作為參數的函數。
- 針對 `dynamic` 型別值的 `null` 檢查會停用。

`dynamic` 最特殊的特性是，我們允許在 `dynamic` 變數上使用任何參數呼叫**任何**屬性或函數：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' 未在任何地方定義
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，此程式碼將「按原樣」編譯：Kotlin 中的 `dyn.whatever(1)` 變成產生的 JavaScript 程式碼中的 `dyn.whatever(1)`。

在 `dynamic` 型別的值上呼叫用 Kotlin 撰寫的函數時，請記住 Kotlin 到 JavaScript 編譯器執行的名稱修飾（name mangling）。您可能需要使用 [@JsName annotation](js-to-kotlin-interop#jsname-annotation) 來為需要呼叫的函數指定明確定義的名稱。

動態呼叫始終傳回 `dynamic` 作為結果，因此您可以自由地鏈式呼叫：

```kotlin
dyn.foo().bar.baz()
```

當您將 lambda 傳遞給動態呼叫時，預設情況下，其所有參數的型別均為 `dynamic`：

```kotlin
dyn.foo {
    x `->` x.bar() // x 是 dynamic
}
```

使用 `dynamic` 型別值的表達式會「按原樣」翻譯為 JavaScript，並且不使用 Kotlin 運算符慣例。支援以下運算符：

* 二元運算符：`+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 一元運算符
    * 前綴：`-`, `+`, `!`
    * 前綴和後綴：`++`, `--`
* 賦值運算符：`+=`, `-=`, `*=`, `/=`, `%=`
* 索引訪問：
    * 讀取：`d[a]`，多個參數會出錯
    * 寫入：`d[a1] = a2`，`[]` 中的多個參數會出錯

禁止對 `dynamic` 型別的值執行 `in`、`!in` 和 `..` 運算。

如需更詳細的技術描述，請參閱 [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types)。