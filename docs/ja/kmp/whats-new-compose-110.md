[//]: # (title: Compose Multiplatform 1.10.0-beta01 の新機能)

このEAP機能リリースでの主なハイライトは以下のとおりです。
 * [`@Preview`アノテーションの統合](#unified-preview-annotation)
 * [Navigation 3のサポート](#support-for-navigation-3)
 * [Compose Hot Reloadのバンドル](#compose-hot-reload-integration)

このリリースの変更点の全リストは[GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.10.0-beta01)で確認できます。

## 依存関係

* Gradleプラグイン `org.jetbrains.compose`、バージョン `1.10.0-beta01`。Jetpack Composeライブラリに基づいています。
    * [Runtime 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.10.0-beta01)
    * [UI 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.10.0-beta01)
    * [Foundation 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.10.0-beta01)
    * [Material 1.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/compose-material#1.10.0-beta01)
    * [Material3 1.4.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.4.0)

* Compose Material3ライブラリ `org.jetbrains.compose.material3:material3*:1.10.0-alpha04`。[Jetpack Compose Material3 1.5.0-alpha07](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.5.0-alpha07)に基づいています。

  [エクスプレッシブテーマ](whats-new-compose-190.md#material-3-expressive-theme)を使用するには、Material 3の実験的バージョンを含めます。
    ```kotlin
    implementation("org.jetbrains.compose.material3:material3:1.9.0-alpha04")
    ```
* Compose Material3 Adaptiveライブラリ `org.jetbrains.compose.material3.adaptive:adaptive*:1.3.0-alpha01`。[Jetpack Compose Material3 Adaptive 1.3.0-alpha02](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.3.0-alpha02)に基づいています。
* Lifecycleライブラリ `org.jetbrains.androidx.lifecycle:lifecycle-*:2.10.0-alpha04`。[Jetpack Lifecycle 2.10.0-beta01](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.10.0-beta01)に基づいています。
* Navigationライブラリ `org.jetbrains.androidx.navigation:navigation-*:2.9.1`。[Jetpack Navigation 2.9.4](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.4)に基づいています。
* Navigation 3ライブラリ `org.jetbrains.androidx.navigation:navigation3-*:1.0.0-alpha04`。[Jetpack Navigation 3](https://developer.android.com/jetpack/androidx/releases/navigation3#1.0.0-beta01)に基づいています。
* Navigation Eventライブラリ `org.jetbrains.androidx.navigationevent:navigationevent-compose:1.0.0-beta01`。[Jetpack Navigation Event 1.0.0-beta01](https://developer.android.com/jetpack/androidx/releases/navigationevent#1.0.0-beta01)に基づいています。
* Savedstateライブラリ `org.jetbrains.androidx.savedstate:savedstate*:1.4.0-beta01`。[Jetpack Savedstate 1.4.0-rc01](https://developer.android.com/jetpack/androidx/releases/savedstate#1.4.0-rc01)に基づいています。
* WindowManager Coreライブラリ `org.jetbrains.androidx.window:window-core:1.5.0-rc01`。[Jetpack WindowManager 1.5.0](https://developer.android.com/jetpack/androidx/releases/window#1.5.0)に基づいています。

## クロスプラットフォーム

### `@Preview`アノテーションの統合

プレビューに対するアプローチをクロスプラットフォームで統合しました。
これにより、`commonMain`ソースセット内のすべてのターゲットプラットフォームで`androidx.compose.ui.tooling.preview.Preview`アノテーションを使用できるようになりました。

`org.jetbrains.compose.ui.tooling.preview.Preview`やデスクトップ固有の`androidx.compose.desktop.ui.tooling.preview.Preview`など、その他のすべてのアノテーションは非推奨となりました。

### Navigation 3のサポート

Navigation 3は、Composeと連携するように設計された新しいナビゲーションライブラリです。
Navigation 3を使用すると、バックスタックを完全に制御でき、デスティネーションへの移動やデスティネーションからの移動は、リストからのアイテムの追加と削除と同じくらい簡単になります。
新しい指針と決定事項については、[Navigation 3ドキュメント](https://developer.android.com/guide/navigation/navigation-3)や、発表された[ブログ投稿](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)で読むことができます。

Compose Multiplatform 1.10.0-beta01は、Android以外のターゲットで新しいナビゲーションAPIを使用するためのアルファサポートを提供します。
リリースされたマルチプラットフォームアーティファクトは次のとおりです。

* Navigation 3 UIライブラリ、`org.jetbrains.androidx.navigation3:navigation3-ui`
* Navigation 3用ViewModel、`org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3`
* Navigation 3用Material 3アダプティブレイアウト、`org.jetbrains.compose.material3.adaptive:adaptive-navigation3`

マルチプラットフォームNavigation 3実装の例は、オリジナルのAndroidリポジトリからミラーリングされた[nav3-recipes](https://github.com/terrakok/nav3-recipes)サンプルで確認できます。

プラットフォーム固有の実装詳細をいくつか示します。

* iOSでは、[EndEdgePanGestureBehavior](https://github.com/JetBrains/compose-multiplatform-core/pull/2519)オプション（デフォルトで`Disabled`）を使用して、端の端からの[パンジェスチャ](https://developer.apple.com/documentation/uikit/handling-pan-gestures)によるナビゲーションを管理できるようになりました。
  ここで言う「端の端」とは、LTRインターフェースでは画面の右端を指し、RTLインターフェースでは左端を指します。
  開始端は端の端とは反対で、常に「戻る」ジェスチャに紐付けられています。
* Webアプリでは、デスクトップブラウザで**Esc**キーを押すと、デスクトップアプリと同様に、ユーザーを前の画面に戻す（およびダイアログ、ポップアップ、Material 3の`SearchBar`のような一部のウィジェットを閉じる）ようになりました。
* [ブラウザの履歴ナビゲーション](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)とアドレスバーでのデスティネーションの使用のサポートは、Compose Multiplatform 1.10ではNavigation 3に拡張されません。
  これはマルチプラットフォームライブラリの今後のバージョンに延期されました。

### Skiaがマイルストーン138に更新されました

Compose MultiplatformでSkikoを介して使用されるSkiaのバージョンが、マイルストーン138に更新されました。

以前使用されていたSkiaのバージョンはマイルストーン132でした。
これらのバージョン間で行われた変更は、[リリースノート](https://skia.googlesource.com/skia/+/refs/heads/chrome/m138/RELEASE_NOTES.md)で確認できます。

## iOS

### ウィンドウインセット

Compose Multiplatformは、ステータスバー、ナビゲーションバー、オンスクリーンキーボードなどのウィンドウインセットに基づいてUI要素を配置およびサイズ設定する機能を提供する`WindowInsetsRulers`をサポートするようになりました。

この新しいウィンドウインセット管理アプローチでは、プラットフォーム固有のウィンドウインセットデータを取得するために単一の実装を使用します。
これは、`WindowInsets`と`WindowInsetsRulers`の両方が、インセットを一貫して管理するための共通メカニズムを使用することを意味します。
したがって、`LocalLayoutMargins`、`LocalSafeArea`、`LocalKeyboardOverlapHeight`、`LocalInterfaceOrientation`などのプラットフォーム固有のローカルは、新しい統合APIに置き換えられました。

>以前は、`WindowInsets.Companion.captionBar`には`@Composable`属性が付与されていませんでした。プラットフォーム間での動作を合わせるため、`@Composable`属性を追加しました。
>
{style="note"}

### IME構成の改善

1.9.0で導入されたiOS固有のIMEカスタマイズに続き、このリリースでは`PlatformImeOptions`を使用してテキスト入力ビューを構成するための新しいAPIが追加されました。

これらの新しいAPIにより、フィールドがフォーカスを取得してIMEをトリガーしたときの入力インターフェースのカスタマイズが可能になります。

 * `UIResponder.inputView` は、デフォルトのシステムキーボードを置き換えるカスタム入力ビューを指定します。
 * `UIResponder.inputAccessoryView` は、IMEアクティベーション時にシステムキーボードまたはカスタム`inputView`にアタッチするカスタムアクセサリビューを定義します。

## デスクトップ

### Compose Hot Reloadの統合

Compose Hot Reloadプラグインが、Compose Multiplatform Gradleプラグインにバンドルされるようになりました。
デスクトップをターゲットとするCompose Multiplatformプロジェクトではデフォルトで有効になっているため、Hot Reloadプラグインを別途設定する必要がなくなりました。

Compose Hot Reloadプラグインを明示的に宣言しているプロジェクトに対する影響は以下のとおりです。

 * Compose Multiplatform Gradleプラグインによって提供されるバージョンを使用するため、宣言を安全に削除できます。
 * 特定のバージョン宣言を保持することを選択した場合、バンドルされたバージョンではなく、そのバージョンが使用されます。

> バンドルされているCompose Hot Reload Gradleプラグインは、Compose Multiplatformプロジェクトに必要なKotlinバージョンを2.1.20に引き上げます。
>
{style="warning"}

### `SwingPanel`の自動サイズ調整

`SwingPanel`は、コンテンツの最小サイズ、推奨サイズ、最大サイズに基づいて、自動的にサイズを調整するようになりました。
これにより、正確なサイズを計算したり、事前に固定寸法を指定したりする必要がなくなります。

```kotlin
val label = JLabel("Hello Swing!")

singleWindowApplication {
    SwingPanel(factory = { label })

    LaunchedEffect(Unit) {
        delay(500)
        // Grows the text
        repeat(2) { 
            label.text = "#${label.text}#"
            delay(200)
        }
        // Shrinks the text
        repeat(2) { 
            label.text = label.text.substring(1, label.text.length - 1)
            delay(200)
        }
    }
}
```

## Gradle

### 非推奨の依存関係エイリアス

Compose Multiplatform Gradleプラグインによってサポートされている依存関係エイリアス（`compose.ui`など）は、1.10.0-beta01リリースで非推奨となりました。
バージョンカタログに直接ライブラリ参照を追加することを推奨します。
具体的な参照は、対応する非推奨通知で提案されています。

この変更により、Compose Multiplatformライブラリの依存関係管理がもう少し透過的になるはずです。
将来的には、互換性のあるバージョンの設定を簡素化するために、Compose Multiplatform用のBOMを提供したいと考えています。

### AGP 9.0.0のサポート

Compose Multiplatformは、Android Gradle Plugin (AGP) バージョン9.0.0のサポートを導入します。
新しいAGPバージョンとの互換性を確保するには、Compose Multiplatform 1.9.3または1.10.0にアップグレードしてください。

長期的に更新プロセスをよりスムーズにするために、AGPの使用を専用のAndroidモジュールに分離するようにプロジェクト構造を変更することをお勧めします。