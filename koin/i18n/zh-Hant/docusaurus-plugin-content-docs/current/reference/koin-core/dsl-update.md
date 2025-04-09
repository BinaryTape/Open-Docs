---
title: "建構函式 DSL (Constructor DSL)"
---
Koin 現在提供了一種新的 DSL 關鍵字，可以直接鎖定類別的建構函式 (class constructor)，並避免在 Lambda 運算式中輸入定義。

對於給定的類別 `ClassA` 及其以下依賴項：

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

你現在可以直接鎖定 `class constructor` 來宣告這些元件：

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要在建構函式中使用 `get()` 函式來指定依賴項了！🎉

:::info
請務必在類別名稱前使用 `::`，以鎖定你的 class constructor
:::

:::note
你的建構函式會自動填入所有的 `get()`。避免使用任何預設值，因為 Koin 會嘗試在當前圖表中找到它。
:::

:::note
如果需要檢索「具名」的定義，你需要使用帶有 Lambda 和 `get()` 的標準 DSL 來指定 qualifier
:::

## 可用的關鍵字 (Available Keywords)

以下關鍵字可用於從建構函式建立定義：

* `factoryOf` - 相當於 `factory { }` - 工廠定義 (factory definition)
* `singleOf` - 相當於 `single { }` - 單例定義 (single definition)
* `scopedOf` - 相當於 `scoped { }` - 作用域定義 (scoped definition)

:::info
請確保不要在建構函式中使用任何預設值，因為 Koin 會嘗試用它來填充每個參數。
:::

## DSL 選項 (DSL Options)

任何 Constructor DSL Definition 也可以在 Lambda 內部開啟一些選項：

```kotlin
module {
    singleOf(::ClassA) { 
        // 定義選項 (definition options)
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

常用的選項和 DSL 關鍵字在此 Lambda 中可用：

* `named("a_qualifier")` - 給定義一個字串 qualifier
* `named<MyType>()` - 給定義一個型別 qualifier
* `bind<MyInterface>()` - 為給定的 bean 定義添加要綁定的型別
* `binds(listOf(...))` - 為給定的 bean 定義添加型別列表
* `createdAtStart()` - 在 Koin 啟動時建立單例實例

你也可以使用 `bind` 或 `binds` 運算符，而無需 Lambda：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入的參數 (Injected Parameters)

透過這種宣告方式，你仍然可以使用注入的參數。Koin 將在注入的參數和當前依賴項中尋找，以嘗試注入你的建構函式。

如下所示：

```kotlin
class MyFactory(val id : String)
```

用 Constructor DSL 宣告：

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

## 基於反射的 DSL (Reflection Based DSL) (自 3.2 版本起已棄用)

:::caution
Koin Reflection DSL 現在已棄用。請使用上面的 Koin Constructor DSL
:::