---
title: 作用域
---

Koin 提供了一個簡單的 API，讓您可以定義與有限生命週期綁定的實例。

## 什麼是作用域？

作用域是指物件存在的固定時間長度或方法呼叫期間。
另一種看法是，將作用域視為物件狀態持續存在的時間長度。
當作用域上下文結束時，任何綁定於該作用域下的物件都無法再被注入（它們會從容器中移除）。

## 作用域定義

預設情況下，在 Koin 中我們有三種作用域：

- `single` 定義：建立一個與整個容器生命週期持續存在的物件（無法被移除）。
- `factory` 定義：每次都建立一個新物件。生命週期短暫。在容器中不持久存在（無法共享）。
- `scoped` 定義：建立一個與關聯作用域生命週期綁定並持續存在的物件。

要宣告一個 `scoped` 定義，請像這樣使用 `scoped` 函數。作用域將 `scoped` 定義聚集為一個邏輯時間單位。

要為給定類型宣告一個作用域，我們需要使用 `scope` 關鍵字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 作用域 ID 與作用域名稱

一個 Koin 作用域由其以下兩點定義：

- 作用域名稱 - 作用域的限定符 (qualifier)
- 作用域 ID - 作用域實例的唯一識別符 (unique identifier)

:::note
`scope<A> { }` 等同於 `scope(named<A>()){ } `，但寫起來更方便。請注意，您也可以使用字串限定符，例如：`scope(named("SCOPE_NAME")) { }`
:::

從一個 `Koin` 實例中，您可以存取：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 使用給定的 ID 和作用域名稱建立一個封閉的作用域實例
- `getScope(id : ScopeID)` - 使用給定的 ID 檢索先前建立的作用域
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 使用給定的 ID 和作用域名稱建立作用域實例，如果已建立則檢索之

:::note
預設情況下，對物件呼叫 `createScope` 不會傳遞作用域的「來源 (source)」。您需要將其作為參數傳遞：`T.createScope(<source>)`
:::

### 作用域組件：將作用域關聯到組件 [2.2.0]

Koin 具有 `KoinScopeComponent` 的概念，以幫助將作用域實例帶入其類別：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 介面提供了幾個擴充功能：
- `createScope`：從目前組件的作用域 ID 和名稱建立作用域
- `get`、`inject`：從作用域中解析實例（等同於 `scope.get()` 和 `scope.inject()`）

讓我們為 A 定義一個作用域，以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // 綁定到 A 的作用域
    }
}
```

然後，我們可以透過 `org.koin.core.scope` 的 `get` 和 `inject` 擴充功能直接解析 `B` 的實例：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // 以注入方式解析 B
    val b : B by inject() // 從作用域注入

    // 解析 B
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 別忘了關閉目前作用域
    }
}
```

### 在作用域內解析依賴

要使用作用域的 `get` 和 `inject` 函數解析依賴：`val presenter = scope.get<Presenter>()`

作用域的目的是為 `scoped` 定義定義一個共同的邏輯時間單位。它也允許從給定的作用域內解析定義。

```kotlin
// 假設有這些類別
class ComponentA
class ComponentB(val a : ComponentA)

// 帶有作用域的模組
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 將從目前作用域實例中解析
        scoped { ComponentB(get()) }
    }
}
```

依賴解析隨後將直截了當：

```kotlin
// 建立作用域
val myScope = koin.createScope<A>()

// 從同一個作用域
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
預設情況下，如果目前作用域中沒有找到定義，所有作用域都會回退 (fallback) 到主作用域中解析。
:::

### 關閉作用域

一旦您的作用域實例完成，只需使用 `close()` 函數關閉它：

```kotlin
// 從 KoinComponent
val scope = getKoin().createScope<A>()

// 使用它 ...

// 關閉它
scope.close()
```

:::info
請注意，您無法再從已關閉的作用域中注入實例。
:::

### 取得作用域的來源值

Koin Scope API 在 2.1.4 版本中允許您在定義中傳遞作用域的原始來源 (original source)。讓我們看一個下面的例子。
假設我們有一個單例實例 `A`：

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* 或甚至 get() */) }

    }
}
```

透過建立 A 的作用域，我們可以將作用域來源（A 實例）的引用轉發給作用域的底層定義：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`。

這是為了避免層疊的參數注入，並直接在 `scoped` 定義中檢索我們的來源值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
`getSource()` 與 `get()` 的區別：`getSource()` 將直接取得來源值。`get()` 將嘗試解析任何定義，如果可能則回退 (fallback) 到來源值。因此，`getSource()` 在效能方面更有效率。
:::

### 作用域連結

Koin Scope API 在 2.1 版本中允許您將一個作用域連結到另一個作用域，然後允許解析聯合的定義空間。讓我們舉一個例子。
在這裡，我們定義了兩個作用域空間：一個用於 A 的作用域和一個用於 B 的作用域。在 A 的作用域中，我們無法存取 C（C 定義在 B 的作用域中）。

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

透過作用域連結 API，我們可以直接從 A 的作用域中解析 B 的作用域實例 C。為此，我們在作用域實例上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// 讓我們先從 A 的作用域取得 B
val b = a.scope.get<B>()
// 讓 A 的作用域連結到 B 的作用域
a.scope.linkTo(b.scope)
// 我們從 A 或 B 作用域取得了相同的 C 實例
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### 作用域原型

作用域「原型」是為通用類別而設計的作用域空間。例如，您可以為 Android (Activity, Fragment, ViewModel) 甚至 Ktor (RequestScope) 定義作用域原型。
作用域原型是 Koin 的 `TypeQualifier`，傳遞給不同的 API，以請求給定類型的作用域空間。

一個原型包含：
- 模組 DSL 擴充功能，用於為給定類型宣告作用域：
```kotlin
// 為 ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class) 宣告一個作用域原型
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 一個請求作用域的 API，帶有給定的特定作用域原型 `TypeQualifier`：
```kotlin
// 使用 ActivityScopeArchetype 原型建立作用域
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)
```