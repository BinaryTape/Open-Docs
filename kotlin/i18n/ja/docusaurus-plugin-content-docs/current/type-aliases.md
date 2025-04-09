---
title: 型エイリアス
---
タイプエイリアスは、既存の型に別の名前を提供します。
型名が長すぎる場合は、別の短い名前を導入し、代わりに新しい名前を使用できます。

長いジェネリック型を短縮するのに役立ちます。
たとえば、コレクション型を縮小したくなることがよくあります。

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

関数型に異なるエイリアスを提供できます。

```kotlin
typealias MyHandler = (Int, String, Any) `->` Unit

typealias Predicate<T> = (T) `->` Boolean
```

内部クラスおよびネストされたクラスに新しい名前を付けることができます。

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

タイプエイリアスは、新しい型を導入しません。
対応する基礎となる型と同等です。
`typealias Predicate<T>` を追加し、コードで `Predicate<Int>` を使用すると、Kotlin コンパイラーは常にそれを `(Int) `->` Boolean` に展開します。
したがって、一般的な関数型が必要な場合はいつでも、型変数（variable of your type）を渡すことができ、その逆も可能です。

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