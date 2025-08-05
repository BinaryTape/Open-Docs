# アダプティブレイアウト

あらゆる種類のデバイスで一貫したユーザーエクスペリエンスを提供するために、アプリのUIをさまざまなディスプレイサイズ、向き、入力モードに適応させます。

## アダプティブレイアウトの設計

アダプティブレイアウトを設計する際は、以下の主要なガイドラインに従ってください。

*   [カノニカルレイアウト](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)のパターン（リスト/詳細、フィード、補助ペインなど）を推奨します。
*   パディング、タイポグラフィ、その他のデザイン要素に共通のスタイルを再利用して、一貫性を維持します。プラットフォーム固有のガイドラインに従いながら、デバイス間でナビゲーションパターンの一貫性を保ちます。
*   複雑なレイアウトを再利用可能なコンポーザブルに分割し、柔軟性とモジュール性を高めます。
*   画面密度と向きを調整します。

## ウィンドウサイズクラスの使用

ウィンドウサイズクラスは、ブレークポイントとも呼ばれる事前定義されたしきい値であり、さまざまな画面サイズを分類して、アダプティブレイアウトの設計、開発、テストに役立ちます。

ウィンドウサイズクラスは、アプリで利用可能な表示領域を、幅と高さの両方について compact (コンパクト)、medium (ミディアム)、expanded (展開) の3つのカテゴリに分類します。レイアウトを変更する際は、すべてのウィンドウサイズ、特に異なるブレークポイントのしきい値でレイアウトの動作をテストしてください。

`WindowSizeClass` クラスを使用するには、モジュールの `build.gradle.kts` ファイルで `material3.adaptive` 依存関係を共通ソースセットに追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` API を使用すると、利用可能な表示スペースに基づいてアプリのレイアウトを変更できます。たとえば、ウィンドウの高さに応じてトップアプリバーの表示を管理できます。

```kotlin
@Composable
fun MyApp(
    windowSizeClass: WindowSizeClass = currentWindowAdaptiveInfo().windowSizeClass
) {
    // トップアプリバーを表示するかどうかを決定します
    val showTopAppBar = windowSizeClass.isHeightAtLeastBreakpoint(WindowSizeClass.HEIGHT_DP_MEDIUM_LOWER_BOUND)

    // バーの表示状態を使用してUIを定義します
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

## 次へ

アダプティブレイアウトの詳細については、[Jetpack Compose ドキュメント](https://developer.android.com/develop/ui/compose/layouts/adaptive)を参照してください。