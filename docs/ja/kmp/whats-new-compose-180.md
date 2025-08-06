[//]: # (title: Compose Multiplatform 1.8.2の新機能)
今回の機能リリースにおける主なハイライトは以下のとおりです。

*   [可変フォント](#variable-fonts)
*   [iOSでのドラッグ＆ドロップ](#drag-and-drop)
*   [iOSでのディープリンク](#deep-linking)
*   [iOSでのアクセシビリティサポートの改善](#accessibility-support-improvements)
*   [Webターゲット向けリソースのプリロード](#preloading-of-resources)
*   [ブラウザナビゲーションコントロールとの統合](#browser-controls-supported-in-the-navigation-library)

このリリースの変更点の全リストについては、[GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)をご覧ください。

## 依存関係

*   Gradle Plugin `org.jetbrains.compose`, バージョン 1.8.2。Jetpack Composeライブラリに基づいています。
    *   [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    *   [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    *   [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    *   [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Lifecycle libraries `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)に基づいています。
*   Navigation libraries `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)に基づいています。
*   Material3 Adaptive libraries `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)に基づいています。
*   Savedstate library `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)に基づいています。
*   WindowManager Core library `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)に基づいています。

## 破壊的変更

### Compose MultiplatformのK2コンパイラへの完全移行

今回のリリースにより、Compose MultiplatformのコードベースはK2コンパイラに完全に移行されました。
1.8.0以降、
Compose Multiplatformに依存するプロジェクトによって生成されるネイティブおよびWebのklibは、
Kotlin 2.1.0以降を使用する場合にのみ利用可能です。

これは、ComposeコンパイラGradleプラグインの基盤となる変更に加えて、あなたのプロジェクトにとって何を意味するかというと、以下の通りです。

*   Compose Multiplatformに依存するライブラリを使用するアプリの場合：
    プロジェクトをKotlin 2.1.20に更新し、依存関係をCompose Multiplatform 1.8.0およびKotlin 2.1.xに対してコンパイルされたバージョンに更新することが推奨されます。
*   Compose Multiplatformに依存するライブラリの場合：
    プロジェクトをKotlin 2.1.xおよびCompose 1.8.0に更新し、
    その後、ライブラリを再コンパイルして新しいバージョンを公開する必要があります。

Compose Multiplatform 1.8.0へのアップグレードで互換性の問題が発生した場合は、
[YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP)で問題を報告してご連絡ください。

### `material-icons-core`への暗黙的な依存関係を削除

Compose Multiplatform 1.8.2には、[Materialの変更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)が組み込まれています。
これにより、`material-icons-core`への推移的な依存関係がなくなりました。
これは、[K1でビルドされた依存関係からの移行](#full-migration-of-compose-multiplatform-to-the-k2-compiler)に沿ったものです。

プロジェクトで引き続き`material-icons-core`ライブラリを使用する必要がある場合は、
`build.gradle.kts`に依存関係を明示的に追加してください。例：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### NavigationにおけるBundleからSavedStateへの移行

Compose Multiplatform 1.8.2のNavigationは、
Android Navigationコンポーネントとともに、UIの状態を保存するために`SavedState`クラスを使用するように移行しています。
これにより、ナビゲーショングラフでデスティネーションを宣言する際のステートデータへのアクセスパターンが変更されます。
[Navigationライブラリ](compose-navigation-routing.md)の2.9.*バージョンにアップグレードする際には、
そのようなコードを`SavedState`のアクセサーを使用するように更新してください。

>より堅牢なアーキテクチャのために、
>文字列ルートを避け、[型安全なナビゲーションのアプローチ](https://developer.android.com/guide/navigation/design/type-safety)を使用してください。
>
{style="note"}

以前：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

Compose Multiplatform 1.8.2以降：

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

`ComposeUIViewControllerDelegate` APIは親ビューコントローラーに代わって非推奨になりました。
Compose Multiplatform 1.8.2で非推奨のAPIを使用すると、
親ビューコントローラー経由で`UIViewController`クラスメソッドをオーバーライドする必要があることを示す非推奨エラーが発生します。

子-親ビューコントローラーの関係については、Appleの開発者[ドキュメント](https://developer.apple.com/documentation/uikit/uiviewcontroller)をご覧ください。

### 廃止された`platformLayers`オプションの削除（iOS）

`platformLayers`の実験的オプションは[1.6.0で導入され](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)、
代替のレイヤーモードを有効にし、ポップアップやダイアログを親コンテナの境界外に描画することを可能にするものでした。

このモードは現在iOSのデフォルトの動作となり、有効にするオプションは廃止されたため削除されました。

### テストにおける破壊的変更

#### テストにおけるコルーチン遅延の新しい処理

以前は、Compose Multiplatformのテストでは、`delay()`呼び出しを伴う副作用はアイドル状態とは見なされませんでした。
そのため、例えば次のテストは無限にハングしていました。

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

コルーチンがコンポジションスコープで起動された後に`delay()`関数を呼び出す場合、
`waitForIdle()`、`awaitIdle()`、および`runOnIdle()`関数はComposeがアイドル状態であると見なすようになりました。
この変更により上記のハングするテストは修正されますが、
`delay()`を伴うコルーチンを実行するために`waitForIdle()`、`awaitIdle()`、および`runOnIdle()`に依存するテストは壊れます。

これらのケースで同じ結果を生成するには、時間を人為的に進めてください。

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
// waitForIdle()が遅延されたLaunchedEffect()の完了を待たなくなったため、
// 以下のアサーションが正しくなるように、テストは時間を進める必要があります。
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

`mainClock.advanceTimeBy()`呼び出しを使用してテストクロックを進めているテストは、
再コンポジション、レイアウト、描画、およびエフェクトに関して異なる動作をする可能性があります。

#### `runOnIdle()`の実装がAndroidに準拠

`runOnIdle()`テスト関数のCompose Multiplatformの実装をAndroidの動作に合わせるため、
以下の変更を導入しました。

*   `runOnIdle()`は`action`をUIスレッドで実行するようになりました。
*   `runOnIdle()`は`action`の実行後に`waitForIdle()`を呼び出さなくなりました。

`runOnIdle`アクションの後の追加の`waitForIdle()`呼び出しにテストが依存している場合は、
Compose Multiplatform 1.8.2に更新する際に、必要に応じてその呼び出しをテストに追加してください。

#### テストでの時間進行がレンダリングから分離

Compose Multiplatform 1.8.2では、`mainClock.advanceTimeBy()`関数は、
次のフレームをレンダリングするポイントを過ぎて時間が進まなかった場合（仮想テストフレームは16msごとにレンダリングされます）、
再コンポジション、レイアウト、または描画を引き起こさなくなりました。

これにより、`mainClock.advanceTimeBy()`呼び出しごとにレンダリングがトリガーされることに依存するテストは壊れる可能性があります。
詳細については、[PRの記述](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)を参照してください。

## クロスプラットフォーム

### 可変フォント

Compose Multiplatform 1.8.2は、すべてのプラットフォームで可変フォントをサポートしています。
可変フォントを使用すると、太さ、幅、傾斜、イタリック、カスタム軸、タイポグラフィ色による視覚的な太さ、
および特定のテキストサイズへの適応など、すべてのスタイル設定を含む1つのフォントファイルを保持できます。

詳細については、[Jetpack Composeドキュメント](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)を参照してください。

### Skiaがマイルストーン132に更新

Skikoを介してCompose Multiplatformで使用されるSkiaのバージョンがマイルストーン132に更新されました。

以前使用されていたSkiaのバージョンはマイルストーン126でした。これらのバージョン間の変更点は、[リリースノート](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)で確認できます。

### 新しいClipboardインターフェース

Compose Multiplatformは、Jetpack Composeの新しい`Clipboard`インターフェースを採用しました。

以前使用されていた`ClipboardManager`インターフェースは、[Web上のClipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)の非同期性のためWebターゲットでアクセスできませんでしたが、
`Clipboard`に代わって非推奨になりました。新しいインターフェースは`suspend`関数をサポートしており、Webを含むすべてのターゲットと互換性があります。

共通コードからのクリップボード操作は、現在のところAPI設計によって制限されています。
詳細については、[CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)を参照してください。

### 行の高さの配置

Compose Multiplatformで以前はAndroidのみでサポートされていた行の高さの配置に関する共通APIが、
すべてのプラットフォームでサポートされるようになりました。
`LineHeightStyle.Alignment`を使用すると、行の高さによって提供されるスペース内でテキスト行がどのように配置されるかを構成できます。
テキスト行は、予約されたスペースの下部、中央、または上部に配置することも、
アセント値とディセント値に基づいて比例的に調整することもできます。

<img src="compose-180-LineHeightStyle.png" alt="行の高さの配置" width="508"/>

Material3では、行の高さの配置のデフォルト値は`Center`であることに注意してください。
これは、特に指定がない限り、Material3コンポーネントの`lineHeight`を持つテキストに、すべてのプラットフォームで中央揃えが適用されることを意味します。

## iOS

### ディープリンク

Compose Multiplatform 1.8.2を[org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md)
%org.jetbrains.androidx.navigation%と組み合わせて使用することで、
通常のComposeの方法でiOSにディープリンクを実装できます。
つまり、デスティネーションにディープリンクを割り当て、`NavController`を使用してそれらにナビゲートします。

共通コードにディープリンクを導入する方法については、[](compose-navigation-deep-links.md)を参照してください。

### XCFrameworksにおけるComposeリソース

Compose Multiplatformは、生成されたXCFrameworks内にリソースを直接埋め込むようになりました。
リソースを含むComposeライブラリを標準のXCFrameworksとしてビルドして使用できます。

この機能にはKotlin Gradleプラグインバージョン2.2以降が必要です。

### アクセシビリティサポートの改善

#### 右から左への言語のサポート

Compose Multiplatform 1.8.2では、右から左への言語のアクセシビリティサポートが導入され、
ジェスチャに対する適切なテキスト方向処理が含まれています。

RTLサポートの詳細については、[右から左への言語](compose-rtl.md)を参照してください。

#### スクロール可能なリストのアクセシビリティ

このバージョンでは、スクロール境界および要素位置の計算のパフォーマンスと精度が向上しました。
ノッチや画面の端などのセーフエリアを考慮することで、
ギャップや余白の近くでのスクロールに対する正確なアクセシビリティプロパティが保証されます。

また、スクロール状態の通知機能も導入しました。
VoiceOverを有効にしている場合、3本指スクロールジェスチャを実行すると、リストの状態更新が聞こえるようになります。
通知には以下が含まれます。

*   リストの先頭にいる場合は「最初のページ」
*   前方にスクロールしている場合は「次のページ」
*   後方にスクロールしている場合は「前のページ」
*   最後に到達した場合は「最後のページ」

これらの通知のローカライズされたバージョンも提供されており、VoiceOverが選択した言語でそれらを読み上げることができます。

#### コンテナビューのアクセシビリティ

Compose Multiplatform 1.8.2以降、
コンテナのトラバーサルセマンティックプロパティを定義して、
複雑なビューをスクロールしたりスワイプしたりする際に正しい読み上げ順序を確保できます。

スクリーンリーダーの要素を適切にソートするだけでなく、
トラバーサルプロパティのサポートにより、スワイプアップまたはスワイプダウンのアクセシビリティジェスチャで異なるトラバーサルグループ間をナビゲートできます。
コンテナのアクセシブルナビゲーションモードに切り替えるには、VoiceOverがアクティブな状態で画面上で2本の指を回転させます。

トラバーサルセマンティックプロパティの詳細については、[アクセシビリティ](compose-accessibility.md#traversal-order)セクションを参照してください。

#### アクセシブルなテキスト入力

Compose Multiplatform 1.8.2では、テキストフィールドのアクセシビリティ特性のサポートを導入しました。
テキスト入力フィールドがフォーカスに入ると、編集可能としてマークされるようになり、
適切なアクセシビリティ状態の表現が保証されます。

UIテストでもアクセシブルなテキスト入力を使用できるようになりました。

#### トラックパッドとキーボードによる制御のサポート

Compose Multiplatform for iOSは、デバイスを制御するための2つの追加入力方法をサポートするようになりました。タッチスクリーンに頼る代わりに、
AssistiveTouchを有効にしてマウスまたはトラックパッドを使用するか、
フルキーボードアクセスを有効にしてキーボードを使用することができます。

*   AssistiveTouch（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続されたマウスまたはトラックパッドのポインタでiPhoneまたはiPadを制御できます。ポインタを使用して画面上のアイコンをクリックしたり、AssistiveTouchメニューをナビゲートしたり、画面上のキーボードを使用して入力したりできます。
*   フルキーボードアクセス（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）を使用すると、接続されたキーボードでデバイスを制御できます。**Tab**キーなどのキーでナビゲートし、**Space**キーでアイテムをアクティブ化できます。

#### アクセシビリティツリーのオンデマンドロード

ComposeセマンティックツリーとiOSアクセシビリティツリーの同期の特定モードを設定する代わりに、
Compose Multiplatformにこのプロセスを遅延処理させることに頼ることができます。
ツリーはiOSアクセシビリティエンジンからの最初の要求後に完全にロードされ、
スクリーンリーダーがそれとのインタラクションを停止すると破棄されます。

これにより、iOS Voice Control、VoiceOver、
およびアクセシビリティツリーに依存する他のアクセシビリティツールを完全にサポートできます。

[アクセシビリティツリーの同期を設定するために使用されていた](compose-ios-accessibility.md#choose-the-tree-synchronization-option)`AccessibilitySyncOptions`クラスは、
もはや不要なため削除されました。

#### アクセシビリティプロパティ計算の精度向上

Compose Multiplatformコンポーネントのアクセシビリティプロパティを更新し、
UIKitコンポーネントの期待される動作に合わせました。
UI要素は広範なアクセシビリティデータを提供するようになり、
アルファ値が0の透明なコンポーネントはアクセシビリティセマンティクスを提供しなくなりました。

セマンティクスの整合化により、
`DropDown`要素のヒットボックスの欠落、
表示されるテキストとアクセシビリティラベルの不一致、
ラジオボタンの状態の誤りなど、
アクセシビリティプロパティの不正確な計算に関連するいくつかの問題を修正することもできました。

### iOSロギングの安定版API

iOSでオペレーティングシステムロギングを有効にするAPIが安定版になりました。
`enableTraceOSLog()`関数はもはや実験的なオプトインを必要とせず、Androidスタイルのロギングに準拠しています。
このロギングは、デバッグおよびパフォーマンス分析のためにXcode Instrumentsを使用して分析できるトレース情報を提供します。

### ドラッグ＆ドロップ
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOSはドラッグ＆ドロップ機能のサポートを導入し、
コンテンツをComposeアプリケーション内外にドラッグできるようにしました
（デモビデオはプルリクエスト[1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)をご覧ください）。
ドラッグ可能なコンテンツとドロップターゲットを定義するには、`dragAndDropSource`および`dragAndDropTarget`モディファイアを使用します。

iOSでは、ドラッグ＆ドロップセッションデータは[`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem)で表されます。
このオブジェクトには、クロスプロセスデータ転送に関する情報と、アプリ内での使用のためのオプションのローカルオブジェクトが含まれます。
例えば、`DragAndDropTransferData(listOf(UIDragItem.fromString(text)))`を使用してテキストをドラッグできます。
ここで`UIDragItem.fromString(text)`は、ドラッグ＆ドロップ操作に適した形式にテキストをエンコードします。
現在、`String`と`NSObject`タイプのみがサポートされています。

一般的な使用例については、Jetpack Composeドキュメントの[専用の記事](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)を参照してください。

### スクロール可能な相互運用ビューのタッチ処理の改善

このリリースでは：

*   モーダルな`UIViewController`として提示される、スクロール不可能なコンテンツを持つComposeビューは、スワイプダウンジェスチャで閉じることができます。
*   ネストされたスクロール可能なビューは、一般的な[相互運用タッチフレームワーク](compose-ios-touch.md)内で正しく機能します。
    スクロール可能なComposeビュー内でネイティブコンテンツをスクロールする場合、
    またはスクロール可能なネイティブビュー内でComposeコンテンツをスクロールする場合、
    UIはiOSロジックに密接に従い、曖昧なタッチシーケンスを解決します。

### オプトイン並行レンダリング
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOSは、レンダリングタスクを専用のレンダリングスレッドにオフロードする機能をサポートするようになりました。
並行レンダリングは、UIKit相互運用がないシナリオでパフォーマンスを向上させる可能性があります。

レンダリングコマンドを別のレンダリングスレッドでエンコードするには、
`ComposeUIViewControllerConfiguration`クラスの`useSeparateRenderThreadWhenPossible`フラグ、
または`ComposeUIViewController`設定ブロック内で`parallelRendering`プロパティを直接有効にすることでオプトインします。

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main(vararg args: String) {
    UIKitMain {
        ComposeUIViewController(configure = { parallelRendering = true }) {
            // ...
        }
    }
}
```

## Web

### Navigationライブラリでブラウザコントロールをサポート

Compose MultiplatformでビルドされたKotlin/WasmおよびKotlin/JSアプリケーションでは、
ナビゲーションが基本的なブラウザコントロールと正しく連携するようになりました。
これを有効にするには、`window.bindToNavigation()`メソッドを使用してブラウザウィンドウをメインのナビゲーショングラフにリンクします。
これにより、Webアプリはブラウザの**戻る**ボタンと**進む**ボタンを使用して履歴を移動する操作に正しく反応するようになります
（デモビデオはプルリクエスト[1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)をご覧ください）。

Webアプリは、現在のデスティネーションルートを反映するようにブラウザのアドレスバーも操作し、
ユーザーが正しいルートがエンコードされたURLを貼り付けたときに直接デスティネーションにナビゲートします
（デモビデオはプルリクエスト[1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)をご覧ください）。
`window.bindToNavigation()`メソッドにはオプションの`getBackStackEntryPath`パラメータがあり、
これによりルート文字列をURLフラグメントに変換する方法をカスタマイズできます。

### ブラウザカーソルの設定
<secondary-label ref="Experimental"/>

ブラウザページでマウスポインタとして使用できるアイコンを管理するために、実験的な`PointerIcon.Companion.fromKeyword()`関数を導入しました。
キーワードをパラメータとして渡すことで、コンテキストに基づいて表示するカーソルの種類を指定できます。
たとえば、テキストを選択したり、コンテキストメニューを開いたり、読み込みプロセスを示したりするために、異なるポインタアイコンを割り当てることができます。

利用可能な[キーワード](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)の完全なリストを確認してください。

### リソースのプリロード
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2では、
Webターゲット向けにフォントや画像をプリロードするための新しい実験的なAPIが導入されました。
プリロードは、スタイルが適用されていないテキストのちらつき（FOUT）や、画像やアイコンのちらつきといった視覚的な問題を防止するのに役立ちます。

リソースの読み込みとキャッシュには、以下の関数が利用可能です。

*   `preloadFont()`: フォントをプリロードします。
*   `preloadImageBitmap()`: ビットマップ画像をプリロードします。
*   `preloadImageVector()`: ベクター画像をプリロードします。

詳細については、[ドキュメント](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)を参照してください。

## デスクトップ

### Windowsにおけるソフトウェアレンダリングの改善

WindowsでSkiaに推奨されるclangコンパイラに切り替えることで、CPUに依存するレンダリングが高速化されました。
これは主に純粋なソフトウェアレンダリングに影響を与えますが、
レンダリングは通常GPUに依存しており、CPUで行われる計算は一部にすぎません。
したがって、一部の仮想マシンや[Skiaでサポートされていない](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13)古いグラフィックカードでは、
その改善が非常に顕著です。
Compose Multiplatformによって生成されたWindowsアプリは、
これらの環境でCompose Multiplatform 1.7.3と比較して最大6倍高速になりました。

この改善は、Windows for ARM64のサポートに加えて、macOS上の仮想WindowsシステムにおけるCompose Multiplatform UIのパフォーマンスを大幅に向上させます。

### Windows for ARM64のサポート

Compose Multiplatform 1.8.2は、JVM上でのWindows for ARM64のサポートを導入し、
ARMベースのWindowsデバイスでのアプリケーションのビルドと実行の全体的なエクスペリエンスを向上させます。

## Gradleプラグイン

### 生成されるResクラス名の変更オプション

アプリ内のリソースにアクセスするための、生成されるリソースクラスの名前をカスタマイズできるようになりました。
カスタム命名は、マルチモジュールプロジェクトでリソースを区別するのに特に役立ち、
プロジェクトの命名規則との一貫性を維持するのに役立ちます。

カスタム名を定義するには、`build.gradle.kts`ファイルの`compose.resources`ブロックに以下の行を追加します。

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/5296)を参照してください。

### `androidLibrary`ターゲットでのマルチプラットフォームリソースのサポート
<secondary-label ref="Experimental"/>

Android Gradleプラグインのバージョン8.8.0以降、新しい`androidLibrary`ターゲットで生成されたアセットを使用できるようになりました。
Compose Multiplatformをこれらの変更に合わせるため、Androidアセットにパックされたマルチプラットフォームリソースを扱うための新しいターゲット設定のサポートを導入しました。

`androidLibrary`ターゲットを使用している場合は、設定でリソースを有効にしてください。

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

そうしないと、`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`という例外が発生します。