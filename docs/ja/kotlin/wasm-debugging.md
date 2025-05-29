[//]: # (title: Kotlin/Wasm コードをデバッグする)

> Kotlin/Wasm は [Alpha](components-stability.md) です。これは今後変更される可能性があります。
>
{style="note"}

このチュートリアルでは、ブラウザを使用して Kotlin/Wasm でビルドされた [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリケーションをデバッグする方法を説明します。

## 開始する前に

Kotlin Multiplatform ウィザードを使用してプロジェクトを作成します。

1. [Kotlin Multiplatform ウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2. **New Project** タブで、プロジェクト名と ID を任意のものに変更します。このチュートリアルでは、名前を「WasmDemo」、ID を「wasm.project.demo」に設定します。

   > これらはプロジェクトディレクトリの名前と ID です。そのままにしておくこともできます。
   >
   {style="tip"}

3. **Web** オプションを選択します。他のオプションが選択されていないことを確認してください。
4. **Download** ボタンをクリックし、結果のアーカイブを解凍します。

   ![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=450}

## IntelliJ IDEA でプロジェクトを開く

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/) をダウンロードしてインストールします。
2. IntelliJ IDEA のようこそ画面で、**Open** をクリックするか、メニューバーから **File | Open** を選択します。
3. 解凍した「WasmDemo」フォルダーに移動し、**Open** をクリックします。

## アプリケーションを実行する

1. IntelliJ IDEA で、**View** | **Tool Windows** | **Gradle** を選択して **Gradle** ツールウィンドウを開きます。

   > タスクを正常にロードするには、Gradle JVM として Java 11 以降が必要です。
   >
   {style="note"}

2. **composeApp** | **Tasks** | **kotlin browser** 内で、**wasmJsBrowserDevelopmentRun** タスクを選択して実行します。

   ![Run the Gradle task](wasm-gradle-task-window.png){width=450}

   あるいは、`WasmDemo` ルートディレクトリからターミナルで次のコマンドを実行することもできます。

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. アプリケーションが起動したら、ブラウザで次の URL を開きます。

   ```bash
   http://localhost:8080/
   ```

   > ポート番号は 8080 ポートが利用できない場合があるため、異なる可能性があります。実際のポート番号は Gradle ビルドコンソールに表示されます。
   >
   {style="tip"}

   「Click me!」ボタンが表示されます。それをクリックします。

   ![Click me](wasm-composeapp-browser-clickme.png){width=550}

   Compose Multiplatform のロゴが表示されます。

   ![Compose app in browser](wasm-composeapp-browser.png){width=550}

## ブラウザでデバッグする

> 現在、デバッグはブラウザでのみ利用可能です。将来的には、[IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) でコードをデバッグできるようになります。
>
{style="note"}

この Compose Multiplatform アプリケーションは、追加の設定なしでブラウザでそのままデバッグできます。

ただし、他のプロジェクトでは、Gradle ビルドファイルに追加の設定を構成する必要がある場合があります。ブラウザのデバッグ設定方法の詳細については、次のセクションを展開してください。

### ブラウザのデバッグ設定 {initial-collapse-state="collapsed" collapsible="true"}

#### プロジェクトのソースへのアクセスを有効にする

デフォルトでは、ブラウザはデバッグに必要なプロジェクトのソースの一部にアクセスできません。アクセスを提供するために、Webpack DevServer を設定してこれらのソースを提供できます。`ComposeApp` ディレクトリにある `build.gradle.kts` ファイルに、次のコードスニペットを追加します。

トップレベルの宣言として、このインポートを追加します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

共通の `commonWebpackConfig{}` ブロック内に、次のコードスニペットを追加します。このブロックは、`kotlin{}` 内の `wasmJs{}` ターゲット DSL と `browser{}` プラットフォーム DSL の中にあります。

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // ブラウザ内でデバッグするためにソースを配信する
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

結果のコードブロックは次のようになります。

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
                        // ブラウザ内でデバッグするためにソースを配信する
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

> 現在、ライブラリのソースはデバッグできません。
> [将来的にはこれをサポートする予定です](https://youtrack.jetbrains.com/issue/KT-64685)。
>
{style="note"}

#### カスタムフォーマッタを使用する

カスタムフォーマッタは、Kotlin/Wasm コードのデバッグ時に、変数の値をよりユーザーフレンドリーで理解しやすい方法で表示および特定するのに役立ちます。

カスタムフォーマッタは開発ビルドでデフォルトで有効になっているため、追加の Gradle 設定は必要ありません。

この機能は、[カスタムフォーマッタ API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html) を使用しているため、Firefox および Chromium ベースのブラウザでサポートされています。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認してください。

* Chrome DevTools で、**Settings | Preferences | Console** 内のカスタムフォーマッタのチェックボックスを見つけます。

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools で、**Settings | Advanced settings** 内のカスタムフォーマッタのチェックボックスを見つけます。

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

カスタムフォーマッタは Kotlin/Wasm の開発ビルドで動作します。プロダクションビルドに特定の要件がある場合は、それに応じて Gradle 設定を調整する必要があります。`wasmJs {}` ブロックに次のコンパイラオプションを追加します。

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

カスタムフォーマッタを有効にしたら、デバッグチュートリアルを続行できます。

### Kotlin/Wasm アプリケーションをデバッグする

> このチュートリアルでは Chrome ブラウザを使用していますが、他のブラウザでも同様の手順で進めることができます。詳細については、[ブラウザのバージョン](wasm-troubleshooting.md#browser-versions)を参照してください。
>
{style="tip"}

1. アプリケーションのブラウザウィンドウで右クリックし、**Inspect** アクションを選択して開発者ツールにアクセスします。または、**F12** ショートカットを使用するか、**View | Developer | Developer Tools** を選択することもできます。

2. **Sources** タブに切り替えて、デバッグする Kotlin ファイルを選択します。このチュートリアルでは、`Greeting.kt` ファイルを使用します。

3. 行番号をクリックして、検査したいコードにブレークポイントを設定します。ブレークポイントを設定できるのは、色が濃い行番号の行のみです。

   ![Set breakpoints](wasm-breakpoints.png){width=700}

4. **Click me!** ボタンをクリックしてアプリケーションを操作します。このアクションによりコードの実行がトリガーされ、ブレークポイントに到達するとデバッガが一時停止します。

5. デバッグペインで、デバッグコントロールボタンを使用して、ブレークポイントでの変数とコードの実行を検査します。
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} Step into (ステップイン) で関数をより深く調査します。
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} Step over (ステップオーバー) で現在の行を実行し、次の行で一時停止します。
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} Step out (ステップアウト) で現在の関数を終了するまでコードを実行します。

   ![Debug controls](wasm-debug-controls.png){width=450}

6. **Call stack** および **Scope** ペインをチェックして、関数呼び出しのシーケンスをトレースし、エラーの場所を特定します。

   ![Check call stack](wasm-debug-scope.png){width=450}

   変数値の視覚化を改善するには、「[ブラウザのデバッグ設定](#configure-your-browser-for-debugging)」セクション内の「_カスタムフォーマッタを使用する_」を参照してください。

7. コードに変更を加え、[アプリケーションを再度実行](#run-the-application)して、すべてが期待どおりに動作することを確認します。
8. ブレークポイントのある行番号をクリックして、ブレークポイントを削除します。

## フィードバックを残す

デバッグ体験に関するフィードバックをいただければ幸いです！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack 招待を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)して、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルで開発者に直接フィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) でフィードバックを提供してください。

## 次のステップ

* この [YouTube ビデオ](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)で Kotlin/Wasm のデバッグを実際に見てみましょう。
* `kotlin-wasm-examples` リポジトリから Kotlin/Wasm の例を試してみましょう。
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)