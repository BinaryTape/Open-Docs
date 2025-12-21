[//]: # (title: Kotlin 和 Java 用於資料分析的函式庫)

從資料收集到模型建構，Kotlin 提供了強大的函式庫，可協助處理資料管線中不同的任務。

除了其自身的函式庫，Kotlin 與 Java 具備 100% 的互通性。這種互通性有助於充分利用整個久經考驗的 Java 函式庫生態系統，並提供卓越的效能。憑藉此優勢，您在處理 [Kotlin 資料專案](data-analysis-overview.md)時，可以輕鬆使用 Kotlin 或 Java 函式庫。

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
        <li>用於建立、排序和清理資料框、特徵工程等操作</li>
        <li>處理結構化資料</li>
        <li>支援 CSV、JSON 及其他輸入格式</li>
        <li>從 SQL 資料庫讀取</li>
        <li>連接不同的 API 以存取資料並提升型別安全</li>
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
        <li>強大、易讀且型別安全的 DSL，用於繪製各種圖表</li>
        <li>用 Kotlin 撰寫的開源 JVM 函式庫</li>
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
        <li>用 Kotlin 撰寫並受 <a href="https://keras.io/">Keras</a> 啟發的深度學習 API</li>
        <li>從頭訓練深度學習模型，或匯入現有的 Keras 和 ONNX 模型進行推斷</li>
        <li>用於根據任務調整現有預訓練模型的遷移學習</li>
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
        <li>多維陣列的數學運算（線性代數、統計學、算術及其他計算）</li>
        <li>建立、複製、索引、切片及其他陣列操作</li>
        <li>符合 Kotlin 慣用法的函式庫，具有型別和維度安全、可互換計算引擎等優勢，可在 JVM 或作為原生程式碼執行</li>
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
        <li><a href="https://spark.apache.org/">Apache Spark</a> 與 Kotlin 之間的相容層</li>
        <li>以 Kotlin 慣用程式碼執行 Apache Spark 資料轉換操作</li>
        <li>在花括號或方法參考中簡單使用 Kotlin 功能，例如 data classes 和 lambda expressions</li>
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
        <li>模組化函式庫，用於在 <a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform</a>（JVM、JS、Native 和 Wasm）中處理數學抽象</li>
        <li>用於代數結構、數學表達式、直方圖和串流操作的 API</li>
        <li>現有 Java 和 Kotlin 函式庫的可互換封裝器，包括 <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a> 和 <a href="https://github.com/Kotlin/multik">Multik</a></li>
        <li>受 Python 的 <a href="https://numpy.org/">NumPy</a> 啟發，但具有型別安全等其他附加功能</li>
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
        <li>表格資料的視覺化</li>
        <li>受 R 的 <a href="https://ggplot2.tidyverse.org/">ggplot</a> 啟發</li>
        <li>支援 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a></li>
      </list>
    </td>
  </tr>
</table>

## Java 函式庫

由於 Kotlin 提供了與 Java 的一流互通性，您可以在 Kotlin 程式碼中使用 Java 函式庫來執行資料任務。
以下是一些此類函式庫的範例：

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
        <li>用於載入、清理、轉換、過濾和匯總資料的工具</li>
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
        <li>文本的語言註釋，例如情感和引文歸屬</li>
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
        <li>線性代數、圖形、插值和視覺化工具</li>
        <li>提供函數式 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>、<a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>、<a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> 等</li>
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
        <li><a href="https://www.scala-lang.org/api/current/">Scala</a> 隱式從 Smile 自然語言處理部分重寫為 Kotlin</li>
        <li>以 Kotlin 擴展函數和介面形式的操作</li>
        <li>句子拆分、詞幹提取、詞袋及其他任務</li>
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
        <li>用於 JVM 的矩陣數學函式庫</li>
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
        <li>Java 的數學和統計操作</li>
        <li>相關性、分佈、線性代數、幾何及其他操作</li>
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
        <li>物件導向的數值方法</li>
        <li>線性代數、優化、統計學、微積分及更多操作</li>
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
        <li>基於機器學習的工具包，用於處理自然語言文本</li>
        <li>詞元化、句子分割、詞性標註及其他任務</li>
        <li>內建用於資料建模和模型驗證的工具</li>
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
        <li>用於科學圖表的 <a href="https://openjfx.io/">JavaFX</a> 函式庫</li>
        <li>複雜圖表，例如對數圖、熱圖和力導向圖</li>
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
        <li>Java 深度學習函式庫</li>
        <li>匯入和重新訓練模型（<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>）</li>
        <li>部署在 JVM 微服務環境、行動裝置、IoT 和 <a href="https://spark.apache.org/">Apache Spark</a> 中</li>
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
        <li>用於優化規劃問題的解算器工具</li>
        <li>與物件導向和函數式程式設計相容</li>
      </list>
    </td>
  </tr>
</table>