<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA を使ってコルーチンをデバッグする – チュートリアル)

このチュートリアルでは、Kotlin コルーチンの作成方法と、IntelliJ IDEA を使ってデバッグする方法を説明します。

このチュートリアルは、「コルーチン」の概念について既にご存知であることを前提としています。

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
   
3. `src/main/kotlin` にある `Main.kt` ファイルを開きます。

    `src` ディレクトリには Kotlin ソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello World!` を出力するサンプルコードが含まれています。

4. `main()` 関数内のコードを変更します。

    * コルーチンをラップするには、[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用します。
    * 遅延値 `a` と `b` を計算するコルーチンを作成するには、[`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 関数を使用します。
    * 計算結果を待機するには、[`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 関数を使用します。
    * 計算のステータスと乗算の結果を出力に表示するには、[`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用します。

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

1. `println()` 関数の呼び出しがある行にブレークポイントを設定します。

    ![コンソールアプリケーションをビルドする](coroutine-breakpoint.png)

2. 画面上部の実行構成の横にある **Debug** をクリックして、コードをデバッグモードで実行します。

    ![コンソールアプリケーションをビルドする](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます。
    * **Frames** タブにはコールスタックが含まれています。
    * **Variables** タブには現在のコンテキストの変数が含まれています。
    * **Coroutines** タブには、実行中または中断されたコルーチンに関する情報が含まれています。ここには3つのコルーチンがあることが示されています。
    最初のコルーチンは **RUNNING** ステータスであり、他の2つは **CREATED** ステータスです。

    ![コルーチンをデバッグする](coroutine-debug-1.png)

3. **Debug** ツールウィンドウで **Resume Program** をクリックして、デバッガーセッションを再開します。

    ![コルーチンをデバッグする](coroutine-debug-2.png)
    
    現在、**Coroutines** タブには以下が表示されています。
    * 最初のコルーチンは **SUSPENDED** ステータスであり、乗算できるように値を待機しています。
    * 2番目のコルーチンは `a` の値を計算しており、**RUNNING** ステータスです。
    * 3番目のコルーチンは **CREATED** ステータスであり、`b` の値はまだ計算していません。

4. **Debug** ツールウィンドウで **Resume Program** をクリックして、デバッガーセッションを再開します。

    ![コンソールアプリケーションをビルドする](coroutine-debug-3.png)

    現在、**Coroutines** タブには以下が表示されています。
    * 最初のコルーチンは **SUSPENDED** ステータスであり、乗算できるように値を待機しています。
    * 2番目のコルーチンは値を計算し終え、消えました。
    * 3番目のコルーチンは `b` の値を計算しており、**RUNNING** ステータスです。

IntelliJ IDEA のデバッガーを使用すると、各コルーチンをより深く掘り下げてコードをデバッグできます。

### 最適化によって除去された変数

`suspend` 関数を使用すると、デバッガーで、変数の名前の横に「was optimized out」というテキストが表示される場合があります。

![変数「a」が最適化によって除去されました](variable-optimised-out.png){width=480}

このテキストは、変数のライフタイムが短縮され、その変数はもう存在しないことを意味します。
最適化された変数を含むコードをデバッグすることは、その値が表示されないため困難です。
この動作は、`-Xdebug` コンパイラオプションを使用して無効にできます。

> __このフラグを本番環境で使用しないでください__:`-Xdebug` は[メモリリークを引き起こす](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)可能性があります。
>
{style="warning"}