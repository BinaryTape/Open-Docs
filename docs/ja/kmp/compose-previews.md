[//]: # (title: Compose UI プレビュー)

エミュレータを実行せずに、IDE (IntelliJ IDEA および Android Studio) で UI がレンダリングされた状態を確認するための *プレビュー* composable を作成できます。
プレビューは、[Jetpack Compose のコア機能の一部](https://developer.android.com/develop/ui/compose/tooling/previews)です。

> Kotlin Multiplatform プロジェクトの共通コード (common code) で Compose プレビューを有効にするには、Android ターゲットが必要です。これは、プレビューが Android ライブラリに依存しているためです。
> 
{style="note"}

Compose Multiplatform は当初、カスタムライブラリとして限定的な `@Preview` アノテーションを実装していましたが、バージョン 1.10.0 以降、オリジナルの AndroidX アノテーションが完全にマルチプラットフォーム化されたため、この実装は非推奨となりました。

このページでは、以下について説明します：
* さまざまなプロジェクト構成において、共通コードで [プレビューを有効にする方法](#preview-setup)
* Compose Multiplatform、AGP、およびアノテーションの [サポートされている組み合わせの概要](#supported-configurations)

## プレビューの設定

IDE でプレビューサポートを有効にするには、KMP モジュールの `build.gradle.kts` ファイルに必要な依存関係を追加します。

1. `commonMain` ソースセット用のアノテーションの依存関係：Compose Multiplatform のバージョンに応じて、古いものまたは新しいものを使用します。
2. クラスパス上のツール用 (tooling) の依存関係。その宣言は Android の構成に依存します。

アノテーションの依存関係は、いずれかの `@Preview` 実装を指す必要があります。例：

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // 新しいアノテーション。CMP 1.10.0 以降で使用可能
            implementation("org.jetbrains.compose.ui:ui-tooling-preview:1.10.0")
            // 新しいアノテーションをインポートする場合：
            // import androidx.compose.ui.tooling.preview.Preview

            // 旧アノテーション。CMP 1.10.0 で非推奨
            implementation("org.jetbrains.compose.components:components-ui-tooling-preview:1.10.0")
            // 旧アノテーションをインポートする場合：
            // import org.jetbrains.compose.ui.tooling.preview.Preview
        }
    }
}
```

ツール用の依存関係は、[Android ターゲット構成](#android-target-configurations) に応じて、KMP モジュールの `build.gradle.kts` ファイルのルートにある `dependencies {}` ブロックで、次の 2 つの方法のいずれかで宣言する必要があります。

* `com.android.application` または `com.android.library` プラグインを使用している場合：

    ```kotlin
    dependencies {
        debugImplementation("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```
* `com.android.kotlin.multiplatform.library` プラグインを使用している場合：

    ```kotlin
    dependencies {
        androidRuntimeClasspath("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```

## サポートされている構成

依存関係のバージョンやプロジェクトの構成スタイルに応じて、Compose プレビューを有効にするために使用できるサポート済みの組み合わせがいくつかあります。

* Compose Multiplatform 1.9、旧 `@Preview` アノテーション、`androidTarget {}` で構成された Android。
* Compose Multiplatform 1.10、旧 `@Preview` アノテーション、`androidTarget {}` で構成された Android。
* Compose Multiplatform 1.10、新 `@Preview` アノテーション、`androidTarget {}` で構成された Android。
* Compose Multiplatform 1.10、新 `@Preview` アノテーション、AGP 9.0 の `androidLibrary {}` で構成された Android。
  KMP アプリのアップグレードの詳細については、[AGP 9.0 移行ガイド](multiplatform-project-agp-9-migration.md) を参照してください。

> IntelliJ IDEA での AGP 9.0 のサポートは近日公開予定で、2026 年第 1 四半期に提供される見込みです。
>
{style="note"}

### 利用可能なアノテーション

Compose Multiplatform では、2 つの `@Preview` アノテーションが利用可能です。

* `androidx.compose.ui.tooling.preview.Preview`
  * これはオリジナルの Android Jetpack アノテーションで、Compose Multiplatform 1.10 でマルチプラットフォーム化されました。共通コードにおいて、Android 宣言のすべてのパラメータをサポートしています。
  * 必要なランタイム依存関係は `org.jetbrains.compose.ui:ui-tooling-preview` です。
  * 今後は、こちらのアノテーションを使用することが推奨されます。
* `org.jetbrains.compose.ui.tooling.preview.Preview`
  * これはアノテーションの最初のマルチプラットフォーム実装であり、Android 専用のエクスペリエンスをエミュレートしたものでした。サポートされているパラメータの数は限られていますが、基本的なプレビュー機能を提供します。
  * 必要なランタイム依存関係は `org.jetbrains.compose.components:components-ui-tooling-preview` です。
  * このアノテーションは、Compose Multiplatform 1.10 で非推奨となりました。

共有コードでこれらのアノテーションのいずれかを使用するには、[上記のように](#preview-setup) `commonMain` ソースセットに適切なランタイム依存関係を追加してください。

### Android ターゲット構成

プロジェクトで Android Gradle プラグイン (AGP) 8.x を使用している場合、プロジェクトの Kotlin Multiplatform 部分では、Android アプリケーション (`com.android.application`) または Android ライブラリ (`com.android.library`) プラグインのいずれかを使用する必要があり、Android 構成は `build.gradle.kts` ファイルの `androidTarget {}` ブロックに含まれます。

Android Gradle プラグイン 9.0 では、新しい [KMP Android ライブラリプラグイン](https://developer.android.com/kotlin/multiplatform/plugin) (`com.android.kotlin.multiplatform.library`) が導入され、Android 構成用の `androidLibrary {}` ブロックが導入されました。このプラグインを AGP 8.x で使用することも可能ですが、その組み合わせには既知の問題があり、推奨されません。

> AGP 9.0 は最新の安定版 Android Studio でサポートされていますが、IntelliJ IDEA ではまだサポートされておらず、2026 年第 1 四半期にサポートされる予定です。
>
{style="note"}

AGP 9.0 へのアップグレードの詳細については、[移行ページ](multiplatform-project-agp-9-migration.md) を参照してください。