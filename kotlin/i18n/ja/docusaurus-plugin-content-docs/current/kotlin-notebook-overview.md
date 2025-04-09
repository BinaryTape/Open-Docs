---
title: "Kotlin Notebook"
---
[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)は、IntelliJ IDEA用の動的なプラグインで、Kotlinの能力を最大限に活用し、ノートブックを作成・編集するためのインタラクティブな環境を提供します。

:::note
Kotlin NotebookプラグインにはIntelliJ IDEA Ultimateが必要です。

:::

Kotlinコードの開発と実験、即時の出力の取得、コード、ビジュアル、テキストのIntelliJ IDEAエコシステム内での統合を可能にする、シームレスなコーディング体験をご体感ください。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebookプラグインには、開発プロセスを促進する[さまざまな機能](https://www.jetbrains.com/help/idea/kotlin-notebook.html)が搭載されています。

* セル内でのAPIへのアクセス
* 数回クリックするだけのファイルのインポートとエクスポート
* 素早いプロジェクト探索のためのREPLコマンドの使用
* 豊富な出力形式の取得
* アノテーションまたはGradleのような構文による直感的な依存関係の管理
* 単一行のコードによるさまざまなライブラリのインポート、またはプロジェクトへの新しいライブラリの追加
* エラーメッセージとトレースバックによるデバッグのためのインサイトの取得

Kotlin Notebookは、[Jupyter Notebooks用Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)をベースにしており、他の[Kotlinノートブックソリューション](data-analysis-overview#notebooks)との統合が容易です。
互換性の問題を気にすることなく、Kotlin Notebook、[Datalore](https://datalore.jetbrains.com/)、[Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter)間で作業を簡単に共有できます。

これらの機能により、単純なコード実験から包括的なデータプロジェクトまで、幅広いタスクに着手できます。

以下のセクションを詳しく調べて、Kotlin Notebookで何ができるかを発見してください！

## データ分析と可視化

予備的なデータ探索を行っている場合でも、エンドツーエンドのデータ分析プロジェクトを完了している場合でも、Kotlin Notebookには適切なツールが用意されています。

Kotlin Notebook内では、[ライブラリ](data-analysis-libraries)を直感的に統合して、データの取得、変換、プロット、モデル化を行いながら、操作の即時出力を得ることができます。

分析関連のタスクには、[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html)ライブラリが堅牢なソリューションを提供します。このライブラリは、構造化されたデータのロード、作成、フィルタリング、およびクリーニングを容易にします。

Kotlin DataFrameは、SQLデータベースとのシームレスな接続もサポートしており、CSV、JSON、TXTなどのさまざまなファイル形式からIDEで直接データを読み取ります。

[Kandy](https://kotlin.github.io/kandy/welcome.html)は、さまざまな種類のチャートを作成できるオープンソースのKotlinライブラリです。
Kandyの慣用的で読みやすく、タイプセーフな機能により、データを効果的に視覚化し、貴重な洞察を得ることができます。

<img src="/img/data-analysis-kandy-example.png" alt="data-analytics-and-visualization" width="700" style={{verticalAlign: 'middle'}}/>

## プロトタイピング

Kotlin Notebookは、コードを小さなチャンクで実行し、結果をリアルタイムで確認できるインタラクティブな環境を提供します。
この実践的なアプローチにより、プロトタイピング段階での迅速な実験と反復が可能になります。

Kotlin Notebookの助けを借りて、アイデア出しの初期段階でソリューションのコンセプトをテストできます。さらに、Kotlin Notebookは、共同作業と再現可能な作業の両方をサポートし、新しいアイデアの生成と評価を可能にします。

<img src="/img/kotlin-notebook-prototyping.png" alt="kotlin-notebook-prototyping" width="700" style={{verticalAlign: 'middle'}}/>

## バックエンド開発

Kotlin Notebookは、セル内でAPIを呼び出し、OpenAPIのようなプロトコルを操作する機能を提供します。外部サービスやAPIと対話する機能により、情報の取得やノートブック環境内でのJSONファイルの直接読み取りなど、特定のバックエンド開発シナリオで役立ちます。

<img src="/img/kotlin-notebook-backend-development.png" alt="kotlin-notebook-backend-development" width="700" style={{verticalAlign: 'middle'}}/>

## コードドキュメント

Kotlin Notebookでは、コードセル内にインラインコメントやテキストアノテーションを含めて、コードスニペットに関連する追加のコンテキスト、説明、および指示を提供できます。

ヘッダー、リスト、リンク、画像など、豊富なフォーマットオプションをサポートするMarkdownセルにテキストを記述することもできます。
Markdownセルをレンダリングしてフォーマットされたテキストを表示するには、コードセルと同様に実行するだけです。

<img src="/img/kotlin-notebook-documentation.png" alt="kotlin-notebook-documenting" width="700" style={{verticalAlign: 'middle'}}/>

## コードと出力の共有

Kotlin Notebookは、ユニバーサルJupyter形式に準拠しているため、コードと出力を異なるノートブック間で共有できます。
[Jupyter Notebook](https://jupyter.org/)や[Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)など、任意のJupyterクライアントでKotlin Notebookを開き、編集、実行できます。

`.ipynb`ノートブックファイルを任意のノートブックWebビューアと共有して、作業を配布することもできます。1つのオプションは[GitHub](https://github.com/)です。
この形式をネイティブにレンダリングします。もう1つのオプションは[JetBrain's Datalore](https://datalore.jetbrains.com/)プラットフォームです。
これは、スケジュールされたノートブックの実行などの高度な機能を備えたノートブックの共有、実行、および編集を容易にします。

<img src="/img/kotlin-notebook-sharing-datalore.png" alt="kotlin-notebook-sharing-datalore" width="700" style={{verticalAlign: 'middle'}}/>

## 次のステップ

* [Kotlin Notebookの使用法と主要な機能について学びます。](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [Kotlin Notebookを試してみてください。](get-started-with-kotlin-notebooks)
* [データ分析のためのKotlinについて深く掘り下げてください。](data-analysis-overview)