[//]: # (title: KotlinでのJavaレコードの使用)

_レコード_はJavaにおいて、不変データを格納するための[クラス](https://openjdk.java.net/jeps/395)です。レコードは、固定された一連の値（_レコードコンポーネント_）を持ちます。
これらはJavaにおいて簡潔な構文を持ち、ボイラープレートコードを書く手間を省きます。

```java
// Java
public record Person (String name, int age) {}
```

コンパイラは、[`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html)を継承した`final`クラスを、以下のメンバーとともに自動的に生成します。
*   各レコードコンポーネントに対応する`private final`フィールド
*   すべてのフィールドに対応するパラメータを持つ`public`コンストラクタ
*   構造的等価性を実装するための一連のメソッド：`equals()`、`hashCode()`、`toString()`
*   各レコードコンポーネントを読み取るための`public`メソッド

レコードはKotlinの[データクラス](data-classes.md)と非常によく似ています。

## KotlinコードからのJavaレコードの使用

Javaで宣言されたコンポーネントを持つレコードクラスは、Kotlinでプロパティを持つクラスと同じように使用できます。
レコードコンポーネントにアクセスするには、[Kotlinプロパティ](properties.md)と同じようにその名前を使用するだけです。

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Kotlinでのレコード宣言

Kotlinはデータクラスに対してのみレコード宣言をサポートしており、そのデータクラスは[要件](#requirements)を満たす必要があります。

Kotlinでレコードクラスを宣言するには、`@JvmRecord`アノテーションを使用します。

> 既存のクラスに`@JvmRecord`を適用することは、バイナリ互換の変更ではありません。クラスプロパティアクセサの名前付け規則が変更されます。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

このJVM固有のアノテーションにより、以下の生成が可能になります。

*   クラスファイル内のクラスプロパティに対応するレコードコンポーネント
*   Javaのレコード名前付け規則に従って命名されたプロパティアクセサメソッド

データクラスは、`equals()`、`hashCode()`、および`toString()`メソッドの実装を提供します。

### 要件

`@JvmRecord`アノテーションを付けてデータクラスを宣言するには、以下の要件を満たす必要があります。

*   クラスは、JVM 16バイトコードをターゲットとするモジュール内にある必要があります（`-Xjvm-enable-preview`コンパイラオプションが有効な場合は15でも可）。
*   すべてのJVMレコードは暗黙的に`java.lang.Record`を継承するため、このクラスは明示的に他のクラス（`Any`を含む）を継承できません。ただし、インターフェースを実装することはできます。
*   このクラスは、対応するプライマリコンストラクタパラメータから初期化されるものを除き、バッキングフィールドを持つプロパティを宣言できません。
*   このクラスは、バッキングフィールドを持つ可変プロパティを宣言できません。
*   このクラスはローカルクラスであってはなりません。
*   クラスのプライマリコンストラクタは、クラス自体と同じ可視性を持つ必要があります。

### JVMレコードの有効化

JVMレコードには、生成されるJVMバイトコードのターゲットバージョン`16`以上が必要です。

明示的に指定するには、[Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)または[Maven](maven.md#attributes-specific-to-jvm)で`jvmTarget`コンパイラオプションを使用します。

## さらなる議論

さらなる技術的な詳細や議論については、この[JVMレコードの言語提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)を参照してください。