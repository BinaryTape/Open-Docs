[//]: # (title: iOS 접근성 기능 지원)

Compose Multiplatform 접근성 지원을 통해 장애가 있는 사용자도 네이티브 iOS UI에서와 마찬가지로 Compose Multiplatform UI와 편안하게 상호 작용할 수 있습니다.

* 스크린 리더와 VoiceOver가 Compose Multiplatform UI의 콘텐츠에 접근할 수 있습니다.
* Compose Multiplatform UI는 탐색 및 상호 작용을 위해 네이티브 iOS UI와 동일한 제스처를 지원합니다.

이는 Compose API에서 생성된 시맨틱 데이터가 iOS 접근성 서비스에서 사용되는 네이티브 객체 및 속성에 매핑되기 때문에 가능합니다. Material 위젯으로 구축된 대부분의 인터페이스에서는 이 작업이 자동으로 수행됩니다.

또한 이 시맨틱 데이터를 테스트 및 기타 자동화에 사용할 수 있습니다. `testTag`와 같은 속성은 `accessibilityIdentifier`와 같은 네이티브 접근성 속성에 올바르게 매핑됩니다. 이를 통해 Compose Multiplatform의 시맨틱 데이터가 접근성 서비스와 XCTest 프레임워크에서 사용할 수 있게 됩니다.

## 고대비 테마

Compose Multiplatform은 Material3 라이브러리의 [`ColorScheme`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-color-scheme/) 클래스를 사용하는데, 이 클래스는 현재 고대비 색상에 대한 기본 지원이 부족합니다. iOS에서 고대비 테마를 사용하려면 애플리케이션 팔레트에 추가 색상 세트를 추가해야 합니다. 각 사용자 지정 색상에 대해 고대비 버전을 수동으로 지정해야 합니다.

iOS는 `UIAccessibilityDarkerSystemColorsEnabled` 값을 확인하여 감지할 수 있는 **대비 증가** 접근성 설정을 제공합니다. `UIAccessibilityDarkerSystemColorsStatusDidChangeNotification`를 추적할 수도 있습니다. 이러한 API를 통해 시스템 접근성 설정이 활성화될 때 고대비 색상 팔레트로 전환할 수 있습니다.

색상 팔레트를 정의할 때 WCAG 준수 대비 검사 도구를 사용하여 선택한 `onPrimary` 색상이 기본 색상과 충분한 대비를 이루는지, `onSurface`가 표면 색상과 충분한 대비를 이루는지 등을 확인하십시오. 색상 간의 대비율이 최소 4.5:1인지 확인하십시오. 사용자 지정 전경색 및 배경색의 경우, 특히 작은 텍스트의 경우 대비율이 7:1이어야 합니다. 이는 `lightColorScheme` 및 `darkColorScheme` 모두에 적용됩니다.

이 코드는 테마 패키지에서 고대비 밝은 색상 및 어두운 색상 팔레트를 정의하는 방법을 보여줍니다.

```kotlin
import androidx.compose.ui.graphics.Color

// Defines a data class to hold the color palette for high-contrast themes
data class HighContrastColors(
    val primary: Color, // Main interactive elements, primary text, top app bars
    val onPrimary: Color, // Content displayed on top of a 'primary' color
    val secondary: Color, // Secondary interactive elements, floating action buttons
    val onSecondary: Color, // Content displayed on top of a 'secondary' color
    val tertiary: Color, // An optional third accent color
    val onTertiary: Color, // Content displayed on top of a 'tertiary' color
    val background: Color, // Main background of the screen
    val onBackground: Color, // Content displayed on top of a 'background' color
    val surface: Color, // Card backgrounds, sheets, menus, elevated surfaces
    val onSurface: Color, // Content displayed on top of a 'surface' color
    val error: Color, // Error states and messages
    val onError: Color, // Content displayed on top of an 'error' color
    val success: Color, // Success states and messages
    val onSuccess: Color, // Content displayed on top of a 'success' color
    val warning: Color, // Warning states and messages
    val onWarning: Color, // Content displayed on top of a 'warning' color
    val outline: Color, // Borders, dividers, disabled states
    val scrim: Color // Dimming background content behind modals/sheets
)

// Neutral colors
val Black = Color(0xFF000000)
val White = Color(0xFFFFFFFF)
val DarkGrey = Color(0xFF1A1A1A)
val MediumGrey = Color(0xFF888888)
val LightGrey = Color(0xFFE5E5E5)

// Primary accent colors
val RoyalBlue = Color(0xFF0056B3)
val SkyBlue = Color(0xFF007AFF)

// Secondary  and tertiary accent colors
val EmeraldGreen = Color(0xFF28A745)
val GoldenYellow = Color(0xFFFFC107)
val DeepPurple = Color(0xFF6F42C1)

// Status colors
val ErrorRed = Color(0xFFD32F2F)
val SuccessGreen = Color(0xFF388E3C)
val WarningOrange = Color(0xFFF57C00)

// Light high-contrast palette, dark content on light backgrounds
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

// Dark high-contrast palette, light content on dark backgrounds
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

Compose Multiplatform for iOS는 기기를 제어하기 위한 추가 입력 방식을 지원합니다. 터치스크린에 의존하는 대신, AssistiveTouch를 활성화하여 마우스 또는 트랙패드를 사용하거나, 전체 키보드 접근(Full Keyboard Access)을 활성화하여 키보드를 사용할 수 있습니다.

* AssistiveTouch (**설정** | **손쉬운 사용** | **터치** | **AssistiveTouch**)를 사용하면 연결된 마우스 또는 트랙패드의 포인터로 iPhone을 제어할 수 있습니다. 포인터를 사용하여 화면의 아이콘을 클릭하고, AssistiveTouch 메뉴를 탐색하거나, 화상 키보드를 사용하여 입력할 수 있습니다.

  iPad의 경우, 마우스 또는 트랙패드를 연결하면 기본적인 사용에는 바로 작동합니다. 그러나 포인터 크기를 조정하고, 추적 속도를 변경하거나, 버튼에 특정 동작을 할당하려면 여전히 AssistiveTouch를 활성화해야 합니다.
* 전체 키보드 접근(Full Keyboard Access) (**설정** | **손쉬운 사용** | **키보드** | **전체 키보드 접근**)은 연결된 키보드로 기기 제어를 활성화합니다. **Tab** 키와 같은 키로 탐색하고 **Space**를 사용하여 항목을 활성화할 수 있습니다.

## XCTest 프레임워크로 접근성 테스트

시맨틱 접근성 데이터를 테스트 및 기타 자동화에 사용할 수 있습니다. `testTag`와 같은 속성은 `accessibilityIdentifier`와 같은 네이티브 접근성 속성에 올바르게 매핑됩니다. 이를 통해 Compose Multiplatform의 시맨틱 데이터가 접근성 서비스와 XCTest 프레임워크에서 사용할 수 있게 됩니다.

UI 테스트에서 자동화된 접근성 감사를 사용할 수 있습니다.
`XCUIApplication`에 대해 `performAccessibilityAudit()`를 호출하면 Accessibility Inspector가 하는 것처럼 현재 뷰에서 접근성 문제를 감사합니다.

```swift
func testAccessibilityTabView() throws {
	let app = XCUIApplication()
	app.launch()
	app.tabBars.buttons["MyLabel"].tap()

	try app.performAccessibilityAudit()
}
```

## 접근성 트리 동기화 사용자 지정

기본 설정에서는:
* iOS 접근성 트리는 접근성 서비스가 실행 중일 때만 UI와 동기화됩니다.
* 동기화 이벤트는 로그되지 않습니다.

새 Compose Multiplatform API를 사용하여 이러한 설정을 사용자 지정할 수 있습니다.

### 트리 동기화 옵션 선택

> Compose Multiplatform 1.8.0에서는 [접근성 트리가 지연 동기화되고 더 이상 추가 구성이 필요하지 않기 때문에](whats-new-compose-180.md#loading-accessibility-tree-on-demand) 이 옵션은 제거되었습니다.
>
{style="tip"}

이벤트 및 상호 작용을 디버그하고 테스트하기 위해 동기화 모드를 다음으로 변경할 수 있습니다.
* 예를 들어, 접근성 매핑을 일시적으로 비활성화하도록 트리를 UI와 절대 동기화하지 않도록.
* 접근성 통합을 철저히 테스트하기 위해 UI가 업데이트될 때마다 다시 작성되도록 트리를 항상 동기화하도록.

> 각 UI 이벤트 후에 트리를 동기화하는 것은 디버깅 및 테스트에 매우 유용할 수 있지만 앱의 성능을 저하시킬 수 있다는 점을 기억하십시오.
>
{style="note"}

접근성 트리를 항상 동기화하는 옵션을 활성화하는 예시입니다.

```kotlin
ComposeUIViewController(configure = {
    accessibilitySyncOptions = AccessibilitySyncOptions.Always(debugLogger = null)
}) {
    // your @Composable content
}
```

`AccessibilitySyncOptions` 클래스는 사용 가능한 모든 옵션을 포함합니다.

```kotlin
// package androidx.compose.ui.platform

@ExperimentalComposeApi
sealed class AccessibilitySyncOptions {
    
    // 접근성 트리를 동기화하지 않는 옵션
    object Never: AccessibilitySyncOptions

    // 접근성 서비스가 실행 중일 때만 트리를 동기화하는 옵션
    //
    // AccessibilityDebugLogger를 포함하여 상호 작용 및 트리 동기화 이벤트를 로깅할 수 있습니다.
    class WhenRequiredByAccessibilityServices(debugLogger: AccessibilityDebugLogger?)

    // 접근성 트리를 항상 동기화하는 옵션
    //
    // AccessibilityDebugLogger를 포함하여 상호 작용 및 트리 동기화 이벤트를 로깅할 수 있습니다.
    class Always(debugLogger: AccessibilityDebugLogger?)
}
```

### 로깅 인터페이스 구현

`AccessibilityDebugLogger` 인터페이스를 구현하여 선택한 출력으로 사용자 지정 메시지를 작성할 수 있습니다.

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
    // @Composable 콘텐츠
}
```

## 다음 단계

* [Apple 접근성](https://developer.apple.com/accessibility/) 가이드에서 자세히 알아보세요.
* [Kotlin Multiplatform 위저드](https://kmp.jetbrains.com/)에서 생성된 프로젝트를 평소 사용하는 iOS 접근성 워크플로에서 사용해 보세요.