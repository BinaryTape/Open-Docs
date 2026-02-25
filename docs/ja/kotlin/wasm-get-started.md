[//]: # (title: Kotlin/Wasm と Compose Multiplatform を使ってみる)

<primary-label ref="beta"/> 

このチュートリアルでは、IntelliJ IDEA で [](wasm-overview.md) を使用した [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリを実行し、ウェブサイトの一部として公開するためのアーティファクトを生成する方法を解説します。

## プロジェクトの作成

1. [Kotlin Multiplatform 開発のための環境設定](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)を行ってください。
2. IntelliJ IDEA で、**File | New | Project** を選択します。
3. 左側のパネルで **Kotlin Multiplatform** を選択します。

   > Kotlin Multiplatform IDE プラグインを使用していない場合は、[KMP web wizard](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true) を使用して同じプロジェクトを生成できます。
   >
   {style="note"}

4. **New Project** ウィンドウで以下のフィールドを指定します。

   * **Name:** WasmDemo
   * **Group:** wasm.project.demo
   * **Artifact:** wasmdemo

   > ウェブウィザードを使用する場合は、Project Name に「WasmDemo」、Project ID に「wasm.project.demo」を指定してください。
   >
   {style="note"}

5. **Web** ターゲットを選択し、**Share UI** タブを選択します。他のオプションが選択されていないことを確認してください。
6. **Create** をクリックします。

   ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## アプリケーションの実行

プロジェクトがロードされたら、実行構成のリストから **composeApp [wasmJs]** を選択し、**Run** をクリックします。

![Run the Compose Multiplatform app on web](compose-run-web-black.png){width=300}

ウェブアプリケーションがブラウザで自動的に開きます。あるいは、実行が完了した後にブラウザで以下の URL を開くこともできます。

```shell
   http://localhost:8080/
```
> 8080 ポートが使用できない場合があるため、ポート番号は異なる場合があります。
> 実際のポート番号は Gradle ビルドの出力で確認できます。
>
{style="tip"}

「Click me!」ボタンをクリックします。

![Click me](wasm-composeapp-browser-clickme.png){width=600}

Compose Multiplatform のロゴが表示されます。

![Compose app in browser](wasm-composeapp-browser.png){width=600}

## アーティファクトの生成

ウェブサイトで公開するためのプロジェクトのアーティファクトを生成します。

1. **View** | **Tool Windows** | **Gradle** を選択して、**Gradle** ツールウィンドウを開きます。
2. **wasmdemo** | **Tasks** | **kotlin browser** で、**wasmJsBrowserDistribution** タスクを選択して実行します。

   > タスクを正常にロードするには、Gradle JVM として少なくとも Java 11 が必要です。また、一般的な Compose Multiplatform プロジェクトでは Java 17 以上を推奨します。
   >
   {style="note"}

   ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

   あるいは、`WasmDemo` のルートディレクトリからターミナルで以下のコマンドを実行することもできます。

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

アプリケーションタスクが完了すると、生成されたアーティファクトを `composeApp/build/dist/wasmJs/productionExecutable` ディレクトリで見つけることができます。

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## アプリケーションの公開

生成されたアーティファクトを使用して、Kotlin/Wasm アプリケーションをデプロイします。
お好みの公開オプションを選択し、手順に従ってアーティファクトをデプロイしてください。
いくつかの選択肢を以下に示します。

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

サイトが作成されたら、ブラウザを開いてプラットフォームのページドメインに移動します。例：GitHub pages

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   おめでとうございます！アーティファクトが公開されました。

## 次のステップ

* [Compose Multiplatform を使用して iOS と Android 間で UI を共有する方法を学ぶ](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 他の Kotlin/Wasm の例を試してみる:

  * [KotlinConf アプリケーション](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack アプリケーション](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js の例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI の例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose の例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* Kotlin Slack の Kotlin/Wasm コミュニティに参加する:

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>