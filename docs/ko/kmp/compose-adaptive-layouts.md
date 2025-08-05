# 적응형 레이아웃

모든 유형의 기기에서 일관된 사용자 경험을 제공하려면 앱의 UI를 다양한 디스플레이 크기, 방향 및 입력 모드에 맞춰 조정해야 합니다.

## 적응형 레이아웃 설계

적응형 레이아웃을 설계할 때 다음 주요 지침을 따르세요.

* [정형 레이아웃](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) 패턴(예: 목록-세부정보, 피드, 보조 창)을 선호합니다.
* 패딩, 타이포그래피 및 기타 디자인 요소에 공유 스타일을 재사용하여 일관성을 유지하세요. 플랫폼별 가이드라인을 따르면서 기기 전반에 걸쳐 탐색 패턴을 일관되게 유지하세요.
* 복잡한 레이아웃을 재사용 가능한 컴포저블로 분할하여 유연성과 모듈성을 확보하세요.
* 화면 밀도와 방향에 맞춰 조정하세요.

## 창 크기 클래스 사용

창 크기 클래스는 미리 정의된 임계값으로, 중단점이라고도 하며, 다양한 화면 크기를 분류하여 적응형 레이아웃을 설계, 개발 및 테스트하는 데 도움을 줍니다.

창 크기 클래스는 앱에 사용할 수 있는 디스플레이 영역을 너비와 높이 모두에 대해 컴팩트, 중간, 확장됨의 세 가지 범주로 분류합니다. 레이아웃을 변경할 때 모든 창 크기, 특히 다양한 중단점 임계값에서 레이아웃 동작을 테스트하세요.

`WindowSizeClass` 클래스를 사용하려면 모듈의 `build.gradle.kts` 파일에 있는 공통 소스 세트에 `material3.adaptive` 종속성을 추가합니다.

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API를 사용하면 사용 가능한 디스플레이 공간에 따라 앱의 레이아웃을 변경할 수 있습니다. 예를 들어, 창 높이에 따라 상단 앱 바의 가시성을 관리할 수 있습니다.

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // Determines whether the top app bar should be displayed
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // Uses bar visibility to define UI 
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## Previewing layouts

We have three different @Preview:

* Android-specific, for `androidMain`, from Android Studio.
* Separate desktop annotation plugin with our own implementation (only for desktop source set) + uiTooling plugin.
* Common annotation, also supported in Android Studio, works for Android only but from common code.
-->

## 다음 단계

[Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/layouts/adaptive)에서 적응형 레이아웃에 대해 자세히 알아보세요.