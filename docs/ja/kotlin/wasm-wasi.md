[//]: # (title: Kotlin/WasmとWASIの利用を始める)

> Kotlin/Wasm は [アルファ版](components-stability.md) です。いつでも変更される可能性があります。
>
> [Kotlin/Wasm コミュニティに参加する。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

このチュートリアルでは、[WebAssembly System Interface (WASI)](https://wasi.dev/) を使用して、さまざまなWebAssembly仮想マシンでシンプルな [Kotlin/Wasm](wasm-overview.md) アプリケーションを実行する方法を説明します。

[Node.js](https://nodejs.org/en)、[Deno](https://deno.com/)、および [WasmEdge](https://wasmedge.org/) 仮想マシン上で動作するアプリケーションの例を見つけることができます。出力は、標準のWASI APIを使用するシンプルなアプリケーションです。

現在、Kotlin/WasmはWASI 0.1（Preview 1としても知られています）をサポートしています。
[WASI 0.2のサポートは将来のリリースで計画されています](https://youtrack.jetbrains.com/issue/KT-64568)。

> Kotlin/Wasm ツールチェインは、Node.js タスク (`wasmWasiNode*`) をすぐに利用できる形で提供します。
> Deno や WasmEdge を利用するような、プロジェクト内の他のタスクバリアントは、カスタムタスクとして含まれています。
>
{style="tip"}

## 開始する前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。

2.  IntelliJ IDEA で **File | New | Project from Version Control** を選択して、[Kotlin/Wasm WASI テンプレートリポジトリ](https://github.com/Kotlin/kotlin-wasm-wasi-template) をクローンします。

    コマンドラインからクローンすることもできます。

    ```bash
    git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
    ```

## アプリケーションを実行する

1.  **View** | **Tool Windows** | **Gradle** を選択して、**Gradle** ツールウィンドウを開きます。

    プロジェクトのロード後、**Gradle** ツールウィンドウの **kotlin-wasm-wasi-example** の下にGradleタスクが見つかります。

    > タスクを正常にロードするには、Gradle JVM として少なくともJava 11が必要です。
    >
    {style="note"}

2.  **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** から、以下のGradleタスクのいずれかを選択して実行します。

    *   **wasmWasiNodeRun**: Node.js でアプリケーションを実行します。
    *   **wasmWasiDenoRun**: Deno でアプリケーションを実行します。
    *   **wasmWasiWasmEdgeRun**: WasmEdge でアプリケーションを実行します。

      > WindowsプラットフォームでDenoを使用する場合、`deno.exe` がインストールされていることを確認してください。詳細については、[Denoのインストールに関するドキュメント](https://docs.deno.com/runtime/manual/getting_started/installation) を参照してください。
      >
      {style="tip"}

    ![Kotlin/Wasm and WASI tasks](wasm-wasi-gradle-task.png){width=600}

または、` kotlin-wasm-wasi-template` ルートディレクトリからターミナルで以下のコマンドのいずれかを実行します。

*   Node.js でアプリケーションを実行する場合:

    ```bash
    ./gradlew wasmWasiNodeRun
    ```

*   Deno でアプリケーションを実行する場合:

    ```bash
    ./gradlew wasmWasiDenoRun
    ```

*   WasmEdge でアプリケーションを実行する場合:

    ```bash
    ./gradlew wasmWasiWasmEdgeRun
    ```

アプリケーションが正常にビルドされると、ターミナルにメッセージが表示されます。

![Kotlin/Wasm and WASI app](wasm-wasi-app-terminal.png){width=600}

## アプリケーションをテストする

また、Kotlin/Wasm アプリケーションがさまざまな仮想マシンで正しく動作することを確認するためのテストも行えます。

Gradle ツールウィンドウで、**kotlin-wasm-wasi-example** | **Tasks** | **verification** から以下のGradleタスクのいずれかを実行します。

*   **wasmWasiNodeTest**: Node.js でアプリケーションをテストします。
*   **wasmWasiDenoTest**: Deno でアプリケーションをテストします。
*   **wasmWasiWasmEdgeTest**: WasmEdge でアプリケーションをテストします。

![Kotlin/Wasm and WASI test tasks](wasm-wasi-testing-task.png){width=600}

または、` kotlin-wasm-wasi-template` ルートディレクトリからターミナルで以下のコマンドのいずれかを実行します。

*   Node.js でアプリケーションをテストする場合:

    ```bash
    ./gradlew wasmWasiNodeTest
    ```

*   Deno でアプリケーションをテストする場合:

    ```bash
    ./gradlew wasmWasiDenoTest
    ```

*   WasmEdge でアプリケーションをテストする場合:

    ```bash
    ./gradlew wasmWasiWasmEdgeTest
    ```

ターミナルにテスト結果が表示されます。

![Kotlin/Wasm and WASI test](wasm-wasi-tests-results.png){width=600}

## 次のステップ

Kotlin Slack の Kotlin/Wasm コミュニティに参加しましょう。

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

その他の Kotlin/Wasm の例:

*   [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
*   [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
*   [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
*   [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)