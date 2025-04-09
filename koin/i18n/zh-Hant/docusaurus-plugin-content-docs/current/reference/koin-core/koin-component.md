---
title: "Koin 組件 (Component)"
---
Koin 是一個 DSL，用於描述您的模組和定義，一個容器用於進行定義解析。 現在我們需要的是一個 API，用於從容器外部檢索我們的實例。 這就是 Koin 組件（Koin Components）的目標。

:::info
`KoinComponent` 介面旨在幫助您直接從 Koin 檢索實例。 請注意，這會將您的類別連結到 Koin 容器 API。 避免在您可以在 `modules` 中宣告的類別上使用它，而應優先選擇建構函式注入（constructor injection）。
:::

## 創建 Koin 組件（Create a Koin Component）

為了賦予一個類別使用 Koin 功能的能力，我們需要使用 `KoinComponent` 介面 *標記它*。 讓我們舉一個例子。

一個用於定義 MyService 實例的模組
```kotlin
class MyService

val myModule = module {
    // 定義 MyService 的單例
    single { MyService() }
}
```

在使用定義之前，我們啟動 Koin。

使用 myModule 啟動 Koin

```kotlin
fun main(vararg args : String){
    // 啟動 Koin
    startKoin {
        modules(myModule)
    }

    // 創建 MyComponent 實例並從 Koin 容器注入
    MyComponent()
}
```

以下是我們如何編寫 `MyComponent` 以從 Koin 容器檢索實例。

使用 get() & by inject() 注入 MyService 實例

```kotlin
class MyComponent : KoinComponent {

    // 惰性注入 Koin 實例
    val myService : MyService by inject()

    // 或
    // 立即注入 Koin 實例
    val myService : MyService = get()
}
```

## 使用 KoinComponents 解鎖 Koin API

一旦您將您的類別標記為 `KoinComponent`，您就可以訪問：

* `by inject()` - 從 Koin 容器延遲計算的實例
* `get()` - 從 Koin 容器主動獲取實例
* `getProperty()`/`setProperty()` - 獲取/設定屬性（property）

## 使用 get & inject 檢索定義

Koin 提供了兩種從 Koin 容器檢索實例的方法：

* `val t : T by inject()` - 延遲計算的委託實例
* `val t : T = get()` - 立即訪問實例

```kotlin
// 是延遲計算的
val myService : MyService by inject()

// 直接檢索實例
val myService : MyService = get()
```

:::note
 延遲注入形式更適合定義需要延遲計算的屬性（property）。
:::

## 從其名稱解析實例

如果需要，您可以使用 `get()` 或 `by inject()` 指定以下參數

* `qualifier` - 定義的名稱（當在您的定義中指定 name 參數時）

使用定義名稱的模組示例：

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
// 從給定的模組檢索
val a = get<ComponentA>(named("A"))
```
```