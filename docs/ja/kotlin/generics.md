[//]: # (title: ジェネリクス: in, out, where)

KotlinのクラスはJavaと同様に型パラメータを持つことができます。

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

このようなクラスのインスタンスを作成するには、型引数を提供するだけです。

```kotlin
val box: Box<Int> = Box<Int>(1)
```

しかし、パラメータがコンストラクタの引数などから推論できる場合は、型引数を省略できます。

```kotlin
val box = Box(1) // 1はInt型なので、コンパイラはそれがBox<Int>であると判断します
```

## バリアンス

Javaの型システムで最も扱いにくい側面の1つが、ワイルドカード型です（[Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)を参照）。
Kotlinにはこれらがありません。代わりに、Kotlinには宣言箇所でのバリアンス (declaration-site variance) と型プロジェクション (type projections) があります。

### Javaにおけるバリアンスとワイルドカード

なぜJavaにこれらの謎めいたワイルドカードが必要なのか考えてみましょう。まず、Javaのジェネリック型は**不変 (invariant)** です。
これは、`List<String>`が`List<Object>`のサブタイプ**ではない**ことを意味します。もし`List`が不変でなければ、Javaの配列と大差なく、
次のコードがコンパイルはされるものの、実行時に例外を引き起こすことになります。

```java
// Java
List<String> strs = new ArrayList<String>();

// Javaはここでコンパイル時に型不一致を報告します。
List<Object> objs = strs;

// もし、これが許されたらどうなるでしょうか？
// StringのリストにIntegerを入れられることになります。
objs.add(1);

// そして実行時に、Javaは
// ClassCastException: Integer cannot be cast to String をスローします。
String s = strs.get(0); 
```

Javaは実行時の安全性を保証するためにこのようなことを禁止しています。しかし、これには影響があります。例えば、`Collection`インターフェースの`addAll()`メソッドを考えてみましょう。
このメソッドのシグネチャは何でしょうか？直感的には、次のように書きたくなります。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

しかし、それでは次のこと（完全に安全な操作）を実行できなくなります。

```java
// Java

// addAllの素朴な宣言では、以下はコンパイルできません:
// Collection<String> は Collection<Object> のサブタイプではないため
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

そのため、`addAll()`の実際のシグネチャは次のようになっています。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

ワイルドカード型引数`? extends E`は、このメソッドが`E`のオブジェクトまたは`E`のサブタイプのコレクションを受け入れることを示します。
これは、`items`から`E`を安全に**読み出す**ことができるが（このコレクションの要素は`E`のサブクラスのインスタンスであるため）、
それが`E`のどの未知のサブタイプに従うかがわからないため、それに**書き込む**ことはできない、ということを意味します。
この制限と引き換えに、望ましい動作が得られます: `Collection<String>`は`Collection<? extends Object>`のサブタイプです。
言い換えれば、`extends`境界（上限境界）を持つワイルドカードは、型を**共変 (covariant)** にします。

これが機能する理由を理解する鍵は非常に単純です: コレクションからアイテムを**取り出す**ことしかできない場合、
`String`のコレクションを使用してそこから`Object`を読み出すのは問題ありません。逆に、アイテムをコレクションに**入れる**ことしかできない場合、
`Object`のコレクションを受け取ってそこに`String`を入れるのは問題ありません。Javaには`List<? super String>`があり、これは`String`またはそのいずれかのスーパータイプを受け入れます。

後者は**反変 (contravariance)** と呼ばれ、`List<? super String>`に対して`String`を引数として取るメソッドのみを呼び出すことができます
（例えば、`add(String)`や`set(int, String)`を呼び出すことができます）。`List<T>`で`T`を返すものを呼び出す場合、`String`ではなく`Object`が返されます。

Joshua Blochは、彼の著書「[Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html)」でこの問題をうまく説明しています
（項目31: 「APIの柔軟性を高めるために、境界付きワイルドカードを使用する」）。彼は、**読み出す**だけのオブジェクトを「プロデューサー」、**書き込む**だけのオブジェクトを「コンシューマー」と呼んでいます。彼は次のように推奨しています。

> 「最大限の柔軟性を得るには、プロデューサーまたはコンシューマーを表す入力パラメータにワイルドカード型を使用してください。」

そして、彼は次のニーモニックを提案しています: _PECS_ は _Producer-Extends, Consumer-Super_ の略です。

> プロデューサーオブジェクト、例えば`List<? extends Foo>`を使用する場合、このオブジェクトに対して`add()`や`set()`を呼び出すことはできませんが、
> これはそれが**不変 (immutable)** であることを意味するものではありません。例えば、`clear()`を呼び出してリストからすべてのアイテムを削除することを妨げるものは何もありません。
> `clear()`はパラメータを一切取らないためです。
>
> ワイルドカード（または他の型のバリアンス）によって保証される唯一のことは**型安全性 (type safety)** です。不変性は全く別の話です。
>
{style="note"}

### 宣言箇所でのバリアンス

ジェネリックインターフェース`Source<T>`があり、`T`をパラメータとして取るメソッドは持たず、`T`を返すメソッドのみを持つとします。

```java
// Java
interface Source<T> {
    T nextT();
}
```

この場合、`Source<String>`のインスタンスへの参照を`Source<Object>`型の変数に格納することは完全に安全です。
呼び出すべきコンシューマーメソッドが存在しないためです。しかし、Javaはこれを認識せず、依然として禁止しています。

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Javaでは許可されていません
    // ...
}
```

これを解決するには、`Source<? extends Object>`型のオブジェクトを宣言する必要があります。
これを行っても意味がありません。なぜなら、以前と同じメソッドをその変数に対してすべて呼び出すことができるため、より複雑な型によって付加価値は何もありません。
しかし、コンパイラはそれを知りません。

Kotlinには、この種のことをコンパイラに説明する方法があります。これは**宣言箇所でのバリアンス (declaration-site variance)** と呼ばれます。
`Source`の**型パラメータ**`T`にアノテーションを付けて、`Source<T>`のメンバーから`T`が**返される**（生成される）だけであり、決して消費されないことを保証できます。
これを行うには、`out`修飾子を使用します。

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // これはOKです。Tがoutパラメータであるため
    // ...
}
```

一般的なルールは次のとおりです: クラス`C`の型パラメータ`T`が`out`と宣言されている場合、それは`C`のメンバーの**出力 (out)** 位置にのみ現れることができますが、
その見返りとして`C<Base>`は`C<Derived>`のスーパータイプに安全にすることができます。

言い換えれば、クラス`C`はパラメータ`T`に対して**共変 (covariant)** である、または`T`が**共変**型パラメータであると言うことができます。
`C`は`T`の**プロデューサー**であり、`T`の**コンシューマーではない**と考えることができます。

`out`修飾子は**バリアンスアノテーション (variance annotation)** と呼ばれ、型パラメータの宣言箇所で提供されるため、**宣言箇所でのバリアンス (declaration-site variance)** を提供します。
これは、型使用箇所でのワイルドカードが型を共変にするJavaの**利用箇所でのバリアンス (use-site variance)** とは対照的です。

`out`に加えて、Kotlinには補完的なバリアンスアノテーション`in`があります。これは型パラメータを**反変 (contravariant)** にし、消費されるだけで生産されることはないことを意味します。
反変型の良い例は`Comparable`です。

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

`in`と`out`という言葉は自己説明的であるように見えます（C#で長らくうまく使用されてきたように）。
したがって、上記のニーモニックは実際には必要ありません。実際、より高い抽象度で言い換えることができます。

**[実存的](https://en.wikipedia.org/wiki/Existentialism)変換: 消費者は`in`、生産者は`out`！** :-)

## 型プロジェクション

### 利用箇所でのバリアンス: 型プロジェクション

型パラメータ`T`を`out`として宣言し、利用箇所でのサブタイピングの問題を回避するのは非常に簡単ですが、
中には実際に`T`を返すことしかできないように制限できないクラスもあります！
その良い例が`Array`です。

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

このクラスは`T`に関して共変でも反変でもありません。そして、これはある程度の柔軟性の欠如を引き起こします。次の関数を考えてみましょう。

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

この関数は、ある配列から別の配列にアイテムをコピーすることを想定しています。実際に適用してみましょう。

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 型は Array<Int> ですが、Array<Any> が期待されました
```

