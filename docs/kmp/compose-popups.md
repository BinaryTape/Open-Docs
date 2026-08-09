[//]: # (title: 弹出窗口)

<web-summary>了解如何在 Compose Multiplatform 中创建、定位及自定义用于下拉菜单、工具提示和菜单的弹出窗口。</web-summary>

Compose Multiplatform 中的弹出窗口是一个悬浮容器，它在同一窗口内的当前 UI 之上渲染其内容。

与多平台 `Dialog()` API 不同，`Popup()` 是非模态的。
Compose Multiplatform 中的对话框作为一个模态容器，它会获取焦点、居中显示其内容，并使用调暗的遮罩层 (scrim) 来阻止与 UI 其余部分的交互。
另一方面，弹出窗口没有遮罩层，不限制其宽度，并允许用户继续与底层 UI 交互。
它默认不居中，并且需要额外的参数将其锚定到组件上。

当您需要中断用户并在其继续操作前要求做出决定时（例如：响应确认、警报或简短表单），请使用 [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)。对于桌面端独立的操作系统级对话框，请参阅 [`DialogWindow()`](compose-desktop-top-level-windows-management.md#show-dialogs)。对于保持锚定在当前窗口内组件上的轻量级、非阻塞覆盖层（如下拉菜单、工具提示和菜单），请使用 `Popup()`。

## 定位弹出窗口

要定位弹出窗口，可以使用 `alignment`（对齐）和 `offset`（偏移量），或者使用自定义的 `PopupPositionProvider` 进行锚定放置。

对于简单的对齐：

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

Box(Modifier.padding(24.dp)) {
    Button(onClick = { isPopupOpen = !isPopupOpen }) {
        Text("Toggle popup")
    }

    if (isPopupOpen) {
        Popup(
            // 相对于按钮定位弹出窗口
            alignment = Alignment.TopStart,
            // 以像素为单位按 (x, y) 偏移弹出窗口
            offset = IntOffset(30, 70),
            // 当弹出窗口被关闭时隐藏它，
            // 例如，当用户点击其外部时
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

对于锚定放置，请使用 `PopupPositionProvider`：

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

## 自定义行为

通过 `PopupProperties`，您可以控制弹出窗口如何处理焦点和关闭操作：

* `focusable` 决定弹出窗口是否接收按键事件，默认禁用。
* `dismissOnBackPress` 在 Android 的返回按钮或桌面端的 **Esc** 键按下时关闭弹出窗口，默认启用。需要设置 `focusable = true`。
* `dismissOnClickOutside` 当用户点击其边界外时关闭弹出窗口，默认启用。

`Popup()` 及其 `PopupProperties` 是公共 API 的一部分。
然而，某些属性在公共源集中不可用。
例如，`usePlatformInsets` 在 iOS 上可用，它会将弹出窗口的内容限制在平台插入栏（安全区域）内。

## 下一步

有关完整的 API 详情，请参阅 Jetpack Compose 文档中的参考资料：
* [`Popup()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Popup.composable)
* [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)