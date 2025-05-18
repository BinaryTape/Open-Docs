---
title: 定義
---
使用 Koin 時，您可以在模組中描述定義。在本節中，我們將了解如何宣告、組織和連結您的模組。

## 編寫模組 (Writing a module)

Koin 模組是*宣告所有元件的空間*。 使用 `module` 函式來宣告 Koin 模組：

```kotlin
val myModule = module {
   // 您的依賴項在此處
}
```

在此模組中，您可以宣告如下所述的元件。

## 定義單例 (Defining a singleton)

宣告單例元件意味著 Koin 容器將保留您宣告的元件的*唯一實例*。 在模組中使用 `single` 函式來宣告單例：

```kotlin
class MyService()

val myModule = module {

    // 宣告 MyService 類別的單例實例
    single { MyService() }
}
```

## 在 Lambda 運算式中定義元件 (Defining your component within a lambda)

`single`、`factory` & `scoped` 關鍵字可幫助您透過 Lambda 運算式宣告元件。 此 Lambda 描述了您建構元件的方式。 通常，我們透過元件的建構函式來實例化元件，但您也可以使用任何運算式。

`single { Class 建構函式 // Kotlin 運算式 }`

Lambda 運算式的結果類型是元件的主要類型

## 定義工廠 (Defining a factory)

工廠元件宣告是一種定義，它會在您每次請求此定義時提供*新實例*（此實例不會由 Koin 容器保留，因為它稍後不會將此實例注入到其他定義中）。 使用帶有 Lambda 運算式的 `factory` 函式來建構元件。

```kotlin
class Controller()

val myModule = module {

    // 宣告 Controller 類別的工廠實例
    factory { Controller() }
}
```

:::info
Koin 容器不會保留工廠實例，因為它會在每次請求定義時提供一個新實例。
:::

## 解析與注入依賴項 (Resolving & injecting dependencies)

現在我們可以宣告元件定義，我們想要透過依賴注入連結實例。 若要*解析 Koin 模組中的實例*，只需使用 `get()` 函式來取得請求的所需元件實例。 此 `get()` 函式通常用於建構函式中，以注入建構函式值。

:::info
若要使用 Koin 容器進行依賴注入，我們必須以*建構函式注入*樣式編寫它：在類別建構函式中解析依賴項。 這樣，您的實例將會使用 Koin 中注入的實例建立。
:::

讓我們舉一個包含多個類別的例子：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // 宣告 Service 作為單例實例
    single { Service() }
    // 宣告 Controller 作為單例實例，使用 get() 解析 View 實例
    single { Controller(get()) }
}
```

## 定義：綁定介面 (Definition: binding an interface)

`single` 或 `factory` 定義使用其給定的 Lambda 定義中的類型，即：`single { T }`。
定義的匹配類型是此運算式中唯一匹配的類型。

讓我們舉一個包含類別和已實現介面的例子：

```kotlin
// Service 介面
interface Service{

    fun doSomething()
}

// Service 實現
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

在 Koin 模組中，我們可以如下使用 `as` 類型轉換 Kotlin 運算子：

```kotlin
val myModule = module {

    // 將僅匹配 ServiceImp 類型
    single { ServiceImp() }

    // 將僅匹配 Service 類型
    single { ServiceImp() as Service }

}
```

您也可以使用推斷類型運算式：

```kotlin
val myModule = module {

    // 將僅匹配 ServiceImp 類型
    single { ServiceImp() }

    // 將僅匹配 Service 類型
    single<Service> { ServiceImp() }

}
```

:::note
此第二種樣式的宣告是首選，並將用於本文件其餘部分。
:::

## 其他類型綁定 (Additional type binding)

在某些情況下，我們想要從一個定義中匹配多種類型。

讓我們舉一個包含類別和介面的例子：

```kotlin
// Service 介面
interface Service{

    fun doSomething()
}

// Service 實現
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

若要使定義綁定其他類型，我們將 `bind` 運算子與類別一起使用：

```kotlin
val myModule = module {

    // 將匹配 ServiceImp 和 Service 類型
    single { ServiceImp() } bind Service::class
}
```

請注意，我們將使用 `get()` 直接解析 `Service` 類型。 但是，如果我們有多個定義綁定 `Service`，我們必須使用 `bind<>()` 函式。

## 定義：命名與預設綁定 (Definition: naming & default bindings)

您可以指定定義的名稱，以幫助您區分關於同一類型的兩個定義：

只需使用其名稱請求您的定義：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

如果需要，`get()` 和 `by inject()` 函式可讓您指定定義名稱。 此名稱是由 `named()` 函式產生的 `qualifier`（限定詞）。

預設情況下，如果該類型已綁定到定義，Koin 將按其類型或按其名稱綁定定義。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

然後：

- `val service : Service by inject()` 將觸發 `ServiceImpl1` 定義
- `val service : Service by inject(named("test"))` 將觸發 `ServiceImpl2` 定義

## 宣告注入參數 (Declaring injection parameters)

在任何定義中，您都可以使用注入參數：這些參數將被注入並由您的定義使用：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

與已解析的依賴項（使用 `get()` 解析）相反，注入參數是*透過解析 API 傳遞的參數*。
這表示這些參數是使用 `parametersOf` 函式與 `get()` 和 `by inject()` 一起傳遞的值：

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

更多資訊請參閱 [注入參數章節](/reference/koin-core/injection-parameters.md)

## 定義終止 - OnClose

您可以使用 `onClose` 函式，在定義中加入回呼，一旦呼叫定義關閉時：

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // 關閉回呼 - 它是 Presenter }
}
```

## 使用定義標誌 (Using definition flags)

Koin DSL 還提供了一些標誌 (flags)。

### 在啟動時建立實例 (Create instances at start)

可以將定義或模組標記為 `CreatedAtStart`，以便在啟動時（或在您想要時）建立。 首先，在您的模組或定義上設定 `createdAtStart` 標誌。

在定義上設定 CreatedAtStart 標誌

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 渴望建立此定義
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

在模組上設定 CreatedAtStart 標誌：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 函式將自動建立標記為 `createdAtStart` 的定義實例。

```kotlin
// 啟動 Koin 模組
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
如果您需要在特定時間載入某些定義（例如，在背景執行緒中而不是在 UI 中），只需取得/注入所需的元件即可。
:::

### 處理泛型 (Dealing with generics)

Koin 定義不考慮泛型類型引數。 例如，下面的模組試圖定義 List 的 2 個定義：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin 無法使用此類定義啟動，因為它理解您想要覆蓋另一個定義。

為了讓您使用這 2 個定義，您必須透過它們的名稱或位置（模組）來區分它們。 例如：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}
```