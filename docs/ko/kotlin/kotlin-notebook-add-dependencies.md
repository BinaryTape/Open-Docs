---
title: "Kotlin Notebook에 종속성 추가"
---
:::info
<p>
   이 튜토리얼은 <strong>Kotlin Notebook 시작하기</strong>의 세 번째 파트입니다. 계속하기 전에 이전 단계를 완료했는지 확인하세요.
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">환경 설정</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create">Kotlin Notebook 생성</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Kotlin Notebook에 종속성 추가</strong><br/>
</p>

:::

첫 번째 [Kotlin Notebook](kotlin-notebook-overview)을 이미 만드셨습니다! 이제 고급 기능을 사용하는 데 필요한 라이브러리에 종속성을 추가하는 방법을 알아봅니다.

:::note
Kotlin 표준 라이브러리는 바로 사용할 수 있으므로 가져올 필요가 없습니다.

:::

모든 코드 셀에서 Gradle 스타일 구문을 사용하여 좌표를 지정하여 Maven 저장소에서 라이브러리를 로드할 수 있습니다.
그러나 Kotlin Notebook에는 [`%use` statement](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries) 형태로 인기 있는 라이브러리를 로드하는 간소화된 방법이 있습니다.

```kotlin
// libraryName을 추가하려는 라이브러리 종속성으로 바꿉니다.
%use libraryName
```

Kotlin Notebook에서 자동 완성 기능을 사용하여 사용 가능한 라이브러리에 빠르게 액세스할 수도 있습니다.

<img src="/img/autocompletion-feature-notebook.png" alt="Autocompletion feature in Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Kotlin Notebook에 Kotlin DataFrame 및 Kandy 라이브러리 추가

이제 두 개의 인기 있는 Kotlin 라이브러리 종속성을 Kotlin Notebook에 추가해 보겠습니다.
* [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html)는 Kotlin 프로젝트에서 데이터를 조작할 수 있는 기능을 제공합니다.
[API](data-analysis-work-with-api), [SQL databases](data-analysis-connect-to-db) 및 CSV 또는 JSON과 같은 [다양한 파일 형식](data-analysis-work-with-data-sources)에서 데이터를 검색하는 데 사용할 수 있습니다.
* [Kandy library](https://kotlin.github.io/kandy/welcome.html)는 [차트 생성](data-analysis-visualization)을 위한 강력하고 유연한 DSL을 제공합니다.

이러한 라이브러리를 추가하려면 다음을 수행하세요.

1. **Add Code Cell**을 클릭하여 새 코드 셀을 만듭니다.
2. 코드 셀에 다음 코드를 입력합니다.

    ```kotlin
    // 사용 가능한 최신 라이브러리 버전을 사용하도록 합니다.
    %useLatestDescriptors
    
    // Kotlin DataFrame 라이브러리를 가져옵니다.
    %use dataframe
    
    // Kotlin Kandy 라이브러리를 가져옵니다.
    %use kandy
    ```

3. 코드 셀을 실행합니다.

    `%use` statement가 실행되면 라이브러리 종속성을 다운로드하고 기본 imports를 노트북에 추가합니다.

    > `%use libraryName` 줄이 있는 코드 셀을 실행하기 전에 해당 라이브러리에 의존하는 다른 코드 셀을 실행해야 합니다.
    >
    

4. Kotlin DataFrame 라이브러리를 사용하여 CSV 파일에서 데이터를 가져오려면 새 코드 셀에서 `.read()` 함수를 사용합니다.

    ```kotlin
    // "netflix_titles.csv" 파일에서 데이터를 가져와 DataFrame을 만듭니다.
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 원시 DataFrame 데이터를 표시합니다.
    rawDf
    ```

    > [Kotlin DataFrame examples GitHub repository](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv)에서 이 예제 CSV를 다운로드할 수 있습니다.
    > 프로젝트 디렉토리에 추가합니다.
    > 
    

    <img src="/img/add-dataframe-dependency.png" alt="Using DataFrame to display data" width="700" style={{verticalAlign: 'middle'}}/>

5. 새 코드 셀에서 `.plot` 메서드를 사용하여 DataFrame에서 TV 프로그램 및 영화의 분포를 시각적으로 나타냅니다.

    ```kotlin
    rawDf
        // "type"이라는 열에서 각 고유 값의 발생 횟수를 계산합니다.
        .valueCounts(sort = false) { type }
        // 색상을 지정하여 막대 차트에서 데이터를 시각화합니다.
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 차트의 레이아웃을 구성하고 제목을 설정합니다.
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

결과 차트:

<img src="/img/kandy-library.png" alt="Visualization using the Kandy library" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebook에서 이러한 라이브러리를 추가하고 활용하신 것을 축하드립니다!
이것은 Kotlin Notebook과 [지원되는 라이브러리](data-analysis-libraries)로 달성할 수 있는 것의 단편적인 예일 뿐입니다.

## 다음 단계

* [Kotlin Notebook 공유](kotlin-notebook-share) 방법을 알아봅니다.
* [Kotlin Notebook에 종속성을 추가](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)하는 방법에 대한 자세한 내용을 참조하십시오.
* Kotlin DataFrame 라이브러리를 사용하는 보다 광범위한 가이드는 [파일에서 데이터 검색](data-analysis-work-with-data-sources)을 참조하십시오.
* Kotlin의 데이터 과학 및 분석에 사용할 수 있는 도구 및 리소스에 대한 광범위한 개요는 [데이터 분석을 위한 Kotlin 및 Java 라이브러리](data-analysis-libraries)를 참조하십시오.