[//]: # (title: iOSでのInteropにおけるタッチイベントの処理)

iOSでは、Compose MultiplatformはネイティブのUIKitおよびSwiftUIフレームワークと統合できます。このような統合における課題の一つはタッチの処理です。Compose MultiplatformアプリがネイティブUI要素を含む場合、アプリはコンテキストに応じて、interopエリアでのタッチに異なる方法で反応する必要があるかもしれません。

現在、Compose Multiplatformには、ネイティブビューにおけるタッチイベントを処理するための戦略が1つしかありません。すべてのタッチはネイティブUIによって完全に処理され、Composeはその発生を一切認識しません。

## interopスクロールにおけるタッチ

interopエリアでの各タッチが基になるネイティブUI要素に即座に送信されると、コンテナコンポーザブルは同じタッチに反応できません。これがもたらす最も明白な問題はスクロールです。interopエリアがスクロール可能なコンテナ内にある場合、ユーザーはそのエリアが次のことを期待するかもしれません。

*   操作したいときにタッチに反応すること。
*   親コンテナをスクロールしたいときにタッチに反応しないこと。

これを解決するため、Compose Multiplatformは[`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview)にヒントを得た動作を実装しています。タッチが最初に検出されると、コンテナがそれを認識するかどうかをアプリが決定できるように、短い遅延（150ms）が発生します。

*   この遅延中にComposeコンポーネントがタッチイベントを消費した場合、Compose MultiplatformはそのタッチシーケンスをネイティブUI要素に認識させません。
*   遅延中にイベントが消費されなかった場合、その後のタッチシーケンス全体において、Compose MultiplatformはネイティブUIに制御を渡します。

したがって、スクロール可能なコンテンツでは、ユーザーがタッチをホールドした場合、UIはこれをネイティブ要素とインタラクトする意図として解釈します。タッチシーケンスが速い場合、ユーザーは親要素とインタラクトしたいと考えている可能性が高いです。

interopビューが操作を目的としていない場合、事前にすべてのタッチ処理を無効にできます。そのためには、`UIKitView`または`UIKitViewController`のコンストラクタを`isInteractive`パラメータを`false`に設定して呼び出します。

> interopビュー内でジェスチャーを処理するより複雑なシナリオには、
> `UIGestureRecognizer`クラスまたはその様々なサブクラスを使用してください。
> これにより、ネイティブのinteropビューで目的のジェスチャーを検出したり、Composeでのタッチシーケンスをキャンセルしたりできます。
>
{style="note"}

## タッチ処理戦略の選択
<secondary-label ref="Experimental"/>

Compose Multiplatform %org.jetbrains.compose%では、interop UIをより細かく制御するための実験的APIも試すことができます。

`UIKitView`または`UIKitViewController`の新しいコンストラクタは、引数として`UIKitInteropProperties`オブジェクトを受け入れます。このオブジェクトでは、次の設定が可能です。

*   特定のinteropビューに対する`interactionMode`パラメータ。これにより、タッチ処理戦略を選択できます。
*   interopビューのアクセシビリティ動作を変更する`isNativeAccessibilityEnabled`オプション。

`interactionMode`パラメータは、`Cooperative`または`NonCooperative`のいずれかに設定できます。

*   `Cooperative`モードは、上記のとおり新しいデフォルトです。Compose Multiplatformはタッチ処理に遅延を導入します。実験的APIを使用すると、デフォルトの150msではなく、さまざまな値を試すことでこの遅延を微調整できます。
*   `NonCooperative`モードは、以前の戦略を使用します。このモードでは、Compose Multiplatformはinteropビュー内のいかなるタッチイベントも処理しません。上記に挙げた一般的な問題にもかかわらず、interopタッチをComposeレベルで処理する必要がないことが確実な場合、このモードは役立つことがあります。
*   ネイティブUIとのインタラクションを無効にするには、コンストラクタに`interactionMode = null`を渡します。

## 次のステップ

Compose Multiplatformにおける[UIKit](compose-uikit-integration.md)と[SwiftUI](compose-swiftui-integration.md)の統合について詳しく学びましょう。