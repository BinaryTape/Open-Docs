---
title: Kotlin/WasmとWASIを始める
---
:::note
Kotlin/Wasm は [Alpha](components-stability) 段階です。予告なく変更される場合があります。

[Kotlin/Wasm コミュニティに参加してください。](https://slack-chats.kotlinlang.org/c/webassembly)

:::

このチュートリアルでは、さまざまな WebAssembly 仮想マシンで [WebAssembly System Interface (WASI)](https://wasi.dev/) を使用して、簡単な [Kotlin/Wasm](wasm-overview) アプリケーションを実行する方法を説明します。

[Node.js](https://nodejs.org/en)、[Deno](https://deno.com/)、[WasmEdge](https://wasmedge.org/) 仮想マシンでアプリケーションを実行する例を見つけることができます。出力は、標準の WASI API を使用する簡単なアプリケーションです。

現在、Kotlin/Wasm は WASI 0.1（Preview 1 としても知られています）をサポートしています。
[WASI 0.2 のサポートは、今後のリリースで計画されています](https://youtrack.jetbrains.com/issue/KT-64568)。

:::tip
Kotlin/Wasm ツールチェーンには、Node.js タスク（`wasmWasiNode*`）が標準で付属しています。
Deno や WasmEdge を利用するタスクなど、プロジェクト内の他のタスクバリアントは、カスタムタスクとして含まれています。

:::

## はじめる前に

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/) をダウンロードしてインストールします。

2. IntelliJ IDEA で **File | New | Project from Version Control** を選択して、[Kotlin/Wasm WASI テンプレートリポジトリ](https://github.com/Kotlin/kotlin-wasm-wasi-template) をクローンします。

   または、コマンドラインからクローンすることもできます。
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## アプリケーションを実行する

1. **View** | **Tool Windows** | **Gradle** を選択して、**Gradle** ツールウィンドウを開きます。
   
   **Gradle** ツールウィンドウで、プロジェクトのロード後、**kotlin-wasm-wasi-example** の下に Gradle タスクが表示されます。

   > タスクを正常にロードするには、Gradle JVM として少なくとも Java 11 が必要です。
   >
   

2. **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** から、次のいずれかの Gradle タスクを選択して実行します。

   * Node.js でアプリケーションを実行するには、**wasmWasiNodeRun** を選択します。
   * Deno でアプリケーションを実行するには、**wasmWasiDenoRun** を選択します。
   * WasmEdge でアプリケーションを実行するには、**wasmWasiWasmEdgeRun** を選択します。

     > Windows プラットフォームで Deno を使用する場合は、`deno.exe` がインストールされていることを確認してください。詳細については、
     > [Deno のインストールに関するドキュメント](https://docs.deno.com/runtime/manual/getting_started/installation) を参照してください。
     >
     

   <img src="/img/wasm-wasi-gradle-task.png" alt="Kotlin/Wasm and WASI tasks" width="600" style={{verticalAlign: 'middle'}}/>
   
または、ターミナルで ` kotlin-wasm-wasi-template` ルートディレクトリから、次のいずれかのコマンドを実行します。

* Node.js でアプリケーションを実行する場合：

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* Deno でアプリケーションを実行する場合：

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* WasmEdge でアプリケーションを実行する場合：

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

アプリケーションが正常にビルドされると、ターミナルにメッセージが表示されます。

<img src="/img/wasm-wasi-app-terminal.png" alt="Kotlin/Wasm and WASI app" width="600" style={{verticalAlign: 'middle'}}/>

## アプリケーションをテストする

Kotlin/Wasm アプリケーションがさまざまな仮想マシンで正しく動作することもテストできます。

Gradle ツールウィンドウで、**kotlin-wasm-wasi-example** | **Tasks** | **verification** から、次のいずれかの Gradle タスクを実行します。

* Node.js でアプリケーションをテストするには、**wasmWasiNodeTest** を選択します。
* Deno でアプリケーションをテストするには、**wasmWasiDenoTest** を選択します。
* WasmEdge でアプリケーションをテストするには、**wasmWasiWasmEdgeTest** を選択します。

<img src="/img/wasm-wasi-testing-task.png" alt="Kotlin/Wasm and WASI test tasks" width="600" style={{verticalAlign: 'middle'}}/>

または、ターミナルで ` kotlin-wasm-wasi-template` ルートディレクトリから、次のいずれかのコマンドを実行します。
    
* Node.js でアプリケーションをテストする場合：

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* Deno でアプリケーションをテストする場合：
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* WasmEdge でアプリケーションをテストする場合：

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

ターミナルにテスト結果が表示されます。

<img src="/img/wasm-wasi-tests-results.png" alt="Kotlin/Wasm and WASI test" width="600" style={{verticalAlign: 'middle'}}/>

## 次のステップ

Kotlin Slack で Kotlin/Wasm コミュニティに参加しましょう。

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

その他の Kotlin/Wasm の例を試してください。

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)
  ```