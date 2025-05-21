---
title: "데이터 분석을 위한 Kotlin 및 Java 라이브러리"
---
데이터 수집부터 모델 구축에 이르기까지, Kotlin은 데이터 파이프라인의 다양한 작업을 용이하게 하는 강력한 라이브러리를 제공합니다.

Kotlin은 자체 라이브러리 외에도 Java와 100% 상호 운용이 가능합니다. 이러한 상호 운용성은 뛰어난 성능을 갖춘 입증된 Java 라이브러리의 전체 생태계를 활용하는 데 도움이 됩니다. 이러한 이점을 통해 [Kotlin 데이터 프로젝트](data-analysis-overview)에서 작업할 때 Kotlin 또는 Java 라이브러리를 쉽게 사용할 수 있습니다.

## Kotlin 라이브러리
<table>
<tr>
<td>
<strong>라이브러리</strong>
</td>
<td>
<strong>목적</strong>
</td>
<td>
<strong>기능</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
</td>
<td>
<list>
<li>데이터 수집</li>
<li>데이터 정리 및 처리</li>
</list>
</td>
<td>
<list>
<li>데이터 프레임 생성, 정렬 및 정리, 특징 엔지니어링 등을 위한 작업</li>
<li>구조화된 데이터 처리</li>
<li>CSV, JSON 및 기타 입력 형식 지원</li>
<li>SQL 데이터베이스에서 읽기</li>
<li>다양한 API와 연결하여 데이터에 액세스하고 타입 안전성 향상</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
</td>
<td>
<list>
<li>데이터 탐색 및 시각화</li>
</list>
</td>
<td>
<list>
<li>다양한 유형의 차트를 플로팅하기 위한 강력하고 읽기 쉽고 타입 안전한 DSL</li>
<li>JVM용 Kotlin으로 작성된 오픈 소스 라이브러리</li>
<li><a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>, <a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a> 및 <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a> 지원</li>
<li><a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a>과의 원활한 통합</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
</td>
<td>
<list>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>Kotlin으로 작성되었으며 <a href="https://keras.io/">Keras</a>에서 영감을 받은 딥 러닝 API</li>
<li>딥 러닝 모델을 처음부터 학습하거나 추론을 위해 기존 Keras 및 ONNX 모델을 가져오기</li>
<li>기존 사전 훈련된 모델을 작업에 맞게 조정하기 위한 전이 학습</li>
<li><a href="https://developer.android.com/about">Android platform</a> 지원</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>다차원 배열에 대한 수학 연산(선형 대수, 통계, 산술 및 기타 계산)</li>
<li>배열 생성, 복사, 인덱싱, 슬라이싱 및 기타 배열 연산</li>
<li>타입 및 차원 안전성, JVM 또는 네이티브 코드로 실행되는 교체 가능한 계산 엔진과 같은 이점을 제공하는 Kotlin 관용구 라이브러리</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
</td>
<td>
<list>
<li>데이터 수집</li>
<li>데이터 정리 및 처리</li>
<li>데이터 탐색 및 시각화</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li><a href="https://spark.apache.org/">Apache Spark</a>와 Kotlin 간의 호환성 레이어</li>
<li>Kotlin 관용구 코드로 된 Apache Spark 데이터 변환 작업</li>
<li>중괄호 또는 메서드 참조에서 데이터 클래스 및 람다 표현식과 같은 Kotlin 기능의 간단한 사용</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
</td>
<td>
<list>
<li>데이터 탐색 및 시각화</li>
</list>
</td>
<td>
<list>
<li>Kotlin으로 작성된 통계 데이터 플로팅</li>
<li><a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>, <a href="https://datalore.jetbrains.com/">Datalore</a> 및 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Kotlin Kernel을 사용하는 Jupyter</a> 지원</li>
<li>JVM, JS 및 Python과 호환</li>
<li><a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 애플리케이션에 차트 포함</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>데이터 탐색 및 시각화</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a>(JVM, JS, Native 및 Wasm)에서 수학적 추상화를 처리하는 모듈식 라이브러리</li>
<li>대수 구조, 수학적 표현식, 히스토그램 및 스트리밍 작업을 위한 API</li>
<li><a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>, <a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a> 및 <a href="https://github.com/Kotlin/multik">Multik</a>를 포함한 기존 Java 및 Kotlin 라이브러리에 대한 교환 가능한 래퍼</li>
<li>Python의 <a href="https://numpy.org/">NumPy</a>에서 영감을 얻었지만 타입 안전성과 같은 다른 추가 기능이 있습니다.</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
</td>
<td>
<list>
<li>데이터 탐색 및 시각화</li>
</list>
</td>
<td>
<list>
<li>표 형식 데이터 시각화</li>
<li>R의 <a href="https://ggplot2.tidyverse.org/">ggplot</a>에서 영감을 받음</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter#readme">Kotlin Kernel을 사용하는 Jupyter</a> 지원</li>
</list>
</td>
</tr>
</table>

