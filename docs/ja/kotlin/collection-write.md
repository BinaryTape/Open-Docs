[//]: # (title: コレクションの書き込み操作)

[ミュータブルコレクション](collections-overview.md#collection-types)は、コレクションの内容を変更するための操作、たとえば要素の追加や削除をサポートしています。
このページでは、`MutableCollection`のすべての実装で利用可能な書き込み操作について説明します。
`List`および`Map`で利用可能なより具体的な操作については、それぞれ[Listに特化した操作](list-operations.md)および[Mapに特化した操作](map-operations.md)を参照してください。

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
レシーバーと引数の型は異なる場合があります。たとえば、`Set`から`List`にすべての項目を追加できます。

リストに対して呼び出されると、`addAll()`は引数と同じ順序で新しい要素を追加します。
また、`addAll()`を呼び出す際に、最初の引数として要素の位置を指定することもできます。
引数コレクションの最初の要素がこの位置に挿入されます。
引数コレクションの他の要素はその後に続き、レシーバーの要素を末尾にシフトします。

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

[`plus`演算子](collection-plus-minus.md)のインプレース版である[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)を使用しても要素を追加できます。
ミュータブルコレクションに適用されると、`+=`は第2オペランド（要素または別のコレクション）をコレクションの末尾に付加します。

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

ミュータブルコレクションから要素を削除するには、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)関数を使用します。
`remove()`は要素の値を受け入れ、この値の1つの出現箇所を削除します。

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

複数の要素を一度に削除するには、以下の関数があります。

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)は、引数コレクションに存在するすべての要素を削除します。
    あるいは、述語を引数として呼び出すこともできます。この場合、関数は述語が`true`を返すすべての要素を削除します。
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)は`removeAll()`の反対です。引数コレクションの要素以外のすべての要素を削除します。
    述語と共に使用すると、一致する要素のみを残します。
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

コレクションから要素を削除するもう1つの方法は、[`minus`](collection-plus-minus.md)のインプレース版である[`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)演算子を使用することです。
第2引数には、要素型の単一インスタンスまたは別のコレクションを指定できます。
右辺に単一の要素がある場合、`-=`はその_最初の_出現箇所を削除します。
一方、コレクションである場合は、その要素の_すべて_の出現箇所が削除されます。
たとえば、リストに重複する要素が含まれている場合、それらは一度に削除されます。
第2オペランドには、コレクションに存在しない要素を含めることができます。そのような要素は操作の実行に影響を与えません。

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

リストとマップは要素を更新する操作も提供します。
これらは[Listに特化した操作](list-operations.md)および[Mapに特化した操作](map-operations.md)で説明されています。
セットの場合、更新は実際には要素を削除して別の要素を追加することになるため、意味がありません。