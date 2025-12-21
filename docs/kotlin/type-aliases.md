[//]: # (title: 类型别名)

类型别名提供现有类型的替代名称。如果类型名称过长，你可以引入一个不同的短名称并使用新名称来替代。
 
这有助于缩短冗长的泛型类型。例如，缩短集合类型通常很有用：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

你可以为函数类型提供不同的别名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

你可以为内部类和嵌套类设置新名称：

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

类型别名不引入新类型。它们等同于对应的底层类型。当你添加 `typealias Predicate<T>` 并在代码中使用 `Predicate<Int>` 时，Kotlin 编译器总是将其扩展为 `(Int) -> Boolean`。因此，无论何时需要一个通用的函数类型，你都可以传递你的类型变量，反之亦然：

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

在 Kotlin 中，你可以在其他声明内部定义类型别名，只要它们不从其外部类捕获类型形参：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

捕获意味着类型别名引用了在外部类中定义的类型形参：

```kotlin
class Graph<Node> {
    // 不正确，因为它捕获了 Node
    typealias Path = List<Node>
}
```

要解决此问题，请直接在类型别名中声明类型形参：

```kotlin
class Graph<Node> {
    // 正确，因为 Node 是一个类型别名形参
    typealias Path<Node> = List<Node>
}
```

嵌套类型别名通过改进封装、减少包级混乱和简化内部实现，使得代码更清晰、更易于维护。

### 嵌套类型别名的规则

嵌套类型别名遵循特定规则，以确保清晰一致的行为：

*   嵌套类型别名必须遵循所有现有类型别名规则。
*   在可见性方面，别名不能暴露超出其引用类型允许的范围。
*   它们的[作用域](nested-classes.md)与嵌套类相同。你可以在类内部定义它们，并且它们会隐藏任何同名的父类型别名，因为它们不会[覆盖](override)。
*   嵌套类型别名可以标记为 `internal` 或 `private` 以限制其可见性。
*   Kotlin Multiplatform 的 [`expect/actual` 声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)中不支持嵌套类型别名。