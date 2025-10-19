[//]: # (title: Kotlinによるデータ分析)

データの探索と分析は、毎日行うことではないかもしれませんが、ソフトウェア開発者として必要な極めて重要なスキルです。

データ分析が鍵となるソフトウェア開発業務について考えてみましょう。デバッグ時にコレクションの内部構造を分析したり、メモリダンプやデータベースを掘り下げたり、REST APIと連携する際に大量のデータを含むJSONファイルを受信したりすることなどが挙げられます。

Kotlinの探索的データ分析（EDA）ツール、例えば[Kotlin notebooks](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe)、[Kandy](#kandy)を使用すると、分析スキルを向上させ、さまざまなシナリオに対応するための豊富な機能を利用できます。

*   **さまざまな形式のデータを読み込み、変換し、視覚化する:** Kotlin EDAツールを使用すると、データのフィルタリング、並べ替え、集計などのタスクを実行できます。これらのツールは、CSV、JSON、TXTなどのさまざまなファイル形式からIDE内でデータをシームレスに読み取ることができます。

    当社のプロットツールであるKandyは、データセットを視覚化し、洞察を得るための幅広い種類のチャートを作成できます。

*   **リレーショナルデータベースに保存されたデータを効率的に分析する:** Kotlin DataFrameはデータベースとシームレスに統合し、SQLクエリに似た機能を提供します。さまざまなデータベースからデータを直接取得、操作、視覚化できます。

*   **Web APIからリアルタイムおよび動的なデータセットを取得し、分析する:** EDAツールの柔軟性により、OpenAPIのようなプロトコルを介して外部APIとの統合が可能です。この機能は、Web APIからデータをフェッチし、必要に応じてデータをクリーンアップおよび変換するのに役立ちます。

Kotlinデータ分析ツールを試してみませんか？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" style="block"/></a>

Kotlinデータ分析ツールを使用すると、データの最初から最後までをスムーズに処理できます。Kotlin Notebookのシンプルなドラッグ＆ドロップ機能でデータを簡単に取得し、数行のコードでクリーンアップ、変換、視覚化できます。さらに、数回クリックするだけで出力チャートをエクスポートできます。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## Notebooks

_Notebook_ は、実行可能なKotlinコードと、テキスト、視覚化、結果を組み合わせて作成できるインタラクティブなドキュメントです。これを、コードをセルに整理し、Markdownでドキュメント化し、生成したコードの隣に（テキストからプロットまでの）出力を即座に表示する機能を備えたKotlin REPLの拡張版と考えてください。

Kotlinは、[Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore)、[Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)など、さまざまなノートブックソリューションを提供しており、データの取得、変換、探索、モデリングなどに便利な機能を提供します。これらのKotlinノートブックソリューションは、当社の[Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)に基づいています。

Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook間でコードをシームレスに共有できます。いずれかのKotlinノートブックでプロジェクトを作成し、互換性の問題を気にすることなく別のノートブックで作業を継続できます。

強力なKotlinノートブックの機能とKotlinでのコーディングの利点を活用してください。Kotlinはこれらのノートブックと統合されており、データ管理や同僚との発見の共有を支援し、データサイエンスと機械学習のスキルを向上させます。

さまざまなKotlinノートブックソリューションの機能を活用し、プロジェクトの要件に最適なものを選択してください。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md)は、IntelliJ IDEAのプラグインであり、Kotlinでノートブックを作成できます。一般的なIDEの機能をすべて備えたIDEエクスペリエンスを提供し、リアルタイムのコードインサイトとプロジェクト統合を実現します。

### DataloreでのKotlinノートブック

[Datalore](https://datalore.jetbrains.com/)を使用すると、追加のインストールなしでブラウザでKotlinをすぐに使用できます。ノートブックを共有してリモートで実行したり、他のKotlinノートブックとリアルタイムで共同作業したり、コード作成時にスマートなコーディング支援を受けたり、インタラクティブまたは静的なレポートを介して結果をエクスポートしたりすることもできます。

### Kotlin Kernelを備えたJupyter Notebook

[Jupyter Notebook](https://jupyter.org/)は、コード、視覚化、Markdownテキストを含むドキュメントを作成および共有できるオープンソースのWebアプリケーションです。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter)は、Jupyter環境内でKotlinの能力を活用するために、Jupyter NotebookにKotlinサポートをもたらすオープンソースプロジェクトです。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html)ライブラリは、Kotlinプロジェクトで構造化データを操作できます。データの作成とクリーンアップから、詳細な分析、特徴量エンジニアリングまで、このライブラリが対応します。

Kotlin DataFrameライブラリを使用すると、CSV、JSON、XLS、XLSXなど、さまざまなファイル形式を扱えます。このライブラリは、SQLデータベースやAPIに接続できる機能により、データ取得プロセスも容易にします。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html)は、さまざまな種類のチャートをプロットするための強力で柔軟なDSLを提供するオープンソースのKotlinライブラリです。このライブラリは、データを視覚化するためのシンプルで慣用的、読みやすく、型安全なツールです。

Kandyは、Kotlin Notebook、Datalore、Kotlin-Jupyter Notebookとシームレスに統合されています。KandyライブラリとKotlin DataFrameライブラリを組み合わせて、さまざまなデータ関連タスクを簡単に完了することもできます。

![Kandy](data-analysis-kandy-example.png){width=700}

## 次のステップ

*   [Kotlin Notebookを始める](get-started-with-kotlin-notebooks.md)
*   [Kotlin DataFrameライブラリを使用してデータを取得および変換する](data-analysis-work-with-data-sources.md)
*   [Kandyライブラリを使用してデータを視覚化する](data-analysis-visualization.md)
*   [データ分析のためのKotlinおよびJavaライブラリについて詳しく学ぶ](data-analysis-libraries.md)