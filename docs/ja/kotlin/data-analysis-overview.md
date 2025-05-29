[//]: # (title: データ分析のためのKotlin)

データの探索と分析は、毎日行うことではないかもしれませんが、ソフトウェア開発者として必要な重要なスキルです。

データ分析が鍵となるソフトウェア開発の業務について考えてみましょう。例えば、デバッグ時にコレクションの実際の内容を分析する、メモリダンプやデータベースを深く調査する、REST APIを扱う際に大量のデータを含むJSONファイルを受け取る、といったことが挙げられます。

Kotlinの探索的データ分析（EDA）ツール、例えば[Kotlinノートブック](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe)、[Kandy](#kandy)などを使用することで、分析スキルを向上させ、さまざまなシナリオで役立つ豊富な機能群を利用できます。

*   **さまざまな形式のデータをロード、変換、可視化する:** Kotlin EDAツールを使用すると、データのフィルタリング、ソート、集計などのタスクを実行できます。これらのツールは、IDE内でCSV、JSON、TXTなどのさまざまなファイル形式からデータをシームレスに読み込むことができます。

    当社のプロットツールであるKandyは、データセットを可視化し、洞察を得るために幅広い種類のグラフを作成することを可能にします。

*   **リレーショナルデータベースに保存されたデータを効率的に分析する:** Kotlin DataFrameはデータベースとシームレスに統合し、SQLクエリに似た機能を提供します。さまざまなデータベースからデータを直接取得、操作、可視化できます。

*   **Web APIからリアルタイムおよび動的なデータセットを取得し分析する:** EDAツールの柔軟性により、OpenAPIなどのプロトコルを介して外部APIとの統合が可能です。この機能は、Web APIからデータを取得し、必要に応じてデータをクリーニングおよび変換するのに役立ちます。

Kotlinのデータ分析ツールを試してみませんか？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" style="block"/></a>

当社のKotlinデータ分析ツールを使用すると、データの最初から最後までスムーズに処理できます。Kotlin Notebookのシンプルなドラッグ＆ドロップ機能で簡単にデータを取得し、数行のコードでクリーニング、変換、可視化できます。さらに、出力グラフは数クリックでエクスポートできます。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## ノートブック

_ノートブック_ は、コード、グラフィック、テキストを単一の環境に統合するインタラクティブなエディターです。ノートブックを使用すると、コードセルを実行し、即座に出力を確認できます。

Kotlinは、[Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore)、[Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)など、さまざまなノートブックソリューションを提供しており、データ取得、変換、探索、モデリングなどに便利な機能を提供します。これらのKotlinノートブックソリューションは、当社の[Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)に基づいています。

Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook間でコードをシームレスに共有できます。いずれかのKotlinノートブックでプロジェクトを作成し、互換性の問題なく別のノートブックで作業を継続できます。

強力なKotlinノートブックの機能と、Kotlinでのコーディングの利点を活用してください。Kotlinはこれらのノートブックと統合し、データ管理を支援し、データサイエンスと機械学習のスキルを向上させながら同僚と知見を共有できるようにします。

さまざまなKotlinノートブックソリューションの機能を探索し、プロジェクトの要件に最も合致するものを選んでください。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md)は、IntelliJ IDEAのプラグインであり、Kotlinでノートブックを作成できます。一般的なIDE機能すべてを備えたIDE体験を提供し、リアルタイムのコードインサイトとプロジェクト統合を可能にします。

### DataloreでのKotlinノートブック

[Datalore](https://datalore.jetbrains.com/)を使用すると、追加のインストールなしで、ブラウザですぐにKotlinを利用できます。ノートブックを共有してリモートで実行したり、他のKotlinノートブックとリアルタイムで共同作業したり、コード作成時にスマートなコーディング支援を受けたり、インタラクティブまたは静的なレポートを通じて結果をエクスポートしたりすることもできます。

### Kotlin Kernelを備えたJupyter Notebook

[Jupyter Notebook](https://jupyter.org/)は、コード、可視化、Markdownテキストを含むドキュメントを作成および共有できるオープンソースのウェブアプリケーションです。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter)は、Jupyter環境内でKotlinのパワーを活用するために、Jupyter NotebookにKotlinサポートをもたらすオープンソースプロジェクトです。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html)ライブラリは、Kotlinプロジェクトで構造化データを操作することを可能にします。データ作成とクリーニングから、詳細な分析、特徴量エンジニアリングに至るまで、このライブラリが対応します。

Kotlin DataFrameライブラリを使用すると、CSV、JSON、XLS、XLSXなど、さまざまなファイル形式を扱うことができます。このライブラリは、SQLデータベースやAPIに接続する機能を備えており、データ取得プロセスも容易にします。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html)は、さまざまな種類のグラフをプロットするための強力で柔軟なDSLを提供するオープンソースのKotlinライブラリです。このライブラリは、データを可視化するためのシンプルでイディオマティック、読みやすく、型安全なツールです。

Kandyは、Kotlin Notebook、Datalore、Kotlin-Jupyter Notebookとシームレスに統合されています。また、KandyライブラリとKotlin DataFrameライブラリを簡単に組み合わせて、さまざまなデータ関連タスクを完了することもできます。

![Kandy](data-analysis-kandy-example.png){width=700}

## 次のステップ

*   [Kotlin Notebookを始める](get-started-with-kotlin-notebooks.md)
*   [Kotlin DataFrameライブラリを使用してデータを取得および変換する](data-analysis-work-with-data-sources.md)
*   [Kandyライブラリを使用してデータを可視化する](data-analysis-visualization.md)
*   [データ分析のためのKotlinおよびJavaライブラリについてさらに学ぶ](data-analysis-libraries.md)