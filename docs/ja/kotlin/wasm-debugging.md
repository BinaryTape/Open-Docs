[//]: # (title: Kotlin/Wasm コードのデバッグ)

<primary-label ref="beta"/> 

このチュートリアルでは、Kotlin/Wasm を使用して構築された [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) アプリケーションを、IntelliJ IDEA とブラウザを使用してデバッグする方法を説明します。

## 始める前に

1. [Kotlin マルチプラットフォーム開発のための環境を構築します](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment)。
2. 指示に従って、[Kotlin/Wasm をターゲットとする Kotlin マルチプラットフォームプロジェクトを作成します](wasm-get-started.md#create-a-project)。

> * IntelliJ IDEA での Kotlin/Wasm コードのデバッグは、IDE のバージョン 2025.3 以降で利用可能です。現在は [早期アクセスプログラム (EAP)](https://www.jetbrains.com/resources/eap/) で提供されており、今後安定版になる予定です。別のバージョンの IntelliJ IDEA で `WasmDemo` プロジェクトを作成した場合は、このチュートリアルを続行するために、バージョン 2025.3 に切り替えてプロジェクトを開いてください。
> * IntelliJ IDEA で Kotlin/Wasm コードをデバッグするには、JavaScript Debugger プラグインがインストールされている必要があります。[プラグインの詳細とインストール方法については、こちらを参照してください。](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## IntelliJ IDEA でのデバッグ

作成した Kotlin マルチプラットフォームプロジェクトには、Kotlin/Wasm で動作する Compose Multiplatform アプリケーションが含まれています。特別な設定を行うことなく、このアプリケーションを IntelliJ IDEA でデバッグできます。

1. IntelliJ IDEA で、デバッグする Kotlin ファイルを開きます。このチュートリアルでは、Kotlin マルチプラットフォームプロジェクトの以下のディレクトリにある `Greeting.kt` ファイルを使用します。

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 行番号をクリックして、調査したいコードにブレークポイントを設定します。

   ![ブレークポイントの設定](wasm-breakpoints-intellij.png){width=650}

3. 実行構成（run configurations）のリストから **composeApp[wasmJs]** を選択します。
4. 画面上部にあるデバッグアイコンをクリックして、デバッグモードでコードを実行します。

   ![デバッグモードで実行](wasm-debug-run-configurations.png){width=600}

   アプリケーションが起動すると、新しいブラウザウィンドウが開きます。

   ![ブラウザでの Compose アプリ](wasm-composeapp-browser.png){width=600}

   また、IntelliJ IDEA 内で **Debug** パネルが自動的に開きます。

   ![Compose アプリのデバッガー](wasm-debug-pane.png){width=600}

### アプリケーションの検査

> [ブラウザでデバッグ](#debug-in-your-browser)している場合も、アプリケーションの検査には同じ手順を使用できます。
>
{style="note"}

1. アプリケーションのブラウザウィンドウで、**Click me!** ボタンをクリックしてアプリケーションを操作します。このアクションによってコードの実行がトリガーされ、実行がブレークポイントに達するとデバッガーが一時停止します。

2. デバッグペインで、デバッグコントロールボタンを使用して、ブレークポイントでの変数やコードの実行を検査します：
    * ![ステップオーバー](wasm-debug-step-over.png){width=30}{type="joined"} ステップオーバー（Step over）：現在の行を実行し、次の行で停止します。
    * ![ステップイン](wasm-debug-step-into.png){width=30}{type="joined"} ステップイン（Step into）：関数内に入って詳細に調査します。
    * ![ステップアウト](wasm-debug-step-out.png){width=30}{type="joined"} ステップアウト（Step out）：現在の関数を抜けるまでコードを実行します。

3. **Threads & Variables** ペインを確認します。これは、関数呼び出しのシーケンスを追跡し、エラーの場所を特定するのに役立ちます。

   ![Threads & Variables の確認](wasm-debug-panes-intellij.png){width=700}

4. コードに変更を加え、アプリケーションを再度実行して、動作を確認します。
5. デバッグが完了したら、ブレークポイントのある行番号をクリックして、ブレークポイントを削除します。

## ブラウザでのデバッグ

特別な設定なしで、ブラウザ内でこの Compose Multiplatform アプリケーションをデバッグすることもできます。

開発用の Gradle タスク（`*DevRun`）を実行すると、Kotlin はソースファイルをブラウザに自動的に提供します。これにより、ブレークポイントの設定、変数の検査、および Kotlin コードのステップ実行が可能になります。

Kotlin/Wasm プロジェクトのソースをブラウザに提供するための設定は、現在 Kotlin Gradle プラグインに含まれています。以前にこの設定を `build.gradle.kts` ファイルに追加していた場合は、競合を避けるために削除する必要があります。

> このチュートリアルでは Chrome ブラウザを使用していますが、他のブラウザでもこれらの手順に従うことができるはずです。詳細については、[ブラウザのバージョン](wasm-configuration.md#browser-versions)を参照してください。
>
{style="tip"}

1. 指示に従って [Compose Multiplatform アプリケーションを実行します](wasm-get-started.md#run-the-application)。

2. アプリケーションのブラウザウィンドウで右クリックし、**検証（Inspect）** アクションを選択して開発者ツールにアクセスします。または、**F12** ショートカットを使用するか、**表示（View）** | **開発/管理（Developer）** | **デベロッパー ツール（Developer Tools）** を選択します。

3. **ソース（Sources）** タブに切り替え、デバッグする Kotlin ファイルを選択します。このチュートリアルでは、`Greeting.kt` ファイルを使用します。

4. 行番号をクリックして、調査したいコードにブレークポイントを設定します。数字が濃い行にのみブレークポイントを設定できます。この例では 4、7、8、9 行目です。

   ![ブレークポイントの設定](wasm-breakpoints-browser.png){width=700}

5. [IntelliJ IDEA でのデバッグ](#inspect-your-application)と同様に、アプリケーションを検査します。

    ブラウザでデバッグする場合、関数呼び出しのシーケンスを追跡し、エラーを特定するためのペインは、**スコープ（Scope）** と **コールスタック（Call Stack）** です。

   ![コールスタックの確認](wasm-debug-scope.png){width=450}

### カスタムフォーマッターの使用

カスタムフォーマッターを使用すると、ブラウザで Kotlin/Wasm コードをデバッグする際に、変数の値をよりユーザーフレンドリーで分かりやすい方法で表示・特定できます。

カスタムフォーマッターは Kotlin/Wasm の開発ビルドではデフォルトで有効になっていますが、ブラウザの開発者ツールでもカスタムフォーマッターが有効になっていることを確認する必要があります。

* Chrome のデベロッパーツールでは、**Settings | Preferences | Console** にある **Custom formatters** チェックボックスを見つけてオンにします：

  ![Chrome でカスタムフォーマッターを有効にする](wasm-custom-formatters-chrome.png){width=400}

* Firefox のデベロッパーツールでは、**Settings | Advanced settings** にある **Enable custom formatters** チェックボックスを見つけてオンにします：

  ![Firefox でカスタムフォーマッターを有効にする](wasm-custom-formatters-firefox.png){width=400}

この機能は [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html) を使用しており、Firefox および Chromium ベースのブラウザでサポートされています。

カスタムフォーマッターはデフォルトで Kotlin/Wasm の開発ビルド（development builds）に対してのみ機能するため、製品ビルド（production builds）でも使用したい場合は、Gradle 設定を調整する必要があります。`wasmJs {}` ブロックに以下のコンパイラオプションを追加してください。

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

## フィードバックの提供

デバッグ体験に関するフィードバックをお待ちしております！

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slack の招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) チャンネルで開発者に直接フィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) でフィードバックを提供してください。

## 次のステップ

* Kotlin/Wasm デバッグの実演については、こちらの [YouTube ビデオ](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s)（英語）をご覧ください。
* その他の Kotlin/Wasm の例を試してみてください：
  * [KotlinConf アプリケーション](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 画像ビューアー](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack アプリケーション](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js の例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI の例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose の例](https://github.com/Kotlin/kotlin-wasm-compose-template)