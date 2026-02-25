[//]: # (title: Compose Multiplatform と Jetpack Compose の関係)

<web-summary>この記事では、Compose Multiplatform と Jetpack Compose の関係について説明します。2 つのツールキットと、それらがどのように連携しているかについて詳しく学びます。</web-summary>

![Compose Multiplatform created by JetBrains, Jetpack Compose created by Google](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
この記事では、Compose Multiplatform と Jetpack Compose の関係について説明します。
2 つのツールキットがどのように連携しているか、ターゲット間でライブラリがどのように処理されるか、
およびマルチプラットフォームプロジェクト向けに独自の UI ライブラリを作成または適応させる方法について学びます。
</tldr>

Compose Multiplatform は、JetBrains によって開発されたクロスプラットフォーム UI ツールキットです。
これは Google の Android 向け [Jetpack Compose](https://developer.android.com/jetpack/compose) ツールキットを拡張し、追加のターゲットプラットフォームをサポートします。

Compose Multiplatform は、[共通の Kotlin コード](multiplatform-discover-project.md#common-code)から Compose API を利用可能にし、Android、iOS、デスクトップ、Web で動作する共有 Compose UI コードを作成できるようにします。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **プラットフォーム**    | Android, iOS, デスクトップ, Web | Android             |
| **サポート元** | JetBrains                  | Google              |

## Jetpack Compose とコンポーザブル

Jetpack Compose は、ネイティブ Android インターフェースを構築するための宣言的 UI ツールキットです。
その基盤は、`@Composable` アノテーションが付いた*コンポーザブル*（composable）関数です。
これらの関数は UI の一部を定義し、基盤となるデータが変更されると自動的に更新されます。
コンポーザブルを組み合わせることで、レイアウトの構築、ユーザー入力の処理、状態の管理、アニメーションの適用を行うことができます。
Jetpack Compose には `Text`、`Button`、`Row`、`Column` などの一般的な UI コンポーネントが含まれており、これらは修飾子（modifiers）でカスタマイズできます。

Compose Multiplatform はこれと同じ原理に基づいています。
Compose コンパイラとランタイムを Jetpack Compose と共有し、`@Composable` 関数、`remember` などの状態管理ツール、レイアウトコンポーネント、修飾子、アニメーションサポートなど、同じ API を使用します。
つまり、Jetpack Compose の知識を Compose Multiplatform で再利用して、Android、iOS、デスクトップ、Web 向けのクロスプラットフォーム UI を構築できます。

## Compose Multiplatform と Jetpack Compose の機能

> 両方の UI フレームワークの基礎については、[Google の公式ドキュメント](https://developer.android.com/jetpack/compose/documentation)を含む、ほぼすべての Jetpack Compose の資料から学ぶことができます。
> 
{style="tip"}

当然ながら、Compose Multiplatform にはプラットフォーム固有の機能と考慮事項があります。

* [Android 専用コンポーネント](compose-android-only-components.md)のページには、Android プラットフォームに密接に結びついているため、共通の Compose Multiplatform コードからは利用できない API がリストされています。
* デスクトップ用のウィンドウ処理 API や iOS 用の UIKit 互換性 API など、一部のプラットフォーム固有の API は、それぞれのプラットフォームでのみ利用可能です。

以下は、主要なコンポーネントと API の利用可能性の概要です。

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | はい                                                                                                       | はい                                                                                                    |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | はい                                                                                                       | はい                                                                                                    |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | はい                                                                                                       | はい                                                                                                    |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | はい                                                                                                       | はい                                                                                                    |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | はい                                                                                                       | はい                                                                                                    |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | はい（`androidx.compose.runtime.rxjava2` および `androidx.compose.runtime.rxjava3` を除く）                 | はい                                                                                                    |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | はい                                                                                                       | はい                                                                                                    |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [はい](compose-lifecycle.md)                                                                               | はい                                                                                                    |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [はい](compose-viewmodel.md)                                                                               | はい                                                                                                    |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [はい](compose-navigation-routing.md)                                                                      | はい                                                                                                    |
| リソース                                                                                                           | `Res` クラスを使用した [Compose Multiplatform リソースライブラリ](compose-multiplatform-resources.md)       | `R` クラスを使用した [Android リソースシステム](https://developer.android.com/jetpack/compose/resources) |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | いいえ                                                                                                        | はい                                                                                                    |
| UI コンポーネント、ナビゲーション、アーキテクチャなどのための[サードパーティライブラリ](#libraries-for-compose-multiplatform) | [Compose Multiplatform ライブラリ](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose および Compose Multiplatform ライブラリ                                                    |

## 技術的な詳細

Compose Multiplatform は、Google によって公開されたコードとリリースに基づいています。
Google の重点は Android 向けの Jetpack Compose ですが、Compose Multiplatform を実現するために Google と JetBrains の間で緊密な協力が行われています。

Jetpack には Foundation や Material などのファーストパーティライブラリが含まれており、Google はこれらを Android 向けに公開しています。[これらのライブラリ](https://github.com/JetBrains/compose-multiplatform-core)が提供する API を共通コードから利用できるようにするため、JetBrains はこれらのライブラリのマルチプラットフォームバージョンを維持管理し、Android 以外のターゲット向けに公開しています。

> リリースサイクルについての詳細は、[互換性とバージョン](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles)のページをご覧ください。
> 
{style="tip"}

Android 向けに Compose Multiplatform アプリケーションをビルドする場合、Google が公開している Jetpack Compose のアーティファクトを使用します。
たとえば、依存関係に `compose.material3` を追加すると、プロジェクトは Android ターゲットでは `androidx.compose.material3:material3` を使用し、その他のターゲットでは `org.jetbrains.compose.material3:material3` を使用します。これは、マルチプラットフォームアーティファクト内の Gradle モジュールメタデータに基づいて自動的に行われます。

## Compose Multiplatform 用のライブラリ

Compose Multiplatform を使用することで、Compose API を使用するライブラリを [Kotlin Multiplatform ライブラリ](multiplatform-publish-lib-setup.md)として公開できます。これにより、複数のプラットフォームをターゲットとする共通の Kotlin コードからそれらを利用できるようになります。

そのため、Compose API を使用した新しいライブラリを構築する場合は、Compose Multiplatform を使用してマルチプラットフォームライブラリとして構築することを検討してください。
すでに Android 向けの Jetpack Compose ライブラリを構築している場合は、そのライブラリをマルチプラットフォーム化することを検討してください。エコシステムにはすでに[多くの Compose Multiplatform ライブラリ](https://github.com/terrakok/kmp-awesome#-compose-ui)が存在します。

ライブラリが Compose Multiplatform で公開されている場合、Jetpack Compose のみを使用するアプリでもシームレスに利用できます。それらのアプリは単にそのライブラリの Android アーティファクトを使用するだけです。

## 次のステップ

以下のコンポーネントにおける Compose Multiplatform の実装について詳しく読む：
  * [Lifecycle（ライフサイクル）](compose-lifecycle.md)
  * [Resources（リソース）](compose-multiplatform-resources.md)
  * [共通 ViewModel](compose-viewmodel.md)
  * [ナビゲーションとルーティング](compose-navigation-routing.md)