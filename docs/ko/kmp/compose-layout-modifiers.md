# 수정자(modifier) 사용하기

수정자를 사용하면 컴포저블(composable)을 꾸미거나 기능을 확장할 수 있습니다. 수정자를 사용하면 다음을 수행할 수 있습니다.

*   컴포저블의 크기, 레이아웃, 동작 및 모양을 변경합니다.
*   접근성 라벨과 같은 정보를 추가합니다.
*   사용자 입력을 처리합니다.
*   요소를 클릭 가능하게, 스크롤 가능하게, 드래그 가능하게, 확대/축소 가능하게 만드는 것과 같은 고수준 상호작용을 추가합니다.

## 수정자 체인

수정자는 여러 효과를 적용하기 위해 함께 연결할 수 있습니다.

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(
        // 연결된 `Modifier` 함수:
        modifier = Modifier
            // `Modifier.padding(24.dp)`는 컬럼 주위에 패딩을 추가합니다
            .padding(24.dp)
            // `Modifier.fillMaxWidth()`는 컬럼이 사용 가능한 너비를 채우도록 확장합니다
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

**수정자 체인의 함수 순서는 중요합니다**. 각 함수는 이전 함수가 반환한 `Modifier`에 변경 사항을 적용하므로, 호출 순서가 컴포저블의 최종 동작과 모양에 직접적인 영향을 미칩니다.

## 내장 수정자

Compose Multiplatform은 일반적인 레이아웃 및 위치 지정 작업을 처리하기 위해 `size`, `padding`, `offset`과 같은 내장 수정자를 제공합니다.

### 크기 수정자

고정된 크기를 설정하려면 `size` 수정자를 사용하세요. 제약 조건(constraints)을 재정의해야 할 때는 `requiredSize` 수정자를 사용하세요.

```kotlin
@Composable
fun Card() {
    // 행의 크기를 400x100 dp로 설정합니다
    Row(modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            // 필요한 크기를 150x150 dp로 설정하고 부모의 100 dp 제한을 재정의합니다
            modifier = Modifier.requiredSize(150.dp)
        )
        Column {
            // 내용은 행 내에서 남은 공간을 차지합니다
        }
    }
}
```

### 패딩 수정자

`padding` 수정자를 사용하여 요소 주위에 패딩을 추가합니다. 또한 `paddingFromBaseline`을 사용하여 기준선(baselines)에 상대적으로 패딩을 동적으로 적용할 수도 있습니다.

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 기준선에 상대적으로 위치를 조정하기 위해 패딩을 적용합니다
            Text(
                text = "Title",
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            // 패딩이 지정되지 않았으므로 기본 배열을 따릅니다
            Text(text = "Subtitle")
        }
    }
}
```

### 오프셋 수정자

레이아웃의 원래 위치에서 조정하려면 `offset` 수정자를 사용하세요. X축과 Y축의 오프셋을 지정합니다.

```kotlin
@Composable
fun Card() {
    Row {
        Column {
            // 오프셋이 적용되지 않은 상태로 텍스트를 정상적으로 배치합니다
            Text(text = "Title")
            
            // X축을 따라 4.dp 오프셋으로 텍스트를 약간 오른쪽으로 이동시키고,
            // 원래 수직 위치를 유지합니다
            Text(
                text = "Subtitle",
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

## 스코프 수정자

스코프 수정자(부모 데이터 수정자라고도 함)는 부모 레이아웃에 자식에 대한 특정 요구 사항을 알립니다. 예를 들어, 부모 `Box`의 크기와 일치시키려면 `matchParentSize` 수정자를 사용하세요.

```kotlin
@Composable
fun MatchParentSizeComposable() {
    Box {
        // 부모 Box의 크기를 가져옵니다
        Spacer(
            Modifier
                .matchParentSize() 
                .background(Color.LightGray)
        )
        // 가장 큰 자식 요소가 Box 크기를 결정합니다
        Card()
    }
}
```

스코프 수정자의 또 다른 예로는 `RowScope` 또는 `ColumnScope` 내에서 사용할 수 있는 `weight`가 있습니다. 이는 컴포저블이 형제 요소(siblings)에 상대적으로 얼마만큼의 공간을 차지해야 하는지 결정합니다.

```kotlin
@Composable
fun Card() {
    Row(
        // 부모의 전체 너비를 차지합니다
        modifier = Modifier.fillMaxWidth() 
    ) {
        Image(
            /* 이미지 로딩을 위한 플레이스홀더 */,
            // 1f의 가중치를 할당하여 사용 가능한 공간의 한 부분을 차지하도록 합니다
            modifier = Modifier.weight(1f) 
        )
        
        Column(
            // Image 대비 두 배의 너비를 차지하도록 2f의 가중치를 할당합니다
            modifier = Modifier.weight(2f)
        ) {
            // 컬럼 내부의 내용
        }
    }
}
```

## 수정자 추출 및 재사용

수정자를 함께 연결할 때, 해당 체인을 변수나 함수로 추출하여 재사용할 수 있습니다. 이는 코드 가독성을 높이고 수정자 인스턴스를 재사용함으로써 성능을 향상시킬 수 있습니다.

```kotlin
val commonModifier = Modifier
    .padding(16.dp)
    .background(Color.LightGray)

@Composable
fun Example() {
    // 패딩과 배경색이 있는 재사용 가능한 수정자를 적용합니다
    Text("Reusable modifier", modifier = commonModifier)

    // Button에 동일한 수정자를 재사용합니다
    Button(
        onClick = { /* Do something */ },
        modifier = commonModifier
    )
    {
        Text("Button with the same modifier")
    }
}
```

## 사용자 지정 수정자

Compose Multiplatform은 기본적으로 일반적인 사용 사례를 위한 많은 내장 수정자를 제공하지만, 사용자 지정 수정자를 직접 생성할 수도 있습니다.

사용자 지정 수정자를 생성하는 데는 몇 가지 접근 방식이 있습니다.

*   [기존 수정자 연결](https://developer.android.com/develop/ui/compose/custom-modifiers#chain-existing)
*   [컴포저블 수정자 팩토리 사용](https://developer.android.com/develop/ui/compose/custom-modifiers#create_a_custom_modifier_using_a_composable_modifier_factory)
*   [하위 수준 `Modifier.Node` API](https://developer.android.com/develop/ui/compose/custom-modifiers#implement-custom)

## 다음 내용

[Jetpack Compose 문서](https://developer.android.com/develop/ui/compose/modifiers)에서 수정자에 대해 더 자세히 알아보세요.