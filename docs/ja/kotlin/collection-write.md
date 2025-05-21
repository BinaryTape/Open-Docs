---
title: Collection書き込み操作
---
[Mutable collections](collections-overview#collection-types) は、コレクションの内容を変更する操作（要素の追加や削除など）をサポートしています。
このページでは、`MutableCollection` のすべての実装で使用できる書き込み操作について説明します。
`List` および `Map` で使用できるより具体的な操作については、それぞれ [List-specific Operations](list-operations) および [Map Specific Operations](map-operations) を参照してください。

## 要素の追加

リストまたはセットに単一の要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 関数を使用します。指定されたオブジェクトは、コレクションの末尾に追加されます。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)

}
```

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) は、引数オブジェクトのすべての要素をリストまたはセットに追加します。引数には、`Iterable`、`Sequence`、または `Array` を指定できます。
レシーバーと引数の型は異なっていても構いません。たとえば、`Set` から `List` にすべての項目を追加できます。

リストに対して呼び出された場合、`addAll()` は引数内の順序と同じ順序で新しい要素を追加します。
また、要素の位置を最初の引数として指定して `addAll()` を呼び出すこともできます。
引数コレクションの最初の要素は、この位置に挿入されます。
引数コレクションの他の要素はそれに続き、レシーバー要素を末尾にシフトします。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)

}
```

[`plus` operator](collection-plus-minus) のインプレースバージョンである [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) を使用して要素を追加することもできます。
ミュータブルコレクションに適用すると、`+=` は 2 番目のオペランド（要素または別のコレクション）をコレクションの末尾に追加します。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)

}
```

## 要素の削除

ミュータブルコレクションから要素を削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 関数を使用します。
`remove()` は要素の値を受け取り、この値の最初に見つかったものを削除します。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)

}
```

複数の要素を一度に削除するには、次の関数があります。

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) は、引数コレクションに存在するすべての要素を削除します。
   または、引数として述語を指定して呼び出すこともできます。この場合、関数は述語が `true` を生成するすべての要素を削除します。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) は `removeAll()` の反対です。引数コレクションからの要素を除くすべての要素を削除します。
   述語とともに使用すると、それに一致する要素のみが残ります。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) は、リストからすべての要素を削除し、空にします。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)

}
```

コレクションから要素を削除するもう 1 つの方法は、[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子（[`minus`](collection-plus-minus) のインプレースバージョン）を使用することです。
2 番目の引数には、要素型の単一のインスタンスまたは別のコレクションを指定できます。
右辺に単一の要素がある場合、`-=` はその要素の _最初_ の出現箇所を削除します。
次に、それがコレクションの場合、その要素の _すべての_ 出現箇所が削除されます。
たとえば、リストに重複する要素が含まれている場合、それらは一度に削除されます。
2 番目のオペランドには、コレクションに存在しない要素を含めることができます。そのような要素は、操作の実行に影響を与えません。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    

}
```

## 要素の更新

リストとマップには、要素を更新する操作も用意されています。
これらについては、[List-specific Operations](list-operations) および [Map Specific Operations](map-operations) で説明されています。
セットの場合、要素の更新は、実際には要素を削除して別の要素を追加することになるため、意味がありません。