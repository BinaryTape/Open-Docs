---
title: コレクションの概要
---
Kotlin標準ライブラリは、解決すべき問題にとって重要で、一般的に操作される変数の数の項目（ゼロの場合もある）の_コレクション_を管理するための包括的なツールセットを提供します。

コレクションはほとんどのプログラミング言語で共通の概念なので、たとえばJavaやPythonのコレクションに精通している場合は、この入門をスキップして詳細なセクションに進むことができます。

コレクションには通常、同じ型（およびそのサブタイプ）のオブジェクトが多数含まれています。コレクション内のオブジェクトは、_要素_(element)または_項目_(item)と呼ばれます。たとえば、学科のすべての学生は、平均年齢を計算するために使用できるコレクションを形成します。

Kotlinでは、次のコレクション型が重要です。

* _List_(リスト)は、インデックス（位置を反映する整数）による要素へのアクセスが可能な順序付きコレクションです。要素はリスト内で複数回出現する可能性があります。リストの例としては、電話番号があります。電話番号は数字のグループであり、順序が重要で、繰り返すことができます。
* _Set_(セット)は、一意の要素のコレクションです。これは、繰り返しのないオブジェクトのグループである集合の数学的抽象化を反映しています。一般に、セット要素の順序は重要ではありません。たとえば、宝くじのチケットの数字はセットを形成します。それらは一意であり、順序は重要ではありません。
* _Map_(マップ)（または_dictionary_(辞書)）は、キーと値のペアのセットです。キーは一意であり、それぞれが正確に1つの値にマップされます。値は重複する可能性があります。マップは、オブジェクト間の論理的なつながりを格納するのに役立ちます。たとえば、従業員のIDとその役職などです。

Kotlinでは、コレクションに格納されているオブジェクトの正確な型に関係なく、コレクションを操作できます。つまり、`String`のリストに`String`を追加するのと同じように、`Int`またはユーザー定義のクラスを追加できます。したがって、Kotlin標準ライブラリは、任意の型のコレクションを作成、設定、および管理するための汎用インターフェース、クラス、および関数を提供します。

コレクションのインターフェースと関連する関数は、`kotlin.collections`パッケージにあります。その内容の概要を見てみましょう。

:::note
配列はコレクションの型ではありません。詳細については、[配列](arrays)を参照してください。

:::

## コレクション型

Kotlin標準ライブラリは、基本的なコレクション型（セット、リスト、マップ）の実装を提供します。各コレクション型は、一対のインターフェースで表されます。

* コレクション要素へのアクセス操作を提供する_読み取り専用_(read-only)インターフェース。
* 対応する読み取り専用インターフェースを、要素の追加、削除、更新などの書き込み操作で拡張する_変更可能_(mutable)インターフェース。

変更可能なコレクションは、[`var`](basic-syntax#variables)に割り当てる必要はないことに注意してください。変更可能なコレクションに対する書き込み操作は、`val`に割り当てられている場合でも可能です。変更可能なコレクションを`val`に割り当てる利点は、変更可能なコレクションへの参照が変更から保護されることです。コードが成長して複雑になるにつれて、参照への意図しない変更を防ぐことがさらに重要になります。より安全で堅牢なコードのために、できるだけ`val`を使用してください。`val`コレクションを再割り当てしようとすると、コンパイルエラーが発生します。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error

}
```

読み取り専用のコレクション型は[共変](generics#variance)です。
これは、`Rectangle`クラスが`Shape`から継承されている場合、`List<Shape>`が必要な場所で`List<Rectangle>`を使用できることを意味します。
つまり、コレクション型は要素型と同じサブタイプ関係を持ちます。マップは値の型では共変ですが、キーの型では共変ではありません。

一方、変更可能なコレクションは共変ではありません。そうしないと、ランタイムエラーが発生する可能性があります。`MutableList<Rectangle>`が`MutableList<Shape>`のサブタイプである場合、他の`Shape`の継承（たとえば、`Circle`）を挿入して、その`Rectangle`型引数に違反する可能性があります。

以下は、Kotlinコレクションインターフェースの図です。

<img src="/img/collections-diagram.png" alt="Collection interfaces hierarchy" width="500" style={{verticalAlign: 'middle'}}/>

インターフェースとその実装を見ていきましょう。`Collection`の詳細については、以下のセクションをお読みください。`List`、`Set`、および`Map`の詳細については、対応するセクションを読むか、Kotlin Developer AdvocateであるSebastian Aignerによるビデオをご覧ください。

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)は、コレクション階層のルートです。このインターフェースは、読み取り専用コレクションの共通の動作（サイズの取得、項目のメンバーシップの確認など）を表します。
`Collection`は、要素を反復処理するための操作を定義する`Iterable<T>`インターフェースから継承されます。さまざまなコレクション型に適用される関数のパラメータとして`Collection`を使用できます。より具体的なケースでは、`Collection`の継承元である[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)と[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)を使用します。

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

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)は、要素を指定された順序で格納し、それらへのインデックス付きアクセスを提供します。インデックスはゼロから始まり（最初の要素のインデックス）、`(list.size - 1)`である`lastIndex`まで続きます。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")

}
```