ここで、同じおなじみの問題に直面します: `Array<T>`は`T`において**不変**であり、`Array<Int>`も`Array<Any>`も互いのサブタイプではありません。
なぜでしょうか？これもまた、`copy`が予期せぬ動作をする可能性があるためです。例えば、`from`に`String`を書き込もうとするかもしれず、
もし実際に`Int`の配列を渡した場合、後で`ClassCastException`がスローされます。

`copy`関数が`from`に**書き込む**のを禁止するために、次のようにすることができます。

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

これは**型プロジェクション (type projection)** であり、`from`が単純な配列ではなく、制限された（プロジェクションされた）配列であることを意味します。
この場合、型パラメータ`T`を返すメソッドのみを呼び出すことができ、つまり`get()`のみを呼び出すことができます。
これが**利用箇所でのバリアンス (use-site variance)** への私たちのアプローチであり、Javaの`Array<? extends Object>`に相当しますが、少し単純です。

`in`を使って型をプロジェクションすることもできます。

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>`はJavaの`Array<? super String>`に相当します。これは、`String`、`CharSequence`、または`Object`の配列を`fill()`関数に渡すことができることを意味します。

### スタープロジェクション

型引数について何も知らないが、安全な方法でそれを使いたい場合があります。
ここで安全な方法とは、そのジェネリック型のプロジェクションを定義することです。
それにより、そのジェネリック型のすべての具体的なインスタンス化がそのプロジェクションのサブタイプになります。

Kotlinは、このために**スタープロジェクション (star-projection)** 構文を提供しています。

*   `Foo<out T : TUpper>`の場合、`T`が上限`TUpper`を持つ共変型パラメータであるとき、`Foo<*>`は`Foo<out TUpper>`と同じです。
    これは、`T`が不明な場合でも、`Foo<*>`から`TUpper`の値を安全に**読み出す**ことができることを意味します。
*   `Foo<in T>`の場合、`T`が反変型パラメータであるとき、`Foo<*>`は`Foo<in Nothing>`と同じです。
    これは、`T`が不明な場合、`Foo<*>`に安全に**書き込む**ことは何もできないことを意味します。
*   `Foo<T : TUpper>`の場合、`T`が上限`TUpper`を持つ不変型パラメータであるとき、`Foo<*>`は値を読み出す場合は`Foo<out TUpper>`と、
    値を書き込む場合は`Foo<in Nothing>`と同じです。

ジェネリック型が複数の型パラメータを持つ場合、それぞれを独立してプロジェクションできます。
例えば、型が`interface Function<in T, out U>`と宣言されている場合、次のスタープロジェクションを使用できます。

*   `Function<*, String>`は`Function<in Nothing, String>`を意味します。
*   `Function<Int, *>`は`Function<Int, out Any?>`を意味します。
*   `Function<*, *>`は`Function<in Nothing, out Any?>`を意味します。

> スタープロジェクションはJavaの生の型 (raw types) と非常によく似ていますが、より安全です。
>
{style="note"}

## ジェネリック関数

クラスだけでなく、関数も型パラメータを持つことができます。型パラメータは関数の名前の**前**に置かれます。

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 拡張関数
    // ...
}
```

