---
title: "ジェネリクス: in, out, where"
---
Kotlinのクラスは、Javaと同様に型パラメータを持つことができます。

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

そのようなクラスのインスタンスを作成するには、単に型引数を指定します。

```kotlin
val box: Box<Int> = Box<Int>(1)
```

ただし、パラメータがコンストラクタ引数などから推測できる場合は、型引数を省略できます。

```kotlin
val box = Box(1) // 1 は Int 型なので、コンパイラは Box<Int> であることを理解します
```

## Variance (変性)

Javaの型システムの最も難しい点の1つは、ワイルドカード型です（[Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)を参照）。
Kotlinにはこれらはありません。代わりに、Kotlinには宣言場所の変性と型プロジェクションがあります。

### Javaの変性とワイルドカード

Javaがこれらの不可解なワイルドカードを必要とする理由について考えてみましょう。まず、Javaのジェネリック型は_不変_です。
つまり、`List<String>`は`List<Object>`のサブタイプ_ではありません_。`List`が_不変_でなければ、
次のコードがコンパイルされて実行時に例外が発生するため、Javaの配列よりも優れていません。

```java
// Java
List<String> strs = new ArrayList<String>();

// Javaは、ここでコンパイル時に型ミスマッチを報告します。
List<Object> objs = strs;

// もしそうでなかったら？
// 文字列のリストに整数を入れることができたでしょう。
objs.add(1);

// そして実行時に、Javaはスローします
// ClassCastException: Integer を String にキャストできません
String s = strs.get(0);
```

Javaはランタイムの安全性を保証するために、このようなことを禁止しています。しかし、これには影響があります。たとえば、
`Collection`インターフェイスの`addAll()`メソッドについて考えてみましょう。このメソッドのシグネチャは何ですか？直感的には、
次のように記述します。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

しかし、それでは、以下を行うことができなくなります（これは完全に安全です）。

```java
// Java

// 以下は、addAllのナイーブな宣言ではコンパイルされません。
// Collection<String>はCollection<Object>のサブタイプではありません。
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

そのため、`addAll()`の実際のシグネチャは次のとおりです。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_ワイルドカード型引数_ `? extends E`は、このメソッドが`E`のオブジェクトのコレクション、
_または_ `E` _のサブタイプ_を受け入れることを示します。これは、itemsから安全に`E`を_読み取る_ことができることを意味します
（このコレクションの要素はEのサブクラスのインスタンスです）が、_書き込むことはできません_。
なぜなら、どのオブジェクトがEの不明なサブタイプに準拠しているかわからないからです。
この制限の代わりに、目的の動作が得られます。`Collection<String>`は`Collection<? extends Object>`のサブタイプ_です_。
言い換えれば、_extends_-bound（_上限_）を持つワイルドカードは、型を_共変_にします。

これが機能する理由を理解するための鍵は非常に簡単です。コレクションからアイテムを_取得_できるだけの場合、
`String`のコレクションを使用して、そこから`Object`を読み取ることは問題ありません。逆に、コレクションにアイテムを_入れる_ことができるだけの場合、
`Object`のコレクションを取得して、そこに`String`を入れることは問題ありません。Javaには
`List<? super String>`があり、`String`またはそのスーパータイプを受け入れます。

後者は_反変_と呼ばれ、`List<? super String>`に対して`String`を引数として取るメソッドのみを呼び出すことができます
（たとえば、`add(String)`または`set(int, String)`を呼び出すことができます）。`List<T>`で`T`を返すものを呼び出す場合、
`String`ではなく`Object`が返されます。

Joshua Blochは、彼の著書[Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html)で、この問題をうまく説明しています。
（項目31：「APIの柔軟性を高めるために、境界付きワイルドカードを使用する」）。彼は、_読み取り専用_のオブジェクトを_プロデューサー_、
_書き込み専用_のオブジェクトを_コンシューマー_と名付けています。彼は次のように推奨しています。

:::note
「最大限の柔軟性を得るには、プロデューサーまたはコンシューマーを表す入力パラメータにワイルドカード型を使用します。」

次に、彼は次のニーモニックを提案します。_PECS_は_Producer-Extends, Consumer-Super_を表します。

プロデューサーオブジェクト、たとえば`List<? extends Foo>`を使用する場合、このオブジェクトに対して`add()`または`set()`を呼び出すことは許可されていませんが、
これは_不変_であることを意味するものではありません。たとえば、`clear()`を呼び出してリストからすべてのアイテムを削除することを妨げるものは何もありません。
なぜなら、`clear()`はパラメータをまったく取らないからです。

ワイルドカード（または他のタイプの変性）によって保証される唯一のものは、_型安全性_です。不変性は完全に別の話です。

:::

### 宣言場所の変性

パラメータとして`T`を受け取るメソッドを持たず、`T`を返すメソッドのみを持つジェネリックインターフェイス`Source<T>`があると仮定しましょう。

```java
// Java
interface Source<T> {
    T nextT();
}
```

次に、`Source<String>`のインスタンスへの参照を、
`Source<Object>`型の変数に格納することは完全に安全です。呼び出すコンシューマーメソッドはありません。しかし、Javaはこれを知らず、それでもそれを禁止しています。

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Javaでは許可されていません
    // ...
}
```

