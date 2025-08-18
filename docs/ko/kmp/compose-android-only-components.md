[//]: # (title: 안드로이드 전용 구성 요소)

Compose Multiplatform은 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 합니다. Compose Multiplatform의 대부분 기능은 모든 플랫폼에서 사용할 수 있습니다. 하지만 안드로이드 타겟에서만 사용할 수 있는 일부 API와 라이브러리가 있습니다. 이는 안드로이드 전용이거나, 아직 다른 플랫폼으로 포팅되지 않았기 때문입니다. 이 페이지에서는 Compose Multiplatform API의 이러한 부분을 요약하여 설명합니다.

> 가끔 [Jetpack Compose 문서](https://developer.android.com/jetpack/compose/documentation)나 커뮤니티에서 작성한 글에서 안드로이드 타겟에서만 사용할 수 있는 API를 발견할 수 있습니다. 이를 `commonMain` 코드에서 사용하려고 하면 IDE에서 해당 API를 사용할 수 없다고 알려줄 것입니다.
>
{style="note"}

## 안드로이드 전용 API

안드로이드 전용 API는 안드로이드에 특화되어 있으며 다른 플랫폼에서는 사용할 수 없습니다. 이는 다른 플랫폼이 안드로이드에서 사용하는 특정 개념을 필요로 하지 않기 때문입니다. 해당 API는 일반적으로 `android.*` 패키지의 클래스를 사용하거나 안드로이드 전용 동작을 구성합니다. 다음은 안드로이드 전용 API의 일부 예시입니다:

*   [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 클래스
*   [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) 및 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 변수
*   [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) 및 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 클래스
*   [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 함수
*   [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 클래스
*   [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 함수
*   [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) 클래스
*   [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 변수
*   [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 함수
*   [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 의존성 주입 라이브러리

일반적으로 이러한 API 부분을 공통화할 강력한 이유가 없으므로 `androidMain`에서만 유지하는 것이 가장 좋습니다.

## 시그니처에 안드로이드 클래스가 포함된 API

Compose Multiplatform API 중 시그니처에 `android.*` 또는 `androidx.*` (단, `androidx.compose.*` 제외)를 사용하지만, 해당 동작이 다른 플랫폼에도 적용 가능한 부분이 있습니다:

*   [리소스 관리](https://developer.android.com/jetpack/compose/resources): `stringResource`, `animatedVectorResource`, `Font` 및 리소스 관리를 위한 `*.R` 클래스.
    자세한 내용은 [이미지 및 리소스](compose-multiplatform-resources.md)를 참조하세요.
*   [내비게이션](https://developer.android.com/jetpack/compose/navigation).
    자세한 내용은 [내비게이션 및 라우팅](compose-navigation-routing.md)을 참조하세요.
*   [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 클래스.
*   [페이징](https://developer.android.com/jetpack/compose/libraries#paging) 라이브러리.
*   [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 레이아웃.
*   [지도](https://developer.android.com/jetpack/compose/libraries#maps) 라이브러리.
*   [미리보기](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 도구 및 [데스크톱](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 애플리케이션 미리보기용 플러그인.
*   [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 클래스.
*   Compose Multiplatform으로 아직 포팅되지 않은 다른 Jetpack Compose 라이브러리.

복잡성과 수요에 따라 향후 `commonMain`으로 포팅될 수 있습니다.

권한, 장치(블루투스, GPS, 카메라) 및 IO(네트워크, 파일, 데이터베이스)와 같이 애플리케이션 개발 시 자주 사용되는 API는 Compose Multiplatform의 범위를 벗어납니다.
<!-- To find alternative solutions, see [Search for Multiplatform libraries](search-libs.md). -->

## 시그니처에 안드로이드 클래스가 없는 API

일부 API 부분은 시그니처에 `android.*` 또는 `androidx.*` 클래스가 포함되어 있지 않고 다른 플랫폼에도 적용 가능하더라도, 안드로이드 타겟에서만 사용할 수 있습니다. 그 이유는 대개 구현에 많은 플랫폼별 특성이 사용되어 다른 플랫폼을 위한 다른 구현을 작성하는 데 시간이 걸리기 때문입니다.

일반적으로 이러한 API 부분은 안드로이드 타겟용 Jetpack Compose에 도입된 후 Compose Multiplatform으로 포팅됩니다.

Compose Multiplatform %org.jetbrains.compose%에서 다음 API 부분은 `commonMain`에서 **사용할 수 없습니다**:

*   [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 함수
*   [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 함수
*   [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 함수
*   [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 변수
*   [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
*   [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) 라이브러리
*   [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 라이브러리

## 안드로이드 API 포팅 요청

안드로이드에서 포팅할 수 있는 각 API에 대해 Compose Multiplatform YouTrack에 [열린 이슈](https://youtrack.jetbrains.com/issues/CMP)가 있습니다. API를 안드로이드에서 포팅하고 공통화할 수 있다고 판단되지만, 기존 이슈가 없다면 [하나 생성하세요](https://youtrack.jetbrains.com/newIssue?project=CMP).