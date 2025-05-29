[//]: # (title: コレクションのフィルタリング)

フィルタリングは、コレクション処理において最も一般的なタスクの1つです。
Kotlinでは、フィルタリング条件は_述語_（コレクション要素を受け取り、真偽値を返すラムダ関数）によって定義されます。`true`は与えられた要素が述語に一致することを意味し、`false`はその逆を意味します。

標準ライブラリには、1回の呼び出しでコレクションをフィルタリングできる一連の拡張関数が含まれています。
これらの関数は元のコレクションを変更しないため、[可変コレクションと読み取り専用コレクション](collections-overview.md#collection-types)の両方で利用できます。フィルタリング結果を操作するには、変数に代入するか、フィルタリング後にそれらの関数を連結する必要があります。

## 述語によるフィルタリング

基本的なフィルタリング関数は[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)です。
述語を指定して呼び出された場合、`filter()`はそれに一致するコレクション要素を返します。
`List`と`Set`の両方の場合、結果のコレクションは`List`になり、`Map`の場合は`Map`になります。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`filter()`の述語は、要素の値のみをチェックできます。
フィルタで要素の位置を使用したい場合は、[`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)を使用します。
これは、インデックスと要素の値という2つの引数を持つ述語を受け取ります。

否定条件でコレクションをフィルタリングするには、[`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)を使用します。
これは、述語が`false`を返す要素のリストを返します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

指定された型の要素をフィルタリングすることで、要素の型を絞り込む関数もあります。

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)は指定された型のコレクション要素を返します。
    `List<Any>`に対して呼び出された場合、`filterIsInstance<T>()`は`List<T>`を返すため、その項目に対して`T`型の関数を呼び出すことができます。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html)はすべてのnull非許容要素を返します。
    `List<T?>`に対して呼び出された場合、`filterNotNull()`は`List<T: Any>`を返すため、要素をnull非許容オブジェクトとして扱えるようになります。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length is unavailable for nullable Strings
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## パーティション

別のフィルタリング関数である[`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)は、述語でコレクションをフィルタリングし、一致しない要素を別のリストに保持します。
したがって、戻り値として`List`の`Pair`が得られます。最初のリストには述語に一致する要素が含まれ、2番目のリストには元のコレクションの他のすべての要素が含まれます。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 述語のテスト

最後に、述語をコレクション要素に対して単純にテストする関数があります。

* [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html)は、少なくとも1つの要素が与えられた述語に一致する場合に`true`を返します。
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html)は、どの要素も与えられた述語に一致しない場合に`true`を返します。
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html)は、すべての要素が与えられた述語に一致する場合に`true`を返します。
    空のコレクションに対して有効な述語を指定して呼び出された場合、`all()`は`true`を返すことに注意してください。このような動作は論理学では_[空虚な真](https://ja.wikipedia.org/wiki/%E7%A9%BA%E8%99%9A%E3%81%AA%E7%9C%9F)_(vacuous truth)として知られています。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()`と`none()`は述語なしでも使用できます。この場合、それらはコレクションが空であるかどうかのチェックのみを行います。
`any()`は要素がある場合は`true`を、ない場合は`false`を返します。`none()`はその逆を行います。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}