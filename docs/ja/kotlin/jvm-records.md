[//]: # (title: KotlinでのJavaレコードの使用)

_レコード_は、Javaにおける不変なデータを格納するための[クラス](https://openjdk.java.net/jeps/395)です。レコードは固定された値のセット、つまり_レコードコンポーネント_を持ちます。
Javaでは簡潔な構文を持ち、ボイラープレートコードを書く手間を省きます:

```java
// Java
public record Person (String name, int age) {}
```

コンパイラは、[`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)を継承する`final`クラスを自動的に生成し、以下のメンバーを含みます:
* 各レコードコンポーネントに対応するprivate finalフィールド
* 全てのフィールドに対応するパラメータを持つpublicコンストラクタ
* 構造的等価性を実装するためのメソッド群: `equals()`, `hashCode()`, `toString()`
* 各レコードコンポーネントを読み取るためのpublicメソッド

レコードはKotlinの[データクラス](data-classes.md)と非常によく似ています。

## KotlinコードからのJavaレコードの使用

Javaで宣言されたコンポーネントを持つレコードクラスは、Kotlinでプロパティを持つクラスを使用するのと同じ方法で利用できます。
レコードコンポーネントにアクセスするには、[Kotlinプロパティ](properties.md)と同じようにその名前を使用します:

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlinでのレコード宣言

Kotlinはデータクラスでのみレコード宣言をサポートしており、データクラスは[要件](#requirements)を満たす必要があります。

Kotlinでレコードクラスを宣言するには、`@JvmRecord`アノテーションを使用します:

> `@JvmRecord`を既存のクラスに適用することは、バイナリ互換性のある変更ではありません。これは、クラスプロパティアクセサーの命名規則を変更します。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

このJVM固有のアノテーションは、以下の生成を可能にします:

* クラスファイル内のクラスプロパティに対応するレコードコンポーネント
* Javaレコードの命名規則に従って命名されたプロパティアクセサーメソッド

データクラスは`equals()`、`hashCode()`、および`toString()`メソッドの実装を提供します。

### 要件

`@JvmRecord`アノテーションを付けてデータクラスを宣言するには、以下の要件を満たす必要があります:

* クラスは、JVM 16バイトコードをターゲットとするモジュール（または`-Xjvm-enable-preview`コンパイラオプションが有効になっている場合は15）になければなりません。
* 全てのJVMレコードが暗黙的に`java.lang.Record`を継承するため、クラスは（`Any`を含む）他のクラスを明示的に継承することはできません。ただし、クラスはインターフェースを実装することはできます。
* クラスは、対応するプライマリコンストラクタパラメータから初期化されるものを除いて、バッキングフィールドを持つプロパティを宣言できません。
* クラスは、バッキングフィールドを持つ可変プロパティを宣言できません。
* クラスはローカルにできません。
* クラスのプライマリコンストラクタは、クラス自体と同じくらい可視である必要があります。

### JVMレコードの有効化

JVMレコードは、生成されるJVMバイトコードのターゲットバージョン`16`以上を必要とします。

それを明示的に指定するには、[Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)または[Maven](maven-compile-package.md#attributes-specific-to-jvm)で`jvmTarget`コンパイラオプションを使用します。

## Kotlinでのレコードコンポーネントへのアノテーション

<primary-label ref="experimental-general"/>

Javaでは、レコードコンポーネント上の[アノテーション](annotations.md)は、バッキングフィールド、ゲッター、セッター、およびコンストラクタパラメータに自動的に伝播されます。
Kotlinでは、[`all`](annotations.md#all-meta-target)ユースサイトターゲットを使用することで、この動作を再現できます。

> `all`ユースサイトターゲットを使用するには、オプトインする必要があります。`-Xannotation-target-all`コンパイラオプションを使用するか、`build.gradle.kts`ファイルに以下を追加してください:
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

例:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`を`@all:`と一緒に使用すると、Kotlinは次のようになります:

* プロパティ、バッキングフィールド、コンストラクタパラメータ、ゲッター、セッターにアノテーションを伝播します。
* アノテーションがJavaの`RECORD_COMPONENT`をサポートしている場合、レコードコンポーネントにもアノテーションを適用します。

## アノテーションをレコードコンポーネントで機能させる

[アノテーション](annotations.md)をKotlinプロパティ**と**Javaレコードコンポーネントの両方で利用可能にするには、アノテーション宣言に以下のメタアノテーションを追加します:

* Kotlinの場合: [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* Javaレコードコンポーネントの場合: [`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

これで、`@ExampleClass`をKotlinクラスとプロパティ、ならびにJavaクラスとレコードコンポーネントに適用できます。

## さらなる議論

さらなる技術的な詳細と議論については、[JVMレコードの言語プロポーザル](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)を参照してください。