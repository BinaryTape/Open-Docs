[//]: # (title: JavaとKotlinにおけるnull許容性)

<web-summary>JavaからKotlinにnull許容な構造を移行する方法を学びましょう。このガイドでは、Kotlinにおけるnull許容型のサポート、KotlinがJavaのnull許容アノテーションをどのように扱うかなどを解説します。</web-summary>

_Null許容性_とは、変数が`null`値を保持できる能力のことです。
変数が`null`を含んでいる場合、その変数を参照解除しようとすると`NullPointerException`が発生します。
nullポインタ例外を受け取る可能性を最小限に抑えるためにコードを書く方法はたくさんあります。

このガイドでは、JavaとKotlinの、nullになりうる変数を扱うアプローチの違いについて説明します。
これは、JavaからKotlinへの移行を助け、Kotlinらしいスタイルでコードを書くのに役立ちます。

このガイドの最初のパートでは、最も重要な違いであるKotlinにおけるnull許容型のサポートと、Kotlinが[Javaコードからの型](#platform-types)をどのように処理するかについて説明します。2番目のパートでは、[関数呼び出しの結果のチェック](#checking-the-result-of-a-function-call)から始めて、いくつかの具体的なケースを検証し、特定の違いを解説します。

[Kotlinのnull安全性についてさらに詳しく学ぶ](null-safety.md)。

## null許容型のサポート

Kotlinの型システムとJavaの型システムとの最も重要な違いは、Kotlinが[null許容型](null-safety.md)を明示的にサポートしている点です。
これは、どの変数が`null`値を保持する可能性があるかを示す方法です。
変数が`null`である可能性がある場合、その変数に対してメソッドを呼び出すのは安全ではありません。`NullPointerException`を引き起こす可能性があるためです。
Kotlinはコンパイル時にこのような呼び出しを禁止することで、多くの潜在的な例外を防ぎます。
実行時には、null許容型のオブジェクトと非null許容型のオブジェクトは同じように扱われます。
null許容型は非null許容型のラッパーではありません。すべてのチェックはコンパイル時に実行されます。
これは、Kotlinでnull許容型を扱う際の実行時オーバーヘッドがほとんどないことを意味します。

> 「ほとんど」と述べるのは、[組み込み関数](https://ja.wikipedia.org/wiki/Intrinsic_function)のチェックは生成されるものの、
そのオーバーヘッドはごくわずかだからです。
>
{style="note"}

Javaでは、nullチェックを書かないと、メソッドが`NullPointerException`をスローすることがあります。

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

この呼び出しは、以下の出力になります。

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

Kotlinでは、すべての通常の型は、明示的にnull許容型としてマークしない限り、デフォルトで非null許容型です。
`a`が`null`ではないと想定する場合、`stringLength()`関数を次のように宣言します。

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

パラメータ`a`は`String`型であり、Kotlinでは常に`String`インスタンスを含み、`null`を含むことはできないことを意味します。
Kotlinのnull許容型は、`String?`のように疑問符`?`でマークされます。
コンパイラが`stringLength()`のすべての引数が`null`であってはならないというルールを強制するため、`a`が`String`である場合、実行時に`NullPointerException`が発生する状況は不可能です。

`null`値を`stringLength(a: String)`関数に渡そうとすると、「Null can not be a value of a non-null type String (nullは非null型のStringの値にはなりえません)」というコンパイル時エラーが発生します。

![Nullを非null許容関数に渡すエラー](passing-null-to-function.png){width=700}

`null`を含む任意の引数でこの関数を使用したい場合は、引数型`String?`の後に疑問符を付け、関数本体内で引数の値が`null`ではないことを確認します。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

チェックが正常にパスされた後、コンパイラは、チェックを実行するスコープ内でその変数を非null許容型の`String`であるかのように扱います。

このチェックを行わない場合、コードは「Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed on a [nullable receiver](extensions.md#nullable-receivers) of type String? (String?型の[null許容レシーバー](extensions.md#nullable-receivers)では、[セーフコール(?.)](null-safety.md#safe-call-operator)または[非nullアサート(!!.)呼び出し](null-safety.md#not-null-assertion-operator)のみが許可されます)」というメッセージでコンパイルに失敗します。

同じことをより短く書くことができます。nullチェックとメソッド呼び出しを単一の操作に結合できる[セーフコール演算子 `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand)を使用します。

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## プラットフォーム型

Javaでは、変数が`null`である可能性があるか、または`null`ではないかを示すアノテーションを使用できます。
このようなアノテーションは標準ライブラリの一部ではありませんが、別途追加できます。
たとえば、JetBrainsのアノテーションである`@Nullable`と`@NotNull`（`org.jetbrains.annotations`パッケージから）、[JSpecify](https://jspecify.dev/)（`org.jspecify.annotations`）のアノテーション、またはEclipse（`org.eclipse.jdt.annotation`）のアノテーションを使用できます。
Kotlinは、[KotlinコードからJavaコードを呼び出す](java-interop.md#nullability-annotations)際にこれらのアノテーションを認識し、そのアノテーションに従って型を扱います。

Javaコードにこれらのアノテーションがない場合、KotlinはJavaの型を_プラットフォーム型_として扱います。
しかし、Kotlinにはこのような型のnull許容性情報がないため、そのコンパイラはそれらに対するすべての操作を許可します。
nullチェックを実行するかどうかは、自分で判断する必要があります。なぜなら、

*   Javaと同じように、`null`に対して操作を実行しようとすると`NullPointerException`が発生します。
*   コンパイラは、非null許容型の値に対してnull安全な操作を実行する際に通常行うような、冗長なnullチェックを強調表示しません。

[null安全性とプラットフォーム型に関してKotlinからJavaを呼び出す方法](java-interop.md#null-safety-and-platform-types)について詳しく学んでください。

## 厳密な非null許容型のサポート

Kotlinでは、引数に`@NotNull`を含むJavaメソッドをオーバーライドしたい場合、Kotlinの厳密な非null許容型が必要になります。

たとえば、Javaのこの`load()`メソッドを考えてみましょう。

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

Kotlinで`load()`メソッドを正常にオーバーライドするには、`T1`を厳密な非null許容型（`T1 & Any`）として宣言する必要があります。

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 is definitely non-nullable
  override fun load(x: T1 & Any): T1 & Any
}
```

[厳密な非null許容型](generics.md#definitely-non-nullable-types)であるジェネリック型について詳しく学びましょう。

## 関数呼び出しの結果のチェック

`null`チェックが必要となる最も一般的な状況の1つは、関数呼び出しから結果を取得する場合です。

次の例では、`Order`と`Customer`の2つのクラスがあります。`Order`は`Customer`のインスタンスへの参照を持っています。
`findOrder()`関数は`Order`クラスのインスタンスを返すか、注文が見つからない場合は`null`を返します。
目的は、取得した注文の顧客インスタンスを処理することです。

Javaでのクラスは次のとおりです。

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

Javaでは、関数を呼び出し、結果に対してif-not-nullチェックを行い、必要なプロパティの参照解除を進めます。

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

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
{id="process-customer-if-not-null-kotlin"}

[セーフコール演算子 `?.` (If-not-null shorthand)](idioms.md#if-not-null-shorthand)を標準ライブラリのいずれかの[スコープ関数](scope-functions.md)と組み合わせて使用します。
通常、これには`let`関数が使用されます。

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

同じものの短いバージョンは次のとおりです。

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## nullの代わりにデフォルト値

`null`のチェックは、nullチェックが成功した場合の[デフォルト値の設定](functions.md#parameters-with-default-values)と組み合わせてよく使用されます。

nullチェックを含むJavaコード:

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

## 値またはnullを返す関数

Javaでは、リスト要素を扱う際に注意が必要です。要素を使用しようとする前に、常にインデックスに要素が存在するかどうかをチェックする必要があります。

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // Exception!
```
{id="functions-returning-null-java"}

Kotlinの標準ライブラリは、`null`値を返す可能性があるかどうかを示す関数名をよく提供しています。
これは特にコレクションAPIで一般的です。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // Javaと同じコード:
    val numbers = listOf(1, 2)
    
    println(numbers[0])  // コレクションが空の場合、IndexOutOfBoundsExceptionをスローする可能性がある
    //numbers.get(5)     // Exception!

    // その他の機能:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // null
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 集計演算

要素がない場合に最大要素または`null`を取得する必要がある場合、Javaでは[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)を使用します。

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

Kotlinでは、[集計演算](collection-aggregate.md)を使用します。

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

[JavaとKotlinのコレクション](java-to-kotlin-collections-guide.md)について詳しく学びましょう。

## 型を安全にキャストする

型を安全にキャストする必要がある場合、Javaでは`instanceof`演算子を使用し、その後それがどれくらいうまく機能したかをチェックします。

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
    return x?.length ?: -1 // `x`がnullのため、-1を返す
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 上記のJavaの例では、`getStringLength()`関数はプリミティブ型`int`の結果を返します。
`null`を返すようにするには、[_ボックス化された_型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)`Integer`を使用できます。
しかし、そのような関数に負の値を返させ、その値をチェックする方がリソース効率が良いです。
いずれにせよチェックは行いますが、この方法では追加のボックス化は実行されません。
>
{style="note"}

JavaコードをKotlinに移行する際、コードの元のセマンティクスを保持するために、最初は通常のキャスト演算子 `as` をnull許容型とともに使用したいと思うかもしれません。しかし、より安全でKotlinらしいアプローチのために、セーフキャスト演算子 `as?` を使用するようにコードを適応させることをお勧めします。例えば、次のJavaコードがある場合：

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

これを `as` 演算子で直接移行すると次のようになります。

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? {
    if (profile == null) {
        return null
    }
    return profile.data as String?
}
```

ここで、`profile.data` は `as String?` を使用してnull許容文字列にキャストされています。

さらに一歩進んで、値を安全にキャストするために `as? String` を使用することをお勧めします。このアプローチは、`ClassCastException` をスローする代わりに、失敗時に `null` を返します。

```kotlin
class UserProfile(var data: Any? = null)

fun getUsername(profile: UserProfile?): String? =
  profile?.data as? String
```

このバージョンでは、`if` 式を[セーフコール演算子](null-safety.md#safe-call-operator) `?.` で置き換えています。これにより、キャストを試みる前にデータプロパティに安全にアクセスします。

## 次のステップ

*   他の[Kotlinイディオム](idioms.md)を参照してください。
*   [Java-to-Kotlin (J2K) コンバーター](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)を使用して、既存のJavaコードをKotlinに変換する方法を学びましょう。
*   その他の移行ガイドを確認してください。
    *   [JavaとKotlinの文字列](java-to-kotlin-idioms-strings.md)
    *   [JavaとKotlinのコレクション](java-to-kotlin-collections-guide.md)

お気に入りのイディオムがあれば、プルリクエストを送ってぜひ共有してください！