---
title: "Kotlin 1.3の新機能"
---
_Released: 2018年10月29日_

## コルーチンリリース

長期間にわたる広範な実地試験を経て、コルーチンがリリースされました。つまり、Kotlin 1.3以降、言語サポートとAPIは[完全に安定](components-stability)しているということです。新しい[コルーチンの概要](coroutines-overview)ページをご覧ください。

Kotlin 1.3では、サスペンド関数に対する呼び出し可能参照と、リフレクションAPIでのコルーチンのサポートが導入されています。

## Kotlin/Native

Kotlin 1.3では、引き続きNativeターゲットの改善と洗練が進められています。詳細については、[Kotlin/Nativeの概要](native-overview)をご覧ください。

## マルチプラットフォームプロジェクト

1.3では、表現力と柔軟性を向上させ、共通コードの共有を容易にするために、マルチプラットフォームプロジェクトのモデルを完全に作り直しました。また、Kotlin/Nativeがターゲットの1つとしてサポートされるようになりました。

旧モデルからの主な違いは次のとおりです。

  * 旧モデルでは、共通コードとプラットフォーム固有のコードを別々のモジュールに配置し、`expectedBy`依存関係でリンクする必要がありました。
    現在、共通コードとプラットフォーム固有のコードは、同じモジュールの異なるソースルートに配置されており、プロジェクトの構成が容易になっています。
  * さまざまなサポート対象プラットフォームに対応するために、多数の[プリセットプラットフォーム構成](multiplatform-dsl-reference#targets)が用意されています。
  * [依存関係の構成](multiplatform-add-dependencies)が変更されました。依存関係は、
    各ソースルートに対して個別に指定されるようになりました。
  * ソースセットは、プラットフォームの任意のサブセット間で共有できるようになりました
  (たとえば、JS、Android、iOSをターゲットとするモジュールでは、AndroidとiOSの間でのみ共有されるソースセットを持つことができます)。
  * [マルチプラットフォームライブラリの発行](multiplatform-publish-lib)がサポートされるようになりました。

詳細については、[マルチプラットフォームプログラミングのドキュメント](multiplatform-intro)を参照してください。

## コントラクト

Kotlinコンパイラは、警告を提供し、ボイラープレートを削減するために、広範な静的分析を行います。最も注目すべき
機能の1つはスマートキャストです。これは、実行された型チェックに基づいて自動的にキャストを実行する機能です。

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // コンパイラは 's' を 'String' に自動的にキャストします
}
```

ただし、これらのチェックが別の関数に抽出されるとすぐに、すべてのスマートキャストがすぐに消えてしまいます。

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // スマートキャストはありません :(
}
```

このような場合の動作を改善するために、Kotlin 1.3では*コントラクト*と呼ばれる実験的なメカニズムが導入されています。

*コントラクト*を使用すると、関数はコンパイラが理解できる方法でその動作を明示的に記述できます。
現在、次の2つの広範なケースがサポートされています。

* 関数の呼び出し結果と渡された引数の値の関係を宣言することにより、スマートキャスト分析を改善します。

```kotlin
fun require(condition: Boolean) {
    // これは、コンパイラに次のように伝える構文形式です。
    // 「この関数が正常に返された場合、渡された 'condition' は真です」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // ここで s は 'String' にスマートキャストされます。そうでない場合
    // 'require' は例外をスローします
}
```

* 高階関数が存在する場合の変数初期化分析を改善します。

```kotlin
fun synchronize(lock: Any?, block: () `->` Unit) {
    // これはコンパイラに次のように伝えます。
    // 「この関数は、ここですぐに、そして正確に1回 'block' を呼び出します」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // コンパイラは 'synchronize' に渡されたラムダが呼び出されることを知っています
               // 正確に1回なので、再割り当ては報告されません
    }
    println(x) // コンパイラはラムダが確実に呼び出され、実行することを知っています
               // 初期化なので、'x' はここで初期化されたと見なされます
}
```

### stdlibのコントラクト

`stdlib`はすでにコントラクトを利用しており、これにより上記の分析が改善されます。
コントラクトのこの部分は**安定**しています。つまり、追加のオプトインなしで、すぐに改善された分析の恩恵を受けることができます。