ジェネリック関数を呼び出すには、呼び出し元で関数の名前の**後**に型引数を指定します。

```kotlin
val l = singletonList<Int>(1)
```

型引数はコンテキストから推論できる場合は省略できるため、次の例も機能します。

```kotlin
val l = singletonList(1)
```

## ジェネリック制約

特定の型パラメータに代入できるすべての可能な型のセットは、**ジェネリック制約 (generic constraints)** によって制限される場合があります。

### 上限境界

最も一般的な制約のタイプは**上限境界 (upper bound)** で、Javaの`extends`キーワードに相当します。

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

コロンの後に指定された型は**上限境界**であり、`Comparable<T>`のサブタイプのみが`T`に代入できることを示します。例:

```kotlin
sort(listOf(1, 2, 3)) // OK。IntはComparable<Int>のサブタイプです
sort(listOf(HashMap<Int, String>())) // エラー: HashMap<Int, String>はComparable<HashMap<Int, String>>のサブタイプではありません
```

デフォルトの上限境界（指定がない場合）は`Any?`です。山かっこ内に指定できる上限境界は1つだけです。
同じ型パラメータに複数の上限境界が必要な場合は、個別の`where`句が必要です。

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

渡される型は、`where`句のすべての条件を同時に満たす必要があります。上記の例では、`T`型は`CharSequence`と`Comparable`の**両方**を実装する必要があります。

## 確実な非NULL型

ジェネリックなJavaクラスやインターフェースとの相互運用を容易にするため、Kotlinはジェネリック型パラメータを**確実な非NULL (definitely non-nullable)** として宣言することをサポートしています。

ジェネリック型`T`を確実な非NULLとして宣言するには、`T & Any`と型を宣言します。例えば: `T & Any`。

