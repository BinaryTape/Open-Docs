[//]: # (title: Kotlin/JSコードをデバッグする)

JavaScriptソースマップは、バンドラーやミニファイアによって生成された圧縮されたコードと、開発者が作業する実際のソースコードとの間のマッピングを提供します。これにより、ソースマップはコード実行中のデバッグを可能にします。

Kotlin Multiplatform Gradleプラグインは、プロジェクトのビルド用にソースマップを自動的に生成し、追加の設定なしで利用できるようにします。

## ブラウザでのデバッグ

ほとんどのモダンブラウザには、ページコンテンツの検証と、その上で実行されるコードのデバッグを可能にするツールが備わっています。詳細については、ブラウザのドキュメントを参照してください。

ブラウザでKotlin/JSをデバッグするには：

1.  利用可能な_run_ Gradleタスクのいずれかを呼び出してプロジェクトを実行します。例えば、マルチプラットフォームプロジェクトでは`browserDevelopmentRun`または`jsBrowserDevelopmentRun`です。
    [Kotlin/JSの実行](running-kotlin-js.md#run-the-browser-target)について詳しく学ぶ。
2.  ブラウザでページに移動し、開発者ツールを起動します（例えば、右クリックして**検証 (Inspect)** アクションを選択します）。主要なブラウザで[開発者ツールの見つけ方](https://balsamiq.com/support/faqs/browserconsole/)について学ぶ。
3.  プログラムがコンソールに情報をログ出力している場合、**Console**タブに移動してこの出力を確認します。ブラウザによっては、これらのログは、元のKotlinソースファイルと行を参照できます：

![Chrome DevTools コンソール](devtools-console.png){width="600"}

4.  右側にあるファイル参照をクリックして、対応するコード行に移動します。
    あるいは、手動で**Sources**タブに切り替え、ファイルツリーで必要なファイルを見つけることもできます。Kotlinファイルに移動すると、通常のKotlinコード（圧縮されたJavaScriptとは対照的に）が表示されます：

![Chrome DevTools でのデバッグ](devtools-sources.png){width="600"}

これでプログラムのデバッグを開始できます。行番号のいずれかをクリックしてブレークポイントを設定します。開発者ツールはステートメント内でのブレークポイント設定もサポートしています。通常のJavaScriptコードと同様に、設定されたブレークポイントはページのリロード後も保持されます。これにより、スクリプトが初めてロードされたときに実行されるKotlinの`main()`メソッドをデバッグすることも可能になります。

## IDEでのデバッグ

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)は、開発中のコードのデバッグに強力なツールセットを提供します。

IntelliJ IDEAでKotlin/JSをデバッグするには、**JavaScript Debug**設定が必要です。このデバッグ設定を追加するには：

1.  **Run | Edit Configurations**に移動します。
2.  **+** をクリックし、**JavaScript Debug**を選択します。
3.  設定の**Name**を指定し、プロジェクトが実行される**URL**（デフォルトでは`http://localhost:8080`）を提供します。

![JavaScriptデバッグ設定](debug-config.png){width=700}

4.  設定を保存します。

[JavaScriptデバッグ設定のセットアップ](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)について詳しく学ぶ。

これでプロジェクトをデバッグする準備ができました！

1.  利用可能な_run_ Gradleタスクのいずれかを呼び出してプロジェクトを実行します。例えば、マルチプラットフォームプロジェクトでは`browserDevelopmentRun`または`jsBrowserDevelopmentRun`です。
    [Kotlin/JSの実行](running-kotlin-js.md#run-the-browser-target)について詳しく学ぶ。
2.  以前に作成したJavaScriptデバッグ設定を実行して、デバッグセッションを開始します：

![JavaScriptデバッグ設定](debug-config-run.png){width=700}

3.  プログラムのコンソール出力は、IntelliJ IDEAの**Debug**ウィンドウで確認できます。出力項目は、元のKotlinソースファイルと行を参照しています：

![IDEでのJavaScriptデバッグ出力](ide-console-output.png){width=700}

4.  右側にあるファイル参照をクリックして、対応するコード行に移動します。

これで、IDEが提供するツールセット全体（ブレークポイント、ステップ実行、式評価など）を使用してプログラムのデバッグを開始できます。[IntelliJ IDEAでのデバッグ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)について詳しく学ぶ。

> IntelliJ IDEAの現在のJavaScriptデバッガーの制限により、実行をブレークポイントで停止させるためにJavaScriptデバッグを再実行する必要がある場合があります。
>
{style="note"}

## Node.jsでのデバッグ

プロジェクトがNode.jsをターゲットとしている場合、このランタイムでデバッグできます。

Node.jsをターゲットとするKotlin/JSアプリケーションをデバッグするには：

1.  `build` Gradleタスクを実行してプロジェクトをビルドします。
2.  プロジェクトディレクトリ内の`build/js/packages/your-module/kotlin/`ディレクトリで、結果のNode.js用`.js`ファイルを見つけます。
3.  [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)に記載されているように、Node.jsでデバッグします。

## 次のステップ

Kotlin/JSプロジェクトでデバッグセッションを開始する方法を学んだので、デバッグツールを効率的に活用する方法を学びましょう：

*   [Google ChromeでJavaScriptをデバッグする方法](https://developer.chrome.com/docs/devtools/javascript/)を学ぶ
*   [IntelliJ IDEA JavaScriptデバッガー](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)に慣れる
*   [Node.jsでデバッグする方法](https://nodejs.org/en/docs/guides/debugging-getting-started/)を学ぶ。

## 問題が発生した場合

Kotlin/JSのデバッグで何か問題が発生した場合は、私たちの課題トラッカーである[YouTrack](https://kotl.in/issue)に報告してください。