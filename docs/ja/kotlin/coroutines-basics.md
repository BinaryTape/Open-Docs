<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンの基礎)

このセクションでは、コルーチンの基本的な概念について説明します。

## 初めてのコルーチン

「コルーチン」は、中断可能な計算のインスタンスです。概念的にはスレッドと似ており、残りのコードと並行して動作するコードブロックを受け取ります。しかし、コルーチンは特定のどのスレッドにも束縛されません。あるスレッドで実行を中断し、別のスレッドで再開することができます。

コルーチンは軽量スレッドと考えることができますが、実際の使用方法をスレッドとは大きく異なるものにするいくつかの重要な違いがあります。

以下のコードを実行して、最初の動作するコルーチンを体験してみましょう。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // 新しいコルーチンを起動し、続行します
        delay(1000L) // 1秒間（デフォルトの単位はミリ秒）非ブロッキングで待機します
        println("World!") // 待機後に表示
    }
    println("Hello") // メインコルーチンは前のコルーチンが遅延している間も続行します
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)から取得できます。
>
{style="note"}

以下の結果が表示されます。

```text
Hello
World!
```

<!--- TEST -->

このコードが何をするのかを詳しく見ていきましょう。

`launch`は「コルーチンビルダー」です。これは残りのコードと並行して新しいコルーチンを起動し、残りのコードは独立して動作を続けます。そのため、最初に`Hello`が表示されました。

`delay`は特別な「中断関数」（_suspending function_）です。これはコルーチンを特定の時間「中断」します。コルーチンを中断しても、基盤となるスレッドは「ブロック」されず、他のコルーチンが実行され、基盤となるスレッドをそのコードに利用できるようになります。

`runBlocking`もコルーチンビルダーであり、通常の`fun main()`の非コルーチン世界と、`runBlocking { ... }`の波括弧内のコルーチンを持つコードを繋ぐものです。これは、IDEで`runBlocking`の開始波括弧の直後に表示される`this: CoroutineScope`というヒントによって強調表示されます。

このコードで`runBlocking`を削除または忘れると、`launch`は`CoroutineScope`でのみ宣言されているため、`launch`の呼び出しでエラーが発生します。

```
Unresolved reference: launch
```

`runBlocking`の名前は、これを実行するスレッド（この場合はメインスレッド）が、`runBlocking { ... }`内のすべてのコルーチンが実行を完了するまで、呼び出しの間「ブロック」されることを意味します。スレッドは高価なリソースであり、それらをブロックすることは非効率的で、多くの場合望ましくないため、`runBlocking`がアプリケーションの最上位レベルでこのように使用されることはよくありますが、実際のコード内で使用されることはほとんどありません。

### 構造化された並行処理

コルーチンは、「構造化された並行処理」（**structured concurrency**）の原則に従います。これは、新しいコルーチンは、そのコルーチンのライフタイムを区切る特定の`CoroutineScope`内でしか起動できないことを意味します。上記の例では、`runBlocking`が対応するスコープを確立し、そのため前の例では1秒遅延した後に`World!`が表示されるまで待機し、その後終了することが示されています。

実際のアプリケーションでは、多くのコルーチンを起動することになります。構造化された並行処理は、コルーチンが失われたり、リークしたりしないことを保証します。外側のスコープは、すべての子コルーチンが完了するまで完了できません。また、構造化された並行処理は、コード内のエラーが適切に報告され、決して失われないことを保証します。

## 関数抽出によるリファクタリング

`launch { ... }`内のコードブロックを別の関数に抽出してみましょう。このコードに対して「関数抽出」のリファクタリングを実行すると、`suspend`修飾子を持つ新しい関数が得られます。これが最初の「中断関数」（_suspending function_）です。中断関数は、通常の関数と同様にコルーチン内で使用できますが、その追加機能として、他の suspending function（この例の`delay`など）を使用してコルーチンの実行を「中断」できる点があります。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { doWorld() }
    println("Hello")
}

// これは最初の中断関数です
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)から取得できます。
>
{style="note"}

<!--- TEST
Hello
World!
-->

## スコープビルダー

様々なビルダーによって提供されるコルーチンスコープに加えて、`coroutineScope`ビルダーを使用して独自のスコープを宣言することが可能です。これはコルーチンスコープを作成し、起動されたすべての子が完了するまで終了しません。

`runBlocking`と`coroutineScope`ビルダーは、どちらも自身の本体とすべての子が完了するのを待つため、似ているように見えるかもしれません。主な違いは、`runBlocking`メソッドが待機のために現在のスレッドを「ブロック」するのに対し、`coroutineScope`は単に中断し、基盤となるスレッドを他の用途に解放する点です。この違いにより、`runBlocking`は通常の関数であり、`coroutineScope`は中断関数です。

`coroutineScope`は任意の suspending function から使用できます。例えば、`Hello`と`World`の同時表示を`suspend fun doWorld()`関数に移動させることができます。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking {
    doWorld()
}

suspend fun doWorld() = coroutineScope {  // this: CoroutineScope
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-03.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)から取得できます。
>
{style="note"}

このコードも以下のように表示されます。

```text
Hello
World!
```

<!--- TEST -->

## スコープビルダーと並行処理

`coroutineScope`ビルダーは、複数の並行操作を実行するために、任意の suspending function 内で使用できます。`doWorld` suspending function の内部で、2つの並行コルーチンを起動してみましょう。

```kotlin
import kotlinx.coroutines.*

//sampleStart
// doWorldの後に"Done"を順次実行
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// 両方のセクションを並行して実行
suspend fun doWorld() = coroutineScope { // this: CoroutineScope
    launch {
        delay(2000L)
        println("World 2")
    }
    launch {
        delay(1000L)
        println("World 1")
    }
    println("Hello")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-04.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)から取得できます。
>
{style="note"}

`launch { ... }`ブロック内の両方のコードは「並行して」実行され、開始から1秒後に`World 1`が最初に表示され、次に開始から2秒後に`World 2`が表示されます。`doWorld`内の`coroutineScope`は両方が完了した後にのみ完了するため、`doWorld`はその後で初めて戻り、`Done`文字列の表示を許可します。

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 明示的なジョブ

`launch`コルーチンビルダーは`Job`オブジェクトを返します。これは起動されたコルーチンへのハンドルであり、その完了を明示的に待機するために使用できます。例えば、子コルーチンの完了を待ってから、「Done」という文字列を表示できます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // 新しいコルーチンを起動し、そのJobへの参照を保持
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // 子コルーチンが完了するまで待機
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)から取得できます。
>
{style="note"}

このコードは以下を生成します。

```text
Hello
World!
Done
```

<!--- TEST -->

## コルーチンは軽量

コルーチンはJVMスレッドよりもリソースを消費しません。スレッドを使用するとJVMの利用可能なメモリを使い果たしてしまうコードも、コルーチンを使用すればリソース制限に達することなく表現できます。例えば、以下のコードは50,000個の異なるコルーチンを起動し、それぞれが5秒待機してからピリオド（'.'）を表示しますが、消費するメモリはごくわずかです。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(50_000) { // 多数のコルーチンを起動
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)から取得できます。
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

もし同じプログラムをスレッドを使って書いた場合（`runBlocking`を削除し、`launch`を`thread`に、`delay`を`Thread.sleep`に置き換える）、それは大量のメモリを消費するでしょう。オペレーティングシステム、JDKのバージョン、およびその設定によっては、メモリ不足エラー（out-of-memory error）をスローするか、多数の並行実行スレッドが同時に存在しないようにスレッドの起動が遅くなるでしょう。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->