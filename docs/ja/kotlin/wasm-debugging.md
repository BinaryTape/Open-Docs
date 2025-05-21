---
title: "Kotlin/Wasm コードのデバッグ"
---
:::note
Kotlin/Wasmは[Alpha](components-stability)です。いつでも変更される可能性があります。

:::

このチュートリアルでは、ブラウザを使用してKotlin/Wasmで構築された[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
アプリケーションをデバッグする方法を説明します。

## 始める前に

Kotlin Multiplatformウィザードを使用してプロジェクトを作成します。

1. [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com/#newProject)を開きます。
2. **New Project**タブで、プロジェクト名とIDを好みに変更します。このチュートリアルでは、名前を「WasmDemo」、IDを「wasm.project.demo」に設定します。

   > これらはプロジェクトディレクトリの名前とIDです。そのままにすることもできます。
   >
   

3. **Web**オプションを選択します。他のオプションが選択されていないことを確認してください。
4. **Download**ボタンをクリックし、結果のアーカイブを解凍します。

<img src="/img/wasm-compose-web-wizard.png" alt="Kotlin Multiplatform wizard" width="400" style={{verticalAlign: 'middle'}}/>

## IntelliJ IDEAでプロジェクトを開く

1. 最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/)をダウンロードしてインストールします。
2. IntelliJ IDEAのWelcome画面で、**Open**をクリックするか、メニューバーで**File | Open**を選択します。
3. 解凍した「WasmDemo」フォルダに移動し、**Open**をクリックします。

## アプリケーションを実行する

1. IntelliJ IDEAで、**View** | **Tool Windows** | **Gradle**を選択して、**Gradle**ツールウィンドウを開きます。

   > タスクを正常にロードするには、Gradle JVMとして少なくともJava 11が必要です。
   >
   

2. **composeApp** | **Tasks** | **kotlin browser**で、**wasmJsBrowserDevelopmentRun**タスクを選択して実行します。

   <img src="/img/wasm-gradle-task-window.png" alt="Run the Gradle task" width="550" style={{verticalAlign: 'middle'}}/>

   または、`WasmDemo`ルートディレクトリからターミナルで次のコマンドを実行することもできます。

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
   ```

3. アプリケーションが起動したら、ブラウザで次のURLを開きます。

   ```bash
   http://localhost:8080/
   ```

   > 8080ポートが利用できない場合があるため、ポート番号は異なる場合があります。実際のポート番号は、Gradleビルドコンソールに出力されます。
   >
   

   「Click me!」ボタンが表示されます。クリックしてください。

   <img src="/img/wasm-composeapp-browser-clickme.png" alt="Click me" width="550" style={{verticalAlign: 'middle'}}/>

   Compose Multiplatformのロゴが表示されます。

   <img src="/img/wasm-composeapp-browser.png" alt="Compose app in browser" width="550" style={{verticalAlign: 'middle'}}/>

## ブラウザでデバッグする

:::note
現在、デバッグはブラウザでのみ可能です。将来的には、[IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA)でコードをデバッグできるようになります。

:::

このCompose Multiplatformアプリケーションは、
追加の設定なしに、ブラウザでそのままデバッグできます。

ただし、他のプロジェクトでは、Gradle
ビルドファイルで追加の設定が必要になる場合があります。デバッグ用にブラウザを構成する方法の詳細については、次のセクションを展開してください。

### デバッグ用にブラウザを構成する

#### プロジェクトのソースへのアクセスを有効にする

デフォルトでは、ブラウザはデバッグに必要なプロジェクトのソースの一部にアクセスできません。アクセスを提供するには、Webpack DevServer
がこれらのソースを提供するように構成できます。`ComposeApp`ディレクトリで、次のコードスニペットを`build.gradle.kts`ファイルに追加します。

このインポートをトップレベルの宣言として追加します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

`kotlin{}`内の`wasmJs{}`ターゲットDSLおよび`browser{}`プラットフォームDSLにある`commonWebpackConfig{}`ブロック内に、このコードスニペットを追加します。

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
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

:::note
現在、ライブラリソースをデバッグすることはできません。
[この機能は将来サポートする予定です](https://youtrack.jetbrains.com/issue/KT-64685)。

:::

#### カスタムフォーマッタを使用する

カスタムフォーマッタは、Kotlin/Wasmコードをデバッグするときに、変数値をよりユーザーフレンドリーで理解しやすい方法で表示および特定するのに役立ちます。

カスタムフォーマッタは開発ビルドでデフォルトで有効になっているため、追加のGradle構成は必要ありません。

この機能は、[カスタムフォーマッタAPI](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)を使用しているため、FirefoxおよびChromiumベースのブラウザでサポートされています。

この機能を使用するには、ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認してください。

* Chrome DevToolsでは、**Settings | Preferences | Console**でカスタムフォーマッタのチェックボックスを見つけます。

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* Firefox DevToolsでは、**Settings | Advanced settings**でカスタムフォーマッタのチェックボックスを見つけます。

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

カスタムフォーマッタは、Kotlin/Wasm開発ビルドで動作します。本番ビルドに固有の要件がある場合は、
Gradle構成をそれに応じて調整する必要があります。次のコンパイラオプションを`wasmJs {}`ブロックに追加します。

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

### Kotlin/Wasmアプリケーションをデバッグする

:::tip
このチュートリアルではChromeブラウザを使用していますが、他のブラウザでもこれらの手順に従うことができるはずです。詳細については、
[ブラウザのバージョン](wasm-troubleshooting#browser-versions)を参照してください。

:::

1. アプリケーションのブラウザウィンドウで、右クリックして**Inspect**アクションを選択し、開発者ツールにアクセスします。
   または、**F12**ショートカットを使用するか、**View** | **Developer** | **Developer Tools**を選択することもできます。

2. **Sources**タブに切り替え、デバッグするKotlinファイルを選択します。このチュートリアルでは、`Greeting.kt`ファイルを使用します。

3. 行番号をクリックして、検査するコードにブレークポイントを設定します。濃い色の番号の行のみが
   ブレークポイントを持つことができます。

   <img src="/img/wasm-breakpoints.png" alt="Set breakpoints" width="600" style={{verticalAlign: 'middle'}}/>

4. **Click me!**ボタンをクリックして、アプリケーションを操作します。このアクションにより、コードの実行がトリガーされ、
   実行がブレークポイントに到達するとデバッガーが一時停止します。

5. デバッグペインで、デバッグコントロールボタンを使用して、ブレークポイントで変数とコードの実行を検査します。
   * <img src="/img/wasm-step-into.png" alt="Step into" width="30" style={{verticalAlign: 'middle'}}/> Step intoを使用して、関数をより深く調査します。
   * <img src="/img/wasm-step-over.png" alt="Step over" width="30" style={{verticalAlign: 'middle'}}/> Step overを使用して、現在の行を実行し、次の行で一時停止します。
   * <img src="/img/wasm-step-out.png" alt="Step out" width="30" style={{verticalAlign: 'middle'}}/> Step outを使用して、現在の関数を終了するまでコードを実行します。

   <img src="/img/wasm-debug-controls.png" alt="Debug controls" width="600" style={{verticalAlign: 'middle'}}/>

6. **Call stack**および**Scope**ペインを確認して、関数呼び出しのシーケンスをトレースし、エラーの場所を特定します。

   <img src="/img/wasm-debug-scope.png" alt="Check call stack" width="550" style={{verticalAlign: 'middle'}}/>

   変数値をより視覚的に改善するには、[デバッグ用にブラウザを構成する](#configure-your-browser-for-debugging)セクションの「_カスタムフォーマッタを使用する_」を参照してください。

7. コードを変更し、[アプリケーションを実行する](#run-the-application)を再度実行して、すべてが期待どおりに動作することを確認します。
8. ブレークポイントのある行番号をクリックして、ブレークポイントを削除します。

## フィードバックを残す

デバッグの経験についてフィードバックをお寄せいただければ幸いです。

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [Slack招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223)チャネルで開発者に直接フィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でフィードバックを提供してください。

## 次は何ですか？

* Kotlin/Wasmのデバッグが実際に動作している様子をこの[YouTubeビデオ](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)で確認してください。
* `kotlin-wasm-examples`リポジトリのKotlin/Wasmの例を試してください。
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)

  ```