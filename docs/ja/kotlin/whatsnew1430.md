---
title: "Kotlin 1.4.30の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Released: 3 February 2021](releases#release-details)_

Kotlin 1.4.30 では、新しい言語機能のプレビュー版が提供され、Kotlin/JVM コンパイラの新しい IR バックエンドがベータ版に昇格し、さまざまなパフォーマンスと機能の改善が行われています。

[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)で、新機能について学ぶこともできます。

## 言語機能

Kotlin 1.5.0 では、新しい言語機能、つまり JVM records のサポート、sealed interfaces、および Stable inline classes が提供される予定です。
Kotlin 1.4.30 では、これらの機能と改善点をプレビューモードで試すことができます。
対応する YouTrack チケットでフィードバックをお寄せいただけると幸いです。1.5.0 のリリース前に対応することができます。

* [JVM records のサポート](#jvm-records-support)
* [Sealed interfaces](#sealed-interfaces) と [sealed class の改善](#package-wide-sealed-class-hierarchies)
* [Inline classes の改善](#improved-inline-classes)

これらの言語機能と改善をプレビューモードで有効にするには、特定のコンパイラオプションを追加してオプトインする必要があります。
詳細については、以下のセクションを参照してください。

新機能プレビューの詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)をご覧ください。

### JVM records のサポート

:::note
JVM records 機能は [Experimental](components-stability) です。いつでも削除または変更される可能性があります。
オプトインが必要です（以下の詳細を参照）。評価目的でのみ使用してください。  [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) でのフィードバックをお待ちしております。

[JDK 16 リリース](https://openjdk.java.net/projects/jdk/16/)には、[record](https://openjdk.java.net/jeps/395) と呼ばれる新しい Java クラス型を安定化させる計画が含まれています。Kotlin のすべての利点を提供し、Java との相互運用性を維持するために、Kotlin は実験的な record クラスのサポートを導入しています。

Java で宣言された record クラスは、Kotlin のプロパティを持つクラスと同様に使用できます。追加の手順は必要ありません。

1.4.30 以降では、[データクラス](data-classes)の `@JvmRecord` アノテーションを使用して、Kotlin で record クラスを宣言できます。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

JVM records のプレビュー版を試すには、コンパイラオプション `-Xjvm-enable-preview` と `-language-version 1.5` を追加します。

JVM records のサポートを引き続き改善していきます。この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42430) を使用してフィードバックをお寄せいただけると幸いです。

実装、制限、および構文の詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records) を参照してください。

### Sealed interfaces

Sealed interfaces は [Experimental](components-stability) です。いつでも削除または変更される可能性があります。
オプトインが必要です（以下の詳細を参照）。評価目的でのみ使用してください。  [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) でのフィードバックをお待ちしております。

Kotlin 1.4.30 では、*sealed interfaces* のプロトタイプを提供しています。これらは sealed classes を補完し、より柔軟な制限付きクラス階層を構築することを可能にします。

これらは、同じモジュールの外部で実装できない「内部」インターフェースとして機能します。たとえば、網羅的な `when` 式を記述するために、その事実に依存できます。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() は網羅的です。モジュールのコンパイル後、他のポリゴン実装は表示されません
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle `->` // ...
    is Triangle `->` // ...
}

```

別のユースケース: sealed interfaces を使用すると、クラスを 2 つ以上の sealed スーパークラスから継承できます。

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

sealed interfaces のプレビュー版を試すには、コンパイラオプション `-language-version 1.5` を追加します。このバージョンに切り替えると、インターフェースで `sealed` 修飾子を使用できるようになります。この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42433) を使用してフィードバックをお寄せいただけると幸いです。

[sealed interfaces の詳細はこちら](sealed-classes)。

### Package-wide sealed class hierarchies

Package-wide hierarchies of sealed classes は [Experimental](components-stability) です。いつでも削除または変更される可能性があります。
オプトインが必要です（以下の詳細を参照）。評価目的でのみ使用してください。  [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) でのフィードバックをお待ちしております。

Sealed classes は、より柔軟な階層を形成できるようになりました。同じコンパイルユニットおよび同じパッケージのすべてのファイルにサブクラスを持つことができます。以前は、すべてのサブクラスが同じファイルに存在する必要がありました。

直接のサブクラスは、トップレベルにすることも、他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクトの中にネストすることもできます。sealed class のサブクラスは、適切に修飾された名前を持つ必要があり、ローカルオブジェクトでも匿名オブジェクトでもかまいません。

package-wide hierarchies of sealed classes を試すには、コンパイラオプション `-language-version 1.5` を追加します。この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42433) を使用してフィードバックをお寄せいただけると幸いです。

[package-wide hierarchies of sealed classes の詳細はこちら](sealed-classes#inheritance)。

### Inline classes の改善

Inline value classes は [Beta](components-stability) にあります。ほぼ安定していますが、将来的には移行手順が必要になる場合があります。変更を最小限に抑えるように最善を尽くします。inline classes 機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) にお寄せいただけると幸いです。

Kotlin 1.4.30 では、[inline classes](inline-classes) が [Beta](components-stability) に昇格し、次の機能と改善がもたらされます。

* inline classes は [value-based](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html) であるため、`value` 修飾子を使用して定義できます。`inline` 修飾子と `value` 修飾子は、現在互いに同等です。
  将来の Kotlin バージョンでは、`inline` 修飾子を非推奨にする予定です。

  今後、Kotlin では、JVM バックエンドのクラス宣言の前に `@JvmInline` アノテーションが必要です。
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // For JVM backends
  @JvmInline
  value class Name(private val s: String)
  ```

