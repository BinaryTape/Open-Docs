---
title: "Kotlin 1.4.0 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[リリース日: 2020年8月17日](releases#release-details)_

Kotlin 1.4.0では、全コンポーネントに多くの改善が加えられ、[品質とパフォーマンスに重点](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)が置かれています。
以下に、Kotlin 1.4.0における最も重要な変更点の一覧を示します。

## 言語機能と改善点

Kotlin 1.4.0には、様々な言語機能と改善が加えられています。具体的には、以下の通りです。

* [Kotlinインターフェースに対するSAM変換](#sam-conversions-for-kotlin-interfaces)
* [ライブラリ作者のための明示的なAPIモード](#explicit-api-mode-for-library-authors)
* [名前付き引数と位置引数の混在](#mixing-named-and-positional-arguments)
* [末尾のカンマ](#trailing-comma)
* [呼び出し可能参照の改善](#callable-reference-improvements)
* [ループ内のwhen式内でのbreakとcontinueの使用](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlinインターフェースに対するSAM変換

Kotlin 1.4.0以前は、SAM (Single Abstract Method) 変換は、[KotlinからJavaメソッドやJavaインターフェースを操作する](java-interop#sam-conversions)場合にのみ適用できました。Kotlin 1.4.0からは、Kotlinインターフェースに対してもSAM変換を使用できるようになりました。
そのためには、Kotlinインターフェースを`fun`修飾子で明示的に関数型としてマークします。

SAM変換は、単一の抽象メソッドを1つだけ持つインターフェースがパラメータとして期待される場合に、ラムダを引数として渡すと適用されます。この場合、コンパイラはラムダを、抽象メンバー関数を実装するクラスのインスタンスに自動的に変換します。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

[Kotlinの関数型インターフェースとSAM変換についての詳細はこちら](fun-interfaces)。

### ライブラリ作者のための明示的なAPIモード

Kotlinコンパイラは、ライブラリ作者のために*明示的なAPIモード*を提供します。このモードでは、コンパイラはライブラリのAPIをより明確で一貫性のあるものにするのに役立つ追加のチェックを実行します。パブリックAPIに公開される宣言には、以下の要件が追加されます。

* デフォルトの可視性がパブリックAPIに公開する場合、宣言には可視性修飾子が必要です。これにより、意図せずに宣言がパブリックAPIに公開されるのを防ぎます。
* パブリックAPIに公開されるプロパティと関数には、明示的な型指定が必要です。これにより、APIユーザーは使用するAPIメンバーの型を認識していることが保証されます。

構成によっては、これらの明示的なAPIはエラー（*strict*モード）または警告（*warning*モード）を生成する可能性があります。
読みやすさと常識を考慮して、特定の種類の宣言はこのようなチェックから除外されます。

* プライマリコンストラクタ
* データクラスのプロパティ
* プロパティゲッターとセッター
* `override`メソッド

明示的なAPIモードは、モジュールのプロダクションソースのみを分析します。

明示的なAPIモードでモジュールをコンパイルするには、Gradleビルドスクリプトに次の行を追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {    
    // strictモードの場合
    explicitApi() 
    // または
    explicitApi = ExplicitApiMode.Strict
    
    // warningモードの場合
    explicitApiWarning()
    // または
    explicitApi = ExplicitApiMode.Warning
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {    
    // strictモードの場合
    explicitApi() 
    // または
    explicitApi = 'strict'
    
    // warningモードの場合
    explicitApiWarning()
    // または
    explicitApi = 'warning'
}
```

</TabItem>
</Tabs>

コマンドラインコンパイラを使用する場合は、`-Xexplicit-api`コンパイラオプションに`strict`または`warning`の値を指定して、明示的なAPIモードに切り替えます。

```bash
-Xexplicit-api=\{strict|warning\}
```

[明示的なAPIモードの詳細については、KEEPを参照してください](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode)。

### 名前付き引数と位置引数の混在

Kotlin 1.3では、[名前付き引数](functions#named-arguments)を使用して関数を呼び出す場合、名前のない引数（位置引数）は、最初の名前付き引数の前にすべて配置する必要がありました。たとえば、`f(1, y = 2)`を呼び出すことはできましたが、`f(x = 1, 2)`を呼び出すことはできませんでした。

すべての引数が正しい位置にあるのに、途中の引数に名前を指定したい場合に、これは非常に煩わしいものでした。
特に、booleanや`null`値がどの属性に属しているかを明確にするのに役立ちました。

Kotlin 1.4では、そのような制限はありません。位置引数のセットの途中で引数に名前を指定できるようになりました。さらに、位置引数と名前付き引数は、正しい順序で並んでいる限り、好きなように混在させることができます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//途中に名前付き引数を持つ関数呼び出し
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 末尾のカンマ

Kotlin 1.4では、引数やパラメータのリスト、`when`のエントリ、構造化宣言のコンポーネントなどの列挙に、末尾のカンマを追加できるようになりました。
末尾のカンマを使用すると、カンマを追加または削除せずに、新しいアイテムを追加したり、順序を変更したりできます。

これは、パラメータや値に複数行の構文を使用する場合に特に役立ちます。末尾のカンマを追加すると、パラメータまたは値を持つ行を簡単に交換できます。

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //末尾のカンマ
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //末尾のカンマ
)
```

### 呼び出し可能参照の改善

Kotlin 1.4では、呼び出し可能参照の使用に関する多くのケースがサポートされています。

* デフォルト引数値を持つ関数への参照
* `Unit`を返す関数での関数参照
* 関数の引数の数に基づいて適応する参照
* 呼び出し可能参照でのsuspend変換

#### デフォルト引数値を持つ関数への参照

デフォルト引数値を持つ関数への呼び出し可能参照を使用できるようになりました。関数`foo`への呼び出し可能参照が引数を取らない場合、デフォルト値`0`が使用されます。

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () `->` String): String = func()

fun main() {
    println(apply(::foo))
}
```

以前は、デフォルト引数値を使用するために、関数`apply`に追加のオーバーロードを記述する必要がありました。

```kotlin
// 新しいオーバーロード
fun applyInt(func: (Int) `->` String): String = func(0) 
```

#### Unitを返す関数での関数参照

Kotlin 1.4では、`Unit`を返す関数で任意の型を返す関数への呼び出し可能参照を使用できます。
Kotlin 1.4以前は、この場合にラムダ引数のみを使用できました。ラムダ引数と呼び出し可能参照の両方を使用できるようになりました。

```kotlin
fun foo(f: () `->` Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // これは1.4より前の唯一の方法でした
    foo(::returnsInt) // 1.4以降、これも動作します
}
```

#### 関数の引数の数に基づいて適応する参照

可変数の引数（`vararg`）を渡すときに、関数への呼び出し可能参照を適応させることができるようになりました。
渡された引数のリストの最後に、同じ型のパラメータを任意の数だけ渡すことができます。

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) `->` Unit) {}
fun use1(f: (Int, String) `->` Unit) {}
fun use2(f: (Int, String, String) `->` Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 呼び出し可能参照でのsuspend変換

ラムダでのsuspend変換に加えて、Kotlinはバージョン1.4.0から呼び出し可能参照でのsuspend変換をサポートするようになりました。

```kotlin
fun call() {}
fun takeSuspend(f: suspend () `->` Unit) {}

fun test() {
    takeSuspend { call() } // 1.4より前はOK
    takeSuspend(::call) // Kotlin 1.4では、これも動作します
}
```

### ループ内のwhen式内でのbreakとcontinueの使用

Kotlin 1.3では、ループ内の`when`式内で無条件の`break`と`continue`を使用できませんでした。その理由は、これらのキーワードが`when`式での可能な[フォールスルー動作](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)のために予約されていたためです。

そのため、ループ内の`when`式内で`break`と`continue`を使用する場合は、[ラベル](returns#break-and-continue-labels)を付ける必要があり、非常に煩雑になりました。

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 `->` continue@LOOP
            17 `->` break@LOOP
            else `->` println(x)
        }
    }
}
```

Kotlin 1.4では、ループ内の`when`式内でラベルなしで`break`と`continue`を使用できます。これらは、最も近い外側のループを終了するか、次のステップに進むことで期待どおりに動作します。

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 `->` continue
            17 `->` break
            else `->` println(x)
        }
    }
}
```

`when`内のフォールスルー動作は、さらなる設計が必要です。

## IDEの新しいツール

Kotlin 1.4では、IntelliJ IDEAの新しいツールを使用して、Kotlin開発を簡素化できます。

* [新しい柔軟なプロジェクトウィザード](#new-flexible-project-wizard)
* [コルーチンデバッガー](#coroutine-debugger)

### 新しい柔軟なプロジェクトウィザード

柔軟な新しいKotlinプロジェクトウィザードを使用すると、UIなしでは構成が難しいマルチプラットフォームプロジェクトなど、さまざまな種類のKotlinプロジェクトを簡単に作成および構成できます。

<img src="/img/multiplatform-project-1-wn.png" alt="Kotlinプロジェクトウィザード – マルチプラットフォームプロジェクト" style={{verticalAlign: 'middle'}}/>

新しいKotlinプロジェクトウィザードは、シンプルで柔軟性があります。

1. 実行しようとしていることに応じて、*プロジェクトテンプレートを選択します*。今後、さらに多くのテンプレートが追加される予定です。
2. *ビルドシステムを選択します* – Gradle（KotlinまたはGroovy DSL）、Maven、またはIntelliJ IDEA。
Kotlinプロジェクトウィザードには、選択したプロジェクトテンプレートでサポートされているビルドシステムのみが表示されます。
3. *プロジェクト構造を*メイン画面で直接*プレビューします*。

次に、プロジェクトの作成を完了するか、必要に応じて、次の画面で*プロジェクトを構成します*。

4. このプロジェクトテンプレートでサポートされている*モジュールとターゲットを追加/削除します*。
5. ターゲットJVMバージョン、ターゲットテンプレート、テストフレームワークなど、*モジュールとターゲットの設定を構成します*。

<img src="/img/multiplatform-project-2-wn.png" alt="Kotlinプロジェクトウィザード - ターゲットの構成" style={{verticalAlign: 'middle'}}/>

将来的には、構成オプションとテンプレートを追加して、Kotlinプロジェクトウィザードをさらに柔軟にする予定です。

次のチュートリアルを実行して、新しいKotlinプロジェクトウィザードを試すことができます。

* [Kotlin/JVMに基づくコンソールアプリケーションの作成](jvm-get-started)
* [React用のKotlin/JSアプリケーションの作成](js-react)
* [Kotlin/Nativeアプリケーションの作成](native-get-started)

### コルーチンデバッガー

多くの人がすでに非同期プログラミングに[コルーチン](coroutines-guide)を使用しています。
ただし、デバッグに関しては、Kotlin 1.4より前のコルーチンを使用した作業は、非常に面倒なものでした。コルーチンはスレッド間をジャンプするため、特定のコルーチンが何をしているかを理解し、そのコンテキストを確認することは困難でした。場合によっては、ブレークポイントを超えてステップを追跡するだけでは機能しませんでした。その結果、コルーチンを使用するコードをデバッグするには、ログ記録または精神的な努力に頼る必要がありました。

Kotlin 1.4では、Kotlinプラグインに付属する新機能により、コルーチンのデバッグがはるかに便利になりました。

:::note
デバッグは、`kotlinx-coroutines-core`のバージョン1.3.8以降で動作します。

:::

**デバッグツールウィンドウ**に、新しい**コルーチン**タブが含まれるようになりました。このタブでは、現在実行中および一時停止中のコルーチンに関する情報を見つけることができます。コルーチンは、実行されているディスパッチャーによってグループ化されます。

<img src="/img/coroutine-debugger-wn.png" alt="コルーチンのデバッグ" style={{verticalAlign: 'middle'}}/>

これで、次のことができます。
* 各コルーチンの状態を簡単に確認できます。
* 実行中および一時停止中のコルーチンのローカル変数とキャプチャされた変数の値を確認できます。
* コルーチン内の呼び出しスタックだけでなく、完全なコルーチン作成スタックを確認できます。スタックには、標準デバッグ中に失われる可能性のある変数値を持つすべてのフレームが含まれています。

各コルーチンの状態とそのスタックを含む完全なレポートが必要な場合は、**コルーチン**タブ内を右クリックし、**コルーチンダンプの取得**をクリックします。現在、コルーチンダンプは非常に単純ですが、今後のKotlinのバージョンで、より読みやすく、役立つようにする予定です。

<img src="/img/coroutines-dump-wn.png" alt="コルーチンダンプ" style={{verticalAlign: 'middle'}}/>

コルーチンのデバッグの詳細については、[このブログ投稿](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)および[IntelliJ IDEAドキュメント](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)を参照してください。

## 新しいコンパイラ

新しいKotlinコンパイラは非常に高速になる予定です。サポートされているすべてのプラットフォームを統合し、コンパイラ拡張機能のAPIを提供します。これは長期的なプロジェクトであり、Kotlin 1.4.0ですでにいくつかの手順を完了しています。

* [新しい、より強力な型推論アルゴリズム](#new-more-powerful-type-inference-algorithm)がデフォルトで有効になっています。
* [新しいJVMおよびJS IRバックエンド](#unified-backends-and-extensibility)。これらは、安定化したらデフォルトになります。

### 新しい、より強力な型推論アルゴリズム

Kotlin 1.4では、新しい、より強力な型推論アルゴリズムを使用します。この新しいアルゴリズムは、コンパイラオプションを指定することで、Kotlin 1.3ですでに試用可能でしたが、現在はデフォルトで使用されています。新しいアルゴリズムで修正された問題の完全なリストは、[YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)にあります。以下に、最も注目すべき改善点を示します。

* [型が自動的に推論されるケースの増加](#more-cases-where-type-is-inferred-automatically)
* [ラムダの最後の式に対するスマートキャスト](#smart-casts-for-a-lambda-s-last-expression)
* [呼び出し可能参照に対するスマートキャスト](#smart-casts-for-callable-references)
* [デリゲートされたプロパティに対するより優れた推論](#better-inference-for-delegated-properties)
* [異なる引数を持つJavaインターフェースに対するSAM変換](#sam-conversion-for-java-interfaces-with-different-arguments)
* [KotlinでのJava SAMインターフェース](#java-sam-interfaces-in-kotlin)

#### 型が自動的に推論されるケースの増加

新しい推論アルゴリズムは、古いアルゴリズムで明示的に指定する必要があった多くのケースで型を推論します。
たとえば、次の例では、ラムダパラメータ`it`の型が`String?`に正しく推論されます。

```kotlin

val rulesMap: Map<String, (String?) `->` Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```

Kotlin 1.3では、それを機能させるには、明示的なラムダパラメータを導入するか、`to`を明示的なジェネリック引数を持つ`Pair`コンストラクタに置き換える必要がありました。

#### ラムダの最後の式に対するスマートキャスト

Kotlin 1.3では、ラムダ内の最後の式は、期待される型を指定しない限り、スマートキャストされませんでした。したがって、次の例では、Kotlin 1.3は`String?`を`result`変数の型として推論します。

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlinコンパイラは、ここでstrがnullでないことを知っています
}
// 'result'の型は、Kotlin 1.3ではString?、Kotlin 1.4ではStringです
```

Kotlin 1.4では、新しい推論アルゴリズムのおかげで、ラムダ内の最後の式がスマートキャストされ、この新しい、より正確な型が結果のラムダ型を推論するために使用されます。したがって、`result`変数の型は`String`になります。

Kotlin 1.3では、このようなケースを機能させるために、明示的なキャスト（`!!`または`as String`のような型キャスト）を追加する必要があることが多かったのですが、これらのキャストは不要になりました。

#### 呼び出し可能参照に対するスマートキャスト

Kotlin 1.3では、スマートキャスト型のメンバー参照にアクセスできませんでした。Kotlin 1.4では、次のことができます。

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

fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat `->` animal::meow
        is Dog `->` animal::woof
    }
    kFunction.call()
}

fun main() {
    perform(Cat())
}
```

animal変数が特定の型`Cat`と`Dog`にスマートキャストされた後、異なるメンバー参照`animal::meow`と`animal::woof`を使用できます。型チェックの後、サブタイプに対応するメンバー参照にアクセスできます。

#### デリゲートされたプロパティに対するより優れた推論

`by`キーワードに続くデリゲート式を分析する際に、デリゲートされたプロパティの型は考慮されませんでした。たとえば、次のコードは以前はコンパイルされませんでしたが、コンパイラは`old`および`new`パラメータの型を`String?`として正しく推論するようになりました。

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new `->`
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

#### 異なる引数を持つJavaインターフェースに対するSAM変換

Kotlinは当初からJavaインターフェースのSAM変換をサポートしていましたが、サポートされていないケースが1つあり、既存のJavaライブラリを操作するときに煩わしいことがありました。2つのSAMインターフェースをパラメータとして取るJavaメソッドを呼び出した場合、両方の引数はラムダまたは通常のオブジェクトである必要がありました。引数をラムダとして渡し、別の引数をオブジェクトとして渡すことはできませんでした。

新しいアルゴリズムはこの問題を修正し、どんな場合でもSAMインターフェースの代わりにラムダを渡すことができ、それはあなたが自然にそれが動作することを期待する方法です。

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Kotlin 1.4で動作します
}
```

#### KotlinでのJava SAMインターフェース

Kotlin 1.4では、KotlinでJava SAMインターフェースを使用し、それらにSAM変換を適用できます。

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

Kotlin 1.3では、SAM変換を実行するために、上記の関数`foo`をJavaコードで宣言する必要がありました。

### 統合バックエンドと拡張性

Kotlinには、実行可能ファイルを生成する3つのバックエンドがあります：Kotlin/JVM、Kotlin/JS、およびKotlin/Native。Kotlin/JVMとKotlin/JSは、相互に独立して開発されたため、多くのコードを共有していません。Kotlin/Nativeは、Kotlinコードの中間表現（IR）を中心に構築された新しいインフラストラクチャに基づいています。

現在、Kotlin/JVMとKotlin/JSを同じIRに移行しています。その結果、3つのバックエンドすべてが多くのロジックを共有し、統一されたパイプラインを持つことになります。これにより、ほとんどの機能、最適化、およびバグ修正をすべてのプラットフォームに対して1回だけ実装できます。新しいIRベースのバックエンドはどちらも[Alpha](components-stability)にあります。

共通のバックエンドインフラストラクチャは、マルチプラットフォームコンパイラ拡張機能への扉も開きます。パイプラインにプラグインして、すべてのプラットフォームで自動的に動作するカスタム処理と変換を追加できます。

現在Alpha版である新しい[JVM IR](#new-jvm-ir-backend)および[JS IR](#new-js-ir-backend)バックエンドを使用し、フィードバックを共有することをお勧めします。

## Kotlin/JVM

Kotlin 1.4.0には、次のようなJVM固有の改善が多数含まれています。
 
* [新しいJVM IRバックエンド](#new-jvm-ir-backend)
* [インターフェースでデフォルトメソッドを生成するための新しいモード](#new-modes-for-generating-default-methods)
* [nullチェック用の統一された例外型](#unified-exception-type-for-null-checks)
* [JVMバイトコードの型注釈](#type-annotations-in-the-jvm-bytecode)

### 新しいJVM IRバックエンド

Kotlin/JSとともに、[統一されたIRバックエンド](#unified-backends-and-extensibility)にKotlin/JVMを移行しています。これにより、すべてのプラットフォームに対してほとんどの機能とバグ修正を1回で実装できます。すべてのプラットフォームで動作するマルチプラットフォーム拡張機能を作成することで、このメリットを享受することもできます。

Kotlin 1.4.0は、このような拡張機能のパブリックAPIをまだ提供していませんが、[Jetpack Compose](https://developer.android.com/jetpack/compose)などのパートナーと緊密に連携しており、新しいバックエンドを使用してコンパイラプラグインをすでに構築しています。

現在Alpha版である新しいKotlin/JVMバックエンドを試し、[課題追跡システム](https://youtrack.jetbrains.com/issues/KT)に課題や機能リクエストを提出することをお勧めします。
これにより、コンパイラパイプラインを統合し、Jetpack Composeのようなコンパイラ拡張機能をKotlinコミュニティにもっと迅速に提供できます。

新しいJVM IRバックエンドを有効にするには、Gradleビルドスクリプトで追加のコンパイラオプションを指定します。

```kotlin
kotlinOptions.useIR = true
```

:::note
[Jetpack Composeを有効にする](https://developer.android.com/jetpack/compose/setup?hl=en)と、`kotlinOptions`でコンパイラオプションを指定する必要なく、新しいJVMバックエンドに自動的にオプトインされます。

:::

コマンドラインコンパイラを使用する場合は、コンパイラオプション`-Xuse-ir`を追加します。

:::note
新しいJVM IRバックエンドでコンパイルされたコードは、新しいバックエンドを有効にした場合にのみ使用できます。そうしないと、エラーが発生します。
これを考慮して、ライブラリ作成者が本番環境で新しいバックエンドに切り替えることはお勧めしません。

:::

### デフォルトメソッドを生成するための新しいモード

KotlinコードをターゲットJVM 1.8以降にコンパイルする場合、Kotlinインターフェースの非抽象メソッドをJavaの`default`メソッドにコンパイルできます。この目的のために、そのようなメソッドをマークするための`@JvmDefault`アノテーションと、このアノテーションの処理を有効にする`-Xjvm-default`コンパイラオプションを含むメカニズムがありました。

1.  4.  0では、デフォルトメソッドを生成するための新しいモードを追加しました。`-Xjvm-default=all`は、Kotlinインターフェースの*すべて*の非抽象メソッドを`default` Javaメソッドにコンパイルします。`default`なしでコンパイルされたインターフェースを使用するコードとの互換性のために、`all-compatibility`モードも追加しました。

Javaインターオペラビリティのデフォルトメソッドの詳細については、[相互運用性ドキュメント](java-to-kotlin-interop#default-methods-in-interfaces)および[このブログ投稿](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)を参照してください。

### nullチェック用の統一された例外型

Kotlin 1.4.0以降、すべてのランタイムnullチェックは、`KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException`、および`TypeCastException`の代わりに`java.lang.NullPointerException`をスローします。これは、`!!`演算子、メソッドプリアンブルのパラメータnullチェック、プラットフォーム型の式nullチェック、および非null型の`as`演算子に適用されます。これは、`lateinit` nullチェックおよび`checkNotNull`または`requireNotNull`のような明示的なライブラリ関数呼び出しには適用されません。

この変更により、KotlinコンパイラまたはAndroid [R8オプティマイザ](https://developer.android.com/studio/build/shrink-code)のようなさまざまな種類のバイトコード処理ツールによって実行できるnullチェック最適化の数が増加します。

開発者の観点から見ると、Kotlinコードは以前と同じエラーメッセージで例外をスローするため、状況はそれほど変わらないことに注意してください。例外の型は変わりますが、渡される情報は変わりません。

### JVMバイトコードの型注釈

Kotlinは、JVMバイトコード（ターゲットバージョン1.8以降）に型注釈を生成できるようになったため、実行時にJavaリフレクションで使用できるようになります。
バイトコードで型注釈を発行するには、次の手順を実行します。

1. 宣言されたアノテーションに適切なアノテーションターゲット（Javaの`ElementType.TYPE_USE`またはKotlinの`AnnotationTarget.TYPE`）と保持（`AnnotationRetention.RUNTIME`）があることを確認します。
2. アノテーションクラス宣言をJVMバイトコードターゲットバージョン1.8以降にコンパイルします。コンパイラオプション`-jvm-target=1.8`で指定できます。
3. アノテーションを使用するコードをJVMバイトコードターゲットバージョン1.8以降（`-jvm-target=1.8`）にコンパイルし、`-Xemit-jvm-type-annotations`コンパイラオプションを追加します。

標準ライブラリはターゲットバージョン1.6でコンパイルされているため、現時点では標準ライブラリからの型注釈はバイトコードでは発行されないことに注意してください。

これまでのところ、基本的なケースのみがサポートされています。

- メソッドパラメータ、メソッド戻り型、およびプロパティ型の型注釈。
- `Smth<@Ann Foo>`、`Array<@Ann Foo>`のような型引数の不変プロジェクション。

次の例では、`String`型の`@Foo`アノテーションをバイトコードに発行し、ライブラリコードで使用できます。

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JSプラットフォームでは、Kotlin 1.4.0は次の改善を提供します。

- [新しいGradle DSL](#new-gradle-dsl)
- [新しいJS IRバックエンド](#new-js-ir-backend)

### 新しいGradle DSL

`kotlin.js` Gradleプラグインには、調整されたGradle DSLが付属しています。これは、多数の新しい構成オプションを提供し、`kotlin-multiplatform`プラグインで使用されるDSLにより近いものです。最も影響力のある変更点には、次のものがあります。

- `binaries.executable()`を介した実行可能ファイルの作成のための明示的なトグル。[Kotlin/JSの実行とその環境の詳細はこちら](js-project-setup#execution-environments)。
- `cssSupport`を介したGradle構成内からのwebpackのCSSおよびスタイルローダーの構成。[CSSおよびスタイルローダーの使用の詳細はこちら](js-project-setup#css)。
- 必須のバージョン番号または[semver](https://docs.npmjs.com/about-semantic-versioning)バージョン範囲、および`devNpm`、`optionalNpm`、`peerNpm`を使用した*開発*、*ピア*、および*オプション*のnpm依存関係のサポートによる、npm依存関係の改善された管理。[Gradleから直接npmパッケージの依存関係管理の詳細はこちら](js-project-setup#npm-dependencies)。
- Kotlin外部宣言のジェネレーターである[Dukat](https://github.com/Kotlin/dukat)のより強力な統合。外部宣言は、ビルド時に生成することも、Gradleタスクを介して手動で生成することもできます。

### 新しいJS IRバックエンド

現在[Alpha](components-stability)の安定性を持つ[Kotlin/JSのIRバックエンド](js-ir-compiler)は、デッドコードの削除による生成されたコードサイズ、JavaScriptおよびTypeScriptとの改善された相互運用など、Kotlin/JSターゲットに固有のいくつかの新機能を提供します。

Kotlin/JS IRバックエンドを有効にするには、`gradle.properties`でキー`kotlin.js.compiler=ir`を設定するか、Gradleビルドスクリプトの`js`関数に`IR`コンパイラタイプを渡します。

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // または: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

新しいバックエンドの構成方法の詳細については、[Kotlin/JS IRコンパイラドキュメント](js-ir-compiler)を確認してください。

新しい[@JsExport](js-to-kotlin-interop#jsexport-annotation)アノテーションと、**[KotlinコードからTypeScript定義を生成](js-ir-compiler#preview-generation-of-typescript-declaration-files-d-ts)**する機能により、Kotlin/JS IRコンパイラバックエンドはJavaScriptとTypeScriptの相互運用性を向上させます。これにより、Kotlin/JSコードを既存のツールと統合し、**ハイブリッドアプリケーション**を作成し、マルチプラットフォームプロジェクトでコード共有機能を活用することが容易になります。

[Kotlin/JS IRコンパイラバックエンドで利用可能な機能の詳細はこちら](js-ir-compiler)。

## Kotlin/Native

1.  4.  0では、Kotlin/Nativeに多数の新機能と改善が加えられました。

* [SwiftおよびObjective-CでのKotlinのsuspend関数のサポート](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [Objective-Cジェネリクスのデフォルトサポート](#objective-c-generics-support-by-default)
* [Objective-C/Swift相互運用での例外処理](#exception-handling-in-objective-c-swift-interop)
* [Appleターゲットでリリース.dSYMをデフォルトで生成](#generate-release-dsyms-on-apple-targets-by-default)
* [パフォーマンスの改善](#performance-improvements)
* [CocoaPods依存関係の管理の簡素化](#simplified-management-of-cocoapods-dependencies)

### SwiftおよびObjective-CでのKotlinのsuspend関数のサポート

1.  4.  0では、SwiftおよびObjective-Cでのsuspend関数の基本的なサポートを追加します。KotlinモジュールをAppleフレームワークにコンパイルすると、suspend関数はSwift/Objective-C用語ではコールバック（`completionHandler`）を持つ関数として使用できるようになりました。生成されたフレームワークのヘッダーにそのような関数がある場合、SwiftまたはObjective-Cコードからそれらを呼び出したり、オーバーライドしたりすることもできます。

たとえば、次のKotlin関数を記述した場合：

```kotlin
suspend fun queryData(id: Int): String = ...
```

Swiftから次のように呼び出すことができます。

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[SwiftおよびObjective-Cでのsuspend関数の使用の詳細はこちら](native-objc-interop)。

### Objective-Cジェネリクスのデフォルトサポート

以前のバージョンのKotlinは、Objective-C相互運用でジェネリクスの実験的なサポートを提供していました。1.4.0以降、Kotlin/NativeはKotlinコードからジェネリクスを持つAppleフレームワークをデフォルトで生成します。場合によっては、これにより、Kotlinフレームワークを呼び出す既存のObjective-CまたはSwiftコードが破損する可能性があります。ジェネリクスなしでフレームワークヘッダーを記述するには、`-Xno-objc-generics`コンパイラオプションを追加します。

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }