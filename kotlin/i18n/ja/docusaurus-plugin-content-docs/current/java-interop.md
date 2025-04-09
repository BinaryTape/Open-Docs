---
title: "Kotlin から Java を呼び出す"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlinは、Javaとの相互運用性を念頭に設計されています。既存のJavaコードはKotlinから自然な方法で呼び出すことができ、KotlinコードもJavaからスムーズに使用できます。
このセクションでは、KotlinからJavaコードを呼び出すことに関する詳細について説明します。

ほとんどすべてのJavaコードは、問題なく使用できます。

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for'ループはJavaのコレクションで機能します:
    for (item in source) {
        list.add(item)
    }
    // 演算子の慣習も同様に機能します:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // getとsetが呼び出されます
    }
}
```

## ゲッターとセッター

ゲッターとセッターに関するJavaの規則に従うメソッド（`get`で始まる名前の引数なしのメソッドと、`set`で始まる名前の単一引数のメソッド）は、Kotlinではプロパティとして表現されます。
このようなプロパティは、_synthetic properties_とも呼ばれます。
`Boolean`アクセサーメソッド（ゲッターの名前が`is`で始まり、セッターの名前が`set`で始まる場合）は、ゲッターメソッドと同じ名前を持つプロパティとして表現されます。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // getFirstDayOfWeek() を呼び出す
        calendar.firstDayOfWeek = Calendar.MONDAY // setFirstDayOfWeek() を呼び出す
    }
    if (!calendar.isLenient) { // isLenient() を呼び出す
        calendar.isLenient = true // setLenient() を呼び出す
    }
}
```

上記の`calendar.firstDayOfWeek`は、synthetic propertyの例です。

Javaクラスにセッターしかない場合、Kotlinではプロパティとして表示されないことに注意してください。Kotlinはset-onlyのプロパティをサポートしていないためです。

## Java synthetic property references

