<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA でコルーチンをデバッグする – チュートリアル)

このチュートリアルでは、Kotlinコルーチンの作成方法と、IntelliJ IDEA を使用したデバッグ方法を説明します。

このチュートリアルは、[コルーチン](coroutines-guide.md)の概念について事前に知識があることを前提としています。

## コルーチンの作成

1. IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、[作成してください](jvm-get-started.md#create-a-project)。
2. Gradle プロジェクトで `kotlinx.coroutines` ライブラリを使用するには、`build.gradle(.kts)` に次の依存関係を追加します。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ``` 

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```
   
   </tab>
   </tabs>

   その他のビルドシステムについては、[`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) の手順を参照してください。
   
3. `src/main/kotlin` 内の `Main.kt` ファイルを開きます。

    `src` ディレクトリには Kotlin ソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello World!` を出力するサンプルコードが含まれています。

4. `main()` 関数のコードを変更します。

    * コルーチンをラップするために、[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用します。
    * 遅延値 `a` と `b` を計算するコルーチンを作成するために、[`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 関数を使用します。
    * 計算結果を待機するために、[`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 関数を使用します。
    * 計算ステータスと乗算結果を出力に表示するために、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用します。

    ```kotlin
    import kotlinx.coroutines.*
    
    fun main() = runBlocking<Unit> {
        val a = async {
            println("I'm computing part of the answer")
            6
        }
        val b = async {
            println("I'm computing another part of the answer")
            7
        }
        println("The answer is ${a.await() * b.await()}")
    }
    ```

5. **Build Project** をクリックしてコードをビルドします。

    ![アプリケーションをビルドする](flow-build-project.png)

## コルーチンのデバッグ

1. `println()` 関数呼び出しのある行にブレークポイントを設定します。

    ![コンソールアプリケーションをビルドする](coroutine-breakpoint.png)

2. 画面上部の実行構成の横にある **Debug** をクリックして、デバッグモードでコードを実行します。

    ![コンソールアプリケーションをビルドする](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます。
    * **Frames** タブには、コールスタックが含まれています。
    * **Variables** タブには、現在のコンテキストの変数が含まれています。
    * **Coroutines** タブには、実行中または中断中のコルーチンに関する情報が含まれています。ここには3つのコルーチンが表示されています。
    最初のコルーチンは **RUNNING** ステータスで、他の2つは **CREATED** ステータスです。

    ![コルーチンをデバッグする](coroutine-debug-1.png)

3. **Debug** ツールウィンドウで **Resume Program** をクリックしてデバッガーセッションを再開します。

    ![コルーチンをデバッグする](coroutine-debug-2.png)
    
    現在、**Coroutines** タブには次のように表示されます。
    * 最初のコルーチンは **SUSPENDED** ステータスです – 値を乗算するために待機しています。
    * 2番目のコルーチンは `a` の値を計算しており、**RUNNING** ステータスです。
    * 3番目のコルーチンは **CREATED** ステータスで、`b` の値は計算していません。

4. **Debug** ツールウィンドウで **Resume Program** をクリックしてデバッガーセッションを再開します。

    ![コンソールアプリケーションをビルドする](coroutine-debug-3.png)

    現在、**Coroutines** タブには次のように表示されます。
    * 最初のコルーチンは **SUSPENDED** ステータスです – 値を乗算するために待機しています。
    * 2番目のコルーチンは値を計算し終え、表示されなくなりました。
    * 3番目のコルーチンは `b` の値を計算しており、**RUNNING** ステータスです。

IntelliJ IDEA デバッガーを使用すると、各コルーチンを深く掘り下げてコードをデバッグできます。

### 最適化によって除外された変数

`suspend` 関数を使用している場合、デバッガーで変数の名前の横に「was optimized out」というテキストが表示されることがあります。

![変数 "a" は最適化により除外されました](variable-optimised-out.png){width=480}

このテキストは、変数の寿命が短縮され、変数がもはや存在しないことを意味します。
最適化された変数を含むコードは、その値が見えないためデバッグが困難です。
この動作は、`-Xdebug` コンパイラオプションで無効にできます。

> **本番環境でこのフラグを絶対に使用しないでください**: `-Xdebug` は[メモリリークを引き起こす可能性があります](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}