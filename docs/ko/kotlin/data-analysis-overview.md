[//]: # (title: 데이터 분석을 위한 Kotlin)

데이터를 탐색하고 분석하는 것은 매일 하는 일은 아니지만, 소프트웨어 개발자로서 필요한 중요한 기술입니다.

데이터 분석이 핵심인 소프트웨어 개발 업무를 생각해 봅시다: 디버깅 시 컬렉션 내부에 실제로 무엇이 있는지 분석하는 것, 메모리 덤프 또는 데이터베이스를 깊이 파고드는 것, 또는 REST API 작업 시 대량의 데이터가 포함된 JSON 파일을 수신하는 것 등을 예로 들 수 있습니다.

[Kotlin 노트북](#notebooks), [Kotlin DataFrame](#kotlin-dataframe), [Kandy](#kandy)와 같은 Kotlin의 탐색적 데이터 분석(EDA) 도구를 사용하면 분석 기술을 향상하고 다양한 시나리오에서 지원하는 풍부한 기능을 활용할 수 있습니다:

*   **다양한 형식의 데이터 로드, 변환 및 시각화:** Kotlin EDA 도구를 사용하면 데이터를 필터링, 정렬 및 집계하는 등의 작업을 수행할 수 있습니다. 당사의 도구는 IDE에서 CSV, JSON, TXT를 포함한 다양한 파일 형식의 데이터를 원활하게 읽을 수 있습니다.

    플로팅 도구인 Kandy를 사용하면 광범위한 차트를 생성하여 데이터세트를 시각화하고 통찰력을 얻을 수 있습니다.

*   **관계형 데이터베이스에 저장된 데이터 효율적으로 분석:** Kotlin DataFrame은 데이터베이스와 원활하게 통합되며 SQL 쿼리와 유사한 기능을 제공합니다. 다양한 데이터베이스에서 데이터를 직접 검색, 조작 및 시각화할 수 있습니다.

*   **웹 API에서 실시간 및 동적 데이터세트 가져오기 및 분석:** EDA 도구의 유연성 덕분에 OpenAPI와 같은 프로토콜을 통해 외부 API와 통합할 수 있습니다. 이 기능을 통해 웹 API에서 데이터를 가져온 다음, 필요에 맞게 데이터를 정리하고 변환할 수 있습니다.

데이터 분석을 위한 Kotlin 도구를 사용해 보시겠습니까?

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Kotlin Notebook 시작하기" style="block"/></a>

Kotlin 데이터 분석 도구를 사용하면 데이터를 처음부터 끝까지 원활하게 처리할 수 있습니다. Kotlin Notebook에서 간단한 드래그 앤 드롭 기능으로 데이터를 손쉽게 가져올 수 있습니다. 몇 줄의 코드만으로 데이터를 정리, 변환 및 시각화할 수 있습니다. 또한 몇 번의 클릭만으로 결과 차트를 내보낼 수 있습니다.

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## 노트북

_노트북_은 실행 가능한 Kotlin 코드와 텍스트, 시각화 및 결과물을 혼합할 수 있는 대화형 문서입니다. 코드를 셀로 구성하고, Markdown으로 문서화하며, 코드가 생성한 텍스트부터 플롯에 이르는 출력을 코드와 함께 즉시 표시하는 기능을 확장한 Kotlin REPL이라고 생각할 수 있습니다.

Kotlin은 [Kotlin Notebook](#kotlin-notebook), [Datalore](#kotlin-notebooks-in-datalore), [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)과 같은 다양한 노트북 솔루션을 제공하여 데이터 검색, 변환, 탐색, 모델링 등을 위한 편리한 기능을 제공합니다. 이러한 Kotlin 노트북 솔루션은 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)을 기반으로 합니다.

Kotlin Notebook, Datalore, Kotlin-Jupyter Notebook 간에 코드를 원활하게 공유할 수 있습니다. 당사의 Kotlin 노트북 중 하나에서 프로젝트를 생성하고 호환성 문제 없이 다른 노트북에서 계속 작업할 수 있습니다.

강력한 Kotlin 노트북의 기능과 Kotlin으로 코딩하는 장점을 활용해 보세요. Kotlin은 이러한 노트북과 통합되어 데이터를 관리하고 동료들과 결과를 공유하는 동시에 데이터 과학 및 머신러닝 기술을 구축하는 데 도움을 줍니다.

다양한 Kotlin 노트북 솔루션의 기능을 살펴보고 프로젝트 요구 사항에 가장 적합한 솔루션을 선택하세요.

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview.md)은 IntelliJ IDEA용 플러그인으로, Kotlin에서 노트북을 생성할 수 있도록 합니다. 모든 일반적인 IDE 기능을 통해 IDE 경험을 제공하며, 실시간 코드 인사이트 및 프로젝트 통합을 제공합니다.

### Datalore의 Kotlin 노트북

[Datalore](https://datalore.jetbrains.com/)를 사용하면 추가 설치 없이 브라우저에서 바로 Kotlin을 사용할 수 있습니다. 또한 노트북을 공유하고 원격으로 실행할 수 있으며, 다른 Kotlin 노트북과 실시간으로 협업하고, 코드를 작성할 때 스마트 코딩 지원을 받으며, 대화형 또는 정적 보고서를 통해 결과를 내보낼 수 있습니다.

### Kotlin Kernel이 포함된 Jupyter Notebook

[Jupyter Notebook](https://jupyter.org/)은 코드, 시각화 및 마크다운 텍스트를 포함하는 문서를 생성하고 공유할 수 있는 오픈 소스 웹 애플리케이션입니다. [Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter)는 Jupyter 환경 내에서 Kotlin의 강력한 기능을 활용하기 위해 Jupyter Notebook에 Kotlin 지원을 제공하는 오픈 소스 프로젝트입니다.

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 라이브러리를 사용하면 Kotlin 프로젝트에서 구조화된 데이터를 조작할 수 있습니다. 데이터 생성 및 정리부터 심층 분석 및 피처 엔지니어링에 이르기까지 이 라이브러리가 모든 것을 지원합니다.

Kotlin DataFrame 라이브러리를 사용하면 CSV, JSON, XLS, XLSX를 포함한 다양한 파일 형식으로 작업할 수 있습니다. 이 라이브러리는 SQL 데이터베이스 또는 API와 연결할 수 있는 기능을 통해 데이터 검색 프로세스를 용이하게 합니다.

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html)는 다양한 유형의 차트를 플로팅하기 위한 강력하고 유연한 DSL을 제공하는 오픈 소스 Kotlin 라이브러리입니다. 이 라이브러리는 데이터를 시각화하는 간단하고 관용적이며 읽기 쉽고 타입 세이프한 도구입니다.

Kandy는 Kotlin Notebook, Datalore, Kotlin-Jupyter Notebook과 원활하게 통합됩니다. 또한 Kandy 및 Kotlin DataFrame 라이브러리를 쉽게 결합하여 다양한 데이터 관련 작업을 완료할 수 있습니다.

![Kandy](data-analysis-kandy-example.png){width=700}

## 다음 단계

*   [Kotlin Notebook 시작하기](get-started-with-kotlin-notebooks.md)
*   [Kotlin DataFrame 라이브러리를 사용하여 데이터 검색 및 변환](data-analysis-work-with-data-sources.md)
*   [Kandy 라이브러리를 사용하여 데이터 시각화](data-analysis-visualization.md)
*   [데이터 분석을 위한 Kotlin 및 Java 라이브러리에 대해 자세히 알아보기](data-analysis-libraries.md)