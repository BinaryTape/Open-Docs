[//]: # (title: Kotlin/WasmとCompose Multiplatformを使ってみる)

> Kotlin/Wasmは[アルファ版](components-stability.md)です。これは予告なく変更される場合があります。
> 
> [Kotlin/Wasmコミュニティに参加しましょう。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

このチュートリアルでは、IntelliJ IDEAで[Kotlin/Wasm](wasm-overview.md)を使用して[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)アプリを実行し、[GitHub pages](https://pages.github.com/)上でサイトとして公開するためのアーティファクトを生成する方法を説明します。

## 始める前に

Kotlin Multiplatformウィザードを使用してプロジェクトを作成します。

1.  [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2.  **New Project**タブで、プロジェクト名とIDを任意のものに変更します。このチュートリアルでは、名前を「WasmDemo」、IDを「wasm.project.demo」に設定します。

    > これらはプロジェクトディレクトリの名前とIDです。そのままにしておくこともできます。
    >
    {style="tip"}

3.  **Web**オプションを選択します。他のオプションが選択されていないことを確認してください。
4.  **Download**ボタンをクリックし、結果として得られるアーカイブを解凍します。

    ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## プロジェクトをIntelliJ IDEAで開く

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/)の最新バージョンをダウンロードしてインストールします。
2.  IntelliJ IDEAのようこそ画面で**Open**をクリックするか、メニューバーから**File | Open**を選択します。
3.  解凍した「WasmDemo」フォルダに移動し、**Open**をクリックします。

## アプリケーションを実行する

1.  IntelliJ IDEAで、**View** | **Tool Windows** | **Gradle**を選択して**Gradle**ツールウィンドウを開きます。
    
    プロジェクトのロードが完了すると、GradleツールウィンドウでGradleタスクを見つけることができます。

    > タスクを正常にロードするには、Gradle JVMとしてJava 11以上が必要です。
    >
    {style="note"}

2.  **wasmdemo** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDevelopmentRun**タスクを選択して実行します。

    ![Run the Gradle task](wasm-gradle-task-window.png){width=400}

    または、`WasmDemo`のルートディレクトリからターミナルで次のコマンドを実行することもできます。

    ```bash
    ./gradlew wasmJsBrowserDevelopmentRun -t
    ```

3.  アプリケーションが起動したら、ブラウザで次のURLを開きます。

    ```bash
    http://localhost:8080/
    ```

    > ポート番号は、8080ポートが利用できない場合があるため、異なることがあります。実際のポート番号はGradleビルドコンソールに表示されます。
    >
    {style="tip"}

    「Click me!」ボタンが表示されます。これをクリックします。

    ![Click me](wasm-composeapp-browser-clickme.png){width=650}

    これでCompose Multiplatformのロゴが表示されます。

    ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## アーティファクトを生成する

**wasmdemo** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDistribution**タスクを選択して実行します。

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

または、`WasmDemo`のルートディレクトリからターミナルで次のコマンドを実行することもできます。

```bash
./gradlew wasmJsBrowserDistribution
```

アプリケーションのタスクが完了すると、生成されたアーティファクトは`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリにあります。

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## GitHub pagesで公開する

1.  `productionExecutable`ディレクトリ内のすべてのコンテンツを、サイトを作成したいリポジトリにコピーします。
2.  [サイトの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)に関するGitHubの手順に従ってください。

    > 変更をGitHubにプッシュした後、サイトに公開されるまでに最大10分かかる場合があります。
    >
    {style="note"}

3.  ブラウザで、GitHub pagesのドメインに移動します。

    ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

おめでとうございます！GitHub pagesにアーティファクトが公開されました。

## 次のステップ

*   [Compose Multiplatformを使用してiOSとAndroid間でUIを共有する方法を学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
*   その他のKotlin/Wasmの例を試す:

    *   [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
    *   [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
    *   [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
    *   [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
    *   [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
*   Kotlin SlackでKotlin/Wasmコミュニティに参加する:

    <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>