# アダプティブレイアウト

すべてのタイプのデバイスで一貫したユーザー体験を提供するため、アプリのUIをさまざまな表示サイズ、向き、入力モードに適応させます。

## アダプティブレイアウトの設計

アダプティブレイアウトを設計する際は、以下の主要なガイドラインに従ってください。

* リスト/詳細（list-detail）、フィード（feed）、補助ペイン（supporting pane）などの[標準的なレイアウト (canonical layouts)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) パターンを優先的に使用します。
* パディング、タイポグラフィ、その他のデザイン要素に共通のスタイルを再利用して、一貫性を維持します。プラットフォーム固有のガイドラインに従いつつ、デバイス間でナビゲーションパターンの一貫性を保ちます。
* 柔軟性とモジュール性を高めるために、複雑なレイアウトを再利用可能なコンポーザブル（composables）に分割します。
* 画面密度や向きに合わせて調整します。

## ウィンドウサイズクラスの使用

ウィンドウサイズクラス（Window size classes）は、定義済みのしきい値（ブレークポイントとも呼ばれます）であり、画面サイズを分類して、アダプティブレイアウトの設計、開発、テストを支援します。

ウィンドウサイズクラスは、アプリで利用可能な表示領域を、幅と高さの両方について「コンパクト（compact）」、「ミディアム（medium）」、「拡張（expanded）」の3つのカテゴリに分類します。レイアウトを変更する際は、すべてのウィンドウサイズ、特に各ブレークポイントのしきい値でレイアウトの動作をテストしてください。

`WindowSizeClass` クラスを使用するには、モジュールの `build.gradle.kts` ファイル内の共通ソースセット（common source set）に `material3.adaptive` 依存関係を追加します。

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:%org.jetbrains.compose.material3.adaptive%")
}
```

`WindowSizeClass` APIを使用すると、利用可能な表示スペースに基づいてアプリのレイアウトを変更できます。たとえば、ウィンドウの高さに応じてトップアプリバーの表示/非表示を管理できます。

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

<!--- @Preview とホットリロードに関するページを待機中
## レイアウトのプレビュー

3つの異なる @Preview があります：

* Android固有。Android Studioから androidMain 用。
* 独自のライブラリ（デスクトップソースセットのみ）と uiTooling プラグインを備えた、独立したデスクトップ用アノテーションプラグイン。
* 共通アノテーション。Android Studioでもサポートされており、共通コードからAndroidでのみ動作します。
-->

## 次のステップ

アダプティブレイアウトの詳細については、[Jetpack Compose のドキュメント](https://developer.android.com/develop/ui/compose/layouts/adaptive) を参照してください。