---
title: 傳遞參數 - 注入參數
---

在任何定義中，您都可以使用注入參數：這些參數將會被注入並由您的定義使用。

## 傳遞值以供注入

給定一個定義，您可以將參數傳遞給該定義：

```kotlin
class Presenter(val a : A, val b : B)

val myModule = module {
    single { params -> Presenter(a = params.get(), b = params.get()) }
}
```

參數會透過 `parametersOf()` 函數傳送給您的定義（每個值以逗號分隔）：

```kotlin
class MyComponent : View, KoinComponent {

    val a : A ...
    val b : B ... 

    // 將此作為 View 值注入
    val presenter : Presenter by inject { parametersOf(a, b) }
}
```

## 定義「注入參數」

下方是注入參數的範例。我們確定需要一個 `view` 參數來建構 `Presenter` 類別。我們使用 `params` 函數參數來幫助取得我們的注入參數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { params -> Presenter(view = params.get()) }
}
```

您也可以直接透過參數物件，以解構宣告 (destructured declaration) 的方式來撰寫您的注入參數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { (view : View) -> Presenter(view) }
}
```

:::caution
即使「解構」宣告更方便且更具可讀性，它並不是型別安全的 (type safe)。如果您有多個值，Kotlin 將無法偵測傳入的型別是否依序正確。
:::

## 依序解析注入參數

與其使用 `get()` 來解析參數，如果您有多個相同型別的參數，您可以依循以下方式使用索引 `get(index)`（也等同於 `[ ]` 運算子）：

```kotlin
class Presenter(val view : View)

val myModule = module {
    
    single { p -> Presenter(p[0],p[1]) }
}
```

## 從圖形解析注入參數

Koin 圖形解析（所有定義的主要解析樹）也讓您可以找到您的注入參數。只需使用一般的 `get()` 函數：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single { Presenter(get()) }
}
```

## 注入參數：索引值或集合 (`3.4.3`)

除了 `parametersOf` 之外，以下 API 均可存取：

- `parameterArrayOf`：用於使用一個值陣列，且資料將透過其索引來使用

```kotlin
val params = parameterArrayOf(1,2,3)
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 3
params.get<Int>() == 3
```

- `parameterSetOf`：用於使用一個值集合，具有不同種類。不使用索引來取值。

```kotlin
val params = parameterSetOf("a_string", 42)
params.get<Int>() == 42
params.get<String>() == "a_string"
params.get<Int>() == 42
params.get<String>() == "a_string"
```

預設函數 `parametersOf` 可同時與索引及值集合搭配使用：

```kotlin
val params = parametersOf(1,2,"a_string")
params.get<String>() == "a_string"
params.get<Int>() == 1
params.get<Int>() == 2
params.get<Int>() == 2
params.get<String>() == "a_string"
```

:::note
您可以透過 `parametersOf` 或 `parameterArrayOf`「串聯」(cascade) 參數注入，以根據索引來消耗值。或者使用 `parametersOf` 或 `parameterSetOf`，以根據型別來串聯解析。
:::