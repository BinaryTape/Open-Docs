[//]: # (title: コレクションの要素を取得する)

Kotlin標準ライブラリには、コレクションの一部を取得するための拡張関数が含まれています。
これらの関数は、結果となるコレクションの要素を選択するためのさまざまな方法を提供します。例えば、要素の位置を明示的に指定したり、結果のサイズを指定したりすることができます。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html)は、指定されたインデックスを持つコレクションの要素のリストを返します。インデックスは[range](ranges.md)として渡すことも、整数の値のコレクションとして渡すこともできます。

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

先頭から指定された数の要素を取得するには、[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html)関数を使用します。
最後の要素を取得するには、[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)を使用します。
コレクションのサイズよりも大きい数で呼び出された場合、両方の関数はコレクション全体を返します。

指定された数の先頭または最後の要素を除くすべての要素を取得するには、それぞれ[`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)および[`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html)関数を呼び出します。

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

要素の取得または削除のために、述語（predicate）を使用することもできます。
上記で説明した関数と同様に、以下の4つの関数があります。

*   [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) は、述語を伴う`take()`です。述語に一致しない最初の要素を除く、それまでの要素を取得します。コレクションの最初の要素が述語に一致しない場合、結果は空になります。
*   [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) は`takeLast()`に似ています。述語に一致する要素の範囲をコレクションの末尾から取得します。その範囲の最初の要素は、述語に一致しない最後の要素の次の要素です。コレクションの最後の要素が述語に一致しない場合、結果は空になります。
*   [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) は、同じ述語を持つ`takeWhile()`の反対です。述語に一致しない最初の要素から末尾までの要素を返します。
*   [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) は、同じ述語を持つ`takeLastWhile()`の反対です。述語に一致しない最後の要素より前の要素から先頭までの要素を返します。

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

コレクションを特定のサイズのパートに分割するには、[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html)関数を使用します。
`chunked()`は単一の引数、つまりチャンクのサイズを受け取り、指定されたサイズの`List`の`List`を返します。
最初のチャンクは最初の要素から始まり、`size`個の要素を含みます。2番目のチャンクは次の`size`個の要素を含み、以後同様です。最後のチャンクはサイズが小さくなる場合があります。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

返されたチャンクに対して、その場で変換を適用することもできます。
これを行うには、`chunked()`を呼び出す際に変換をラムダ関数として提供します。
ラムダ引数はコレクションのチャンクです。変換を伴って`chunked()`が呼び出された場合、チャンクは一時的な`List`であり、そのラムダ内で直ちに消費されるべきです。

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
これらを取得するための関数は[`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)と呼ばれます。これは、指定されたサイズの移動するウィンドウを通してコレクションを見た場合に表示される要素範囲のリストを返します。
`chunked()`とは異なり、`windowed()`は*各*コレクション要素から始まる要素範囲（ウィンドウ）を返します。
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

`windowed()`は、オプションのパラメータでより高い柔軟性を提供します。

*   `step`は、2つの隣接するウィンドウの最初の要素間の距離を定義します。デフォルト値は1なので、結果にはすべての要素から始まるウィンドウが含まれます。`step`を2に増やすと、奇数番目の要素（1番目、3番目など）から始まるウィンドウのみが取得されます。
*   `partialWindows`は、コレクションの末尾にある要素から始まる、より小さいサイズのウィンドウを含めます。たとえば、3つの要素からなるウィンドウを要求した場合、最後の2つの要素に対してはウィンドウを構築できません。この場合、`partialWindows`を有効にすると、サイズ2と1の2つのリストが追加で含まれます。

最後に、返された範囲に対して、その場で変換を適用することもできます。
これを行うには、`windowed()`を呼び出す際に変換をラムダ関数として提供します。

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

2つの要素からなるウィンドウを構築するには、別の関数である[`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)があります。
これは、レシーバーコレクションの隣接する要素のペアを作成します。
`zipWithNext()`はコレクションをペアに分割するわけではないことに注意してください。これは最後の要素を除く*各*要素に対して`Pair`を作成するため、`[1, 2, 3, 4]`に対する結果は`[[1, 2], [2, 3], [3, 4]]`であり、`[[1, 2], [3, 4]]`ではありません。
`zipWithNext()`は変換関数とともに呼び出すこともできます。この変換関数は、レシーバーコレクションの2つの要素を引数として取る必要があります。

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