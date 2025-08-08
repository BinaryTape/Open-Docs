[//]: # (title: Compose MultiplatformとJetpack Compose)

<web-summary>この記事では、Compose MultiplatformとJetpack Composeの関係について説明します。これら2つのツールキットについて、またそれらがどのように連携するかについて詳しく学習できます。</web-summary>

![JetBrainsによって作成されたCompose Multiplatform、Googleによって作成されたJetpack Compose](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
この記事では、Compose MultiplatformとJetpack Composeの関係について説明します。
これら2つのツールキットがどのように連携するか、ライブラリがターゲット間でどのように扱われるか、
そしてマルチプラットフォームプロジェクト用に独自のUIライブラリを作成または適応する方法について学習できます。
</tldr>

Compose Multiplatformは、JetBrainsによって開発されたクロスプラットフォームUIツールキットです。
これは、追加のターゲットプラットフォームをサポートすることで、GoogleのAndroid向け[Jetpack Compose](https://developer.android.com/jetpack/compose)ツールキットを拡張したものです。

Compose Multiplatformは、[共通Kotlinコード](multiplatform-discover-project.md#common-code)からCompose APIを利用可能にし、
Android、iOS、デスクトップ、ウェブで実行できる共有Compose UIコードを記述できるようにします。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **プラットフォーム**    | Android, iOS, デスクトップ, ウェブ | Android             |
| **サポート元**     | JetBrains                  | Google              |

## Jetpack Composeとコンポーザブル

Jetpack Composeは、ネイティブAndroidインターフェースを構築するための宣言型UIツールキットです。
その基盤は、`@Composable`アノテーションが付けられた_コンポーザブル_関数です。
これらの関数はUIの一部を定義し、基になるデータが変更されると自動的に更新されます。
コンポーザブルを組み合わせて、レイアウトを構築し、ユーザー入力を処理し、状態を管理し、アニメーションを適用できます。
Jetpack Composeには、`Text`、`Button`、`Row`、`Column`などの共通UIコンポーネントが含まれており、モディファイアでカスタマイズできます。

Compose Multiplatformは、同じ原則に基づいています。
これはJetpack ComposeとComposeコンパイラおよびランタイムを共有しており、同じAPI（`@Composable`関数、`remember`のような状態管理ツール、レイアウトコンポーネント、モディファイア、アニメーションサポート）を使用します。
これは、Jetpack Composeの知識をCompose Multiplatformで再利用し、Android、iOS、デスクトップ、ウェブ向けのクロスプラットフォームUIを構築できることを意味します。

## Compose MultiplatformとJetpack Composeの機能

> ほぼすべてのJetpack Compose資料、
> [Googleの公式ドキュメント](https://developer.android.com/jetpack/compose/documentation)を含むものから、両方のUIフレームワークの基礎について学習できます。
>
{style="tip"}

当然ながら、Compose Multiplatformにはプラットフォーム固有の機能と考慮事項があります。

*   [Android専用コンポーネント](compose-android-only-components.md)のページには、Androidプラットフォームに密接に関連しているため、共通のCompose Multiplatformコードからは利用できないAPIがリストされています。
*   デスクトップ用のウィンドウ処理APIやiOS用のUIKit互換性APIなど、一部のプラットフォーム固有のAPIは、それぞれのプラットフォームでのみ利用可能です。

以下に、一般的なコンポーネントとAPIの利用可能性の概要を示します。

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | はい                                                                                                      | はい                                                                                                   |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | はい                                                                                                      | はい                                                                                                   |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | はい                                                                                                      | はい                                                                                                   |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | はい                                                                                                      | はい                                                                                                   |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | はい                                                                                                      | はい                                                                                                   |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | はい（`androidx.compose.runtime.rxjava2`および`androidx.compose.runtime.rxjava3`を除く）                 | はい                                                                                                   |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | はい                                                                                                      | はい                                                                                                   |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [はい](compose-lifecycle.md)                                                                              | はい                                                                                                   |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [はい](compose-viewmodel.md)                                                                              | はい                                                                                                   |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [はい](compose-navigation-routing.md)                                                                     | はい                                                                                                   |
| リソース                                                                                                           | `Res`クラスを使用する[Compose Multiplatformリソースライブラリ](compose-multiplatform-resources.md)       | `R`クラスを使用する[Androidリソースシステム](https://developer.android.com/jetpack/compose/resources) |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | いいえ                                                                                                     | はい                                                                                                   |
| UIコンポーネント、ナビゲーション、アーキテクチャなどの[サードパーティライブラリ](#libraries-for-compose-multiplatform) | [Compose Multiplatformライブラリ](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack ComposeおよびCompose Multiplatformライブラリ                                                   |

## 技術的な詳細

Compose Multiplatformは、Googleが公開するコードとリリースに基づいて構築されています。
Googleの焦点はAndroid向けのJetpack Composeですが、
Compose Multiplatformを可能にするために、GoogleとJetBrainsの間で緊密な連携が行われています。

Jetpackには、GoogleがAndroid向けに公開しているFoundationやMaterialなどのファーストパーティライブラリが含まれています。
[これらのライブラリ](https://github.com/JetBrains/compose-multiplatform-core)によって提供されるAPIを共通コードから利用可能にするために、
JetBrainsはこれらのライブラリのマルチプラットフォーム版をメンテナンスしており、Android以外のターゲット向けに公開しています。

> リリースサイクルについては、
> [互換性とバージョン](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles)のページで詳しく学習できます。
>
{style="tip"}

Android向けにCompose Multiplatformアプリケーションをビルドする場合、Googleが公開するJetpack Composeアーティファクトを使用します。
たとえば、`compose.material3`を依存関係に追加すると、あなたのプロジェクトではAndroidターゲットで`androidx.compose.material3:material3`を、他のターゲットで`org.jetbrains.compose.material3:material3`を使用します。
これは、マルチプラットフォームアーティファクト内のGradleモジュールメタデータに基づいて自動的に行われます。

## Compose Multiplatform向けライブラリ

Compose Multiplatformを使用することで、Compose APIを使用するライブラリを[Kotlin Multiplatformライブラリ](multiplatform-publish-lib-setup.md)として公開できます。
これにより、それらのライブラリは共通Kotlinコードから利用可能になり、複数のプラットフォームをターゲットにできます。

したがって、Compose APIを使用して新しいライブラリを構築している場合は、その利点を活用して、Compose Multiplatformを使用してマルチプラットフォームライブラリとして構築することを検討してください。
すでにAndroid向けにJetpack Composeライブラリを構築している場合は、そのライブラリをマルチプラットフォーム対応にすることを検討してください。
エコシステムには、すでに[多くのCompose Multiplatformライブラリ](https://github.com/terrakok/kmp-awesome#-compose-ui)が利用可能です。

Compose Multiplatformでライブラリが公開された場合、Jetpack Composeのみを使用するアプリでも、シームレスに利用できます。
それらは単にライブラリのAndroidアーティファクトを使用するだけです。

## 次のステップ

以下のコンポーネントにおけるCompose Multiplatformの実装についてさらに詳しくお読みください。
  * [](compose-lifecycle.md)
  * [リソース](compose-multiplatform-resources.md)
  * [](compose-viewmodel.md)
  * [](compose-navigation-routing.md)