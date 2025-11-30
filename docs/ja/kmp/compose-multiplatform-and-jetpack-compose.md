[//]: # (title: Compose Multiplatform と Jetpack Compose の関係)

<web-summary>この記事では、Compose MultiplatformとJetpack Composeの関係を説明します。2つのツールキットについて、それぞれがどのように連携しているかを詳しく解説します。</web-summary>

![Compose Multiplatform created by JetBrains, Jetpack Compose created by Google](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
この記事では、Compose MultiplatformとJetpack Composeの関係を説明します。
2つのツールキットがどのように連携しているか、ターゲット間でのライブラリの扱い方、
そしてマルチプラットフォームプロジェクト用に独自のUIライブラリを作成または適応させる方法を学びます。
</tldr>

Compose Multiplatformは、JetBrainsが開発したクロスプラットフォームUIツールキットです。
GoogleのAndroid向け[Jetpack Compose](https://developer.android.com/jetpack/compose)ツールキットを拡張し、
追加のターゲットプラットフォームをサポートしています。

Compose Multiplatformは、[共通Kotlinコード](multiplatform-discover-project.md#common-code)からCompose APIを利用可能にし、
Android、iOS、デスクトップ、およびウェブで実行できる共通のCompose UIコードを記述できるようにします。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **Platforms**    | Android, iOS, desktop, web | Android             |
| **Supported by** | JetBrains                  | Google              |

## Jetpack Compose とコンポーザブル

Jetpack Composeは、Androidネイティブインターフェースを構築するための宣言型UIツールキットです。
その基盤は、`@Composable`アノテーションでマークされた_コンポーザブル関数_です。
これらの関数はUIの一部を定義し、基となるデータが変更されると自動的に更新されます。
コンポーザブルを組み合わせて、レイアウトを構築したり、ユーザー入力を処理したり、状態を管理したり、アニメーションを適用したりできます。
Jetpack Composeには、`Text`、`Button`、`Row`、`Column`などの共通UIコンポーネントが含まれており、モディファイアでカスタマイズできます。

Compose Multiplatformも同じ原則に基づいて構築されています。
Jetpack Composeと同じComposeコンパイラとランタイムを共有し、同じAPI（`@Composable`関数、
`remember`のような状態管理ツール、レイアウトコンポーネント、モディファイア、アニメーションサポート）を使用します。
これは、Android、iOS、デスクトップ、ウェブ向けのクロスプラットフォームUIを構築するために、
Jetpack Composeの知識をCompose Multiplatformで再利用できることを意味します。

## Compose Multiplatform と Jetpack Compose の機能

> 両方のUIフレームワークの基本については、[Googleの公式ドキュメント](https://developer.android.com/jetpack/compose/documentation)を含む、
> ほぼすべてのJetpack Compose資料から学ぶことができます。
>
{style="tip"}

当然ながら、Compose Multiplatformにはプラットフォーム固有の機能と考慮事項があります。

*   [Androidのみのコンポーネント](compose-android-only-components.md)ページには、
    Androidプラットフォームに密接に結びついており、
    そのため共通のCompose Multiplatformコードからは利用できないAPIがリストされています。
*   デスクトップ用のウィンドウ処理APIやiOS用のUIKit互換APIなど、一部のプラットフォーム固有APIは、
    それぞれのプラットフォームでのみ利用可能です。

一般的なコンポーネントとAPIの提供状況の概要を以下に示します。

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | はい                                                                                                      | はい                                                                                                   |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | はい                                                                                                      | はい                                                                                                   |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | はい                                                                                                      | はい                                                                                                   |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | はい                                                                                                      | はい                                                                                                   |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | はい                                                                                                      | はい                                                                                                   |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | はい（`androidx.compose.runtime.rxjava2`および`androidx.compose.runtime.rxjava3`を除く）             | はい                                                                                                   |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | はい                                                                                                      | はい                                                                                                   |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [はい](compose-lifecycle.md)                                                                              | はい                                                                                                   |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [はい](compose-viewmodel.md)                                                                              | はい                                                                                                   |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [はい](compose-navigation-routing.md)                                                                     | はい                                                                                                   |
| Resources                                                                                                           | `Res`クラスを使用する[Compose Multiplatformリソースライブラリ](compose-multiplatform-resources.md)        | `R`クラスを使用する[Androidリソースシステム](https://developer.android.com/jetpack/compose/resources) |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | いいえ                                                                                                    | はい                                                                                                   |
| [サードパーティライブラリ](#libraries-for-compose-multiplatform)（UIコンポーネント、ナビゲーション、アーキテクチャなど） | [Compose Multiplatformライブラリ](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack ComposeおよびCompose Multiplatformライブラリ                                                   |

## 技術的な詳細

Compose Multiplatformは、Googleが公開しているコードとリリースに基づいて構築されています。
GoogleはAndroid向けJetpack Composeに注力していますが、
Compose Multiplatformを可能にするためにGoogleとJetBrainsの間で緊密な連携が行われています。

Jetpackには、FoundationやMaterialのようなファーストパーティライブラリが含まれており、
これらはGoogleがAndroid向けに公開しています。
[これらのライブラリ](https://github.com/JetBrains/compose-multiplatform-core)が提供するAPIを共通コードから利用できるようにするため、
JetBrainsはこれらのライブラリのマルチプラットフォームバージョンを管理しており、Android以外のターゲット向けに公開されています。

> リリースサイクルについては、[互換性とバージョン](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles)ページで詳しく学ぶことができます。
>
{style="tip"}

Compose MultiplatformアプリケーションをAndroid向けにビルドする場合、Googleが公開しているJetpack Composeアーティファクトを使用します。
例えば、`compose.material3`を依存関係に追加すると、プロジェクトはAndroidターゲットでは`androidx.compose.material3:material3`を、
他のターゲットでは`org.jetbrains.compose.material3:material3`を使用します。
これは、マルチプラットフォームアーティファクトのGradle Module Metadataに基づいて自動的に行われます。

## Compose Multiplatform向けライブラリ

Compose Multiplatformを使用することで、Compose APIを使用するライブラリを[Kotlin Multiplatformライブラリ](multiplatform-publish-lib-setup.md)として公開できます。
これにより、複数のプラットフォームをターゲットとする共通Kotlinコードから利用可能になります。

したがって、Compose APIを使用して新しいライブラリを構築している場合は、その利点を活かしてCompose Multiplatformを使用してマルチプラットフォームライブラリとして構築することを検討してください。
すでにAndroid向けにJetpack Composeライブラリを構築している場合は、そのライブラリをマルチプラットフォーム対応にすることを検討してください。
エコシステムには、すでに[多くのCompose Multiplatformライブラリ](https://github.com/terrakok/kmp-awesome#-compose-ui)が利用可能です。

ライブラリがCompose Multiplatformで公開されると、Jetpack Composeのみを使用するアプリでもシームレスに利用できます。
それらのアプリは、単にライブラリのAndroidアーティファクトを使用するだけです。

## 次のステップ

以下のコンポーネントのCompose Multiplatform実装について、さらに詳しくお読みください。
*   [ライフサイクル](compose-lifecycle.md)
*   [リソース](compose-multiplatform-resources.md)
*   [共通ViewModel](compose-viewmodel.md)
*   [ナビゲーションとルーティング](compose-navigation-routing.md)