これを修正するには、`Source<? extends Object>`型のオブジェクトを宣言する必要があります。そうすることは意味がありません。
なぜなら、以前と同じメソッドをすべてそのような変数で呼び出すことができるからです。したがって、より複雑な型によって追加される値はありません。
しかし、コンパイラはそれを知りません。

Kotlinには、この種のことをコンパイラに説明する方法があります。これは_宣言場所の変性_と呼ばれます。
`Source`の_型パラメータ_ `T`に注釈を付けて、`Source<T>`のメンバーから_のみ_返される（生成される）ようにし、
決して消費されないようにすることができます。
これを行うには、`out`修飾子を使用します。

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // これはOKです。なぜなら、Tはout-parameterだからです
    // ...
}
```

一般的な規則は次のとおりです。クラス`C`の型パラメータ`T`が`out`と宣言されている場合、`C`のメンバーの_out_-positionでのみ発生する可能性があります。
しかし、その代わりに`C<Base>`は`C<Derived>`のスーパータイプになることができます。

言い換えれば、クラス`C`はパラメータ`T`で_共変_である、または`T`は_共変_型パラメータであると言うことができます。
`C`は`T`の_プロデューサー_であり、`T`の_コンシューマー_ではないと考えることができます。

`out`修飾子は_変性アノテーション_と呼ばれ、型パラメータの宣言サイトで提供されるため、
_宣言場所の変性_を提供します。
これは、型の使用法でワイルドカードが型を共変にするJavaの_使用場所の変性_とは対照的です。

`out`に加えて、Kotlinは補完的な変性アノテーション`in`を提供します。これにより、型パラメータは_反変_になり、
消費されるだけで生成されることはありません。反変型の良い例は`Comparable`です。

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 は Double 型であり、Number のサブタイプです
    // したがって、x を Comparable<Double> 型の変数に代入できます
    val y: Comparable<Double> = x // OK!
}
```

_in_と_out_という言葉は、それ自体で説明されているように思われます（C#でかなり長い間正常に使用されてきたため）。
したがって、上記のニーモニックは実際には必要ありません。実際、より高いレベルの抽象化で言い換えることができます。

