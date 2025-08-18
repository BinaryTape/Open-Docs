# Modifier 작업

Modifier를 사용하면 컴포저블을 꾸미거나 보강할 수 있습니다. Modifier를 사용하여 다음을 수행할 수 있습니다:

*   컴포저블의 크기, 레이아웃, 동작 및 모양을 변경합니다.
*   접근성 라벨과 같은 정보를 추가합니다.
*   사용자 입력을 처리합니다.
*   요소를 클릭 가능, 스크롤 가능, 드래그 가능, 확대/축소 가능하게 만드는 것과 같은 고수준 상호작용을 추가합니다.

## Modifier 체인 연결

Modifier는 여러 효과를 적용하기 위해 함께 연결될 수 있습니다:

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // Chained `Modifier` functions:
        modifier = Modifier
            // `Modifier.padding(24.dp)` adds padding around the column
            .padding(24.dp)
            // `Modifier.fillMaxWidth()` makes the column expand to fill the available width
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**체인 내 Modifier 함수의 순서는 중요합니다**. 각 함수는 이전 함수가 반환한 `Modifier`에 변경 사항을 적용하므로, 호출 순서가 컴포저블의 최종 동작과 모양에 직접적인 영향을 미칩니다.

## 내장 Modifier

Compose Multiplatform은 일반적인 레이아웃 및 위치 지정 작업을 처리하기 위해 `size`, `padding`, `offset`과 같은 내장 Modifier를 제공합니다.

### 크기 Modifier

고정 크기를 설정하려면 `size` Modifier를 사용합니다. 제약 조건을 재정의해야 할 때는 `requiredSize` Modifier를 사용합니다:

```kotlin
@Composable
fun Card() {
    // Sets the row size to 400x100 dp
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // Sets the required size to 150x150 dp and overrides the parent`s 100 dp limit
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // The content takes the remaining space within the row
        }
    }
}
```

### 패딩 Modifier

`padding` Modifier를 사용하여 요소 주위에 패딩을 추가할 수 있습니다. `paddingFromBaseline`을 사용하여 기준선에 상대적으로 동적으로 패딩을 적용할 수도 있습니다:

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // Applies padding to adjust the position relative to the baseline
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // Follows the default arrangement as there is no padding specified
            Text(text = "Subtitle")
        }
    }
}
```

### 오프셋 Modifier

레이아웃의 원래 위치에서 벗어나 위치를 조정하려면 `offset` Modifier를 사용합니다. X축과 Y축의 오프셋을 지정합니다:

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // Positions the text normally with no offsets applied
            Text(text = "Title")
            
            // Moves the text slightly to the right with the 4.dp offset along the X-axis,
            // while keeping the original vertical position
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 스코프 지정 Modifier

스코프 지정 Modifier(부모 데이터 Modifier라고도 함)는 자식에 대한 특정 요구 사항을 부모 레이아웃에 알립니다. 예를 들어, 부모 `Box`의 크기와 일치시키려면 `matchParentSize` Modifier를 사용합니다:

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // Takes size of its parent Box
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // The largest child, determines the Box size
        Card()
    }
}
```

스코프 지정 Modifier의 또 다른 예는 `RowScope` 또는 `ColumnScope` 내에서 사용할 수 있는 `weight`입니다. 이는 컴포저블이 형제 요소에 비해 얼마나 많은 공간을 차지해야 하는지 결정합니다:

```kotlin
@Composable
fun Card() {
    Row(
        // Takes the full width of its parent
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* Placeholder for loading an image */,
            // Assigns a weight of 1f to occupy one fraction of the available space 
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // Assigns a weight of 2f, taking twice the width compared to the Image
            modifier = Modifier.weight(2f)
        ) {
            // Content inside the column
        }
    }
}
```

## Modifier 추출 및 재사용

Modifier를 함께 연결할 때, 재사용을 위해 체인을 변수나 함수로 추출할 수 있습니다. 이는 코드 가독성을 향상시키고 Modifier 인스턴스를 재사용하여 성능을 향상시킬 수 있습니다.

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // Applies the reusable modifier with padding and background color
    Text("Reusable modifier", modifier = commonModifier)

    // Reuses the same modifier for the Button
    Button(
        onClick = { /* Do something */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 사용자 지정 Modifier

Compose Multiplatform은 일반적인 사용 사례를 위한 많은 내장 Modifier를 즉시 제공하지만, 자체적인 사용자 지정 Modifier를 생성할 수도 있습니다.

사용자 지정 Modifier를 생성하는 몇 가지 접근 방식이 있습니다:

*   [기존 Modifier 체인 연결](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [컴포저블 Modifier 팩토리 사용](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [하위 레벨 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 다음 단계

[Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/modifiers)에서 Modifier에 대해 자세히 알아보세요.