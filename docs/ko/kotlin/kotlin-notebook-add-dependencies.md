[//]: # (title: Kotlin Notebook에 종속성 추가하기)

<tldr>
   <p>이 문서는 <strong>Kotlin Notebook 시작하기</strong> 튜토리얼의 세 번째 파트입니다. 계속 진행하기 전에 이전 단계를 완료했는지 확인하세요.</p>
   <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계"/> <a href="kotlin-notebook-set-up-env.md">환경 설정하기</a><br/>
      <img src="icon-2-done.svg" width="20" alt="두 번째 단계"/> <a href="kotlin-notebook-create.md">Kotlin Notebook 생성하기</a><br/>
      <img src="icon-3.svg" width="20" alt="세 번째 단계"/> <strong>Kotlin Notebook에 종속성 추가하기</strong><br/>
  </p>
</tldr>

첫 [Kotlin Notebook](kotlin-notebook-overview.md)을 이미 생성했습니다! 이제 고급 기능을 사용하기 위해 라이브러리에 종속성을 추가하는 방법을 알아보겠습니다.

> Kotlin 표준 라이브러리는 별도 가져오기 없이 바로 사용할 수 있습니다.
> 
{style="note"}

어떤 코드 셀에서든 Gradle 스타일 구문을 사용하여 Maven 저장소에서 라이브러리 좌표를 지정하면 모든 라이브러리를 로드할 수 있습니다. 하지만 Kotlin Notebook은 [`%use` 문](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries) 형태의 간소화된 방법을 제공하여 인기 있는 라이브러리를 로드할 수 있습니다.

```kotlin
// libraryName을 추가하려는 라이브러리 종속성으로 바꾸세요
%use libraryName
```

Kotlin Notebook의 자동 완성 기능을 사용하여 사용 가능한 라이브러리에 빠르게 접근할 수도 있습니다.

![Kotlin Notebook의 자동 완성 기능](autocompletion-feature-notebook.png){width=700}

## Kotlin DataFrame 및 Kandy 라이브러리를 Kotlin Notebook에 추가하기

Kotlin Notebook에 두 가지 인기 있는 Kotlin 라이브러리 종속성을 추가해 보겠습니다.
* [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)는 Kotlin 프로젝트에서 데이터를 조작할 수 있는 기능을 제공합니다. 이를 사용하여 [API](data-analysis-work-with-api.md), [SQL 데이터베이스](data-analysis-connect-to-db.md) 및 CSV 또는 JSON과 같은 [다양한 파일 형식](data-analysis-work-with-data-sources.md)에서 데이터를 검색할 수 있습니다.
* [Kandy 라이브러리](https://kotlin.github.io/kandy/welcome.html)는 [차트 생성](data-analysis-visualization.md)을 위한 강력하고 유연한 DSL을 제공합니다.

이 라이브러리들을 추가하려면:

1. **코드 셀 추가**를 클릭하여 새 코드 셀을 생성합니다.
2. 코드 셀에 다음 코드를 입력합니다.

    ```kotlin
    // 사용 가능한 최신 라이브러리 버전이 사용되도록 합니다.
    %useLatestDescriptors
    
    // Kotlin DataFrame 라이브러리를 가져옵니다.
    %use dataframe
    
    // Kotlin Kandy 라이브러리를 가져옵니다.
    %use kandy
    ```

3. 코드 셀을 실행합니다.

    `%use` 문이 실행되면 라이브러리 종속성이 다운로드되고 노트북에 기본 가져오기가 추가됩니다.

    > 라이브러리에 의존하는 다른 코드 셀을 실행하기 전에 `%use libraryName` 줄이 있는 코드 셀을 실행해야 합니다.
    >
    {style="note"}

4. Kotlin DataFrame 라이브러리를 사용하여 CSV 파일에서 데이터를 가져오려면 새 코드 셀에서 `.read()` 함수를 사용합니다.

    ```kotlin
    // "netflix_titles.csv" 파일에서 데이터를 가져와 DataFrame을 생성합니다.
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 원시 DataFrame 데이터를 표시합니다.
    rawDf
    ```

    > 이 예제 CSV는 [Kotlin DataFrame 예제 GitHub 저장소](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv)에서 다운로드할 수 있습니다. 프로젝트 디렉토리에 추가하세요.
    > 
    {style="tip"}

    ![DataFrame을 사용하여 데이터 표시](add-dataframe-dependency.png){width=700}

5. 새 코드 셀에서 `.plot` 메서드를 사용하여 DataFrame에 있는 TV 쇼와 영화의 분포를 시각적으로 나타냅니다.

    ```kotlin
    rawDf
        // "type"이라는 열의 각 고유 값 발생 횟수를 계산합니다.
        .valueCounts(sort = false) { type }
        // 색상을 지정하여 막대 차트로 데이터를 시각화합니다.
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 차트 레이아웃을 구성하고 제목을 설정합니다.
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

결과 차트:

![Kandy 라이브러리를 사용한 시각화](kandy-library.png){width=700}

Kotlin Notebook에 이 라이브러리들을 추가하고 활용하신 것을 축하합니다! 이는 Kotlin Notebook과 [지원되는 라이브러리](data-analysis-libraries.md)로 달성할 수 있는 것의 일부에 불과합니다.

## 다음 단계

* [Kotlin Notebook 공유](kotlin-notebook-share.md) 방법을 알아보기
* [Kotlin Notebook에 종속성 추가](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)에 대한 더 자세한 정보 확인
* Kotlin DataFrame 라이브러리를 사용한 더 포괄적인 가이드는 [파일에서 데이터 검색](data-analysis-work-with-data-sources.md)을 참조하세요.
* Kotlin에서 데이터 과학 및 분석을 위해 사용 가능한 도구 및 리소스에 대한 포괄적인 개요는 [Kotlin 및 Java 데이터 분석 라이브러리](data-analysis-libraries.md)를 참조하세요.