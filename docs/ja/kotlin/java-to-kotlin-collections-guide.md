[//]: # (title: JavaとKotlinのコレクション)
[//]: # (description: JavaコレクションからKotlinコレクションへ移行する方法を学びましょう。このガイドでは、KotlinおよびJavaのリスト、ArrayList、マップ、セットなどのデータ構造について説明します。)

_コレクション_とは、解決しようとしている問題にとって重要な可変個の項目（ゼロ個の場合もある）のグループであり、一般的に操作の対象となります。
このガイドでは、JavaとKotlinにおけるコレクションの概念と操作について説明し、比較します。
これは、JavaからKotlinへの移行を助け、Kotlinらしいコードを書くのに役立ちます。

このガイドの最初の部分では、JavaとKotlinで同じコレクションに対する操作のクイック用語集が含まれています。
これは、[JavaとKotlinで同じ操作](#operations-that-are-the-same-in-java-and-kotlin)と、[Javaの標準ライブラリには存在しない操作](#operations-that-don-t-exist-in-java-s-standard-library)に分かれています。
ガイドの2番目の部分では、[可変性](#mutability)から始まり、特定のケースを見ながらいくつかの違いを説明します。

コレクションの導入については、[コレクションの概要](collections-overview.md)を参照するか、Kotlin Developer AdvocateであるSebastian Aignerによるこちらの[ビデオ](https://www.youtube.com/watch?v=F8jj7e-_jFA)をご覧ください。

> 以下のすべての例は、JavaおよびKotlinの標準ライブラリAPIのみを使用しています。
>
{style="note"}

## JavaとKotlinで同じ操作

Kotlinでは、Javaの対応するものとまったく同じに見えるコレクション操作が多数存在します。

### リスト、セット、キュー、デックでの操作

| 説明 | 共通の操作 | その他のKotlinの代替案 |
|-------------|-----------|---------------------|
| 要素を追加する | `add()`, `addAll()` | [`plusAssign`(`+=`) 演算子](collection-plus-minus.md)を使用します: `collection += element`, `collection += anotherCollection`。 |
| コレクションが要素を含むかどうかを確認する | `contains()`, `containsAll()` | 演算子形式で`contains()`を呼び出すには、[`in` キーワード](collection-elements.md#check-element-existence)を使用します: `element in collection`。 |
| コレクションが空かどうかを確認する | `isEmpty()` | `isNotEmpty()`を使用して、コレクションが空ではないことを確認します。 |
| 特定の条件で削除する | `removeIf()` | |
| 選択した要素のみを残す | `retainAll()` | |
| コレクションからすべての要素を削除する | `clear()` | |
| コレクションからストリームを取得する | `stream()` | Kotlinには独自のストリーム処理方法があります: [シーケンス](#sequences)および`map()`や`filter()`のようなメソッドです。 |
| コレクションからイテレータを取得する | `iterator()` | |

### マップでの操作

| 説明 | 共通の操作 | その他のKotlinの代替案 |
|-------------|-----------|---------------------|
| 要素を追加する | `put()`, `putAll()`, `putIfAbsent()`| Kotlinでは、`map[key] = value`という代入は`put(key, value)`と同じように動作します。また、[`plusAssign`(`+=`) 演算子](collection-plus-minus.md)を使用することもできます: `map += Pair(key, value)` または `map += anotherMap`。 |
| 要素を置き換える | `put()`, `replace()`, `replaceAll()` | `put()`や`replace()`の代わりにインデックス演算子`map[key] = value`を使用します。 |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得します: `map[index]`。 |
| マップが要素を含むかどうかを確認する | `containsKey()`, `containsValue()` | 演算子形式で`contains()`を呼び出すには、[`in` キーワード](collection-elements.md#check-element-existence)を使用します: `element in map`。 |
| マップが空かどうかを確認する | `isEmpty()` | `isNotEmpty()`を使用して、マップが空ではないことを確認します。 |
| 要素を削除する | `remove(key)`, `remove(key, value)` | [`minusAssign`(`-=`) 演算子](collection-plus-minus.md)を使用します: `map -= key`。 |
| マップからすべての要素を削除する | `clear()` | |
| マップからストリームを取得する | エントリ、キー、または値に対する`stream()` | |

### リストのみに存在する操作

| 説明 | 共通の操作 | その他のKotlinの代替案 |
|-------------|-----------|---------------------|
| 要素のインデックスを取得する | `indexOf()` | |
| 要素の最後のインデックスを取得する | `lastIndexOf()` | |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得します: `list[index]`。 |
| サブリストを取得する | `subList()` | |
| 要素を置き換える | `set()`, `replaceAll()` | `set()`の代わりにインデックス演算子を使用します: `list[index] = value`。 |

## 少し異なる操作

### あらゆるコレクション型での操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| コレクションのサイズを取得する | `size()` | `count()`, `size` |
| ネストされたコレクション要素へのフラットなアクセスを取得する | `collectionOfCollections.forEach(flatCollection::addAll)` または `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) または [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 各要素に指定された関数を適用する | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 提供された操作をコレクション要素に順次適用し、累積結果を返す | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 分類子で要素をグループ化してカウントする | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 条件でフィルタリングする | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| コレクション要素が条件を満たすか確認する | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 要素をソートする | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 最初のN個の要素を取得する | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 述語を持つ要素を取得する | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 最初のN個の要素をスキップする | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 述語を持つ要素をスキップする | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| コレクション要素とそれに関連付けられた特定の値からマップを構築する | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

上記にリストされたすべての操作をマップに対して実行するには、まずマップの`entrySet`を取得する必要があります。

### リストでの操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| リストを自然順序でソートする | `sort(null)` | `sort()` |
| リストを降順でソートする | `sort(comparator)` | `sortDescending()` |
| リストから要素を削除する | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` または [`collection -= element`](collection-plus-minus.md) |
| リストのすべての要素を特定の値で埋める | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| リストからユニークな要素を取得する | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Javaの標準ライブラリには存在しない操作

* [`zip()`, `unzip()`](collection-transformations.md) – コレクションを変換する。
* [`aggregate()`](collection-grouping.md) – 条件でグループ化する。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 述語によって要素を取得または削除する。
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – コレクションの一部を取得する。
* [プラス (`+`) およびマイナス (`-`) 演算子](collection-plus-minus.md) – 要素を追加または削除する。

`zip()`、`chunked()`、`windowed()`、およびその他のいくつかの操作について深く掘り下げたい場合は、Kotlinの高度なコレクション操作に関するSebastian Aignerによるこのビデオをご覧ください。

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 可変性

Javaでは、可変コレクションが存在します:

```java
// Java
// This list is mutable!
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

部分的に可変なもの:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="mutability-partly-java"}

そして不変なもの:

```java
// Java
List<String> numbers = new LinkedList<>();
// This list is immutable!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="immutable-java"}

IntelliJ IDEAで最後の2つのコードを書くと、IDEは不変オブジェクトを変更しようとしていることを警告します。
このコードはコンパイルされますが、実行時に`UnsupportedOperationException`で失敗します。型を見ただけでは、コレクションが可変であるかどうかを判断することはできません。

Javaとは異なり、Kotlinでは必要に応じて可変または読み取り専用のコレクションを明示的に宣言します。
読み取り専用のコレクションを変更しようとすると、コードはコンパイルされません。

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // This is OK
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // Compilation error - Unresolved reference: add
```
{id="mutability-kotlin"}

不変性について詳しくは、[Kotlinコーディング規約](coding-conventions.md#immutability)のページをご覧ください。

## 共変性

Javaでは、子孫型を持つコレクションを、祖先型のコレクションを受け取る関数に渡すことはできません。
たとえば、`Rectangle`が`Shape`を拡張する場合、`Rectangle`要素のコレクションを`Shape`要素のコレクションを受け取る関数に渡すことはできません。
コードをコンパイル可能にするには、関数が`Shape`の任意の子孫を持つコレクションを受け取れるように、`? extends Shape`型を使用します。

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* List<Shape>のみを使用している場合、以下のようにList<Rectangle>を引数としてこの関数を呼び出すと、コードはコンパイルされません */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

Javaとは異なり、Kotlinでは読み取り専用のコレクション型は[共変](generics.md#variance)です。これは、`Rectangle`クラスが`Shape`クラスを継承している場合、`List<Rectangle>`型を`List<Shape>`型が必要なあらゆる場所で使用できることを意味します。
言い換えれば、コレクション型は要素型と同じサブタイピング関係を持ちます。マップは値型に対しては共変ですが、キー型に対しては共変ではありません。
可変コレクションは共変ではありません。これは実行時エラーにつながります。

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("The shapes are: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```
{kotlin-runnable="true" id="covariance-kotlin"}

[コレクション型](collections-overview.md#collection-types)について詳しくはこちらをご覧ください。

## 範囲とプログレッション

Kotlinでは、[範囲 (ranges)](ranges.md)を使用して区間を作成できます。たとえば、`Version(1, 11)..Version(1, 30)`は`1.11`から`1.30`までのすべてのバージョンを含みます。
`in`演算子を使用して、バージョンが範囲内にあることを確認できます: `Version(0, 9) in versionRange`。

Javaでは、`Version`が両方の境界に適合するかどうかを手動でチェックする必要があります。

```java
// Java
class Version implements Comparable<Version> {

    int major;
    int minor;

    Version(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    @Override
    public int compareTo(Version o) {
        if (this.major != o.major) {
            return this.major - o.major;
        }
        return this.minor - o.minor;
    }
}

public void compareVersions() {
    var minVersion = new Version(1, 11);
    var maxVersion = new Version(1, 31);

   System.out.println(
           versionIsInRange(new Version(0, 9), minVersion, maxVersion));
   System.out.println(
           versionIsInRange(new Version(1, 20), minVersion, maxVersion));
}

public Boolean versionIsInRange(Version versionToCheck, Version minVersion, 
                                Version maxVersion) {
    return versionToCheck.compareTo(minVersion) >= 0 
            && versionToCheck.compareTo(maxVersion) <= 0;
}
```
{id="ranges-java"}

Kotlinでは、範囲を1つのオブジェクトとして操作します。2つの変数を作成して、それらと`Version`を比較する必要はありません。

```kotlin
// Kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
    val versionRange = Version(1, 11)..Version(1, 30)

    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
}
```
{kotlin-runnable="true" id="ranges-kotlin"}

バージョンが最小バージョン以上 (`>=`) かつ最大バージョン未満 (`<`) であることを確認するなど、いずれかの境界を除外する必要がある場合、これらの包括的な範囲は役に立ちません。

## 複数条件による比較

Javaでは、複数の条件でオブジェクトを比較するために、`Comparator`インターフェースの[`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)関数と[`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)関数を使用できます。
たとえば、名前と年齢で人物を比較するには:

```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return this.name + " " + age;
    }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), 
            new Person("Jack", 25));
    System.out.println(persons.stream().sorted(Comparator
            .comparing(Person::getName)
            .thenComparingInt(Person::getAge)).collect(toList()));
}
```
{id="comparison-java"}

Kotlinでは、比較したいフィールドを列挙するだけです。

```kotlin
data class Person(
    val name: String,
    val age: Int
)

fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), 
        Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}
```
{kotlin-runnable="true" id="comparison-kotlin"}

## シーケンス

Javaでは、次のようにして数値のシーケンスを生成できます。

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

Kotlinでは、_[シーケンス](sequences.md)_を使用します。シーケンスの多段階処理は、可能な限り遅延実行されます。実際の計算は、処理チェーン全体の結果が要求されたときにのみ行われます。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // Prints 145
//sampleEnd
}
```
{kotlin-runnable="true" id="sequences-kotlin"}

シーケンスは、いくつかのフィルタリング操作を実行するために必要なステップ数を減らすことができます。
`Iterable`と`Sequence`の違いを示す[シーケンス処理の例](sequences.md#sequence-processing-example)をご覧ください。

## リストからの要素の削除

Javaでは、[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))関数は削除する要素のインデックスを受け入れます。

整数要素を削除する際は、`remove()`関数の引数として`Integer.valueOf()`関数を使用します。

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // This removes by index
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

Kotlinでは、要素の削除には2つのタイプがあります: [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)によるインデックス指定と、[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)による値指定です。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]
//sampleEnd
}
```
{kotlin-runnable="true" id="remove-elements-kotlin"}

## マップの走査

Javaでは、[`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer))を介してマップを走査できます。

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

Kotlinでは、`for`ループまたはJavaの`forEach`に似た`forEach`を使用して、マップを走査します。

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## 空の可能性があるコレクションの最初と最後の項目を取得する

Javaでは、コレクションのサイズをチェックし、インデックスを使用することで、最初と最後の項目を安全に取得できます。

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```
{id="list-get-first-last-java"}

また、[`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)とその子孫に対して[`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())および[`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())関数を使用することもできます。

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```
{id="deque-get-first-last-java"}

Kotlinには、特別な関数[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)と[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)があります。
[`Elvis演算子`](null-safety.md#elvis-operator)を使用すると、関数の結果に応じてすぐにさらなるアクションを実行できます。たとえば、`firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## リストからセットを作成する

Javaでは、[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)から[`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)を作成するために、[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection))関数を使用できます。

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```
{id="list-to-set-java"}

Kotlinでは、`toSet()`関数を使用します。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" id="list-to-set-kotlin"}

## 要素のグループ化

Javaでは、[Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)関数の`groupingBy()`を使用して要素をグループ化できます。

```java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(
            Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```
{id="group-elements-java"}

Kotlinでは、[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)関数を使用します。

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```
{kotlin-runnable="true" id="group-elements-kotlin"}

## 要素のフィルタリング

Javaでは、コレクションから要素をフィルタリングするために、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用する必要があります。
Stream APIには`中間 (intermediate)`操作と`終端 (terminal)`操作があります。`filter()`はストリームを返す中間操作です。
出力としてコレクションを受け取るには、`collect()`のような終端操作を使用する必要があります。
たとえば、キーが`1`で終わり、値が`10`より大きいペアのみを残すには:

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry -> entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```
{id="filter-elements-java"}

Kotlinでは、フィルタリングはコレクションに組み込まれており、`filter()`はフィルタリングされたのと同じコレクション型を返します。
したがって、書く必要があるのは`filter()`とその述語だけです。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) -> key.endsWith("1") && value > 10 }
    println(filteredNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-elements-kotlin"}

[マップのフィルタリング](map-operations.md#filter)について詳しくはこちらをご覧ください。

### 型による要素のフィルタリング

Javaでは、型によって要素をフィルタリングし、それらに対してアクションを実行するために、[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html)演算子で型をチェックし、その後に型キャストを行う必要があります。

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("All String elements in upper case:");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

Kotlinでは、コレクションに対して[`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)を呼び出すだけで、型キャストは[スマートキャスト](typecasts.md#smart-casts)によって行われます。

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### 述語のテスト

一部のタスクでは、すべての要素、どの要素も、またはいずれかの要素が条件を満たすかどうかを確認する必要があります。
Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)の[`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate))、および[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))関数を介してこれらのチェックすべてを実行できます。

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```
{id="test-predicates-java"}

Kotlinでは、[拡張関数](extensions.md)の`none()`、`any()`、`all()`がすべての[Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable)オブジェクトで利用可能です。

```kotlin
fun main() {
//sampleStart
// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })
//sampleEnd
}
```
{kotlin-runnable="true" id="test-predicates-kotlin"}

[述語のテスト](collection-filtering.md#test-predicates)について詳しくはこちらをご覧ください。

## コレクションの変換操作

### 要素のジップ

Javaでは、2つのコレクションを同時に反復処理することで、同じ位置にある要素からペアを作成できます。

```java
// Java
public void zip() {
    var colors = List.of("red", "brown");
    var animals = List.of("fox", "bear", "wolf");

    for (int i = 0; i < Math.min(colors.size(), animals.size()); i++) {
        String animal = animals.get(i);
        System.out.println("The " + animal.substring(0, 1).toUpperCase()
               + animal.substring(1) + " is " + colors.get(i));
   }
}
```
{id="zip-elements-java"}

要素のペアを出力にただ表示するよりも複雑なことをしたい場合は、[レコード (Records)](https://blogs.oracle.com/javamagazine/post/records-come-to-java)を使用できます。
上記の例では、レコードは`record AnimalDescription(String animal, String color) {}`になります。

Kotlinでは、[`zip()`](collection-transformations.md#zip)関数を使用して同じことを行います。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })
//sampleEnd
}
```
{kotlin-runnable="true" id="zip-elements-kotlin"}

`zip()`は[Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/)オブジェクトのListを返します。

> コレクションのサイズが異なる場合、`zip()`の結果はより小さいサイズになります。大きいコレクションの最後の要素は結果に含まれません。
>
{style="note"}

### 要素の関連付け

Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用して要素を特性に関連付けることができます。

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number -> number, String::length));
    System.out.println(wordAndLength);
}
```
{id="associate-elements-java"}

Kotlinでは、[`associate()`](collection-transformations.md#associate)関数を使用します。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" id="associate-elements-kotlin"}

## 次のステップ

* [Kotlin Koans](koans.md)にアクセスして、Kotlin構文を学ぶための演習を完了しましょう。
* 各演習は失敗するユニットテストとして作成されており、それを合格させることがあなたの仕事です。
* その他の[Kotlinイディオム](idioms.md)も参照してください。
* [JavaからKotlinへのコンバーター](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学びましょう。
* [Kotlinのコレクション](collections-overview.md)について学びましょう。

お気に入りのイディオムがあれば、プルリクエストを送って共有してください。