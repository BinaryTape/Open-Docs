[//]: # (title: コレクションの構築)

## 要素から構築する

コレクションを作成する最も一般的な方法は、標準ライブラリの関数である[`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)を使用することです。
コレクションの要素をカンマ区切りのリストとして引数に指定すると、コンパイラが要素の型を自動的に検出します。空のコレクションを作成する場合は、型を明示的に指定します。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

同様に、マップには[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)と[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)関数が利用できます。マップのキーと値は`Pair`オブジェクトとして渡されます（通常は`to`中置関数で作成されます）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

`to`表記は短命な`Pair`オブジェクトを作成するため、パフォーマンスが重要でない場合にのみ使用することをお勧めします。過剰なメモリ使用を避けるには、別の方法を使用してください。たとえば、ミュータブルなマップを作成し、書き込み操作を使用して要素を追加できます。ここで[`apply()`](scope-functions.md#apply)関数を使用すると、初期化処理を簡潔に保つのに役立ちます。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## コレクションビルダー関数で作成する

コレクションを作成するもう1つの方法は、ビルダー関数である[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)、または[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)を呼び出すことです。これらの関数は、対応する型の新しいミュータブルなコレクションを作成し、[書き込み操作](collection-write.md)を使用して要素を追加し、同じ要素を持つ読み取り専用のコレクションを返します。

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空のコレクション

要素のないコレクションを作成するための関数もあります: [`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html)、および
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
空のコレクションを作成する際は、コレクションが保持する要素の型を指定する必要があります。

```kotlin
val empty = emptyList<String>()
```

## リストの初期化関数

リストには、リストのサイズと、そのインデックスに基づいて要素の値を定義する初期化関数を受け取る、コンストラクタのような関数があります。

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具象型コンストラクタ

`ArrayList`や`LinkedList`のような具象型のコレクションを作成するには、これらの型で利用できるコンストラクタを使用できます。同様のコンストラクタは、`Set`および`Map`の実装でも利用できます。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## コピー

既存のコレクションと同じ要素を持つコレクションを作成するには、コピー関数を使用できます。標準ライブラリのコレクションコピー関数は、同じ要素への参照を持つ_シャローコピー_コレクションを作成します。したがって、コレクションの要素に加えられた変更は、そのすべてのコピーに反映されます。

[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html)などのコレクションコピー関数は、特定の時点でのコレクションのスナップショットを作成します。その結果は、同じ要素を持つ新しいコレクションです。元のコレクションに要素を追加または削除しても、コピーには影響しません。コピーもソースとは独立して変更できます。

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これらの関数は、コレクションを他の型に変換するためにも使用できます。たとえば、リストからセットを作成したり、その逆も可能です。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

あるいは、同じコレクションインスタンスへの新しい参照を作成することもできます。新しい参照は、既存のコレクションでコレクション変数を初期化するときに作成されます。したがって、参照を介してコレクションインスタンスが変更されると、その変更はすべての参照に反映されます。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションの初期化は、ミュータビリティを制限するために使用できます。たとえば、`MutableList`への`List`参照を作成した場合、この参照を介してコレクションを変更しようとすると、コンパイラはエラーを生成します。

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 他のコレクションに対する関数の呼び出し

コレクションは、他のコレクションに対するさまざまな操作の結果として作成できます。たとえば、リストを[フィルタリング](collection-filtering.md)すると、フィルターに一致する要素の新しいリストが作成されます。

```kotlin
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[マッピング](collection-transformations.md#map)は、変換の結果からリストを生成します。

```kotlin
fun main() {
//sampleStart 
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[アソシエーション](collection-transformations.md#associate)はマップを生成します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlinでのコレクションに対する操作の詳細については、[コレクション操作の概要](collection-operations.md)を参照してください。