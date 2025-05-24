---
title: JavaとKotlinにおけるNull許容性
description: Null許容型コンストラクションをJavaからKotlinへ移行する方法について学びます。このガイドでは、KotlinにおけるNull許容型のサポート、KotlinがJavaからのNull許容アノテーションをどのように扱うかなどを説明します。
---
_Nullability_（Null許容性）とは、変数が `null` 値を保持できる機能のことです。
変数が `null` を含む場合、その変数を[間接参照](https://ja.wikipedia.org/wiki/%E9%96%93%E6%8E%A5%E5%8F%82%E7%85%A7)しようとすると、`NullPointerException` が発生します。
null ポインタ例外が発生する可能性を最小限に抑えるために、さまざまな方法でコードを作成できます。

このガイドでは、nullable（Null許容）な変数の処理に対するJavaとKotlinのアプローチの違いについて説明します。
JavaからKotlinへの移行を支援し、本格的なKotlinスタイルでコードを作成するのに役立ちます。

このガイドの最初の部分では、最も重要な違いである、Kotlinでのnullable（Null許容）型（[null-safety](null-safety)）のサポートと、Kotlinが[Javaコードからの型](#platform-types)をどのように処理するかについて説明します。
2番目の部分である[関数呼び出しの結果の確認](#checking-the-result-of-a-function-call)からは、特定の違いを説明するために、いくつかの具体的なケースを検証します。

[Kotlinのnull safety（Null安全性）についてさらに詳しく](null-safety)

## nullable（Null許容）型のサポート

KotlinとJavaの型システムの最も重要な違いは、Kotlinが[nullable（Null許容）型](null-safety)を明示的にサポートしていることです。
これは、どの変数が `null` 値を保持できる可能性があるかを示す方法です。
変数が `null` になる可能性がある場合、`NullPointerException` が発生する可能性があるため、その変数でメソッドを呼び出すのは安全ではありません。
Kotlinはコンパイル時にそのような呼び出しを禁止し、それによって発生する可能性のある多くの例外を防ぎます。
実行時には、nullable（Null許容）型とnon-nullable（Null非許容）型のオブジェクトは同じように扱われます。
nullable（Null許容）型はnon-nullable（Null非許容）型のラッパーではありません。すべてのチェックはコンパイル時に実行されます。
つまり、Kotlinでnullable（Null許容）型を扱うためのランタイムオーバーヘッドはほとんどありません。

:::note
[組み込み (intrinsic)](https://en.wikipedia.org/wiki/Intrinsic_function) のチェックが生成されますが、オーバーヘッドは最小限です。
:::

Javaでは、nullチェックを記述しない場合、メソッドは `NullPointerException` をスローする可能性があります。

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // Throws a `NullPointerException`
}
```

この呼び出しでは、次の出力が得られます。

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlinでは、明示的にnullable（Null許容）としてマークしない限り、すべての通常の型はデフォルトでnon-nullable（Null非許容）です。
`a` が `null` になることを予期しない場合は、`stringLength()` 関数を次のように宣言します。

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```

パラメータ `a` は `String` 型を持ちますが、Kotlinでは、これは常に `String` インスタンスを含む必要があり、`null` を含むことはできないことを意味します。
Kotlinのnullable（Null許容）型は、疑問符 `?` でマークされます（例：`String?`）。
コンパイラは `stringLength()` のすべての引数が `null` でないという規則を強制するため、`a` が `String` の場合、ランタイムでの `NullPointerException` の状況は不可能です。

`null` 値を `stringLength(a: String)` 関数に渡そうとすると、コンパイル時エラー「Null can not be a value of a non-null type String（Nullはnon-null型のStringの値になることはできません）」が発生します。

<img src="/img/passing-null-to-function.png" alt="Passing null to a non-nullable function error" width="700" style={{verticalAlign: 'middle'}}/>

`null` を含むすべての引数でこの関数を使用する場合は、引数型の後に疑問符 `String?` を使用し、関数の本体内で引数の値が `null` でないことを確認します。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```

チェックが正常に渡されると、コンパイラは、コンパイラがチェックを実行するスコープ内で、変数をnon-nullable（Null非許容）型 `String` であるかのように扱います。

このチェックを実行しないと、次のメッセージでコンパイルに失敗します。
「[safe (?.)](null-safety#safe-call-operator) または [non-nullable asserted (!!.) calls](null-safety#not-null-assertion-operator)のみが、String?型の[nullable receiver](extensions#nullable-receiver)で許可されます。」

[safe-call operator（セーフコール演算子） `?.` (If-not-null shorthand)](idioms#if-not-null-shorthand)を使用して、同じことをより短く記述できます。
これにより、nullチェックとメソッド呼び出しを1つの操作に組み合わせることができます。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```

## Platform types（プラットフォーム型）

Javaでは、変数が `null` になるかどうかを示すアノテーションを使用できます。
このようなアノテーションは標準ライブラリの一部ではありませんが、個別に追加できます。
たとえば、JetBrainsのアノテーション `@Nullable` および `@NotNull`（`org.jetbrains.annotations`パッケージから）、またはEclipseからのアノテーション（`org.eclipse.jdt.annotation`）を使用できます。
Kotlinは、[KotlinコードからJavaコードを呼び出す](java-interop#nullability-annotations)ときにこのようなアノテーションを認識し、それらのアノテーションに従って型を扱います。

Javaコードにこれらのアノテーションがない場合、KotlinはJava型を _platform types（プラットフォーム型）_ として扱います。
ただし、Kotlinにはそのような型のnullability（Null許容性）情報がないため、コンパイラはそれらに対するすべての操作を許可します。
nullチェックを実行するかどうかを決定する必要があります。なぜなら：

* Javaと同様に、`null` で操作を実行しようとすると、`NullPointerException` が発生します。
* コンパイラは、non-nullable（Null非許容）型の値に対してnull-safe（Null安全）な操作を実行する場合に通常行うような、冗長なnullチェックを強調表示しません。

[null safety（Null安全性）と platform types（プラットフォーム型）に関して、KotlinからJavaを呼び出す](java-interop#null-safety-and-platform-types)の詳細をご覧ください。

## Support for definitely non-nullable types（非null型）のサポート

Kotlinで、引数として `@NotNull` を含むJavaメソッドをオーバーライドする場合、Kotlinの非null型が必要です。

たとえば、Javaで次の `load()` メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlinで `load()` メソッドを正常にオーバーライドするには、`T1` を非null型（`T1 & Any`）として宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[非null型](generics#definitely-non-nullable-types)であるジェネリック型の詳細をご覧ください。

## Checking the result of a function call（関数呼び出しの結果の確認）

`null` をチェックする必要がある最も一般的な状況の1つは、関数呼び出しから結果を取得するときです。

次の例では、`Order` クラスと `Customer` クラスの2つのクラスがあります。
`Order` は `Customer` のインスタンスへの参照を持ちます。
`findOrder()` 関数は、`Order` クラスのインスタンスを返すか、注文が見つからない場合は `null` を返します。
目的は、取得した注文のcustomerインスタンスを処理することです。

Javaのクラスを以下に示します。

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Javaで、関数を呼び出し、結果に対してif-not-nullチェックを実行して、必要なプロパティの間接参照に進みます。

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```

上記のJavaコードをKotlinコードに直接変換すると、次のようになります。

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

標準ライブラリの[スコープ関数](scope-functions)のいずれかと組み合わせて、[safe-call operator（セーフコール演算子）`?.` (If-not-null shorthand)](idioms#if-not-null-shorthand)を使用します。
`let` 関数は通常これに使用されます。

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```

同じものの短いバージョンを次に示します。

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```

## Default values instead of null（nullの代わりにデフォルト値）

`null` のチェックは、nullチェックが成功した場合に[デフォルト値を設定する](functions#default-arguments)ことと組み合わせて使用されることがよくあります。

nullチェックを使用したJavaコード：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```

Kotlinで同じことを表現するには、[Elvis operator（エルビス演算子） (If-not-null-else shorthand)](null-safety#elvis-operator)を使用します。

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```

## Functions returning a value or null（値またはnullを返す関数）

Javaでは、リスト要素を扱うときは注意が必要です。
要素を使用する前に、常にインデックスに要素が存在するかどうかを確認する必要があります。

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```

Kotlin標準ライブラリは、`null` 値を返す可能性があるかどうかを示す名前の関数を提供することがよくあります。
これは、コレクションAPIで特に一般的です。

```kotlin
fun main() {

    // Kotlin
    // The same code as in Java:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // Can throw IndexOutOfBoundsException if the collection is empty
    //numbers.get(5)     // Exception!

    // More abilities:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null

}
```

## Aggregate operations（集約操作）

最大の要素を取得するか、要素がない場合は `null` を取得する必要がある場合、Javaでは[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用します。

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```

Kotlinでは、[集約操作](collection-aggregate)を使用します。

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```

[JavaとKotlinのコレクション](java-to-kotlin-collections-guide)の詳細をご覧ください。

## Casting types safely（型を安全にキャストする）

型を安全にキャストする必要がある場合、Javaでは `instanceof` 演算子を使用し、その動作を確認します。

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // Prints `-1`
}
```

Kotlinで例外を回避するには、[safe cast operator（安全なキャスト演算子）](typecasts#safe-nullable-cast-operator) `as?` を使用します。これは、失敗した場合は `null` を返します。

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

:::note
上記のJavaの例では、関数 `getStringLength()` はプリミティブ型 `int` の結果を返します。
`null` を返すようにするには、[_boxed（ボックス化された）型_](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer` を使用できます。
ただし、そのような関数が負の値を返し、その値をチェックする方がリソース効率が高くなります。
いずれにしてもチェックを実行しますが、追加のボックス化は実行されません。
:::

## What's next?（次に何をしますか？）

* 他の[Kotlinイディオム](idioms)を参照します。
* [Java-to-Kotlin (J2K) converter](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学びます。
* 他の移行ガイドを確認してください。
  * [Strings in Java and Kotlin（JavaとKotlinの文字列）](java-to-kotlin-idioms-strings)
  * [Collections in Java and Kotlin（JavaとKotlinのコレクション）](java-to-kotlin-collections-guide)

お気に入りのイディオムがある場合は、プルリクエストを送信して、ぜひ共有してください。