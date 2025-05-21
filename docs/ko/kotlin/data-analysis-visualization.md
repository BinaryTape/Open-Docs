---
title: "Kandy를 이용한 Kotlin Notebook의 데이터 시각화"
---
Kotlin은 강력하고 유연한 데이터 시각화를 위한 올인원 솔루션을 제공하여 복잡한 모델로 들어가기 전에 데이터를 제시하고 탐색할 수 있는 직관적인 방법을 제공합니다.

이 튜토리얼에서는 [Kandy](https://kotlin.github.io/kandy/welcome.html) 및 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 라이브러리와 함께 [Kotlin Notebook](kotlin-notebook-overview)을 사용하여 IntelliJ IDEA에서 다양한 차트 유형을 만드는 방법을 보여줍니다.

## 시작하기 전에

1. 최신 버전의 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)를 다운로드하여 설치합니다.
2. IntelliJ IDEA에 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)을 설치합니다.
   
    > 또는 IntelliJ IDEA 내에서 **Settings** | **Plugins** | **Marketplace**에서 Kotlin Notebook plugin에 액세스합니다.
    >
    

3. **File** | **New** | **Kotlin Notebook**을 선택하여 새 노트북을 만듭니다.
4. 노트북에서 다음 명령을 실행하여 Kandy 및 Kotlin DataFrame 라이브러리를 가져옵니다.

    ```kotlin
    %use kandy
    %use dataframe
    ```

## DataFrame 만들기

시각화할 레코드가 포함된 DataFrame을 만들어 시작합니다. 이 DataFrame은 세 도시(Berlin, Madrid, Caracas)의 월 평균 기온의 시뮬레이션된 숫자를 저장합니다.

Kotlin DataFrame 라이브러리의 `dataFrameOf()` 함수를 사용하여 DataFrame을 생성합니다. Kotlin Notebook에서 다음 코드 스니펫을 실행합니다.

```kotlin
// The months variable stores a list with the 12 months of the year
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// The tempBerlin, tempMadrid, and tempCaracas variables store a list with temperature values for each month
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)

// The df variable stores a DataFrame of three columns, including records of months, temperature, and cities
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

처음 4개 행을 살펴보고 새 DataFrame의 구조를 탐색합니다.

```kotlin
df.head(4)
```

DataFrame에는 Month, Temperature, City의 세 열이 있습니다.
DataFrame의 처음 4개 행에는 1월부터 4월까지 Berlin의 온도 기록이 포함되어 있습니다.

<img src="/img/visualization-dataframe-temperature.png" alt="Dataframe exploration" width="600" style={{verticalAlign: 'middle'}}/>
:::tip
Kandy 및 Kotlin DataFrame 라이브러리를 함께 사용할 때 타입 안전성을 높이는 데 도움이 되는 열의 레코드에 액세스하는 다양한 옵션이 있습니다.
자세한 내용은 [Access APIs](https://kotlin.github.io/dataframe/apilevels.html)를 참조하세요.

:::

## 선 차트 만들기

이전 섹션의 `df` DataFrame을 사용하여 Kotlin Notebook에서 선 차트를 만들어 보겠습니다.

Kandy 라이브러리의 `plot()` 함수를 사용합니다. `plot()` 함수 내에서 차트 유형(이 경우 `line`)과 X축 및 Y축의 값을 지정합니다. 색상과 크기를 사용자 지정할 수 있습니다.

```kotlin
df.plot {
    line {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // Customizes the line's size
        width = 1.5
    }
    // Customizes the chart's layout size
    layout.size = 1000 to 450
}
```

결과는 다음과 같습니다.

<img src="/img/visualization-line-chart.svg" alt="Line chart" width="600" style={{verticalAlign: 'middle'}}/>

## 점 차트 만들기

이제 `df` DataFrame을 점(산점도) 차트로 시각화해 보겠습니다.

`plot()` 함수 내에서 `points` 차트 유형을 지정합니다. X축 및 Y축 값과 `df` 열의 범주 값을 추가합니다.
차트에 제목을 포함할 수도 있습니다.

```kotlin
df.plot {
    points {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // Customizes the point's size
        size = 5.5
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // Adds a chart heading
    layout.title = "Temperature per month"
}
```

결과는 다음과 같습니다.

<img src="/img/visualization-points-chart.svg" alt="Points chart" width="600" style={{verticalAlign: 'middle'}}/>

## 막대 차트 만들기

마지막으로 이전 차트와 동일한 데이터를 사용하여 도시별로 그룹화된 막대 차트를 만들어 보겠습니다.
색상의 경우 16진수 코드를 사용할 수도 있습니다.

```kotlin
// Groups by cities  
df.groupBy { City }.plot {
    // Adds a chart heading
    layout.title = "Temperature per month"
    bars {
        // Accesses the DataFrame's columns used for the X and Y axes 
        x(Month)
        y(Temperature)
        // Accesses the DataFrame's column used for categories and sets colors for these categories 
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

<img src="/img/visualization-bar-chart.svg" alt="Bar chart" width="600" style={{verticalAlign: 'middle'}}/>

## 다음 단계

* [Kandy 라이브러리 설명서](https://kotlin.github.io/kandy/examples.html)에서 더 많은 차트 예제를 살펴보세요.
* [Lets-Plot 라이브러리 설명서](lets-plot)에서 더 고급 플로팅 옵션을 살펴보세요.
* [Kotlin DataFrame 라이브러리 설명서](https://kotlin.github.io/dataframe/info.html)에서 데이터 프레임 생성, 탐색 및 관리에 대한 추가 정보를 찾아보세요.
* 이 [YouTube video]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s)에서 Kotlin Notebook의 데이터 시각화에 대해 자세히 알아보세요.