---
title: "作用域 (Scopes)"
---
Koin 提供了一個簡單的 API，讓你定義與有限生命週期綁定的實例。

## 什麼是 Scope（作用域）？

Scope（作用域）是物件存在的固定時間長度或方法調用。
另一種看待它的方式是將 Scope 視為物件狀態持續的時間。
當 Scope 上下文結束時，任何綁定在該 Scope 下的物件都不能再被注入（它們會從容器中被移除）。

## Scope（作用域）定義

預設情況下，在 Koin 中，我們有 3 種 Scope：

- `single` 定義，建立一個物件，該物件在整個容器生命週期內持續存在（無法被移除）。
- `factory` 定義，每次建立一個新的物件。生命週期短。在容器中沒有持久性（無法被共享）。
- `scoped` 定義，建立一個與相關 Scope 生命周期綁定的物件。

要宣告一個 scoped 定義，請使用 `scoped` 函數，如下所示。一個 Scope 收集 scoped 定義作為一個邏輯時間單元。

要為給定的類型宣告 Scope，我們需要使用 `scope` 關鍵字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### Scope Id & Scope Name（作用域 ID & 作用域名稱）

一個 Koin Scope 由以下內容定義：

- scope name（作用域名稱）- Scope 的 qualifier（限定詞）
- scope id（作用域 ID）- Scope 實例的唯一識別符

:::note
 `scope<A> { }` 等效於 `scope(named<A>()){ }`，但寫起來更方便。請注意，您也可以使用字串 qualifier（限定詞），例如：`scope(named("SCOPE_NAME")) { }`
:::

從一個 `Koin` 實例，您可以存取：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 使用給定的 id 和 scopeName 建立一個封閉的 Scope 實例
- `getScope(id : ScopeID)` - 檢索先前使用給定 id 建立的 Scope
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 建立或檢索（如果已建立）使用給定 id 和 scopeName 的封閉 Scope 實例

:::note
預設情況下，在物件上調用 `createScope`，不會傳遞 Scope 的 "source（來源）"。你需要將它作為參數傳遞：`T.createScope(<source>)`
:::

### Scope Component（作用域元件）：將 Scope 關聯到元件 [2.2.0]

Koin 具有 `KoinScopeComponent` 的概念，以幫助將 Scope 實例帶入其類別：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 介面帶來了幾個擴展：
- `createScope` 從當前元件的 Scope Id 和名稱建立 Scope
- `get`, `inject` - 從 Scope 解析實例（等效於 `scope.get()` & `scope.inject()`）

讓我們為 A 定義一個 Scope，以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // Tied to A's scope（綁定到 A 的 Scope）
    }
}
```

然後，我們可以透過 `org.koin.core.scope` `get` & `inject` 擴展直接解析 `B` 的實例：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // resolve B as inject（將 B 解析為注入）
    val b : B by inject() // inject from scope（從 Scope 注入）

    // Resolve B（解析 B）
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // don't forget to close current scope（別忘了關閉當前的 Scope）
    }
}
```

### Resolving dependencies within a scope（解析 Scope 內的依賴項）

要使用 Scope 的 `get` & `inject` 函數解析依賴項：`val presenter = scope.get<Presenter>()`

Scope 的作用是為 scoped 定義定義一個通用的邏輯時間單元。它也允許從給定的 Scope 內解析定義。

```kotlin
// given the classes（給定類別）
class ComponentA
class ComponentB(val a : ComponentA)

// module with scope（帶有 Scope 的模組）
module {
    
    scope<A> {
        scoped { ComponentA() }
        // will resolve from current scope instance（將從當前 Scope 實例解析）
        scoped { ComponentB(get()) }
    }
}
```

然後依賴項解析就很簡單了：

```kotlin
// create scope（建立 Scope）
val myScope = koin.createScope<A>()

// from the same scope（從同一個 Scope）
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
預設情況下，如果在當前 Scope 中找不到定義，所有 Scope 都會回退到在主 Scope 中解析
:::

### Close a scope（關閉 Scope）

一旦您的 Scope 實例完成，只需使用 `close()` 函數關閉它：

```kotlin
// from a KoinComponent（從一個 KoinComponent）
val scope = getKoin().createScope<A>()

// use it ...（使用它...）

// close it（關閉它）
scope.close()
```

:::info
請注意，您無法再從已關閉的 Scope 注入實例。
:::

### Getting scope's source value（取得 Scope 的來源值）

Koin Scope API 在 2.1.4 中允許您在定義中傳遞 Scope 的原始 source（來源）。讓我們看下面的例子。
讓我們有一個 singleton（單例）實例 `A`：

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* or even get() */) }

    }
}
```

透過建立 A 的 Scope，我們可以將 Scope 的 source（來源）（A 實例）的引用轉發到 Scope 的底層定義：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`

這樣做是為了避免 cascading（級聯）參數注入，並直接在 scoped 定義中檢索我們的 source（來源）值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` 和 `get()` 之間的區別：getSource 將直接獲取 source（來源）值。Get 將嘗試解析任何定義，並在可能的情況下回退到 source（來源）值。因此，`getSource()` 在性能方面更有效率。
:::

### Scope Linking（作用域鏈接）

Koin Scope API 在 2.1 中允許您將一個 Scope 鏈接到另一個 Scope，然後允許解析加入的定義空間。讓我們舉個例子。
在這裡，我們定義了 2 個 Scope 空間：A 的 Scope 和 B 的 Scope。在 A 的 Scope 中，我們無法訪問 C（在 B 的 Scope 中定義）。

```kotlin
module {
    single { A() }
    scope<A> {
        scoped { B() }
    }
    scope<B> {
        scoped { C() }
    }
}
```

透過 Scope 鏈接 API，我們可以允許直接從 A 的 Scope 解析 B 的 Scope 實例 C。為此，我們在 Scope 實例上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// let's get B from A's scope（讓我們從 A 的 Scope 獲取 B）
val b = a.scope.get<B>()
// let's link A' scope to B's scope（讓我們將 A 的 Scope 鏈接到 B 的 Scope）
a.scope.linkTo(b.scope)
// we got the same C instance from A or B scope（我們從 A 或 B 的 Scope 獲得了相同的 C 實例）
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```