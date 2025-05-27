---
title: Koin 組件
---

Koin 是一個 DSL，用於協助描述您的模組和定義，以及一個用於進行定義解析的容器。我們現在需要一個 API 來從容器外部擷取我們的實例。這就是 Koin 組件 (Koin Component) 的目標。

:::info
 `KoinComponent` 介面旨在協助您直接從 Koin 擷取實例。請注意，這會將您的類別連結到 Koin 容器的 API。應避免將其用於可以在 `modules` 中宣告的類別，並優先使用建構函式注入 (constructor injection)。
:::

## 建立 Koin 組件

為了讓一個類別能夠使用 Koin 功能，我們需要使用 `KoinComponent` 介面來*標記它*。讓我們來看一個範例。

一個定義 `MyService` 實例的模組
```kotlin
class MyService

val myModule = module {
    // Define a singleton for MyService
    single { MyService() }
}
```

在我們使用定義之前啟動 Koin。

使用 `myModule` 啟動 Koin

```kotlin
fun main(vararg args : String){
    // Start Koin
    startKoin {
        modules(myModule)
    }

    // Create MyComponent instance and inject from Koin container
    MyComponent()
}
```

這就是我們如何撰寫 `MyComponent` 以從 Koin 容器擷取實例的方式。

使用 `get()` 和 `by inject()` 注入 `MyService` 實例

```kotlin
class MyComponent : KoinComponent {

    // lazy inject Koin instance
    val myService : MyService by inject()

    // or
    // eager inject Koin instance
    val myService : MyService = get()
}
```

## 使用 KoinComponents 解鎖 Koin API

一旦您將類別標記為 `KoinComponent`，您將獲得以下功能：

*   `by inject()` - 從 Koin 容器中*惰性評估*的實例
*   `get()` - 從 Koin 容器中*即時擷取*的實例
*   `getProperty()`/`setProperty()` - 取得/設定屬性

## 使用 `get` 和 `inject` 擷取定義

Koin 提供兩種從 Koin 容器擷取實例的方式：

*   `val t : T by inject()` - 惰性評估的委託實例
*   `val t : T = get()` - 即時存取實例

```kotlin
// is lazy evaluated
val myService : MyService by inject()

// retrieve directly the instance
val myService : MyService = get()
```

:::note
 惰性注入 (lazy inject) 的形式更適合定義需要惰性評估的屬性。
:::

## 從名稱解析實例

如果您需要，可以使用 `get()` 或 `by inject()` 指定以下參數：

*   `qualifier` - 定義的名稱 (當您在定義中指定了名稱參數時)

使用定義名稱的模組範例：

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

我們可以進行以下解析：

```kotlin
// retrieve from given module
val a = get<ComponentA>(named("A"))
```