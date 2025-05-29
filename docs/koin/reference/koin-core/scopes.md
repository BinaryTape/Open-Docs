---
title: 作用域
---

Koin 提供了一套简洁的 API，让你能够定义绑定到有限生命周期的实例。

## 什么是作用域？

作用域是一个对象存在的固定时间段或方法调用范围。
换句话说，你可以将作用域理解为对象状态持久化的持续时间。
当作用域上下文结束时，绑定在该作用域下的任何对象都无法再次注入（它们会从容器中删除）。

## 作用域定义

默认情况下，在 Koin 中有 3 种类型的作用域：

-   `single` 定义：创建一个与整个容器生命周期保持一致的对象（不会被删除）。
-   `factory` 定义：每次都创建一个新对象。生命周期短。不在容器中持久化（不能共享）。
-   `scoped` 定义：创建一个与关联作用域生命周期绑定的持久化对象。

要声明一个 `scoped` 定义，请使用 `scoped` 函数，如下所示。作用域将 `scoped` 定义作为时间上的逻辑单元进行聚合。

为给定类型声明作用域时，我们需要使用 `scope` 关键字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 作用域 ID 与作用域名称

Koin 作用域由以下内容定义：

-   作用域名称 - 作用域的限定符 (qualifier)
-   作用域 ID - 作用域实例的唯一标识符

:::note
 `scope<A> { }` 等同于 `scope(named<A>()){ } `，但书写起来更方便。请注意，你也可以使用字符串限定符，例如：`scope(named("SCOPE_NAME")) { }`
:::

从 `Koin` 实例中，你可以访问：

-   `createScope(id : ScopeID, scopeName : Qualifier)` - 使用给定的 ID 和作用域名称创建一个封闭的作用域实例
-   `getScope(id : ScopeID)` - 检索先前使用给定 ID 创建的作用域
-   `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 使用给定的 ID 和作用域名称创建作用域实例，如果已创建则检索该实例

:::note
默认情况下，在对象上调用 `createScope` 不会传递作用域的“源”。你需要将其作为参数传递：`T.createScope(<source>)`
:::

### 作用域组件：将作用域关联到组件 [2.2.0]

Koin 引入了 `KoinScopeComponent` 的概念，以帮助将作用域实例引入其类中：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 接口带来了多个扩展：
-   `createScope`：根据当前组件的作用域 ID 和名称创建作用域
-   `get`, `inject`：从作用域解析实例（等同于 `scope.get()` 和 `scope.inject()`）

让我们为 A 定义一个作用域，以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // Tied to A's scope
    }
}
```

然后，我们可以直接通过 `org.koin.core.scope` 的 `get` 和 `inject` 扩展来解析 `B` 的实例：

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

### 在作用域内解析依赖

要使用作用域的 `get` 和 `inject` 函数解析依赖：`val presenter = scope.get<Presenter>()`

作用域的意义在于为 `scoped` 定义提供一个共同的逻辑时间单元。它还允许从给定作用域内解析定义

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

依赖解析因此非常直接：

```kotlin
// create scope
val myScope = koin.createScope<A>()

// from the same scope
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 默认情况下，如果当前作用域中找不到定义，所有作用域都会回退到主作用域进行解析
:::

### 关闭作用域

一旦你的作用域实例完成，只需使用 `close()` 函数关闭它：

```kotlin
// from a KoinComponent
val scope = getKoin().createScope<A>()

// use it ...

// close it
scope.close()
```

:::info
 请注意，你不能再从一个已关闭的作用域中注入实例。
:::

### 获取作用域的源值

Koin 2.1.4 版本的作用域 API 允许你在定义中传递作用域的原始源。让我们看下面的例子。
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

通过创建 A 的作用域，我们可以将作用域源（A 实例）的引用转发到作用域的底层定义中：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`

这样做是为了避免级联参数注入，并直接在 `scoped` 定义中检索我们的源值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` 和 `get()` 的区别：`getSource` 将直接获取源值。`get` 将尝试解析任何定义，如果可能，则回退到源值。因此，`getSource()` 在性能方面更高效。
:::

### 作用域链接

Koin 2.1 版本的作用域 API 允许你将一个作用域链接到另一个作用域，从而允许解析联合的定义空间。让我们看一个例子。
在这里，我们定义了两个作用域空间：一个用于 A 的作用域和一个用于 B 的作用域。在 A 的作用域中，我们无法访问 C（在 B 的作用域中定义）。

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

借助作用域链接 API，我们可以直接从 A 的作用域解析 B 的作用域实例 C。为此，我们在作用域实例上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// let's get B from A's scope
val b = a.scope.get<B>()
// let's link A' scope to B's scope
a.scope.linkTo(b.scope)
// we got the same C instance from A or B scope
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```