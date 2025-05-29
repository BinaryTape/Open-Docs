[//]: # (title: データ分析のためのKotlinおよびJavaライブラリ)

データ収集からモデル構築まで、Kotlinはデータパイプラインのさまざまなタスクを容易にする堅牢なライブラリを提供します。

独自のライブラリに加えて、KotlinはJavaと100%の相互運用性を持っています。この相互運用性により、実績のあるJavaライブラリのエコシステム全体を優れたパフォーマンスで活用できます。この利点により、[Kotlinデータプロジェクト](data-analysis-overview.md)で作業する際に、KotlinまたはJavaのどちらのライブラリでも簡単に使用できます。

## Kotlinライブラリ

<table>
  <tr>
    <td><strong>ライブラリ</strong></td>
    <td><strong>目的</strong></td>
    <td><strong>機能</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>データ収集</li>
        <li>データクリーンニングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>データフレームの作成、ソート、クリーンニング、特徴量エンジニアリングなどの操作</li>
        <li>構造化データの処理</li>
        <li>CSV、JSON、その他の入力形式に対応</li>
        <li>SQLデータベースからの読み込み</li>
        <li>さまざまなAPIと接続してデータにアクセスし、型安全性を向上</li>
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
        <li>JVM向けにKotlinで書かれたオープンソースライブラリ</li>
        <li><a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>、<a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a>、<a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a>に対応</li>
        <li><a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a>とのシームレスな統合</li>
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
        <li>Kotlinで書かれた<a href="https://keras.io/">Keras</a>にインスパイアされたディープラーニングAPI</li>
        <li>ディープラーニングモデルをゼロからトレーニングしたり、既存のKerasおよびONNXモデルをインポートして推論したりできる</li>
        <li>既存の事前学習済みモデルをタスクに合わせて調整するための転移学習</li>
        <li><a href="https://developer.android.com/about">Androidプラットフォーム</a>に対応</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>多次元配列に対する数学的演算（線形代数、統計、算術演算、その他の計算）</li>
        <li>配列の作成、コピー、インデックス付け、スライス、その他の操作</li>
        <li>型安全性と次元安全性、交換可能な計算エンジンなどの利点を持つKotlinイディオムなライブラリで、JVMまたはネイティブコードとして実行</li>
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
        <li>データクリーンニングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a>とKotlin間の互換性レイヤー</li>
        <li>KotlinイディオムコードでのApache Sparkデータ変換操作</li>
        <li>波括弧またはメソッド参照でのデータクラスやラムダ式などのKotlin機能のシンプルな使用</li>
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
        <li>Kotlinで書かれた統計データのプロット</li>
        <li><a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a>、<a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter (Kotlin Kernel付き)</a>に対応</li>
        <li>JVM、JS、Pythonと互換性あり</li>
        <li><a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>アプリケーションへのチャートの埋め込み</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM、JS、Native、Wasm)で数学的抽象化を扱うためのモジュラーライブラリ</li>
        <li>代数構造、数式、ヒストグラム、ストリーミング操作のためのAPI</li>
        <li><a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>、<a href="https://github.com/Kotlin/multik">Multik</a>を含む既存のJavaおよびKotlinライブラリをラップする交換可能なラッパー</li>
        <li>Pythonの<a href="https://numpy.org/">NumPy</a>にインスパイアされているが、型安全性などの追加機能がある</li>
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
        <li>Rの<a href="https://ggplot2.tidyverse.org/">ggplot</a>にインスパイアされている</li>
        <li><a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter (Kotlin Kernel付き)</a>に対応</li>
      </list>
    </td>
  </tr>
</table>

## Javaライブラリ

KotlinはJavaとのファーストクラスの相互運用性を提供するため、KotlinコードでデータタスクにJavaライブラリを使用できます。そのようなライブラリの例をいくつか示します。

<table>
  <tr>
    <td><strong>ライブラリ</strong></td>
    <td><strong>目的</strong></td>
    <td><strong>機能</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>データ収集</li>
        <li>データクリーンニングと処理</li>
        <li>データ探索と可視化</li>
      </list>
    </td>
    <td>
      <list>
        <li>データの読み込み、クリーンニング、変換、フィルタリング、要約のためのツール</li>
        <li><a href="https://plotly.com/">Plot.ly</a>にインスパイアされている</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>自然言語処理ツールキット</li>
        <li>感情や引用帰属などのテキストの言語学的アノテーション</li>
        <li>8言語に対応</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
        <li>データ探索と可視化</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>機械学習および自然言語処理のための既製アルゴリズム</li>
        <li>線形代数、グラフ、補間、可視化ツール</li>
        <li>機能的な<a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>、<a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>、<a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a>などを提供</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
      </list>
    </td>
    <td>
      <list>
        <li>Smileの自然言語処理部分の<a href="https://www.scala-lang.org/api/current/">Scala</a>暗黙的変換をKotlinで書き直したもの</li>
        <li>Kotlin拡張関数およびインターフェース形式の操作</li>
        <li>文区切り、ステミング、単語の袋、その他のタスク</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>JVM向け行列数学ライブラリ</li>
        <li>500以上の数学、線形代数、ディープラーニング操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java向けの数学および統計操作</li>
        <li>相関、分布、線形代数、幾何学、その他の操作</li>
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
        <li>データクリーンニングと処理</li>
        <li>モデル構築</li>
      </list>
    </td>
    <td>
      <list>
        <li>数値アルゴリズムのJava数学ライブラリ</li>
        <li>オブジェクト指向数値計算手法</li>
        <li>線形代数、最適化、統計、微積分、その他の操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>データクリーンニングと処理</li>
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
        <li>科学チャート用の<a href="https://openjfx.io/">JavaFX</a>ライブラリ</li>
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
        <li>Java向けのディープラーニングライブラリ</li>
        <li>モデルのインポートと再トレーニング（<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>）</li>
        <li>JVMマイクロサービス環境、モバイルデバイス、IoT、<a href="https://spark.apache.org/">Apache Spark</a>へのデプロイ</li>
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
        <li>オブジェクト指向プログラミングおよび関数型プログラミングと互換性あり</li>
      </list>
    </td>
  </tr>
</table>