[//]: # (title: Android 전용 컴포넌트)

Compose Multiplatform은 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 기반으로 구축됩니다. Compose Multiplatform의 대부분의 기능은 모든 플랫폼에서 사용할 수 있습니다. 그러나 Android 대상(target)에서만 사용할 수 있는 일부 API 및 라이브러리가 있습니다. 이는 해당 API나 라이브러리가 Android 전용이거나, 아직 다른 플랫폼으로 포팅되지 않았기 때문입니다. 이 페이지에서는 Compose Multiplatform API의 이러한 부분들을 요약합니다.

> 때때로 [Jetpack Compose 문서](https://developer.android.com/jetpack/compose/documentation) 또는 커뮤니티에서 작성된 아티클에서 Android 대상에서만 사용할 수 있는 API를 발견할 수 있습니다.
> 이를 `commonMain` 코드에서 사용하려고 하면 IDE에서 해당 API를 사용할 수 없다고 알려줍니다.
>
{style="note"}

## Android 전용 API

Android 전용 API는 Android에 특화되어 있으며 다른 플랫폼에서는 사용할 수 없습니다. 이는 다른 플랫폼에서는 Android가 사용하는 특정 개념이 필요하지 않기 때문입니다. 이 API는 일반적으로 `android.*` 패키지의 클래스를 사용하거나 Android에 특화된 동작을 구성합니다. 다음은 Android 전용 API의 일부 예시입니다.

*   [`android.context.Context`](https://developer.android.com/reference/android/content/Context) 클래스
*   [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext())
    및 [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration())
    변수
*   [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory)
    및 [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) 클래스
*   [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap())
    함수
*   [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) 클래스
*   [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0))
    함수
*   [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView)
    클래스
*   [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView())
    변수
*   [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt)
    함수
*   [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 의존성 주입 라이브러리

일반적으로 이러한 API의 일부를 공통화(commonize)할 강력한 이유는 없으므로, `androidMain`에만 두는 것이 가장 좋습니다.

## 서명에 Android 클래스가 포함된 API

Compose Multiplatform에는 서명에 `android.*`, `androidx.*` (단, `androidx.compose.*`는 제외)를 사용하지만, 해당 동작이 다른 플랫폼에도 적용될 수 있는 API 부분이 있습니다.

*   [리소스 관리](https://developer.android.com/jetpack/compose/resources): `stringResource`, `animatedVectorResource`, `Font` 및 리소스 관리를 위한 `*.R` 클래스.
    자세한 내용은 [이미지 및 리소스](compose-multiplatform-resources.md)를 참조하세요.
*   [내비게이션](https://developer.android.com/jetpack/compose/navigation).
    자세한 내용은 [내비게이션 및 라우팅](compose-navigation-routing.md)을 참조하세요.
*   [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) 클래스.
*   [페이징](https://developer.android.com/jetpack/compose/libraries#paging) 라이브러리.
*   [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) 레이아웃.
*   [지도](https://developer.android.com/jetpack/compose/libraries#maps) 라이브러리.
*   [미리보기](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) 도구 및 [데스크톱](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 애플리케이션 미리보기 플러그인.
*   [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 클래스.
*   Compose Multiplatform으로 아직 포팅되지 않은 다른 Jetpack Compose 라이브러리.

복잡성과 수요에 따라 향후 `commonMain`으로 포팅될 수 있습니다.

권한, 장치(Bluetooth, GPS, 카메라) 및 IO(네트워크, 파일, 데이터베이스)와 같이 애플리케이션 개발 시 자주 사용되는 API는 Compose Multiplatform의 범위에 속하지 않습니다.
<!-- To find alternative solutions, see [Search for Multiplatform libraries](search-libs.md). -->

## 서명에 Android 클래스가 없는 API

일부 API는 서명에 `android.*` 또는 `androidx.*` 클래스가 포함되어 있지 않더라도 Android 대상에서만 사용할 수 있으며, API가 다른 플랫폼에도 적용될 수 있습니다. 이러한 현상의 원인은 일반적으로 구현에서 많은 플랫폼별 특정 사항을 사용하며, 다른 플랫폼용 구현을 작성하는 데 시간이 걸리기 때문입니다.

일반적으로 이러한 API는 Android 대상용 Jetpack Compose에 도입된 후 Compose Multiplatform으로 포팅됩니다.

Compose Multiplatform %org.jetbrains.compose%에서 다음 API 부분은 `commonMain`에서 **사용할 수 없습니다**.

*   [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt)
    함수
*   [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt)
    함수
*   [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt)
    함수
*   [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt)
    변수
*   [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
*   [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive)
    라이브러리
*   [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary)
    라이브러리

## Android API 포팅 요청

Android에서 포팅될 수 있는 각 API에 대해 Compose Multiplatform YouTrack에 [열린 이슈](https://youtrack.jetbrains.com/issues/CMP)가 있습니다. Android에서 API를 포팅하고 공통화(commonize)할 수 있다고 생각하지만, 기존 이슈가 없다면 [새 이슈를 생성](https://youtrack.jetbrains.com/newIssue?project=CMP)해 주세요.