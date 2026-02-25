[//]: # (title: コレクションの書き込み操作)

[可変コレクション](collections-overview.md#collection-types)は、要素の追加や削除など、コレクションの内容を変更する操作をサポートしています。
このページでは、`MutableCollection` のすべての実装で利用可能な書き込み操作について説明します。
`List` および `Map` で利用可能なより具体的な操作については、それぞれ [List専用の操作](list-operations.md) および [Map専用の操作](map-operations.md) を参照してください。

## 要素の追加

リストまたはセットに単一の要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 関数を使用します。指定されたオブジェクトはコレクションの末尾に追加されます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) は、引数オブジェクトのすべての要素をリストまたはセットに追加します。引数には `Iterable`、`Sequence`、または `Array` を指定できます。
レシーバーと引数の型は異なっていても構いません。例えば、`Set` のすべてのアイテムを `List` に追加することができます。

リストに対して呼び出された場合、`addAll()` は引数内と同じ順序で新しい要素を追加します。
また、最初の引数として要素の位置を指定して `addAll()` を呼び出すこともできます。
引数コレクションの最初の要素がこの位置に挿入されます。
引数コレクションの他の要素はそれに続き、レシーバーの元の要素は末尾側にシフトされます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、[`plus` 演算子](collection-plus-minus.md)のインプレース (in-place) 版である [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) を使用して要素を追加することもできます。
可変コレクションに `+=` を適用すると、2 番目のオペランド（要素または別のコレクション）がコレクションの末尾に追加されます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 要素の削除

可変コレクションから要素を削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 関数を使用します。
`remove()` は要素の値を受け取り、その値の出現箇所のうち 1 つを削除します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 最初に見つかった `3` を削除
    println(numbers)
    numbers.remove(5)                    // 何も削除しない
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

複数の要素を一度に削除するには、以下の関数があります。

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) は、引数コレクションに含まれるすべての要素を削除します。
   あるいは、引数として述語 (predicate) を指定して呼び出すこともできます。この場合、関数は述語が `true` を返す全要素を削除します。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) は `removeAll()` の逆です。引数コレクションに含まれる要素以外のすべての要素を削除します。
   述語と共に使用すると、それに一致する要素のみを残します。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) は、リストからすべての要素を削除して空にします。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションから要素を削除するもう一つの方法は、[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子を使用することです。これは [`minus`](collection-plus-minus.md) のインプレース版です。
2 番目の引数には、要素型の単一のインスタンスまたは別のコレクションを指定できます。
右辺に単一の要素を指定した場合、`-=` はその要素の「最初の」出現箇所を削除します。
一方、コレクションを指定した場合は、その要素の「すべての」出現箇所が削除されます。
例えば、リストに重複した要素が含まれている場合、それらは一度に削除されます。
2 番目のオペランドには、コレクション内に存在しない要素が含まれていても構いません。そのような要素は操作の実行に影響を与えません。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 上記と同じ結果になります
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 要素の更新

リストとマップは、要素を更新するための操作も提供しています。
これらについては、[List専用の操作](list-operations.md) および [Map専用の操作](map-operations.md) で説明されています。
セットについては、更新とは実際にはある要素を削除して別の要素を追加することであるため、更新という概念は意味を持ちません。