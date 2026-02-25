[//]: # (title: 型エイリアス)

型エイリアス（Type aliases）は、既存の型に対して別名を提供します。
型名が長すぎる場合、別の短い名前を導入し、代わりにその新しい名前を使用できます。

長いジェネリック型を短縮するのに便利です。
例えば、コレクション型を短縮したいことがよくあります：

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

関数型に対して異なるエイリアスを提供することもできます：

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

内部クラスやネストしたクラスに新しい名前を付けることができます：

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

型エイリアスは新しい型を導入するものではありません。
これらは、対応する基底型（underlying type）と等価です。
`typealias Predicate<T>` を追加してコード内で `Predicate<Int>` を使用すると、Kotlinコンパイラは常にそれを `(Int) -> Boolean` に展開します。
そのため、一般的な関数型が必要な場所であればどこでも独自の型の変数を渡すことができ、その逆も可能です：

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // "true" を出力

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // "[1]" を出力
}
```
{kotlin-runnable="true"}

## ネストした型エイリアス

Kotlinでは、外部クラスから型パラメータをキャプチャ（capture）しない限り、他の宣言の中に型エイリアスを定義できます。

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

キャプチャとは、型エイリアスが外部クラスで定義された型パラメータを参照することを意味します：

```kotlin
class Graph<Node> {
    // Nodeをキャプチャしているため、正しくありません
    typealias Path = List<Node>
}
```

この問題を解決するには、型エイリアスに直接型パラメータを宣言します：

```kotlin
class Graph<Node> {
    // Nodeが型エイリアスのパラメータであるため、正しいです
    typealias Path<Node> = List<Node>
}
```

ネストした型エイリアスを使用すると、カプセル化が向上し、パッケージレベルの煩雑さが軽減され、内部実装が簡素化されるため、よりクリーンで保守性の高いコードが可能になります。

### ネストした型エイリアスのルール

ネストした型エイリアスは、明確で一貫した動作を保証するために特定のルールに従います：

* ネストした型エイリアスは、既存のすべての型エイリアスのルールに従う必要があります。
* 可視性に関しては、エイリアスはその参照先の型が許可している以上の情報を公開することはできません。
* そのスコープは[ネストしたクラス](nested-classes.md)と同じです。クラス内に定義でき、オーバーライドは行われないため、同名の親の型エイリアスを隠します。
* ネストした型エイリアスは、可視性を制限するために `internal` または `private` とマークできます。
* ネストした型エイリアスは、Kotlinマルチプラットフォームの [`expect/actual` 宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)ではサポートされていません。