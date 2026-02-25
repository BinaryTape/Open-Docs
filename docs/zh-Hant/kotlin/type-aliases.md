[//]: # (title: 型別別名)

型別別名（Type aliases）為現有型別提供替代名稱。
如果型別名稱太長，你可以引入另一個較短的名稱並改用新名稱。

這對於縮短長泛型型別非常有用。
例如，通常會想要縮減集合型別：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

你可以為函式型別提供不同的別名：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

你可以為內部類別和巢狀類別建立新名稱：

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

型別別名不會引入新型別。
它們與對應的底層型別等價。
當你加入 `typealias Predicate<T>` 並在程式碼中使用 `Predicate<Int>` 時，Kotlin 編譯器始終會將其展開為 `(Int) -> Boolean`。
因此，只要需要通用函式型別，你就可以傳遞該型別的變數，反之亦然：

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

## 巢狀型別別名

在 Kotlin 中，只要型別別名不從其外層類別擷取型別參數，你就可以在其他宣告中定義型別別名：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

「擷取」是指型別別名引用了在外層類別中定義的型別參數：

```kotlin
class Graph<Node> {
    // 錯誤，因為擷取了 Node
    typealias Path = List<Node>
}
```

要修正此問題，請直接在型別別名中宣告型別參數：

```kotlin
class Graph<Node> {
    // 正確，因為 Node 是型別別名參數
    typealias Path<Node> = List<Node>
}
```

巢狀型別別名透過改進封裝、減少套件層級的混亂並簡化內部實作，讓程式碼更簡潔、更易於維護。

### 巢狀型別別名的規則

巢狀型別別名遵循特定規則，以確保行為清晰且一致：

* 巢狀型別別名必須遵循所有現有的型別別名規則。
* 就可見性而言，別名不能暴露比其引用的型別所允許更多的內容。
* 它們的作用域與 [巢狀類別](nested-classes.md) 相同。你可以在類別內部定義它們，它們會隱藏任何同名的父級型別別名，因為它們不會覆寫。
* 巢狀型別別名可以標記為 `internal` 或 `private` 以限制其可見性。
* Kotlin 多平台的 [`expect/actual` 宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 不支援巢狀型別別名。