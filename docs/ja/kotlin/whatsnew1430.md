[//]: # (title: Kotlin 1.4.30 の新機能)

_[リリース日: 2021年2月3日](releases.md#release-details)_

Kotlin 1.4.30 では、新しい言語機能のプレビュー版が提供され、Kotlin/JVM コンパイラの新しい IR バックエンドがベータ版に昇格し、さまざまなパフォーマンスと機能の改善が導入されています。

新機能については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)でも詳しく説明されています。

## 言語機能

Kotlin 1.5.0 では、JVM レコードのサポート、シールドインターフェース、安定版インラインクラスといった新しい言語機能が導入される予定です。
Kotlin 1.4.30 では、これらの機能と改善点をプレビューモードで試すことができます。1.5.0 のリリース前に皆様からのフィードバックを反映できるよう、対応する YouTrack チケットでご意見をお聞かせいただけると幸いです。

*   [JVM レコードのサポート](#jvm-records-support)
*   [シールドインターフェース](#sealed-interfaces)と[シールドクラスの改善](#package-wide-sealed-class-hierarchies)
*   [インラインクラスの改善](#improved-inline-classes)

これらの言語機能と改善点をプレビューモードで有効にするには、特定のコンパイラオプションを追加してオプトインする必要があります。
詳細は以下のセクションを参照してください。

新機能のプレビューについては、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)で詳しく説明されています。

### JVM レコードのサポート

> JVM レコード機能は[実験的 (Experimental)](components-stability.md) です。この機能は、将来廃止または変更される可能性があります。
> オプトインが必要です (詳細は下記を参照)。評価目的でのみ使用してください。この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) でいただけると幸いです。
>
{style="warning"}

[JDK 16 のリリース](https://openjdk.java.net/projects/jdk/16/)には、[レコード](https://openjdk.java.net/jeps/395)と呼ばれる新しい Java クラス型を安定化する計画が含まれています。Kotlin のすべての利点を提供し、Java との相互運用性を維持するために、Kotlin は実験的なレコードクラスのサポートを導入しています。

Java で宣言されたレコードクラスは、Kotlin のプロパティを持つクラスと同様に利用できます。追加のステップは不要です。

1.4.30 以降、[データクラス](data-classes.md)に `@JvmRecord` アノテーションを使用することで、Kotlin でレコードクラスを宣言できるようになりました。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

JVM レコードのプレビュー版を試すには、コンパイラオプション `-Xjvm-enable-preview` と `-language-version 1.5` を追加します。

JVM レコードのサポートについては引き続き作業を進めており、[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42430)を使用してフィードバックをお寄せいただけると幸いです。

実装、制限、構文に関する詳細は [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) で確認できます。

### シールドインターフェース

> シールドインターフェースは[実験的 (Experimental)](components-stability.md) です。これらは、将来廃止または変更される可能性があります。
> オプトインが必要です (詳細は下記を参照)。評価目的でのみ使用してください。これらの機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) でいただけると幸いです。
>
{style="warning"}

Kotlin 1.4.30 では、_シールドインターフェース_のプロトタイプが提供されます。これらはシールドクラスを補完し、より柔軟な制限されたクラス階層を構築することを可能にします。

これらは、同じモジュール外では実装できない「内部」インターフェースとして機能します。例えば、網羅的な `when` 式を記述する際に、この事実を利用できます。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() is exhaustive: no other polygon implementations can appear
// after the module is compiled
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

別のユースケースとして、シールドインターフェースを使用すると、2つ以上のシールドスーパークラスからクラスを継承できます。

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

シールドインターフェースのプレビュー版を試すには、コンパイラオプション `-language-version 1.5` を追加します。このバージョンに切り替えると、インターフェースに `sealed` 修飾子を使用できるようになります。[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42433)を使用してフィードバックをお寄せいただけると幸いです。

[シールドインターフェースについて詳しくはこちら](sealed-classes.md)。

### パッケージ全体のシールドクラス階層

> シールドクラスのパッケージ全体の階層は[実験的 (Experimental)](components-stability.md) です。これらは、将来廃止または変更される可能性があります。
> オプトインが必要です (詳細は下記を参照)。評価目的でのみ使用してください。これらの機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) でいただけると幸いです。
>
{style="warning"}

シールドクラスは、より柔軟な階層を形成できるようになりました。同じコンパイル単位および同じパッケージ内のすべてのファイルにサブクラスを持つことができます。以前は、すべてのサブクラスが同じファイル内に存在する必要がありました。

直接のサブクラスは、トップレベルであるか、任意の数の他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストされている場合があります。
シールドクラスのサブクラスは、適切に修飾された名前を持たなければなりません。ローカルオブジェクトや匿名オブジェクトにすることはできません。

シールドクラスのパッケージ全体の階層を試すには、コンパイラオプション `-language-version 1.5` を追加します。[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42433)を使用してフィードバックをお寄せいただけると幸いです。

[シールドクラスのパッケージ全体の階層について詳しくはこちら](sealed-classes.md#inheritance)。

### インラインクラスの改善

> インライン値クラスは[ベータ版 (Beta)](components-stability.md) です。ほぼ安定していますが、将来的に移行手順が必要になる場合があります。変更を最小限に抑えるよう最善を尽くします。インラインクラス機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) でいただけると幸いです。
>
{style="warning"}

Kotlin 1.4.30 では、[インラインクラス](inline-classes.md)が[ベータ版 (Beta)](components-stability.md) に昇格し、以下の機能と改善がもたらされました。

*   インラインクラスは[値ベース (value-based)](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html) であるため、`value` 修飾子を使用して定義できます。`inline` と `value` の修飾子は現在同等です。
    将来の Kotlin バージョンでは、`inline` 修飾子を非推奨にする予定です。

    今後、JVM バックエンドの場合、クラス宣言の前に `@JvmInline` アノテーションが必須となります。

    ```kotlin
    inline class Name(private val s: String)

    value class Name(private val s: String)

    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   インラインクラスは `init` ブロックを持つことができます。クラスがインスタンス化された直後に実行されるコードを追加できます。

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   Java コードからインラインクラスを持つ関数を呼び出す: Kotlin 1.4.30 以前では、マングリングのため、インラインクラスを受け入れる関数を Java から呼び出すことはできませんでした。
    今後は、マングリングを手動で無効にできます。Java コードからそのような関数を呼び出すには、関数宣言の前に `@JvmName` アノテーションを追加する必要があります。

    ```kotlin
    inline class UInt(val x: Int)

    fun compute(x: Int) { }

    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   このリリースでは、不正確な動作を修正するために、関数のマングリングスキームを変更しました。これらの変更は ABI の変更につながりました。

    1.4.30 以降、Kotlin コンパイラはデフォルトで新しいマングリングスキームを使用します。古い 1.4.0 のマングリングスキームを強制的に使用し、バイナリ互換性を維持するには、`-Xuse-14-inline-classes-mangling-scheme` コンパイラフラグを使用します。

Kotlin 1.4.30 ではインラインクラスがベータ版に昇格し、将来のリリースで安定版にする予定です。[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-42434)を使用してフィードバックをお寄せいただけると幸いです。

インラインクラスのプレビュー版を試すには、コンパイラオプション `-Xinline-classes` または `-language-version 1.5` を追加します。

マングリングアルゴリズムに関する詳細は [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) で確認できます。

[インラインクラスについて詳しくはこちら](inline-classes.md)。

## Kotlin/JVM

### JVM IR コンパイラバックエンドがベータ版に到達

Kotlin/JVM 用の [IR ベースのコンパイラバックエンド](whatsnew14.md#unified-backends-and-extensibility)は、1.4.0 で[アルファ版 (Alpha)](components-stability.md) として発表されましたが、ベータ版に到達しました。これは、IR バックエンドが Kotlin/JVM コンパイラのデフォルトになる前の最後のプレ安定レベルです。

IR コンパイラによって生成されたバイナリの利用に関する制限を撤廃します。以前は、新しい JVM IR バックエンドでコンパイルされたコードは、新しいバックエンドを有効にした場合にのみ使用できました。1.4.30 以降、そのような制限はなくなり、新しいバックエンドを使用してライブラリなどのサードパーティ向けコンポーネントをビルドできます。新しいバックエンドのベータ版を試して、[課題トラッカー](https://kotl.in/issue)でフィードバックをお寄せください。

新しい JVM IR バックエンドを有効にするには、プロジェクトの設定ファイルに以下の行を追加します。
*   Gradle の場合:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    </tabs>

*   Maven の場合:

    ```xml
    <configuration>
        <args>
            <arg>-Xuse-ir</arg>
        </args>
    </configuration>
    ```

JVM IR バックエンドがもたらす変更については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)で詳しく説明されています。

## Kotlin/Native

### パフォーマンスの改善

Kotlin/Native は 1.4.30 でさまざまなパフォーマンス改善が施され、コンパイル時間の短縮が実現しました。
例えば、[Kotlin Multiplatform Mobile を使用したネットワークとデータストレージ](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) サンプルのフレームワークをリビルドするのにかかる時間は、9.5 秒 (1.4.10) から 4.5 秒 (1.4.30) に短縮されました。

### Apple watchOS 64ビットシミュレーターターゲット

x86 シミュレーターターゲットは watchOS バージョン 7.0 以降で非推奨となりました。最新の watchOS バージョンに対応するため、Kotlin/Native は 64ビットアーキテクチャでシミュレーターを実行するための新しいターゲット `watchosX64` をサポートしました。

### Xcode 12.2 ライブラリのサポート

Xcode 12.2 に同梱されている新しいライブラリのサポートを追加しました。Kotlin コードからこれらを使用できるようになりました。

## Kotlin/JS

### トップレベルプロパティの遅延初期化

> トップレベルプロパティの遅延初期化は[実験的 (Experimental)](components-stability.md) です。この機能は、将来廃止または変更される可能性があります。
> オプトインが必要です (詳細は下記を参照)。評価目的でのみ使用してください。この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) でいただけると幸いです。
>
{style="warning"}

Kotlin/JS の [IR バックエンド](js-ir-compiler.md)では、トップレベルプロパティの遅延初期化のプロトタイプ実装が導入されています。これにより、アプリケーション起動時にすべてのトップレベルプロパティを初期化する必要が減り、アプリケーションの起動時間が大幅に改善されるはずです。

遅延初期化については引き続き作業を進めます。現在のプロトタイプをお試しいただき、[この YouTrack チケット](https://youtrack.jetbrains.com/issue/KT-44320) または公式の [Kotlin Slack](https://kotlinlang.slack.com) の [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) チャンネル ([こちら](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)から招待を取得) でご意見や結果を共有していただけると幸いです。

遅延初期化を使用するには、JS IR コンパイラでコードをコンパイルする際に `-Xir-property-lazy-initialization` コンパイラオプションを追加します。

## Gradle プロジェクトの改善

### Gradle コンフィグレーションキャッシュのサポート

1.4.30 以降、Kotlin Gradle プラグインは[コンフィグレーションキャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)機能をサポートします。これによりビルドプロセスが高速化されます。コマンドを実行すると、Gradle はコンフィグレーションフェーズを実行し、タスクグラフを計算します。Gradle はその結果をキャッシュし、その後のビルドで再利用します。

この機能を使用するには、[Gradle コマンドを使用](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)するか、[IntelliJ ベースの IDE を設定](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)します。

## 標準ライブラリ

### テキストの大文字/小文字変換用ロケール非依存 API

> ロケール非依存 API 機能は[実験的 (Experimental)](components-stability.md) です。この機能は、将来廃止または変更される可能性があります。
> 評価目的でのみ使用してください。
> この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) でいただけると幸いです。
>
{style="warning"}

このリリースでは、文字列と文字のケースを変更するための実験的なロケール非依存 API を導入します。
現在の `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 関数はロケールに依存しています。
これは、異なるプラットフォームのロケール設定がコードの動作に影響を与える可能性があることを意味します。例えば、トルコ語ロケールでは、文字列「kotlin」が `toUpperCase` を使用して変換されると、「KOTLIN」ではなく「KOTLİN」になります。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 では、以下の代替手段が提供されます。

*   `String` 関数用:

    |**以前のバージョン**|**1.4.30 の代替**|
    | --- | --- |
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   `Char` 関数用:

    |**以前のバージョン**|**1.4.30 の代替**|
    | --- | --- |
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVM には、明示的な `Locale` パラメーターを持つオーバーロードされた `uppercase()`、`lowercase()`、`titlecase()` 関数もあります。
>
{style="note"}

テキスト処理関数の変更点の完全なリストは [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md) で確認できます。

### Char からコードへの変換、Char から数字への変換を明確化

> `Char` 変換機能の明確な API は[実験的 (Experimental)](components-stability.md) です。この機能は、将来廃止または変更される可能性があります。
> 評価目的でのみ使用してください。
> この機能に関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) でいただけると幸いです。
>
{style="warning"}

現在の `Char` から数値への変換関数は、異なる数値型で表現された UTF-16 コードを返しますが、これは文字列の数値表現を返す類似の String-to-Int 変換と混同されがちです。

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

この混同を避けるため、`Char` の変換を、以下の2つの明確に命名された関数群に分離することを決定しました。

*   `Char` の整数コードを取得する関数と、指定されたコードから `Char` を構築する関数:

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   `Char` が表す数字の数値に変換する関数:

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   `Int` の拡張関数で、それが表す非負の1桁の数字を対応する `Char` 表現に変換します:

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

詳細については [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md) で確認できます。

## シリアライゼーションの更新

Kotlin 1.4.30 と共に、`kotlinx.serialization` の [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC) をリリースします。これにはいくつかの新機能が含まれています。

*   インラインクラスのシリアライゼーションサポート
*   符号なしプリミティブ型のシリアライゼーションサポート

### インラインクラスのシリアライゼーションサポート

Kotlin 1.4.30 以降、インラインクラスを[シリアライズ可能](serialization.md)にできます。

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> この機能には、新しい 1.4.30 IR コンパイラが必要です。
>
{style="note"}

シリアライゼーションフレームワークは、シリアライズ可能なインラインクラスが他のシリアライズ可能なクラスで使用される場合でも、ボックス化しません。

`kotlinx.serialization` の[ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)で詳しく説明されています。

### 符号なしプリミティブ型のシリアライゼーションサポート

1.4.30 以降、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) の標準 JSON シリアライザを、`UInt`、`ULong`、`UByte`、`UShort` などの符号なしプリミティブ型に使用できるようになりました。

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

`kotlinx.serialization` の[ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)で詳しく説明されています。