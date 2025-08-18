# 레이아웃 기본 사항

Compose Multiplatform에서 사용자 인터페이스를 효과적으로 구축하려면 핵심 원칙, 레이아웃 단계, UI를 구조화하는 데 사용할 수 있는 공통 구성 요소 및 도구를 포함하여 레이아웃 구성의 주요 개념을 이해하는 것이 중요합니다.

## 컴포저블 함수

일련의 컴포저블 함수를 정의하여 사용자 인터페이스를 구축할 수 있습니다. 이러한 함수는 데이터를 받아 UI 요소를 내보냅니다. `@Composable` 어노테이션은 Compose 컴파일러에게 해당 함수가 데이터를 UI로 변환함을 알려줍니다.

텍스트를 표시하는 간단한 컴포저블 함수:

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column, Row, and Box

레이아웃을 구성하려면 다음 기본 빌딩 블록을 사용할 수 있습니다:

*   화면에 항목을 수직으로 배치하려면 `Column`을 사용합니다.
*   화면에 항목을 수평으로 배치하려면 `Row`를 사용합니다.
*   요소를 서로 쌓으려면 `Box`를 사용합니다.
*   반응형 레이아웃을 구축하려면 `Row`와 `Column`의 `FlowRow` 및 `FlowColumn` 버전을 사용합니다. 컨테이너 공간이 부족하면 항목이 자동으로 다음 줄로 흐르게 하여 여러 개의 행 또는 열을 생성합니다:

    ```kotlin
    @Composable
    fun ResponsiveLayout() {
        FlowRow {
            Text(text = "Item 1")
            Text(text = "Item 2")
            Text(text = "Item 3")
        }
    }
    ```

## 수정자

수정자(Modifier)는 컴포저블의 동작을 선언적인 방식으로 꾸미거나 조정할 수 있게 해줍니다.
수정자는 크기, 정렬, 패딩, 상호작용 동작 등 다양한 요소에 대한 제어를 제공하여 레이아웃 및 상호작용을 사용자 지정하는 데 필수적입니다.

예를 들어, 텍스트에 패딩과 가운데 정렬을 추가할 수 있습니다:

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

[](compose-layout-modifiers.md)에서 더 자세히 알아보세요.

## 다음 단계

*   레이아웃에 대해 더 자세히 알아보려면 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/layouts)를 참조하세요.
*   컴포넌트의 [수명 주기](compose-lifecycle.md)에 대해 알아보세요.