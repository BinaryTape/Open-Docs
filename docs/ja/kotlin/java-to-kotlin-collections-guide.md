[//]: # (title: JavaとKotlinのコレクション)

<web-summary>JavaコレクションからKotlinコレクションへの移行方法を学びます。このガイドでは、KotlinおよびJavaのリスト、ArrayList、マップ、セットなどのデータ構造について説明します。</web-summary>

_コレクション_とは、解決しようとしている問題にとって重要であり、一般的に操作される、可変個（ゼロ個の場合もある）の項目のグループです。
このガイドでは、JavaとKotlinにおけるコレクションの概念と操作について説明し、比較します。
JavaからKotlinへの移行を支援し、Kotlinらしい書き方でコードを作成できるようにします。

このガイドの最初の部分には、JavaとKotlinの同じコレクションに対する操作の簡単な用語集が含まれています。
これは、[JavaとKotlinで同じ操作](#operations-that-are-the-same-in-java-and-kotlin)と[Kotlinにのみ存在する操作](#operations-that-don-t-exist-in-java-s-standard-library)に分かれています。
ガイドの2番目の部分では、[ミュータビリティ](#mutability)から始まり、具体的なケースを見ていくつかの違いを説明します。

コレクションの概要については、[コレクションの概要](collections-overview.md)を参照するか、Kotlin開発者アドボケイトであるSebastian Aignerによる[このビデオ](https://www.youtube.com/watch?v=F8jj7e-_jFA)をご覧ください。

> 以下のすべての例では、JavaとKotlinの標準ライブラリAPIのみを使用しています。
>
{style="note"}

## JavaとKotlinで同じ操作

Kotlinには、Javaでの同等の操作とまったく同じように見えるコレクション操作が多数あります。

### リスト、セット、キュー、およびデキューの操作

| 説明 | 共通の操作 | その他のKotlinの選択肢 |
|-------------|-----------|---------------------|
| 要素または要素群を追加する | `add()`, `addAll()` | [`plusAssign`(`+=`) 演算子](collection-plus-minus.md)を使用します: `collection += element`, `collection += anotherCollection`。 |
| コレクションが要素または要素群を含むか確認する | `contains()`, `containsAll()` | [`in`キーワード](collection-elements.md#check-element-existence)を使用して、演算子形式で`contains()`を呼び出します: `element in collection`。 |
| コレクションが空か確認する | `isEmpty()` | コレクションが空でないか確認するには[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)を使用します。 |
| 特定の条件で削除する | `removeIf()` | |
| 選択された要素のみを残す | `retainAll()` | |
| コレクションから全ての要素を削除する | `clear()` | |
| コレクションからストリームを取得する | `stream()` | Kotlinには、ストリームを処理するための独自の方法があります:[シーケンス](#sequences)と[`map()`](collection-filtering.md)や[`filter()`](#filter-elements)のようなメソッドです。 |
| コレクションからイテレータを取得する | `iterator()` | |

### マップの操作

| 説明 | 共通の操作 | その他のKotlinの選択肢 |
|-------------|-----------|---------------------|
| 要素または要素群を追加する | `put()`, `putAll()`, `putIfAbsent()`| Kotlinでは、代入`map[key] = value`は`put(key, value)`と同じように動作します。また、[`plusAssign`(`+=`) 演算子](collection-plus-minus.md)も使用できます: `map += Pair(key, value)`または`map += anotherMap`。 |
| 要素または要素群を置換する | `put()`, `replace()`, `replaceAll()` | `put()`と`replace()`の代わりにインデックス演算子`map[key] = value`を使用します。 |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得します: `map[index]`。 |
| マップが要素または要素群を含むか確認する | `containsKey()`, `containsValue()` | [`in`キーワード](collection-elements.md#check-element-existence)を使用して、演算子形式で`contains()`を呼び出します: `element in map`。 |
| マップが空か確認する | `isEmpty()` | マップが空でないか確認するには[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)を使用します。 |
| 要素を削除する | `remove(key)`, `remove(key, value)` | [`minusAssign`(`-=`) 演算子](collection-plus-minus.md)を使用します: `map -= key`。 |
| マップから全ての要素を削除する | `clear()` | |
| マップからストリームを取得する | `stream()` on entries, keys, or values | |

### リストにのみ存在する操作

| 説明 | 共通の操作 | その他のKotlinの選択肢 |
|-------------|-----------|---------------------|
| 要素のインデックスを取得する | `indexOf()` | |
| 要素の最後のインデックスを取得する | `lastIndexOf()` | |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得します: `list[index]`。 |
| サブリストを取得する | `subList()` | |
| 要素または要素群を置換する | `set()`,  `replaceAll()` | `set()`の代わりにインデックス演算子を使用します: `list[index] = value`。 |

## 少し異なる操作

### 任意のコレクション型に対する操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| コレクションのサイズを取得する | `size()` | `count()`, `size` |
| ネストされたコレクション要素へのフラットなアクセスを取得する | `collectionOfCollections.forEach(flatCollection::addAll)` または `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) または [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 各要素に指定された関数を適用する | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 提供された操作をコレクション要素に順次適用し、累積結果を返す | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 分類子で要素をグループ化し、カウントする | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 条件でフィルタリングする | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| コレクション要素が条件を満たすか確認する | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 要素をソートする | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 最初のN個の要素を取得する | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 述語を持つ要素を取得する | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 最初のN個の要素をスキップする | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 述語を持つ要素をスキップする | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| コレクション要素とそれに関連付けられた特定の値からマップを構築する | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

上記にリストされているすべての操作をマップに対して実行するには、まずマップの`entrySet`を取得する必要があります。

### リストの操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| リストを自然順にソートする | `sort(null)` | `sort()` |
| リストを降順にソートする | `sort(comparator)` | `sortDescending()` |
| リストから要素を削除する | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` または [`collection -= element`](collection-plus-minus.md) |
| リストの全ての要素を特定の値で埋める | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| リストから一意の要素を取得する | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Javaの標準ライブラリには存在しない操作

* [`zip()`, `unzip()`](collection-transformations.md) – コレクションを変換します。
* [`aggregate()`](collection-grouping.md) – 条件でグループ化します。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 述語によって要素を取得または削除します。
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – コレクションの一部を取得します。
* [プラス (`+`) およびマイナス (`-`) 演算子](collection-plus-minus.md) – 要素を追加または削除します。

`zip()`、`chunked()`、`windowed()`、およびその他の操作について深く掘り下げたい場合は、Sebastian AignerによるKotlinの高度なコレクション操作に関するこのビデオをご覧ください。

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## ミュータビリティ

Javaには、可変（mutable）コレクションがあります。

```java
// Java
// このリストは可変です！
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

部分的に可変なものもあります。

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // 実行時に `UnsupportedOperationException` で失敗します
```
{id="mutability-partly-java"}

そして、不変（immutable）なものもあります。

```java
// Java
List<String> numbers = new LinkedList<>();
// このリストは不変です！
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // 実行時に `UnsupportedOperationException` で失敗します
```
{id="immutable-java"}

IntelliJ IDEAで最後の2つのコードを書くと、IDEは不変オブジェクトを変更しようとしていると警告します。
このコードはコンパイルされますが、実行時に`UnsupportedOperationException`で失敗します。コレクションが可変かどうかは、その型を見ただけでは判別できません。

Javaとは異なり、Kotlinでは必要に応じて可変または読み取り専用のコレクションを明示的に宣言します。
読み取り専用コレクションを変更しようとすると、コードはコンパイルされません。

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // これはOKです
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // コンパイルエラー - 未解決の参照: add
```
{id="mutability-kotlin"}

不変性に関する詳細については、[Kotlinコーディング規約](coding-conventions.md#immutability)のページを参照してください。

## 共変性

Javaでは、子孫型（descendant type）のコレクションを、祖先型（ancestor type）のコレクションを受け取る関数に渡すことはできません。
例えば、`Rectangle`が`Shape`を継承している場合、`Rectangle`要素のコレクションを`Shape`要素のコレクションを受け取る関数に渡すことはできません。
コードをコンパイル可能にするには、`? extends Shape`型を使用すると、その関数は`Shape`の任意の子孫型を持つコレクションを受け取ることができます。

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* List<Shape>をそのまま使用した場合、以下の引数としてList<Rectangle>でこの関数を呼び出すとコードはコンパイルされません */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

Kotlinでは、読み取り専用のコレクション型は[共変（covariant）](generics.md#variance)です。これは、`Rectangle`クラスが`Shape`クラスを継承している場合、`List<Shape>`型が要求される場所であればどこでも`List<Rectangle>`型を使用できることを意味します。
言い換えれば、コレクション型は要素型と同じサブタイピング関係を持ちます。マップは値型に対しては共変ですが、キー型に対しては共変ではありません。
可変コレクションは共変ではありません – これは実行時エラーにつながる可能性があります。

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

[コレクションの型](collections-overview.md#collection-types)についてはこちらを参照してください。

## レンジとプログレッション

Kotlinでは、[レンジ](ranges.md)を使用して区間を作成できます。例えば、`Version(1, 11)..Version(1, 30)`は`1.11`から`1.30`までのすべてのバージョンを含みます。
`in`演算子を使用して、バージョンがレンジ内にあるか確認できます: `Version(0, 9) in versionRange`。

Javaでは、`Version`が両方の境界に適合するかを手動で確認する必要があります。

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

Kotlinでは、レンジをオブジェクト全体として操作します。2つの変数を作成して`Version`と比較する必要はありません。

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

いずれかの境界を除外する必要がある場合（例えば、バージョンが最小バージョン以上（`>=`）かつ最大バージョン未満（`<`）であるかを確認する場合）は、これらの包括的なレンジは役に立ちません。

## 複数の基準による比較

Javaでは、複数の基準でオブジェクトを比較するために、[`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html)インターフェースの[`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)関数と[`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)関数を使用できます。
例えば、名前と年齢で人を比較するには:

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

Javaでは、次のように数値のシーケンスを生成できます。

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

Kotlinでは、_[シーケンス](sequences.md)_を使用します。シーケンスの多段階処理は、可能な限り遅延実行されます –
実際の計算は、処理チェーン全体の最終結果が要求されたときにのみ行われます。

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

シーケンスを使用すると、一部のフィルタリング操作を実行するために必要なステップ数を削減できる場合があります。
`Iterable`と`Sequence`の違いを示す[シーケンス処理の例](sequences.md#sequence-processing-example)を参照してください。

## リストからの要素の削除

Javaでは、[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))関数は削除する要素のインデックスを受け取ります。

整数要素を削除する場合、`remove()`関数の引数として`Integer.valueOf()`関数を使用します。

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // これはインデックスによる削除です
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

Kotlinでは、要素削除には2つのタイプがあります。
インデックスによる削除は[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)、
値による削除は[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)を使用します。

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

## マップのトラバース

Javaでは、[`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer))を介してマップをトラバースできます。

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

Kotlinでは、`for`ループまたはJavaの`forEach`に似た`forEach`を使用してマップをトラバースします。

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

Javaでは、コレクションのサイズを確認し、インデックスを使用することで、最初と最後の項目を安全に取得できます。

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

また、[`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)とその継承型に対して、[`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())および[`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())関数を使用することもできます。

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
[`Elvis演算子`](null-safety.md#elvis-operator)を使用すると、関数の結果に応じてすぐに追加のアクションを実行できます。例えば、`firstOrNull()`の場合:

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## リストからセットを作成する

Javaでは、[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)から[`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)を作成するには、[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection))関数を使用できます。

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

Javaでは、[Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)関数`groupingBy()`を使用して要素をグループ化できます。

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
Stream APIには`intermediate`操作と`terminal`操作があります。`filter()`は`intermediate`操作であり、ストリームを返します。
コレクションを出力として受け取るには、`collect()`のような`terminal`操作を使用する必要があります。
例えば、キーが`1`で終わり、値が`10`より大きいペアのみを残す場合:

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

Kotlinでは、フィルタリングはコレクションに組み込まれており、`filter()`はフィルタリングされたものと同じコレクション型を返します。
そのため、`filter()`とその述語（predicate）を書くだけで済みます。

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

[マップのフィルタリング](map-operations.md#filter)に関する詳細はこちらをご覧ください。

### 型による要素のフィルタリング

Javaでは、型によって要素をフィルタリングしてそれらに対してアクションを実行するために、[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html)演算子で型をチェックし、その後型キャストを行う必要があります。

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

Kotlinでは、コレクションで[`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)を呼び出すだけで、型キャストは[スマートキャスト](typecasts.md#smart-casts)によって行われます。

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

一部のタスクでは、すべての要素、どの要素も、または任意の要素が条件を満たすかをチェックする必要があります。
Javaでは、これらのチェックはすべて[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)の関数[`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate))、および[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))を介して行うことができます。

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

Kotlinでは、[`none()`、`any()`、`all()`](extensions.md)という[拡張関数](extensions.md)がすべての[Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable)オブジェクトで利用可能です。

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

[述語のテスト](collection-filtering.md#test-predicates)に関する詳細はこちらをご覧ください。

## コレクション変換操作

### 要素をジップする

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

単に要素のペアを出力するよりも複雑なことをしたい場合は、[Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)を使用できます。
上記の例では、レコードは`record AnimalDescription(String animal, String color) {}`となります。

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

`zip()`は[Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/)オブジェクトのリストを返します。

> コレクションのサイズが異なる場合、`zip()`の結果はより小さい方のサイズになります。大きい方のコレクションの最後の要素は結果に含まれません。
>
{style="note"}

### 要素を関連付ける

Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用して要素を特性と関連付けることができます。

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

* [Kotlin Koans](koans.md)にアクセスして、Kotlin構文を学ぶための演習を完了しましょう。各演習は失敗するユニットテストとして作成されており、それをパスさせることがあなたの仕事です。
* 他の[Kotlinイディオム](idioms.md)を確認してください。
* [Java to Kotlinコンバーター](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)を使用して、既存のJavaコードをKotlinに変換する方法を学びましょう。
* [Kotlinのコレクション](collections-overview.md)を発見してください。

お気に入りのイディオムがあれば、プルリクエストを送ってぜひ共有してください。