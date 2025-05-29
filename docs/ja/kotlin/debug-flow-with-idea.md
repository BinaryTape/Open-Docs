<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA を使用した Kotlin Flow のデバッグ - チュートリアル)

このチュートリアルでは、Kotlin Flow の作成方法と、IntelliJ IDEA を使用してそれをデバッグする方法を説明します。

このチュートリアルでは、[コルーチン](coroutines-guide.md) と [Kotlin Flow](flow.md#flows) の概念について事前に知識があることを前提としています。

## Kotlin Flow を作成する

エミッターとコレクターが低速な Kotlin [flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html) を作成します。

1.  IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、[作成してください](jvm-get-started.md#create-a-project)。
2.  Gradle プロジェクトで `kotlinx.coroutines` ライブラリを使用するには、以下の依存関係を `build.gradle(.kts)` に追加します。

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

    他のビルドシステムについては、[`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) の手順を参照してください。

3.  `src/main/kotlin` にある `Main.kt` ファイルを開きます。

    `src` ディレクトリには Kotlin のソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello World!` を出力するサンプルコードが含まれています。

4.  3つの数値のフローを返す `simple()` 関数を作成します。

    *   [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用して、CPU を消費するブロッキングコードを模倣します。これにより、スレッドをブロックすることなくコルーチンを 100 ミリ秒間中断させます。
    *   [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 関数を使用して、`for` ループで値を出力します。

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

5.  `main()` 関数内のコードを変更します。

    *   コルーチンをラップするために [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用します。
    *   [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 関数を使用して、出力された値を収集します。
    *   [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用して、CPU を消費するコードを模倣します。これにより、スレッドをブロックすることなくコルーチンを 300 ミリ秒間中断させます。
    *   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して、フローから収集された値を出力します。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6.  **Build Project** をクリックしてコードをビルドします。

    ![Build an application](flow-build-project.png)

## コルーチンをデバッグする

1.  `emit()` 関数が呼び出される行にブレークポイントを設定します。

    ![Build a console application](flow-breakpoint.png)

2.  画面上部の実行構成の横にある **Debug** をクリックして、コードをデバッグモードで実行します。

    ![Build a console application](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます。
    *   **Frames** タブにはコールスタックが含まれています。
    *   **Variables** タブには現在のコンテキストの変数が含まれています。これにより、フローが最初の値を出力していることがわかります。
    *   **Coroutines** タブには、実行中または中断中のコルーチンに関する情報が含まれています。

    ![Debug the coroutine](flow-debug-1.png)

3.  **Debug** ツールウィンドウの **Resume Program** をクリックしてデバッガーセッションを再開します。プログラムは同じブレークポイントで停止します。

    ![Debug the coroutine](flow-resume-debug.png)

    これで、フローが2番目の値を出力します。

    ![Debug the coroutine](flow-debug-2.png)

### 最適化によって削除された変数

`suspend` 関数を使用すると、デバッガーで変数の名前の横に「was optimized out」というテキストが表示されることがあります。

![Variable "a" was optimized out](variable-optimised-out.png)

このテキストは、変数のライフタイムが短縮され、その変数がもはや存在しないことを意味します。
最適化された変数の値が表示されないため、それらを含むコードをデバッグすることは困難です。
`-Xdebug` コンパイラオプションを使用すると、この動作を無効にできます。

> **このフラグを本番環境で使用しないでください**: `-Xdebug` は、[メモリリークを引き起こす可能性があります](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

## 並行して実行するコルーチンを追加する

1.  `src/main/kotlin` にある `Main.kt` ファイルを開きます。

2.  エミッターとコレクターを並行して実行するようにコードを強化します。

    *   [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 関数を呼び出すことで、エミッターとコレクターを並行して実行します。`buffer()` は出力された値を保存し、フローコレクターを別のコルーチンで実行します。

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

3.  **Build Project** をクリックしてコードをビルドします。

## 2つのコルーチンを持つ Kotlin Flow をデバッグする

1.  `println(value)` に新しいブレークポイントを設定します。

2.  画面上部の実行構成の横にある **Debug** をクリックして、コードをデバッグモードで実行します。

    ![Build a console application](flow-debug-3.png)

    **Debug** ツールウィンドウが表示されます。

    **Coroutines** タブでは、2つのコルーチンが並行して実行されていることがわかります。`buffer()` 関数により、フローコレクターとエミッターは別々のコルーチンで実行されます。
    `buffer()` 関数は、フローから出力された値をバッファリングします。
    エミッターコルーチンは **RUNNING** ステータスであり、コレクターコルーチンは **SUSPENDED** ステータスです。

3.  **Debug** ツールウィンドウの **Resume Program** をクリックしてデバッガーセッションを再開します。

    ![Debugging coroutines](flow-debug-4.png)

    これで、コレクターコルーチンは **RUNNING** ステータスになり、エミッターコルーチンは **SUSPENDED** ステータスになります。

    各コルーチンをさらに掘り下げて、コードをデバッグすることができます。