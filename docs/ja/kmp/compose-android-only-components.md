[//]: # (title: Android 専用コンポーネント)

Compose Multiplatform は [Jetpack Compose](https://developer.android.com/jetpack/compose) の上に構築されています。Compose Multiplatform の機能の大部分は、すべてのプラットフォームで利用可能です。しかし、Android ターゲットでしか使用できない API やライブラリもいくつか存在します。これは、それらが Android 固有のものであるか、あるいはまだ他のプラットフォームに移植（ポート）されていないことが理由です。このページでは、これら Compose Multiplatform API の一部をまとめます。

> [Jetpack Compose のドキュメント](https://developer.android.com/jetpack/compose/documentation)やコミュニティによって作成された記事の中で、Android ターゲットでしか使用できない API が見つかることがあります。
> それを `commonMain` コードで使用しようとすると、IDE はその API が利用不可能であることを通知します。
>
{style="note"}

## Android 専用 API

Android 専用 API は Android に特化したものであり、他のプラットフォームでは利用できません。これは、Android が使用する特定の概念が、他のプラットフォームでは必要ないためです。これらの API は通常、`android.*` パッケージのクラスを使用するか、Android 固有の動作を設定します。以下は、Android 専用 API の例です：

* [`android.context.Context`](https://developer.android.com/reference/android/content/Context) クラス
* [`LocalContext`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalContext()) および [`LocalConfiguration`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalConfiguration()) 変数
* [`android.graphics.BitmapFactory`](https://developer.android.com/reference/android/graphics/BitmapFactory) および [`android.graphics.Bitmap`](https://developer.android.com/reference/android/graphics/Bitmap) クラス
* [`ImageBitmap.asAndroidBitmap()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ImageBitmap#(androidx.compose.ui.graphics.ImageBitmap).asAndroidBitmap()) 関数
* [`android.app.Activity`](https://developer.android.com/reference/android/app/Activity) クラス
* [`android.app.Activity.setContent()`](https://developer.android.com/reference/kotlin/androidx/activity/ComponentActivity#(androidx.activity.ComponentActivity).setContent(androidx.compose.runtime.CompositionContext,kotlin.Function0)) 関数
* [`ComposeView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView) クラス
* [`LocalView`](https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary#LocalView()) 変数
* [`Modifier.pointerInteropFilter()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/ui/ui/src/androidMain/kotlin/androidx/compose/ui/input/pointer/PointerInteropFilter.android.kt) 関数
* [Hilt](https://developer.android.com/jetpack/compose/libraries#hilt) 依存関係注入（Dependency Injection）ライブラリ

通常、このような API を共通化する強い理由はないため、`androidMain` のみに留めておくのが最適です。

## シグネチャに Android クラスが含まれる API

Compose Multiplatform の API の中には、シグネチャ（定義）に `android.*` や `androidx.*`（`androidx.compose.*` を除く）を使用しているものの、その動作が他のプラットフォームにも適用可能なものがあります：

* [リソース管理](https://developer.android.com/jetpack/compose/resources): `stringResource`、`animatedVectorResource`、`Font`、およびリソース管理用の `*.R` クラス。
  詳細は、[画像とリソース](compose-multiplatform-resources.md)を参照してください。
* [ナビゲーション](https://developer.android.com/jetpack/compose/navigation)。
  詳細は、[ナビゲーションとルーティング](compose-navigation-routing.md)を参照してください。
* [`ViewModel`](https://developer.android.com/jetpack/compose/libraries#viewmodel) クラス。
* [Paging](https://developer.android.com/jetpack/compose/libraries#paging) ライブラリ。
* [`ConstraintLayout`](https://developer.android.com/reference/androidx/constraintlayout/widget/ConstraintLayout) レイアウト。
* [Maps](https://developer.android.com/jetpack/compose/libraries#maps) ライブラリ。
* [Preview](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/preview/package-summary) ツール、および[デスクトップ](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)アプリケーションをプレビューするためのプラグイン。
* [`WebView`](https://developer.android.com/reference/android/webkit/WebView) クラス。
* Compose Multiplatform にまだ移植されていないその他の Jetpack Compose ライブラリ。

これらは、複雑さや需要に応じて、将来的に `commonMain` へ移植される可能性があります。

権限（パーミッション）、デバイス（Bluetooth、GPS、カメラ）、入出力（ネットワーク、ファイル、データベース）など、アプリケーション開発で頻繁に使用される API は、Compose Multiplatform のスコープ外です。
<!-- 代替ソリューションを見つけるには、[マルチプラットフォームライブラリの検索](search-libs.md)を参照してください。 -->

## シグネチャに Android クラスが含まれない API

シグネチャに `android.*` や `androidx.*` クラスが含まれておらず、API が他のプラットフォームにも適用可能である場合でも、Android ターゲットでのみ利用可能な API があります。この主な理由は、実装がプラットフォーム固有の要素を多く使用しており、他のプラットフォーム向けの実装を作成するのに時間がかかるためです。

通常、このような API は Android ターゲット向けの Jetpack Compose で導入された後、Compose Multiplatform に移植されます。

Compose Multiplatform %org.jetbrains.compose% では、以下の API は `commonMain` で利用可能では**ありません**：

* [`Modifier.imeNestedScroll()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation-layout/src/androidMain/kotlin/androidx/compose/foundation/layout/WindowInsetsConnection.android.kt) 関数
* [`Modifier.systemGestureExclusion()`](https://github.com/androidx/androidx/blob/0e8dd4edd03f6e802303e5325ad11e89292c26c3/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/SystemGestureExclusion.kt) 関数
* [`Modifier.magnifier()`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/Magnifier.kt) 関数
* [`LocalOverscrollConfiguration`](https://github.com/androidx/androidx/blob/41cb7d5c422180edd89efde4076f9dc724d3a313/compose/foundation/foundation/src/androidMain/kotlin/androidx/compose/foundation/OverscrollConfiguration.kt) 変数
* [`AnimatedImageVector.animatedVectorResource` API](https://developer.android.com/jetpack/compose/resources#animated-vector-drawables)
* [material3-adaptive](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive) ライブラリ
* [material3-window-size-class](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) ライブラリ

## Android API の移植リクエスト

Android から移植可能な各 API について、Compose Multiplatform の [YouTrack](https://youtrack.jetbrains.com/issues/CMP) にオープンなイシューが存在します。Android から移植して共通化できると思われる API があり、それに関する既存のイシューがない場合は、[新しく作成](https://youtrack.jetbrains.com/newIssue?project=CMP)してください。