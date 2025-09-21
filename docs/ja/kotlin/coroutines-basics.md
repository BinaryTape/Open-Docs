<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンの基礎)

複数のタスクを同時に実行するアプリケーションを作成するために、並行処理（concurrency）として知られる概念で、Kotlinは_コルーチン_を使用します。コルーチンは中断可能な計算であり、明確で逐次的なスタイルで並行コードを記述できます。コルーチンは他のコルーチンと並行して、また場合によっては並列に実行できます。

JVMおよびKotlin/Nativeでは、コルーチンなどのすべての並行コードは、オペレーティングシステムによって管理される_スレッド_上で実行されます。コルーチンはスレッドをブロックする代わりに、実行を中断できます。これにより、あるコルーチンがデータの到着を待って中断し、別のコルーチンが同じスレッドで実行されることが可能になり、効果的なリソース利用が保証されます。

![並列スレッドと並行スレッドの比較](parallelism-and-concurrency.svg){width="700"}

コルーチンとスレッドの違いについて詳しくは、[コルーチンとJVMスレッドの比較](#comparing-coroutines-and-jvm-threads)をご覧ください。

## 中断関数

コルーチンの最も基本的な構成要素は_中断関数_です。これにより、実行中の操作はコードの構造に影響を与えることなく一時停止し、後で再開できます。

中断関数を宣言するには、`suspend`キーワードを使用します。

```kotlin
suspend fun greet() {
    println("Hello world from a suspending function")
}
```

中断関数は、別の中断関数からのみ呼び出すことができます。Kotlinアプリケーションのエントリポイントで中断関数を呼び出すには、`main()`関数に`suspend`キーワードを付けます。

```kotlin
suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}
```
{kotlin-runnable="true"}

この例ではまだ並行処理を使用していませんが、関数に`suspend`キーワードを付けることで、他の中断関数を呼び出し、内部で並行コードを実行できるようになります。

`suspend`キーワードはKotlin言語のコア部分ですが、ほとんどのコルーチン機能は[`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)ライブラリを介して利用できます。

## プロジェクトに`kotlinx.coroutines`ライブラリを追加する

`kotlinx.coroutines`ライブラリをプロジェクトに含めるには、ビルドツールに基づいて対応する依存関係設定を追加します。

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>

<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 初めてのコルーチンを作成する

> このページの例では、コルーチンビルダー関数`CoroutineScope.launch()`および`CoroutineScope.async()`で明示的な`this`式を使用しています。これらのコルーチンビルダーは`CoroutineScope`の[拡張関数](extensions.md)であり、`this`式は現在の`CoroutineScope`をレシーバーとして参照します。
>
> 実用的な例については、[コルーチンスコープからコルーチンビルダーを抽出する](#extract-coroutine-builders-from-the-coroutine-scope)をご覧ください。
>
{style="note"}

Kotlinでコルーチンを作成するには、次のものが必要です。

*   [中断関数](#suspending-functions)。
*   実行できる[コルーチンスコープ](#coroutine-scope-and-structured-concurrency)。例えば、`withContext()`関数内など。
*   コルーチンを開始するための`CoroutineScope.launch()`のような[コルーチンビルダー](#coroutine-builder-functions)。
*   どのスレッドを使用するかを制御する[ディスパッチャー](#coroutine-dispatchers)。

マルチスレッド環境で複数のコルーチンを使用する例を見てみましょう。

1.  `kotlinx.coroutines`ライブラリをインポートします。

    ```kotlin
    import kotlinx.coroutines.*
    ```

2.  一時停止および再開できる関数に`suspend`キーワードを付けます。

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
    }
    
    suspend fun main() {}
    ```

    > 一部のプロジェクトでは`main()`関数を`suspend`としてマークできますが、既存のコードと統合する場合やフレームワークを使用する場合は、それができない場合があります。その場合は、フレームワークのドキュメントで中断関数の呼び出しをサポートしているか確認してください。サポートされていない場合は、[`runBlocking()`](#runblocking)を使用して現在のスレッドをブロックすることで呼び出します。
    >
    {style="note"}

3.  データフェッチやデータベースへの書き込みなどの中断タスクをシミュレートするために、[`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html#)関数を追加します。

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        delay(1000L)
    }
   ```

4.  マルチスレッドの並行コードのエントリポイントを定義するために、[`withContext(Dispatchers.Default)`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#)を使用して、共有スレッドプールで実行します。

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) {
            // Add the coroutine builders here
        }
    }
    ```

   > 中断関数`withContext()`は通常[コンテキストスイッチ](coroutine-context-and-dispatchers.md#jumping-between-threads)に使用されますが、この例では並行コードの非ブロッキングなエントリポイントも定義します。これは[`Dispatchers.Default`ディスパッチャー](#coroutine-dispatchers)を使用して、マルチスレッド実行のための共有スレッドプールでコードを実行します。デフォルトでは、このプールはランタイムで利用可能なCPUコアと同じ数のスレッド（最低2つ）を使用します。
   >
   > `withContext()`ブロック内で起動されたコルーチンは、同じコルーチンスコープを共有し、[構造化された並行処理](#coroutine-scope-and-structured-concurrency)を保証します。
   >
   {style="note"}

5.  [`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)のような[コルーチンビルダー関数](#coroutine-builder-functions)を使用してコルーチンを開始します。

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) { // this: CoroutineScope
            // このスコープ内でCoroutineScope.launch()を使ってコルーチンを開始します
            this.launch { greet() }
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```

6.  これらの要素を組み合わせて、共有スレッドプール上で複数のコルーチンを同時に実行します。

    ```kotlin
    // コルーチンライブラリをインポートします
    import kotlinx.coroutines.*

    // kotlin.time.Durationをインポートして秒単位で期間を表現します
    import kotlin.time.Duration.Companion.seconds

    // 中断関数を定義します
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        // 1秒間中断し、スレッドを解放します
        delay(1.seconds) 
        // ここではdelay()関数が中断API呼び出しをシミュレートします
        // ネットワークリクエストのような中断API呼び出しをここに追加できます
    }

    suspend fun main() {
        // このブロック内のコードを共有スレッドプールで実行します
        withContext(Dispatchers.Default) { // this: CoroutineScope
            this.launch() {
                greet()
            }
   
            // 別のコルーチンを開始します
            this.launch() {
                println("The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}")
                delay(1.seconds)
                // ここではdelay関数が中断API呼び出しをシミュレートします
                // ネットワークリクエストのような中断API呼び出しをここに追加できます
            }
    
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```
    {kotlin-runnable="true"}

この例を複数回実行してみてください。プログラムを実行するたびに出力順序とスレッド名が変更される可能性があります。これは、OSがスレッドの実行を決定するためです。

> 追加情報として、コードの出力でコルーチン名をスレッド名の横に表示できます。これを行うには、ビルドツールまたはIDEの実行構成で`-Dkotlinx.coroutines.debug` VMオプションを渡します。
>
> 詳しくは、[コルーチンのデバッグ](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/topics/debugging.md)をご覧ください。
>
{style="tip"}

## コルーチンスコープと構造化された並行処理

アプリケーションで多くのコルーチンを実行する場合、それらをグループとして管理する方法が必要です。Kotlinコルーチンは、この構造を提供するために_構造化された並行処理_と呼ばれる原則に依存しています。

この原則によれば、コルーチンは、ライフサイクルがリンクされた親タスクと子タスクのツリー階層を形成します。コルーチンのライフサイクルは、作成から完了、失敗、またはキャンセルまでの状態のシーケンスです。

親コルーチンは、すべての子コルーチンが完了するまで終了しません。親コルーチンが失敗したりキャンセルされたりした場合、すべての子コルーチンも再帰的にキャンセルされます。このようにコルーチンを接続することで、キャンセルとエラー処理が予測可能で安全になります。

構造化された並行処理を維持するために、新しいコルーチンは、ライフサイクルを定義および管理する[`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)内でしか起動できません。`CoroutineScope`には、ディスパッチャーやその他の実行プロパティを定義する_コルーチンコンテキスト_が含まれています。あるコルーチン内で別のコルーチンを開始すると、それは自動的に親スコープの子になります。

`CoroutineScope`上で`CoroutineScope.launch()`などの[コルーチンビルダー関数](#coroutine-builder-functions)を呼び出すと、そのスコープに関連付けられたコルーチンの子コルーチンが開始されます。ビルダーのブロック内では、[レシーバー](lambdas.md#function-literals-with-receiver)はネストされた`CoroutineScope`であるため、そこで起動するコルーチンはすべてその子となります。

### `coroutineScope()`関数でコルーチンスコープを作成する

現在のコルーチンコンテキストで新しいコルーチンスコープを作成するには、[`coroutineScope()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html)関数を使用します。この関数は、コルーチンサブツリーのルートコルーチンを作成します。これは、ブロック内で起動されたコルーチンの直接の親であり、それらが起動する任意のコルーチンの間接的な親です。`coroutineScope()`は中断ブロックを実行し、そのブロックとそこで起動されたすべてのコルーチンが完了するまで待機します。

例を次に示します。

```kotlin
// kotlin.time.Durationをインポートして秒単位で期間を表現します
import kotlin.time.Duration.Companion.seconds

import kotlinx.coroutines.*

// コルーチンコンテキストでディスパッチャーが指定されていない場合、
// CoroutineScope.launch()はDispatchers.Defaultを使用します
//sampleStart
suspend fun main() {
    // コルーチンサブツリーのルート
    coroutineScope { // this: CoroutineScope
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    // coroutineScope内のすべての子が完了した後にのみ実行されます
    println("Coroutine scope completed")
}
//sampleEnd
```
{kotlin-runnable="true"}

この例では[ディスパッチャー](#coroutine-dispatchers)が指定されていないため、`coroutineScope()`ブロック内の`CoroutineScope.launch()`ビルダー関数は現在のコンテキストを継承します。そのコンテキストに指定されたディスパッチャーがない場合、`CoroutineScope.launch()`は`Dispatchers.Default`を使用します。これは共有スレッドプールで実行されます。

### コルーチンスコープからコルーチンビルダーを抽出する

場合によっては、[`CoroutineScope.launch()`](#coroutinescope-launch)のようなコルーチンビルダーの呼び出しを別の関数に抽出したいと思うかもしれません。

次の例を考えてみましょう。

```kotlin
suspend fun main() {
    coroutineScope { // this: CoroutineScope
        // CoroutineScopeがレシーバーであるCoroutineScope.launch()を呼び出す
        this.launch { println("1") }
        this.launch { println("2") }
    } 
}
```

> `this.launch`は、明示的な`this`式なしで`launch`と記述することもできます。これらの例では、`CoroutineScope`の拡張関数であることを強調するために、明示的な`this`式を使用しています。
>
> Kotlinでのレシーバーを持つラムダの動作について詳しくは、[レシーバーを持つ関数リテラル](lambdas.md#function-literals-with-receiver)をご覧ください。
>
{style="tip"}

`coroutineScope()`関数は、`CoroutineScope`レシーバーを持つラムダを受け取ります。このラムダ内では、暗黙的なレシーバーは`CoroutineScope`であるため、`CoroutineScope.launch()`や[`CoroutineScope.async()`](#coroutinescope-async)などのビルダー関数は、そのレシーバー上の[拡張関数](extensions.md#extension-functions)として解決されます。

コルーチンビルダーを別の関数に抽出するには、その関数が`CoroutineScope`レシーバーを宣言する必要があります。そうしないと、コンパイルエラーが発生します。

```kotlin
import kotlinx.coroutines.*
//sampleStart
suspend fun main() {
    coroutineScope {
        launchAll()
    }
}

fun CoroutineScope.launchAll() { // this: CoroutineScope
    // CoroutineScope上で.launch()を呼び出す
    this.launch { println("1") }
    this.launch { println("2") } 
}
//sampleEnd
/* -- CoroutineScopeをレシーバーとして宣言せずにlaunchを呼び出すとコンパイルエラーになります --

fun launchAll() {
    // コンパイルエラー: thisが定義されていません
    this.launch { println("1") }
    this.launch { println("2") }
}
 */
```
{kotlin-runnable="true"}

## コルーチンビルダー関数

コルーチンビルダー関数は、実行するコルーチンを定義する`suspend`[ラムダ](lambdas.md)を受け入れる関数です。以下にいくつかの例を示します。

*   [`CoroutineScope.launch()`](#coroutinescope-launch)
*   [`CoroutineScope.async()`](#coroutinescope-async)
*   [`runBlocking()`](#runblocking)
*   [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html)
*   [`coroutineScope()`](#create-a-coroutine-scope-with-the-coroutinescope-function)

コルーチンビルダー関数は、実行する`CoroutineScope`が必要です。これは既存のスコープ、または`coroutineScope()`、[`runBlocking()`](#runblocking)、[`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#)などのヘルパー関数で作成するスコープのいずれかです。各ビルダーは、コルーチンがどのように開始され、その結果とどのようにやり取りするかを定義します。

### `CoroutineScope.launch()`

[`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html#)コルーチンビルダー関数は、`CoroutineScope`の拡張関数です。これは、既存の[コルーチンスコープ](#coroutine-scope-and-structured-concurrency)内で、スコープの残りをブロックすることなく、新しいコルーチンを開始します。

結果が必要ない場合や待機したくない場合に、他の作業と並行してタスクを実行するために`CoroutineScope.launch()`を使用します。

```kotlin
// kotlin.time.Durationをインポートしてミリ秒単位で期間を表現できるようにします
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        performBackgroundWork()
    }
}

//sampleStart
suspend fun performBackgroundWork() = coroutineScope { // this: CoroutineScope
    // スコープをブロックせずに実行されるコルーチンを開始
    this.launch {
        // バックグラウンド作業をシミュレートするために中断
        delay(100.milliseconds)
        println("Sending notification in background")
    }

    // 前のコルーチンが中断している間もメインコルーチンは続行
    println("Scope continues")
}
//sampleEnd
```
{kotlin-runnable="true"}

この例を実行すると、`main()`関数が`CoroutineScope.launch()`によってブロックされず、コルーチンがバックグラウンドで動作している間も他のコードを実行し続けることがわかります。

> `CoroutineScope.launch()`関数は、[`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/)ハンドルを返します。このハンドルを使用して、起動されたコルーチンが完了するのを待機します。
> 詳しくは、[キャンセルとタイムアウト](cancellation-and-timeouts.md#cancelling-coroutine-execution)をご覧ください。
>
{style="tip"}

### `CoroutineScope.async()`

[`CoroutineScope.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)コルーチンビルダー関数は、`CoroutineScope`の拡張関数です。これは、既存の[コルーチンスコープ](#coroutine-scope-and-structured-concurrency)内で並行計算を開始し、最終的な結果を表す[`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/)ハンドルを返します。結果が準備できるまでコードを中断するために、`.await()`関数を使用します。

```kotlin
// kotlin.time.Durationをインポートしてミリ秒単位で期間を表現できるようにします
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    // 最初のページのダウンロードを開始
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }

    // 2番目のページを並列でダウンロード開始
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }

    // 両方の結果を待機し、比較
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}
//sampleEnd
```
{kotlin-runnable="true"}

### `runBlocking()`

[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html)コルーチンビルダー関数はコルーチンスコープを作成し、そのスコープで起動されたコルーチンが終了するまで現在の[スレッド](#comparing-coroutines-and-jvm-threads)をブロックします。

`runBlocking()`は、非中断コードから中断コードを呼び出すための他の選択肢がない場合にのみ使用します。

```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

// 変更できないサードパーティインターフェース
interface Repository {
    fun readItem(): Int
}

object MyRepository : Repository {
    override fun readItem(): Int {
        // 中断関数への橋渡し
        return runBlocking {
            myReadItem()
        }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}
```

## コルーチンディスパッチャー

_コルーチンディスパッチャー_は、コルーチンが実行に使用するスレッドまたはスレッドプールを制御します。コルーチンは常に単一のスレッドに縛られているわけではありません。ディスパッチャーに応じて、あるスレッドで一時停止し、別のスレッドで再開できます。これにより、すべてのコルーチンに個別のスレッドを割り当てることなく、多くのコルーチンを同時に実行できます。

> コルーチンは異なるスレッドで中断および再開できますが、コルーチンが中断する前に書き込まれた値は、再開時に同じコルーチン内で引き続き利用できることが保証されます。
>
{style="tip"}

ディスパッチャーは、[コルーチンスコープ](#coroutine-scope-and-structured-concurrency)と連携して、コルーチンがいつ、どこで実行されるかを定義します。コルーチンスコープがコルーチンのライフサイクルを制御する一方、ディスパッチャーはどのスレッドが実行に使用されるかを制御します。

> すべてのコルーチンにディスパッチャーを指定する必要はありません。デフォルトでは、コルーチンは親スコープからディスパッチャーを継承します。異なるコンテキストでコルーチンを実行するためにディスパッチャーを指定できます。
>
> コルーチンコンテキストにディスパッチャーが含まれていない場合、コルーチンビルダーは`Dispatchers.Default`を使用します。
>
{style="note"}

`kotlinx.coroutines`ライブラリには、さまざまなユースケースに対応する異なるディスパッチャーが含まれています。例えば、[`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html)は、メインスレッドとは別に、バックグラウンドで作業を実行する共有スレッドプールでコルーチンを実行します。これは、データ処理のようなCPU集中型操作にとって理想的な選択肢となります。

`CoroutineScope.launch()`のようなコルーチンビルダーにディスパッチャーを指定するには、引数として渡します。

```kotlin
suspend fun runWithDispatcher() = coroutineScope { // this: CoroutineScope
    this.launch(Dispatchers.Default) {
        println("Running on ${Thread.currentThread().name}")
    }
}
```

あるいは、`withContext()`ブロックを使用して、その中のすべてのコードを指定されたディスパッチャーで実行することもできます。

```kotlin
// kotlin.time.Durationをインポートしてミリ秒単位で期間を表現できるようにします
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    println("Running withContext block on ${Thread.currentThread().name}")

    val one = this.async {
        println("First calculation starting on ${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on ${Thread.currentThread().name}")
        sum
    }

    val two = this.async {
        println("Second calculation starting on ${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on ${Thread.currentThread().name}")
        sum
    }

    // 両方の計算を待機し、結果を出力
    println("Combined total: ${one.await() + two.await()}")
}
//sampleEnd
```
{kotlin-runnable="true"}

コルーチンディスパッチャーとその用途について、[`Dispatchers.IO`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-i-o.html)や[`Dispatchers.Main`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)などの他のディスパッチャーを含め、さらに詳しく学ぶには、[コルーチンコンテキストとディスパッチャー](coroutine-context-and-dispatchers.md)をご覧ください。

## コルーチンとJVMスレッドの比較

コルーチンはJVM上のスレッドのようにコードを並行して実行する中断可能な計算ですが、内部的には異なる動作をします。

_スレッド_はオペレーティングシステムによって管理されます。スレッドは複数のCPUコアでタスクを並列に実行でき、JVMにおける並行処理の標準的なアプローチを表します。スレッドを作成すると、オペレーティングシステムはスタック用のメモリを割り当て、カーネルを使用してスレッド間で切り替えます。これにより、スレッドは強力ですが、リソースを大量に消費します。各スレッドは通常数メガバイトのメモリを必要とし、通常JVMは一度に数千のスレッドしか処理できません。

一方、コルーチンは特定のスレッドに縛られません。あるスレッドで中断し、別のスレッドで再開できるため、多くのコルーチンが同じスレッドプールを共有できます。コルーチンが中断すると、スレッドはブロックされず、他のタスクを実行するために解放されたままになります。これにより、コルーチンはスレッドよりもはるかに軽量であり、システムリソースを枯渇させることなく、1つのプロセスで何百万ものコルーチンを実行できます。

![コルーチンとスレッドの比較](coroutines-and-threads.svg){width="700"}

50,000個のコルーチンがそれぞれ5秒待機し、その後ピリオド（`.`）を出力する例を見てみましょう。

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        // それぞれが5秒待機し、その後ピリオドを出力する50,000個のコルーチンを起動
        printPeriods()
    }
}

//sampleStart
suspend fun printPeriods() = coroutineScope { // this: CoroutineScope
    // それぞれが5秒待機し、その後ピリオドを出力する50,000個のコルーチンを起動
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

次に、JVMスレッドを使用した同じ例を見てみましょう。

```kotlin
import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" validate="false"}

このバージョンを実行すると、各スレッドが独自のメモリスタックを必要とするため、はるかに多くのメモリを使用します。50,000個のスレッドの場合、これは最大100GBになる可能性がありますが、同じ数のコルーチンでは約500MBです。

オペレーティングシステム、JDKバージョン、および設定によっては、JVMスレッド版がメモリ不足エラーをスローしたり、一度に多数のスレッドが実行されないようにスレッドの作成を遅らせたりする可能性があります。

## 次のステップ

*   [中断関数の構成](composing-suspending-functions.md)で、中断関数の組み合わせについて詳しく学びましょう。
*   [キャンセルとタイムアウト](cancellation-and-timeouts.md)で、コルーチンをキャンセルし、タイムアウトを処理する方法を学びましょう。
*   [コルーチンコンテキストとディスパッチャー](coroutine-context-and-dispatchers.md)で、コルーチンの実行とスレッド管理についてさらに深く掘り下げましょう。
*   [非同期フロー](flow.md)で、複数の非同期に計算された値を返す方法を学びましょう。