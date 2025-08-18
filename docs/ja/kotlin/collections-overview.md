[//]: # (title: コレクションの概要)

Kotlin標準ライブラリは、_コレクション_を管理するための包括的なツールセットを提供します。コレクションとは、解決される問題にとって重要であり、一般的に操作される可変数の項目（ゼロの場合もあります）のグループです。

コレクションはほとんどのプログラミング言語にとって一般的な概念であるため、例えばJavaやPythonのコレクションに慣れている場合は、この序論をスキップして詳細なセクションに進むことができます。

コレクションには通常、同じ型（およびそのサブタイプ）のオブジェクトが多数含まれます。コレクション内のオブジェクトは_要素_または_項目_と呼ばれます。例えば、ある学科の全学生は、平均年齢を計算するために使用できるコレクションを形成します。

以下のコレクション型がKotlinに関連しています。

*   _リスト_は、順序付けられたコレクションであり、要素の位置を反映する整数であるインデックスによって要素にアクセスできます。要素はリスト内で複数回出現することができます。リストの例としては電話番号があります。これは数字のグループであり、その順序が重要で、繰り返すことができます。
*   _セット_は、ユニークな要素のコレクションです。これは、繰り返しがないオブジェクトのグループという数学的な集合の抽象化を反映しています。通常、セット要素の順序は意味を持ちません。例えば、宝くじの数字はセットを形成します。それらはユニークであり、順序は重要ではありません。
*   _マップ_（または_辞書_）は、キーと値のペアのセットです。キーはユニークであり、それぞれのキーが正確に1つの値にマッピングされます。値は重複可能です。マップは、オブジェクト間の論理的な接続を格納するのに便利です。例えば、従業員のIDとその役職などです。

Kotlinでは、格納されているオブジェクトの正確な型に関係なく、コレクションを操作できます。言い換えれば、`String`のリストに`String`を追加する方法は、`Int`やユーザー定義クラスの場合と同じです。
そのため、Kotlin標準ライブラリは、あらゆる型のコレクションを作成、投入、および管理するためのジェネリックなインターフェース、クラス、および関数を提供します。

コレクションインターフェースと関連関数は、`kotlin.collections`パッケージにあります。その内容の概要を見てみましょう。

> 配列はコレクションの一種ではありません。詳細については、[配列](arrays.md)を参照してください。
>
{style="note"}

## コレクション型

Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供します。
各コレクション型は一対のインターフェースで表されます。

*   コレクション要素にアクセスするための操作を提供する_読み取り専用_インターフェース。
*   対応する読み取り専用インターフェースを書き込み操作（要素の追加、削除、更新）で拡張する_可変_インターフェース。

なお、可変コレクションは[`var`](basic-syntax.md#variables)に割り当てる必要はありません。可変コレクションが`val`に割り当てられていても、書き込み操作は可能です。可変コレクションを`val`に割り当てる利点は、可変コレクションへの参照が変更されるのを防ぐことができる点です。時間と共にコードが成長し複雑になるにつれて、意図しない参照の変更を防ぐことはさらに重要になります。より安全で堅牢なコードのために、可能な限り`val`を使用してください。`val`コレクションを再割り当てしようとすると、コンパイルエラーになります。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

読み取り専用のコレクション型は[共変](generics.md#variance)です。
これはつまり、`Rectangle`クラスが`Shape`から継承している場合、`List<Shape>`が必要な場所であればどこでも`List<Rectangle>`を使用できるということです。
言い換えれば、コレクション型は要素型と同じサブタイピング関係を持ちます。マップは値型に対しては共変ですが、キー型に対してはそうではありません。

一方、可変コレクションは共変ではありません。そうでなければ、ランタイムエラーにつながるでしょう。もし`MutableList<Rectangle>`が`MutableList<Shape>`のサブタイプであった場合、他の`Shape`の継承者（例えば`Circle`）を挿入することができ、その`Rectangle`型引数を侵害することになります。

以下はKotlinのコレクションインターフェースの図です。

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

インターフェースとその実装を見ていきましょう。`Collection`について学ぶには、以下のセクションを読んでください。`List`、`Set`、`Map`について学ぶには、対応するセクションを読むか、Kotlin Developer AdvocateのSebastian Aignerによるビデオを視聴することもできます。

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)はコレクション階層のルートです。このインターフェースは、読み取り専用コレクションの共通の振る舞い（サイズの取得、項目のメンバーシップの確認など）を表します。
`Collection`は、要素をイテレートするための操作を定義する`Iterable<T>`インターフェースを継承しています。`Collection`は、異なるコレクション型に適用される関数のパラメータとして使用できます。より具体的なケースでは、`Collection`の継承者である[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)と[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)を使用します。

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

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)は、`add`や`remove`などの書き込み操作を持つ`Collection`です。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
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

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)は、要素を指定された順序で格納し、それらへのインデックスアクセスを提供します。インデックスはゼロ（最初の要素のインデックス）から始まり、`list.size - 1`である`lastIndex`まで続きます。

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

リスト要素（nullを含む）は重複可能です。リストには、等しいオブジェクトがいくつでも、または単一のオブジェクトが複数回出現することができます。
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

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)は、リスト固有の書き込み操作を持つ`List`です。例えば、特定の位置に要素を追加または削除するなどです。

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

ご覧のとおり、いくつかの点でリストは配列と非常によく似ています。
ただし、1つの重要な違いがあります。配列のサイズは初期化時に定義され、変更されることはありません。一方、リストには事前に定義されたサイズがありません。リストのサイズは、要素の追加、更新、削除などの書き込み操作の結果として変更できます。

Kotlinでは、`MutableList`のデフォルト実装は[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)であり、リサイズ可能な配列と考えることができます。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)はユニークな要素を格納します。要素の順序は通常未定義です。`null`要素もユニークです。`Set`は1つの`null`しか含めることができません。2つのセットは、同じサイズであり、一方のセットの各要素に対して他方のセットに等しい要素がある場合に等しいと見なされます。

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

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)は、`MutableCollection`からの書き込み操作を持つ`Set`です。

`MutableSet`のデフォルト実装である[`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)は、要素の挿入順序を保持します。
そのため、`first()`や`last()`など、順序に依存する関数は、そのようなセットに対して予測可能な結果を返します。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

代替の実装である[`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)は要素の順序については何も言及していないため、そのような関数を呼び出すと予測不可能な結果が返されます。ただし、`HashSet`は同じ数の要素を格納するためにより少ないメモリを必要とします。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)は`Collection`インターフェースの継承者ではありませんが、これもKotlinのコレクション型です。
`Map`は_キーと値_のペア（または_エントリ_）を格納します。キーはユニークですが、異なるキーが同じ値とペアになることがあります。`Map`インターフェースは、キーによる値へのアクセス、キーと値の検索など、特定の機能を提供します。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous
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

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)は、マップの書き込み操作を持つ`Map`です。例えば、新しいキーと値のペアを追加したり、指定されたキーに関連付けられた値を更新したりできます。

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

`MutableMap`のデフォルト実装である[`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)は、マップをイテレートする際に要素の挿入順序を保持します。
一方、代替の実装である[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)は要素の順序については何も言及していません。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)は両端キューの実装であり、キューの先頭または末尾の両方で要素を追加または削除できます。
そのため、`ArrayDeque`はKotlinにおいて、スタックとキューの両方のデータ構造としての役割も果たします。内部的には、`ArrayDeque`は必要に応じてサイズが自動的に調整される可変サイズ配列を使用して実現されています。

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