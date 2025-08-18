[//]: # (title: Android 専用コンポーネント)

Compose Multiplatformは、[Jetpack Compose](https://developer.android.com/jetpack/compose)を基盤としています。Compose Multiplatformの機能のほとんどは、すべてのプラットフォームで利用可能です。しかし、Androidターゲットでのみ使用できるAPIやライブラリがいくつか存在します。これは、それらがAndroidに固有であるか、まだ他のプラットフォームに移植されていないためです。このページでは、Compose Multiplatform APIのこれらの部分を要約します。

> 時々、[Jetpack Composeドキュメント](https://developer.android.com/jetpack/compose/documentation)やコミュニティが作成した記事で、Androidターゲットでのみ使用できるAPIを見かけるかもしれません。
> `commonMain`コードでそれを使用しようとすると、IDEがこのAPIは利用できないと通知します。
>
{style="note"}

## Android 専用API

Android専用APIはAndroidに固有のものであり、他のプラットフォームでは利用できません。これは、他のプラットフォームがAndroidで使用される特定の概念を必要としないためです。このAPIは通常、`android.*`パッケージのクラスを使用するか、Android固有の動作を設定します。以下に、Android専用APIの一部例を挙げます。

*   [`android.context.Context`](https://developer.android.com/reference/android/content/Context) クラス
*   [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext())および[`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 変数
*   [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory)および[`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) クラス
*   [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 関数
*   [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) クラス
*   [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 関数
*   [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) クラス
*   [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 変数
*   [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 関数
*   [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 依存性注入ライブラリ

通常、このようなAPIの一部を共通化する強力な理由はないため、`androidMain`のみに留めるのが最善です。

## シグネチャにAndroidクラスを含むAPI

Compose MultiplatformのAPIには、シグネチャに`android.*`や`androidx.*`（`androidx.compose.*`を除く）を使用しているものの、その動作が他のプラットフォームにも適用可能な部分があります。

*   [リソース管理](https://developer.android.com/jetpack/compose/resources): `stringResource`、`animatedVectorResource`、`Font`、およびリソース管理用の`*.R`クラス。
    詳細については、[画像とリソース](compose-multiplatform-resources.md)を参照してください。
*   [ナビゲーション](https://developer.android.com/jetpack/compose/navigation)。
    詳細については、[ナビゲーションとルーティング](compose-navigation-routing.md)を参照してください。
*   [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) クラス。
*   [Paging](https://developer.android.com/jetpack/compose/libraries#paging) ライブラリ。
*   [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) レイアウト。
*   [Maps](https://developer.android.com/jetpack/compose/libraries#maps) ライブラリ。
*   [Preview](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary)ツールと、[デスクトップ](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)アプリケーションをプレビューするためのプラグイン。
*   [`WebView`](https://developer.android.com/reference/android/webkit/WebView) クラス。
*   Compose Multiplatformにまだ移植されていない他のJetpack Composeライブラリ。

それらは将来、複雑さと需要に応じて`commonMain`に移植される可能性があります。

パーミッション、デバイス（Bluetooth、GPS、カメラ）、IO（ネットワーク、ファイル、データベース）など、アプリケーション開発時に頻繁に使用されるAPIは、Compose Multiplatformのスコープ外です。
<!-- To find alternative solutions, see [Search for Multiplatform libraries](search-libs.md) -->

## シグネチャにAndroidクラスを含まないAPI

APIの一部には、そのシグネチャに`android.*`や`androidx.*`クラスが含まれておらず、他のプラットフォームにも適用可能であるにもかかわらず、Androidターゲットでのみ利用できるものがあります。その理由は通常、実装が多くのプラットフォーム固有の要素を使用しており、他のプラットフォーム向けに別の実装を記述するのに時間がかかるためです。

通常、このようなAPIの一部は、Androidターゲット向けのJetpack Composeで導入された後、Compose Multiplatformに移植されます。

Compose Multiplatform %org.jetbrains.compose%では、以下のAPIは`commonMain`では**利用できません**。

*   [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 関数
*   [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 関数
*   [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 関数
*   [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 変数
*   [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
*   [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) ライブラリ
*   [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) ライブラリ

## Android APIの移植リクエスト

Androidから移植可能な各APIについて、Compose Multiplatform YouTrackに[未解決のissue](https://youtrack.jetbrains.com/issues/CMP)があります。あるAPIがAndroidから移植され共通化できると思われる場合、それに対する既存のissueがない場合は、[新規作成](https://youtrack.jetbrains.com/newIssue?project=CMP)してください。