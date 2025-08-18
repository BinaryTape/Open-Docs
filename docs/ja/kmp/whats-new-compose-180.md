[//]: # (title: Compose Multiplatform 1.8.2の新機能)
この機能リリースにおける主なハイライトは以下の通りです。

*   [可変フォント](#variable-fonts)
*   [iOSでのドラッグ＆ドロップ](#drag-and-drop)
*   [iOSでのディープリンク](#deep-linking)
*   [iOSでのアクセシビリティサポートの改善](#accessibility-support-improvements)
*   [Webターゲット向けリソースのプリロード](#preloading-of-resources)
*   [ブラウザナビゲーションコントロールとの統合](#browser-controls-supported-in-the-navigation-library)

このリリースの変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)で確認できます。

## 依存関係

*   Gradleプラグイン `org.jetbrains.compose` バージョン1.8.2。Jetpack Composeライブラリに基づいています。
    *   [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    *   [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    *   [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    *   [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Lifecycleライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)に基づいています。
*   Navigationライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)に基づいています。
*   Material3 Adaptiveライブラリ `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)に基づいています。
*   Savedstateライブラリ `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)に基づいています。
*   WindowManager Coreライブラリ `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)に基づいています。

## 破壊的変更

### Compose MultiplatformのK2コンパイラへの完全移行

このリリースにより、Compose MultiplatformのコードベースはK2コンパイラに完全に移行されました。1.8.0以降、Compose Multiplatformに依存するプロジェクトによって生成されたネイティブおよびWebのklibは、Kotlin 2.1.0以降を使用している場合にのみ利用できます。

ComposeコンパイラのGradleプラグインにおける根本的な変更に加えて、これがプロジェクトにどのような影響を与えるかを以下に示します。

*   Compose Multiplatformに依存するライブラリを使用するアプリの場合：
    プロジェクトをKotlin 2.1.20に更新し、依存関係をCompose Multiplatform 1.8.0およびKotlin 2.1.xに対してコンパイルされたバージョンに更新することを推奨します。
*   Compose Multiplatformに依存するライブラリの場合：
    プロジェクトをKotlin 2.1.xおよびCompose 1.8.0に更新し、その後ライブラリを再コンパイルして新しいバージョンを公開する必要があります。

Compose Multiplatform 1.8.0へのアップグレードで互換性の問題が発生した場合は、[YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)に課題を提出してお知らせください。

### `material-icons-core` への暗黙的な依存関係の削除

Compose Multiplatform 1.8.2では、[Materialの変更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)が取り入れられました。これにより、`material-icons-core`への推移的な依存関係がなくなりました。これは、[K1でビルドされた依存関係からの移行](#full-migration-of-compose-multiplatform-to-the-k2-compiler)に沿ったものです。

プロジェクトで`material-icons-core`ライブラリを引き続き使用する必要がある場合は、依存関係を`build.gradle.kts`に明示的に追加してください。例：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### NavigationにおけるBundleからSavedStateへの移行

Compose Multiplatform 1.8.2のNavigationは、Android Navigationコンポーネントと共に、UI状態を保存するために`SavedState`クラスを使用するように移行しています。これにより、ナビゲーショングラフでデスティネーションを宣言する際のステートデータへのアクセスパターンが変更されます。[Navigationライブラリ](compose-navigation-routing.md)の2.9.*バージョンにアップグレードする際は、該当するコードを`SavedState`のアクセサーを使用するように更新してください。

> より堅牢なアーキテクチャのためには、文字列ルートを避け、[型安全なナビゲーションのアプローチ](https://developer.android.com/guide/navigation/design/type-safety)を使用してください。
> {style="note"}

変更前:

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

Compose Multiplatform 1.8.2以降:

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.read { getStringOrNull("userid") }
    val page = navBackStackEntry.arguments?.read { getStringOrNull("page") }
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

### iOSにおける`ComposeUIViewControllerDelegate`の非推奨化

`ComposeUIViewControllerDelegate` APIは、親ビューコントローラを優先して非推奨になりました。Compose Multiplatform 1.8.2で非推奨のAPIを使用すると、親ビューコントローラ経由で`UIViewController`クラスのメソッドをオーバーライドする必要があることを示す非推奨エラーが発生します。

子ビューコントローラと親ビューコントローラの関係については、Appleの開発者向け[ドキュメント](https://developer.apple.com/documentation/uikit/uiviewcontroller)で詳細をご確認ください。

### iOSにおける廃止された`platformLayers`オプションの削除

`platformLayers`実験的オプションは、代替レイヤーモードを有効にし、ポップアップとダイアログを親コンテナの境界外に描画できるようにするために、[1.6.0で導入されました](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。

このモードは現在iOSのデフォルトの動作となり、これを有効にするオプションは廃止されたため削除されました。

### テストにおける破壊的変更

#### テストにおけるコルーチンの遅延の新しい扱い方

以前は、Compose Multiplatformのテストでは、`delay()`呼び出しを伴う副作用はアイドル状態と見なされませんでした。そのため、例えば以下のテストは無限にハングアップしていました。

```kotlin
@Test
fun loopInLaunchedEffectTest() = runComposeUiTest {
    setContent {
        LaunchedEffect(Unit) {
            while (true) {
                delay(1000)
                println("Tick")
            }
        }
    }
}
```

コルーチンがコンポジションスコープで起動された後に`delay()`関数を呼び出す場合、`waitForIdle()`、`awaitIdle()`、および`runOnIdle()`関数はComposeがアイドル状態であると見なすようになりました。この変更により上記のハングアップするテストは修正されますが、`delay()`を持つコルーチンを実行するために`waitForIdle()`、`awaitIdle()`、および`runOnIdle()`に依存しているテストは影響を受けます。

これらのケースで同じ結果を得るには、時間を人工的に進めます。

```kotlin
var updateText by mutableStateOf(false)
var text by mutableStateOf("0")
setContent {
    LaunchedEffect(updateText) {
        if (updateText) {
            delay(1000)
            text = "1"
        }
    }
}
updateText = true
waitForIdle()
// Since waitForIdle() no longer waits for the delayed LaunchedEffect() to complete,
// the test needs to advance time to make the following assertion correct:
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

すでに`mainClock.advanceTimeBy()`呼び出しを使用してテストクロックを進めているテストは、再コンポジション、レイアウト、描画、およびエフェクトに関して異なる動作をする可能性があります。

#### `runOnIdle()`の実装がAndroidと同期

Compose Multiplatformの`runOnIdle()`テスト関数の実装をAndroidの動作に合わせるため、以下の変更を導入しました。

*   `runOnIdle()`は、その`action`をUIスレッドで実行するようになりました。
*   `runOnIdle()`は、`action`の実行後に`waitForIdle()`を呼び出さなくなりました。

`runOnIdle()`アクションの後の追加の`waitForIdle()`呼び出しにテストが依存している場合は、Compose Multiplatform 1.8.2向けに更新する際に、必要に応じてテストにその呼び出しを追加してください。

#### テストにおける時間の進行がレンダリングから分離

Compose Multiplatform 1.8.2では、`mainClock.advanceTimeBy()`関数は、次のフレームのレンダリングポイントを超えて時間が進められない限り（仮想テストフレームは16ミリ秒ごとにレンダリングされます）、再コンポジション、レイアウト、または描画を引き起こさなくなりました。

これにより、すべての`mainClock.advanceTimeBy()`呼び出しによってレンダリングがトリガーされることに依存しているテストが影響を受ける可能性があります。詳細については、[PRの説明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)を参照してください。

## クロスプラットフォーム

### 可変フォント

Compose Multiplatform 1.8.2は、すべてのプラットフォームで可変フォントをサポートします。可変フォントを使用すると、ウェイト、幅、スラント、イタリック、カスタム軸、タイポグラフィックカラーによる視覚的ウェイト、特定のテキストサイズへの適応など、すべてのスタイル設定を含む単一のフォントファイルを保持できます。

詳細については、[Jetpack Composeドキュメント](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)を参照してください。

### Skiaがマイルストーン132に更新

Skikoを介してCompose Multiplatformで使用されるSkiaのバージョンがマイルストーン132に更新されました。

以前使用されていたSkiaのバージョンはマイルストーン126でした。これらのバージョン間の変更点は、[リリースノート](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)で確認できます。

### 新しいClipboardインターフェース

Compose Multiplatformは、Jetpack Composeの新しい`Clipboard`インターフェースを採用しました。

以前使用されていた`ClipboardManager`インターフェースは、[Web上のClipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)の非同期性のためWebターゲットでアクセスできませんでしたが、`Clipboard`に置き換えられて非推奨になりました。新しいインターフェースは`suspend`関数をサポートし、Webを含むすべてのターゲットと互換性があります。

共通コードからのクリップボード操作は、現在のAPI設計によって制限されています。詳細については、[CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)を参照してください。

### 行の高さの配置

以前はCompose MultiplatformでAndroidのみでサポートされていた行の高さの配置に関する共通APIが、すべてのプラットフォームでサポートされるようになりました。`LineHeightStyle.Alignment`を使用すると、行の高さによって提供されるスペース内でテキスト行がどのように配置されるかを設定できます。テキスト行は、予約されたスペースの下部、中央、または上部に配置することも、そのアセント値とディセント値に基づいて比例的に調整することもできます。

<img src="compose-180-LineHeightStyle.png" alt="Line-height alignment" width="508"/>

Material3では、行の高さの配置のデフォルト値は`Center`であり、特に指定がない限り、すべてのプラットフォームのMaterial3コンポーネントで`lineHeight`を持つテキストに中央揃えが適用されることに注意してください。

## iOS

### ディープリンク

Compose Multiplatform 1.8.2と[org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation%を組み合わせることで、通常のComposeの方法でiOSにディープリンクを実装できます。つまり、ディープリンクをデスティネーションに割り当て、`NavController`を使用してそれらにナビゲートします。

共通コードにディープリンクを導入する方法については、[ディープリンク](compose-navigation-deep-links.md)を参照してください。

### XCFrameworks内のComposeリソース

Compose Multiplatformは、生成されたXCFrameworks内にリソースを直接埋め込むようになりました。リソースを持つComposeライブラリを標準のXCFrameworksとしてビルドおよび使用できます。

この機能にはKotlin Gradleプラグインバージョン2.2以上が必要です。

### アクセシビリティサポートの改善

#### 右から左への言語のサポート

Compose Multiplatform 1.8.2は、ジェスチャーに対する適切なテキスト方向処理を含む、右から左への言語のアクセシビリティサポートを導入しました。

RTLサポートの詳細については、[右から左への言語](compose-rtl.md)を参照してください。

#### スクロール可能なリストのアクセシビリティ

このバージョンでは、スクロール境界と要素位置の計算のパフォーマンスと精度が向上しました。ノッチや画面の端などのセーフエリアを考慮することで、隙間や余白付近でのスクロールに対する正確なアクセシビリティプロパティを保証します。

また、スクロール状態のアナウンスのサポートも導入しました。VoiceOverが有効になっている場合、3本指スクロールジェスチャーを実行するとリストの状態更新が聞こえます。アナウンスには以下が含まれます。

*   リストの先頭にいるときの「最初のページ」。
*   前方にスクロールするときの「次のページ」。
*   後方にスクロールするときの「前のページ」。
*   最後に到達したときの「最後のページ」。

これらのアナウンスのローカライズ版も提供されており、VoiceOverが選択した言語でそれらを読み上げることができます。

#### コンテナビューのアクセシビリティ

Compose Multiplatform 1.8.2以降、コンテナのトラバーサルセマンティックプロパティを定義して、複雑なビューをスクロールしたりスワイプしたりする際の正しい読み上げ順序を保証できるようになりました。

スクリーンリーダー向けに要素を適切にソートすることに加えて、トラバーサルプロパティのサポートにより、スワイプアップまたはスワイプダウンのアクセシビリティジェスチャーを使用して異なるトラバーサルグループ間を移動できるようになります。コンテナのアクセシブルナビゲーションモードに切り替えるには、VoiceOverがアクティブな状態で画面上で2本指を回転させます。

トラバーサルセマンティックプロパティの詳細については、[アクセシビリティ](compose-accessibility.md#traversal-order)セクションを参照してください。

#### アクセシブルなテキスト入力

Compose Multiplatform 1.8.2では、テキストフィールドのアクセシビリティ特性のサポートが導入されました。テキスト入力フィールドがフォーカスされると、編集可能としてマークされるようになり、適切なアクセシビリティ状態の表現が保証されます。

UIテストでアクセシブルなテキスト入力も使用できるようになりました。

#### トラックパッドとキーボードによる制御のサポート

iOS向けCompose Multiplatformは、デバイスを制御するための2つの追加入力方法をサポートするようになりました。タッチスクリーンに依存する代わりに、マウスやトラックパッドを使用するためにAssistiveTouchを有効にするか、キーボードを使用するためにフルキーボードアクセスを有効にすることができます。

*   AssistiveTouch（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続されたマウスやトラックパッドからのポインタでiPhoneやiPadを制御できます。ポインタを使用して画面上のアイコンをクリックしたり、AssistiveTouchメニューを移動したり、画面上のキーボードを使用して入力したりできます。
*   フルキーボードアクセス（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）は、接続されたキーボードでのデバイス制御を可能にします。**Tab**などのキーでナビゲートしたり、**Space**を使用して項目をアクティブにしたりできます。

#### アクセシビリティツリーのオンデマンドロード

ComposeセマンティックツリーとiOSアクセシビリティツリーを同期する特定のモードを設定する代わりに、Compose Multiplatformがこのプロセスを遅延的に処理するようになりました。ツリーは、iOSアクセシビリティエンジンからの最初のリクエスト後に完全にロードされ、スクリーンリーダーがそれとのインタラクションを停止すると破棄されます。

これにより、iOSのVoice Control、VoiceOver、およびアクセシビリティツリーに依存するその他のアクセシビリティツールを完全にサポートできます。

[アクセシビリティツリーの同期を設定するために使用されていた](compose-ios-accessibility.md#choose-the-tree-synchronization-option)`AccessibilitySyncOptions`クラスは、もはや不要になったため削除されました。

#### アクセシビリティプロパティ計算精度の向上

Compose Multiplatformコンポーネントのアクセシビリティプロパティを、UIKitコンポーネントの期待される動作に一致するように更新しました。UI要素は広範なアクセシビリティデータを提供するようになり、アルファ値が0の透明なコンポーネントはアクセシビリティセマンティクスを提供しなくなりました。

セマンティクスを調整することで、`DropDown`要素のヒットボックスの欠落、表示されるテキストとアクセシビリティラベルの不一致、ラジオボタンの不正な状態など、アクセシビリティプロパティの誤った計算に関連するいくつかの問題を修正することもできました。

### ドラッグ＆ドロップ
<secondary-label ref="Experimental"/>

iOS向けCompose Multiplatformは、ドラッグ＆ドロップ機能のサポートを導入し、Composeアプリケーションへのコンテンツのドラッグインまたはドラッグアウトを可能にします（デモビデオについてはプルリクエスト[1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)を参照）。ドラッグ可能なコンテンツとドロップターゲットを定義するには、`dragAndDropSource`と`dragAndDropTarget`修飾子を使用します。

iOSでは、ドラッグ＆ドロップセッションデータは[`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem)によって表現されます。このオブジェクトには、プロセス間データ転送に関する情報と、アプリ内使用のためのオプションのローカルオブジェクトが含まれます。たとえば、`DragAndDropTransferData(listOf(UIDragItem.fromString(text)))`を使用してテキストをドラッグできます。ここで`UIDragItem.fromString(text)`は、ドラッグ＆ドロップ操作に適した形式にテキストをエンコードします。現在、`String`と`NSObject`タイプのみがサポートされています。

一般的な使用例については、Jetpack Composeドキュメントの[専用の記事](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)を参照してください。

### スクロール可能な相互運用ビューのタッチ処理の改善

このリリースでは：

*   モーダルな`UIViewController`として表示されるスクロール不可能なコンテンツを持つComposeビューは、スワイプダウンジェスチャーで閉じることができます。
*   ネストされたスクロール可能なビューは、一般的な[相互運用タッチフレームワーク](compose-ios-touch.md)内で正しく機能します。スクロール可能なComposeビュー内でネイティブコンテンツをスクロールする場合、またはスクロール可能なネイティブビュー内でComposeコンテンツをスクロールする場合、UIはiOSロジックに厳密に従って、曖昧なタッチシーケンスを解決します。

### オプトインによる並行レンダリング
<secondary-label ref="Experimental"/>

iOS向けCompose Multiplatformは、レンダリングタスクを専用のレンダースレッドにオフロードすることをサポートするようになりました。並行レンダリングは、UIKitの相互運用がないシナリオでパフォーマンスを向上させる可能性があります。

`ComposeUIViewControllerConfiguration`クラスの`useSeparateRenderThreadWhenPossible`フラグを有効にするか、`ComposeUIViewController`設定ブロック内で`parallelRendering`プロパティを直接有効にすることで、レンダリングコマンドを別のレンダースレッドでエンコードするようにオプトインできます。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main(varvar args: String) {
    UIKitMain {
        ComposeUIViewController(configure = { parallelRendering = true }) {
            // ...
        }
    }
}
```

## Web

### Navigationライブラリでブラウザコントロールをサポート

Compose MultiplatformでビルドされたKotlin/WasmおよびKotlin/JSアプリケーションでは、ナビゲーションが基本的なブラウザコントロールと正しく連携するようになりました。これを有効にするには、`window.bindToNavigation()`メソッドを使用してブラウザウィンドウをメインのナビゲーショングラフにリンクします。これにより、Webアプリはブラウザの履歴を移動するための**戻る**および**進む**ボタンの使用に正しく反応するようになります（デモビデオについてはプルリクエスト[1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)を参照）。

Webアプリはまた、ブラウザのアドレスバーを操作して現在の宛先ルートを反映し、ユーザーが正しいルートがエンコードされたURLを貼り付けたときに直接宛先にナビゲートします（デモビデオについてはプルリクエスト[1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)を参照）。`window.bindToNavigation()`メソッドにはオプションの`getBackStackEntryPath`パラメータがあり、ルート文字列をURLフラグメントに変換する方法をカスタマイズできます。

### ブラウザカーソルの設定
<secondary-label ref="Experimental"/>

ブラウザページでマウスカーソルとして使用できるアイコンを管理するために、実験的な`PointerIcon.Companion.fromKeyword()`関数を導入しました。キーワードをパラメータとして渡すことで、コンテキストに基づいて表示するカーソルの種類を指定できます。例えば、テキストを選択したり、コンテキストメニューを開いたり、読み込みプロセスを示したりするために、異なるポインタアイコンを割り当てることができます。

利用可能な[キーワードの全リスト](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)を確認してください。

### リソースのプリロード
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2は、Webターゲット向けのフォントと画像のプリロードのための新しい実験的なAPIを導入しました。プリロードは、スタイルが適用されていないテキストのフラッシュ（FOUT）や画像・アイコンのちらつきなどの視覚的な問題を防止するのに役立ちます。

リソースの読み込みとキャッシュには、以下の関数が利用可能です。

*   フォントをプリロードする`preloadFont()`。
*   ビットマップ画像をプリロードする`preloadImageBitmap()`。
*   ベクター画像をプリロードする`preloadImageVector()`。

詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)を参照してください。

## デスクトップ

### Windowsでのソフトウェアレンダリングの改善

Windows上でSkiaに推奨されるclangコンパイラに切り替えることで、CPUに依存するレンダリングが高速化されました。レンダリングは通常GPUに依存し、一部の計算のみがCPUで行われるため、これは主に純粋なソフトウェアレンダリングに影響します。そのため、一部の仮想マシンや[Skiaでサポートされていない](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13)古いグラフィックカードでは、改善が非常に顕著です。Compose Multiplatformによって生成されたWindowsアプリは、これらの環境でCompose Multiplatform 1.7.3と比較して最大6倍高速になりました。

この改善は、Windows for ARM64のサポートと相まって、macOS上の仮想WindowsシステムにおけるCompose Multiplatform UIのパフォーマンスを大幅に向上させます。

### Windows for ARM64のサポート

Compose Multiplatform 1.8.2は、JVM上でのWindows for ARM64のサポートを導入し、ARMベースのWindowsデバイスでアプリケーションをビルドおよび実行する全体的なエクスペリエンスを向上させます。

## Gradleプラグイン

### 生成されるResクラス名を変更するオプション

アプリケーション内のリソースにアクセスできる生成されたリソースクラスの名前をカスタマイズできるようになりました。カスタム命名は、マルチモジュールプロジェクトでリソースを区別するのに特に役立ち、プロジェクトの命名規則との一貫性を維持するのに役立ちます。

カスタム名を定義するには、`build.gradle.kts`ファイルの`compose.resources`ブロックに以下の行を追加します。

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/5296)を参照してください。

### `androidLibrary`ターゲットでのマルチプラットフォームリソースのサポート
<secondary-label ref="Experimental"/>

Android Gradleプラグインバージョン8.8.0以降、新しい`androidLibrary`ターゲットで生成されたアセットを使用できます。これらの変更にCompose Multiplatformを合わせるため、Androidアセットにパックされたマルチプラットフォームリソースと連携するための新しいターゲット設定のサポートを導入しました。

`androidLibrary`ターゲットを使用している場合は、設定でリソースを有効にしてください。

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

そうしないと、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`という例外が発生します。