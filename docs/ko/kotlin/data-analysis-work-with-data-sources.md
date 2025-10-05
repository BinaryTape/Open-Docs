[//]: # (title: 파일에서 데이터 가져오기)

[Kotlin Notebook](kotlin-notebook-overview.md)은 [Kotlin DataFrame 라이브러리](https://kotlin.github.io/dataframe/home.html)와 함께 비정형 및 정형 데이터를 모두 처리할 수 있도록 지원합니다. 이 조합은 TXT 파일에서 발견되는 데이터와 같은 비정형 데이터를 정형 데이터셋으로 변환할 수 있는 유연성을 제공합니다.

데이터 변환을 위해 [`add`](https://kotlin.github.io/dataframe/adddf.html), [`split`](https://kotlin.github.io/dataframe/split.html), [`convert`](https://kotlin.github.io/dataframe/convert.html), [`parse`](https://kotlin.github.io/dataframe/parse.html)와 같은 메서드를 사용할 수 있습니다. 또한, 이 도구 세트는 CSV, JSON, XLS, XLSX, Apache Arrow를 포함한 다양한 정형 파일 형식에서 데이터를 검색하고 조작할 수 있도록 합니다.

이 가이드에서는 여러 예제를 통해 데이터를 검색하고, 정제하고, 처리하는 방법을 배울 수 있습니다.

## 시작하기 전에

Kotlin Notebook은 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존하며, 이 플러그인은 IntelliJ IDEA에 기본적으로 번들로 제공되고 활성화되어 있습니다.

Kotlin Notebook 기능이 사용 가능하지 않다면, 플러그인이 활성화되어 있는지 확인하십시오. 더 자세한 내용은 [환경 설정](kotlin-notebook-set-up-env.md)을 참조하십시오.

새 Kotlin Notebook 생성:

1. **File** | **New** | **Kotlin Notebook**을 선택합니다.
2. Kotlin Notebook에서 다음 명령을 실행하여 Kotlin DataFrame 라이브러리를 임포트합니다:

   ```kotlin
   %use dataframe
   ```

## 파일에서 데이터 가져오기

Kotlin Notebook에서 파일로부터 데이터를 검색하려면:

1. Kotlin Notebook 파일(`.ipynb`)을 엽니다.
2. 노트북 시작 부분의 코드 셀에 `%use dataframe`을 추가하여 Kotlin DataFrame 라이브러리를 임포트합니다.
   > `%use dataframe` 줄이 포함된 코드 셀을 Kotlin DataFrame 라이브러리에 의존하는 다른 코드 셀을 실행하기 전에 실행해야 합니다.
   >
   {style="note"}

3. Kotlin DataFrame 라이브러리의 [`.read()`](https://kotlin.github.io/dataframe/read.html) 함수를 사용하여 데이터를 검색합니다. 예를 들어, CSV 파일을 읽으려면 `DataFrame.read("example.csv")`를 사용합니다.

`.read()` 함수는 파일 확장자 및 내용을 기반으로 입력 형식을 자동으로 감지합니다. `delimiter = ';'`와 같이 구분자를 지정하는 등 함수를 사용자 정의하기 위해 다른 인수를 추가할 수도 있습니다.

> 추가 파일 형식 및 다양한 읽기 함수에 대한 포괄적인 개요는 [Kotlin DataFrame 라이브러리 문서](https://kotlin.github.io/dataframe/read.html)를 참조하십시오.
> 
{style="tip"}

## 데이터 표시

[노트북에 데이터가 있다면](#retrieve-data-from-a-file), 변수에 쉽게 저장하고 코드 셀에서 다음을 실행하여 액세스할 수 있습니다:

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

이 코드는 CSV, JSON, XLS, XLSX 또는 Apache Arrow와 같이 선택한 파일의 데이터를 표시합니다.

![Display data](display-data.png){width=700}

데이터의 구조나 스키마에 대한 통찰력을 얻으려면, DataFrame 변수에 `.schema()` 함수를 적용하십시오. 예를 들어, `dfJson.schema()`는 JSON 데이터셋의 각 컬럼 유형을 나열합니다.

![Schema example](schema-data-analysis.png){width=700}

또한 Kotlin Notebook의 자동 완성 기능을 사용하여 DataFrame의 속성에 빠르게 액세스하고 조작할 수 있습니다. 데이터를 로드한 후, DataFrame 변수 뒤에 점을 입력하기만 하면 사용 가능한 컬럼과 해당 유형 목록을 볼 수 있습니다.

![Available properties](auto-completion-data-analysis.png){width=700}

## 데이터 정제

데이터셋을 정제하기 위해 Kotlin DataFrame 라이브러리에서 사용할 수 있는 다양한 작업 중 주요 예시로는 [그룹화](https://kotlin.github.io/dataframe/group.html), [필터링](https://kotlin.github.io/dataframe/filter.html), [업데이트](https://kotlin.github.io/dataframe/update.html), 그리고 [새 컬럼 추가](https://kotlin.github.io/dataframe/add.html)가 있습니다. 이러한 함수는 데이터를 효과적으로 정리, 클린, 변환할 수 있도록 하여 데이터 분석에 필수적입니다.

데이터에 영화 제목과 해당 개봉 연도가 동일한 셀에 포함된 예제를 살펴보겠습니다. 목표는 더 쉬운 분석을 위해 이 데이터셋을 정제하는 것입니다:

1. `.read()` 함수를 사용하여 데이터를 노트북으로 로드합니다. 이 예제에서는 `movies.csv`라는 CSV 파일에서 데이터를 읽어 `movies`라는 DataFrame을 생성합니다:

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 정규식을 사용하여 영화 제목에서 개봉 연도를 추출하고 새 컬럼으로 추가합니다:

   ```kotlin
   val moviesWithYear = movies
       .add("year") { 
           "\\d{4}".toRegex()
               .findAll(title)
               .lastOrNull()
               ?.value
               ?.toInt()
               ?: -1
       }
   ```

3. 각 제목에서 개봉 연도를 제거하여 영화 제목을 수정합니다. 이렇게 하면 제목의 일관성이 유지됩니다:

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. `filter` 메서드를 사용하여 특정 데이터에 집중합니다. 이 경우, 데이터셋은 1996년 이후에 개봉된 영화에 초점을 맞추도록 필터링됩니다:

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

비교를 위해, 정제 전 데이터셋은 다음과 같습니다:

![Original dataset](original-dataset.png){width=700}

정제된 데이터셋:

![Data refinement result](refined-data.png){width=700}

이는 Kotlin에서 `add`, `update`, `filter`와 같은 Kotlin DataFrame 라이브러리 메서드를 사용하여 데이터를 효과적으로 정제하고 분석하는 방법을 실질적으로 보여줍니다.

> 추가 사용 사례 및 자세한 예시는 [Kotlin DataFrame 예시](https://github.com/Kotlin/dataframe/tree/master/examples)를 참조하십시오.
> 
{style="tip"}

## DataFrame 저장

Kotlin DataFrame 라이브러리를 사용하여 [Kotlin Notebook에서 데이터를 정제한](#refine-data) 후, 처리된 데이터를 쉽게 내보낼 수 있습니다. 이를 위해 CSV, JSON, XLS, XLSX, Apache Arrow, 심지어 HTML 테이블을 포함한 여러 형식으로 저장을 지원하는 다양한 [`.write()`](https://kotlin.github.io/dataframe/write.html) 함수를 활용할 수 있습니다. 이는 결과를 공유하거나, 보고서를 작성하거나, 데이터를 추가 분석에 사용할 수 있도록 하는 데 특히 유용할 수 있습니다.

다음은 DataFrame을 필터링하고, 컬럼을 제거하고, 정제된 데이터를 JSON 파일로 저장하고, 브라우저에서 HTML 테이블을 여는 방법입니다:

1. Kotlin Notebook에서 `.read()` 함수를 사용하여 `movies.csv`라는 파일을 `moviesDf`라는 DataFrame으로 로드합니다:

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. `.filter` 메서드를 사용하여 "Action" 장르에 속하는 영화만 포함하도록 DataFrame을 필터링합니다:

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. `.remove`를 사용하여 DataFrame에서 `movieId` 컬럼을 제거합니다:

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 라이브러리는 다양한 형식으로 데이터를 저장할 수 있는 다양한 쓰기 함수를 제공합니다. 이 예제에서는 수정된 `movies.csv`를 JSON 파일로 저장하기 위해 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 함수가 사용됩니다:

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. `.toStandaloneHTML()` 함수를 사용하여 DataFrame을 독립형 HTML 테이블로 변환하고 기본 웹 브라우저에서 엽니다:

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 다음 단계

* [Kandy 라이브러리](https://kotlin.github.io/kandy/examples.html)를 사용한 데이터 시각화 탐색
* [Kandy와 함께하는 Kotlin Notebook의 데이터 시각화](data-analysis-visualization.md)에서 데이터 시각화에 대한 추가 정보 찾기
* Kotlin의 데이터 과학 및 분석에 사용할 수 있는 도구 및 리소스에 대한 광범위한 개요는 [Kotlin 및 Java 데이터 분석 라이브러리](data-analysis-libraries.md)를 참조하십시오.