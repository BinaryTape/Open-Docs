[//]: # (title: Kotlin での Java レコードの使用)

レコード（Records）は、不変（immutable）のデータを格納するための Java の[クラス](https://openjdk.java.net/jeps/395)です。レコードは、レコードコンポーネント（records components）と呼ばれる固定された値のセットを保持します。
Java では簡潔な構文を持ち、ボイラープレートコードを書く手間を省くことができます。

```java
// Java
public record Person (String name, int age) {}
```

コンパイラは、[`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) を継承した final クラスを自動的に生成し、以下のメンバーを含めます：
* 各レコードコンポーネントに対する private final フィールド
* すべてのフィールドを引数に持つ public コンストラクタ
* 構造的な等価性を実装するためのメソッド群：`equals()`、`hashCode()`、`toString()`
* 各レコードコンポーネントを読み取るための public メソッド

レコードは Kotlin の[データクラス](data-classes.md)に非常によく似ています。

## Kotlin コードからの Java レコードの使用

Java で宣言されたコンポーネントを持つレコードクラスは、Kotlin のプロパティを持つクラスと同じように使用できます。
レコードコンポーネントにアクセスするには、[Kotlin のプロパティ](properties.md)と同じように、その名前を使用するだけです：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlin でのレコードの宣言

Kotlin ではデータクラスに対してのみレコードの宣言をサポートしており、そのデータクラスは[要件](#requirements)を満たしている必要があります。

Kotlin でレコードクラスを宣言するには、`@JvmRecord` アノテーションを使用します：

> 既存のクラスに `@JvmRecord` を適用することは、バイナリ互換性のある変更ではありません。クラスプロパティのアクセサの命名規則が変更されます。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

この JVM 固有のアノテーションにより、以下が生成されるようになります：

* クラスファイル内でのクラスプロパティに対応するレコードコンポーネント
* Java レコードの命名規則に従って命名されたプロパティアクセサメソッド

データクラスは `equals()`、`hashCode()`、および `toString()` メソッドの実装を提供します。

### 要件

`@JvmRecord` アノテーションを使用してデータクラスを宣言するには、以下の要件を満たす必要があります：

* クラスは JVM 16 バイトコード（または `-Xjvm-enable-preview` コンパイラオプションが有効な場合は 15）をターゲットとするモジュール内にある必要があります。
* すべての JVM レコードは暗黙的に `java.lang.Record` を継承するため、クラスは他のクラス（`Any` を含む）を明示的に継承することはできません。ただし、インターフェースを実装することは可能です。
* クラスは、対応するプライマリコンストラクタのパラメータから初期化されるものを除き、バッキングフィールドを持つプロパティを宣言することはできません。
* クラスは、バッキングフィールドを持つ可変（mutable）プロパティを宣言することはできません.
* クラスをローカルクラスにすることはできません。
* クラスのプライマリコンストラクタは、そのクラス自身と同じ可視性である必要があります。

### JVM レコードの有効化

JVM レコードには、生成される JVM バイトコードのターゲットバージョン 16 以上が必要です。

これを明示的に指定するには、[Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) または [Maven](maven-kotlin-compiler.md#attributes-specific-to-jvm) で `jvmTarget` コンパイラオプションを使用します。

## Kotlin でのレコードコンポーネントへのアノテーション付与

<primary-label ref="experimental-general"/>

Java では、レコードコンポーネントに対する[アノテーション](annotations.md)は、バッキングフィールド、ゲッター、セッター、およびコンストラクタパラメータに自動的に伝播されます。
[`all`](annotations.md#all-meta-target) 使用箇所ターゲット（use-site target）を使用することで、Kotlin でもこの動作を再現できます。

例えば：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord` を `@all:` と併用すると、Kotlin は以下を行います：

* アノテーションをプロパティ、バッキングフィールド、コンストラクタパラメータ、ゲッター、セッターに伝播させます。
* アノテーションが Java の `RECORD_COMPONENT` をサポートしている場合、レコードコンポーネントにもアノテーションを適用します。

## アノテーションをレコードコンポーネントで動作させる

[アノテーション](annotations.md)を Kotlin のプロパティ**および** Java のレコードコンポーネントの両方で使用可能にするには、アノテーション宣言に以下のメタアノテーションを追加します：

* Kotlin 用：[`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* Java レコードコンポーネント用：[`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例えば：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

これで、`@ExampleClass` を Kotlin のクラスやプロパティ、さらには Java のクラスやレコードコンポーネントに適用できるようになります。

## さらに詳しく

技術的な詳細と議論については、こちらの [JVM レコードに関する言語提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) を参照してください。