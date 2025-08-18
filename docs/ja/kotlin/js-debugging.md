[//]: # (title: Kotlin/JSコードのデバッグ)

JavaScriptソースマップは、バンドラーやミニファイアーによって生成された縮小化されたコードと、開発者が実際に作業するソースコードとの間のマッピングを提供します。これにより、ソースマップはコード実行中のデバッグをサポートします。

KotlinマルチプラットフォームGradleプラグインは、プロジェクトのビルド時に自動的にソースマップを生成し、追加の設定なしで利用できるようにします。

## ブラウザでのデバッグ

ほとんどの最新のブラウザには、ページコンテンツの検証や、その上で実行されるコードのデバッグを可能にするツールが備わっています。詳細については、お使いのブラウザのドキュメントを参照してください。

ブラウザでKotlin/JSをデバッグするには：

1.  利用可能な`run` Gradleタスクのいずれかを呼び出してプロジェクトを実行します。例えば、マルチプラットフォームプロジェクトでは`browserDevelopmentRun`や`jsBrowserDevelopmentRun`を使用します。
    [Kotlin/JSの実行](running-kotlin-js.md#run-the-browser-target)について詳しく学ぶ。
2.  ブラウザでページに移動し、開発者ツールを起動します（例えば、右クリックして**Inspect**アクションを選択します）。主要なブラウザで[開発者ツールを見つける方法](https://balsamiq.com/support/faqs/browserconsole/)について学ぶ。
3.  プログラムがコンソールに情報をログ出力している場合、**Console**タブに移動してこの出力を確認します。お使いのブラウザによっては、これらのログが参照元のKotlinソースファイルと行を示すことがあります。

![Chrome DevTools コンソール](devtools-console.png){width="600"}

4.  右側のファイル参照をクリックして、対応するコード行に移動します。
    あるいは、手動で**Sources**タブに切り替えて、ファイルツリーで必要なファイルを見つけることもできます。Kotlinファイルに移動すると、通常のKotlinコードが表示されます（縮小化されたJavaScriptではありません）。

![Chrome DevToolsでのデバッグ](devtools-sources.png){width="600"}

これでプログラムのデバッグを開始できます。行番号の1つをクリックしてブレークポイントを設定します。開発者ツールはステートメント内でのブレークポイント設定もサポートしています。通常のJavaScriptコードと同様に、設定されたブレークポイントはページのリロード後も維持されます。これにより、スクリプトが最初にロードされたときに実行されるKotlinの`main()`メソッドもデバッグできるようになります。

## IDEでのデバッグ

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)は、開発中にコードをデバッグするための強力なツールセットを提供します。

IntelliJ IDEAでKotlin/JSをデバッグするには、**JavaScript Debug**構成が必要です。このようなデバッグ構成を追加するには：

1.  **Run | Edit Configurations**に移動します。
2.  **+**をクリックし、**JavaScript Debug**を選択します。
3.  構成の**Name**を指定し、プロジェクトが実行される**URL**を提供します（デフォルトは`http://localhost:8080`です）。

![JavaScriptデバッグ構成](debug-config.png){width=700}

4.  構成を保存します。

[JavaScriptデバッグ構成の設定](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)について詳しく学ぶ。

これでプロジェクトのデバッグ準備が整いました！

1.  利用可能な`run` Gradleタスクのいずれかを呼び出してプロジェクトを実行します。例えば、マルチプラットフォームプロジェクトでは`browserDevelopmentRun`や`jsBrowserDevelopmentRun`を使用します。
    [Kotlin/JSの実行](running-kotlin-js.md#run-the-browser-target)について詳しく学ぶ。
2.  以前に作成したJavaScriptデバッグ構成を実行して、デバッグセッションを開始します。

![JavaScriptデバッグ構成の実行](debug-config-run.png){width=700}

3.  プログラムのコンソール出力は、IntelliJ IDEAの**Debug**ウィンドウで確認できます。出力項目は、Kotlinソースファイルとそれらが生成された行を参照します。

![IDEでのJavaScriptデバッグ出力](ide-console-output.png){width=700}

4.  右側のファイル参照をクリックして、対応するコード行に移動します。

これで、IDEが提供するブレークポイント、ステップ実行、式の評価など、ツール一式を使用してプログラムのデバッグを開始できます。[IntelliJ IDEAでのデバッグ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)について詳しく学ぶ。

> 現在のIntelliJ IDEAのJavaScriptデバッガーの制限により、ブレークポイントで実行を停止させるためにJavaScriptデバッグを再実行する必要がある場合があります。
>
{style="note"}

## Node.jsでのデバッグ

プロジェクトがNode.jsをターゲットとしている場合、このランタイムでデバッグできます。

Node.jsをターゲットとするKotlin/JSアプリケーションをデバッグするには：

1.  `build` Gradleタスクを実行してプロジェクトをビルドします。
2.  プロジェクトディレクトリ内の`build/js/packages/your-module/kotlin/`ディレクトリで、Node.js用の結果の`.js`ファイルを見つけます。
3.  [Node.jsデバッグガイド](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)に記載されているとおりにNode.jsでデバッグします。

## 次のステップ

Kotlin/JSプロジェクトでデバッグセッションを開始する方法を理解したところで、デバッグツールを効率的に利用する方法を学びましょう。

*   [Google ChromeでJavaScriptをデバッグする方法](https://developer.chrome.com/docs/devtools/javascript/)を学ぶ
*   [IntelliJ IDEA JavaScriptデバッガー](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)に慣れる
*   [Node.jsでデバッグする方法](https://nodejs.org/en/docs/guides/debugging-getting-started/)を学ぶ。

## 問題が発生した場合

Kotlin/JSのデバッグで何か問題に直面した場合は、問題トラッカーである[YouTrack](https://kotl.in/issue)に報告してください。