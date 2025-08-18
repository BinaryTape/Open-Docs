[//]: # (title: KotlinからのJavaの呼び出し)

KotlinはJavaとの相互運用性を考慮して設計されています。既存のJavaコードはKotlinから自然な形で呼び出すことができ、KotlinコードもJavaからスムーズに使用できます。このセクションでは、KotlinからJavaコードを呼び出す際の詳細について説明します。

ほぼすべてのJavaコードは問題なく使用できます。

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for'-loops work for Java collections:
    for (item in source) {
        list.add(item)
    }
    // Operator conventions work as well:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get and set are called
    }
}
```

## ゲッターとセッター

Javaのゲッターとセッターの規約（`get`で始まる引数なしのメソッド、`set`で始まる単一引数のメソッド）に従うメソッドは、Kotlinではプロパティとして表現されます。このようなプロパティは*合成プロパティ*（_synthetic properties_）とも呼ばれます。`Boolean`アクセサメソッド（ゲッターの名前が`is`で始まり、セッターの名前が`set`で始まるもの）は、ゲッターメソッドと同じ名前を持つプロパティとして表現されます。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) { // call getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY // call setFirstDayOfWeek()
    }
    if (!calendar.isLenient) { // call isLenient()
        calendar.isLenient = true // call setLenient()
    }
}
```

上記の`calendar.firstDayOfWeek`は、合成プロパティの一例です。

なお、Javaクラスがセッターしか持たない場合、Kotlinはセット専用プロパティをサポートしないため、Kotlinではプロパティとして表示されません。

## Java合成プロパティ参照

> この機能は[実験的（Experimental）](components-stability.md#stability-levels-explained)です。いつでも廃止または変更される可能性があります。
> 評価目的でのみ使用することをお勧めします。
>
{style="warning"}

Kotlin 1.8.20以降、Java合成プロパティへの参照を作成できるようになりました。以下のJavaコードを考えてみましょう。

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

Kotlinでは常に`person.age`と書くことができ、`age`は合成プロパティです。これに加えて、`Person::age`や`person::age`への参照も作成できるようになりました。`name`についても同様です。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
         // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```

### Java合成プロパティ参照を有効にする方法 {initial-collapse-state="collapsed" collapsible="true"}

この機能を有効にするには、`-language-version 2.1`コンパイラオプションを設定します。Gradleプロジェクトでは、`build.gradle(.kts)`に以下を追加することで設定できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion
            = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
}
```

</tab>
</tabs>

> Kotlin 1.9.0より前では、この機能を有効にするには`-language-version 1.9`コンパイラオプションを設定する必要がありました。
> 
{style="note"}

## `void`を返すメソッド

Javaメソッドが`void`を返す場合、Kotlinから呼び出すと`Unit`を返します。
もしその戻り値が何らかの形で使用されたとしても、値自体は事前にわかっているため（`Unit`であるため）、Kotlinコンパイラによって呼び出し元で割り当てられます。

## KotlinのキーワードであるJava識別子のエスケープ

Kotlinの一部のキーワードは、Javaでは有効な識別子です。例えば、`in`、`object`、`is`などです。
JavaライブラリがKotlinのキーワードをメソッド名に使用している場合でも、バッククォート（`）文字でエスケープすることでメソッドを呼び出すことができます。

```kotlin
foo.`is`(bar)
```

## Null安全性とプラットフォーム型

