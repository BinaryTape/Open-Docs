[//]: # (title: シーケンス)

コレクションに加えて、Kotlin標準ライブラリには別の型である *シーケンス* ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html)) が含まれています。
コレクションとは異なり、シーケンスは要素を保持せず、イテレーション（反復処理）中に要素を生成します。
シーケンスは [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) と同じ関数を提供しますが、多段階のコレクション処理に対して別のアプローチを実装しています。

`Iterable` の処理が複数のステップを含む場合、それらは「積極的（eager）」に実行されます。各処理ステップが完了すると、その結果である中間コレクションを返し、次のステップはそのコレクションに対して実行されます。一方、シーケンスの多段階処理は、可能な限り「遅延（lazy）」実行されます。実際の計算は、処理チェーン全体の結果が要求されたときにのみ行われます。

操作の実行順序も異なります。`Sequence` は各要素に対してすべての処理ステップを一つずつ順番に実行します。対して `Iterable` は、コレクション全体に対して各ステップを完了させてから、次のステップに進みます。

そのため、シーケンスを使用すると中間ステップの結果の構築を避けることができ、コレクション処理チェーン全体のパフォーマンスが向上します。ただし、シーケンスの遅延性には一定のオーバーヘッドが伴い、小さなコレクションの処理や単純な計算を行う場合にはその影響が無視できないことがあります。したがって、`Sequence` と `Iterable` の両方を検討し、どちらが自身のケースに適しているかを判断する必要があります。

## 作成 (Construct)

### 要素から

シーケンスを作成するには、要素を引数として列挙して [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 関数を呼び出します。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### Iterable から

すでに `Iterable` オブジェクト（`List` や `Set` など）がある場合は、[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) を呼び出すことでそこからシーケンスを作成できます。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 関数から

シーケンスを作成するもう一つの方法は、要素を計算する関数を使用して構築することです。
関数に基づいてシーケンスを構築するには、その関数を引数として [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html) を呼び出します。オプションとして、最初の要素を明示的な値または関数呼び出しの結果として指定できます。
提供された関数が `null` を返すと、シーケンスの生成は停止します。したがって、以下の例のシーケンスは無限です。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` は前の要素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // エラー: シーケンスが無限です
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`generateSequence()` で有限のシーケンスを作成するには、必要な最後の要素の後に `null` を返す関数を提供します。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### チャンク（塊）から

最後に、シーケンスの要素を一つずつ、あるいは任意のサイズのチャンク（塊）ごとに生成できる [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 関数があります。
この関数は、[`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) および [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 関数の呼び出しを含むラムダ式を受け取ります。
これらの関数はシーケンスの消費者に要素を返し、消費者が次の要素を要求するまで `sequence()` の実行を一時中断します。`yield()` は引数として単一の要素を取り、`yieldAll()` は `Iterable` オブジェクト、`Iterator`、または別の `Sequence` を取ることができます。`yieldAll()` の `Sequence` 引数は無限にすることもできます。ただし、そのような呼び出しは最後でなければならず、それ以降のすべての呼び出しは実行されません。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## シーケンスの操作

シーケンスの操作は、状態の要件に関して以下のグループに分類できます：

* *ステートレス（Stateless）* 操作は状態を必要とせず、各要素を独立して処理します。例えば [`map()`](collection-transformations.md#map) や [`filter()`](collection-filtering.md) です。また、ステートレス操作であっても、要素を処理するために一定の小さな状態を必要とするものもあります。例えば [`take()` や `drop()`](collection-parts.md) です。
* *ステートフル（Stateful）* 操作は、通常はシーケンス内の要素数に比例する、かなりの量の状態を必要とします。

シーケンス操作が別のシーケンス（遅延生成されるもの）を返す場合、それは *中間（intermediate）* 操作と呼ばれます。
そうでない場合、その操作は *終端（terminal）* 操作と呼ばれます。終端操作の例は [`toList()`](constructing-collections.md#copy) や [`sum()`](collection-aggregate.md) です。シーケンスの要素は終端操作を使用することでのみ取得できます。

シーケンスは複数回イテレートできます。ただし、一部のシーケンスの実装では、一度しかイテレートできないように制限されている場合があります。これについては、各ドキュメントに明記されています。

## シーケンス処理の例

例を使って `Iterable` と `Sequence` の違いを見てみましょう。

### Iterable

単語のリストがあると仮定します。以下のコードは、3文字より長い単語をフィルタリングし、そのような最初の4つの単語の長さを出力します。

```kotlin

fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

このコードを実行すると、`filter()` と `map()` 関数がコード内に記述されている順序で実行されることがわかります。まず、すべての要素に対して `filter:` が表示され、次にフィルタリング後に残った要素に対して `length:` が表示され、最後に最後の2行の出力が表示されます。

リスト処理の仕組みは以下の通りです：

![リストの処理](list-processing.svg)

### シーケンス

次に、同じことをシーケンスで書いてみましょう：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // List を Sequence に変換
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 終端操作: 結果を List として取得
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

このコードの出力は、`filter()` と `map()` 関数が結果のリストを構築するときにのみ呼び出されることを示しています。したがって、最初に `"Lengths of.."` というテキストの行が表示され、その後にシーケンスの処理が始まります。
フィルタリング後に残った要素については、次の要素をフィルタリングする前にマップ（map）が実行されることに注目してください。結果のサイズが4に達すると、`take(4)` が返すことのできる最大サイズであるため、処理は停止します。

シーケンス処理は以下のようになります：

![シーケンスの処理](sequence-processing.svg) {width="700"}

この例では、要素の遅延処理と4つの項目が見つかった後の停止により、リストのアプローチを使用する場合と比較して操作の回数が削減されています。