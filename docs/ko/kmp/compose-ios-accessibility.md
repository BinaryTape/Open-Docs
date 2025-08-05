[//]: # (title: iOS 손쉬운 사용 기능 지원)

Compose Multiplatform의 손쉬운 사용 지원을 통해 장애가 있는 사용자도 네이티브 iOS UI만큼 편안하게 Compose Multiplatform UI와 상호 작용할 수 있습니다.

*   스크린 리더와 VoiceOver는 Compose Multiplatform UI의 콘텐츠에 접근할 수 있습니다.
*   Compose Multiplatform UI는 네이티브 iOS UI와 동일한 제스처를 지원하여 탐색 및 상호 작용을 할 수 있습니다.

이는 Compose API가 생성하는 시맨틱스 데이터가 이제 iOS 손쉬운 사용 서비스에서 사용하는 네이티브 객체 및 속성으로 매핑되기 때문에 가능합니다. Material 위젯으로 빌드된 대부분의 인터페이스의 경우, 이 과정은 자동으로 이루어집니다.

또한 이 시맨틱스 데이터를 테스트 및 기타 자동화에 사용할 수 있습니다. `testTag`와 같은 속성은 `accessibilityIdentifier`와 같은 네이티브 손쉬운 사용 속성에 올바르게 매핑됩니다. 이를 통해 Compose Multiplatform의 시맨틱스 데이터가 손쉬운 사용 서비스와 XCTest 프레임워크에서 사용 가능해집니다.

## 고대비 테마

Compose Multiplatform은 Material3 라이브러리의 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 클래스를 사용하는데, 현재 고대비 색상에 대한 기본 제공 지원이 부족합니다. iOS에서 고대비 테마를 사용하려면 애플리케이션 팔레트에 추가적인 색상 세트를 추가해야 합니다. 각 사용자 지정 색상에 대해 고대비 버전을 수동으로 지정해야 합니다.

iOS는 **대비 증가(Increase Contrast)** 손쉬운 사용 설정을 제공하며, 이는 `UIAccessibilityDarkerSystemColorsEnabled` 값을 확인하여 감지할 수 있습니다. `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`을 추적할 수도 있습니다.
이러한 API를 사용하면 시스템 손쉬운 사용 설정이 활성화되었을 때 고대비 색상 팔레트로 전환할 수 있습니다.

색상 팔레트를 정의할 때, WCAG 준수 대비 검사 도구를 사용하여 선택한 `onPrimary` 색상이 기본 색상(`primary`)과 충분한 대비를 이루는지, `onSurface`가 표면 색상(`surface`)과 대비를 이루는지 등을 확인하세요. 색상 간의 대비율이 최소 4.5:1이 되도록 하세요. 사용자 지정 전경 및 배경 색상의 경우, 특히 작은 텍스트의 경우 대비율이 7:1이어야 합니다. 이는 `lightColorScheme`과 `darkColorScheme` 모두에 적용됩니다.

이 코드는 테마 패키지에서 고대비 밝은 색상 및 어두운 색상 팔레트를 정의하는 방법을 보여줍니다.

```kotlin
import androidx.compose.ui.graphics.Color

// 고대비 테마의 색상 팔레트를 저장하는 데이터 클래스 정의
data class HighContrastColors(
    val primary: Color, // 주요 대화형 요소, 기본 텍스트, 상단 앱 바
    val onPrimary: Color, // 'primary' 색상 위에 표시되는 콘텐츠
    val secondary: Color, // 보조 대화형 요소, 플로팅 액션 버튼
    val onSecondary: Color, // 'secondary' 색상 위에 표시되는 콘텐츠
    val tertiary: Color, // 선택적인 세 번째 강조 색상
    val onTertiary: Color, // 'tertiary' 색상 위에 표시되는 콘텐츠
    val background: Color, // 화면의 주 배경
    val onBackground: Color, // 'background' 색상 위에 표시되는 콘텐츠
    val surface: Color, // 카드 배경, 시트, 메뉴, 입체적인 표면
    val onSurface: Color, // 'surface' 색상 위에 표시되는 콘텐츠
    val error: Color, // 오류 상태 및 메시지
    val onError: Color, // 'error' 색상 위에 표시되는 콘텐츠
    val success: Color, // 성공 상태 및 메시지
    val onSuccess: Color, // 'success' 색상 위에 표시되는 콘텐츠
    val warning: Color, // 경고 상태 및 메시지
    val onWarning: Color, // 'warning' 색상 위에 표시되는 콘텐츠
    val outline: Color, // 테두리, 구분선, 비활성화 상태
    val scrim: Color // 모달/시트 뒤의 배경 콘텐츠를 어둡게 함
)

// 중립 색상
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// 기본 강조 색상
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// 보조 및 삼차 강조 색상
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// 상태 색상
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// 밝은 고대비 팔레트, 밝은 배경에 어두운 콘텐츠
val LightHighContrastPalette =
    HighContrastColors(
        primary = RoyalBlue,
        onPrimary = White,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = DeepPurple,
        onTertiary = White,
        background = White,
        onBackground = Black,
        surface = LightGrey,
        onSurface = DarkGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )

// 어두운 고대비 팔레트, 어두운 배경에 밝은 콘텐츠
val DarkHighContrastPalette =
    HighContrastColors(
        primary = SkyBlue,
        onPrimary = Black,
        secondary = EmeraldGreen,
        onSecondary = White,
        tertiary = GoldenYellow,
        onTertiary = Black,
        background = Black,
        onBackground = White,
        surface = DarkGrey,
        onSurface = LightGrey,
        error = ErrorRed,
        onError = White,
        success = SuccessGreen,
        onSuccess = White,
        warning = WarningOrange,
        onWarning = White,
        outline = MediumGrey,
        scrim = Black.copy(alpha = 0.6f)
    )
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val LightHighContrastPalette = HighContrastColors( primary = RoyalBlue,"}

## 트랙패드 및 키보드를 통한 제어

iOS용 Compose Multiplatform은 기기를 제어하기 위한 추가 입력 방식을 지원합니다. 터치스크린에 의존하는 대신, AssistiveTouch를 활성화하여 마우스나 트랙패드를 사용하거나, 전체 키보드 접근(Full Keyboard Access)을 활성화하여 키보드를 사용할 수 있습니다.

*   AssistiveTouch(**설정** | **손쉬운 사용** | **터치** | **AssistiveTouch**)는 연결된 마우스 또는 트랙패드의 포인터로 iPhone을 제어할 수 있게 합니다. 포인터를 사용하여 화면의 아이콘을 클릭하고, AssistiveTouch 메뉴를 탐색하거나, 화면 키보드를 사용하여 입력할 수 있습니다.

    iPad에서는 마우스나 트랙패드를 연결하면 기본 사용을 위해 바로 작동합니다. 그러나 포인터 크기를 조정하거나, 추적 속도를 변경하거나, 버튼에 특정 동작을 할당하려면 여전히 AssistiveTouch를 활성화해야 합니다.
*   전체 키보드 접근(**설정** | **손쉬운 사용** | **키보드** | **전체 키보드 접근**)은 연결된 키보드로 기기를 제어할 수 있게 합니다. **Tab**과 같은 키로 탐색하고 **Space**를 사용하여 항목을 활성화할 수 있습니다.

## XCTest 프레임워크로 손쉬운 사용 기능 테스트하기

테스트 및 기타 자동화에서 시맨틱스 손쉬운 사용 데이터를 사용할 수 있습니다. `testTag`와 같은 속성은 `accessibilityIdentifier`와 같은 네이티브 손쉬운 사용 속성에 올바르게 매핑됩니다. 이를 통해 Compose Multiplatform의 시맨틱스 데이터가 손쉬운 사용 서비스와 XCTest 프레임워크에서 사용 가능해집니다.

UI 테스트에서 자동화된 손쉬운 사용 감사를 사용할 수 있습니다. `XCUIApplication`에 `performAccessibilityAudit()`를 호출하면 Accessibility Inspector와 마찬가지로 현재 뷰에서 손쉬운 사용 문제를 감사합니다.

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 손쉬운 사용 트리 동기화 사용자 지정

기본 설정에서는 다음과 같습니다:
*   iOS 손쉬운 사용 트리는 손쉬운 사용 서비스가 실행 중일 때만 UI와 동기화됩니다.
*   동기화 이벤트는 로깅되지 않습니다.

새로운 Compose Multiplatform API를 사용하여 이러한 설정을 사용자 지정할 수 있습니다.

### 트리 동기화 옵션 선택

> Compose Multiplatform 1.8.0에서는 손쉬운 사용 트리가 지연 동기화(lazily)되어 더 이상 추가 구성이 필요 없으므로, [이 옵션이 제거되었습니다](whats-new-compose-180.md#loading-accessibility-tree-on-demand).
>
{style="tip"}

이벤트 및 상호 작용을 디버그하고 테스트하려면 동기화 모드를 다음으로 변경할 수 있습니다:
*   트리를 UI와 절대 동기화하지 않음(예: 손쉬운 사용 매핑을 일시적으로 비활성화).
*   트리를 항상 동기화하여 UI가 업데이트될 때마다 다시 작성되도록 함으로써 손쉬운 사용 통합을 철저히 테스트.

> 각 UI 이벤트 후에 트리를 동기화하는 것은 디버깅 및 테스트에 매우 유용할 수 있지만, 앱 성능을 저하시킬 수 있다는 점을 기억하세요.
>
{style="note"}

손쉬운 사용 트리를 항상 동기화하는 옵션을 활성화하는 예시:

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions` 클래스에는 사용 가능한 모든 옵션이 포함되어 있습니다:

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 손쉬운 사용 트리를 절대 동기화하지 않는 옵션
    object Never: AccessibilitySyncOptions

    // 손쉬운 사용 서비스가 실행 중일 때만 트리를 동기화하는 옵션
    //
    // 상호 작용 및 트리 동기화 이벤트를 로깅하려면 AccessibilityDebugLogger를 포함할 수 있습니다.
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 손쉬운 사용 트리를 항상 동기화하는 옵션
    //
    // 상호 작용 및 트리 동기화 이벤트를 로깅하려면 AccessibilityDebugLogger를 포함할 수 있습니다.
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 로깅 인터페이스 구현

`AccessibilityDebugLogger` 인터페이스를 구현하여 선택한 출력으로 사용자 지정 메시지를 작성할 수 있습니다:

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.WhenRequiredByAccessibilityServices(object: AccessibilityDebugLogger {
         override fun log(message: Any?) {
             if (message == null) {
                 println()
             } else { 
                 println("[a11y]: $message") 
             } 
         } 
    })
}) {
    // your @Composable content
}
```

## 다음 단계

*   [Apple 손쉬운 사용](https://developer.apple.com/accessibility/) 가이드에서 더 자세히 알아보세요.
*   [Kotlin Multiplatform 위저드](https://kmp.jetbrains.com/)로 생성된 프로젝트를 일반적인 iOS 손쉬운 사용 워크플로에서 사용해 보세요.