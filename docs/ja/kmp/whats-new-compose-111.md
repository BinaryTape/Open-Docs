[//]: # (title: Compose Multiplatform 1.11.1 の新機能)

この機能リリースの主なハイライトは以下の通りです：

* [ネイティブ iOS テキスト入力](#native-text-input)
* [Compose UI テスト API の v2 バージョン](#compose-ui-tests-v2)
* [Web ターゲットにおけるスクロールの改善](#scroll-on-web-targets-brought-in-line-with-native-ui)

変更点の完全なリストは [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.11.0) で確認できます。
このリリースの特定のコンポーネントバージョンは、[依存関係](#dependencies) セクションに記載されています。

## 破壊的変更および非推奨化

### Android 以外のターゲット向け Shader ラッパー

Android 以外のターゲットにおいて、`Shader` 型が `org.jetbrains.skia.Shader` の `actual typealias` から、Compose 固有のラッパークラスへとリファクタリングされました。この変更により、共通 API が Skia/Skiko への直接的な依存から切り離されます。

移行手順：

* Compose API で Skia/Skiko シェーダーを使用するには、`SkShader.asComposeShader()` を使用してラップします。
* Compose の `Shader` から低レベルの Skia 型にアクセスするには、拡張プロパティ `Shader.skiaShader` を使用します。
* `Shader` API に依存するサードパーティライブラリを使用している場合は、それらをより新しい互換バージョンのものに更新してください。

### Kotlin の最小バージョンの引き上げ

プロジェクトに native または web ターゲットが含まれている場合、最新の機能を利用するには Kotlin 2.3.10 へのアップグレードが必要です。

### iOS ターゲット의 サポートに関する変更

Compose Multiplatform は、Kotlin で非推奨となった Apple x86_64 ターゲットのサポートを終了しました。これに伴い、`iosX64` および `macosX64` ターゲットはすべてのモジュールから完全に削除されました。

また、サポートされる iOS の最小バージョンを 13.0 から 14.0 に引き上げました。

### 非推奨化

* Compose Multiplatform 1.9.0 において、HTML 要素を Web アプリケーションにシームレスに統合するための [`WebElementView`](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html#new-api-for-embedding-html-content) コンポーザブルを[導入しました](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html#new-api-for-embedding-html-content)。検討の結果、この名称がやや不明瞭であったため、HTML 専用の目的をより適切に反映するように `HtmlElementView` へと名称変更されました。`WebElementView` バージョンは `HtmlElementView` に代わり非推奨となりました。
* `Key.Home` は、マッピングが正しくなかったため非推奨となりました。キーボードナビゲーションには `Key.MoveHome` を、システムレベルのアクションには `Key.SystemHome` を使用してください。

## プラットフォーム共通

### Compose UI テスト v2

Compose Multiplatform は、Android 以外のターゲットにおいて [v2 `ComposeUiTest` API](https://developer.android.com/develop/ui/compose/testing/migrate-v2) のサポートを導入しました。これらの新しい API では、デフォルトのテストディスパッチャーとして `UnconfinedTestDispatcher` の代わりに `StandardTestDispatcher` を使用します。この変更により、コルーチンがイベントキューに基づいて順番に実行されるようになり、テストの信頼性が向上し、本番環境の動作との整合性が高まります。

また、Compose UI テスト v2 において `effectContext` パラメーターのサポートも追加されました。このパラメーターを使用すると、コンポジションの実行時にカスタムのコルーチンコンテキストを指定できます。

以前提供されていた `runComposeUiTest`、`runSkikoComposeUiTest`、`runDesktopComposeUiTest` などのテスト API は、v2 バージョンへの移行に伴い非推奨となりました。

### Skia を Milestone 144 にアップデート

Skiko を通じて Compose Multiplatform で使用されている Skia のバージョンが Milestone 144 にアップデートされました。

以前使用されていた Skia のバージョンは Milestone 138 でした。
これらのバージョン間で行われた変更については、[リリースノート](https://skia.googlesource.com/skia/+/refs/heads/chrome/m144/RELEASE_NOTES.md)で確認できます。

## iOS

### ネイティブテキスト入力
<primary-label ref="Experimental"/>

Compose Multiplatform は、ネイティブの iOS `UIView` を使用して、`UITextInput` および `UIKeyInput` プロトコル経由で入力を管理する新しいテキスト入力実装を導入しました。これにより、正確なキャレット移動、ネイティブジェスチャー、ネイティブの選択処理、および `Autofill`（オートフィル）、`Translate`（翻訳）、`Search`（検索）などの項目を含むシステムコンテキストメニューなど、完全にネイティブな iOS のテキスト編集動作が可能になります。この新しいアプローチは、ネイティブ iOS の外観と操作感（Look and Feel）に合わせると同時に、将来の Apple のアップデートとの互換性も向上させます。

既存の Compose Multiplatform テキスト入力は、プラットフォーム間の一貫性を保つための安定した選択肢として残りますが、このネイティブアプローチは iOS に特化したユーザーエクスペリエンスに焦点を当てています。

新しいテキスト入力を有効にするには、iOS ソースセットで `usingNativeTextInput` オプションを使用します。

```kotlin
@ExperimentalComposeUiApi
BasicTextField(
    value = state,
    keyboardOptions = KeyboardOptions(
        platformImeOptions = PlatformImeOptions {
            usingNativeTextInput(true)
        }
    )
)
```

新しいネイティブテキスト入力は `BasicTextField(TextFieldValue)` と `BasicTextField(TextFieldState)` の両方の API をサポートしており、`isNewContextMenuEnabled` フラグを介して有効化される新しいコンテキストメニュー API とも互換性があります。

### コンカレントレンダリングがデフォルトで有効に

Compose Multiplatform 1.8.0 において、レンダリングタスクを専用のレンダースレッドにオフロードする機能を、オプトインの実験的機能として[導入しました](whats-new-compose-180.md#opt-in-concurrent-rendering)。

Compose Multiplatform 1.11.0 より、コンカレントレンダリングがデフォルトで有効になります。

## Web

### Web ターゲットでのスクロールがネイティブ UI と同等に

Compose Multiplatform において、Web 上のスクロールパフォーマンスはネイティブ UI に比べて遅れていました。1.11.0 リリースでは、タッチ処理において多くのリファクタリングと修正が行われ、Compose Web アプリのスクロールが他の利用可能なターゲットと同等の水準になりました。これらの改善の効果は、[KotlinConf アプリの最新 Web バージョン](https://jetbrains.github.io/kotlinconf-app/)で確認できます。

この作業の一環として、[Web 上での Coil 画像デコードも改善されました](https://github.com/coil-kt/coil/pull/3305)。Coil を使用している場合は、最高の体験を得るためにバージョン 3.4.0 に更新してください。

修正のリスト、および改善に関する説明とデモは、イシュー [CMP-9727](https://youtrack.jetbrains.com/issue/CMP-9727) で入手可能です。

## 依存関係

| ライブラリ | Maven 座標 | ベースとなる Jetpack バージョン |
|--------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Runtime            | `org.jetbrains.compose.runtime:runtime*:1.11.1`                        | [Runtime 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.11.2)                                     |
| UI                 | `org.jetbrains.compose.ui:ui*:1.11.1`                                  | [UI 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.11.2)                                               |
| Foundation         | `org.jetbrains.compose.foundation:foundation*:1.11.1`                  | [Foundation 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.11.2)                               |
| Material           | `org.jetbrains.compose.material:material*:1.11.1`                      | [Material 1.11.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.11.2)                                   |
| Material3          | `org.jetbrains.compose.material3:material3*:1.11.0-alpha07`            | [Material3 1.5.0-alpha17](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha17)                   |
| Material3 Adaptive | `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha07`     | [Material3 Adaptive 1.3.0-alpha10](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha10) |
| Lifecycle          | `org.jetbrains.androidx.lifecycle:lifecycle-*:2.11.0-beta01`           | [Lifecycle 2.11.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.11.0-beta01)                           |
| Navigation         | `org.jetbrains.androidx.navigation:navigation-*:2.9.2`                 | [Navigation 2.9.7](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.7)                                         |
| Navigation3        | `org.jetbrains.androidx.navigation3:navigation3-*:1.1.2`               | [Navigation3 1.1.2](https://developer.android.com/jetpack/androidx/releases/navigation3#1.1.2)                                       |
| Navigation Event   | `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.1.1` | [Navigation Event 1.1.1](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.1.1)                              |
| Savedstate         | `org.jetbrains.androidx.savedstate:savedstate*:1.4.0`                  | [Savedstate 1.4.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0)                                         |
| WindowManager Core | `org.jetbrains.androidx.window:window-core:1.5.1`                      | [WindowManager 1.5.1](https://developer.android.com/jetpack/androidx/releases/window#1.5.1)                                          |