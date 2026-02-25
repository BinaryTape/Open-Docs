# 적응형 레이아웃 (Adaptive layouts)

모든 유형의 디바이스에서 일관된 사용자 경험을 제공하려면, 앱의 UI를 다양한 디스플레이 크기, 방향(orientation) 및 입력 모드에 맞춰 조정하십시오.

## 적응형 레이아웃 설계하기

적응형 레이아웃을 설계할 때는 다음과 같은 주요 가이드라인을 따르십시오:

* 리스트-상세(list-detail), 피드(feed), 지원 패널(supporting pane)과 같은 [표준 레이아웃(canonical layouts)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 패턴을 사용하는 것이 좋습니다.
* 패딩, 타이포그래피 및 기타 디자인 요소에 공유 스타일을 재사용하여 일관성을 유지하십시오. 플랫폼별 가이드를 따르면서도 디바이스 간에 내비게이션 패턴을 일관되게 유지하십시오.
* 유연성과 모듈화(modularity)를 위해 복잡한 레이아웃을 재사용 가능한 컴포저블(composables)로 분리하십시오.
* 화면 밀도와 방향에 맞춰 조정하십시오.

## 창 크기 클래스(Window size classes) 사용하기

창 크기 클래스는 적응형 레이아웃을 설계, 개발 및 테스트하는 데 도움이 되도록 다양한 화면 크기를 분류하는 미리 정의된 임계값(중단점(breakpoints)이라고도 함)입니다.

창 크기 클래스는 앱이 사용할 수 있는 디스플레이 영역을 너비와 높이 모두에 대해 compact(소형), medium(중형), expanded(확장형)의 세 가지 카테고리로 분류합니다. 레이아웃을 변경할 때 모든 창 크기, 특히 서로 다른 중단점 임계값에서의 레이아웃 동작을 테스트하십시오.

`WindowSizeClass` 클래스를 사용하려면 모듈의 `build.gradle.kts` 파일에 있는 공통 소스 세트(common source set)에 `material3.adaptive` 종속성을 추가하십시오:

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API를 사용하면 사용 가능한 디스플레이 공간에 따라 앱의 레이아웃을 변경할 수 있습니다. 예를 들어, 창 높이에 따라 상단 앱 바(top app bar)의 가시성을 관리할 수 있습니다:

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // 상단 앱 바를 표시할지 여부를 결정합니다.
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // 바의 가시성을 사용하여 UI를 정의합니다. 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## 레이아웃 미리보기

세 가지 종류의 @Preview가 있습니다:

* Android 전용, `androidMain`용, Android Studio에서 제공.
* 자체 구현이 포함된 별도의 데스크톱 어노테이션 플러그인(데스크톱 소스 세트 전용) + uiTooling 플러그인.
* 공통 어노테이션, Android Studio에서도 지원되며 Android에서만 작동하지만 공통 코드에서 사용 가능.
-->

## 다음 단계

[Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/layouts/adaptive)에서 적응형 레이아웃에 대해 자세히 알아보세요.