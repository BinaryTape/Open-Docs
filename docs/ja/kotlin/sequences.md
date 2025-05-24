---
title: シーケンス
---
コレクションに加えて、Kotlin 標準ライブラリにはもう 1 つの型である _シーケンス_（[`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html)）が含まれています。
コレクションとは異なり、シーケンスは要素を含まず、反復処理中に要素を生成します。
シーケンスは[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) と同じ機能を提供しますが、複数ステップのコレクション処理に対して別のアプローチを実装します。

`Iterable` の処理に複数のステップが含まれる場合、それらは即座に実行されます。各処理ステップが完了し、その結果（中間コレクション）を返します。次のステップはこのコレクションに対して実行されます。一方、シーケンスの複数ステップ処理は、可能な場合は遅延実行されます。実際の計算は、処理チェーン全体の結果が要求された場合にのみ行われます。

操作の実行順序も異なります。`Sequence` は、すべての処理ステップを要素ごとに 1 つずつ実行します。一方、`Iterable` はコレクション全体に対して各ステップを完了してから、次のステップに進みます。

したがって、シーケンスを使用すると、中間ステップの結果を構築することを回避できるため、コレクション処理チェーン全体のパフォーマンスが向上します。ただし、シーケンスの遅延特性により、オーバーヘッドが追加されます。これは、小さなコレクションを処理したり、単純な計算を実行したりする場合には無視できない場合があります。したがって、`Sequence` と `Iterable` の両方を検討し、どちらが自分のケースに適しているかを判断する必要があります。

## 構築

### 要素から

シーケンスを作成するには、[`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 関数を呼び出し、その引数として要素をリストします。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### Iterable から

すでに `Iterable` オブジェクト（`List` や `Set` など）がある場合は、[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) を呼び出すことによって、そこからシーケンスを作成できます。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 関数から

シーケンスを作成するもう 1 つの方法は、要素を計算する関数を使用して構築することです。
関数に基づいてシーケンスを構築するには、この関数を引数として[`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html) を呼び出します。オプションで、最初の要素を明示的な値として、または関数呼び出しの結果として指定できます。
指定された関数が `null` を返すと、シーケンスの生成は停止します。したがって、以下の例のシーケンスは無限です。

```kotlin

fun main() {

    val oddNumbers = generateSequence(1) { it + 2 } // `it` は前の要素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // エラー: シーケンスは無限です

}
```

`generateSequence()` を使用して有限のシーケンスを作成するには、必要な最後の要素の後に `null` を返す関数を指定します。

```kotlin

fun main() {

    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())

}
```

### チャンクから

最後に、シーケンス要素を 1 つずつ、または任意のサイズのチャンクで生成できる関数があります。それは[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 関数です。
この関数は、[`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) および[`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 関数の呼び出しを含むラムダ式を取ります。
これらは要素をシーケンスコンシューマーに返し、次の要素がコンシューマーによって要求されるまで `sequence()` の実行を中断します。`yield()` は単一の要素を引数として取ります。`yieldAll()` は `Iterable` オブジェクト、`Iterator`、または別の `Sequence` を取ることができます。`yieldAll()` の `Sequence` 引数は無限にすることができます。ただし、このような呼び出しは最後にする必要があります。後続のすべての呼び出しは実行されません。

```kotlin

fun main() {

    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())

}
```

## シーケンス操作

シーケンス操作は、状態要件に関して次のグループに分類できます。

* _ステートレス_操作は状態を必要とせず、各要素を独立して処理します。たとえば、[`map()`](collection-transformations#map) や [`filter()`](collection-filtering) などです。
   ステートレス操作は、要素を処理するために少量の定数の状態を必要とする場合もあります。たとえば、[`take()` または `drop()`](collection-parts) などです。
* _ステートフル_操作は、大量の状態を必要とします。通常、シーケンス内の要素の数に比例します。

シーケンス操作が別のシーケンスを返す場合、それは遅延して生成され、_中間_と呼ばれます。
それ以外の場合、操作は_終端_です。終端操作の例としては、[`toList()`](constructing-collections#copy) や [`sum()`](collection-aggregate) などがあります。シーケンス要素は、終端操作でのみ取得できます。

シーケンスは複数回反復処理できます。ただし、一部のシーケンス実装では、反復処理を 1 回に制限する場合があります。これはドキュメントで特に言及されています。

## シーケンス処理の例

例を使用して、`Iterable` と `Sequence` の違いを見てみましょう。

### Iterable

単語のリストがあると仮定します。以下のコードは、3 文字より長い単語をフィルタリングし、そのような最初の 4 つの単語の長さを出力します。

```kotlin

fun main() {    

    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)

}
```

このコードを実行すると、`filter()` 関数と `map()` 関数が、コードに表示されるのと同じ順序で実行されることがわかります。最初に、すべての要素に対して `filter:` が表示され、次にフィルタリング後に残った要素に対して `length:` が表示され、次に最後の 2 行の出力が表示されます。

これがリスト処理のしくみです。

<img src="/img/list-processing.svg" alt="List processing" style={{verticalAlign: 'middle'}}/>

### シーケンス

次に、同じことをシーケンスで記述してみましょう。

```kotlin

fun main() {

    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //List を Sequence に変換します
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 終端操作: 結果を List として取得します
    println(lengthsSequence.toList())

}
```

このコードの出力は、`filter()` 関数と `map()` 関数が結果リストの構築時にのみ呼び出されることを示しています。
したがって、最初にテキスト行 `"Lengths of.."` が表示され、次にシーケンス処理が開始されます。
フィルタリング後に残った要素については、次の要素をフィルタリングする前にマップが実行されることに注意してください。
結果のサイズが 4 に達すると、`take(4)` が返すことができる最大のサイズであるため、処理は停止します。

シーケンス処理は次のようになります。

<img src="/img/sequence-processing.svg" alt="Sequences processing" style={{verticalAlign: 'middle'}} width="700"/>

この例では、要素の遅延処理と、4 つのアイテムを見つけた後の停止により、リストアプローチを使用するよりも操作の数が削減されます。