---
title: "データ分析のための Kotlin"
---
```markdown
  

データの探索と分析は、日常的に行うことではないかもしれませんが、ソフトウェア開発者として必要な重要なスキルです。

デバッグ時にコレクションの中身を実際に分析したり、メモリダンプやデータベースを詳しく調べたり、REST API を使用する際に大量のデータを含む JSON ファイルを受け取ったりするなど、データ分析が重要なソフトウェア開発業務について考えてみましょう。

Kotlin の探索的データ分析（EDA）ツール（[Kotlin notebooks](#notebooks)、[Kotlin DataFrame](#kotlin-dataframe)、[Kandy](#kandy)など）を使用すると、分析スキルを向上させ、さまざまなシナリオをサポートするための豊富な機能を利用できます。

* **さまざまな形式でデータをロード、変換、視覚化：** Kotlin EDA ツールを使用すると、データのフィルタリング、ソート、集計などのタスクを実行できます。当社のツールは、CSV、JSON、TXT などのさまざまなファイル形式から IDE で直接データをシームレスに読み取ることができます。

    当社のプロットツールである Kandy を使用すると、さまざまなチャートを作成して、データセットを視覚化し、インサイトを得ることができます。

* **リレーショナルデータベースに保存されたデータを効率的に分析：** Kotlin DataFrame はデータベースとシームレスに統合され、SQL クエリと同様の機能を提供します。さまざまなデータベースから直接データを取得、操作、視覚化できます。

* **Web API からリアルタイムおよび動的なデータセットをフェッチして分析：** EDA ツールの柔軟性により、OpenAPI などのプロトコルを介して外部 API との統合が可能です。この機能は、Web API からデータをフェッチし、必要に応じてデータをクレンジングおよび変換するのに役立ちます。

データ分析用の Kotlin ツールを試してみませんか？

<a href="get-started-with-kotlin-notebooks"><img src="/img/kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" /></a>

当社の Kotlin データ分析ツールを使用すると、データの取得から完了までスムーズに処理できます。Kotlin Notebook のシンプルなドラッグアンドドロップ機能でデータを簡単に取得できます。わずか数行のコードで、データのクレンジング、変換、視覚化ができます。さらに、数回クリックするだけで出力チャートをエクスポートできます。

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Notebooks

_Notebooks_ は、コード、グラフィック、テキストを単一の環境に統合するインタラクティブなエディタです。Notebooks を使用すると、コードセルを実行して出力をすぐに確認できます。

Kotlin は、[Kotlin Notebook](#kotlin-notebook)、[Datalore](#kotlin-notebooks-in-datalore)、[Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel) などのさまざまな Notebooks ソリューションを提供し、データの取得、変換、探索、モデリングなどに便利な機能を提供します。
これらの Kotlin Notebooks ソリューションは、当社の[Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter) をベースにしています。

Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook 間でコードをシームレスに共有できます。当社の Kotlin Notebooks のいずれかでプロジェクトを作成し、互換性の問題を気にせずに別の Notebooks で作業を続けることができます。

当社の強力な Kotlin Notebooks の機能と、Kotlin でコーディングする利点を活用してください。Kotlin はこれらの Notebooks と統合されており、データサイエンスと機械学習のスキルを向上させながら、データの管理や同僚との調査結果の共有に役立ちます。

当社のさまざまな Kotlin Notebooks ソリューションの機能を確認し、プロジェクトの要件に最適なものを選択してください。

<img src="/img/kotlin-notebook.png" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview) は、Kotlin で Notebooks を作成できる IntelliJ IDEA のプラグインです。一般的な IDE 機能をすべて備えた IDE エクスペリエンスを提供し、リアルタイムのコードインサイトとプロジェクト統合を提供します。

### Kotlin notebooks in Datalore

[Datalore](https://datalore.jetbrains.com/) を使用すると、追加のインストールなしに、Kotlin をすぐにブラウザで使用できます。
Notebooks を共有してリモートで実行したり、他の Kotlin Notebooks とリアルタイムでコラボレーションしたり、
コードの記述時にスマートコーディングアシスタンスを受けたり、インタラクティブまたは静的なレポートを通じて結果をエクスポートしたりすることもできます。

### Jupyter Notebook with Kotlin Kernel

[Jupyter Notebook](https://jupyter.org/) は、コード、
視覚化、Markdown テキストを含むドキュメントを作成および共有できるオープンソースの Web アプリケーションです。
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) は、Jupyter 環境内で Kotlin の力を活用するために、Jupyter Notebook への Kotlin サポートを提供するオープンソースプロジェクトです。

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) ライブラリを使用すると、Kotlin プロジェクトで構造化データを操作できます。データの作成と
クレンジングから、詳細な分析や特徴量エンジニアリングまで、このライブラリですべてをカバーできます。

Kotlin DataFrame ライブラリを使用すると、CSV、JSON、XLS、XLSX などのさまざまなファイル形式を操作できます。このライブラリは、SQL データベースまたは API との接続機能により、データ取得プロセスも容易にします。

<img src="/img/data-analysis-dataframe-example.png" alt="Kotlin DataFrame" width="700" style={{verticalAlign: 'middle'}}/>

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) は、さまざまなタイプのチャートをプロットするための強力で柔軟な DSL を提供するオープンソースの Kotlin ライブラリです。
このライブラリは、データを視覚化するためのシンプルで慣用的、読みやすく、タイプセーフなツールです。

Kandy は、Kotlin Notebook、Datalore、Kotlin-Jupyter Notebook とシームレスに統合されています。Kandy と
Kotlin DataFrame ライブラリを簡単に組み合わせて、さまざまなデータ関連タスクを完了することもできます。

<img src="/img/data-analysis-kandy-example.png" alt="Kandy" width="700" style={{verticalAlign: 'middle'}}/>

## What's next

* [Get started with Kotlin Notebook](get-started-with-kotlin-notebooks)
* [Retrieve and transform data using the Kotlin DataFrame library](data-analysis-work-with-data-sources)
* [Visualize data using the Kandy library](data-analysis-visualization)
* [Learn more about Kotlin and Java libraries for data analysis](data-analysis-libraries)