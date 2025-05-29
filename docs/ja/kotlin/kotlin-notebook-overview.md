[//]: # (title: Kotlin Notebook)

Kotlin Notebookは、Kotlinの持つ可能性を最大限に活用し、ノートブックを作成・編集するための対話型環境を提供します。

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。このプラグインはIntelliJ IDEAにバンドルされ、[デフォルトで有効化されています](kotlin-notebook-set-up-env.md)。

IntelliJ IDEAのエコシステム内でKotlinコードを開発・実験し、即時出力を受け取り、コード、ビジュアル、テキストを統合できる、シームレスなコーディング体験を準備しましょう。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebookプラグインには、開発プロセスを加速させるための[様々な機能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)が付属しています。例えば、以下のような機能です:

*   セル内でのAPIアクセス
*   数回のクリックでのファイルのインポートとエクスポート
*   素早いプロジェクト探索のためのREPLコマンドの使用
*   豊富な出力形式の取得
*   アノテーションまたはGradleライクな構文による直感的な依存関係の管理
*   1行のコードで様々なライブラリをインポートしたり、プロジェクトに新しいライブラリを追加したり
*   エラーメッセージとトレースバックによるデバッグのための洞察の取得

Kotlin Notebookは、当社の[Kotlin Kernel for Jupyter Notebooks](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)をベースとしており、他の[Kotlinノートブックソリューション](data-analysis-overview.md#notebooks)との統合を容易にします。互換性の問題なく、Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/)、および[Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter)間で作業を簡単に共有できます。

これらの機能により、シンプルなコードの実験から包括的なデータプロジェクトまで、広範囲のタスクに着手できます。

Kotlin Notebookで何ができるかを発見するために、以下のセクションを詳しく掘り下げてみましょう！

## データ分析と可視化

予備的なデータ探索を行う場合でも、エンドツーエンドのデータ分析プロジェクトを完了する場合でも、Kotlin Notebookには適切なツールが用意されています。

Kotlin Notebook内では、操作の即時出力を得ながら、データを取得、変換、プロット、モデル化できる[ライブラリ](data-analysis-libraries.md)を直感的に統合できます。

分析関連のタスクには、[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html)ライブラリが堅牢なソリューションを提供します。このライブラリは、構造化データの読み込み、作成、フィルタリング、クリーニングを容易にします。

Kotlin DataFrameは、SQLデータベースとのシームレスな接続もサポートしており、CSV、JSON、TXTを含むさまざまなファイル形式からIDE内で直接データを読み込みます。

オープンソースのKotlinライブラリである[Kandy](https://kotlin.github.io/kandy/welcome.html)を使用すると、さまざまな種類のチャートを作成できます。Kandyのイディオマティックで読みやすく、型安全な機能により、データを効果的に可視化し、貴重な洞察を得ることができます。

![data-analytics-and-visualization](data-analysis-kandy-example.png){width=700}

## プロトタイピング

Kotlin Notebookは、コードを小さな塊で実行し、リアルタイムで結果を確認するための対話型環境を提供します。この実践的なアプローチにより、プロトタイピングフェーズにおける迅速な実験と反復が可能になります。

Kotlin Notebookの助けを借りて、アイデア出しの初期段階でソリューションの概念をテストできます。さらに、Kotlin Notebookは共同作業と再現性のある作業の両方をサポートし、新しいアイデアの生成と評価を可能にします。

![kotlin-notebook-prototyping](kotlin-notebook-prototyping.png){width=700}

## バックエンド開発

Kotlin Notebookは、セル内でAPIを呼び出し、OpenAPIのようなプロトコルを扱う能力を提供します。外部サービスやAPIと対話するその能力は、ノートブック環境内で直接情報を取得したり、JSONファイルを読み込んだりするような、特定のバックエンド開発シナリオに役立ちます。

![kotlin-notebook-backend-development](kotlin-notebook-backend-development.png){width=700}

## コードドキュメント

Kotlin Notebookでは、コードスニペットに関連する追加のコンテキスト、説明、指示を提供するために、コードセル内にインラインコメントやテキスト注釈を含めることができます。

また、Markdownセルにテキストを記述することもできます。Markdownセルは、ヘッダー、リスト、リンク、画像など、豊富な書式設定オプションをサポートしています。Markdownセルをレンダリングしてフォーマットされたテキストを確認するには、コードセルと同様に実行するだけです。

![kotlin-notebook-documenting](kotlin-notebook-documentation.png){width=700}

## コードと出力の共有

Kotlin NotebookがユニバーサルなJupyter形式に準拠しているため、異なるノートブック間でコードと出力を共有できます。任意のJupyterクライアント（[Jupyter Notebook](https://jupyter.org/)や[Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)など）でKotlin Notebookを開き、編集し、実行できます。

また、`.ipynb`ノートブックファイルを任意のノートブックWebビューアと共有することで、作業を配布することもできます。選択肢の一つは、この形式をネイティブでレンダリングする[GitHub](https://github.com/)です。もう一つの選択肢は、スケジュールされたノートブック実行のような高度な機能で、ノートブックの共有、実行、編集を容易にする[JetBrainのDatalore](https://datalore.jetbrains.com/)プラットフォームです。

![kotlin-notebook-sharing-datalore](kotlin-notebook-sharing-datalore.png){width=700}

## 次のステップ

*   [Kotlin Notebookの使用法と主要な機能について学ぶ。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [Kotlin Notebookを試す。](get-started-with-kotlin-notebooks.md)
*   [データ分析のためのKotlinを深く掘り下げる。](data-analysis-overview.md)