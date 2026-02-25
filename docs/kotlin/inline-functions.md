[//]: # (title: 内联函数)

使用[高阶函数](lambdas.md)会带来一定的运行时罚金：每个函数都是一个对象，并且会捕获一个闭包。闭包是可以在函数体中访问的变量范围。
内存分配（针对函数对象和类）和虚调用会引入运行时开销。

但在许多情况下，这种开销可以通过内联 lambda表达式 来消除。
下面显示的函数就是这种情况的好例子。`lock()` 函数可以很容易地在调用站点进行内联。
考虑以下情况：

```kotlin
lock(l) { foo() }
```

编译器可以生成以下代码，而不是为参数创建函数对象并生成调用：

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

要让编译器执行此操作，请使用 `inline` 修饰符标记 `lock()` 函数：

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修饰符会同时影响函数本身和传递给它的 lambda：所有这些都将被内联到调用站点。

内联可能会导致生成的代码量增加。但是，如果你以合理的方式进行（避免内联大型函数），它将在性能上得到回报，尤其是在循环内部的“多态 (megamorphic)”调用站点。

## noinline

如果你不希望传递给内联函数的所有 lambda 都被内联，请使用 `noinline` 修饰符标记部分函数参数：

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可内联的 lambda 只能在内联函数内部调用或作为可内联参数传递。然而，`noinline` lambda 可以以你喜欢的任何方式进行操作，包括存储在字段中或进行传递。

> 如果内联函数没有可内联的函数参数，也没有[具化类型形参](#reified-type-parameters)，编译器将发出警告，因为内联此类函数极不可能带来好处（如果你确定需要内联，可以使用 `@Suppress("NOTHING_TO_INLINE")` 注解来抑制该警告）。
>
{style="note"}

## 非局部跳转表达式

### 返回

在 Kotlin 中，你只能使用正常的、非限定的 `return` 来退出命名函数或匿名函数。
要退出 lambda，请使用[标签](returns.md#return-to-labels)。lambda 内部禁止使用赤裸的 `return`，因为 lambda 不能让外围函数 `return`：

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // 错误：不能让 `foo` 在此处返回
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但如果传递 lambda 的函数是被内联的，那么 return 也可以被内联。所以这是允许的：

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK：lambda 已被内联
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

这种 return（位于 lambda 中，但退出外围函数）被称为“非局部”返回。这种结构通常出现在循环中，而内联函数经常包裹着循环：

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // 从 hasZeros 返回
    }
    return false
}
```

请注意，某些内联函数可能不会直接从函数体中调用作为参数传递给它们的 lambda，而是从另一个执行上下文（例如局部对象或嵌套函数）中调用。在这种情况下，lambda 中也不允许非局部控制流。为了表明内联函数的 lambda 参数不能使用非局部返回，请使用 `crossinline` 修饰符标记该 lambda 参数：

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

### Break 与 continue

与非局部 `return` 类似，你可以在作为参数传递给包裹循环的内联函数的 lambda 中应用 `break` 和 `continue` [跳转表达式](returns.md)：

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

## 具化类型形参

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

在这里，你向上遍历树并使用反射来检查节点是否具有某种类型。这都没问题，但调用站点不太美观：

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

更好的解决方案是简单地将类型传递给此函数。你可以按如下方式调用它：

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

为了实现这一点，内联函数支持“具化类型形参”，因此你可以编写如下代码：

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上述代码使用 `reified` 修饰符限定类型形参，使其在函数内部可访问，几乎就像它是一个普通类一样。由于函数是内联的，因此不需要反射，现在可以使用像 `!is` 和 `as` 这样的普通运算符。此外，你还可以像上面所示的那样调用该函数：`myTree.findParentOfType<MyTreeNodeType>()`。

尽管在许多情况下可能不需要反射，但你仍然可以将其与具化类型形参结合使用：

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("
"))
}
```

普通函数（未标记为内联）不能拥有具化形参。
没有运行时表示的类型（例如，非具化类型形参或像 `Nothing` 这样的虚构类型）不能用作具化类型形参的实参。

## 内联属性

`inline` 修饰符可用于没有[支持字段](properties.md#backing-fields)的属性访问器。你可以为单个属性访问器添加注解：

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

你也可以为整个属性添加注解，这会将其两个访问器都标记为 `inline`：

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

在调用站点，内联访问器会像普通的内联函数一样被内联。

## 公共 API 内联函数的限制

当内联函数是 `public` 或 `protected` 但不是 `private` 或 `internal` 声明的一部分时，它被视为[模块](visibility-modifiers.md#modules)的公共 API。它可以在其他模块中被调用，并且在这些调用站点也会被内联。

这会带来一定的二进制不兼容风险，即如果调用模块在更改后没有重新编译，则声明内联函数的模块发生更改可能会导致不兼容。

为了消除由模块的“非”公共 API 更改引入此类不兼容性的风险，公共 API 内联函数不允许在其函数体中使用非公共 API 声明，即 `private` 和 `internal` 声明及其部分。

`internal` 声明可以使用 `@PublishedApi` 进行注解，这允许它在公共 API 内联函数中使用。当 `internal` 内联函数被标记为 `@PublishedApi` 时，它的函数体也会被检查，就像它是公共的一样。