[//]: # (title: シーケンス)

Kotlin標準ライブラリには、コレクションに加えてもう1つの型である_シーケンス_ ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))が含まれています。
コレクションとは異なり、シーケンスは要素を保持せず、イテレーション中に要素を生成します。
シーケンスは[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)と同じ関数を提供しますが、
多段階のコレクション処理に対して異なるアプローチを実装しています。

`Iterable`の処理に複数のステップが含まれる場合、それらは即時実行（eagerly）されます。各処理ステップは完了し、
その結果として中間コレクションを返します。次のステップはこのコレクションに対して実行されます。一方、シーケンスの多段階処理は、可能な限り遅延実行（lazily）されます。実際の計算は、処理チェーン全体の
結果が要求されたときにのみ行われます。

操作の実行順序も異なります。`Sequence`はすべての処理ステップを要素ごとに1つずつ実行します。
一方、`Iterable`はコレクション全体に対して各ステップを完了し、その後次のステップに進みます。

したがって、シーケンスを使用すると中間ステップの結果を構築する必要がなくなり、コレクション処理チェーン全体のパフォーマンスが向上します。
ただし、シーケンスの遅延的な性質は、小さなコレクションを処理する場合や単純な計算を行う場合に顕著になる可能性のあるオーバーヘッドを追加します。
そのため、`Sequence`と`Iterable`の両方を考慮し、ご自身のケースにどちらが適しているかを決定する必要があります。

## 構築

### 要素から

シーケンスを作成するには、[`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html)関数を呼び出し、要素を引数としてリストします。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### Iterableから

すでに`Iterable`オブジェクト（`List`や`Set`など）がある場合は、[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html)を呼び出すことで、そこからシーケンスを作成できます。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 関数から

シーケンスを作成するもう1つの方法は、要素を計算する関数を使用して構築することです。
関数に基づいてシーケンスを構築するには、この関数を引数として[`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)を呼び出します。
オプションとして、最初の要素を明示的な値として、または関数呼び出しの結果として指定できます。
提供された関数が`null`を返すと、シーケンスの生成は停止します。したがって、以下の例のシーケンスは無限です。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` は前の要素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // エラー: シーケンスは無限です
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`generateSequence()`で有限シーケンスを作成するには、必要な最後の要素の後に`null`を返す関数を提供します。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### チャンクから

最後に、シーケンス要素を1つずつ、または任意のサイズのチャンクで生成できる関数、
[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)関数があります。
この関数は、[`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)
および[`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html)関数の呼び出しを含むラムダ式を受け取ります。
これらはシーケンスコンシューマーに要素を返し、次の要素がコンシューマーによって要求されるまで`sequence()`の実行を中断します。
`yield()`は単一の要素を引数として受け取ります。`yieldAll()`は`Iterable`オブジェクト、`Iterator`、または別の`Sequence`を受け取ることができます。
`yieldAll()`の`Sequence`引数は無限であっても構いません。ただし、そのような呼び出しは最後でなければなりません。それ以降のすべての呼び出しは実行されません。

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

## シーケンス操作

シーケンス操作は、その状態要件に関して次のグループに分類できます。

*   _ステートレス_操作は状態を必要とせず、各要素を独立して処理します。例えば、[`map()`](collection-transformations.md#map)や[`filter()`](collection-filtering.md)などです。
    ステートレス操作は、要素を処理するために少量かつ一定量の状態を必要とすることもあります。例えば、[`take()`や`drop()`](collection-parts.md)などです。
*   _ステートフル_操作は、通常シーケンス内の要素数に比例する、かなりの量の状態を必要とします。

シーケンス操作が別のシーケンスを返す場合、そのシーケンスが遅延的に生成される場合、それは_中間_操作と呼ばれます。
そうでない場合、その操作は_終端_操作です。終端操作の例としては、[`toList()`](constructing-collections.md#copy)や[`sum()`](collection-aggregate.md)などがあります。
シーケンス要素は終端操作によってのみ取得できます。

シーケンスは複数回イテレートできますが、一部のシーケンス実装は1回しかイテレートできないように制限される場合があります。
それはそのドキュメントに明記されています。

## シーケンス処理の例

`Iterable`と`Sequence`の違いを例で見てみましょう。

### Iterable

単語のリストがあるとします。以下のコードは、3文字を超える単語をフィルタリングし、そのような最初の4つの単語の長さを出力します。

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

このコードを実行すると、`filter()`関数と`map()`関数がコードに現れるのと同じ順序で実行されることがわかります。
最初にすべての要素に対して`filter:`が表示され、次にフィルタリング後に残った要素に対して`length:`が表示され、
最後に2つの最終行の出力が表示されます。

リスト処理は次のように進みます。

![List processing](list-processing.svg)

### Sequence

次に、同じ処理をシーケンスで記述します。

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // ListをSequenceに変換
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 終端操作: 結果をListとして取得
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

このコードの出力は、`filter()`関数と`map()`関数が結果リストを構築するときにのみ呼び出されることを示しています。
したがって、最初に「Lengths of..」という行が表示され、その後にシーケンス処理が開始されます。
フィルタリング後に残った要素については、次の要素をフィルタリングする前にmapが実行されることに注意してください。
結果のサイズが4に達すると、`take(4)`が返すことができる最大のサイズであるため、処理は停止します。

シーケンス処理は次のように進みます。

![Sequences processing](sequence-processing.svg) {width="700"}

この例では、要素の遅延処理と4つの項目が見つかった後に停止することで、リストアプローチを使用する場合と比較して操作の数を減らしています。