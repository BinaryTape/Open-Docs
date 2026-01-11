[//]: # (title: Compose Multiplatform 1.10.0-rc02 の新機能)

このEAP機能リリースでの主なハイライトは以下のとおりです。
 * [`@Preview`アノテーションの統合](#unified-preview-annotation)
 * [Navigation 3のサポート](#support-for-navigation-3)
 * [Compose Hot Reloadのバンドル](#compose-hot-reload-integration)

このリリースの変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.10.0-beta01)で確認できます。

## 依存関係

| ライブラリ            | Maven座標                                                               | Jetpackバージョンに基づく                                                                                                             |
|--------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Runtime            | `org.jetbrains.compose.runtime:runtime*:1.10.0-rc02`                        | [Runtime 1.10.0](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.10.0)                                     |
| UI                 | `org.jetbrains.compose.ui:ui*:1.10.0-rc02`                                  | [UI 1.10.0](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.10.0)                                               |
| Foundation         | `org.jetbrains.compose.foundation:foundation*:1.10.0-rc02`                  | [Foundation 1.10.0](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.10.0)                               |
| Material           | `org.jetbrains.compose.material:material*:1.10.0-rc02`                      | [Material 1.10.0](https://developer.android.com/jetpack/androidx/releases/compose-material#1.10.0)                                   |
| Material3          | `org.jetbrains.compose.material3:material3*:1.10.0-alpha05`                 | [Material3 1.5.0-alpha08](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha08)                   |
| Material3 Adaptive | `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha02`          | [Material3 Adaptive 1.3.0-alpha03](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha03) |
| Lifecycle          | `org.jetbrains.androidx.lifecycle:lifecycle-*:2.10.0-alpha06`               | [Lifecycle 2.10.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.10.0)                                         |
| Navigation         | `org.jetbrains.androidx.navigation:navigation-*:2.9.1`                      | [Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4)                                         |
| Navigation3        | `org.jetbrains.androidx.navigation3:navigation3-*:1.0.0-alpha06`            | [Navigation3 1.0.0](https://developer.android.com/jetpack/androidx/releases/navigation3#1.0.0)                                       |
| Navigation Event   | `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.0.0-rc02` | [Navigation Event 1.0.1](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.0.1)                              |
| Savedstate         | `org.jetbrains.androidx.savedstate:savedstate*:1.4.0`                       | [Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0)                                         |
| WindowManager Core | `org.jetbrains.androidx.window:window-core:1.5.1`                           | [WindowManager 1.5.1](https://developer.android.com/jetpack/androidx/releases/window#1.5.1)                                          |

## 破壊的変更と非推奨

### 非推奨の依存関係エイリアス

Compose Multiplatform Gradleプラグイン（`compose.ui`など）によってサポートされている依存関係エイリアスは、1.10.0-beta01リリースで非推奨となりました。
バージョンカタログに直接ライブラリ参照を追加することをお勧めします。
具体的な参照は、対応する非推奨通知で提案されています。

この変更により、Compose Multiplatformライブラリの依存関係管理がもう少し透過的になるはずです。
将来的には、互換性のあるバージョンの設定を簡素化するために、Compose Multiplatform用のBOMを提供したいと考えています。

### `PredictiveBackHandler()`の非推奨

`PredictiveBackHandler()`関数は、ネイティブAndroidの戻るナビゲーションジェスチャを他のプラットフォームにもたらすためにCompose Multiplatformで導入されました。
Navigation 3のリリースに伴い、古い実装は新しい[Navigation Event](https://developer.android.com/jetpack/androidx/releases/navigationevent)ライブラリとそのAPIの使用を推奨し、非推奨となりました。
具体的には、`PredictiveBackHandler()`関数を使用する代わりに、より一般的な`NavigationEventHandler()`実装をラップする新しい`NavigationBackHandler()`関数を使用する必要があります。

最も簡単な移行方法は次のようになります。

<compare type="top-bottom">
    <code-block lang="kotlin" code="         PredictiveBackHandler(enabled = true) { progress -&gt;&#10;            try {&#10;                progress.collect { event -&gt;&#10;                    // Animate the back gesture progress&#10;                }&#10;                // Process the completed back gesture&#10;            } catch(e: Exception) {&#10;                // Process the canceled back gesture&#10;            }&#10;        }"/>
    <code-block lang="kotlin" code="        // 必須引数を満たすためのスタブとして空のステートを使用します&#10;        val navState = rememberNavigationEventState(NavigationEventInfo.None)&#10;        NavigationBackHandler(&#10;            state = navState,&#10;            isBackEnabled = true,&#10;            onBackCancelled = {&#10;                // キャンセルされた戻るジェスチャを処理します&#10;            },&#10;            onBackCompleted = {&#10;              // 完了した戻るジェスチャを処理します&#10;            }&#10;        )&#10;        LaunchedEffect(navState.transitionState) {&#10;            val transitionState = navState.transitionState&#10;            if (transitionState is NavigationEventTransitionState.InProgress) {&#10;                val progress = transitionState.latestEvent.progress&#10;                // 戻るジェスチャの進捗をアニメーション化します&#10;            }&#10;        }"/>
</compare>

ここで：

*   `state`パラメーターは必須です。`NavigationEventInfo`は、UIステートに関するコンテキスト情報を保持するように設計されています。現時点で格納する情報がない場合は、`NavigationEventInfo.None`をスタブとして使用できます。
*   `onBack`パラメーターは`onBackCancelled`と`onBackCompleted`に分割され、キャンセルされたジェスチャを個別に追跡する必要がなくなりました。
*   `NavigationEventState.transitionState`プロパティは、物理的なジェスチャの進行状況を追跡するのに役立ちます。

実装の詳細については、[Navigation Event APIリファレンスのNavigationEventHandlerページ](https://developer.android.com/reference/kotlin/androidx/navigationevent/NavigationEventHandler)を参照してください。

### Webの最小Kotlinバージョンが引き上げられました

プロジェクトにWebターゲットが含まれている場合、最新の機能を使用するにはKotlin 2.2.20へのアップグレードが必要です。

## クロスプラットフォーム

### `@Preview`アノテーションの統合

プレビューに対するアプローチをクロスプラットフォームで統合しました。
これにより、`commonMain`ソースセット内のすべてのターゲットプラットフォームで`androidx.compose.ui.tooling.preview.Preview`アノテーションを使用できるようになりました。

`org.jetbrains.compose.ui.tooling.preview.Preview`やデスクトップ固有の`androidx.compose.desktop.ui.tooling.preview.Preview`など、その他のすべてのアノテーションは非推奨となりました。

### インターロップビューの自動サイズ調整

Compose Multiplatformは、デスクトップとiOSの両方でネイティブのインターロップ要素の自動サイズ調整をサポートするようになりました。
これらの要素は、コンテンツに基づいてレイアウトを調整できるようになり、正確なサイズを手動で計算したり、固定寸法を事前に指定したりする必要がなくなります。

*   デスクトップでは、`SwingPanel`は組み込みコンポーネントの最小サイズ、推奨サイズ、最大サイズに基づいて、自動的にサイズを調整します。
*   iOSでは、UIKitインターロップビューがビューの適合サイズ（固有のコンテンツサイズ）に応じたサイズ調整をサポートするようになりました。これにより、SwiftUIビュー（`UIHostingController`経由）や`NSLayoutConstraints`に依存しない基本的な`UIView`サブクラスの適切なラッピングが可能になります。

### `Popup`および`Dialog`プロパティの安定版

`DialogProperties`内の以下のプロパティ、`usePlatformInsets`、`useSoftwareKeyboardInset`、`scrimColor`は、安定版に昇格し、実験版ではなくなりました。

同様に、`PopupProperties`内の`usePlatformDefaultWidth`および`usePlatformInsets`プロパティも安定版に昇格しました。

`Popup`オーバーロードの非推奨レベルは`ERROR`に変更され、更新されたAPIの使用が強制されるようになりました。

### Skiaがマイルストーン138に更新されました

Compose MultiplatformでSkikoを介して使用されるSkiaのバージョンが、マイルストーン138に更新されました。

以前使用されていたSkiaのバージョンはマイルストーン132でした。
これらのバージョン間で行われた変更は、[リリースノート](https://skia.googlesource.com/skia/+/refs/heads/chrome/m138/RELEASE_NOTES.md)で確認できます。

### Navigation 3のサポート
<primary-label ref="Experimental"/>

Navigation 3は、Composeと連携するように設計された新しいナビゲーションライブラリです。
Navigation 3を使用すると、バックスタックを完全に制御でき、デスティネーションへの移動やデスティネーションからの移動は、リストからのアイテムの追加と削除と同じくらい簡単になります。
新しい指針と決定事項については、[Navigation 3ドキュメント](https://developer.android.com/guide/navigation/navigation-3)や、発表された[ブログ投稿](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)で読むことができます。

Compose Multiplatform 1.10.0-beta01は、Android以外のターゲットで新しいナビゲーションAPIを使用するためのアルファサポートを提供します。
リリースされたマルチプラットフォームアーティファクトは次のとおりです。

*   Navigation 3 UIライブラリ、`org.jetbrains.androidx.navigation3:navigation3-ui`
*   Navigation 3用ViewModel、`org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3`
*   Navigation 3用Material 3アダプティブレイアウト、`org.jetbrains.compose.material3.adaptive:adaptive-navigation3`

マルチプラットフォームNavigation 3実装の例は、オリジナルのAndroidリポジトリからミラーリングされた[nav3-recipes](https://github.com/terrakok/nav3-recipes)サンプルで確認できます。

プラットフォーム固有の実装詳細をいくつか示します。

*   iOSでは、[EndEdgePanGestureBehavior](https://github.com/JetBrains/compose-multiplatform-core/pull/2519)オプション（デフォルトで`Disabled`）を使用して、端の端からの[パンジェスチャ](https://developer.apple.com/documentation/uikit/handling-pan-gestures)によるナビゲーションを管理できるようになりました。
    ここで言う「端の端」とは、LTRインターフェースでは画面の右端を指し、RTLインターフェースでは左端を指します。
    開始端は端の端とは反対で、常に「戻る」ジェスチャに紐付けられています。
*   Webアプリでは、デスクトップブラウザで**Esc**キーを押すと、デスクトップアプリと同様に、ユーザーを前の画面に戻す（およびダイアログ、ポップアップ、Material 3の`SearchBar`のような一部のウィジェットを閉じる）ようになりました。
*   [ブラウザの履歴ナビゲーション](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)とアドレスバーでのデスティネーションの使用のサポートは、Compose Multiplatform 1.10ではNavigation 3に拡張されません。
    これはマルチプラットフォームライブラリの今後のバージョンに延期されました。

## iOS

### ウィンドウインセット

Compose Multiplatformは、ステータスバー、ナビゲーションバー、オンスクリーンキーボードなどのウィンドウインセットに基づいてUI要素を配置およびサイズ設定する機能を提供する`WindowInsetsRulers`をサポートするようになりました。

この新しいウィンドウインセット管理アプローチでは、プラットフォーム固有のウィンドウインセットデータを取得するために単一の実装を使用します。
これは、`WindowInsets`と`WindowInsetsRulers`の両方が、インセットを一貫して管理するための共通メカニズムを使用することを意味します。

> 以前は、`WindowInsets.Companion.captionBar`には`@Composable`属性が付与されていませんでした。プラットフォーム間での動作を合わせるため、`@Composable`属性を追加しました。
> 
{style="note"}

### IME構成の改善

[1.9.0で導入された](whats-new-compose-190.md#ime-options)iOS固有のIMEカスタマイズに続き、このリリースでは`PlatformImeOptions`を使用してテキスト入力ビューを構成するための新しいAPIが追加されました。

これらの新しいAPIにより、フィールドがフォーカスを取得してIMEをトリガーしたときの入力インターフェースのカスタマイズが可能になります。

 * `UIResponder.inputView` は、デフォルトのシステムキーボードを置き換えるカスタム入力ビューを指定します。
 * `UIResponder.inputAccessoryView` は、IMEアクティベーション時にシステムキーボードまたはカスタム`inputView`にアタッチするカスタムアクセサリビューを定義します。

### インターロップビューのオーバーレイ配置
<primary-label ref="Experimental"/>

実験的な`placedAsOverlay`フラグを使用すると、`UIKitView`および`UIKitViewController`ビューをCompose UIの上に配置できるようになりました。
このフラグにより、インターロップビューは透明な背景とネイティブのシェーダーエフェクトをサポートできます。

インターロップビューをオーバーレイとしてレンダリングするには、`@OptIn(ExperimentalComposeUiApi::class)`アノテーションを使用し、`UIKitInteropProperties`で`placedAsOverlay`パラメーターを`true`に設定します。

```kotlin
UIKitViewController(
    modifier = modifier,
    update = {},
    factory = { factory.createNativeMap() },
    properties = UIKitInteropProperties(placedAsOverlay = true)
)
```

この構成はビューをCompose UIレイヤーの上にレンダリングすることに留意してください。結果として、同じ領域にある他のコンポーザブルを視覚的に覆い隠します。

## デスクトップ

### Compose Hot Reloadの統合

Compose Hot Reloadプラグインは、Compose Multiplatform Gradleプラグインにバンドルされるようになりました。
デスクトップをターゲットとするCompose Multiplatformプロジェクトではデフォルトで有効になっているため、Hot Reloadプラグインを別途設定する必要がなくなりました。

Compose Hot Reloadプラグインを明示的に宣言しているプロジェクトに対する影響は以下のとおりです。

 * Compose Multiplatform Gradleプラグインによって提供されるバージョンを使用するため、宣言を安全に削除できます。
 * 特定のバージョン宣言を保持することを選択した場合、バンドルされたバージョンではなく、そのバージョンが使用されます。

バンドルされているCompose Hot Reload Gradleプラグインの最小Kotlinバージョンは2.1.20です。
これより古いKotlinバージョンが検出された場合、ホットリロード機能は無効になります。

## Gradle

### AGP 9.0.0のサポート

Compose Multiplatformは、Android Gradle Plugin (AGP) バージョン9.0.0のサポートを導入します。
新しいAGPバージョンとの互換性を確保するには、Compose Multiplatform 1.9.3または1.10.0にアップグレードしてください。

長期的に更新プロセスをよりスムーズにするために、AGPの使用を専用のAndroidアプリケーションモジュールに分離するようにプロジェクト構造を変更することをお勧めします。