Javaのすべての参照は`null`になる可能性があるため、Javaから来るオブジェクトに対してKotlinの厳格なNull安全性の要件を適用するのは現実的ではありません。
Javaの宣言の型はKotlinでは特定の方法で扱われ、*プラットフォーム型*と呼ばれます。これらの型に対してはNullチェックが緩和され、安全性保証はJavaと同じになります（詳細は[以下](#mapped-types)を参照）。

以下の例を考えてみましょう。

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

プラットフォーム型の変数に対してメソッドを呼び出す場合、Kotlinはコンパイル時にNull許容性エラーを発行しませんが、Nullポインター例外またはKotlinがNullの伝播を防ぐために生成するアサーションによって、実行時に呼び出しが失敗する可能性があります。

```kotlin
item.substring(1) // allowed, throws an exception if item == null
```

プラットフォーム型は*表記不可能*（non-denotable）であり、言語で明示的に記述することはできません。
プラットフォーム値がKotlin変数に割り当てられる場合、型推論に頼るか（上記の例の`item`のように、変数は推論されたプラットフォーム型になります）、または期待する型を選択できます（Null許容型と非Null許容型の両方が許可されます）。

```kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

非Null許容型を選択した場合、コンパイラは代入時にアサーションを出力します。これにより、Kotlinの非Null許容変数がNullを保持することを防ぎます。アサーションは、プラットフォーム値を非Null値を期待するKotlin関数に渡す場合や、その他の場合にも出力されます。
全体として、ジェネリクスによっては完全に排除できない場合もありますが、コンパイラはプログラム全体にNullが伝播しないように最善を尽くします。

### プラットフォーム型の表記法

前述のとおり、プラットフォーム型はプログラム中で明示的に言及できないため、言語にはそれらを記述するための構文がありません。
しかし、コンパイラやIDEは（エラーメッセージやパラメータ情報などで）それらを表示する必要がある場合があるため、ニーモニック表記が存在します。

*   `T!` は「`T`または`T?`」を意味します。
*   `(Mutable)Collection<T>!` は「`T`のJavaコレクション。可変または不変、Null許容または非Null許容」を意味します。
*   `Array<(out) T>!` は「`T`（または`T`のサブタイプ）のJava配列。Null許容または非Null許容」を意味します。

### Null許容性アノテーション

Null許容性アノテーションを持つJava型は、プラットフォーム型としてではなく、実際のNull許容または非Null許容Kotlin型として表現されます。コンパイラは、いくつかの種類のNull許容性アノテーションをサポートしています。

*   [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
    (`org.jetbrains.annotations`パッケージの`@Nullable`および`@NotNull`)
*   [JSpecify](https://jspecify.dev/) (`org.jspecify.annotations`)
*   Android (`com.android.annotations`および`android.support.annotations`)
*   JSR-305 (`javax.annotation`、詳細は以下を参照)
*   FindBugs (`edu.umd.cs.findbugs.annotations`)
*   Eclipse (`org.eclipse.jdt.annotation`)
*   Lombok (`lombok.NonNull`)
*   RxJava 3 (`io.reactivex.rxjava3.annotations`)

特定の種類のNull許容性アノテーションからの情報に基づいて、コンパイラがNull許容性の不一致を報告するかどうかを指定できます。コンパイラオプション`-Xnullability-annotations=@<package-name>:<report-level>`を使用します。引数には、完全修飾されたNull許容性アノテーションパッケージと、以下のいずれかのレポートレベルを指定します。
*   `ignore`: Null許容性の不一致を無視します。
*   `warn`: 警告を報告します。
*   `strict`: エラーを報告します。

サポートされているNull許容性アノテーションの完全なリストは、[Kotlinコンパイラのソースコード](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)で確認できます。

### 型引数と型パラメータのアノテーション

総称型（generic types）の型引数と型パラメータにもNull許容性情報を指定するアノテーションを付けることができます。

> このセクションのすべての例では、`org.jetbrains.annotations`パッケージのJetBrains Null許容性アノテーションを使用しています。
>
{style="note"}

#### 型引数

Javaの宣言に付けられたこれらのアノテーションを考えてみましょう。

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

これらはKotlinで以下のシグネチャになります。

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

型引数から`@NotNull`アノテーションが欠落している場合、代わりにプラットフォーム型が得られます。

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlinは、基底クラスやインターフェースの型引数に関するNull許容性アノテーションも考慮します。例えば、以下に示すシグネチャを持つ2つのJavaクラスがあるとします。

```java
public class Base<T> {}
```

```java
public class Derived extends Base<@Nullable String> {}
```

Kotlinコードでは、`Base<String>`が想定される場所で`Derived`のインスタンスを渡すと、警告が生成されます。

```kotlin
fun takeBaseOfNotNullStrings(x: Base<String>) {}

fun main() {
    takeBaseOfNotNullStrings(Derived()) // warning: nullability mismatch
}
```

`Derived`の上限は`Base<String?>`に設定されており、これは`Base<String>`とは異なります。

[KotlinにおけるJavaジェネリクス](#java-generics-in-kotlin)の詳細をご覧ください。

#### 型パラメータ

デフォルトでは、KotlinとJavaの両方におけるプレーンな型パラメータのNull許容性は未定義です。Javaでは、Null許容性アノテーションを使用してそれを指定できます。`Base`クラスの型パラメータにアノテーションを付けてみましょう。

```java
public class Base<@NotNull T> {}
```

`Base`から継承する場合、Kotlinは非Null許容の型引数または型パラメータを期待します。
したがって、以下のKotlinコードは警告を生成します。

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

`K : Any`という上限を指定することで、これを修正できます。

Kotlinは、Javaの型パラメータの上限に対するNull許容性アノテーションもサポートしています。`Base`に上限を追加してみましょう。

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlinはこれを以下のように変換します。

```kotlin
class BaseWithBound<T : Number> {}
```

そのため、Null許容型を型引数または型パラメータとして渡すと警告が生成されます。

型引数と型パラメータのアノテーションは、Java 8以降のターゲットで動作します。この機能は、Null許容性アノテーションが`TYPE_USE`ターゲットをサポートしている必要があります（`org.jetbrains.annotations`はバージョン15以降でこれをサポートしています）。

> Null許容性アノテーションが`TYPE_USE`ターゲットに加えて型に適用可能な他のターゲットをサポートしている場合、`TYPE_USE`が優先されます。例えば、`@Nullable`が`TYPE_USE`と`METHOD`の両方のターゲットを持つ場合、Javaのメソッドシグネチャ`@Nullable String[] f()`はKotlinで`fun f(): Array<String?>!`になります。
>
{style="note"}

### JSR-305サポート

[JSR-305](https://jcp.org/en/jsr/detail?id=305)で定義されている[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)アノテーションは、Java型のNull許容性を示すためにサポートされています。

`@Nonnull(when = ...)`の値が`When.ALWAYS`の場合、アノテーションが付けられた型は非Null許容として扱われます。`When.MAYBE`と`When.NEVER`はNull許容型を示し、`When.UNKNOWN`は型を[プラットフォーム型](#null-safety-and-platform-types)に強制します。

ライブラリはJSR-305アノテーションに対してコンパイルできますが、アノテーションアーティファクト（例：`jsr305.jar`）をライブラリ利用者のコンパイル依存関係にする必要はありません。Kotlinコンパイラは、クラスパスにアノテーションが存在しなくても、ライブラリからJSR-305アノテーションを読み取ることができます。

[カスタムNull許容性修飾子 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md)もサポートされています（以下参照）。

#### 型修飾子ニックネーム

アノテーション型が[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)とJSR-305の`@Nonnull`（または`@CheckForNull`などの別のニックネーム）の両方でアノテーションされている場合、そのアノテーション型自体が正確なNull許容性を取得するために使用され、そのNull許容性アノテーションと同じ意味を持ちます。

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // a nickname to another type qualifier nickname
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // in Kotlin (strict mode): `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // in Kotlin (strict mode): `fun bar(x: List<String>!): String!`
}
```

#### 型修飾子デフォルト

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)は、適用されると、アノテーションされた要素のスコープ内でデフォルトのNull許容性を定義するアノテーションを導入することができます。

このようなアノテーション型は、それ自体が`@Nonnull`（またはそのニックネーム）と`@TypeQualifierDefault(...)`の両方で、1つ以上の`ElementType`値と共にアノテーションされている必要があります。

*   `ElementType.METHOD`: メソッドの戻り値の型
*   `ElementType.PARAMETER`: 値パラメータ
*   `ElementType.FIELD`: フィールド
*   `ElementType.TYPE_USE`: 型引数、型パラメータの上限、ワイルドカード型を含む任意の型

デフォルトのNull許容性は、型自体にNull許容性アノテーションが付けられていない場合に使用され、デフォルトは、型使用法に一致する`ElementType`を持つ型修飾子デフォルトアノテーションでアノテーションされた最も内側の囲む要素によって決定されます。

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

    @NotNullApi // overriding default from the interface
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // The List<String> type argument is seen as nullable because of `@NullableApi`
    // having the `TYPE_USE` element type:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // The type of `x` parameter remains platform because there's an explicit
    // UNKNOWN-marked nullability annotation:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

> この例の型は、strictモードが有効な場合にのみ適用されます。それ以外の場合、プラットフォーム型はそのまま残ります。
> [`@UnderMigration`アノテーション](#undermigration-annotation)と[コンパイラ設定](#compiler-configuration)のセクションを参照してください。
>
{style="note"}

パッケージレベルのデフォルトNull許容性もサポートされています。

```java
// FILE: test/package-info.java
@NonNullApi // declaring all types in package 'test' as non-nullable by default
package test;
```

#### `@UnderMigration`アノテーション

`@UnderMigration`アノテーション（`kotlin-annotations-jvm`という別個のアーティファクトで提供）は、ライブラリのメンテナーがNull許容性型修飾子の移行ステータスを定義するために使用できます。

`@UnderMigration(status = ...)`のステータス値は、アノテーション付き型のKotlinでの不適切な使用（例：`@MyNullable`アノテーション付き型値を非Nullとして使用する）をコンパイラがどのように扱うかを指定します。

*   `MigrationStatus.STRICT`: アノテーションを通常のNull許容性アノテーションとして機能させ、不適切な使用に対してエラーを報告し、アノテーション付き宣言内の型にKotlinで認識されるように影響を与えます。
*   `MigrationStatus.WARN`: 不適切な使用はエラーではなくコンパイル警告として報告されますが、アノテーション付き宣言内の型はプラットフォーム型として残ります。
*   `MigrationStatus.IGNORE`: コンパイラがNull許容性アノテーションを完全に無視します。

ライブラリのメンテナーは、型修飾子のニックネームと型修飾子のデフォルトの両方に`@UnderMigration`ステータスを追加できます。

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// The types in the class are non-nullable, but only warnings are reported
// because `@NonNullApi` is annotated `@UnderMigration(status = MigrationStatus.WARN)`
@NonNullApi
public class Test {}
```

