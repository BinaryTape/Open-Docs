[//]: # (title: イテレーター)

コレクションの要素を走査するために、Kotlin標準ライブラリは、コレクションの基となる構造を公開することなく要素に順次アクセスを提供する、一般的に使用されるメカニズムである_イテレーター_をサポートしています。イテレーターは、コレクションのすべての要素を1つずつ処理する必要がある場合に便利です。例えば、値を出力したり、同様の更新を行ったりする場合などです。

イテレーターは、`Set`や`List`を含む[`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)インターフェースの継承者に対して、[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)関数を呼び出すことで取得できます。

イテレーターを取得すると、それはコレクションの最初の要素を指します。[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)関数を呼び出すと、この要素が返され、存在する場合はイテレーターの位置が次の要素に移動します。

イテレーターが最後の要素を通過すると、要素の取得にはこれ以上使用できなくなり、以前のどの位置にもリセットできません。コレクションを再度イテレートするには、新しいイテレーターを作成してください。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`Iterable`コレクションを走査する別の方法は、よく知られた`for`ループです。コレクションに対して`for`を使用すると、暗黙的にイテレーターが取得されます。したがって、以下のコードは上記の例と同等です。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後に、コレクションを自動的にイテレートし、各要素に対して指定されたコードを実行できる便利な`forEach()`関数があります。したがって、同じ例は次のようになります。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## リストイテレーター

リストには、特殊なイテレーター実装である[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)があります。これは、前方と後方の両方向でリストをイテレートすることをサポートしています。

後方イテレーションは、[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)および[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html)関数によって実装されます。さらに、`ListIterator`は[`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)および[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html)関数を使用して要素のインデックスに関する情報を提供します。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    // Iterating backwards:
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
        // Index: 3, value: four
        // Index: 2, value: three
        // Index: 1, value: two
        // Index: 0, value: one
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

両方向にイテレートする機能があるため、`ListIterator`は最後の要素に到達した後でも引き続き使用できます。

## ミュータブルイテレーター

変更可能なコレクションをイテレートするには、要素を削除する関数[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)で`Iterator`を拡張した[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)があります。したがって、コレクションをイテレートしながら要素を削除できます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
    // After removal: [two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要素を削除するだけでなく、[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)は、リストをイテレートしながら[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)および[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html)関数を使用して要素を挿入および置換することもできます。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four") 
    val mutableListIterator = numbers.listIterator()
    
    mutableListIterator.next()
    mutableListIterator.add("two")
    println(numbers)
    // [one, two, four, four]
    mutableListIterator.next()
    mutableListIterator.set("three")   
    println(numbers)
    // [one, two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}