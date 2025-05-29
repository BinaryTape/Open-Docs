[//]: # (title: コレクションの概要)

Kotlin標準ライブラリは、**コレクション**（解決しようとしている問題にとって重要であり、一般的に操作される可変個の項目（ゼロ個の場合もある）のグループ）を管理するための包括的なツールセットを提供します。

コレクションはほとんどのプログラミング言語にとって共通の概念であるため、たとえばJavaやPythonのコレクションに慣れている場合は、この導入をスキップして詳細なセクションに進むことができます。

コレクションには通常、同じ型（およびそのサブタイプ）の複数のオブジェクトが含まれます。コレクション内のオブジェクトは**要素 (elements)** または**項目 (items)** と呼ばれます。たとえば、ある学科のすべての学生はコレクションを形成し、それを使用して平均年齢を計算できます。

Kotlinには以下のコレクション型が関連します。

*   **_List_ (リスト)** は、要素の順序を示す整数値であるインデックスによって要素にアクセスできる、順序付けられたコレクションです。要素はリスト内で複数回出現する可能性があります。リストの例としては電話番号があります。これは数字のグループであり、その順序が重要で、繰り返し可能です。
*   **_Set_ (セット)** は、一意な要素のコレクションです。これは集合の数学的抽象化を反映しており、重複のないオブジェクトのグループです。通常、セットの要素の順序は重要ではありません。たとえば、宝くじの数字はセットを形成します。それらは一意であり、順序は重要ではありません。
*   **_Map_ (マップ)** （または**_辞書 (dictionary)_**）は、キーと値のペアのセットです。キーは一意であり、それぞれが正確に1つの値にマッピングされます。値は重複する可能性があります。Mapは、たとえば従業員のIDとその役職など、オブジェクト間の論理的なつながりを保存するのに役立ちます。

Kotlinでは、格納されるオブジェクトの正確な型に依存せずにコレクションを操作できます。言い換えれば、`String`のリストに`String`を追加する方法は、`Int`やユーザー定義クラスを追加する方法と同じです。
したがって、Kotlin標準ライブラリは、任意の型のコレクションを作成、投入、管理するためのジェネリックインターフェース、クラス、および関数を提供します。

コレクションのインターフェースと関連する関数は、`kotlin.collections`パッケージにあります。その内容の概要を見ていきましょう。

> 配列はコレクションの型ではありません。詳細については、[配列](arrays.md)を参照してください。
>
{style="note"}

## コレクションの型

Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供します。
各コレクション型は2つのインターフェースで表現されます。

*   コレクション要素にアクセスするための操作を提供する**_読み取り専用_**インターフェース。
*   対応する読み取り専用インターフェースを書き込み操作（要素の追加、削除、更新など）で拡張する**_可変_**インターフェース。

可変コレクションが`var`に割り当てられている必要はないことに注意してください。可変コレクションが`val`に割り当てられている場合でも、書き込み操作は可能です。可変コレクションを`val`に割り当てる利点は、可変コレクションへの参照が変更されるのを防ぐことができる点です。時間が経ち、コードが成長し複雑になるにつれて、意図しない参照の変更を防ぐことがさらに重要になります。より安全で堅牢なコードのために、可能な限り`val`を使用してください。`val`コレクションを再割り当てしようとすると、コンパイルエラーが発生します。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // これはOKです
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // コンパイルエラー
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

読み取り専用コレクション型は[共変](generics.md#variance)です。
これは、`Rectangle`クラスが`Shape`を継承している場合、`List<Shape>`が必要な場所であればどこでも`List<Rectangle>`を使用できることを意味します。
言い換えれば、コレクション型は要素の型と同じサブタイプ関係を持っています。Mapは値の型では共変ですが、キーの型では共変ではありません。

一方、可変コレクションは共変ではありません。もしそうであった場合、ランタイムエラーにつながる可能性があります。`MutableList<Rectangle>`が`MutableList<Shape>`のサブタイプであった場合、他の`Shape`の継承者（例えば`Circle`）を挿入できてしまい、`Rectangle`という型引数を侵害してしまいます。

以下はKotlinコレクションインターフェースの図です。

![コレクションインターフェースの階層](collections-diagram.png){width="500"}

インターフェースとその実装について見ていきましょう。`Collection`について学ぶには、以下のセクションを読んでください。`List`、`Set`、および`Map`について学ぶには、対応するセクションを読むか、KotlinデベロッパーアドボケイトであるSebastian Aigner氏のビデオをご覧ください。

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)は、コレクション階層のルートです。このインターフェースは、読み取り専用コレクションの共通の振る舞い（サイズ取得、項目メンバーシップの確認など）を表します。
`Collection`は、要素を反復処理するための操作を定義している`Iterable<T>`インターフェースを継承しています。`Collection`は、異なるコレクション型に適用される関数のパラメーターとして使用できます。より具体的なケースでは、`Collection`の継承者である[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)と[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)を使用してください。

```kotlin
fun printAll(strings: Collection<String>) {
    for(s in strings) print("$s ")
    println()
}
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)は、`add`や`remove`のような書き込み操作が可能な`Collection`です。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 冠詞を捨てる
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)は、要素を指定された順序で格納し、インデックスによるアクセスを提供します。インデックスはゼロ（最初の要素のインデックス）から始まり、最後の要素のインデックスである`lastIndex`（`list.size - 1`）までです。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

リストの要素（`null`を含む）は重複可能です。リストは任意の数の等しいオブジェクトまたは単一オブジェクトの出現を含むことができます。
2つのリストは、同じサイズで、同じ位置に[構造的に等しい](equality.md#structural-equality)要素がある場合に等しいと見なされます。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)は、特定の場所に要素を追加または削除するなど、リスト固有の書き込み操作が可能な`List`です。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ご覧のとおり、いくつかの点でリストは配列と非常に似ています。
ただし、重要な違いが1つあります。配列のサイズは初期化時に定義され、変更されることはありません。一方、リストには事前に定義されたサイズはありません。リストのサイズは、要素の追加、更新、削除といった書き込み操作の結果として変更できます。

Kotlinでは、`MutableList`のデフォルト実装は、リサイズ可能な配列と考えることができる[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)です。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)は、一意な要素を格納します。その順序は通常、未定義です。`null`要素も一意です。`Set`は1つの`null`のみを含むことができます。2つのセットは、同じサイズで、一方のセットの各要素に対してもう一方のセットに等しい要素がある場合に等しいと見なされます。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)は、`MutableCollection`からの書き込み操作が可能な`Set`です。

`MutableSet`のデフォルト実装である[`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)は、要素の挿入順序を保持します。
そのため、`first()`や`last()`など、順序に依存する関数は、そのようなセットでは予測可能な結果を返します。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSetがデフォルト実装です
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