**[実存的](https://en.wikipedia.org/wiki/Existentialism)変換：コンシューマーはイン、プロデューサーはアウト！** :-)

## 型プロジェクション

### 使用場所の変性：型プロジェクション

型パラメータ`T`を`out`として宣言し、使用場所でのサブタイピングに関する問題を回避することは非常に簡単ですが、
一部のクラスは実際に`T`のみを返すように制限_できません_！
この良い例は`Array`です。

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

このクラスは、`T`で共変でも反変でもありません。そして、これは特定の柔軟性の欠如をもたらします。次の関数について考えてみましょう。

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

この関数は、ある配列から別の配列にアイテムをコピーすることを目的としています。実際に適用してみましょう。

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" }
copy(ints, any)
//   ^ 型は Array<Int> ですが、Array<Any> が予期されていました
```

ここで、同じおなじみの問題が発生します。`Array<T>`は`T`で_不変_であるため、`Array<Int>`も`Array<Any>`も
もう一方のサブタイプではありません。なぜですか？繰り返しますが、これは`copy`が予期しない動作をする可能性があるためです。たとえば、
`String`を`from`に書き込もうとする可能性があり、実際に`Int`の配列を渡すと、後で`ClassCastException`がスローされます。

`copy`関数が`from`に_書き込む_ことを禁止するには、次のようにすることができます。

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

これは_型プロジェクション_です。つまり、`from`は単純な配列ではなく、制限された（_射影された_）配列です。
この場合、型パラメータ`T`を返すメソッドのみを呼び出すことができます。つまり、`get()`のみを呼び出すことができます。
これは_使用場所の変性_へのアプローチであり、Javaの`Array<? extends Object>`に対応しながら、わずかに簡単になっています。

`in`で型を射影することもできます。

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>`はJavaの`Array<? super String>`に対応します。これは、`String`、`CharSequence`、
または`Object`の配列を`fill()`関数に渡すことができることを意味します。

### Star-projections（スタープロジェクション）

型引数について何も知らないが、それでも安全な方法で使用したい場合があります。
ここでの安全な方法は、ジェネリック型のそのようなプロジェクションを定義することです。そのジェネリック型のすべての具体的なインスタンス化は、
そのプロジェクションのサブタイプになります。

Kotlinは、このためのいわゆる_スタープロジェクション_構文を提供します。

- `Foo<out T : TUpper>`の場合、`T`は上限`TUpper`を持つ共変型パラメータであり、`Foo<*>`は
  `Foo<out TUpper>`と同等です。これは、`T`が不明な場合に、`Foo<*>`から`TUpper`の値を安全に_読み取る_ことができることを意味します。
- `Foo<in T>`の場合、`T`は反変型パラメータであり、`Foo<*>`は`Foo<in Nothing>`と同等です。これは、
  `T`が不明な場合、安全な方法で`Foo<*>`に_書き込む_ことができるものはないことを意味します。
- `Foo<T : TUpper>`の場合、`T`は上限`TUpper`を持つ不変型パラメータであり、`Foo<*>`は、
  値を読み取る場合は`Foo<out TUpper>`と同等であり、値を書き込む場合は`Foo<in Nothing>`と同等です。

ジェネリック型に複数の型パラメータがある場合、それぞれの型パラメータを個別に射影できます。
たとえば、型が`interface Function<in T, out U>`として宣言されている場合、次のスタープロジェクションを使用できます。

* `Function<*, String>`は`Function<in Nothing, String>`を意味します。
* `Function<Int, *>`は`Function<Int, out Any?>`を意味します。
* `Function<*, *>`は`Function<in Nothing, out Any?>`を意味します。

:::note
スタープロジェクションは、Javaのraw types（raw型）に非常によく似ていますが、安全です。

:::

## Generic functions（ジェネリック関数）

クラスだけが型パラメータを持つことができるわけではありません。関数も同様です。型パラメータは、関数の名前の_前_に配置されます。

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 拡張関数
    // ...
}
```

ジェネリック関数を呼び出すには、関数の名前_の後_に呼び出しサイトで型引数を指定します。

```kotlin
val l = singletonList<Int>(1)
```

型引数がコンテキストから推測できる場合は省略できるため、次の例も機能します。

```kotlin
val l = singletonList(1)
```

## Generic constraints（ジェネリック制約）

特定の型パラメータに代入できるすべての可能な型のセットは、_ジェネリック制約_によって制限される場合があります。

### 上限

最も一般的なタイプの制約は_上限_であり、Javaの`extends`キーワードに対応します。

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

コロンの後に指定された型は_上限_であり、`Comparable<T>`のサブタイプのみが`T`に代入できることを示します。次に例を示します。

```kotlin
sort(listOf(1, 2, 3)) // OK。IntはComparable<Int>のサブタイプです
sort(listOf(HashMap<Int, String>())) // エラー: HashMap<Int, String> は Comparable<HashMap<Int, String>> のサブタイプではありません
```

デフォルトの上限（指定されていない場合）は`Any?`です。山かっこ内には1つの上限のみを指定できます。
同じ型パラメータに複数の上限が必要な場合は、別の_where_-clauseが必要です。

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

渡された型は、`where`句のすべての条件を同時に満たす必要があります。上記の例では、`T`型は`CharSequence`と`Comparable`の_両方_を実装する必要があります。

## Definitely non-nullable types（非Nullable型）

ジェネリックなJavaのクラスやインターフェースとの相互運用性を容易にするために、Kotlinはジェネリックな型パラメータを
**definitely non-nullable（非Nullable型）**として宣言することをサポートしています。

ジェネリック型`T`を非Nullable型として宣言するには、型を`& Any`で宣言します。例：`T & Any`。

非Nullable型は、Nullableな[上限](#upper-bounds)を持つ必要があります。

非Nullable型を宣言する最も一般的なユースケースは、`@NotNull`を引数として含むJavaのメソッドをオーバーライドする場合です。
たとえば、`load()`メソッドについて考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlinで`load()`メソッドを正常にオーバーライドするには、`T1`を非Nullable型として宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1は非Nullable型です
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlinのみを操作する場合、Kotlinの型推論がこれを処理してくれるため、非Nullable型を明示的に宣言する必要はほとんどありません。

## Type erasure（型消去）

Kotlinがジェネリックな宣言の使用法に対して実行する型安全性のチェックは、コンパイル時に行われます。
実行時には、ジェネリック型のインスタンスは、実際の型引数に関する情報を保持しません。
型情報は_消去される_と言われます。たとえば、`Foo<Bar>`と`Foo<Baz?>`のインスタンスは、
単に`Foo<*>`に消去されます。

### Generics type checks and casts（ジェネリック型のチェックとキャスト）

型消去のため、ジェネリック型のインスタンスが特定の型引数で実行時に作成されたかどうかをチェックする方法は一般的ではありません。
コンパイラは、`ints is List<Int>`や`list is T`（型パラメータ）のような`is`チェックを禁止します。
ただし、インスタンスをスター射影された型に対してチェックすることはできます。

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // アイテムは`Any?`として型付けされます
}
```

