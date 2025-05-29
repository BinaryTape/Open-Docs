[//]: # (title: Kotlin 1.4.0の新機能)

_[リリース日: 2020年8月17日](releases.md#release-details)_

Kotlin 1.4.0では、すべてのコンポーネントに多くの改善が施されており、[品質とパフォーマンスに重点が置かれています](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)。
以下に、Kotlin 1.4.0における最も重要な変更点のリストを記載します。

## 言語機能と改善

Kotlin 1.4.0には、さまざまな言語機能と改善が含まれています。これには以下が含まれます。

* [KotlinインターフェースのSAM変換](#sam-conversions-for-kotlin-interfaces)
* [ライブラリ作者のためのExplicit APIモード](#explicit-api-mode-for-library-authors)
* [名前付き引数と位置指定引数の混在](#mixing-named-and-positional-arguments)
* [末尾のカンマ](#trailing-comma)
* [呼び出し可能参照の改善](#callable-reference-improvements)
* [ループ内の`when`式での`break`と`continue`の使用](#using-break-and-continue-inside-when-expressions-included-in-loops)

### KotlinインターフェースのSAM変換

Kotlin 1.4.0より前は、SAM (Single Abstract Method) 変換は[KotlinからJavaメソッドおよびJavaインターフェースを扱う場合にのみ](java-interop.md#sam-conversions)適用できました。これからは、Kotlinインターフェースに対してもSAM変換を使用できます。
これを行うには、`fun`修飾子を使用してKotlinインターフェースを明示的に関数型としてマークします。

SAM変換は、単一の抽象メソッドのみを持つインターフェースがパラメータとして期待されるときにラムダを引数として渡す場合に適用されます。
この場合、コンパイラはラムダを抽象メンバー関数を実装するクラスのインスタンスに自動的に変換します。

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

[Kotlinの関数型インターフェースとSAM変換について詳しく学ぶ](fun-interfaces.md)。

### ライブラリ作者のためのExplicit APIモード

Kotlinコンパイラは、ライブラリ作者向けに_Explicit APIモード_を提供します。このモードでは、コンパイラは、
ライブラリのAPIをより明確で一貫性のあるものにするのに役立つ追加のチェックを実行します。
これにより、ライブラリのパブリックAPIに公開される宣言に以下の要件が追加されます。

* デフォルトの可視性でパブリックAPIに公開される宣言には、可視性修飾子が必要です。
これにより、意図せずに宣言がパブリックAPIに公開されることがなくなります。
* パブリックAPIに公開されるプロパティおよび関数には、明示的な型指定が必要です。
これにより、APIユーザーが使用するAPIメンバーの型を認識できるようにします。

設定によっては、これらの明示的なAPIはエラー（_strict_モード）または警告（_warning_モード）を生成する場合があります。
読みやすさと常識のために、特定の種類の宣言はこれらのチェックから除外されます。

* プライマリコンストラクタ
* データクラスのプロパティ
* プロパティゲッターとセッター
* `override`メソッド

Explicit APIモードは、モジュールのプロダクションソースのみを分析します。

モジュールをExplicit APIモードでコンパイルするには、以下の行をGradleビルドスクリプトに追加します。

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

コマンドラインコンパイラを使用する場合は、`-Xexplicit-api`コンパイラオプションに`strict`または`warning`の値を設定してExplicit APIモードに切り替えます。

```bash
-Xexplicit-api={strict|warning}
```

[Explicit APIモードの詳細については、KEEPを参照してください](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md)。

### 名前付き引数と位置指定引数の混在

Kotlin 1.3では、[名前付き引数](functions.md#named-arguments)で関数を呼び出す場合、名前のないすべての引数（位置指定引数）を最初の名前付き引数の前に配置する必要がありました。例えば、`f(1, y = 2)`は呼び出せましたが、`f(x = 1, 2)`は呼び出せませんでした。

すべての引数が正しい位置にありながら、途中の1つの引数に名前を指定したい場合に、この制限は非常に煩わしいものでした。特に、`Boolean`または`null`の値がどの属性に属するかを明確にするのに役立ちました。

Kotlin 1.4では、このような制限はありません。位置指定引数のセットの途中の引数に名前を指定できるようになりました。さらに、正しい順序を保つ限り、位置指定引数と名前付き引数を好きなように混在させることができます。

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

### 末尾のカンマ

Kotlin 1.4では、引数リストやパラメータリスト、`when`のエントリ、分割宣言のコンポーネントなどの列挙において、末尾にカンマを追加できるようになりました。
末尾にカンマを追加することで、カンマを追加したり削除したりすることなく、新しい項目を追加したり順序を変更したりできます。

これは、パラメータや値に複数行構文を使用する場合に特に役立ちます。末尾にカンマを追加した後、パラメータや値の行を簡単に交換できます。

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

Kotlin 1.4では、呼び出し可能参照のより多くのケースをサポートしています。

* デフォルト引数値を持つ関数への参照
* `Unit`を返す関数での関数参照
* 関数の引数の数に基づいて適応する参照
* 呼び出し可能参照での`suspend`変換

#### デフォルト引数値を持つ関数への参照

デフォルト引数値を持つ関数への呼び出し可能参照を使用できるようになりました。関数`foo`への呼び出し可能参照が引数を持たない場合、デフォルト値`0`が使用されます。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

以前は、デフォルト引数値を使用するために、関数`apply`に追加のオーバーロードを記述する必要がありました。

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### Unitを返す関数での関数参照

Kotlin 1.4では、`Unit`を返す関数で、任意の型を返す関数への呼び出し可能参照を使用できます。
Kotlin 1.4より前は、この場合ラムダ引数しか使用できませんでした。現在は、ラムダ引数と呼び出し可能参照の両方を使用できます。

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 関数の引数の数に基づいて適応する参照

可変数の引数（`vararg`）を渡すときに、関数への呼び出し可能参照を適応させることができるようになりました。
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

#### 呼び出し可能参照でのsuspend変換

ラムダに対する`suspend`変換に加え、Kotlinはバージョン1.4.0から呼び出し可能参照に対する`suspend`変換もサポートするようになりました。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### ループ内のwhen式でのbreakとcontinueの使用

Kotlin 1.3では、ループ内に含まれる`when`式内で非修飾の`break`と`continue`を使用することはできませんでした。その理由は、これらのキーワードが`when`式での[フォールスルーの振る舞い](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)のために予約されていたためです。

そのため、ループ内の`when`式で`break`と`continue`を使用したい場合は、それらを[ラベル付け](returns.md#break-and-continue-labels)する必要があり、これはかなり面倒でした。

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

Kotlin 1.4では、ループ内に含まれる`when`式内でラベルなしで`break`と`continue`を使用できます。これらは、最も近い囲むループを終了するか、その次のステップに進むという期待通りの動作をします。

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

`when`内のフォールスルーの振る舞いは、今後の設計の対象となります。

## IDEの新機能

Kotlin 1.4では、IntelliJ IDEAの新しいツールを使用してKotlin開発を簡素化できます。

* [新しい柔軟なプロジェクトウィザード](#new-flexible-project-wizard)
* [コルーチンデバッガー](#coroutine-debugger)

### 新しい柔軟なプロジェクトウィザード

柔軟な新しいKotlinプロジェクトウィザードを使用すると、UIなしでは設定が難しいマルチプラットフォームプロジェクトを含む、さまざまな種類のKotlinプロジェクトを簡単に作成および設定できます。

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

新しいKotlinプロジェクトウィザードは、シンプルで柔軟です。

1. やりたいことに応じて、*プロジェクトテンプレートを選択します*。今後、さらに多くのテンプレートが追加される予定です。
2. *ビルドシステムを選択します* – Gradle（KotlinまたはGroovy DSL）、Maven、またはIntelliJ IDEA。
    Kotlinプロジェクトウィザードは、選択されたプロジェクトテンプレートでサポートされているビルドシステムのみを表示します。
3. *プロジェクト構造をメイン画面で直接プレビューします*。

その後、プロジェクトの作成を完了するか、オプションで次の画面で*プロジェクトを設定します*。

4. このプロジェクトテンプレートでサポートされている*モジュールとターゲットを追加/削除します*。
5. *モジュールとターゲットの設定を行います*。例えば、ターゲットJVMバージョン、ターゲットテンプレート、テストフレームワークなどです。

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

将来的には、Kotlinプロジェクトウィザードにさらに多くの設定オプションとテンプレートを追加することで、さらに柔軟にする予定です。

以下のチュートリアルを参考に、新しいKotlinプロジェクトウィザードを試すことができます。

* [Kotlin/JVMベースのコンソールアプリケーションを作成する](jvm-get-started.md)
* [React向けのKotlin/JSアプリケーションを作成する](js-react.md)
* [Kotlin/Nativeアプリケーションを作成する](native-get-started.md)

### コルーチンデバッガー

多くの人がすでに非同期プログラミングに[コルーチン](coroutines-guide.md)を使用しています。
しかし、Kotlin 1.4以前のコルーチンでのデバッグは、非常に厄介なものでした。コルーチンがスレッド間をジャンプするため、特定のコルーチンが何をしているのかを理解し、そのコンテキストを確認することが困難でした。場合によっては、ブレークポイントを越えてステップを追跡することが単に機能しませんでした。結果として、コルーチンを使用するコードをデバッグするために、ログ記録または精神的な努力に頼る必要がありました。

Kotlin 1.4では、Kotlinプラグインに搭載された新機能により、コルーチンのデバッグがはるかに便利になりました。

> デバッグは`kotlinx-coroutines-core`バージョン1.3.8以降で機能します。
>
{style="note"}

**デバッグツールウィンドウ**には、新しい**Coroutines**タブが含まれています。このタブでは、現在実行中および中断中のコルーチンの両方に関する情報を見つけることができます。コルーチンは、それらが実行されているディスパッチャによってグループ化されています。

![Debugging coroutines](coroutine-debugger-wn.png)

これで、次のことが可能になります。
* 各コルーチンの状態を簡単に確認できます。
* 実行中および中断中のコルーチンの両方について、ローカル変数とキャプチャされた変数の値を確認できます。
* 完全なコルーチン作成スタックと、コルーチン内の呼び出しスタックを確認できます。スタックには、標準のデバッグ中に失われる可能性のある変数値を伴うすべてのフレームが含まれています。

各コルーチンの状態とそのスタックを含む完全なレポートが必要な場合は、**Coroutines**タブ内を右クリックし、**Get Coroutines Dump**をクリックします。現在、コルーチンダンプはかなり単純ですが、今後のKotlinバージョンでより読みやすく、役立つものにする予定です。

![Coroutines Dump](coroutines-dump-wn.png)

[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)および[IntelliJ IDEAドキュメント](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)でコルーチンのデバッグについて詳しく学ぶ。

## 新しいコンパイラ

新しいKotlinコンパイラは非常に高速になり、サポートされているすべてのプラットフォームを統合し、コンパイラ拡張のためのAPIを提供します。これは長期的なプロジェクトであり、Kotlin 1.4.0ではすでにいくつかのステップを完了しています。

* [新しい、より強力な型推論アルゴリズム](#new-more-powerful-type-inference-algorithm)がデフォルトで有効になっています。
* [新しいJVMおよびJS IRバックエンド](#unified-backends-and-extensibility)。これらは安定化すればデフォルトになります。

### 新しい、より強力な型推論アルゴリズム

Kotlin 1.4は、新しい、より強力な型推論アルゴリズムを使用しています。この新しいアルゴリズムは、Kotlin 1.3ではコンパイラオプションを指定することで試すことができましたが、現在はデフォルトで使用されています。新しいアルゴリズムで修正された問題の全リストは、[YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)で確認できます。以下に、最も顕著な改善点の一部を記載します。

* [型が自動的に推論されるケースの増加](#more-cases-where-type-is-inferred-automatically)
* [ラムダの最後の式に対するスマートキャスト](#smart-casts-for-a-lambda-s-last-expression)
* [呼び出し可能参照に対するスマートキャスト](#smart-casts-for-callable-references)
* [委譲プロパティのより良い推論](#better-inference-for-delegated-properties)
* [引数の異なるJavaインターフェースに対するSAM変換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [KotlinにおけるJava SAMインターフェース](#java-sam-interfaces-in-kotlin)

#### 型が自動的に推論されるケースの増加

新しい推論アルゴリズムは、古いアルゴリズムでは明示的に指定する必要があった多くのケースで型を推論します。
例えば、以下の例では、ラムダパラメータ`it`の型は`String?`に正しく推論されます。

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

Kotlin 1.3では、これを機能させるには明示的なラムダパラメータを導入するか、`to`を明示的なジェネリック引数を持つ`Pair`コンストラクタに置き換える必要がありました。

#### ラムダの最後の式に対するスマートキャスト

Kotlin 1.3では、ラムダ内の最後の式は、期待される型を指定しない限りスマートキャストされませんでした。したがって、以下の例では、Kotlin 1.3は`result`変数の型を`String?`として推論します。

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

Kotlin 1.4では、新しい推論アルゴリズムのおかげで、ラムダ内の最後の式がスマートキャストされ、この新しい、より正確な型が、結果となるラムダの型を推論するために使用されます。したがって、`result`変数の型は`String`になります。

Kotlin 1.3では、このようなケースを機能させるために、明示的なキャスト（`!!`または`as String`のような型キャスト）を追加する必要があることがよくありましたが、現在はこれらのキャストは不要になりました。

#### 呼び出し可能参照に対するスマートキャスト

Kotlin 1.3では、スマートキャストされた型のメンバー参照にアクセスできませんでした。Kotlin 1.4では、それが可能になりました。

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

`animal`変数が特定の型`Cat`および`Dog`にスマートキャストされた後、異なるメンバー参照`animal::meow`および`animal::woof`を使用できます。型チェックの後、サブタイプに対応するメンバー参照にアクセスできます。

#### 委譲プロパティのより良い推論

委譲プロパティの型は、`by`キーワードに続くデリゲート式を解析する際に考慮されませんでした。例えば、以下のコードは以前はコンパイルできませんでしたが、現在ではコンパイラが`old`と`new`パラメータの型を`String?`として正しく推論します。

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

#### 引数の異なるJavaインターフェースに対するSAM変換

Kotlinは当初からJavaインターフェースのSAM変換をサポートしていましたが、既存のJavaライブラリを扱う際に時折不便だったサポートされないケースが1つありました。2つのSAMインターフェースをパラメータとして取るJavaメソッドを呼び出す場合、両方の引数はラムダまたは通常のオブジェクトのいずれかである必要がありました。一方の引数をラムダとして渡し、もう一方をオブジェクトとして渡すことはできませんでした。

新しいアルゴリズムはこの問題を修正し、どんな場合でもSAMインターフェースの代わりにラムダを渡すことができ、これは自然に期待される動作です。

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

#### KotlinにおけるJava SAMインターフェース

Kotlin 1.4では、KotlinでJava SAMインターフェースを使用し、それらにSAM変換を適用できます。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

Kotlin 1.3では、SAM変換を実行するには、上記の関数`foo`をJavaコードで宣言する必要がありました。

### 統合されたバックエンドと拡張性

Kotlinには、実行可能ファイルを生成する3つのバックエンドがあります。Kotlin/JVM、Kotlin/JS、Kotlin/Nativeです。Kotlin/JVMとKotlin/JSはそれぞれ独立して開発されたため、多くのコードを共有していません。Kotlin/Nativeは、Kotlinコードの中間表現（IR）を中心に構築された新しいインフラストラクチャに基づいています。

現在、Kotlin/JVMとKotlin/JSを同じIRに移行しています。その結果、3つのバックエンドすべてが多くのロジックを共有し、統一されたパイプラインを持っています。これにより、ほとんどの機能、最適化、バグ修正をすべてのプラットフォームで一度に実装できます。どちらの新しいIRベースのバックエンドも[Alpha](components-stability.md)安定性です。

共通のバックエンドインフラストラクチャは、マルチプラットフォームコンパイラ拡張の道も開きます。パイプラインに接続し、すべてのプラットフォームで自動的に機能するカスタム処理と変換を追加できるようになります。

現在Alpha版である新しい[JVM IR](#new-jvm-ir-backend)および[JS IR](#new-js-ir-backend)バックエンドを使用し、フィードバックを共有していただくことをお勧めします。

## Kotlin/JVM

Kotlin 1.4.0には、以下のようなJVM固有の改善が多数含まれています。

* [新しいJVM IRバックエンド](#new-jvm-ir-backend)
* [インターフェースにデフォルトメソッドを生成するための新しいモード](#new-modes-for-generating-default-methods)
* [nullチェックのための統一された例外型](#unified-exception-type-for-null-checks)
* [JVMバイトコードにおける型アノテーション](#type-annotations-in-the-jvm-bytecode)

### 新しいJVM IRバックエンド

Kotlin/JSと同様に、Kotlin/JVMも[統合されたIRバックエンド](#unified-backends-and-extensibility)に移行しています。これにより、ほとんどの機能やバグ修正をすべてのプラットフォームで一度に実装できます。また、これを利用して、すべてのプラットフォームで機能するマルチプラットフォーム拡張を作成することもできます。

Kotlin 1.4.0では、そのような拡張のための公開APIはまだ提供されていませんが、私たちは[Jetpack Compose](https://developer.android.com/jetpack/compose)を含むパートナーと密接に協力しており、彼らはすでに新しいバックエンドを使用してコンパイラプラグインを構築しています。

現在Alpha版である新しいKotlin/JVMバックエンドを試していただき、[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)に問題や機能リクエストを提出していただくことをお勧めします。これにより、コンパイラのパイプラインを統一し、Jetpack Composeのようなコンパイラ拡張をKotlinコミュニティに迅速に提供できるようになります。

新しいJVM IRバックエンドを有効にするには、Gradleビルドスクリプトで追加のコンパイラオプションを指定します。

```kotlin
kotlinOptions.useIR = true
```

> [Jetpack Composeを有効にする](https://developer.android.com/jetpack/compose/setup?hl=en)と、`kotlinOptions`でコンパイラオプションを指定することなく、新しいJVMバックエンドに自動的にオプトインされます。
>
{style="note"}

コマンドラインコンパイラを使用する場合は、`-Xuse-ir`コンパイラオプションを追加します。

> 新しいJVM IRバックエンドによってコンパイルされたコードは、新しいバックエンドを有効にした場合にのみ使用できます。そうしないと、エラーが発生します。
> この点を考慮すると、ライブラリの作者が本番環境で新しいバックエンドに切り替えることはお勧めしません。
>
{style="note"}

### デフォルトメソッドを生成するための新しいモード

KotlinコードをJVM 1.8以降のターゲットにコンパイルする場合、Kotlinインターフェースの非抽象メソッドをJavaの`default`メソッドにコンパイルできました。この目的のために、そのようなメソッドをマークするための`@JvmDefault`アノテーションと、このアノテーションの処理を有効にする`-Xjvm-default`コンパイラオプションを含むメカニズムがありました。

1.4.0では、デフォルトメソッドを生成するための新しいモードである`-Xjvm-default=all`を追加しました。これは、Kotlinインターフェースの*すべての*非抽象メソッドを`default` Javaメソッドにコンパイルします。`default`なしでコンパイルされたインターフェースを使用するコードとの互換性のために、`all-compatibility`モードも追加しました。

Java相互運用におけるデフォルトメソッドの詳細については、[相互運用性ドキュメント](java-to-kotlin-interop.md#default-methods-in-interfaces)および[このブログ記事](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### nullチェックのための統一された例外型

Kotlin 1.4.0以降、すべてのランタイムnullチェックは、`KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException`、および`TypeCastException`の代わりに`java.lang.NullPointerException`をスローするようになります。これは、`!!`演算子、メソッドのプリアンブルにおけるパラメータのnullチェック、プラットフォーム型式でのnullチェック、および非null許容型に対する`as`演算子に適用されます。
これは、`lateinit` nullチェックや`checkNotNull`、`requireNotNull`のような明示的なライブラリ関数呼び出しには適用されません。

この変更により、KotlinコンパイラまたはAndroidの[R8オプティマイザ](https://developer.android.com/studio/build/shrink-code)などのさまざまな種類のバイトコード処理ツールによって実行できるnullチェック最適化の数が増加します。

開発者の視点から見ると、大きな変更はありません。Kotlinコードは以前と同じエラーメッセージで例外をスローします。例外の型は変わりますが、渡される情報は同じままです。

### JVMバイトコードにおける型アノテーション

Kotlinは、JVMバイトコード（ターゲットバージョン1.8以上）に型アノテーションを生成できるようになり、ランタイムでJavaリフレクションから利用できるようになりました。
バイトコードに型アノテーションを出力するには、以下の手順に従います。

1. 宣言されたアノテーションが適切なアノテーションターゲット（Javaの`ElementType.TYPE_USE`またはKotlinの`AnnotationTarget.TYPE`）と保持ポリシー（`AnnotationRetention.RUNTIME`）を持っていることを確認します。
2. アノテーションクラス宣言をJVMバイトコードターゲットバージョン1.8+にコンパイルします。これは`-jvm-target=1.8`コンパイラオプションで指定できます。
3. アノテーションを使用するコードをJVMバイトコードターゲットバージョン1.8+（`-jvm-target=1.8`）にコンパイルし、`-Xemit-jvm-type-annotations`コンパイラオプションを追加します。

標準ライブラリはターゲットバージョン1.6でコンパイルされているため、現時点では標準ライブラリからの型アノテーションはバイトコードに出力されないことに注意してください。

現在、基本的なケースのみがサポートされています。

- メソッドパラメータ、メソッド戻り値型、およびプロパティ型に対する型アノテーション
- `Smth<@Ann Foo>`、`Array<@Ann Foo>`のような型引数の不変射影

以下の例では、`String`型に対する`@Foo`アノテーションはバイトコードに出力され、ライブラリコードで使用できます。

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JSプラットフォームでは、Kotlin 1.4.0は以下の改善を提供します。

- [新しいGradle DSL](#new-gradle-dsl)
- [新しいJS IRバックエンド](#new-js-ir-backend)

### 新しいGradle DSL

`kotlin.js` Gradleプラグインには調整されたGradle DSLが付属しており、多数の新しい設定オプションを提供し、`kotlin-multiplatform`プラグインが使用するDSLにより密接に合わせられています。最も影響の大きい変更の一部は以下の通りです。

- `binaries.executable()`を介した実行可能ファイルの作成の明示的な切り替え。[Kotlin/JSとその環境の実行について詳しくはこちら](js-project-setup.md#execution-environments)を参照してください。
- `cssSupport`を介したGradle設定内からのwebpackのCSSおよびスタイルローダーの設定。[CSSとスタイルローダーの使用について詳しくはこちら](js-project-setup.md#css)を参照してください。
- npm依存関係の管理が改善され、必須のバージョン番号または[semver](https://docs.npmjs.com/about-semantic-versioning)バージョン範囲に加え、`devNpm`、`optionalNpm`、`peerNpm`を使用した_開発_、_ピア_、_オプション_のnpm依存関係がサポートされました。[Gradleから直接npmパッケージの依存関係管理について詳しくはこちら](js-project-setup.md#npm-dependencies)を参照してください。
- [Dukat](https://github.com/Kotlin/dukat)（Kotlin外部宣言のためのジェネレーター）とのより強力な統合。外部宣言はビルド時に生成することも、Gradleタスクを介して手動で生成することもできます。

### 新しいJS IRバックエンド

現在[Alpha](components-stability.md)安定性である[Kotlin/JSのIRバックエンド](js-ir-compiler.md)は、デッドコード削除による生成コードサイズの削減、JavaScriptおよびTypeScriptとの相互運用性の改善など、Kotlin/JSターゲットに特化した新しい機能を提供します。

Kotlin/JS IRバックエンドを有効にするには、`gradle.properties`ファイルで`kotlin.js.compiler=ir`キーを設定するか、Gradleビルドスクリプトの`js`関数に`IR`コンパイラタイプを渡します。

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

新しいバックエンドの設定方法に関する詳細情報については、[Kotlin/JS IRコンパイラドキュメント](js-ir-compiler.md)を参照してください。

新しい[@JsExport](js-to-kotlin-interop.md#jsexport-annotation)アノテーションと、**[KotlinコードからTypeScript定義を生成する](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)**機能により、Kotlin/JS IRコンパイラバックエンドはJavaScript＆TypeScriptの相互運用性を向上させます。これにより、Kotlin/JSコードを既存のツールと統合し、**ハイブリッドアプリケーション**を作成し、マルチプラットフォームプロジェクトでコード共有機能を活用することも容易になります。

[Kotlin/JS IRコンパイラバックエンドで利用可能な機能について詳しく学ぶ](js-ir-compiler.md)。

## Kotlin/Native

1.4.0では、Kotlin/Nativeに多くの新機能と改善が加えられました。これには以下が含まれます。

* [SwiftおよびObjective-CでのKotlinの中断関数（suspend function）のサポート](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [デフォルトでのObjective-Cジェネリクスのサポート](#objective-c-generics-support-by-default)
* [Objective-C/Swiftの相互運用における例外処理](#exception-handling-in-objective-c-swift-interop)
* [Appleターゲットでリリース`.dSYM`をデフォルトで生成](#generate-release-dsyms-on-apple-targets-by-default)
* [パフォーマンスの改善](#performance-improvements)
* [CocoaPods依存関係の管理の簡素化](#simplified-management-of-cocoapods-dependencies)

### SwiftおよびObjective-CでのKotlinの中断関数（suspend function）のサポート

1.4.0では、SwiftおよびObjective-Cでの中断関数の基本的なサポートを追加しました。KotlinモジュールをAppleフレームワークにコンパイルすると、中断関数はコールバックを伴う関数（Swift/Objective-Cの用語では`completionHandler`）として利用できるようになります。生成されたフレームワークのヘッダーにそのような関数がある場合、SwiftまたはObjective-Cコードからそれらを呼び出し、オーバーライドすることもできます。

例えば、次のKotlin関数を記述した場合:

```kotlin
suspend fun queryData(id: Int): String = ...
```

...Swiftから次のように呼び出すことができます。

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[SwiftおよびObjective-Cでの中断関数の使用について詳しく学ぶ](native-objc-interop.md)。

### デフォルトでのObjective-Cジェネリクスのサポート

以前のバージョンのKotlinでは、Objective-Cの相互運用におけるジェネリクスに関する実験的なサポートが提供されていました。1.4.0以降、Kotlin/NativeはデフォルトでKotlinコードからジェネリクスを含むAppleフレームワークを生成します。場合によっては、これによりKotlinフレームワークを呼び出す既存のObjective-CまたはSwiftコードが壊れる可能性があります。ジェネリクスなしでフレームワークヘッダーを記述するには、`-Xno-objc-generics`コンパイラオプションを追加します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

[Objective-Cとの相互運用に関するドキュメント](native-objc-interop.md#generics)に記載されているすべての詳細と制限事項は、引き続き有効です。

### Objective-C/Swiftの相互運用における例外処理

1.4.0では、Kotlinから生成されるSwift APIについて、例外の変換方法に関してわずかに変更を加えています。KotlinとSwiftの間には、エラー処理において根本的な違いがあります。Kotlinの例外はすべて非チェック例外ですが、Swiftにはチェック済みエラーしかありません。したがって、Swiftコードが期待される例外を認識できるようにするには、Kotlin関数を`@Throws`アノテーションでマークし、潜在的な例外クラスのリストを指定する必要があります。

SwiftまたはObjective-Cフレームワークにコンパイルする場合、`@Throws`アノテーションを持つ、またはそれを継承する関数は、Objective-Cでは`NSError*`を生成するメソッドとして、Swiftでは`throws`メソッドとして表現されます。

以前は、`RuntimeException`と`Error`以外のすべての例外は`NSError`として伝播されました。現在この動作は変更され、`NSError`は`@Throws`アノテーションのパラメータとして指定されたクラス（またはそのサブクラス）のインスタンスである例外に対してのみスローされます。Swift/Objective-Cに到達する他のKotlin例外は未処理と見なされ、プログラムを終了させます。

### Appleターゲットでリリース.dSYMをデフォルトで生成

1.4.0以降、Kotlin/Nativeコンパイラは、Darwinプラットフォーム上のリリースバイナリに対してデフォルトで[デバッグシンボルファイル](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)（`.dSYM`）を生成します。これは、`-Xadd-light-debug=disable`コンパイラオプションで無効にできます。他のプラットフォームでは、このオプションはデフォルトで無効になっています。Gradleでこのオプションを切り替えるには、次を使用します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[クラッシュレポートのシンボリケーションについて詳しく学ぶ](native-ios-symbolication.md)。

### パフォーマンスの改善

Kotlin/Nativeは、開発プロセスと実行の両方を高速化する多くのパフォーマンス改善を受けました。以下にいくつかの例を示します。

- オブジェクト割り当ての速度を改善するために、システムアロケータの代替として[mimalloc](https://github.com/microsoft/mimalloc)メモリ割り当て器を提供するようになりました。mimallocは一部のベンチマークで最大2倍高速に動作します。
現在、Kotlin/Nativeにおけるmimallocの使用は実験的です。`-Xallocator=mimalloc`コンパイラオプションを使用して切り替えることができます。

- C相互運用ライブラリの構築方法を見直しました。新しいツールを使用すると、Kotlin/Nativeは以前よりも最大4倍高速に相互運用ライブラリを生成し、アーティファクトは以前の25%から30%のサイズになります。

- GCの最適化により、全体的なランタイムパフォーマンスが向上しました。この改善は、多数の長期間存続するオブジェクトを持つプロジェクトで特に顕著になります。`HashMap`および`HashSet`コレクションは、冗長なボクシングを回避することで高速に動作するようになりました。

- 1.3.70では、Kotlin/Nativeコンパイルのパフォーマンスを改善するための2つの新機能、[プロジェクト依存関係のキャッシュとGradleデーモンからのコンパイラ実行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)を導入しました。
それ以来、私たちは多数の問題を修正し、これらの機能の全体的な安定性を向上させました。

### CocoaPods依存関係の管理の簡素化

以前は、プロジェクトを依存関係マネージャーCocoaPodsと統合すると、マルチプラットフォームプロジェクトの他の部分とは別に、プロジェクトのiOS、macOS、watchOS、またはtvOS部分をXcodeでのみビルドできました。これらの他の部分はIntelliJ IDEAでビルドできました。

さらに、CocoaPodsに保存されているObjective-Cライブラリ（Podライブラリ）への依存関係を追加するたびに、IntelliJ IDEAからXcodeに切り替え、`pod install`を呼び出し、そこでXcodeビルドを実行する必要がありました。

これで、IntelliJ IDEAでPod依存関係を直接管理できるようになり、コードのハイライトや補完など、コードを扱う上でIntelliJ IDEAが提供するメリットを享受できます。Xcodeに切り替えることなく、GradleでKotlinプロジェクト全体をビルドすることもできます。これは、Swift/Objective-Cコードを記述したり、シミュレータまたはデバイスでアプリケーションを実行したりする必要がある場合にのみ、Xcodeに移動する必要があることを意味します。

また、ローカルに保存されているPodライブラリを操作することもできます。

必要に応じて、以下の間に依存関係を追加できます。
* CocoaPodsリポジトリにリモートで保存されているPodライブラリ、またはローカルに保存されているPodライブラリとKotlinプロジェクト。
* Kotlin Pod（CocoaPods依存関係として使用されるKotlinプロジェクト）と1つ以上のターゲットを持つXcodeプロジェクト。

初期設定を完了し、`cocoapods`に新しい依存関係を追加する場合は、IntelliJ IDEAでプロジェクトを再インポートするだけです。新しい依存関係が自動的に追加されます。追加のステップは不要です。

[依存関係の追加方法について詳しく学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。

## Kotlin Multiplatform

> マルチプラットフォームプロジェクトのサポートは[Alpha](components-stability.md)段階です。互換性のない変更があり、将来的に手動での移行が必要になる場合があります。
> [YouTrack](https://youtrack.jetbrains.com/issues/KT)でフィードバックをお寄せください。
>
{style="warning"}

[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)は、[異なるプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)向けに同じコードを記述・保守する時間を削減し、ネイティブプログラミングの柔軟性と利点を維持します。私たちは引き続きマルチプラットフォーム機能と改善に努力を投資しています。

* [階層的なプロジェクト構造による複数のターゲットでのコード共有](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [階層構造におけるネイティブライブラリの活用](#leveraging-native-libs-in-the-hierarchical-structure)
* [`kotlinx`依存関係を一度だけ指定する](#specifying-dependencies-only-once)

> マルチプラットフォームプロジェクトにはGradle 6.0以降が必要です。
>
{style="note"}

### 階層的なプロジェクト構造による複数のターゲットでのコード共有

新しい階層的なプロジェクト構造のサポートにより、[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)で[複数のプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)間でコードを共有できます。

以前は、マルチプラットフォームプロジェクトに追加されたコードは、プラットフォーム固有のソースセット（1つのターゲットに限定され、他のプラットフォームでは再利用できない）に配置されるか、`commonMain`や`commonTest`のような共通ソースセット（プロジェクト内のすべてのプラットフォームで共有される）に配置されるかのいずれかでした。共通ソースセットでは、プラットフォーム固有の`actual`実装を必要とする[`expect`宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用することによってのみ、プラットフォーム固有のAPIを呼び出すことしかできませんでした。

これにより、[すべてのプラットフォームでコードを共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)のは容易でしたが、[特定のターゲット、特に似たようなターゲット間でのみ共有する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)のはそれほど容易ではありませんでした。似たようなターゲットは、多くの共通ロジックとサードパーティAPIを再利用できる可能性がありました。

例えば、iOSをターゲットとする典型的なマルチプラットフォームプロジェクトでは、iOS関連のターゲットが2つあります。1つはiOS ARM64デバイス用、もう1つはx64シミュレータ用です。これらは個別のプラットフォーム固有のソースセットを持っていますが、実際にはデバイスとシミュレータで異なるコードが必要となることは稀で、依存関係もよく似ています。そのため、iOS固有のコードをそれらの間で共有できます。

明らかに、この設定では、*2つのiOSターゲットのための共有ソースセット*を持ち、iOSデバイスとシミュレータの両方に共通のAPIをKotlin/Nativeコードから直接呼び出すことができるようにすることが望ましいでしょう。

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

これで、[階層的なプロジェクト構造のサポート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)により、これが可能になりました。このサポートは、各ソースセットで利用可能なAPIと言語機能を、どのターゲットがそれらを消費するかに基づいて推論し、適応させます。

ターゲットの一般的な組み合わせについては、ターゲットショートカットを使用して階層構造を作成できます。
例えば、`ios()`ショートカットを使用して、上記の2つのiOSターゲットと共有ソースセットを作成します。

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

他のターゲットの組み合わせについては、`dependsOn`関係でソースセットを接続して[手動で階層を作成します](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)。

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

階層的なプロジェクト構造のおかげで、ライブラリもターゲットのサブセットに対して共通APIを提供できます。
[ライブラリでのコード共有について詳しく学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)。

### 階層構造におけるネイティブライブラリの活用

Foundation、UIKit、POSIXなどのプラットフォーム依存ライブラリを、複数のネイティブターゲット間で共有されるソースセットで使用できます。これにより、プラットフォーム固有の依存関係に制限されることなく、より多くのネイティブコードを共有するのに役立ちます。

追加のステップは不要です。すべて自動的に行われます。IntelliJ IDEAは、共有コードで使用できる共通の宣言を検出するのに役立ちます。

[プラットフォーム依存ライブラリの使用について詳しく学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。

### 依存関係を一度だけ指定する

これからは、共有ソースセットとプラットフォーム固有のソースセットで使用される同じライブラリの異なるバリアントに対する依存関係をそれぞれ指定する代わりに、共有ソースセットで一度だけ依存関係を指定する必要があります。

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

`-common`、`-native`などのプラットフォームを指定するサフィックスを持つ`kotlinx`ライブラリアーティファクト名は、もはやサポートされていないため、使用しないでください。代わりに、上記の例では`kotlinx-coroutines-core`であるライブラリのベースアーティファクト名を使用してください。

ただし、この変更は現在のところ、以下には影響しません。
* `stdlib`ライブラリ – Kotlin 1.4.0以降、[`stdlib`依存関係は自動的に追加されます](#dependency-on-the-standard-library-added-by-default)。
* `kotlin.test`ライブラリ – 引き続き`test-common`と`test-annotations-common`を使用する必要があります。これらの依存関係は後で対処されます。

特定のプラットフォームのみに依存関係が必要な場合は、`-jvm`や`-js`のようなサフィックスを持つ標準および`kotlinx`ライブラリのプラットフォーム固有のバリアントを、例えば`kotlinx-coroutines-core-jvm`のように引き続き使用できます。

[依存関係の設定について詳しく学ぶ](gradle-configure-project.md#configure-dependencies)。

## Gradleプロジェクトの改善

[Kotlin Multiplatform](#kotlin-multiplatform)、[Kotlin/JVM](#kotlin-jvm)、[Kotlin/Native](#kotlin-native)、[Kotlin/JS](#kotlin-js)に固有のGradleプロジェクト機能と改善に加えて、すべてのKotlin Gradleプロジェクトに適用されるいくつかの変更があります。

* [標準ライブラリへの依存関係がデフォルトで追加されるようになりました](#dependency-on-the-standard-library-added-by-default)
* [Kotlinプロジェクトには最新バージョンのGradleが必要](#minimum-gradle-version-for-kotlin-projects)
* [IDEにおけるKotlin Gradle DSLのサポートの改善](#improved-gradle-kts-support-in-the-ide)

### 標準ライブラリへの依存関係がデフォルトで追加されるようになりました

マルチプラットフォームプロジェクトを含む、すべてのKotlin Gradleプロジェクトで`stdlib`ライブラリへの依存関係を宣言する必要がなくなりました。
依存関係はデフォルトで追加されます。

自動的に追加される標準ライブラリは、Kotlin Gradleプラグインと同じバージョンになります。これらは同じバージョン管理を使用しているためです。

プラットフォーム固有のソースセットには、対応するプラットフォーム固有のライブラリバリアントが使用され、残りの部分には共通の標準ライブラリが追加されます。Kotlin Gradleプラグインは、Gradleビルドスクリプトの`kotlinOptions.jvmTarget`[コンパイラオプション](gradle-compiler-options.md)に応じて、適切なJVM標準ライブラリを選択します。

[デフォルトの振る舞いを変更する方法について学ぶ](gradle-configure-project.md#dependency-on-the-standard-library)。

### Kotlinプロジェクトには最新バージョンのGradleが必要

Kotlinプロジェクトで新機能を楽しむには、Gradleを[最新バージョン](https://gradle.org/releases/)に更新してください。
マルチプラットフォームプロジェクトにはGradle 6.0以降が必要ですが、他のKotlinプロジェクトはGradle 5.4以降で動作します。

### IDEにおける*.gradle.ktsサポートの改善

1.4.0では、Gradle Kotlin DSLスクリプト（`*.gradle.kts`ファイル）に対するIDEサポートの改善を続けました。新しいバージョンがもたらすものは以下の通りです。

- パフォーマンス向上のための_スクリプト構成の明示的な読み込み_。以前は、ビルドスクリプトへの変更がバックグラウンドで自動的に読み込まれていました。パフォーマンスを改善するため、1.4.0ではビルドスクリプト構成の自動読み込みを無効にしました。IDEは、明示的に適用した場合にのみ変更を読み込みます。

  Gradle 6.0より前のバージョンでは、エディタで**Load Configuration**をクリックしてスクリプト構成を手動で読み込む必要があります。

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  Gradle 6.0以降では、**Load Gradle Changes**をクリックするか、Gradleプロジェクトを再インポートすることで、明示的に変更を適用できます。
 
  IntelliJ IDEA 2020.1とGradle 6.0以降では、**Load Script Configurations**というアクションが追加されました。これは、プロジェクト全体を更新せずにスクリプト構成への変更を読み込みます。これは、プロジェクト全体を再インポートするよりもはるかに短い時間で済みます。

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  新しく作成されたスクリプトや、新しいKotlinプラグインを使用して初めてプロジェクトを開く場合も、**Load Script Configurations**を行う必要があります。
  
  Gradle 6.0以降では、以前の個別に読み込まれる実装とは異なり、すべてのスクリプトを一度に読み込むことができるようになりました。各リクエストにはGradle構成フェーズの実行が必要となるため、大規模なGradleプロジェクトではリソースを大量に消費する可能性がありました。
  
  現在、このような読み込みは`build.gradle.kts`および`settings.gradle.kts`ファイルに限定されています（関連する[課題](https://github.com/gradle/gradle/issues/12640)に投票してください）。
  `init.gradle.kts`または適用された[スクリプトプラグイン](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)のハイライトを有効にするには、古いメカニズム（スタンドアロンスクリプトに追加する）を使用してください。これらのスクリプトの構成は、必要に応じて個別に読み込まれます。
  そのようなスクリプトの自動リロードを有効にすることもできます。
    
  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)
  
- _より良いエラー報告_。以前は、Gradleデーモンからのエラーを別のログファイルでしか確認できませんでした。現在、Gradleデーモンはエラーに関するすべての情報を直接返し、ビルドツールウィンドウに表示します。これにより、時間と労力の両方を節約できます。

## 標準ライブラリ

以下は、1.4.0のKotlin標準ライブラリにおける最も重要な変更点です。

- [共通の例外処理API](#common-exception-processing-api)
- [配列とコレクションのための新しい関数](#new-functions-for-arrays-and-collections)
- [文字列操作のための関数](#functions-for-string-manipulations)
- [ビット操作](#bit-operations)
- [委譲プロパティの改善](#delegated-properties-improvements)
- [KTypeからJava Typeへの変換](#converting-from-ktype-to-java-type)
- [KotlinリフレクションのためのProguard設定](#proguard-configurations-for-kotlin-reflection)
- [既存APIの改善](#improving-the-existing-api)
- [stdlibアーティファクトの`module-info`ディスクリプタ](#module-info-descriptors-for-stdlib-artifacts)
- [非推奨機能](#deprecations)
- [非推奨の実験的コルーチンの除外](#exclusion-of-the-deprecated-experimental-coroutines)

### 共通の例外処理API

以下のAPI要素は共通ライブラリに移動されました。

* このThrowableとそのスタックトレースの詳細な記述を返す`Throwable.stackTraceToString()`拡張関数、およびこの記述を標準エラー出力にプリントする`Throwable.printStackTrace()`。
* 例外をデリバーするために抑制された例外を指定できる`Throwable.addSuppressed()`関数、およびすべての抑制された例外のリストを返す`Throwable.suppressedExceptions`プロパティ。
* 関数がプラットフォームメソッド（JVMまたはネイティブプラットフォーム上）にコンパイルされる際にチェックされる例外型をリストする`@Throws`アノテーション。

### 配列とコレクションのための新しい関数

#### コレクション

1.4.0では、標準ライブラリに**コレクション**を扱うための便利な関数が多数含まれています。

* `setOfNotNull()`は、提供された引数の中からすべての非null項目で構成されるセットを作成します。

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* シーケンスのための`shuffled()`。

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

* `onEach()`と`flatMap()`の`*Indexed()`対応関数。
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

* `randomOrNull()`、`reduceOrNull()`、`reduceIndexedOrNull()`の`*OrNull()`対応関数。
これらは空のコレクションに対して`null`を返します。

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

* `runningFold()`、その同義語である`scan()`、および`runningReduce()`は、`fold()`および`reduce()`と同様に、指定された操作をコレクション要素に順次適用します。違いは、これらの新しい関数が中間結果のシーケンス全体を返すことです。

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

* `sumOf()`はセレクタ関数を受け取り、コレクションのすべての要素に対するその値の合計を返します。
`sumOf()`は`Int`、`Long`、`Double`、`UInt`、`ULong`型の合計を生成できます。JVMでは、`BigInteger`と`BigDecimal`も利用可能です。

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

* `min()`および`max()`関数は、KotlinコレクションAPI全体で使用されている命名規則に準拠するために`minOrNull()`および`maxOrNull()`に改名されました。関数名の`*OrNull`サフィックスは、レシーバコレクションが空の場合に`null`を返すことを意味します。`minBy()`、`maxBy()`、`minWith()`、`maxWith()`にも同様に適用され、1.4では`*OrNull()`対応関数が追加されています。
* 新しい`minOf()`および`maxOf()`拡張関数は、コレクションの項目に対する指定されたセレクタ関数の最小値と最大値を返します。

    ```kotlin
    data class OrderItem(val name: String, val price = 10.0, val count = 1), // added "val count = 1" to remove unused variable warning
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    `Comparator`を引数に取る`minOfWith()`および`maxOfWith()`、および空のコレクションに対して`null`を返すこれら4つの関数の`*OrNull()`バージョンもあります。

* `flatMap`および`flatMapTo`の新しいオーバーロードにより、レシーバ型と一致しない戻り値型を持つ変換を使用できます。具体的には：
    * `Iterable`、`Array`、`Map`に対する`Sequence`への変換
    * `Sequence`に対する`Iterable`への変換

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

* ミュータブルリストから要素を削除するための`removeFirst()`および`removeLast()`ショートカット、およびこれらの関数の`*orNull()`対応関数。

#### 配列

異なるコンテナ型を扱う際に一貫したエクスペリエンスを提供するために、**配列**のための新しい関数も追加しました。

* `shuffle()`は配列要素をランダムな順序に並べます。
* `onEach()`は各配列要素に対して与えられたアクションを実行し、配列自体を返します。
* `associateWith()`と`associateWithTo()`は配列要素をキーとしてマップを構築します。
* 配列サブレンジの`reverse()`はサブレンジ内の要素の順序を反転させます。
* 配列サブレンジの`sortDescending()`はサブレンジ内の要素を降順にソートします。
* 配列サブレンジの`sort()`と`sortWith()`は、共通ライブラリで利用可能になりました。

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

さらに、`CharArray`/`ByteArray`と`String`間の変換のための新しい関数があります。
* `ByteArray.decodeToString()`および`String.encodeToByteArray()`
* `CharArray.concatToString()`および`String.toCharArray()`

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

両端キューの実装である`ArrayDeque`クラスも追加しました。
両端キューは、キューの先頭または末尾の両方で償却定数時間で要素を追加または削除できます。コードでキューまたはスタックが必要な場合は、デフォルトで両端キューを使用できます。

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

`ArrayDeque`の実装は、内部では可変長配列を使用しています。コンテンツを循環バッファである`Array`に格納し、この`Array`がいっぱいになった場合にのみサイズを変更します。

### 文字列操作のための関数

1.4.0の標準ライブラリには、文字列操作のためのAPIに多くの改善が含まれています。

* `StringBuilder`には便利な新しい拡張関数があります。`set()`、`setRange()`、`deleteAt()`、`deleteRange()`、`appendRange()`などです。

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

* `StringBuilder`の既存の関数の一部は、共通ライブラリで利用可能です。これには、`append()`、`insert()`、`substring()`、`setLength()`などが含まれます。
* 新しい関数`Appendable.appendLine()`および`StringBuilder.appendLine()`が共通ライブラリに追加されました。これらは、JVMのみの`appendln()`関数を置き換えます。

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
* `countOneBits()`
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()`
* `rotateLeft()`と`rotateRight()`（実験的）

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

1.4.0では、Kotlinでの委譲プロパティの体験を改善するための新機能が追加されました。
- プロパティは別のプロパティに委譲できるようになりました。
- 新しいインターフェース`PropertyDelegateProvider`は、単一の宣言でデリゲートプロバイダを作成するのに役立ちます。
- `ReadWriteProperty`は`ReadOnlyProperty`を継承するようになったため、読み取り専用プロパティに両方を使用できます。

新しいAPIとは別に、結果として生成されるバイトコードサイズを削減するいくつかの最適化を行いました。これらの最適化については、[このブログ記事](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)で説明されています。

[委譲プロパティについて詳しく学ぶ](delegated-properties.md)。

### KTypeからJava Typeへの変換

stdlibの新しい拡張プロパティ`KType.javaType`（現在は実験的）は、`kotlin-reflect`全体の依存関係を使用せずに、Kotlin型から`java.lang.reflect.Type`を取得するのに役立ちます。

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

### KotlinリフレクションのためのProguard設定

1.4.0以降、KotlinリフレクションのためのProguard/R8設定が`kotlin-reflect.jar`に組み込まれました。これにより、R8またはProguardを使用するほとんどのAndroidプロジェクトは、追加の設定なしでkotlin-reflectと連携するはずです。
kotlin-reflectの内部のためのProguardルールをコピー＆ペーストする必要はなくなりました。ただし、リフレクトする予定のすべてのAPIを明示的にリストする必要はまだありますので注意してください。

### 既存APIの改善

* いくつかの関数はnullレシーバーでも機能するようになりました。例えば：
    * 文字列に対する`toBoolean()`
    * 配列に対する`contentEquals()`、`contentHashcode()`、`contentToString()`

* `Double`および`Float`における`NaN`、`NEGATIVE_INFINITY`、`POSITIVE_INFINITY`が`const`として定義されるようになったため、アノテーション引数として使用できます。

* `Double`および`Float`に新しい定数`SIZE_BITS`と`SIZE_BYTES`が追加され、型のインスタンスをバイナリ形式で表現するために使用されるビット数とバイト数が含まれています。

* `maxOf()`および`minOf()`トップレベル関数は、可変数の引数（`vararg`）を受け入れることができます。

### stdlibアーティファクトのmodule-infoディスクリプタ

Kotlin 1.4.0は、デフォルトの標準ライブラリアーティファクトに`module-info.java`モジュール情報を追加します。これにより、アプリケーションに必要なプラットフォームモジュールのみを含むカスタムJavaランタイムイメージを生成する[jlinkツール](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)でそれらを使用できるようになります。
以前からKotlin標準ライブラリアーティファクトでjlinkを使用できましたが、そのためには別のアーティファクト（"modular"分類子を持つもの）を使用する必要があり、全体的な設定は簡単ではありませんでした。
Androidでは、`module-info`を含むjarファイルを正しく処理できるAndroid Gradleプラグインバージョン3.2以降を使用していることを確認してください。

### 非推奨機能

#### DoubleとFloatのtoShort()とtoByte()

`Double`と`Float`の`toShort()`および`toByte()`関数は、値の範囲が狭く、変数のサイズが小さいため、予期せぬ結果を招く可能性があったため、非推奨になりました。

浮動小数点数を`Byte`または`Short`に変換するには、まず`Int`に変換し、次にターゲット型に変換するという2段階変換を使用してください。

#### 浮動小数点配列のcontains()、indexOf()、lastIndexOf()

`FloatArray`および`DoubleArray`の`contains()`、`indexOf()`、および`lastIndexOf()`拡張関数は、[IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)標準の等価性を使用しており、これが一部のコーナーケースで全順序の等価性と矛盾するため、非推奨になりました。[この課題](https://youtrack.jetbrains.com/issue/KT-28753)を参照してください。

#### min()およびmax()コレクション関数

`min()`および`max()`コレクション関数は、空のコレクションに対して`null`を返すという振る舞いをより適切に反映する`minOrNull()`と`maxOrNull()`が優先され、非推奨になりました。
[この課題](https://youtrack.jetbrains.com/issue/KT-38854)を参照してください。

### 非推奨の実験的コルーチンの除外

`kotlin.coroutines.experimental` APIは1.3.0で`kotlin.coroutines`に置き換えられ、非推奨になりました。1.4.0では、`kotlin.coroutines.experimental`の非推奨サイクルを完了し、標準ライブラリから削除します。JVM上でまだ使用している方のために、すべての実験的コルーチンAPIを含む互換性アーティファクト`kotlin-coroutines-experimental-compat.jar`を提供しています。これはMavenに公開されており、標準ライブラリとともにKotlinディストリビューションに含めています。

## 安定版JSONシリアライゼーション

Kotlin 1.4.0では、[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)の最初の安定版である1.0.0-RCを出荷します。これにより、`kotlinx-serialization-core`（以前は`kotlinx-serialization-runtime`として知られていた）のJSONシリアライゼーションAPIが安定版であることを発表できることを嬉しく思います。他のシリアライゼーション形式のライブラリは引き続き実験的であり、コアライブラリの一部の高度な部分も同様です。

JSONシリアライゼーションのAPIは、より一貫性があり使いやすいものにするために大幅に見直しました。今後は、後方互換性のある方法でJSONシリアライゼーションAPIの開発を続けます。
ただし、以前のバージョンを使用していた場合は、1.0.0-RCに移行する際にコードの一部を書き直す必要があります。
これをお手伝いするために、`kotlinx.serialization`の完全なドキュメントセットである**[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)**も提供しています。これは、最も重要な機能の使用プロセスを案内し、直面する可能性のある問題を解決するのに役立ちます。

>**注**: `kotlinx-serialization` 1.0.0-RCはKotlinコンパイラ1.4でのみ動作します。以前のコンパイラバージョンとは互換性がありません。
>
{style="note"}

## スクリプティングとREPL

1.4.0では、Kotlinでのスクリプティングは、機能およびパフォーマンスの改善、その他の更新の恩恵を受けています。
主な変更点をいくつかご紹介します。

- [新しい依存関係解決API](#new-dependencies-resolution-api)
- [新しいREPL API](#new-repl-api)
- [コンパイル済みスクリプトキャッシュ](#compiled-scripts-cache)
- [アーティファクト名の変更](#artifacts-renaming)

Kotlinでのスクリプティングに慣れるために、[例を含むプロジェクト](https://github.com/Kotlin/kotlin-script-examples)を用意しました。
これには、標準スクリプト（`*.main.kts`）の例と、KotlinスクリプティングAPIおよびカスタムスクリプト定義の使用例が含まれています。[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)を使用して、ぜひお試しいただき、フィードバックをお寄せください。

### 新しい依存関係解決API

1.4.0では、外部依存関係（Mavenアーティファクトなど）を解決するための新しいAPIと、その実装を導入しました。このAPIは、新しいアーティファクト`kotlin-scripting-dependencies`および`kotlin-scripting-dependencies-maven`で公開されています。
`kotlin-script-util`ライブラリの以前の依存関係解決機能は非推奨になりました。

### 新しいREPL API

新しい実験的なREPL APIがKotlinスクリプティングAPIの一部になりました。公開されたアーティファクトにはいくつかの実装があり、コード補完などの高度な機能を持つものもあります。私たちは[Kotlin Jupyterカーネル](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)でこのAPIを使用しており、独自のカスタムシェルやREPLで試すことができます。

### コンパイル済みスクリプトキャッシュ

KotlinスクリプティングAPIは、コンパイル済みスクリプトキャッシュを実装する機能を提供するようになりました。これにより、変更されていないスクリプトのその後の実行が大幅に高速化します。デフォルトの高度なスクリプト実装である`kotlin-main-kts`は、すでに独自のキャッシュを持っています。

### アーティファクト名の変更

アーティファクト名に関する混乱を避けるため、`kotlin-scripting-jsr223-embeddable`と`kotlin-scripting-jvm-host-embeddable`を、それぞれ`kotlin-scripting-jsr223`と`kotlin-scripting-jvm-host`に改名しました。これらのアーティファクトは、バンドルされたサードパーティライブラリをシェードして使用競合を回避する`kotlin-compiler-embeddable`アーティファクトに依存します。この名前変更により、`kotlin-compiler-embeddable`（一般的に安全です）の使用をスクリプティングアーティファクトのデフォルトにしています。
何らかの理由で、シェードされていない`kotlin-compiler`に依存するアーティファクトが必要な場合は、`-unshaded`サフィックスを持つアーティファクトバージョン（例：`kotlin-scripting-jsr223-unshaded`）を使用してください。この名前変更は、直接使用されることになっているスクリプティングアーティファクトにのみ影響し、他のアーティファクト名は変更されません。

## Kotlin 1.4.0への移行

Kotlinプラグインの移行ツールは、プロジェクトを以前のバージョンのKotlinから1.4.0に移行するのに役立ちます。

Kotlinバージョンを`1.4.0`に変更し、GradleまたはMavenプロジェクトを再インポートするだけです。IDEはその後、移行について尋ねます。
 
同意すると、コードをチェックし、動作しないものや1.4.0で推奨されないものについて修正を提案する移行コードインスペクションが実行されます。

![Run migration](run-migration-wn.png){width=300}

コードインスペクションにはさまざまな[重要度レベル](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)があり、どの提案を受け入れ、どれを無視するかを決定するのに役立ちます。

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0は[機能リリース](kotlin-evolution-principles.md#language-and-tooling-releases)であり、言語に互換性のない変更をもたらす可能性があります。そのような変更の詳細なリストは、**[Kotlin 1.4互換性ガイド](compatibility-guide-14.md)**に記載されています。