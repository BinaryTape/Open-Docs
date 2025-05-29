[//]: # (title: コレクションの構築)

## 要素から構築する

コレクションを作成する最も一般的な方法は、標準ライブラリ関数である[`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)を使用することです。
引数としてコレクションの要素をコンマ区切りリストで指定すると、コンパイラが自動的に要素の型を検出します。空のコレクションを作成する場合は、型を明示的に指定します。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

同様に、マップについても関数[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
および[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)が利用できます。マップの
キーと値は、`Pair`オブジェクトとして渡されます（通常、`to`中置関数で作成されます）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

なお、`to`記法は一時的な`Pair`オブジェクトを作成するため、パフォーマンスが重要でない場合にのみ使用することをお勧めします。過剰なメモリ使用を避けるには、別の方法を使用してください。例えば、可変マップを作成し、書き込み操作を使用して要素を追加できます。[`apply()`](scope-functions.md#apply)関数は、ここでの初期化を流暢に保つのに役立ちます。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## コレクションビルダー関数で作成する

コレクションを作成する別の方法は、ビルダー関数 — [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)、
または[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) を呼び出すことです。これらの関数は、
対応する型の新しい可変コレクションを作成し、[書き込み操作](collection-write.md)を使用して要素を追加し、同じ要素を持つ読み取り専用のコレクションを返します。

```kotlin
val map = buildMap { // これはMutableMap<String, Int>です。キーと値の型は、以下の`put()`呼び出しから推論されます
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空のコレクション

要素を何も持たないコレクションを作成するための関数もあります：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html)、および
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
空のコレクションを作成する際には、コレクションが保持する要素の型を指定する必要があります。

```kotlin
val empty = emptyList<String>()
```

## リストの初期化関数

リストの場合、リストのサイズと、そのインデックスに基づいて要素の値を定義する初期化関数を受け取る、コンストラクタのような関数があります。

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // 後で内容を変更したい場合はMutableList
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具象型コンストラクタ

具象型のコレクション（`ArrayList`や`LinkedList`など）を作成するには、これらの型で利用可能なコンストラクタを使用できます。
同様のコンストラクタは、`Set`と`Map`の実装でも利用できます。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## コピー

既存のコレクションと同じ要素を持つコレクションを作成するには、コピー関数を使用できます。標準ライブラリのコレクションコピー関数は、同じ要素への参照を持つ_シャローコピー_のコレクションを作成します。
したがって、コレクションの要素に対して行われた変更は、そのすべてのコピーに反映されます。

[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html)などのコレクションコピー関数は、特定の時点におけるコレクションのスナップショットを作成します。
その結果は、同じ要素を持つ新しいコレクションです。
元のコレクションから要素を追加または削除しても、コピーには影響しません。コピーもソースとは独立して変更できます。

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("最初の要素の名前は: ソースでは${sourceList[0].name}、コピーでは${copyList[0].name}")
    println("リストのサイズは: ソースでは${sourceList.size}、コピーでは${copyList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これらの関数は、コレクションを他の型に変換するためにも使用できます。例えば、リストからセットを構築したり、その逆も可能です。

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

あるいは、同じコレクションインスタンスへの新しい参照を作成することもできます。新しい参照は、既存のコレクションでコレクション変数を初期化するときに作成されます。
したがって、参照を通じてコレクションインスタンスが変更されると、その変更はすべての参照に反映されます。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("ソースのサイズ: ${sourceList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

コレクションの初期化は、可変性を制限するために使用できます。例えば、`MutableList`への`List`参照を作成した場合、この参照を通じてコレクションを変更しようとすると、コンパイラはエラーを生成します。

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //コンパイルエラー
    sourceList.add(4)
    println(referenceList) // sourceListの現在の状態を表示します
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 他のコレクションで関数を呼び出す

コレクションは、他のコレクションに対する様々な操作の結果として作成できます。例えば、リストを[フィルタリング](collection-filtering.md)すると、フィルターに一致する要素の新しいリストが作成されます。

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

Kotlinにおけるコレクション操作の詳細については、[コレクション操作の概要](collection-operations.md)を参照してください。