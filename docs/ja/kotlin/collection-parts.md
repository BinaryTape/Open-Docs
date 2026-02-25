[//]: # (title: コレクションの一部の取得)

Kotlin標準ライブラリには、コレクションの一部を取得するための拡張関数が含まれています。
これらの関数は、位置を明示的に指定したり、結果のサイズを指定したりするなど、結果となるコレクションの要素を選択するためのさまざまな方法を提供します。

## Slice（スライス）

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) は、指定されたインデックスを持つコレクション要素のリストを返します。インデックスは、[範囲（range）](ranges.md) または整数のコレクションとして渡すことができます。

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Take と drop

最初から指定された数の要素を取得するには、[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 関数を使用します。
最後の要素を取得するには、[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html) を使用します。
コレクションのサイズより大きい数値で呼び出された場合、両方の関数はコレクション全体を返します。

最初または最後の指定された数以外のすべての要素を取得（除外）するには、それぞれ [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) および [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 関数を呼び出します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、述語（predicate）を使用して、取得または除外する要素の数を定義することもできます。
上記の関数に似た4つの関数があります。

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) は、述語を伴う `take()` です。述語に一致しない最初の要素の手前までの要素を取得します。最初の要素が述語に一致しない場合、結果は空になります。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) は `takeLast()` に似ています。コレクションの末尾から述語に一致する要素の範囲を取得します。範囲の最初の要素は、述語に一致しない最後の要素の次の要素になります。最後の要素が述語に一致しない場合、結果は空になります。
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) は、同じ述語を使用する `takeWhile()` の逆です。述語に一致しない最初の要素から末尾までの要素を返します。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) は、同じ述語を使用する `takeLastWhile()` の逆です。最初から、述語に一致しない最後の要素までの要素を返します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Chunked（チャンク化）

コレクションを指定されたサイズの部分に分割するには、[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 関数を使用します。
`chunked()` は引数を1つ（チャンクのサイズ）受け取り、そのサイズの `List` の `List` を返します。
最初のチャンクは最初の要素から始まり `size` 個の要素を含み、2番目のチャンクは次の `size` 個の要素を保持し、以下同様に続きます。最後のチャンクは指定されたサイズより小さくなる場合があります。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

返されるチャンクに対してすぐに変換を適用することもできます。
これを行うには、`chunked()` を呼び出すときに変換をラムダ関数として提供します。
ラムダの引数はコレクションのチャンクです。変換を伴って `chunked()` が呼び出される場合、チャンクは短寿命の `List` であり、そのラムダ内ですぐに消費される必要があります。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` は元のコレクションのチャンク
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed（ウィンドウ化）

指定されたサイズのコレクション要素の、可能なすべての範囲を取得できます。
それらを取得するための関数は [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html) と呼ばれます。
これは、指定されたサイズのスライディングウィンドウを通してコレクションを見ているかのような、要素の範囲のリストを返します。
`chunked()` とは異なり、`windowed()` は *各* コレクション要素から始まる要素の範囲（ウィンドウ）を返します。
すべてのウィンドウは、単一の `List` の要素として返されます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` は、デフォルト値を持つパラメータによって、より柔軟な指定が可能です。

* `step` は、2つの隣接するウィンドウの最初の要素間の距離を定義します。デフォルト値は1なので、結果にはすべての要素から始まるウィンドウが含まれます。ステップを2に増やすと、奇数番目の要素（1番目、3番目など）から始まるウィンドウのみを受け取ります。
* `partialWindows` は、コレクションの末尾にある要素から始まる、より小さいサイズのウィンドウを含めます。例えば、3つの要素のウィンドウをリクエストした場合、最後の2つの要素については3要素のウィンドウを構築できません。この場合に `partialWindows` を有効にすると、サイズ2と1のリストがさらに対象に含まれます。

最後に、返される範囲に対してすぐに変換を適用することもできます。
これを行うには、`windowed()` を呼び出すときに変換をラムダ関数として提供します。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

2要素のウィンドウを構築するために、別の関数 [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html) があります。
これは、レシーバコレクションの隣接する要素のペア（Pair）を作成します。
`zipWithNext()` はコレクションを単にペアに分割するのではないことに注意してください。最後以外の *各* 要素に対して `Pair` を作成するため、`[1, 2, 3, 4]` に対する結果は `[[1, 2], [2, 3], [3, 4]]` となり、`[[1, 2], [3, 4]]` にはなりません。
`zipWithNext()` も変換関数を伴って呼び出すことができます。その関数はレシーバコレクションの2つの要素を引数として受け取ります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}