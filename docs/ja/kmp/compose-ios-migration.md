[//]: # (title: iOS 移行ガイド)

このページでは、Compose Multiplatform ライブラリをプロジェクトで新しいバージョン、特に1.7.0以降にアップグレードする際のiOSに関する考慮事項について説明します。

## Compose Multiplatform 1.6.11 から 1.7.0

### UIKitView と UIKitViewController から background パラメータが削除されました

非推奨の `UIKitView` および `UIKitViewController` API には `background` パラメータがありましたが、新しいAPIにはありません。
このパラメータは冗長と見なされ、削除されました。

* 新しいインスタンスの相互運用ビューの背景を設定する必要がある場合は、`factory` パラメータを使用して設定できます。
* 背景を更新可能にする必要がある場合は、対応するコードを `update` ラムダに記述してください。

### タッチやジェスチャーが期待通りに動作しなくなる可能性があります

新しいデフォルトの[タッチ動作](compose-ios-touch.md)では、タッチが相互運用ビュー向けか、そのビューのComposeコンテナ向けかを判断するために遅延を使用します。ユーザーは、相互運用ビューがタッチを受け取る前に少なくとも150ミリ秒間静止している必要があります。

Compose Multiplatform に従来通りタッチを処理させる必要がある場合は、新しい実験的な `UIKitInteropProperties` コンストラクタを検討してください。
これには `interactionMode` パラメータがあり、これを `UIKitInteropInteractionMode.NonCooperative` に設定すると、Compose がタッチを相互運用ビューに直接転送するようになります。

このコンストラクタは実験的とされています。なぜなら、最終的には相互運用ビューのインタラクション可能性を単一のブール値フラグで記述することを意図しているためです。
`interactionMode` パラメータで明示的に記述されている動作は、将来的に自動的に導出される可能性が高いです。

### accessibilityEnabled が isNativeAccessibilityEnabled に置き換えられ、デフォルトでオフになりました

古い `UIKitView` および `UIKitViewController` コンストラクタの `accessibilityEnabled` パラメータは、`UIKitInteropProperties.isNativeAccessibilityEnabled` プロパティとして利用できるよう移動され、名前が変更されました。
また、デフォルトでは `false` に設定されています。

`isNativeAccessibilityEnabled` プロパティは、結合されたComposeサブツリーをネイティブのアクセシビリティ解決で汚染します。
そのため、相互運用ビューの豊富なアクセシビリティ機能（Webビューなど）が必要な場合を除き、`true` に設定することは推奨されません。

このプロパティとそのデフォルト値の根拠については、[`UIKitInteropProperties` クラスのコード内ドキュメント](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/viewinterop/UIKitInteropProperties.uikit.kt)を参照してください。

### onResize パラメータが削除されました

古い `UIKitView` および `UIKitViewController` コンストラクタの `onResize` パラメータは、`rect` 引数に基づいてカスタムフレームを設定しましたが、Compose レイアウト自体には影響を与えなかったため、直感的に使用できませんでした。
さらに、`onResize` パラメータのデフォルト実装は、相互運用ビューのフレームを適切に設定する必要があり、ビューを適切にクリッピングするための実装詳細が含まれていました。 <!-- TODO: what's wrong with that exactly? -->

`onResize` なしで対処する方法：

* 相互運用ビューのフレーム変更に反応する必要がある場合、以下が可能です：
    * 相互運用 `UIView` の [`layoutSubviews`](https://developer.apple.com/documentation/uikit/uiview/1622482-layoutsubviews) をオーバーライドする
    * 相互運用 `UIViewController` の [`viewDidLayoutSubviews`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621398-viewdidlayoutsubviews) をオーバーライドする
    * または `Modifier` チェーンに `onGloballyPositioned` を追加する。
* 相互運用ビューのフレームを設定する必要がある場合は、対応するComposeモディファイア、例えば `size`、`fillMaxSize` などを使用してください。

### いくつかの onReset 使用パターンが無効になりました

非nullの `onReset` ラムダを `remember { UIView() }` と一緒に使用するのは正しくありません。

次のコードを考慮してください：

```kotlin
val view = remember { UIView() }

UIKitView(factory = { view }, onReset = { /* ... */ })
```

`UIKitView` がコンポジションに入るとき、`factory` または `onReset` のいずれかが呼び出され、両方が呼び出されることはありません。
そのため、`onReset` がnullでない場合、記憶された `view` は画面に表示されているものと異なる可能性があります：
コンポーザブルはコンポジションを離れ、ビューのインスタンスを残すことができ、そのインスタンスは `factory` を使用して新しいものを割り当てるのではなく、`onReset` でリセットされた後に再利用されます。

このような間違いを避けるために、コンストラクタで `onReset` の値を指定しないでください。
関数がコンポジションに入ったコンテキストに基づいて、相互運用ビュー内からコールバックを実行する必要がある場合があります：
この場合、`onReset` で `update` を使用して、コールバックをビュー内に保存することを検討してください。