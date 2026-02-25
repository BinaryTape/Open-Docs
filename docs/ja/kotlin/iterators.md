[//]: # (title: イテレーター)

コレクションの要素を走査するために、Kotlin標準ライブラリは一般的によく使われるメカニズムである「イテレーター（iterator）」をサポートしています。これは、コレクションの背後にある構造を公開せずに、要素に順次アクセスできるようにするオブジェクトです。
イテレーターは、値の出力や値に対する同様の更新を行うなど、コレクションのすべての要素を1つずつ処理する必要がある場合に便利です。

イテレーターは、[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html) 関数を呼び出すことで、`Set` や `List` を含む [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) インターフェースの継承クラスから取得できます。

一度イテレーターを取得すると、それはコレクションの最初の要素を指します。[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html) 関数を呼び出すとその要素を返し、次の要素が存在する場合はイテレーターの位置をその次の要素へ移動させます。

イテレーターが最後の要素を通過すると、それ以上要素を取得するために使用することはできず、また以前のどの位置にもリセットすることはできません。コレクションを再度反復処理するには、新しいイテレーターを作成してください。

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

`Iterable` なコレクションを走査する別の方法は、よく知られた `for` ループです。コレクションで `for` を使用すると、暗黙的にイテレーターが取得されます。したがって、以下のコードは上記の例と同等です。

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

最後に、コレクションを自動的に反復処理し、各要素に対して指定されたコードを実行できる便利な `forEach()` 関数があります。同じ例は以下のようになります。

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

リストには、特別なイテレーターの実装である [`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html) があります。これは、順方向と逆方向の両方の反復処理をサポートしています。

逆方向の反復は、[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html) と [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 関数によって実装されています。
さらに、`ListIterator` は [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html) および [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 関数を使用して、要素のインデックスに関する情報を提供します。

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

両方向への反復が可能であるため、`ListIterator` は最後の要素に到達した後でも引き続き使用できます。

## ミュータブルイテレーター

ミュータブル（可変）なコレクションを反復処理するために、`Iterator` を拡張して要素削除関数 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html) を追加した [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html) があります。これにより、反復処理中にコレクションから要素を削除できます。

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

要素の削除に加えて、[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html) は、[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html) および [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 関数を使用することで、リストの反復処理中に要素の挿入や置換を行うこともできます。

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