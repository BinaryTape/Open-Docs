[//]: # (title: Kotlin 1.4.0 の新機能)

<web-summary>Kotlin 1.4.0 のリリースノート。新しい言語機能、Kotlin マルチプラットフォームのアップデート、JVM、Native、JS、および Gradle と Maven のビルドツールサポートについて説明します。</web-summary>

_[リリース日: 2020年8月17日](releases.md#release-history)_

Kotlin 1.4.0 では、[品質とパフォーマンスに重点を置き](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-of-quality-and-performance/)、すべてのコンポーネントにおいて多数の改善が行われました。
以下に Kotlin 1.4.0 における最も重要な変更点をリストアップします。

> Kotlin のリリースサイクルの詳細については、[Kotlin のリリースプロセス](releases.md)を参照してください。
>
{style="tip"}

## 言語機能と改善

Kotlin 1.4.0 には、さまざまな言語機能と改善が含まれています。主なものは以下の通りです：

* [Kotlin インターフェースの SAM 変換](#sam-conversions-for-kotlin-interfaces)
* [ライブラリ作者向けの明示的 API モード](#explicit-api-mode-for-library-authors)
* [名前付き引数と位置引数の混用](#mixing-named-and-positional-arguments)
* [末尾のカンマ](#trailing-comma)
* [呼び出し可能参照（Callable reference）の改善](#callable-reference-improvements)
* [ループ内の when の中での break と continue](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin インターフェースの SAM 変換

Kotlin 1.4.0 より前は、SAM（Single Abstract Method：単一抽象メソッド）変換は [Kotlin から Java のメソッドや Java インターフェースを扱う場合](java-interop.md#sam-conversions)にのみ適用できました。今後は、Kotlin インターフェースに対しても SAM 変換を使用できるようになります。
これを行うには、Kotlin インターフェースを `fun` 修飾子で明示的に関数型インターフェースとしてマークします。

SAM 変換は、パラメータとして単一の抽象メソッドのみを持つインターフェースが期待されている場所に、ラムダを引数として渡すと適用されます。この場合、コンパイラは自動的にラムダを、その抽象メンバー関数を実装するクラスのインスタンスに変換します。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[Kotlin の関数型インターフェースと SAM 変換についての詳細はこちら](fun-interfaces.md)。

### ライブラリ作者向けの明示的 API モード

Kotlin コンパイラは、ライブラリ作者向けに *明示的 API モード（explicit API mode）* を提供します。このモードでは、コンパイラはライブラリの API をより明確で一貫したものにするための追加のチェックを実行します。ライブラリの公開 API に公開される宣言に対して、以下の要件が追加されます：

* デフォルトの可視性が公開 API にさらされる場合、宣言に可視性修飾子が必要になります。これにより、意図せず宣言が公開 API に公開されるのを防ぎます。
* 公開 API に公開されるプロパティや関数に対して、明示的な型指定が必要になります。これにより、API の利用者が使用しているメンバーの型を確実に把握できるようになります。

設定に応じて、これらの明示的 API はエラー（*strict* モード）または警告（*warning* モード）を生成します。読みやすさと常識的な判断から、特定の種類の宣言はこれらのチェックから除外されます：

* プライマリコンストラクタ
* データクラスのプロパティ
* プロパティのゲッターとセッター
* `override` メソッド

明示的 API モードは、モジュールのプロダクションソースのみを分析します。

モジュールを明示的 API モードでコンパイルするには、Gradle ビルドスクリプトに以下の行を追加します：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // strict モードの場合
    explicitApi() 
    // または
    explicitApi = ExplicitApiMode.Strict
    
    // warning モードの場合
    explicitApiWarning()
    // または
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // strict モードの場合
    explicitApi() 
    // または
    explicitApi = 'strict'
    
    // warning モードの場合
    explicitApiWarning()
    // または
    explicitApi = 'warning'
}
```

</tab>
</tabs>

コマンドラインコンパイラを使用する場合は、`-Xexplicit-api` コンパイラオプションに `strict` または `warning` を指定して、明示的 API モードに切り替えます。

```bash
-Xexplicit-api={strict|warning}
```

[明示的 API モードの詳細については KEEP を参照してください](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 名前付き引数と位置引数の混用

Kotlin 1.3 では、[名前付き引数](functions.md#named-arguments)を使用して関数を呼び出す際、最初の名前付き引数よりも前に、名前のないすべての引数（位置引数）を配置する必要がありました。例えば、`f(1, y = 2)` は呼び出せますが、`f(x = 1, 2)` は呼び出せませんでした。

すべての引数が正しい位置にあるのに、途中の 1 つの引数だけに名前を指定したい場合には非常に不便でした。これは特に、Boolean 値や `null` 値がどの属性に属しているかを完全に明確にするのに役立ちます。

Kotlin 1.4 ではそのような制限はなくなり、一連の位置引数の途中で引数の名前を指定できるようになりました。さらに、正しい順序を保っている限り、位置引数と名前付き引数を自由に混ぜることができます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

// 途中に名前付き引数を入れた関数呼び出し
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 末尾のカンマ（Trailing comma）

Kotlin 1.4 から、引数リストやパラメータリスト、`when` のエントリ、非構造化宣言のコンポーネントなどの列挙において、末尾にカンマを追加できるようになりました。
末尾のカンマを使用すると、カンマを追加したり削除したりすることなく、新しい項目を追加したり順序を変更したりできます。

これは、パラメータや値を複数行の構文で使用する場合に特に役立ちます。末尾のカンマを追加しておけば、パラメータや値の行を簡単に入れ替えることができます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', // 末尾のカンマ
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", // 末尾のカンマ
)
```

### 呼び出し可能参照（Callable reference）の改善

Kotlin 1.4 では、呼び出し可能参照を使用できるケースが増えました：

* デフォルト値を持つパラメータを含む関数への参照
* `Unit` を返す関数内での関数参照
* 関数の引数の数に基づいて適応する参照
* 呼び出し可能参照に対するサスペンド変換

#### デフォルト値を持つパラメータを含む関数への参照

デフォルト値を持つパラメータを含む関数に対しても、呼び出し可能参照を使用できるようになりました。関数 `foo` への呼び出し可能参照が引数を取らない場合、デフォルト値 `0` が使用されます。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前は、`apply` または `foo` 関数のいずれかに追加のオーバーロードを書く必要がありました。

```kotlin
// 新しいオーバーロードの例
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### Unit を返す関数内での関数参照

Kotlin 1.4 では、任意の型を返す関数への呼び出し可能参照を、`Unit` を返す関数内で使用できます。Kotlin 1.4 より前は、このケースではラムダ引数しか使用できませんでした。今後は、ラムダ引数と呼び出し可能参照の両方が使用可能です。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 1.4 より前はこれしかできなかった
    foo(::returnsInt) // 1.4 以降は、これも動作する
}
```

#### 関数の引数の数に基づいて適応する参照

可変長引数（`vararg`）を渡す際に、関数の呼び出し可能参照を適応させることができるようになりました。渡された引数リストの最後に、同じ型のパラメータをいくつでも渡すことができます。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 呼び出し可能参照に対するサスペンド変換

ラムダに対するサスペンド変換（suspend conversion）に加えて、Kotlin 1.4.0 からは呼び出し可能参照に対してもサスペンド変換がサポートされます。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // 1.4 より前でも OK
    takeSuspend(::call) // Kotlin 1.4 では、これも動作する
}
```

### ループ内の when の中での break と continue

Kotlin 1.3 では、ループ内に含まれる `when` 式の中で、ラベルなしの `break` と `continue` を使用することはできませんでした。その理由は、これらのキーワードが `when` 式における将来的な [フォールスルー（fall-through）動作](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough) のために予約されていたからです。

そのため、ループ内の `when` 式の中で `break` や `continue` を使いたい場合は、[ラベル](returns.md#break-and-continue-labels) を付ける必要があり、かなり煩雑になっていました。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

Kotlin 1.4 では、ループ内の `when` 式の中でラベルなしの `break` と `continue` が使用できるようになりました。これらは、直近の囲んでいるループを終了させる、あるいは次のステップに進むという、期待通りの動作をします。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

`when` 内部のフォールスルー動作については、今後の設計課題となっています。

## IDE の新ツール

Kotlin 1.4 では、IntelliJ IDEA で Kotlin 開発を簡素化するための新しいツールを使用できます：

* [新しい柔軟な Project Wizard](#new-flexible-project-wizard)
* [コルーチンデバッガ](#coroutine-debugger)

### 新しい柔軟な Project Wizard

新しい柔軟な Kotlin Project Wizard を使用すると、UI なしでは構成が難しいマルチプラットフォームプロジェクトを含む、さまざまな種類の Kotlin プロジェクトを簡単に作成および構成できます。

![Kotlin Project Wizard – マルチプラットフォームプロジェクト](multiplatform-project-1-wn.png)

新しい Kotlin Project Wizard はシンプルかつ柔軟です：

1. やりたいことに応じて *プロジェクトテンプレートを選択* します。今後さらにテンプレートが追加される予定です。
2. *ビルドシステムを選択* します。Gradle（Kotlin または Groovy DSL）、Maven、または IntelliJ IDEA。
   Kotlin Project Wizard は、選択したプロジェクトテンプレートでサポートされているビルドシステムのみを表示します。
3. メイン画面で直接 *プロジェクト構造をプレビュー* します。

その後、プロジェクトの作成を完了するか、オプションで次の画面で *プロジェクトを構成* できます：

4. このプロジェクトテンプレートでサポートされている *モジュールとターゲットを追加/削除* します。
5. ターゲット JVM バージョン、ターゲットテンプレート、テストフレームワークなどの *モジュールとターゲットの設定を構成* します。

![Kotlin Project Wizard - ターゲットの構成](multiplatform-project-2-wn.png)

将来的には、より多くの構成オプションやテンプレートを追加することで、Kotlin Project Wizard をさらに柔軟にする予定です。

以下のチュートリアルを通じて、新しい Kotlin Project Wizard を試すことができます：

* [Kotlin/JVM をベースにしたコンソールアプリケーションの作成](jvm-get-started.md)
* [React 用の Kotlin/JS アプリケーションの作成](js-react.md)
* [Kotlin/Native アプリケーションの作成](native-get-started.md)

### コルーチンデバッガ

多くの人がすでに非同期プログラミングに [コルーチン](coroutines-guide.md) を使用しています。
しかし、デバッグに関しては、Kotlin 1.4 より前のコルーチンの扱いは非常に苦痛でした。コルーチンはスレッド間をジャンプするため、特定のコルーチンが何をしているかを理解したり、そのコンテキストを確認したりするのが困難でした。場合によっては、ブレークポイントを越えたステップ実行が単に機能しないこともありました。その結果、コルーチンを使用したコードをデバッグするには、ロギングや推測に頼らざるを得ませんでした。

Kotlin 1.4 では、Kotlin プラグインに搭載された新機能により、コルーチンのデバッグがはるかに便利になりました。

> デバッグは、`kotlinx-coroutines-core` のバージョン 1.3.8 以降で動作します。
>
{style="note"}

**Debug ツールウィンドウ** に新しい **Coroutines** タブが追加されました。このタブでは、現在実行中のコルーチンとサスペンドされたコルーチンの両方の情報を見ることができます。コルーチンは、実行されているディスパッチャ（dispatcher）ごとにグループ化されています。

![コルーチンのデバッグ](coroutine-debugger-wn.png)

以下のことが可能になりました：
* 各コルーチンの状態を簡単に確認。
* 実行中およびサスペンドされたコルーチンの両方について、ローカル変数およびキャプチャされた変数の値を確認。
* 完全なコルーチン作成スタックと、コルーチン内のコールスタックを確認。スタックには変数値を含むすべてのフレームが含まれており、標準的なデバッグでは失われてしまうようなフレームも含まれます。

各コルーチンの状態とスタックを含む完全なレポートが必要な場合は、**Coroutines** タブ内を右クリックして、**Get Coroutines Dump** をクリックします。現在のコルーチンデンプはかなりシンプルですが、今後の Kotlin バージョンでより読みやすく、役立つものにする予定です。

![コルーチンデンプ](coroutines-dump-wn.png)

コルーチンのデバッグの詳細については、[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) および [IntelliJ IDEA ドキュメント](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html) を参照してください。

## 新しいコンパイラ

新しい Kotlin コンパイラは非常に高速になる予定です。サポートされているすべてのプラットフォームを統合し、コンパイラ拡張のための API を提供します。これは長期的なプロジェクトであり、Kotlin 1.4.0 ですでにいくつかのステップを完了しました：

* [新しく、より強力な型推論アルゴリズム](#new-more-powerful-type-inference-algorithm) がデフォルトで有効になりました。
* [新しい JVM および JS IR バックエンド](#unified-backends-and-extensibility)。安定化次第、デフォルトになる予定です。

### 新しく、より強力な型推論アルゴリズム

Kotlin 1.4 では、新しく、より強力な型推論アルゴリズムが使用されています。この新しいアルゴリズムは、Kotlin 1.3 でもコンパイラオプションを指定することで試用可能でしたが、今回からデフォルトで使用されます。新しいアルゴリズムで修正された問題の完全なリストは [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) で確認できます。ここでは、最も顕著な改善点のいくつかを紹介します：

* [型が自動的に推論されるケースの増加](#more-cases-where-type-is-inferred-automatically)
* [ラムダの最後の式に対するスマートキャスト](#smart-casts-for-a-lambda-s-last-expression)
* [呼び出し可能参照に対するスマートキャスト](#smart-casts-for-callable-references)
* [委譲プロパティの推論の改善](#better-inference-for-delegated-properties)
* [異なる引数を持つ Java インターフェースの SAM 変換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin における Java SAM インターフェース](#java-sam-interfaces-in-kotlin)

#### 型が自動的に推論されるケースの増加

新しい推論アルゴリズムは、古いアルゴリズムでは明示的な指定が必要だった多くのケースで型を推論します。例えば、次の例では、ラムダパラメータ `it` の型が正しく `String?` と推論されます：

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

Kotlin 1.3 では、これを動作させるために明示的なラムダパラメータを導入するか、`to` を明示的なジェネリック引数を持つ `Pair` コンストラクタに置き換える必要がありました。

#### ラムダの最後の式に対するスマートキャスト

Kotlin 1.3 では、期待される型を指定しない限り、ラムダ内の最後の式はスマートキャストされませんでした。したがって、次の例では、Kotlin 1.3 は `result` 変数の型を `String?` と推論します：

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlin コンパイラは、ここで str が null でないことを知っています
}
// 'result' の型は Kotlin 1.3 では String? ですが、Kotlin 1.4 では String です
```

Kotlin 1.4 では、新しい推論アルゴリズムのおかげで、ラムダ内の最後の式がスマートキャストされ、この新しいより正確な型が結果のラムダ型の推論に使用されます。したがって、`result` 変数の型は `String` になります。

Kotlin 1.3 では、このようなケースを動作させるために明示的なキャスト（`!!` または `as String` のような型キャスト）を追加する必要があることが多かったのですが、今後はこれらのキャストは不要になります。

#### 呼び出し可能参照に対するスマートキャスト

Kotlin 1.3 では、スマートキャストされた型のメンバー参照にアクセスすることはできませんでした。Kotlin 1.4 では可能になります：

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

animal 変数が特定の型 `Cat` および `Dog` にスマートキャストされた後、異なるメンバー参照 `animal::meow` および `animal::woof` を使用できます。型チェックの後、サブタイプに対応するメンバー参照にアクセスできます。

#### 委譲プロパティの推論の改善

委譲プロパティの型は、`by` キーワードの後に続く委譲式の分析中には考慮されていませんでした。例えば、以前は次のコードはコンパイルされませんでしたが、コンパイラは `old` および `new` パラメータの型を正しく `String?` と推論するようになりました：

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### 異なる引数を持つ Java インターフェースの SAM 変換

Kotlin は最初から Java インターフェースの SAM 変換をサポートしていましたが、サポートされていないケースが 1 つあり、既存の Java ライブラリを扱う際に不便なことがありました。2 つの SAM インターフェースをパラメータとして受け取る Java メソッドを呼び出した場合、両方の引数がラムダであるか、あるいは両方が通常のオブジェクトである必要がありました。一方の引数をラムダとして、もう一方をオブジェクトとして渡すことはできませんでした。

新しいアルゴリズムはこの問題を修正しており、どのような場合でも SAM インターフェースの代わりにラムダを渡すことができます。これは自然に期待される動作です。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Kotlin 1.4 で動作します
}
```

#### Kotlin における Java SAM インターフェース

Kotlin 1.4 では、Kotlin 内で Java SAM インターフェースを使用し、それに対して SAM 変換を適用できます。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

Kotlin 1.3 では、SAM 変換を実行するためには、上記の関数 `foo` を Java コードで宣言する必要がありました。

### 統合されたバックエンドと拡張性

Kotlin には、実行ファイルを生成する 3 つのバックエンドがあります：Kotlin/JVM、Kotlin/JS、および Kotlin/Native。Kotlin/JVM と Kotlin/JS は、それぞれ独立して開発されたため、多くのコードを共有していません。Kotlin/Native は、Kotlin コードの中間表現（IR）を中心に構築された新しいインフラストラクチャに基づいています。

現在、Kotlin/JVM と Kotlin/JS を同じ IR に移行しています。その結果、3 つのバックエンドすべてが多くのロジックを共有し、統合されたパイプラインを持つようになります。これにより、ほとんどの機能、最適化、バグ修正をすべてのプラットフォームに対して 1 回実装するだけで済むようになります。新しい IR ベースのバックエンドは両方とも [Alpha](components-stability.md) の段階です。

共通のバックエンドインフラストラクチャは、マルチプラットフォームコンパイラ拡張への道も開きます。パイプラインにプラグインして、すべてのプラットフォームで自動的に動作するカスタム処理や変換を追加できるようになります。

現在 Alpha 段階にある新しい [JVM IR](#new-jvm-ir-backend) および [JS IR](#new-js-ir-backend) バックエンドを使用し、フィードバックをお寄せいただくことをお勧めします。

## Kotlin/JVM

Kotlin 1.4.0 には、以下のような多くの JVM 固有の改善が含まれています：

* [新しい JVM IR バックエンド](#new-jvm-ir-backend)
* [インターフェースでのデフォルトメソッド生成のための新しいモード](#new-modes-for-generating-default-methods)
* [null チェックのための統合された例外タイプ](#unified-exception-type-for-null-checks)
* [JVM バイトコードにおける型アノテーション](#type-annotations-in-the-jvm-bytecode)

### 新しい JVM IR バックエンド

Kotlin/JS と同様に、Kotlin/JVM も [統合 IR バックエンド](#unified-backends-and-extensibility) に移行しています。これにより、ほとんどの機能とバグ修正をすべてのプラットフォームに対して一度に実装できるようになります。また、すべてのプラットフォームで動作するマルチプラットフォーム拡張を作成することで、この恩恵を受けることもできるようになります。

Kotlin 1.4.0 では、このような拡張のための公開 API はまだ提供されていませんが、新しいバックエンドを使用してコンパイラプラグインをすでに構築している [Jetpack Compose](https://developer.android.com/jetpack/compose) を含むパートナーと緊密に協力しています。

現在 Alpha 段階にある新しい Kotlin/JVM バックエンドを試して、問題や機能リクエストを [issue トラッカー](https://youtrack.jetbrains.com/issues/KT) に報告することをお勧めします。これにより、コンパイラパイプラインを統合し、Jetpack Compose のようなコンパイラ拡張をより迅速に Kotlin コミュニティに提供できるようになります。

新しい JVM IR バックエンドを有効にするには、Gradle ビルドスクリプトで追加のコンパイラオプションを指定します：

```kotlin
kotlinOptions.useIR = true
```

> [Jetpack Compose を有効にする](https://developer.android.com/jetpack/compose/setup?hl=en) と、`kotlinOptions` でコンパイラオプションを指定しなくても、自動的に新しい JVM バックエンドが選択されます。
>
{style="note"}

コマンドラインコンパイラを使用する場合は、コンパイラオプション `-Xuse-ir` を追加します。

> 新しい JVM IR バックエンドでコンパイルされたコードは、新しいバックエンドを有効にしている場合にのみ使用できます。そうでない場合はエラーが発生します。
> これを考慮すると、ライブラリ作者がプロダクション環境で新しいバックエンドに切り替えることはお勧めしません。
>
{style="note"}

### デフォルトメソッド生成の新しいモード

Kotlin コードをターゲット JVM 1.8 以上にコンパイルする場合、Kotlin インターフェースの非抽象メソッドを Java の `default` メソッドにコンパイルできます。この目的のために、そのようなメソッドをマークするための `@JvmDefault` アノテーションと、このアノテーションの処理を有効にする `-Xjvm-default` コンパイラオプションを含むメカニズムがありました。

1.4.0 では、デフォルトメソッドを生成するための新しいモードを追加しました。`-Xjvm-default=all` は、Kotlin インターフェースの *すべての* 非抽象メソッドを `default` Java メソッドにコンパイルします。`default` なしでコンパイルされたインターフェースを使用するコードとの互換性のために、`all-compatibility` モードも追加しました。

Java インターフェース相互運用におけるデフォルトメソッドの詳細については、[相互運用ドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces) および [このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) を参照してください。

### null チェックのための統合された例外タイプ

Kotlin 1.4.0 から、すべてのランタイム null チェックは、`KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException`、および `TypeCastException` の代わりに `java.lang.NullPointerException` をスローするようになります。これは、`!!` 演算子、メソッド前文でのパラメータ null チェック、プラットフォーム型の式の null チェック、および非 null 型を伴う `as` 演算子に適用されます。
`lateinit` の null チェックや、`checkNotNull` や `requireNotNull` のような明示的なライブラリ関数の呼び出しには適用されません。

この変更により、Kotlin コンパイラまたは Android の [R8 オプティマイザ](https://developer.android.com/studio/build/shrink-code) などのさまざまなバイトコード処理ツールによって実行可能な null チェック最適化の数が増えます。

開発者の観点からは、状況はそれほど変わりません。Kotlin コードは以前と同じエラーメッセージを伴う例外をスローします。例外の型は変わりますが、渡される情報は同じままです。

### JVM バイトコードにおける型アノテーション

Kotlin は JVM バイトコード（ターゲットバージョン 1.8+）で型アノテーションを生成できるようになり、実行時に Java リフレクションで利用できるようになりました。
バイトコードで型アノテーションを出力するには、次の手順に従います：

1. 宣言したアノテーションが適切なアノテーションターゲット（Java の `ElementType.TYPE_USE` または Kotlin の `AnnotationTarget.TYPE`）とリテンション（`AnnotationRetention.RUNTIME`）を持っていることを確認してください。
2. アノテーションクラスの宣言を JVM バイトコードターゲットバージョン 1.8+ でコンパイルします。`-jvm-target=1.8` コンパイラオプションで指定できます。
3. アノテーションを使用するコードを JVM バイトコードターゲットバージョン 1.8+ (`-jvm-target=1.8`) でコンパイルし、`-Xemit-jvm-type-annotations` コンパイラオプションを追加します。

標準ライブラリはターゲットバージョン 1.6 でコンパイルされているため、標準ライブラリの型アノテーションは今のところバイトコードに出力されません。

これまでのところ、基本的なケースのみがサポートされています：

- メソッドパラメータ、メソッドの戻り値の型、プロパティの型に対する型アノテーション。
- 型引数の不変（invariant）投影（例：`Smth<@Ann Foo>`, `Array<@Ann Foo>`）。

次の例では、`String` 型の `@Foo` アノテーションをバイトコードに出力し、ライブラリコードで使用することができます：

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JS プラットフォームにおいて、Kotlin 1.4.0 は以下の改善を提供します：

- [新しい Gradle DSL](#new-gradle-dsl)
- [新しい JS IR バックエンド](#new-js-ir-backend)

### 新しい Gradle DSL

`kotlin.js` Gradle プラグインには調整された Gradle DSL が付属しており、多くの新しい構成オプションを提供し、`kotlin-multiplatform` プラグインで使用される DSL とより密接に整合しています。主な変更点は以下の通りです：

- `binaries.executable()` を介した実行可能ファイルの作成の明示的な切り替え。[Kotlin/JS の実行とその環境の詳細についてはこちら](js-project-setup.md#execution-environments)。
- `cssSupport` を介した Gradle 構成内からの webpack の CSS およびスタイルローダーの構成。[CSS およびスタイルローダーの使用についてはこちら](js-project-setup.md#css)。
- npm 依存関係の管理の改善。必須のバージョン番号または [semver](https://docs.npmjs.com/about-semantic-versioning) バージョン範囲、および `devNpm`、`optionalNpm`、`peerNpm` を使用した *development*、*peer*、*optional* な npm 依存関係のサポート。[Gradle から直接 npm パッケージの依存関係を管理する方法についてはこちら](js-project-setup.md#npm-dependencies)。
- Kotlin 外部宣言のジェネレータである [Dukat](https://github.com/Kotlin/dukat) との連携強化。外部宣言をビルド時に生成したり、Gradle タスクを介して手動で生成したりできるようになりました。

### 新しい JS IR バックエンド

[Kotlin/JS 用の IR バックエンド](js-ir-compiler.md)（現在は [Alpha](components-stability.md) の安定性）は、デッドコード削除（DCE）による生成コードサイズの削減や、JavaScript および TypeScript との相互運用の改善などに焦点を当てた、Kotlin/JS ターゲット固有の新しい機能を提供します。

Kotlin/JS IR バックエンドを有効にするには、`gradle.properties` でキー `kotlin.js.compiler=ir` を設定するか、Gradle ビルドスクリプトの `js` 関数に `IR` コンパイラタイプを渡します：

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // または: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

新しいバックエンドの構成方法に関する詳細については、[Kotlin/JS IR コンパイラのドキュメント](js-ir-compiler.md) を確認してください。

新しい [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) アノテーションと **[Kotlin コードから TypeScript 定義を生成する機能](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)** により、Kotlin/JS IR コンパイラバックエンドは JavaScript および TypeScript との相互運用性を向上させます。これにより、Kotlin/JS コードを既存のツールと統合したり、**ハイブリッドアプリケーション** を作成したり、マルチプラットフォームプロジェクトでのコード共有機能を活用したりすることが容易になります。

[Kotlin/JS IR コンパイラバックエンドで使用可能な機能の詳細はこちら](js-ir-compiler.md)。

## Kotlin/Native

1.4.0 では、Kotlin/Native に以下を含む非常に多くの新機能と改善が追加されました：

* [Swift および Objective-C でのサスペンド関数のサポート](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [Objective-C ジェネリクスをデフォルトでサポート](#objective-c-generics-support-by-default)
* [Objective-C/Swift 相互運用における例外処理](#exception-handling-in-objective-c-swift-interop)
* [Apple ターゲットでリリースの .dSYM をデフォルトで生成](#generate-release-dsyms-on-apple-targets-by-default)
* [パフォーマンスの向上](#performance-improvements)
* [CocoaPods 依存関係の管理の簡素化](#simplified-management-of-cocoapods-dependencies)

### Swift および Objective-C での Kotlin のサスペンド関数のサポート

1.4.0 では、Swift および Objective-C におけるサスペンド関数の基本的なサポートを追加しました。Kotlin モジュールを Apple フレームワークにコンパイルすると、サスペンド関数はコールバック付きの関数（Swift/Objective-C の用語では `completionHandler`）として利用可能になります。生成されたフレームワークのヘッダーにそのような関数がある場合、Swift または Objective-C コードからそれらを呼び出したり、オーバーライドしたりすることもできます。

例えば、次のような Kotlin 関数を書いた場合：

```kotlin
suspend fun queryData(id: Int): String = ...
```

...これを Swift から次のように呼び出すことができます：

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[Swift および Objective-C でのサスペンド関数の使用についての詳細はこちら](native-objc-interop.md)。

### Objective-C ジェネリクスをデフォルトでサポート

以前のバージョンの Kotlin では、Objective-C 相互運用におけるジェネリクスの実験的サポートを提供していました。1.4.0 から、Kotlin/Native はデフォルトで Kotlin コードからジェネリクスを含む Apple フレームワークを生成します。場合によっては、これにより Kotlin フレームワークを呼び出す既存の Objective-C または Swift コードが壊れる可能性があります。ジェネリクスなしでフレームワークヘッダーを出力するには、`-Xno-objc-generics` コンパイラオプションを追加します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

[Objective-C との相互運用に関するドキュメント](native-objc-interop.md#generics) に記載されているすべての詳細と制限事項は依然として有効であることに注意してください。

### Objective-C/Swift 相互運用における例外処理

1.4.0 では、例外の変換方法に関して、Kotlin から生成される Swift API を若干変更しました。Kotlin と Swift ではエラー処理に根本的な違いがあります。すべての Kotlin の例外は非チェック（unchecked）ですが、Swift にはチェックされる（checked）エラーしかありません。したがって、Swift コードに期待される例外を認識させるには、Kotlin 関数に `@Throws` アノテーションを付け、潜在的な例外クラスのリストを指定する必要があります。

Swift または Objective-C フレームワークにコンパイルする場合、`@Throws` アノテーションを持つ、あるいは継承している関数は、Objective-C では `NSError*` を生成するメソッドとして、Swift では `throws` メソッドとして表現されます。

以前は、`RuntimeException` および `Error` 以外の例外は `NSError` として伝播されていました。今後はこの動作が変わります。`NSError` は、`@Throws` アノテーションのパラメータとして指定されたクラスのインスタンス（またはそのサブクラス）である例外に対してのみスローされます。Swift/Objective-C に到達した他の Kotlin 例外は未処理と見なされ、プログラムの終了を引き起こします。

### Apple ターゲットでリリースの .dSYM をデフォルトで生成

1.4.0 から、Kotlin/Native コンパイラはデフォルトで Darwin プラットフォーム上のリリースバイナリに対して [デバッグシンボルファイル](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)（`.dSYM`）を生成します。これは `-Xadd-light-debug=disable` コンパイラオプションで無効にできます。他のプラットフォームでは、このオプションはデフォルトで無効になっています。Gradle でこのオプションを切り替えるには、以下を使用します：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[クラッシュレポートのシンボル化についての詳細はこちら](native-debugging.md#debug-ios-applications)。

### パフォーマンスの向上

Kotlin/Native は、開発プロセスと実行の両方をスピードアップする多くのパフォーマンス向上を受けました。以下にいくつかの例を挙げます：

- オブジェクト割り当ての速度を向上させるために、システムアロケータの代替として [mimalloc](https://github.com/microsoft/mimalloc) メモリアロケータを提供します。mimalloc は一部のベンチマークで最大 2 倍高速に動作します。現在、Kotlin/Native での mimalloc の使用は実験的です。`-Xallocator=mimalloc` コンパイラオプションを使用して切り替えることができます。

- C 相互運用ライブラリのビルド方法を刷新しました。新しいツールにより、Kotlin/Native は以前の最大 4 倍の速さで相互運用ライブラリを生成し、成果物のサイズは以前の 25% から 30% になりました。

- GC の最適化により、全体的な実行パフォーマンスが向上しました。この改善は、存続期間の長いオブジェクトが多数存在するプロジェクトで特に顕著になります。`HashMap` および `HashSet` コレクションは、冗長なボクシングを回避することで高速に動作するようになりました。

- 1.3.70 では、Kotlin/Native コンパイルのパフォーマンスを向上させるための 2 つの新機能（[プロジェクト依存関係のキャッシュと Gradle デーモンからのコンパイラの実行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)）を導入しました。それ以来、数多くの問題を修正し、これらの機能の全体的な安定性を向上させてきました。

### CocoaPods 依存関係の管理の簡素化

以前は、プロジェクトを依存関係マネージャー CocoaPods と統合すると、プロジェクトの iOS、macOS、watchOS、または tvOS 部分を Xcode でのみビルドでき、マルチプラットフォームプロジェクトの他の部分とは切り離されていました。他の部分は IntelliJ IDEA でビルドできました。

さらに、CocoaPods に保存されている Objective-C ライブラリ（Pod ライブラリ）への依存関係を追加するたびに、IntelliJ IDEA から Xcode に切り替えて `pod install` を呼び出し、そこで Xcode ビルドを実行する必要がありました。

今後は、コードのハイライトや補完などのメリットを享受しながら、IntelliJ IDEA で直接 Pod 依存関係を管理できます。また、Xcode に切り替えることなく、Gradle で Kotlin プロジェクト全体をビルドできます。つまり、Swift/Objective-C コードを書く必要があるときや、シミュレーターやデバイスでアプリケーションを実行するときだけ Xcode に行けばよくなります。

ローカルに保存されている Pod ライブラリも扱えるようになりました。

ニーズに応じて、以下の間に依存関係を追加できます：
* Kotlin プロジェクトと、CocoaPods リポジトリにリモートで保存されている Pod ライブラリ、またはマシンにローカルで保存されている Pod ライブラリ。
* Kotlin Pod（CocoaPods 依存関係として使用される Kotlin プロジェクト）と、1 つ以上のターゲットを持つ Xcode プロジェクト。

初期設定を完了し、`cocoapods` に新しい依存関係を追加したら、IntelliJ IDEA でプロジェクトを再インポートするだけです。新しい依存関係は自動的に追加されます。追加の手順は不要です。

[依存関係の追加方法はこちら](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)。

## Kotlin マルチプラットフォーム

> マルチプラットフォームプロジェクトのサポートは [Alpha](components-stability.md) 段階です。将来的に互換性のない変更が行われ、手動での移行が必要になる可能性があります。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT) でのフィードバックをお待ちしております。
>
{style="warning"}

[Kotlin マルチプラットフォーム](https://kotlinlang.org/docs/multiplatform/get-started.html) は、ネイティブプログラミングの柔軟性と利点を維持しながら、[異なるプラットフォーム](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) に対して同じコードを記述し保守する時間を削減します。当社はマルチプラットフォームの機能と改善に引き続き注力しています：

* [階層的なプロジェクト構造による複数のターゲットでのコード共有](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [階層構造でのネイティブライブラリの活用](#leveraging-native-libs-in-the-hierarchical-structure)
* [kotlinx 依存関係の指定を 1 回に集約](#specifying-dependencies-only-once)

> マルチプラットフォームプロジェクトには Gradle 6.0 以降が必要です。
>
{style="note"}

### 階層的なプロジェクト構造による複数のターゲットでのコード共有

新しい階層的なプロジェクト構造のサポートにより、[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html) 内の [複数のプラットフォーム](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 間でコードを共有できます。

以前は、マルチプラットフォームプロジェクトに追加されたコードは、1 つのターゲットに限定され他のプラットフォームで再利用できないプラットフォーム固有のソースセットか、あるいはプロジェクト内のすべてのプラットフォームで共有される `commonMain` や `commonTest` のような共通ソースセットのいずれかに配置する必要がありました。共通ソースセットでは、[プラットフォーム固有の `actual` 実装を必要とする `expect` 宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) を使用することによってのみ、プラットフォーム固有の API を呼び出すことができました。

これにより [すべてのプラットフォームでコードを共有](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-all-platforms) することは簡単でしたが、[一部のターゲット間のみで共有](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) することはそれほど簡単ではありませんでした。特に、共通のロジックやサードパーティ API を大幅に再利用できる可能性のある似たターゲット間での共有が困難でした。

例えば、iOS をターゲットとする一般的なマルチプラットフォームプロジェクトには、iOS ARM64 デバイス用と x64 シミュレータ用の 2 つの iOS 関連ターゲットがあります。これらは別々のプラットフォーム固有のソースセットを持っていますが、実際にはデバイスとシミュレータで異なるコードが必要になることは稀であり、それらの依存関係も非常によく似ています。そのため、iOS 固有のコードはそれらの間で共有できるはずです。

明らかに、このセットアップでは、iOS デバイスとシミュレータの両方に共通の API を直接呼び出すことができる Kotlin/Native コードを含む、*2 つの iOS ターゲット用の共有ソースセット* を持つことが望ましいです。

![iOS ターゲット用に共有されたコード](iosmain-hierarchy.png){width=300}

これを [階層的なプロジェクト構造のサポート](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) で実現できるようになりました。これにより、どのターゲットがそれらを消費するかに基づいて、各ソースセットで利用可能な API と言語機能が推論および適応されます。

一般的なターゲットの組み合わせについては、ターゲットショートカットを使用して階層構造を作成できます。
例えば、`ios()` ショートカットを使用して、上記のような 2 つの iOS ターゲットと共有ソースセットを作成します：

```kotlin
kotlin {
    ios() // iOS デバイスとシミュレータターゲット。iosMain と iosTest ソースセット
}
```

他のターゲットの組み合わせについては、ソースセットを `dependsOn` 関係で接続することにより、[手動で階層を作成](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#manual-configuration) します。

![階層構造](manual-hierarchical-structure.svg)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</tab>
</tabs>

階層的なプロジェクト構造のおかげで、ライブラリはターゲットのサブセットに対して共通の API を提供することもできます。[ライブラリでのコード共有についての詳細はこちら](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries)。

### 階層構造でのネイティブライブラリの活用

複数のネイティブターゲット間で共有されるソースセットで、Foundation、UIKit、POSIX などのプラットフォーム依存のライブラリを使用できます。これにより、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有できるようになります。

追加の手順は不要です。すべてが自動的に行われます。IntelliJ IDEA は、共有コードで使用できる共通の宣言の検出を支援します。

[プラットフォーム依存ライブラリの使用についての詳細はこちら](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 依存関係の指定を 1 回に集約

今後は、同じライブラリの異なるバリアントへの依存関係を、使用される共有ソースセットとプラットフォーム固有のソースセットでそれぞれ指定する代わりに、共有ソースセットで 1 回だけ依存関係を指定するだけでよくなります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

`-common`、`-native` などのプラットフォームを指定するサフィックスが付いた kotlinx ライブラリのアーティファクト名は、もはやサポートされていないため、使用しないでください。代わりに、上記の例のようにライブラリのベースアーティファクト名（`kotlinx-coroutines-core`）を使用してください。

ただし、この変更は現在のところ以下には影響しません：
* `stdlib` ライブラリ – Kotlin 1.4.0 から、[stdlib 依存関係は自動的に追加されます](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test` ライブラリ – 引き続き `test-common` および `test-annotations-common` を使用する必要があります。これらの依存関係については後で対応される予定です。

特定のプラットフォーム専用の依存関係が必要な場合は、引き続き `-jvm` や `-js` などのサフィックスを持つ標準ライブラリや kotlinx ライブラリのプラットフォーム固有のバリアント（例：`kotlinx-coroutines-core-jvm`）を使用できます。

[依存関係の構成についての詳細はこちら](gradle-configure-project.md#configure-dependencies)。

## Gradle プロジェクトの改善

[Kotlin マルチプラットフォーム](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native)、[Kotlin/JS](#kotlin-js) に固有の Gradle プロジェクトの機能と改善以外にも、すべての Kotlin Gradle プロジェクトに適用されるいくつかの変更があります：

* [標準ライブラリへの依存関係がデフォルトで追加されるようになりました](#dependency-on-the-standard-library-added-by-default)
* [Kotlin プロジェクトには最近のバージョンの Gradle が必要です](#minimum-gradle-version-for-kotlin-projects)
* [IDE での Kotlin Gradle DSL のサポート強化](#improved-gradle-kts-support-in-the-ide)

### 標準ライブラリへの依存関係がデフォルトで追加されるようになりました

マルチプラットフォームプロジェクトを含む、いかなる Kotlin Gradle プロジェクトにおいても、`stdlib` ライブラリへの依存関係を宣言する必要がなくなりました。依存関係はデフォルトで追加されます。

自動的に追加される標準ライブラリは、Kotlin Gradle プラグインと同じバージョンになります。

プラットフォーム固有のソースセットには、対応するプラットフォーム固有のバリアントのライブラリが使用され、残りの部分には共通の標準ライブラリが追加されます。Kotlin Gradle プラグイン は、Gradle ビルドスクリプトの `kotlinOptions.jvmTarget` [コンパイラオプション](gradle-compiler-options.md) に応じて、適切な JVM 標準ライブラリを選択します。

[デフォルトの動作を変更する方法はこちら](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin プロジェクトの最小 Gradle バージョン

Kotlin プロジェクトで新機能を楽しむには、Gradle を [最新バージョン](https://gradle.org/releases/) にアップデートしてください。マルチプラットフォームプロジェクトには Gradle 6.0 以降が必要で、その他の Kotlin プロジェクトは Gradle 5.4 以降で動作します。

### IDE における *.gradle.kts サポートの向上

1.4.0 では、Gradle Kotlin DSL スクリプト（`*.gradle.kts` ファイル）の IDE サポートの改善を継続しました。新バージョンでの変更点は以下の通りです：

- パフォーマンス向上のための *スクリプト構成の明示的なロード*。以前は、ビルドスクリプトに加えた変更はバックグラウンドで自動的にロードされていました。パフォーマンスを向上させるため、1.4.0 ではビルドスクリプト構成の自動ロードを無効にしました。今後は、明示的に適用したときにのみ、IDE が変更をロードします。

  Gradle 6.0 より前のバージョンでは、エディタで **Load Configuration** をクリックしてスクリプト構成を手動でロードする必要があります。

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  Gradle 6.0 以降では、**Load Gradle Changes** をクリックするか、Gradle プロジェクトを再インポートすることで、変更を明示的に適用できます。

  IntelliJ IDEA 2020.1 と Gradle 6.0 以降の組み合わせで、もう 1 つのアクション **Load Script Configurations** を追加しました。これは、プロジェクト全体を更新することなく、スクリプト構成への変更のみをロードします。これは、プロジェクト全体を再インポートするよりもはるかに短時間で済みます。

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  新しく作成したスクリプトや、新しい Kotlin プラグインで初めてプロジェクトを開いたときにも、**Load Script Configurations** を実行する必要があります。

  Gradle 6.0 以降では、以前の実装（個別にロード）とは対照的に、すべてのスクリプトを一度にロードできるようになりました。各リクエストには Gradle 構成フェーズの実行が必要なため、大規模な Gradle プロジェクトではリソースを大量に消費する可能性がありました。

  現在、このような一括ロードは `build.gradle.kts` および `settings.gradle.kts` ファイルに制限されています（関連する [issue](https://github.com/gradle/gradle/issues/12640) に投票してください）。`init.gradle.kts` や適用された [スクリプトプラグイン](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins) のハイライトを有効にするには、以前のメカニズム（スタンドアロンスクリプトへの追加）を使用してください。それらのスクリプトの構成は、必要に応じて個別にロードされます。そのようなスクリプトに対して自動リロードを有効にすることも可能です。

  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)

- *エラーレポートの改善*。以前は、Gradle デーモンからのエラーは個別のログファイルでしか確認できませんでした。今後は、Gradle デーモンがエラーに関するすべての情報を直接返し、Build ツールウィンドウに表示します。これにより、時間と労力の両方を節約できます。

## 標準ライブラリ

1.4.0 における Kotlin 標準ライブラリの最も重要な変更点のリストは以下の通りです：

- [共通の例外処理 API](#common-exception-processing-api)
- [配列とコレクションの新関数](#new-functions-for-arrays-and-collections)
- [文字列操作のための関数](#functions-for-string-manipulations)
- [ビット操作](#bit-operations)
- [委譲プロパティの改善](#delegated-properties-improvements)
- [KType から Java の Type への変換](#converting-from-ktype-to-java-type)
- [Kotlin リフレクション用の Proguard 設定](#proguard-configurations-for-kotlin-reflection)
- [既存 API の改善](#improving-the-existing-api)
- [stdlib アーティファクトの module-info 記述子](#module-info-descriptors-for-stdlib-artifacts)
- [非推奨（Deprecations）](#deprecations)
- [非推奨となった実験的コルーチンの除外](#exclusion-of-the-deprecated-experimental-coroutines)

### 共通の例外処理 API

以下の API 要素が共通ライブラリ（common library）に移動されました：

* `Throwable.stackTraceToString()` 拡張関数：このスロー可能オブジェクトのスタックトレースを含む詳細な説明を返します。`Throwable.printStackTrace()` は、この説明を標準エラー出力にプリントします。
* `Throwable.addSuppressed()` 関数：例外を届けるために抑制された例外を指定できるようにします。`Throwable.suppressedExceptions` プロパティは、すべての抑制された例外のリストを返します。
* `@Throws` アノテーション：関数がプラットフォームメソッド（JVM または Native）にコンパイルされる際にチェックされる例外タイプをリストアップします。

### 配列とコレクションの新関数

#### コレクション

1.4.0 では、標準ライブラリに **コレクション** を扱うための便利な関数が多数含まれています：

* `setOfNotNull()`：指定された引数のうち、null でないすべての項目からなるセットを作成します。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* シーケンス用の `shuffled()`。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) // 100 未満のランダムな偶数 5 つ
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `onEach()` および `flatMap()` に対応する `*Indexed()`。
コレクション要素に適用する操作に、要素のインデックスをパラメータとして持たせることができます。

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }
    
       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList() 
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `*OrNull()` 系の `randomOrNull()`、`reduceOrNull()`、および `reduceIndexedOrNull()`。
これらは空のコレクションに対して `null` を返します。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         // empty.reduce { a, b -> a + b } // 例外: 空のコレクションは reduce できません。
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `runningFold()`、その同義語である `scan()`、および `runningReduce()`。これらは `fold()` や `reduce()` と同様に、与えられた操作をコレクション要素に順次適用しますが、これらの新関数は中間結果の全シーケンスを返すという点が異なります。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `sumOf()` はセレクター関数を受け取り、コレクションのすべての要素に対してその値の合計を返します。
`sumOf()` は、`Int`、`Long`、`Double`、`UInt`、および `ULong` 型の合計を生成できます。JVM では、`BigInteger` および `BigDecimal` も利用可能です。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count } // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `min()` および `max()` 関数は、Kotlin コレクション API 全体で使用されている命名規則に従うため、`minOrNull()` および `maxOrNull()` に名前が変更されました。関数名の `*OrNull` サフィックスは、レシーバーコレクションが空の場合に `null` を返すことを意味します。同じことが `minBy()`、`maxBy()`、`minWith()`、`maxWith()` にも当てはまり、1.4 では `*OrNull()` という同義語が用意されています。
* 新しい `minOf()` および `maxOf()` 拡張関数は、コレクション項目に対して与えられたセレクター関数の最小値と最大値を返します。

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    `Comparator` を引数に取る `minOfWith()` および `maxOfWith()`、そして空のコレクションに対して `null` を返すこれら 4 つすべての `*OrNull()` バージョンも用意されています。

* `flatMap` および `flatMapTo` の新しいオーバーロードにより、レシーバー型と一致しない戻り値の型を持つ変換を使用できるようになりました：
    * `Iterable`、`Array`、および `Map` 上での `Sequence` への変換
    * `Sequence` 上での `Iterable` への変換

    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* ミュータブルリストから要素を削除するためのショートカットとしての `removeFirst()` および `removeLast()`、およびそれらの `*orNull()` 版。

#### 配列

異なるコンテナ型を扱う際の一貫した体験を提供するため、**配列** 用の新関数も追加しました：

* `shuffle()`：配列要素をランダムな順序に並べ替えます。
* `onEach()`：各配列要素に対して指定されたアクションを実行し、配列自体を返します。
* `associateWith()` および `associateWithTo()`：配列要素をキーとするマップを構築します。
* 配列の部分範囲に対する `reverse()`：部分範囲内の要素の順序を反転させます。
* 配列の部分範囲に対する `sortDescending()`：部分範囲内の要素を降順にソートします。
* 配列の部分範囲に対する `sort()` および `sortWith()` が共通ライブラリで利用可能になりました。

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

さらに、`CharArray`/`ByteArray` と `String` の間の変換のための新しい関数があります：
* `ByteArray.decodeToString()` および `String.encodeToByteArray()`
* `CharArray.concatToString()` および `String.toCharArray()`

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### ArrayDeque

また、両端キューの実装である `ArrayDeque` クラスを追加しました。
両端キューを使用すると、キューの先頭または末尾の両方で要素を追加または削除することが、償却定数時間で可能になります。コード内でキュー（queue）やスタック（stack）が必要な場合に、デフォルトで両端キューを使用できます。

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

`ArrayDeque` の実装は、内部でサイズ変更可能な配列を使用しています。循環バッファである `Array` に内容を保存し、その `Array` がいっぱいになった場合にのみサイズを変更します。

### 文字列操作のための関数

1.4.0 の標準ライブラリには、文字列操作用の API に関する多くの改善が含まれています：

* `StringBuilder` に便利な新しい拡張関数が追加されました：`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()` など。

    ```kotlin
        fun main() {
        //sampleStart
            val sb = StringBuilder("Bye Kotlin 1.3.72")
            sb.deleteRange(0, 3)
            sb.insertRange(0, "Hello", 0 ,5)
            sb.set(15, '4')
            sb.setRange(17, 19, "0")
            print(sb.toString())
        //sampleEnd
        }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `StringBuilder` の既存の関数のいくつかが共通ライブラリで利用可能になりました。その中には `append()`、`insert()`、`substring()`、`setLength()` などがあります。
* 新しい関数 `Appendable.appendLine()` および `StringBuilder.appendLine()` が共通ライブラリに追加されました。これらは、これらのクラスの JVM 専用の `appendln()` 関数を置き換えるものです。

    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### ビット操作

ビット操作用の新しい関数：
* `countOneBits()` 
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()` 
* `rotateLeft()` および `rotateRight()` (実験的)

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 委譲プロパティの改善

1.4.0 では、Kotlin における委譲プロパティの体験を向上させるための新機能を追加しました：
- プロパティを別のプロパティに委譲できるようになりました。
- 新しいインターフェース `PropertyDelegateProvider` は、単一の宣言で委譲プロバイダーを作成するのに役立ちます。
- `ReadWriteProperty` が `ReadOnlyProperty` を継承するようになったため、読み取り専用プロパティに対して両方を使用できます。

新しい API 以外にも、結果として得られるバイトコードのサイズを削減するいくつかの最適化を行いました。これらの最適化については、[このブログ記事](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties) で詳しく説明されています。

[委譲プロパティの詳細についてはこちら](delegated-properties.md)。

### KType から Java の Type への変換

stdlib の新しい拡張プロパティ `KType.javaType`（現在は実験的）を使用すると、`kotlin-reflect` 依存関係をすべて使用することなく、Kotlin の型から `java.lang.reflect.Type` を取得できます。

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String
  
   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Kotlin リフレクション用の Proguard 設定

1.4.0 から、Kotlin Reflection 用の Proguard/R8 設定を `kotlin-reflect.jar` に埋め込みました。これにより、R8 または Proguard を使用するほとんどの Android プロジェクトは、追加の構成なしで kotlin-reflect で動作するはずです。kotlin-reflect 内部用の Proguard ルールをコピー＆ペーストする必要はもうありません。ただし、リフレクションの対象となるすべての API は引き続き明示的にリストアップする必要があることに注意してください。

### 既存 API の改善

* いくつかの関数が null レシーバーで動作するようになりました。例：
    * 文字列の `toBoolean()`
    * 配列の `contentEquals()`、`contentHashcode()`、`contentToString()`

* `Double` および `Float` の `NaN`、`NEGATIVE_INFINITY`、および `POSITIVE_INFINITY` が `const` として定義されたため、アノテーション引数として使用できるようになりました。

* `Double` および `Float` の新しい定数 `SIZE_BITS` および `SIZE_BYTES` には、バイナリ形式で型のインスタンスを表現するために使用されるビット数とバイト数が含まれています。

* `maxOf()` および `minOf()` トップレベル関数が、可変長引数（`vararg`）を受け取れるようになりました。

### stdlib アーティファクトの module-info 記述子

Kotlin 1.4.0 は、デフォルトの標準ライブラリのアーティファクトに `module-info.java` モジュール情報を追加します。これにより、アプリに必要なプラットフォームモジュールのみを含むカスタム Java ランタイムイメージを生成する [jlink ツール](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) でそれらを使用できるようになります。
以前から Kotlin 標準ライブラリのアーティファクトで jlink を使用できましたが、そのためには "modular" 分類子を持つ別のアーティファクトを使用する必要があり、セットアップ全体が簡単ではありませんでした。
Android では、module-info を持つ jar ファイルを正しく処理できる Android Gradle プラグイン バージョン 3.2 以降を使用していることを確認してください。

### 非推奨（Deprecations）

#### Double および Float の toShort() と toByte()

値の範囲が狭く、変数のサイズが小さいため、予期しない結果につながる可能性があるため、`Double` および `Float` の `toShort()` および `toByte()` 関数を非推奨にしました。

浮動小数点数を `Byte` または `Short` に変換するには、2 段階の変換を使用してください：まず `Int` に変換し、次にターゲットの型に再度変換します。

#### 浮動小数点配列に対する contains()、indexOf()、および lastIndexOf()

`FloatArray` および `DoubleArray` の `contains()`、`indexOf()`、および `lastIndexOf()` 拡張関数は、[IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 標準の等価性を使用しており、一部の境界ケースで全順序の等価性と矛盾するため、非推奨にしました。詳細は [こちらの issue](https://youtrack.jetbrains.com/issue/KT-28753) を参照してください。

#### min() および max() コレクション関数

空のコレクションに対して `null` を返すという動作をより適切に反映させるため、`min()` および `max()` コレクション関数を非推奨にし、`minOrNull()` および `maxOrNull()` に置き換えました。
詳細は [こちらの issue](https://youtrack.jetbrains.com/issue/KT-38854) を参照してください。

### 非推奨となった実験的コルーチンの除外

`kotlin.coroutines.experimental` API は、1.3.0 で kotlin.coroutines を支持して非推奨になりました。1.4.0 では、標準ライブラリから削除することで `kotlin.coroutines.experimental` の非推奨サイクルを完了します。引き続き JVM でこれを使用する方のために、すべての実験的コルーチン API を含む互換性アーティファクト `kotlin-coroutines-experimental-compat.jar` を提供しています。これは Maven に公開されており、標準ライブラリと共に Kotlin 配布物に含まれています。

## 安定した JSON シリアル化

Kotlin 1.4.0 と共に、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) の最初の安定バージョンである 1.0.0-RC を出荷します。今回、`kotlinx-serialization-core`（以前は `kotlinx-serialization-runtime` と呼ばれていました）の JSON シリアル化 API が安定したことを宣言します。他のシリアル化形式用のライブラリは、コアライブラリの高度な部分と同様に、引き続き実験的なままです。

JSON シリアル化用の API を大幅に刷新し、より一貫性があり使いやすいものにしました。今後は、JSON シリアル化 API の開発を後方互換性を保った形で継続します。
ただし、以前のバージョンを使用していた場合は、1.0.0-RC に移行する際にコードの一部を書き重なる必要があります。
移行を支援するために、`kotlinx.serialization` の完全なドキュメントセットである **[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** も提供しています。これは、最も重要な機能を使用するプロセスを案内し、直面する可能性のある問題への対処を助けます。

>**注意**: `kotlinx-serialization` 1.0.0-RC は Kotlin コンパイラ 1.4 でのみ動作します。それ以前のコンパイラバージョンとは互換性がありません。
>
{style="note"}

## スクリプティングと REPL

1.4.0 では、Kotlin でのスクリプティングにおいて、他のアップデートと共に、多くの機能的およびパフォーマンス上の改善の恩恵を受けることができます。主な変更点は以下の通りです：

- [新しい依存関係解決 API](#new-dependencies-resolution-api)
- [新しい REPL API](#new-repl-api)
- [コンパイル済みスクリプトのキャッシュ](#compiled-scripts-cache)
- [アーティファクトの名称変更](#artifacts-renaming)

Kotlin でのスクリプティングをよりよく知っていただくために、[サンプルのプロジェクト](https://github.com/Kotlin/kotlin-script-examples) を用意しました。これには、標準スクリプト（`*.main.kts`）の例や、Kotlin Scripting API およびカスタムスクリプト定義の使用例が含まれています。ぜひ試してみて、[issue トラッカー](https://youtrack.jetbrains.com/issues/KT) を通じてフィードバックをお寄せください。

### 新しい依存関係解決 API

1.4.0 では、外部依存関係（Maven アーティファクトなど）を解決するための新しい API と、その実装を導入しました。この API は、新しいアーティファクトである `kotlin-scripting-dependencies` および `kotlin-scripting-dependencies-maven` で公開されています。`kotlin-script-util` ライブラリの以前の依存関係解決機能は、現在非推奨となっています。

### 新しい REPL API

新しい実験的な REPL API が Kotlin Scripting API の一部になりました。公開されたアーティファクトにはいくつかの実装もあり、コード補完などの高度な機能を持つものもあります。この API は [Kotlin Jupyter カーネル](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) で使用されており、独自のカスタムシェルや REPL で試すことができます。

### コンパイル済みスクリプトのキャッシュ

Kotlin Scripting API は、コンパイル済みスクリプトのキャッシュを実装する機能を提供するようになり、変更されていないスクリプトのその後の実行を大幅に高速化できるようになりました。デフォルトの高度なスクリプト実装である `kotlin-main-kts` には、すでに独自のキャッシュがあります。

### アーティファクトの名称変更

アーティファクト名に関する混乱を避けるため、`kotlin-scripting-jsr223-embeddable` および `kotlin-scripting-jvm-host-embeddable` を単に `kotlin-scripting-jsr223` および `kotlin-scripting-jvm-host` に変更しました。これらのアーティファクトは `kotlin-compiler-embeddable` アーティファクトに依存しており、使用上の競合を避けるためにバンドルされたサードパーティライブラリをシェーディング（遮蔽）しています。この改名により、（一般的に安全な）`kotlin-compiler-embeddable` の使用をスクリプティングアーティファクトのデフォルトにします。
何らかの理由で、シェーディングされていない `kotlin-compiler` に依存するアーティファクトが必要な場合は、`kotlin-scripting-jsr223-unshaded` のように `-unshaded` サフィックスが付いたアーティファクトバージョンを使用してください。この改名は、直接使用されることが想定されているスクリプティングアーティファクトにのみ影響し、他のアーティファクトの名前は変わりません。

## Kotlin 1.4.0 への移行

Kotlin プラグインの移行ツールは、プロジェクトを以前のバージョンの Kotlin から 1.4.0 に移行するのを助けます。

Kotlin のバージョンを `1.4.0` に変更し、Gradle または Maven プロジェクトを再インポートするだけです。IDE が移行について尋ねてきます。

同意すると、コードをチェックし、1.4.0 で動作しないものや推奨されないものに対して修正を提案する移行用コード検査が実行されます。

![移行の実行](run-migration-wn.png){width=300}

コード検査には異なる [深刻度レベル](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html) があり、どの提案を受け入れ、どれを無視するかを決定するのに役立ちます。

![移行の検査](migration-inspection-wn.png)

Kotlin 1.4.0 は機能リリースであるため、言語に互換性のない変更をもたらす可能性があります。そのような変更の詳細なリストは、**[Kotlin 1.4 互換性ガイド](compatibility-guide-14.md)** で確認できます。