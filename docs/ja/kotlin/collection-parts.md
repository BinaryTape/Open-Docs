[//]: # (title: コレクションの一部を取得する)

Kotlin標準ライブラリには、コレクションの一部を取得するための拡張関数が含まれています。
これらの関数は、結果のコレクションの要素を選択するためのさまざまな方法を提供します。具体的には、要素の位置を明示的にリストしたり、結果のサイズを指定したりすることができます。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html)は、指定されたインデックスを持つコレクション要素のリストを返します。インデックスは、[範囲](ranges.md)として渡すことも、整数のコレクションとして渡すこともできます。

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

最初の要素から指定された数の要素を取得するには、[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html)関数を使用します。
最後の要素を取得するには、[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)を使用します。
コレクションのサイズよりも大きい数で呼び出された場合、両方の関数はコレクション全体を返します。

最初または最後の指定された数の要素を除くすべての要素を取得するには、それぞれ[`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)と[`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html)関数を呼び出します。

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

また、述語を使用して、取得または削除する要素の数を定義することもできます。
上記と同様の関数が4つあります。

*   [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) は、述語付きの `take()` です。述語に一致しない最初の要素まで（ただし、その要素は含まない）の要素を取得します。コレクションの最初の要素が述語に一致しない場合、結果は空になります。
*   [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) は `takeLast()` に似ています。コレクションの末尾から述語に一致する要素の範囲を取得します。範囲の最初の要素は、述語に一致しない最後の要素の次の要素です。コレクションの最後の要素が述語に一致しない場合、結果は空になります。
*   [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) は、同じ述語を持つ `takeWhile()` の反対です。述語に一致しない最初の要素から最後までを返します。
*   [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) は、同じ述語を持つ `takeLastWhile()` の反対です。先頭から述語に一致しない最後の要素までを返します。

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

## Chunked

コレクションを指定されたサイズのパーツに分割するには、[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html)関数を使用します。
`chunked()`は単一の引数（チャンクのサイズ）を取り、指定されたサイズの`List`の`List`を返します。
最初のチャンクは最初の要素から始まり、`size`個の要素を含み、2番目のチャンクは次の`size`個の要素を含み、以下同様です。最後のチャンクはサイズが小さくなる場合があります。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

返されたチャンクに対して、すぐに変換を適用することもできます。
これを行うには、`chunked()`を呼び出すときに、変換をラムダ関数として提供します。
ラムダ引数はコレクションのチャンクです。`chunked()`が変換とともに呼び出された場合、チャンクは短命な`List`であり、そのラムダ内で直ちに消費されるべきです。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

指定されたサイズのコレクション要素のすべての可能な範囲を取得できます。
それらを取得する関数は[`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)と呼ばれます。これは、指定されたサイズの移動ウィンドウを通してコレクションを見ているかのように見える要素範囲のリストを返します。
`chunked()`とは異なり、`windowed()`は*各*コレクション要素から始まる要素範囲（_ウィンドウ_）を返します。
すべてのウィンドウは、単一の`List`の要素として返されます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()`は、デフォルト値を持つパラメーターに関して、より柔軟性を提供します。

*   `step` は、隣接する2つのウィンドウの最初の要素間の距離を定義します。デフォルト値は1なので、結果にはすべての要素から始まるウィンドウが含まれます。ステップを2に増やすと、奇数要素から始まるウィンドウ（1番目、3番目など）のみを受け取ります。
*   `partialWindows` は、コレクションの末尾の要素から始まる、より小さいサイズのウィンドウを含めます。たとえば、3つの要素のウィンドウを要求した場合、最後の2つの要素に対しては作成できません。この場合`partialWindows`を有効にすると、サイズ2と1の2つのリストが追加で含まれます。

最後に、返された範囲にすぐに変換を適用できます。
これを行うには、`windowed()`を呼び出すときに、変換をラムダ関数として提供します。

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

2要素のウィンドウを構築するには、別の関数である[`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)があります。
これは、レシーバコレクションの隣接する要素のペアを作成します。
`zipWithNext()`はコレクションをペアに分割するわけではないことに注意してください。最後の要素を除く_各_要素に対して`Pair`を作成するため、`[1, 2, 3, 4]`に対する結果は`[[1, 2], [2, 3], [3, 4]]`であり、`[[1, 2], [3, 4]]`ではありません。
`zipWithNext()`は変換関数とともに呼び出すこともできます。その場合、レシーバコレクションの2つの要素を引数として受け取る必要があります。

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