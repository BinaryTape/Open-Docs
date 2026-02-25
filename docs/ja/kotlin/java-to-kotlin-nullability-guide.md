[//]: # (title: Java と Kotlin における Null 許容性)

<web-summary>Java から Kotlin へ Null 許容（nullable）な構造を移行する方法を学びます。このガイドでは、Kotlin での Null 許容型のサポートや、Kotlin が Java の Null 許容性アノテーションをどのように扱うかなどを説明します。</web-summary>

「Null 許容性（Nullability）」とは、変数が `null` 値を保持できる能力のことです。
変数に `null` が含まれているときに、その変数をデリファレンスしようとすると `NullPointerException` が発生します。
Null ポインター例外が発生する確率を最小限に抑えるために、コードを記述する方法はたくさんあります。

このガイドでは、Null 許容である可能性のある変数の扱いに関する、Java と Kotlin のアプローチの違いについて説明します。
これにより、Java から Kotlin への移行を助け、Kotlin らしい（オーセンティックな）スタイルでコードを記述できるようになります。

このガイドの最初の部分では、最も重要な違いである Kotlin での Null 許容型のサポートと、Kotlin が [Java コードからの型](#platform-types)をどのように処理するかについて説明します。
[「関数呼び出しの結果のチェック」](#checking-the-result-of-a-function-call)から始まる第 2 部では、いくつかの具体的なケースを検討し、特定の違いについて解説します。

[Kotlin での Null 安全について詳しく知る](null-safety.md)。

## Null 許容型のサポート

Kotlin と Java の型システムの最も重要な違いは、Kotlin が [Null 許容型（nullable types）](null-safety.md)を明示的にサポートしていることです。
これは、どの変数が `null` 値を保持する可能性があるかを示す方法です。
変数が `null` になる可能性がある場合、その変数に対してメソッドを呼び出すことは `NullPointerException` を引き起こす可能性があるため、安全ではありません。
Kotlin はコンパイル時にこのような呼び出しを禁止することで、多くの発生しうる例外を防ぎます。
実行時には、Null 許容型のオブジェクトと非 Null 型のオブジェクトは同じように扱われます。
Null 許容型は非 Null 型のラッパーではありません。すべてのチェックはコンパイル時に行われます。
つまり、Kotlin で Null 許容型を扱う際の実行時のオーバーヘッドはほとんどありません。

> 「ほとんど」と言ったのは、[組み込みの（intrinsic）](https://en.wikipedia.org/wiki/Intrinsic_function)チェックは生成されますが、そのオーバーヘッドは最小限であるためです。
>
{style="note"}

Java では、Null チェックを記述しない場合、メソッドが `NullPointerException` をスローすることがあります。

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // `NullPointerException` をスローする
}
```
{id="get-length-of-null-java"}

この呼び出しは、次のような出力を生成します。

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlin では、明示的に Null 許容としてマークしない限り、すべての通常の型はデフォルトで非 Null です。
`a` が `null` になることを想定していない場合は、`stringLength()` 関数を次のように宣言します。

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

パラメータ `a` は `String` 型です。これは Kotlin において、常に `String` インスタンスを含んでいなければならず、`null` を含むことはできないことを意味します。
Kotlin での Null 許容型は、`String?` のように疑問符 `?` を付けてマークされます。
`a` が `String` であれば、コンパイラが `stringLength()` のすべての引数が `null` でないという規則を強制するため、実行時に `NullPointerException` が発生する状況はあり得ません。

`stringLength(a: String)` 関数に `null` 値を渡そうとすると、「Null can not be a value of a non-null type String」というコンパイルエラーが発生します。

![Passing null to a non-nullable function error](passing-null-to-function.png){width=700}

`null` を含む任意の引数でこの関数を使用したい場合は、引数の型 `String?` の後に疑問符を使用し、関数本体の中で引数の値が `null` でないことを確認するチェックを行います。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

チェックに合格した後、コンパイラは、チェックが実行されたスコープ内において、その変数を非 Null 型の `String` であるかのように扱います。

このチェックを行わない場合、コードのコンパイルは失敗し、「Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed on a [nullable receiver](extensions.md#nullable-receivers) of type String?」というメッセージが表示されます。

これと同じことをより短く記述できます。[安全呼び出し演算子 ?. （If-not-null の短縮表記）](idioms.md#if-not-null-shorthand)を使用します。これにより、Null チェックとメソッド呼び出しを単一の操作に組み合わせることができます。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## プラットフォーム型

Java では、変数が `null` になるかどうかを示すアノテーションを使用できます。
このようなアノテーションは標準ライブラリの一部ではありませんが、別途追加することができます。
例えば、JetBrains のアノテーションである `@Nullable` や `@NotNull`（`org.jetbrains.annotations` パッケージから）、[JSpecify](https://jspecify.dev/) のアノテーション（`org.jspecify.annotations`）、または Eclipse のアノテーション（`org.eclipse.jdt.annotation`）を使用できます。
Kotlin は、[Kotlin コードから Java コードを呼び出す](java-interop.md#nullability-annotations)際にこのようなアノテーションを認識し、そのアノテーションに従って型を扱います。

Java コードにこれらのアノテーションがない場合、Kotlin は Java の型を *プラットフォーム型（platform types）* として扱います。
しかし、Kotlin はそのような型に対する Null 許容性の情報を持っていないため、コンパイラはそれらに対するすべての操作を許可します。
以下の理由から、Null チェックを行うかどうかを判断する必要があります。

* Java と同様に、`null` に対して操作を実行しようとすると `NullPointerException` が発生します。
* コンパイラは、非 Null 型の値に対して Null 安全な操作を行ったときに通常表示される、冗長な Null チェックの警告を表示しません。

[Null 安全とプラットフォーム型に関する、Kotlin からの Java 呼び出し](java-interop.md#null-safety-and-platform-types)について詳しくはこちら。

## 確定的な非 Null 型のサポート

Kotlin で、引数として `@NotNull` を含む Java メソッドをオーバーライドしたい場合、Kotlin の確定的な非 Null 型（definitely non-nullable types）が必要になります。

例えば、Java の次の `load()` メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlin で `load()` メソッドを正常にオーバーライドするには、`T1` を確定的な非 Null 型（`T1 & Any`）として宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 は確定的な非 Null 型
  override fun load(x: T1 & Any): T1 & Any
}
```

[確定的な非 Null 型（definitely non-nullable types）](generics.md#definitely-non-nullable-types)であるジェネリック型について詳しくはこちら。

## 関数呼び出しの結果のチェック

`null` のチェックが必要になる最も一般的な状況の 1 つは、関数呼び出しから結果を取得するときです。

次の例では、`Order` と `Customer` という 2 つのクラスがあります。`Order` は `Customer` のインスタンスへの参照を持っています。
`findOrder()` 関数は `Order` クラスのインスタンスを返しますが、注文が見つからない場合は `null` を返します。
目的は、取得した注文の顧客（customer）インスタンスを処理することです。

Java でのクラスは以下の通りです。

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Java では、関数を呼び出し、結果に対して if-not-null チェックを行ってから、必要なプロパティのデリファレンスを進めます。

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

上記の Java コードを Kotlin コードに直接変換すると、次のようになります。

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// 直接的な変換
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

[安全呼び出し演算子 `?.` （If-not-null の短縮表記）](idioms.md#if-not-null-shorthand)を標準ライブラリの[スコープ関数](scope-functions.md)のいずれかと組み合わせて使用します。これには通常、`let` 関数が使用されます。

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

これと同じことの、より短いバージョンです。

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## Null の代わりのデフォルト値

`null` のチェックは、Null チェックが成功した場合の[デフォルト値の設定](functions.md#parameters-with-default-values)と組み合わせてよく使用されます。

Null チェックを行う Java コード：

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

Kotlin で同じことを表現するには、[エルビス演算子（If-not-null-else の短縮表記）](null-safety.md#elvis-operator)を使用します。

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 値または Null を返す関数

Java では、リストの要素を操作するときに注意が必要です。要素を使用しようとする前に、常にそのインデックスに要素が存在するかどうかを確認する必要があります。

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // 例外！
```
{id="functions-returning-null-java"}

Kotlin 標準ライブラリは、`null` 値を返す可能性があるかどうかを名前で示す関数をしばしば提供しています。これは、特にコレクション API で一般的です。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // Java と同じコード：
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // コレクションが空の場合、IndexOutOfBoundsException をスローする可能性がある
    //numbers.get(5)     // 例外！

    // その他の機能：
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 集計操作

最大の要素を取得したい場合や、要素がない場合に `null` を取得したい場合、Java では [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) を使用します。

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

Kotlin では、[集計操作](collection-aggregate.md)を使用します。

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

[Java と Kotlin のコレクション](java-to-kotlin-collections-guide.md)について詳しくはこちら。

## 安全な型キャスト

型を安全にキャストする必要がある場合、Java では `instanceof` 演算子を使用し、その後でそれがうまく機能したかを確認します。

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // `-1` を出力
}
```
{id="casting-types-java"}

Kotlin で例外を回避するには、失敗時に `null` を返す[安全なキャスト演算子](typecasts.md#unsafe-cast-operator) `as?` を使用します。

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // `-1` を出力
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // null
    return x?.length ?: -1 // `x` が null なので -1 を返す
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 上記の Java の例では、関数 `getStringLength()` はプリミティブ型 `int` の結果を返します。
これを `null` を返すようにするには、[_ボクシングされた_型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)である `Integer` を使用できます。
しかし、このような関数には負の値を返させ、その値をチェックさせる方がリソース効率が良いです。いずれにせよチェックは行いますが、この方法では追加のボクシングは行われません。
>
{style="note"}

Java コードを Kotlin に移行する際、最初は元のコードのセマンティクスを維持するために、Null 許容型に対して通常のキャスト演算子 `as` を使用したくなるかもしれません。しかし、より安全で Kotlin らしいアプローチとして、安全なキャスト演算子 `as?` を使用するようにコードを適応させることをお勧めします。例えば、次のような Java コードがあるとします。

```java
public class UserProfile {
    Object data;

    public static String getUsername(UserProfile profile) {
        if (profile == null) {
            return null;
        }
        return (String) profile.data;
    }
}
```

これを `as` 演算子で直接移行すると、次のようになります。

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? {
    if (profile == null) {
        return null
    }
    return profile.data as String?
}
```

ここでは、`profile.data` は `as String?` を使用して Null 許容の文字列にキャストされています。

さらに一歩進んで、値を安全にキャストするために `as? String` を使用することをお勧めします。このアプローチでは、`ClassCastException` をスローする代わりに、失敗時に `null` を返します。

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

このバージョンでは、`if` 式を[安全呼び出し演算子](null-safety.md#safe-call-operator) `?.` に置き換えています。これにより、キャストを試みる前にデータプロパティに安全にアクセスできます。

## 次のステップ

* その他の [Kotlin の慣用句（イディオム）](idioms.md)をブラウズする。
* [Java-to-Kotlin (J2K) コンバーター](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)を使用して、既存の Java コードを Kotlin に変換する方法を学ぶ。
* その他の移行ガイドを確認する：
  * [Java と Kotlin での文字列](java-to-kotlin-idioms-strings.md)
  * [Java と Kotlin でのコレクション](java-to-kotlin-collections-guide.md)

お気に入りのイディオムがあれば、プルリクエストを送ってぜひ共有してください！