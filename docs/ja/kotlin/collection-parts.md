---
title: コレクションパートの取得
---
Kotlin標準ライブラリには、コレクションの一部を取得するための拡張関数が含まれています。
これらの関数は、結果のコレクションに対して要素を選択するさまざまな方法を提供します。要素の位置を明示的にリストしたり、
結果のサイズを指定したりできます。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) は、指定されたインデックスを持つコレクション要素のリストを返します。インデックスは、[範囲](ranges)または整数の値のコレクションとして渡すことができます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    

}
```

## Take と drop

最初から指定された数の要素を取得するには、[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 関数を使用します。
最後の要素を取得するには、[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html) を使用します。
コレクションのサイズよりも大きい数で呼び出されると、両方の関数はコレクション全体を返します。

指定された数の最初または最後の要素を除くすべての要素を取得するには、[`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)
関数と [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 関数をそれぞれ呼び出します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))

}
```

述語を使用して、取得またはドロップする要素の数を定義することもできます。
上記で説明した関数と同様の4つの関数があります。

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) は、述語を持つ `take()` です。述語に一致しない最初の要素を除いて、それまでの要素を取得します。最初のコレクション要素が述語に一致しない場合、結果は空になります。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) は `takeLast()` と似ています。コレクションの末尾から述語に一致する要素の範囲を取得します。範囲の最初の要素は、述語に一致しない最後の要素の次の要素です。最後のコレクション要素が述語に一致しない場合、結果は空になります。
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) は、同じ述語を持つ `takeWhile()` の反対です。述語に一致しない最初の要素から最後まで要素を返します。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) は、同じ述語を持つ `takeLastWhile()` の反対です。先頭から述語に一致しない最後の要素まで要素を返します。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })

}
```

## Chunked

コレクションを指定されたサイズのパーツに分割するには、[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 関数を使用します。
`chunked()` は、単一の引数 (チャンクのサイズ) を受け取り、指定されたサイズの `List` の `List` を返します。
最初のチャンクは最初の要素から始まり、`size` 要素を含み、2番目のチャンクは次の `size` 要素を保持します。
最後のチャンクはサイズが小さくなる場合があります。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.chunked(3))

}
```

返されたチャンクにすぐに変換を適用することもできます。
これを行うには、`chunked()` を呼び出すときに、変換をラムダ関数として指定します。
ラムダ引数は、コレクションのチャンクです。変換を使用して `chunked()` が呼び出されると、
チャンクは有効期間の短い `List` であり、そのラムダですぐに消費する必要があります。

```kotlin

fun main() {

    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection

}
```

## Windowed

指定されたサイズのコレクション要素の可能なすべての範囲を取得できます。
それらを取得する関数は [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html) と呼ばれます。
これは、指定されたサイズのウィンドウを通してコレクションを見ている場合に表示される要素範囲のリストを返します。
`chunked()` とは異なり、`windowed()` は *各* コレクション要素から始まる要素範囲 (_ウィンドウ_) を返します。
すべてのウィンドウは、単一の `List` の要素として返されます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))

}
```

`windowed()` は、オプションのパラメータでより柔軟性を提供します。

* `step` は、2つの隣接するウィンドウの最初の要素間の距離を定義します。デフォルトでは、値は1であるため、結果にはすべての要素から始まるウィンドウが含まれます。ステップを2に増やすと、奇数の要素（最初、3番目など）から始まるウィンドウのみを受信します。
* `partialWindows` には、コレクションの最後にある要素から始まる、より小さいサイズのウィンドウが含まれます。たとえば、3つの要素のウィンドウを要求した場合、最後の2つの要素に対してウィンドウを構築できません。この場合、`partialWindows` を有効にすると、サイズ2と1のリストが2つ追加されます。

最後に、返された範囲にすぐに変換を適用できます。
これを行うには、`windowed()` を呼び出すときに、変換をラムダ関数として指定します。

```kotlin

fun main() {

    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })

}
```

2要素のウィンドウを構築するために、別の関数 [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html) があります。
これは、レシーバーコレクションの隣接する要素のペアを作成します。
`zipWithNext()` はコレクションをペアに分割しないことに注意してください。最後の要素を除く _各_ 要素に対して `Pair` を作成するため、`[1, 2, 3, 4]` での結果は `[[1, 2], [2, 3], [3, 4]]` であり、`[[1, 2`], `[3, 4]]` ではありません。
`zipWithNext()` は、変換関数とともに呼び出すこともできます。これは、レシーバーコレクションの2つの要素を
引数として取る必要があります。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 `->` s1.length > s2.length})

}
```