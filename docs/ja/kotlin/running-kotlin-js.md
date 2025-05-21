---
title: "Kotlin/JS の実行"
---
Kotlin/JSプロジェクトはKotlin Multiplatform Gradle pluginで管理されているため、適切なタスクを使用してプロジェクトを実行できます。
空白のプロジェクトから始める場合は、実行するサンプルコードがあることを確認してください。
ファイル`src/jsMain/kotlin/App.kt`を作成し、小さな「Hello, World」タイプのコードスニペットを入力します。

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

ターゲットプラットフォームによっては、初めてコードを実行するためにプラットフォーム固有の追加のセットアップが必要になる場合があります。

## Node.jsターゲットの実行

Kotlin/JSでNode.jsをターゲットにする場合は、`jsNodeDevelopmentRun` Gradleタスクを実行するだけです。
これは、たとえば、Gradleラッパーを使用してコマンドラインから実行できます。

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEAを使用している場合は、Gradleツールウィンドウで`jsNodeDevelopmentRun`アクションを見つけることができます。

<img src="/img/run-gradle-task.png" alt="Gradle Run task in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

初回起動時に、`kotlin.multiplatform` Gradle pluginは、必要なすべての依存関係をダウンロードして、起動および実行できるようにします。
ビルドが完了すると、プログラムが実行され、ターミナルにログ出力が表示されます。

<img src="/img/cli-output.png" alt="Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

## ブラウザターゲットの実行

ブラウザをターゲットにする場合、プロジェクトにはHTMLページが必要です。
このページは、アプリケーションの開発中に開発サーバーによって提供され、コンパイルされたKotlin/JSファイルを埋め込む必要があります。
HTMLファイル`/src/jsMain/resources/index.html`を作成して入力します。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Client</title>
</head>
<body>
<script src="js-tutorial.js"></script>
</body>
</html>
```

デフォルトでは、参照する必要があるプロジェクトの生成されたアーティファクト（webpackを介して作成される）の名前は、プロジェクト名（この場合は`js-tutorial`）です。
プロジェクトに`followAlong`という名前を付けた場合は、`js-tutorial.js`の代わりに`followAlong.js`を埋め込むようにしてください。

これらの調整を行った後、統合開発サーバーを起動します。
これは、Gradleラッパーを介してコマンドラインから実行できます。

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEAから作業する場合は、Gradleツールウィンドウで`jsBrowserDevelopmentRun`アクションを見つけることができます。

プロジェクトがビルドされると、埋め込まれた`webpack-dev-server`が実行を開始し、（一見空の）ブラウザウィンドウを開き、以前に指定したHTMLファイルを指します。
プログラムが正しく実行されていることを確認するには、ブラウザの開発者ツールを開きます（たとえば、右クリックして「_Inspect_」アクションを選択します）。
開発者ツール内で、コンソールに移動すると、実行されたJavaScriptコードの結果が表示されます。

<img src="/img/browser-console-output.png" alt="Console output in browser developer tools" width="700" style={{verticalAlign: 'middle'}}/>

この設定を使用すると、コードを変更するたびにプロジェクトを再コンパイルして、変更を確認できます。
Kotlin/JSは、開発中にアプリケーションを自動的に再構築する、より便利な方法もサポートしています。
この「_continuous mode_」を設定する方法については、[対応するチュートリアル](dev-server-continuous-compilation)を確認してください。