> Null許容性アノテーションの移行ステータスは、その型修飾子ニックネームには継承されませんが、デフォルトの型修飾子での使用には適用されます。
>
{style="note"}

デフォルトの型修飾子が型修飾子のニックネームを使用し、それらが両方とも`@UnderMigration`である場合、デフォルトの型修飾子からのステータスが使用されます。

#### コンパイラ設定

JSR-305のチェックは、以下のオプション（およびその組み合わせ）とともに`-Xjsr305`コンパイラフラグを追加することで設定できます。

*   `-Xjsr305={strict|warn|ignore}`: `@UnderMigration`アノテーションではないアノテーションの動作を設定します。
    カスタムNull許容性修飾子、特に`@TypeQualifierDefault`は、すでに多くの著名なライブラリに普及しており、ユーザーはJSR-305サポートを含むKotlinバージョンに更新する際にスムーズに移行する必要があるかもしれません。Kotlin 1.1.60以降、このフラグは`@UnderMigration`アノテーションではないものにのみ影響します。

*   `-Xjsr305=under-migration:{strict|warn|ignore}`: `@UnderMigration`アノテーションの動作を上書きします。
    ユーザーはライブラリの移行ステータスについて異なる見解を持つかもしれません。公式の移行ステータスが`WARN`であるにもかかわらずエラーを発生させたい場合や、その逆の場合、または一部のエラー報告を移行が完了するまで延期したい場合があります。

