---
title: "Kotlin で Java レコードを使用する"
---
_Records_（レコード）は、不変のデータを格納するための Java の [クラス](https://openjdk.java.net/jeps/395)です。Records は固定された値のセット、つまり _records components_（レコードコンポーネント）を持ちます。
Java では簡潔な構文を持ち、ボイラープレートコードを書く手間を省けます。

```java
// Java
public record Person (String name, int age) {}
```

コンパイラは、[`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) から継承された final クラスを、以下のメンバとともに自動的に生成します。
* 各レコードコンポーネントに対応する private final フィールド
* すべてのフィールドに対するパラメータを持つ public コンストラクタ
* 構造的な等価性を実装するための一連のメソッド: `equals()`, `hashCode()`, `toString()`
* 各レコードコンポーネントを読み取るための public メソッド

Records は Kotlin の [data classes](data-classes)（データクラス）と非常によく似ています。

## Kotlin コードから Java records を使用する

Java で宣言されたコンポーネントを持つ record クラスは、Kotlin のプロパティを持つクラスを使用するのと同じように使用できます。
レコードコンポーネントにアクセスするには、[Kotlin properties](properties)（Kotlin プロパティ）の場合と同様に、その名前を使用するだけです。

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlin で records を宣言する

Kotlin はデータクラスに対してのみ record の宣言をサポートしており、データクラスは[要件](#requirements)を満たす必要があります。

Kotlin で record クラスを宣言するには、`@JvmRecord` アノテーションを使用します。

:::note
`@JvmRecord` を既存のクラスに適用することは、バイナリ互換性のない変更です。クラスプロパティアクセサの命名規則が変更されます。

:::

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

この JVM 固有のアノテーションにより、以下が生成されます。

* クラスファイル内のクラスプロパティに対応するレコードコンポーネント
* Java record の命名規則に従って命名されたプロパティアクセサメソッド

データクラスは `equals()`, `hashCode()`, および `toString()` メソッドの実装を提供します。

### 要件

`@JvmRecord` アノテーションでデータクラスを宣言するには、次の要件を満たす必要があります。

* クラスは、JVM 16 バイトコード（または `-Xjvm-enable-preview` コンパイラオプションが有効になっている場合は 15）をターゲットとするモジュール内にある必要があります。
* クラスは、すべての JVM records が暗黙的に `java.lang.Record` を継承するため、他のクラス（`Any` を含む）を明示的に継承することはできません。ただし、クラスはインターフェースを実装できます。
* クラスは、対応するプライマリコンストラクタパラメータから初期化されるものを除き、バッキングフィールドを持つプロパティを宣言できません。
* クラスは、バッキングフィールドを持つミュータブルなプロパティを宣言できません。
* クラスはローカルにできません。
* クラスのプライマリコンストラクタは、クラス自体と同じくらい可視である必要があります。

### JVM records の有効化

JVM records には、生成された JVM バイトコードの `16` 以上のターゲットバージョンが必要です。

これを明示的に指定するには、[Gradle](gradle-compiler-options#attributes-specific-to-jvm) または [Maven](maven#attributes-specific-to-jvm) の `jvmTarget` コンパイラオプションを使用します。

## さらなる議論

詳細な技術的詳細と議論については、[JVM records に関するこの言語提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records)を参照してください。