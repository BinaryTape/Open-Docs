[//]: # (title: 型エイリアス)

型エイリアスは、既存の型に別名を提供します。型名が長すぎる場合、別の短い名前を導入し、代わりに新しい名前を使用できます。

長いジェネリック型を短縮するのに便利です。例えば、コレクション型を短縮したくなることがよくあります。

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

関数型に対して異なるエイリアスを提供できます。

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

内部クラスとネストされたクラスに新しい名前を付けることができます。

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

型エイリアスは新しい型を導入しません。それらは対応する基底の型と同等です。`typealias Predicate<T>` を追加し、コード内で `Predicate<Int>` を使用すると、Kotlinコンパイラは常にそれを `(Int) -> Boolean` に展開します。したがって、一般的な関数型が必要な場合はいつでもその型の変数を渡すことができ、その逆も可能です。

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