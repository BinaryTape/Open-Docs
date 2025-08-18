# アダプティブレイアウト

すべての種類のデバイスで一貫したユーザーエクスペリエンスを提供するために、アプリのUIを異なる表示サイズ、向き、入力モードに適応させます。

## アダプティブレイアウトの設計

アダプティブレイアウトを設計する際は、以下の主要なガイドラインに従ってください。

*   リスト-詳細、フィード、サポーティングペインといった[カノニカルレイアウト](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)のパターンを優先します。
*   パディング、タイポグラフィ、その他のデザイン要素に共通のスタイルを再利用することで一貫性を保ちます。プラットフォーム固有のガイドラインに従いつつ、デバイス間でナビゲーションパターンの一貫性を維持します。
*   複雑なレイアウトを再利用可能なComposableに分割し、柔軟性とモジュール性を高めます。
*   画面密度と向きを調整します。

## ウィンドウサイズクラスの使用

ウィンドウサイズクラスは、アダプティブレイアウトの設計、開発、テストを支援するために、異なる画面サイズを分類する事前定義されたしきい値であり、ブレークポイントとも呼ばれます。

ウィンドウサイズクラスは、アプリが利用できる表示領域を、幅と高さの両方でコンパクト、ミディアム、展開の3つのカテゴリに分類します。レイアウトを変更する際は、特に異なるブレークポイントのしきい値で、すべてのウィンドウサイズでのレイアウト動作をテストしてください。

`WindowSizeClass` クラスを使用するには、モジュールの `build.gradle.kts` ファイルにある共通ソースセットに `material3.adaptive` の依存関係を追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API を使用すると、利用可能な表示スペースに基づいてアプリのレイアウトを変更できます。たとえば、ウィンドウの高さに応じてトップアプリバーの可視性を管理できます。

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // トップアプリバーを表示するかどうかを決定します
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // バーの可視性を使用してUIを定義します
    MyScreen(
        showTopAppBar = showTopAppBar,
        /* ... */
    )
}
```

<!--- waiting for a page about @Preview and hot reload
## Previewing layouts

We have three different @Preview:

* Android-specific, for `androidMain`, from Android Studio.
* Separate desktop annotation plugin with our own implementation (only for desktop source set) + uiTooling plugin.
* Common annotation, also supported in Android Studio, works for Android only but from common code.
-->

## 次にすること

アダプティブレイアウトについては、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/layouts/adaptive)で詳細を確認してください。