---
title: "用於資料分析的 Kotlin 及 Java 函式庫"
---
從資料收集到模型建立，Kotlin 提供了強大的函式庫，可促進資料流程中不同的任務。

除了它自己的函式庫之外，Kotlin 與 Java 100% 可互通。 這種互通性有助於充分利用整個經過考驗且效能卓越的 Java 函式庫生態系統。 透過此優勢，您可以在處理 [Kotlin 資料專案](data-analysis-overview) 時，輕鬆使用 Kotlin 或 Java 函式庫。

## Kotlin 函式庫
<table>
<tr>
<td>
<strong>函式庫 (Library)</strong>
</td>
<td>
<strong>目的 (Purpose)</strong>
</td>
<td>
<strong>功能 (Features)</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
</td>
<td>
<list>
<li>資料收集 (Data collection)</li>
<li>資料清理和處理 (Data cleaning and processing)</li>
</list>
</td>
<td>
<list>
<li>用於建立、排序和清理資料框架 (Data Frame)、特徵工程 (Feature engineering) 等的操作</li>
<li>結構化資料的處理</li>
<li>支援 CSV、JSON 和其他輸入格式</li>
<li>從 SQL 資料庫讀取</li>
<li>連接不同的 API 以存取資料並提高型別安全</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
</td>
<td>
<list>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
</list>
</td>
<td>
<list>
<li>強大、可讀且型別安全的 DSL，用於繪製各種型別的圖表</li>
<li>以 Kotlin 撰寫的適用於 JVM 的開放原始碼函式庫</li>
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
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>以 Kotlin 撰寫並受 <a href="https://keras.io/">Keras</a> 啟發的深度學習 API</li>
<li>從頭開始訓練深度學習模型，或匯入現有的 Keras 和 ONNX 模型以進行推論</li>
<li>轉移學習 (Transfer learning)，用於客製化現有的預先訓練模型以符合您的任務</li>
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
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>多維陣列上的數學運算（線性代數、統計、算術和其他計算）</li>
<li>建立、複製、索引、切片和其他陣列運算</li>
<li>Kotlin 慣用函式庫，具有型別和維度安全以及可交換的計算引擎等優點，可在 JVM 上執行或作為原生程式碼執行</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
</td>
<td>
<list>
<li>資料收集 (Data collection)</li>
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li><a href="https://spark.apache.org/">Apache Spark</a> 和 Kotlin 之間的相容性層</li>
<li>Kotlin 慣用程式碼中的 Apache Spark 資料轉換運算</li>
<li>在花括號或方法參考中簡單使用 Kotlin 功能，例如資料類別和 Lambda 運算式</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
</td>
<td>
<list>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
</list>
</td>
<td>
<list>
<li>繪製以 Kotlin 撰寫的統計資料</li>
<li>支援 <a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a> 和 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">具有 Kotlin 核心的 Jupyter</a></li>
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
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>模組化函式庫，用於在 <a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a>（JVM、JS、Native 和 Wasm）中處理數學抽象概念</li>
<li>用於代數結構、數學運算式、直方圖和串流運算的 API</li>
<li>現有 Java 和 Kotlin 函式庫的可互換包裝函式，包括 <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a> 和 <a href="https://github.com/Kotlin/multik">Multik</a></li>
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
<li>資料探索和視覺化 (Data exploration and visualization)</li>
</list>
</td>
<td>
<list>
<li>表格資料的視覺化</li>
<li>受 R 的 <a href="https://ggplot2.tidyverse.org/">ggplot</a> 啟發</li>
<li>支援 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">具有 Kotlin 核心的 Jupyter</a></li>
</list>
</td>
</tr>
</table>

## Java 函式庫

由於 Kotlin 提供與 Java 的一流互通性，因此您可以在 Kotlin 程式碼中使用 Java 函式庫來執行資料任務。
以下是一些此類函式庫的範例：
<table>
<tr>
<td>
<strong>函式庫 (Library)</strong>
</td>
<td>
<strong>目的 (Purpose)</strong>
</td>
<td>
<strong>功能 (Features)</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
</td>
<td>
<list>
<li>資料收集 (Data collection)</li>
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
</list>
</td>
<td>
<list>
<li>用於載入、清理、轉換、篩選和摘要資料的工具</li>
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
<li>資料清理和處理 (Data cleaning and processing)</li>
</list>
</td>
<td>
<list>
<li>自然語言處理工具組</li>
<li>文字的語言註解，例如情感和引號歸屬</li>
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
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>資料探索和視覺化 (Data exploration and visualization)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>用於機器學習和自然語言處理的現成演算法</li>
<li>線性代數、圖形、插值和視覺化工具</li>
<li>提供功能性 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>、<a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>、<a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> 等</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
</td>
<td>
<list>
<li>資料清理和處理 (Data cleaning and processing)</li>
</list>
</td>
<td>
<list>
<li><a href="https://www.scala-lang.org/api/current/">Scala</a> 隱式自然語言處理部分 Smile 的 Kotlin 重寫</li>
<li>Kotlin 擴充功能和介面格式的運算</li>
<li>斷句、詞幹提取、詞袋和其他任務</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
</td>
<td>
<list>
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>適用於 JVM 的矩陣數學函式庫</li>
<li>超過 500 種數學、線性代數和深度學習運算</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
</td>
<td>
<list>
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>Java 的數學和統計運算</li>
<li>相關性、分佈、線性代數、幾何和其他運算</li>
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
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>數值演算法的 Java 數學函式庫</li>
<li>物件導向數值方法</li>
<li>線性代數、最佳化、統計、微積分和其他運算</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
</td>
<td>
<list>
<li>資料清理和處理 (Data cleaning and processing)</li>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>基於機器學習的工具組，用於處理自然語言文字</li>
<li>符記化、斷句、詞性標記和其他任務</li>
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
<li>資料探索和視覺化 (Data exploration and visualization)</li>
</list>
</td>
<td>
<list>
<li>用於科學圖表的 <a href="https://openjfx.io/">JavaFX</a> 函式庫</li>
<li>複雜圖表，例如對數、熱圖和力導向圖</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
</td>
<td>
<list>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>Java 的深度學習函式庫</li>
<li>匯入和重新訓練模型 (<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>)</li>
<li>部署在 JVM 微服務環境、行動裝置、物聯網和 <a href="https://spark.apache.org/">Apache Spark</a> 中</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
</td>
<td>
<list>
<li>模型建立 (Model building)</li>
</list>
</td>
<td>
<list>
<li>用於最佳化規劃問題的求解器公用程式</li>
<li>與物件導向和函數式程式設計相容</li>
</list>
</td>
</tr>
</table>