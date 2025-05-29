[//]: # (title: セット固有の操作)

Kotlinのコレクションパッケージには、セットに対するよく使われる操作（積集合の検索、結合、コレクション間の減算など）のための拡張関数が含まれています。

2つのコレクションを1つに結合するには、[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 関数を使用します。この関数は、`a union b` の中置記法で使用できます。
順序付けられたコレクションの場合、オペランドの順序が重要であることに注意してください。結果のコレクションでは、最初のオペランドの要素が2番目の要素の前に配置されます。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

2つのコレクション間の積集合（両方に存在する要素）を見つけるには、[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 関数を使用します。
あるコレクションには存在するが別のコレクションには存在しない要素を見つけるには、[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 関数を使用します。
これら両方の関数は、例えば `a intersect b` のように中置記法で呼び出すこともできます。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

2つのコレクションのいずれかには存在するが、それらの積集合には存在しない要素を見つけるには、`union()` 関数を使用することもできます。
この操作（対象差として知られています）では、2つのコレクション間の差を計算し、その結果を結合します。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`union()`、`intersect()`、`subtract()` 関数はリストにも適用できます。
ただし、その結果は_常に_ `Set` になります。この結果では、すべての重複要素が1つに結合され、インデックスアクセスは利用できません。

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}