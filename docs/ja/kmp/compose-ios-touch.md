[//]: # (title: iOS上での相互運用（interop）によるタッチイベントの処理)

iOSにおいて、Compose MultiplatformはネイティブのUIKitおよびSwiftUIフレームワークと統合できます。
このような統合における課題の1つはタッチの処理です。Compose MultiplatformアプリにネイティブのUI要素が含まれている場合、アプリは文脈に応じて、相互運用（interop）エリアでのタッチに対して異なる反応をさせる必要があるかもしれません。

現在、Compose Multiplatformにはネイティブビューでのタッチイベントを処理するための戦略が1つだけあります。
すべてのタッチは完全にネイティブUIによって処理され、Compose側ではそれらが発生したことをまったく認識しません。

## 相互運用スクロールにおけるタッチ

相互運用エリア内の各タッチが基盤となるネイティブUI要素に即座に送信されると、コンテナとなるComposableは同じタッチに反応できません。
これが引き起こす最も明らかな問題はスクロールです。相互運用エリアがスクロール可能なコンテナ内にある場合、ユーザーはそのエリアに対して以下のような動作を期待するでしょう。

* 操作したいときには、タッチに反応する。
* 親コンテナをスクロールしたいときには、タッチに反応しない。

これを解決するために、Compose Multiplatformは [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) にインスパイアされた動作を実装しています。
タッチが最初に検出されると、コンテナにそれを認識させるかどうかをアプリが決定するための短い遅延（150ミリ秒）があります。

* この遅延の間にComposeコンポーネントがいずれかのタッチイベントを消費（consume）した場合、Compose MultiplatformはそのタッチシーケンスをネイティブUI要素に認識させません。
* 遅延の間にイベントが消費されなかった場合、そのタッチシーケンスの残りの部分は、Compose MultiplatformがネイティブUIに制御を渡します。

そのため、スクロール可能なコンテンツでは、ユーザーがタッチを保持（ホールド）した場合は、UIはネイティブ要素を操作する意図であると解釈します。タッチシーケンスが速い場合は、ユーザーは親要素を操作したい可能性が高いと判断されます。

もし相互運用ビューが操作を想定していない場合は、事前ですべてのタッチ処理を無効にできます。
そのためには、`isInteractive` パラメータを `false` に設定して、`UIKitView` または `UIKitViewController` のコンストラクタを呼び出します。 

> 相互運用ビュー内でのジェスチャー処理のより複雑なシナリオについては、`UIGestureRecognizer` クラスまたはその様々なサブクラスを使用してください。
> これにより、ネイティブの相互運用ビューで目的のジェスチャーを検出したり、Composeでのタッチシーケンスをキャンセルしたりすることができます。
>
{style="note"}

## タッチ処理戦略の選択
<primary-label ref="Experimental"/>

Compose Multiplatform %org.jetbrains.compose% では、相互運用UIをより詳細に制御するための実験的なAPIを試すこともできます。

`UIKitView` または `UIKitViewController` の新しいコンストラクタは、`UIKitInteropProperties` オブジェクトを引数として受け取ります。
このオブジェクトでは以下を設定できます。

* 特定の相互運用ビューに対する `interactionMode` パラメータ。これにより、タッチ処理戦略を選択できます。
* `isNativeAccessibilityEnabled` オプション。これにより、相互運用ビューのアクセシビリティ動作を変更できます。

`interactionMode` パラメータは、`Cooperative` または `NonCooperative` のいずれかに設定できます。

* `Cooperative` モードは、上記で説明した新しいデフォルトです。Compose Multiplatformはタッチ処理に遅延を導入します。
実験的なAPIでは、デフォルトの150ミリ秒の代わりに異なる値を試すことで、この遅延を微調整できます。
* `NonCooperative` モードは以前の戦略を使用し、Compose Multiplatformは相互運用ビューでのタッチイベントを一切処理しません。
  上述のような一般的な問題はありますが、相互運用のタッチをComposeレベルで処理する必要がまったくないと確信できる場合には、このモードが役立ちます。
* ネイティブUIとのあらゆるインタラクションを無効にするには、コンストラクタに `interactionMode = null` を渡します。

## 次のステップ

Compose Multiplatformにおける [UIKit](compose-uikit-integration.md) および [SwiftUI](compose-swiftui-integration.md) との統合について詳細を確認してください。