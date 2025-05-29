[//]: # (title: Kotlin 和 Java 資料分析函式庫)

從資料收集到模型建構，Kotlin 提供強大的函式庫，可協助資料流程中的不同任務。

除了其本身的函式庫之外，Kotlin 與 Java 具有 100% 的互通性。這種互通性有助於利用整個經過驗證的 Java 函式庫生態系，並提供優異的效能。憑藉此優勢，您在處理 [Kotlin 資料專案](data-analysis-overview.md) 時，可以輕鬆使用 Kotlin 或 Java 函式庫。

## Kotlin 函式庫

<table>
  <tr>
    <td><strong>函式庫</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>功能</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>資料收集</li>
        <li>資料清理與處理</li>
      </list>
    </td>
    <td>
      <list>
        <li>用於建立、排序和清理資料框架 (DataFrames)、特徵工程 (Feature Engineering) 等操作</li>
        <li>結構化資料處理</li>
        <li>支援 CSV、JSON 及其他輸入格式</li>
        <li>從 SQL 資料庫讀取</li>
        <li>連接不同 API 以存取資料並提高型別安全 (Type Safety)</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
    </td>
    <td>
      <list>
        <li>資料探索與視覺化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用於繪製各種圖表的強大、可讀且型別安全的 DSL</li>
        <li>針對 JVM 以 Kotlin 撰寫的開源函式庫</li>
        <li>支援 <a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>、<a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a> 和 <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a></li>
        <li>與 <a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a> 無縫整合</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
    </td>
    <td>
      <list>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>以 Kotlin 撰寫並受 <a href="https://keras.io/">Keras</a> 啟發的深度學習 API</li>
        <li>從頭訓練深度學習模型或匯入現有 Keras 和 ONNX 模型進行推論 (Inference)</li>
        <li>遷移學習 (Transfer Learning) 以根據您的任務調整現有預訓練模型</li>
        <li>支援 <a href="https://developer.android.com/about">Android 平台</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>多維陣列 (Multidimensional Arrays) 上的數學運算 (線性代數、統計、算術及其他計算)</li>
        <li>建立、複製、索引、切片及其他陣列操作</li>
        <li>Kotlin 慣用函式庫，具有型別和維度安全 (Dimension Safety) 以及可交換計算引擎 (Swappable Computational Engines) 等優點，可在 JVM 上執行或作為原生程式碼 (Native Code) 執行</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
    </td>
    <td>
      <list>
        <li>資料收集</li>
        <li>資料清理與處理</li>
        <li>資料探索與視覺化</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a> 與 Kotlin 之間的相容性層</li>
        <li>以 Kotlin 慣用程式碼進行 Apache Spark 資料轉換操作</li>
        <li>在大括號或方法參照 (Method Reference) 中簡單使用 Kotlin 功能，例如資料類別 (Data Classes) 和 Lambda 運算式 (Lambda Expressions)</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
    </td>
    <td>
      <list>
        <li>資料探索與視覺化</li>
      </list>
    </td>
    <td>
      <list>
        <li>以 Kotlin 撰寫的統計資料繪圖</li>
        <li>支援 <a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a> 和 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a></li>
        <li>與 JVM、JS 和 Python 相容</li>
        <li>在 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 應用程式中嵌入圖表</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>資料探索與視覺化</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>在 <a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM、JS、Native 和 Wasm) 中處理數學抽象 (Mathematical Abstractions) 的模組化函式庫</li>
        <li>用於代數結構 (Algebraic Structures)、數學表達式 (Mathematical Expressions)、直方圖 (Histograms) 和串流操作 (Streaming Operations) 的 API</li>
        <li>現有 Java 和 Kotlin 函式庫的可互換包裝器 (Wrappers)，包括 <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a> 和 <a href="https://github.com/Kotlin/multik">Multik</a></li>
        <li>受 Python 的 <a href="https://numpy.org/">NumPy</a> 啟發，但具有其他額外功能，例如型別安全</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
    </td>
    <td>
      <list>
        <li>資料探索與視覺化</li>
      </list>
    </td>
    <td>
      <list>
        <li>表格資料視覺化</li>
        <li>受 R 的 <a href="https://ggplot2.tidyverse.org/">ggplot</a> 啟發</li>
        <li>支援 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a></li>
      </list>
    </td>
  </tr>
</table>

## Java 函式庫

由於 Kotlin 提供與 Java 的一流互通性，您可以在 Kotlin 程式碼中使用 Java 函式庫執行資料任務。以下是一些這類函式庫的範例：

<table>
  <tr>
    <td><strong>函式庫</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>功能</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>資料收集</li>
        <li>資料清理與處理</li>
        <li>資料探索與視覺化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用於載入、清理、轉換、篩選和彙總資料的工具</li>
        <li>受 <a href="https://plotly.com/">Plot.ly</a> 啟發</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
      </list>
    </td>
    <td>
      <list>
        <li>自然語言處理工具包</li>
        <li>文本的語言學註釋 (Linguistic Annotations)，例如情感 (Sentiment) 和引文歸屬 (Quote Attributions)</li>
        <li>支援八種語言</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>資料探索與視覺化</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>用於機器學習和自然語言處理的現成演算法</li>
        <li>線性代數、圖形、插值 (Interpolation) 和視覺化工具</li>
        <li>提供功能性 Kotlin API、Scala API、Clojure API 等</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
      </list>
    </td>
    <td>
      <list>
        <li>將 Smile 的自然語言處理部分之 <a href="https://www.scala-lang.org/api/current/">Scala</a> 隱式 (Implicits) 用 Kotlin 重寫</li>
        <li>以 Kotlin 擴展函式 (Extension Functions) 和介面 (Interfaces) 格式的操作</li>
        <li>斷句 (Sentence Breaking)、詞幹提取 (Stemming)、詞袋模型 (Bag of Words) 及其他任務</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>適用於 JVM 的矩陣數學函式庫</li>
        <li>超過 500 種數學、線性代數和深度學習操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>適用於 Java 的數學和統計操作</li>
        <li>相關性 (Correlations)、分佈 (Distributions)、線性代數、幾何 (Geometry) 及其他操作</li>
        <li>機器學習模型</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 數值演算法數學函式庫</li>
        <li>物件導向數值方法</li>
        <li>線性代數、最佳化 (Optimization)、統計、微積分 (Calculus) 及更多操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>資料清理與處理</li>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>基於機器學習的自然語言文本處理工具包</li>
        <li>標記化 (Tokenization)、句子分割 (Sentence Segmentation)、詞性標註 (Part-of-Speech Tagging) 及其他任務</li>
        <li>用於資料建模和模型驗證的內建工具</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
    </td>
    <td>
      <list>
        <li>資料探索與視覺化</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://openjfx.io/">JavaFX</a> 用於科學圖表的函式庫</li>
        <li>複雜圖表，例如對數圖、熱力圖 (Heatmap) 和力導向圖 (Force-Directed Graph)</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
    </td>
    <td>
      <list>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>適用於 Java 的深度學習函式庫</li>
        <li>匯入和再訓練模型 (<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>)</li>
        <li>部署到 JVM 微服務環境、行動裝置、物聯網 (IoT) 和 <a href="https://spark.apache.org/">Apache Spark</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
    </td>
    <td>
      <list>
        <li>模型建構</li>
      </list>
    </td>
    <td>
      <list>
        <li>最佳化規劃問題的求解器 (Solver) 工具</li>
        <li>與物件導向和函數式編程相容</li>
      </list>
    </td>
  </tr>
</table>