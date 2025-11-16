[//]: # (title: Kotlin 1.4.0 の新機能)

_[公開日: 2020年8月17日](releases.md#release-details)_

Kotlin 1.4.0 では、すべてのコンポーネントにおいて多数の改善が施されており、[品質とパフォーマンスに焦点が当てられています](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
以下に、Kotlin 1.4.0 における最も重要な変更点のリストを示します。

## 言語機能と改善

Kotlin 1.4.0 には、さまざまな言語機能と改善が導入されています。これらには以下が含まれます。

*   [Kotlin インターフェースの SAM 変換](#sam-conversions-for-kotlin-interfaces)
*   [ライブラリ作者向け明示的 API モード](#explicit-api-mode-for-library-authors)
*   [名前付き引数と位置指定引数の混在](#mixing-named-and-positional-arguments)
*   [末尾のコンマ](#trailing-comma)
*   [呼び出し可能参照の改善](#callable-reference-improvements)
*   [ループ内の `when` 式での `break` と `continue` の使用](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin インターフェースの SAM 変換

Kotlin 1.4.0 より前は、SAM (Single Abstract Method) 変換は[Kotlin から Java のメソッドと Java インターフェースを操作する場合にのみ](java-interop.md#sam-conversions)適用できました。これからは、Kotlin インターフェースに対しても SAM 変換を使用できます。
これを行うには、Kotlin インターフェースを `fun` 修飾子で関数型として明示的にマークします。

SAM 変換は、単一の抽象メソッドを持つインターフェースがパラメーターとして期待される場合に、ラムダを引数として渡すと適用されます。この場合、コンパイラはラムダを抽象メンバー関数を実装するクラスのインスタンスに自動的に変換します。

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

[Kotlin の関数型インターフェースと SAM 変換の詳細についてはこちら](fun-interfaces.md)をご覧ください。

### ライブラリ作者向け明示的 API モード

Kotlin コンパイラは、ライブラリ作者向けに _明示的 API モード_ を提供します。このモードでは、コンパイラが追加のチェックを実行し、ライブラリの API をより明確で一貫性のあるものにするのに役立ちます。これにより、ライブラリのパブリック API に公開される宣言に以下の要件が追加されます。

*   デフォルトの可視性によってパブリック API に公開される場合、宣言には可視性修飾子が必要です。
    これにより、意図せずパブリック API に宣言が公開されることを防ぎます。
*   パブリック API に公開されるプロパティと関数には、明示的な型指定が必要です。
    これにより、API ユーザーが使用する API メンバーの型を確実に認識できるようになります。

設定に応じて、これらの明示的な API はエラー（_strict_ モード）または警告（_warning_ モード）を生成する可能性があります。
可読性と常識のために、特定の種類の宣言はこのようなチェックから除外されます。

*   プライマリコンストラクタ
*   データクラスのプロパティ
*   プロパティのゲッターとセッター
*   `override` メソッド

明示的 API モードは、モジュールのプロダクションソースのみを分析します。

モジュールを明示的 API モードでコンパイルするには、以下の行を Gradle ビルドスクリプトに追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</tab>
</tabs>

コマンドラインコンパイラを使用する場合、`-Xexplicit-api` コンパイラオプションに `strict` または `warning` の値を指定して明示的 API モードに切り替えます。

```bash
-Xexplicit-api={strict|warning}
```

[KEEP で明示的 API モードの詳細を確認してください](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 名前付き引数と位置指定引数の混在

Kotlin 1.3 では、[名前付き引数](functions.md#named-arguments)で関数を呼び出す際、名前なしの引数 (位置指定引数) を最初の名前付き引数の前にすべて配置する必要がありました。例えば、`f(1, y = 2)` は呼び出せましたが、`f(x = 1, 2)` は呼び出せませんでした。

すべての引数が正しい位置にあるのに、途中の引数に名前を指定したい場合に、これは非常に煩わしいことでした。特に、ブール値や `null` 値がどの属性に属するかを明確にするのに役立ちました。

Kotlin 1.4 では、このような制限はありません。位置指定引数セットの途中で引数に名前を指定できるようになりました。さらに、位置指定引数と名前付き引数を、正しい順序を保つ限り、好きなように混在させることができます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 末尾のコンマ

Kotlin 1.4 では、引数やパラメータリスト、`when` エントリ、分割宣言のコンポーネントなどの列挙において、末尾のコンマを追加できるようになりました。
末尾のコンマを使用すると、コンマの追加や削除なしに新しい項目を追加したり、その順序を変更したりできます。

これは、パラメータや値に複数行構文を使用する場合に特に役立ちます。末尾のコンマを追加すると、パラメータや値の行を簡単にスワップできます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
```

### 呼び出し可能参照の改善

Kotlin 1.4 は、呼び出し可能参照の使用に関してより多くのケースをサポートします。

*   デフォルト値を持つパラメータを含む関数への参照
*   `Unit` を返す関数内の関数参照
*   関数の引数の数に基づいて適応する参照
*   呼び出し可能参照での `suspend` 変換

#### デフォルト値を持つパラメータを含む関数への参照

デフォルト値を持つパラメータを含む関数への呼び出し可能参照を使用できるようになりました。関数 `foo` への呼び出し可能参照が引数を取らない場合、デフォルト値 `0` が使用されます。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前は、`apply` または `foo` 関数のいずれかに別のオーバーロードを記述する必要がありました。

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### Unit を返す関数における関数参照

Kotlin 1.4 では、`Unit` を返す関数内で任意の型を返す関数への呼び出し可能参照を使用できます。
Kotlin 1.4 より前は、この場合ラムダ引数しか使用できませんでした。現在はラムダ引数と呼び出し可能参照の両方を使用できます。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 関数の引数の数に基づいて適応する参照

可変長引数 (`vararg`) を渡す際に、関数への呼び出し可能参照を適応できるようになりました。
渡された引数リストの最後に、同じ型の任意の数のパラメータを渡すことができます。

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

#### 呼び出し可能参照での suspend 変換

ラムダに対する suspend 変換に加えて、Kotlin はバージョン 1.4.0 以降、呼び出し可能参照に対する suspend 変換もサポートします。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### ループ内の `when` 式での `break` と `continue` の使用

Kotlin 1.3 では、ループ内の `when` 式内で修飾子なしの `break` および `continue` を使用できませんでした。これは、これらのキーワードが `when` 式における[フォールスルー動作](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)の可能性のために予約されていたためです。

そのため、ループ内の `when` 式で `break` および `continue` を使用したい場合は、[ラベルを付ける](returns.md#break-and-continue-labels)必要があり、非常に面倒でした。

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

Kotlin 1.4 では、ループ内の `when` 式でラベルなしの `break` と `continue` を使用できます。これらは、最も近い囲むループを終了するか、次のステップに進むという期待通りの動作をします。

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

`when` 内のフォールスルー動作については、今後の設計で検討されます。

## IDE の新機能

Kotlin 1.4 では、IntelliJ IDEA の新しいツールを使用して Kotlin 開発を簡素化できます。

*   [新しい柔軟なプロジェクトウィザード](#new-flexible-project-wizard)
*   [コルーチンデバッガー](#coroutine-debugger)

### 新しい柔軟なプロジェクトウィザード

柔軟な新しい Kotlin プロジェクトウィザードを使用すると、さまざまな種類の Kotlin プロジェクト（UI なしでは構成が難しいマルチプラットフォームプロジェクトを含む）を簡単に作成および構成できます。

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

新しい Kotlin プロジェクトウィザードはシンプルで柔軟性があります。

1.  *プロジェクトのテンプレートを選択します*。これは、達成したいことに応じて選択します。今後、さらにテンプレートが追加される予定です。
2.  *ビルドシステムを選択します*。Gradle (Kotlin または Groovy DSL)、Maven、または IntelliJ IDEA から選択できます。
    Kotlin プロジェクトウィザードは、選択したプロジェクトテンプレートでサポートされているビルドシステムのみを表示します。
3.  メイン画面で*プロジェクト構造を直接プレビューします*。

その後、プロジェクトの作成を完了するか、オプションで次の画面で*プロジェクトを構成します*。

4.  このプロジェクトテンプレートでサポートされている*モジュールとターゲットを追加/削除します*。
5.  例えば、ターゲット JVM バージョン、ターゲットテンプレート、テストフレームワークなど、*モジュールとターゲットの設定を構成します*。

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

今後、Kotlin Project Wizard は、さらに多くの構成オプションとテンプレートを追加することで、さらに柔軟になる予定です。

これらのチュートリアルを試して、新しい Kotlin プロジェクトウィザードを試すことができます。

*   [Kotlin/JVM をベースにしたコンソールアプリケーションの作成](jvm-get-started.md)
*   [React 用 Kotlin/JS アプリケーションの作成](js-react.md)
*   [Kotlin/Native アプリケーションの作成](native-get-started.md)

### コルーチンデバッガー

多くの人がすでに非同期プログラミングに[コルーチン](coroutines-guide.md)を使用しています。
しかし、Kotlin 1.4 以前では、デバッグとなるとコルーチンを扱うのは本当に大変でした。コルーチンはスレッド間を飛び回るため、特定のコルーチンが何をしているのかを理解し、そのコンテキストをチェックするのが困難でした。場合によっては、ブレークポイントでのステップ追跡が機能しないこともありました。その結果、コルーチンを使用するコードのデバッグには、ロギングや精神的な努力に頼るしかありませんでした。

Kotlin 1.4 では、Kotlin プラグインに搭載された新機能により、コルーチンのデバッグが格段に便利になりました。

> デバッグは `kotlinx-coroutines-core` のバージョン 1.3.8 以降で動作します。
>
{style="note"}

**デバッグツールウィンドウ**に新しい**コルーチン**タブが追加されました。このタブでは、現在実行中のコルーチンと中断されているコルーチンの両方に関する情報を見つけることができます。コルーチンは実行中のディスパッチャによってグループ化されています。

![Debugging coroutines](coroutine-debugger-wn.png)

これで以下のことが可能になりました。
*   各コルーチンの状態を簡単に確認できます。
*   実行中および中断中のコルーチンのローカル変数とキャプチャされた変数の値を確認できます。
*   完全なコルーチン作成スタックと、コルーチン内の呼び出しスタックを確認できます。スタックには、標準のデバッグでは失われる可能性のある変数値を持つすべてのフレームが含まれます。

各コルーチンの状態とそのスタックを含む完全なレポートが必要な場合は、**コルーチン**タブ内で右クリックし、**コルーチンのダンプを取得**をクリックします。現在、コルーチンのダンプはかなり単純ですが、今後の Kotlin バージョンでより読みやすく、役立つようにしていく予定です。

![Coroutines Dump](coroutines-dump-wn.png)

コルーチンのデバッグの詳細については、[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)と [IntelliJ IDEA ドキュメント](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)をご覧ください。

## 新しいコンパイラ

新しい Kotlin コンパイラは非常に高速になり、サポートされているすべてのプラットフォームを統合し、コンパイラ拡張のための API を提供します。これは長期的なプロジェクトであり、Kotlin 1.4.0 ではすでにいくつかのステップを完了しました。

*   [新しいより強力な型推論アルゴリズム](#new-more-powerful-type-inference-algorithm)がデフォルトで有効になりました。
*   [新しい JVM および JS IR バックエンド](#unified-backends-and-extensibility)。これらは安定化され次第、デフォルトになる予定です。

### 新しいより強力な型推論アルゴリズム

Kotlin 1.4 は、新しい、より強力な型推論アルゴリズムを使用します。この新しいアルゴリズムは、Kotlin 1.3 でコンパイラオプションを指定することで試すことができましたが、現在はデフォルトで使用されています。新しいアルゴリズムで修正された問題の完全なリストは、[YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)で確認できます。以下に、最も注目すべき改善点をいくつか紹介します。

*   [型が自動的に推論されるケースの増加](#more-cases-where-type-is-inferred-automatically)
*   [ラムダの最後の式のスマートキャスト](#smart-casts-for-a-lambda-s-last-expression)
*   [呼び出し可能参照のスマートキャスト](#smart-casts-for-callable-references)
*   [委譲プロパティの推論の改善](#better-inference-for-delegated-properties)
*   [異なる引数を持つ Java インターフェースの SAM 変換](#sam-conversion-for-java-interfaces-with-different-arguments)
*   [Kotlin の Java SAM インターフェース](#java-sam-interfaces-in-kotlin)

#### 型が自動的に推論されるケースの増加

新しい推論アルゴリズムは、以前のアルゴリズムでは明示的に指定する必要があった多くのケースで型を推論します。例えば、以下の例では、ラムダパラメータ `it` の型が `String?` に正しく推論されます。

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

Kotlin 1.3 では、これを機能させるために明示的なラムダパラメータを導入するか、`to` を明示的なジェネリック引数を持つ `Pair` コンストラクタに置き換える必要がありました。

#### ラムダの最後の式のスマートキャスト

Kotlin 1.3 では、期待される型を指定しない限り、ラムダ内の最後の式はスマートキャストされませんでした。したがって、以下の例では、Kotlin 1.3 は `String?` を `result` 変数の型として推論します。

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// The type of 'result' is String? in Kotlin 1.3 and String in Kotlin 1.4
```

Kotlin 1.4 では、新しい推論アルゴリズムのおかげで、ラムダ内の最後の式がスマートキャストされ、このより正確な型がラムダの結果型を推論するために使用されます。したがって、`result` 変数の型は `String` になります。

Kotlin 1.3 では、このようなケースを機能させるために明示的なキャスト（`!!` や `as String` のような型キャスト）を追加する必要があることがよくありましたが、現在はこれらのキャストは不要になりました。

#### 呼び出し可能参照のスマートキャスト

Kotlin 1.3 では、スマートキャストされた型のメンバー参照にアクセスできませんでした。Kotlin 1.4 ではアクセスできるようになりました。

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

`animal` 変数が特定の型 `Cat` と `Dog` にスマートキャストされた後、異なるメンバー参照 `animal::meow` と `animal::woof` を使用できます。型チェックの後、サブタイプに対応するメンバー参照にアクセスできます。

#### 委譲プロパティの推論の改善

委譲プロパティの型は、`by` キーワードに続く委譲式を分析する際に考慮されませんでした。たとえば、以下のコードは以前はコンパイルされませんでしたが、現在はコンパイラが `old` および `new` パラメータの型を `String?` として正しく推論します。

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

Kotlin は当初から Java インターフェースの SAM 変換をサポートしていましたが、既存の Java ライブラリを扱う際に時々煩わしい、サポートされていないケースが1つありました。2つの SAM インターフェースをパラメータとして取る Java メソッドを呼び出す場合、両方の引数がラムダであるか、通常のオブジェクトである必要がありました。片方の引数をラムダとして渡し、もう片方をオブジェクトとして渡すことはできませんでした。

新しいアルゴリズムはこの問題を修正し、どんな場合でも SAM インターフェースの代わりにラムダを渡すことができるようになりました。これは自然に期待される動作です。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
}
```

#### Kotlin の Java SAM インターフェース

Kotlin 1.4 では、Kotlin で Java SAM インターフェースを使用し、それらに SAM 変換を適用できます。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

Kotlin 1.3 では、SAM 変換を実行するには、上記の `foo` 関数を Java コードで宣言する必要がありました。

### 統合されたバックエンドと拡張性

Kotlin には、実行可能ファイルを生成するバックエンドが 3 つあります。Kotlin/JVM、Kotlin/JS、Kotlin/Native です。Kotlin/JVM と Kotlin/JS は、それぞれ独立して開発されたため、多くのコードを共有していません。Kotlin/Native は、Kotlin コードの中間表現 (IR) を中心に構築された新しいインフラストラクチャに基づいています。

現在、Kotlin/JVM と Kotlin/JS を同じ IR に移行しています。その結果、3 つのバックエンドすべてが多くのロジックを共有し、統一されたパイプラインを持っています。これにより、ほとんどの機能、最適化、バグ修正をすべてのプラットフォームに対して一度だけ実装できます。新しい IR ベースのバックエンドはどちらも [Alpha](components-stability.md) 段階にあります。

共通のバックエンドインフラストラクチャは、マルチプラットフォームコンパイラ拡張の道も開きます。パイプラインにプラグインして、カスタム処理と変換を追加できます。これにより、すべてのプラットフォームで自動的に動作します。

現在アルファ版の新しい [JVM IR](#new-jvm-ir-backend) と [JS IR](#new-js-ir-backend) バックエンドを試していただき、フィードバックを共有していただくことをお勧めします。

## Kotlin/JVM

Kotlin 1.4.0 には、JVM 固有の改善がいくつか含まれています。
 
*   [新しい JVM IR バックエンド](#new-jvm-ir-backend)
*   [インターフェースのデフォルトメソッド生成の新しいモード](#new-modes-for-generating-default-methods)
*   [null チェックの例外型の統一](#unified-exception-type-for-null-checks)
*   [JVM バイトコードの型アノテーション](#type-annotations-in-the-jvm-bytecode)

### 新しい JVM IR バックエンド

Kotlin/JS とともに、Kotlin/JVM も[統合 IR バックエンド](#unified-backends-and-extensibility)に移行しています。これにより、ほとんどの機能とバグ修正をすべてのプラットフォームに対して一度だけ実装できます。これにより、すべてのプラットフォームで動作するマルチプラットフォーム拡張を作成することで、ユーザーも恩恵を受けることができます。

Kotlin 1.4.0 では、そのような拡張のパブリック API はまだ提供されていませんが、[Jetpack Compose](https://developer.android.com/jetpack/compose) を含むパートナーと緊密に連携しており、彼らはすでに新しいバックエンドを使用してコンパイラプラグインを構築しています。

現在アルファ版の新しい Kotlin/JVM バックエンドを試していただき、[課題トラッカー](https://youtrack.jetbrains.com/issues/KT)に課題や機能リクエストを提出していただくことをお勧めします。これにより、コンパイラパイプラインを統合し、Jetpack Compose のようなコンパイラ拡張を Kotlin コミュニティに迅速に提供できるようになります。

新しい JVM IR バックエンドを有効にするには、Gradle ビルドスクリプトに以下の追加コンパイラオプションを指定します。

```kotlin
kotlinOptions.useIR = true
```

> [Jetpack Compose を有効にする](https://developer.android.com/jetpack/compose/setup?hl=en)と、`kotlinOptions` でコンパイラオプションを指定しなくても、新しい JVM バックエンドが自動的に有効になります。
>
{style="note"}

コマンドラインコンパイラを使用する場合は、`-Xuse-ir` コンパイラオプションを追加します。

> 新しい JVM IR バックエンドでコンパイルされたコードは、新しいバックエンドを有効にしている場合にのみ使用できます。そうでない場合は、エラーが発生します。
> このことを考慮すると、ライブラリ作者がプロダクションで新しいバックエンドに切り替えることはお勧めしません。
>
{style="note"}

### デフォルトメソッド生成の新しいモード

Kotlin コードを JVM 1.8 以降のターゲットにコンパイルする場合、Kotlin インターフェースの非抽象メソッドを Java の `default` メソッドにコンパイルできました。この目的のために、そのようなメソッドをマークするための `@JvmDefault` アノテーションと、このアノテーションの処理を有効にする `-Xjvm-default` コンパイラオプションを含むメカニズムがありました。

1.4.0 では、デフォルトメソッドを生成するための新しいモードとして `-Xjvm-default=all` を追加しました。これは、Kotlin インターフェースの *すべて* の非抽象メソッドを `default` Java メソッドにコンパイルします。`default` なしでコンパイルされたインターフェースを使用するコードとの互換性のために、`all-compatibility` モードも追加しました。

Java 相互運用におけるデフォルトメソッドの詳細については、[相互運用ドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces)および[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### null チェックの例外型の統一

Kotlin 1.4.0 以降、すべてのランタイム null チェックは `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException`、および `TypeCastException` の代わりに `java.lang.NullPointerException` をスローします。これは、`!!` 演算子、メソッドのプレアンブルでのパラメータ null チェック、プラットフォーム型式 null チェック、および null 許容でない型を伴う `as` 演算子に適用されます。
`lateinit` null チェックおよび `checkNotNull` や `requireNotNull` などの明示的なライブラリ関数呼び出しには適用されません。

この変更により、Kotlin コンパイラまたはさまざまな種類のバイトコード処理ツール（Android の [R8 オプティマイザ](https://developer.android.com/studio/build/shrink-code)など）によって実行できる null チェック最適化の数が増加します。

開発者の視点からは、状況はそれほど変わらないことに注意してください。Kotlin コードは以前と同じエラーメッセージで例外をスローします。例外の型は変わりますが、渡される情報は同じです。

### JVM バイトコードの型アノテーション

Kotlin は JVM バイトコード (ターゲットバージョン 1.8+) で型アノテーションを生成できるようになり、ランタイム時に Java リフレクションで利用できるようになりました。
バイトコードに型アノテーションを出力するには、次の手順に従います。

1.  宣言されたアノテーションが適切なアノテーションターゲット (Java の `ElementType.TYPE_USE` または Kotlin の `AnnotationTarget.TYPE`) と保持ポリシー (`AnnotationRetention.RUNTIME`) を持っていることを確認します。
2.  アノテーションクラスの宣言を JVM バイトコードのターゲットバージョン 1.8+ でコンパイルします。これは `-jvm-target=1.8` コンパイラオプションで指定できます。
3.  アノテーションを使用するコードを JVM バイトコードのターゲットバージョン 1.8+ (`-jvm-target=1.8`) でコンパイルし、`-Xemit-jvm-type-annotations` コンパイラオプションを追加します。

標準ライブラリの型アノテーションは、標準ライブラリがターゲットバージョン 1.6 でコンパイルされているため、現時点ではバイトコードには出力されないことに注意してください。

これまでのところ、基本的なケースのみがサポートされています。

-   メソッドパラメータ、メソッド戻り値の型、プロパティの型に対する型アノテーション
-   型引数の不変の射影、例えば `Smth<@Ann Foo>`、`Array<@Ann Foo>`

以下の例では、`String` 型の `@Foo` アノテーションはバイトコードに出力され、ライブラリコードで使用できます。

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JS プラットフォームでは、Kotlin 1.4.0 は以下の改善を提供します。

-   [新しい Gradle DSL](#new-gradle-dsl)
-   [新しい JS IR バックエンド](#new-js-ir-backend)

### 新しい Gradle DSL

`kotlin.js` Gradle プラグインには、調整された Gradle DSL が付属しており、多数の新しい構成オプションを提供し、`kotlin-multiplatform` プラグインが使用する DSL により密接に連携しています。最も影響の大きい変更点には以下が含まれます。

-   `binaries.executable()` を介した実行可能ファイルの作成を明示的に切り替えるトグル。 [Kotlin/JS とその環境の実行の詳細についてはこちら](js-project-setup.md#execution-environments)を参照してください。
-   `cssSupport` を介して Gradle 設定内から webpack の CSS およびスタイルローダーを構成できます。 [CSS およびスタイルローダーの使用の詳細についてはこちら](js-project-setup.md#css)を参照してください。
-   npm 依存関係の管理が改善され、必須のバージョン番号または [semver](https://docs.npmjs.com/about-semantic-versioning) バージョン範囲がサポートされ、`devNpm`、`optionalNpm`、`peerNpm` を使用した _開発_、_ピア_、および _オプション_ の npm 依存関係がサポートされます。 [Gradle から直接 npm パッケージの依存関係管理の詳細についてはこちら](js-project-setup.md#npm-dependencies)を参照してください。
-   Kotlin 外部宣言のジェネレーターである [Dukat](https://github.com/Kotlin/dukat) の統合が強化されました。外部宣言は、ビルド時に生成することも、Gradle タスクを介して手動で生成することもできるようになりました。

### 新しい JS IR バックエンド

[Kotlin/JS 用の IR バックエンド](js-ir-compiler.md)は、現在 [Alpha](components-stability.md) 安定性であり、生成されるコードサイズのデッドコード除去による削減、JavaScript および TypeScript との相互運用性の改善などに焦点を当てた、Kotlin/JS ターゲットに特有の新しい機能を提供します。

Kotlin/JS IR バックエンドを有効にするには、`gradle.properties` でキー `kotlin.js.compiler=ir` を設定するか、Gradle ビルドスクリプトの `js` 関数に `IR` コンパイラタイプを渡します。

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

新しいバックエンドの構成方法に関する詳細については、[Kotlin/JS IR コンパイラドキュメント](js-ir-compiler.md)を参照してください。

新しい [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) アノテーションと、**[Kotlin コードから TypeScript 定義 (.d.ts) を生成する機能](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)** により、Kotlin/JS IR コンパイラバックエンドは JavaScript & TypeScript の相互運用性を向上させます。これにより、Kotlin/JS コードを既存のツールと統合したり、**ハイブリッドアプリケーション**を作成したり、マルチプラットフォームプロジェクトでコード共有機能を活用したりすることも容易になります。

[Kotlin/JS IR コンパイラバックエンドで利用可能な機能の詳細はこちら](js-ir-compiler.md)。

## Kotlin/Native

1.4.0 では、Kotlin/Native に以下のものを含む、数多くの新機能と改善が追加されました。

*   [Swift および Objective-C での Kotlin のサスペンド関数のサポート](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
*   [Objective-C ジェネリクスのデフォルトサポート](#objective-c-generics-support-by-default)
*   [Objective-C/Swift 相互運用における例外処理](#exception-handling-in-objective-c-swift-interop)
*   [Apple ターゲットでのリリース .dSYMs のデフォルト生成](#generate-release-dsyms-on-apple-targets-by-default)
*   [パフォーマンスの改善](#performance-improvements)
*   [CocoaPods 依存関係の管理の簡素化](#simplified-management-of-cocoapods-dependencies)

### Swift および Objective-C での Kotlin のサスペンド関数のサポート

1.4.0 では、Swift および Objective-C でのサスペンド関数の基本的なサポートを追加しました。Kotlin モジュールを Apple フレームワークにコンパイルすると、サスペンド関数はコールバックを持つ関数 (Swift/Objective-C の用語では `completionHandler`) として利用可能になります。生成されたフレームワークのヘッダーにそのような関数がある場合、Swift または Objective-C コードからそれらを呼び出すことができ、オーバーライドすることも可能です。

たとえば、次のような Kotlin 関数を記述した場合:

```kotlin
suspend fun queryData(id: Int): String = ...
```

...Swift からは次のように呼び出せます。

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[Swift および Objective-C でサスペンド関数を使用する方法の詳細についてはこちら](native-objc-interop.md)。

### Objective-C ジェネリクスのデフォルトサポート

以前のバージョンの Kotlin では、Objective-C 相互運用におけるジェネリクスが実験的にサポートされていました。1.4.0 以降、Kotlin/Native は Kotlin コードからジェネリクスを含む Apple フレームワークをデフォルトで生成します。場合によっては、これが既存の Objective-C または Swift コードによる Kotlin フレームワークの呼び出しを壊す可能性があります。ジェネリクスなしでフレームワークヘッダーを記述するには、`-Xno-objc-generics` コンパイラオプションを追加します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

[Objective-C との相互運用に関するドキュメント](native-objc-interop.md#generics)に記載されているすべての詳細と制限は引き続き有効であることに注意してください。

### Objective-C/Swift 相互運用における例外処理

1.4.0 では、Kotlin から生成される Swift API を、例外の変換方法に関してわずかに変更しました。Kotlin と Swift の間には、エラー処理に根本的な違いがあります。Kotlin の例外はすべてチェックされませんが、Swift にはチェックされるエラーしかありません。したがって、Swift コードが予期される例外を認識できるようにするには、Kotlin 関数は `@Throws` アノテーションで潜在的な例外クラスのリストを指定してマークする必要があります。

Swift または Objective-C フレームワークにコンパイルすると、`@Throws` アノテーションを持つ、または継承する関数は、Objective-C では `NSError*` を生成するメソッドとして、Swift では `throws` メソッドとして表現されます。

以前は、`RuntimeException` および `Error` 以外の例外はすべて `NSError` として伝播されました。この動作は変更され、`NSError` は `@Throws` アノテーションのパラメータとして指定されたクラス（またはそのサブクラス）のインスタンスである例外に対してのみスローされるようになりました。Swift/Objective-C に到達するその他の Kotlin 例外は未処理と見なされ、プログラムを終了させます。

### Apple ターゲットでのリリース .dSYMs のデフォルト生成

1.4.0 以降、Kotlin/Native コンパイラは、デフォルトで Darwin プラットフォーム上のリリースバイナリ用に[デバッグシンボルファイル](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM`s) を生成します。これは `-Xadd-light-debug=disable` コンパイラオプションで無効にできます。他のプラットフォームでは、このオプションはデフォルトで無効になっています。Gradle でこのオプションを切り替えるには、以下を使用します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[クラッシュレポートのシンボル化の詳細についてはこちら](native-debugging.md#debug-ios-applications)。

### パフォーマンスの改善

Kotlin/Native は、開発プロセスと実行の両方を高速化する数多くのパフォーマンス改善を受けました。
以下にいくつかの例を示します。

-   オブジェクト割り当ての速度を向上させるため、システムアロケータの代替として [mimalloc](https://github.com/microsoft/mimalloc) メモリマネージャを提供するようになりました。mimalloc は、いくつかのベンチマークで最大 2 倍高速に動作します。
    現在、Kotlin/Native での mimalloc の使用は実験的です。`-Xallocator=mimalloc` コンパイラオプションを使用して切り替えることができます。

-   C 相互運用ライブラリの構築方法を見直しました。新しいツールにより、Kotlin/Native は以前より最大 4 倍高速に相互運用ライブラリを生成し、成果物のサイズは以前の 25% から 30% に縮小されました。

-   GC の最適化により、全体的なランタイムパフォーマンスが向上しました。この改善は、寿命の長いオブジェクトが多数存在するプロジェクトで特に顕著になります。`HashMap` と `HashSet` コレクションは、冗長なボクシングを回避することで高速に動作するようになりました。

-   1.3.70 では、Kotlin/Native コンパイルのパフォーマンスを向上させるための 2 つの新機能が導入されました。[プロジェクトの依存関係のキャッシュと Gradle デーモンからのコンパイラの実行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)です。
    それ以来、私たちは多数の課題を修正し、これらの機能の全体的な安定性を向上させました。

### CocoaPods 依存関係の管理の簡素化

以前は、CocoaPods 依存関係マネージャーとプロジェクトを統合すると、iOS、macOS、watchOS、または tvOS のプロジェクト部分は Xcode でのみビルドでき、マルチプラットフォームプロジェクトの他の部分とは別でした。これらの他の部分は IntelliJ IDEA でビルドできました。

さらに、CocoaPods に保存されている Objective-C ライブラリ (Pod ライブラリ) に依存関係を追加するたびに、IntelliJ IDEA から Xcode に切り替え、`pod install` を呼び出し、Xcode でビルドを実行する必要がありました。

これで、IntelliJ IDEA で直接 Pod 依存関係を管理できるようになりました。これにより、コードのハイライトや補完など、コード操作にIntelliJ IDEA が提供する利点を享受できます。また、Xcode に切り替えることなく、Gradle を使用して Kotlin プロジェクト全体をビルドすることもできます。これは、Swift/Objective-C コードを記述したり、シミュレーターやデバイスでアプリケーションを実行したりする必要がある場合にのみ Xcode に行く必要があることを意味します。

また、ローカルに保存されている Pod ライブラリも操作できるようになりました。

必要に応じて、次の間に依存関係を追加できます。
*   Kotlin プロジェクトと、CocoaPods リポジトリにリモートで保存されている Pod ライブラリ、またはマシンにローカルで保存されている Pod ライブラリ。
*   Kotlin Pod (CocoaPods 依存関係として使用される Kotlin プロジェクト) と、1つ以上のターゲットを持つ Xcode プロジェクト。

初期設定を完了し、`cocoapods` に新しい依存関係を追加する場合は、IntelliJ IDEA でプロジェクトを再インポートするだけです。新しい依存関係は自動的に追加されます。追加の手順は不要です。

[依存関係の追加方法についてはこちら](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin マルチプラットフォーム

> マルチプラットフォームプロジェクトのサポートは [Alpha](components-stability.md) 段階です。将来的には互換性のない変更が発生し、手動での移行が必要になる場合があります。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT) でのフィードバックをお待ちしております。
>
{style="warning"}

[Kotlin マルチプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)は、[異なるプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)向けに同じコードを記述・保守する時間を削減し、ネイティブプログラミングの柔軟性と利点を維持します。私たちはマルチプラットフォーム機能と改善に引き続き努力を注いでいます。

*   [階層型プロジェクト構造での複数ターゲット間でのコード共有](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
*   [階層構造におけるネイティブライブラリの活用](#leveraging-native-libs-in-the-hierarchical-structure)
*   [kotlinx 依存関係の指定は一度で済むように](#specifying-dependencies-only-once)

> マルチプラットフォームプロジェクトには Gradle 6.0 以降が必要です。
>
{style="note"}

### 階層型プロジェクト構造での複数ターゲット間でのコード共有

新しい階層型プロジェクト構造のサポートにより、[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)内で[複数のプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)間でコードを共有できます。

以前は、マルチプラットフォームプロジェクトに追加されたコードは、1つのターゲットに限定され、他のプラットフォームでは再利用できないプラットフォーム固有のソースセットに配置されるか、プロジェクト内のすべてのプラットフォームで共有される `commonMain` や `commonTest` などの共通ソースセットに配置されるかのいずれかでした。共通ソースセットでは、[プラットフォーム固有の `actual` 実装が必要な `expect` 宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用することによってのみ、プラットフォーム固有の API を呼び出すことができました。

これにより、[すべてのプラットフォームでコードを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)のは容易でしたが、[一部のターゲット間でのみ共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)のは容易ではありませんでした。特に、多くの共通ロジックとサードパーティ API を再利用できる可能性のある類似のターゲット間ではそうでした。

たとえば、iOS をターゲットとする一般的なマルチプラットフォームプロジェクトでは、iOS 関連のターゲットが 2 つあります。1つは iOS ARM64 デバイス用、もう1つは x64 シミュレーター用です。これらは個別のプラットフォーム固有のソースセットを持っていますが、実際にはデバイスとシミュレーターで異なるコードが必要となることはほとんどなく、その依存関係も非常に似ています。そのため、iOS 固有のコードはそれらの間で共有できるはずです。

明らかに、この設定では、Kotlin/Native コードが iOS デバイスとシミュレーターの両方に共通する API を直接呼び出すことができる、*2 つの iOS ターゲット用の共有ソースセット*を持つことが望ましいでしょう。

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

これで、[階層型プロジェクト構造のサポート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)により、これが可能になります。このサポートは、各ソースセットで使用されるターゲットに基づいて、利用可能な API と言語機能を推測して適応させます。

一般的なターゲットの組み合わせの場合、ターゲットショートカットを使用して階層構造を作成できます。
たとえば、`ios()` ショートカットを使用して、上記の2つの iOS ターゲットと共有ソースセットを作成します。

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

ターゲットのその他の組み合わせについては、`dependsOn` 関係を使用して[手動で階層を作成します](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

![Hierarchical structure](manual-hierarchical-structure.svg)

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

階層型プロジェクト構造のおかげで、ライブラリはターゲットのサブセットに対して共通 API を提供することもできます。[ライブラリでのコード共有](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)について詳しく学びましょう。

### 階層構造におけるネイティブライブラリの活用

Foundation、UIKit、POSIX などのプラットフォーム依存ライブラリを、複数のネイティブターゲット間で共有されるソースセットで使用できます。これにより、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有できます。

追加の手順は不要で、すべて自動的に行われます。IntelliJ IDEA は、共有コードで使用できる共通の宣言を検出するのに役立ちます。

[プラットフォーム依存ライブラリの使用方法について詳しく学びましょう](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 依存関係の指定は一度で済むように

これからは、同じライブラリの異なるバリアントへの依存関係を、それが使用される共有およびプラットフォーム固有のソースセットで指定する代わりに、共有ソースセットで一度だけ指定するべきです。

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

`-common`、`-native`などのプラットフォームを指定するサフィックスを持つ kotlinx ライブラリの成果物名を使用しないでください。これらはサポートされなくなりました。代わりに、上記の例では `kotlinx-coroutines-core` のようなライブラリの基本成果物名を使用してください。

ただし、この変更は現在以下には影響しません。
*   `stdlib` ライブラリ – Kotlin 1.4.0 以降、[stdlib 依存関係は自動的に追加されます](#dependency-on-the-standard-library-added-by-default)。
*   `kotlin.test` ライブラリ – 引き続き `test-common` および `test-annotations-common` を使用する必要があります。これらの依存関係は後で対処されます。

特定のプラットフォームにのみ依存関係が必要な場合は、引き続き `-jvm` や `-js` などのサフィックスを持つ標準および kotlinx ライブラリのプラットフォーム固有のバリアントを使用できます（例: `kotlinx-coroutines-core-jvm`）。

[依存関係の構成について詳しく学びましょう](gradle-configure-project.md#configure-dependencies)。

## Gradle プロジェクトの改善

[Kotlin Multiplatform](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native)、[Kotlin/JS](#kotlin-js) に固有の Gradle プロジェクトの機能と改善に加えて、すべての Kotlin Gradle プロジェクトに適用されるいくつかの変更点があります。

*   [標準ライブラリへの依存関係がデフォルトで追加されるように](#dependency-on-the-standard-library-added-by-default)
*   [Kotlin プロジェクトには新しいバージョンの Gradle が必要](#minimum-gradle-version-for-kotlin-projects)
*   [IDE における Kotlin Gradle DSL のサポートの改善](#improved-gradle-kts-support-in-the-ide)

### 標準ライブラリへの依存関係がデフォルトで追加されるように

マルチプラットフォームプロジェクトを含む、すべての Kotlin Gradle プロジェクトで `stdlib` ライブラリへの依存関係を宣言する必要がなくなりました。
依存関係はデフォルトで追加されます。

自動的に追加される標準ライブラリは、Kotlin Gradle プラグインと同じバージョンになります。これらは同じバージョン管理を採用しているためです。

プラットフォーム固有のソースセットには対応するプラットフォーム固有のライブラリバリアントが使用され、残りの部分には共通の標準ライブラリが追加されます。Kotlin Gradle プラグインは、Gradle ビルドスクリプトの `kotlinOptions.jvmTarget` [コンパイラオプション](gradle-compiler-options.md)に応じて適切な JVM 標準ライブラリを選択します。

[デフォルトの動作を変更する方法はこちら](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlin プロジェクトには新しいバージョンの Gradle が必要

Kotlin プロジェクトで新機能を利用するには、Gradle を[最新バージョン](https://gradle.org/releases/)に更新してください。マルチプラットフォームプロジェクトには Gradle 6.0 以降が必要ですが、その他の Kotlin プロジェクトは Gradle 5.4 以降で動作します。

### IDE における *.gradle.kts サポートの改善

1.4.0 では、Gradle Kotlin DSL スクリプト (`*.gradle.kts` ファイル) の IDE サポートの改善を継続しました。新しいバージョンでは、以下の点が強化されています。

-   パフォーマンス向上のための*スクリプト設定の明示的な読み込み*。以前は、ビルドスクリプトに対する変更は自動的にバックグラウンドで読み込まれていました。パフォーマンスを向上させるため、1.4.0 ではビルドスクリプト設定の自動読み込みを無効にしました。IDE は、明示的に適用した場合にのみ変更を読み込みます。

    Gradle 6.0 より前のバージョンでは、エディタで**設定を読み込む**をクリックして、スクリプト設定を手動で読み込む必要があります。

    ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

    Gradle 6.0 以降では、**Gradle の変更を読み込む**をクリックするか、Gradle プロジェクトを再インポートすることで、変更を明示的に適用できます。
 
    IntelliJ IDEA 2020.1 以降と Gradle 6.0 以降では、さらに**スクリプト設定を読み込む**アクションが追加されました。これは、プロジェクト全体を更新することなくスクリプト設定への変更を読み込みます。これにより、プロジェクト全体を再インポートするよりもはるかに時間が短縮されます。

    ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

    新しく作成されたスクリプト、または新しい Kotlin プラグインでプロジェクトを初めて開く場合も、**スクリプト設定を読み込む**必要があります。
    
    Gradle 6.0 以降では、以前の実装で個別に読み込まれていたのとは対照的に、すべてのスクリプトを一度に読み込むことができるようになりました。各リクエストで Gradle 設定フェーズが実行される必要があるため、大規模な Gradle プロジェクトではリソースを大量に消費する可能性があります。
    
    現在、このような読み込みは `build.gradle.kts` と `settings.gradle.kts` ファイルに限定されています（関連する[課題](https://github.com/gradle/gradle/issues/12640)に投票してください）。
    `init.gradle.kts` または適用された[スクリプトプラグイン](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)のハイライトを有効にするには、古いメカニズム（スタンドアロンスクリプトへの追加）を使用してください。それらのスクリプトの設定は、必要なときに個別に読み込まれます。
    また、そのようなスクリプトの自動リロードを有効にすることもできます。
      
    ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)
    
-   _エラー報告の改善_。以前は、Gradle Daemon からのエラーは別のログファイルでしか確認できませんでした。現在は、Gradle Daemon がエラーに関するすべての情報を直接返し、ビルドツールウィンドウに表示します。これにより、時間と労力の両方を節約できます。

## 標準ライブラリ

Kotlin 1.4.0 における Kotlin 標準ライブラリの最も重要な変更点のリストを以下に示します。

-   [共通例外処理 API](#common-exception-processing-api)
-   [配列とコレクションの新しい関数](#new-functions-for-arrays-and-collections)
-   [文字列操作のための関数](#functions-for-string-manipulations)
-   [ビット操作](#bit-operations)
-   [委譲プロパティの改善](#delegated-properties-improvements)
-   [KType から Java Type への変換](#converting-from-ktype-to-java-type)
-   [Kotlin リフレクション用の Proguard 設定](#proguard-configurations-for-kotlin-reflection)
-   [既存 API の改善](#improving-the-existing-api)
-   [stdlib 成果物用の module-info ディスクリプタ](#module-info-descriptors-for-stdlib-artifacts)
-   [非推奨](#deprecations)
-   [非推奨の実験的コルーチンの除外](#exclusion-of-the-deprecated-experimental-coroutines)

### 共通例外処理 API

以下の API 要素が共通ライブラリに移動されました。

*   このスローアブルの詳細な説明をスタックトレースとともに返す `Throwable.stackTraceToString()` 拡張関数、およびこの説明を標準エラー出力に出力する `Throwable.printStackTrace()`。
*   例外を配信するために抑制された例外を指定できる `Throwable.addSuppressed()` 関数、およびすべての抑制された例外のリストを返す `Throwable.suppressedExceptions` プロパティ。
*   関数がプラットフォームメソッドにコンパイルされる際に（JVM またはネイティブプラットフォームで）チェックされる例外型を列挙する `@Throws` アノテーション。

### 配列とコレクションの新しい関数

#### コレクション

1.4.0 では、標準ライブラリに**コレクション**を操作するための便利な関数が多数含まれています。

*   `setOfNotNull()` は、指定された引数の中から null でないすべての項目で構成されるセットを作成します。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   シーケンス用の `shuffled()`。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `onEach()` と `flatMap()` の `*Indexed()` の対応関数。
    これらがコレクション要素に適用する操作は、要素インデックスをパラメータとして持ちます。

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

*   `randomOrNull()`、`reduceOrNull()`、`reduceIndexedOrNull()` の `*OrNull()` の対応関数。
    これらは空のコレクションでは `null` を返します。

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `runningFold()`、その同義語である `scan()`、および `runningReduce()` は、`fold()` および `reduce()` と同様に、与えられた操作をコレクション要素に順次適用します。
    違いは、これらの新しい関数がすべての中間結果のシーケンスを返す点です。

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

*   `sumOf()` はセレクタ関数を取り、コレクションのすべての要素に対するその値の合計を返します。
    `sumOf()` は、`Int`、`Long`、`Double`、`UInt`、`ULong` 型の合計を生成できます。JVM では、`BigInteger` と `BigDecimal` も利用可能です。

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

*   `min()` と `max()` 関数は、Kotlin コレクション API 全体で使用されている命名規則に準拠するために `minOrNull()` と `maxOrNull()` に名前が変更されました。関数名の `*OrNull` 接尾辞は、レシーバーコレクションが空の場合に `null` を返すことを意味します。`minBy()`、`maxBy()`、`minWith()`、`maxWith()` も同様で、1.4 では `*OrNull()` の同義語が追加されました。
*   新しい `minOf()` および `maxOf()` 拡張関数は、コレクションアイテムに対する指定されたセレクタ関数の最小値および最大値を返します。

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

    `Comparator` を引数として取る `minOfWith()` と `maxOfWith()`、および空のコレクションで `null` を返すこれら 4 つの関数の `*OrNull()` バージョンもあります。

*   `flatMap` および `flatMapTo` の新しいオーバーロードにより、レシーバー型と一致しない戻り値の型を持つ変換を使用できるようになりました。具体的には、次のとおりです。
    *   `Iterable`、`Array`、`Map` で `Sequence` への変換
    *   `Sequence` で `Iterable` への変換

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

*   ミュータブルリストから要素を削除するための `removeFirst()` と `removeLast()` ショートカット、およびこれらの関数の `*orNull()` 対応関数。

#### 配列

異なるコンテナ型を扱う際に一貫したエクスペリエンスを提供するために、**配列**用の新しい関数も追加しました。

*   `shuffle()` は配列の要素をランダムな順序に並べ替えます。
*   `onEach()` は各配列要素に対して指定されたアクションを実行し、配列自体を返します。
*   `associateWith()` と `associateWithTo()` は配列要素をキーとしてマップを構築します。
*   配列のサブ範囲に対する `reverse()` は、サブ範囲内の要素の順序を逆転させます。
*   配列のサブ範囲に対する `sortDescending()` は、サブ範囲内の要素を降順にソートします。
*   配列のサブ範囲に対する `sort()` と `sortWith()` は、共通ライブラリで利用できるようになりました。

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

さらに、`CharArray`/`ByteArray` と `String` の間の変換のための新しい関数があります。
*   `ByteArray.decodeToString()` と `String.encodeToByteArray()`
*   `CharArray.concatToString()` と `String.toCharArray()`

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

また、両端キューの実装である `ArrayDeque` クラスも追加しました。
両端キューを使用すると、キューの先頭または末尾のいずれかに要素を追加または削除することが償却定数時間で可能です。コードでキューまたはスタックが必要な場合は、デフォルトで両端キューを使用できます。

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

`ArrayDeque` の実装は、内部でサイズ変更可能な配列を使用しています。内容を円形バッファである `Array` に格納し、`Array` がいっぱいになった場合にのみサイズを変更します。

### 文字列操作のための関数

1.4.0 の標準ライブラリには、文字列操作 API にいくつかの改善が含まれています。

*   `StringBuilder` には、`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()` など、便利な新しい拡張関数が追加されました。

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

*   `StringBuilder` の既存関数の一部は、共通ライブラリで利用可能です。これらには、`append()`、`insert()`、`substring()`、`setLength()` などが含まれます。
*   新しい関数 `Appendable.appendLine()` と `StringBuilder.appendLine()` が共通ライブラリに追加されました。これらは、これらのクラスの JVM 専用の `appendln()` 関数を置き換えるものです。

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

ビット操作のための新しい関数です。
*   `countOneBits()` 
*   `countLeadingZeroBits()`
*   `countTrailingZeroBits()`
*   `takeHighestOneBit()`
*   `takeLowestOneBit()` 
*   `rotateLeft()` および `rotateRight()` (実験的)

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

1.4.0 では、Kotlin の委譲プロパティの使用体験を向上させるための新機能を追加しました。
-   プロパティを別のプロパティに委譲できるようになりました。
-   新しいインターフェース `PropertyDelegateProvider` は、単一の宣言でデリゲートプロバイダを作成するのに役立ちます。
-   `ReadWriteProperty` は `ReadOnlyProperty` を拡張するようになり、読み取り専用プロパティにも両方を使用できるようになりました。

新しい API に加えて、結果のバイトコードサイズを削減する最適化を行いました。これらの最適化については、[このブログ記事](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)で説明されています。

[委譲プロパティの詳細についてはこちら](delegated-properties.md)。

### KType から Java Type への変換

stdlib の新しい拡張プロパティ `KType.javaType` (現在は実験的) は、`kotlin-reflect` 依存関係全体を使用せずに Kotlin 型から `java.lang.reflect.Type` を取得するのに役立ちます。

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

1.4.0 以降、Kotlin リフレクション用の Proguard/R8 設定が `kotlin-reflect.jar` に組み込まれました。これにより、R8 または Proguard を使用するほとんどの Android プロジェクトは、追加の設定なしで kotlin-reflect で動作するはずです。
kotlin-reflect 内部用の Proguard ルールをコピー＆ペーストする必要がなくなりました。ただし、リフレクトするすべての API は明示的にリストする必要があることに注意してください。

### 既存 API の改善

*   いくつかの関数は null レシーバーでも動作するようになりました。たとえば、次のとおりです。
    *   文字列に対する `toBoolean()`
    *   配列に対する `contentEquals()`、`contentHashcode()`、`contentToString()`

*   `Double` と `Float` の `NaN`、`NEGATIVE_INFINITY`、`POSITIVE_INFINITY` は `const` として定義されるようになり、アノテーション引数として使用できるようになりました。

*   `Double` と `Float` の新しい定数 `SIZE_BITS` と `SIZE_BYTES` は、バイナリ形式で型のインスタンスを表現するために使用されるビット数とバイト数を格納します。

*   `maxOf()` と `minOf()` のトップレベル関数は可変長引数 (`vararg`) を受け入れられるようになりました。

### stdlib 成果物用の module-info ディスクリプタ

Kotlin 1.4.0 は、デフォルトの標準ライブラリ成果物に `module-info.java` モジュール情報を追加します。これにより、[jlink ツール](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)で使用できるようになります。jlink ツールは、アプリに必要なプラットフォームモジュールのみを含むカスタム Java ランタイムイメージを生成します。
以前は、Kotlin 標準ライブラリ成果物で jlink を使用できましたが、それを行うには別の成果物（"modular" 分類子を持つもの）を使用する必要があり、全体的なセットアップは単純ではありませんでした。
Android では、`module-info` を含む jar ファイルを正しく処理できる Android Gradle プラグインのバージョン 3.2 以降を使用していることを確認してください。

### 非推奨

#### Double と Float の toShort() と toByte()

`Double` と `Float` の関数 `toShort()` および `toByte()` は、値の範囲が狭く、変数のサイズが小さいため、予期しない結果につながる可能性があるため非推奨になりました。

浮動小数点数を `Byte` または `Short` に変換するには、2段階変換を使用します。まず `Int` に変換し、次にターゲット型に再変換します。

#### 浮動小数点配列の contains()、indexOf()、lastIndexOf()

`FloatArray` および `DoubleArray` の拡張関数 `contains()`、`indexOf()`、および `lastIndexOf()` は非推奨になりました。これらは、[IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 標準の等価性を使用しており、これが一部のコーナーケースで全順序の等価性と矛盾するためです。[この課題](https://youtrack.jetbrains.com/issue/KT-28753)で詳細を参照してください。

#### min() および max() コレクション関数

`min()` および `max()` コレクション関数は、その動作をより適切に反映する `minOrNull()` および `maxOrNull()` を優先して非推奨になりました。空のコレクションで `null` を返します。
詳細については、[この課題](https://youtrack.jetbrains.com/issue/KT-38854)を参照してください。

### 非推奨の実験的コルーチンの除外

`kotlin.coroutines.experimental` API は、1.3.0 で kotlin.coroutines を優先して非推奨になりました。1.4.0 では、`kotlin.coroutines.experimental` を標準ライブラリから削除することで、非推奨化サイクルを完了します。JVM でまだ使用しているユーザーのために、実験的コルーチン API をすべて含む互換性アーティファクト `kotlin-coroutines-experimental-compat.jar` を提供しています。これは Maven に公開され、標準ライブラリと一緒に Kotlin ディストリビューションに含まれています。

## 安定版 JSON シリアライゼーション

Kotlin 1.4.0 では、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) の最初の安定版である 1.0.0-RC を出荷しています。これで、`kotlinx-serialization-core` (以前は `kotlinx-serialization-runtime` として知られていました) の JSON シリアライゼーション API が安定版になったことを発表できることを嬉しく思います。その他のシリアライゼーション形式用のライブラリは、コアライブラリの一部の高度な部分と同様に、実験的なままです。

JSON シリアライゼーションの API を大幅に再構築し、より一貫性があり、使いやすいものにしました。これからは、JSON シリアライゼーション API を後方互換性のある方法で開発を継続します。
ただし、以前のバージョンを使用していた場合は、1.0.0-RC に移行する際にコードの一部を書き直す必要があります。
これを支援するために、`kotlinx.serialization` の完全なドキュメントセットである**[Kotlin シリアライゼーションガイド](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)**も提供しています。これは、最も重要な機能の使用プロセスをガイドし、直面する可能性のある課題に対処するのに役立ちます。

>**注**: `kotlinx-serialization` 1.0.0-RC は Kotlin コンパイラ 1.4 でのみ動作します。それ以前のコンパイラバージョンは互換性がありません。
>
{style="note"}

## スクリプティングと REPL

1.4.0 では、Kotlin のスクリプティングは、他の更新とともに、多くの機能とパフォーマンスの改善の恩恵を受けています。
主な変更点は次のとおりです。

-   [新しい依存関係解決 API](#new-dependencies-resolution-api)
-   [新しい REPL API](#new-repl-api)
-   [コンパイル済みスクリプトキャッシュ](#compiled-scripts-cache)
-   [成果物名の変更](#artifacts-renaming)

Kotlin のスクリプティングに慣れていただくために、[サンプルプロジェクト](https://github.com/Kotlin/kotlin-script-examples)を用意しました。
これには、標準スクリプト (`*.main.kts`) の例と、Kotlin Scripting API およびカスタムスクリプト定義の使用例が含まれています。[課題トラッカー](https://youtrack.jetbrains.com/issues/KT)を使用して、ぜひ試してフィードバックを共有してください。

### 新しい依存関係解決 API

1.4.0 では、外部依存関係（Maven アーティファクトなど）を解決するための新しい API を導入し、その実装も行いました。この API は、新しいアーティファクト `kotlin-scripting-dependencies` と `kotlin-scripting-dependencies-maven` で公開されています。
以前の `kotlin-script-util` ライブラリの依存関係解決機能は非推奨になりました。

### 新しい REPL API

新しい実験的な REPL API は、Kotlin Scripting API の一部になりました。また、公開されたアーティファクトにはいくつかの実装があり、一部にはコード補完などの高度な機能があります。この API は[Kotlin Jupyter カーネル](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)で使用されており、独自のカスタムシェルや REPL で試すことができるようになりました。

### コンパイル済みスクリプトキャッシュ

Kotlin Scripting API は、コンパイル済みスクリプトキャッシュを実装する機能を提供するようになり、変更されていないスクリプトのその後の実行を大幅に高速化します。デフォルトの高度なスクリプト実装 `kotlin-main-kts` には、すでに独自のキャッシュがあります。

### 成果物名の変更

成果物名の混乱を避けるため、`kotlin-scripting-jsr223-embeddable` と `kotlin-scripting-jvm-host-embeddable` をそれぞれ `kotlin-scripting-jsr223` と `kotlin-scripting-jvm-host` に変更しました。これらの成果物は `kotlin-compiler-embeddable` 成果物に依存しており、バンドルされたサードパーティライブラリをシェーディングして使用上の競合を回避しています。この名前変更により、スクリプティング成果物については、(一般的に安全な) `kotlin-compiler-embeddable` の使用をデフォルトにしています。
何らかの理由で、シェーディングされていない `kotlin-compiler` に依存する成果物が必要な場合は、`-unshaded` サフィックスを持つ成果物バージョン (`kotlin-scripting-jsr223-unshaded` など) を使用してください。この名前変更は、直接使用されることになっているスクリプティング成果物にのみ影響し、他の成果物の名前は変更されていません。

## Kotlin 1.4.0 への移行

Kotlin プラグインの移行ツールは、プロジェクトを以前のバージョンの Kotlin から 1.4.0 に移行するのに役立ちます。

Kotlin のバージョンを `1.4.0` に変更し、Gradle または Maven プロジェクトを再インポートするだけです。すると、IDE から移行に関する問い合わせがあります。
 
同意すると、移行コードインスペクションが実行され、コードがチェックされ、動作しない、または 1.4.0 で推奨されないものに対する修正が提案されます。

![Run migration](run-migration-wn.png){width=300}

コードインスペクションにはさまざまな[重要度レベル](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)があり、どの提案を受け入れるか、どの提案を無視するかを決定するのに役立ちます。

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0 は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であるため、言語に互換性のない変更をもたらす可能性があります。そのような変更の詳細なリストは、**[Kotlin 1.4 の互換性ガイド](compatibility-guide-14.md)**を参照してください。