## Java 라이브러리

Kotlin은 Java와 최고 수준의 상호 운용성을 제공하므로 Kotlin 코드에서 데이터 작업을 위해 Java 라이브러리를 사용할 수 있습니다.
다음은 이러한 라이브러리의 몇 가지 예입니다.
<table>
<tr>
<td>
<strong>라이브러리</strong>
</td>
<td>
<strong>목적</strong>
</td>
<td>
<strong>기능</strong>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
</td>
<td>
<list>
<li>데이터 수집</li>
<li>데이터 정리 및 처리</li>
<li>데이터 탐색 및 시각화</li>
</list>
</td>
<td>
<list>
<li>데이터 로드, 정리, 변환, 필터링 및 요약을 위한 도구</li>
<li><a href="https://plotly.com/">Plot.ly</a>에서 영감을 받음</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
</list>
</td>
<td>
<list>
<li>자연어 처리 툴킷</li>
<li>감정 및 인용 속성과 같은 텍스트에 대한 언어적 주석</li>
<li>8개 언어 지원</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>데이터 탐색 및 시각화</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>머신 러닝 및 자연어 처리를 위한 즉시 사용 가능한 알고리즘</li>
<li>선형 대수, 그래프, 보간 및 시각화 도구</li>
<li>기능적 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>, <a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>, <a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> 등 제공</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
</list>
</td>
<td>
<list>
<li>Smile의 자연어 처리 부분을 위한 <a href="https://www.scala-lang.org/api/current/">Scala</a> 암시적 재작성 Kotlin</li>
<li>Kotlin 확장 함수 및 인터페이스 형식의 작업</li>
<li>문장 나누기, 형태소 분석, 단어 가방 및 기타 작업</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>JVM용 행렬 수학 라이브러리</li>
<li>500개 이상의 수학, 선형 대수 및 딥 러닝 연산</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>Java용 수학 및 통계 연산</li>
<li>상관 관계, 분포, 선형 대수, 기하학 및 기타 연산</li>
<li>머신 러닝 모델</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>수치 알고리즘의 Java 수학 라이브러리</li>
<li>객체 지향 수치 방법</li>
<li>선형 대수, 최적화, 통계, 미적분 및 기타 연산</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
</td>
<td>
<list>
<li>데이터 정리 및 처리</li>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>자연어 텍스트 처리를 위한 머신 러닝 기반 툴킷</li>
<li>토큰화, 문장 분할, 품사 태깅 및 기타 작업</li>
<li>데이터 모델링 및 모델 검증을 위한 기본 제공 도구</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
</td>
<td>
<list>
<li>데이터 탐색 및 시각화</li>
</list>
</td>
<td>
<list>
<li>과학적 차트를 위한 <a href="https://openjfx.io/">JavaFX</a> 라이브러리</li>
<li>로그, 히트 맵 및 강제 유도 그래프와 같은 복잡한 차트</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
</td>
<td>
<list>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>Java용 딥 러닝 라이브러리</li>
<li>모델 가져오기 및 재학습(<a href="https://pytorch.org/">Pytorch</a>, <a href="https://www.tensorflow.org/">Tensorflow</a>, <a href="https://keras.io/">Keras</a>)</li>
<li>JVM 마이크로 서비스 환경, 모바일 장치, IoT 및 <a href="https://spark.apache.org/">Apache Spark</a>에 배포</li>
</list>
</td>
</tr>
<tr>
<td>

      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
</td>
<td>
<list>
<li>모델 구축</li>
</list>
</td>
<td>
<list>
<li>최적화 계획 문제를 위한 솔버 유틸리티</li>
<li>객체 지향 및 기능적 프로그래밍과 호환</li>
</list>
</td>
</tr>
</table>