---
title: 类型别名
---
类型别名（Type aliases）为现有类型提供备用名称。如果类型名称太长，您可以引入一个不同的较短名称，并使用这个新名称来代替。

它可用于缩短长的泛型类型。例如，通常会倾向于缩减集合类型：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

您可以为函数类型提供不同的别名：

```kotlin
typealias MyHandler = (Int, String, Any) `->` Unit

typealias Predicate<T> = (T) `->` Boolean
```

您可以为内部类和嵌套类设置新名称：

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

类型别名不会引入新类型。它们等同于对应的底层类型。当您添加 `typealias Predicate<T>` 并在代码中使用 `Predicate<Int>` 时，Kotlin 编译器始终将其扩展为 `(Int) `->` Boolean`。因此，只要需要通用函数类型，您就可以传递您的类型的变量，反之亦然：

```kotlin
typealias Predicate<T> = (T) `->` Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) `->` Boolean = { it > 0 }
    println(foo(f)) // prints "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // prints "[1]"
}
```