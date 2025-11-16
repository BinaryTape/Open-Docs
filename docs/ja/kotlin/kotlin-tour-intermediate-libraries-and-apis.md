[//]: # (title: 中級: ライブラリとAPI)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-done.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊なクラス</a><br />
        <img src="icon-7-done.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-done.svg" width="20" alt="8番目のステップ" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9.svg" width="20" alt="9番目のステップ" /> <strong>ライブラリとAPI</strong><br /></p>
</tldr>

Kotlinを最大限に活用するには、既存のライブラリやAPIを利用して、車輪の再発明に時間を費やすのではなく、より多くの時間をコーディングに使えるようにしましょう。

ライブラリは、一般的なタスクを簡素化する再利用可能なコードを配布します。ライブラリ内には、関連するクラス、関数、ユーティリティをグループ化するパッケージやオブジェクトがあります。ライブラリは、開発者がコードで使用できる関数、クラス、プロパティのセットとしてAPI（Application Programming Interfaces）を公開しています。

![KotlinのライブラリとAPI](kotlin-library-diagram.svg){width=600}

Kotlinで何ができるか見ていきましょう。

## 標準ライブラリ

Kotlinには、コードを簡潔かつ表現豊かにするための必須の型、関数、コレクション、ユーティリティを提供する標準ライブラリがあります。標準ライブラリの大部分（[`kotlin`パッケージ](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/)内のすべて）は、明示的にインポートする必要なく、どのKotlinファイルでもすぐに利用できます。

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // 標準ライブラリのreversed()関数を使用
    val reversedText = text.reversed()

    // 標準ライブラリのprint()関数を使用
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

しかし、標準ライブラリの一部は、コードで使用する前にインポートが必要です。例えば、標準ライブラリの時刻計測機能を使用したい場合は、[`kotlin.time`パッケージ](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)をインポートする必要があります。

ファイルの先頭で、必要なパッケージの後に`import`キーワードを追加します。

```kotlin
import kotlin.time.*
```

アスタリスク`*`はワイルドカードインポートであり、パッケージ内のすべてをインポートするようにKotlinに指示します。アスタリスク`*`をコンパニオンオブジェクトと一緒に使用することはできません。代わりに、使用したいコンパニオンオブジェクトのメンバーを明示的に宣言する必要があります。

例：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-time"}

この例では、以下のことを行います。

*   `Duration`クラスと、そのコンパニオンオブジェクトから`hours`および`minutes`拡張プロパティをインポートします。
*   `minutes`プロパティを使用して`30`を30分の`Duration`に変換します。
*   `hours`プロパティを使用して`0.5`を30分の`Duration`に変換します。
*   両方の期間が等しいかチェックし、結果を出力します。

### 自分で実装する前に検索する

独自のコードを記述することを決定する前に、探しているものが既に存在しないか標準ライブラリを確認してください。標準ライブラリがすでに多数のクラス、関数、プロパティを提供している分野のリストを以下に示します。

*   [コレクション](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
*   [シーケンス](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
*   [文字列操作](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
*   [時間管理](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

標準ライブラリに他に何があるか詳しく知るには、その[APIリファレンス](https://kotlinlang.org/api/core/kotlin-stdlib/)を参照してください。

## Kotlinライブラリ

標準ライブラリは多くの一般的なユースケースをカバーしていますが、対処できないものもあります。幸いなことに、Kotlinチームとコミュニティの残りのメンバーは、標準ライブラリを補完する幅広いライブラリを開発してきました。例えば、[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)は、異なるプラットフォーム間で時間を管理するのに役立ちます。

便利なライブラリは当社の[検索プラットフォーム](https://klibs.io/)で見つけることができます。それらを使用するには、依存関係やプラグインの追加など、追加の手順が必要です。各ライブラリには、Kotlinプロジェクトに含める方法についての説明が記載されたGitHubリポジトリがあります。

ライブラリを追加したら、その中の任意のパッケージをインポートできます。以下は、ニューヨークの現在時刻を見つけるために`kotlinx-datetime`パッケージをインポートする方法の例です。

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // 現在のインスタントを取得
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

この例では、以下のことを行います。

*   `kotlinx.datetime`パッケージをインポートします。
*   `Clock.System.now()`関数を使用して現在時刻を含む`Instant`クラスのインスタンスを作成し、結果を`now`変数に割り当てます。
*   現在時刻を出力します。
*   `TimeZone.of()`関数を使用してニューヨークのタイムゾーンを見つけ、結果を`zone`変数に割り当てます。
*   現在時刻を含むインスタンスで`.toLocalDateTime()`関数を呼び出し、ニューヨークのタイムゾーンを引数として渡します。
*   結果を`localDateTime`変数に割り当てます。
*   ニューヨークのタイムゾーンに合わせて調整された時刻を出力します。

> この例で使用されている関数とクラスについてさらに詳しく調べるには、[APIリファレンス](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)を参照してください。
>
{style="tip"}

## APIへのオプトイン

ライブラリの作成者は、コードで使用する前に特定のAPIにオプトインが必要であるとマークする場合があります。これは通常、APIがまだ開発中であり、将来変更される可能性がある場合に行われます。オプトインしない場合、次のような警告またはエラーが表示されます。

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

オプトインするには、`@OptIn`の後に、APIを分類するクラス名をカッコで囲み、二重コロン`::`と`class`を付け加えて記述します。

例えば、標準ライブラリの`uintArrayOf()`関数は、[APIリファレンス](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html)に示されているように、`@ExperimentalUnsignedTypes`に属します。

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

コードでは、オプトインは次のようになります。

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

以下は、`uintArrayOf()`関数を使用して符号なし整数の配列を作成し、その要素の1つを変更するためにオプトインする例です。

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // 符号なし整数配列を作成
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // 要素を変更
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

これが最も簡単なオプトイン方法ですが、他にも方法があります。詳細については、[オプトイン要件](opt-in-requirements.md)を参照してください。

## 練習問題

### 練習問題1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

あなたは、ユーザーが投資の将来価値を計算するのに役立つ金融アプリケーションを開発しています。複利を計算する式は次のとおりです。

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

ここで、

*   `A`は利息適用後の累積金額（元金＋利息）。
*   `P`は元金（初期投資額）。
*   `r`は年利（小数）。
*   `n`は1年間の複利計算回数。
*   `t`は投資期間（年数）。

コードを更新して、以下の操作を行ってください。

1.  [`kotlin.math`パッケージ](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/)から必要な関数をインポートします。
2.  複利適用後の最終金額を計算する`calculateCompoundInterest()`関数にボディを追加します。

|--|--|

```kotlin
// Write your code here

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // Write your code here
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}

```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-1"}

|---|---|
```kotlin
import kotlin.math.*

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * (1 + r / n).pow(n * t)
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-libraries-solution-1"}

### 練習問題2 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-2"}

プログラムで複数のデータ処理タスクを実行するのにかかる時間を測定したいと考えています。[`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)パッケージから正しいインポートステートメントと関数を追加するようにコードを更新してください。

|---|---|

```kotlin
// Write your code here

fun main() {
    val timeTaken = /* Write your code here */ {
        // Simulate some data processing
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // Simulate processing the filtered data
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-2"}

|---|---|
```kotlin
import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        // データ処理をシミュレート
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // フィルタリングされたデータの処理をシミュレート
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-libraries-solution-2"}

### 練習問題3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

最新のKotlinリリースで利用できる標準ライブラリに新機能があります。試してみたいのですが、オプトインが必要です。この機能は[`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)に該当します。コードでのオプトインはどのように記述すべきですか？

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-libraries-solution-3"}

## 次のステップ

おめでとうございます！中級ツアーを修了しました！次のステップとして、人気のあるKotlinアプリケーションのチュートリアルをご覧ください。

*   [Spring BootとKotlinでバックエンドアプリケーションを作成する](jvm-create-project-with-spring-boot.md)
*   AndroidとiOS向けのクロスプラットフォームアプリケーションを一から作成する（そして以下）：
    *   [UIをネイティブのままビジネスロジックを共有する](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
    *   [ビジネスロジックとUIを共有する](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)