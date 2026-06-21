<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA を使用した Kotlin Flow のデバッグ – チュートリアル)

このチュートリアルでは、Kotlin Flow を作成し、IntelliJ IDEA を使用してデバッグする方法を説明します。

このチュートリアルは、[コルーチン](coroutines-basics.md)および [Flow](coroutines-flow.md) の概念に関する事前の知識があることを前提としています。

## Kotlin Flow の作成

低速なエミッター（emitter）と低速なコレクター（collector）を持つ Kotlin [Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html) を作成します。

1. IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、[作成してください](jvm-get-started.md#create-a-project)。
2. Gradle プロジェクトで `kotlinx.coroutines` ライブラリを使用するには、`build.gradle(.kts)` に以下の依存関係を追加します。
   
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

4. 3 つの数値を流す（flow）を返す `simple()` 関数を作成します。

    * CPU を消費するブロッキングコードを模倣するために [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用します。これはスレッドをブロックすることなく、コルーチンを 100 ミリ秒中断（suspend）させます。
    * [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 関数を使用して、`for` ループ内で値を生成します。

    ```kotlin
    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.*
    import kotlin.system.*
 
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    ```

5. `main()` 関数のコードを変更します。

    * [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用してコルーチンをラップします。
    * [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 関数を使用して、放出された値を収集します。
    * CPU を消費するコードを模倣するために [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用します。これはスレッドをブロックすることなく、コルーチンを 300 ミリ秒中断させます。
    * [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して、Flow から収集した値を出力します。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. **Build Project** をクリックしてコードをビルドします。

    ![Build an application](flow-build-project.png)

## コルーチンのデバッグ

1. `emit()` 関数が呼び出されている行にブレークポイントを設定します。

    ![Build a console application](flow-breakpoint.png)

2. 画面上部の実行構成の横にある **Debug** をクリックして、デバッグモードでコードを実行します。

    ![Build a console application](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます：
    * **Frames** タブにはコールスタックが含まれます。
    * **Variables** タブには現在のコンテキスト内の変数が含まれます。ここでは、Flow が最初の値を放出（emit）していることがわかります。
    * **Coroutines** タブには、実行中または中断中のコルーチンに関する情報が含まれます。

    ![Debug the coroutine](flow-debug-1.png)

3. **Debug** ツールウィンドウの **Resume Program** をクリックしてデバッガーセッションを再開します。プログラムは同じブレークポイントで停止します。

    ![Debug the coroutine](flow-resume-debug.png)

    今度は Flow が 2 番目の値を放出します。

    ![Debug the coroutine](flow-debug-2.png)

### 最適化された変数 (Optimized-out variables)

`suspend` 関数を使用している場合、デバッガーで変数の名前の横に "was optimized out" というテキストが表示されることがあります。

![Variable "a" was optimized out](variable-optimised-out.png)

このテキストは、その変数の生存期間（lifetime）が短縮され、変数がもう存在しないことを意味します。
最適化された変数があるコードは、値が見えないためデバッグが困難です。
コンパイラオプション `-Xdebug` を使用することで、この挙動を無効にできます。

> __プロダクション環境では絶対にこのフラグを使用しないでください__: `-Xdebug` は [メモリリークを引き起こす可能性](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0) があります。
>
{style="warning"}

## 並行して実行されるコルーチンの追加

1. `src/main/kotlin` の `Main.kt` ファイルを開きます。

2. エミッターとコレクターを並行して実行するようにコードを強化します。

    * エミッターとコレクターを並行して実行するために [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 関数の呼び出しを追加します。`buffer()` は放出された値を保存し、別のコルーチンで Flow コレクターを実行します。 
 
    ```kotlin
    fun main() = runBlocking<Unit> {
        simple()
            .buffer()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

3. **Build Project** をクリックしてコードをビルドします。

## 2 つのコルーチンを使用した Kotlin Flow のデバッグ

1. `println(value)` の行に新しいブレークポイントを設定します。

2. 画面上部の実行構成の横にある **Debug** をクリックして、デバッグモードでコードを実行します。

    ![Build a console application](flow-debug-3.png)

    **Debug** ツールウィンドウが表示されます。

    **Coroutines** タブで、2 つのコルーチンが並行して実行されていることが確認できます。`buffer()` 関数により、Flow のコレクターとエミッターは別々のコルーチンで実行されます。
    `buffer()` 関数は、Flow から放出された値をバッファリングします。
    エミッターコルーチンは **RUNNING** 状態であり、コレクターコルーチンは **SUSPENDED** 状態です。

3. **Debug** ツールウィンドウの **Resume Program** をクリックしてデバッガーセッションを再開します。

    ![Debugging coroutines](flow-debug-4.png)

    今度は、コレクターコルーチンが **RUNNING** 状態になり、エミッターコルーチンが **SUSPENDED** 状態になります。

    それぞれのコルーチンをさらに深く掘り下げて、コードをデバッグすることができます。