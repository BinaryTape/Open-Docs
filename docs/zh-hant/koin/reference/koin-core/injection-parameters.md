---
title: "傳遞參數 - 注入的參數 (Injected Parameters)"
---
在任何定義中，您都可以使用注入參數 (injection parameters)：這些參數將被注入並由您的定義使用。

## 傳遞數值以進行注入

給定一個定義，您可以將參數傳遞給該定義：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

參數使用 `parametersOf()` 函數傳送到您的定義（每個值用逗號分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // inject this as View value
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定義一個「注入參數」

以下是一個注入參數的範例。我們確立了需要一個 `view` 參數來建立 `Presenter` 類別。 我們使用 `params` 函數參數來協助檢索我們注入的參數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

您也可以直接使用參數物件以解構宣告的方式編寫注入的參數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
即使「解構」宣告更方便且更具可讀性，但它不是型別安全的。 如果您有多個值，Kotlin 不會檢測到傳遞的類型是否順序正確。
:::

## 依序解析注入參數

如果您有多個相同類型的參數，您可以不使用 `get()` 來解析參數，而是使用索引，如下所示 `get(index)`（與 `[ ]` 運算子相同）：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 從圖表解析注入參數

Koin 圖表解析 (Koin graph resolution，所有定義解析的主要樹狀結構) 也可讓您找到注入的參數。 只需使用常用的 `get()` 函數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入參數：索引值或集合 (`3.4.3`)

除了 `parametersOf` 之外，還可以存取以下 API：

- `parameterArrayOf`：使用數值陣列，資料將按其索引使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`：使用一組具有不同種類的值。 不使用索引來滾動數值。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

預設函數 `parametersOf` 同時使用索引和數值集：

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
  您可以使用 `parametersOf` 或 `parameterArrayOf` 「串聯」參數注入，以根據索引使用數值。 或者使用 `parametersOf` 或 `parameterSetOf` 根據類型串聯以進行解析。
:::