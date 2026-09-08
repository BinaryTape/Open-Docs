[//]: # (title: 팝업)

<web-summary>Compose 멀티플랫폼에서 드롭다운, 툴팁, 메뉴를 위한 팝업을 만들고 위치를 지정하며 커스텀하는 방법을 알아봅니다.</web-summary>

Compose 멀티플랫폼의 팝업(Popup)은 동일한 창 내의 현재 UI 위에 콘텐츠를 렌더링하는 플로팅 컨테이너입니다.

멀티플랫폼 `Dialog()` API와 달리, `Popup()`은 비모달(non-modal) 방식입니다.
Compose 멀티플랫폼의 다이얼로그(Dialog)는 포커스를 가져오고, 콘텐츠를 중앙에 배치하며, 나머지 UI와의 상호작용을 차단하기 위해 어두운 스크림(scrim)을 사용하는 모달 컨테이너로 동작합니다.
반면 팝업은 스크림이 없고 너비를 제한하지 않으며, 사용자가 배경이 되는 UI와 계속 상호작용할 수 있도록 허용합니다.
팝업은 기본적으로 중앙에 배치되지 않으며, 특정 컴포넌트에 고정(anchor)하려면 추가 인자가 필요합니다.

사용자의 작업을 중단하고 계속하기 전에 결정이 필요한 경우(예: 확인, 알림 또는 짧은 양식에 대한 반응)에는 [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)를 사용하세요. 데스크톱에서 별도의 OS 수준 다이얼로그를 사용하려면 [`DialogWindow()`](compose-desktop-top-level-windows-management.md#show-dialogs)를 참조하세요.
드롭다운, 툴팁, 메뉴와 같이 현재 창 내부의 컴포넌트에 고정되어 있는 가볍고 차단되지 않는 오버레이에는 `Popup()`을 사용하세요.

## 팝업 위치 지정하기 {id="position-a-popup"}

팝업의 위치를 지정하려면 `alignment`와 `offset`을 사용하거나, 고정된 배치를 위해 커스텀 `PopupPositionProvider`를 사용하세요.

단순한 정렬(alignment)의 경우:

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

Box(Modifier.padding(24.dp)) {
    Button(onClick = { isPopupOpen = !isPopupOpen }) {
        Text("Toggle popup")
    }

    if (isPopupOpen) {
        Popup(
            // 버튼을 기준으로 팝업의 위치를 지정합니다.
            alignment = Alignment.TopStart,
            // 팝업을 픽셀 단위의 (x, y)만큼 이동시킵니다.
            offset = IntOffset(30, 70),
            // 사용자가 외부를 클릭하는 등 팝업이 닫힐 때 호출됩니다.
            onDismissRequest = { isPopupOpen = false }
        ) {
            Box(
                Modifier
                    .background(Color.LightGray, RoundedCornerShape(4.dp))
                    .padding(12.dp)
            ) {
                Text("Popup content on top of UI")
            }
        }
    }
}
```

고정된 배치(anchored placement)를 위해서는 `PopupPositionProvider`를 사용하세요:

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

val belowAnchor = remember {
    object : PopupPositionProvider {
        override fun calculatePosition(
            anchorBounds: IntRect,
            windowSize: IntSize,
            layoutDirection: LayoutDirection,
            popupContentSize: IntSize
        ) = IntOffset(x = anchorBounds.left - 20, y = anchorBounds.bottom - 20)
    }
}

Column(Modifier.padding(24.dp)) {
    Box {
        Button(onClick = { isPopupOpen = !isPopupOpen }) {
            Text("Toggle menu")
        }

        if (isPopupOpen) {
            Popup(
                popupPositionProvider = belowAnchor,
                onDismissRequest = { isPopupOpen = false }
            ) {
                Box(
                    Modifier
                        .shadow(4.dp, RoundedCornerShape(4.dp))
                        .background(Color.White, RoundedCornerShape(4.dp))
                        .padding(12.dp)
                ) {
                    Text("Anchored to the button")
                }
            }
        }
    }
}
```

## 동작 커스텀하기 {id="customize-behavior"}

`PopupProperties`를 사용하여 팝업이 포커스와 닫기(dismissal)를 처리하는 방식을 제어할 수 있습니다.

* `focusable`: 팝업이 키 이벤트를 받을지 여부를 결정합니다. 기본값은 `false`입니다.
* `dismissOnBackPress`: 안드로이드의 뒤로 가기 버튼이나 데스크톱의 **Esc** 키를 눌렀을 때 팝업을 닫습니다. 기본값은 `true`이며, `focusable = true`가 설정되어 있어야 합니다.
* `dismissOnClickOutside`: 사용자가 팝업 범위 밖을 클릭했을 때 팝업을 닫습니다. 기본값은 `true`입니다.

`Popup()`과 `PopupProperties`는 공통(common) API의 일부입니다.
하지만 일부 속성은 공통 소스 세트에서 사용할 수 없습니다. 예를 들어, `usePlatformInsets`는 iOS에서만 사용할 수 있으며, 팝업의 콘텐츠를 플랫폼 인셋(세이프 에어리어) 내로 제한합니다.

## 다음 단계 {id="what-s-next"}

전체 API 세부 정보는 Jetpack Compose 문서의 레퍼런스를 참조하세요.
* [`Popup()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Popup.composable)
* [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)