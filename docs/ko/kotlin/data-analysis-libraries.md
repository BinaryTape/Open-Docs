[//]: # (title: 데이터 분석을 위한 Kotlin 및 Java 라이브러리)

데이터 수집부터 모델 구축에 이르기까지, Kotlin은 데이터 파이프라인의 다양한 작업을 용이하게 하는 강력한 라이브러리를 제공합니다.

자체 라이브러리 외에도 Kotlin은 Java와 100% 상호 운용됩니다. 이러한 상호 운용성을 통해 검증되고 성능이 뛰어난 Java 라이브러리의 전체 생태계를 활용할 수 있습니다. 이러한 이점을 통해 [Kotlin 데이터 프로젝트](data-analysis-overview.md) 작업 시 Kotlin 또는 Java 라이브러리를 쉽게 사용할 수 있습니다.

## Kotlin 라이브러리

<table>
  <tr>
    <td><strong>라이브러리</strong></td>
    <td><strong>목적</strong></td>
    <td><strong>기능</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 수집</li>
        <li>데이터 정제 및 처리</li>
      </list>
    </td>
    <td>
      <list>
        <li>데이터 프레임 생성, 정렬, 정제, 피처 엔지니어링 등을 위한 작업</li>
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
        <li>다양한 유형의 차트를 플로팅하기 위한 강력하고 가독성 높으며 타입 안전한 DSL</li>
        <li>JVM용 Kotlin으로 작성된 오픈소스 라이브러리</li>
        <li><a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>, <a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a>, <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a> 지원</li>
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
        <li><a href="https://keras.io/">Keras</a>에서 영감을 받아 Kotlin으로 작성된 딥러닝 API</li>
        <li>딥러닝 모델을 처음부터 학습하거나 기존 Keras 및 ONNX 모델을 가져와 추론에 활용</li>
        <li>기존 사전 학습된 모델을 사용자 작업에 맞게 조정하기 위한 전이 학습</li>
        <li><a href="https://developer.android.com/about">Android 플랫폼</a> 지원</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>다차원 배열에 대한 수학 연산 (선형 대수, 통계, 산술 및 기타 계산)</li>
        <li>배열 생성, 복사, 인덱싱, 슬라이싱 및 기타 배열 작업</li>
        <li>타입 및 차원 안전성, 교체 가능한 연산 엔진 등의 이점을 가진 Kotlin 숙어적 라이브러리로, JVM 또는 네이티브 코드에서 실행</li>
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
        <li>데이터 정제 및 처리</li>
        <li>데이터 탐색 및 시각화</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a>와 Kotlin 간의 호환성 레이어</li>
        <li>Kotlin 숙어적 코드에서의 Apache Spark 데이터 변환 작업</li>
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
        <li><a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>, <a href="https://datalore.jetbrains.com/">Datalore</a>, <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a> 지원</li>
        <li>JVM, JS 및 Python과 호환</li>
        <li><a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 애플리케이션에 차트 삽입</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
        <li>데이터 탐색 및 시각화</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM, JS, Native, Wasm)에서 수학적 추상화를 다루기 위한 모듈형 라이브러리</li>
        <li>대수 구조, 수학 표현식, 히스토그램 및 스트리밍 작업을 위한 API</li>
        <li><a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>, <a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>, <a href="https://github.com/Kotlin/multik">Multik</a>를 포함한 기존 Java 및 Kotlin 라이브러리에 대한 교체 가능한 래퍼</li>
        <li>Python의 <a href="https://numpy.org/">NumPy</a>에서 영감을 받았지만 타입 안전성과 같은 추가 기능 포함</li>
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
        <li>테이블 형식 데이터 시각화</li>
        <li>R의 <a href="https://ggplot2.tidyverse.org/">ggplot</a>에서 영감</li>
        <li><a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a> 지원</li>
      </list>
    </td>
  </tr>
</table>

## Java 라이브러리

Kotlin은 Java와 일급 상호 운용성을 제공하므로, Kotlin 코드에서 데이터 작업을 위해 Java 라이브러리를 사용할 수 있습니다. 다음은 그러한 라이브러리의 몇 가지 예시입니다:

<table>
  <tr>
    <td><strong>라이브러리</strong></td>
    <td><strong>목적</strong></td>
    <td><strong>기능</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 수집</li>
        <li>데이터 정제 및 처리</li>
        <li>데이터 탐색 및 시각화</li>
      </list>
    </td>
    <td>
      <list>
        <li>데이터 로드, 정제, 변환, 필터링 및 요약을 위한 도구</li>
        <li><a href="https://plotly.com/">Plot.ly</a>에서 영감</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
      </list>
    </td>
    <td>
      <list>
        <li>자연어 처리 툴킷</li>
        <li>텍스트에 대한 감성 및 인용 속성과 같은 언어학적 주석</li>
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
        <li>데이터 정제 및 처리</li>
        <li>데이터 탐색 및 시각화</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>기계 학습 및 자연어 처리를 위한 기성 알고리즘</li>
        <li>선형 대수, 그래프, 보간 및 시각화 도구</li>
        <li>함수형 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>, <a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>, <a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a> 등을 제공</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
      </list>
    </td>
    <td>
      <list>
        <li>Smile의 자연어 처리 부분을 위한 <a href="https://www.scala-lang.org/api/current/">Scala</a> implicits의 Kotlin 재작성</li>
        <li>Kotlin 확장 함수 및 인터페이스 형식의 연산</li>
        <li>문장 분리, 어간 추출, Bag-of-Words 및 기타 작업</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>JVM용 행렬 수학 라이브러리</li>
        <li>500개 이상의 수학, 선형 대수 및 딥러닝 연산</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java용 수학 및 통계 연산</li>
        <li>상관 관계, 분포, 선형 대수, 기하학 및 기타 연산</li>
        <li>기계 학습 모델</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
    </td>
    <td>
      <list>
        <li>데이터 정제 및 처리</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>수치 알고리즘의 Java 수학 라이브러리</li>
        <li>객체 지향 수치 메서드</li>
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
        <li>데이터 정제 및 처리</li>
        <li>모델 구축</li>
      </list>
    </td>
    <td>
      <list>
        <li>자연어 텍스트 처리를 위한 기계 학습 기반 툴킷</li>
        <li>토큰화, 문장 분리, 품사 태깅 및 기타 작업</li>
        <li>데이터 모델링 및 모델 유효성 검사를 위한 내장 도구</li>
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
        <li>과학 차트를 위한 <a href="https://openjfx.io/">JavaFX</a> 라이브러리</li>
        <li>로그, 히트맵, 힘 지향 그래프와 같은 복합 차트</li>
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
        <li>Java용 딥러닝 라이브러리</li>
        <li>모델 가져오기 및 재학습 (<a href="https://pytorch.org/">Pytorch</a>, <a href="https://www.tensorflow.org/">Tensorflow</a>, <a href="https://keras.io/">Keras</a>)</li>
        <li>JVM 마이크로서비스 환경, 모바일 장치, IoT 및 <a href="https://spark.apache.org/">Apache Spark</a>에 배포</li>
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
        <li>최적화 계획 문제 해결 유틸리티</li>
        <li>객체 지향 및 함수형 프로그래밍과 호환</li>
      </list>
    </td>
  </tr>
</table>