---
title: Scopes
---

Koin 提供了一套簡單的 API，讓您可以定義與受限生命週期繫結的執行個體。

## 什麼是 scope？

Scope（作用域）是物件存在的一段固定持續時間或方法呼叫過程。
另一種看待方式是將 scope 視為物件狀態持續存在的時間量。
當 scope 上下文結束時，任何在該 scope 下繫結的物件都無法再次被注入（它們會從容器中被捨棄）。

## Scope 定義

根據預設，在 Koin 中我們有 3 種 scope：

- `single` 定義：建立一個在整個容器生命週期內持續存在的物件（無法被捨棄）。
- `factory` 定義：每次都建立一個新物件。生命週期短，不會在容器中持續存在（無法共享）。
- `scoped` 定義：建立一個與關聯 scope 生命週期繫結的持續物件。

要宣告 `scoped` 定義，請如下使用 `scoped` 函式。一個 scope 會將 `scoped` 定義收集為一個邏輯上的時間單位。

為指定型別宣告 scope 時，我們需要使用 `scope` 關鍵字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### Scope Id 與 Scope 名稱

Koin Scope 是由以下內容定義的：

- scope 名稱 - scope 的限定符 (qualifier)
- scope ID - scope 執行個體的唯一識別符號 (identifier)

:::note
 `scope<A> { }` 等同於 `scope(named<A>()){ } `，但編寫起來更方便。請注意，您也可以使用字串限定符，例如：`scope(named("SCOPE_NAME")) { }`
:::

從 `Koin` 執行個體中，您可以存取：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 使用指定的 ID 和 scopeName 建立一個封閉的 scope 執行個體。
- `getScope(id : ScopeID)` - 擷取先前使用指定 ID 建立的 scope。
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 建立或擷取（如果已建立）具有指定 ID 和 scopeName 的封閉 scope 執行個體。

:::note
預設情況下，在物件上呼叫 `createScope` 不會傳遞 scope 的「來源 (source)」。您需要將其作為參數傳遞：`T.createScope(<source>)`
:::

### Scope 組建：將 scope 與組建關聯 [2.2.0]

Koin 具有 `KoinScopeComponent` 的概念，用於幫助將 scope 執行個體引入其類別中：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 介面提供了多個擴充：
- `createScope` 從目前組建的 scope ID 與名稱建立 scope。
- `get`, `inject` - 從 scope 解析執行個體（等同於 `scope.get()` 與 `scope.inject()`）。

讓我們為 A 定義一個 scope，以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // 繫結至 A 的 scope
    }
}
```

接著，歸功於 `org.koin.core.scope` 的 `get` 與 `inject` 擴充，我們可以直接解析 `B` 的執行個體：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // 將 B 解析為注入
    val b : B by inject() // 從 scope 注入

    // 解析 B
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 別忘了關閉目前的 scope
    }
}
```

### 在 scope 內解析相依性

要使用 scope 的 `get` 與 `inject` 函式解析相依性：`val presenter = scope.get<Presenter>()` 

Scope 的意義在於為 `scoped` 定義建立一個共同的邏輯時間單位。它也允許從指定的 scope 內解析定義。

```kotlin
// 給定類別
class ComponentA
class ComponentB(val a : ComponentA)

// 包含 scope 的模組
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 將從目前的 scope 執行個體進行解析
        scoped { ComponentB(get()) }
    }
}
```

相依性解析接著會變得非常直觀：

```kotlin
// 建立 scope
val myScope = koin.createScope<A>()

// 從相同的 scope
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 預設情況下，如果在目前 scope 中找不到定義，所有 scope 都會回退 (fallback) 到主 scope 中進行解析。
:::

### 關閉 scope

一旦您完成 scope 執行個體的使用，只需使用 `close()` 函式將其關閉：

```kotlin
// 從 KoinComponent
val scope = getKoin().createScope<A>()

// 使用它 ...

// 關閉它
scope.close()
```

:::info
 請注意，您無法再從已關閉的 scope 中注入執行個體。
:::

### 獲取 scope 的來源值 (source value)

Koin Scope API 在 2.1.4 版本中允許您在定義中傳遞 scope 的原始來源。讓我們看下面的例子。
假設有一個單例 (singleton) 執行個體 `A`：

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* 甚至可以使用 get() */) }

    }
}
```

透過建立 A 的 scope，我們可以將 scope 來源（A 的執行個體）的參照轉發給 scope 的底層定義：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`。

這是為了避免連鎖參數注入，並直接在 `scoped` 定義中擷取我們的來源值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` 與 `get()` 的區別：`getSource` 會直接獲取來源值。`get` 會嘗試解析任何定義，並在可能的情況下回退到來源值。因此，就效能而言，`getSource()` 更有效率。
:::

### Scope 連結 (Scope Linking)

Koin Scope API 在 2.1 版本中允許您將一個 scope 連結到另一個，進而允許解析合併後的定義空間。讓我們看一個例子。
這裡我們定義了 2 個 scope 空間：一個給 A，一個給 B。在 A 的 scope 中，我們無法存取 C（定義在 B 的 scope 中）。

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

透過 scope 連結 API，我們可以允許直接從 A 的 scope 解析 B 的 scope 執行個體 C。為此，我們在 scope 執行個體上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// 讓我們從 A 的 scope 獲取 B
val b = a.scope.get<B>()
// 讓我們將 A 的 scope 連結到 B 的 scope
a.scope.linkTo(b.scope)
// 我們從 A 或 B scope 獲得了相同的 C 執行個體
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### Scope 原型 (Scope Archetypes)

Scope「原型 (Archetypes)」是針對泛用類型類別的 scope 空間。例如，您可以擁有針對 Android (Activity, Fragment, ViewModel) 甚至是 Ktor (RequestScope) 的 Scope 原型。
Scope 原型是傳遞給不同 API 的 Koin `TypeQualifier`，用於請求給定類別的 scope 空間。

一個原型包含：
- 模組 DSL 擴充，用於宣告指定型別的 scope：
```kotlin
// 為 ActivityScopeArchetype 宣告一個 scope 原型 (TypeQualifier(AppCompatActivity::class)
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 一個請求具有特定 Scope 原型 `TypeQualifier` 的 Scope API：
```kotlin
// 使用 ActivityScopeArchetype 原型建立 scope
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)