同様に、インスタンスの型引数が静的に（コンパイル時に）チェックされている場合は、
型の非ジェネリック部分を含む`is`チェックまたはキャストを行うことができます。この場合、山かっこが省略されていることに注意してください。

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list`は`ArrayList<String>`にスマートキャストされます
    }
}
```

型引数を省略した同じ構文は、型引数を考慮しないキャストに使用できます。`list as ArrayList`。

ジェネリック関数の呼び出しの型引数も、コンパイル時にのみチェックされます。関数本体内では、
型パラメータを型チェックに使用することはできません。また、型パラメータへの型キャスト（`foo as T`）はチェックされません。
唯一の例外は、[reified type parameters（実体化された型パラメータ）](inline-functions#reified-type-parameters)を持つinline関数です。
これらは、各呼び出しサイトで実際の型引数がインライン化されます。これにより、型パラメータの型チェックとキャストが可能になります。
ただし、上記の制限は、チェックまたはキャストで使用されるジェネリック型のインスタンスには引き続き適用されます。
たとえば、型チェック`arg is T`では、`arg`がジェネリック型のインスタンス自体である場合、その型引数は依然として消去されます。

```kotlin

inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // コンパイルはできますが、型安全性が損なわれます！
// 詳細については、サンプルを展開してください

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // これにより、リストアイテムがStringではないため、ClassCastExceptionがスローされます
}
```

### Unchecked casts（チェックされていないキャスト）

`foo as List<String>`のような具体的な型引数を持つジェネリック型への型キャストは、実行時にチェックできません。
これらのチェックされていないキャストは、型安全性が高レベルのプログラムロジックによって暗示されているが、
コンパイラによって直接推測できない場合に使用できます。以下の例を参照してください。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("文字列から任意の要素へのマッピングを読み取ります。")
}

// このファイルに`Int`を持つマップを保存しました
val intsFile = File("ints.dictionary")

// 警告：チェックされていないキャスト：`Map<String, *>`から`Map<String, Int>`へ
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最後の行のキャストで警告が表示されます。コンパイラは実行時に完全にチェックできず、
マップの値が`Int`であることを保証しません。

チェックされていないキャストを回避するには、プログラムの構造を再設計できます。上記の例では、
異なる型に対して型安全な実装を持つ`DictionaryReader<T>`および`DictionaryWriter<T>`インターフェイスを使用できます。
適切な抽象化を導入して、チェックされていないキャストを呼び出しサイトから実装の詳細に移動できます。
[generic variance（ジェネリック変性）](#variance)を適切に使用することも役立ちます。

ジェネリック関数では、[reified type parameters（実体化された型パラメータ）](inline-functions#reified-type-parameters)を使用すると、
`arg as T`のようなキャストがチェックされるようになります。ただし、`arg`の型に*独自の*消去された型引数がある場合は除きます。

チェックされていないキャストの警告は、発生するステートメントまたは
宣言を`@Suppress("UNCHECKED_CAST")`で[annotating（注釈）](annotations)することで抑制できます。

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

:::note
**JVM上**: [array types（配列型）](arrays) (`Array<Foo>`)は、要素の消去された型に関する情報を保持し、
配列型への型キャストは部分的にチェックされます。
要素型のnull可能性と実際の型引数は依然として消去されます。たとえば、
キャスト`foo as Array<List<String>?>`は、`foo`がnullableかどうかに関係なく、任意の`List<*>`を保持する配列である場合に成功します。

:::

## Underscore operator for type arguments（型引数のアンダースコア演算子）

アンダースコア演算子`_`は、型引数に使用できます。他の型が明示的に指定されている場合に、引数の型を自動的に推論するために使用します。

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // SomeImplementationがSomeClass<String>から派生しているため、TはStringとして推論されます
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // OtherImplementationがSomeClass<Int>から派生しているため、TはIntとして推論されます
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```