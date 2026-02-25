[//]: # (title: Set固有の操作)

Kotlinのコレクションパッケージには、積集合（intersection）の取得、マージ、またはコレクション同士の差集合（subtraction）の算出といった、Set（集合）でよく使われる操作のための拡張関数が含まれています。

2つのコレクションを1つにマージするには、[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 関数を使用します。これは中置形式（infix form）の `a union b` としても使用できます。
順序のあるコレクションの場合、オペランド（被演算子）の順序が重要になることに注意してください。結果のコレクションでは、最初のオペランドの要素が2番目のオペランドの要素よりも前に配置されます。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 順序に従って出力される
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

2つのコレクション間の積集合（両方に存在する要素）を見つけるには、[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 関数を使用します。
別のコレクションに存在しないコレクション要素を見つけるには、[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 関数を使用します。
これらの関数はどちらも、例えば `a intersect b` のように中置形式で呼び出すことも可能です。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 同じ出力
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

2つのコレクションのいずれかに存在するが、その積集合には含まれない要素を見つけるために、`union()` 関数を使用することもできます。
この操作（対称差（symmetric difference）として知られています）を行うには、2つのコレクション間の差をそれぞれ計算し、その結果をマージします。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // 差集合をマージする
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`union()`、`intersect()`、および `subtract()` 関数はリストに対しても適用できます。
ただし、その結果は*常に* `Set` になります。この結果では、重複するすべての要素は1つにまとめられ、インデックスによるアクセスは利用できなくなります。

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // 2つのリストの積集合の結果は Set になる
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // 同一の要素は1つにまとめられる
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}