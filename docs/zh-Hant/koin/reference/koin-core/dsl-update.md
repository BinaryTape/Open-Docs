---
title: 建構函式 DSL
---

Koin 現在提供一種新型的 DSL 關鍵字，允許你直接指定類別建構函式，並避免在 Lambda 表達式中定義。

對於具有以下依賴項的 `ClassA` 類別：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

你現在可以直接宣告這些元件，直接指定 `類別建構函式`：

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要在建構函式中透過 `get()` 函式指定依賴項！🎉

:::info
務必在你的類別名稱前使用 `::`，以指定你的類別建構函式
:::

:::note
你的建構函式會自動以所有 `get()` 填充。避免使用任何預設值，因為 Koin 會嘗試在當前圖中尋找它。
:::

:::note
如果你需要擷取「具名」定義，你需要使用標準 DSL 並搭配 lambda 和 `get()` 來指定限定符
:::

## 可用關鍵字

以下關鍵字可用於從建構函式建立你的定義：

* `factoryOf` - 等同於 `factory { }` - factory 定義
* `singleOf` - 等同於 `single { }` - single 定義
* `scopedOf` - 等同於 `scoped { }` - scoped 定義

:::info
務必不要在你的建構函式中使用任何預設值，因為 Koin 會嘗試用它填充每個參數。
:::

## DSL 選項

任何建構函式 DSL 定義，也可以在 lambda 中啟用一些選項：

```kotlin
module {
    singleOf(::ClassA) { 
        // definition options
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

此 lambda 中提供了常用選項和 DSL 關鍵字：

* `named("a_qualifier")` - 為定義提供一個字串限定符
* `named<MyType>()` - 為定義提供一個類型限定符
* `bind<MyInterface>()` - 為給定的 bean 定義添加要綁定的類型
* `binds(listOf(...))` - 為給定的 bean 定義添加類型列表
* `createdAtStart()` - 在 Koin 啟動時建立單例實例

你也可以使用 `bind` 或 `binds` 運算符，而無需任何 lambda：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入參數

透過這類宣告，你仍然可以使用注入參數。Koin 會在注入參數和當前依賴項中尋找，以嘗試注入你的建構函式。

如下所示：

```kotlin
class MyFactory(val id : String)
```

以建構函式 DSL 宣告：

```kotlin
module {
    factoryOf(::MyFactory)
}
```

可以像這樣注入：

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## 基於反射的 DSL (自 3.2 起已棄用)

:::caution
Koin 反射 DSL 現已棄用。請使用上方的 Koin 建構函式 DSL。
:::