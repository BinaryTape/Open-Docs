[//]: # (title: Compose MultiplatformにおけるNavigation 3)
<primary-label ref="alpha"/>

[AndroidのNavigationライブラリ](https://developer.android.com/guide/navigation)がNavigation 3にアップグレードされました。これは、Composeと連携し、以前のライブラリバージョンへのフィードバックを考慮した、再設計されたナビゲーションアプローチを導入しています。バージョン1.10以降、Compose Multiplatformは、サポートされているすべてのプラットフォーム（Android、iOS、デスクトップ、ウェブ）のマルチプラットフォームプロジェクトでNavigation 3の採用をサポートしています。

## 主な変更点

Navigation 3は単なるライブラリの新バージョンではなく、多くの点でまったく新しいライブラリと言えます。この再設計の背景にある哲学については、[Android Developersブログ投稿](https://android-developers.googleblog.com/2025/05/announcing-jetpack-navigation-3-for-compose.html)をご覧ください。

Navigation 3の主な変更点は次のとおりです。

*   **ユーザーが所有するバックスタック**。単一のライブラリバックスタックを操作する代わりに、UIが直接監視する状態の`SnapshotStateList`を作成および管理します。
*   **低レベルのビルディングブロック**。Composeとの密接な統合により、このライブラリは独自のナビゲーションコンポーネントと動作を実装する上での柔軟性を高めます。
*   **アダプティブレイアウトシステム**。アダプティブデザインにより、複数のデスティネーションを同時に表示し、レイアウト間をシームレスに切り替えることができます。

Navigation 3の一般的な設計については、[Androidドキュメント](https://developer.android.com/guide/navigation/navigation-3)で詳細をご覧ください。

## 依存関係のセットアップ

Navigation 3のマルチプラットフォーム実装を試すには、以下の依存関係をバージョンカタログに追加します。

```text
[versions]
multiplatform-nav3-ui = "1.0.0-alpha05"

[libraries]
jetbrains-navigation3-ui = { module = "org.jetbrains.androidx.navigation3:navigation3-ui", version.ref = "multiplatform-nav3-ui" }
```

> Navigation 3は`navigation3:navigation3-ui`と`navigation3:navigation3-common`の2つのアーティファクトとしてリリースされていますが、`navigation-ui`のみが個別のCompose Multiplatform実装を必要とします。`navigation3-common`への依存関係は推移的に追加されます。
>
{style="note"}

Material 3 AdaptiveおよびViewModelライブラリを使用するプロジェクトでは、以下のナビゲーションサポートアーティファクトも追加してください。
```text
[versions]
compose-multiplatform-adaptive = "1.3.0-alpha02"
compose-multiplatform-lifecycle = "2.10.0-alpha05"

[libraries]
jetbrains-material3-adaptiveNavigation3 = { module = "org.jetbrains.compose.material3.adaptive:adaptive-navigation3", version.ref = "compose-multiplatform-adaptive" }
jetbrains-lifecycle-viewmodelNavigation3 = { module = "org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-navigation3", version.ref = "compose-multiplatform-lifecycle" }
```

最後に、JetBrainsのエンジニアによって作成された[概念実証ライブラリ](https://github.com/terrakok/navigation3-browser)を試すことができます。このライブラリは、マルチプラットフォームのNavigation 3をウェブのブラウザ履歴ナビゲーションと統合します。

```text
[versions]
compose-multiplatform-navigation3-browser = "0.2.0"

[libraries]
navigation3-browser = { module = "com.github.terrakok:navigation3-browser", version.ref = "compose-multiplatform-navigation3-browser" }
```

ブラウザ履歴ナビゲーションは、ベースのマルチプラットフォームNavigation 3ライブラリのバージョン1.1.0でサポートされる予定です。

## マルチプラットフォームサポート

Navigation 3はComposeと密接に連携しており、Androidのナビゲーション実装が最小限の変更で共通のCompose Multiplatformコードで動作するようにします。ウェブやiOSのような非JVMプラットフォームをサポートするために必要な唯一のことは、[デスティネーションキーのポリモーフィックシリアル化](#polymorphic-serialization-for-destination-keys)を実装することです。

Navigation 3を使用するAndroid専用アプリとマルチプラットフォームアプリの広範な例をGitHubで比較できます。
*   [Navigation 3のレシピを含むオリジナルのAndroidリポジトリ](https://github.com/android/nav3-recipes)
*   [ほとんど同じレシピを含むCompose Multiplatformプロジェクト](https://github.com/terrakok/nav3-recipes)

### デスティネーションキーのポリモーフィックシリアル化

Androidでは、Navigation 3はリフレクションベースのシリアル化に依存しますが、これはiOSのような非JVMプラットフォームをターゲットにする場合には利用できません。これを考慮して、ライブラリには`rememberNavBackStack()`関数に2つのオーバーロードがあります。

*   [最初のオーバーロード](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(kotlin.Array))は`NavKey`参照のセットのみを受け取り、リフレクションベースのシリアライザーを必要とします。
*   [2番目のオーバーロード](https://developer.android.com/reference/kotlin/androidx/navigation3/runtime/package-summary#rememberNavBackStack(androidx.savedstate.serialization.SavedStateConfiguration,kotlin.Array))は`SavedStateConfiguration`パラメータも受け取ります。これにより、`SerializersModule`を提供し、すべてのプラットフォームでオープンなポリモーフィズムを正しく処理できます。

Navigation 3のマルチプラットフォームの例では、ポリモーフィックシリアル化は[このようになります](https://github.com/terrakok/nav3-recipes/blob/8ff455499877225b638d5fcd82b232834f819422/sharedUI/src/commonMain/kotlin/com/example/nav3recipes/basicdsl/BasicDslActivity.kt#L40)。

```kotlin
@Serializable
private data object RouteA : NavKey

@Serializable
private data class RouteB(val id: String) : NavKey

// オープンなポリモーフィズムに必要なシリアル化設定を作成する
private val config = SavedStateConfiguration {
    serializersModule = SerializersModule {
        polymorphic(NavKey::class) {
            subclass(RouteA::class, RouteA.serializer())
            subclass(RouteB::class, RouteB.serializer())
        }
    }
}

@Composable
fun BasicDslActivity() {
    // シリアル化設定を消費する
    val backStack = rememberNavBackStack(config, RouteA)

    NavDisplay(
        backStack = backStack,
        //...
    )
}
```

## 次のステップ

Navigation 3はAndroid Developerポータルで詳細に解説されています。一部のドキュメントではAndroid固有の例を使用していますが、核となる概念とナビゲーションの原則はすべてのプラットフォームで一貫しています。

*   状態管理、ナビゲーションコードのモジュール化、アニメーションに関するアドバイスを含む[Navigation 3の概要](https://developer.android.com/guide/navigation/navigation-3)。
*   [Navigation 2からNavigation 3への移行](https://developer.android.com/guide/navigation/navigation-3/migration-guide)。Navigation 3は既存のライブラリの新バージョンと見るよりも、新しいライブラリと見る方が容易であるため、移行というよりも書き直しに近いです。しかし、このガイドでは一般的な手順を示しています。