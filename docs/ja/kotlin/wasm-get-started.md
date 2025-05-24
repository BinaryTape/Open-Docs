---
title: "Kotlin/WasmとCompose Multiplatformを始める"
---
:::note
Kotlin/Wasmは[Alpha](components-stability)版です。いつでも変更される可能性があります。

[Kotlin/Wasmコミュニティに参加しましょう。](https://slack-chats.kotlinlang.org/c/webassembly)

:::

このチュートリアルでは、IntelliJ IDEAで[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリケーションを[Kotlin/Wasm](wasm-overview)で実行し、[GitHub pages](https://pages.github.com/)でサイトとして公開するためのアーティファクトを生成する方法を示します。

## 始める前に

Kotlin Multiplatformウィザードを使用してプロジェクトを作成します。

1. [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2. **New Project**タブで、プロジェクト名とIDを好みに合わせて変更します。このチュートリアルでは、名前を "WasmDemo"、IDを "wasm.project.demo" に設定します。

   > これらは、プロジェクトディレクトリの名前とIDです。そのままにすることもできます。
   >
   

3. **Web**オプションを選択します。他のオプションが選択されていないことを確認してください。
4. **Download**ボタンをクリックし、結果のアーカイブを解凍します。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## IntelliJ IDEAでプロジェクトを開く

1. 最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/)をダウンロードしてインストールします。
2. IntelliJ IDEAのWelcome画面で、**Open**をクリックするか、メニューバーで**File | Open**を選択します。
3. 解凍した "WasmDemo" フォルダに移動し、**Open**をクリックします。

## アプリケーションを実行する

1. IntelliJ IDEAで、**View** | **Tool Windows** | **Gradle**を選択して、**Gradle**ツールウィンドウを開きます。
   
   プロジェクトがロードされると、GradleツールウィンドウにGradleタスクが表示されます。

   > タスクを正常にロードするには、Gradle JVMとしてJava 11以上が必要です。
   >
   

2. **composeApp** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDevelopmentRun**タスクを選択して実行します。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

   または、`WasmDemo`ルートディレクトリからターミナルで次のコマンドを実行することもできます。

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. アプリケーションが起動したら、ブラウザで次のURLを開きます。

   ```bash
   http://localhost:8080/
   ```

   > 8080ポートが使用できない場合があるため、ポート番号は異なる場合があります。実際のポート番号は、Gradleビルドコンソールに出力されます。
   >
   

   "Click me!"ボタンが表示されます。それをクリックします。

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="650" style={{verticalAlign: 'middle'}}/>

   Compose Multiplatformのロゴが表示されます。

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="650" style={{verticalAlign: 'middle'}}/>

## アーティファクトを生成する

**composeApp** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDistribution**タスクを選択して実行します。

<img src="/img/wasm-gradle-task-window-compose.png" alt="Run the Gradle task" width="600" style={{verticalAlign: 'middle'}}/>

または、`WasmDemo`ルートディレクトリからターミナルで次のコマンドを実行することもできます。

```bash
./gradlew wasmJsBrowserDistribution
```

アプリケーションタスクが完了すると、生成されたアーティファクトが`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリにあります。

<img src="/img/wasm-composeapp-directory.png" alt="Artifacts directory" width="600" style={{verticalAlign: 'middle'}}/>

## GitHub pagesで公開する

1. `productionExecutable`ディレクトリ内のすべてのコンテンツを、サイトを作成するリポジトリにコピーします。
2. [サイトを作成する](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)ためのGitHubの指示に従ってください。

   > GitHubに変更をプッシュした後、サイトへの変更が公開されるまでに最大10分かかる場合があります。
   >
   

3. ブラウザで、GitHub pagesのドメインに移動します。

   <img src="/img/wasm-composeapp-github-clickme.png" alt="Navigate to GitHub pages" width="650" style={{verticalAlign: 'middle'}}/>

   おめでとうございます! GitHub pagesにアーティファクトを公開しました。

## 次は何をしますか?

Kotlin SlackでKotlin/Wasmコミュニティに参加しましょう。

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="/img/join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" /></a>

より多くのKotlin/Wasmの例を試してください。

* [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
  ```