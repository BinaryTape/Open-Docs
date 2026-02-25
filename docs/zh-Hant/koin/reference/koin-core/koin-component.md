---
title: Koin 組件
---

Koin 是一個協助描述模組與定義的 DSL，也是一個執行定義解析的容器。我們現在需要的是一個能在容器外部獲取執行個體的 API。這就是 Koin 組件的目標。

:::info
 `KoinComponent` 介面旨在協助你直接從 Koin 獲取執行個體。請注意，這會將你的類別與 Koin 容器 API 連結。請避免在可以於 `modules` 中宣告的類別上使用它，並優先使用建構函式注入。
:::

## 建立 Koin 組件

為了讓類別具備使用 Koin 特性的能力，我們需要為其 *標記* `KoinComponent` 介面。讓我們看一個範例。

定義 MyService 執行個體的模組：
```kotlin
class MyService

val myModule = module {
    // 為 MyService 定義一個單例（singleton）
    single { MyService() }
}
```

我們在便用定義之前啟動 Koin。

使用 myModule 啟動 Koin：

```kotlin
fun main(vararg args : String){
    // 啟動 Koin
    startKoin {
        modules(myModule)
    }

    // 建立 MyComponent 執行個體並從 Koin 容器中注入
    MyComponent()
}
```

以下是我們如何編寫 `MyComponent` 以從 Koin 容器獲取執行個體的方式。

使用 get() 與 by inject() 注入 MyService 執行個體：

```kotlin
class MyComponent : KoinComponent {

    // 延遲注入 Koin 執行個體
    val myService : MyService by inject()

    // 或者
    // 立即注入 Koin 執行個體
    val myService : MyService = get()
}
```

## 透過 KoinComponents 解鎖 Koin API

一旦你將類別標記為 `KoinComponent`，你就能存取：

* `by inject()` - 從 Koin 容器延遲評估執行個體
* `get()` - 從 Koin 容器立即獲取執行個體
* `getProperty()`/`setProperty()` - 獲取/設定屬性

## 使用 get 與 inject 獲取定義

Koin 提供兩種從 Koin 容器獲取執行個體的方式：

* `val t : T by inject()` - 延遲評估的委派執行個體
* `val t : T = get()` - 立即存取執行個體

```kotlin
// 是延遲評估的
val myService : MyService by inject()

// 直接獲取執行個體
val myService : MyService = get()
```

:::note
 延遲注入（lazy inject）形式較適合用於定義需要延遲評估的屬性。
:::

## 透過名稱解析執行個體

如果需要，你可以在 `get()` 或 `by inject()` 中指定以下參數：

* `qualifier` - 定義的名稱（在定義中指定名稱參數時）

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
// 從指定模組獲取
val a = get<ComponentA>(named("A"))