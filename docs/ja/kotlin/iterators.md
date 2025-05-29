[//]: # (title: イテレータ)

コレクションの要素を走査するために、Kotlin標準ライブラリは、_イテレータ_という一般的に使用されるメカニズムをサポートしています。イテレータは、コレクションの基盤となる構造を公開することなく、要素に順次アクセスを提供するオブジェクトです。イテレータは、コレクションのすべての要素を一つずつ処理する必要がある場合（例えば、値を出力したり、同様の更新を行ったりする場合）に役立ちます。

イテレータは、[`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)インターフェースを継承するクラス（`Set`や`List`を含む）で、[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)関数を呼び出すことで取得できます。

イテレータを取得すると、それはコレクションの最初の要素を指します。[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)関数を呼び出すと、その要素が返され、存在する場合はイテレータの位置が次の要素に移動します。

イテレータが最後の要素を通過すると、それ以上要素を取得するために使用できなくなります。また、以前の位置にリセットすることもできません。コレクションを再度イテレートするには、新しいイテレータを作成します。

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

`Iterable`コレクションを走査する別の方法は、よく知られた`for`ループです。コレクションで`for`を使用すると、イテレータが暗黙的に取得されます。したがって、以下のコードは上記の例と同等です。

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

最後に、コレクションを自動的にイテレートし、各要素に対して与えられたコードを実行できる便利な`forEach()`関数があります。同じ例は次のようになります。

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

## リストイテレータ

リストには、特殊なイテレータ実装である[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)があります。これは、リストを両方向（前方と後方）にイテレートするのをサポートしています。

後方イテレーションは、[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)および[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html)関数によって実装されます。さらに、`ListIterator`は、[`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)および[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html)関数で要素のインデックスに関する情報を提供します。

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

両方向にイテレートする能力があるため、`ListIterator`は最後の要素に到達した後でも使用できます。

## 可変イテレータ

可変コレクションをイテレートするために、[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)があります。これは`Iterator`を要素削除関数[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)で拡張します。これにより、コレクションをイテレート中に要素を削除できます。

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

要素を削除する以外に、[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)は、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)関数と[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html)関数を使用して、リストをイテレート中に要素を挿入および置換することもできます。

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