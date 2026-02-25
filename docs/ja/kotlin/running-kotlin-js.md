[//]: # (title: Kotlin/JS の実行)

Kotlin/JS プロジェクトは Kotlin マルチプラットフォーム Gradle プラグインで管理されているため、適切なタスクを使用してプロジェクトを実行できます。空のプロジェクトから始める場合は、実行するためのサンプルコードがあることを確認してください。
`src/jsMain/kotlin/App.kt` ファイルを作成し、小さな "Hello, World" 形式のコードスニペットを記述します。

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

ターゲットプラットフォームによっては、コードを初めて実行するためにプラットフォーム固有の追加セットアップが必要になる場合があります。

## Node.js ターゲットの実行

Kotlin/JS で Node.js をターゲットにする場合、`jsNodeDevelopmentRun` Gradle タスクを実行するだけで済みます。これは、たとえば Gradle ラッパーを使用してコマンドラインから実行できます。

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEA を使用している場合は、Gradle ツールウィンドウで `jsNodeDevelopmentRun` アクションを見つけることができます。

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png){width=700}

初回起動時には、`kotlin.multiplatform` Gradle プラグインが、実行に必要なすべての依存関係をダウンロードします。
ビルドが完了するとプログラムが実行され、ターミナルにログ出力が表示されます。

![Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA](cli-output.png){width=700}

## ブラウザターゲットの実行

ブラウザをターゲットにする場合、プロジェクトに HTML ページが必要です。このページは、アプリケーションの開発中に開発サーバーによって提供され、コンパイルされた Kotlin/JS ファイルを埋め込む必要があります。
HTML ファイル `/src/jsMain/resources/index.html` を作成し、以下を記述します。

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

デフォルトでは、参照する必要があるプロジェクトの生成アーティファクト（webpack を通じて作成されます）の名前は、プロジェクト名になります（この場合は `js-tutorial`）。プロジェクトに `followAlong` という名前を付けた場合は、`js-tutorial.js` の代わりに `followAlong.js` を埋め込むようにしてください。

これらの調整を行った後、統合開発サーバーを起動します。これは Gradle ラッパーを介してコマンドラインから実行できます。

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEA で作業している場合は、Gradle ツールウィンドウで `jsBrowserDevelopmentRun` アクションを見つけることができます。

プロジェクトがビルドされると、組み込みの `webpack-dev-server` が実行を開始し、前に指定した HTML ファイルを指す（一見空の）ブラウザウィンドウが開きます。プログラムが正しく動作していることを確認するには、ブラウザのデベロッパーツールを開きます（たとえば、右クリックして *検証 (Inspect)* アクションを選択します）。
デベロッパーツールのコンソールに移動すると、実行された JavaScript コードの結果を確認できます。

![Console output in browser developer tools](browser-console-output.png){width=700}

このセットアップにより、コードを変更するたびにプロジェクトを再コンパイルして、変更を確認できます。Kotlin/JS は、開発中にアプリケーションを自動的に再ビルドする、より便利な方法もサポートしています。
この「継続モード (continuous mode)」の設定方法については、[対応するチュートリアル](dev-server-continuous-compilation.md)を確認してください。