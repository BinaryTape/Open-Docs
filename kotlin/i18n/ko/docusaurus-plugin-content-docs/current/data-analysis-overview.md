---
title: "데이터 분석을 위한 Kotlin"
---
데이터 탐색 및 분석은 매일 하는 일은 아닐 수 있지만 소프트웨어 개발자에게 꼭 필요한 기술입니다.

디버깅 시 컬렉션 내부를 실제로 분석하거나, 메모리 덤프 또는 데이터베이스를 자세히 살펴보거나, REST API를 사용할 때 대량의 데이터가 포함된 JSON 파일을 수신하는 등 데이터 분석이 중요한 소프트웨어 개발 업무에 대해 생각해 보겠습니다.

Kotlin의 EDA(Exploratory Data Analysis) 도구([Kotlin 노트북](#notebooks), [Kotlin DataFrame](#kotlin-dataframe), [Kandy](#kandy) 등)를 사용하면
다양한 시나리오에서 분석 기술을 향상하고 지원하는 풍부한 기능들을 활용할 수 있습니다.

* **다양한 형식으로 데이터를 로드, 변환 및 시각화:** Kotlin EDA 도구를 사용하면 데이터를 필터링, 정렬 및 집계하는 등의 작업을 수행할 수 있습니다. 당사의 도구는 CSV, JSON 및 TXT를 포함한 다양한 파일 형식에서 IDE에서 바로 데이터를 원활하게 읽을 수 있습니다.

    플로팅 도구인 Kandy를 사용하면 다양한 차트를 만들어 데이터 세트에서 시각화하고 인사이트를 얻을 수 있습니다.

* **관계형 데이터베이스에 저장된 데이터를 효율적으로 분석:** Kotlin DataFrame은 데이터베이스와 원활하게 통합되며 SQL 쿼리와 유사한 기능을 제공합니다.
다양한 데이터베이스에서 직접 데이터를 검색, 조작 및 시각화할 수 있습니다.

* **웹 API에서 실시간 및 동적 데이터 세트를 가져와서 분석:** EDA 도구의 유연성을 통해 OpenAPI와 같은 프로토콜을 통해 외부 API와 통합할 수 있습니다.
이 기능을 사용하면 웹 API에서 데이터를 가져온 다음 필요에 따라 데이터를 정리하고 변환할 수 있습니다.

데이터 분석을 위해 Kotlin 도구를 사용해 보시겠습니까?

<a href="get-started-with-kotlin-notebooks"><img src="/img/kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" /></a>

Kotlin 데이터 분석 도구를 사용하면 처음부터 끝까지 데이터를 원활하게 처리할 수 있습니다. Kotlin Notebook에서 간단한 드래그 앤 드롭 기능으로 데이터를 쉽게 검색할 수 있습니다. 몇 줄의 코드로 정리, 변환 및 시각화할 수 있습니다.
또한 몇 번의 클릭만으로 출력 차트를 내보낼 수 있습니다.

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Notebooks

_Notebooks_는 코드, 그래픽 및 텍스트를 단일 환경에 통합하는 대화형 편집기입니다. 노트북을 사용할 때
코드 셀을 실행하고 출력을 즉시 볼 수 있습니다.

Kotlin은 [Kotlin Notebook](#kotlin-notebook), [Datalore](#kotlin-notebooks-in-datalore) 및 [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel)과 같은 다양한 노트북 솔루션을 제공하여 데이터 검색, 변환, 탐색, 모델링 등에 편리한 기능을 제공합니다.
이러한 Kotlin 노트북 솔루션은 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter)을 기반으로 합니다.

Kotlin Notebook, Datalore 및 Kotlin-Jupyter Notebook 간에 코드를 원활하게 공유할 수 있습니다. Kotlin 노트북 중 하나에서 프로젝트를 만들고
호환성 문제 없이 다른 노트북에서 계속 작업할 수 있습니다.

강력한 Kotlin 노트북의 기능과 Kotlin 코딩의 장점을 활용하십시오. Kotlin은 이러한 노트북과 통합되어
데이터를 관리하고 데이터 과학 및 머신 러닝 기술을 구축하면서 동료와 결과를 공유할 수 있도록 도와줍니다.

다양한 Kotlin 노트북 솔루션의 기능을 살펴보고 프로젝트 요구 사항에 가장 적합한 솔루션을 선택하십시오.

<img src="/img/kotlin-notebook.png" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

### Kotlin Notebook

[Kotlin Notebook](kotlin-notebook-overview)은 Kotlin으로 노트북을 만들 수 있는 IntelliJ IDEA용 플러그인입니다. 모든 일반적인 IDE 기능과 함께 당사의 IDE 환경을 제공하여
실시간 코드 인사이트와 프로젝트 통합을 제공합니다.

### Kotlin notebooks in Datalore

[Datalore](https://datalore.jetbrains.com/)를 사용하면 추가 설치 없이 즉시 브라우저에서 Kotlin을 사용할 수 있습니다.
노트북을 공유하고 원격으로 실행하고, 실시간으로 다른 Kotlin 노트북과 협업하고,
코드를 작성할 때 스마트 코딩 지원을 받고, 대화형 또는 정적 보고서를 통해 결과를 내보낼 수도 있습니다.

### Jupyter Notebook with Kotlin Kernel

[Jupyter Notebook](https://jupyter.org/)은 코드가 포함된 문서를 만들고 공유할 수 있는 오픈 소스 웹 애플리케이션입니다.
시각화 및 Markdown 텍스트.
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter)는 Jupyter 환경 내에서 Kotlin의 기능을 활용하기 위해 Kotlin을
Jupyter Notebook에 지원하는 오픈 소스 프로젝트입니다.

## Kotlin DataFrame

[Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 라이브러리를 사용하면 Kotlin 프로젝트에서 구조화된 데이터를 조작할 수 있습니다. 데이터 생성 및
정리부터 심층 분석 및 기능 엔지니어링까지 이 라이브러리로 처리할 수 있습니다.

Kotlin DataFrame 라이브러리를 사용하면 CSV, JSON, XLS 및 XLSX를 포함한 다양한 파일 형식으로 작업할 수 있습니다. 이 라이브러리는 또한 SQL 데이터베이스 또는 API에 연결하는 기능으로 데이터 검색 프로세스를 용이하게 합니다.

<img src="/img/data-analysis-dataframe-example.png" alt="Kotlin DataFrame" width="700" style={{verticalAlign: 'middle'}}/>

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html)는 다양한 유형의 차트를 플로팅하기 위한 강력하고 유연한 DSL을 제공하는 오픈 소스 Kotlin 라이브러리입니다.
이 라이브러리는 데이터를 시각화하는 간단하고 관용적이며 읽기 쉽고 유형 안전 도구입니다.

Kandy는 Kotlin Notebook, Datalore 및 Kotlin-Jupyter Notebook과 원활하게 통합됩니다. Kandy 및
Kotlin DataFrame 라이브러리를 쉽게 결합하여 다양한 데이터 관련 작업을 완료할 수도 있습니다.

<img src="/img/data-analysis-kandy-example.png" alt="Kandy" width="700" style={{verticalAlign: 'middle'}}/>

## What's next

* [Get started with Kotlin Notebook](get-started-with-kotlin-notebooks)
* [Retrieve and transform data using the Kotlin DataFrame library](data-analysis-work-with-data-sources)
* [Visualize data using the Kandy library](data-analysis-visualization)
* [Learn more about Kotlin and Java libraries for data analysis](data-analysis-libraries)