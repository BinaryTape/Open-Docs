[//]: # (title: Kotlin 1.3の新機能)

_リリース日: 2018年10月29日_

## コルーチンのリリース

長期間にわたる広範な実戦テストを経て、コルーチンが正式にリリースされました！これは、Kotlin 1.3以降、言語サポートとAPIが[完全に安定版](components-stability.md)になったことを意味します。新しい[コルーチンの概要](coroutines-overview.md)ページをご覧ください。

Kotlin 1.3では、`suspend`関数における呼び出し可能参照と、リフレクションAPIにおけるコルーチンのサポートが導入されました。

## Kotlin/Native

Kotlin 1.3では、Nativeターゲットの改善と洗練が引き続き行われています。詳細は[Kotlin/Nativeの概要](native-overview.md)をご覧ください。

## マルチプラットフォームプロジェクト

1.3では、表現力と柔軟性を向上させ、共通コードの共有を容易にするために、マルチプラットフォームプロジェクトのモデルを完全に再構築しました。また、Kotlin/Nativeもターゲットの1つとしてサポートされるようになりました！

古いモデルとの主な違いは次のとおりです。

  * 古いモデルでは、共通コードとプラットフォーム固有のコードは、`expectedBy`依存関係によってリンクされた個別のモジュールに配置する必要がありました。
    現在では、共通コードとプラットフォーム固有のコードは、同じモジュールの異なるソースルートに配置されるため、プロジェクトの設定が容易になります。
  * 現在、さまざまなサポート対象プラットフォーム向けに多数の[プリセットプラットフォーム構成](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)が用意されています。
  * [依存関係の構成](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)が変更されました。依存関係は
    各ソースルートで個別に指定されるようになりました。
  * ソースセットは、プラットフォームの任意のサブセット間で共有できるようになりました
  (たとえば、JS、Android、iOSをターゲットとするモジュールでは、AndroidとiOSの間でのみ共有されるソースセットを持つことができます)。
  * [マルチプラットフォームライブラリの公開](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)がサポートされるようになりました。

詳細については、[マルチプラットフォームプログラミングのドキュメント](https://kotlinlang.org/docs/multiplatform/get-started.html)を参照してください。

## コントラクト

Kotlinコンパイラは、警告を提供し、ボイラープレートを削減するために広範な静的解析を行います。最も注目すべき機能の1つはスマートキャストです。これは、実行された型チェックに基づいて自動的にキャストを実行する機能です。

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // コンパイラは自動的に's'を'String'にキャストします
}
```

しかし、これらのチェックが別の関数に抽出されるとすぐに、すべてのスマートキャストが消滅してしまいます。

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // スマートキャストなし :(
}
```

このような場合の挙動を改善するため、Kotlin 1.3では*コントラクト*と呼ばれる実験的なメカニズムが導入されています。

*コントラクト*を使用すると、関数がその振る舞いをコンパイラが理解できる形で明示的に記述できます。
現在、2つの幅広いケースがサポートされています。

* 関数の呼び出し結果と渡された引数の値との関係を宣言することにより、スマートキャスト解析を改善します。

```kotlin
fun require(condition: Boolean) {
    // これはコンパイラに伝える構文形式です。
    // 「この関数が正常に返された場合、渡された'condition'はtrueである」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // ここで's'は'String'にスマートキャストされます。なぜなら、そうでなければ
    // 'require'が例外をスローするからです
}
```

* 高階関数が存在する場合の変数初期化解析を改善します。

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // これはコンパイラに伝えます。
    // 「この関数は'block'をここですぐに、そして正確に1回呼び出す」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // コンパイラは、'synchronize'に渡されたラムダが呼び出されることを知っています。
               // 厳密に1回なので、再割り当ては報告されません
    }
    println(x) // コンパイラは、ラムダが間違いなく呼び出され、初期化を実行することを知っています。
               // そのため、'x'はここで初期化されていると見なされます
}
```

### 標準ライブラリにおけるコントラクト

`stdlib`は既にコントラクトを利用しており、上記の解析の改善につながっています。
このコントラクトの機能は**安定版**であり、追加のオプトインなしで今すぐ改善された解析の恩恵を受けることができます。

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // やった、非nullへのスマートキャスト！
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

独自の関数に対してコントラクトを宣言することは可能ですが、この機能は**実験的**であり、現在の構文は初期プロトタイプの状態であり、変更される可能性が非常に高いです。また、現在Kotlinコンパイラはコントラクトを検証しないため、正確で健全なコントラクトを記述するのはプログラマの責任であることに注意してください。

カスタムコントラクトは、DSLスコープを提供する`contract`標準ライブラリ関数の呼び出しによって導入されます。

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

構文の詳細と互換性に関する注意については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)を参照してください。

## `when`式の主題を変数にキャプチャ

Kotlin 1.3では、`when`式の主題を変数にキャプチャできるようになりました。

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

以前は`when`式の直前でこの変数を抽出することも可能でしたが、`when`内の`val`はそのスコープが`when`の本体に適切に制限されるため、名前空間の汚染を防ぐことができます。[`when`式に関する完全なドキュメントはこちら](control-flow.md#when-expressions-and-statements)をご覧ください。

## インターフェースのコンパニオンにおける`@JvmStatic`と`@JvmField`

Kotlin 1.3では、インターフェースの`companion`オブジェクトのメンバーに`@JvmStatic`および`@JvmField`アノテーションを付けることが可能になりました。
クラスファイルでは、そのようなメンバーは対応するインターフェースに引き上げられ、`static`としてマークされます。

たとえば、次のKotlinコードは、

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

このJavaコードと同等です。

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

## 引数なしの`main`関数

慣例として、Kotlinプログラムのエントリポイントは`main(args: Array<String>)`のようなシグネチャを持つ関数であり、`args`はプログラムに渡されるコマンドライン引数を表します。しかし、すべてのアプリケーションがコマンドライン引数をサポートしているわけではないため、このパラメータが使用されないままになることがよくあります。

Kotlin 1.3では、パラメータを取らないよりシンプルな形式の`main`関数が導入されました。これで、Kotlinの「Hello, World」は19文字短縮されます！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 多数の引数を持つ関数

Kotlinでは、関数型は異なる数のパラメータを取るジェネリッククラスとして表現されます。`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>`、...。このアプローチには、このリストが有限であり、現在`Function22`で終わるという問題がありました。

Kotlin 1.3ではこの制限が緩和され、より多数の引数を持つ関数のサポートが追加されました。

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## プログレッシブモード

Kotlinはコードの安定性と後方互換性を非常に重視しており、Kotlinの互換性ポリシーでは、破壊的変更（たとえば、以前は問題なくコンパイルされていたコードがコンパイルできなくなる変更）はメジャーリリース（**1.2**、**1.3**など）でのみ導入できるとされています。

多くのユーザーは、致命的なコンパイラのバグ修正がすぐに適用され、コードがより安全で正確になるような、はるかに速いサイクルを望んでいると私たちは考えています。そこで、Kotlin 1.3では、コンパイラに`-progressive`引数を渡すことで有効にできる*プログレッシブ*コンパイラモードが導入されました。

プログレッシブモードでは、言語セマンティクスにおけるいくつかの修正がすぐに適用される可能性があります。これらの修正はすべて、2つの重要な特性を持っています。

* それらは、古いコンパイラとのソースコードの後方互換性を維持します。つまり、プログレッシブコンパイラでコンパイル可能なすべてのコードは、非プログレッシブコンパイラでも問題なくコンパイルされます。
* それらは、ある意味でコードを*より安全*にするだけです。たとえば、いくつかの不健全なスマートキャストが禁止されたり、生成されたコードの振る舞いがより予測可能/安定するように変更されたりする可能性があります。

プログレッシブモードを有効にすると、コードの一部を書き直す必要があるかもしれませんが、それほど多くはありません。プログレッシブモードで有効になるすべての修正は、慎重に厳選され、レビューされ、ツールによる移行支援が提供されています。
プログレッシブモードは、最新の言語バージョンに迅速に更新される活発にメンテナンスされているコードベースにとって、良い選択肢となると期待しています。

## インラインクラス

>インラインクラスは[アルファ版](components-stability.md)です。将来、互換性のない変更があり、手動での移行が必要になる場合があります。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
> 詳細は[リファレンス](inline-classes.md)をご覧ください。
>
{style="warning"}

Kotlin 1.3では、新しい種類の宣言である`inline class`が導入されました。インラインクラスは通常のクラスの制限されたバージョンと見なすことができ、特にインラインクラスは正確に1つのプロパティを持つ必要があります。

```kotlin
inline class Name(val s: String)
```

Kotlinコンパイラはこの制限を利用して、インラインクラスの実行時表現を積極的に最適化し、可能な場合はそのインスタンスを基盤となるプロパティの値に置き換えることで、コンストラクタ呼び出しの削除、GC負荷の軽減、およびその他の最適化を可能にします。

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

インラインクラスの詳細は[リファレンス](inline-classes.md)をご覧ください。

## 符号なし整数

>符号なし整数は[ベータ版](components-stability.md)です。
> その実装はほぼ安定していますが、将来、移行手順が必要になる場合があります。
> 変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

Kotlin 1.3では、符号なし整数型が導入されました。

*   `kotlin.UByte`: 符号なし8ビット整数、0から255の範囲
*   `kotlin.UShort`: 符号なし16ビット整数、0から65535の範囲
*   `kotlin.UInt`: 符号なし32ビット整数、0から2^32 - 1の範囲
*   `kotlin.ULong`: 符号なし64ビット整数、0から2^64 - 1の範囲

符号付き型のほとんどの機能は、符号なしの対応する型でもサポートされています。

```kotlin
fun main() {
//sampleStart
// リテラルサフィックスを使用して符号なし型を定義できます
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// stdlib拡張機能を使用して符号付き型を符号なしに変換したり、その逆を行ったりできます。
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

詳細は[リファレンス](unsigned-integer-types.md)をご覧ください。

## `@JvmDefault`

>`@JvmDefault`は[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlinは、Java 6やJava 7など、インターフェースでのデフォルトメソッドが許可されていない幅広いJavaバージョンをターゲットとしています。
利便性のため、Kotlinコンパイラはその制限を回避しますが、この回避策はJava 8で導入された`default`メソッドと互換性がありません。

これはJavaとの相互運用性の問題になる可能性があるため、Kotlin 1.3では`@JvmDefault`アノテーションが導入されました。
このアノテーションが付けられたメソッドは、JVM用に`default`メソッドとして生成されます。

```kotlin
interface Foo {
    // 'default'メソッドとして生成されます
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！APIに`@JvmDefault`をアノテーション付けすることは、バイナリ互換性に深刻な影響を及ぼします。
> 本番環境で`@JvmDefault`を使用する前に、[リファレンスページ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)を注意深くお読みください。
>
{style="warning"}

## 標準ライブラリ

### マルチプラットフォーム乱数

Kotlin 1.3より前は、すべてのプラットフォームで乱数を生成する統一された方法がなく、JVMでは`java.util.Random`のようなプラットフォーム固有のソリューションに頼る必要がありました。このリリースでは、すべてのプラットフォームで利用可能な`kotlin.random.Random`クラスを導入することで、この問題が解決されます。

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // numberは範囲[0, limit)内です
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `isNullOrEmpty`および`orEmpty`拡張機能

`isNullOrEmpty`および`orEmpty`拡張機能は、一部の型については既に標準ライブラリに存在します。前者はレシーバが`null`または空である場合に`true`を返し、後者はレシーバが`null`である場合に空のインスタンスにフォールバックします。
Kotlin 1.3では、コレクション、マップ、およびオブジェクトの配列に対しても同様の拡張機能が提供されます。

### 2つの既存の配列間で要素をコピー

既存の配列型（符号なし配列を含む）に対する`array.copyInto(targetArray, targetOffset, startIndex, endIndex)`関数により、純粋なKotlinで配列ベースのコンテナを簡単に実装できるようになりました。

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

### `associateWith`

キーのリストがあり、これらのキーのそれぞれを何らかの値に関連付けてマップを構築したいという状況は非常に一般的です。
以前は`associate { it to getValue(it) }`関数でこれを行うことができましたが、今回はより効率的で探しやすい代替手段として`keys.associateWith { getValue(it) }`を導入しました。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### `ifEmpty`および`ifBlank`関数

コレクション、マップ、オブジェクト配列、文字シーケンス、およびシーケンスに`ifEmpty`関数が追加されました。これにより、レシーバが空の場合に代わりに使用されるフォールバック値を指定できます。

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

文字シーケンスと文字列には、`ifEmpty`と同じことを行うが、空ではなく文字列がすべて空白であるかをチェックする`ifBlank`拡張機能も追加されています。

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

### リフレクションにおけるsealedクラス

`kotlin-reflect`に新しいAPIが追加され、`sealed`クラスのすべての直接的なサブタイプを列挙できるようになりました。具体的には`KClass.sealedSubclasses`です。

### その他の変更

*   `Boolean`型に`companion`が追加されました。
*   `Any?.hashCode()`拡張機能が、`null`に対して0を返すようになりました。
*   `Char`に`MIN_VALUE`と`MAX_VALUE`定数が提供されるようになりました。
*   プリミティブ型の`companion`に`SIZE_BYTES`と`SIZE_BITS`定数が追加されました。

## ツール

### IDEでのコードスタイルサポート

Kotlin 1.3では、IntelliJ IDEAで[推奨されるコードスタイル](coding-conventions.md)がサポートされます。
移行ガイドラインについては、[このページ](code-style-migration-guide.md)をご覧ください。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)は、Kotlinでオブジェクトの（デ）シリアライズをマルチプラットフォームでサポートするライブラリです。以前は個別のプロジェクトでしたが、Kotlin 1.3以降、他のコンパイラプラグインと同等にKotlinコンパイラの配布物とともに提供されるようになりました。主な違いは、Serialization IDEプラグインが使用しているKotlin IDEプラグインのバージョンと互換性があるかを手動で監視する必要がなくなったことです。現在、Kotlin IDEプラグインにはシリアライゼーションが含まれています！

詳細については[こちら](https://github.com/Kotlin/kotlinx.serialization#current-project-status)をご覧ください。

> kotlinx.serializationは現在Kotlin Compilerの配布物とともに提供されていますが、Kotlin 1.3では依然として実験的な機能と見なされています。
>
{style="warning"}

### スクリプトの更新

>スクリプトは[実験的](components-stability.md)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issues/KT)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 1.3では、スクリプトAPIの進化と改善が続けられており、外部プロパティの追加、静的または動的依存関係の提供など、スクリプトのカスタマイズに対する実験的なサポートが導入されています。

詳細については、[KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)を参照してください。

### スクラッチファイルのサポート

Kotlin 1.3では、実行可能なKotlin *スクラッチファイル*のサポートが導入されました。*スクラッチファイル*は、.kts拡張子を持つKotlinスクリプトファイルであり、エディタで直接実行し、評価結果を取得できます。

詳細については、[スクラッチファイルの一般ドキュメント](https://www.jetbrains.com/help/idea/scratches.html)をご覧ください。