* Inline classes には `init` ブロックを含めることができます。クラスがインスタンス化された直後に実行されるコードを追加できます。
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* Java コードから inline classes を使用して関数を呼び出す: Kotlin 1.4.30 より前は、マングリングのために、inline classes を受け入れる関数を Java から呼び出すことができませんでした。
  今後は、マングリングを手動で無効にすることができます。Java コードからそのような関数を呼び出すには、関数宣言の前に `@JvmName` アノテーションを追加する必要があります。

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* このリリースでは、正しくない動作を修正するために、関数のマングリングスキームを変更しました。これらの変更により、ABI が変更されました。

  1.4.30 以降、Kotlin コンパイラはデフォルトで新しいマングリングスキームを使用します。`-Xuse-14-inline-classes-mangling-scheme`
  コンパイラフラグを使用して、コンパイラに古い 1.4.0 マングリングスキームを使用させ、バイナリ互換性を維持します。

Kotlin 1.4.30 では、inline classes がベータ版に昇格し、今後のリリースで安定版にする予定です。この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42434) を使用してフィードバックをお寄せいただけると幸いです。

inline classes のプレビュー版を試すには、コンパイラオプション `-Xinline-classes` または `-language-version 1.5` を追加します。

マングリングアルゴリズムの詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) を参照してください。

[inline classes の詳細はこちら](inline-classes)。

## Kotlin/JVM

### JVM IR コンパイラバックエンドがベータ版に到達

