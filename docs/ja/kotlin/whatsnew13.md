[//]: # (title: Kotlin 1.3 の新機能)

<web-summary>新しい言語機能、Kotlin マルチプラットフォームのアップデート、JVM、Native、JS、そして Gradle と Maven のビルドツールサポートを含む Kotlin 1.3 のリリースノートをご覧ください。</web-summary>

*リリース日: 2018年10月29日*

> Kotlin のリリースサイクルに関する情報は、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## コルーチンの正式リリース

長期にわたる広範な実戦テストを経て、コルーチン（coroutines）が正式にリリースされました！これにより、Kotlin 1.3 から言語サポートと API は[完全に安定（fully stable）](components-stability.md)しました。新しい [コルーチンの概要](coroutines-overview.md) ページをぜひチェックしてください。

Kotlin 1.3 では、`suspend` 関数に対する呼び出し可能参照（callable references）と、リフレクション API におけるコルーチンのサポートが導入されました。

## Kotlin/Native

Kotlin 1.3 では、Native ターゲットの改善と磨き上げが継続されています。詳細は [Kotlin/Native の概要](native-overview.md) を参照してください。

## マルチプラットフォームプロジェクト

1.3 では、表現力と柔軟性を向上させ、共通コードの共有をより容易にするために、マルチプラットフォームプロジェクトのモデルを完全に刷新しました。また、Kotlin/Native もターゲットの一つとしてサポートされるようになりました。

旧モデルとの主な違いは以下の通りです：

  * 旧モデルでは、共通コードとプラットフォーム固有のコードを別々のモジュールに配置し、`expectedBy` 依存関係でリンクする必要がありました。新モデルでは、共通コードとプラットフォーム固有のコードが同じモジュールの異なるソースルートに配置されるようになり、プロジェクトの設定がより簡単になりました。
  * サポートされている様々なプラットフォーム向けに、多数の [プリセットされたプラットフォーム設定](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) が用意されました。
  * [依存関係の設定](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html) が変更されました。依存関係はソースルートごとに個別に指定するようになりました。
  * ソースセットを、プラットフォームの任意のサブセット間で共有できるようになりました（例えば、JS、Android、iOS をターゲットとするモジュールにおいて、Android と iOS の間だけで共有されるソースセットを持つことができます）。
  * [マルチプラットフォームライブラリの公開](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html) がサポートされました。

詳細については、[マルチプラットフォームプログラミングのドキュメント](https://kotlinlang.org/docs/multiplatform/get-started.html) を参照してください。

## コントラクト (Contracts)

Kotlin コンパイラは、警告を表示しボイラープレートを削減するために、広範な静的解析を行います。最も注目すべき機能の一つはスマートキャストです。これは実行された型チェックに基づいて、自動的にキャストを行う機能です。

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // コンパイラが自動的に 's' を 'String' にキャストする
}
```

しかし、これらのチェックが別の関数に抽出されると、スマートキャストは即座に機能しなくなります。

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // スマートキャストが効かない :(
}
```

このようなケースでの動作を改善するために、Kotlin 1.3 では *コントラクト (contracts)* と呼ばれる実験的なメカニズムが導入されました。

*コントラクト* を使用すると、関数はその動作をコンパイラが理解できる方法で明示的に記述できます。現在、大きく分けて 2 つのケースがサポートされています。

* 関数の呼び出し結果と渡された引数の値の関係を宣言することで、スマートキャストの解析を向上させる：

```kotlin
fun require(condition: Boolean) {
    // これは以下をコンパイラに伝える構文形式です：
    // 「この関数が正常にリターンした場合、渡された 'condition' は true である」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // ここで s は 'String' にスマートキャストされます。
    // そうでなければ 'require' が例外をスローしているはずだからです。
}
```

* 高階関数の存在下での変数初期化解析を向上させる：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // これはコンパイラに以下を伝えます：
    // 「この関数はここで今すぐ 'block' を呼び出し、かつ、ちょうど1回だけ呼び出す」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // コンパイラは 'synchronize' に渡されたラムダがちょうど1回呼ばれることを知っているため、
               // 再代入のエラーは報告されません。
    }
    println(x) // コンパイラはラムダが必ず呼ばれて初期化が行われることを知っているため、
               // ここで 'x' は初期化済みであると見なされます。
}
```

### 標準ライブラリにおけるコントラクト

`stdlib` はすでにコントラクトを利用しており、上述のような解析の改善に役立っています。コントラクトのこの部分は **安定（stable）** しており、追加のオプトインなしで今すぐ改善された解析の恩恵を受けることができます。

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // やった、not-null へのスマートキャスト！
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### カスタムコントラクト

独自の関数に対してコントラクトを宣言することも可能ですが、この機能は **実験的（experimental）** です。現在の構文は初期のプロトタイプ段階にあり、将来変更される可能性が非常に高いためです。また、現在の Kotlin コンパイラはコントラクトの妥当性を検証しないため、正しく健全なコントラクトを作成することはプログラマの責任であることに注意してください。

カスタムコントラクトは、DSL スコープを提供する stdlib の `contract` 関数の呼び出しによって導入されます。

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

構文の詳細や互換性に関する通知については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md) を参照してください。

## when の対象を変数にキャプチャする

Kotlin 1.3 では、`when` の対象を変数にキャプチャできるようになりました。

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

以前から `when` の直前でこの変数を抽出することは可能でしたが、`when` 内の `val` はそのスコープが適切に `when` のボディ内に制限されるため、名前空間の汚染を防ぐことができます。[when に関する完全なドキュメントはこちら](control-flow.md#when-expressions-and-statements) を参照してください。

## インターフェースのコンパニオンにおける @JvmStatic および @JvmField

Kotlin 1.3 では、インターフェースの `companion` オブジェクトのメンバに `@JvmStatic` および `@JvmField` アノテーションを付けることが可能になりました。クラスファイル内では、これらのメンバは対応するインターフェースに引き上げられ、`static` としてマークされます。

例えば、以下の Kotlin コードは：

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

以下の Java コードと同等です：

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## アノテーションクラス内の入れ子宣言

Kotlin 1.3 では、アノテーションの中に入れ子クラス、インターフェース、オブジェクト、およびコンパニオンを持つことができるようになりました。

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }
    
    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

## 引数なしの main

慣例として、Kotlin プログラムのエントリポイントは `main(args: Array<String>)` のようなシグネチャを持つ関数です。ここで `args` はプログラムに渡されるコマンドライン引数を表します。しかし、すべてのアプリケーションがコマンドライン引数をサポートしているわけではないため、このパラメータは使われないまま終わることがよくあります。

Kotlin 1.3 では、パラメータを取らないよりシンプルな形式の `main` が導入されました。これで Kotlin の "Hello, World" は 19 文字短くなりました！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 多数の引数を持つ関数

Kotlin では、関数型は異なる数のパラメータを取るジェネリッククラスとして表現されます：`Function0<R>`, `Function1<P0, R>`, `Function2<P0, P1, R>`... このアプローチの問題は、このリストが有限であり、現在は `Function22` で終わっていることです。

Kotlin 1.3 ではこの制限が緩和され、より多くの引数（アリティ）を持つ関数のサポートが追加されました。

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* あと42個 */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## プログレッシブモード

Kotlin はコードの安定性と後方互換性を非常に重視しています。Kotlin の互換性ポリシーによれば、破壊的変更（例：以前は正常にコンパイルできていたコードがコンパイルできなくなるような変更）は、メジャーリリース（**1.2**, **1.3** など）でしか導入できません。

私たちは、多くのユーザーが、重要なコンパイラのバグ修正が即座に適用され、コードがより安全で正確になるような、より速いサイクルを利用できると考えています。そこで Kotlin 1.3 では、コンパイラに `-progressive` 引数を渡すことで有効にできる *プログレッシブ（progressive）* モードを導入しました。

プログレッシブモードでは、言語セマンティクスのいくつかの修正が即座に適用されます。これらの修正にはすべて 2 つの重要な特性があります：

* 旧バージョンのコンパイラとのソースコードの後方互換性を維持します。つまり、プログレッシブコンパイラでコンパイル可能なすべてのコードは、非プログレッシブコンパイラでも正常にコンパイルされます。
* ある意味でコードを *より安全* にするだけです。例えば、不健全なスマートキャストを禁止したり、生成されたコードの動作をより予測可能で安定したものに変更したりします。

プログレッシブモードを有効にすると、コードの一部を書き直す必要があるかもしれませんが、それほど多くはないはずです。プログレッシブモードで有効になるすべての修正は、慎重に厳選され、レビューされ、ツールによる移行支援が提供されます。最新の言語バージョンに迅速にアップデートされる、アクティブにメンテナンスされているコードベースにとって、プログレッシブモードは良い選択肢になると期待しています。

## インラインクラス (Inline classes)

> インラインクラスは [アルファ（Alpha）](components-stability.md) 段階です。将来、互換性のない変更が行われ、手動での移行が必要になる可能性があります。
> フィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしています。
> 詳細は [リファレンス](inline-classes.md) を参照してください。
>
{style="warning"}

Kotlin 1.3 では、新しい種類の宣言である `inline class` が導入されました。インラインクラスは通常のクラスの制限されたバージョンと見なすことができ、特にインラインクラスはちょうど 1 つのプロパティを持つ必要があります。

```kotlin
inline class Name(val s: String)
```

Kotlin コンパイラはこの制限を利用して、インラインクラスのランタイム表現を積極的に最適化し、可能な限りインスタンスを基底のプロパティの値に置き換えます。これにより、コンストラクタの呼び出しの削除、GC への負荷軽減、その他の最適化が可能になります。

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 次の行ではコンストラクタの呼び出しは発生しません。
    // ランタイムにおいて 'name' は単なる文字列 "Kotlin" を含みます。
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細はインラインクラスの [リファレンス](inline-classes.md) を参照してください。

## 符号なし整数 (Unsigned integers)

> 符号なし整数は [ベータ（Beta）](components-stability.md) 段階です。
> 実装はほぼ安定していますが、将来的に移行ステップが必要になる可能性があります。
> 変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

Kotlin 1.3 では符号なし整数型が導入されました：

* `kotlin.UByte`: 符号なし 8 ビット整数、範囲は 0 〜 255
* `kotlin.UShort`: 符号なし 16 ビット整数、範囲は 0 〜 65535
* `kotlin.UInt`: 符号なし 32 ビット整数、範囲は 0 〜 2^32 - 1
* `kotlin.ULong`: 符号なし 64 ビット整数、範囲は 0 〜 2^64 - 1

符号付き整数の機能の大部分は、符号なしの対応する型でもサポートされています：

```kotlin
fun main() {
//sampleStart
// リテラル接尾辞を使用して符号なし型を定義できます
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib の拡張機能を使用して、符号付き型から符号なし型へ、またはその逆の変換が可能です：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 符号なし型は同様の演算子をサポートしています：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u
//sampleEnd
println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細は [リファレンス](unsigned-integer-types.md) を参照してください。

## @JvmDefault

> `@JvmDefault` は [実験的（Experimental）](components-stability.md) です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。フィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしています。
>
{style="warning"}

Kotlin は Java 6 や Java 7 を含む幅広い Java バージョンをターゲットとしていますが、これらのバージョンではインターフェースのデフォルトメソッドが許可されていません。利便性のために Kotlin コンパイラはその制限を回避して動作しますが、この回避策は Java 8 で導入された `default` メソッドと互換性がありません。

これは Java との相互運用性において問題となる可能性があるため、Kotlin 1.3 では `@JvmDefault` アノテーションが導入されました。このアノテーションが付いたメソッドは、JVM 向けに `default` メソッドとして生成されます。

```kotlin
interface Foo {
    // 'default' メソッドとして生成されます
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！ API に `@JvmDefault` を付けることは、バイナリ互換性に重大な影響を及ぼします。
プロダクション環境で `@JvmDefault` を使用する前に、必ず [リファレンスページ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html) を注意深く読んでください。
>
{style="warning"}

## 標準ライブラリ (Standard library)

### マルチプラットフォーム対応の Random

Kotlin 1.3 以前は、すべてのプラットフォームで乱数を生成する統一された方法がなく、JVM 上の `java.util.Random` のようなプラットフォーム固有のソリューションに頼る必要がありました。このリリースでは、すべてのプラットフォームで利用可能な `kotlin.random.Random` クラスを導入することで、この問題を解決しました。

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 数値は [0, limit) の範囲内
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty および orEmpty 拡張機能

一部の型に対する `isNullOrEmpty` および `orEmpty` 拡張機能は、すでに stdlib に存在していました。前者はレシーバが `null` または空の場合に `true` を返し、後者はレシーバが `null` の場合に空のインスタンスにフォールバックします。Kotlin 1.3 では、コレクション、マップ、およびオブジェクトの配列に対しても同様の拡張機能が提供されました。

### 既存の 2 つの配列間での要素のコピー

既存の配列型（符号なし配列を含む）向けの `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 関数により、純粋な Kotlin での配列ベースのコンテナの実装が容易になりました。

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### associateWith

キーのリストがあり、それぞれのキーをある値に関連付けてマップを作成したいという状況はよくあります。以前は `associate { it to getValue(it) }` 関数で可能でしたが、より効率的で見つけやすい代替案として `keys.associateWith { getValue(it) }` を導入しました。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmpty および ifBlank 関数

コレクション、マップ、オブジェクト配列、文字シーケンス、およびシーケンスに `ifEmpty` 関数が追加されました。これを使用すると、レシーバが空の場合に使用されるフォールバック値を指定できます。

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字シーケンスと文字列には、さらに `ifBlank` 拡張機能が追加されました。これは `ifEmpty` と同じことを行いますが、空であるかどうかに加えて、文字列がすべて空白文字であるかどうかもチェックします。

```kotlin
fun main() {
//sampleStart
    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### リフレクションにおける Sealed クラス

`kotlin-reflect` に、`sealed` クラスのすべての直接のサブタイプを列挙するために使用できる新しい API、`KClass.sealedSubclasses` を追加しました。

### その他の小さな変更

* `Boolean` 型にコンパニオンが追加されました。
* `null` に対して 0 を返す `Any?.hashCode()` 拡張機能。
* `Char` に `MIN_VALUE` および `MAX_VALUE` 定数が提供されました。
* プリミティブ型のコンパニオンに `SIZE_BYTES` および `SIZE_BITS` 定数が追加されました。

## ツール (Tooling)

### IDE でのコードスタイルサポート

Kotlin 1.3 では、IntelliJ IDEA における [推奨コードスタイル](coding-conventions.md) のサポートが導入されました。移行ガイドラインについては、[このページ](code-style-migration-guide.md) を確認してください。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) は、Kotlin におけるオブジェクトの（デ）シリアル化のためのマルチプラットフォームサポートを提供するライブラリです。以前は別のプロジェクトでしたが、Kotlin 1.3 からは他のコンパイラプラグインと同様に Kotlin コンパイラの配布物に含まれるようになりました。主な違いは、使用している Kotlin IDE プラグインのバージョンと Serialization IDE プラグインの互換性を手動で気にする必要がなくなったことです。現在、Kotlin IDE プラグインにはすでに serialization が含まれています。

詳細は [こちら](https://github.com/Kotlin/kotlinx.serialization#current-project-status) を参照してください。

> kotlinx.serialization が Kotlin コンパイラの配布物に含まれるようになりましたが、Kotlin 1.3 では依然として実験的機能と見なされています。
>
{style="warning"}

### スクリプティングのアップデート

> スクリプティングは [実験的（Experimental）](components-stability.md) です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。フィードバックを [YouTrack](https://youtrack.jetbrains.com/issues/KT) でお待ちしています。
>
{style="warning"}

Kotlin 1.3 ではスクリプティング API の進化と改善が続けられており、外部プロパティの追加、静的または動的な依存関係の提供など、スクリプトのカスタマイズのための実験的なサポートが導入されています。

追加の詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md) を参照してください。

### スクラッチ（Scratches）のサポート

Kotlin 1.3 では、実行可能な Kotlin *スクラッチファイル（scratch files）* のサポートが導入されました。*スクラッチファイル* は .kts 拡張子を持つ Kotlin スクリプトファイルで、エディタ内で直接実行して評価結果を得ることができます。

詳細は一般的な [Scratches のドキュメント](https://www.jetbrains.com/help/idea/scratches.html) を参照してください。