代替実装である[`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)は、要素の順序について何も保証しません。そのため、そのような関数を呼び出すと予測不能な結果が返されます。ただし、`HashSet`は同じ数の要素を格納するためにより少ないメモリを必要とします。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)は`Collection`インターフェースの継承者ではありませんが、Kotlinのコレクション型の一つです。
`Map`は**_キーと値のペア_**（または**_エントリ_**）を格納します。キーは一意ですが、異なるキーが等しい値とペアになることがあります。`Map`インターフェースは、キーによる値へのアクセス、キーと値の検索など、特定の関数を提供します。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 上と同じ
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

等しいペアを含む2つのマップは、ペアの順序に関係なく等しいと見なされます。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)は、新しいキーと値のペアを追加したり、指定されたキーに関連付けられた値を更新したりするなど、Mapの書き込み操作が可能な`Map`です。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`MutableMap`のデフォルト実装である[`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)は、マップを反復処理する際に要素の挿入順序を保持します。
一方、代替実装である[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)は、要素の順序について何も保証しません。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)は両端キューの実装であり、キューの先頭または末尾の両方で要素を追加または削除できます。
そのため、`ArrayDeque`はKotlinにおけるスタック (Stack) およびキュー (Queue) データ構造の両方の役割も果たします。内部的には、`ArrayDeque`は必要に応じて自動的にサイズを調整するリサイズ可能な配列を使用して実装されています。

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}