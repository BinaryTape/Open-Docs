# マルチプラットフォームJetpackライブラリのパッケージ化の仕組み

Compose Multiplatformは、Jetpack Composeとその関連するAndroidXライブラリの全機能を、Android以外のプラットフォームにも提供します。
[Android Developersのウェブサイト](https://developer.android.com/kotlin/multiplatform)に記載されているように、多くのJetpackライブラリ（`androidx.annotation` など）はAndroidチームによって完全にマルチプラットフォームとして公開されており、KMPプロジェクトでそのまま使用できます。
一方で、Compose自体、Navigation、Lifecycle、ViewModelなどは、共通コード（common code）で動作させるために追加のサポートが必要です。

JetBrainsのCompose Multiplatformチームは、Android以外のプラットフォーム向けにこれらのライブラリのアーティファクトを作成し、オリジナルのAndroidアーティファクトと一緒に単一のグループIDで公開しています。
これにより、このようなマルチプラットフォームの依存関係を共通ソースセット（common source set）に追加すると、アプリのAndroid版ではAndroid用アーティファクトが使用されます。
同時に、他のターゲット向けには、対応するプラットフォーム用にビルドされたアーティファクトが使用されます。

プロセスの概要は以下の通りです：

![](androidx-cmp-artifacts.svg)

例えば、「iOS用のNavigationアーティファクト」とは、以下のマルチプラットフォームアーティファクトのコレクションを指します：
* `org.jetbrains.androidx.navigation.navigation-compose-uikitarm64`
* `org.jetbrains.androidx.navigation.navigation-compose-uikitsimarm64`
* `org.jetbrains.androidx.navigation.navigation-common-iosarm64`
* `org.jetbrains.androidx.navigation.navigation-runtime-iossimulatorarm64`
* など。

これらのアーティファクトはすべて、他のプラットフォーム用のアーティファクト、およびオリジナルのAndroidライブラリ（`androidx.navigation.navigation-compose`）への参照とともに、グループとして公開されます。これらには、統合された `org.jetbrains.androidx.navigation.navigation-compose` 依存関係を通じてアクセスできます。
Compose Multiplatform Gradleプラグインが、プラットフォーム固有のアーティファクトの割り当てを処理します。

このアプローチにより、その依存関係を持つKotlin Multiplatform (KMP) プロジェクトから生成されたAndroidアプリは、オリジナルのAndroid Navigationライブラリを使用します。
一方でiOSアプリは、JetBrainsによってビルドされた対応するiOSライブラリを使用します。

## マルチプラットフォームプロジェクトで利用可能なComposeパッケージ

ベースとなるComposeライブラリのうち、基本的な `androidx.compose.runtime` は完全にマルチプラットフォーム化されています。
（[以前使用されていた](whats-new-compose-190.md#multiplatform-targets-in-androidx-compose-runtime-runtime) `org.jetbrains.compose.runtime` アーティファクトは、現在はエイリアスとして機能します。）

さらに、Compose Multiplatformは以下を実装しています：
   * `androidx.compose.ui` および `androidx.compose.foundation` のマルチプラットフォーム版。これらはCompose Multiplatformプロジェクトにおいて `org.jetbrains.compose.ui` および `org.jetbrains.compose.foundation` として利用可能です。
   * `androidx.compose.material3` および `androidx.compose.material` のマルチプラットフォーム版。これらも同様にパッケージ化されています（`org.jetbrains.compose.material3` および `org.jetbrains.compose.material`）。
     他とは異なり、Material 3ライブラリはCompose Multiplatformのバージョンと密結合されていません。
     そのため、`material3` エイリアスの代わりに直接依存関係を指定することもできます。例えば、EAP版を使用する場合などがこれに当たります。
   * スタンドアロンアーティファクトとしてのMaterial 3 Adaptiveライブラリ（`org.jetbrains.compose.material3.adaptive:adaptive*`）

## 追加のマルチプラットフォームライブラリ

Composeアプリの構築に必要な機能の中にはAndroidXの範囲外のものがあるため、JetBrainsはそれらをCompose Multiplatformにバンドルされたマルチプラットフォームライブラリとして実装しています。例えば：

* Compose Multiplatform Gradleプラグイン：
    * Compose Multiplatformプロジェクトを構成するためのGradle DSLを提供します。
    * デスクトップおよびウェブターゲット用の配布パッケージの作成を支援します。
    * マルチプラットフォームリソースライブラリをサポートし、各ターゲットでリソースを正しく利用できるようにします。
* `org.jetbrains.compose.components.resources`：[クロスプラットフォームリソース](compose-multiplatform-resources.md)のサポートを提供します。
* `org.jetbrains.compose.components.uiToolingPreview`：IntelliJ IDEAおよびAndroid Studioにおける共通コードのCompose UIプレビューをサポートします。
* `org.jetbrains.compose.components.animatedimage`：アニメーション画像の表示をサポートします。
* `org.jetbrains.compose.components.splitpane`：Swingの [JSplitPane](https://docs.oracle.com/javase/8/docs/api/javax/swing/JSplitPane.html) に相当する機能を実装します。