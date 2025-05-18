---
title: 作用域
---
Koin 提供了一个简单的 API，允许您定义与有限生命周期绑定的实例。

## 什么是 Scope（作用域）？

Scope（作用域）是对象存在的固定时间或方法调用持续时间。
另一种理解方式是将 Scope（作用域）视为对象状态持续存在的时间量。
当 Scope（作用域）上下文结束时，绑定在该 Scope（作用域）下的任何对象都无法再次注入（它们会从容器中删除）。

## Scope（作用域）定义

默认情况下，在 Koin 中，我们有 3 种 Scope（作用域）：

- `single` 定义，创建一个在整个容器生命周期内持久存在的对象（无法删除）。
- `factory` 定义，每次创建一个新对象。生命周期短。容器中没有持久性（无法共享）。
- `scoped` 定义，创建一个与关联的 Scope（作用域）生命周期绑定的持久对象。

要声明一个 scoped 定义，请使用 `scoped` 函数，如下所示。Scope（作用域）将 scoped 定义收集为一个逻辑时间单元。

要为给定类型声明 Scope（作用域），我们需要使用 `scope` 关键字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### Scope Id（作用域 Id） & Scope Name（作用域名称）

一个 Koin Scope（作用域）由以下内容定义：

- scope name（作用域名称）- Scope（作用域）的限定符
- scope id（作用域 Id）- Scope（作用域）实例的唯一标识符

:::note
`scope<A> { }` 等同于 `scope(named<A>()){ }`，但写起来更方便。请注意，您也可以使用字符串限定符，例如：`scope(named("SCOPE_NAME")) { }`
:::

从一个 `Koin` 实例，您可以访问：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 使用给定的 id 和 scopeName（作用域名称）创建一个封闭的 Scope（作用域）实例
- `getScope(id : ScopeID)` - 检索先前创建的具有给定 id 的 Scope（作用域）
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 创建或检索（如果已创建）具有给定 id 和 scopeName（作用域名称）的封闭 Scope（作用域）实例

:::note
默认情况下，对对象调用 `createScope` 不会传递 Scope（作用域）的“来源”。您需要将其作为参数传递：`T.createScope(<source>)`
:::

### Scope Component（作用域组件）：将 Scope（作用域）与组件关联 [2.2.0]

Koin 具有 `KoinScopeComponent` 的概念，以帮助将 Scope（作用域）实例引入其类：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 接口带来了几个扩展：
- `createScope` - 从当前组件的 Scope（作用域）Id（作用域 ID） & name（名称）创建 Scope（作用域）
- `get`, `inject` - 从 Scope（作用域）解析实例（等同于 `scope.get()` & `scope.inject()`）

让我们为 A 定义一个 Scope（作用域），以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // 与 A 的 Scope（作用域）绑定
    }
}
```

然后，我们可以直接通过 `org.koin.core.scope` `get` & `inject` 扩展来解析 `B` 的实例：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // resolve B as inject
    val b : B by inject() // inject from scope

    // Resolve B
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // don't forget to close current scope
    }
}
```

### Resolving dependencies within a scope（在 Scope（作用域）内解析依赖项）

要使用 Scope（作用域）的 `get` & `inject` 函数解析依赖项：`val presenter = scope.get<Presenter>()`

Scope（作用域）的意义在于为 scoped 定义定义一个公共的逻辑时间单元。它还允许从给定的 Scope（作用域）内解析定义。

```kotlin
// given the classes
class ComponentA
class ComponentB(val a : ComponentA)

// module with scope
module {
    
    scope<A> {
        scoped { ComponentA() }
        // will resolve from current scope instance
        scoped { ComponentB(get()) }
    }
}
```

依赖项解析然后变得简单直接：

```kotlin
// create scope
val myScope = koin.createScope<A>()

// from the same scope
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
默认情况下，如果在当前 Scope（作用域）中未找到定义，则所有 Scope（作用域）都会回退到在主 Scope（作用域）中解析
:::

### Close a scope（关闭 Scope（作用域））

一旦您的 Scope（作用域）实例完成，只需使用 `close()` 函数将其关闭：

```kotlin
// from a KoinComponent
val scope = getKoin().createScope<A>()

// use it ...

// close it
scope.close()
```

:::info
请注意，您无法再从已关闭的 Scope（作用域）中注入实例。
:::

### Getting scope's source value（获取 Scope（作用域）的源值）

Koin Scope（作用域）API 在 2.1.4 中允许您在定义中传递 Scope（作用域）的原始源。让我们看下面的例子。
假设我们有一个单例实例 `A`：

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

通过创建 A 的 Scope（作用域），我们可以将 Scope（作用域）源（A 实例）的引用转发到 Scope（作用域）的底层定义：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`

这是为了避免级联参数注入，并直接在 scoped 定义中检索我们的源值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
`getSource()` 和 `get()` 之间的区别：getSource 将直接获取源值。Get 将尝试解析任何定义，并在可能的情况下回退到源值。因此，`getSource()` 在性能方面更有效。
:::

### Scope Linking（作用域链接）

Koin Scope（作用域）API 在 2.1 中允许您将一个 Scope（作用域）链接到另一个 Scope（作用域），然后允许解析已加入的定义空间。让我们看一个例子。
这里我们定义了 2 个 Scope（作用域）空间：A 的 Scope（作用域）和 B 的 Scope（作用域）。在 A 的 Scope（作用域）中，我们无法访问 C（在 B 的 Scope（作用域）中定义）。

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

使用 Scope（作用域）链接 API，我们可以允许直接从 A 的 Scope（作用域）解析 B 的 Scope（作用域）实例 C。为此，我们在 Scope（作用域）实例上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// let's get B from A's scope
val b = a.scope.get<B>()
// let's link A' scope to B's scope
a.scope.linkTo(b.scope)
// we got the same C instance from A or B scope
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```