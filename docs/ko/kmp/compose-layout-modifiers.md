# Modifier 사용하기

Modifier(수정자)를 사용하면 컴포저블(composable)을 꾸미거나 기능을 확장할 수 있습니다. Modifier를 사용하여 다음을 수행할 수 있습니다.

* 컴포저블의 크기, 레이아웃, 동작 및 모양 변경.
* 접근성 레이블과 같은 정보 추가.
* 사용자 입력 처리.
* 요소를 클릭 가능, 스크롤 가능, 드래그 가능 또는 확대 가능하게 만드는 것과 같은 상위 수준의 상호작용 추가.

## Modifier 체이닝

여러 효과를 적용하기 위해 Modifier를 함께 연결(chain)할 수 있습니다.

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 연결된 `Modifier` 함수들:
        modifier = Modifier
            // `Modifier.padding(24.dp)`는 컬럼 주위에 패딩을 추가합니다.
            .padding(24.dp)
            // `Modifier.fillMaxWidth()`는 컬럼이 사용 가능한 너비를 채우도록 확장합니다.
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**Modifier 체인에서 함수 호출 순서는 매우 중요합니다.** 각 함수는 이전 함수가 반환한 `Modifier`를 변경하므로, 호출 순서가 컴포저블의 최종 동작과 모양에 직접적인 영향을 미칩니다.

## 기본 제공 Modifier

Compose Multiplatform은 일반적인 레이아웃 및 배치 작업을 처리하기 위해 `size`, `padding`, `offset`과 같은 기본 제공 Modifier를 제공합니다.

### 크기 Modifier

고정된 크기를 설정하려면 `size` Modifier를 사용하세요. 제약 조건(constraints)을 무시해야 하는 경우에는 `requiredSize` Modifier를 사용하세요.

```kotlin
@Composable
fun Card() {
    // 로우(row) 크기를 400x100 dp로 설정합니다.
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 필수 크기를 150x150 dp로 설정하고 부모의 100 dp 제한을 무시합니다.
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 콘텐츠가 로우 내의 남은 공간을 차지합니다.
        }
    }
}
```

### 패딩 Modifier

`padding` Modifier로 요소 주위에 여백을 추가하세요. `paddingFromBaseline`을 사용하여 기준선(baseline)을 기준으로 동적으로 패딩을 적용할 수도 있습니다.

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 기준선에 상대적인 위치를 조정하기 위해 패딩을 적용합니다.
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 지정된 패딩이 없으므로 기본 배치를 따릅니다.
            Text(text = "Subtitle")
        }
    }
}
```

### 오프셋 Modifier

레이아웃의 위치를 원래 위치에서 조정하려면 `offset` Modifier를 사용하세요. X축과 Y축의 오프셋을 지정합니다.

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 오프셋을 적용하지 않고 텍스트를 정상적으로 배치합니다.
            Text(text = "Title")
            
            // 원래의 세로 위치를 유지하면서 X축을 따라 4.dp 오프셋으로 
            // 텍스트를 오른쪽으로 약간 이동합니다.
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 스코프 지정 Modifier

상위 데이터 Modifier(parent data modifiers)라고도 불리는 스코프 지정(Scoped) Modifier는 자식 요소에 대한 특정 요구 사항을 부모 레이아웃에 알립니다. 예를 들어, 부모 `Box`의 크기에 맞추려면 `matchParentSize` Modifier를 사용합니다.

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 부모 Box의 크기를 따릅니다.
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 가장 큰 자식으로, Box의 크기를 결정합니다.
        Card()
    }
}
```

스코프 지정 Modifier의 또 다른 예는 `RowScope` 또는 `ColumnScope` 내에서 사용할 수 있는 `weight`입니다. 이는 컴포저블이 형제 요소들과 비교하여 얼마나 많은 공간을 차지해야 하는지 결정합니다.

```kotlin
@Composable
fun Card() {
    Row(
        // 부모의 전체 너비를 차지합니다.
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 이미지를 로드하기 위한 플레이스홀더 */,
            // 1f의 가중치를 할당하여 사용 가능한 공간의 한 부분을 차지합니다.
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // 2f의 가중치를 할당하여 이미지에 비해 두 배의 너비를 차지합니다.
            modifier = Modifier.weight(2f)
        ) {
            // 컬럼 내부의 콘텐츠
        }
    }
}
```

## Modifier 추출 및 재사용

Modifier를 체이닝할 때, 재사용을 위해 체인을 변수나 함수로 추출할 수 있습니다. 이는 코드 가독성을 향상시키고 Modifier 인스턴스를 재사용함으로써 성능을 높일 수 있습니다.

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 패딩과 배경색이 포함된 재사용 가능한 Modifier를 적용합니다.
    Text("Reusable modifier", modifier = commonModifier)

    // Button에 동일한 Modifier를 재사용합니다.
    Button(
        onClick = { /* 동작 수행 */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 커스텀 Modifier

Compose Multiplatform은 일반적인 사용 사례를 위해 다양한 기본 제공 Modifier를 제공하지만, 직접 커스텀 Modifier를 만들 수도 있습니다.

커스텀 Modifier를 만드는 방법에는 여러 가지가 있습니다.

* [기존 Modifier 체이닝](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
* [컴포저블 Modifier 팩토리 사용](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
* [저수준 `Modifier.Node` API 사용](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 다음 단계

[Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/modifiers)에서 Modifier에 대해 자세히 알아보세요.