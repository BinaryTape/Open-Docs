[//]: # (title: 웹 소스 및 API에서 데이터 가져오기)

[Kotlin Notebook](kotlin-notebook-overview.md)은 다양한 웹 소스 및 API에서 데이터에 접근하고 조작하기 위한 강력한 플랫폼을 제공합니다. 이는 모든 단계를 명확하게 시각화할 수 있는 반복적인 환경을 제공하여 데이터 추출 및 분석 작업을 단순화합니다. 따라서 익숙하지 않은 API를 탐색할 때 특히 유용합니다.

[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)와 함께 사용될 때, Kotlin Notebook은 API에서 JSON 데이터를 연결하고 가져올 수 있을 뿐만 아니라, 포괄적인 분석 및 시각화를 위해 이 데이터를 재구성하는 데도 도움을 줍니다.

> Kotlin Notebook 예시를 보려면 [GitHub의 DataFrame 예시](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)를 참조하세요.
> 
{style="tip"}

## 시작하기 전에

Kotlin Notebook은 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존하며, 이 플러그인은 IntelliJ IDEA에 기본으로 번들되어 활성화되어 있습니다.

Kotlin Notebook 기능이 제공되지 않는 경우, 플러그인이 활성화되어 있는지 확인하세요. 자세한 내용은 [환경 설정](kotlin-notebook-set-up-env.md)을 참조하세요.

새 Kotlin Notebook 생성:

1.  **File** | **New** | **Kotlin Notebook**을 선택합니다.
2.  Kotlin Notebook에서 다음 명령을 실행하여 Kotlin DataFrame 라이브러리를 임포트합니다:

    ```kotlin
    %use dataframe
    ```

## API에서 데이터 가져오기

Kotlin DataFrame 라이브러리가 포함된 Kotlin Notebook을 사용하여 API에서 데이터를 가져오는 것은 CSV 또는 JSON과 같은 [파일에서 데이터를 검색하는 것](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)과 유사하게 [`.read()`](https://kotlin.github.io/dataframe/read.html) 함수를 통해 이루어집니다. 하지만 웹 기반 소스와 작업할 때는 원시 API 데이터를 구조화된 형식으로 변환하기 위한 추가적인 포맷팅이 필요할 수 있습니다.

[YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com)에서 데이터를 가져오는 예시를 살펴보겠습니다:

1.  Kotlin Notebook 파일(`.ipynb`)을 엽니다.

2.  데이터 조작 작업에 필수적인 Kotlin DataFrame 라이브러리를 임포트합니다. 이 작업은 코드 셀에서 다음 명령을 실행하여 수행됩니다:

    ```kotlin
    %use dataframe
    ```

3.  YouTube Data API에 대한 요청을 인증하는 데 필요한 API 키를 새 코드 셀에 안전하게 추가합니다. API 키는 [credentials 탭](https://console.cloud.google.com/apis/credentials)에서 얻을 수 있습니다:

    ```kotlin
    val apiKey = "YOUR-API_KEY"
    ```

4.  문자열로 경로를 받아 DataFrame의 `.read()` 함수를 사용하여 YouTube Data API에서 데이터를 가져오는 `load` 함수를 생성합니다:

    ```kotlin
    fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
    ```

5.  가져온 데이터를 행으로 구성하고 `nextPageToken`을 통해 YouTube API의 페이지네이션을 처리합니다. 이를 통해 여러 페이지에 걸쳐 데이터를 수집할 수 있습니다:

    ```kotlin
    fun load(path: String, maxPages: Int): AnyFrame {
    
        // 데이터 행을 저장할 가변 리스트를 초기화합니다.
        val rows = mutableListOf<AnyRow>()
    
        // 데이터 로드를 위한 초기 페이지 경로를 설정합니다.
        var pagePath = path
        do {
    
            // 현재 페이지 경로에서 데이터를 로드합니다.
            val row = load(pagePath)
            // 로드된 데이터를 행으로 리스트에 추가합니다.
            rows.add(row)
           
            // 다음 페이지의 토큰이 있다면 검색합니다.
            val next = row.getValueOrNull<String>("nextPageToken")
            // 새 토큰을 포함하여 다음 반복을 위한 페이지 경로를 업데이트합니다.
            pagePath = path + "&pageToken=" + next
    
            // 다음 페이지가 없을 때까지 페이지 로드를 계속합니다.
        } while (next != null && rows.size < maxPages) 
        
        // 로드된 모든 행을 DataFrame으로 연결하여 반환합니다.
        return rows.concat() 
    }
    ```

6.  이전에 정의된 `load()` 함수를 사용하여 데이터를 가져오고 새 코드 셀에 DataFrame을 생성합니다. 이 예시는 Kotlin과 관련된 데이터를, 이 경우 동영상을, 페이지당 최대 50개의 결과로 최대 5페이지까지 가져옵니다. 결과는 `df` 변수에 저장됩니다:

    ```kotlin
    val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
    df
    ```

7.  마지막으로 DataFrame에서 아이템을 추출하고 연결합니다:

    ```kotlin
    val items = df.items.concat()
    items
    ```

## 데이터 정리 및 재구성

데이터 정리 및 재구성은 분석을 위해 데이터셋을 준비하는 데 중요한 단계입니다. [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)는 이러한 작업을 위한 강력한 기능을 제공합니다. [`move`](https://kotlin.github.io/dataframe/move.html), [`concat`](https://kotlin.github.io/dataframe/concatdf.html), [`select`](https://kotlin.github.io/dataframe/select.html), [`parse`](https://kotlin.github.io/dataframe/parse.html), [`join`](https://kotlin.github.io/dataframe/join.html)과 같은 메서드들은 데이터를 구성하고 변환하는 데 중요한 역할을 합니다.

데이터가 [YouTube 데이터 API를 사용하여 이미 가져와진](#fetch-data-from-an-api) 예시를 살펴보겠습니다. 목표는 심층 분석을 위해 데이터셋을 정리하고 재구성하는 것입니다:

1.  데이터를 재구성하고 정리하는 것으로 시작할 수 있습니다. 이는 특정 열을 새 헤더 아래로 이동하고 명확성을 위해 불필요한 열을 제거하는 것을 포함합니다:

    ```kotlin
    val videos = items.dropNulls { id.videoId }
        .select { id.videoId named "id" and snippet }
        .distinct()
    videos
    ```

2.  정리된 데이터에서 ID를 청크하고 해당 동영상 통계를 로드합니다. 이는 데이터를 더 작은 배치로 나누고 추가 세부 정보를 가져오는 것을 포함합니다:

    ```kotlin
    val statPages = clean.id.chunked(50).map {
        val ids = it.joinToString("%2C")
        load("videos?part=statistics&id=$ids")
    }
    statPages
    ```

3.  가져온 통계를 연결하고 관련 열을 선택합니다:

    ```kotlin
    val stats = statPages.items.concat().select { id and statistics.all() }.parse()
    stats
    ```

4.  기존 정리된 데이터와 새로 가져온 통계를 조인합니다. 이는 두 데이터셋을 포괄적인 DataFrame으로 병합합니다:

    ```kotlin
    val joined = clean.join(stats)
    joined
    ```

이 예시는 Kotlin DataFrame의 다양한 함수를 사용하여 데이터셋을 정리, 재구성 및 개선하는 방법을 보여줍니다. 각 단계는 데이터를 정제하여 [심층 분석](#analyze-data-in-kotlin-notebook)에 더 적합하도록 설계되었습니다.

## Kotlin Notebook에서 데이터 분석

[Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/gettingstarted.html)의 함수를 사용하여 데이터를 성공적으로 [가져오고](#fetch-data-from-an-api) [정리 및 재구성](#clean-and-refine-data)한 후, 다음 단계는 준비된 이 데이터셋을 분석하여 의미 있는 통찰력을 추출하는 것입니다.

데이터를 분류하는 [`groupBy`](https://kotlin.github.io/dataframe/groupby.html), [요약 통계](https://kotlin.github.io/dataframe/summarystatistics.html)를 위한 [`sum`](https://kotlin.github.io/dataframe/sum.html) 및 [`maxBy`](https://kotlin.github.io/dataframe/maxby.html), 데이터를 정렬하는 [`sortBy`](https://kotlin.github.io/dataframe/sortby.html)와 같은 메서드들은 특히 유용합니다. 이러한 도구는 복잡한 데이터 분석 작업을 효율적으로 수행할 수 있도록 합니다.

`groupBy`를 사용하여 채널별 동영상을 분류하고, `sum`을 사용하여 카테고리별 총 조회수를 계산하며, `maxBy`를 사용하여 각 그룹에서 최신 또는 가장 많이 조회된 동영상을 찾는 예시를 살펴보겠습니다:

1.  참조를 설정하여 특정 열에 대한 접근을 단순화합니다:

    ```kotlin
    val view by column<Int>()
    ```

2.  `groupBy` 메서드를 사용하여 `channel` 열을 기준으로 데이터를 그룹화하고 정렬합니다.

    ```kotlin
    val channels = joined.groupBy { channel }.sortByCount()
    ```

결과 테이블에서 데이터를 상호작용적으로 탐색할 수 있습니다. 채널에 해당하는 행의 `group` 필드를 클릭하면 해당 행이 확장되어 해당 채널의 동영상에 대한 더 많은 세부 정보를 보여줍니다.

![행을 확장하여 더 많은 세부 정보 표시](results-of-expanding-group-data-analysis.png){width=700}

그룹화된 데이터셋으로 돌아가려면 왼쪽 하단의 테이블 아이콘을 클릭합니다.

![그룹화된 데이터셋으로 돌아가려면 왼쪽 하단의 테이블 아이콘 클릭](return-to-grouped-dataset.png){width=700}

3.  `aggregate`, `sum`, `maxBy`, `flatten`을 사용하여 각 채널의 총 조회수와 최신 또는 가장 많이 조회된 동영상의 세부 정보를 요약하는 DataFrame을 생성합니다:

    ```kotlin
    val aggregated = channels.aggregate {
        viewCount.sum() into view
    
        val last = maxBy { publishedAt }
        last.title into "last title"
        last.publishedAt into "time"
        last.viewCount into "viewCount"
        // DataFrame을 조회수 기준으로 내림차순 정렬하고 평면 구조로 변환합니다.
    }.sortByDesc(view).flatten()
    aggregated
    ```

분석 결과:

![분석 결과](kotlin-analysis.png){width=700}

더 고급 기술에 대해서는 [Kotlin DataFrame 문서](https://kotlin.github.io/dataframe/gettingstarted.html)를 참조하세요.

## 다음 단계

*   [Kandy 라이브러리](https://kotlin.github.io/kandy/examples.html)를 사용하여 데이터 시각화 탐색
*   [Kandy와 함께하는 Kotlin Notebook의 데이터 시각화](data-analysis-visualization.md)에서 데이터 시각화에 대한 추가 정보 찾기
*   Kotlin에서 데이터 과학 및 분석에 사용할 수 있는 도구 및 리소스에 대한 포괄적인 개요는 [Kotlin 및 Java 데이터 분석 라이브러리](data-analysis-libraries.md)를 참조하세요.