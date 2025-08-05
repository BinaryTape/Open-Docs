[//]: # (title: 접근성)

Compose Multiplatform은 시맨틱 속성, 접근성 API, 스크린 리더 및 키보드 탐색을 포함한 보조 기술 지원 등 접근성 표준을 충족하는 데 필수적인 기능을 제공합니다.

이 프레임워크를 통해 [유럽 접근성 법안](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)(EAA) 및 [웹 콘텐츠 접근성 가이드라인](https://www.w3.org/TR/WCAG21/)(WCAG)의 요구 사항을 준수하는 애플리케이션을 설계할 수 있습니다.

## 시맨틱 속성

접근성, 자동 채우기, 테스트와 같은 서비스에 컨텍스트를 제공하기 위해 시맨틱 속성을 사용하여 컴포넌트의 의미와 역할을 정의할 수 있습니다.

시맨틱 속성은 UI의 간소화된 표현인 시맨틱 트리의 구성 요소입니다. 컴포저블에서 시맨틱 속성을 정의하면 해당 속성은 시맨틱 트리에 자동으로 추가됩니다. 보조 기술은 전체 UI 트리가 아닌 시맨틱 트리를 순회하여 앱과 상호 작용합니다.

접근성을 위한 주요 시맨틱 속성:

*   `contentDescription`은 [`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) 및 [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html)과 같이 텍스트가 아닌 또는 모호한 UI 요소에 대한 설명을 제공합니다. 이는 기본 접근성 API이며, 스크린 리더가 알리는 텍스트 레이블을 제공하는 역할을 합니다.

    ```kotlin
    Modifier.semantics { contentDescription = "Description of the image" }
    ```

*   `role`은 버튼, 체크박스 또는 이미지와 같은 UI 컴포넌트의 기능적 유형에 대해 접근성 서비스에 알립니다. 이는 스크린 리더가 상호 작용 모델을 해석하고 요소를 제대로 알리도록 돕습니다.

    ```kotlin
    Modifier.semantics { role = Role.Button }
    ```

*   `stateDescription`은 상호 작용 UI 요소의 현재 상태를 설명합니다.

    ```kotlin
    Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
    ```

*   `testTag`는 Android의 Espresso 프레임워크 또는 iOS의 XCUITest를 사용한 UI 테스트를 위해 컴포저블 요소에 고유 식별자를 할당합니다. 또한 `testTag`를 디버깅이나 컴포넌트 식별자가 필요한 특정 자동화 시나리오에서 사용할 수 있습니다.

    ```kotlin
    Modifier.testTag("my_unique_element_id")
    ```

시맨틱 속성의 전체 목록은 [`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties)에 대한 Jetpack Compose API 참조를 참조하십시오.

## 순회 순서

기본적으로 스크린 리더는 UI 요소를 왼쪽에서 오른쪽, 위에서 아래로 레이아웃을 따라 고정된 순서로 탐색합니다. 그러나 복잡한 레이아웃의 경우 스크린 리더가 올바른 읽기 순서를 자동으로 결정하지 못할 수 있습니다. 이는 포함된 뷰의 스크롤 및 확대/축소를 지원하는 테이블 및 중첩 뷰와 같은 컨테이너 뷰가 있는 레이아웃에 특히 중요합니다.

복잡한 뷰를 스크롤하고 스와이프할 때 올바른 읽기 순서를 보장하려면 순회 시맨틱 속성을 정의하십시오. 이는 또한 위로 스와이프 또는 아래로 스와이프 접근성 제스처를 사용하여 다른 순회 그룹 간의 올바른 탐색을 보장합니다.

컴포넌트의 순회 인덱스 기본값은 `0f`입니다. 컴포넌트의 순회 인덱스 값이 낮을수록 다른 컴포넌트에 비해 해당 콘텐츠 설명이 더 일찍 읽힙니다.

예를 들어, 스크린 리더가 플로팅 액션 버튼의 우선순위를 지정하도록 하려면 순회 인덱스를 `-1f`로 설정할 수 있습니다.

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // Sets a negative index to prioritize over elements with the default index
            traversalIndex = -1f
        }
    ) {
        FloatingActionButton(onClick = {}) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Icon of floating action button"
            )
        }
    }
}
```

## 다음 단계

iOS 접근성 기능에 대해 자세히 알아보기:

*   [고대비 테마](compose-ios-accessibility.md#high-contrast-theme)
*   [XCTest 프레임워크로 접근성 테스트](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
*   [트랙패드 및 키보드를 통한 제어](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
*   [시맨틱 트리를 iOS 접근성 트리와 동기화](compose-ios-accessibility.md#choose-the-tree-synchronization-option) (Compose Multiplatform 1.7.3 및 이전 버전에 해당)

데스크톱 접근성 기능에 대해 자세히 알아보기:

*   [Windows에서 접근성 사용](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
*   [macOS 및 Windows 도구를 사용하여 앱 테스트](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

구현 세부 정보는 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/accessibility)를 참조하십시오.