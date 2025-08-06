[//]: # (title: K2コンパイラー移行ガイド)

Kotlin言語とエコシステムが進化し続けるにつれて、Kotlinコンパイラーも進化してきました。最初のステップは、ロジックを共有し、異なるプラットフォームのターゲット向けのコード生成を簡素化する、新しいJVMおよびJS IR（中間表現）バックエンドの導入でした。そして今、その進化の次の段階として、K2として知られる新しいフロントエンドが登場します。

![Kotlin K2 compiler architecture](k2-compiler-architecture.svg){width=700}

K2コンパイラーの登場により、Kotlinフロントエンドは完全に書き直され、新しく、より効率的なアーキテクチャを備えています。新しいコンパイラーがもたらす根本的な変更は、より多くのセマンティック情報を含む1つの統一されたデータ構造の使用です。このフロントエンドは、意味解析、呼び出し解決、および型推論を実行する役割を担います。

新しいアーキテクチャと豊富なデータ構造により、K2コンパイラーは以下の利点を提供します。

*   **呼び出し解決と型推論の改善**。コンパイラーの動作が一貫し、コードをよりよく理解します。
*   **新しい言語機能の糖衣構文の導入が容易に**。将来的には、新しい機能が導入される際に、より簡潔で読みやすいコードを使用できるようになります。
*   **コンパイル時間の高速化**。コンパイル時間は[大幅に高速化されます](#performance-improvements)。
*   **IDEパフォーマンスの向上**。2025.1以降、IntelliJ IDEAはK2モードを使用してKotlinコードを分析し、安定性を高め、パフォーマンスを向上させます。詳細については、[IDEのサポート](#support-in-ides)を参照してください。

このガイドでは、以下の内容を説明します。

*   新しいK2コンパイラーの利点を説明します。
*   移行中に遭遇する可能性のある変更点と、それに応じてコードを適応させる方法を強調します。
*   以前のバージョンにロールバックする方法を説明します。

> 新しいK2コンパイラーは、2.0.0からデフォルトで有効になっています。Kotlin 2.0.0で提供される新機能、および新しいK2コンパイラーの詳細については、[Kotlin 2.0.0の新機能](whatsnew20.md)を参照してください。
>
{style="note"}

## パフォーマンスの改善

K2コンパイラーのパフォーマンスを評価するために、2つのオープンソースプロジェクト、[Anki-Android](https://github.com/ankidroid/Anki-Android)と[Exposed](https://github.com/JetBrains/Exposed)でパフォーマンステストを実行しました。そこで見つかった主要なパフォーマンス改善点は次のとおりです。

*   K2コンパイラーは、最大94%のコンパイル速度向上をもたらします。例えば、Anki-Androidプロジェクトでは、クリーンビルド時間がKotlin 1.9.23の57.7秒からKotlin 2.0.0の29.7秒に短縮されました。
*   初期化フェーズは、K2コンパイラーを使用すると最大488%高速になります。例えば、Anki-Androidプロジェクトでは、インクリメンタルビルドの初期化フェーズがKotlin 1.9.23の0.126秒からKotlin 2.0.0のわずか0.022秒に短縮されました。
*   Kotlin K2コンパイラーは、以前のコンパイラーと比較して、解析フェーズで最大376%高速化されています。例えば、Anki-Androidプロジェクトでは、インクリメンタルビルドの解析時間がKotlin 1.9.23の0.581秒からKotlin 2.0.0のわずか0.122秒に削減されました。

これらの改善の詳細、およびK2コンパイラーのパフォーマンスを分析した方法については、弊社の[ブログ記事](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)を参照してください。

## 言語機能の改善

Kotlin K2コンパイラーは、[スマートキャスト](#smart-casts)と[Kotlin Multiplatform](#kotlin-multiplatform)に関連する言語機能を改善します。

### スマートキャスト

Kotlinコンパイラーは、特定の場合にオブジェクトを型に自動的にキャストできるため、手動で明示的に指定する手間が省けます。これは[スマートキャスト](typecasts.md#smart-casts)と呼ばれます。Kotlin K2コンパイラーは、以前よりもさらに多くのシナリオでスマートキャストを実行するようになりました。

Kotlin 2.0.0では、以下の分野でスマートキャストに関連する改善を行いました。

*   [ローカル変数とそれ以降のスコープ](#local-variables-and-further-scopes)
*   [論理OR演算子による型チェック](#type-checks-with-the-logical-or-operator)
*   [インライン関数](#inline-functions)
*   [関数型を持つプロパティ](#properties-with-function-types)
*   [例外処理](#exception-handling)
*   [インクリメントおよびデクリメント演算子](#increment-and-decrement-operators)

#### ローカル変数とそれ以降のスコープ

以前は、`if`条件内で変数が`null`ではないと評価された場合、その変数はスマートキャストされました。この変数に関する情報は、`if`ブロックのスコープ内でさらに共有されました。

しかし、`if`条件の**外側**で変数を宣言した場合、その変数に関する情報は`if`条件内で利用できなかったため、スマートキャストできませんでした。この動作は`when`式や`while`ループでも見られました。

Kotlin 2.0.0からは、`if`、`when`、または`while`条件で変数を使用する前に変数を宣言すると、コンパイラーによって収集された変数に関するすべての情報が、スマートキャストのために対応するブロックでアクセス可能になります。

これは、真偽条件を変数に抽出するなどの場合に役立ちます。そうすることで、変数に意味のある名前を付け、コードの可読性を向上させ、後でコードで変数を再利用することが可能になります。例えば：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0.0では、コンパイラーはisCatに関する情報に
        // アクセスできるため、animalがCat型にスマートキャストされたことを
        // 認識します。
        // したがって、purr()関数を呼び出すことができます。
        // Kotlin 1.9.20では、コンパイラーはスマートキャストを
        // 認識しないため、purr()関数を呼び出すとエラーが発生します。
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 論理OR演算子による型チェック

Kotlin 2.0.0では、オブジェクトの型チェックを`or`演算子 (`||`) と組み合わせると、それらの最も近い共通のスーパータイプにスマートキャストが行われます。この変更以前は、スマートキャストは常に`Any`型に対して行われていました。

この場合、そのプロパティにアクセスしたり、関数を呼び出したりする前に、その後も手動でオブジェクトの型をチェックする必要がありました。例えば：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatusは共通スーパータイプであるStatusにスマートキャストされる
        signalStatus.signal()
        // Kotlin 2.0.0より前は、signalStatusはAny型にスマートキャストされ、
        // signal()関数を呼び出すと`Unresolved reference`エラーが発生しました。
        // signal()関数は、別の型チェックの後でのみ正常に呼び出すことができました。
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共通スーパータイプは、[共用体型](https://en.wikipedia.org/wiki/Union_type)の**近似**です。共用体型は[現在Kotlinではサポートされていません](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### インライン関数

Kotlin 2.0.0では、K2コンパイラーはインライン関数を異なる方法で扱い、他のコンパイラー解析と組み合わせてスマートキャストが安全かどうかを判断できるようにします。

具体的には、インライン関数は暗黙的な[`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)コントラクトを持つものとして扱われるようになりました。これは、インライン関数に渡されたラムダ関数がインプレイスで呼び出されることを意味します。ラムダ関数がインプレイスで呼び出されるため、コンパイラーはラムダ関数がその関数本体に含まれる変数の参照を漏洩させることができないことを認識します。

コンパイラーはこの知識を他のコンパイラー解析と組み合わせて、キャプチャされた変数のいずれかをスマートキャストするのが安全かどうかを決定します。例えば：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // Kotlin 2.0.0では、コンパイラーはprocessorが
        // ローカル変数であり、inlineAction()がインライン関数であることを認識しているため、
        // processorへの参照が漏洩することはありません。
        // したがって、processorをスマートキャストしても安全です。
      
        // processorがnullでない場合、processorはスマートキャストされる
        if (processor != null) {
            // コンパイラーはprocessorがnullではないことを認識しているため、
            // セーフコールは不要である
            processor.process()

            // Kotlin 1.9.20では、セーフコールを実行する必要がある：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 関数型を持つプロパティ

以前のバージョンのKotlinでは、関数型を持つクラスプロパティがスマートキャストされないというバグがありました。Kotlin 2.0.0とK2コンパイラーでこの動作を修正しました。例えば：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // Kotlin 2.0.0では、providerがnullでない場合、
        // スマートキャストされる
        if (provider != null) {
            // コンパイラーはproviderがnullではないことを認識している
            provider()

            // 1.9.20では、コンパイラーはproviderがnullではないことを
            // 認識しないため、エラーが発生する：
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

この変更は、`invoke`演算子をオーバーロードした場合にも適用されます。例えば：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 1.9.20では、コンパイラーがエラーを発生させる：
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外処理

Kotlin 2.0.0では、例外処理の改善を行い、スマートキャスト情報が`catch`および`finally`ブロックに渡されるようになりました。この変更により、コンパイラーがオブジェクトがnull許容型であるかどうかを追跡するため、コードがより安全になります。例えば：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInputはString型にスマートキャストされる
    stringInput = ""
    try {
        // コンパイラーはstringInputがnullではないことを認識している
        println(stringInput.length)
        // 0

        // コンパイラーはstringInputの以前のスマートキャスト情報を破棄する。
        // 現在、stringInputはString?型になっている。
        stringInput = null

        // 例外をトリガーする
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // Kotlin 2.0.0では、コンパイラーはstringInputが
        // nullになる可能性があることを認識しているため、stringInputはnull許容のままである。
        println(stringInput?.length)
        // null

        // Kotlin 1.9.20では、コンパイラーはセーフコールが不要であると言うが、これは誤りである。
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### インクリメントおよびデクリメント演算子

Kotlin 2.0.0より前は、コンパイラーはインクリメントまたはデクリメント演算子を使用した後にオブジェクトの型が変更されることを理解していませんでした。コンパイラーがオブジェクトの型を正確に追跡できなかったため、コードが未解決の参照エラーにつながる可能性がありました。Kotlin 2.0.0では、これが修正されました。

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // unknownObjectがTauインターフェースを継承しているかチェック
    // なお、unknownObjectはRhoインターフェースとTauインターフェースの両方を
    // 継承している可能性がある。
    if (unknownObject is Tau) {

        // Rhoインターフェースのオーバーロードされたinc()演算子を使用する。
        // Kotlin 2.0.0では、unknownObjectの型はSigmaにスマートキャストされる。
        ++unknownObject

        // Kotlin 2.0.0では、コンパイラーはunknownObjectがSigma型であることを認識しているため、
        // sigma()関数を正常に呼び出すことができる。
        unknownObject.sigma()

        // Kotlin 1.9.20では、inc()が呼び出されてもコンパイラーはスマートキャストを
        // 実行しないため、コンパイラーは依然としてunknownObjectがTau型であると認識する。
        // sigma()関数を呼び出すとコンパイル時エラーが発生する。
        
        // Kotlin 2.0.0では、コンパイラーはunknownObjectがSigma型であることを認識しているため、
        // tau()関数を呼び出すとコンパイル時エラーが発生する。
        unknownObject.tau()
        // 未解決の参照 'tau'

        // Kotlin 1.9.20では、コンパイラーが誤ってunknownObjectがTau型であると
        // 認識するため、tau()関数を呼び出すことができたが、
        // ClassCastExceptionが発生する。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform

K2コンパイラーには、Kotlin Multiplatformに関連する以下の分野で改善があります。

*   [コンパイル時の共通ソースとプラットフォームソースの分離](#separation-of-common-and-platform-sources-during-compilation)
*   [expectedおよびactual宣言の異なる可視性レベル](#different-visibility-levels-of-expected-and-actual-declarations)

#### コンパイル時の共通ソースとプラットフォームソースの分離

以前は、Kotlinコンパイラーの設計により、コンパイル時に共通ソースセットとプラットフォームソースセットを分離することができませんでした。その結果、共通コードがプラットフォームコードにアクセスでき、プラットフォーム間で異なる動作を引き起こしていました。さらに、共通コードからのいくつかのコンパイラー設定と依存関係がプラットフォームコードに漏洩していました。

Kotlin 2.0.0では、新しいKotlin K2コンパイラーの実装に、共通ソースセットとプラットフォームソースセット間の厳密な分離を確実にするためのコンパイルスキームの再設計が含まれています。この変更は、[expectedおよびactual関数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)を使用する際に最も顕著です。以前は、共通コードの関数呼び出しがプラットフォームコードの関数に解決されることが可能でした。例えば：

<table>
   <tr>
       <td>共通コード</td>
       <td>プラットフォームコード</td>
   </tr>
   <tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```

</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// JavaScriptプラットフォームにはfoo()関数のオーバーロードがない
```

</td>
</tr>
</table>

この例では、共通コードは実行されるプラットフォームによって異なる動作をします。

*   JVMプラットフォームでは、共通コードで`foo()`関数を呼び出すと、プラットフォームコードの`foo()`関数が`platform foo`として呼び出されます。
*   JavaScriptプラットフォームでは、プラットフォームコードにそのような関数が利用できないため、共通コードで`foo()`関数を呼び出すと、共通コードの`foo()`関数が`common foo`として呼び出されます。

Kotlin 2.0.0では、共通コードはプラットフォームコードにアクセスできないため、両方のプラットフォームで`foo()`関数が共通コードの`foo()`関数に正常に解決されます：`common foo`。

プラットフォーム間の動作の一貫性が向上したことに加えて、IntelliJ IDEAまたはAndroid Studioとコンパイラーの間で競合する動作があったケースを修正するために努力しました。例えば、[expectedおよびactualクラス](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)を使用した場合、以下のことが起こりました。

<table>
   <tr>
       <td>共通コード</td>
       <td>プラットフォームコード</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0より前は、IDEのみのエラーをトリガーした
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : ExpectedクラスIdentityにはデフォルトコンストラクターがない。
}
```

</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```

</td>
</tr>
</table>

この例では、expectedクラス`Identity`にはデフォルトコンストラクターがないため、共通コードで正常に呼び出すことができません。以前は、エラーはIDEによってのみ報告されましたが、コードはJVMでまだ正常にコンパイルされました。しかし、現在ではコンパイラーが正しくエラーを報告します。

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解決動作が変わらない場合

現在も新しいコンパイルスキームへの移行の過程にあるため、同じソースセット内にない関数を呼び出す際の解決動作は依然として同じです。この違いは、マルチプラットフォームライブラリからのオーバーロードを共通コードで使用する際に、主に気づくでしょう。

例えば、2つの`whichFun()`関数が異なるシグネチャを持つライブラリがあるとします。

```kotlin
// 例のライブラリ

// モジュール: common
fun whichFun(x: Any) = println("common function") 

// モジュール: JVM
fun whichFun(x: Int) = println("platform function")
```

共通コードで`whichFun()`関数を呼び出すと、ライブラリ内で最も関連性の高い引数型を持つ関数が解決されます。

```kotlin
// JVMターゲット向けに例のライブラリを使用するプロジェクト

// モジュール: common
fun main(){
    whichFun(2) 
    // platform function
}
```

比較すると、同じソースセット内で`whichFun()`のオーバーロードを宣言した場合、コードがプラットフォーム固有のバージョンにアクセスできないため、共通コードの関数が解決されます。

```kotlin
// 例のライブラリは使用されていない

// モジュール: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// モジュール: JVM
fun whichFun(x: Int) = println("platform function")
```

マルチプラットフォームライブラリと同様に、`commonTest`モジュールは別のソースセットにあるため、プラットフォーム固有のコードにアクセスできます。したがって、`commonTest`モジュール内の関数への呼び出しの解決は、以前のコンパイルスキームと同じ動作を示します。

将来的には、これらの残りのケースも新しいコンパイルスキームとより一貫性を持つようになるでしょう。

#### expectedおよびactual宣言の異なる可視性レベル

Kotlin 2.0.0より前は、Kotlin Multiplatformプロジェクトで[expectedおよびactual宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用する場合、それらは同じ[可視性レベル](visibility-modifiers.md)を持つ必要がありました。Kotlin 2.0.0では、異なる可視性レベルもサポートするようになりましたが、これはactual宣言がexpected宣言よりも_許容範囲が広い_場合に**のみ**です。例えば：

```kotlin
expect internal class Attribute // 可視性はinternal
actual class Attribute          // 可視性はデフォルトでpublicで、
                                // より許容範囲が広い
```

同様に、actual宣言で[型エイリアス](type-aliases.md)を使用している場合、**基になる型の**可視性はexpected宣言と同じか、より許容範囲が広いべきです。例えば：

```kotlin
expect internal class Attribute                 // 可視性はinternal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可視性はデフォルトでpublicで、
                                                // より許容範囲が広い
```

## Kotlin K2コンパイラーを有効にする方法

Kotlin 2.0.0以降、Kotlin K2コンパイラーはデフォルトで有効になっています。

Kotlinバージョンをアップグレードするには、[Gradle](gradle-configure-project.md#apply-the-plugin)および[Maven](maven.md#configure-and-enable-the-plugin)のビルドスクリプトで、バージョンを2.0.0以降に変更してください。

IntelliJ IDEAまたはAndroid Studioで最高の体験をするには、IDEで[K2モードを有効にすること](#support-in-ides)を検討してください。

### 以前のIDEの動作 {initial-collapse-state="collapsed" collapsible="true"}

以前のIDEの動作に戻したい場合は、K2モードを無効にできます。

1.  **Settings** | **Languages & Frameworks** | **Kotlin** に移動します。
2.  **Enable K2 mode** オプションの選択を解除します。

> Kotlin 2.1.0以降で[Stable](components-stability.md#stability-levels-explained)な言語機能を導入する予定です。それまでは、コード解析のために以前のIDE機能を使い続けることができ、認識されない言語機能によるコードハイライトの問題に遭遇することはないでしょう。
>
{style="note"}

## Kotlin PlaygroundでKotlin K2コンパイラーを試す

Kotlin Playgroundは、Kotlin 2.0.0以降のリリースをサポートしています。[試してみましょう！](https://pl.kotl.in/czuoQprce)

## 以前のコンパイラーにロールバックする方法

Kotlin 2.0.0以降のリリースで以前のコンパイラーを使用するには、以下のいずれかを実行します。

*   `build.gradle.kts`ファイルで、[言語バージョン](gradle-compiler-options.md#example-of-setting-languageversion)を`1.9`に設定します。

    または
*   以下のコンパイラーオプションを使用します：`-language-version 1.9`。

## 変更点

新しいフロントエンドの導入により、Kotlinコンパイラーはいくつかの変更を経験しました。まずは、コードに影響を与える最も重要な変更点を強調し、何が変わったかを説明し、今後のベストプラクティスを詳述することから始めましょう。詳細を知りたい場合は、さらなる読書を容易にするために、これらの変更を[主題領域](#per-subject-area)に整理しました。

このセクションでは、以下の変更点を強調します。

*   [バッキングフィールドを持つopenプロパティの即時初期化](#immediate-initialization-of-open-properties-with-backing-fields)
*   [投影されたレシーバー上の合成セッターの非推奨化](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [アクセス不可能なジェネリック型の使用禁止](#forbidden-use-of-inaccessible-generic-types)
*   [KotlinプロパティとJavaフィールドが同じ名前を持つ場合の解決順序の一貫性](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [Javaプリミティブ配列のnull安全性の改善](#improved-null-safety-for-java-primitive-arrays)
*   [expectedクラスにおける抽象メンバーのより厳格なルール](#stricter-rules-for-abstract-members-in-expected-classes)

### バッキングフィールドを持つopenプロパティの即時初期化

**変更点**

Kotlin 2.0では、バッキングフィールドを持つすべての`open`プロパティは直ちに初期化されなければなりません。そうしないと、コンパイルエラーが発生します。以前は`open var`プロパティのみが直ちに初期化される必要がありましたが、現在ではバッキングフィールドを持つ`open val`プロパティにも拡張されます。

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Kotlin 2.0からエラーとなるが、以前は正常にコンパイルされていた 
        this.a = 1 //Error: open val must have initializer
        // 常にエラー
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

この変更により、コンパイラーの動作がより予測可能になります。`open val`プロパティがカスタムセッターを持つ`var`プロパティによってオーバーライドされる例を考えてみましょう。

カスタムセッターが使用される場合、遅延初期化は混乱を招く可能性があります。なぜなら、バッキングフィールドを初期化したいのか、セッターを呼び出したいのかが不明瞭になるからです。以前は、セッターを呼び出したい場合、古いコンパイラーはセッターがバッキングフィールドを初期化することを保証できませんでした。

**現在のベストプラクティス**

バッキングフィールドを持つopenプロパティは常に初期化することを推奨します。これは、より効率的でエラーが発生しにくいプラクティスであると我々は考えています。

ただし、プロパティをすぐに初期化しない場合は、次のことができます。

*   プロパティを`final`にする。
*   遅延初期化を可能にするプライベートなバッキングプロパティを使用する。

詳細については、[YouTrackの対応するイシュー](https://youtrack.jetbrains.com/issue/KT-57555)を参照してください。

### 投影されたレシーバー上の合成セッターの非推奨化

**変更点**

Javaクラスの合成セッターを使用して、クラスの投影型と競合する型を割り当てると、エラーがトリガーされます。

`getFoo()`メソッドと`setFoo()`メソッドを含む`Container`という名前のJavaクラスがあるとします。

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

`Container`クラスのインスタンスが投影型を持つ以下のKotlinコードがある場合、`setFoo()`メソッドを使用すると常にエラーが生成されます。しかし、Kotlin 2.0.0からのみ、合成プロパティ`foo`がエラーをトリガーします。

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Kotlin 1.0以降エラー

    // 合成セッター`foo`は`setFoo()`メソッドに解決される
    starProjected.foo = sampleString
    // Kotlin 2.0.0以降エラー

    inProjected.setFoo(sampleString)
    // Kotlin 1.0以降エラー

    // 合成セッター`foo`は`setFoo()`メソッドに解決される
    inProjected.foo = sampleString
    // Kotlin 2.0.0以降エラー
}
```

**現在のベストプラクティス**

この変更によってコードにエラーが発生する場合は、型宣言の構造を再考することをお勧めします。型投影を使用する必要がないか、あるいはコードから代入を削除する必要があるかもしれません。

詳細については、[YouTrackの対応するイシュー](https://youtrack.jetbrains.com/issue/KT-54309)を参照してください。

### アクセス不可能なジェネリック型の使用禁止

**変更点**

K2コンパイラーの新しいアーキテクチャにより、アクセス不可能なジェネリック型の処理方法を変更しました。一般的に、コード内でアクセス不可能なジェネリック型に依存すべきではありません。これは、プロジェクトのビルド設定に誤りがあることを示しており、コンパイラーがコンパイルに必要な情報にアクセスできないようにするためです。Kotlin 2.0.0では、アクセス不可能なジェネリック型を持つ関数リテラルを宣言したり呼び出したりすることはできません。また、アクセス不可能なジェネリック型引数を持つジェネリック型を使用することもできません。この制限は、後でコードでコンパイラーエラーを回避するのに役立ちます。

例えば、あるモジュールでジェネリッククラスを宣言したとします。

```kotlin
// モジュール1
class Node<V>(val value: V)
```

モジュール1に依存関係が設定されている別のモジュール（モジュール2）がある場合、コードは`Node<V>`クラスにアクセスし、関数型で型として使用できます。

```kotlin
// モジュール2
fun execute(func: (Node<Int>) -> Unit) {}
// 関数は正常にコンパイルされる
```

ただし、プロジェクトが誤って設定されており、モジュール2のみに依存する第3のモジュール（モジュール3）がある場合、Kotlinコンパイラーはモジュール3をコンパイルする際に**モジュール1**の`Node<V>`クラスにアクセスできなくなります。現在、`Node<V>`型を使用するモジュール3内のラムダまたは匿名関数は、Kotlin 2.0.0でエラーをトリガーし、これにより後でコードで回避可能なコンパイラーエラー、クラッシュ、および実行時例外を防ぎます。

```kotlin
// モジュール3
fun test() {
    // 暗黙的なラムダパラメータ (it) の型がアクセス不可能なNodeに
    // 解決されるため、Kotlin 2.0.0ではエラーが発生する
    execute {}

    // 未使用のラムダパラメータ (_) の型がアクセス不可能なNodeに
    // 解決されるため、Kotlin 2.0.0ではエラーが発生する
    execute { _ -> }

    // 未使用の匿名関数のパラメータ (_) の型がアクセス不可能なNodeに
    // 解決されるため、Kotlin 2.0.0ではエラーが発生する
    execute(fun (_) {})
}
```

アクセス不可能なジェネリック型の値パラメータを含む場合に、関数リテラルがエラーをトリガーするだけでなく、型がアクセス不可能なジェネリック型引数を持つ場合にもエラーが発生します。

例えば、モジュール1に同じジェネリッククラス宣言があるとします。モジュール2では、別のジェネリッククラス`Container<C>`を宣言します。さらに、モジュール2で、ジェネリッククラス`Node<V>`を型引数として`Container<C>`を使用する関数を宣言します。

<table>
   <tr>
       <td>モジュール1</td>
       <td>モジュール2</td>
   </tr>
   <tr>
<td>

```kotlin
// モジュール1
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// モジュール2
class Container<C>(vararg val content: C)

// ジェネリッククラス型を持つ関数で、
// ジェネリッククラス型引数も持つ
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

モジュール3でこれらの関数を呼び出そうとすると、ジェネリッククラス`Node<V>`がモジュール3からアクセスできないため、Kotlin 2.0.0でエラーがトリガーされます。

```kotlin
// モジュール3
fun test() {
    // ジェネリッククラスNode<V>がアクセス不可能なため、
    // Kotlin 2.0.0でエラーが発生する
    consume(produce())
}
```

将来のリリースでは、アクセス不可能な型の使用全般を非推奨にし続けます。Kotlin 2.0.0ではすでに、非ジェネリック型を含むアクセス不可能な型を使用するいくつかのシナリオで警告を追加することで開始しました。

例えば、前の例と同じモジュール設定を使用しますが、ジェネリッククラス`Node<V>`を非ジェネリッククラス`IntNode`に変更し、すべての関数をモジュール2で宣言するとします。

<table>
   <tr>
       <td>モジュール1</td>
       <td>モジュール2</td>
   </tr>
   <tr>
<td>

```kotlin
// モジュール1
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// モジュール2
// `IntNode`型を持つラムダパラメータを含む関数
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// `IntNode`を型引数として持つジェネリッククラス型を持つ関数
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

モジュール3でこれらの関数を呼び出すと、いくつかの警告がトリガーされます。

```kotlin
// モジュール3
fun test() {
    // クラスIntNodeがアクセス不可能なため、
    // Kotlin 2.0.0で警告が発生する。

    execute {}
    // パラメータ 'it' のクラス 'IntNode' はアクセスできません。

    execute { _ -> }
    execute(fun (_) {})
    // パラメータ '_' のクラス 'IntNode' はアクセスできません。

    // IntNodeがアクセス不可能なため、
    // 将来のKotlinリリースで警告がトリガーされるでしょう。
    consume(produce())
}
```

**現在のベストプラクティス**

アクセス不可能なジェネリック型に関する新しい警告に遭遇した場合、ビルドシステムの設定に問題がある可能性が非常に高いです。ビルドスクリプトと設定を確認することを推奨します。

最終手段として、モジュール3からモジュール1への直接的な依存関係を設定できます。あるいは、同じモジュール内で型にアクセスできるようにコードを変更することもできます。

詳細については、[YouTrackの対応するイシュー](https://youtrack.jetbrains.com/issue/KT-64474)を参照してください。

### KotlinプロパティとJavaフィールドが同じ名前を持つ場合の解決順序の一貫性

**変更点**

Kotlin 2.0.0より前は、JavaクラスとKotlinクラスが互いに継承し、同じ名前のKotlinプロパティとJavaフィールドを含む場合、重複した名前の解決動作が一貫していませんでした。また、IntelliJ IDEAとコンパイラーの間でも競合する動作がありました。Kotlin 2.0.0の新しい解決動作を開発する際、我々はユーザーへの影響を最小限に抑えることを目指しました。

例えば、`Base`というJavaクラスがあるとします。

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

また、前述の`Base`クラスを継承する`Derived`というKotlinクラスがあるとします。

```kotlin
class Derived : Base() {
    val a = "aa"

    // カスタムget()関数を宣言する
    val b get() = "bb"
}

fun main() {
    // Derived.aに解決される
    println(a)
    // aa

    // Base.bに解決される
    println(b)
    // b
}
```

Kotlin 2.0.0より前は、`a`は`Derived` Kotlinクラス内のKotlinプロパティに解決され、`b`は`Base` Javaクラス内のJavaフィールドに解決されました。

Kotlin 2.0.0では、例での解決動作は一貫しており、Kotlinプロパティが同じ名前のJavaフィールドを置き換えることを保証します。現在、`b`は`Derived.b`に解決されます。

> Kotlin 2.0.0より前は、IntelliJ IDEAを使用して`a`の宣言または使用箇所に移動すると、Kotlinプロパティに移動すべきだったにもかかわらず、誤ってJavaフィールドに移動しました。
>
> Kotlin 2.0.0からは、IntelliJ IDEAはコンパイラーと同じ場所に正しく移動します。
>
{style="note"}

一般的なルールとして、サブクラスが優先されます。前の例ではこれを示しており、`Derived`が`Base` Javaクラスのサブクラスであるため、`Derived`クラスのKotlinプロパティ`a`が解決されます。

継承が逆転し、JavaクラスがKotlinクラスを継承する場合には、サブクラスのJavaフィールドが、同じ名前のKotlinプロパティよりも優先されます。

この例を考えてみましょう。

<table>
   <tr>
       <td>Kotlin</td>
       <td>Java</td>
   </tr>
   <tr>
<td>

```kotlin
open class Base {
    val a = "aa"
}
```

</td>
<td>

```java
public class Derived extends Base {
    public String a = "a";
}
```

</td>
</tr>
</table>

そして、以下のコードでは：

```kotlin
fun main() {
    // Derived.aに解決される
    println(a)
    // a
}
```

**現在のベストプラクティス**

この変更がコードに影響を与える場合は、本当に重複した名前を使用する必要があるかを検討してください。それぞれが同じ名前のフィールドまたはプロパティを含み、互いに継承するJavaまたはKotlinクラスを持ちたい場合は、サブクラスのフィールドまたはプロパティが優先されることを覚えておいてください。

詳細については、[YouTrackの対応するイシュー](https://youtrack.jetbrains.com/issue/KT-55017)を参照してください。

### Javaプリミティブ配列のnull安全性の改善

**変更点**

Kotlin 2.0.0以降、コンパイラーはKotlinにインポートされたJavaプリミティブ配列のnull許容性を正しく推論します。現在、Javaプリミティブ配列とともに使用される`TYPE_USE`アノテーションからのネイティブなnull許容性を保持し、それらの値がアノテーションに従って使用されていない場合にエラーを発生させます。

通常、`@Nullable`および`@NotNull`アノテーションを持つJava型がKotlinから呼び出されると、適切なネイティブなnull許容性を受け取ります。

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

しかし、以前はJavaプリミティブ配列がKotlinにインポートされた場合、すべての`TYPE_USE`アノテーションが失われ、プラットフォームのnull許容性となり、安全でないコードにつながる可能性がありました。

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// dataService.fetchData()はアノテーションによると`null`である可能性があるにもかかわらず、エラーなし
// これによりNullPointerExceptionが発生する可能性がある
dataService.fetchData()[0]
```
この問題は、宣言自体に対するnull許容性アノテーションには影響せず、`TYPE_USE`アノテーションのみに影響したことに注意してください。

**現在のベストプラクティス**

Kotlin 2.0.0では、Javaプリミティブ配列のnull安全性がKotlinで標準となったため、使用している場合は新しい警告とエラーについてコードを確認してください。

*   明示的なnull許容性チェックなしで`@Nullable` Javaプリミティブ配列を使用するコード、またはnull許容でないプリミティブ配列を期待するJavaメソッドに`null`を渡そうとするコードは、これからはコンパイルに失敗します。
*   `@NotNull`プリミティブ配列をnull許容性チェックとともに使用すると、「不必要なセーフコール」または「nullとの比較は常にfalse」の警告が発せられます。

詳細については、[YouTrackの対応するイシュー](https://youtrack.jetbrains.com/issue/KT-54521)を参照してください。

### expectedクラスにおける抽象メンバーのより厳格なルール

> expectedおよびactualクラスは[ベータ](components-stability.md#stability-levels-explained)版です。これらはほぼ安定していますが、将来的には移行手順を実行する必要があるかもしれません。皆様が行うべきさらなる変更を最小限に抑えるよう最善を尽くします。
>
{style="warning"}

**変更点**

K2コンパイラーを使用したコンパイル時の共通ソースとプラットフォームソースの分離により、expectedクラスの抽象メンバーに対してより厳格なルールを実装しました。

以前のコンパイラーでは、expectedな非抽象クラスが[関数をオーバーライドする](inheritance.md#overriding-rules)ことなく抽象関数を継承することが可能でした。コンパイラーが共通コードとプラットフォームコードの両方に同時にアクセスできたため、コンパイラーは抽象関数がactualクラスに対応するオーバーライドと定義を持っているかどうかを確認できました。

現在、共通ソースとプラットフォームソースは別々にコンパイルされるため、継承された関数はexpectedクラスで明示的にオーバーライドされ、コンパイラーがその関数が抽象でないことを認識するようにしなければなりません。そうしないと、コンパイラーは`ABSTRACT_MEMBER_NOT_IMPLEMENTED`エラーを報告します。

例えば、共通ソースセットで、抽象関数`listFiles()`を持つ`FileSystem`という抽象クラスを宣言したとします。`listFiles()`関数は、actual宣言の一部としてプラットフォームソースセットで定義します。

共通コードで、`FileSystem`クラスを継承する`PlatformFileSystem`というexpectedな非抽象クラスがある場合、`PlatformFileSystem`クラスは抽象関数`listFiles()`を継承します。しかし、Kotlinでは非抽象クラスに抽象関数を持つことはできません。`listFiles()`関数を非抽象にするには、`abstract`キーワードなしでオーバーライドとして宣言する必要があります。

<table>
   <tr>
       <td>共通コード</td>
       <td>プラットフォームコード</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // Kotlin 2.0.0では、明示的なオーバーライドが必要である
    expect override fun listFiles()
    // Kotlin 2.0.0より前は、オーバーライドは不要だった
}
```

</td>
<td>

```kotlin
actual open class PlatformFileSystem : FileSystem {
    actual override fun listFiles() {}
}
```

</td>
</tr>
</table>

**現在のベストプラクティス**

expectedな非抽象クラスで抽象関数を継承する場合は、非抽象オーバーライドを追加してください。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual)の対応するイシューを参照してください。

### 主題領域別

これらの主題領域には、コードに影響を与える可能性は低いが、さらなる読書のために関連するYouTrackイシューへのリンクを提供する変更点がリストされています。Issue IDの横にアスタリスク (*) が付いている変更は、セクションの冒頭で説明されています。

#### 型推論 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                                                         |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | プロパティ参照のコンパイル済み関数シグネチャの型が明示的にNormalの場合の誤った型                                    |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | ビルダー推論コンテキストで型変数を上限に暗黙的に推論することを禁止する                                            |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2: 配列リテラル内のジェネリックアノテーション呼び出しに明示的な型引数を要求する                                  |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 交差型に対するサブタイピングチェックの漏れ                                                                        |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | KotlinにおけるJava型パラメータに基づく型のデフォルト表現を変更する                                                |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 前置インクリメントの推論された型を、inc()演算子の戻り値の型ではなくゲッターの戻り値の型に変更する                     |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2: 反変パラメータに使用される@UnsafeVarianceの存在に依存するのをやめる                                           |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2: 生の型に対して包含されたメンバーへの解決を禁止する                                                            |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2: 拡張関数パラメータを持つ呼び出し可能への呼び出し可能参照の型を適切に推論する                                  |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 分解変数の実際の型を、明示的な型が指定された場合に一貫させる                                                    |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2: 整数リテラルのオーバーフローにおける一貫性のない動作を修正する                                                |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 型引数からの匿名関数から匿名型が公開される可能性がある                                                            |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | breakを持つwhileループの条件が不正なスマートキャストを生成する可能性がある                                        |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2: expect/actualトップレベルプロパティに対する共通コードでのスマートキャストを禁止する                            |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 戻り値の型を変更するインクリメント演算子とプラス演算子はスマートキャストに影響を与える必要がある                      |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2: 変数型を明示的に指定すると、K1で動作していた一部のケースでバウンドスマートキャストが機能しなくなる      |

#### ジェネリクス {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | タイトル                                                                                                                                                 |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [投影されたレシーバー上の合成セッターの使用を非推奨にする](#deprecated-synthetics-setter-on-a-projected-receiver)                                  |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 生型パラメータを持つJavaメソッドをジェネリック型パラメータでオーバーライドすることを禁止する                                                                |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | null許容性のある型パラメータを\`in\`投影されたDNNパラメータに渡すことを禁止する                                                                     |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 型エイリアスのコンストラクターにおける上限違反を非推奨にする                                                                                             |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | Javaクラスに基づく反変なキャプチャ型に対する型不正を修正する                                                                                             |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 自己上限とキャプチャ型を持つ不正なコードを禁止する                                                                                              |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | ジェネリックアウタークラスのジェネリックインナークラスにおける不正なバウンド違反を禁止する                                                                          |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2: インナークラスの外側のスーパータイプの投影に対するPROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPEを導入する                                       |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 別のスーパータイプからの追加の特殊化された実装を持つプリミティブのコレクションから継承する場合にMANY_IMPL_MEMBER_NOT_IMPLEMENTEDを報告する |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2: 展開型に共変性修飾子を持つ型エイリアスでのコンストラクター呼び出しと継承を禁止する                                              |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 自己上限を持つキャプチャ型の不適切な処理によって引き起こされる型ホールの修正                                                                    |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | ジェネリックパラメータに誤った型を持つジェネリック委譲コンストラクター呼び出しを禁止する                                                                     |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 上限がキャプチャ型である場合に、不足している上限違反を報告する                                                                                |

#### 解決 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | タイトル                                                                                                                                                                                        |
|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [オーバーロード解決時に、基底クラスのJavaフィールドよりも派生クラスのKotlinプロパティを選択する](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | `invoke`規約が期待される脱糖と一貫して動作するようにする                                                                                                                           |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2: コンパニオンオブジェクトが静的スコープよりも優先される場合の修飾子解決動作を変更する                                                                                             |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 型を解決し、同じ名前のクラスがスターインポートされている場合に曖昧性エラーを報告する                                                                                                 |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2: COMPATIBILITY_WARNINGに関する解決を移行する                                                                                                                                          |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 同じ依存関係の2つの異なるバージョンに含まれる依存クラスがある場合のCONFLICTING_INHERITED_MEMBERSの偽陰性                                                                |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | レシーバーを持つ関数型のプロパティinvokeは、拡張関数invokeよりも優先される                                                                                               |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 修飾された`this`: 型ケースで修飾された`this`を導入/優先する                                                                                                                           |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | クラスパスにおけるFQ名競合の場合の未指定動作を確認する                                                                                                                       |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2: インポートで型エイリアスを修飾子として使用することを禁止する                                                                                                                                         |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2: 下位レベルで曖昧性を持つ型参照に対する解決タワーの誤動作                                                                                                     |

#### 可視性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                    | タイトル                                                                                                                         |
|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [アクセス不可能な型の使用を未指定動作として宣言する](#forbidden-use-of-inaccessible-generic-types)                   |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 内部インライン関数からプライベートクラスのコンパニオンオブジェクトメンバーを呼び出す際のPRIVATE_CLASS_MEMBER_FROM_INLINEの偽陰性 |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | オーバーライドされた宣言が可視であっても、同等のゲッターが不可視の場合、合成プロパティを不可視にする                |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 別のモジュールの派生クラスから内部セッターにアクセスすることを禁止する                                                         |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | プライベートインライン関数から匿名型を公開することを禁止する                                                               |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | public-APIインライン関数からの暗黙的な非public-APIアクセスを禁止する                                                       |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | スマートキャストはprotectedメンバーの可視性に影響を与えるべきではない                                                                  |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | publicインライン関数から見落とされたプライベート演算子関数へのアクセスを禁止する                                             |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1: protected valをオーバーライドするvarのセッターがpublicとして生成される                                                       |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | Kotlin/Nativeのリンク時においてプライベートメンバーによるオーバーライドを禁止する                                                            |

#### アノテーション {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                                                 |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | EXPRESSIONターゲットを持たないアノテーションでステートメントをアノテーション付けすることを禁止する         |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | \`REPEATED_ANNOTATION\`チェック中に括弧式を無視する                                                    |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2: プロパティゲッターに対する使用箇所 'get' ターゲットアノテーションを禁止する                           |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | where句の型パラメータに対するアノテーションを禁止する                                                      |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | コンパニオンオブジェクトに対するアノテーションの解決において、コンパニオンスコープが無視される             |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2: ユーザーとコンパイラー必須のアノテーション間に曖昧性が導入された                                     |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | enum値のアノテーションはenum値クラスにコピーされるべきではない                                           |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2: \`()?\`でラップされた型の互換性のないアノテーションに対して\`WRONG_ANNOTATION_TARGET\`が報告される |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2: catchパラメータ型の注釈に対して\`WRONG_ANNOTATION_TARGET\`が報告される                              |

#### null安全性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | タイトル                                                                                                                   |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [JavaでNullableとしてアノテーション付けされた配列型の安全でない使用を非推奨にする](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2: セーフコールと規約演算子の組み合わせに対する評価セマンティクスを変更する                                                |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | スーパタイプの順序は継承された関数のnull許容パラメータを定義する                                                            |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | publicシグネチャでローカル型を近似する際にnull許容性を保持する                                                              |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | null許容値を非nullのJavaフィールドに割り当てることを、安全でない代入のセレクターとして禁止する                              |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 警告レベルのJava型のエラーレベルのnull許容引数に対する不足しているエラーを報告する                                        |

#### Java相互運用性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                                                     |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | ソース内で同じFQ名を持つJavaとKotlinのクラスを禁止する                                                     |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | Javaコレクションから継承されたクラスは、スーパタイプの順序によって一貫性のない動作をする                       |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2: KotlinプライベートクラスからのJavaクラス継承の場合における未指定動作                                     |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | Javaの可変長引数メソッドをインライン関数に渡すと、実行時に単一の配列ではなく配列の配列になる                 |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | K-J-K階層で内部メンバーをオーバーライドできるようにする                                                      |

#### プロパティ {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | タイトル                                                                                                                                        |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] バッキングフィールドを持つopenプロパティの遅延初期化を禁止する](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | プライマリコンストラクターが存在しない場合、またはクラスがローカルである場合に、見落とされたMUST_BE_INITIALIZEDを非推奨にする  |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | プロパティに対する潜在的なinvoke呼び出しの場合に再帰的な解決を禁止する                                                                      |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 基底クラスが別のモジュールからのものである場合に、見えない派生クラスからの基底クラスプロパティに対するスマートキャストを非推奨にする |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2: データクラスプロパティに対するOPT_IN_USAGE_ERRORの漏れ                                                                                    |

#### 制御フロー {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                                     |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1とK2間でのクラス初期化ブロックにおけるCFAの一貫性のないルール                              |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | 括弧内のelse分岐がないif条件におけるK1/K2の不整合                                          |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | スコープ関数で初期化されたtry/catchブロックでの"VAL_REASSIGNMENT"の偽陰性                    |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | tryブロックからcatchおよびfinallyブロックへのデータフロー情報を伝播する                      |

#### Enumクラス {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                         |
|-----------------------------------------------------------|----------------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | enumエントリの初期化中にenumクラスのコンパニオンオブジェクトへのアクセスを禁止する |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | enumクラスにおける仮想インラインメソッドの見落とされたエラーを報告する           |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | プロパティ/フィールドとenumエントリ間の解決における曖昧性を報告する                |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | コンパニオンプロパティがenumエントリよりも優先される場合の修飾子解決動作を変更する |

#### 関数型（SAM）インターフェース {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                                                           |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | アノテーションなしでOptInを必要とするSAMコンストラクターの使用を非推奨にする                                         |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | JDK関数インターフェースのSAMコンストラクターに対するラムダから不正なnull許容値で値を返すことを禁止する |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 呼び出し可能参照のパラメータ型のSAM変換がCCEにつながる                                                           |

#### コンパニオンオブジェクト {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | タイトル                                                                 |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | コンパニオンオブジェクトのメンバーへの呼び出し外参照が無効なシグネチャを持つ |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | Vにコンパニオンがある場合の(V)::foo参照解決を変更する                     |

#### その他 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | タイトル                                                                                                                                      |
|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPPは、共通コードの継承者に対して、実装が実際の対応する箇所にある場合に[ABSTRACT_MEMBER_NOT_IMPLEMENTED]を報告する |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 修飾された`this`: 潜在的なラベル競合の場合に動作を変更する                                                                       |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | Javaサブクラスにおける意図しない競合オーバーロードの場合のJVMバックエンドでの不正な関数マングリングを修正する                 |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LCの問題] ステートメント位置での中断マークされた匿名関数の宣言を禁止する                                                   |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn: マーカーの下でデフォルト引数（デフォルト値を持つパラメータ）を持つコンストラクター呼び出しを禁止する                                                  |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 変数に対する式とinvoke解決に対して、誤ってUnit変換が許可される                                                               |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2は\`false && ...\`および\`false &VerticalLine;&VerticalLine; ...\`を破壊する                                                             |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] \`header\`/\`impl\`キーワードを非推奨にする                                                                                                |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | デフォルトでinvokedynamic + LambdaMetafactoryを介してすべてのKotlinラムダを生成する                                                               |

## Kotlinリリースとの互換性

以下のKotlinリリースは、新しいK2コンパイラーをサポートしています。

| Kotlinリリース        | 安定性レベル |
|-----------------------|--------------|
| 2.0.0–%kotlinVersion% | Stable       |
| 1.9.20–1.9.25         | Beta         |
| 1.9.0–1.9.10          | JVMはBeta    |
| 1.7.0–1.8.22          | Alpha        |

## Kotlinライブラリとの互換性

Kotlin/JVMを使用している場合、K2コンパイラーはどのバージョンのKotlinでコンパイルされたライブラリでも動作します。

Kotlin Multiplatformを使用している場合、K2コンパイラーはKotlinバージョン1.9.20以降でコンパイルされたライブラリで動作することが保証されています。

## コンパイラープラグインのサポート

現在、Kotlin K2コンパイラーは以下のKotlinコンパイラープラグインをサポートしています。

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [Serialization](serialization.md)

さらに、Kotlin K2コンパイラーは以下をサポートしています。

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0コンパイラープラグイン以降のバージョン。
*   [Kotlin Symbol Processing (KSP)](ksp-overview.md) は[KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)以降。

> 他に追加のコンパイラープラグインを使用している場合は、K2と互換性があるかどうかをドキュメントで確認してください。
>
{style="tip"}

### カスタムコンパイラープラグインをアップグレードする

> カスタムコンパイラープラグインは、[実験的](components-stability.md#stability-levels-explained)なプラグインAPIを使用します。そのため、APIはいつでも変更される可能性があり、後方互換性は保証できません。
>
{style="warning"}

アップグレードプロセスには、お持ちのカスタムプラグインの種類に応じて2つのパスがあります。

#### バックエンドのみのコンパイラープラグイン

プラグインが`IrGenerationExtension`拡張ポイントのみを実装している場合、プロセスは他の新しいコンパイラーリリースと同じです。使用しているAPIに変更がないか確認し、必要に応じて変更を加えます。

#### バックエンドおよびフロントエンドのコンパイラープラグイン

プラグインがフロントエンド関連の拡張ポイントを使用している場合、新しいK2コンパイラーAPIを使用してプラグインを書き直す必要があります。新しいAPIの概要については、[FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)を参照してください。

> カスタムコンパイラープラグインのアップグレードに関する質問がある場合は、弊社の[#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slackチャンネルに参加してください。最善を尽くしてサポートします。
>
{style="note"}

## 新しいK2コンパイラーに関するフィードバックを共有する

皆様からのフィードバックを心よりお待ちしております！

*   新しいK2コンパイラーへの移行中に直面した問題は、[弊社のイシュートラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)で報告してください。
*   [使用状況統計の送信オプションを有効にして](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)、JetBrainsがK2の使用状況に関する匿名データを収集できるようにしてください。