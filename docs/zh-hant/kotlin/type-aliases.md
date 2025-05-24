---
title: "型別別名 (Type aliases)"
---
類型別名（Type aliases）為現有類型提供替代名稱。
如果類型名稱太長，您可以引入一個不同的較短名稱，並使用新的名稱來代替。

它有助於縮短長的泛型（generic types）。
例如，縮小集合類型通常很吸引人：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

您可以為函數類型提供不同的別名：

```kotlin
typealias MyHandler = (Int, String, Any) `->` Unit

typealias Predicate<T> = (T) `->` Boolean
```

您可以為內部類別（inner class）和巢狀類別（nested classes）建立新名稱：

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

類型別名不會引入新的類型。
它們等同於相應的底層類型。
當您新增 `typealias Predicate<T>` 並且在程式碼中使用 `Predicate<Int>` 時，Kotlin 編譯器始終會將其展開為 `(Int) `->` Boolean`。
因此，您可以在需要通用函數類型（general function type）時傳遞您的類型變數，反之亦然：

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