[//]: # (title: 順序付け)

要素の順序は、特定のコレクション型において重要な側面です。
例えば、同じ要素を持つ 2 つのリストであっても、要素の順序が異なれば、それらは等価ではありません。

Kotlin では、オブジェクトの順序をいくつかの方法で定義できます。

まず、「自然順序（natural order）」があります。これは [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) インターフェースの実装に対して定義されます。自然順序は、他に順序が指定されていない場合のソートに使用されます。

ほとんどの組み込み型は比較可能です：

*   数値型は伝統的な数値の順序を使用します：`1` は `0` より大きく、`-3.4f` は `-5f` より大きい、など。
*   `Char` と `String` は [辞書順（lexicographical order）](https://en.wikipedia.org/wiki/Lexicographical_order) を使用します：`b` は `a` より大きく、`world` は `hello` より大きくなります。

ユーザー定義型に自然順序を定義するには、その型に `Comparable` を実装させます。
これには `compareTo()` 関数の実装が必要です。`compareTo()` は、同じ型の別のオブジェクトを引数として受け取り、どちらのオブジェクトが大きいかを示す整数値を返す必要があります：

*   正の値は、レシーバーオブジェクトの方が大きいことを示します。
*   負の値は、引数よりも小さいことを示します。
*   ゼロは、オブジェクトが等しいことを示します。

以下は、メジャー（major）パートとマイナー（minor）パートで構成されるバージョンを順序付けするためのクラスです。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 中置形式での compareTo()
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

「カスタム順序（custom orders）」を使用すると、任意の型のインスタンスを好きなようにソートできます。
特に、比較可能（comparable）ではないオブジェクトに対して順序を定義したり、比較可能な型に対して自然順序以外の順序を定義したりできます。
ある型にカスタム順序を定義するには、その型のための [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html) を作成します。
`Comparator` には `compare()` 関数が含まれており、クラスの 2 つのインスタンスを受け取り、それらの比較結果を整数で返します。
結果の解釈は、上述の `compareTo()` の結果と同じです。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`lengthComparator` を使用することで、デフォルトの辞書順ではなく、長さによって文字列を並べ替えることができます。

`Comparator` を定義するより短い方法は、標準ライブラリの [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 関数を使用することです。`compareBy()` は、インスタンスから `Comparable` な値を生成するラムダ関数を受け取り、その生成された値の自然順序としてカスタム順序を定義します。

`compareBy()` を使用すると、上記の例の長さコンパレータは以下のようになります：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

複数の基準に基づいて順序を定義することもできます。
例えば、文字列を長さでソートし、長さが同じ場合はアルファベット順でソートするには、次のように記述できます：

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

複数の基準によるソートは一般的なシナリオであるため、Kotlin 標準ライブラリは、二次的なソート規則を追加するために使用できる [`.thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 関数を提供しています。

例えば、`compareBy()` と `.thenBy()` を組み合わせて、前の例と同じように文字列をまず長さでソートし、次にアルファベット順でソートすることができます：

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

Kotlin のコレクションパッケージには、自然順序、カスタム順序、さらにはランダムな順序でコレクションをソートするための関数が用意されています。
このページでは、[読み取り専用](collections-overview.md#collection-types)コレクションに適用されるソート関数について説明します。
これらの関数は、元のコレクションの要素を要求された順序で保持する新しいコレクションとして結果を返します。
[ミュータブル（変更可能）](collections-overview.md#collection-types)なコレクションをその場でソートする関数については、[リスト固有の操作](list-operations.md#sort)を参照してください。

## 自然順序

基本となる関数 [`.sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) および [`.sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) は、自然順序に従って昇順および降順にソートされたコレクションの要素を返します。
これらの関数は `Comparable` 要素のコレクションに適用されます。

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

カスタム順序でのソートや、比較可能ではないオブジェクトのソートには、[`.sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) および [`.sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 関数があります。
これらは、コレクションの要素を `Comparable` な値にマッピングするセレクター関数を受け取り、それらの値の自然順序でコレクションをソートします。

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

コレクションのソートにカスタム順序を定義するには、独自の `Comparator` を提供できます。
これを行うには、`Comparator` を渡して [`.sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 拡張関数を呼び出します。
この関数を使用して文字列を長さでソートすると、以下のようになります：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## ソート順のチェック

以下の拡張関数を使用して、要素がすでに指定された順序に従っているかどうかを確認できます：

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

これらの拡張関数は、要素が指定された順序である場合、または要素が 2 つ未満の場合に `true` を返します。
順序に沿わないペアが見つかると、すぐに `false` を返し、チェックを停止します。

`HashSet` のようにイテレーション（反復）の順序が保証されていないコレクションでは、呼び出しごとに結果が異なる場合があります。
同様のことが、一貫した順序で要素を生成しないシーケンスにも当てはまります。
呼び出し間で同じ結果を得るには、`List` などのイテレーション順序が保証されているコレクションに対してのみ、これらの関数を使用してください。

`Double` および `Float` の値をチェックする場合、これらの関数は `NaN` を他のどの値よりも大きく、`-0.0` を `0.0` よりも小さいものとして扱います。
さらに、`.isSortedBy()` および `.isSortedByDescending()` 関数は、セレクターの結果が `null` である場合を、非 `null` のどの値よりも小さいものとして扱います。

これらの関数をシーケンス（sequence）に対して呼び出す場合、その操作は「終端操作（terminal operation）」となります。
別のシーケンスを返すのではなく、シーケンスを消費して `Boolean` 値を生成します。

> これらのソート順チェック関数は、配列（arrays）、プリミティブ配列（primitive arrays）、および符号なし配列（unsigned arrays）でも利用可能です。
> 符号なし配列とその操作は[実験的（Experimental）](components-stability.md#stability-levels-explained)であり、`@ExperimentalUnsignedTypes` アノテーションによるオプトインが必要です。
> 
{style="note"}

以下は、`.isSorted()` および `.isSortedBy()` 関数を使用してソート順をチェックする例です：

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false

    val descending = listOf(4, 3, 2, 1)
    println(descending.isSortedDescending())
    // true
   
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

## 逆順

[`.reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 関数を使用すると、コレクションを逆順で取得できます。 

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`.reversed()` 拡張関数は、要素のコピーを含む新しいコレクションを返します。
そのため、後で元のコレクションを変更しても、以前に取得した `.reversed()` の結果には影響しません。

もう一つの逆転関数である [`.asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) は、同じコレクションインスタンスの逆順の「ビュー（view）」を返します。そのため、元のリストが変更されない予定であれば、`.reversed()` よりも軽量で好ましい場合があります。

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

元のリストがミュータブルな場合、そのすべての変更が逆順ビューに反映され、その逆も同様です。

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

ただし、リストの可変性が不明な場合や、ソースがリストでない場合は、結果が将来変更されないコピーである `.reversed()` の方が好ましいです。

## ランダム順

最後に、コレクションの要素をランダムな順序で含む新しい `List` を返す関数 [`.shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html) があります。
引数なしで呼び出すか、[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) オブジェクトを指定して呼び出すことができます。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}