確実な非NULL型は、NULL許容な[上限境界](#upper-bounds)を持つ必要があります。

確実な非NULL型を宣言する最も一般的な使用ケースは、`@NotNull`を引数に含むJavaメソッドをオーバーライドしたい場合です。
例えば、`load()`メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlinで`load()`メソッドを正常にオーバーライドするには、`T1`を確実な非NULLとして宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 は確実な非NULL型です
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlinのみで作業している場合、Kotlinの型推論がこれを処理してくれるため、明示的に確実な非NULL型を宣言する必要はほとんどありません。

## 型消去

Kotlinがジェネリック宣言の使用に対して行う型安全性のチェックは、コンパイル時に行われます。
実行時には、ジェネリック型のインスタンスは実際の型引数に関する情報を保持しません。
型情報は**消去 (erased)** されると言われます。例えば、`Foo<Bar>`と`Foo<Baz?>`のインスタンスは、単に`Foo<*>`に消去されます。

### ジェネリクス型チェックとキャスト

型消去のため、実行時にジェネリック型のインスタンスが特定の型引数で作成されたかどうかを一般的にチェックする方法はありません。
そしてコンパイラは`ints is List<Int>`や`list is T`（型パラメータ）のような`is`チェックを禁止します。
ただし、スタープロジェクションされた型に対してインスタンスをチェックすることはできます。

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // アイテムは `Any?` 型として扱われます
}
```

同様に、インスタンスの型引数が静的に（コンパイル時に）チェックされている場合、
型の非ジェネリック部分を含む`is`チェックまたはキャストを行うことができます。この場合、山かっこが省略されることに注意してください。

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` は `ArrayList<String>` にスマートキャストされます
    }
}
```

型引数を省略した同じ構文は、型引数を考慮しないキャスト（`list as ArrayList`など）にも使用できます。

ジェネリック関数呼び出しの型引数も、コンパイル時にのみチェックされます。
関数本体内では、型パラメータを型チェックに使用することはできず、型パラメータへの型キャスト（`foo as T`）は未検査です。
唯一の例外は、[再具体化された型パラメータ](inline-functions.md#reified-type-parameters)を持つインライン関数です。
これらは各呼び出し箇所で実際の型引数がインライン化されます。これにより、型パラメータの型チェックとキャストが可能になります。
ただし、チェックまたはキャスト内で使用されるジェネリック型のインスタンスには、上記で説明した制限が引き続き適用されます。
例えば、型チェック`arg is T`において、`arg`自体がジェネリック型のインスタンスである場合、その型引数は依然として消去されます。

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // コンパイルは通るが型安全性を損なう！
// さらに詳細なサンプルを展開

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // リストのアイテムがStringではないため、ClassCastExceptionをスローします
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未検査キャスト

`foo as List<String>`のような、具体的な型引数を持つジェネリック型への型キャストは、実行時にチェックできません。
これらの**未検査キャスト (unchecked casts)** は、型安全性が高レベルのプログラムロジックによって暗示されているが、コンパイラによって直接推論できない場合に使用できます。以下の例を参照してください。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// このファイルにInt型のマップを保存しました
val intsFile = File("ints.dictionary")

// 警告: 未検査キャスト: `Map<String, *>` から `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最後の行のキャストに対して警告が表示されます。コンパイラは実行時に完全にチェックできず、マップ内の値が`Int`であるという保証は提供しません。

未検査キャストを避けるためには、プログラムの構造を再設計することができます。上記の例では、`DictionaryReader<T>`および`DictionaryWriter<T>`インターフェースを、異なる型に対して型安全な実装で使用することができます。
未検査キャストを呼び出し元から実装の詳細に移動するために、適切な抽象化を導入できます。
[ジェネリックバリアンス](#variance)を適切に使用することも役立ちます。

ジェネリック関数では、[再具体化された型パラメータ](inline-functions.md#reified-type-parameters)を使用すると、`arg as T`のようなキャストがチェックされますが、`arg`の型が**独自の**型引数を持っており、それが消去される場合は例外です。

未検査キャストの警告は、警告が発生する文または宣言に`@Suppress("UNCHECKED_CAST")`を[アノテーション](annotations.md)で付加することで抑制できます。

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**JVM上で**: [配列型](arrays.md)（`Array<Foo>`）は要素の消去された型に関する情報を保持しており、
>配列型への型キャストは部分的にチェックされます。要素型のnull可能性と実際の型引数は依然として消去されます。
>例えば、キャスト`foo as Array<List<String>?>`は、`foo`が任意の`List<*>`を保持する配列である場合、それがnull許容であるかどうかにかかわらず成功します。
>
{style="note"}

## 型引数のアンダースコア演算子

アンダースコア演算子`_`は型引数に使用できます。これは、他の型が明示的に指定されている場合に、引数の型を自動的に推論するために使用します。

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
    // SomeImplementationがSomeClass<String>から派生しているため、TはStringと推論されます
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // OtherImplementationがSomeClass<Int>から派生しているため、TはIntと推論されます
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}