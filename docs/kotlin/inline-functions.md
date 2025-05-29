[//]: # (title: 内联函数)

使用[高阶函数](lambdas.md)会带来一定的运行时开销：每个函数都是一个对象，并且它会捕获一个闭包。闭包是一个可以在函数体中访问的变量作用域。内存分配（包括函数对象和类）和虚方法调用都会引入运行时开销。

但在许多情况下，这种开销可以通过内联 lambda 表达式来消除。下面展示的函数就是这种情况的很好的例子。`lock()` 函数可以很容易地在调用点内联。
考虑以下情况：

```kotlin
lock(l) { foo() }
```

编译器可以发出以下代码，而不是为参数创建函数对象并生成调用：

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

为了让编译器这样做，请使用 `inline` 修饰符标记 `lock()` 函数：

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修饰符会影响函数本身以及传递给它的 lambda：所有这些都将被内联到调用点。

内联可能会导致生成的代码量增加。然而，如果你以合理的方式进行（避免内联大型函数），它将在性能上有所回报，尤其是在循环内部的“高度多态的调用点”。

## noinline

如果你不希望传递给内联函数的所有 lambda 都被内联，请使用 `noinline` 修饰符标记你的部分函数参数：

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可内联的 lambda 只能在内联函数内部调用，或作为可内联参数传递。而 `noinline` lambda 则可以以任何你喜欢的方式操作，包括存储在字段中或传递。

> 如果一个内联函数没有可内联的函数参数且没有[具化类型参数](#reified-type-parameters)，编译器将发出警告，因为内联此类函数极不可能有益（如果你确定需要内联，可以使用 `@Suppress("NOTHING_TO_INLINE")` 注解来抑制警告）。
>
{style="note"}

## 非局部跳转表达式

### 返回

在 Kotlin 中，你只能使用普通的、不带限定的 `return` 来退出命名函数或匿名函数。要退出 lambda，请使用[标签](returns.md#return-to-labels)。在 lambda 内部禁止使用裸 `return`，因为 lambda 无法使外层函数 `return`：

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但是，如果传递 lambda 的函数是内联的，那么 `return` 也可以被内联。所以这是允许的：

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

这种返回（位于 lambda 中，但退出外层函数）称为 *非局部返回*。这种构造通常出现在循环中，而内联函数经常包含这些循环：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

请注意，某些内联函数可能不是直接从函数体中调用传递给它们的 lambda 参数，而是从另一个执行上下文调用，例如局部对象或嵌套函数。在这种情况下，lambda 中也不允许非局部控制流。为了表明内联函数的 lambda 参数不能使用非局部返回，请使用 `crossinline` 修饰符标记该 lambda 参数：

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### break 和 continue

> 此功能目前处于[预览](kotlin-evolution-principles.md#pre-stable-features)阶段。我们计划在未来的版本中使其稳定。要启用此功能，请使用 `-Xnon-local-break-continue` 编译器选项。我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 上提供反馈。
>
{style="warning"}

与非局部 `return` 类似，你可以在作为参数传递给包含循环的内联函数的 lambda 中应用 `break` 和 `continue` [跳转表达式](returns.md)：

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

## 具化类型参数

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

在这里，你遍历一棵树并使用反射来检查节点是否具有特定类型。这都很好，但调用点不是很美观：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

一个更好的解决方案是直接将类型传递给此函数。你可以如下调用它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

为了实现这一点，内联函数支持 *具化类型参数*，因此你可以编写如下代码：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的代码使用 `reified` 修饰符限定了类型参数，使其在函数内部可访问，几乎就像它是一个普通类一样。由于函数是内联的，因此不需要反射，并且 `!is` 和 `as` 等普通运算符现在可供你使用。此外，你可以如上所示调用该函数：`myTree.findParentOfType<MyTreeNodeType>()`。

尽管在许多情况下可能不需要反射，你仍然可以将其与具化类型参数一起使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函数（未标记为 inline）不能有具化参数。没有运行时表示的类型（例如，非具化类型参数或像 `Nothing` 这样的虚构类型）不能用作具化类型参数的实参。

## 内联属性

`inline` 修饰符可用于没有[支持字段](properties.md#backing-fields)的属性的访问器。你可以注解单个属性访问器：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

你也可以注解整个属性，这会将它的两个访问器都标记为 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在调用点，内联访问器会像常规内联函数一样被内联。

## 公共 API 内联函数的限制

当一个内联函数是 `public` 或 `protected` 但不属于 `private` 或 `internal` 声明的一部分时，它被认为是[模块](visibility-modifiers.md#modules)的公共 API。它可以在其他模块中被调用，并且也会在这些调用点内联。

这带来了由于声明内联函数的模块发生更改而导致的二进制不兼容的某些风险，以防调用模块在更改后没有重新编译。

为了消除模块的 *非*公共 API 更改引入此类不兼容性的风险，公共 API 内联函数不允许在其主体中使用非公共 API 声明，即 `private` 和 `internal` 声明及其部分。

`internal` 声明可以使用 `@PublishedApi` 进行注解，这允许它在公共 API 内联函数中使用。当一个 `internal` 内联函数被标记为 `@PublishedApi` 时，它的主体也会被检查，就好像它是公共的一样。