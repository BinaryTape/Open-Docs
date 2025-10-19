[//]: # (title: iOSでの相互運用におけるタッチイベントの処理)

iOSでは、Compose MultiplatformはネイティブのUIKitおよびSwiftUIフレームワークと統合できます。このような統合の課題の1つはタッチの処理です。Compose MultiplatformアプリにネイティブUI要素が含まれる場合、アプリはコンテキストに応じて、相互運用領域でのタッチに異なる反応をする必要があるかもしれません。

現在、Compose Multiplatformには、ネイティブビューでのタッチイベントを処理するための戦略が1つしかありません。それは、すべてのタッチはネイティブUIによって完全に処理され、Composeはそれらが全く発生したことを認識しない、というものです。

## 相互運用スクロールにおけるタッチ

相互運用領域での各タッチが下層のネイティブUI要素に即座に送信されると、コンテナコンポーザブルは同じタッチに反応できません。これが引き起こす最も明らかな問題はスクロールです。相互運用領域がスクロール可能なコンテナ内にある場合、ユーザーはその領域が次のように動作することを期待するかもしれません。

*   操作したいときにタッチに反応する。
*   親コンテナをスクロールしたいときにタッチに反応しない。

これを解決するため、Compose Multiplatformは[`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)に触発された動作を実装しています。タッチが最初に検出されると、短い遅延（150ミリ秒）があり、これによりアプリがコンテナにそれを認識させるかどうかを決定できます。

*   この遅延中にComposeコンポーネントがタッチイベントを消費した場合、Compose MultiplatformはそのタッチシーケンスをネイティブUI要素に認識させません。
*   遅延中にイベントが消費されない場合、残りのタッチシーケンスでは、Compose MultiplatformがネイティブUIに制御を渡します。

したがって、スクロール可能なコンテンツでは、ユーザーがタッチをホールドすると、UIはこれをネイティブ要素と対話する意図と解釈します。タッチシーケンスが速い場合、ユーザーはおそらく親要素と対話したいと考えています。

相互運用ビューが操作されることを意図していない場合は、事前にすべてのタッチ処理を無効にできます。それには、`isInteractive`パラメーターを`false`に設定して、`UIKitView`または`UIKitViewController`のコンストラクタを呼び出します。

> 相互運用ビュー内でのジェスチャー処理のより複雑なシナリオには、`UIGestureRecognizer`クラスまたはそのさまざまなサブクラスを使用してください。これにより、ネイティブ相互運用ビューで目的のジェスチャーを検出したり、Composeでのタッチシーケンスをキャンセルしたりできます。
>
{style="note"}

## タッチ処理の戦略の選択
<primary-label ref="Experimental"/>

Compose Multiplatform %org.jetbrains.compose%では、相互運用UIをよりきめ細かく制御するための実験的APIも試すことができます。

`UIKitView`または`UIKitViewController`の新しいコンストラクタは、引数として`UIKitInteropProperties`オブジェクトを受け入れます。このオブジェクトを使用すると、次を設定できます。

*   指定された相互運用ビューの`interactionMode`パラメーター。これにより、タッチ処理戦略を選択できます。
*   相互運用ビューのアクセシビリティ動作を変更する`isNativeAccessibilityEnabled`オプション。

`interactionMode`パラメーターは、`Cooperative`または`NonCooperative`のいずれかに設定できます。

*   `Cooperative`モードは、上記で説明したように新しいデフォルトです。Compose Multiplatformはタッチ処理に遅延を導入します。実験的APIを使用すると、デフォルトの150ミリ秒の代わりに異なる値を試すことで、この遅延を微調整できます。
*   `NonCooperative`モードは以前の戦略を使用し、Compose Multiplatformは相互運用ビューでいかなるタッチイベントも処理しません。上記で挙げられた一般的な問題にもかかわらず、相互運用タッチがComposeレベルで処理される必要が全くないと確信している場合には、このモードが有用です。
*   ネイティブUIとのいかなるインタラクションも無効にするには、コンストラクタに`interactionMode = null`を渡します。

## 次のステップ

Compose Multiplatformにおける[UIKit](compose-uikit-integration.md)および[SwiftUI](compose-swiftui-integration.md)の統合についてさらに詳しく学びましょう。