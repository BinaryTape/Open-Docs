---
title: "Kotlin/JS コードのデバッグ"
---
JavaScript のソースマップは、バンドラーまたはミニファイアーによって生成された圧縮コードと、開発者が作業する実際のソースコードとの間のマッピングを提供します。これにより、ソースマップは実行中のコードのデバッグをサポートできます。

Kotlin Multiplatform Gradle プラグインは、プロジェクトビルドのソースマップを自動的に生成するため、追加の構成なしで利用できます。

## ブラウザでデバッグする

最新のブラウザのほとんどは、ページコンテンツを検査し、その上で実行されるコードをデバッグできるツールを提供します。詳細については、ブラウザのドキュメントを参照してください。

ブラウザで Kotlin/JS をデバッグするには:

1. 使用可能な _run_ Gradle タスクのいずれか (たとえば、マルチプラットフォームプロジェクトの `browserDevelopmentRun` または `jsBrowserDevelopmentRun`) を呼び出して、プロジェクトを実行します。
   [Kotlin/JS の実行](running-kotlin-js#run-the-browser-target)の詳細をご覧ください。
2. ブラウザでページに移動し、その開発者ツールを起動します (たとえば、右クリックして **Inspect** アクションを選択します)。一般的なブラウザで[開発者ツールを見つける方法](https://balsamiq.com/support/faqs/browserconsole/)をご覧ください。
3. プログラムが情報をコンソールに記録している場合は、**Console** タブに移動してこの出力を確認します。ブラウザによっては、これらのログは Kotlin ソースファイルとそれらが発生した行を参照できます。

<img src="/img/devtools-console.png" alt="Chrome DevTools console" width="600" style={{verticalAlign: 'middle'}}/>

4. 右側のファイル参照をクリックして、対応するコード行に移動します。
   または、手動で **Sources** タブに切り替え、ファイルツリーで必要なファイルを見つけることもできます。Kotlin ファイルに移動すると、(圧縮された JavaScript とは対照的に) 通常の Kotlin コードが表示されます。

<img src="/img/devtools-sources.png" alt="Debugging in Chrome DevTools" width="600" style={{verticalAlign: 'middle'}}/>

これで、プログラムのデバッグを開始できます。行番号のいずれかをクリックして、ブレークポイントを設定します。
開発者ツールは、ステートメント内のブレークポイントの設定もサポートしています。通常の JavaScript コードと同様に、設定されたブレークポイントはページのリロード後も保持されます。これにより、スクリプトが最初にロードされたときに実行される Kotlin の `main()` メソッドをデバッグすることもできます。

## IDE でデバッグする

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) は、開発中にコードをデバッグするための強力なツールセットを提供します。

IntelliJ IDEA で Kotlin/JS をデバッグするには、**JavaScript Debug** 構成が必要です。このようなデバッグ構成を追加するには:

1. **Run | Edit Configurations** に移動します。
2. **+** をクリックして **JavaScript Debug** を選択します。
3. 構成の **Name** を指定し、プロジェクトが実行される **URL** (`http://localhost:8080` がデフォルト) を指定します。

<img src="/img/debug-config.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

4. 構成を保存します。

[JavaScript デバッグ構成の設定](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)の詳細をご覧ください。

これで、プロジェクトをデバッグする準備ができました。

1. 使用可能な _run_ Gradle タスクのいずれか (たとえば、マルチプラットフォームプロジェクトの `browserDevelopmentRun` または `jsBrowserDevelopmentRun`) を呼び出して、プロジェクトを実行します。
   [Kotlin/JS の実行](running-kotlin-js#run-the-browser-target)の詳細をご覧ください。
2. 以前に作成した JavaScript デバッグ構成を実行して、デバッグセッションを開始します。

<img src="/img/debug-config-run.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

3. IntelliJ IDEA の **Debug** ウィンドウで、プログラムのコンソール出力を確認できます。出力項目は、
   Kotlin ソースファイルとそれらが発生した行を参照します。

<img src="/img/ide-console-output.png" alt="JavaScript debug output in the IDE" width="700" style={{verticalAlign: 'middle'}}/>

4. 右側のファイル参照をクリックして、対応するコード行に移動します。

これで、IDE が提供するツール (ブレークポイント、ステップ実行、式の評価など) の完全なセットを使用して、プログラムのデバッグを開始できます。[IntelliJ IDEA でのデバッグ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)の詳細をご覧ください。

:::note
IntelliJ IDEA の現在の JavaScript デバッガの制限により、ブレークポイントで実行を停止させるには、JavaScript
デバッグを再実行する必要がある場合があります。

:::

## Node.js でデバッグする

プロジェクトが Node.js をターゲットにしている場合は、このランタイムでデバッグできます。

Node.js をターゲットとする Kotlin/JS アプリケーションをデバッグするには:

1. `build` Gradle タスクを実行して、プロジェクトをビルドします。
2. プロジェクトのディレクトリ内の `build/js/packages/your-module/kotlin/` ディレクトリで、Node.js の結果の `.js` ファイルを見つけます。
3. [Node.js デバッグガイド](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)の説明に従って、Node.js でデバッグします。

## 次は何ですか？

Kotlin/JS プロジェクトでデバッグセッションを開始する方法がわかったので、デバッグツールを効率的に使用する方法を学びましょう。

* [Google Chrome で JavaScript をデバッグする](https://developer.chrome.com/docs/devtools/javascript/)方法を学びましょう
* [IntelliJ IDEA JavaScript デバッガ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)に慣れてください
* [Node.js でデバッグする](https://nodejs.org/en/docs/guides/debugging-getting-started/)方法を学びましょう。

## 問題が発生した場合

Kotlin/JS のデバッグで問題が発生した場合は、課題追跡ツールである[YouTrack](https://kotl.in/issue)に報告してください。