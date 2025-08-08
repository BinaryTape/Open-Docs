[//]: # (title: Kotlin と Java のデータ分析ライブラリ)

データ収集からモデル構築に至るまで、Kotlin はデータパイプラインにおけるさまざまなタスクを容易にする堅牢なライブラリを提供します。

独自のライブラリに加え、Kotlin は Java と 100% の相互運用性を備えています。この相互運用性により、実績のある Java ライブラリのエコシステム全体を優れたパフォーマンスで活用できます。この利点により、[Kotlin データプロジェクト](data-analysis-overview.md)に取り組む際に、Kotlin または Java のどちらのライブラリでも簡単に使用できます。

## Kotlin ライブラリ

<table>
  <tr>
    <td><strong>ライブラリ</strong></td>
    <td><strong>目的</strong></td>
    <td><strong>特徴</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>データ収集</li>
        <li>データクレンジングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>データフレームの作成、ソート、クレンジング、特徴量エンジニアリングなどを行う操作</li>
        <li>構造化データの処理</li>
        <li>CSV、JSON、その他の入力形式のサポート</li>
        <li>SQLデータベースからの読み込み</li>
        <li>さまざまなAPIと接続してデータにアクセスし、型安全性を向上させる</li>
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
        <li>さまざまな種類のチャートを描画するための強力で読みやすく、型安全なDSL</li>
        <li>JVM 用に Kotlin で書かれたオープンソースライブラリ</li>
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
        <li>Kotlin で書かれた <a href="https://keras.io/">Keras</a> にインスパイアされたディープラーニングAPI</li>
        <li>ディープラーニングモデルを一からトレーニングするか、既存の Keras および ONNX モデルをインポートして推論を行う</li>
        <li>既存の事前学習済みモデルをタスクに合わせて調整するための転移学習</li>
        <li><a href="https://developer.android.com/about">Android プラットフォーム</a>のサポート</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>多次元配列に対する数学的演算（線形代数、統計、算術、その他の計算）</li>
        <li>配列の作成、コピー、インデックス付け、スライス、その他の配列操作</li>
        <li>型安全性や次元安全性、交換可能な計算エンジン（JVMまたはネイティブコードで動作）などの利点を持つ Kotlin イディオマティックなライブラリ</li>
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
        <li>データクレンジングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a> と Kotlin 間の互換性レイヤー</li>
        <li>Kotlin イディオマティックなコードでの Apache Spark データ変換操作</li>
        <li>データクラスやラムダ式などの Kotlin 機能の、中括弧またはメソッド参照による簡単な使用</li>
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
        <li>Kotlin で書かれた統計データのプロット</li>
        <li><a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a>、および <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter (Kotlin Kernelを使用)</a> のサポート</li>
        <li>JVM、JS、Python と互換性あり</li>
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
        <li>データクレンジングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM、JS、Native、および Wasm) で数学的抽象化を扱うためのモジュラーライブラリ</li>
        <li>代数的構造、数式、ヒストグラム、ストリーミング操作のためのAPI</li>
        <li><a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>、および <a href="https://github.com/Kotlin/multik">Multik</a> を含む既存の Java および Kotlin ライブラリの交換可能なラッパー</li>
        <li>Python の <a href="https://numpy.org/">NumPy</a> にインスパイアされているが、型安全性などの追加機能がある</li>
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
        <li>R の <a href="https://ggplot2.tidyverse.org/">ggplot</a> にインスパイア</li>
        <li><a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter (Kotlin Kernelを使用)</a> のサポート</li>
      </list>
    </td>
  </tr>
</table>

## Java ライブラリ

Kotlin は Java とファーストクラスの相互運用性を提供するため、Kotlin コードでデータタスクに Java ライブラリを使用できます。
以下に、そのようなライブラリの例をいくつか示します。

<table>
  <tr>
    <td><strong>ライブラリ</strong></td>
    <td><strong>目的</strong></td>
    <td><strong>特徴</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>データ収集</li>
        <li>データクレンジングと処理</li>
        <li>データ探索と可視化</li>
      </list>
    </td>
    <td>
      <list>
        <li>データのロード、クリーンアップ、変換、フィルタリング、要約のためのツール</li>
        <li><a href="https://plotly.com/">Plot.ly</a> にインスパイア</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>自然言語処理ツールキット</li>
        <li>テキストの言語アノテーション（感情、引用帰属など）</li>
        <li>8つの言語をサポート</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>機械学習と自然言語処理のための既製アルゴリズム</li>
        <li>線形代数、グラフ、補間、可視化ツール</li>
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
        <li>データクレンジングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>Smile の自然言語処理部分における <a href="https://www.scala-lang.org/api/current/">Scala</a> 暗黙の型の Kotlin による書き換え</li>
        <li>Kotlin 拡張関数およびインターフェース形式での操作</li>
        <li>文の分割、ステミング、BoW（単語の袋）、その他のタスク</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>JVM 用の行列数学ライブラリ</li>
        <li>500以上の数学、線形代数、ディープラーニング演算</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 用の数学および統計演算</li>
        <li>相関、分布、線形代数、幾何学、その他の演算</li>
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
        <li>データクレンジングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>数値アルゴリズムの Java 数学ライブラリ</li>
        <li>オブジェクト指向の数値計算メソッド</li>
        <li>線形代数、最適化、統計、微積分、その他の演算</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>データクレンジングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>自然言語テキスト処理のための機械学習ベースのツールキット</li>
        <li>トークン化、文分割、品詞タグ付け、その他のタスク</li>
        <li>データモデリングとモデル検証のための組み込みツール</li>
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
        <li>科学チャート用の <a href="https://openjfx.io/">JavaFX</a> ライブラリ</li>
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
        <li>Java 用のディープラーニングライブラリ</li>
        <li>モデルのインポートと再学習 (<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>)</li>
        <li>JVM マイクロサービス環境、モバイルデバイス、IoT、および <a href="https://spark.apache.org/">Apache Spark</a> へのデプロイ</li>
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
        <li>オブジェクト指向プログラミングと関数型プログラミングに対応</li>
      </list>
    </td>
  </tr>
</table>