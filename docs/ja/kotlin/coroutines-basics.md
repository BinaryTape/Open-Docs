<!--- TEST_NAME BasicsGuideTest -->
<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンの基礎)

このセクションでは、コルーチンの基本的な概念について説明します。

## 初めてのコルーチン

_コルーチン_は、中断可能な計算のインスタンスです。概念的にはスレッドと似ており、コードのブロックを受け取って、残りのコードと並行して実行します。しかし、コルーチンは特定のスレッドに拘束されません。あるスレッドで実行を中断し、別のスレッドで再開することができます。

コルーチンは軽量スレッドと考えることができますが、実際の使用においてはスレッドとは大きく異なる重要な点がいくつかあります。

以下のコードを実行して、初めて動作するコルーチンを試してみましょう。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // launch a new coroutine and continue
        delay(1000L) // non-blocking delay for 1 second (default time unit is ms)
        println("World!") // print after delay
    }
    println("Hello") // main coroutine continues while a previous one is delayed
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-01.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt)で入手できます。
>
{style="note"}

以下のような結果が表示されます。

```text
Hello
World!
```

<!--- TEST -->

このコードが何をしているのかを分析してみましょう。

[`launch`]は_コルーチンビルダー_です。これは新しいコルーチンを他のコードと並行して起動し、そのコードは独立して動作し続けます。そのため、「Hello」が最初に表示されたのです。

[`delay`]は特別な_サスペンド関数_です。これはコルーチンを指定された時間_サスペンド_させます。コルーチンをサスペンドしても基盤となるスレッドを_ブロック_することはありませんが、他のコルーチンが実行され、その基盤スレッドを自身のコードのために使用することを可能にします。

[`runBlocking`]もコルーチンビルダーであり、通常の`fun main()`のような非コルーチン環境と、`runBlocking { ... }`の波括弧内のコルーチンを含むコードとの橋渡しをします。これはIDEで`runBlocking`の開始波括弧の直後にある`this: CoroutineScope`のヒントによって強調表示されます。

このコードで`runBlocking`を削除したり忘れたりすると、[`launch`]呼び出しでエラーが発生します。これは`launch`が[`CoroutineScope`]でのみ宣言されているためです。

```
Unresolved reference: launch
```

`runBlocking`という名前は、それを実行するスレッド（この場合はメインスレッド）が、`runBlocking { ... }`内のすべてのコルーチンが実行を完了するまで、呼び出しの間_ブロック_されることを意味します。`runBlocking`は、アプリケーションの最上位レベルでこのように使用されることがよくありますが、実際の実コード内で使用されることはほとんどありません。なぜなら、スレッドは高価なリソースであり、それをブロックすることは非効率的で、多くの場合望ましくないからです。

### 構造化された並行処理

コルーチンは**構造化された並行処理**の原則に従います。これは、新しいコルーチンが特定の[`CoroutineScope`]内でのみ起動でき、そのスコープがコルーチンのライフタイムを区切ることを意味します。上記の例は、[`runBlocking`]が対応するスコープを確立し、そのため前の例では1秒の遅延の後に「World!」が印刷されるまで待機し、その後で終了することを示しています。

実際のアプリケーションでは、多数のコルーチンを起動することになります。構造化された並行処理は、コルーチンが失われたりリークしたりしないことを保証します。外部のスコープは、そのすべての子コルーチンが完了するまで完了できません。構造化された並行処理は、コード内のエラーが適切に報告され、決して失われないことも保証します。

## 関数抽出のリファクタリング

`launch { ... }`内のコードブロックを別の関数に抽出してみましょう。このコードで「関数抽出」のリファクタリングを実行すると、`suspend`修飾子を持つ新しい関数が作成されます。これがあなたの最初の_サスペンド関数_です。サスペンド関数は通常の関数と同様にコルーチン内で使用できますが、その追加機能として、他のサスペンド関数（この例の`delay`など）を使用してコルーチンの実行を_サスペンド_できる点があります。

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { doWorld() }
    println("Hello")
}

// this is your first suspending function
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-02.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt)で入手できます。
>
{style="note"}

<!--- TEST
Hello
World!
-->

## スコープビルダー

さまざまなビルダーによって提供されるコルーチンスコープに加えて、[`coroutineScope`][`_coroutineScope`]ビルダーを使用して独自のスコープを宣言することが可能です。これはコルーチンスコープを作成し、起動されたすべての子が完了するまで完了しません。

[`runBlocking`]と[`coroutineScope`][`_coroutineScope`]ビルダーは、どちらもその本体とすべての子の完了を待つため、似ているように見えるかもしれません。主な違いは、[`runBlocking`]メソッドが待機のために現在のスレッドを_ブロック_するのに対し、[`coroutineScope`][`_coroutineScope`]は単にサスペンドするだけで、基盤となるスレッドを他の用途のために解放する点です。この違いから、[`runBlocking`]は通常の関数であり、[`coroutineScope`][`_coroutineScope`]はサスペンド関数です。

任意のサスペンド関数から`coroutineScope`を使用できます。例えば、`Hello`と`World`の並行表示を`suspend fun doWorld()`関数に移動することができます。

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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt)で入手できます。
>
{style="note"}

このコードも以下のように出力します。

```text
Hello
World!
```

<!--- TEST -->

## スコープビルダーと並行処理

[`coroutineScope`][`_coroutineScope`]ビルダーは、任意のサスペンド関数内で複数の並行操作を実行するために使用できます。`doWorld`サスペンド関数内で2つの並行コルーチンを起動してみましょう。

```kotlin
import kotlinx.coroutines.*

//sampleStart
// Sequentially executes doWorld followed by "Done"
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// Concurrently executes both sections
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
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt)で入手できます。
>
{style="note"}

`launch { ... }`ブロック内の両方のコードは_並行して_実行され、開始から1秒後に「World 1」が最初に表示され、次に開始から2秒後に「World 2」が表示されます。`doWorld`内の[`coroutineScope`][`_coroutineScope`]は、両方が完了した後にのみ完了するため、`doWorld`はその後で初めて戻り、「Done」文字列が表示されることを許可します。

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 明示的なジョブ (Job)

[`launch`]コルーチンビルダーは、起動されたコルーチンへのハンドルである[`Job`]オブジェクトを返します。これは、その完了を明示的に待つために使用できます。例えば、子コルーチンの完了を待ってから、「Done」文字列を印刷することができます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // launch a new coroutine and keep a reference to its Job
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // wait until child coroutine completes
    println("Done") 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-05.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt)で入手できます。
>
{style="note"}

このコードは以下を出力します。

```text
Hello
World!
Done
```

<!--- TEST -->

## コルーチンは軽量である

コルーチンはJVMスレッドよりもリソース消費が少ないです。スレッドを使用するとJVMの利用可能なメモリを使い果たすようなコードでも、コルーチンを使用すればリソース制限に達することなく表現できます。例えば、以下のコードは50,000個の異なるコルーチンを起動し、それぞれが5秒間待機してからピリオド（'.'）を印刷しますが、消費するメモリは非常に少ないです。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(50_000) { // launch a lot of coroutines
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-basic-06.kt -->
> 完全なコードは[こちら](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt)で入手できます。
>
{style="note"}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(50_000) -->

同じプログラムをスレッドを使用して記述した場合（`runBlocking`を削除し、`launch`を`thread`に、`delay`を`Thread.sleep`に置き換える）、大量のメモリを消費します。オペレーティングシステム、JDKのバージョン、およびその設定によっては、メモリ不足エラーがスローされるか、または同時に実行されるスレッドが多すぎないようにスレッドがゆっくりと起動します。

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->