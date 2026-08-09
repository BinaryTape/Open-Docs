[//]: # (title: ポップアップ)

<web-summary>Compose Multiplatformで、ドロップダウン、ツールチップ、メニューのためのポップアップを作成、配置、カスタマイズする方法を学びます。</web-summary>

Compose Multiplatformにおけるポップアップは、同じウィンドウ内の現在のUIの上にコンテンツを描画するフローティングコンテナです。

マルチプラットフォームの `Dialog()` APIとは異なり、`Popup()` は非モーダル（non-modal）です。
Compose Multiplatformのダイアログは、フォーカスを取得し、コンテンツを中央に配置し、薄暗いスクリム（scrim）を使用してUIの他の部分とのインタラクションをブロックするモーダルコンテナとして機能します。
一方、ポップアップにはスクリムがなく、幅も制限されず、ユーザーは基盤となるUIとのインタラクションを継続できます。
デフォルトでは中央に配置されず、コンポーネントに固定（アンカー）するには追加の引数が必要です。

ユーザーを中断させ、続行する前に決定を求める必要がある場合（例えば、確認、アラート、短いフォームへの反応など）は、[`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable) を使用してください。デスクトップでの個別のOSレベルのダイアログについては、[`DialogWindow()`](compose-desktop-top-level-windows-management.md#show-dialogs) を参照してください。
ドロップダウン、ツールチップ、メニューなど、現在のウィンドウ内のコンポーネントに固定されたままの、軽量でブロッキングしないオーバーレイには、`Popup()` を使用してください。

## ポップアップの配置

ポップアップを配置するには、`alignment` と `offset` を使用するか、アンカー配置のためのカスタム `PopupPositionProvider` を使用します。

シンプルな配置（alignment）の場合：

```kotlin
var isPopupOpen by remember { mutableStateOf(false) }

Box(Modifier.padding(24.dp)) {
    Button(onClick = { isPopupOpen = !isPopupOpen }) {
        Text("Toggle popup")
    }

    if (isPopupOpen) {
        Popup(
            // ボタンを基準にポップアップを配置
            alignment = Alignment.TopStart,
            // ポップアップをピクセル単位で(x, y)移動
            offset = IntOffset(30, 70),
            // ポップアップが破棄されるとき（例：ユーザーが外側をクリックしたとき）に
            // ポップアップを非表示にする
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

アンカー配置の場合は、`PopupPositionProvider` を使用します：

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

## 動作のカスタマイズ

`PopupProperties` を使用すると、ポップアップのフォーカスと破棄の処理方法を制御できます：

* `focusable` は、ポップアップがキーイベントを受け取るかどうかを決定します。デフォルトでは無効です。
* `dismissOnBackPress` は、Androidの戻るボタンまたはデスクトップの **Esc** キーが押されたときにポップアップを破棄します。デフォルトで有効です。これには `focusable = true` が必要です。
* `dismissOnClickOutside` は、ユーザーがポップアップの境界の外側をクリックしたときにポップアップを破棄します。デフォルトで有効です。

`Popup()` とその `PopupProperties` は共通APIの一部です。
ただし、一部のプロパティは共通ソースセットでは利用できません。
例えば、`usePlatformInsets` はiOSで利用可能で、ポップアップのコンテンツをプラットフォームのインセット（セーフエリア）内に制限します。

## 次のステップ

APIの詳細については、Jetpack Composeドキュメントのリファレンスを参照してください：
* [`Popup()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Popup.composable)
* [`Dialog()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/window/Dialog.composable)