:::note
この機能は[Experimental](components-stability#stability-levels-explained)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用することをお勧めします。

Kotlin 1.8.20以降では、Java synthetic propertyへの参照を作成できます。次のJavaコードを検討してください。

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlinでは常に`person.age`と記述できましたが、ここで`age`はsynthetic propertyです。ここで、`Person::age`および`person::age`への参照を作成することもできます。これは`name`にも当てはまります。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Java synthetic propertyへの参照を呼び出す:
        .sortedBy(Person::age)
         // Kotlinプロパティ構文を介してJavaゲッターを呼び出す:
        .forEach { person `->` println(person.name) }
```

### Java synthetic property referencesを有効にする方法

この機能を有効にするには、`-language-version 2.1` コンパイラーオプションを設定します。Gradleプロジェクトでは、次のコードを`build.gradle(.kts)`に追加することで設定できます。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
            )
    }
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</TabItem>
</Tabs>

Kotlin 1.9.0より前は、この機能を有効にするには、`-language-version 1.9`コンパイラーオプションを設定する必要がありました。

:::

## voidを返すメソッド

Javaメソッドが`void`を返す場合、Kotlinから呼び出されると`Unit`を返します。
もし誰かがその戻り値を使用した場合、Kotlinコンパイラーによって呼び出し元で割り当てられます。
値自体は事前にわかっているためです（`Unit`である）。

## KotlinのキーワードであるJava識別子のエスケープ

Kotlinのキーワードの中には、Javaで有効な識別子であるものがあります: `in`、`object`、`is`など。
JavaライブラリがメソッドにKotlinキーワードを使用している場合でも、バッククォート（`）文字でエスケープすることでメソッドを呼び出すことができます:

```kotlin
foo.`is`(bar)
```

## Null safetyとプラットフォーム型

Javaの参照はすべて`null`である可能性があるため、Kotlinの厳格なnull safetyの要件は、Javaから来るオブジェクトには非現実的です。
Javaの宣言の型は、Kotlinでは特定の方法で扱われ、*プラットフォーム型*と呼ばれます。
これらの型に対するNullチェックは緩和されており、これらの型のsafetyの保証はJavaと同じです（詳しくは[下記](#mapped-types)をご覧ください）。

次の例を考えてみましょう:

```kotlin
val list = ArrayList<String>() // non-null (コンストラクターの結果)
list.add("Item")
val size = list.size // non-null (プリミティブint)
val item = list[0] // プラットフォーム型が推論される (通常のJavaオブジェクト)
```

プラットフォーム型の変数でメソッドを呼び出すとき、Kotlinはコンパイル時にnull許容エラーを発行しませんが、nullポインター例外や、nullの伝播を防ぐためにKotlinが生成するアサーションのために、呼び出しが実行時に失敗する可能性があります:

```kotlin
item.substring(1) // 許可されている、item == nullの場合に例外をスローする
```

プラットフォーム型は*非表記可能*です。つまり、言語で明示的に書き出すことはできません。
プラットフォーム値がKotlin変数に割り当てられる場合、型推論に頼るか（上記の例の`item`のように、変数は推論されたプラットフォーム型を持ちます）、期待する型を選択できます（nullable型とnon-nullable型の両方が許可されます）:

```kotlin
val nullable: String? = item // 許可されている、常に機能する
val notNull: String = item // 許可されている、実行時に失敗する可能性がある
```

non-nullable型を選択した場合、コンパイラーは割り当て時にアサーションを発行します。これにより、Kotlinのnon-nullable変数がnullを保持するのを防ぎます。
アサーションは、non-null値を期待するKotlin関数にプラットフォーム値を渡す場合や、その他の場合にも発行されます。
全体として、コンパイラーはプログラム全体でnullが遠くまで伝播するのを防ぐために最善を尽くしますが、ジェネリクスのために完全に排除することが不可能な場合があります。

### プラットフォーム型の表記法

上記のように、プラットフォーム型はプログラムで明示的に言及できないため、言語にはそれらの構文はありません。
それにもかかわらず、コンパイラーとIDEはそれらを表示する必要がある場合があります（たとえば、エラーメッセージやパラメーター情報で）。
そのため、それらを表すためのニーモニック表記法があります:

* `T!` は "`T` または `T?`" を意味します。
* `(Mutable)Collection<T>!` は "`T` のJavaコレクションは、mutableまたはそうでない可能性があり、nullableまたはそうでない可能性がある" を意味します。
* `Array<(out) T>!` は "`T` (または `T` のサブタイプ) のJava配列、nullableまたはそうでない" を意味します。

### Nullabilityアノテーション

nullabilityアノテーションを持つJava型は、プラットフォーム型としてではなく、実際のnullableまたはnon-nullableのKotlin型として表現されます。
コンパイラーは、次のようないくつかの種類のnullabilityアノテーションをサポートしています:

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`org.jetbrains.annotations` パッケージの `@Nullable` と `@NotNull`)
  * [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
  * Android (`com.android.annotations` と `android.support.annotations`)
  * JSR-305 (`javax.annotation`、詳細については下記)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)
  * RxJava 3 (`io.reactivex.rxjava3.annotations`)

特定の種類のnullabilityアノテーションからの情報に基づいて、コンパイラーがnullabilityの不一致を報告するかどうかを指定できます。
コンパイラーオプション `-Xnullability-annotations=@<package-name>:<report-level>` を使用してください。
引数では、完全修飾nullabilityアノテーションパッケージと、次のレポートレベルのいずれかを指定します:
* nullabilityの不一致を無視する場合は `ignore`
* 警告を報告する場合は `warn`
* エラーを報告する場合は `strict`

サポートされているnullabilityアノテーションの完全なリストは、
[Kotlinコンパイラーのソースコード](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)にあります。

### 型引数と型パラメーターのアノテーション

ジェネリック型の型引数と型パラメーターにアノテーションを付けて、それらのnullability情報を提供することもできます。

:::note
このセクションのすべての例では、`org.jetbrains.annotations`パッケージのJetBrains nullabilityアノテーションを使用します。

:::

#### 型引数

Javaの宣言に関するこれらのアノテーションを考えてみましょう:

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

これらはKotlinで次のシグネチャになります:

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

`@NotNull`アノテーションが型引数にない場合、代わりにプラットフォーム型を取得します:

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlinは、基底クラスとインターフェースの型引数のnullabilityアノテーションも考慮に入れます。たとえば、次に示すシグネチャを持つ2つのJavaクラスがあります:

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

Kotlinコードでは、`Base<String>`が想定される場所に`Derived`のインスタンスを渡すと、警告が生成されます。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived`の上限は`Base<String?>`に設定されており、これは`Base<String>`とは異なります。

[KotlinのJavaジェネリクス](java-interop#java-generics-in-kotlin)の詳細をご覧ください。

#### 型パラメーター

デフォルトでは、KotlinとJavaの両方で、プレーンな型パラメーターのnullabilityは未定義です。Javaでは、nullabilityアノテーションを使用して指定できます。`Base`クラスの型パラメーターにアノテーションを付けてみましょう:

```java
public class Base<@NotNull T> {}
```

`Base`から継承する場合、Kotlinはnon-nullable型引数または型パラメーターを想定しています。
したがって、次のKotlinコードは警告を生成します:

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

上限 `K : Any` を指定することで修正できます。

Kotlinは、Java型パラメーターの境界に対するnullabilityアノテーションもサポートしています。`Base`に境界を追加してみましょう:

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlinはこれを次のように変換します:

```kotlin
class BaseWithBound<T : Number> {}
```

したがって、nullable型を型引数または型パラメーターとして渡すと、警告が生成されます。

型引数と型パラメーターのアノテーションは、Java 8ターゲット以上で機能します。この機能には、nullabilityアノテーションが`TYPE_USE`ターゲットをサポートしている必要があります（`org.jetbrains.annotations`はバージョン15以降でこれをサポートしています）。

:::note
nullabilityアノテーションが、`TYPE_USE`ターゲットに加えて、型に適用可能な他のターゲットをサポートしている場合、`TYPE_USE`が優先されます。たとえば、`@Nullable`に`TYPE_USE`と`METHOD`の両方のターゲットがある場合、Javaメソッドのシグネチャ`@Nullable String[] f()`はKotlinで`fun f(): Array<String?>!`になります。

:::

### JSR-305のサポート

[JSR-305](https://jcp.org/en/jsr/detail?id=305)で定義されている[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)アノテーションは、Java型のnullabilityを示すためにサポートされています。

`@Nonnull(when = ...)` の値が `When.ALWAYS` の場合、アノテーションが付けられた型は non-nullable として扱われます。`When.MAYBE` と `When.NEVER` は nullable な型を示します。そして `When.UNKNOWN` は型を [platform type](#null-safety-and-platform-types) に強制します。

ライブラリは JSR-305 アノテーションに対してコンパイルできますが、アノテーションアーティファクト (例えば `jsr305.jar`) をライブラリコンシューマーのコンパイル依存関係にする必要はありません。Kotlin コンパイラは、クラスパスにアノテーションが存在しなくても、ライブラリから JSR-305 アノテーションを読み取ることができます。

[カスタム nullability 修飾子 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers)
もサポートされています (下記参照)。

#### 型修飾子ニックネーム

アノテーション型が
[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)
と JSR-305 `@Nonnull` (または `@CheckForNull` のような別のニックネーム) の両方でアノテーションされている場合、アノテーション型自体が正確な nullability の取得に使用され、その nullability アノテーションと同じ意味を持ちます。

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 別の型修飾子ニックネームへのニックネーム
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // Kotlin (strict mode) では: `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // Kotlin (strict mode) では: `fun bar(x: List<String>!): String!`
}
```

#### 型修飾子のデフォルト

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)
を使用すると、アノテーションが適用されたときに、アノテーションが付けられた要素のスコープ内でデフォルトの nullability を定義するアノテーションを導入できます。

このようなアノテーション型自体は、`@Nonnull` (またはそのニックネーム) と `@TypeQualifierDefault(...)` の両方でアノテーションされている必要があります。
1つ以上の `ElementType` 値を使用します:

* メソッドの戻り値の型には `ElementType.METHOD`
* 値パラメーターには `ElementType.PARAMETER`
* フィールドには `ElementType.FIELD`
* 型引数、型パラメーターの上限、ワイルドカード型を含む任意の型には `ElementType.TYPE_USE`

デフォルトの nullability は、型自体に nullability アノテーションが付けられていない場合に使用され、デフォルトは、型使用法に一致する `ElementType` を持つ型修飾子のデフォルトアノテーションが付けられた最も内側の囲み要素によって決定されます。

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // fun foo(x: String?): String?

    @NotNullApi // インターフェースからのデフォルトを上書きする
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // List<String> 型の引数は、`@NullableApi` により nullable として認識されます。
    // `TYPE_USE` 要素型を持っています:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // `x` パラメーターの型は、明示的なものがあるため、プラットフォームのままです。
    // UNKNOWN でマークされた nullability アノテーション:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

:::note
この例の型は、strict mode が有効になっている場合にのみ有効になります。それ以外の場合、プラットフォーム型は残ります。
[`@UnderMigration` アノテーション](#undermigration-annotation) および [コンパイラ設定](#compiler-configuration) セクションを参照してください。

:::

パッケージレベルのデフォルトの nullability もサポートされています:

```java
// FILE: test/package-info.java
@NonNullApi // パッケージ「test」のすべての型をデフォルトで non-nullable として宣言する
package test;
```

#### @UnderMigration annotation

`@UnderMigration` アノテーション (別のアーティファクト `kotlin-annotations-jvm` で提供) は、ライブラリメンテナが nullability 型修飾子の移行ステータスを定義するために使用できます。

`@UnderMigration(status = ...)` のステータス値は、コンパイラが Kotlin でアノテーションが付けられた型の不適切な使用法をどのように処理するかを指定します (例えば、`@MyNullable` アノテーションが付けられた型の値を non-null として使用するなど)。

* `MigrationStatus.STRICT` は、アノテーションをプレーンな nullability アノテーションとして機能させます。つまり、不適切な使用法のエラーを報告し、アノテーションが付けられた宣言の型が Kotlin で表示されるように影響を与えます。
* `MigrationStatus.WARN`: 不適切な使用法はエラーではなくコンパイル警告として報告されますが、アノテーションが付けられた宣言の型はプラットフォームのままです。
* `MigrationStatus.IGNORE` は、コンパイラが nullability アノテーションを完全に無視するようにします。

ライブラリメンテナは、型修飾子のニックネームと型修飾子の両方に `@UnderMigration` ステータスを追加できます。

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// クラスの型は non-nullable ですが、警告のみが報告されます
// `@NonNullApi` に `@UnderMigration(status = MigrationStatus.WARN)` というアノテーションが付けられているため
@NonNullApi
public class Test {}
```

