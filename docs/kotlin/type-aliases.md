[//]: # (title: 类型别名)

类型别名 (Type aliases) 为现有类型提供替代名称。如果类型名称过长，你可以引入一个不同的短名称来替代它。
 
它对于缩短冗长的泛型类型很有用。例如，缩短集合类型通常很方便：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

你可以为函数类型提供不同的别名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

你可以为内部类和嵌套类提供新的名称：

```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.BInner
```

类型别名不会引入新类型。它们等同于对应的底层类型。当你添加 `typealias Predicate<T>` 并在代码中使用 `Predicate<Int>` 时，Kotlin 编译器总是将其展开为 `(Int) -> Boolean`。因此，只要需要一个通用的函数类型，你就可以传递你的类型变量，反之亦然：

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // prints "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // prints "[1]"
}
```
{kotlin-runnable="true"}