*   `-Xjsr305=@<fq.name>:{strict|warn|ignore}`: 単一のアノテーションの動作を上書きします。`<fq.name>`はアノテーションの完全修飾クラス名です。異なるアノテーションに対して複数回出現する場合があります。これは特定のライブラリの移行状態を管理するのに役立ちます。

`strict`、`warn`、`ignore`の値は`MigrationStatus`と同じ意味を持ち、`strict`モードのみがアノテーション付き宣言内の型にKotlinで認識されるように影響します。

> 注：組み込みのJSR-305アノテーション[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
> [`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html)、
> [`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html)は常に有効であり、
> `-Xjsr305`フラグによるコンパイラ設定に関わらず、Kotlinにおけるアノテーション付き宣言の型に影響を与えます。
>
{style="note"}

例えば、コンパイラ引数に`-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn`を追加すると、コンパイラは`@org.library.MyNullable`でアノテーションされた型の不適切な使用に対して警告を生成し、他のすべてのJSR-305アノテーションを無視します。

デフォルトの動作は`-Xjsr305=warn`と同じです。`strict`の値は実験的と見なすべきです（将来的により多くのチェックが追加される可能性があります）。

## マップされる型

Kotlinは、特定のJava型を特別に扱います。これらの型はJavaから「そのまま」ロードされるのではなく、対応するKotlin型に*マップ*されます。マッピングはコンパイル時にのみ重要であり、実行時の表現は変更されません。
Javaのプリミティブ型は、対応するKotlin型にマップされます（[プラットフォーム型](#null-safety-and-platform-types)を考慮して）。

| **Java型** | **Kotlin型** |
|---------------|------------------|
| `byte` | `kotlin.Byte` |
| `short` | `kotlin.Short` |
| `int` | `kotlin.Int` |
| `long` | `kotlin.Long` |
| `char` | `kotlin.Char` |
| `float` | `kotlin.Float` |
| `double` | `kotlin.Double` |
| `boolean` | `kotlin.Boolean` |

一部の非プリミティブな組み込みクラスもマップされます。

| **Java型** | **Kotlin型** |
|---------------|------------------|
| `java.lang.Object` | `kotlin.Any!` |
| `java.lang.Cloneable` | `kotlin.Cloneable!` |
| `java.lang.Comparable` | `kotlin.Comparable!` |
| `java.lang.Enum` | `kotlin.Enum!` |
| `java.lang.annotation.Annotation` | `kotlin.Annotation!` |
| `java.lang.CharSequence` | `kotlin.CharSequence!` |
| `java.lang.String` | `kotlin.String!` |
| `java.lang.Number` | `kotlin.Number!` |
| `java.lang.Throwable` | `kotlin.Throwable!` |

Javaのボックス化されたプリミティブ型は、Null許容Kotlin型にマップされます。

| **Java型** | **Kotlin型** |
|-------------------------|------------------|
| `java.lang.Byte` | `kotlin.Byte?` |
| `java.lang.Short` | `kotlin.Short?` |
| `java.lang.Integer` | `kotlin.Int?` |
| `java.lang.Long` | `kotlin.Long?` |
| `java.lang.Character` | `kotlin.Char?` |
| `java.lang.Float` | `kotlin.Float?` |
| `java.lang.Double` | `kotlin.Double?` |
| `java.lang.Boolean` | `kotlin.Boolean?` |

型パラメータとして使用されるボックス化されたプリミティブ型は、プラットフォーム型にマップされることに注意してください。
例えば、`List<java.lang.Integer>`はKotlinでは`List<Int!>`になります。

コレクション型はKotlinでは読み取り専用または可変になる場合があるため、Javaのコレクションは次のようにマップされます（この表のすべてのKotlin型は`kotlin.collections`パッケージにあります）。

| **Java型** | **Kotlin読み取り専用型** | **Kotlin可変型** | **ロードされるプラットフォーム型** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>` | `Iterator<T>` | `MutableIterator<T>` | `(Mutable)Iterator<T>!` |
| `Iterable<T>` | `Iterable<T>` | `MutableIterable<T>` | `(Mutable)Iterable<T>!` |
| `Collection<T>` | `Collection<T>` | `MutableCollection<T>` | `(Mutable)Collection<T>!` |
| `Set<T>` | `Set<T>` | `MutableSet<T>` | `(Mutable)Set<T>!` |
| `List<T>` | `List<T>` | `MutableList<T>` | `(Mutable)List<T>!` |
| `ListIterator<T>` | `ListIterator<T>` | `MutableListIterator<T>` | `(Mutable)ListIterator<T>!` |
| `Map<K, V>` | `Map<K, V>` | `MutableMap<K, V>` | `(Mutable)Map<K, V>!` |
| `Map.Entry<K, V>` | `Map.Entry<K, V>` | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Javaの配列は、[以下](#java-arrays)で述べられているようにマップされます。

| **Java型** | **Kotlin型** |
|---------------|--------------------------------|
| `int[]` | `kotlin.IntArray!` |
| `String[]` | `kotlin.Array<(out) String!>!` |

>これらのJava型の静的メンバーは、Kotlin型の[コンパニオンオブジェクト](object-declarations.md#companion-objects)では直接アクセスできません。それらを呼び出すには、`java.lang.Integer.toHexString(foo)`のように、Java型の完全修飾名を使用します。
>
{style="note"}

## KotlinにおけるJavaジェネリクス

KotlinのジェネリクスはJavaのジェネリクスとは少し異なります（[ジェネリクス](generics.md)を参照）。
Java型をKotlinにインポートする際、以下の変換が行われます。

*   Javaのワイルドカードは型プロジェクションに変換されます。
    *   `Foo<? extends Bar>` は `Foo<out Bar!>!` になります。
    *   `Foo<? super Bar>` は `Foo<in Bar!>!` になります。

*   Javaの生の型（raw types）はスタープロジェクションに変換されます。
    *   `List` は `List<*>!`、つまり `List<out Any?>!` になります。

Javaと同様に、Kotlinのジェネリクスは実行時には保持されません。オブジェクトはコンストラクタに渡された実際の型引数に関する情報を持ちません。例えば、`ArrayList<Integer>()`と`ArrayList<Character>()`は区別できません。
このため、ジェネリクスを考慮した`is`チェックを実行することは不可能です。
Kotlinでは、スタープロジェクションされた総称型に対してのみ`is`チェックが可能です。

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java配列

Kotlinの配列は不変であり、Javaとは異なります。これは、Kotlinが`Array<String>`を`Array<Any>`に割り当てることを許可しないことを意味し、これにより起こりうる実行時エラーを防ぎます。サブクラスの配列をスーパークラスの配列としてKotlinメソッドに渡すことも禁止されていますが、Javaメソッドの場合は`Array<(out) String>!`のような[プラットフォーム型](#null-safety-and-platform-types)を介して許可されます。

配列は、ボクシング/アンボクシング操作のコストを避けるために、Javaプラットフォームでプリミティブデータ型と共に使用されます。
Kotlinはこれらの実装の詳細を隠蔽するため、Javaコードとインターフェースするには回避策が必要です。
このケースを処理するために、すべてのプリミティブ配列型（`IntArray`、`DoubleArray`、`CharArray`など）に特化したクラスがあります。
これらは`Array`クラスとは関連しておらず、最高のパフォーマンスのためにJavaのプリミティブ配列にコンパイルされます。

インデックスの`int`配列を受け入れるJavaメソッドがあるとします。

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

プリミティブ値の配列を渡すには、Kotlinで次のようにします。

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

JVMバイトコードにコンパイルされる際、コンパイラは配列へのアクセスを最適化し、オーバーヘッドが発生しないようにします。

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // no actual calls to get() and set() generated
for (x in array) { // no iterator created
    print(x)
}
```

インデックスでナビゲートする場合でも、オーバーヘッドは発生しません。

```kotlin
for (i in array.indices) { // no iterator created
    array[i] += 2
}
```

最後に、`in`チェックにもオーバーヘッドはありません。

```kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
    print(array[i])
}
```

## Javaの可変長引数（varargs）

Javaクラスでは、インデックスに対して可変数の引数（varargs）を持つメソッド宣言が使用されることがあります。

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

この場合、`IntArray`を渡すにはスプレッド演算子`*`を使用する必要があります。

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 演算子

Javaには演算子構文を使用することが理にかなっているメソッドをマークする方法がないため、Kotlinでは適切な名前とシグネチャを持つ任意のJavaメソッドを演算子オーバーロードやその他の規約（`invoke()`など）として使用できます。中置呼び出し構文を使用してJavaメソッドを呼び出すことは許可されていません。

## チェック例外

Kotlinでは、すべての[例外はアンチェック](exceptions.md)です。つまり、コンパイラはそれらをキャッチすることを強制しません。
そのため、チェック例外を宣言するJavaメソッドを呼び出す場合でも、Kotlinは何も強制しません。

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java would require us to catch IOException here
    }
}
```

## `Object`クラスのメソッド

Java型がKotlinにインポートされると、`java.lang.Object`型のすべての参照は`Any`に変換されます。
`Any`はプラットフォーム固有ではないため、メンバーとして`toString()`、`hashCode()`、`equals()`のみを宣言します。
したがって、`java.lang.Object`の他のメンバーを利用可能にするために、Kotlinは[拡張関数](extensions.md)を使用します。

### `wait()`/`notify()`

`wait()`および`notify()`メソッドは`Any`型の参照では利用できません。これらの使用は一般的に`java.util.concurrent`を優先して推奨されていません。どうしてもこれらのメソッドを呼び出す必要がある場合は、`java.lang.Object`にキャストできます。

```kotlin
(foo as java.lang.Object).wait()
```

### `getClass()`

オブジェクトのJavaクラスを取得するには、[クラス参照](reflection.md#class-references)の`java`拡張プロパティを使用します。

```kotlin
val fooClass = foo::class.java
```

上記のコードは[バウンドクラスリファレンス](reflection.md#bound-class-references)を使用しています。`javaClass`拡張プロパティを使用することもできます。

```kotlin
val fooClass = foo.javaClass
```

### `clone()`

`clone()`をオーバーライドするには、クラスが`kotlin.Cloneable`を継承する必要があります。

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

[『Effective Java 第3版』](https://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目13「`clone`を慎重にオーバーライドする」も忘れないでください。

### `finalize()`

`finalize()`をオーバーライドするには、`override`キーワードを使用せずに単純に宣言するだけです。

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
    }
}
```

