---
title: 定義
---

使用 Koin，您可以在模組中描述定義。在此章節中，我們將了解如何宣告、組織和連結您的模組。

## 撰寫模組

Koin 模組是**宣告您所有元件的空間**。使用 `module` 函式來宣告 Koin 模組：

```kotlin
val myModule = module {
   // 這裡放入您的相依性
}
```

在此模組中，您可以依照下述方式宣告元件。

## 定義 singleton

宣告 singleton 元件意味著 Koin 容器將保留您所宣告元件的**單一執行個體**。在模組中使用 `single` 函式來宣告 singleton：

```kotlin
class MyService()

val myModule = module {

    // 為 MyService 類別宣告單一執行個體
    single { MyService() }
}
```

## 在 Lambda 運算式中定義元件

`single`、`factory` 和 `scoped` 關鍵字可協助您透過 Lambda 運算式宣告元件。此 Lambda 描述了您建置元件的方式。通常我們透過建構函式來具現化元件，但您也可以使用任何運算式。

`single { Class constructor // Kotlin 運算式 }`

Lambda 運算式的傳回型別即為元件的主要型別。

## 定義 factory

factory 元件宣告是一種在**每次請求該定義時都會提供新執行個體**的定義（此執行個體不會被 Koin 容器保留，因為稍後它不會將此執行個體注入到其他定義中）。使用 `factory` 函式配合 Lambda 運算式來建置元件。

```kotlin
class Controller()

val myModule = module {

    // 為 Controller 類別宣告 factory 執行個體
    factory { Controller() }
}
```

:::info
 Koin 容器不會保留 factory 執行個體，因為每次請求定義時它都會提供新的執行個體。
:::

## 解析與注入相依性

現在我們可以宣告元件定義，我們希望透過相依注入來連結執行個體。要在 Koin 模組中**解析執行個體**，只需使用 `get()` 函式來請求所需的元件執行個體。此 `get()` 函式通常用於建構函式中，以注入建構函式的值。

:::info
 要使用 Koin 容器進行相依注入，我們必須以**建構函式注入**樣式撰寫：在類別建構函式中解析相依性。如此一來，您的執行個體將使用 Koin 注入的執行個體來建立。
:::

讓我們看一個包含多個類別的範例：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // 將 Service 宣告為單一執行個體
    single { Service() }
    // 將 Controller 宣告為單一執行個體，使用 get() 解析 View 執行個體
    single { Controller(get()) }
}
```

## 定義：繫結介面

`single` 或 `factory` 定義使用其給定 Lambda 定義的型別，例如：`single { T }`。定義的相符型別是此運算式中唯一相符的型別。

讓我們看一個類別與實作介面的範例：

```kotlin
// Service 介面
interface Service{

    fun doSomething()
}

// Service 實作
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

在 Koin 模組中，我們可以如下使用 Kotlin 的 `as` 轉換運算子：

```kotlin
val myModule = module {

    // 僅會配對型別 ServiceImp
    single { ServiceImp() }

    // 僅會配對型別 Service
    single { ServiceImp() as Service }

}
```

您也可以使用推論型別運算式：

```kotlin
val myModule = module {

    // 僅會配對型別 ServiceImp
    single { ServiceImp() }

    // 僅會配對型別 Service
    single<Service> { ServiceImp() }

}
```

:::note
 偏好使用這第二種宣告樣式，且本文件的其餘部分都將使用此方式。
:::

## 額外型別繫結

在某些情況下，我們希望從單一定義中配對多個型別。

讓我們看一個類別與介面的範例：

```kotlin
// Service 介面
interface Service{

    fun doSomething()
}

// Service 實作
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

為了讓定義繫結額外型別，我們對類別使用 `bind` 運算子：

```kotlin
val myModule = module {

    // 將配對型別 ServiceImp 與 Service
    single { ServiceImp() } bind Service::class
}
```

請注意，這裡我們可以直接使用 `get()` 解析 `Service` 型別。但如果我們有多個定義繫結 `Service`，則必須使用 `bind<>()` 函式。

## 定義：命名與預設繫結

您可以為定義指定名稱，以協助您區分相同型別的兩個定義：

只需透過名稱請求您的定義：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` 和 `by inject()` 函式可讓您在需要時指定定義名稱。此名稱是由 `named()` 函式產生的 `qualifier`（限定詞）。

預設情況下，如果型別已經繫結到一個定義，Koin 將透過其型別或名稱來繫結定義。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

接著：

- `val service : Service by inject()` 將觸發 `ServiceImpl1` 定義
- `val service : Service by inject(named("test"))` 將觸發 `ServiceImpl2` 定義

## 宣告注入參數

在任何定義中，您都可以使用注入參數：這些參數將被注入並由您的定義使用：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

與已解析的相依性（使用 `get()` 解析）不同，注入參數是**透過解析 API 傳遞的參數**。這意味著這些參數是透過 `get()` 和 `by inject()` 搭配 `parametersOf` 函式傳遞的值：

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

進一步閱讀請參閱 [注入參數章節](/docs/reference/koin-core/injection-parameters)

## 定義結束 - OnClose

您可以使用 `onClose` 函式在定義上新增回呼，當定義關閉被呼叫時執行：

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // 關閉回呼 - 物件為 Presenter }
}
```

## 使用定義標記

Koin DSL 還提供了一些標記。

### 在啟動時建立執行個體

定義或模組可以被標記為 `CreatedAtStart`，以便在啟動時（或您想要的時候）建立。首先在您的模組或定義上設定 `createdAtStart` 標記。

定義上的 CreatedAtStart 標記

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 為此定義進行預先建立
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

模組上的 CreatedAtStart 標記：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 函式將自動建立標記有 `createdAtStart` 的定義執行個體。

```kotlin
// 啟動 Koin 模組
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
如果您需要在特定時間載入某些定義（例如在背景工作執行緒中而不是在 UI 執行緒中），只需 get/inject 所需的元件即可。
:::

### 處理泛型

Koin 定義不考慮泛型型別引數。例如，下方的模組嘗試定義 `List` 的兩個定義：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin 無法使用此類定義啟動，因為它會認為您想用一個定義來覆寫另一個。

為了允許使用這兩個定義，您必須透過它們的名稱或位置（模組）來區分它們。例如：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}