リスト要素（nullを含む）は重複する可能性があります。リストには、同じオブジェクトまたは単一のオブジェクトの出現を任意の数だけ含めることができます。
2つのリストは、サイズが同じで、同じ位置に[構造的に等しい](equality#structural-equality)要素がある場合、等しいと見なされます。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {

    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)

}
```

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)は、リスト固有の書き込み操作（たとえば、特定の要素を追加または削除するなど）を持つ`List`です。

```kotlin
fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)

}
```

ご覧のとおり、リストはいくつかの点で配列と非常によく似ています。
ただし、1つの重要な違いがあります。配列のサイズは初期化時に定義され、変更されることはありません。一方、リストには事前定義されたサイズがありません。リストのサイズは、要素の追加、更新、または削除などの書き込み操作の結果として変更できます。

Kotlinでは、`MutableList`のデフォルトの実装は[`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)です。これは、サイズ変更可能な配列と考えることができます。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)は一意の要素を格納します。それらの順序は一般に未定義です。`null`要素も一意です。`Set`には`null`を1つだけ含めることができます。
2つのセットは、サイズが同じで、セットの各要素に対して、他のセットに等しい要素がある場合、等しいと言えます。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")

}
```

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)は、`MutableCollection`からの書き込み操作を持つ`Set`です。

`MutableSet`のデフォルトの実装である[`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)は、要素の挿入順序を保持します。
したがって、`first()`や`last()`など、順序に依存する関数は、そのようなセットで予測可能な結果を返します。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())

}
```

代替実装である[`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)は、要素の順序については何も言いません。したがって、そのような関数を呼び出すと、予測できない結果が返されます。ただし、`HashSet`は、同じ数の要素を格納するために必要なメモリが少なくなります。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)は、`Collection`インターフェースの継承元ではありません。ただし、Kotlinのコレクション型でもあります。
`Map`は、_キーと値_(key-value)のペア（または_エントリ_(entry)）を格納します。キーは一意ですが、異なるキーを等しい値とペアにすることができます。
`Map`インターフェースは、キーによる値へのアクセス、キーと値の検索など、特定の関数を提供します。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous

}
```

等しいペアを含む2つのマップは、ペアの順序に関係なく等しくなります。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")

}
```

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)は、マップの書き込み操作を持つ`Map`です。たとえば、新しいキーと値のペアを追加したり、指定されたキーに関連付けられた値を更新したりできます。

```kotlin
fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)

}
```

`MutableMap`のデフォルトの実装である[`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)は、マップを反復処理するときに要素の挿入順序を保持します。
一方、代替実装である[`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)は、要素の順序については何も言いません。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)は、二重終端キューの実装であり、キューの先頭または末尾の両方で要素を追加または削除できます。
そのため、`ArrayDeque`は、Kotlinのスタックおよびキューのデータ構造の両方の役割も果たします。内部的には、`ArrayDeque`は、必要に応じてサイズを自動的に調整するサイズ変更可能な配列を使用して実現されます。

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