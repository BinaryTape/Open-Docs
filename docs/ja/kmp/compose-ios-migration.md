[//]: # (title: iOS 移行ガイド)

このページでは、プロジェクト内の Compose Multiplatform ライブラリを 1.7.0 以降の新しいバージョンにアップグレードする際の、iOS に関する注意事項について説明します。

## Compose Multiplatform 1.6.11 から 1.7.0

### UIKitView および UIKitViewController における background パラメータの削除

非推奨（Deprecated）となっていた `UIKitView` および `UIKitViewController` API には `background` パラメータがありましたが、新しい API にはありません。
このパラメータは冗長であると判断され、削除されました。

* 新しいインスタンスに対して相互運用ビュー（interop view）の背景を設定する必要がある場合は、`factory` パラメータを使用して設定できます。
* 背景を更新可能にする必要がある場合は、対応するコードを `update` ラムダ内に記述してください。

### タッチやジェスチャーが期待通りに動作しなくなる可能性

新しいデフォルトの[タッチ動作](compose-ios-touch.md)では、タッチが相互運用ビューのためのものか、そのビューの Compose コンテナのためのものかを判断するために遅延を利用します。相互運用ビューがタッチを受け取るには、ユーザーが少なくとも 150 ミリ秒間静止している必要があります。

Compose Multiplatform で以前のようなタッチ処理が必要な場合は、新しい実験的な `UIKitInteropProperties` コンストラクタの使用を検討してください。
これには `interactionMode` パラメータがあり、`UIKitInteropInteractionMode.NonCooperative` を設定することで、Compose がタッチを直接相互運用ビューに転送するようにできます。

このコンストラクタは実験的（Experimental）としてマークされています。これは、最終的には相互運用ビューのインタラクティブ性を単一のブールフラグで記述できるようにすることを意図しているためです。
`interactionMode` パラメータで明示的に記述されている動作は、将来的には自動的に導出されるようになる可能性が高いです。

### accessibilityEnabled が isNativeAccessibilityEnabled に置き換えられ、デフォルトでオフに変更

旧 `UIKitView` および `UIKitViewController` コンストラクタの `accessibilityEnabled` パラメータは、`UIKitInteropProperties.isNativeAccessibilityEnabled` プロパティとして利用できるように移動および名前変更されました。
また、デフォルトで `false` に設定されています。

`isNativeAccessibilityEnabled` プロパティは、マージされた Compose サブツリーにネイティブのアクセシビリティ解決を適用します。
そのため、Web ビューなどの相互運用ビューの高度なアクセシビリティ機能が必要な場合を除き、true に設定することはお勧めしません。

このプロパティとそのデフォルト値の根拠については、[`UIKitInteropProperties` クラスのコード内ドキュメント](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)を参照してください。

### onResize パラメータの削除

旧 `UIKitView` および `UIKitViewController` コンストラクタの `onResize` パラメータは、`rect` 引数に基づいてカスタムフレームを設定していましたが、Compose のレイアウト自体には影響を与えなかったため、直感的に使用できませんでした。
さらに、`onResize` パラメータのデフォルト実装は、相互運用ビューのフレームを適切に設定するために必要であり、ビューを適切にクリッピングするための実装の詳細が含まれていました。

`onResize` なしで対応する方法：

* 相互運用ビューのフレーム変更に反応する必要がある場合は、以下の方法があります。
    * 相互運用 `UIView` の [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews) をオーバーライドする。
    * 相互運用 `UIViewController` の [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews) をオーバーライドする。
    * または、`Modifier` チェーンに `onGloballyPositioned` を追加する。
* 相互運用ビューのフレームを設定する必要がある場合は、`size`、`fillMaxSize` などの対応する Compose 修飾子（modifiers）を使用してください。

### 一部の onReset の使用パターンが無効化

`remember { UIView() }` と共に非 null の `onReset` ラムダを使用することは正しくありません。

以下のコードを考えてみましょう。

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

`UIKitView` がコンポジションに入るとき、`factory` または `onReset` のいずれかが呼び出されますが、両方が呼び出されることはありません。
したがって、`onReset` が null でない場合、`remember` された `view` は画面に表示されているものと異なる可能性があります。
コンポーザブルがコンポジションを離れる際に、ビューのインスタンスを残すことがあり、それは `factory` を使用して新しく割り当てられる代わりに、`onReset` でリセットされた後に再利用されます。

このような間違いを避けるために、コンストラクタで `onReset` の値を指定しないでください。
関数がコンポジションに入ったコンテキストに基づいて、相互運用ビュー内からコールバックを実行する必要がある場合があります。その場合は、`onReset` 時の `update` を使用して、ビュー内にコールバックを保存することを検討してください。