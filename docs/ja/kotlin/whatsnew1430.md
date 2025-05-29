[//]: # (title: Kotlin 1.4.30の新機能)

_[リリース日: 2021年2月3日](releases.md#release-details)_

Kotlin 1.4.30では、新しい言語機能のプレビュー版が提供され、Kotlin/JVMコンパイラの新しいIRバックエンドがベータ版に昇格し、様々なパフォーマンスと機能の改善が施されています。

新機能については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)でも学ぶことができます。

## 言語機能

Kotlin 1.5.0では、JVM recordsサポート、シールドインターフェース、Stableなインラインクラスといった新しい言語機能が提供される予定です。Kotlin 1.4.30では、これらの機能と改善をプレビューモードで試すことができます。1.5.0のリリース前に対応できるよう、該当のYouTrackチケットでフィードバックを共有していただけると幸いです。

*   [JVM recordsサポート](#jvm-records-support)
*   [シールドインターフェース](#sealed-interfaces)と[シールドクラスの改善](#package-wide-sealed-class-hierarchies)
*   [インラインクラスの改善](#improved-inline-classes)

これらの言語機能と改善をプレビューモードで有効にするには、特定のコンパイラオプションを追加してオプトインする必要があります。詳細については以下のセクションを参照してください。

新機能プレビューの詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)をご覧ください。

### JVM recordsサポート

> JVM records機能は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については以下を参照してください）。評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-42430)でフィードバックをいただけると幸いです。
>
{style="warning"}

[JDK 16のリリース](https://openjdk.java.net/projects/jdk/16/)には、[record](https://openjdk.java.net/jeps/395)と呼ばれる新しいJavaクラス型を安定化する計画が含まれています。Kotlinのすべての利点を提供し、Javaとの相互運用性を維持するために、Kotlinは実験的なrecordクラスサポートを導入しています。

Javaで宣言されたrecordクラスは、Kotlinのプロパティを持つクラスとまったく同じように使用できます。追加の手順は必要ありません。

1.4.30以降、[データクラス](data-classes.md)に`@JvmRecord`アノテーションを使用することで、Kotlinでrecordクラスを宣言できます。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

JVM recordsのプレビュー版を試すには、コンパイラオプション`-Xjvm-enable-preview`と`-language-version 1.5`を追加してください。

JVM recordsサポートの作業は継続しており、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-42430)でフィードバックを共有していただけると幸いです。

実装、制限、構文の詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)をご覧ください。

### シールドインターフェース

> シールドインターフェースは[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については以下を参照してください）。これは評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.4.30では、_シールドインターフェース_のプロトタイプをリリースします。これらはシールドクラスを補完し、より柔軟な制限されたクラス階層を構築することを可能にします。

これらは、同じモジュール外では実装できない「内部」インターフェースとして機能できます。例えば、網羅的な`when`式を記述するために、この事実に頼ることができます。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when()は網羅的です: モジュールがコンパイルされた後、
// 他のポリゴンの実装が出現することはありません
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

もう一つのユースケースとして、シールドインターフェースを使用すると、クラスを2つ以上のシールドスーパークラスから継承できます。

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

シールドインターフェースのプレビュー版を試すには、コンパイラオプション`-language-version 1.5`を追加してください。このバージョンに切り替えると、インターフェースで`sealed`修飾子を使用できるようになります。[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-42433)でフィードバックを共有していただけると幸いです。

[シールドインターフェースについてさらに詳しく](sealed-classes.md)。

### パッケージ全体にわたるシールドクラス階層

> シールドクラスのパッケージ全体にわたる階層は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については以下を参照してください）。これは評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)でフィードバックをいただけると幸いです。
>
{style="warning"}

シールドクラスは、より柔軟な階層を形成できるようになりました。同じコンパイルユニットおよび同じパッケージのすべてのファイル内にサブクラスを持つことができます。以前は、すべてのサブクラスは同じファイル内に存在する必要がありました。

直接のサブクラスは、トップレベルであるか、任意の数の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストすることができます。シールドクラスのサブクラスは、適切に修飾された名前を持つ必要があります。ローカルオブジェクトや匿名オブジェクトであってはなりません。

シールドクラスのパッケージ全体にわたる階層を試すには、コンパイラオプション`-language-version 1.5`を追加してください。[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-42433)でフィードバックを共有していただけると幸いです。

[パッケージ全体にわたるシールドクラス階層についてさらに詳しく](sealed-classes.md#inheritance)。

### インラインクラスの改善

> インライン値クラス (Inline value classes) は[ベータ版](components-stability.md)です。これらはほぼ安定していますが、将来的に移行手順が必要になる場合があります。私たちは、お客様が行う必要のある変更を最小限に抑えるよう最善を尽くします。[YouTrack](https://youtrack.jetbrains.com/issue/KT-42434)でインラインクラス機能に関するフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin 1.4.30では、[インラインクラス](inline-classes.md)が[ベータ版](components-stability.md)に昇格し、以下の機能と改善がもたらされています。

*   インラインクラスは[値ベース](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)であるため、`value`修飾子を使用して定義できます。`inline`と`value`の修飾子は互いに等価になりました。将来のKotlinバージョンでは、`inline`修飾子を非推奨にする予定です。

    今後、JVMバックエンドでは、クラス宣言の前に`@JvmInline`アノテーションが必要です。

    ```kotlin
    inline class Name(private val s: String)

    value class Name(private val s: String)

    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   インラインクラスは`init`ブロックを持つことができます。クラスがインスタンス化された直後に実行されるコードを追加できます。

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   Javaコードからインラインクラスを持つ関数を呼び出す：Kotlin 1.4.30より前では、マングリングのため、Javaからインラインクラスを受け入れる関数を呼び出すことができませんでした。
    今後、手動でマングリングを無効にできます。Javaコードからそのような関数を呼び出すには、関数宣言の前に`@JvmName`アノテーションを追加する必要があります。

    ```kotlin
    inline class UInt(val x: Int)

    fun compute(x: Int) { }

    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   今回のリリースでは、不正な動作を修正するために、関数のマングルスキームを変更しました。これらの変更はABI (Application Binary Interface) の変更につながりました。

    1.4.30以降、Kotlinコンパイラはデフォルトで新しいマングルスキームを使用します。コンパイラに古い1.4.0マングルスキームの使用を強制し、バイナリ互換性を維持するには、`-Xuse-14-inline-classes-mangling-scheme`コンパイラフラグを使用してください。

Kotlin 1.4.30ではインラインクラスがベータ版に昇格し、将来のリリースでStableにする予定です。[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-42434)でフィードバックを共有していただけると幸いです。

インラインクラスのプレビュー版を試すには、コンパイラオプション`-Xinline-classes`または`-language-version 1.5`を追加してください。

マングルアルゴリズムの詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)をご覧ください。

[インラインクラスについてさらに詳しく](inline-classes.md)。

## Kotlin/JVM

### JVM IRコンパイラバックエンドがベータ版に到達

Kotlin/JVM用の[IRベースのコンパイラバックエンド](whatsnew14.md#unified-backends-and-extensibility)は、1.4.0で[アルファ版](components-stability.md)として発表されていましたが、ベータ版に到達しました。これは、IRバックエンドがKotlin/JVMコンパイラのデフォルトになる前の最後の安定版前のレベルです。

IRコンパイラによって生成されたバイナリの消費に関する制限を解除しました。以前は、新しいJVM IRバックエンドによってコンパイルされたコードは、新しいバックエンドを有効にしている場合にのみ使用できました。1.4.30以降、そのような制限はないため、新しいバックエンドを使用して、ライブラリなど、サードパーティが使用するコンポーネントを構築できます。新しいバックエンドのベータ版を試して、[イシュートラッカー](https://kotl.in/issue)でフィードバックを共有してください。

新しいJVM IRバックエンドを有効にするには、プロジェクトの構成ファイルに以下の行を追加します。
*   Gradleの場合:

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

*   Mavenの場合:

    ```xml
    <configuration>
        <args>
            <arg>-Xuse-ir</arg>
        </args>
    </configuration>
    ```

JVM IRバックエンドがもたらす変更の詳細については、[こちらのブログ記事](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)をご覧ください。

## Kotlin/Native

### パフォーマンスの改善

Kotlin/Nativeは1.4.30で様々なパフォーマンス改善が施され、コンパイル時間の高速化につながりました。例えば、[Networking and data storage with Kotlin Multiplatform Mobile](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)サンプルでフレームワークを再構築するのに必要な時間は、9.5秒（1.4.10）から4.5秒（1.4.30）に短縮されました。

### Apple watchOS 64ビットシミュレータターゲット

x86シミュレータターゲットは、watchOSバージョン7.0以降で非推奨になりました。最新のwatchOSバージョンに対応するため、Kotlin/Nativeには64ビットアーキテクチャでシミュレータを実行するための新しいターゲット`watchosX64`が追加されました。

### Xcode 12.2ライブラリのサポート

Xcode 12.2で提供される新しいライブラリのサポートを追加しました。Kotlinコードからそれらを使用できるようになりました。

## Kotlin/JS

### トップレベルプロパティの遅延初期化

> トップレベルプロパティの遅延初期化は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> オプトインが必要です（詳細については以下を参照してください）。これは評価目的でのみ使用してください。[YouTrack](https://youtrack.com/issue/KT-44320)でフィードバックをいただけると幸いです。
>
{style="warning"}

Kotlin/JS用の[IRバックエンド](js-ir-compiler.md)では、トップレベルプロパティの遅延初期化のプロトタイプ実装が導入されています。これにより、アプリケーション起動時にすべてのトップレベルプロパティを初期化する必要性が減少し、アプリケーションの起動時間が大幅に改善されるはずです。

私たちは遅延初期化の作業を継続しており、現在のプロトタイプを試して、[こちらのYouTrackチケット](https://youtrack.jetbrains.com/issue/KT-44320)または公式[Kotlin Slack](https://kotlinlang.slack.com)（招待状は[こちら](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)から入手）の[`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69)チャネルでご意見や結果を共有していただければ幸いです。

遅延初期化を使用するには、JS IRコンパイラでコードをコンパイルする際に、`-Xir-property-lazy-initialization`コンパイラオプションを追加してください。

## Gradleプロジェクトの改善

### Gradle構成キャッシュのサポート

1.4.30以降、Kotlin Gradleプラグインは[構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)機能をサポートしています。これによりビルドプロセスが高速化されます。コマンドを実行すると、Gradleは構成フェーズを実行し、タスクグラフを計算します。Gradleはその結果をキャッシュし、後続のビルドで再利用します。

この機能の使用を開始するには、[Gradleコマンドを使用する](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)か、[IntelliJベースのIDEを設定する](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)ことができます。

## 標準ライブラリ

### テキストの大文字/小文字変換のためのロケールに依存しないAPI

> ロケールに依存しないAPI機能は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> 評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437)でフィードバックをいただけると幸いです。
>
{style="warning"}

このリリースでは、文字列と文字のケースを変更するための実験的なロケールに依存しないAPIが導入されています。現在の`toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()`のAPI関数はロケールに依存します。これは、プラットフォームのロケール設定が異なると、コードの動作に影響を与える可能性があることを意味します。例えば、トルコ語ロケールでは、文字列「kotlin」を`toUpperCase`で変換すると、「KOTLIN」ではなく「KOTLİN」になります。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30では、以下の代替機能を提供します。

*   `String`関数について:

    |**以前のバージョン**|**1.4.30での代替**|
    |---|---|
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   `Char`関数について:

    |**以前のバージョン**|**1.4.30での代替**|
    |---|---|
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVMの場合、明示的な`Locale`パラメータを持つオーバーロードされた`uppercase()`、`lowercase()`、`titlecase()`関数もあります。
>
{style="note"}

テキスト処理関数の変更点の全リストについては、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md)をご覧ください。

### Charからコードへの変換とCharから数値への変換の明確化

> `Char`変換のための曖昧さのないAPI機能は[実験的](components-stability.md)です。これはいつでも廃止または変更される可能性があります。
> 評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333)でフィードバックをいただけると幸いです。
>
{style="warning"}

現在の`Char`から数値への変換関数（異なる数値型で表現されたUTF-16コードを返す）は、文字列の数値表現を返す似たようなStringからIntへの変換と混同されがちです。

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// また、Char '4' に対して数値 4 を返す共通の関数はありませんでした
```

この混乱を避けるため、`Char`変換を以下の2つの明確に命名された関数セットに分離することを決定しました。

*   `Char`の整数コードを取得し、指定されたコードから`Char`を構築する関数:

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   `Char`が表す数字の数値に変換する関数:

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   `Int`の拡張関数で、それが表す負でない1桁の数値を対応する`Char`表現に変換する関数:

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)をご覧ください。

## シリアライゼーションの更新

Kotlin 1.4.30と同時に、`kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)をリリースします。これにはいくつかの新機能が含まれています。

*   インラインクラスのシリアライゼーションサポート
*   符号なしプリミティブ型のシリアライゼーションサポート

### インラインクラスのシリアライゼーションサポート

Kotlin 1.4.30以降、インラインクラスを[シリアライズ可能](serialization.md)にできます。

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> この機能には、新しい1.4.30 IRコンパイラが必要です。
>
{style="note"}

シリアライゼーションフレームワークは、シリアライズ可能なインラインクラスが他のシリアライズ可能なクラスで使用される場合、それらをボックス化しません。

詳細については、`kotlinx.serialization`の[ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)をご覧ください。

### 符号なしプリミティブ型のシリアライゼーションサポート

1.4.30以降、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)の標準JSONシリアライザを、`UInt`、`ULong`、`UByte`、`UShort`といった符号なしプリミティブ型に使用できるようになりました。

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

詳細については、`kotlinx.serialization`の[ドキュメント](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)をご覧ください。