Kotlin/JVM の [IR ベースのコンパイラバックエンド](whatsnew14#unified-backends-and-extensibility)は、
1.4.0 で [Alpha](components-stability) で発表されましたが、ベータ版に到達しました。これは、IR バックエンドが
Kotlin/JVM コンパイラのデフォルトになる前の最後のプレ安定版レベルです。

IR コンパイラによって生成されたバイナリの使用に関する制限を解除します。以前は、新しい JVM IR バックエンドを有効にした場合にのみ、新しい JVM IR バックエンドによってコンパイルされたコードを使用できました。1.4.30 以降では、そのような制限はないため、新しいバックエンドを使用して、ライブラリなどのサードパーティで使用するコンポーネントを構築できます。新しいバックエンドのベータ版を試して、[issue tracker](https://kotl.in/issue) でフィードバックを共有してください。

新しい JVM IR バックエンドを有効にするには、次の行をプロジェクトの構成ファイルに追加します。
* Gradle の場合:

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </TabItem>
  <TabItem value="groovy" label="Groovy" default>
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```

  </TabItem>
  </Tabs>

* Maven の場合:

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

JVM IR バックエンドがもたらす変更の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)をご覧ください。

## Kotlin/Native

### パフォーマンスの改善

Kotlin/Native は 1.4.30 でさまざまなパフォーマンスの改善を受け、コンパイル時間が短縮されました。
たとえば、[Networking and data storage with Kotlin Multiplatform Mobile](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) でのフレームワークの再構築に必要な時間が
サンプルは、9.5 秒（1.4.10）から 4.5 秒（1.4.30）に短縮されました。

### Apple watchOS 64 ビットシミュレータターゲット

x86 シミュレータターゲットは、バージョン 7.0 以降、watchOS で非推奨になりました。最新の watchOS バージョンに対応するために、
Kotlin/Native には、64 ビットアーキテクチャでシミュレータを実行するための新しいターゲット `watchosX64` があります。

### Xcode 12.2 ライブラリのサポート

Xcode 12.2 で提供される新しいライブラリのサポートを追加しました。Kotlin コードからそれらを使用できるようになりました。

## Kotlin/JS

### トップレベルプロパティの遅延初期化

Lazy initialization of top-level properties は [Experimental](components-stability) です。いつでも削除または変更される可能性があります。
オプトインが必要です（以下の詳細を参照）。評価目的でのみ使用してください。 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) でのフィードバックをお待ちしております。

Kotlin/JS の [IR バックエンド](js-ir-compiler) は、
トップレベルプロパティの遅延初期化のプロトタイプ実装を受信しています。これにより、アプリケーションの起動時にすべてのトップレベルプロパティを初期化する必要がなくなり、
アプリケーションの起動時間が大幅に改善されるはずです。

遅延初期化の改善を続けていきます。現在のプロトタイプを試して、ご意見や結果を
この [YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-44320) または公式の [Kotlin Slack](https://kotlinlang.slack.com) の [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69)
チャンネルで共有してください（[こちら](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) で招待状を入手してください）。

遅延初期化を使用するには、JS IR コンパイラでコードをコンパイルするときに、`-Xir-property-lazy-initialization` コンパイラオプションを追加します。

## Gradle プロジェクトの改善

### Gradle 構成キャッシュのサポート

1.4.30 以降、Kotlin Gradle プラグインは、[構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)
機能をサポートします。これにより、ビルドプロセスが高速化されます。コマンドを実行すると、Gradle は構成フェーズを実行し、
タスクグラフを計算します。Gradle は結果をキャッシュし、後続のビルドで再利用します。

この機能の使用を開始するには、[Gradle コマンドを使用](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
するか、[IntelliJ ベースの IDE をセットアップ](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij) します。

## 標準ライブラリ

### テキストの大文字/小文字変換のためのロケールに依存しない API

The locale-agnostic API feature is [Experimental](components-stability)。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) でのフィードバックをお待ちしております。

このリリースでは、文字列と文字の大文字/小文字を区別しない実験的なロケール非依存 API が導入されています。
現在の `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 関数はロケールに依存します。
これは、プラットフォームのロケール設定が異なると、コードの動作に影響を与える可能性があることを意味します。たとえば、トルコのロケールでは、
文字列 "kotlin" が `toUpperCase` を使用して変換されると、結果は "KOTLİN" になり、"KOTLIN" にはなりません。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 では、次の代替手段が提供されています。

* `String` 関数の場合:

  |**以前のバージョン**|**1.4.30 代替**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char` 関数の場合:

  |**以前のバージョン**|**1.4.30 代替**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

Kotlin/JVM の場合、明示的な
`Locale` パラメータを持つオーバーロードされた `uppercase()`、`lowercase()`、および `titlecase()` 関数もあります。

:::

テキスト処理関数への変更の完全なリストについては、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions) を参照してください。

### Char からコードおよび Char から数字への明確な変換

:::note
`Char` 変換機能の明確な API は [Experimental](components-stability) です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) でのフィードバックをお待ちしております。

現在の `Char` から数値への変換関数は、さまざまな数値型で表される UTF-16 コードを返します。
文字列から Int への同様の変換と混同されることがよくあります。文字列から Int への変換では、文字列の数値が返されます。

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

この混乱を避けるために、`Char` 変換を、明確に名前が付けられた次の 2 つの関数セットに分離することにしました。

* `Char` の整数コードを取得し、指定されたコードから `Char` を構築する関数:
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* `Char` をそれが表す数字の数値に変換する関数:

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* 表される負でない 1 桁の数字を対応する `Char` に変換する `Int` の拡張関数
  表現:

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions) を参照してください。

## シリアライゼーションの更新

Kotlin 1.4.30 とともに、`kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC) をリリースします。これには、いくつかの新機能が含まれています。

* インラインクラスのシリアライゼーションのサポート
* 符号なしプリミティブ型のシリアライゼーションのサポート

### インラインクラスのシリアライゼーションのサポート

Kotlin 1.4.30 以降では、インラインクラスを [シリアライズ可能](serialization) にすることができます。

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

この機能には、新しい 1.4.30 IR コンパイラが必要です。

:::

シリアライゼーションフレームワークは、シリアライズ可能なインラインクラスが他のシリアライズ可能なクラスで使用されている場合でも、それらをボックス化しません。

詳細については、`kotlinx.serialization` [ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#serializable-inline-classes) を参照してください。

### 符号なしプリミティブ型のシリアライゼーションのサポート

1.4.30 以降では、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) の標準 JSON シリアライザを
符号なしプリミティブ型: `UInt`、`ULong`、`UByte`、および `UShort`:

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

詳細については、`kotlinx.serialization` [ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#unsigned-types-support-json-only) を参照してください。
  ```