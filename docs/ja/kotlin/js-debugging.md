[//]: # (title: Kotlin/JS コードのデバッグ)

JavaScript ソースマップは、バンドラーやミニファイアー（コード圧縮ツール）によって生成された最小化（ミニファイ）済みコードと、開発者が実際に記述するソースコードとの間のマッピングを提供します。これにより、ソースマップを利用して実行中のコードをデバッグできるようになります。

Kotlin Multiplatform Gradle プラグインは、プロジェクトのビルド時にソースマップを自動的に生成するため、追加の設定なしで利用可能です。

## ブラウザでのデバッグ

ほとんどのモダンなブラウザには、ページの内容を検査し、そこで実行されるコードをデバッグするためのツールが備わっています。詳細については、お使いのブラウザのドキュメントを参照してください。

ブラウザで Kotlin/JS をデバッグするには：

1. 利用可能な Gradle の _run_ タスクのいずれかを呼び出して、プロジェクトを実行します。例えば、マルチプラットフォームプロジェクトの場合は `browserDevelopmentRun` や `jsBrowserDevelopmentRun` を使用します。
   詳細は [Kotlin/JS の実行](running-kotlin-js.md#run-the-browser-target) を参照してください。
2. ブラウザでページに移動し、デベロッパーツールを起動します（例：右クリックして **検証 (Inspect)** を選択）。主要なブラウザでの [デベロッパーツールの開き方](https://balsamiq.com/support/faqs/browserconsole/) を確認してください。
3. プログラムがコンソールに情報を出力している場合は、**コンソール (Console)** タブに切り替えて出力を確認します。ブラウザによっては、これらのログから出力元の Kotlin ソースファイルと行番号を参照できます。

![Chrome DevTools console](devtools-console.png){width="600"}

4. 右側のファイル参照をクリックすると、対応するコード行に移動できます。
   または、手動で **ソース (Sources)** タブに切り替え、ファイルツリーから必要なファイルを探すこともできます。Kotlin ファイルに移動すると、最小化された JavaScript ではなく、通常の Kotlin コードが表示されます。

![Debugging in Chrome DevTools](devtools-sources.png){width="600"}

これでプログラムのデバッグを開始できます。行番号のいずれかをクリックしてブレークポイントを設定します。
デベロッパーツールでは、ステートメント内へのブレークポイント設定もサポートされています。通常の JavaScript コードと同様に、設定したブレークポイントはページの再読み込み後も保持されます。これにより、スクリプトの初回ロード時に実行される Kotlin の `main()` メソッドをデバッグすることも可能です。

## IDE でのデバッグ

[IntelliJ IDEA](https://www.jetbrains.com/idea/) の Ultimate サブスクリプションは、開発中のコードをデバッグするための強力なツールセットを提供しています。

IntelliJ IDEA で Kotlin/JS をデバッグするには、**JavaScript Debug** 構成が必要です。デバッグ構成を追加するには：

1. **Run | Edit Configurations** に移動します。
2. **+** をクリックし、**JavaScript Debug** を選択します。
3. 構成の **Name**（名前）を指定し、プロジェクトが実行されている **URL**（デフォルトは `http://localhost:8080`）を入力します。

![JavaScript debug configuration](debug-config.png){width=700}

4. 構成を保存します。

[JavaScript デバッグ構成の設定](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html) についての詳細はこちらを参照してください。

これでプロジェクトをデバッグする準備が整いました。

1. 利用可能な Gradle の _run_ タスクのいずれかを呼び出して、プロジェクトを実行します。例えば、マルチプラットフォームプロジェクトの場合は `browserDevelopmentRun` や `jsBrowserDevelopmentRun` を使用します。
   詳細は [Kotlin/JS の実行](running-kotlin-js.md#run-the-browser-target) を参照してください。
2. 先ほど作成した JavaScript デバッグ構成を実行して、デバッグセッションを開始します。

![JavaScript debug configuration](debug-config-run.png){width=700}

3. IntelliJ IDEA の **Debug** ウィンドウで、プログラムのコンソール出力を確認できます。出力項目には、出力元の Kotlin ソースファイルと行番号への参照が含まれています。

![JavaScript debug output in the IDE](ide-console-output.png){width=700}

4. 右側のファイル参照をクリックして、対応するコード行に移動します。

これで、ブレークポイント、ステップ実行、式の評価など、IDE が提供するすべてのツールを使用してプログラムのデバッグを開始できます。[IntelliJ IDEA でのデバッグ](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html) についての詳細はこちらを参照してください。

> IntelliJ IDEA の現在の JavaScript デバッガーの制限により、ブレークポイントで実行を停止させるために JavaScript デバッグを再実行する必要がある場合があります。
>
{style="note"}

## Node.js でのデバッグ

プロジェクトが Node.js をターゲットにしている場合は、そのランタイムでデバッグできます。

Node.js をターゲットとする Kotlin/JS アプリケーションをデバッグするには：

1. `build` Gradle タスクを実行してプロジェクトをビルドします。
2. プロジェクトディレクトリ内の `build/js/packages/your-module/kotlin/` ディレクトリにある、Node.js 用の生成された `.js` ファイルを探します。
3. [Node.js デバッグガイド](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides) の説明に従って、Node.js でデバッグします。

## 次のステップ

Kotlin/JS プロジェクトでデバッグセッションを開始する方法を理解したら、デバッグツールをさらに活用する方法を学びましょう。

* [Google Chrome で JavaScript をデバッグする方法](https://developer.chrome.com/docs/devtools/javascript/) を学ぶ
* [IntelliJ IDEA JavaScript デバッガー](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html) に慣れる
* [Node.js でのデバッグ方法](https://nodejs.org/en/docs/guides/debugging-getting-started/) を学ぶ

## 問題が発生した場合

Kotlin/JS のデバッグに関して問題が発生した場合は、当社の課題トラッカーである [YouTrack](https://kotl.in/issue) へ報告してください。