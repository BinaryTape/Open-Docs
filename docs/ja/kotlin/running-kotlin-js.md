[//]: # (title: Kotlin/JS の実行)

Kotlin/JS プロジェクトは Kotlin Multiplatform Gradle プラグインで管理されているため、適切なタスクを使用してプロジェクトを実行できます。
空のプロジェクトから開始する場合は、実行するためのサンプルコードがあることを確認してください。
`src/jsMain/kotlin/App.kt` ファイルを作成し、小さな「Hello, World」型のコードスニペットを入力してください。

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

ターゲットプラットフォームによっては、初めてコードを実行するためにプラットフォーム固有の追加セットアップが必要になる場合があります。

## Node.jsターゲットの実行

Kotlin/JS で Node.js をターゲットにする場合、`jsNodeDevelopmentRun` Gradle タスクを実行するだけで済みます。
これは、たとえば Gradle wrapper を使用してコマンドラインから実行できます。

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEA を使用している場合、`jsNodeDevelopmentRun` アクションは Gradle ツールウィンドウにあります。

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png){width=700}

最初の起動時に、`kotlin.multiplatform` Gradle プラグインが必要な依存関係をすべてダウンロードし、すぐに開始できるようにします。
ビルドが完了するとプログラムが実行され、ターミナルでログ出力が表示されます。

![Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA](cli-output.png){width=700}

## ブラウザターゲットの実行

ブラウザをターゲットにする場合、プロジェクトには HTML ページが必要です。
このページは、アプリケーションの作業中に開発サーバーによって提供され、コンパイルされた Kotlin/JS ファイルを埋め込む必要があります。
HTML ファイル `/src/jsMain/resources/index.html` を作成し、入力してください。

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

デフォルトでは、参照する必要があるプロジェクトの生成されたアーティファクト（webpack を介して作成されます）の名前は、プロジェクト名（この場合は `js-tutorial`）です。
プロジェクト名を `followAlong` とした場合、`js-tutorial.js` の代わりに `followAlong.js` を埋め込むようにしてください。

これらの調整を行った後、統合開発サーバーを起動します。これは、Gradle wrapper を介してコマンドラインから実行できます。

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEA から作業する場合、`jsBrowserDevelopmentRun` アクションは Gradle ツールウィンドウにあります。

プロジェクトがビルドされた後、組み込みの `webpack-dev-server` が起動し、以前に指定した HTML ファイルを指す（一見空の）ブラウザウィンドウが開きます。
プログラムが正しく実行されていることを検証するには、ブラウザの開発者ツールを開きます（たとえば、右クリックして _Inspect_ アクションを選択します）。
開発者ツール内でコンソールに移動すると、実行された JavaScript コードの結果が表示されます。

![Console output in browser developer tools](browser-console-output.png){width=700}

このセットアップを使用すると、コードを変更するたびにプロジェクトを再コンパイルして変更を確認できます。Kotlin/JS は、開発中にアプリケーションを自動的にリビルドするより便利な方法もサポートしています。
この _継続モード_ の設定方法については、[対応するチュートリアル](dev-server-continuous-compilation.md) を確認してください。