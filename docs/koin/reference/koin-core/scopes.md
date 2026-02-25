---
title: 作用域
---

Koin 提供了一个简单的 API，让您可以定义绑定到有限生命周期的实例。

## 什么是作用域？

作用域（Scope）是对象存在的固定时间段或方法调用周期。
另一种理解方式是将作用域视为对象状态持续的时间量。
当作用域上下文结束时，在该作用域下绑定的任何对象都无法再次注入（它们会从容器中丢弃）。

## 作用域定义

默认情况下，在 Koin 中有 3 种作用域：

- `single` 定义：创建一个在整个容器生命周期内持续存在的对象（无法被丢弃）。
- `factory` 定义：每次都创建一个新对象。生命周期短。在容器中不具有持久性（无法共享）。
- `scoped` 定义：创建一个持续时间与关联的作用域生命周期绑定的对象。

要声明一个 `scoped` 定义，请按如下方式使用 `scoped` 函数。作用域将 `scoped` 定义收集为一个逻辑时间单元。

为给定类型声明作用域，我们需要使用 `scope` 关键字：

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 作用域 ID 与作用域名称

Koin 作用域由以下部分定义：

- 作用域名称 - 作用域的限定符
- 作用域 ID - 作用域实例的唯一标识符

:::note
 `scope<A> { }` 等同于 `scope(named<A>()){ } `，但编写起来更方便。注意，您还可以使用字符串限定符，例如：`scope(named("SCOPE_NAME")) { }`
:::

从 `Koin` 实例中，您可以访问：

- `createScope(id : ScopeID, scopeName : Qualifier)` - 使用给定的 ID 和作用域名称创建一个封闭的作用域实例
- `getScope(id : ScopeID)` - 检索之前创建的具有给定 ID 的作用域
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 创建或检索（如果已创建）具有给定 ID 和作用域名称的封闭作用域实例

:::note
默认情况下，在对象上调用 `createScope` 不会传递作用域的“源（source）”。您需要将其作为参数传递：`T.createScope(<source>)`
:::

### 作用域组件：将作用域关联到组件 [2.2.0]

Koin 具有 `KoinScopeComponent` 的概念，以帮助将作用域实例引入其类中：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 接口带来了几个扩展：
- `createScope` 用于从当前组件的作用域 ID 和名称创建作用域
- `get`、`inject` - 用于从作用域解析实例（等同于 `scope.get()` 和 `scope.inject()`）

让我们为 A 定义一个作用域，以解析 B：

```kotlin
module {
    scope<A> {
        scoped { B() } // 绑定到 A 的作用域
    }
}
```

得益于 `org.koin.core.scope` 的 `get` 和 `inject` 扩展，我们可以直接解析 `B` 的实例：

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // 通过 inject 解析 B
    val b : B by inject() // 从作用域注入

    // 解析 B
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 不要忘记关闭当前作用域
    }
}
```

### 在作用域内解析依赖项

要使用作用域的 `get` 和 `inject` 函数解析依赖项：`val presenter = scope.get<Presenter>()` 

作用域的意义在于为 `scoped` 定义指定一个共同的逻辑时间单元。它还允许从给定的作用域内解析定义

```kotlin
// 给定以下类
class ComponentA
class ComponentB(val a : ComponentA)

// 包含作用域的模块
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 将从当前作用域实例中解析
        scoped { ComponentB(get()) }
    }
}
```

随后，依赖解析就变得非常直接：

```kotlin
// 创建作用域
val myScope = koin.createScope<A>()

// 从同一个作用域获取
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 默认情况下，如果在当前作用域中找不到定义，所有作用域都会回退到主作用域中进行解析
:::

### 关闭作用域

一旦您完成了作用域实例的使用，只需使用 `close()` 函数将其关闭：

```kotlin
// 从 KoinComponent 中
val scope = getKoin().createScope<A>()

// 使用它...

// 关闭它
scope.close()
```

:::info
 请注意，您无法再从已关闭的作用域中注入实例。
:::

### 获取作用域的源值

Koin 2.1.4 中的作用域 API 允许您在定义中传递作用域的原始源。让我们看下面的例子。
假设有一个单例实例 `A`：

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* 甚至可以 get() */) }

    }
}
```

通过创建 A 的作用域，我们可以将作用域源（A 实例）的引用转发给作用域的底层定义：`scoped { BofA(getSource()) }` 甚至 `scoped { BofA(get()) }`。

这样做是为了避免级联参数注入，只需在 `scoped` 定义中直接检索我们的源值。

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()` 和 `get()` 之间的区别：`getSource` 将直接获取源值。`get` 将尝试解析任何定义，并在可能的情况下回退到源值。因此，`getSource()` 在性能方面更高效。
:::

### 作用域链接

Koin 2.1 中的作用域 API 允许您将一个作用域链接到另一个作用域，从而允许解析合并的定义空间。让我们看一个例子。
这里我们定义了 2 个作用域空间：A 的作用域和 B 的作用域。在 A 的作用域中，我们无法访问 C（定义在 B 的作用域中）。

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

通过作用域链接 API，我们可以允许直接从 A 的作用域解析 B 的作用域实例 C。为此，我们在作用域实例上使用 `linkTo()`：

```kotlin
val a = koin.get<A>()
// 让我们从 A 的作用域中获取 B
val b = a.scope.get<B>()
// 让我们将 A 的作用域链接到 B 的作用域
a.scope.linkTo(b.scope)
// 我们从 A 或 B 的作用域中得到了相同的 C 实例
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### 作用域原型

作用域“原型（Archetypes）”是针对泛型类的作用域空间。例如，您可以拥有 Android（Activity、Fragment、ViewModel）甚至 Ktor（RequestScope）的作用域原型。
作用域原型是传递给不同 API 的 Koin `TypeQualifier`，用于请求给定类型的作用域空间。

一个原型由以下部分组成：
- 模块 DSL 扩展，用于为给定类型声明作用域：
```kotlin
// 为 ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class) 声明作用域原型
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 一个请求具有给定特定作用域原型 `TypeQualifier` 的作用域的 API：
```kotlin
// 使用 ActivityScopeArchetype 原型创建作用域
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)