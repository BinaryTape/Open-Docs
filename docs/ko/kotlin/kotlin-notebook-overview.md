[//]: # (title: 코틀린 노트북)

코틀린 노트북(Kotlin Notebook)은 코틀린의 모든 잠재력을 활용하여 노트북을 생성하고 편집할 수 있는 대화형 환경을 제공합니다.
코틀린 노트북은 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존하며, 이 플러그인은 IntelliJ IDEA에 기본적으로 번들로 제공되고 [활성화되어 있습니다](kotlin-notebook-set-up-env.md).

노트북은 실행 가능한 코틀린 코드와 텍스트, 결과 및 시각 자료를 혼합할 수 있는 대화형 문서입니다. 코드를 셀로 구성하고, Markdown으로 문서화하며, 코드가 생성한 출력(텍스트부터 플롯까지)을 코드와 함께 즉시 표시할 수 있는 기능이 확장된 코틀린 REPL이라고 생각해보세요.

IntelliJ IDEA 생태계 내에서 코틀린 코드를 개발하고 실험하고, 즉각적인 출력을 확인하며, 코드, 시각 자료 및 텍스트를 통합할 수 있는 원활한 코딩 경험을 준비하세요.

![코틀린 노트북](data-analysis-notebook.gif){width=700}

Kotlin Notebook 플러그인은 개발 프로세스를 향상시키는 [다양한 기능](https://www.jetbrains.com/help/idea/kotlin-notebook.html)을 제공합니다. 예를 들어:

*   셀 내에서 API에 접근
*   몇 번의 클릭으로 파일 가져오기 및 내보내기
*   빠른 프로젝트 탐색을 위한 REPL 명령 사용
*   다양한 출력 형식 지원
*   어노테이션 또는 Gradle과 유사한 문법으로 종속성 직관적으로 관리
*   한 줄의 코드로 다양한 라이브러리 가져오기 또는 프로젝트에 새 라이브러리 추가
*   오류 메시지 및 트레이스백을 통해 디버깅을 위한 통찰력 확보

코틀린 노트북은 [Jupyter Notebook용 코틀린 커널](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter)을 기반으로 하여 다른 [코틀린 노트북 솔루션](data-analysis-overview.md#notebooks)과의 통합을 쉽게 만듭니다.
호환성 문제 없이 코틀린 노트북, [Datalore](https://datalore.jetbrains.com/) 및 [코틀린-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter) 간에 작업물을 쉽게 공유할 수 있습니다.

이러한 기능을 통해 간단한 코드 실험부터 포괄적인 데이터 프로젝트에 이르기까지 광범위한 작업을 수행할 수 있습니다.

코틀린 노트북으로 무엇을 달성할 수 있는지 자세히 알아보세요!

<a href="get-started-with-kotlin-notebooks.md"><img src="notebook-get-started-button.svg" width="600" alt="코틀린 노트북 시작하기" style="block"/></a>

## 데이터 분석 및 시각화

예비 데이터 탐색을 수행하든 엔드투엔드 데이터 분석 프로젝트를 완료하든, 코틀린 노트북은 여러분에게 적합한 도구를 제공합니다.

코틀린 노트북 내에서 [라이브러리](data-analysis-libraries.md)를 직관적으로 통합하여 데이터를 검색, 변환, 플로팅 및 모델링하는 동시에 작업의 즉각적인 출력을 얻을 수 있습니다.

분석 관련 작업을 위해 [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 라이브러리는 강력한 솔루션을 제공합니다. 이 라이브러리는 구조화된 데이터 로드, 생성, 필터링 및 정리 기능을 용이하게 합니다.

Kotlin DataFrame은 또한 SQL 데이터베이스와의 원활한 연결을 지원하며 CSV, JSON, TXT를 포함한 다양한 파일 형식의 데이터를 IDE에서 직접 읽을 수 있습니다.

오픈소스 코틀린 라이브러리인 [Kandy](https://kotlin.github.io/kandy/welcome.html)를 사용하면 다양한 유형의 차트를 생성할 수 있습니다. Kandy의 관용적이고, 읽기 쉬우며, 타입 안전적인 기능은 데이터를 효과적으로 시각화하고 가치 있는 통찰력을 얻는 데 도움이 됩니다.

![데이터 분석 및 시각화](data-analysis-kandy-example.png){width=700}

## 프로토타이핑

코틀린 노트북은 코드를 작은 단위로 실행하고 결과를 실시간으로 확인할 수 있는 대화형 환경을 제공합니다. 이 실습 위주의 접근 방식은 프로토타이핑 단계에서 빠른 실험 및 반복을 가능하게 합니다.

코틀린 노트북의 도움으로 아이디어 구상 단계에서 솔루션의 개념을 조기에 테스트할 수 있습니다. 또한 코틀린 노트북은 협업 및 재현 가능한 작업을 모두 지원하여 새로운 아이디어 생성 및 평가를 지원합니다.

![코틀린 노트북 프로토타이핑](kotlin-notebook-prototyping.png){width=700}

## 백엔드 개발

코틀린 노트북은 셀 내에서 API를 호출하고 OpenAPI와 같은 프로토콜과 함께 작업할 수 있는 기능을 제공합니다. 외부 서비스 및 API와 상호 작용하는 기능은 노트북 환경 내에서 직접 정보를 검색하고 JSON 파일을 읽는 것과 같은 특정 백엔드 개발 시나리오에 유용합니다.

![코틀린 노트북 백엔드 개발](kotlin-notebook-backend-development.png){width=700}

## 코드 문서화

코틀린 노트북에서는 코드 셀 내에 인라인 주석과 텍스트 어노테이션을 포함하여 코드 스니펫과 관련된 추가 컨텍스트, 설명 및 지침을 제공할 수 있습니다.

또한 헤더, 목록, 링크, 이미지 등과 같은 다양한 서식 지정 옵션을 지원하는 Markdown 셀에 텍스트를 작성할 수도 있습니다. Markdown 셀을 렌더링하고 서식 지정된 텍스트를 보려면 코드 셀과 마찬가지로 실행하기만 하면 됩니다.

![코틀린 노트북 문서화](kotlin-notebook-documentation.png){width=700}

## 코드 및 출력 공유

코틀린 노트북이 범용 Jupyter 형식을 준수하므로 다양한 노트북 간에 코드와 출력을 공유할 수 있습니다. [Jupyter Notebook](https://jupyter.org/) 또는 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/)과 같은 모든 Jupyter 클라이언트를 사용하여 코틀린 노트북을 열고 편집하고 실행할 수 있습니다.

또한 `.ipynb` 노트북 파일을 모든 노트북 웹 뷰어와 공유하여 작업물을 배포할 수도 있습니다. 한 가지 옵션은 이 형식을 기본적으로 렌더링하는 [GitHub](https://github.com/)입니다. 다른 옵션은 예약된 노트북 실행과 같은 고급 기능으로 노트북 공유, 실행 및 편집을 용이하게 하는 [JetBrain의 Datalore](https://datalore.jetbrains.com/) 플랫폼입니다.

![코틀린 노트북 공유 - Datalore](kotlin-notebook-sharing-datalore.png){width=700}

또는 현재 노트북을 [GitHub Gist](https://gist.github.com/)로 빠르게 공유할 수 있습니다. 툴바에서 **Create Gist** 버튼을 클릭하세요.

![노트북 GitHub Gist](notebook-github-gist.png){width=400}

IntelliJ IDEA는 노트북을 GitHub 계정의 Gist로 내보내고, 노트북을 공유, 보고, 다운로드할 수 있는 URL을 제공합니다.

Gist는 노트북의 모든 코드, 출력 및 Markdown을 GitHub가 미리 보기로 렌더링할 수 있는 JSON 형식으로 보존합니다.

## 다음 단계

*   [코틀린 노트북의 사용법과 주요 기능에 대해 알아보세요.](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
*   [코틀린 노트북을 사용해 보세요.](get-started-with-kotlin-notebooks.md)
*   [데이터 분석을 위한 코틀린을 심층적으로 살펴보세요.](data-analysis-overview.md)