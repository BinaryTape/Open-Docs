[//]: # (title: Kotlin/WasmとCompose Multiplatformを始める)

> Kotlin/Wasmは[アルファ版](components-stability.md)です。いつでも変更される可能性があります。
> 
> [Kotlin/Wasmコミュニティに参加しましょう。](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

このチュートリアルでは、IntelliJ IDEAで[Kotlin/Wasm](wasm-overview.md)を使って[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)アプリケーションを実行し、生成された成果物を[GitHub Pages](https://pages.github.com/)サイトとして公開する方法を説明します。

## 始める前に

Kotlin Multiplatformウィザードを使用してプロジェクトを作成します。

1. [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2. **New Project**タブで、プロジェクト名とIDを任意のものに変更します。このチュートリアルでは、名前を「WasmDemo」、IDを「wasm.project.demo」と設定します。

   > これらはプロジェクトディレクトリの名前とIDです。そのままにすることもできます。
   >
   {style="tip"}

3. **Web**オプションを選択します。他のオプションが選択されていないことを確認してください。
4. **Download**ボタンをクリックし、生成されたアーカイブを展開します。

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## IntelliJ IDEAでプロジェクトを開く

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/)の最新版をダウンロードしてインストールします。
2. IntelliJ IDEAのようこそ画面で、**Open**をクリックするか、メニューバーで**File | Open**を選択します。
3. 展開した「WasmDemo」フォルダに移動し、**Open**をクリックします。

## アプリケーションを実行する

1. IntelliJ IDEAで、**View** | **Tool Windows** | **Gradle**を選択して**Gradle**ツールウィンドウを開きます。
   
   プロジェクトが読み込まれると、GradleツールウィンドウでGradleタスクを見つけることができます。

   > タスクを正常に読み込むには、Gradle JVMとしてJava 11以上が必要です。
   >
   {style="note"}

2. **wasmdemo** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDevelopmentRun**タスクを選択して実行します。

   ![Run the Gradle task](wasm-gradle-task-window.png){width=400}

   あるいは、`WasmDemo`のルートディレクトリからターミナルで以下のコマンドを実行することもできます。

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun -t
   ```

3. アプリケーションが起動したら、ブラウザで以下のURLを開きます。

   ```bash
   http://localhost:8080/
   ```

   > 8080ポートが使用できない場合があるため、ポート番号は異なる場合があります。実際のポート番号は、Gradleビルドコンソールに出力されます。
   >
   {style="tip"}

   「Click me!」ボタンが表示されます。それをクリックします。

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   Compose Multiplatformのロゴが表示されます。

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## 成果物を生成する

**wasmdemo** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDistribution**タスクを選択して実行します。

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

あるいは、`WasmDemo`のルートディレクトリからターミナルで以下のコマンドを実行することもできます。

```bash
./gradlew wasmJsBrowserDistribution
```

アプリケーションタスクが完了すると、生成された成果物は`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリにあります。

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## GitHub Pagesに公開する

1. `productionExecutable`ディレクトリ内のすべてのコンテンツを、サイトを作成したいリポジトリにコピーします。
2. [サイトの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)に関するGitHubの指示に従ってください。

   > 変更をGitHubにプッシュした後、サイトへの変更が公開されるまでに最大10分かかる場合があります。
   >
   {style="note"}

3. ブラウザで、GitHub Pagesのドメインにアクセスします。

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

おめでとうございます！成果物をGitHub Pagesに公開できました。

## 次のステップ

Kotlin SlackのKotlin/Wasmコミュニティに参加しましょう。

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

その他のKotlin/Wasmの例を試してみてください。

* [Composeイメージビューア](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnackアプリケーション](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.jsの例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASIの例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Composeの例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)