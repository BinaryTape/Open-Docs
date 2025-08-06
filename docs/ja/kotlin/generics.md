[//]: # (title: ジェネリクス: in, out, where)

Kotlinのクラスは、Javaと同様に型パラメータを持つことができます。

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

このようなクラスのインスタンスを作成するには、型引数を提供するだけです。

```kotlin
val box: Box<Int> = Box<Int>(1)
```

しかし、例えばコンストラクタ引数からパラメータを推論できる場合、型引数を省略することができます。

```kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that it is Box<Int>
```

## バリアンス

Javaの型システムの最も扱いにくい側面の1つは、ワイルドカード型 ([Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)を参照) です。
Kotlinにはこれらがありません。その代わりに、Kotlinには宣言サイトのバリアンス (declaration-site variance) と型プロジェクション (type projections) があります。

### Javaにおけるバリアンスとワイルドカード

Javaがこれらの不可解なワイルドカードを必要とする理由を考えてみましょう。まず、Javaのジェネリック型は_不変 (invariant)_ であり、`List<String>`は`List<Object>`の_サブタイプではない_ことを意味します。もし`List`が_不変_でなければ、Javaの配列と何ら変わらず、以下のコードはコンパイルは通るものの、実行時に例外を引き起こすことになります。

```java
// Java
List<String> strs = new ArrayList<String>();

// Java reports a type mismatch here at compile-time.
List<Object> objs = strs;

// What if it didn't?
// We would be able to put an Integer into a list of Strings.
objs.add(1);

// And then at runtime, Java would throw
// a ClassCastException: Integer cannot be cast to String
String s = strs.get(0); 
```

Javaは実行時の安全性を保証するためにこのようなことを禁止しています。しかし、これには影響があります。例えば、`Collection`インターフェースの`addAll()`メソッドを考えてみましょう。このメソッドのシグネチャは何でしょうか？直感的には、次のように書くでしょう。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

しかし、そうすると、以下のこと (完全に安全なこと) ができなくなります。

```java
// Java

// The following would not compile with the naive declaration of addAll:
// Collection<String> is not a subtype of Collection<Object>
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

そのため、`addAll()`の実際のシグネチャは次のようになります。

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

この_ワイルドカード型引数 (wildcard type argument)_ `? extends E`は、このメソッドが`E`のオブジェクト、_または`E`のサブタイプ_のコレクションを受け入れることを示しており、単に`E`自体だけではありません。これは、`E`をアイテムから安全に_読み取ることができる_ことを意味しますが (このコレクションの要素は`E`のサブクラスのインスタンスであるため)、その未知の`E`のサブタイプに準拠するオブジェクトが何であるか不明なため、それに_書き込むことはできません_。この制限と引き換えに、`Collection<String>`は`Collection<? extends Object>`のサブタイプであるという望ましい動作が得られます。言い換えれば、_extends_バウンド (_上限_) を持つワイルドカードは、型を_共変 (covariant)_ にします。

これが機能する理由を理解する鍵は非常に単純です。コレクションからアイテムを_取り出す_ことしかできないのであれば、`String`のコレクションを使用してそこから`Object`を読み取るのは問題ありません。逆に、コレクションにアイテムを_入れる_ことしかできないのであれば、`Object`のコレクションを受け取り、そこに`String`を入れるのは問題ありません。Javaには`List<? super String>`があり、これは`String`またはそのいずれかのスーパータイプを受け入れます。

後者は_反変 (contravariance)_ と呼ばれ、`List<? super String>`では`String`を引数に取るメソッド (例えば、`add(String)`や`set(int, String)`) のみを呼び出すことができます。`List<T>`で`T`を返す何かを呼び出す場合、`String`ではなく`Object`が得られます。

ジョシュア・ブロックは、彼の著書 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) の中で、この問題をよく説明しています (項目31: 「APIの柔軟性を高めるために境界付きワイルドカードを使用する」)。彼は、_読み取り専用_のオブジェクトを_Producers_、_書き込み専用_のオブジェクトを_Consumers_と名付けています。彼は次のように推奨しています。

>"最大限の柔軟性を得るには、プロデューサーまたはコンシューマーを表す入力パラメータにワイルドカード型を使用してください。"

そして彼は次のニーモニックを提案しています:_PECS_は_Producer-Extends, Consumer-Super_の頭文字です。

{style="note"}
> 例えば、`List<? extends Foo>`のようなプロデューサーオブジェクトを使用する場合、このオブジェクトに対して`add()`や`set()`を呼び出すことはできませんが、これはそれが_不変 (immutable)_ であることを意味するものではありません。例えば、`clear()`は一切パラメータを取らないため、リストからすべてのアイテムを削除するために`clear()`を呼び出すことを妨げるものはありません。
>
>ワイルドカード (または他の種類のバリアンス) によって保証される唯一のことは、_型安全性 (type safety)_ です。不変性 (immutability) はまったく別の話です。
>

### 宣言サイトのバリアンス

ジェネリックインターフェース`Source<T>`があり、`T`をパラメータとして取るメソッドは持たず、`T`を返すメソッドのみを持っていると仮定しましょう。

```java
// Java
interface Source<T> {
    T nextT();
}
```

そうであれば、`Source<String>`のインスタンスへの参照を`Source<Object>`型の変数に格納するのは完全に安全です。呼び出すべきコンシューマーメソッドがないためです。しかし、Javaはこれを知らず、依然としてそれを禁止します。

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Not allowed in Java
    // ...
}
```

これを修正するには、`Source<? extends Object>`型のオブジェクトを宣言する必要があります。これは意味がありません。なぜなら、このような変数に対して以前と同じすべてのメソッドを呼び出すことができ、より複雑な型によって追加される価値がないためです。しかし、コンパイラはそれを知りません。

Kotlinでは、このようなことをコンパイラに説明する方法があります。これは_宣言サイトのバリアンス (declaration-site variance)_ と呼ばれます。`Source`の_型パラメータ_`T`にアノテーションを付けて、それが`Source<T>`のメンバーから_返される_ (生成される) だけで、決して消費されないようにすることができます。これを行うには、`out`修飾子を使用します。

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // This is OK, since T is an out-parameter
    // ...
}
```

一般的なルールは次のとおりです。クラス`C`の型パラメータ`T`が`out`と宣言されている場合、それは`C`のメンバーの_out_位置にのみ現れることができますが、その代わりに`C<Base>`は`C<Derived>`のスーパータイプとして安全です。

言い換えれば、クラス`C`はパラメータ`T`に対して_共変 (covariant)_ であると言うこともできますし、`T`が_共変な型パラメータ (covariant type parameter)_ であると言うこともできます。`C`は`T`の_プロデューサー_であり、`T`の_コンシューマー_ではないと考えることができます。

`out`修飾子は_バリアンスアノテーション (variance annotation)_ と呼ばれ、型パラメータの宣言サイトで提供されるため、_宣言サイトのバリアンス_を提供します。これは、型が使用される場所でのワイルドカードが型を共変にするJavaの_使用サイトのバリアンス (use-site variance)_ とは対照的です。

`out`に加えて、Kotlinは補完的なバリアンスアノテーションである`in`を提供します。これは型パラメータを_反変 (contravariant)_ にします。つまり、消費されるだけで生成されることはありません。反変な型の良い例は`Comparable`です。

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
    // Thus, you can assign x to a variable of type Comparable<Double>
    val y: Comparable<Double> = x // OK!
}
```

