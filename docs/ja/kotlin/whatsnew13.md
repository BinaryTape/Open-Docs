[//]: # (title: Kotlin 1.3の新機能)

_リリース日: 2018年10月29日_

## コルーチンのリリース

長期間にわたる徹底的な実戦テストを経て、コルーチンがリリースされました！これは、Kotlin 1.3以降、言語サポートとAPIが[完全に安定した](components-stability.md)ことを意味します。新しい[コルーチンの概要](coroutines-overview.md)ページをご確認ください。

Kotlin 1.3では、サスペンド関数に対する呼び出し可能参照と、リフレクションAPIにおけるコルーチンのサポートが導入されています。

## Kotlin/Native

Kotlin 1.3では、Nativeターゲットの改善と洗練が引き続き行われています。詳細については、[Kotlin/Nativeの概要](native-overview.md)をご確認ください。

## マルチプラットフォームプロジェクト

1.3では、表現力と柔軟性を向上させ、共通コードの共有を容易にするために、マルチプラットフォームプロジェクトのモデルを完全に再設計しました。また、Kotlin/Nativeもターゲットの1つとしてサポートされるようになりました！

従来のモデルとの主な違いは以下の通りです。

  * 従来のモデルでは、共通コードとプラットフォーム固有コードは個別のモジュールに配置され、`expectedBy`依存関係によってリンクされていました。現在では、共通コードとプラットフォーム固有コードは同じモジュールの異なるソースルートに配置されるため、プロジェクトの設定が容易になります。
  * 現在、さまざまなサポート対象プラットフォーム向けに、多数の[事前定義されたプラットフォーム設定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)が利用可能です。
  * [依存関係の設定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)が変更されました。依存関係は、各ソースルートで個別に指定されるようになりました。
  * ソースセットは、プラットフォームの任意のサブセット間で共有できるようになりました (例えば、JS、Android、iOSをターゲットとするモジュールでは、AndroidとiOSの間でのみ共有されるソースセットを持つことができます)。
  * [マルチプラットフォームライブラリの公開](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)がサポートされるようになりました。

詳細については、[マルチプラットフォームプログラミングのドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を参照してください。

## コントラクト

Kotlinコンパイラは、広範な静的解析を実行して警告を提供し、ボイラープレートを削減します。最も注目すべき機能の1つにスマートキャストがあります。これは、実行された型チェックに基づいて自動的にキャストを実行する機能です。

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // コンパイラは's'を自動的に'String'にスマートキャストします
}
```

しかし、これらのチェックが個別の関数に抽出されると、すべてのスマートキャストはすぐに失われます。

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // スマートキャストされません :(
}
```

このような場合の動作を改善するため、Kotlin 1.3では*コントラクト*と呼ばれる実験的なメカニズムが導入されています。

*コントラクト*を使用すると、関数がその動作をコンパイラに理解される形で明示的に記述できます。現在、大きく2種類のケースがサポートされています。

* 関数の呼び出し結果と渡された引数の値との関係を宣言することで、スマートキャスト解析を改善します。

```kotlin
fun require(condition: Boolean) {
    // これはコンパイラに伝える構文形式です。
    // 「この関数が正常に返される場合、渡された'condition'はtrueである」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // ここでは's'は'String'にスマートキャストされます。なぜなら、そうでない場合、
    // 'require'は例外をスローしていたでしょう。
}
```

* 高階関数が存在する場合の変数初期化解析を改善します。

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // これはコンパイラに伝えます。
    // 「この関数は'block'をここですぐに、かつ正確に1回呼び出します」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // コンパイラは'synchronize'に渡されたラムダが呼び出されることを知っています
               // 正確に1回なので、再代入は報告されません
    }
    println(x) // コンパイラはラムダが確実に呼び出され、
               // 初期化が行われることを知っているので、ここでは'x'が初期化済みとみなされます。
}
```

### 標準ライブラリにおけるコントラクト

標準ライブラリはすでにコントラクトを利用しており、これは上記の解析の改善につながります。コントラクトのこの部分は**安定版**であり、追加のオプトインなしに、すぐに改善された解析の恩恵を受けることができます。

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // やった、非nullにスマートキャスト！
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

自身の関数にコントラクトを宣言することは可能ですが、現在の構文は初期プロトタイプの段階にあり、変更される可能性が高いことから、この機能は**実験的**です。また、現在Kotlinコンパイラはコントラクトを検証しないため、正しく健全なコントラクトを記述するのはプログラマの責任である点にご注意ください。

カスタムコントラクトは、DSLスコープを提供する`contract`標準ライブラリ関数への呼び出しによって導入されます。

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

構文の詳細と互換性に関する注意点については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)を参照してください。

## `when`の対象を変数にキャプチャする

Kotlin 1.3では、`when`の対象を変数にキャプチャすることが可能になりました。

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

`when`の直前にこの変数を抽出することはすでに可能でしたが、`when`内の`val`は、スコープが`when`の本体に適切に制限されるため、名前空間の汚染を防ぎます。[ `when`に関する詳細なドキュメントはこちら](control-flow.md#when-expressions-and-statements)。

## インターフェースのコンパニオンオブジェクトにおける@JvmStaticと@JvmField

Kotlin 1.3では、インターフェースの`companion`オブジェクトのメンバーに`@JvmStatic`と`@JvmField`アノテーションを付加することが可能になりました。クラスファイルでは、これらのメンバーは対応するインターフェースに昇格され、`static`としてマークされます。

例えば、以下のKotlinコードは、

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

以下のJavaコードと同等です。

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## アノテーションクラス内のネストされた宣言

Kotlin 1.3では、アノテーションがネストされたクラス、インターフェース、オブジェクト、およびコンパニオンを持つことが可能になりました。

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

## 引数なしのmain関数

慣例により、Kotlinプログラムのエントリポイントは、`main(args: Array<String>)`のようなシグネチャを持つ関数であり、ここで`args`は、プログラムに渡されるコマンドライン引数を表します。しかし、すべてのアプリケーションがコマンドライン引数をサポートしているわけではないため、このパラメーターは使用されないままになることがよくあります。

Kotlin 1.3では、パラメーターを取らないよりシンプルな形式の`main`が導入されました。これにより、Kotlinでの「Hello, World」は19文字短くなりました！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 大きいアリティを持つ関数

Kotlinでは、関数型は異なる数のパラメーターを取るジェネリクス型クラスとして表現されます。例えば、`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>`などです。このアプローチには、このリストが有限であり、現在は`Function22`で終わるという問題がありました。

Kotlin 1.3ではこの制限が緩和され、より大きいアリティを持つ関数のサポートが追加されました。

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## プログレッシブモード

Kotlinはコードの安定性と後方互換性を非常に重視しています。Kotlinの互換性ポリシーでは、破壊的な変更（例: 以前は正常にコンパイルできたコードがコンパイルできなくなるような変更）は、メジャーリリース（**1.2**、**1.3**など）でのみ導入できるとされています。

多くのユーザーが、重要なコンパイラのバグ修正が即座に適用され、コードをより安全で正確にする、より高速なサイクルを利用できると私たちは考えています。そのため、Kotlin 1.3では、コンパイラに引数`-progressive`を渡すことで有効にできる、*プログレッシブ*コンパイラモードが導入されています。

プログレッシブモードでは、言語セマンティクスにおける一部の修正が即座に適用されます。これらの修正はすべて、2つの重要な特性を持っています。

* 古いコンパイラとのソースコードの後方互換性を維持します。つまり、プログレッシブコンパイラでコンパイル可能なすべてのコードは、非プログレッシブコンパイラでも正常にコンパイルされます。
* ある意味でコードを*より安全に*するだけです。例えば、一部の不安定なスマートキャストが禁止されたり、生成されたコードの動作がより予測可能/安定するように変更されたりします。

プログレッシブモードを有効にすると、一部のコードを書き直す必要がある場合がありますが、それほど多くはないはずです。プログレッシブモードで有効になるすべての修正は、慎重に厳選され、レビューされ、ツールによる移行支援が提供されます。プログレッシブモードは、最新の言語バージョンに迅速に更新される、活発にメンテナンスされているあらゆるコードベースにとって良い選択肢となるでしょう。

## インラインクラス

>インラインクラスは[Alpha](components-stability.md)版です。将来的に非互換な変更や手動での移行が必要になる可能性があります。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せいただけると幸いです。詳細については[リファレンス](inline-classes.md)を参照してください。
>
{style="warning"}

Kotlin 1.3では、新しい種類の宣言である`inline class`が導入されています。インラインクラスは通常のクラスの制限されたバージョンと見なすことができ、特にインラインクラスは正確に1つのプロパティを持つ必要があります。

```kotlin
inline class Name(val s: String)
```

Kotlinコンパイラはこの制限を利用して、インラインクラスの実行時の表現を積極的に最適化し、可能な限り、そのインスタンスを基になるプロパティの値に置き換えることで、コンストラクタ呼び出しの削除、GC負荷の軽減、その他の最適化を可能にします。

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 次の行ではコンストラクタ呼び出しは発生せず、
    // 実行時には'name'には文字列 "Kotlin"のみが含まれます
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、インラインクラスの[リファレンス](inline-classes.md)を参照してください。

## 符号なし整数

>符号なし整数は[Beta](components-stability.md)版です。その実装はほぼ安定していますが、将来的に移行手順が必要になる場合があります。変更が必要になることを最小限に抑えるよう最善を尽くします。
>
{style="warning"}

Kotlin 1.3では、符号なし整数型が導入されています。

* `kotlin.UByte`: 符号なし8ビット整数、範囲は0〜255
* `kotlin.UShort`: 符号なし16ビット整数、範囲は0〜65535
* `kotlin.UInt`: 符号なし32ビット整数、範囲は0〜2^32 - 1
* `kotlin.ULong`: 符号なし64ビット整数、範囲は0〜2^64 - 1

符号付き型のほとんどの機能は、符号なしの対応する型でもサポートされています。

```kotlin
fun main() {
//sampleStart
// リテラルサフィックスを使って符号なし型を定義できます
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 標準ライブラリの拡張機能を使って、符号付き型と符号なし型を相互変換できます。
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 符号なし型は同様の演算子をサポートしています。
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

詳細については、[リファレンス](unsigned-integer-types.md)を参照してください。

## @JvmDefault

>`@JvmDefault`は[Experimental](components-stability.md)です。いつでも廃止または変更される可能性があります。評価目的のみにご利用ください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せいただけると幸いです。
>
{style="warning"}

Kotlinは、Java 6およびJava 7を含む、幅広いJavaバージョンをターゲットとしています。これらのバージョンでは、インターフェースにおけるデフォルトメソッドは許可されていません。利便性のため、Kotlinコンパイラはその制限を回避しますが、この回避策は、Java 8で導入された`default`メソッドとは互換性がありません。

これはJavaとの相互運用性に関する問題となる可能性があるため、Kotlin 1.3では`@JvmDefault`アノテーションが導入されました。このアノテーションが付与されたメソッドは、JVM向けに`default`メソッドとして生成されます。

```kotlin
interface Foo {
    // 'default'メソッドとして生成されます
    @JvmDefault
    fun foo(): Int = 42
}
```

>警告！APIに`@JvmDefault`を付与すると、バイナリ互換性に重大な影響を及ぼします。本番環境で`@JvmDefault`を使用する前に、[リファレンスページ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)を注意深くお読みください。
>
{style="warning"}

## 標準ライブラリ

### マルチプラットフォーム乱数

Kotlin 1.3より前は、すべてのプラットフォームで乱数を生成する統一された方法がありませんでした。JVMでは`java.util.Random`のようなプラットフォーム固有のソリューションに頼る必要がありました。このリリースでは、すべてのプラットフォームで利用可能な`kotlin.random.Random`クラスを導入することで、この問題が修正されます。

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // numberは[0, limit)の範囲です
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmptyとorEmpty拡張関数

標準ライブラリには、一部の型に`isNullOrEmpty`と`orEmpty`拡張関数がすでに存在します。前者はレシーバーが`null`または空の場合に`true`を返し、後者はレシーバーが`null`の場合に空のインスタンスにフォールバックします。Kotlin 1.3では、コレクション、マップ、オブジェクトの配列に対して同様の拡張関数が提供されます。

### 既存の2つの配列間で要素をコピーする

符号なし配列を含む既存の配列型に対する`array.copyInto(targetArray, targetOffset, startIndex, endIndex)`関数は、純粋なKotlinで配列ベースのコンテナを実装することを容易にします。

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

### associateWith

キーのリストがあり、それらの各キーに何らかの値を関連付けてマップを構築したいという、非常に一般的な状況があります。以前は`associate { it to getValue(it) }`関数でそれを行うことができましたが、現在ではより効率的で、探索しやすい代替手段として`keys.associateWith { getValue(it) }`を導入しています。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmptyとifBlank関数

コレクション、マップ、オブジェクト配列、文字シーケンス、およびシーケンスが`ifEmpty`関数を持つようになりました。この関数は、レシーバーが空の場合に、その代わりに使用されるフォールバック値を指定できます。

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

文字シーケンスと文字列には、さらに`ifBlank`拡張関数があります。これは`ifEmpty`と同じことをしますが、空ではなく文字列がすべて空白であるかをチェックします。

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

### リフレクションにおけるシールドクラス

`kotlin-reflect`に新しいAPIを追加しました。これは、`sealed`クラスのすべての直接のサブタイプを列挙するために使用できます。具体的には`KClass.sealedSubclasses`です。

### その他の変更点

* `Boolean`型にコンパニオンオブジェクトが追加されました。
* `Any?.hashCode()`拡張関数が追加され、`null`に対して0を返します。
* `Char`型に`MIN_VALUE`と`MAX_VALUE`定数が提供されるようになりました。
* プリミティブ型のコンパニオンオブジェクトに`SIZE_BYTES`と`SIZE_BITS`定数が追加されました。

## ツール

### IDEにおけるコードスタイルサポート

Kotlin 1.3では、IntelliJ IDEAにおける[推奨されるコードスタイル](coding-conventions.md)のサポートを導入しています。移行ガイドラインについては、[こちらのページ](code-style-migration-guide.md)をご確認ください。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)は、Kotlinにおけるオブジェクトの(デ)シリアライズのマルチプラットフォームサポートを提供するライブラリです。以前は独立したプロジェクトでしたが、Kotlin 1.3以降、他のコンパイラプラグインと同等にKotlinコンパイラのディストリビューションに含まれています。主な違いは、使用しているKotlin IDEプラグインのバージョンとSerialization IDEプラグインの互換性を手動で確認する必要がないことです。現在、Kotlin IDEプラグインにはすでにシリアライゼーションが含まれています！

詳細については、[こちら](https://github.com/Kotlin/kotlinx.serialization#current-project-status)を参照してください。

>kotlinx.serializationは現在Kotlinコンパイラのディストリビューションに含まれていますが、Kotlin 1.3では依然として実験的な機能と見なされています。
>
{style="warning"}

### スクリプティングの更新

>スクリプティングは[Experimental](components-stability.md)です。いつでも廃止または変更される可能性があります。評価目的のみにご利用ください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せいただけると幸いです。
>
{style="warning"}

Kotlin 1.3では、スクリプティングAPIの進化と改善を続けており、外部プロパティの追加、静的または動的依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートを導入しています。

さらなる詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を参照してください。

### スクラッチファイルのサポート

Kotlin 1.3では、実行可能なKotlinの*スクラッチファイル*のサポートを導入しています。*スクラッチファイル*とは、.kts拡張子を持つKotlinスクリプトファイルで、エディター内で直接実行して評価結果を得ることができます。

詳細については、一般的な[スクラッチファイルのドキュメント](https://www.jetbrains.com/help/idea/scratches.html)を参照してください。