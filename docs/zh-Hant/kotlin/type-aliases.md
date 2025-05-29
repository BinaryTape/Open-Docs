[//]: # (title: 類型別名)

類型別名為現有類型提供替代名稱。如果類型名稱過長，您可以引入一個不同的、更短的名稱來替代使用。
 
這對於縮短冗長的泛型類型很有幫助。例如，通常會想縮短集合類型：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

您可以為函數類型提供不同的別名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

您可以為內部類別和巢狀類別提供新的名稱：

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

類型別名不會引入新的類型。它們等同於對應的底層類型。當您在程式碼中添加 `typealias Predicate<T>` 並使用 `Predicate<Int>` 時，Kotlin 編譯器總是會將其展開為 `(Int) -> Boolean`。因此，您可以在需要一般函數類型時傳遞您定義類型的變數，反之亦然：

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