`in`と`out`という単語は (C#で以前から成功裏に使用されているため) 自己説明的であるように見えます。したがって、上記で述べたニーモニックは実際には必要ありません。実際、より高い抽象レベルで言い換えることができます。

**[実存的](https://en.wikipedia.org/wiki/Existentialism) 変換: コンシューマーはin、プロデューサーはout！** :-)

## 型プロジェクション

### 使用サイトのバリアンス: 型プロジェクション

型パラメータ`T`を`out`と宣言し、使用サイトでのサブタイピングに関する問題を回避することは非常に簡単ですが、実際には一部のクラスは`T`を返すことのみに制限することは_できません_！その良い例が`Array`です。

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

このクラスは`T`において共変でも反変でもありません。そして、これは特定の柔軟性の欠如を強います。以下の関数を考えてみましょう。

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

この関数は、ある配列から別の配列へアイテムをコピーするものです。実際に適用してみましょう。

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ type is Array<Int> but Array<Any> was expected
```

ここで、同じおなじみの問題に遭遇します。`Array<T>`は`T`において_不変_であり、そのため`Array<Int>`も`Array<Any>`も互いのサブタイプではありません。なぜでしょうか？繰り返しますが、これは`copy`が予期せぬ動作をする可能性があるためです。例えば、`String`を`from`に書き込もうとすることがあり、そこに実際に`Int`の配列を渡した場合、後で`ClassCastException`がスローされます。

`copy`関数が`from`への_書き込み_を禁止するには、次のようにします。

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

これは_型プロジェクション (type projection)_ です。これは、`from`が単純な配列ではなく、制限された (_射影された_) 配列であることを意味します。型パラメータ`T`を返すメソッドのみを呼び出すことができ、この場合は`get()`のみを呼び出せることを意味します。これが_使用サイトのバリアンス_に対する私たちのアプローチであり、Javaの`Array<? extends Object>`に対応しながら、わずかにシンプルです。

`in`を使って型を射影することもできます。

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>`はJavaの`Array<? super String>`に対応します。これは、`String`、`CharSequence`、または`Object`の配列を`fill()`関数に渡すことができることを意味します。

### スタープロジェクション

型引数について何も知らないが、安全な方法でそれを使用したい場合があります。ここでの安全な方法は、そのジェネリック型の具象インスタンスがすべてそのプロジェクションのサブタイプになるように、ジェネリック型のプロジェクションを定義することです。

Kotlinはこれのために、いわゆる_スタープロジェクション (star-projection)_ 構文を提供します。

- `Foo<out T : TUpper>`の場合、`T`が上限`TUpper`を持つ共変な型パラメータであるとき、`Foo<*>`は`Foo<out TUpper>`と等価です。これは、`T`が不明な場合でも`Foo<*>`から`TUpper`の値を安全に_読み取れる_ことを意味します。
- `Foo<in T>`の場合、`T`が反変な型パラメータであるとき、`Foo<*>`は`Foo<in Nothing>`と等価です。これは、`T`が不明な場合、`Foo<*>`に安全な方法で_何も書き込めない_ことを意味します。
- `Foo<T : TUpper>`の場合、`T`が上限`TUpper`を持つ不変な型パラメータであるとき、`Foo<*>`は値を読み取る場合は`Foo<out TUpper>`と、値を書き込む場合は`Foo<in Nothing>`と等価です。

ジェネリック型が複数の型パラメータを持つ場合、それぞれの型パラメータは独立して射影できます。例えば、`interface Function<in T, out U>`として宣言されている場合、以下のスタープロジェクションを使用できます。

*   `Function<*, String>`は`Function<in Nothing, String>`を意味します。
*   `Function<Int, *>`は`Function<Int, out Any?>`を意味します。
*   `Function<*, *>`は`Function<in Nothing, out Any?>`を意味します。

{style="note"}
> スタープロジェクションはJavaのraw typesと非常によく似ていますが、安全です。
>

## ジェネリック関数

クラスだけが型パラメータを持つことができる宣言ではありません。関数も可能です。型パラメータは関数の名前の_前_に配置されます。

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // extension function
    // ...
}
```

ジェネリック関数を呼び出すには、呼び出しサイトで関数の名前の_後_に型引数を指定します。

```kotlin
val l = singletonList<Int>(1)
```

型引数は、コンテキストから推論できる場合、省略することができます。そのため、次の例も同様に機能します。

```kotlin
val l = singletonList(1)
```

## ジェネリック制約

特定の型パラメータに代入できるすべての可能な型の集合は、_ジェネリック制約 (generic constraints)_ によって制限される場合があります。

### 上限

最も一般的な制約のタイプは_上限 (upper bound)_ で、これはJavaの`extends`キーワードに対応します。

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

コロンの後に指定された型は_上限_であり、`Comparable<T>`のサブタイプのみが`T`に代入できることを示します。例えば：

```kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

デフォルトの上限 (指定されていない場合) は`Any?`です。山括弧内では1つの上限しか指定できません。同じ型パラメータが複数の上限を必要とする場合、個別の_where_句が必要です。

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

渡される型は、`where`句のすべての条件を同時に満たす必要があります。上記の例では、`T`型は`CharSequence`と`Comparable`の_両方_を実装する必要があります。

## 確実に非Null型

ジェネリックなJavaクラスおよびインターフェースとの相互運用性を容易にするため、Kotlinはジェネリックな型パラメータを**確実に非Null (definitely non-nullable)** として宣言することをサポートしています。

ジェネリック型`T`を確実に非Nullとして宣言するには、`& Any`を使用して型を宣言します。例: `T & Any`。

確実に非Null型は、Null許容の[上限](#upper-bounds)を持つ必要があります。

確実に非Null型を宣言する最も一般的なユースケースは、`@NotNull`を引数に含むJavaメソッドをオーバーライドする場合です。例えば、`load()`メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

Kotlinで`load()`メソッドを正常にオーバーライドするには、`T1`が確実に非Nullとして宣言されている必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 is definitely non-nullable
    override fun load(x: T1 & Any): T1 & Any
}
```

Kotlinのみで作業する場合、Kotlinの型推論がこれを処理してくれるため、確実に非Null型を明示的に宣言する必要はほとんどありません。

## 型イレイジャー

Kotlinがジェネリック宣言の使用に対して実行する型安全性チェックは、コンパイル時に行われます。実行時には、ジェネリック型のインスタンスは実際の型引数に関する情報を保持しません。型情報は_イレイジャー (erased)_ されると言われます。例えば、`Foo<Bar>`と`Foo<Baz?>`のインスタンスは、単に`Foo<*>`にイレイジャーされます。

### ジェネリック型のチェックとキャスト

型イレイジャーのため、ジェネリック型のインスタンスが実行時に特定の型引数で作成されたかどうかをチェックする一般的な方法はありません。コンパイラは`ints is List<Int>`や`list is T` (型パラメータ) のような`is`チェックを禁止します。ただし、スタープロジェクションされた型に対してインスタンスをチェックすることはできます。

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // The items are typed as `Any?`
}
```

同様に、インスタンスの型引数が静的に (コンパイル時に) チェックされている場合、型の非ジェネリック部分を含む`is`チェックまたはキャストを行うことができます。この場合、山括弧は省略されます。

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` is smart-cast to `ArrayList<String>`
    }
}
```

同じ構文で型引数を省略したものは、型引数を考慮しないキャストにも使用できます: `list as ArrayList`。

ジェネリック関数呼び出しの型引数もコンパイル時にのみチェックされます。関数本体内では、型パラメータを型チェックに使用することはできず、型パラメータへの型キャスト (`foo as T`) は非チェックとなります。唯一の例外は、実際の型引数が各呼び出しサイトでインライン化される[実体化された型パラメータ (reified type parameters)](inline-functions.md#reified-type-parameters)を持つインライン関数です。これにより、型パラメータの型チェックとキャストが可能になります。ただし、上記の制限は、チェックまたはキャスト内で使用されるジェネリック型のインスタンスには依然として適用されます。例えば、`arg is T`という型チェックにおいて、`arg`自体がジェネリック型のインスタンスである場合、その型引数は依然としてイレイジャーされます。

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
val stringToStringList = somePair.asPairOf<String, List<String>>() // コンパイルは通るが型安全性が破綻する！
// Expand the sample for more details

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // これはリストの要素がStringではないためClassCastExceptionをスローします
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 非チェックキャスト

`foo as List<String>`のような具体的な型引数を持つジェネリック型への型キャストは、実行時にチェックできません。これらの非チェックキャストは、上位レベルのプログラムロジックによって型安全性が暗示されているが、コンパイラによって直接推論できない場合に使用できます。以下の例を参照してください。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("文字列から任意の要素へのマッピングを読み込む。")
}

// このファイルに`Int`を含むマップを保存した
val intsFile = File("ints.dictionary")

// 警告: 非チェックキャスト: `Map<String, *>` から `Map<String, Int>`へ
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最終行のキャストで警告が表示されます。コンパイラは実行時に完全にそれをチェックすることはできず、マップ内の値が`Int`であるという保証を提供しません。

非チェックキャストを避けるためには、プログラム構造を再設計できます。上記の例では、`DictionaryReader<T>`および`DictionaryWriter<T>`インターフェースを、異なる型に対して型安全な実装で使用することができます。非チェックキャストを呼び出しサイトから実装の詳細に移動するために、適切な抽象化を導入できます。[ジェネリックバリアンス](#variance)を適切に使用することも役立ちます。

ジェネリック関数については、[実体化された型パラメータ](inline-functions.md#reified-type-parameters)を使用すると、`arg as T`のようなキャストがチェックされるようになります。ただし、`arg`の型がイレイジャーされる*独自の*型引数を持つ場合は除きます。

非チェックキャストの警告は、それが現れるステートメントまたは宣言に`@Suppress("UNCHECKED_CAST")`を[アノテーション](annotations.md)で付与することで抑制できます。

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

{style="note"}
>**JVMの場合**: [配列型](arrays.md) (`Array<Foo>`) は、その要素のイレイジャーされた型に関する情報を保持し、配列型への型キャストは部分的にチェックされます。要素型のNull許容性と実際の型引数は依然としてイレイジャーされます。例えば、キャスト`foo as Array<List<String>?>`は、`foo`がNull許容かどうかにかかわらず、任意の`List<*>`を保持する配列である場合に成功します。
>

## 型引数におけるアンダースコア演算子

アンダースコア演算子`_`は型引数に使用できます。他の型が明示的に指定されている場合に、引数の型を自動的に推論するために使用します。

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
```