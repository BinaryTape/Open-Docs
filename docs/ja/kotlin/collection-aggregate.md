---
title: 集約オペレーション
---
Kotlinのコレクションには、よく使用される*集約演算*（コレクションの内容に基づいて単一の値を返す演算）のための関数が含まれています。それらのほとんどはよく知られており、他の言語と同じように動作します。

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html)と[`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)は、それぞれ最小の要素と最大の要素を返します。空のコレクションでは、`null`を返します。
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)は、数値のコレクション内の要素の平均値を返します。
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)は、数値のコレクション内の要素の合計を返します。
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)は、コレクション内の要素の数を返します。

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

特定のセレクタ関数またはカスタム[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)によって、最小および最大の要素を取得するための関数もあります。

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html)と[`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)は、セレクタ関数を受け取り、その関数が最大または最小の値を返す要素を返します。
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html)と[`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)は、`Comparator`オブジェクトを受け取り、その`Comparator`に従って最大または最小の要素を返します。
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html)と[`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)は、セレクタ関数を受け取り、セレクタ自体の最大または最小の戻り値を返します。
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html)と[`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)は、`Comparator`オブジェクトを受け取り、その`Comparator`に従って最大または最小のセレクタ戻り値を返します。

これらの関数は、空のコレクションに対して`null`を返します。代替として、[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)、[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html)、[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html)、および[`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html)があります。これらは、対応するものと同じように動作しますが、空のコレクションに対して`NoSuchElementException`をスローします。

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)

}
```

通常の`sum()`に加えて、セレクタ関数を受け取り、コレクションのすべての要素への適用結果の合計を返す、高度な合計関数[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)があります。セレクタは、`Int`、`Long`、`Double`、`UInt`、および`ULong`（JVMでは`BigInteger`および`BigDecimal`も）などの異なる数値型を返すことができます。

```kotlin

fun main() {

    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })

}
```

## Fold と reduce

より具体的なケースのために、提供された操作をコレクション要素に順番に適用し、累積された結果を返す関数[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)と[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)があります。
この操作は、以前に累積された値とコレクション要素の2つの引数を取ります。

2つの関数の違いは、`fold()`が初期値を持ち、最初のステップで累積値として使用するのに対し、`reduce()`の最初のステップでは、最初と2番目の要素を最初のステップの操作引数として使用することです。

```kotlin
fun main() {

    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element `->` sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element `->` sum + element * 2 }
    println(sumDoubled)

    //incorrect: the first element isn't doubled in the result
    //val sumDoubledReduce = numbers.reduce { sum, element `->` sum + element * 2 } 
    //println(sumDoubledReduce)

}
```

上記の例は違いを示しています。`fold()`は、2倍にした要素の合計を計算するために使用されます。
同じ関数を`reduce()`に渡すと、リストの最初と2番目の要素を最初のステップの引数として使用するため、別の結果が返されます。そのため、最初の要素は2倍になりません。

関数を逆の順序で要素に適用するには、関数[`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)と[`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)を使用します。
これらは、`fold()`および`reduce()`と同様の方法で動作しますが、最後の要素から開始し、前の要素に進みます。
右にfoldまたはreduceする場合、操作引数の順序が変更されることに注意してください。最初に要素が来て、次に累積値が来ます。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum `->` sum + element * 2 }
    println(sumDoubledRight)

}
```

要素のインデックスをパラメータとして受け取る操作を適用することもできます。
この目的のために、要素インデックスを操作の最初の引数として渡す関数[`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)と[`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)を使用します。

最後に、このような操作を右から左へコレクション要素に適用する関数[`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)と[`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html)があります。

```kotlin

fun main() {

    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum `->` if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)

}
```

すべてのreduce操作は、空のコレクションで例外をスローします。代わりに`null`を受け取るには、`*OrNull()`の対応するものを使用します。
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

中間アキュムレータの値を保存したい場合は、関数[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html)（またはその同義語[`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)）と[`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)があります。

```kotlin

fun main() {

    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item `->` sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item `->` sum + item }

    val transform = { index: Int, element: Int `->` "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningReduce:
"))
    println(runningFoldSum.mapIndexed(transform).joinToString("
", "Sum of first N elements with runningFold:
"))
}
```

操作パラメータにインデックスが必要な場合は、[`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)または[`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)を使用します。