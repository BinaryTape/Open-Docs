<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: IntelliJ IDEA を使用して Kotlin Flow をデバッグする – チュートリアル)

このチュートリアルでは、IntelliJ IDEA を使用して Kotlin Flow を作成しデバッグする方法を説明します。

このチュートリアルは、[コルーチン](coroutines-guide.md)と[Kotlin Flow](flow.md#flows)の概念に関する事前知識があることを前提としています。

## Kotlin Flow を作成する

低速なエミッターと低速なコレクターを持つ Kotlin [Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html) を作成します。

1. IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、[作成](jvm-get-started.md#create-a-project)してください。
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
   
   他のビルドシステムについては、[`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) の指示を参照してください。

3. `src/main/kotlin` にある `Main.kt` ファイルを開きます。

    `src` ディレクトリには Kotlin のソースファイルとリソースが含まれています。`Main.kt` ファイルには、`Hello World!` を出力するサンプルコードが含まれています。

4. 3つの数値の Flow を返す `simple()` 関数を作成します。

    * CPU を消費するブロッキングコードを模倣するために、[`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用します。この関数は、スレッドをブロックすることなくコルーチンを 100 ミリ秒間サスペンドします。
    * `for` ループ内で[`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 関数を使用して値を生成します。

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

5. `main()` 関数内のコードを変更します。

    * コルーチンをラップするために、[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) ブロックを使用します。
    * [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 関数を使用して発行された値を収集します。
    * CPU を消費するコードを模倣するために、[`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 関数を使用します。この関数は、スレッドをブロックすることなくコルーチンを 300 ミリ秒間サスペンドします。
    * [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 関数を使用して、Flow から収集された値を出力します。

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

## コルーチンをデバッグする

1. `emit()` 関数が呼び出されている行にブレークポイントを設定します。

    ![Build a console application](flow-breakpoint.png)

2. 画面上部の実行構成の隣にある **Debug** をクリックして、コードをデバッグモードで実行します。

    ![Build a console application](flow-debug-project.png)

    **Debug** ツールウィンドウが表示されます。
    * **Frames** タブにはコールスタックが含まれています。
    * **Variables** タブには現在のコンテキストの変数が含まれています。Flow が最初の値を発行していることがわかります。
    * **Coroutines** タブには、実行中またはサスペンドされたコルーチンに関する情報が含まれています。

    ![Debug the coroutine](flow-debug-1.png)

3. **Debug** ツールウィンドウで **Resume Program** をクリックしてデバッガーセッションを再開します。プログラムは同じブレークポイントで停止します。

    ![Debug the coroutine](flow-resume-debug.png)

    これで Flow は2番目の値を発行します。

    ![Debug the coroutine](flow-debug-2.png)

### 最適化により除外された変数

`suspend` 関数を使用している場合、デバッガーで変数の名前の隣に「`was optimized out`」というテキストが表示されることがあります。

![Variable "a" was optimized out](variable-optimised-out.png)

このテキストは、変数のライフタイムが短縮され、その変数がもはや存在しないことを意味します。
値が見えないため、最適化された変数を含むコードをデバッグするのは困難です。
`-Xdebug` コンパイラオプションを使用すると、この動作を無効にできます。

> __本番環境ではこのフラグを絶対に使用しないでください__ : `-Xdebug` は[メモリリーク](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)を引き起こす可能性があります。
>
{style="warning"}

## 並行して実行されるコルーチンを追加する

1. `src/main/kotlin` にある `Main.kt` ファイルを開きます。

2. エミッターとコレクターを並行して実行するようにコードを強化します。

    * エミッターとコレクターを並行して実行するために、[`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 関数への呼び出しを追加します。`buffer()` は発行された値を格納し、Flow コレクターを別のコルーチンで実行します。 
 
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

## 2つのコルーチンで Kotlin Flow をデバッグする

1. `println(value)` に新しいブレークポイントを設定します。

2. 画面上部の実行構成の隣にある **Debug** をクリックして、コードをデバッグモードで実行します。

    ![Build a console application](flow-debug-3.png)

    **Debug** ツールウィンドウが表示されます。

    **Coroutines** タブでは、2つのコルーチンが並行して実行されていることがわかります。`buffer()` 関数により、Flow コレクターとエミッターは別のコルーチンで実行されます。
    `buffer()` 関数は Flow から発行された値をバッファリングします。
    エミッターコルーチンは **RUNNING** ステータスになっており、コレクターコルーチンは **SUSPENDED** ステータスになっています。

3. **Debug** ツールウィンドウで **Resume Program** をクリックして、デバッガーセッションを再開します。

    ![Debugging coroutines](flow-debug-4.png)

    これでコレクターコルーチンは **RUNNING** ステータスになり、一方エミッターコルーチンは **SUSPENDED** ステータスになっています。

    各コルーチンをさらに詳しく調べて、コードをデバッグできます。