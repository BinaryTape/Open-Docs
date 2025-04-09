---
title: "Kotlin Notebook"
---
[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)은 IntelliJ IDEA용 동적 플러그인으로, Kotlin의 모든 잠재력을 활용하여 노트북을 생성하고 편집할 수 있는 대화형 환경을 제공합니다.

:::note
Kotlin Notebook 플러그인을 사용하려면 IntelliJ IDEA Ultimate가 필요합니다.

:::

IntelliJ IDEA 에코시스템 내에서 Kotlin 코드를 개발 및 실험하고, 즉각적인 출력을 받고, 코드, 시각 자료 및 텍스트를 통합할 수 있는 원활한 코딩 경험을 준비하세요.

<img src="/img/data-analysis-notebook.gif" alt="Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebook 플러그인은 개발 프로세스를 향상시키는 [다양한 기능](https://www.jetbrains.com/help/idea/kotlin-notebook.html)을 제공합니다.

* 셀 내에서 API 액세스
* 몇 번의 클릭으로 파일 가져오기 및 내보내기
* 빠른 프로젝트 탐색을 위한 REPL 명령 사용
* 다양한 출력 형식 얻기
* 어노테이션 또는 Gradle과 유사한 구문을 사용하여 직관적으로 종속성 관리
* 단 한 줄의 코드로 다양한 라이브러리 가져오기 또는 프로젝트에 새 라이브러리 추가
* 오류 메시지 및 추적을 통한 디버깅 인사이트 얻기

Kotlin Notebook은 [Jupyter Notebook용 Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)을 기반으로 하므로 다른 [Kotlin 노트북 솔루션](data-analysis-overview#notebooks)과 쉽게 통합할 수 있습니다.
호환성 문제 없이 Kotlin Notebook,
[Datalore](https://datalore.jetbrains.com/), [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 간에 작업을 쉽게 공유할 수 있습니다.

이러한 기능을 통해 간단한 코드 실험부터 포괄적인 데이터 프로젝트까지 광범위한 작업을 수행할 수 있습니다.

아래 섹션에서 Kotlin Notebook으로 무엇을 달성할 수 있는지 자세히 알아보세요!

## 데이터 분석 및 시각화

예비 데이터 탐색을 수행하든, 엔드 투 엔드 데이터 분석 프로젝트를 완료하든, Kotlin Notebook에는 적합한 도구가 있습니다.

Kotlin Notebook 내에서 데이터를 검색, 변환, 플롯 및 모델링할 수 있는 [라이브러리](data-analysis-libraries)를 직관적으로 통합하고 작업에 대한 즉각적인 출력을 얻을 수 있습니다.

분석 관련 작업의 경우 [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 라이브러리는 강력한 솔루션을 제공합니다. 이 라이브러리는 구조화된 데이터의 로드, 생성, 필터링 및 정리 작업을 용이하게 합니다.

Kotlin DataFrame은 또한 SQL 데이터베이스와의 원활한 연결을 지원하며 CSV, JSON 및 TXT를 포함한 다양한 파일 형식에서 IDE에서 직접 데이터를 읽습니다.

[Kandy](https://kotlin.github.io/kandy/welcome.html)는 오픈 소스 Kotlin 라이브러리로, 다양한 유형의 차트를 만들 수 있습니다.
Kandy의 관용적이고 읽기 쉽고 유형 안전한 기능을 통해 데이터를 효과적으로 시각화하고 귀중한 통찰력을 얻을 수 있습니다.

<img src="/img/data-analysis-kandy-example.png" alt="data-analytics-and-visualization" width="700" style={{verticalAlign: 'middle'}}/>

## 프로토타입 제작

Kotlin Notebook은 작은 덩어리로 코드를 실행하고 결과를 실시간으로 볼 수 있는 대화형 환경을 제공합니다.
이러한 실습 방식은 프로토타입 제작 단계에서 빠른 실험과 반복을 가능하게 합니다.

Kotlin Notebook을 사용하면 아이디어 구상 단계 초기에 솔루션 개념을 테스트할 수 있습니다. 또한 Kotlin Notebook은 협업 및 재현 가능한 작업을 모두 지원하여 새로운 아이디어를 생성하고 평가할 수 있습니다.

<img src="/img/kotlin-notebook-prototyping.png" alt="kotlin-notebook-prototyping" width="700" style={{verticalAlign: 'middle'}}/>

## 백엔드 개발

Kotlin Notebook은 셀 내에서 API를 호출하고 OpenAPI와 같은 프로토콜을 사용하여 작업할 수 있는 기능을 제공합니다. 외부 서비스 및 API와 상호 작용하는 기능은 정보를 검색하고 노트북 환경 내에서 직접 JSON 파일을 읽는 것과 같은 특정 백엔드 개발 시나리오에 유용합니다.

<img src="/img/kotlin-notebook-backend-development.png" alt="kotlin-notebook-backend-development" width="700" style={{verticalAlign: 'middle'}}/>

## 코드 문서화

Kotlin Notebook에서는 코드 셀 내에 인라인 주석과 텍스트 어노테이션을 포함하여 코드 스니펫과 관련된 추가 컨텍스트, 설명 및 지침을 제공할 수 있습니다.

헤더, 목록, 링크, 이미지 등과 같은 다양한 서식 옵션을 지원하는 Markdown 셀에 텍스트를 작성할 수도 있습니다.
Markdown 셀을 렌더링하고 서식이 지정된 텍스트를 보려면 코드 셀과 마찬가지로 실행하기만 하면 됩니다.

<img src="/img/kotlin-notebook-documentation.png" alt="kotlin-notebook-documenting" width="700" style={{verticalAlign: 'middle'}}/>

## 코드 및 출력 공유

Kotlin Notebook은 범용 Jupyter 형식을 준수하므로 다양한 노트북에서 코드와 출력을 공유할 수 있습니다.
[Jupyter Notebook](https://jupyter.org/) 또는 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)과 같은 모든 Jupyter 클라이언트에서 Kotlin Notebook을 열고 편집하고 실행할 수 있습니다.

`.ipynb` 노트북 파일을 노트북 웹 뷰어와 공유하여 작업을 배포할 수도 있습니다. 한 가지 옵션은 이 형식을 기본적으로 렌더링하는 [GitHub](https://github.com/)입니다. 또 다른 옵션은 예약된 노트북 실행과 같은 고급 기능을 통해 노트북 공유, 실행 및 편집을 용이하게 하는 [JetBrain's Datalore](https://datalore.jetbrains.com/) 플랫폼입니다.

<img src="/img/kotlin-notebook-sharing-datalore.png" alt="kotlin-notebook-sharing-datalore" width="700" style={{verticalAlign: 'middle'}}/>

## 다음 단계

* [Kotlin Notebook의 사용법 및 주요 기능에 대해 알아보세요.](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [Kotlin Notebook을 사용해 보세요.](get-started-with-kotlin-notebooks)
* [데이터 분석을 위한 Kotlin에 대해 자세히 알아보세요.](data-analysis-overview)