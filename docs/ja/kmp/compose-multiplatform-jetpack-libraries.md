# マルチプラットフォーム Jetpack ライブラリのパッケージ化方法

Compose Multiplatform は、Jetpack Compose および関連する AndroidX ライブラリの全機能を Android 以外のプラットフォームにももたらします。
[Android Developers ウェブサイト](https://developer.android.com/kotlin/multiplatform)で示されているように、多くの Jetpack ライブラリ (例: `androidx.annotation`) は、Android チームによって完全にマルチプラットフォームとして公開されており、KMP プロジェクトでそのまま使用できます。
Compose 自体、Navigation、Lifecycle、ViewModel など、その他のライブラリは、共通コードで動作するために追加のサポートが必要です。

JetBrains の Compose Multiplatform チームは、Android 以外のプラットフォーム向けにこれらのライブラリのアーティファクトを生成し、それらを元の Android アーティファクトとすべてまとめて単一のグループ ID で公開しています。
これにより、共通ソースセットにこのようなマルチプラットフォーム依存関係を追加すると、アプリの Android ディストリビューションは Android アーティファクトを使用します。
同時に、他のターゲット向けのディストリビューションは、対応するプラットフォーム向けにビルドされたアーティファクトを使用します。

プロセスは次のとおりです。

![](androidx-cmp-artifacts.svg)

例えば、「iOS 用 Navigation アーティファクト」は、以下のマルチプラットフォーム アーティファクトのコレクションを指します。
* `org.jetbrains.androidx.navigation.navigation-compose-uikitarm64`
* `org.jetbrains.androidx.navigation.navigation-compose-uikitsimarm64`
* `org.jetbrains.androidx.navigation.navigation-common-iosx64`
* `org.jetbrains.androidx.navigation.navigation-runtime-iossimulatorarm64`
* など。

これらのすべてのアーティファクトは、他のプラットフォーム用のアーティファクトと元の Android ライブラリ (`androidx.navigation.navigation-compose`) への参照と共に、グループとして公開されています。
それらは、統一された依存関係 `org.jetbrains.androidx.navigation.navigation-compose` を通じてアクセスできます。
Compose Multiplatform Gradle プラグインは、プラットフォーム固有のアーティファクトからディストリビューションへのマッピングを処理します。

このアプローチにより、その依存関係を持つ Kotlin Multiplatform (KMP) プロジェクトによって生成された Android アプリは、元の Android Navigation ライブラリを使用します。
一方、iOS アプリは、JetBrains によってビルドされた対応する iOS ライブラリを使用します。

## マルチプラットフォームプロジェクトで利用可能な Compose パッケージ

ベースとなる Compose ライブラリの中で、基本的な `androidx.compose.runtime` は完全にマルチプラットフォームです。
  （[以前使用されていた](whats-new-compose-190.md#multiplatform-targets-in-androidx-compose-runtime-runtime) `org.jetbrains.compose.runtime` アーティファクトは現在エイリアスとして機能します。）
さらに、Compose Multiplatform は以下を実装しています。
   * `androidx.compose.ui` および `androidx.compose.foundation` のマルチプラットフォーム版。これらは Compose Multiplatform プロジェクトで `org.jetbrains.compose.ui` および `org.jetbrains.compose.foundation` として利用できます。
   * `androidx.compose.material3` および `androidx.compose.material` のマルチプラットフォーム版。これらも同様にパッケージ化されています (`org.jetbrains.compose.material3` および `org.jetbrains.compose.material`)。
     他のライブラリとは異なり、Material 3 ライブラリは Compose Multiplatform のバージョンと結合されていません。
     そのため、`material3` エイリアスの代わりに、直接依存関係を指定できます。例えば、EAP バージョンを使用することもできます。
   * Material 3 アダプティブ ライブラリをスタンドアロンアーティファクトとして提供しています (`org.jetbrains.compose.material3.adaptive:adaptive*`)

## その他のマルチプラットフォームライブラリ

Compose アプリを構築するために必要な一部の機能は AndroidX の範囲外であるため、JetBrains はそれらを Compose Multiplatform にバンドルされたマルチプラットフォームライブラリとして実装しています。例えば、次のものがあります。

* Compose Multiplatform Gradle プラグイン。これは以下の機能を提供します。
    * Compose Multiplatform プロジェクトを設定するための Gradle DSL を提供します。
    * デスクトップおよびウェブターゲット向けのディストリビューションパッケージの作成を支援します。
    * 各ターゲットにリソースを正しく利用できるように、マルチプラットフォームリソースライブラリをサポートします。
* `org.jetbrains.compose.components.resources`。これは [クロスプラットフォームリソース](compose-multiplatform-resources.md)のサポートを提供します。
* `org.jetbrains.compose.components.uiToolingPreview`。これは IntelliJ IDEA および Android Studio で共通コードの Compose UI プレビューをサポートします。
* `org.jetbrains.compose.components.animatedimage`。これはアニメーション画像の表示をサポートします。
* `org.jetbrains.compose.components.splitpane`。これは Swing の [JSplitPane](https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html) のアナログを実装しています。