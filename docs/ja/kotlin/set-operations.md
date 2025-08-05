[//]: # (title: Setにおける操作)

Kotlinのコレクションパッケージには、セットにおける一般的な操作、すなわち交差の検出、マージ、コレクション間の差分を見つけるための拡張関数が含まれています。

2つのコレクションを1つにマージするには、[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html)関数を使用します。これは中置形式`a union b`で記述できます。
順序付けられたコレクションの場合、オペランドの順序が重要であることに注意してください。結果のコレクションでは、最初のオペランドの要素が2番目の要素の前に来ます。

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

2つのコレクション間の交差（両方に存在する要素）を見つけるには、[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html)関数を使用します。
別のコレクションに存在しないコレクション要素を見つけるには、[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html)関数を使用します。
これらの関数はどちらも中置形式で呼び出すことができます。例えば、`a intersect b`のように記述します。

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

2つのコレクションのいずれか一方には存在するが、その交差部分には存在しない要素を見つけるには、`union()`関数を使用することもできます。
この操作（対象差として知られています）の場合、2つのコレクション間の差分を計算し、その結果をマージします。

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

`union()`、`intersect()`、`subtract()`関数はリストにも適用できます。
ただし、それらの結果は_常に_ `Set` となります。この結果では、すべての重複要素は1つにマージされ、インデックスによるアクセスは利用できません。

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