[//]: # (title: KotlinからJavaを呼び出す)

KotlinはJavaとの相互運用性を念頭に置いて設計されています。既存のJavaコードはKotlinから自然な方法で呼び出すことができ、KotlinコードもJavaからかなりスムーズに利用できます。このセクションでは、KotlinからJavaコードを呼び出すことに関するいくつかの詳細を説明します。

ほぼすべてのJavaコードを問題なく使用できます。

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

## Getters and setters

ゲッターとセッターに関するJavaの規約に従うメソッド（`get`で始まる引数なしのメソッドと、`set`で始まる単一引数メソッド）は、Kotlinではプロパティとして表現されます。このようなプロパティは_合成プロパティ_とも呼ばれます。`Boolean`アクセサーメソッド（ゲッターの名前が`is`で始まり、セッターの名前が`set`で始まる場合）は、ゲッターメソッドと同じ名前を持つプロパティとして表現されます。

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

Javaクラスがセッターのみを持つ場合、Kotlinはセッター専用プロパティをサポートしていないため、Kotlinではプロパティとして表示されないことに注意してください。

## Java synthetic property references

> この機能は[Experimental](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用することをお勧めします。
> {style="warning"}

Kotlin 1.8.20以降、Javaの合成プロパティへの参照を作成できるようになりました。次のJavaコードを考えてみましょう。

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

Kotlinでは常に`person.age`と記述することが許可されていましたが、ここで`age`は合成プロパティです。現在では、`Person::age`や`person::age`への参照も作成できます。`name`にも同様に適用されます。

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
         // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
         // Call Java getter via the Kotlin property syntax:
        .forEach { person -> println(person.name) }
```

### Javaの合成プロパティ参照を有効にする方法 {initial-collapse-state="collapsed" collapsible="true"}

この機能を有効にするには、`-language-version 2.1`コンパイラオプションを設定します。Gradleプロジェクトでは、`build.gradle(.kts)`に次を追加することで実現できます。

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

> Kotlin 1.9.0より前は、この機能を有効にするには`-language-version 1.9`コンパイラオプションを設定する必要がありました。
> {style="note"}

## Methods returning void

Javaメソッドが`void`を返す場合、Kotlinから呼び出されると`Unit`を返します。もし何らかの理由でその戻り値が使用された場合でも、値自体が事前に（`Unit`であることが）分かっているため、Kotlinコンパイラによって呼び出しサイトで割り当てられます。

## Escaping for Java identifiers that are keywords in Kotlin

Kotlinのキーワードの中には、Javaで有効な識別子であるものがあります（`in`、`object`、`is`など）。JavaライブラリがメソッドにKotlinのキーワードを使用している場合でも、バッククォート (`` ` ``) 文字でエスケープして、そのメソッドを呼び出すことができます。

```kotlin
foo.`is`(bar)
```

## Null-safety and platform types

Javaのどの参照も`null`になる可能性があるため、Javaから来るオブジェクトに対してKotlinの厳格なnull安全性要件を適用するのは現実的ではありません。Javaの宣言の型はKotlinでは特定の方法で扱われ、_プラットフォーム型_と呼ばれます。これらの型に対してはnullチェックが緩和され、Javaと同じ安全保証が提供されます（詳細は[下記](#mapped-types)を参照してください）。

次の例を考えてみましょう。

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

プラットフォーム型の変数に対してメソッドを呼び出す場合、Kotlinはコンパイル時にnullabilityエラーを発行しませんが、nullポインタ例外、またはnullが伝播するのを防ぐためにKotlinが生成するアサーションが原因で、実行時に呼び出しが失敗する可能性があります。

```kotlin
item.substring(1) // allowed, throws an exception if item == null
```

プラットフォーム型は_非表現可能_であり、つまり、言語で明示的に記述することはできません。プラットフォーム値がKotlin変数に割り当てられる場合、型推論に頼ることもできます（上記の例の`item`のように、その変数は推論されたプラットフォーム型を持ちます）。または、期待する型を選択することもできます（nullable型とnon-nullable型の両方が許可されます）。

```kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

non-nullable型を選択した場合、コンパイラは割り当て時にアサーションを出力します。これにより、Kotlinのnon-nullable変数がnullを保持することを防ぎます。プラットフォーム値をnon-null値を期待するKotlin関数に渡す場合や、その他の場合にもアサーションが出力されます。全体として、コンパイラはnullがプログラム全体に遠くまで伝播するのを防ぐために最善を尽くしますが、ジェネリクスのため、時には完全に排除することが不可能な場合もあります。

### プラットフォーム型の表記

前述のとおり、プラットフォーム型はプログラム内で明示的に言及することはできません。したがって、言語にはそれらの構文はありません。それにもかかわらず、コンパイラとIDEは時々それらを表示する必要があるため（例えば、エラーメッセージやパラメータ情報など）、それらにはニーモニックな表記法があります。

*   `T!` は「`T` または `T?`」を意味します。
*   `(Mutable)Collection<T>!` は「`T`のJavaコレクション。可変であるか不変であるか、nullableであるかnon-nullableであるか不明」を意味します。
*   `Array<(out) T>!` は「`T`（または`T`のサブタイプ）のJava配列。nullableであるかnon-nullableであるか不明」を意味します。

### Nullabilityアノテーション

nullabilityアノテーションを持つJavaの型は、プラットフォーム型としてではなく、実際のnullableまたはnon-nullableなKotlinの型として表現されます。コンパイラは、以下を含むいくつかの種類のnullabilityアノテーションをサポートしています。

*   [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)（`org.jetbrains.annotations`パッケージの`@Nullable`および`@NotNull`）
*   [JSpecify](https://jspecify.dev/)（`org.jspecify.annotations`）
*   Android（`com.android.annotations`および`android.support.annotations`）
*   JSR-305（`javax.annotation`、詳細は下記）
*   FindBugs（`edu.umd.cs.findbugs.annotations`）
*   Eclipse（`org.eclipse.jdt.annotation`）
*   Lombok（`lombok.NonNull`）
*   RxJava 3（`io.reactivex.rxjava3.annotations`）

特定の種類のnullabilityアノテーションからの情報に基づいて、コンパイラがnullabilityの不一致を報告するかどうかを指定できます。コンパイラオプション`-Xnullability-annotations=@<package-name>:<report-level>`を使用します。引数には、完全修飾されたnullabilityアノテーションパッケージと、次のレポートレベルのいずれかを指定します。
*   `ignore` (nullabilityの不一致を無視する)
*   `warn` (警告を報告する)
*   `strict` (エラーを報告する)

サポートされているnullabilityアノテーションの全リストは、[Kotlinコンパイラのソースコード](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt)を参照してください。

### 型引数と型パラメータのアノテーション

ジェネリック型の型引数と型パラメータにアノテーションを付けることで、それらにもnullability情報を提供できます。

> このセクションのすべての例では、`org.jetbrains.annotations`パッケージのJetBrains nullabilityアノテーションを使用しています。
> {style="note"}

#### 型引数

Javaの宣言におけるこれらのアノテーションを考えてみましょう。

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

これらはKotlinでは次のシグネチャになります。

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

型引数から`@NotNull`アノテーションが欠落している場合、代わりにプラットフォーム型になります。

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Kotlinは、基底クラスやインターフェースの型引数にあるnullabilityアノテーションも考慮します。例えば、以下にシグネチャが示されている2つのJavaクラスがあります。

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

`Derived`の上限は`Base<String?>`に設定され、これは`Base<String>`とは異なります。

[KotlinにおけるJavaジェネリクス](#java-generics-in-kotlin)について詳しく学びましょう。

#### 型パラメータ

デフォルトでは、KotlinとJavaの両方で、通常の型パラメータのnullabilityは未定義です。Javaでは、nullabilityアノテーションを使用してそれを指定できます。`Base`クラスの型パラメータにアノテーションを付けてみましょう。

```java
public class Base<@NotNull T> {}
```

`Base`から継承する場合、Kotlinはnon-nullableな型引数または型パラメータを期待します。したがって、次のKotlinコードは警告を生成します。

```kotlin
class Derived<K> : Base<K> {} // warning: K has undefined nullability
```

上限`K : Any`を指定することで修正できます。

Kotlinは、Javaの型パラメータの境界におけるnullabilityアノテーションもサポートしています。`Base`に境界を追加してみましょう。

```java
public class BaseWithBound<T extends @NotNull Number> {}
```

Kotlinはこれを次のように変換します。

```kotlin
class BaseWithBound<T : Number> {}
```

したがって、nullable型を型引数または型パラメータとして渡すと警告が生成されます。

型引数と型パラメータのアノテーションは、Java 8以降のターゲットで動作します。この機能は、nullabilityアノテーションが`TYPE_USE`ターゲットをサポートしている必要があります（`org.jetbrains.annotations`はバージョン15以降でこれをサポートしています）。

> nullabilityアノテーションが`TYPE_USE`ターゲットに加えて、型に適用可能な他のターゲットもサポートしている場合、
> `TYPE_USE`が優先されます。例えば、`@Nullable`が`TYPE_USE`と`METHOD`の両方のターゲットを持つ場合、Javaメソッドの
> シグネチャ`@Nullable String[] f()`はKotlinでは`fun f(): Array<String?>!`になります。
> {style="note"}

### JSR-305サポート

[JSR-305](https://jcp.org/en/jsr/detail?id=305)で定義されている[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)アノテーションは、Java型のnullabilityを示すためにサポートされています。

`@Nonnull(when = ...)`の値が`When.ALWAYS`の場合、アノテーションが付けられた型はnon-nullableとして扱われます。`When.MAYBE`と`When.NEVER`はnullable型を示し、`When.UNKNOWN`は型を[プラットフォーム型](#null-safety-and-platform-types)にします。

ライブラリはJSR-305アノテーションに対してコンパイルできますが、アノテーションのアーティファクト（例: `jsr305.jar`）をライブラリ利用者のコンパイル依存関係にする必要はありません。Kotlinコンパイラは、クラスパスにアノテーションが存在しなくても、ライブラリからJSR-305アノテーションを読み取ることができます。

[カスタムnullability修飾子 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/master/proposals/jsr-305-custom-nullability-qualifiers.md)もサポートされています（下記参照）。

#### 型修飾子のニックネーム

アノテーション型が[`@TypeQualifierNickname`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierNickname.html)とJSR-305の`@Nonnull`（または`@CheckForNull`などの別のニックネーム）の両方でアノテーションされている場合、そのアノテーション型自体が正確なnullabilityを取得するために使用され、そのnullabilityアノテーションと同じ意味を持ちます。

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

#### 型修飾子のデフォルト

[`@TypeQualifierDefault`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/meta/TypeQualifierDefault.html)は、適用された場合に、アノテーションされた要素のスコープ内でデフォルトのnullabilityを定義するアノテーションを導入することを可能にします。

そのようなアノテーション型自体は、`@Nonnull`（またはそのニックネーム）と、1つ以上の`ElementType`値を持つ`@TypeQualifierDefault(...)`の両方でアノテーションされている必要があります。

*   `ElementType.METHOD` (メソッドの戻り値の型の場合)
*   `ElementType.PARAMETER` (値パラメータの場合)
*   `ElementType.FIELD` (フィールドの場合)
*   `ElementType.TYPE_USE` (型引数、型パラメータの上限、ワイルドカード型を含む任意の型の場合)

デフォルトのnullabilityは、型自体がnullabilityアノテーションによってアノテーションされていない場合に使用され、そのデフォルトは、型使用法に一致する`ElementType`を持つ型修飾子デフォルトアノテーションでアノテーションされた最も内側の囲む要素によって決定されます。

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

> この例の型はstrictモードが有効な場合にのみ適用されます。それ以外の場合はプラットフォーム型が保持されます。
> [`@UnderMigration`アノテーション](#undermigration-annotation)と[コンパイラ設定](#compiler-configuration)のセクションを参照してください。
> {style="note"}

パッケージレベルのデフォルトnullabilityもサポートされています。

```java
// FILE: test/package-info.java
@NonNullApi // declaring all types in package 'test' as non-nullable by default
package test;
```

#### @UnderMigrationアノテーション

`@UnderMigration`アノテーション（別のアーティファクト`kotlin-annotations-jvm`で提供されます）は、ライブラリメンテナがnullability型修飾子の移行ステータスを定義するために使用できます。

`@UnderMigration(status = ...)`のstatus値は、Kotlinでアノテーションされた型の不適切な使用（例: `@MyNullable`アノテーションが付けられた型値をnon-nullとして使用する）をコンパイラがどのように扱うかを指定します。

*   `MigrationStatus.STRICT`: アノテーションが通常のnullabilityアノテーションとして機能するようにし、不適切な使用に対してエラーを報告し、Kotlinで見られるようにアノテーションされた宣言の型に影響を与えます。
*   `MigrationStatus.WARN`: 不適切な使用はエラーではなくコンパイル警告として報告されますが、アノテーションされた宣言の型はプラットフォーム型として残ります。
*   `MigrationStatus.IGNORE`: コンパイラがnullabilityアノテーションを完全に無視するようにします。

ライブラリのメンテナは、型修飾子のニックネームと型修飾子のデフォルトの両方に`@UnderMigration`ステータスを追加できます。

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

> nullabilityアノテーションの移行ステータスは、その型修飾子のニックネームには継承されませんが、デフォルトの型修飾子での使用には適用されます。
> {style="note"}

デフォルトの型修飾子が型修飾子のニックネームを使用しており、両方が`@UnderMigration`である場合、デフォルトの型修飾子からのステータスが使用されます。

#### コンパイラ設定

JSR-305のチェックは、以下のオプション（およびそれらの組み合わせ）とともに`-Xjsr305`コンパイラフラグを追加することで設定できます。

*   `-Xjsr305={strict|warn|ignore}`: `@UnderMigration`ではないアノテーションの動作を設定します。カスタムnullability修飾子、特に`@TypeQualifierDefault`は、すでに多くの有名なライブラリに広まっており、ユーザーはJSR-305サポートを含むKotlinバージョンに更新する際にスムーズに移行する必要があるかもしれません。Kotlin 1.1.60以降、このフラグは`@UnderMigration`ではないアノテーションにのみ影響します。

*   `-Xjsr305=under-migration:{strict|warn|ignore}`: `@UnderMigration`アノテーションの動作を上書きします。ユーザーはライブラリの移行ステータスについて異なる見解を持つ場合があります。公式の移行ステータスが`WARN`である間にエラーを発生させたい場合もあれば、その逆の場合もあり、移行が完了するまで一部のエラー報告を延期したいと考えるかもしれません。

*   `-Xjsr305=@<fq.name>:{strict|warn|ignore}`: 単一のアノテーションの動作を上書きします。`<fq.name>`はアノテーションの完全修飾クラス名です。異なるアノテーションに対して複数回出現する場合があります。これは、特定のライブラリの移行状態を管理するのに役立ちます。

`strict`、`warn`、`ignore`の値は`MigrationStatus`と同じ意味を持ち、strictモードのみが、Kotlinで見られるようにアノテーションされた宣言の型に影響を与えます。

> 注: 組み込みのJSR-305アノテーションである[`@Nonnull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/Nonnull.html)、
> [`@Nullable`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/3.0.1/javax/annotation/Nullable.html)、および
> [`@CheckForNull`](https://www.javadoc.io/doc/com.google.code.findbugs/jsr305/latest/javax/annotation/CheckForNull.html)は常に有効であり、
> `-Xjsr305`フラグによるコンパイラ設定に関係なく、Kotlinのアノテーションされた宣言の型に影響を与えます。
> {style="note"}

例えば、コンパイラ引数に`-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn`を追加すると、コンパイラは`@org.library.MyNullable`によってアノテーションされた型の不適切な使用に対して警告を生成し、他のすべてのJSR-305アノテーションを無視します。

デフォルトの動作は`-Xjsr305=warn`と同じです。`strict`値は実験的とみなされるべきです（将来的にはさらに多くのチェックが追加される可能性があります）。

## Mapped types

Kotlinは一部のJava型を特別に扱います。そのような型はJavaから「そのまま」ロードされるのではなく、対応するKotlinの型に_マッピング_されます。マッピングはコンパイル時にのみ意味があり、ランタイムの表現は変更されません。Javaのプリミティブ型は、対応するKotlinの型にマッピングされます（[プラットフォーム型](#null-safety-and-platform-types)を念頭に置いてください）。

| **Javaの型** | **Kotlinの型** |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |

一部の非プリミティブな組み込みクラスもマッピングされます。

| **Javaの型** | **Kotlinの型** |
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

Javaのボックス化されたプリミティブ型は、nullableなKotlinの型にマッピングされます。

| **Javaの型**           | **Kotlinの型** |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

型パラメータとして使用されるボックス化されたプリミティブ型はプラットフォーム型にマッピングされることに注意してください。例えば、`List<java.lang.Integer>`はKotlinでは`List<Int!>`になります。

Kotlinではコレクション型は読み取り専用または可変になる可能性があるため、Javaのコレクションは次のようにマッピングされます（この表のすべてのKotlin型は`kotlin.collections`パッケージにあります）。

| **Javaの型** | **Kotlinの読み取り専用型** | **Kotlinの可変型** | **ロードされたプラットフォーム型** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Javaの配列は[下記](#java-arrays)で述べられているようにマッピングされます。

| **Javaの型** | **Kotlinの型** |
|---------------|--------------------------------|
| `int[]`       | `kotlin.IntArray!`             |
| `String[]`    | `kotlin.Array<(out) String!>!` |

> これらのJava型の静的メンバは、Kotlin型の[コンパニオンオブジェクト](object-declarations.md#companion-objects)で直接アクセスすることはできません。
> それらを呼び出すには、Java型の完全修飾名を使用します。例: `java.lang.Integer.toHexString(foo)`。
> {style="note"}

## Java generics in Kotlin

KotlinのジェネリクスはJavaのジェネリクスとは少し異なります（[ジェネリクス](generics.md)を参照）。Javaの型をKotlinにインポートする際、以下の変換が行われます。

*   Javaのワイルドカードは型プロジェクションに変換されます。
    *   `Foo<? extends Bar>` は `Foo<out Bar!>!` になります
    *   `Foo<? super Bar>` は `Foo<in Bar!>!` になります

*   Javaのraw型はスタープロジェクションに変換されます。
    *   `List` は `List<*>!`、すなわち `List<out Any?>!` になります

Javaと同様に、Kotlinのジェネリクスは実行時に保持されません。オブジェクトは、コンストラクタに渡された実際の型引数に関する情報を持ちません。例えば、`ArrayList<Integer>()`は`ArrayList<Character>()`と区別できません。これにより、ジェネリクスを考慮した`is`チェックを実行することはできません。Kotlinは、スタープロジェクションされたジェネリック型に対してのみ`is`チェックを許可します。

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java arrays

Kotlinの配列は、Javaとは異なり不変です。これは、Kotlinが`Array<String>`を`Array<Any>`に割り当てることを許可しないことを意味し、これにより起こりうる実行時エラーを防ぎます。サブクラスの配列をスーパークラスの配列としてKotlinメソッドに渡すことも禁止されていますが、Javaメソッドでは、`Array<(out) String>!`の形式の[プラットフォーム型](#null-safety-and-platform-types)を介して許可されています。

Javaプラットフォームでは、ボクシング/アンボクシング操作のコストを避けるために、プリミティブデータ型とともに配列が使用されます。Kotlinはこれらの実装の詳細を隠蔽しているため、Javaコードと連携するためには回避策が必要です。このケースを処理するために、すべてのプリミティブ配列型（`IntArray`、`DoubleArray`、`CharArray`など）に特化したクラスがあります。これらは`Array`クラスとは関連がなく、最大限のパフォーマンスのためにJavaのプリミティブ配列にコンパイルされます。

インデックスのint配列を受け入れるJavaメソッドがあるとします。

``` java
public class JavaArrayExample {
    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

プリミティブ値の配列を渡すには、Kotlinで次のように記述できます。

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

JVMバイトコードにコンパイルする際、コンパイラは配列へのアクセスを最適化し、オーバーヘッドが発生しないようにします。

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // no actual calls to get() and set() generated
for (x in array) { // no iterator created
    print(x)
}
```

インデックスで操作する場合でも、オーバーヘッドは発生しません。

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

## Java varargs

Javaクラスでは、インデックスに対して可変数の引数（varargs）を持つメソッド宣言を使用する場合があります。

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

その場合、`IntArray`を渡すにはスプレッド演算子`*`を使用する必要があります。

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## Operators

Javaには演算子構文を使用することが理にかなっているメソッドをマークする方法がないため、Kotlinでは、適切な名前とシグネチャを持つJavaメソッドを演算子オーバーロードやその他の規約（`invoke()`など）として使用できます。中置呼び出し構文を使用してJavaメソッドを呼び出すことは許可されていません。

## Checked exceptions

Kotlinでは、すべての[例外は非チェック例外](exceptions.md)です。つまり、コンパイラはそれらをキャッチすることを強制しません。したがって、チェック例外を宣言するJavaメソッドを呼び出す場合でも、Kotlinは何も強制しません。

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java would require us to catch IOException here
    }
}
```

## Object methods

Javaの型がKotlinにインポートされると、`java.lang.Object`型のすべての参照は`Any`に変換されます。`Any`はプラットフォームに特化していないため、そのメンバとして`toString()`、`hashCode()`、`equals()`のみを宣言します。したがって、`java.lang.Object`の他のメンバを利用可能にするために、Kotlinは[拡張関数](extensions.md)を使用します。

### wait()/notify()

`wait()`および`notify()`メソッドは`Any`型の参照では利用できません。これらの使用は、通常`java.util.concurrent`を優先して推奨されません。これらのメソッドを本当に呼び出す必要がある場合は、`java.lang.Object`にキャストできます。

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

オブジェクトのJavaクラスを取得するには、[クラス参照](reflection.md#class-references)の`java`拡張プロパティを使用します。

```kotlin
val fooClass = foo::class.java
```

上記のコードは[バウンドクラス参照](reflection.md#bound-class-references)を使用しています。`javaClass`拡張プロパティを使用することもできます。

```kotlin
val fooClass = foo.javaClass
```

### clone()

`clone()`をオーバーライドするには、クラスが`kotlin.Cloneable`を拡張する必要があります。

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

[Effective Java 第3版](https://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目13「*cloneを注意してオーバーライドする*」を忘れないでください。

### finalize()

`finalize()`をオーバーライドするには、`override`キーワードを使用せずに、単に宣言するだけで済みます。

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
    }
}
```

Javaのルールによると、`finalize()`は`private`であってはなりません。

## Inheritance from Java classes

Kotlinのクラスのスーパータイプには、最大で1つのJavaクラス（および任意の数のJavaインターフェース）を設定できます。

## Accessing static members

Javaクラスの静的メンバは、これらのクラスの「コンパニオンオブジェクト」を形成します。このような「コンパニオンオブジェクト」を値として受け渡すことはできませんが、メンバには明示的にアクセスできます。例:

```kotlin
if (Character.isLetter(a)) { ... }
```

[マップされた](#mapped-types)Java型がKotlin型にマップされている場合、その静的メンバにアクセスするには、Java型の完全修飾名を使用します。例: `java.lang.Integer.bitCount(foo)`。

## Java reflection

JavaリフレクションはKotlinクラスに対して動作し、その逆も同様です。前述のとおり、`instance::class.java`、`ClassName::class.java`、または`instance.javaClass`を使用して`java.lang.Class`経由でJavaリフレクションに入ることができます。この目的のために`ClassName.javaClass`を使用しないでください。これは`ClassName`のコンパニオンオブジェクトクラスを参照しており、`ClassName.Companion::class.java`と同じであり、`ClassName::class.java`ではないためです。

各プリミティブ型には2つの異なるJavaクラスがあり、Kotlinは両方を取得する方法を提供します。例えば、`Int::class.java`は、Javaの`Integer.TYPE`に対応するプリミティブ型自体を表すクラスインスタンスを返します。対応するラッパークラスのクラスを取得するには、`Int::class.javaObjectType`を使用します。これはJavaの`Integer.class`と同等です。

その他のサポートされているケースには、KotlinプロパティのJavaゲッター/セッターメソッドまたはバッキングフィールドの取得、Javaフィールドの`KProperty`、`KFunction`のJavaメソッドまたはコンストラクタ、およびその逆が含まれます。

## SAM conversions

KotlinはJavaと[Kotlinインターフェース](fun-interfaces.md)の両方でSAM変換をサポートしています。Javaに対するこのサポートは、インターフェースメソッドのパラメータ型がKotlin関数のパラメータ型と一致する限り、Kotlin関数リテラルが単一の非デフォルトメソッドを持つJavaインターフェースの実装に自動的に変換できることを意味します。

これはSAMインターフェースのインスタンスを作成するのに使用できます。

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...そしてメソッド呼び出しで:

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

Javaクラスに複数の関数型インターフェースを受け取るメソッドがある場合、ラムダを特定のSAM型に変換するアダプター関数を使用して、呼び出す必要があるものを選択できます。これらのアダプター関数は、必要に応じてコンパイラによっても生成されます。

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM変換はインターフェースにのみ機能し、抽象クラスには機能しません。たとえ抽象クラスが単一の
> 抽象メソッドしか持たない場合でも同様です。
> {style="note"}

## Using JNI with Kotlin

ネイティブ（CまたはC++）コードで実装されている関数を宣言するには、`external`修飾子でマークする必要があります。

```kotlin
external fun foo(x: Int): Double
```

残りの手順はJavaとまったく同じように機能します。

プロパティのゲッターとセッターも`external`としてマークできます。

```kotlin
var myProperty: String
    external get
    external set
```

舞台裏では、これにより`getMyProperty`と`setMyProperty`の2つの関数が作成され、両方とも`external`としてマークされます。

## Using Lombok-generated declarations in Kotlin

KotlinコードでJavaのLombok生成宣言を使用できます。同じJava/Kotlin混合モジュール内でこれらの宣言を生成して使用する必要がある場合、[Lombokコンパイラプラグインのページ](lombok.md)でその方法を学ぶことができます。別のモジュールからそのような宣言を呼び出す場合、そのモジュールをコンパイルするためにこのプラグインを使用する必要はありません。