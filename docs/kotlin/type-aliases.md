[//]: # (title: 类型别名)

类型别名为现有类型提供备用名称。
如果类型名称太长，你可以引入一个不同的短名称，并改用这个新名称。

这对于缩短较长的泛型类型非常有用。
例如，通常很想缩减集合类型：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

你可以为函数类型提供不同的别名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

你可以为内部类和嵌套类指定新名称：

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```

类型别名不会引入新类型。
它们等同于相应的底层类型。
当你在代码中添加 `typealias Predicate<T>` 并使用 `Predicate<Int>` 时，Kotlin 编译器总是将其扩展为 `(Int) -> Boolean`。
因此，每当需要通用函数类型时，你都可以传递自定义类型的变量，反之亦然：

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // 打印 "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // 打印 "[1]"
}
```
{kotlin-runnable="true"}

## 嵌套类型别名

在 Kotlin 中，你可以在其他声明内部定义类型别名，只要它们不从其外部类中捕获类型形参即可：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

捕获意味着类型别名引用了外部类中定义的类型形参：

```kotlin
class Graph<Node> {
    // 错误，因为捕获了 Node
    typealias Path = List<Node>
}
```

要修复此问题，请直接在类型别名中声明类型形参：

```kotlin
class Graph<Node> {
    // 正确，因为 Node 是类型别名形参
    typealias Path<Node> = List<Node>
}
```

嵌套类型别名通过改进封装、减少软件包级别的混乱以及简化内部实现，使代码更加简洁且更易于维护。

### 嵌套类型别名规则

嵌套类型别名遵循特定规则，以确保行为清晰一致：

* 嵌套类型别名必须遵循所有现有的类型别名规则。
* 在可见性方面，别名公开的内容不能超过其引用类型所允许的范围。
* 它们的作用域与[嵌套类](nested-classes.md)相同。你可以在类内部定义它们，它们会隐藏任何同名的父级类型别名，因为它们不会被重写。
* 嵌套类型别名可以标记为 `internal` 或 `private` 以限制其可见性。
* 嵌套类型别名在 Kotlin 多平台的 [`expect/actual` 声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)中不受支持。