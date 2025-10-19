[//]: # (title: Kotlin Notebook)

Kotlin Notebookは、Kotlinの機能を最大限に活用し、ノートブックを作成・編集するための対話型環境を提供します。
Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、このプラグインはIntelliJ IDEAに同梱されており、[デフォルトで有効化されています](kotlin-notebook-set-up-env.md)。

ノートブックとは、実行可能なKotlinコードと、テキスト、結果、ビジュアライゼーションを組み合わせて記述できるインタラクティブなドキュメントです。これは、コードをセルに整理し、Markdownでドキュメント化し、(テキストからプロットまで)出力を生成したコードと並べて即座に表示する機能が拡張されたKotlin REPLと考えることができます。

Kotlinコードの開発と実験、即時出力の受け取り、そしてIntelliJ IDEAエコシステム内でのコード、ビジュアル、テキストの統合を可能にする、シームレスなコーディング体験をご期待ください。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebookプラグインには、開発プロセスを加速させるための[様々な機能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)が備わっています。例えば、次のようなものです:

*   セル内でのAPIへのアクセス
*   数クリックでのファイルのインポートとエクスポート
*   REPLコマンドを使用した迅速なプロジェクト探索
*   豊富な出力形式の取得
*   アノテーションやGradleライクな構文を用いた直感的な依存関係管理
*   1行のコードでさまざまなライブラリをインポートしたり、プロジェクトに新しいライブラリを追加したりすること
*   エラーメッセージとトレースバックによるデバッグのための洞察の取得

Kotlin Notebookは、弊社の[Jupyter Notebooks向けKotlinカーネル](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)に基づいており、他の[Kotlin Notebookソリューション](data-analysis-overview.md#notebooks)との統合を容易にします。
互換性の問題なく、Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/)、[Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter)間で作業を簡単に共有できます。

これらの機能により、シンプルなコード実験から包括的なデータプロジェクトまで、幅広いタスクに着手できます。

Kotlin Notebookで何ができるかを発見するために、さらに詳しく掘り下げてみましょう！

<a href="get-started-with-kotlin-notebooks.md"><img src="notebook-get-started-button.svg" width="600" alt="Kotlin Notebookを始めましょう" style="block"/></a>

## データ分析と可視化

予備的なデータ探索を行う場合でも、エンドツーエンドのデータ分析プロジェクトを完了する場合でも、Kotlin Notebookには適切なツールが用意されています。

Kotlin Notebook内では、データの取得、変換、プロット、モデリングを可能にする[ライブラリ](data-analysis-libraries.md)を直感的に統合でき、操作の即時出力を得ることができます。

分析関連のタスクには、[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html)ライブラリが堅牢なソリューションを提供します。このライブラリは、構造化データの読み込み、作成、フィルタリング、およびクリーンアップを容易にします。

Kotlin DataFrameは、SQLデータベースとのシームレスな接続もサポートしており、CSV、JSON、TXTを含むさまざまなファイル形式からIDE内で直接データを読み込むことができます。

オープンソースのKotlinライブラリである[Kandy](https://kotlin.github.io/kandy/welcome.html)を使用すると、さまざまな種類のチャートを作成できます。
Kandyのイディオマティックで読みやすく、型安全な機能により、データを効果的に可視化し、貴重な洞察を得ることができます。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## プロトタイピング

Kotlin Notebookは、コードを小さなチャンクで実行し、結果をリアルタイムで確認するための対話型環境を提供します。この実践的なアプローチにより、プロトタイピング段階での迅速な実験と反復が可能になります。

Kotlin Notebookの助けを借りて、アイデア出しの初期段階でソリューションの概念をテストできます。さらに、Kotlin Notebookは共同作業と再現可能な作業の両方をサポートしており、新しいアイデアの生成と評価を可能にします。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## バックエンド開発

Kotlin Notebookは、セル内でAPIを呼び出したり、OpenAPIなどのプロトコルを扱ったりする機能を提供します。外部サービスやAPIと対話するその機能は、情報の取得やJSONファイルの直接読み込みなど、特定のバックエンド開発シナリオで役立ちます。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## コードのドキュメント化

Kotlin Notebookでは、コードセル内にインラインコメントやテキストアノテーションを含めることで、コードスニペットに関連する追加のコンテキスト、説明、および指示を提供できます。

また、Markdownセルにテキストを記述することもできます。Markdownセルは、ヘッダー、リスト、リンク、画像などの豊富な書式設定オプションをサポートしています。Markdownセルをレンダリングして書式設定されたテキストを表示するには、コードセルを実行するのと同じように実行するだけです。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## コードと出力の共有

Kotlin Notebookが汎用的なJupyterフォーマットに準拠しているため、異なるNotebook間でコードと出力を共有することが可能です。
[Jupyter Notebook](https://jupyter.org/)や[Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)など、任意のJupyterクライアントでKotlin Notebookを開き、編集し、実行できます。

また、`.ipynb` Notebookファイルを任意のNotebookウェブビューアーと共有することで、作業を配布することもできます。選択肢の1つは、このフォーマットをネイティブでレンダリングする[GitHub](https://github.com/)です。もう1つの選択肢は、スケジュールされたNotebookの実行のような高度な機能でNotebookの共有、実行、編集を容易にする[JetBrainsのDatalore](https://datalore.jetbrains.com/)プラットフォームです。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 次のステップ

*   [Kotlin Notebookの使用方法と主要機能について学ぶ。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [Kotlin Notebookを試す。](get-started-with-kotlin-notebooks.md)
*   [データ分析のためのKotlinを深く掘り下げる。](data-analysis-overview.md)