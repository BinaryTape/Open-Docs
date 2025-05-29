[//]: # (title: JavaとKotlinにおけるヌル可能性)
[//]: # (description: JavaからKotlinへのヌル許容な構造の移行方法を学びましょう。このガイドでは、Kotlinにおけるヌル許容型のサポート、KotlinがJavaのヌル許容アノテーションをどのように扱うかなどを説明します。)

_ヌル可能性_ とは、変数が`null`値を保持できる能力のことです。
変数が`null`を含む場合、その変数を逆参照しようとすると`NullPointerException`が発生します。
ヌルポインタ例外が発生する可能性を最小限に抑えるために、コードを書く方法はたくさんあります。

このガイドでは、JavaとKotlinにおけるヌル許容変数（nullになりうる変数）の扱い方の違いを説明します。
これは、JavaからKotlinへ移行し、本格的なKotlinスタイルでコードを書くのに役立ちます。

このガイドの最初の部分では、最も重要な違いであるKotlinにおけるヌル許容型のサポートと、
Kotlinが[Javaコードの型](#platform-types)をどのように処理するかについて説明します。2番目の部分では、
[関数呼び出しの結果の確認](#checking-the-function-call-result)から始まり、いくつかの具体的なケースを検証して、特定の相違点を説明します。

[Kotlinのヌル安全性についてさらに学ぶ](null-safety.md)。

## ヌル許容型のサポート

KotlinとJavaの型システムにおける最も重要な違いは、Kotlinが[ヌル許容型](null-safety.md)を明示的にサポートしている点です。
これは、どの変数が`null`値を保持できる可能性があるかを示す方法です。
変数が`null`になりうる場合、その変数に対してメソッドを呼び出すのは安全ではありません。`NullPointerException`を引き起こす可能性があるためです。
Kotlinはコンパイル時にそのような呼び出しを禁止し、これにより多くの潜在的な例外を防ぎます。
実行時には、ヌル許容型のオブジェクトと非ヌル許容型のオブジェクトは同じように扱われます。
ヌル許容型は非ヌル許容型のラッパーではありません。すべてのチェックはコンパイル時に実行されます。
これは、Kotlinでヌル許容型を扱う際の実行時オーバーヘッドがほとんどないことを意味します。

> 「ほとんど」と述べているのは、[組み込み](https://en.wikipedia.org/wiki/Intrinsic_function)チェックが生成されるものの、
そのオーバーヘッドはごくわずかだからです。
>
{style="note"}

Javaでは、ヌルチェックを書かない場合、メソッドは`NullPointerException`をスローする可能性があります。

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```
{id="get-length-of-null-java"}

この呼び出しは以下の出力を持ちます。

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlinでは、明示的にヌル許容型としてマークしない限り、すべての通常の型はデフォルトで非ヌル許容型です。
もし`a`が`null`になることを想定しない場合、`stringLength()`関数を次のように宣言します。

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

パラメータ`a`は`String`型であり、Kotlinでは常に`String`インスタンスを含み、`null`を含むことはできないことを意味します。
Kotlinのヌル許容型は、疑問符`?`を付けてマークされます（例: `String?`）。
コンパイラが`stringLength()`のすべての引数が`null`でないというルールを強制するため、`a`が`String`である場合、実行時に`NullPointerException`が発生する状況はありえません。

`null`値を`stringLength(a: String)`関数に渡そうとすると、コンパイル時エラーが発生し、
「Null can not be a value of a non-null type String」と表示されます。

![Passing null to a non-nullable function error](passing-null-to-function.png){width=700}

この関数を`null`を含む任意の引数で使用したい場合は、引数型`String?`の後に疑問符を付け、
関数本体内で引数の値が`null`でないことを確認するためのチェックを行います。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

チェックが正常に通過すると、コンパイラは、コンパイラがチェックを実行するスコープ内で、その変数を非ヌル許容型の`String`であるかのように扱います。

このチェックを実行しない場合、コードは以下のメッセージでコンパイルに失敗します。
「[セーフコール演算子 (?.)](null-safety.md#safe-call-operator)または[非ヌル表明 (!!.) 呼び出し](null-safety.md#not-null-assertion-operator)のみが、String? 型の[ヌル許容レシーバ](extensions.md#nullable-receiver)で許可されています。」

同じことをより短く書くことができます。ヌルチェックとメソッド呼び出しを単一の操作に結合できる[セーフコール演算子 ?. (If-not-null shorthand)](idioms.md#if-not-null-shorthand)を使用します。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## プラットフォーム型

Javaでは、変数が`null`になりうるか、または`null`になりえないかを示すアノテーションを使用できます。
そのようなアノテーションは標準ライブラリの一部ではありませんが、別途追加できます。
例えば、JetBrainsのアノテーション`@Nullable`や`@NotNull` (`org.jetbrains.annotations`パッケージから) や、
Eclipseのアノテーション (`org.eclipse.jdt.annotation`) を使用できます。
Kotlinは、[KotlinコードからJavaコードを呼び出す](java-interop.md#nullability-annotations)際に、そのようなアノテーションを認識し、
それらのアノテーションに従って型を扱います。

Javaコードにこれらのアノテーションがない場合、KotlinはJavaの型を_プラットフォーム型_として扱います。
しかし、Kotlinはそのような型に対するヌル可能性情報を持たないため、コンパイラはそれらに対するすべての操作を許可します。
ヌルチェックを実行するかどうかを決定する必要があります。なぜなら、

*   Javaと同様に、`null`に対して操作を実行しようとすると`NullPointerException`が発生します。
*   通常、非ヌル許容型の値に対してヌルセーフな操作を実行した場合にコンパイラが行う冗長なヌルチェックのハイライトは行われません。

[ヌル安全性とプラットフォーム型に関するKotlinからJavaの呼び出し](java-interop.md#null-safety-and-platform-types)についてさらに学びましょう。

## 確定非ヌル許容型のサポート

Kotlinでは、引数として`@NotNull`を含むJavaメソッドをオーバーライドしたい場合、Kotlinの確定非ヌル許容型が必要です。

例えば、Javaの次の`load()`メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlinで`load()`メソッドを正常にオーバーライドするには、`T1`を確定非ヌル許容型 (`T1 & Any`) として宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[確定非ヌル許容型](generics.md#definitely-non-nullable-types)であるジェネリック型についてさらに学びましょう。

## 関数呼び出しの結果の確認

ヌルチェックが必要となる最も一般的な状況の1つは、関数呼び出しから結果を取得するときです。

以下の例では、`Order`と`Customer`という2つのクラスがあります。`Order`は`Customer`インスタンスへの参照を持っています。
`findOrder()`関数は`Order`クラスのインスタンスを返しますが、注文が見つからない場合は`null`を返します。
目的は、取得した注文の顧客インスタンスを処理することです。

Javaのクラスを次に示します。

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Javaでは、関数を呼び出し、必要なプロパティの逆参照に進むために、結果に対してif-not-nullチェックを行います。

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

上記のJavaコードを直接Kotlinコードに変換すると、次のようになります。

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// Direct conversion
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

[セーフコール演算子 `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand)を、標準ライブラリの[スコープ関数](scope-functions.md)のいずれかと組み合わせて使用します。
通常、これには`let`関数が使用されます。

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

同じもののより短いバージョンを次に示します。

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## ヌルの代わりにデフォルト値

`null`のチェックは、ヌルチェックが成功した場合に[デフォルト値を設定する](functions.md#default-arguments)ことと組み合わせてよく使用されます。

ヌルチェックを含むJavaコード:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

Kotlinで同じことを表現するには、[エルビス演算子 (If-not-null-else shorthand)](null-safety.md#elvis-operator)を使用します。

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 値またはヌルを返す関数

Javaでは、リスト要素を扱う際に注意が必要です。要素を使用しようとする前に、常にインデックスに要素が存在するかどうかを確認する必要があります。

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlinの標準ライブラリには、`null`値を返す可能性があるかどうかを名前に示す関数がよく提供されています。
これは特にコレクションAPIで一般的です。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 集計操作

最大の要素を取得する必要がある場合、または要素がない場合に`null`を取得する必要がある場合、Javaでは
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用します。

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

Kotlinでは、[集計操作](collection-aggregate.md)を使用します。

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

[JavaとKotlinにおけるコレクション](java-to-kotlin-collections-guide.md)についてさらに学びましょう。

## 型を安全にキャストする

型を安全にキャストする必要がある場合、Javaでは`instanceof`演算子を使用し、その後それがうまくいったかどうかをチェックします。

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```
{id="casting-types-java"}

Kotlinで例外を避けるには、失敗時に`null`を返す[セーフキャスト演算子](typecasts.md#safe-nullable-cast-operator)`as?`を使用します。

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // Prints `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // Returns -1 because `x` is null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 上記のJavaの例では、`getStringLength()`関数はプリミティブ型`int`の結果を返します。
`null`を返すようにするには、[_ボックス化された_型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)`Integer`を使用できます。
しかし、そのような関数に負の値を返させ、その値をチェックする方がリソース効率が良いです。
いずれにせよチェックは行いますが、この方法では追加のボックス化は実行されません。
>
{style="note"}

## 次は何をしますか？

*   他の[Kotlinイディオム](idioms.md)を参照してください。
*   [Java-to-Kotlin (J2K) コンバーター](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学びましょう。
*   その他の移行ガイドを確認してください。
    *   [JavaとKotlinにおける文字列](java-to-kotlin-idioms-strings.md)
    *   [JavaとKotlinにおけるコレクション](java-to-kotlin-collections-guide.md)

お気に入りのイディオムがあれば、プルリクエストを送ってぜひ私たちと共有してください！