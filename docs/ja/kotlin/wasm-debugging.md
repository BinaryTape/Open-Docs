[//]: # (title: Kotlin/Wasm コードのデバッグ)

> Kotlin/Wasm は [アルファ版](components-stability.md)です。これは予告なく変更される可能性があります。
>
{style="note"}

このチュートリアルでは、ブラウザを使用して Kotlin/Wasm でビルドされた [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリケーションをデバッグする方法を説明します。

## 開始する前に

Kotlin Multiplatform ウィザードを使用してプロジェクトを作成します:

1. [Kotlin Multiplatform ウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2. **New Project** タブで、プロジェクト名と ID を任意に変更します。このチュートリアルでは、名前を「WasmDemo」、ID を「wasm.project.demo」に設定します。

   > これらはプロジェクトディレクトリの名前と ID です。そのままにしておくこともできます。
   >
   {style="tip"}

3. **Web** オプションを選択します。他のオプションが選択されていないことを確認してください。
4. **Download** ボタンをクリックし、結果として得られるアーカイブを解凍します。

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=450}

## IntelliJ IDEA でプロジェクトを開く

1. [IntelliJ IDEA](https://www.jetbrains.com/idea/) の最新バージョンをダウンロードしてインストールします。
2. IntelliJ IDEA のようこそ画面で、**Open** をクリックするか、メニューバーで **File | Open** を選択します。
3. 解凍した「WasmDemo」フォルダに移動し、**Open** をクリックします。

## アプリケーションを実行する

1. IntelliJ IDEA で、**View** | **Tool Windows** | **Gradle** を選択して **Gradle** ツールウィンドウを開きます。

   > タスクを正常にロードするには、Gradle JVM として Java 11 以降が必要です。
   >
   {style="note"}

2. **composeApp** | **Tasks** | **kotlin browser** で、**wasmJsBrowserDevelopmentRun** タスクを選択して実行します。

   ![Run the Gradle task](wasm-gradle-task-window.png){width=450}

   あるいは、`WasmDemo` のルートディレクトリからターミナルで以下のコマンドを実行することもできます:

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. アプリケーションが起動したら、ブラウザで以下の URL を開きます:

   ```bash
   http://localhost:8080/
   ```

   > ポート番号は、8080 ポートが利用できない場合があるため、異なる場合があります。実際のポート番号は Gradle ビルドコンソールに表示されます。
   >
   {style="tip"}

   「Click me!」ボタンが表示されます。これをクリックします:

   ![Click me](wasm-composeapp-browser-clickme.png){width=550}

   すると、Compose Multiplatform のロゴが表示されます:

   ![Compose app in browser](wasm-composeapp-browser.png){width=550}

## ブラウザでデバッグする

> 現在、デバッグはブラウザでのみ利用可能です。将来的には、[IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) でコードをデバッグできるようになります。
>
{style="note"}

この Compose Multiplatform アプリケーションは、追加の設定なしで、すぐにブラウザでデバッグできます。

ただし、他のプロジェクトでは、Gradle ビルドファイルに追加の設定を行う必要がある場合があります。デバッグのためにブラウザを設定する方法の詳細については、次のセクションを展開してください。

### デバッグのためにブラウザを設定する {initial-collapse-state="collapsed" collapsible="true"}

#### プロジェクトのソースへのアクセスを有効にする

デフォルトでは、ブラウザはデバッグに必要なプロジェクトのソースの一部にアクセスできません。アクセスを提供するために、Webpack DevServer を構成してこれらのソースを提供できます。`ComposeApp` ディレクトリにある `build.gradle.kts` ファイルに以下のコードスニペットを追加します。

このインポートをトップレベルの宣言として追加します:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

`kotlin{}` 内の `wasmJs{}` ターゲット DSL および `browser{}` プラットフォーム DSL にある `commonWebpackConfig{}` ブロック内に、このコードスニペットを追加します:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

結果として得られるコードブロックは以下のようになります:

```kotlin
kotlin {
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        moduleName = "composeApp"
        browser {
            commonWebpackConfig {
                outputFileName = "composeApp.js"
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    static = (static ?: mutableListOf()).apply { 
                        // Serve sources to debug inside browser
                        add(project.rootDir.path)
                        add(project.projectDir.path)
                    }
                } 
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"}

> 現在、ライブラリのソースはデバッグできません。[将来的にはこれをサポートする予定です](https://youtrack.jetbrains.com/issue/KT-64685)。
>
{style="note"}

#### カスタムフォーマッタを使用する

カスタムフォーマッタは、Kotlin/Wasm コードをデバッグする際に、変数値をよりユーザーフレンドリーで分かりやすい方法で表示し、特定するのに役立ちます。

カスタムフォーマッタは開発ビルドでデフォルトで有効になっているため、追加の Gradle 設定は必要ありません。

この機能は、[カスタムフォーマッタ API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html) を使用しているため、Firefox および Chromium ベースのブラウザでサポートされています。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認してください:

* Chrome DevTools では、**Settings | Preferences | Console** でカスタムフォーマッタのチェックボックスを見つけます:

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools では、**Settings | Advanced settings** でカスタムフォーマッタのチェックボックスを見つけます:

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

カスタムフォーマッタは Kotlin/Wasm 開発ビルドで機能します。本番ビルドで特定の要件がある場合は、Gradle 設定をそれに応じて調整する必要があります。以下のコンパイラオプションを `wasmJs {}` ブロックに追加します:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

カスタムフォーマッタを有効にした後、デバッグチュートリアルを続行できます。

### Kotlin/Wasm アプリケーションをデバッグする

> このチュートリアルでは Chrome ブラウザを使用していますが、他のブラウザでもこれらの手順を実行できるはずです。詳細については、[ブラウザのバージョン](wasm-troubleshooting.md#browser-versions)を参照してください。
>
{style="tip"}

1. アプリケーションのブラウザウィンドウで右クリックし、**Inspect** アクションを選択して開発者ツールにアクセスします。あるいは、**F12** ショートカットを使用するか、**View** | **Developer** | **Developer Tools** を選択することもできます。

2. **Sources** タブに切り替え、デバッグする Kotlin ファイルを選択します。このチュートリアルでは、`Greeting.kt` ファイルを扱います。

3. 行番号をクリックして、調べたいコードにブレークポイントを設定します。ブレークポイントを設定できるのは、数字が濃い色の行のみです。

   ![Set breakpoints](wasm-breakpoints.png){width=700}

4. **Click me!** ボタンをクリックしてアプリケーションを操作します。このアクションによりコードの実行がトリガーされ、実行がブレークポイントに到達するとデバッガが一時停止します。

5. デバッグペインで、デバッグコントロールボタンを使用して、ブレークポイントでの変数とコードの実行を調べます:
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} 関数をさらに深く調査するためにステップインします。
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} 現在の行を実行し、次の行で一時停止するためにステップオーバーします。
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} 現在の関数を終了するまでコードを実行するためにステップアウトします。

   ![Debug controls](wasm-debug-controls.png){width=450}

6. **Call stack** と **Scope** ペインをチェックして、関数呼び出しのシーケンスをトレースし、エラーの場所を特定します。

   ![Check call stack](wasm-debug-scope.png){width=450}

   変数値をより分かりやすく視覚化するには、「[デバッグのためにブラウザを設定する](#configure-your-browser-for-debugging)」セクションの「_カスタムフォーマッタを使用する_」を参照してください。

7. コードを変更し、[アプリケーションを再度実行](#run-the-application)して、すべてが期待どおりに機能することを確認します。
8. ブレークポイントのある行番号をクリックして、ブレークポイントを削除します。

## フィードバックを残す

デバッグ体験に関するフィードバックをいただければ幸いです！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack の招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、直接開発者に [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルでフィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) でフィードバックを提供してください。

## 次のステップ

* この [YouTube ビデオ](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) で Kotlin/Wasm のデバッグの実際の様子をご覧ください。
* `kotlin-wasm-examples` リポジトリから Kotlin/Wasm の例を試してみてください:
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)