```kotlin

fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // よし、not-nullへのスマートキャスト!
    }
}

fun main() {
    bar(null)
    bar("42")
}
```

### カスタムコントラクト

独自の関数にコントラクトを宣言することは可能ですが、現在の構文は
初期のプロトタイプの状態であり、おそらく変更されるため、この機能は**実験的**です。また、現在のKotlinコンパイラは
コントラクトを検証しないため、プログラマは正しいサウンドコントラクトを作成する責任があることに注意してください。

カスタムコントラクトは、DSLスコープを提供する`contract` stdlib関数の呼び出しによって導入されます。

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

構文の詳細と互換性に関する注意については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts)を参照してください。

## when の subject を変数にキャプチャする

Kotlin 1.3では、`when` の subject を変数にキャプチャできるようになりました。

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success `->` response.body
            is HttpError `->` throw HttpException(response.status)
        }
```

`when` の直前にこの変数を抽出することはすでに可能でしたが、`when` の `val` はそのスコープが `when` の本体に適切に制限され、名前空間の汚染を防ぎます。[`when` に関する完全なドキュメントはこちら](control-flow#when-expressions-and-statements)をご覧ください。

## インターフェースのコンパニオンの @JvmStatic および @JvmField

Kotlin 1.3では、インターフェースの `companion` オブジェクトのメンバーにアノテーション `@JvmStatic` および `@JvmField` を付けることができます。
クラスファイルでは、このようなメンバーは対応するインターフェースにリフトされ、`static` としてマークされます。

たとえば、次のKotlinコード：

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

これは、次のJavaコードと同等です。

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## アノテーションクラスのネストされた宣言

Kotlin 1.3では、アノテーションがネストされたクラス、インターフェース、オブジェクト、およびコンパニオンを持つことが可能です。

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

## パラメータなしの main

慣例により、Kotlinプログラムのエントリポイントは、`main(args: Array<String>)`のようなシグネチャを持つ関数です。
ここで、`args`はプログラムに渡されるコマンドライン引数を表します。ただし、すべてのアプリケーションがコマンドライン引数をサポートしているわけではないため、
このパラメータは最終的に使用されないことがよくあります。

Kotlin 1.3では、パラメータを取らないよりシンプルな形式の`main`が導入されました。これで、Kotlinの「Hello, World」は19文字短くなります。

```kotlin
fun main() {
    println("Hello, world!")
}
```

## 大きなarityを持つ関数

Kotlinでは、関数型は異なる数のパラメータを取るジェネリッククラスとして表されます：`Function0<R>`、
`Function1<P0, R>`、`Function2<P0, P1, R>`、...このアプローチには、このリストが有限であり、現在`Function22`で終わるという問題があります。

Kotlin 1.3では、この制限が緩和され、より大きなarityを持つ関数のサポートが追加されました。

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) `->` Any) {
    block(Any(), Any(), ..., Any())
}
```

## プログレッシブモード

Kotlinは、コードの安定性と下位互換性を非常に重視しています。Kotlinの互換性ポリシーでは、重大な変更
(たとえば、以前は正常にコンパイルされていたコードがコンパイルされなくなるような変更)は、メジャーリリース(**1.2**、**1.3**など)でのみ導入できると規定されています。

多くのユーザーは、重大なコンパイラのバグ修正がすぐに適用され、コードがより安全で正確になる、はるかに高速なサイクルを使用できると考えています。
そこで、Kotlin 1.3では、コンパイラに引数`-progressive`を渡すことで有効にできる*プログレッシブ*コンパイラモードが導入されました。

プログレッシブモードでは、言語セマンティクスのいくつかの修正がすぐに適用される可能性があります。これらの修正はすべて、次の2つの重要なプロパティを持っています。

* これらは、古いコンパイラとのソースコードの下位互換性を維持します。つまり、プログレッシブコンパイラによってコンパイル可能なすべてのコードは、
非プログレッシブコンパイラによって正常にコンパイルされます。
* これらは、ある意味でコードを*より安全*にするだけです。たとえば、不健全なスマートキャストが禁止されたり、生成されたコードの動作が
より予測可能/安定するように変更されたりする可能性があります。