Javaのルールによると、`finalize()`は`private`であってはなりません。

## Javaクラスからの継承

Kotlinのクラスは、最大1つのJavaクラス（および任意の数のJavaインターフェース）をスーパークラスとすることができます。

## 静的メンバーへのアクセス

Javaクラスの静的メンバーは、これらのクラスの「コンパニオンオブジェクト」を形成します。このような「コンパニオンオブジェクト」を値として渡すことはできませんが、メンバーには明示的にアクセスできます。例えば、次のようになります。

```kotlin
if (Character.isLetter(a)) { ... }
```

[マップされる型](#mapped-types)であるJava型の静的メンバーにアクセスするには、`java.lang.Integer.bitCount(foo)`のように、Java型の完全修飾名を使用します。

## Javaリフレクション

JavaリフレクションはKotlinクラスで動作し、その逆も同様です。前述のとおり、`instance::class.java`、`ClassName::class.java`、または`instance.javaClass`を使用して`java.lang.Class`を介してJavaリフレクションに入ることができます。
`ClassName.javaClass`をこの目的で使用しないでください。これは`ClassName`のコンパニオンオブジェクトクラスを参照し、`ClassName.Companion::class.java`と同じであり、`ClassName::class.java`とは異なります。

各プリミティブ型には2つの異なるJavaクラスがあり、Kotlinは両方を取得する方法を提供します。例えば、`Int::class.java`はプリミティブ型自体を表すクラスインスタンスを返します。これはJavaの`Integer.TYPE`に相当します。対応するラッパー型のクラスを取得するには、Javaの`Integer.class`と同等の`Int::class.javaObjectType`を使用します。

その他のサポートされるケースには、KotlinプロパティのJavaゲッター/セッターメソッドまたはバッキングフィールドの取得、Javaフィールドの`KProperty`の取得、`KFunction`のJavaメソッドまたはコンストラクタの取得、およびその逆が含まれます。

## SAM変換

KotlinはJavaと[Kotlinインターフェース](fun-interfaces.md)の両方でSAM変換をサポートしています。
Javaに対するこのサポートは、Kotlinの関数リテラルが、単一の非デフォルトメソッドを持つJavaインターフェースの実装に自動的に変換できることを意味します。ただし、インターフェースメソッドのパラメータ型がKotlin関数のパラメータ型と一致する必要があります。

これを使用してSAMインターフェースのインスタンスを作成できます。

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

…そしてメソッド呼び出しで。

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

Javaクラスが複数の関数インターフェースを取るメソッドを持っている場合、ラムダを特定のSAM型に変換するアダプター関数を使用することで、呼び出す必要があるメソッドを選択できます。これらのアダプター関数も必要に応じてコンパイラによって生成されます。

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM変換はインターフェースにのみ機能し、抽象クラスには機能しません。抽象クラスが単一の抽象メソッドしか持たない場合でも同様です。
>
{style="note"}

## KotlinでのJNIの使用

ネイティブ（CまたはC++）コードで実装された関数を宣言するには、`external`修飾子でマークする必要があります。

```kotlin
external fun foo(x: Int): Double
```

残りの手順はJavaとまったく同じです。

プロパティのゲッターとセッターも`external`としてマークできます。

```kotlin
var myProperty: String
    external get
    external set
```

内部的には、これにより`getMyProperty`と`setMyProperty`という2つの関数が作成され、どちらも`external`としてマークされます。

## KotlinでLombokによって生成された宣言を使用する

JavaのLombokによって生成された宣言をKotlinコードで使用できます。
同じJava/Kotlin混在モジュールでこれらの宣言を生成して使用する必要がある場合は、[Lombokコンパイラプラグインのページ](lombok.md)でその方法を学ぶことができます。
別のモジュールからそのような宣言を呼び出す場合、そのモジュールをコンパイルするためにこのプラグインを使用する必要はありません。