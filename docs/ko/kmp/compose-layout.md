# 레이아웃 기초

Compose Multiplatform에서 사용자 인터페이스를 효과적으로 구축하려면 핵심 원칙, 레이아웃 단계(phases), UI 구조화를 위해 제공되는 일반적인 컴포넌트와 도구를 포함한 레이아웃 구성의 주요 개념을 이해하는 것이 중요합니다.

## 컴포저블(Composable) 함수

일련의 컴포저블 함수를 정의하여 사용자 인터페이스를 구축할 수 있습니다. 이 함수들은 데이터를 입력받아 UI 요소를 내보냅니다. `@Composable` 어노테이션은 해당 함수가 데이터를 UI로 변환한다는 것을 Compose 컴파일러에 알립니다.

텍스트를 표시하는 간단한 컴포저블 함수는 다음과 같습니다:

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

## Column, Row, Box

레이아웃의 구조를 잡기 위해 다음과 같은 기본 빌딩 블록을 사용할 수 있습니다:

* `Column`을 사용하여 항목을 화면에 세로로 배치합니다.
* `Row`를 사용하여 항목을 화면에 가로로 배치합니다.
* `Box`를 사용하여 요소를 서로 겹쳐서 쌓습니다. 
* 반응형 레이아웃을 구축하려면 `Row`와 `Column`의 `FlowRow` 및 `FlowColumn` 버전을 사용하세요. 컨테이너의 공간이 부족해지면 항목이 자동으로 다음 줄로 넘어가 여러 행이나 열을 생성합니다:
 
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

## Modifier(수정자)

Modifier를 사용하면 선언적인 방식으로 컴포저블을 장식하거나 동작을 조정할 수 있습니다. Modifier는 크기(dimensions), 정렬(alignment), 패딩(padding), 상호작용 동작 등을 제어할 수 있게 해주므로 레이아웃과 상호작용을 커스터마이징하는 데 필수적입니다.

예를 들어, 텍스트에 패딩을 추가하고 중앙에 정렬할 수 있습니다:

```kotlin
@Composable
fun ModifierExample() {
    Text(
        text = "Hello with padding",
        modifier = Modifier.padding(16.dp)
    )
}
```

자세한 내용은 [](compose-layout-modifiers.md)에서 확인하세요.

## 다음 단계

* 레이아웃에 대해 더 자세히 알아보려면 [Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/layouts)를 참고하세요.
* 컴포넌트의 [생명주기(lifecycle)](compose-lifecycle.md)에 대해 알아보세요.