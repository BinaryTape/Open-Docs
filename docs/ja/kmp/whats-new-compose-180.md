[//]: # (title: Compose Multiplatform 1.8.2 の新機能)

この機能リリースの主なハイライトは以下の通りです：

* [バリアブルフォント](#variable-fonts)
* [iOS でのドラッグ＆ドロップ](#drag-and-drop)
* [iOS でのディープリンク](#deep-linking)
* [iOS でのアクセシビリティの向上](#accessibility-support-improvements)
* [Web ターゲット向けのリソースのプリロード](#preloading-of-resources)
* [ブラウザのナビゲーションコントロールとの統合](#browser-controls-supported-in-the-navigation-library)

このリリースの変更点の完全なリストは [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0) で確認できます。

## 依存関係

* Gradle プラグイン `org.jetbrains.compose` バージョン 1.8.2。以下の Jetpack Compose ライブラリに基づいています：
    * [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    * [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    * [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    * [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    * [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
* Lifecycle ライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。[Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0) に基づいています。
* Navigation ライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。[Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0) に基づいています。
* Material3 Adaptive ライブラリ `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。[Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0) に基づいています。
* Savedstate ライブラリ `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。[Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0) に基づいています。
* WindowManager Core ライブラリ `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。[Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04) に基づいています。

## 破壊的変更

### Compose Multiplatform の K2 コンパイラへの完全な移行

このリリースにより、Compose Multiplatform のコードベースは完全に K2 コンパイラへと移行されました。
1.8.0 以降、Compose Multiplatform に依存するプロジェクトによって生成された native および web の klib は、Kotlin 2.1.0 以降を使用している場合にのみ利用可能です。

これがプロジェクトに意味すること（Compose コンパイラ Gradle プラグインの根本的な変更に加えて）は以下の通りです：

* Compose Multiplatform に依存するライブラリを使用しているアプリの場合：
  プロジェクトを Kotlin 2.1.20 にアップデートし、依存関係を Compose Multiplatform 1.8.0 および Kotlin 2.1.x に対してコンパイルされたバージョンにアップデートすることをお勧めします。
* Compose Multiplatform に依存するライブラリの場合：
  プロジェクトを Kotlin 2.1.x および Compose 1.8.0 にアップデートし、ライブラリを再コンパイルして新しいバージョンを公開する必要があります。

Compose Multiplatform 1.8.0 へのアップグレード時に互換性の問題が発生した場合は、[YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) で問題を報告してお知らせください。

### `material-icons-core` への暗黙的な依存関係の削除

Compose Multiplatform 1.8.2 では、[Material で行われた変更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)を取り込んでいます：
`material-icons-core` への推移的な依存関係はなくなりました。
これは、[K1 でビルドされた依存関係からの脱却](#full-migration-of-compose-multiplatform-to-the-k2-compiler)と足並みを揃えるものです。

プロジェクトで `material-icons-core` ライブラリを引き続き使用する必要がある場合は、`build.gradle.kts` に明示的に依存関係を追加してください。例：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

また、Material Symbols ライブラリの [ベクター Android XML アイコンを使用する](compose-multiplatform-resources-usage.md#icons) こともできます。

### Navigation における Bundle から SavedState への移行

Compose Multiplatform 1.8.2 の Navigation は、Android の Navigation コンポーネントと同様に、UI 状態の保存に `SavedState` クラスを使用するように移行しています。
これにより、ナビゲーショングラフでデスティネーションを宣言する際に状態データにアクセスするパターンが変更されます。
[Navigation ライブラリ](compose-navigation-routing.md) の 2.9.* バージョンにアップグレードする際は、そのようなコードを `SavedState` のアクセサを使用するように更新してください。

> より堅牢なアーキテクチャのためには、文字列によるルートを避け、[ナビゲーションへの型安全なアプローチ](https://developer.android.com/guide/navigation/design/type-safety) を使用してください。
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

Compose Multiplatform 1.8.2 以降：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.read { getStringOrNull("userid") }
    val page = navBackStackEntry.arguments?.read { getStringOrNull("page") }
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

### iOS における `ComposeUIViewControllerDelegate` の非推奨化

`ComposeUIViewControllerDelegate` API は、親ビューコントローラーを優先するため非推奨となりました。
Compose Multiplatform 1.8.2 で非推奨の API を使用すると、親ビューコントローラーを介して `UIViewController` クラスのメソッドをオーバーライドすべきであることを示す非推奨エラーが発生します。

子と親のビューコントローラーの関係の詳細については、Apple の開発者 [ドキュメント](https://developer.apple.com/documentation/uikit/uiviewcontroller) を参照してください。

### iOS における不要になった `platformLayers` オプションの削除

`platformLayers` 実験的オプションは、代替のレイヤリングモードを有効にし、親コンテナの境界外にポップアップやダイアログを描画できるようにするために [1.6.0 で導入されました](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。

このモードは現在 iOS でのデフォルトの動作となっており、有効にするためのオプションは不要になったため削除されました。

### テストにおける破壊的変更

#### テストにおけるコルーチンの遅延処理の変更

以前の Compose Multiplatform のテストでは、`delay()` を呼び出すサイドエフェクトをアイドル状態とは見なしていませんでした。
そのため、例えば以下のテストは無期限にハングしていました：

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

composition スコープ内で起動された後にコルーチンが `delay()` 関数を呼び出すとき、`waitForIdle()`、`awaitIdle()`、および `runOnIdle()` 関数は Compose がアイドル状態であると見なすようになりました。
この変更により上記のハングするテストは修正されますが、`delay()` を含むコルーチンを実行するために `waitForIdle()`、`awaitIdle()`、および `runOnIdle()` に依存していたテストは壊れることになります。

これらのケースで同じ結果を得るには、人工的に時間を進めてください：

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
// waitForIdle() は遅延された LaunchedEffect() の完了を待たなくなったため、
// 以下のアサーションを正しくするためにテストで時間を進める必要があります。
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

テストクロックを進めるためにすでに `mainClock.advanceTimeBy()` 呼び出しを使用しているテストは、再コンポジション、レイアウト、描画、およびエフェクトに関して異なる挙動を示す可能性があります。

#### `runOnIdle()` の実装を Android と統一

Compose Multiplatform の `runOnIdle()` テスト関数の実装を Android の挙動に合わせるため、以下の変更を導入しました：

* `runOnIdle()` は、その `action` を UI スレッドで実行するようになりました。
* `runOnIdle()` は、`action` の実行後に `waitForIdle()` を呼び出さなくなりました。

テストが `runOnIdle()` アクションの後の追加の `waitForIdle()` 呼び出しに依存している場合は、Compose Multiplatform 1.8.2 用にアップデートする際に、必要に応じてその呼び出しを追加してください。

#### テストでの時間の進行とレンダリングの分離

Compose Multiplatform 1.8.2 では、`mainClock.advanceTimeBy()` 関数は、次のフレームをレンダリングする時点を越えて時間が進まない限り、再コンポジション、レイアウト、または描画を引き起こさなくなりました（仮想テストフレームは 16ms ごとにレンダリングされます）。

これにより、すべての `mainClock.advanceTimeBy()` 呼び出しによってレンダリングがトリガーされることに依存しているテストが壊れる可能性があります。詳細は [PR の説明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618) を参照してください。

## プラットフォーム共通

### バリアブルフォント

Compose Multiplatform 1.8.2 は、すべてのプラットフォームでバリアブルフォント（variable fonts）をサポートします。
バリアブルフォントを使用すると、太さ、幅、傾斜、イタリック、カスタム軸、タイポグラフィカラーを伴う視覚的な太さ、特定のテキストサイズへの適応など、すべてのスタイル設定を含む 1 つのフォントファイルを保持できます。

詳細については、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts) を参照してください。

### Skia を Milestone 132 にアップデート

Skiko を通じて Compose Multiplatform で使用されている Skia のバージョンが、Milestone 132 にアップデートされました。

以前使用されていた Skia のバージョンは Milestone 126 でした。これらのバージョン間の変更点は [リリースノート](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132) で確認できます。

### 新しい Clipboard インターフェース

Compose Multiplatform は Jetpack Compose の新しい `Clipboard` インターフェースを採用しました。

以前使用されていた `ClipboardManager` インターフェースは、[Web 上の Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) の非同期な性質により Web ターゲットではアクセスできませんでしたが、`Clipboard` の導入に伴い非推奨となりました。新しいインターフェースは `suspend` 関数をサポートしており、Web を含むすべてのターゲットと互換性があります。

共通コードからのクリップボード操作は、現在 API の設計により制限されています。詳細については [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624) を参照してください。

### 行高さ（Line-height）のアラインメント

以前は Android 上の Compose Multiplatform でのみサポートされていた行高さ（line-height）アラインメントの共通 API が、すべてのプラットフォームでサポートされるようになりました。
`LineHeightStyle.Alignment` を使用して、行高さによって提供されるスペース内でテキスト行をどのように配置するかを設定できます。
テキスト行は、確保されたスペースの下部、中央、上部に揃えたり、アセント（ascent）とディセント（descent）の値に基づいて比例的に調整したりできます。

<img src="compose-180-LineHeightStyle.png" alt="Line-height alignment" width="508"/>

Material3 では、行高さアラインメントのデフォルト値は `Center` であることに注意してください。つまり、特に指定がない限り、すべてのプラットフォームの Material3 コンポーネントにおいて `lineHeight` を持つテキストには中央揃えが適用されます。

## iOS

### ディープリンク

Compose Multiplatform 1.8.2 と [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) を併用することで、iOS でも通常の Compose の手法でディープリンクを実装できます。つまり、デスティネーションにディープリンクを割り当て、`NavController` を使用してそれらに遷移できます。

共通コードにディープリンクを導入するためのガイドについては、[ディープリンク](compose-navigation-deep-links.md) を参照してください。

### XCFrameworks 内の Compose リソース

Compose Multiplatform は、生成された XCFrameworks 内に直接リソースを埋め込むようになりました。
リソースを含む Compose ライブラリを標準の XCFrameworks としてビルドし、使用できます。

この機能には、Kotlin Gradle プラグインのバージョン 2.2 以上が必要です。

### アクセシビリティサポートの向上

#### 右から左に書く言語（RTL）のサポート

Compose Multiplatform 1.8.2 では、ジェスチャーに対する適切なテキスト方向の処理を含む、右から左に書く言語（RTL）のアクセシビリティサポートが導入されました。

RTL サポートの詳細については、[右から左に書く言語](compose-rtl.md) を参照してください。

#### スクロール可能なリストのアクセシビリティ

このバージョンでは、スクロール境界と要素位置の計算のパフォーマンスと精度が向上しました。
ノッチや画面の端などのセーフエリアを考慮することで、ギャップやマージン付近のスクロールに対する正確なアクセシビリティプロパティを確保しています。

また、スクロール状態の読み上げサポートも導入されました。
VoiceOver が有効な場合、3 本指のスクロールジェスチャーを行うとリストのステータス更新が聞こえます。読み上げの内容には以下が含まれます：

* リストの先頭にいるときは「最初のページ」
* 前方にスクロールしたときは「次のページ」
* 後方にスクロールしたときは「前のページ」
* 最後に到達したときは「最後のページ」

これらの読み上げのローカライズ版も提供されており、VoiceOver が選択した言語で読み上げることができます。

#### コンテナビューのアクセシビリティ

Compose Multiplatform 1.8.2 以降、複雑なビューをスクロールしたりスワイプしたりする際に正しい読み上げ順序を確保するために、コンテナのトラバーサル（巡回）セマンティックプロパティを定義できるようになりました。

スクリーンリーダー用の適切な要素ソートに加えて、トラバーサルプロパティのサポートにより、上スワイプまたは下スワイプのアクセシビリティジェスチャーを使用して、異なるトラバーサルグループ間を移動できるようになります。コンテナのアクセシビリティナビゲーションモードに切り替えるには、VoiceOver がアクティブな状態で画面上で 2 本の指を回転させます。

トラバーサルセマンティックプロパティの詳細については、[アクセシビリティ](compose-accessibility.md#traversal-order) セクションを参照してください。

#### アクセシブルなテキスト入力

Compose Multiplatform 1.8.2 では、テキストフィールドのアクセシビリティ特性（traits）のサポートを導入しました。
テキスト入力フィールドにフォーカスが当たると、編集可能としてマークされるようになり、適切なアクセシビリティ状態の表現が保証されます。

また、UI テストでアクセシブルなテキスト入力を使用することも可能になりました。

#### トラックパッドとキーボードによる操作のサポート

iOS 用 Compose Multiplatform で、デバイスを操作するための 2 つの追加の入力メソッドがサポートされました。タッチスクリーンに頼る代わりに、マウスやトラックパッドを使用するための AssistiveTouch、またはキーボードを使用するための「フルキーボードアクセス」のいずれかを有効にできます：

* **AssistiveTouch**（**設定** | **アクセシビリティ** | **タッチ** | **AssistiveTouch**）を使用すると、接続されたマウスやトラックパッドのポインタで iPhone や iPad を操作できます。ポインタを使用して画面上のアイコンをクリックしたり、AssistiveTouch メニューを操作したり、画面上のキーボードを使用して入力したりできます。
* **フルキーボードアクセス**（**設定** | **アクセシビリティ** | **キーボード** | **フルキーボードアクセス**）を使用すると、接続されたキーボードでデバイスを操作できます。**Tab** キーなどのキーで移動し、**スペース** キーで項目をアクティブにできます。

#### オンデマンドでのアクセシビリティツリーの読み込み

Compose セマンティックツリーを iOS アクセシビリティツリーと同期する特定のモードを設定する代わりに、Compose Multiplatform がこのプロセスを遅延（lazy）処理するようになりました。
ツリーは iOS アクセシビリティエンジンからの最初の要求の後に完全に読み込まれ、スクリーンリーダーがそれとのやり取りを停止すると破棄されます。

これにより、iOS の音声コントロール（Voice Control）、VoiceOver、およびアクセシビリティツリーに依存するその他のアクセシビリティツールの完全なサポートが可能になります。

[アクセシビリティツリーの同期を設定するために使用されていた](compose-ios-accessibility.md#choose-the-tree-synchronization-option) `AccessibilitySyncOptions` クラスは、不要になったため削除されました。

#### アクセシビリティプロパティ計算の精度向上

Compose Multiplatform コンポーネントのアクセシビリティプロパティを、UIKit コンポーネントの期待される動作に一致するように更新しました。
UI 要素は広範なアクセシビリティデータを提供するようになり、アルファ値が 0 の透明なコンポーネントはアクセシビリティセマンティクスを提供しなくなりました。

セマンティクスの調整により、`DropDown` 要素のヒットボックスの欠落、表示テキストとアクセシビリティラベルの不一致、ラジオボタンの状態の誤りなど、アクセシビリティプロパティの誤った計算に関連するいくつかの問題も修正されました。

### iOS ロギングの安定版 API

iOS でオペレーティングシステムのロギングを有効にする API が安定版になりました。`enableTraceOSLog()` 関数は実験的機能へのオプトイン（experimental opt-in）を必要としなくなり、Android スタイルのロギングと足並みを揃えました。このロギングは、Xcode Instruments を使用してデバッグやパフォーマンス分析のために分析できるトレース情報を提供します。

### ドラッグ＆ドロップ
<primary-label ref="Experimental"/>

iOS 用 Compose Multiplatform にドラッグ＆ドロップ機能のサポートが導入され、Compose アプリケーション内外にコンテンツをドラッグできるようになりました（デモビデオについてはプルリクエスト [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690) を参照してください）。
ドラッグ可能なコンテンツとドロップ先（ターゲット）を定義するには、`dragAndDropSource` および `dragAndDropTarget` モディファイアを使用します。

iOS では、ドラッグ＆ドロップセッションのデータは [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) によって表されます。
このオブジェクトには、プロセス間のデータ転送に関する情報と、アプリ内での使用のためのオプションのローカルオブジェクトが含まれます。
たとえば、`DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` を使用してテキストをドラッグできます。ここで `UIDragItem.fromString(text)` は、ドラッグ＆ドロップ操作に適した形式にテキストをエンコードします。
現在、`String` および `NSObject` 型のみがサポートされています。

一般的なユースケースについては、Jetpack Compose ドキュメントの [専用の記事](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop) を参照してください。

### スクロール相互運用ビューのタッチ処理の向上

このリリースでは：

* モーダル `UIViewController` として表示される非スクロールコンテンツを持つ Compose ビューは、下スワイプジェスチャーで閉じることができます。
* ネストされたスクロール可能なビューが、一般的な [相互運用タッチフレームワーク](compose-ios-touch.md) 内で正しく動作するようになりました：
  スクロール可能な Compose ビュー内でネイティブコンテンツをスクロールする場合、またはスクロール可能なネイティブビュー内で Compose コンテンツをスクロールする場合、UI は iOS のロジックに密接に従って曖昧なタッチシーケンスを解決します。

### コンカレントレンダリングのオプトイン
<primary-label ref="Experimental"/>

iOS 用 Compose Multiplatform で、レンダリングタスクを専用のレンダリングスレッドにオフロードできるようになりました。
コンカレントレンダリング（同時並行レンダリング）は、UIKit との相互運用がないシナリオでパフォーマンスを向上させる可能性があります。

`ComposeUIViewControllerConfiguration` クラスの `useSeparateRenderThreadWhenPossible` フラグを有効にするか、`ComposeUIViewController` 設定ブロック内で直接 `parallelRendering` プロパティを有効にすることで、別のレンダリングスレッドでのレンダリングコマンドのエンコードをオプトインできます：

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

### Navigation ライブラリでのブラウザコントロールのサポート

Compose Multiplatform で構築された Kotlin/Wasm および Kotlin/JS アプリケーションにおいて、ナビゲーションが基本的なブラウザコントロールで正しく動作するようになりました。
これを有効にするには、`window.bindToNavigation()` メソッドを使用してブラウザウィンドウをメインのナビゲーショングラフにリンクします。
これにより、Web アプリはブラウザの **戻る** および **進む** ボタンを使用して履歴を移動することに正しく反応するようになります（デモビデオについてはプルリクエスト [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621) を参照してください）。

Web アプリはブラウザのアドレスバーも操作して現在のデスティネーションルートを反映させ、ユーザーが正しいルートがエンコードされた URL を貼り付けたときにそのデスティネーションに直接移動するようになります（デモビデオについてはプルリクエスト [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640) を参照してください）。
`window.bindToNavigation()` メソッドにはオプションの `getBackStackEntryPath` パラメータがあり、ルート文字列から URL フラグメントへの変換をカスタマイズできます。

### ブラウザカーソルの設定
<primary-label ref="Experimental"/>

ブラウザページ上のマウスポインタとして使用できるアイコンを管理するための、実験的な `PointerIcon.Companion.fromKeyword()` 関数を導入しました。
パラメータとしてキーワードを渡すことで、コンテキストに基づいて表示するカーソルの種類を指定できます。
たとえば、テキストの選択、コンテキストメニューの表示、または読み込みプロセスの表示に合わせて、異なるポインタアイコンを割り当てることができます。

利用可能な [キーワード](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) の完全なリストを確認してください。

### リソースのプリロード
<primary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 では、Web ターゲット向けのフォントや画像をプリロードするための新しい実験的 API が導入されました。
プリロードは、スタイル設定されていないテキストのフラッシュ（FOUT）や、画像・アイコンのちらつきなどの視覚的な問題を防ぐのに役立ちます。

リソースの読み込みとキャッシュのために、以下の関数が利用可能になりました：

* `preloadFont()`：フォントをプリロードします。
* `preloadImageBitmap()`：ビットマップ画像をプリロードします。
* `preloadImageVector()`：ベクター画像をプリロードします。

詳細は [ドキュメント](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api) を参照してください。

## デスクトップ

### Windows でのソフトウェアレンダリングの向上

Windows 上の Skia に推奨される clang コンパイラに切り替えたことで、CPU に依存するレンダリングが高速化されました。
レンダリングは一般的に GPU に依存し、一部の計算のみが CPU で行われるため、これは主に純粋なソフトウェアレンダリングに影響します。
そのため、一部の仮想マシンや、[Skia でサポートされていない](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13) いくつかの古いグラフィックカードでは改善が非常に顕著です：
Compose Multiplatform によって生成された Windows アプリは、それらの環境において Compose Multiplatform 1.7.3 と比較して最大 6 倍高速になりました。

この改善は、Windows for ARM64 のサポートに加えて、macOS 上の仮想 Windows システムでの Compose Multiplatform UI のパフォーマンスを大幅に向上させます。

### Windows for ARM64 のサポート

Compose Multiplatform 1.8.2 では JVM 上の Windows for ARM64 のサポートが導入され、ARM ベースの Windows デバイスでのアプリケーションの構築と実行の全体的なエクスペリエンスが向上しました。

## Gradle プラグイン

### 生成される Res クラス名を変更するオプション

アプリ内のリソースへのアクセスを提供する、生成されたリソースクラスの名前をカスタマイズできるようになりました。
カスタム命名は、マルチモジュールプロジェクトでのリソースの区別に特に役立ち、プロジェクトの命名規則との一貫性を保つのに役立ちます。

カスタム名を定義するには、`build.gradle.kts` ファイルの `compose.resources` ブロックに以下の行を追加します：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

詳細については、[プルリクエスト](https://github.com/JetBrains/compose-multiplatform/pull/5296) を参照してください。

### `androidLibrary` ターゲットにおけるマルチプラットフォームリソースのサポート
<primary-label ref="Experimental"/>

Android Gradle プラグイン バージョン 8.8.0 以降、新しい `androidLibrary` ターゲットで生成されたアセットを使用できるようになりました。
Compose Multiplatform をこれらの変更に合わせるため、Android アセットにパックされたマルチプラットフォームリソースを操作するための新しいターゲット設定のサポートを導入しました。

`androidLibrary` ターゲットを使用している場合は、設定でリソースを有効にしてください：

```kotlin
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

そうしないと、次の例外が発生します：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`