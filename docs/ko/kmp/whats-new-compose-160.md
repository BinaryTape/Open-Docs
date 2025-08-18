[//]: # (title: Compose Multiplatform 1.6.0의 새로운 기능)

Compose Multiplatform 1.6.0 릴리스의 주요 내용은 다음과 같습니다.

*   [주요 변경 사항](#breaking-changes)
*   [새롭게 개선된 리소스 API](#improved-resources-api-all-platforms)
*   [iOS 접근성 기능의 기본 지원](#accessibility-support)
*   [모든 플랫폼을 위한 UI 테스트 API](#ui-testing-api-experimental-all-platforms)
*   [팝업, 대화 상자, 드롭다운을 위한 별도의 플랫폼 뷰](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)
*   [Jetpack Compose 및 Material 3에서 병합된 변경 사항](#changes-from-jetpack-compose-and-material-3-all-platforms)
*   [안정화 버전의 Kotlin/Wasm 아티팩트](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
*   [알려진 문제: 누락된 종속성](#known-issues-missing-dependencies)

## 종속성

Compose Multiplatform의 이 버전은 다음 Jetpack Compose 라이브러리를 기반으로 합니다.

*   [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
*   [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
*   [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
*   [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
*   [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
*   [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 주요 변경 사항

### lineHeight가 설정된 텍스트의 패딩이 기본적으로 잘림

[LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim) 지원이 추가되면서,
Compose Multiplatform는 텍스트 패딩이 잘리는 방식에 있어 Android와 정렬됩니다.
자세한 내용은 [풀 리퀘스트](https://github.com/JetBrains/compose-multiplatform-core/pull/897)를 참조하세요.

이것은 [1.6.0-alpha01 릴리스](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01)의 `compose.material` 변경 사항과 일치합니다.
*   `includeFontPadding` 매개변수가 Android에서 기본적으로 `false`가 되었습니다.
    이 변경 사항에 대한 더 깊은 이해는 [Compose Multiplatform에서 이 플래그를 구현하지 않는 것에 대한 논의](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)를 참조하세요.
*   기본 줄 높이 스타일이 `Trim.None` 및 `Alignment.Center`로 변경되었습니다. Compose Multiplatform는 이제
    `LineHeightStyle.Trim`을 지원하며 `Trim.None`을 기본값으로 구현합니다.
*   `Typography`의 `TextStyle`에 명시적인 `lineHeight`가 추가되어 [다음 주요 변경 사항](#using-fontsize-in-materialtheme-requires-lineheight)으로 이어졌습니다.

### MaterialTheme에서 fontSize를 사용하려면 lineHeight가 필요

> 이는 `material` 컴포넌트에만 영향을 미칩니다. `material3`는 이미 이 제한 사항이 있었습니다.
>
{style="note"}

`MaterialTheme`에서 `Text` 컴포넌트에 `fontSize` 속성을 설정했지만 `lineHeight`를 포함하지 않으면 실제 줄
높이가 글꼴에 맞게 수정되지 않습니다. 이제 해당 `fontSize`를 설정할 때마다 `lineHeight` 속성을 명시적으로 지정해야 합니다.

Jetpack Compose는 이제 글꼴 크기를 직접 설정하지 않을 것을 [권장](https://issuetracker.google.com/issues/321872412)합니다.

> 비표준 텍스트 크기를 지원하기 위해, Material Design 시스템을 따르고 글꼴 크기를 직접 변경하는 대신 다른 [타입 스케일](https://m2.material.io/design/typography/the-type-system.html#type-scale)을
> 사용할 것을 권장합니다. 또는 다음과 같이 줄 높이를 덮어쓸 수 있습니다:
> `style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`, 또는 사용자 정의 `Typography`를 완전히 생성할 수 있습니다.
>
{style="tip"}

### 리소스 구성에 대한 새로운 접근 방식

Compose Multiplatform 1.6.0의 프리뷰 버전에서 리소스 API를 사용해왔다면,
[현재 버전 문서](compose-multiplatform-resources.md)를 숙지하십시오. 1.6.0-beta01은 리소스 파일이 프로젝트 코드에서
사용 가능하도록 프로젝트 폴더에 저장되는 방식을 변경했습니다.

## 플랫폼 전반

### 개선된 리소스 API (모든 플랫폼)

새로운 실험적 API는 문자열과 글꼴에 대한 지원을 추가하며, 공통 Kotlin에서 리소스를 더욱 편안하게 공유하고 접근할 수 있게 합니다.

*   리소스는 특정 설정이나 제약 조건에 따라 구성될 수 있으며, 다음을 지원합니다.
    *   로케일
    *   이미지 해상도
    *   다크 및 라이트 테마
*   Compose Multiplatform는 이제 각 프로젝트에 `Res` 객체를 생성하여 리소스에 직접적인 접근을 제공합니다.

리소스 한정자 및 새로운 리소스 API에 대한 더 자세한 개요는 [이미지 및 리소스](compose-multiplatform-resources.md)를 참조하세요.

### UI 테스트 API (실험적, 모든 플랫폼)

데스크톱 및 Android에서 이미 사용 가능했던 Compose Multiplatform용 UI 테스트 실험적 API가 이제 모든 플랫폼을 지원합니다.
프레임워크가 지원하는 모든 플랫폼에서 애플리케이션 UI의 동작을 검증하는 공통 테스트를 작성하고 실행할 수 있습니다.
이 API는 Jetpack Compose와 동일한 `finder`, `assertion`, `action`, `matcher`를 사용합니다.

> JUnit 기반 테스트는 데스크톱 프로젝트에서만 지원됩니다.
>
{style="note"}

설정 지침 및 테스트 예시는 [Compose Multiplatform UI 테스트하기](compose-test.md)를 참조하세요.

### Jetpack Compose 및 Material 3의 변경 사항 (모든 플랫폼)

#### Jetpack Compose 1.6.1

Jetpack Compose의 최신 릴리스 병합은 모든 플랫폼에서 성능에 긍정적인 영향을 미칩니다. 자세한 내용은
[Android Developers 블로그의 공지](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)를 참조하세요.

이 릴리스의 다른 주목할 만한 기능:
*   기본 글꼴 패딩 변경은 Android 타겟에만 적용되었습니다. 그러나 이 변경의 [부작용](#using-fontsize-in-materialtheme-requires-lineheight)을 고려해야 합니다.
*   마우스 선택은 Compose Multiplatform에서 다른 타겟에 대해 이미 지원되었습니다. 1.6.0부터는 Android도 포함됩니다.

아직 Compose Multiplatform에 포팅되지 않은 Jetpack Compose 기능:
*   [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
*   [비선형 글꼴 스케일링 지원](https://github.com/JetBrains/compose-multiplatform/issues/4305)
*   [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
*   [멀티플랫폼 드래그 앤 드롭](https://github.com/JetBrains/compose-multiplatform/issues/4235). 현재 Android에서만 작동합니다. 데스크톱에서는 기존 API인 `Modifier.onExternalDrag`를 사용할 수 있습니다.

JetBrains 팀은 Compose Multiplatform의 향후 버전에서 이러한 기능을 채택하기 위해 노력하고 있습니다.

#### Compose Material 3 1.2.0

릴리스 하이라이트:
*   단일 및 다중 선택을 지원하는 새로운 실험적 컴포넌트 `Segmented Button`.
*   UI에서 정보를 강조하기 쉽게 만들어주는 더 많은 표면 옵션이 있는 확장된 색상 세트.
    *   구현 참고 사항: `ColorScheme` 객체는 이제 불변(immutable)입니다. 코드가 현재 `ColorScheme`의 색상을 직접 수정하고 있다면,
        이제 [copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color)) 메서드를 사용하여 색상을 변경해야 합니다.
    *   단일 표면 값 대신, 이제 더 유연한 색상 관리를 위해 여러 표면 색상 및 표면 컨테이너 옵션이 있습니다.

Material 3의 변경 사항에 대한 자세한 내용은 [Material Design 블로그의 릴리스 게시물](https://material.io/blog/material-3-compose-1-2)을 참조하세요.

### 팝업, 대화 상자, 드롭다운을 위한 별도의 플랫폼 뷰 (iOS, 데스크톱)

때로는 팝업 요소(예: 툴팁 및 드롭다운 메뉴)가 초기 컴포저블 캔버스나 앱 창에 의해 제한되지 않는 것이 중요합니다.
이는 컴포저블 뷰가 전체 화면을 차지하지 않지만 경고 대화 상자를 띄워야 할 때 특히 중요해집니다.
1.6.0에서는 이를 안정적으로 달성할 수 있는 방법이 있습니다.

팝업 및 대화 상자는 여전히 자체 경계 밖으로 아무것도 그릴 수 없습니다(예: 최상위 컨테이너의 그림자).

#### iOS (안정화)

iOS에서는 이 기능이 기본적으로 활성화되어 있습니다.
이전 동작으로 되돌리려면 `platformLayers` 매개변수를 `false`로 설정하십시오.

```kotlin
ComposeUIViewController(
    configure = {
        platformLayers = false
    }
) {
    // your Compose code
}
```

#### 데스크톱 (실험적)

데스크톱에서 이 기능을 사용하려면 `compose.layers.type`
시스템 속성을 설정하십시오. 지원되는 값:
*   `WINDOW`: `Popup` 및 `Dialog` 컴포넌트를 별도의 데코레이션 없는 창으로 생성합니다.
*   `COMPONENT`: `Popup` 또는 `Dialog`를 동일한 창 내의 별도 Swing 컴포넌트로 생성합니다. 이는 오프스크린
    렌더링(`compose.swing.render.on.graphics`를 `true`로 설정, 1.5.0 Compose Multiplatform 릴리스 노트의
    [향상된 Swing 상호 운용](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)
    섹션 참조)에서만 작동합니다. 오프스크린 렌더링은 `ComposePanel`
    컴포넌트에서만 작동하며 전체 창 애플리케이션에서는 작동하지 않습니다.

`COMPONENT` 속성을 사용하는 코드 예시:

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
      ComposeContent()
    }
    composePanel.windowContainer = contentPane  // Use the full window for dialogs
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
  }

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="val window = JFrame()"}

`Dialog`(노란색)는 상위 `ComposePanel`(녹색)의 경계와 관계없이 완전히 그려집니다.

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### 텍스트 장식 선 스타일 지원 (iOS, 데스크톱, 웹)

Compose Multiplatform는 이제 `PlatformTextStyle` 클래스를 사용하여 텍스트에 밑줄 스타일을 설정할 수 있습니다.

> 이 클래스는 공통 소스 세트에서 사용할 수 없으며 플랫폼별 코드에서 사용해야 합니다.
>
{style="warning"}

점선 밑줄 스타일을 설정하는 예시:

```kotlin
Text(
  "Hello, Compose",
  style = TextStyle(
    textDecoration = TextDecoration.Underline,
    platformStyle = PlatformTextStyle (
      textDecorationLineStyle = TextDecorationLineStyle.Dotted
    )
  )
)
```

실선, 이중 폭 실선, 점선, 파선, 물결선 스타일을 사용할 수 있습니다. 사용 가능한 모든 옵션은
[소스 코드](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21)에서 확인하십시오.

### 시스템에 설치된 글꼴 접근 (iOS, 데스크톱, 웹)

이제 Compose Multiplatform 앱에서 시스템에 설치된 글꼴에 접근할 수 있습니다. `SystemFont` 클래스를 사용하여
적절한 글꼴 스타일과 글꼴 두께로 글꼴을 로드하십시오.

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

데스크톱에서는 `FontFamily` 함수를 사용하여 글꼴 패밀리 이름만 지정하여 가능한 모든 글꼴 스타일을 로드할 수 있습니다.
(자세한 예시는 [코드 샘플](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt) 참조).

```kotlin
FontFamily("Menlo")
```

## iOS

### 접근성 지원

iOS용 Compose Multiplatform는 이제 장애가 있는 사용자가 네이티브 iOS UI와 동일한 수준의 편안함으로 Compose UI와 상호 작용할 수 있도록 합니다.

*   화면 리더 및 VoiceOver가 Compose UI의 콘텐츠에 접근할 수 있습니다.
*   Compose UI는 탐색 및 상호 작용을 위해 네이티브 UI와 동일한 제스처를 지원합니다.

이는 Compose Multiplatform의 시맨틱 데이터를 Accessibility Services 및 XCTest 프레임워크에 제공할 수 있음을 의미하기도 합니다.

구현 및 사용자 정의 API에 대한 자세한 내용은 [iOS 접근성 기능 지원](compose-ios-accessibility.md)을 참조하세요.

### 컴포저블 뷰의 불투명도 변경

`ComposeUIViewController` 클래스에는 이제 뷰 배경의 불투명도를 투명하게 변경하는 구성 옵션이 하나 더 있습니다.

> 투명 배경은 추가적인 블렌딩 단계를 유발하므로 성능에 부정적인 영향을 미칩니다.
>
{style="note"}

```kotlin
val appController = ComposeUIViewController(configure = {
      this.opaque = false
}) {
    App()
}
```

투명 배경이 달성하는 데 도움이 될 수 있는 예시:

![Compose opaque = false demo](compose-opaque-property.png){width=700}

### SelectionContainer에서 두 번 및 세 번 탭하여 텍스트 선택

이전에는 iOS용 Compose Multiplatform에서 텍스트 입력 필드 내에서만 여러 번 탭하여 텍스트를 선택할 수 있었습니다.
이제 `SelectionContainer` 내의 `Text` 컴포넌트에 표시된 텍스트를 선택하기 위해 두 번 및 세 번 탭 제스처도 작동합니다.

### UIViewController와의 상호 운용

`UITabBarController` 또는 `UINavigationController`와 같이 `UIView`로 구현되지 않은 일부 네이티브 API는
[기존 상호 운용 메커니즘](compose-uikit-integration.md)을 사용하여 Compose Multiplatform UI에 포함될 수 없었습니다.

이제 Compose Multiplatform는 `UIKitViewController` 함수를 구현하여 네이티브 iOS 뷰 컨트롤러를 Compose UI에 포함할 수 있도록 합니다.

### 텍스트 필드에서 길게/한 번 탭하여 네이티브와 유사한 캐럿 동작

Compose Multiplatform는 이제 텍스트 필드에서 캐럿의 네이티브 iOS 동작에 더 가까워졌습니다.
*   텍스트 필드에서 한 번 탭한 후 캐럿의 위치가 더 정밀하게 결정됩니다.
*   텍스트 필드에서 길게 탭하고 드래그하면 Android에서처럼 선택 모드로 진입하는 것이 아니라 커서가 이동합니다.

## 데스크톱

### 개선된 상호 운용 블렌딩의 실험적 지원

과거에는 `SwingPanel` 래퍼를 사용하여 구현된 상호 운용 뷰는 항상 직사각형이었고,
항상 전경에 있으며 모든 Compose Multiplatform 컴포넌트 위에 있었습니다. 이로 인해 모든 팝업 요소
(드롭다운 메뉴, 토스트 알림)를 사용하기 어려웠습니다. 새로운 구현으로 이 문제가 해결되었으며,
이제 다음과 같은 사용 사례에서 Swing에 의존할 수 있습니다.

*   클리핑. 직사각형 모양에 국한되지 않습니다. 클립 및 그림자 모디파이어가 이제 SwingPanel과 함께 올바르게 작동합니다.

    ```kotlin
    // Flag necessary to enable the experimental blending 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
  이 기능 없이 `JButton`이 클리핑되는 방식은 왼쪽에, 실험적 블렌딩을 적용한 방식은 오른쪽에 표시됩니다.

  ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
*   겹치기. `SwingPanel` 위에 Compose Multiplatform 콘텐츠를 그려 넣고 평소처럼 상호 작용할 수 있습니다.
    여기서 "Snackbar"는 클릭 가능한 **OK** 버튼이 있는 Swing 패널 위에 있습니다.

  ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

알려진 제한 사항 및 추가 세부 정보는 [풀 리퀘스트 설명](https://github.com/JetBrains/compose-multiplatform-core/pull/915)을 참조하세요.

## 웹

### 프레임워크 안정화 버전에서 Kotlin/Wasm 아티팩트 사용 가능

Compose Multiplatform의 안정화 버전은 이제 Kotlin/Wasm 타겟을 지원합니다. 1.6.0으로 전환한 후에는
더 이상 종속성 목록에서 특정 `dev-wasm` 버전의 `compose-ui` 라이브러리를 지정할 필요가 없습니다.

> Wasm 타겟으로 Compose Multiplatform 프로젝트를 빌드하려면 Kotlin 1.9.22 이상이 필요합니다.
>
{style="warning"}

## 알려진 문제: 누락된 종속성

기본 프로젝트 구성에서 누락될 수 있는 라이브러리가 몇 가지 있습니다.

*   `org.jetbrains.compose.annotation-internal:annotation` 또는 `org.jetbrains.compose.collection-internal:collection`

    이들은 라이브러리가 Compose Multiplatform 1.6.0-beta02에 의존하는 경우 누락될 수 있으며, 1.6.0과 바이너리 호환되지 않습니다.
    어떤 라이브러리인지 파악하려면 다음 명령을 실행하십시오(`shared`를 메인 모듈 이름으로 바꾸십시오).

    ```shell
    ./gradlew shared:dependencies
    ```

    라이브러리를 Compose Multiplatform 1.5.12에 의존하는 버전으로 다운그레이드하거나, 라이브러리 작성자에게 Compose Multiplatform 1.6.0으로 업그레이드해달라고 요청하십시오.

*   `androidx.annotation:annotation:...` 또는 `androidx.collection:collection:...`

    Compose Multiplatform 1.6.0은 [collection](https://developer.android.com/jetpack/androidx/releases/collection)
    및 [annotation](https://developer.android.com/jetpack/androidx/releases/annotation) 라이브러리에 의존하며, 이들은
    Google Maven 저장소에서만 사용할 수 있습니다.

    이 저장소를 프로젝트에서 사용할 수 있도록 하려면 모듈의 `build.gradle.kts` 파일에 다음 줄을 추가하십시오.

    ```kotlin
    repositories {
        //...
        google()
    }