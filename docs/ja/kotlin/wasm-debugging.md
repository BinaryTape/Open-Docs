[//]: # (title: Kotlin/Wasm コードのデバッグ)

<primary-label ref="beta"/> 

このチュートリアルでは、IntelliJ IDEA とブラウザを使用して、Kotlin/Wasm でビルドされた [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリケーションをデバッグする方法を説明します。

## 開始する前に

1. [Kotlin Multiplatform 開発環境をセットアップする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment)。
2. [Kotlin/Wasm をターゲットとする Kotlin Multiplatform プロジェクトを作成する](wasm-get-started.md#create-a-project)の手順に従ってください。

> * IntelliJ IDEA での Kotlin/Wasm コードのデバッグは、IDE のバージョン 2025.3 以降で利用可能であり、現在 [早期アクセスプログラム (EAP)](https://www.jetbrains.com/resources/eap/) で安定版への移行を進めています。
> 別のバージョンの IntelliJ IDEA で `WasmDemo` プロジェクトを作成した場合、このチュートリアルを続行するには、バージョン 2025.3 に切り替えてそこでプロジェクトを開いてください。
> * IntelliJ IDEA で Kotlin/Wasm コードをデバッグするには、JavaScript Debugger プラグインをインストールする必要があります。[プラグインとそのインストール方法に関する詳細情報をご覧ください。](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## IntelliJ IDEA でデバッグする

作成した Kotlin Multiplatform プロジェクトには、Kotlin/Wasm を利用した Compose Multiplatform アプリケーションが含まれています。
このアプリケーションは、IntelliJ IDEA で追加設定なしで、すぐにデバッグできます。

1. IntelliJ IDEA で、デバッグする Kotlin ファイルを開きます。このチュートリアルでは、Kotlin Multiplatform プロジェクトの以下のディレクトリにある `Greeting.kt` ファイルを扱います。

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 調べたいコードにブレークポイントを設定するには、行番号をクリックします。

   ![Set breakpoints](wasm-breakpoints-intellij.png){width=650}

3. 実行構成のリストで、**composeApp[wasmJs]** を選択します。
4. 画面上部のデバッグアイコンをクリックして、コードをデバッグモードで実行します。

   ![Run in debug mode](wasm-debug-run-configurations.png){width=600}

   アプリケーションが起動すると、新しいブラウザウィンドウで開きます。

   ![Compose app in browser](wasm-composeapp-browser.png){width=600}

   また、IntelliJ IDEA で **Debug** パネルが自動的に開きます。

   ![Compose app debugger](wasm-debug-pane.png){width=600}

### アプリケーションを検査する

> [ブラウザでデバッグ](#debug-in-your-browser)している場合も、アプリケーションを検査するために同じ手順を実行できます。
>
{style="note"}

1. アプリケーションのブラウザウィンドウで、**Click me!** ボタンをクリックしてアプリケーションを操作します。このアクションによりコードの実行がトリガーされ、実行がブレークポイントに到達するとデバッガが一時停止します。

2. デバッグペインで、デバッグコントロールボタンを使用してブレークポイントでの変数とコードの実行を検査します。
    * ![Step over](wasm-debug-step-over.png){width=30}{type="joined"} ステップオーバーして、現在の行を実行し、次の行で一時停止します。
    * ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} ステップインして、関数をさらに深く調査します。
    * ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} ステップアウトして、現在の関数を終了するまでコードを実行します。

3. **Threads & Variables** ペインを確認します。これは、関数呼び出しのシーケンスをトレースし、エラーの場所を特定するのに役立ちます。

   ![Check Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4. コードを変更し、アプリケーションを再度実行して、すべてが期待どおりに機能することを確認します。
5. デバッグが完了したら、ブレークポイントのある行番号をクリックしてブレークポイントを削除します。

## ブラウザでデバッグする

この Compose Multiplatform アプリケーションは、追加設定なしでブラウザでデバッグすることもできます。

開発用の Gradle タスク (`*DevRun`) を実行すると、Kotlin は自動的にソースファイルをブラウザに提供し、ブレークポイントの設定、変数の検査、Kotlin コードのステップ実行を可能にします。

ブラウザで Kotlin/Wasm プロジェクトのソースを提供するための設定は、Kotlin Gradle プラグインにすでに含まれています。
以前にこの設定を `build.gradle.kts` ファイルに追加していた場合は、競合を避けるために削除する必要があります。

> このチュートリアルでは Chrome ブラウザを使用していますが、他のブラウザでもこれらの手順を実行できるはずです。詳細については、[ブラウザのバージョン](wasm-configuration.md#browser-versions)を参照してください。
>
{style="tip"}

1. [Compose Multiplatform アプリケーションを実行する](wasm-get-started.md#run-the-application)の手順に従ってください。

2. アプリケーションのブラウザウィンドウで右クリックし、**Inspect** アクションを選択して開発者ツールにアクセスします。
   あるいは、**F12** ショートカットを使用するか、**View** | **Developer** | **Developer Tools** を選択することもできます。

3. **Sources** タブに切り替え、デバッグする Kotlin ファイルを選択します。このチュートリアルでは、`Greeting.kt` ファイルを扱います。

4. 調べたいコードにブレークポイントを設定するには、行番号をクリックします。ブレークポイントを設定できるのは、数字が濃い色の行のみです。この例では、4、7、8、9 行目です。

   ![Set breakpoints](wasm-breakpoints-browser.png){width=700}

5. [IntelliJ IDEA でのデバッグ](#inspect-your-application)と同様に、アプリケーションを検査します。

    ブラウザでデバッグする際、関数呼び出しのシーケンスをトレースし、エラーの場所を特定するためのペインは、**Scope** と **Call Stack** です。

   ![Check the call stack](wasm-debug-scope.png){width=450}

### カスタムフォーマッタを使用する

カスタムフォーマッタは、ブラウザで Kotlin/Wasm コードをデバッグする際に、変数値をよりユーザーフレンドリーで分かりやすい方法で表示し、特定するのに役立ちます。

カスタムフォーマッタは Kotlin/Wasm 開発ビルドでデフォルトで有効になっていますが、
ブラウザの開発者ツールでカスタムフォーマッタが有効になっていることを確認する必要があります。

* Chrome DevTools では、**Settings | Preferences | Console** でカスタムフォーマッタのチェックボックスを見つけます。

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* Firefox DevTools では、**Settings | Advanced settings** で **Enable custom formatters** (カスタムフォーマッタを有効にする) のチェックボックスを見つけます。

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

この機能は、[カスタムフォーマッタ API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html) を使用しているため、Firefox および Chromium ベースのブラウザでサポートされています。

カスタムフォーマッタは Kotlin/Wasm 開発ビルドでのみデフォルトで機能するため、
本番ビルドでこれらを使用したい場合は、Gradle 設定を調整する必要があります。
`wasmJs {}` ブロックに以下のコンパイラオプションを追加します。

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

## フィードバックを残す

デバッグ体験に関するフィードバックをいただければ幸いです！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack の招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、直接開発者に [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルでフィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) でフィードバックを提供してください。

## 次のステップ

* この [YouTube ビデオ](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s) で Kotlin/Wasm のデバッグの実際の様子をご覧ください。
* その他の Kotlin/Wasm の例を試してみてください。
  * [KotlinConf application](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI example](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)