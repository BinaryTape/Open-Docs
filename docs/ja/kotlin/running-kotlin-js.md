[//]: # (title: Kotlin/JSを実行する)

Kotlin/JSプロジェクトはKotlin Multiplatform Gradleプラグインで管理されているため、適切なタスクを使用してプロジェクトを実行できます。空のプロジェクトから始める場合は、実行するサンプルコードを確実に用意してください。
`src/jsMain/kotlin/App.kt` ファイルを作成し、小さな「Hello, World」タイプのコードスニペットを記入してください。

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

ターゲットプラットフォームによっては、コードを初めて実行するためにプラットフォーム固有の追加設定が必要になる場合があります。

## Node.jsターゲットを実行する

Kotlin/JSでNode.jsをターゲットにする場合、`jsNodeDevelopmentRun` Gradleタスクを単に実行できます。これは例えば、Gradleラッパーを使用してコマンドラインから実行できます。

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEAを使用している場合、`jsNodeDevelopmentRun` アクションはGradleツールウィンドウで見つけることができます。

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png){width=700}

初回起動時に、`kotlin.multiplatform` Gradleプラグインは、実行を開始するために必要なすべての依存関係をダウンロードします。ビルドが完了すると、プログラムが実行され、ターミナルでロギング出力を確認できます。

![Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA](cli-output.png){width=700}

## ブラウザターゲットを実行する

ブラウザをターゲットにする場合、プロジェクトにはHTMLページが必要です。このページは、アプリケーションの作業中に開発サーバーによって提供され、コンパイルされたKotlin/JSファイルを埋め込む必要があります。
`/src/jsMain/resources/index.html` というHTMLファイルを作成し、記入してください。

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

デフォルトでは、参照する必要があるプロジェクトの生成された成果物(webpackを通じて作成される)の名前はプロジェクト名です(この場合、`js-tutorial`)。プロジェクトを`followAlong`という名前で作成した場合、`js-tutorial.js`の代わりに`followAlong.js`を埋め込むようにしてください。

これらの調整を行った後、統合開発サーバーを起動します。これは、Gradleラッパーを通じてコマンドラインから実行できます。

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEAから作業している場合、`jsBrowserDevelopmentRun` アクションはGradleツールウィンドウで見つけることができます。

プロジェクトがビルドされると、埋め込まれた`webpack-dev-server`が実行を開始し、以前に指定したHTMLファイルを指す(一見すると空の)ブラウザウィンドウが開きます。プログラムが正しく実行されていることを検証するには、ブラウザの開発者ツール(例えば右クリックして_Inspect_アクションを選択する)を開きます。
開発者ツール内で、コンソールに移動すると、実行されたJavaScriptコードの結果を確認できます。

![Console output in browser developer tools](browser-console-output.png){width=700}

この設定により、コード変更後にプロジェクトを再コンパイルして変更を確認できます。Kotlin/JSはまた、開発中にアプリケーションを自動的に再構築するより便利な方法もサポートしています。
この_継続モード_を設定する方法については、[対応するチュートリアル](dev-server-continuous-compilation.md)を確認してください。