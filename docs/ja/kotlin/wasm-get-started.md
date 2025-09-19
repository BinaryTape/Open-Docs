[//]: # (title: Kotlin/WasmとCompose Multiplatformを使い始める)

<primary-label ref="beta"/> 

このチュートリアルでは、IntelliJ IDEAで[](wasm-overview.md)を使用して[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)アプリを実行し、ウェブサイトの一部として公開するためのアーティファクトを生成する方法を説明します。

## プロジェクトを作成する

1.  [Kotlin Multiplatform開発用の環境をセットアップします](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。
2.  IntelliJ IDEAで、**File | New | Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します。

    > Kotlin Multiplatform IDEプラグインを使用していない場合は、[KMP Webウィザード](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true)を使用して同じプロジェクトを生成できます。
    >
    {style="note"}

4.  **New Project**ウィンドウで、以下のフィールドを指定します。

    *   **Name:** WasmDemo
    *   **Group:** wasm.project.demo
    *   **Artifact:** wasmdemo

    > Webウィザードを使用する場合は、「Project Name」として「WasmDemo」、「Project ID」として「wasm.project.demo」を指定してください。
    >
    {style="note"}

5.  **Web**ターゲットと**Share UI**タブを選択します。他のオプションが選択されていないことを確認してください。
6.  **Create**をクリックします。

    ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## アプリケーションを実行する

プロジェクトのロードが完了したら、実行構成のリストから**composeApp [wasmJs]**を選択し、**Run**をクリックします。

![Run the Compose Multiplatform app on web](compose-run-web-black.png){width=300}

ウェブアプリケーションはブラウザで自動的に開きます。あるいは、実行が完了したら、ブラウザで次のURLを開くこともできます。

```shell
   http://localhost:8080/
```
> ポート番号は、8080ポートが利用できない場合があるため、異なることがあります。
> 実際のポート番号はGradleビルドの出力で確認できます。
>
{style="tip"}

「Click me!」ボタンをクリックします。

![Click me](wasm-composeapp-browser-clickme.png){width=600}

Compose Multiplatformのロゴが表示されます。

![Compose app in browser](wasm-composeapp-browser.png){width=600}

## アーティファクトを生成する

ウェブサイトに公開するために、プロジェクトのアーティファクトを生成します。

1.  **View | Tool Windows | Gradle**を選択して、**Gradle**ツールウィンドウを開きます。
2.  **wasmdemo | Tasks | kotlin browser**で、**wasmJsBrowserDistribution**タスクを選択して実行します。

    > タスクを正常にロードするには、Gradle JVMとしてJava 11以上が必要です。また、Compose Multiplatformプロジェクト全般ではJava 17以上を推奨します。
    >
    {style="note"}

    ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

    あるいは、`WasmDemo`のルートディレクトリからターミナルで次のコマンドを実行することもできます。

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

アプリケーションのタスクが完了すると、生成されたアーティファクトは`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリにあります。

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## アプリケーションを公開する

生成されたアーティファクトを使用して、Kotlin/Wasmアプリケーションをデプロイします。
お好みの公開オプションを選択し、
アーティファクトをデプロイするための手順に従ってください。
いくつかの選択肢は次のとおりです。

*   [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
*   [Cloudflare](https://developers.cloudflare.com/workers/)
*   [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

サイトが作成されたら、ブラウザを開き、プラットフォームのページドメインに移動します。例えば、GitHub pagesの場合：

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   おめでとうございます！アーティファクトが公開されました。

## 次のステップ

*   [Compose Multiplatformを使用してiOSとAndroid間でUIを共有する方法を学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
*   その他のKotlin/Wasmの例を試す：

  *   [KotlinConfアプリケーション](https://github.com/JetBrains/kotlinconf-app)
  *   [Compose画像ビューア](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  *   [Jetsnackアプリケーション](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  *   [Node.jsの例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  *   [WASIの例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  *   [Composeの例](https://github.com/Kotlin/kotlin-wasm-compose-template)

*   Kotlin SlackでKotlin/Wasmコミュニティに参加する：

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>