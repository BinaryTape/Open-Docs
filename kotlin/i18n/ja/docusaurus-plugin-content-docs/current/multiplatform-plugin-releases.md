---
title: "Kotlin Multiplatform plugin のリリース"
---
Android Studio で Kotlin Multiplatform プロジェクトの作業を続けるには、[Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile) の最新バージョンがインストールされていることを確認してください。

## 新しいリリースへのアップデート

新しい Kotlin Multiplatform plugin のリリースが利用可能になるとすぐに、Android Studio がアップデートを提案します。提案を受け入れると、プラグインは自動的に最新バージョンにアップデートされます。
プラグインのインストールを完了するには、Android Studio を再起動する必要があります。

プラグインのバージョンを確認し、**Settings/Preferences** | **Plugins** で手動でアップデートできます。

プラグインが正しく動作するには、互換性のある Kotlin のバージョンが必要です。互換性のあるバージョンは、[リリース詳細](#release-details)で確認できます。
Kotlin のバージョンを確認してアップデートするには、**Settings/Preferences** | **Plugins** または **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** を使用します。

:::note
互換性のある Kotlin のバージョンがインストールされていない場合、Kotlin Multiplatform plugin は無効になります。Kotlin のバージョンをアップデートし、**Settings/Preferences** | **Plugins** でプラグインを有効にする必要があります。

:::

## リリース詳細

次の表に、最新の Kotlin Multiplatform plugin リリースの詳細を示します。
<table> 
<tr>
<th>
リリース情報
</th>
<th>
リリースのハイライト
</th>
<th>
互換性のある Kotlin バージョン
</th>
</tr>
<tr>
<td>

**0.8.4**

リリース日: 2024年12月6日
</td>
<td>

* 安定性とコード解析を向上させる Kotlin の [K2 mode](k2-compiler-migration-guide#support-in-ides) をサポートします。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.3**

リリース日: 2024年7月23日
</td>
<td>

* Xcode の互換性の問題を修正しました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.2**

リリース日: 2024年5月16日
</td>
<td>

* Android Studio Jellyfish と新しい Canary バージョン Koala をサポートします。
* 共有モジュールに `sourceCompatibility` と `targetCompatibility` の宣言を追加しました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.1**

リリース日: 2023年11月9日
</td>
<td>

* Kotlin を 1.9.20 にアップデートしました。
* Jetpack Compose を 1.5.4 にアップデートしました。
* Gradle ビルドおよび構成キャッシュをデフォルトで有効にしました。
* 新しい Kotlin バージョン用にビルド構成をリファクタリングしました。
* iOS フレームワークがデフォルトで静的になりました。
* Xcode 15 を使用した iOS デバイスでの実行に関する問題を修正しました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.0**

リリース日: 2023年10月5日
</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Gradle version catalog に移行しました。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android` を `androidTarget` に名前変更しました。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Kotlin および依存関係のバージョンをアップデートしました。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) `-sdk` および `-arch` の代わりに `-destination` 引数を使用するようにリファクタリングしました。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 生成されたファイル名をリファクタリングしました。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) JVM ターゲット構成を追加しました。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Xcode 15.0 をサポートしました。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 新しいモジュールウィザードを実験的な状態に移行しました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.6.0**

リリース日: 2023年5月24日
</td>
<td>

* 新しい Canary Android Studio Hedgehog のサポート。
* Multiplatform プロジェクトで Kotlin、Gradle、およびライブラリのバージョンをアップデートしました。
* Multiplatform プロジェクトで新しい [`targetHierarchy.default()`](whatsnew1820#new-approach-to-source-set-hierarchy) を適用しました。
* Multiplatform プロジェクトで、プラットフォーム固有のファイルにソースセット名のサフィックスを適用しました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.3**

リリース日: 2023年4月12日
</td>
<td>

* Kotlin と Compose のバージョンをアップデートしました。
* Xcode プロジェクトスキームの解析を修正しました。
* スキームの製品タイプチェックを追加しました。
* `iosApp` スキームが存在する場合、デフォルトで選択されるようになりました。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.2**

リリース日: 2023年1月30日
</td>
<td>

* [[Kotlin/Native デバッガーの問題を修正しました (遅い Spotlight インデックス)](https://youtrack.jetbrains.com/issue/KT-55988)。
* [[マルチモジュールプロジェクトで Kotlin/Native デバッガーを修正しました](https://youtrack.jetbrains.com/issue/KT-24450)。
* [[Android Studio Giraffe 2022.3.1 Canary の新しいビルド](https://youtrack.jetbrains.com/issue/KT-55274)。
* [[iOS アプリビルド用のプロビジョニングフラグを追加しました](https://youtrack.jetbrains.com/issue/KT-55204)。
* [[生成された iOS プロジェクトの **Framework Search Paths** オプションに継承されたパスを追加しました](https://youtrack.jetbrains.com/issue/KT-55402)。
</td>
<td>

* [Kotlin plugin のすべてのバージョン](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.1**

リリース日: 2022年11月30日
</td>
<td>

* [[新しいプロジェクトの生成を修正しました: 余分な "app" ディレクトリを削除します](https://youtrack.jetbrains.com/issue/KTIJ-23790)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.0**

リリース日: 2022年11月22日
</td>
<td>

* [[iOS フレームワーク配布のデフォルトオプションを変更しました: 現在は **Regular framework** です](https://youtrack.jetbrains.com/issue/KT-54086)。
* [[生成された Android プロジェクトで `MyApplicationTheme` を別のファイルに移動しました](https://youtrack.jetbrains.com/issue/KT-53991)。
* [[生成された Android プロジェクトをアップデートしました](https://youtrack.jetbrains.com/issue/KT-54658)。
* [[新しいプロジェクトディレクトリの予期しない消去に関する問題を修正しました](https://youtrack.jetbrains.com/issue/KTIJ-23707)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.4**

リリース日: 2022年9月12日
</td>
<td>

* [[Android アプリを Jetpack Compose に移行しました](https://youtrack.jetbrains.com/issue/KT-53162)。
* [[古くなった HMPP フラグを削除しました](https://youtrack.jetbrains.com/issue/KT-52248)。
* [[Android マニフェストからパッケージ名を削除しました](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [[Xcode プロジェクトの `.gitignore` をアップデートしました](https://youtrack.jetbrains.com/issue/KT-53703)。
* [[expect/actual のより良い説明のためにウィザードプロジェクトをアップデートしました](https://youtrack.jetbrains.com/issue/KT-53928)。
* [[Android Studio の Canary ビルドとの互換性をアップデートしました](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [[Android アプリの最小 Android SDK を 21 にアップデートしました](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [[Xcode インストール後の最初の起動に関する問題を修正しました](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [[M1 での Apple 実行構成に関する問題を修正しました](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [[Windows OS での `local.properties` に関する問題を修正しました](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [[Android Studio の Canary ビルドでの Kotlin/Native デバッガーに関する問題を修正しました](https://youtrack.jetbrains.com/issue/KT-53976)。
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.3**

リリース日: 2022年6月9日
</td>
<td>

* Kotlin IDE plugin 1.7.0 への依存関係をアップデートしました。
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.2**

リリース日: 2022年4月4日
</td>
<td>

* Android Studio 2021.2 および 2021.3 での iOS アプリケーションのデバッグに関するパフォーマンスの問題を修正しました。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.1**

リリース日: 2022年2月15日
</td>
<td>

* [[Kotlin Multiplatform Mobile ウィザードで M1 iOS シミュレーターを有効にしました](https://youtrack.jetbrains.com/issue/KT-51105)。
* XcProjects のインデックス作成のパフォーマンスを改善しました: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* ビルドスクリプトのクリーンアップ: `kotlin("test-common")` および `kotlin("test-annotations-common")` の代わりに `kotlin("test")` を使用します。
* [[Kotlin plugin version](https://youtrack.jetbrains.com/issue/KTIJ-20167) との互換性範囲を拡大しました。
* [[Windows ホストでの JVM デバッグの問題を修正しました](https://youtrack.jetbrains.com/issue/KT-50699)。
* [[プラグインを無効にした後の無効なバージョンに関する問題を修正しました](https://youtrack.jetbrains.com/issue/KT-50966)。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.0**

リリース日: 2021年11月16日
</td>
<td>

* [[新しい Kotlin Multiplatform Library ウィザード](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* Kotlin Multiplatform ライブラリ配布の新しいタイプのサポート: [XCFramework](multiplatform-build-native-binaries#build-xcframeworks)。
* 新しいクロスプラットフォームモバイルプロジェクトで[階層型プロジェクト構造](multiplatform-hierarchy#manual-configuration)を有効にしました。
* [[明示的な iOS ターゲット宣言](https://youtrack.jetbrains.com/issue/KT-46861)のサポート。
* [[非 Mac マシンで Kotlin Multiplatform Mobile プラグインウィザードを有効にしました](https://youtrack.jetbrains.com/issue/KT-48614)。
* [[Kotlin Multiplatform モジュールウィザードのサブフォルダのサポート](https://youtrack.jetbrains.com/issue/KT-47923)。
* [[Xcode `Assets.xcassets` ファイルのサポート](https://youtrack.jetbrains.com/issue/KT-49571)。
* [[プラグインクラスローダーの例外を修正しました](https://youtrack.jetbrains.com/issue/KT-48103)。
* CocoaPods Gradle Plugin テンプレートをアップデートしました。
* Kotlin/Native デバッガーのタイプ評価の改善。
* Xcode 13 での iOS デバイスの起動を修正しました。
</td>
<td>

* [Kotlin 1.6.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.7**

リリース日: 2021年8月2日
</td>
<td>

* [[AppleRunConfiguration の Xcode 構成オプションを追加しました](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
* [[Apple M1 シミュレーターのサポートを追加しました](https://youtrack.jetbrains.com/issue/KT-47618)。
* [[プロジェクトウィザードに Xcode 統合オプションに関する情報を追加しました](https://youtrack.jetbrains.com/issue/KT-47466)。
* [[CocoaPods を使用したプロジェクトが生成された後、CocoaPods gem がインストールされていないというエラー通知を追加しました](https://youtrack.jetbrains.com/issue/KT-47329)。
* [[Kotlin 1.5.30 で生成された共有モジュールに Apple M1 シミュレーターターゲットのサポートを追加しました](https://youtrack.jetbrains.com/issue/KT-47631)。
* [[Kotlin 1.5.20 で生成された Xcode プロジェクトをクリアしました](https://youtrack.jetbrains.com/issue/KT-47465)。
* 実際の iOS デバイスでの Xcode Release 構成の起動を修正しました。
* Xcode 12.5 でのシミュレーターの起動を修正しました。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.6**

リリース日: 2021年6月10日
</td>
<td>

* Android Studio Bumblebee Canary 1 との互換性。
* [Kotlin 1.5.20](whatsnew1520)のサポート: プロジェクトウィザードで Kotlin/Native の新しいフレームワークパッキングタスクを使用します。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.5**

リリース日: 2021年5月25日
</td>
<td>

* [[Android Studio Arctic Fox 2020.3.1 Beta 1 以降との互換性を修正しました](https://youtrack.jetbrains.com/issue/KT-46834)。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.4**

リリース日: 2021年5月5日
</td>
<td>

Android Studio 4.2 または Android Studio 2020.3.1 Canary 8 以降でこのバージョンのプラグインを使用してください。
* [Kotlin 1.5.0](whatsnew15) との互換性。
* [[iOS 統合のために Kotlin Multiplatform モジュールで CocoaPods 依存関係マネージャーを使用する機能](https://youtrack.jetbrains.com/issue/KT-45946)。
</td>
<td>

* [Kotlin 1.5.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.3**

リリース日: 2021年4月5日
</td>
<td>

* [[プロジェクトウィザード: モジュールの命名の改善](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [[iOS 統合のためにプロジェクトウィザードで CocoaPods 依存関係マネージャーを使用する機能](https://youtrack.jetbrains.com/issue/KT-45478)。
* [[新しいプロジェクトでの gradle.properties の可読性の向上](https://youtrack.jetbrains.com/issue/KT-42908)。
* [「共有モジュールのサンプルテストを追加する」がオフの場合、サンプルテストは生成されなくなりました](https://youtrack.jetbrains.com/issue/KT-43441)。
* [[修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.2**

リリース日: 2021年3月3日
</td>
<td>

* [[Xcode 関連のファイルを Xcode で開く機能](https://youtrack.jetbrains.com/issue/KT-44970)。
* [[iOS 実行構成で Xcode プロジェクトファイルの場所を設定する機能](https://youtrack.jetbrains.com/issue/KT-44968)。
* [[Android Studio 2020.3.1 Canary 8 のサポート](https://youtrack.jetbrains.com/issue/KT-45162)。
* [[修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.1**

リリース日: 2021年2月15日
</td>
<td>

Android Studio 4.2 でこのバージョンのプラグインを使用してください。
* インフラストラクチャの改善。
* [[修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.0**

リリース日: 2020年11月23日
</td>
<td>

* [[iPad デバイスのサポート](https://youtrack.jetbrains.com/issue/KT-41932)。
* [[Xcode で構成されているカスタムスキーム名のサポート](https://youtrack.jetbrains.com/issue/KT-41677)。
* [[iOS 実行構成にカスタムビルドステップを追加する機能](https://youtrack.jetbrains.com/issue/KT-41678)。
* [[カスタム Kotlin/Native バイナリをデバッグする機能](https://youtrack.jetbrains.com/issue/KT-40954)。
* [[Kotlin Multiplatform Mobile Wizards によって生成されたコードを簡素化しました](https://youtrack.jetbrains.com/issue/KT-41712)。
* [Kotlin 1.4.20 で非推奨になった[Kotlin Android Extensions プラグインのサポートを削除しました](https://youtrack.jetbrains.com/issue/KT-42121)。
* [[ホストから切断した後、物理デバイス構成の保存を修正しました](https://youtrack.jetbrains.com/issue/KT-42390)。
* その他の修正と改善。
</td>
<td>

* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.3**

リリース日: 2020年10月2日
</td>
<td>

* iOS 14 および Xcode 12 との互換性を追加しました。
* Kotlin Multiplatform Mobile Wizard によって作成されたプラットフォームテストの名前を修正しました。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.2**

リリース日: 2020年9月29日
</td>
<td>

 * [[Kotlin 1.4.20-M1](eap#build-details) との互換性を修正しました。
 * デフォルトで JetBrains へのエラー報告を有効にしました。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.1**

リリース日: 2020年9月10日
</td>
<td>

* Android Studio Canary 8 以降との互換性を修正しました。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.0**

リリース日: 2020年8月31日
</td>
<td>

* Kotlin Multiplatform Mobile プラグインの最初のバージョン。[ブログ記事](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)で詳細をご覧ください。
</td>
<td>

* [Kotlin 1.4.0](releases#release-details)
* [Kotlin 1.4.10](releases#release-details)
</td>
</tr>
</table>