<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA を使用したコルーチンのデバッグ – チュートリアル)

このチュートリアルでは、Kotlin コルーチンを作成し、IntelliJ IDEA を使用してデバッグする方法を説明します。

このチュートリアルは、[コルーチン](coroutines-guide.md)の概念に関する予備知識があることを前提としています。

## コルーチンの作成

1. IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、[作成してください](jvm-get-started.md#create-a-project)。
2. Gradle プロジェクトで `kotlinx.coroutines` ライブラリを使用するには、以下の依存関係を `build.gradle(.kts)` に追加します。

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

   その他のビルドシステムについては、[`kotlinx.coroutines` の README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) の指示を参照してください。
   
3. `src/main/kotlin` にある `Main.kt` ファイルを開きます。

    `src` ディレクトリには Kotlin のソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello World!` を出力するサンプルコードが含まれています。

4. `main()` 関数のコードを変更します：

    * [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用して、コルーチンをラップします。
    * [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 関数を使用して、遅延値（Deferred values）`a` と `b` を計算するコルーチンを作成します。
    * [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 関数を使用して、計算結果を待機します。
    * [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して、計算ステータスと乗算の結果を出力に表示します。

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

1. `println()` 関数が呼び出されている行にブレークポイントを設定します：

    ![コンソールアプリケーションをビルドする](coroutine-breakpoint.png)

2. 画面上部の実行構成の横にある **Debug** をクリックして、デバッグモードでコードを実行します。

    ![コンソールアプリケーションをビルドする](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます：
    * **Frames** タブにはコールスタックが含まれています。
    * **Variables** タブには現在のコンテキスト内の変数が含まれています。
    * **Coroutines** タブには実行中または中断（suspended）されたコルーチンに関する情報が含まれています。ここでは3つのコルーチンがあることがわかります。
    最初の1つは **RUNNING** ステータスで、他の2つは **CREATED** ステータスになっています。

    ![コルーチンをデバッグする](coroutine-debug-1.png)

3. **Debug** ツールウィンドウの **Resume Program** をクリックして、デバッガーセッションを再開します：

    ![コルーチンをデバッグする](coroutine-debug-2.png)
    
    これで、**Coroutines** タブには以下が表示されます：
    * 最初のコルーチンは **SUSPENDED** ステータスです。これは、乗算を行うために値を待機している状態です。
    * 2番目のコルーチンは `a` の値を計算しており、**RUNNING** ステータスです。
    * 3番目のコルーチンは **CREATED** ステータスであり、まだ `b` の値を計算していません。

4. **Debug** ツールウィンドウの **Resume Program** をクリックして、デバッガーセッションを再開します：

    ![コンソールアプリケーションをビルドする](coroutine-debug-3.png)

    これで、**Coroutines** タブには以下が表示されます：
    * 最初のコルーチンは **SUSPENDED** ステータスです。値を待機して乗算を行おうとしています。
    * 2番目のコルーチンは値を計算し終えて消滅しました。
    * 3番目のコルーチンは `b` の値を計算しており、**RUNNING** ステータスです。

IntelliJ IDEA デバッガーを使用すると、各コルーチンをさらに深く掘り下げてコードをデバッグできます。

### 最適化により除外された変数 (Optimized-out variables)

`suspend` 関数を使用している場合、デバッガーで変数名の横に "was optimized out" というテキストが表示されることがあります。

![変数 "a" が最適化により除外された](variable-optimised-out.png){width=480}

このテキストは、変数の生存期間が短縮され、その変数がもう存在しないことを意味します。
変数が最適化されていると、その値を確認できないため、コードのデバッグが困難になります。
この挙動は、コンパイラオプションの `-Xdebug` を使用して無効にすることができます。

> **このフラグを本番環境（production）では決して使用しないでください**：`-Xdebug` は[メモリリークを引き起こす可能性](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)があります。
>
{style="warning"}