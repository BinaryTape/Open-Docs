---
title: 内联函数
---
使用[高阶函数](lambdas)会产生一定的运行时开销：每个函数都是一个对象，并且它捕获了一个闭包（closure）。闭包是可以从函数体内部访问的变量作用域。内存分配（函数对象和类）以及虚函数调用都会引入运行时开销。

但是，在许多情况下，这种开销可以通过内联（inlining）lambda表达式来消除。以下显示的函数是这种情况的很好的例子。`lock()`函数可以很容易地在调用点（call-sites）进行内联。考虑以下情况：

```kotlin
lock(l) { foo() }
```

编译器无需为参数创建函数对象并生成调用，而是可以发出以下代码：

```kotlin
l.lock()
try {
    foo()
    } finally {
    l.unlock()
    }
```

要使编译器执行此操作，请使用 `inline` 修饰符标记 `lock()` 函数：

```kotlin
inline fun <T> lock(lock: Lock, body: () `->` T): T { ... }
```

`inline` 修饰符会影响函数本身以及传递给它的 lambda 表达式：所有这些都将内联到调用点。

内联可能会导致生成的代码增长。但是，如果你以合理的方式执行此操作（避免内联大型函数），它将在性能方面得到回报，尤其是在循环内的“megamorphic”调用点。

## noinline

如果你不希望将传递给内联函数的所有 lambda 表达式都进行内联，请使用 `noinline` 修饰符标记某些函数参数：

```kotlin
inline fun foo(inlined: () `->` Unit, noinline notInlined: () `->` Unit) { ... }
```

可内联的 lambda 表达式只能在内联函数内部调用或作为可内联参数传递。但是，`noinline` lambda 表达式可以以你喜欢的任何方式进行操作，包括存储在字段中或传递。

:::note
如果内联函数没有可内联的函数参数并且没有[具体化的类型参数](#reified-type-parameters)，编译器将发出警告，因为内联此类函数不太可能是有益的（如果确定需要内联，可以使用 `@Suppress("NOTHING_TO_INLINE")` 注解来禁止显示该警告）。

:::

## 非局部跳转表达式

### Returns

在 Kotlin 中，你只能使用普通的、非限定的 `return` 来退出命名函数或匿名函数。要退出 lambda 表达式，请使用[标签](returns#return-to-labels)。lambda 表达式内部禁止使用裸 `return`，因为 lambda 表达式不能使封闭函数 `return`：

```kotlin
fun ordinaryFunction(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    ordinaryFunction {
        return // 错误：无法在此处使 `foo` 返回
    }
}

fun main() {
    foo()
}
```

但是，如果 lambda 表达式传递给的函数是内联的，那么 `return` 也可以内联。所以这是允许的：

```kotlin
inline fun inlined(block: () `->` Unit) {
    println("hi!")
}

fun foo() {
    inlined {
        return // 确定：lambda 表达式已内联
    }
}

fun main() {
    foo()
}
```

这种 `return`（位于 lambda 表达式中，但退出封闭函数）称为*非局部*返回。这种构造通常出现在循环中，内联函数经常封闭循环：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // 从 hasZeros 返回
    }
    return false
}
```

请注意，某些内联函数可能不会直接从函数体调用传递给它们的 lambda 表达式作为参数，而是从另一个执行上下文（execution context）调用，例如局部对象或嵌套函数。在这种情况下，lambda 表达式中也不允许非局部控制流。要指示内联函数的 lambda 表达式参数不能使用非局部 `return`，请使用 `crossinline` 修饰符标记 lambda 表达式参数：

```kotlin
inline fun f(crossinline body: () `->` Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break and continue

:::caution
此功能当前处于 [预览版](kotlin-evolution-principles#pre-stable-features)。我们计划在未来的版本中使其稳定。要选择启用，请使用 `-Xnon-local-break-continue` 编译器选项。我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 上提供有关它的反馈。

:::

与非局部 `return` 类似，你可以在传递给封闭循环的内联函数的 lambda 表达式中应用 `break` 和 `continue` [跳转表达式](returns)：

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true
    }
    return false
}
```

## 具体化的类型参数

有时你需要访问作为参数传递的类型：

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

在这里，你向上遍历一棵树，并使用反射来检查节点是否具有某种类型。一切都很好，但是调用点（call site）不是很漂亮：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

更好的解决方案是简单地将类型传递给此函数。你可以按如下方式调用它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

为了实现这一点，内联函数支持*具体化的类型参数*，因此你可以编写如下代码：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的代码使用 `reified` 修饰符限定类型参数，使其可以在函数内部访问，几乎就像它是一个普通类一样。由于该函数是内联的，因此不需要反射，并且像 `!is` 和 `as` 这样的普通运算符现在可供你使用。此外，你可以按如上所示调用该函数：`myTree.findParentOfType<MyTreeNodeType>()`。

虽然在许多情况下可能不需要反射，但你仍然可以将它与具体化的类型参数一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函数（未标记为内联）不能具有具体化的参数。没有运行时表示的类型（例如，非具体化的类型参数或像 `Nothing` 这样的虚构类型）不能用作具体化的类型参数的参数。

## 内联属性

`inline` 修饰符可用于没有[幕后字段](properties#backing-fields)的属性的访问器。你可以注解单个属性访问器：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

你还可以注解整个属性，这会将它的两个访问器都标记为 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在调用点，内联访问器会像常规内联函数一样内联。

## 公共 API 内联函数的限制

当内联函数是 `public` 或 `protected` 但不是 `private` 或 `internal` 声明的一部分时，它被认为是[模块](visibility-modifiers#modules)的公共 API。它可以在其他模块中调用，并且也会在此类调用点进行内联。

这会带来某些二进制不兼容的风险，这些风险是由声明内联函数的模块中的更改引起的，以防在更改后未重新编译调用模块。

为了消除因模块的*非*公共 API 中的更改而引入这种不兼容性的风险，不允许公共 API 内联函数在其主体中使用非公共 API 声明，即 `private` 和 `internal` 声明及其各个部分。

`internal` 声明可以使用 `@PublishedApi` 进行注解，这允许它在公共 API 内联函数中使用。当 `internal` 内联函数被标记为 `@PublishedApi` 时，也会检查它的主体，就好像它是公共函数一样。