[//]: # (title: iOS移行ガイド)

このページでは、プロジェクトのCompose Multiplatformライブラリを1.7.0以降の新しいバージョンにアップグレードする際のiOSに関する考慮事項について解説します。

## Compose Multiplatform 1.6.11から1.7.0への変更点

### UIKitViewおよびUIKitViewControllerからbackgroundパラメータが削除されました

非推奨の`UIKitView`および`UIKitViewController`のAPIには`background`パラメータがありましたが、新しいAPIにはそれがありません。このパラメータは冗長と見なされ、削除されました。

*   新しいインスタンスに対して相互運用ビューの背景を設定する必要がある場合は、`factory`パラメータを使用して設定できます。
*   背景を更新可能にする必要がある場合は、対応するコードを`update`ラムダに記述してください。

### タッチまたはジェスチャーが期待どおりに動作しなくなる場合があります

新しいデフォルトの[タッチの挙動](compose-ios-touch.md)では、タッチが相互運用ビュー向けなのか、そのビューのComposeコンテナ向けなのかを判断するために遅延を使用します。つまり、ユーザーが少なくとも150ミリ秒間静止しないと、相互運用ビューはタッチを受け取りません。

Compose Multiplatformが以前と同様にタッチを処理する必要がある場合は、新しい実験的な`UIKitInteropProperties`コンストラクタを検討してください。
これには`interactionMode`パラメータがあり、`UIKitInteropInteractionMode.NonCooperative`に設定することで、Composeがタッチを相互運用ビューに直接転送するようにできます。

このコンストラクタが実験的とマークされているのは、最終的には単一のboolフラグで記述される相互運用ビューの操作性を維持する意図があるためです。
`interactionMode`パラメータに明示的に記述された挙動は、将来的には自動的に導出される可能性が高いです。

### accessibilityEnabledがisNativeAccessibilityEnabledに置き換えられ、デフォルトでオフになりました

以前の`UIKitView`および`UIKitViewController`コンストラクタの`accessibilityEnabled`パラメータは、`UIKitInteropProperties.isNativeAccessibilityEnabled`プロパティとして利用可能になるように移動および名前が変更されました。
また、デフォルトで`false`に設定されています。

`isNativeAccessibilityEnabled`プロパティは、結合されたComposeサブツリーにネイティブのアクセシビリティ解決を適用します。
そのため、相互運用ビューの豊富なアクセシビリティ機能（ウェブビューなど）が必要な場合を除き、`true`に設定することは推奨されません。

このプロパティとそのデフォルト値の根拠については、[`UIKitInteropProperties`クラスのインコードドキュメント](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)を参照してください。

### onResizeパラメータが削除されました

以前の`UIKitView`および`UIKitViewController`コンストラクタの`onResize`パラメータは、`rect`引数に基づいてカスタムフレームを設定しましたが、Composeレイアウト自体には影響しなかったため、直感的に使用できませんでした。
その上、`onResize`パラメータのデフォルトの実装は、相互運用ビューのフレームを適切に設定する必要があり、ビューを適切にクリッピングするための実装詳細が含まれていました。 <!-- TODO: what's wrong with that exactly? -->

`onResize`なしで対応する方法：

*   相互運用ビューのフレーム変更に反応する必要がある場合は、次のいずれかを実行できます。
    *   相互運用`UIView`の[`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews)をオーバーライドする、
    *   相互運用`UIViewController`の[`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews)をオーバーライドする、
    *   または`Modifier`チェーンに`onGloballyPositioned`を追加する。
*   相互運用ビューのフレームを設定する必要がある場合は、対応するComposeモディファイア（`size`、`fillMaxSize`など）を使用してください。

### 一部のonReset使用パターンが無効になりました

nullではない`onReset`ラムダを`remember { UIView() }`と併用するのは正しくありません。

次のコードを検討してください。

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

`UIKitView`がコンポジションに入ると、`factory`または`onReset`のいずれかが呼び出され、両方が呼び出されることはありません。
そのため、`onReset`がnullでない場合、記憶された`view`は画面に表示されているものと異なる場合があります。
コンポーザブルはコンポジションを離れてビューのインスタンスを残すことができ、そのインスタンスは`factory`を使用して新しいものを割り当てる代わりに、`onReset`でリセットされた後に再利用されます。

このような間違いを避けるために、コンストラクタで`onReset`値を指定しないでください。
相互運用ビュー内から、それをエミットする関数がコンポジションに入ったコンテキストに基づいてコールバックを実行する必要がある場合があります。この場合、`onReset`の`update`を使用してビュー内にコールバックを保存することを検討してください。