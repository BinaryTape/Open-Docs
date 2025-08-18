---
title: 定義
---

使用 Koin，您可以在模組中描述定義。本節將探討如何宣告、組織與連結您的模組。

## 撰寫模組

Koin 模組是您*宣告所有元件的空間*。使用 `module` 函式來宣告 Koin 模組：

```kotlin
val myModule = module {
   // your dependencies here
}
```

在此模組中，您可以按照下方描述來宣告元件。

## 定義單例

宣告單例元件表示 Koin 容器將保留您所宣告元件的*唯一實例*。在模組中使用 `single` 函式來宣告單例：

```kotlin
class MyService()

val myModule = module {

    // declare single instance for MyService class
    single { MyService() }
}
```

## 在 Lambda 運算式中定義您的元件

`single`、`factory` 和 `scoped` 關鍵字協助您透過 Lambda 運算式來宣告您的元件。此 Lambda 描述了您建構元件的方式。通常我們透過建構函式實例化元件，但您也可以使用任何運算式。

`single { Class constructor // Kotlin expression }`

您的 Lambda 的結果型別是您元件的主要型別。

## 定義 Factory

Factory 元件宣告是一種定義，每次您請求此定義時，它都會提供您一個*新實例*（此實例不會被 Koin 容器保留，因為它稍後不會將此實例注入其他定義中）。使用帶有 Lambda 運算式的 `factory` 函式來建構元件。

```kotlin
class Controller()

val myModule = module {

    // declare factory instance for Controller class
    factory { Controller() }
}
```

:::info
 Koin 容器不會保留 Factory 實例，因為每次請求定義時它都會提供一個新實例。
:::

## 解析與注入依賴項

現在我們可以宣告元件定義了，我們希望透過依賴注入來連結實例。要在 Koin 模組中*解析實例*，只需使用 `get()` 函式來取得所需的元件實例。此 `get()` 函式通常用於建構函式中，以注入建構函式值。

:::info
 要使用 Koin 容器進行依賴注入，我們必須以*建構函式注入*的風格來撰寫：在類別建構函式中解析依賴項。如此一來，您的實例將會以來自 Koin 的注入實例來建立。
:::

讓我們以幾個類別為例：

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // declare Service as single instance
    single { Service() }
    // declare Controller as single instance, resolving View instance with get()
    single { Controller(get()) }
}
```

## 定義：綁定介面

`single` 或 `factory` 定義使用其給定 Lambda 定義的型別，即：`single { T }`。該定義的匹配型別是此運算式中唯一匹配的型別。

讓我們以一個類別和已實作介面為例：

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

在 Koin 模組中，我們可以使用 Kotlin 的 `as` 轉換運算子，如下所示：

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single { ServiceImp() as Service }

}
```

您也可以使用推斷型別運算式：

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single<Service> { ServiceImp() }

}
```

:::note
 這種第二種宣告方式是首選，並將在本文檔的其餘部分中使用。
:::

## 額外型別綁定

在某些情況下，我們希望從一個定義中匹配多種型別。

讓我們以一個類別和介面為例：

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

要使定義綁定額外型別，我們使用帶有類別的 `bind` 運算子：

```kotlin
val myModule = module {

    // Will match types ServiceImp & Service
    single { ServiceImp() } bind Service::class
}
```

請注意，這裡我們將直接使用 `get()` 解析 `Service` 型別。但如果我們有多個綁定 `Service` 的定義，我們就必須使用 `bind<>()` 函式。

## 定義：命名與預設綁定

您可以為您的定義指定一個名稱，以幫助您區分兩個相同型別的定義：

只需使用其名稱請求您的定義：

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` 和 `by inject()` 函式允許您在需要時指定定義名稱。此名稱是由 `named()` 函式產生的 `qualifier`。

預設情況下，如果型別已經綁定到一個定義，Koin 將透過其型別或名稱來綁定定義。

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

然後：

- `val service : Service by inject()` 將觸發 `ServiceImpl1` 定義
- `val service : Service by inject(named("test"))` 將觸發 `ServiceImpl2` 定義

## 宣告注入參數

在任何定義中，您都可以使用注入參數：這些參數將由您的定義注入並使用：

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

與已解析的依賴項（使用 `get()` 解析）相反，注入參數是*透過解析 API 傳遞的參數*。這表示這些參數是透過 `get()` 和 `by inject()` 並搭配 `parametersOf` 函式傳遞的值：

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

更多資訊請參閱[注入參數章節](/docs/reference/koin-core/injection-parameters)

## 定義終止 - OnClose

您可以使用 `onClose` 函式，在定義上添加一個回調，一旦呼叫定義關閉：

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 使用定義旗標

Koin DSL 也提供了一些旗標。

### 在啟動時建立實例

定義或模組可以被標記為 `CreatedAtStart`，以便在啟動時（或您需要時）建立。首先在您的模組或定義上設定 `createdAtStart` 旗標。

定義上的 CreatedAtStart 旗標

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // eager creation for this definition
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

模組上的 CreatedAtStart 旗標：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 函式將自動建立被 `createdAtStart` 標記的定義實例。

```kotlin
// Start Koin modules
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
如果您需要在特定時間（例如在背景執行緒而非 UI）載入某些定義，只需取得/注入所需的元件即可。
:::

### 處理泛型

Koin 定義不考慮泛型型別參數。例如，下面的模組嘗試定義兩個 List 的定義：

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin 不會以這樣的定義啟動，它會認為您想要覆寫其中一個定義。

為了允許您使用這兩個定義，您必須透過它們的名稱或位置（模組）來區分它們。例如：

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}
```