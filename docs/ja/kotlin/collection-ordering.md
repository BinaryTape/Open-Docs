[//]: # (title: 順序付け)

要素の順序は、特定のコレクションタイプにとって重要な側面です。例えば、同じ要素を持つ2つのリストは、それらの要素の順序が異なる場合、等しくありません。

Kotlinでは、オブジェクトの順序をいくつかの方法で定義できます。

まず、_自然順序_があります。これは、[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)インターフェースの実装に対して定義されます。自然順序は、他の順序が指定されていない場合にそれらをソートするために使用されます。

ほとんどの組み込み型は比較可能です。

* 数値型は伝統的な数値順序を使用します: `1`は`0`より大きく、`-3.4f`は`-5f`より大きい、などです。
* `Char`と`String`は[辞書順](https://en.wikipedia.org/wiki/Lexicographical_order)を使用します: `b`は`a`より大きく、`world`は`hello`より大きい、などです。

ユーザー定義型に自然順序を定義するには、その型を`Comparable`の実装者にします。これには、`compareTo()`関数の実装が必要です。`compareTo()`は、同じ型の別のオブジェクトを引数として受け取り、どちらのオブジェクトが大きいかを示す整数値を返さなければなりません。

* 正の値は、レシーバオブジェクトが大きいことを示します。
* 負の値は、引数より小さいことを示します。
* ゼロは、オブジェクトが等しいことを示します。

以下は、メジャーバージョンとマイナーバージョンから成るバージョンの順序付けのためのクラスです。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

_カスタム順序_を使用すると、任意の型のインスタンスを好きなようにソートできます。特に、比較不可能なオブジェクトの順序を定義したり、比較可能な型に対して自然順序以外の順序を定義したりできます。ある型にカスタム順序を定義するには、その型に対して[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)を作成します。`Comparator`には`compare()`関数が含まれています。これはクラスの2つのインスタンスを受け取り、それらの比較の整数結果を返します。結果は、上記で説明した`compareTo()`の結果と同じように解釈されます。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`lengthComparator`があれば、デフォルトの辞書順ではなく、文字列をその長さで並べ替えることができます。

`Comparator`を定義するより短い方法は、標準ライブラリの[`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)関数です。`compareBy()`は、インスタンスから`Comparable`値を生成するラムダ関数を受け取り、生成された値の自然順序としてカスタム順序を定義します。

`compareBy()`を使用すると、上記の例の長さコンパレータは次のようになります。

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

複数の基準に基づいて順序を定義することもできます。例えば、文字列を長さでソートし、長さが同じ場合はアルファベット順にソートするには、次のように記述します。

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b -> 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 -> a.compareTo(b)
             else -> compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

複数の基準によるソートはよくあるシナリオであるため、Kotlin標準ライブラリは、二次的なソートルールを追加するために使用できる[`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html)関数を提供しています。

例えば、`compareBy()`と`thenBy()`を組み合わせて、前の例と同じように、最初に文字列を長さでソートし、次にアルファベット順でソートできます。

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlinコレクションパッケージは、自然順序、カスタム順序、さらにはランダム順序でコレクションをソートするための関数を提供しています。このページでは、[読み取り専用](collections-overview.md#collection-types)コレクションに適用されるソート関数について説明します。これらの関数は、元のコレクションの要素を要求された順序で含む新しいコレクションとして結果を返します。[可変](collections-overview.md#collection-types)コレクションをインプレースでソートする関数については、[List固有の操作](list-operations.md#sort)を参照してください。

## 自然順序

基本的な関数である[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)と[`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)は、コレクションの要素を自然順序に従って昇順および降順にソートして返します。これらの関数は、`Comparable`要素のコレクションに適用されます。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## カスタム順序
 
カスタム順序でソートする場合や、比較不可能なオブジェクトをソートする場合は、[`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html)と[`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)関数があります。これらは、コレクションの要素を`Comparable`値にマッピングするセレクタ関数を受け取り、その値の自然順序でコレクションをソートします。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションのソートにカスタム順序を定義するには、独自の`Comparator`を提供できます。これを行うには、`Comparator`を渡して[`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html)関数を呼び出します。この関数を使用すると、文字列をその長さでソートするのは次のようになります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 逆順

[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)関数を使用して、コレクションを逆順で取得できます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()`は、要素のコピーを含む新しいコレクションを返します。したがって、後で元のコレクションを変更しても、以前に`reversed()`から取得した結果には影響しません。

もう1つの逆順にする関数である[`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)は、同じコレクションインスタンスの逆順ビューを返します。そのため、元のリストが変更されない場合は、`reversed()`よりも軽量で望ましい場合があります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

元のリストが可変である場合、そのすべての変更は逆順ビューに反映され、逆もまた同様です。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

しかし、リストの可変性が不明な場合や、ソースがそもそもリストではない場合は、`reversed()`の方が推奨されます。その結果は将来変更されないコピーであるためです。

## ランダム順序

最後に、コレクション要素をランダムな順序で含む新しい`List`を返す関数である[`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)があります。引数なしで呼び出すことも、[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)オブジェクトを渡して呼び出すこともできます。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}