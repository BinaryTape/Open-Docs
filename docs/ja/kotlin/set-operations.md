---
title: セット固有の操作
---
Kotlinの collections パッケージには、集合に対する一般的な操作（積集合の検索、結合、コレクション同士の差分など）のための拡張関数が含まれています。

2つのコレクションを1つに結合するには、[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 関数を使用します。
これは、infix 形式 `a union b` で使用できます。
順序付けられたコレクションでは、オペランドの順序が重要であることに注意してください。結果のコレクションでは、最初のオペランドの要素が2番目のオペランドの要素の前に配置されます。

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]

}
```

2つのコレクションの積集合（両方に存在する要素）を見つけるには、[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 関数を使用します。
別のコレクションに存在しないコレクション要素を見つけるには、[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 関数を使用します。
これらの関数はどちらも、infix 形式（例：`a intersect b`）で呼び出すことができます。

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]

}
```

2つのコレクションのいずれかに存在するが、それらの積集合には存在しない要素を見つけるには、`union()` 関数を使用することもできます。
この操作（対称差として知られています）では、2つのコレクション間の差を計算し、結果を結合します。

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]

}
```

`union()`、`intersect()`、および `subtract()` 関数をリストに適用することもできます。
ただし、それらの結果は_常に_ `Set` です。この結果では、すべての重複要素が1つにマージされ、インデックスアクセスは利用できません。

```kotlin
fun main() {

    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]

}
```