---
title: コレクションのフィルタリング
---
コレクション処理で最も一般的なタスクの 1 つに、フィルタリングがあります。
Kotlin では、フィルタリングの条件は _predicate（述語）_ によって定義されます。これは、コレクションの要素を受け取り、
ブール値を返すラムダ関数です。`true` は、指定された要素が predicate（述語）に一致することを意味し、`false` はその逆を意味します。

標準ライブラリには、1 回の呼び出しでコレクションをフィルタリングできる拡張関数群が含まれています。
これらの関数は元のコレクションを変更しないため、[mutable（可変）と read-only（読み取り専用）](collections-overview#collection-types)
コレクションの両方で使用できます。フィルタリング結果を操作するには、変数に代入するか、フィルタリング後に一連の関数をチェーンする必要があります。

## predicate（述語）によるフィルタリング

基本的なフィルタリング関数は [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) です。
predicate（述語）を指定して呼び出すと、`filter()` はそれに一致するコレクション要素を返します。
`List` と `Set` の場合、結果のコレクションは `List` であり、`Map` の場合は `Map` でもあります。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

`filter()` の predicate（述語）は、要素の値のみをチェックできます。
フィルタで要素の位置を使用する場合は、[`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html) を使用します。
これは、インデックスと要素の値の 2 つの引数を持つ predicate（述語）を受け取ります。

否定条件でコレクションをフィルタリングするには、[`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html) を使用します。
これは、predicate（述語）が `false` を生成する要素のリストを返します。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s `->` (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)

}
```

指定された型の要素をフィルタリングして要素の型を絞り込む関数もあります。

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) は、
    指定された型のコレクション要素を返します。`List<Any>` で呼び出されると、`filterIsInstance<T>()` は `List<T>` を返すため、
    その項目に対して `T` 型の関数を呼び出すことができます。

    ```kotlin
    fun main() {

        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }

    }
    ```
    

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) は、すべての
    non-nullable（非 null 許容）要素を返します。`List<T?>` で呼び出されると、`filterNotNull()` は `List<T: Any>` を返すため、
    要素を non-nullable（非 null 許容）オブジェクトとして扱うことができます。

    ```kotlin
    fun main() {

        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length is unavailable for nullable Strings
        }

    }
    ```
    

## Partition（分割）

別のフィルタリング関数である [`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)
は、predicate（述語）でコレクションをフィルタリングし、一致しない要素を別のリストに保持します。
したがって、`List` の `Pair` が戻り値として得られます。最初のリストには predicate（述語）に一致する要素が含まれ、
2 番目のリストには元のコレクションのその他すべての要素が含まれます。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)

}
```

## Test predicates（述語のテスト）

最後に、コレクション要素に対して predicate（述語）を単純にテストする関数があります。

* [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) は、少なくとも 1 つの要素が指定された predicate（述語）に一致する場合に `true` を返します。
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) は、どの要素も指定された predicate（述語）に一致しない場合に `true` を返します。
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) は、すべての要素が指定された predicate（述語）に一致する場合に `true` を返します。
    `all()` は、空のコレクションに対して有効な predicate（述語）で呼び出されると `true` を返すことに注意してください。このような動作は、論理学では _[vacuous truth（空虚な真実）](https://en.wikipedia.org/wiki/Vacuous_truth)_ として知られています。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth

}
```

`any()` と `none()` は、predicate（述語）なしで使用することもできます。この場合、コレクションが空かどうかをチェックするだけです。
`any()` は要素がある場合は `true` を返し、ない場合は `false` を返します。`none()` はその逆を行います。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())

}
```