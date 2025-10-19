[//]: # (title: Kandy를 사용한 Kotlin Notebook의 데이터 시각화)

Kotlin은 강력하고 유연한 데이터 시각화를 위한 올인원 솔루션을 제공하여, 복잡한 모델에 뛰어들기 전에 데이터를 표현하고 탐색하는 직관적인 방법을 제공합니다.

이 튜토리얼에서는 [Kandy](https://kotlin.github.io/kandy/welcome.html) 및 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 라이브러리와 함께 [Kotlin Notebook](kotlin-notebook-overview.md)을 사용하여 IntelliJ IDEA에서 다양한 차트 유형을 생성하는 방법을 보여줍니다.

## 시작하기 전에

Kotlin Notebook은 기본적으로 IntelliJ IDEA에 번들로 제공되고 활성화되어 있는 [Kotlin Notebook 플러그인](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)에 의존합니다.

Kotlin Notebook 기능이 제공되지 않는다면 플러그인이 활성화되어 있는지 확인하세요. 자세한 내용은 [환경 설정](kotlin-notebook-set-up-env.md)을 참조하세요.

새 Kotlin Notebook 생성:

1. **File** | **New** | **Kotlin Notebook**을 선택하세요.

2. Notebook에서 다음 명령을 실행하여 Kandy 및 Kotlin DataFrame 라이브러리를 임포트합니다.

    ```kotlin
    %use kandy
    %use dataframe
    ```

## DataFrame 생성

시각화할 레코드를 포함하는 DataFrame을 생성하는 것으로 시작합니다. 이 DataFrame은 베를린, 마드리드, 카라카스 세 도시의 월별 평균 기온 시뮬레이션 수치를 저장합니다.

Kotlin DataFrame 라이브러리의 `dataFrameOf()` 함수를 사용하여 DataFrame을 생성합니다. Kotlin Notebook에서 다음 코드 스니펫을 실행합니다.

```kotlin
// The months 변수는 1년 12개월 목록을 저장합니다
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// The tempBerlin, tempMadrid, and tempCaracas 변수는 각 월별 기온 값 목록을 저장합니다
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// The df 변수는 월, 기온 및 도시 기록을 포함하는 세 개의 열로 구성된 DataFrame을 저장합니다
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

처음 네 행을 살펴봄으로써 새 DataFrame의 구조를 탐색합니다.

```kotlin
df.head(4)
```

DataFrame에는 Month, Temperature, City의 세 가지 열이 있는 것을 볼 수 있습니다. DataFrame의 처음 네 행에는 1월부터 4월까지 베를린의 기온 기록이 포함되어 있습니다.

![Dataframe exploration](visualization-dataframe-temperature.png){width=600}

> Kandy 및 Kotlin DataFrame 라이브러리를 함께 사용할 때 타입 안전성을 높이는 데 도움이 되는 열의 레코드에 접근하는 다양한 옵션이 있습니다. 자세한 내용은 [접근 API](https://kotlin.github.io/dataframe/apilevels.html)를 참조하세요.
>
{style="tip"}

## 라인 차트 생성

이전 섹션의 `df` DataFrame을 사용하여 Kotlin Notebook에서 라인 차트를 만들어 보겠습니다.

Kandy 라이브러리의 `plot()` 함수를 사용합니다. `plot()` 함수 내에서 차트 유형(이 경우 `line`)과 X축 및 Y축의 값을 지정합니다. 색상과 크기를 사용자 정의할 수 있습니다.

```kotlin
df.plot {
    line {
        // X축과 Y축에 사용되는 DataFrame 열에 접근합니다
        x(Month)
        y(Temperature)
        // 카테고리에 사용되는 DataFrame 열에 접근하고 이 카테고리에 대한 색상을 설정합니다
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // 선의 크기를 사용자 정의합니다
        width = 1.5
    }
    // 차트의 레이아웃 크기를 사용자 정의합니다
    layout.size = 1000 to 450
}
```

결과는 다음과 같습니다.

![Line chart](visualization-line-chart.svg){width=600}

## 포인트 차트 생성

이제 `df` DataFrame을 포인트(산점도) 차트로 시각화해 봅시다.

`plot()` 함수 내에서 `points` 차트 유형을 지정합니다. X축과 Y축의 값과 `df` 열의 범주형 값을 추가합니다. 차트에 제목을 포함할 수도 있습니다.

```kotlin
df.plot {
    points {
        // X축과 Y축에 사용되는 DataFrame 열에 접근합니다
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // 포인트의 크기를 사용자 정의합니다
        size = 5.5
        // 카테고리에 사용되는 DataFrame 열에 접근하고 이 카테고리에 대한 색상을 설정합니다
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // 차트 제목을 추가합니다
    layout.title = "Temperature per month"
}
```

결과는 다음과 같습니다.

![Points chart](visualization-points-chart.svg){width=600}

## 바 차트 생성

마지막으로, 이전 차트와 동일한 데이터를 사용하여 도시별로 그룹화된 바 차트를 만들어 보겠습니다. 색상에는 16진수 코드도 사용할 수 있습니다.

```kotlin
// 도시별로 그룹화합니다
df.groupBy { City }.plot {
    // 차트 제목을 추가합니다
    layout.title = "Temperature per month"
    bars {
        // X축과 Y축에 사용되는 DataFrame 열에 접근합니다
        x(Month)
        y(Temperature)
        // 카테고리에 사용되는 DataFrame 열에 접근하고 이 카테고리에 대한 색상을 설정합니다
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
    }
}
```

결과는 다음과 같습니다.

![Bar chart](visualization-bar-chart.svg){width=600}

## 다음 단계

* [Kandy 라이브러리 문서](https://kotlin.github.io/kandy/examples.html)에서 더 많은 차트 예제를 탐색해 보세요
* [Lets-Plot 라이브러리 문서](lets-plot.md)에서 더 고급 플로팅 옵션을 탐색해 보세요
* [Kotlin DataFrame 라이브러리 문서](https://kotlin.github.io/dataframe/info.html)에서 데이터 프레임 생성, 탐색 및 관리에 대한 추가 정보를 찾아보세요
* 이 [YouTube 비디오]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)에서 Kotlin Notebook의 데이터 시각화에 대해 자세히 알아보세요