:::note
nullability アノテーションの移行ステータスは、その型修飾子のニックネームによって継承されませんが、デフォルトの型修飾子での使用に適用されます。

:::

デフォルトの型修飾子が型修飾子のニックネームを使用し、両方に `@UnderMigration` がある場合、デフォルトの型修飾子からのステータスが使用されます。

#### コンパイラ設定

JSR-305 チェックは、次のオプション (およびそれらの組み合わせ) を使用して `-Xjsr305` コンパイラフラグを追加することで構成できます。

* `-Xjsr305=\{strict|warn|ignore\}` は、`@UnderMigration` アノテーションがないものの動作を設定します。
カスタム nullability 修飾子、特に
`@TypeQualifierDefault` は、多くの有名なライブラリにすでに広がっており、ユーザーは JSR-305 サポートを含む Kotlin バージョンに更新するときにスムーズに移行する必要がある場合があります。Kotlin 1.1.60 以降、このフラグは `@UnderMigration` アノテーションがないものにのみ影響します。

* `-Xjsr305=under-migration:\{strict|warn|ignore\}` は、`@UnderMigration` アノテーションの動作をオーバーライドします。
ユーザーは、ライブラリの移行ステータスについて異なる見解を持っている可能性があります。
公式の移行ステータスが `WARN` である間、エラーが発生するようにするか、またはその逆で、
移行が完了するまでエラーの報告を延期することができます。

