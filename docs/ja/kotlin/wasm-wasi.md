[//]: # (title: Kotlin/Wasm と WASI を使ってみる)

<primary-label ref="beta"/> 

このチュートリアルでは、さまざまな WebAssembly 仮想マシンで[WebAssembly System Interface (WASI)](https://wasi.dev/) を使用して、シンプルな[Kotlin/Wasm](wasm-overview.md) アプリケーションを実行する方法を説明します。

[Node.js](https://nodejs.org/en)、[Deno](https://deno.com/)、および[WasmEdge](https://wasmedge.org/) 仮想マシンで実行されるアプリケーションの例を見つけることができます。出力は、標準の WASI API を使用するシンプルなアプリケーションです。

現在、Kotlin/Wasm は Preview 1 としても知られている WASI 0.1 をサポートしています。WASI 0.2 のサポートは、今後のリリースで計画されています。
[WASI 0.2 のサポートに関する最新情報については、この YouTrack Issue をフォローしてください](https://youtrack.jetbrains.com/issue/KT-64568)。

[`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi) ターゲットは、[デフォルトで新しい例外処理プロポーザルを使用](wasm-configuration.md#exception-handling-proposal)しており、最新の WebAssembly ランタイムとの互換性を向上させています。

> Kotlin/Wasm ツールチェーンは、Node.js タスク (`wasmWasiNode*`) をすぐに利用できる形で提供します。
> Deno や WasmEdge を利用するものなど、プロジェクト内の他のタスクバリアントは、カスタムタスクとして含まれています。
>
{style="tip"}

## 開始する前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。

2.  IntelliJ IDEA で **ファイル | 新規 | バージョン管理からプロジェクト** を選択して、[Kotlin/Wasm WASI テンプレートリポジトリ](https://github.com/Kotlin/kotlin-wasm-wasi-template)をクローンします。

    コマンドラインからクローンすることもできます。

    ```bash
    git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
    ```

## アプリケーションを実行する

1.  **表示** | **ツールウィンドウ** | **Gradle** を選択して、**Gradle** ツールウィンドウを開きます。

    プロジェクトがロードされると、**Gradle** ツールウィンドウで **kotlin-wasm-wasi-example** の下に Gradle タスクを見つけることができます。

    > タスクを正常にロードするには、Gradle JVM として少なくとも Java 11 が必要です。
    >
    {style="note"}

2.  **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** から、以下のいずれかの Gradle タスクを選択して実行します。

    *   **wasmWasiNodeRun**: Node.js でアプリケーションを実行します。
    *   **wasmWasiDenoRun**: Deno でアプリケーションを実行します。
    *   **wasmWasiWasmEdgeRun**: WasmEdge でアプリケーションを実行します。

    > Windows プラットフォームで Deno を使用する場合は、`deno.exe` がインストールされていることを確認してください。詳細については、[Deno のインストールに関するドキュメント](https://docs.deno.com/runtime/manual/getting_started/installation)を参照してください。
    >
    {style="tip"}

    ![Kotlin/Wasm と WASI のタスク](wasm-wasi-gradle-task.png){width=600}

または、`kotlin-wasm-wasi-template` ルートディレクトリからターミナルで以下のいずれかのコマンドを実行します。

*   Node.js でアプリケーションを実行するには:

    ```bash
    ./gradlew wasmWasiNodeRun
    ```

*   Deno でアプリケーションを実行するには:

    ```bash
    ./gradlew wasmWasiDenoRun
  ```

*   WasmEdge でアプリケーションを実行するには:

    ```bash
    ./gradlew wasmWasiWasmEdgeRun
    ```

アプリケーションが正常にビルドされると、ターミナルにメッセージが表示されます。

![Kotlin/Wasm と WASI アプリ](wasm-wasi-app-terminal.png){width=600}

## アプリケーションをテストする

Kotlin/Wasm アプリケーションがさまざまな仮想マシンで正しく動作することもテストできます。

Gradle ツールウィンドウで、**kotlin-wasm-wasi-example** | **Tasks** | **verification** から以下のいずれかの Gradle タスクを実行します。

*   **wasmWasiNodeTest**: Node.js でアプリケーションをテストします。
*   **wasmWasiDenoTest**: Deno でアプリケーションをテストします。
*   **wasmWasiWasmEdgeTest**: WasmEdge でアプリケーションをテストします。

![Kotlin/Wasm と WASI のテストタスク](wasm-wasi-testing-task.png){width=600}

または、`kotlin-wasm-wasi-template` ルートディレクトリからターミナルで以下のいずれかのコマンドを実行します。

*   Node.js でアプリケーションをテストするには:

    ```bash
    ./gradlew wasmWasiNodeTest
    ```

*   Deno でアプリケーションをテストするには:

    ```bash
    ./gradlew wasmWasiDenoTest
    ```

*   WasmEdge でアプリケーションをテストするには:

    ```bash
    ./gradlew wasmWasiWasmEdgeTest
    ```

ターミナルにテスト結果が表示されます。

![Kotlin/Wasm と WASI のテスト](wasm-wasi-tests-results.png){width=600}

## 次のステップ

Kotlin Slack で Kotlin/Wasm コミュニティに参加しましょう。

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Kotlin/Wasm コミュニティに参加する" style="block"/></a>

他の Kotlin/Wasm の例を試す:

*   [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
*   [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
*   [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
*   [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)