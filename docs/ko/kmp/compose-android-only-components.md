[//]: # (title: Android 전용 컴포넌트)

Compose Multiplatform은 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 구축되었습니다. Compose Multiplatform의 대부분의 기능은 모든 플랫폼에서 사용할 수 있습니다. 하지만 Android 타겟에서만 사용할 수 있는 일부 API와 라이브러리가 있습니다. 이는 해당 API가 Android 전용이거나, 아직 다른 플랫폼으로 포팅되지 않았기 때문입니다. 이 페이지에서는 Compose Multiplatform API 중 이러한 부분들을 요약하여 설명합니다.

> 가끔 [Jetpack Compose 문서](https://developer.android.com/jetpack/compose/documentation)나 커뮤니티에서 작성된 아티클에서 Android 타겟에서만 사용할 수 있는 API를 발견할 수 있습니다. 이를 `commonMain` 코드에서 사용하려고 하면, IDE가 해당 API를 사용할 수 없다고 알려줄 것입니다.
>
{style="note"}

## Android 전용 API

Android 전용 API는 Android에 특화되어 있으며 다른 플랫폼에서는 사용할 수 없습니다. 이는 다른 플랫폼에는 Android에서 사용하는 특정 개념이 필요하지 않기 때문입니다. 이러한 API는 대개 `android.*` 패키지의 클래스를 사용하거나 Android 전용 동작을 구성합니다. 다음은 Android 전용 API의 몇 가지 예시입니다.

* [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 클래스
* [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 및 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 변수
* [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 및 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 클래스
* [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 함수
* [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 클래스
* [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 함수
* [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 클래스
* [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 변수
* [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 함수
* [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 의존성 주입(dependency injection) 라이브러리

일반적으로 이러한 API 부분을 공통화(commonize)해야 할 강력한 이유가 없으므로, `androidMain`에만 유지하는 것이 가장 좋습니다.

## 시그니처에 Android 클래스가 포함된 API

Compose Multiplatform API 중에는 시그니처에 `android.*`나 `androidx.*`(`androidx.compose.*` 제외)를 사용하지만, 그 동작은 다른 플랫폼에도 적용 가능한 부분들이 있습니다:

* [리소스 관리](https://developer.android.com/jetpack/compose/resources): 리소스 관리를 위한 `stringResource`, `animatedVectorResource`, `Font`, 그리고 `*.R` 클래스. 자세한 내용은 [이미지 및 리소스](compose-multiplatform-resources.md)를 참고하세요.
* [내비게이션(Navigation)](https://developer.android.com/jetpack/compose/navigation). 자세한 내용은 [내비게이션 및 라우팅](compose-navigation-routing.md)을 참고하세요.
* [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 클래스. 자세한 내용은 [멀티플랫폼 ViewModel](compose-viewmodel.md)을 참고하세요.
* [페이징(Paging)](https://developer.android.com/jetpack/compose/libraries#paging) 라이브러리.
* [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 레이아웃.
* [지도(Maps)](https://developer.android.com/jetpack/compose/libraries#maps) 라이브러리.
* [프리뷰(Preview)](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 도구 및 [데스크톱](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 애플리케이션 프리뷰를 위한 플러그인.
* [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 클래스.
* 아직 Compose Multiplatform으로 포팅되지 않은 기타 Jetpack Compose 라이브러리.

이들은 복잡도와 수요에 따라 향후 `commonMain`으로 포팅될 수 있습니다.

권한(permissions), 디바이스(블루투스, GPS, 카메라), 입출력(IO, 네트워크, 파일, 데이터베이스)과 같이 애플리케이션 개발 시 자주 사용되는 API는 Compose Multiplatform의 범위를 벗어납니다.
<!-- 대안적인 솔루션을 찾으려면 [멀티플랫폼 라이브러리 검색](search-libs.md)을 참고하세요. -->

## 시그니처에 Android 클래스가 포함되지 않은 API

일부 API는 시그니처에 `android.*` 또는 `androidx.*` 클래스가 포함되어 있지 않고 다른 플랫폼에도 적용 가능함에도 불구하고 Android 타겟에서만 사용할 수 있는 경우가 있습니다. 그 이유는 대개 구현 시 플랫폼별 특성을 많이 사용하며, 다른 플랫폼을 위한 별도의 구현을 작성하는 데 시간이 걸리기 때문입니다.

일반적으로 이러한 API들은 Android 타겟용 Jetpack Compose에 도입된 후 Compose Multiplatform으로 포팅됩니다.

Compose Multiplatform %org.jetbrains.compose%에서 다음 API 부분들은 `commonMain`에서 사용할 수 **없습니다**:

* [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 함수
* [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 함수
* [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 함수
* [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 변수
* [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
* [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 라이브러리
* [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 라이브러리

## Android API 포팅 요청

Android에서 포팅 가능한 각 API에 대해 Compose Multiplatform YouTrack에 [열려 있는 이슈(open issue)](https://youtrack.jetbrains.com/issues/CMP)가 있습니다. Android에서 포팅 및 공통화가 가능해 보이는 API가 있는데 관련 이슈가 없다면, [새로 생성](https://youtrack.jetbrains.com/newIssue?project=CMP)해 주세요.