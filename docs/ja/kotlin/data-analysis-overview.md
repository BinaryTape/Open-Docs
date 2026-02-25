[//]: # (title: データ分析のための Kotlin)

データの探索や分析は、毎日行うことではないかもしれませんが、ソフトウェア開発者として必要な極めて重要なスキルです。

データ分析が鍵となるソフトウェア開発の業務について考えてみましょう。デバッグ時にコレクションの中身を分析したり、メモリダンプやデータベースを徹底的に調査したり、REST API を使用する際に大量のデータを含む JSON ファイルを受け取ったりする場合などが挙げられます。

[Kotlin Notebook](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe)、[Kandy](#kandy) といった Kotlin の探索的データ解析（EDA: Exploratory Data Analysis）ツールを使用することで、分析スキルを向上させ、さまざまなシナリオで役立つ豊富な機能を利用できます。

* **さまざまな形式のデータの読み込み、変換、視覚化:** Kotlin EDA ツールを使用すると、データのフィルタリング、ソート、集計などのタスクを実行できます。これらのツールは、CSV、JSON、TXT など、さまざまなファイル形式のデータを IDE 内でシームレスに読み取ることができます。

    プロットツールの Kandy を使用すると、幅広い種類のチャートを作成して、データセットを視覚化し、インサイトを得ることができます。

* **リレーショナルデータベースに保存されたデータの効率的な分析:** Kotlin DataFrame はデータベースとシームレスに統合され、SQL クエリと同様の機能を提供します。さまざまなデータベースから直接データを取得、操作、視覚化できます。

* **Web API からのリアルタイムおよび動的なデータセットの取得と分析:** EDA ツールの柔軟性により、OpenAPI などのプロトコルを介して外部 API と統合できます。この機能により、Web API からデータを取得し、必要に応じてデータをクリーニングおよび変換できます。

Kotlin のデータ分析ツールを試してみませんか？

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" style="block"/></a>

Kotlin のデータ分析ツールを使用すると、データの取り扱いを一貫してスムーズに行うことができます。Kotlin Notebook のシンプルなドラッグ＆ドロップ機能で、データを簡単に取得できます。わずか数行のコードで、データのクリーニング、変換、視覚化が可能です。さらに、数回のクリックで出力したチャートをエクスポートできます。

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## ノートブック (Notebooks)

ノートブックとは、実行可能な Kotlin コードと、テキスト、視覚化、結果を混在させることができるインタラクティブなドキュメントです。これは、コードをセルに整理し、Markdown でドキュメント化し、出力を生成したコードのすぐ隣に表示（テキストからプロットまで）できるように拡張された Kotlin REPL と考えることができます。

Kotlin は、[Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore)、[Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel) など、データの取得、変換、探索、モデリングなどに便利な機能を提供するさまざまなノートブックソリューションを提供しています。これらの Kotlin ノートブックソリューションは、[Kotlin カーネル (Kotlin Kernel)](https://github.com/Kotlin/kotlin-jupyter) に基づいています。

Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook の間でコードをシームレスに共有できます。いずれかの Kotlin ノートブックでプロジェクトを作成し、互換性の問題を心配することなく別のノートブックで作業を続けることができます。

強力な Kotlin ノートブックの機能と、Kotlin でコーディングするメリットを活用してください。Kotlin はこれらのノートブックと統合されており、データサイエンスや機械学習のスキルを高めながら、データを管理し、発見したことを同僚と共有するのに役立ちます。

さまざまな Kotlin ノートブックソリューションの機能を確認し、プロジェクトの要件に最も適したものを選んでください。

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md) は、Kotlin でノートブックを作成できるようにする IntelliJ IDEA 用のプラグインです。一般的なすべての IDE 機能を含む IDE 体験を提供し、リアルタイムのコードインサイトやプロジェクト統合を実現します。

### Datalore における Kotlin ノートブック

[Datalore](https://datalore.jetbrains.com/) を使用すると、追加のインストールなしで、ブラウザですぐに Kotlin を使用できます。また、ノートブックを共有してリモートで実行したり、他の Kotlin ノートブックとリアルタイムで共同作業したり、コードを書く際にスマートなコーディング支援を受けたり、インタラクティブまたは静的なレポートを通じて結果をエクスポートしたりすることもできます。

### Kotlin カーネルを使用した Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/) は、コード、視覚化、Markdown テキストを含むドキュメントを作成および共有できるオープンソースの Web アプリケーションです。[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) は、Jupyter 環境内で Kotlin のパワーを活用できるように、Jupyter Notebook に Kotlin サポートをもたらすオープンソースプロジェクトです。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) ライブラリを使用すると、Kotlin プロジェクトで構造化データを操作できます。データの作成やクリーニングから、詳細な分析や特徴量エンジニアリングまで、このライブラリがカバーします。

Kotlin DataFrame ライブラリを使用すると、CSV、JSON、XLS、XLSX を含むさまざまなファイル形式を扱うことができます。また、このライブラリは SQL データベースや API と接続する機能も備えており、データ取得プロセスを容易にします。

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) は、さまざまな種類のチャートをプロットするための強力で柔軟な DSL を提供するオープンソースの Kotlin ライブラリです。このライブラリは、データを視覚化するためのシンプルで慣用的（イディオマティック）、読みやすく、かつ型安全（type-safe）なツールです。

Kandy は、Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook とシームレスに統合されています。また、Kandy と Kotlin DataFrame ライブラリを簡単に組み合わせて、さまざまなデータ関連のタスクを完了させることもできます。

![Kandy](data-analysis-kandy-example.png){width=700}

## 次のステップ

* [Kotlin Notebook を使ってみる](get-started-with-kotlin-notebooks.md)
* [Kotlin DataFrame ライブラリを使用したデータの取得と変換](data-analysis-work-with-data-sources.md)
* [Kandy ライブラリを使用したデータの視覚化](data-analysis-visualization.md)
* [データ分析のための Kotlin および Java ライブラリの詳細](data-analysis-libraries.md)