* `-Xjsr305=@<fq.name>:\{strict|warn|ignore\}` は、単一のアノテーションの動作をオーバーライドします。ここで、`<fq.name>` はアノテーションの完全修飾クラス名です。これは、特定のライブラリの移行状態を管理するのに役立ちます。

`strict`、`warn`、および `ignore` の値は、`MigrationStatus` の値と同じ意味を持ち、`strict` モードのみが Kotlin で表示されるようにアノテーションが付けられた宣言の型に影響を与えます。

:::note
注: 組み込みの JSR-305 アノテーション
[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
[`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html) および
[`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html) は常に有効で、
`-Xjsr305` フラグを使用したコンパイラ構成に関係なく、Kotlin でアノテーションが付けられた宣言の型に影響を与えます。

:::

例えば、`-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` を追加すると、
コンパイラは `@org.library.MyNullable` でアノテーションが付けられた型によってアノテーションが付けられた型の不適切な使用法に対して警告を生成し、他のすべての JSR-305 アノテーションを無視します。

デフォルトの動作は `-Xjsr305=warn` と同じです。
`strict` 値は実験的と見なされるべきです (将来的にチェックが追加される可能性があります)。

## マップされた型

Kotlinは、一部のJava型を特別に扱います。このような型は、Javaから「そのまま」ロードされるのではなく、対応するKotlin型に_マップ_されます。
マッピングはコンパイル時にのみ重要であり、ランタイム表現は変更されません。
Javaのプリミティブ型は、対応するKotlin型にマップされます（[プラットフォーム型](#null-safety-and-platform-types)を念頭に置いて）:

| **Java型** | **Kotlin型**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

一部の非プリミティブな組み込みクラスもマップされます:

| **Java型** | **Kotlin型**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.annotation.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |

Javaのboxedプリミティブ型は、nullableなKotlin型にマップされます:

| **Java型**           | **Kotlin型**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

型パラメーターとして使用されるboxedプリミティブ型は、プラットフォーム型にマップされることに注意してください:
たとえば、`List<java.lang.Integer>` は Kotlin で `List<Int!>` になります。

コレクション型は、Kotlinでは読み取り専用またはmutableにすることができます。そのため、Javaのコレクションは次のようにマップされます
(この表のすべてのKotlin型は、パッケージ `kotlin.collections` にあります):

| **Java型** | **Kotlin読み取り専用型**  | **Kotlin mutable型** | **ロードされたプラットフォーム型** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Javaの配列は、[下記](java-interop#java-arrays)のようにマップされます:

| **Java型** | **Kotlin型**                |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |
:::note
これらのJava型のstaticメンバーは、Kotlin型の[コンパニオンオブジェクト](object-declarations#companion-objects)で直接アクセスできません。
それらを呼び出すには、Java型の完全修飾名を使用します。例：`java.lang.Integer.toHexString(foo)`。

:::

## KotlinのJavaジェネリクス

Kotlinのジェネリクスは、Javaのジェネリクスとは少し異なります（[ジェネリクス](generics)を参照）。
Java型をKotlinにインポートする場合、次の変換が行われます:

* Javaのワイルドカードは、型プロジェクションに変換されます:
  * `Foo<? extends Bar>` は `Foo<out Bar!>!` になります
  * `Foo<? super Bar>` は `Foo<in Bar!>!` になります

* Javaのraw型は、スタープロジェクションに変換されます:
  * `List` は `List<*>!`、つまり `List<out Any?>!` になります

Javaと同様に、Kotlinのジェネリクスは実行時に保持されません。オブジェクトは、コンストラクターに渡される実際の型引数に関する情報を保持しません。
たとえば、`ArrayList<Integer>()` は `ArrayList<Character>()` と区別できません。
これにより、ジェネリクスを考慮した `is` チェックを実行することは不可能になります。
Kotlinでは、スター投影されたジェネリック型に対してのみ `is` チェックが許可されています:

```kotlin
if (a is List<Int>) // エラー: Intのリストであるかを実際にチェックできません
// しかし
if (a is List<*>) // OK: リストの内容に関する保証はありません
```

## Java配列

Kotlinの配列は、Javaとは異なり、不変です。これは、Kotlinでは `Array<String>` を `Array<Any>` に割り当てることはできないことを意味します。
これにより、実行時に発生する可能性のあるエラーが防止されます。サブクラスの配列をKotlinメソッドにスーパークラスの配列として渡すことも禁止されていますが、Javaメソッドの場合、これは `Array<(out) String>!` という形式の[プラットフォーム型](#null-safety-and-platform-types)を介して許可されています。

配列は、Javaプラットフォームでプリミティブデータ型で使用され、ボクシング/アンボクシング操作のコストを回避します。
Kotlinはこれらの実装の詳細を隠蔽するため、Javaコードとインターフェースするには回避策が必要です。
この場合を処理するために、プリミティブ配列のすべての型（`IntArray`、`DoubleArray`、`CharArray`など）に特化したクラスがあります。
これらは `Array` クラスとは関係がなく、パフォーマンスを最大化するためにJavaのプリミティブ配列にコンパイルされます。

インデックスのint配列を受け入れるJavaメソッドがあるとします:

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

Kotlinでプリミティブ値の配列を渡すには、次のようにします:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // int[]をメソッドに渡します
```

JVMバイトコードにコンパイルするとき、コンパイラーは配列へのアクセスを最適化し、オーバーヘッドが発生しないようにします:

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // get() と set() への実際の呼び出しは生成されません
for (x in array) { // イテレーターは作成されません
    print(x)
}
```

インデックスで移動する場合でも、オーバーヘッドは発生しません:

```kotlin
for (i in array.indices) { // イテレーターは作成されません
    array[i] += 2
}
```

最後に、`in` チェックにもオーバーヘッドはありません:

```kotlin
if (i in array.indices) { // (i >= 0 && i < array.size) と同じ
    print(array[i])
}
```

## Java varargs

Javaクラスは、可変個の引数（varargs）を使用してインデックスのメソッド宣言を使用する場合があります:

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

その場合、スプレッド演算子 `*` を使用して `IntArray` を渡す必要があります:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 演算子

Javaには、演算子の構文を使用するのに意味のあるメソッドをマークする方法がないため、Kotlinでは、適切な名前とシグネチャを持つJavaメソッドを演算子のオーバーロードやその他の慣習（`invoke()`など）として使用できます。
infix呼び出し構文を使用したJavaメソッドの呼び出しは許可されていません。

## チェック例外

Kotlinでは、すべての[例外はunchecked](exceptions)です。つまり、コンパイラーは例外をキャッチするように強制しません。
したがって、チェック例外を宣言するJavaメソッドを呼び出す場合、Kotlinは何も強制しません:

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // JavaではここでIOExceptionをキャッチする必要があります
    }
}
```

## Objectメソッド

Java型がKotlinにインポートされると、型 `java.lang.Object` のすべての参照が `Any` に変換されます。
`Any` はプラットフォーム固有ではないため、`toString()`、`hashCode()`、`equals()` のみがメンバーとして宣言されます。
そのため、`java.lang.Object` の他のメンバーを使用できるようにするために、Kotlinは[拡張関数](extensions)を使用します。

### wait()/notify()

メソッド `wait()` と `notify()` は、型 `Any` の参照では使用できません。これらの使用は、一般に `java.util.concurrent` を優先して推奨されていません。
これらのメソッドを本当に呼び出す必要がある場合は、`java.lang.Object` にキャストできます:

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

オブジェクトのJavaクラスを取得するには、[クラス参照](reflection#class-references)で `java` 拡張プロパティを使用します:

```kotlin
val fooClass = foo::class.java
```

上記のコードは、[バインドされたクラス参照](reflection#bound-class-references)を使用しています。`javaClass` 拡張プロパティを使用することもできます:

```kotlin
val fooClass = foo