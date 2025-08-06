[//]: # (title: 集計処理)

Kotlinのコレクションには、一般的に使用される_集計処理_、すなわちコレクションの内容に基づいて単一の値を返す処理のための関数が含まれています。これらのほとんどはよく知られており、他の言語と同様に機能します。

*   [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html)と[`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)は、それぞれ最小の要素と最大の要素を返します。空のコレクションでは、`null`を返します。
*   [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)は、数値のコレクション内の要素の平均値を返します。
*   [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)は、数値のコレクション内の要素の合計を返します。
*   [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)は、コレクション内の要素の数を返します。

```kotlin
fun main() {
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.maxOrNull()}")
    println("Min: ${numbers.minOrNull()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

特定のセレクタ関数やカスタム[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)を使用して、最小の要素と最大の要素を取得するための関数もあります。

*   [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html)と[`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)は、セレクタ関数を受け取り、それが最大または最小の値を返す要素を返します。
*   [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html)と[`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)は、`Comparator`オブジェクトを受け取り、その`Comparator`に従って最大または最小の要素を返します。
*   [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html)と[`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)は、セレクタ関数を受け取り、セレクタ自体の最大または最小の戻り値を返します。
*   [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html)と[`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)は、`Comparator`オブジェクトを受け取り、その`Comparator`に従って最大または最小のセレクタ戻り値を返します。

これらの関数は、空のコレクションでは`null`を返します。また、空のコレクションに対して`NoSuchElementException`をスローするものの、対応する関数と同じ処理を行う代替の関数として、[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html)、[`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)があります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

通常の`sum()`に加えて、セレクタ関数を受け取り、そのセレクタ関数をすべてのコレクション要素に適用した結果の合計を返す高度な合計関数[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)があります。セレクタは、`Int`、`Long`、`Double`、`UInt`、`ULong` (JVM上では`BigInteger`および`BigDecimal`も) といったさまざまな数値型を返すことができます。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## foldとreduce

より具体的なケースでは、[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)と[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)関数があり、これらは提供された操作をコレクション要素に順次適用し、蓄積された結果を返します。この操作は、以前に蓄積された値とコレクション要素の2つの引数を取ります。

これら2つの関数の違いは、`fold()`が初期値を取り、それを最初のステップでの蓄積値として使用するのに対し、`reduce()`の最初のステップでは、最初の要素と2番目の要素を操作の引数として使用する点です。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //不正確: 結果で最初の要素が2倍になっていない
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

上記の例は、その違いを示しています。`fold()`は2倍にされた要素の合計を計算するために使用されます。同じ関数を`reduce()`に渡すと、最初のステップでリストの最初の要素と2番目の要素を引数として使用するため、別の結果を返します。これにより、最初の要素が2倍にならないからです。

要素に逆順で関数を適用するには、[`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)および[`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)関数を使用します。これらは`fold()`や`reduce()`と同様に機能しますが、最後の要素から開始し、前の要素へと処理を続けます。右から畳み込み（fold）または削減（reduce）を行う場合、操作の引数の順序が変わることに注意してください。最初に要素が、次に蓄積された値が来ます。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要素のインデックスをパラメータとして取る操作を適用することもできます。この目的のために、[`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)および[`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)関数を使用し、操作の最初の引数として要素のインデックスを渡します。

最後に、コレクション要素に右から左へそのような操作を適用する関数として、[`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)および[`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)があります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element -> if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum -> if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

すべてのreduce操作は、空のコレクションに対して例外をスローします。代わりに`null`を受け取るには、それらの`*OrNull()`版を使用します。
*   [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
*   [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
*   [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
*   [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

中間的な累積値を保存したい場合、[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (またはその同義語である[`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)) および[`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)関数があります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningReduce:
"))
    println(runningFoldSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningFold:
"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

操作のパラメータにインデックスが必要な場合は、[`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)または[`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)を使用してください。