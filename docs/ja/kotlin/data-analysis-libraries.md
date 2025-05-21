---
title: "データ分析のための Kotlin および Java ライブラリ"
---
データ収集からモデル構築まで、Kotlin はデータパイプラインにおけるさまざまなタスクを容易にする堅牢なライブラリを提供します。

Kotlin 独自のライブラリに加えて、Kotlin は Java と 100% 相互運用可能です。この相互運用性により、実績のある Java ライブラリのエコシステム全体を優れたパフォーマンスで活用できます。この特典により、[Kotlin データプロジェクト](data-analysis-overview)に取り組む際に、Kotlin または Java のライブラリを簡単に使用できます。

## Kotlin ライブラリ
<table>
<tr>
<td>
<strong>Library</strong>
</td>
<td>
<strong>Purpose</strong>
</td>
<td>
<strong>Features</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
</td>
<td>
<list>
<li>データ収集</li>
<li>データのクリーニングと処理</li>
</list>
</td>
<td>
<list>
<li>データフレームの作成、ソート、クリーニング、特徴量エンジニアリングなどの操作</li>
<li>構造化データの処理</li>
<li>CSV、JSON、その他の入力形式のサポート</li>
<li>SQL データベースからの読み取り</li>
<li>さまざまな API と接続してデータにアクセスし、型安全性を向上</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
</td>
<td>
<list>
<li>データ探索と可視化</li>
</list>
</td>
<td>
<list>
<li>さまざまな種類のチャートをプロットするための強力で読みやすく、型安全な DSL</li>
<li>JVM 向けに Kotlin で記述されたオープンソースライブラリ</li>
<li><a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>、<a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a>、および <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a> のサポート</li>
<li><a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a> とのシームレスな統合</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
</td>
<td>
<list>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>Kotlin で記述され、<a href="https://keras.io/">Keras</a> に触発された深層学習 API</li>
<li>深層学習モデルをゼロからトレーニングするか、既存の Keras および ONNX モデルをインポートして推論</li>
<li>既存の事前トレーニング済みモデルをタスクに合わせて調整するための転移学習</li>
<li><a href="https://developer.android.com/about">Android プラットフォーム</a> のサポート</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>多次元配列に対する数学演算 (線形代数、統計、算術、およびその他の計算)</li>
<li>配列の作成、コピー、インデックス作成、スライス、およびその他の配列操作</li>
<li>型と次元の安全性や、JVM またはネイティブコードとして実行される交換可能な計算エンジンなどの利点がある Kotlin イディオムライブラリ</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
</td>
<td>
<list>
<li>データ収集</li>
<li>データのクリーニングと処理</li>
<li>データ探索と可視化</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li><a href="https://spark.apache.org/">Apache Spark</a> と Kotlin の間の互換性レイヤー</li>
<li>Kotlin イディオムコードでの Apache Spark データ変換操作</li>
<li>データクラスやラムダ式などの Kotlin 機能を、中括弧またはメソッド参照で簡単に使用</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
</td>
<td>
<list>
<li>データ探索と可視化</li>
</list>
</td>
<td>
<list>
<li>Kotlin で記述された統計データのプロット</li>
<li><a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a>、および <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Kotlin Kernel を使用した Jupyter</a> のサポート</li>
<li>JVM、JS、および Python と互換性</li>
<li><a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> アプリケーションへのチャートの埋め込み</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>データ探索と可視化</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM、JS、Native、および Wasm) での数学的抽象化を扱うためのモジュール式ライブラリ</li>
<li>代数構造、数式、ヒストグラム、およびストリーミング操作用の API</li>
<li><a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>、および <a href="https://github.com/Kotlin/multik">Multik</a> を含む、既存の Java および Kotlin ライブラリに対する交換可能なラッパー</li>
<li>Python の <a href="https://numpy.org/">NumPy</a> に触発されましたが、型安全性などの追加機能があります</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
</td>
<td>
<list>
<li>データ探索と可視化</li>
</list>
</td>
<td>
<list>
<li>表形式データの可視化</li>
<li>R の <a href="https://ggplot2.tidyverse.org/">ggplot</a> に触発</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter#readme">Kotlin Kernel を使用した Jupyter</a> のサポート</li>
</list>
</td>
</tr>
</table>

## Java ライブラリ

Kotlin は Java とのファーストクラスの相互運用性を提供するため、Kotlin コードでデータタスクに Java ライブラリを使用できます。
そのようなライブラリの例を次に示します。
<table>
<tr>
<td>
<strong>Library</strong>
</td>
<td>
<strong>Purpose</strong>
</td>
<td>
<strong>Features</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
</td>
<td>
<list>
<li>データ収集</li>
<li>データのクリーニングと処理</li>
<li>データ探索と可視化</li>
</list>
</td>
<td>
<list>
<li>データのロード、クリーニング、変換、フィルタリング、および集計のためのツール</li>
<li><a href="https://plotly.com/">Plot.ly</a> に触発</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
</list>
</td>
<td>
<list>
<li>自然言語処理ツールキット</li>
<li>感情や引用属性など、テキストの言語注釈</li>
<li>8 つの言語のサポート</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>データ探索と可視化</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>機械学習および自然言語処理用の既製のアルゴリズム</li>
<li>線形代数、グラフ、補間、および可視化ツール</li>
<li>機能的な <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>、<a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>、<a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> などを提供</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
</list>
</td>
<td>
<list>
<li>Smile の自然言語処理部分の <a href="https://www.scala-lang.org/api/current/">Scala</a> 暗黙の再書き込みである Kotlin</li>
<li>Kotlin 拡張関数およびインターフェイスの形式の操作</li>
<li>文の分割、ステミング、bag of words、およびその他のタスク</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>JVM 用の行列数学ライブラリ</li>
<li>500 を超える数学、線形代数、および深層学習操作</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>Java のための数学および統計操作</li>
<li>相関関係、分布、線形代数、幾何学、およびその他の操作</li>
<li>機械学習モデル</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>数値アルゴリズムの Java 数学ライブラリ</li>
<li>オブジェクト指向の数値法</li>
<li>線形代数、最適化、統計、微積分、およびその他の操作</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
</td>
<td>
<list>
<li>データのクリーニングと処理</li>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>自然言語テキストの処理のための機械学習ベースのツールキット</li>
<li>トークン化、文のセグメンテーション、品詞タグ付け、およびその他のタスク</li>
<li>データモデリングおよびモデル検証用の組み込みツール</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
</td>
<td>
<list>
<li>データ探索と可視化</li>
</list>
</td>
<td>
<list>
<li>科学的なチャートのための <a href="https://openjfx.io/">JavaFX</a> ライブラリ</li>
<li>対数、ヒートマップ、力指向グラフなどの複雑なチャート</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
</td>
<td>
<list>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>Java 用の深層学習ライブラリ</li>
<li>モデルのインポートと再トレーニング (<a href="https://pytorch.org/">Pytorch</a>, <a href="https://www.tensorflow.org/">Tensorflow</a>, <a href="https://keras.io/">Keras</a>)</li>
<li>JVM マイクロサービス環境、モバイルデバイス、IoT、および <a href="https://spark.apache.org/">Apache Spark</a> でのデプロイ</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
</td>
<td>
<list>
<li>モデル構築</li>
</list>
</td>
<td>
<list>
<li>最適化計画問題のためのソルバーユーティリティ</li>
<li>オブジェクト指向および関数型プログラミングと互換性</li>
</list>
</td>
</tr>
</table>