---
title: 傳遞參數 - 注入參數
---

在任何定義中，您都可以使用注入參數：這些參數將被注入並由您的定義使用。

## 傳遞值以進行注入

給定一個定義，您可以將參數傳遞給該定義：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

參數透過 `parametersOf()` 函式傳送到您的定義中（每個值以逗號分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // 將此注入為 View 值
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定義「注入參數」

以下是注入參數的範例。我們確定需要一個 `view` 參數來建立 `Presenter` 類別。我們使用 `params` 函式引數來協助擷取我們的注入參數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

您也可以直接使用參數物件將注入參數編寫為解構宣告：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
 即使「解構」宣告更方便且更具可讀性，但它並非型別安全。如果您有多個值，Kotlin 將無法偵測傳遞的型別順序是否正確。
:::

## 依序解析注入參數

如果您有多個相同型別的參數，可以使用索引來解析參數，例如 `get(index)`（與 `[ ]` 運算子相同），而不是使用 `get()`：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 從圖形中解析注入參數

Koin 圖形解析（所有定義解析的主樹）也允許您尋找注入參數。只需使用常用的 `get()` 函式即可：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入參數：索引值或集合 (`3.4.3`)

除了 `parametersOf` 之外，還可以使用以下 API：

- `parameterArrayOf`: 使用值陣列，且資料將透過其索引使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`: 使用一組具有不同種類的值。不使用索引來輪詢值。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

預設函式 `parametersOf` 可同時處理索引與值集合：

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
 您可以使用 `parametersOf` 或 `parameterArrayOf` 來「級聯（cascade）」參數注入，以便根據索引取用值。或者使用 `parametersOf` 或 `parameterSetOf` 根據型別進行級聯解析。
:::