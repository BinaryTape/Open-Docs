---
title: 自動佈線 (Autowire) DSL
---

Koin 提供了一種自動佈線 (Autowire) DSL，讓您可以直接針對類別建構函式並自動佈線相依性。

:::tip
如果您正在使用 **Koin 編譯器外掛程式**，請考慮使用 [編譯器外掛程式 DSL](/docs/setup/compiler-plugin)，它提供了類似的自動佈線功能，並增加了編譯期安全性。
:::

## 經典自動佈線 DSL

對於給定的類別 `ClassA` 及其相依性如下：

```kotlin
class ClassA(val b: ClassB, val c: ClassC)
class ClassB()
class ClassC()
```

宣告針對類別建構函式的元件：

```kotlin
import org.koin.dsl.*

module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

不再需要使用 `get()` 函式指定相依性了！

:::info
請務必在類別名稱前使用 `::` 以針對建構函式。
:::

:::note
您的建構函式會自動填入所有必要的相依性。請避免使用預設值，因為 Koin 會嘗試解析所有參數。
:::

## 與編譯器外掛程式 DSL 的比較

| 經典自動佈線 | 編譯器外掛程式 |
|------------------|-----------------|
| `singleOf(::ClassA)` | `single<ClassA>()` |
| `factoryOf(::ClassA)` | `factory<ClassA>()` |
| `scopedOf(::ClassA)` | `scoped<ClassA>()` |
| 套件： `org.koin.dsl` | 套件： `org.koin.plugin.module.dsl` |

編譯器外掛程式 DSL 提供相同的自動佈線功能，並增加了編譯期驗證。

## 可用關鍵字

以下是可用於從建構函式建立定義的自動佈線關鍵字：

* `factoryOf` - 等同於 `factory { }` - 工廠定義
* `singleOf` - 等同於 `single { }` - 單例定義
* `scopedOf` - 等同於 `scoped { }` - 作用域定義

:::info
請務必不要在您的建構函式中使用任何預設值，因為 Koin 會嘗試用它來填入每個參數。
:::

## DSL 選項

任何自動佈線 DSL 定義也可以在 Lambda 運算式中開啟一些選項：

```kotlin
module {
    singleOf(::ClassA) {
        // 定義選項
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

此 Lambda 運算式中提供了常用的選項和 DSL 關鍵字：

* `named("a_qualifier")` - 替定義提供一個字串限定詞
* `named<MyType>()` - 替定義提供一個型別限定詞
* `bind<MyInterface>()` - 為指定的定義新增要繫結的型別
* `binds(listOf(...))` - 為指定的定義新增型別列表
* `createdAtStart()` - 在 Koin 啟動時建立單一執行個體

您也可以使用 `bind` 或 `binds` 運算子，而不需要任何 Lambda 運算式：

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 注入參數

使用自動佈線 DSL 宣告，您仍然可以使用注入參數。Koin 會在注入參數和目前的相依性中尋找，嘗試注入您的建構函式。

如下所示：

```kotlin
class MyFactory(val id : String)
```

使用自動佈線 DSL 宣告：

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

## 基於反射的 DSL (自 3.2 起棄用)

:::caution
Koin 反射 DSL 現已棄用。請使用上方的 Koin 自動佈線 DSL。
:::