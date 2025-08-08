[//]: # (title: コレクションの書き込み操作)

[可変コレクション](collections-overview.md#collection-types)は、コレクションの内容を変更するための操作、例えば要素の追加や削除などをサポートしています。
このページでは、`MutableCollection`のすべての実装で利用可能な書き込み操作について説明します。
`List`および`Map`に特化した操作については、それぞれ[リストに特化した操作](list-operations.md)と[マップに特化した操作](map-operations.md)を参照してください。

## 要素の追加

リストまたはセットに単一の要素を追加するには、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)関数を使用します。指定されたオブジェクトはコレクションの末尾に追加されます。

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)は、引数オブジェクトのすべての要素をリストまたはセットに追加します。引数には`Iterable`、`Sequence`、または`Array`を指定できます。
レシーバーと引数の型は異なっていても構いません。例えば、`Set`のすべての項目を`List`に追加できます。

リストに対して呼び出すと、`addAll()`は、引数に渡されたのと同じ順序で新しい要素を追加します。
`addAll()`を呼び出す際に、最初の引数として要素の位置を指定することもできます。
引数コレクションの最初の要素がこの位置に挿入されます。
引数コレクションの他の要素はそれに続き、レシーバー要素を末尾にシフトします。

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

[`plus`演算子](collection-plus-minus.md)のインプレースバージョンである[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) を使用して要素を追加することもできます。
可変コレクションに適用されると、`+=`は、2番目のオペランド（要素または別のコレクション）をコレクションの末尾に追加します。

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

可変コレクションから要素を削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。
`remove()`は要素の値を受け取り、この値の1つの出現箇所を削除します。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

複数の要素を一度に削除するには、以下の関数があります:

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)は、引数コレクション内に存在するすべての要素を削除します。
    あるいは、述語を引数として呼び出すこともできます。この場合、関数は述語が`true`を返すすべての要素を削除します。
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)は`removeAll()`の反対です。引数コレクションからの要素を除くすべての要素を削除します。
    述語とともに使用すると、それに一致する要素のみを残します。
*   [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html)はリストからすべての要素を削除し、空にします。

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

コレクションから要素を削除するもう1つの方法は、[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 演算子を使用することです。これは[`minus`](collection-plus-minus.md)のインプレースバージョンです。
2番目の引数には、要素型の単一のインスタンスまたは別のコレクションを指定できます。
右側に単一の要素がある場合、`-=`は、その要素の_最初の_出現箇所を削除します。
一方、コレクションである場合は、その要素の_すべて_の出現箇所が削除されます。
例えば、リストに重複する要素が含まれている場合、それらは一度に削除されます。
2番目のオペランドには、コレクション内に存在しない要素が含まれていても構いません。そのような要素は操作の実行に影響を与えません。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 要素の更新

リストとマップは要素を更新するための操作も提供します。
それらは[リストに特化した操作](list-operations.md)と[マップに特化した操作](map-operations.md)で説明されています。
セットの場合、実際には要素を削除して別の要素を追加する操作であるため、更新は意味をなしません。