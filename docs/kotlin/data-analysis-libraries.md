[//]: # (title: Kotlin 和 Java 数据分析库)

从数据收集到模型构建，Kotlin 提供了强大的库，可促进数据管道中不同任务的完成。

除了自身的库之外，Kotlin 还与 Java 100% 互操作。这种互操作性有助于利用整个久经考验的 Java 库生态系统，并提供卓越的性能。有了这一优势，您在处理 [Kotlin 数据项目](data-analysis-overview.md)时，可以轻松使用 Kotlin 或 Java 库。

## Kotlin 库

<table>
  <tr>
    <td><strong>库</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>特点</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>数据收集</li>
        <li>数据清洗与处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于创建、排序和清洗数据帧、特征工程等操作</li>
        <li>结构化数据处理</li>
        <li>支持 CSV、JSON 和其他输入格式</li>
        <li>从 SQL 数据库读取</li>
        <li>连接不同的 API 以访问数据并提高类型安全性</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
    </td>
    <td>
      <list>
        <li>数据探索与可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于绘制各种类型图表的强大、可读且类型安全的 DSL</li>
        <li>用 Kotlin 为 JVM 编写的开源库</li>
        <li>支持 <a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>、<a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a> 和 <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a></li>
        <li>与 <a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a> 无缝集成</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
    </td>
    <td>
      <list>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>用 Kotlin 编写并受 <a href="https://keras.io/">Keras</a> 启发的深度学习 API</li>
        <li>从头开始训练深度学习模型或导入现有 Keras 和 ONNX 模型进行推理</li>
        <li>迁移学习，用于根据您的任务定制现有的预训练模型</li>
        <li>支持 <a href="https://developer.android.com/about">Android 平台</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>多维数组上的数学运算（线性代数、统计、算术及其他计算）</li>
        <li>创建、复制、索引、切片及其他数组操作</li>
        <li>符合 Kotlin 习惯的库，具有类型和维度安全、可交换计算引擎等优势，可在 JVM 或作为原生代码运行</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
    </td>
    <td>
      <list>
        <li>数据收集</li>
        <li>数据清洗与处理</li>
        <li>数据探索与可视化</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a> 与 Kotlin 之间的兼容层</li>
        <li>以 Kotlin 习惯代码实现 Apache Spark 数据转换操作</li>
        <li>在花括号或方法引用中简单使用 Kotlin 特性，例如数据类和 Lambda 表达式</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
    </td>
    <td>
      <list>
        <li>数据探索与可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>绘制用 Kotlin 编写的统计数据</li>
        <li>支持 <a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>、<a href="https://datalore.jetbrains.com/">Datalore</a> 和 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">带 Kotlin 内核的 Jupyter</a></li>
        <li>兼容 JVM、JS 和 Python</li>
        <li>在 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 应用程序中嵌入图表</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>数据探索与可视化</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>一个模块化库，用于在 <a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a>（JVM、JS、Native 和 Wasm）中处理数学抽象</li>
        <li>用于代数结构、数学表达式、直方图和流式操作的 API</li>
        <li>现有 Java 和 Kotlin 库（包括 <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>、<a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a> 和 <a href="https://github.com/Kotlin/multik">Multik</a>）的可互换包装器</li>
        <li>受 Python 的 <a href="https://numpy.org/">NumPy</a> 启发，但具有类型安全等其他附加特性</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
    </td>
    <td>
      <list>
        <li>数据探索与可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>表格数据可视化</li>
        <li>受 R 语言的 <a href="https://ggplot2.tidyverse.org/">ggplot</a> 启发</li>
        <li>支持 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">带 Kotlin 内核的 Jupyter</a></li>
      </list>
    </td>
  </tr>
</table>

## Java 库

由于 Kotlin 提供了与 Java 的一流互操作性，您可以在 Kotlin 代码中使用 Java 库来完成数据任务。以下是一些此类库的示例：

<table>
  <tr>
    <td><strong>库</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>特点</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>数据收集</li>
        <li>数据清洗与处理</li>
        <li>数据探索与可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于加载、清洗、转换、过滤和汇总数据的工具</li>
        <li>受 <a href="https://plotly.com/">Plot.ly</a> 启发</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>自然语言处理工具包</li>
        <li>文本语言学标注，例如情感和引用归属</li>
        <li>支持八种语言</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>数据探索与可视化</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>现成的机器学习和自然语言处理算法</li>
        <li>线性代数、图、插值和可视化工具</li>
        <li>提供函数式 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>、<a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>、<a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> 等</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>用 Kotlin 重写的 <a href="https://www.scala-lang.org/api/current/">Scala</a> 隐式，用于 Smile 的自然语言处理部分</li>
        <li>以 Kotlin 扩展函数和接口形式的操作</li>
        <li>句子拆分、词干提取、词袋及其他任务</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于 JVM 的矩阵数学库</li>
        <li>超过 500 种数学、线性代数和深度学习操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 的数学和统计运算</li>
        <li>相关性、分布、线性代数、几何及其他操作</li>
        <li>机器学习模型</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 数值算法数学库</li>
        <li>面向对象的数值方法</li>
        <li>线性代数、优化、统计、微积分及更多操作</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>数据清洗与处理</li>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>基于机器学习的自然语言文本处理工具包</li>
        <li>分词、句子分割、词性标注及其他任务</li>
        <li>用于数据建模和模型验证的内置工具</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
    </td>
    <td>
      <list>
        <li>数据探索与可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于科学图表的 <a href="https://openjfx.io/">JavaFX</a> 库</li>
        <li>复杂图表，例如对数图、热力图和力导向图</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
    </td>
    <td>
      <list>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 深度学习库</li>
        <li>导入和重新训练模型（<a href="https://pytorch.org/">Pytorch</a>、<a href="https://www.tensorflow.org/">Tensorflow</a>、<a href="https://keras.io/">Keras</a>）</li>
        <li>部署在 JVM 微服务环境、移动设备、物联网和 <a href="https://spark.apache.org/">Apache Spark</a> 中</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
    </td>
    <td>
      <list>
        <li>模型构建</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于优化规划问题的求解器工具</li>
        <li>兼容面向对象和函数式编程</li>
      </list>
    </td>
  </tr>
</table>