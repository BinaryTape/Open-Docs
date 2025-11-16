[//]: # (title: 型エイリアス)

型エイリアスは、既存の型に別名を提供します。
型名が長すぎる場合に、異なる短い名前を導入し、代わりに新しい名前を使用できます。

これは、長いジェネリック型を短縮するのに役立ちます。
例えば、コレクション型を短縮したくなることがよくあります。

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

関数型には異なるエイリアスを提供できます。

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

インナークラスやネストされたクラスにも新しい名前を付けることができます。

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

型エイリアスは新しい型を導入しません。
それらは対応する基になる型と等価です。
`typealias Predicate<T>` を追加し、コードで `Predicate<Int>` を使用すると、Kotlinコンパイラは常にそれを `(Int) -> Boolean` に展開します。
したがって、一般的な関数型が必要な場合はいつでも独自の型の変数を渡すことができ、その逆も可能です。

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

## ネストされた型エイリアス

<primary-label ref="beta"/>

Kotlinでは、外側のクラスから型パラメータを捕捉しない限り、他の宣言の内部で型エイリアスを定義できます。

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

捕捉とは、型エイリアスが外側のクラスで定義された型パラメータを参照することを意味します。

```kotlin
class Graph<Node> {
    // Incorrect because captures Node
    typealias Path = List<Node>
}
```

この問題を修正するには、型パラメータを型エイリアスで直接宣言します。

```kotlin
class Graph<Node> {
    // Correct because Node is a type alias parameter
    typealias Path<Node> = List<Node>
}
```

ネストされた型エイリアスは、カプセル化を改善し、パッケージレベルの煩雑さを軽減し、内部実装を簡素化することで、よりクリーンで保守しやすいコードを可能にします。

### ネストされた型エイリアスのルール

ネストされた型エイリアスは、明確で一貫した動作を保証するために特定のルールに従います。

*   ネストされた型エイリアスは、既存のすべての型エイリアスのルールに従う必要があります。
*   可視性の点では、エイリアスはその参照される型が許可する以上に公開することはできません。
*   それらのスコープは、[ネストされたクラス](nested-classes.md)と同じです。クラスの内部で定義でき、オーバーライドしないため、同じ名前の親の型エイリアスを隠蔽します。
*   ネストされた型エイリアスは、可視性を制限するために `internal` または `private` としてマークできます。
*   ネストされた型エイリアスは、Kotlin Multiplatformの[`expect/actual` 宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)ではサポートされていません。

### ネストされた型エイリアスを有効にする方法

プロジェクトでネストされた型エイリアスを有効にするには、コマンドラインで以下のコンパイラオプションを使用します。

```bash
-Xnested-type-aliases
```

または、Gradleビルドファイルの `compilerOptions {}` ブロックに追加します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}