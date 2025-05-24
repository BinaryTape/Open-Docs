---
title: JavaとKotlinのコレクション
description: JavaのコレクションからKotlinのコレクションへの移行方法を学びます。このガイドでは、KotlinとJavaのリスト、ArrayList、マップ、セットなどのデータ構造について説明します。
---
_コレクション_とは、解決しようとしている問題にとって重要であり、一般的に操作される、可変個の項目（ゼロの場合もある）のグループのことです。
このガイドでは、JavaとKotlinにおけるコレクションの概念と操作について説明し、比較します。
JavaからKotlinへの移行や、Kotlinらしい方法でのコーディングに役立ちます。

このガイドの前半では、JavaとKotlinで同じコレクションに対する操作の簡単な用語集を紹介します。
[JavaとKotlinで同じ操作](#operations-that-are-the-same-in-java-and-kotlin)と
[Kotlinにしかない操作](#operations-that-don-t-exist-in-java-s-standard-library)に分かれています。
[可変性](#mutability)から始まるガイドの後半では、具体的な例を通していくつかの違いを説明します。

コレクションの概要については、[コレクションの概要](collections-overview)を参照するか、
Kotlin Developer AdvocateのSebastian Aignerによる[こちらの動画](https://www.youtube.com/watch?v=F8jj7e-_jFA)をご覧ください。

:::note
以下の例はすべて、JavaとKotlinの標準ライブラリAPIのみを使用しています。

:::

## JavaとKotlinで同じ操作

Kotlinには、Javaの対応するものとまったく同じに見えるコレクションに対する操作がたくさんあります。

### リスト、セット、キュー、デキューに対する操作

| 説明 | 共通の操作 | Kotlinの代替案 |
|-------------|-----------|---------------------|
| 要素を追加する | `add()`、`addAll()` | [`plusAssign`(`+=`) 演算子](collection-plus-minus)を使用する: `collection += element`、`collection += anotherCollection`. |
| コレクションに要素が含まれているか確認する | `contains()`、`containsAll()` | [`in` キーワード](collection-elements#check-element-existence)を使用して、演算子の形式で `contains()` を呼び出す: `element in collection`. |
| コレクションが空かどうかを確認する | `isEmpty()` | [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) を使用して、コレクションが空でないかどうかを確認する。 |
| 特定の条件で削除する | `removeIf()` | |
| 選択した要素のみを残す | `retainAll()` | |
| コレクションからすべての要素を削除する | `clear()` | |
| コレクションからストリームを取得する | `stream()` | Kotlinには、ストリームを処理する独自の方法がある: [シーケンス](#sequences) と、[`map()`](collection-filtering) や [`filter()`](#filter-elements) などのメソッド。 |
| コレクションからイテレータを取得する | `iterator()` | |

### マップに対する操作

| 説明 | 共通の操作 | Kotlinの代替案 |
|-------------|-----------|---------------------|
| 要素を追加する | `put()`、`putAll()`、`putIfAbsent()`| Kotlinでは、代入 `map[key] = value` は `put(key, value)` と同じように動作する。また、[`plusAssign`(`+=`) 演算子](collection-plus-minus)を使用することもできる: `map += Pair(key, value)` または `map += anotherMap`. |
| 要素を置換する | `put()`、`replace()`、`replaceAll()` | `put()` と `replace()` の代わりに、インデックス演算子 `map[key] = value` を使用する。 |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得する: `map[index]`. |
| マップに要素が含まれているか確認する | `containsKey()`、`containsValue()` | [`in` キーワード](collection-elements#check-element-existence)を使用して、演算子の形式で `contains()` を呼び出す: `element in map`. |
| マップが空かどうかを確認する |  `isEmpty()` | [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) を使用して、マップが空でないかどうかを確認する。 |
| 要素を削除する | `remove(key)`、`remove(key, value)` | [`minusAssign`(`-=`) 演算子](collection-plus-minus)を使用する: `map -= key`. |
| マップからすべての要素を削除する | `clear()` | |
| マップからストリームを取得する | エントリ、キー、または値に対する `stream()` | |

### リストにのみ存在する操作

| 説明 | 共通の操作 | Kotlinの代替案 |
|-------------|-----------|---------------------|
| 要素のインデックスを取得する | `indexOf()` | |
| 要素の最後のインデックスを取得する | `lastIndexOf()` | |
| 要素を取得する | `get()` | インデックス演算子を使用して要素を取得する: `list[index]`. |
| サブリストを取得する | `subList()` | |
| 要素を置換する | `set()`、 `replaceAll()` | `set()` の代わりに、インデックス演算子を使用する: `list[index] = value`. |

## 少し異なる操作

### 任意のコレクション型に対する操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| コレクションのサイズを取得する | `size()` | `count()`、`size` |
| ネストされたコレクション要素へのフラットなアクセスを取得する | `collectionOfCollections.forEach(flatCollection::addAll)` または `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations#flatten) または [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 指定された関数をすべての要素に適用する | `stream().map().collect()` | [`map()`](collection-filtering) |
| 指定された操作をコレクション要素に順番に適用し、累積された結果を返す | `stream().reduce()` | [`reduce()`、`fold()`](collection-aggregate#fold-and-reduce) |
| 分類子で要素をグループ化し、それらをカウントする | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping) |
| 条件でフィルタリングする | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| コレクション要素が条件を満たしているかどうかを確認する | `stream().noneMatch()`、`stream().anyMatch()`、`stream().allMatch()` | [`none()`、`any()`、`all()`](collection-filtering) |
| 要素をソートする | `stream().sorted().collect()` | [`sorted()`](collection-ordering#natural-order) |
| 最初のN個の要素を取得する | `stream().limit(N).collect()` | [`take(N)`](collection-parts#take-and-drop) |
| 述語を持つ要素を取得する | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts#take-and-drop) |
| 最初のN個の要素をスキップする | `stream().skip(N).collect()` | [`drop(N)`](collection-parts#take-and-drop) |
| 述語を持つ要素をスキップする | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts#take-and-drop) |
| コレクション要素とそれらに関連付けられた特定の値からマップを構築する | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations#associate) |

上記のすべての操作をマップで実行するには、最初にマップの `entrySet` を取得する必要があります。

### リストに対する操作

| 説明 | Java | Kotlin |
|-------------|------|--------|
| リストを自然な順序でソートする | `sort(null)` | `sort()` |
| リストを降順でソートする | `sort(comparator)` | `sortDescending()` |
| リストから要素を削除する | `remove(index)`、`remove(element)`| `removeAt(index)`、`remove(element)` または [`collection -= element`](collection-plus-minus) |
| リストのすべての要素を特定の値で埋める | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| リストから一意の要素を取得する | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Javaの標準ライブラリに存在しない操作

* [`zip()`, `unzip()`](collection-transformations) – コレクションを変換する。
* [`aggregate()`](collection-grouping) – 条件でグループ化する。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts#take-and-drop) – 述語で要素を取得またはドロップする。
* [`slice()`, `chunked()`, `windowed()`](collection-parts) – コレクションの一部を取得する。
* [プラス（`+`）およびマイナス（`-`）演算子](collection-plus-minus) – 要素を追加または削除する。

`zip()`、`chunked()`、`windowed()`、およびその他の操作について詳しく知りたい場合は、Sebastian AignerによるKotlinの高度なコレクション操作に関するこちらの動画をご覧ください。

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 可変性

Javaには、可変コレクションがあります:

```java
// Java
// このリストは可変です！
public List<Customer> getCustomers() { ... }
```

部分的に可変のもの:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // ランタイムで `UnsupportedOperationException` で失敗する
```

そして、不変のもの:

```java
// Java
List<String> numbers = new LinkedList<>();
// このリストは不変です！
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // ランタイムで `UnsupportedOperationException` で失敗する
```

最後の2つのコードをIntelliJ IDEAで記述すると、IDEは不変オブジェクトを変更しようとしていることを警告します。
このコードはコンパイルされ、ランタイムで `UnsupportedOperationException` で失敗します。
型を見ても、コレクションが可変かどうかを判断することはできません。

Javaとは異なり、Kotlinでは、ニーズに応じて可変コレクションまたは読み取り専用コレクションを明示的に宣言します。
読み取り専用コレクションを変更しようとすると、コードはコンパイルされません:

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // これはOK
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // コンパイルエラー - Unresolved reference: add
```

不変性については、[Kotlinコーディング規約](coding-conventions#immutability)ページをご覧ください。

## 共変性

Javaでは、子孫型を持つコレクションを、先祖型のコレクションを受け取る関数に渡すことはできません。
たとえば、`Rectangle` が `Shape` を拡張する場合、`Rectangle` 要素のコレクションを、`Shape` 要素のコレクションを受け取る関数に渡すことはできません。
コードをコンパイル可能にするには、`? extends Shape` 型を使用して、関数が `Shape` の任意の継承者を持つコレクションを受け取ることができるようにします:

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* List<Shape> のみを使用すると、以下の引数として List<Rectangle> を使用してこの関数を呼び出すときにコードはコンパイルされません */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```

Kotlinでは、読み取り専用コレクション型は[共変](generics#variance)です。
これは、`Rectangle` クラスが `Shape` クラスから継承されている場合、`List<Shape>` 型が必要な場所であればどこでも `List<Rectangle>` 型を使用できることを意味します。
言い換えれば、コレクション型は要素型と同じサブタイピング関係を持ちます。マップは値型に対しては共変ですが、キー型に対しては共変ではありません。
可変コレクションは共変ではありません - これにより、ランタイムエラーが発生します。

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

[コレクション型](collections-overview#collection-types)の詳細はこちらをご覧ください。

## 範囲とプログレッション

Kotlinでは、[範囲](ranges)を使用して間隔を作成できます。
たとえば、`Version(1, 11)..Version(1, 30)` には、`1.11` から `1.30` までのすべてのバージョンが含まれます。
`in` 演算子を使用して、バージョンが範囲内にあることを確認できます: `Version(0, 9) in versionRange`.

Javaでは、`Version` が両方の境界に適合するかどうかを手動で確認する必要があります:

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

Kotlinでは、範囲をオブジェクト全体として操作します。2つの変数を作成して `Version` と比較する必要はありません:

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

バージョンが最小バージョン以上（`>=`）で、最大バージョン未満（`<`）かどうかを確認するなど、境界の1つを除外する必要がある場合、これらの包括的な範囲は役に立ちません。

## 複数の基準による比較

Javaでは、オブジェクトを複数の基準で比較するために、[`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)
および [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
関数を[`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html)インターフェースから使用できます。
たとえば、名前と年齢で人を比較するには:

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

Kotlinでは、比較するフィールドを列挙するだけです:

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

## シーケンス

Javaでは、次のように数値のシーケンスを生成できます:

```java
// Java
int sum = IntStream.iterate(1, e `->` e + 3)
    .limit(10).sum();
System.out.println(sum); // 145を出力
```

Kotlinでは、_[シーケンス](sequences)_を使用します。
シーケンスの複数ステップ処理は、可能な限り遅延して実行されます -
実際の計算は、処理チェーン全体の結果が要求された場合にのみ行われます。

```kotlin
fun main() {

    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // 145を出力

}
```

シーケンスは、一部のフィルタリング操作を実行するために必要なステップ数を減らすことができます。
[`Iterable`](sequences#sequence-processing-example) と `Sequence` の違いを示す[シーケンス処理の例](sequences#sequence-processing-example)を参照してください。

## リストからの要素の削除

Javaでは、[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))
関数は、削除する要素のインデックスを受け入れます。

整数要素を削除する場合は、`Integer.valueOf()` 関数を `remove()` 関数の引数として使用します:

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // これはインデックスで削除します
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```

Kotlinでは、要素の削除には2つの種類があります:
[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) によるインデックス指定と
[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html) による値指定です。

```kotlin
fun main() {

    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]

}
```

## マップを走査する

Javaでは、[`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer))を使用してマップを走査できます:

```java
// Java
numbers.forEach((k,v) `->` System.out.println("Key = " + k + ", Value = " + v));
```

Kotlinでは、`for` ループまたはJavaの `forEach` と同様の `forEach` を使用して、マップを走査します:

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// または
numbers.forEach { (k, v) `->` println("Key = $k, Value = $v") }
```

## 空の可能性があるコレクションの最初と最後の項目を取得する

Javaでは、コレクションのサイズを確認し、インデックスを使用することで、最初と最後の項目を安全に取得できます:

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```

[`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())
および [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())
関数を[`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)および
その継承者に対して使用することもできます:

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```

Kotlinでは、特別な関数[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)と
[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)があります。
[`Elvis 演算子`](null-safety#elvis-operator)を使用すると、関数の結果に応じて、すぐに追加のアクションを実行できます。
たとえば、`firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // 空の可能性がある
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```

## リストからセットを作成する

Javaでは、[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)から[`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)を作成するために、
[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection))関数を使用できます:

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```

Kotlinでは、関数 `toSet()` を使用します:

```kotlin
fun main() {

    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)

}
```

## 要素をグループ化する

Javaでは、[Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)関数の `groupingBy()` を使用して要素をグループ化できます:

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

Kotlinでは、関数[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)を使用します:

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {

    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))

}
```

## 要素をフィルタリングする

Javaでは、コレクションから要素をフィルタリングするには、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用する必要があります。
Stream APIには、`intermediate` および `terminal` 操作があります。`filter()` は、ストリームを返す中間操作です。
コレクションを出力として受信するには、`collect()` のような終端操作を使用する必要があります。
たとえば、キーが `1` で終わり、値が `10` より大きいペアのみを残す場合:

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry `->` entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```

Kotlinでは、フィルタリングはコレクションに組み込まれており、`filter()` はフィルタリングされたのと同じコレクション型を返します。
したがって、記述する必要があるのは `filter()` とその述語だけです:

```kotlin
fun main() {

    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) `->` key.endsWith("1") && value > 10 }
    println(filteredNumbers)

}
```

[マップのフィルタリング](map-operations#filter)の詳細はこちらをご覧ください。

### 型で要素をフィルタリングする

Javaでは、型で要素をフィルタリングし、それらに対してアクションを実行するには、[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html)演算子で型を確認し、型キャストを実行する必要があります:

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
    numbers.stream().filter(it `->` it instanceof String)
        .forEach( it `->` System.out.println(((String) it).toUpperCase()));
}
```

Kotlinでは、コレクションで[`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)を呼び出すだけで、型キャストは[スマートキャスト](typecasts#smart-casts)によって行われます:

```kotlin
// Kotlin
fun main() {

    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }

}
```

### 述語をテストする

一部のタスクでは、すべて、なし、または一部の要素が条件を満たしているかどうかを確認する必要があります。
Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)関数の[`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate))、および
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))を介して、これらのチェックをすべて実行できます:

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it `->` it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it `->` it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it `->` it.endsWith("e"))); // false
}
```

Kotlinでは、[拡張関数](extensions) `none()`、`any()`、および `all()`
は、すべての[Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable)オブジェクトで使用できます:

```kotlin
fun main() {

// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })

}
```

[述語のテスト](collection-filtering#test-predicates)の詳細はこちらをご覧ください。

## コレクション変換操作

### 要素をzipする

Javaでは、2つのコレクションの同じ位置にある要素からペアを作成するには、それらを同時に反復処理します:

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

出力に要素のペアを出力するよりも複雑なことを実行したい場合は、[レコード](https://blogs.oracle.com/javamagazine/post/records-come-to-java)を使用できます。
上記の例では、レコードは `record AnimalDescription(String animal, String color) {}` になります。

Kotlinでは、[`zip()`](collection-transformations#zip) 関数を使用して同じことを行います:

```kotlin
fun main() {

    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal `->` 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })

}
```

`zip()` は、[Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) オブジェクトのリストを返します。

:::note
コレクションのサイズが異なる場合、`zip()` の結果は小さいサイズになります。
大きいコレクションの最後の要素は、結果に含まれません。

:::

### 要素を関連付ける

Javaでは、[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) を使用して、要素を特性に関連付けることができます:

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number `->` number, String::length));
    System.out.println(wordAndLength);
}
```

Kotlinでは、[`associate()`](collection-transformations#associate) 関数を使用します:

```kotlin
fun main() {

    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

## 次は何をしますか？

* [Kotlin Koans](koans)にアクセスする – 演習を完了して Kotlin 構文を学ぶ。各演習は失敗する単体テストとして作成されており、あなたの仕事はそれを合格させることです。
* 他の[Kotlinイディオム](idioms)を確認する。
* [JavaからKotlinへのコンバーター](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学ぶ。
* [Kotlinのコレクション](collections-overview)を発見する。

お気に入りのイディオムがある場合は、プルリクエストを送信して共有してください。