プログレッシブモードを有効にすると、コードの一部を書き換える必要がある場合がありますが、それほど多くはないはずです。すべての修正
プログレッシブモードで有効になっているものは、慎重に選択され、レビューされ、ツール移行支援が提供されます。
プログレッシブモードは、最新の言語バージョンに迅速に更新される、積極的に保守されているコードベースにとって適切な選択肢になると考えています。

## インラインクラス

:::caution
インラインクラスは[Alpha](components-stability)にあります。これらは非互換的に変更される可能性があり、将来手動での移行が必要になる場合があります。
[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
詳細については、[リファレンス](inline-classes)を参照してください。

:::

Kotlin 1.3では、新しい種類の宣言である`inline class`が導入されています。インラインクラスは、制限されたバージョンの
通常のクラスと見なすことができます。特に、インラインクラスは正確に1つのプロパティを持つ必要があります。

```kotlin
inline class Name(val s: String)
```

Kotlinコンパイラは、この制限を使用して、インラインクラスのランタイム表現を積極的に最適化し、
可能な場合は、基になるプロパティの値でインスタンスを置き換え、コンストラクタ呼び出し、GC圧力を排除し、その他の最適化を有効にします。

```kotlin
inline class Name(val s: String)

fun main() {
    // 次の行ではコンストラクタ呼び出しは発生しません。また、
    // ランタイムでは、'name' には文字列 "Kotlin" だけが含まれています
    val name = Name("Kotlin")
    println(name.s) 
}

```

詳細については、インラインクラスの[リファレンス](inline-classes)を参照してください。

## 符号なし整数

:::caution
符号なし整数は[Beta](components-stability)にあります。
実装はほぼ安定していますが、将来移行手順が必要になる場合があります。
変更を最小限に抑えるよう最善を尽くします。

:::

Kotlin 1.3では、符号なし整数型が導入されています。

* `kotlin.UByte`: 符号なし8ビット整数、0〜255の範囲
* `kotlin.UShort`: 符号なし16ビット整数、0〜65535の範囲
* `kotlin.UInt`: 符号なし32ビット整数、0〜2^32 - 1の範囲
* `kotlin.ULong`: 符号なし64ビット整数、0〜2^64 - 1の範囲

符号付き型のほとんどの機能は、符号なしの対応物でもサポートされています。

```kotlin
fun main() {

// リテラルサフィックスを使用して、符号なし型を定義できます
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib拡張機能を介して、符号付き型を符号なし型に、またはその逆に変換できます。
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 符号なし型は同様の演算子をサポートします：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u

println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```

詳細については、[リファレンス](unsigned-integer-types)を参照してください。

## @JvmDefault

:::caution
`@JvmDefault`は[Experimental](components-stability)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

:::

Kotlinは、インターフェースのデフォルトメソッドが許可されていないJava 6やJava 7を含む、幅広いJavaバージョンをターゲットにしています。
便宜上、Kotlinコンパイラはその制限を回避しますが、この回避策はJava 8で導入された`default`メソッドと互換性がありません。

これはJava相互運用性の問題になる可能性があるため、Kotlin 1.3では`@JvmDefault`アノテーションが導入されています。
このアノテーションが付けられたメソッドは、JVMの`default`メソッドとして生成されます。

```kotlin
interface Foo {
    // 'default'メソッドとして生成されます
    @JvmDefault
    fun foo(): Int = 42
}
```

:::caution
警告！APIに`@JvmDefault`アノテーションを付けると、バイナリ互換性に重大な影響があります。
本番環境で`@JvmDefault`を使用する前に、必ず[リファレンスページ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)を注意深くお読みください。

:::

## 標準ライブラリ

### マルチプラットフォームの乱数

Kotlin 1.3より前は、すべてのプラットフォームで乱数を生成する統一された方法はありませんでした。JVMでは`java.util.Random`のようなプラットフォーム固有のソリューションに頼る必要がありました。
今回のリリースでは、すべてのプラットフォームで使用できるクラス`kotlin.random.Random`を導入することで、この問題を解決しました。

```kotlin
import kotlin.random.Random

fun main() {

    val number = Random.nextInt(42)  // number は範囲 [0, limit) にあります
    println(number)

}
```

### isNullOrEmpty および orEmpty 拡張機能

一部の型の`isNullOrEmpty`および`orEmpty`拡張機能は、すでにstdlibに存在します。最初の拡張機能は、
レシーバーが`null`または空の場合に`true`を返し、2番目の拡張機能は、レシーバーが`null`の場合に空のインスタンスにフォールバックします。
Kotlin 1.3では、コレクション、マップ、およびオブジェクト配列で同様の拡張機能が提供されます。

### 2つの既存の配列間で要素をコピーする

既存の配列型(符号なし配列を含む)の`array.copyInto(targetArray, targetOffset, startIndex, endIndex)`関数により、
純粋なKotlinで配列ベースのコンテナを簡単に実装できます。

```kotlin
fun main() {

    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())

}
```

### associateWith

キーのリストがあり、これらのキーのそれぞれを何らかの値に関連付けることによってマップを構築したいというのは、非常に一般的な状況です。
以前は`associate { it to getValue(it) }`関数でそれを行うことができましたが、より
効率的で探索しやすい代替手段を導入します。`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {

    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }

}
```

### ifEmpty および ifBlank 関数

コレクション、マップ、オブジェクト配列、文字シーケンス、およびシーケンスには、`ifEmpty`関数があり、空の場合にレシーバーの代わりに使用されるフォールバック値を指定できます。

```kotlin
fun main() {

    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c `->` c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))

}
```

さらに、文字シーケンスと文字列には、`ifEmpty`と同じことを行う`ifBlank`拡張機能がありますが、
空の代わりに文字列がすべて空白であるかどうかを確認します。

```kotlin
fun main() {

    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })

}
```

### リフレクションのsealedクラス

`sealed`クラスのすべての直接サブタイプを列挙するために使用できる新しいAPI、つまり`KClass.sealedSubclasses`を追加しました。

### より小さな変更

* `Boolean`型にコンパニオンが追加されました。
* `null`に対して0を返す`Any?.hashCode()`拡張機能。
* `Char`が`MIN_VALUE`および`MAX_VALUE`定数を提供するようになりました。
* プリミティブ型のコンパニオンの`SIZE_BYTES`および`SIZE_BITS`定数。

## ツール

### IDEのコードスタイルサポート

Kotlin 1.3では、IntelliJ IDEAで[推奨されるコードスタイル](coding-conventions)のサポートが導入されました。
移行ガイドラインについては、[このページ](code-style-migration-guide)をご覧ください。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)は、Kotlinでのオブジェクトの(逆)シリアル化に対するマルチプラットフォームサポートを提供するライブラリです。
以前は、これは別のプロジェクトでしたが、Kotlin 1.3以降、他のコンパイラプラグインと同等のKotlinコンパイラディストリビューションに同梱されています。
主な違いは、使用しているKotlin IDEプラグインバージョンと互換性のあるSerialization IDE Pluginを手動で監視する必要がないことです。
Kotlin IDEプラグインには、すでにシリアル化が含まれています。

[詳細](https://github.com/Kotlin/kotlinx.serialization#current-project-status)はこちらをご覧ください。

:::caution
kotlinx.serializationはKotlin Compilerディストリビューションに同梱されていますが、Kotlin 1.3では依然として実験的な機能と見なされています。

:::

### スクリプトのアップデート

:::caution
スクリプトは[Experimental](components-stability)です。いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。

:::

Kotlin 1.3では、スクリプトAPIの開発と改善が続けられており、外部プロパティの追加、静的または動的な依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートがいくつか導入されています。

詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)を参照してください。

### Scratches サポート

Kotlin 1.3 では、実行可能な Kotlin の *scratch files* のサポートが導入されています。*Scratch file* は .kts 拡張子を持つ Kotlin スクリプトファイルで、実行してエディターで直接評価結果を得ることができます。

詳細については、一般的な[Scratches ドキュメント](https://www.jetbrains.com/help/idea/scratches.html)を参照してください。