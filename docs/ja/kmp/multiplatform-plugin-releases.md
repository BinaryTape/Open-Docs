[//]: # (title: Kotlin Multiplatform IDE プラグインのリリース)

[Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)は、Android、iOS、デスクトップ、および Web 向けのクロスプラットフォームアプリケーションの開発を支援します。Kotlin Multiplatform プロジェクトを扱う際は、常に最新バージョンのプラグインを使用していることを確認してください。

このプラグインは IntelliJ IDEA および Android Studio と互換性があります：
* IntelliJ IDEA は、macOS では 2025.1.1.1 バージョン以降、Windows および Linux では 2025.2.2 バージョン以降でこのプラグインをサポートしています。
* Android Studio は、macOS では Narwhal 2025.1.1 バージョン以降、Windows および Linux では Otter 2025.2.1 バージョン以降でこのプラグインをサポートしています。

Kotlin Multiplatform Gradle プラグインの情報については、[DSL リファレンス](multiplatform-dsl-reference.md)および[互換性ガイド](multiplatform-compatibility-guide.md)を参照してください。

## 最新リリースへのアップデート

IDE は、新しい Kotlin Multiplatform プラグインのリリースが利用可能になると、すぐにアップデートを提案します。提案を承認すると、プラグインは最新バージョンにアップデートされます。プラグインのインストールを完了するには、IDE を再起動してください。

プラグインのバージョン確認および手動でのアップデートは、**Settings** | **Plugins** で行うことができます。

プラグインが正しく動作するためには、互換性のあるバージョンの Kotlin が必要です。互換性のあるバージョンについては、[リリース詳細](#release-details)で確認できます。Kotlin のバージョンを確認してアップデートするには、**Settings** | **Plugins** または **Tools** | **Kotlin** | **Configure Kotlin in Project** に移動してください。

> 互換性のあるバージョンの Kotlin がインストールされていない場合、Kotlin Multiplatform プラグインは無効化されます。Kotlin のバージョンをアップデートしてから、**Settings** | **Plugins** でプラグインを再度有効にしてください。
>
{style="note"}

## リリース詳細

以下の表は、Kotlin Multiplatform IDE プラグインのリリース一覧です。

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

<tr id="0.9">
<td>

**0.9**

リリース日: 2025年5月19日

</td>
<td>

Kotlin Multiplatform プラグインがゼロから再構築されました：

* サポートされている IDE 向けに統合された **New Project** ウィザード。
* Java、Android、Xcode、Gradle を含むセットアップの問題を発見し解決するのを支援するプリフライト環境チェック (Preflight environment checks)。
* iOS および Android 用のデバイスセレクターを備えた、サポートされているすべてのプラットフォーム向けの実行構成 (run configurations) を自動生成。
* 言語間サポート：Swift と Kotlin の言語間ナビゲーションとデバッグ、Swift の構文ハイライトおよびクイックドキュメント。
* Compose Multiplatform サポート：Kotlin Multiplatform IDE プラグインが Compose Multiplatform のリソース、自動補完、および共通コード (common code) 向けの UI プレビューをサポートするようになりました（[以前の Compose Multiplatform プラグイン](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)は安全にアンインストールできます）。
* Compose Hot Reload：アプリを再起動することなく UI の変更を即座に確認できます（デスクトップ JVM ターゲットを使用）。詳細は [Hot Reload のドキュメント](compose-hot-reload.md)を参照してください。

既知の問題：

* Android Studio において、Compose デバッガーが現在 Kotlin 2.1.20 および 2.1.21 で動作しません。この問題は Kotlin 2.2.0-RC2 で修正される予定です。

</td>
<td>

プラグインは[すべての Kotlin バージョン](https://kotlinlang.org/docs/releases.html#release-details)で動作しますが、ほとんどの機能は Kotlin 2.1.21 に依存しています。最高の体験を得るために、最新の安定版 Kotlin バージョンへのアップデートを推奨します。

このバージョンでは K2 モードも必要です。**Settings** | **Languages & Frameworks** | **Kotlin** で **Enable K2 mode** にチェックを入れて有効にしてください。

</td>
</tr>

<tr>
<td>

**0.8.4**

リリース日: 2024年12月6日

</td>
<td>

* 安定性とコード解析を向上させるための Kotlin の [K2 モード](https://kotlinlang.org/docs/k2-compiler-migration-guide.html#support-in-ides)のサポート。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.3**

リリース日: 2024年7月23日

</td>
<td>

* Xcode との互換性の問題の修正。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.2**

リリース日: 2024年5月16日

</td>
<td>

* Android Studio Jellyfish および新しい Canary バージョン Koala のサポート。
* 共有モジュール (shared module) における `sourceCompatibility` および `targetCompatibility` の宣言の追加。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.1**

リリース日: 2023年11月9日

</td>
<td>

* Kotlin を 1.9.20 にアップデート。
* Jetpack Compose を 1.5.4 にアップデート。
* Gradle のビルドキャッシュおよび構成キャッシュをデフォルトで有効化。
* 新しい Kotlin バージョンに合わせてビルド構成をリファクタリング。
* iOS フレームワークがデフォルトでスタティックになりました。
* Xcode 15 を使用した iOS デバイスでの実行に関する問題を修正。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.0**

リリース日: 2023年10月5日

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Gradle バージョンカタログに移行。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android` を `androidTarget` に名前変更。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Kotlin および依存関係のバージョンをアップデート。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) `-sdk` および `-arch` の代わりに `-destination` 引数を使用するようにリファクタリング。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 生成されるファイル名をリファクタリング。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) JVM ターゲット構成を追加。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Xcode 15.0 をサポート。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 新規モジュールウィザードを試験的状態 (experimental state) に移動。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.6.0**

リリース日: 2023年5月24日

</td>
<td>

* 新しい Canary Android Studio Hedgehog のサポート。
* Multiplatform プロジェクトにおける Kotlin、Gradle、およびライブラリのバージョンをアップデート。
* Multiplatform プロジェクトに新しい [`targetHierarchy.default()`](https://kotlinlang.org/docs/whatsnew1820.html#new-approach-to-source-set-hierarchy) を適用。
* Multiplatform プロジェクトのプラットフォーム固有ファイルにソースセット名のサフィックスを適用。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.3**

リリース日: 2023年4月12日

</td>
<td>

* Kotlin および Compose のバージョンをアップデート。
* Xcode プロジェクトスキームのパース処理を修正。
* スキームのプロダクトタイプチェックを追加。
* `iosApp` スキームが存在する場合、デフォルトで選択されるようになりました。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.2**

リリース日: 2023年1月30日

</td>
<td>

* [Kotlin/Native デバッガーの問題（Spotlight インデックス作成が遅い問題）を修正](https://youtrack.jetbrains.com/issue/KT-55988)。
* [マルチモジュールプロジェクトにおける Kotlin/Native デバッガーを修正](https://youtrack.jetbrains.com/issue/KT-24450)。
* [Android Studio Giraffe 2022.3.1 Canary 向けの新しいビルド](https://youtrack.jetbrains.com/issue/KT-55274)。
* [iOS アプリビルド用のプロビジョニングフラグを追加](https://youtrack.jetbrains.com/issue/KT-55204)。
* [生成された iOS プロジェクトの **Framework Search Paths** オプションに継承パスを追加](https://youtrack.jetbrains.com/issue/KT-55402)。

</td>
<td>

[すべての Kotlin プラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.1**

リリース日: 2022年11月30日

</td>
<td>

* [新規プロジェクト生成の修正：余分な "app" ディレクトリを削除](https://youtrack.jetbrains.com/issue/KTIJ-23790)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.0**

リリース日: 2022年11月22日

</td>
<td>

* [iOS フレームワーク配布のデフォルトオプションを変更：**Regular framework** になりました](https://youtrack.jetbrains.com/issue/KT-54086)。
* [生成された Android プロジェクトで `MyApplicationTheme` を別のファイルに移動](https://youtrack.jetbrains.com/issue/KT-53991)。
* [生成される Android プロジェクトをアップデート](https://youtrack.jetbrains.com/issue/KT-54658)。
* [新規プロジェクトディレクトリが予期せず消去される問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-23707)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.4**

リリース日: 2022年9月12日

</td>
<td>

* [Android アプリを Jetpack Compose に移行](https://youtrack.jetbrains.com/issue/KT-53162)。
* [古い HMPP フラグを削除](https://youtrack.jetbrains.com/issue/KT-52248)。
* [Android マニフェストからパッケージ名を削除](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [Xcode プロジェクトの `.gitignore` をアップデート](https://youtrack.jetbrains.com/issue/KT-53703)。
* [expect/actual をより分かりやすくするためにウィザードプロジェクトをアップデート](https://youtrack.jetbrains.com/issue/KT-53928)。
* [Android Studio の Canary ビルドとの互換性をアップデート](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [Android アプリの最小 Android SDK を 21 に引き上げ](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [Xcode インストール後の初回起動に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [M1 上での Apple 実行構成に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [Windows OS 上での `local.properties` に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [Android Studio の Canary ビルド上での Kotlin/Native デバッガーに関する問題を修正](https://youtrack.jetbrains.com/issue/KT-53976)。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.3**

リリース日: 2022年6月9日

</td>
<td>

* Kotlin IDE プラグイン 1.7.0 への依存関係をアップデート。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.2**

リリース日: 2022年4月4日

</td>
<td>

* Android Studio 2021.2 および 2021.3 での iOS アプリケーションデバッグにおけるパフォーマンスの問題を修正。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.1**

リリース日: 2022年2月15日

</td>
<td>

* [Kotlin Multiplatform Mobile ウィザードで M1 iOS シミュレーターを有効化](https://youtrack.jetbrains.com/issue/KT-51105)。
* XcProjects のインデックス作成パフォーマンスを向上：[KT-49777](https://youtrack.jetbrains.com/issue/KT-49777)、[KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* ビルドスクリプトのクリーンアップ：`kotlin("test-common")` および `kotlin("test-annotations-common")` の代わりに `kotlin("test")` を使用。
* [Kotlin プラグインバージョン](https://youtrack.jetbrains.com/issue/KTIJ-20167)との互換性範囲を拡大。
* [Windows ホスト上での JVM デバッグに関する問題を修正](https://youtrack.jetbrains.com/issue/KT-50699)。
* [プラグインを無効化した後の無効なバージョンに関する問題を修正](https://youtrack.jetbrains.com/issue/KT-50966)。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.0**

リリース日: 2021年11月16日

</td>
<td>

* [新しい Kotlin Multiplatform Library ウィザード](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* 新しいタイプの Kotlin Multiplatform ライブラリ配布形式をサポート：[XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)。
* 新しいクロスプラットフォームモバイルプロジェクトで[階層的なプロジェクト構造](multiplatform-hierarchy.md#manual-configuration)を有効化。
* [明示的な iOS ターゲット宣言](https://youtrack.jetbrains.com/issue/KT-46861)をサポート。
* [Mac 以外のマシンでも Kotlin Multiplatform Mobile プラグインウィザードを有効化](https://youtrack.jetbrains.com/issue/KT-48614)。
* [Kotlin Multiplatform モジュールウィザードでのサブフォルダをサポート](https://youtrack.jetbrains.com/issue/KT-47923)。
* [Xcode の `Assets.xcassets` ファイルをサポート](https://youtrack.jetbrains.com/issue/KT-49571)。
* [プラグインクラスローダーの例外を修正](https://youtrack.jetbrains.com/issue/KT-48103)。
* CocoaPods Gradle プラグインのテンプレートをアップデート。
* Kotlin/Native デバッガーの型評価を改善。
* Xcode 13 を使用した iOS デバイスの起動を修正。

</td>
<td>

[Kotlin 1.6.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.7**

リリース日: 2021年8月2日

</td>
<td>

* [AppleRunConfiguration に Xcode 構成オプションを追加](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
* [Apple M1 シミュレーターのサポートを追加](https://youtrack.jetbrains.com/issue/KT-47618)。
* [プロジェクトウィザードに Xcode 統合オプションに関する情報を追加](https://youtrack.jetbrains.com/issue/KT-47466)。
* [CocoaPods を使用したプロジェクト生成後、CocoaPods gem がインストールされていない場合のエラー通知を追加](https://youtrack.jetbrains.com/issue/KT-47329)。
* [Kotlin 1.5.30 で生成された共有モジュールに Apple M1 シミュレーターターゲットのサポートを追加](https://youtrack.jetbrains.com/issue/KT-47631)。
* [Kotlin 1.5.20 で生成された Xcode プロジェクトを整理](https://youtrack.jetbrains.com/issue/KT-47465)。
* 実機 iOS デバイスでの Xcode Release 構成の起動を修正。
* Xcode 12.5 を使用したシミュレーターの起動を修正。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.6**

リリース日: 2021年6月10日

</td>
<td>

* Android Studio Bumblebee Canary 1 との互換性。
* [Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html) のサポート：プロジェクトウィザードで Kotlin/Native 用の新しいフレームワークパッキングタスクを使用。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.5**

リリース日: 2021年5月25日

</td>
<td>

* [Android Studio Arctic Fox 2020.3.1 Beta 1 以降との互換性を修正](https://youtrack.jetbrains.com/issue/KT-46834)。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.4**

リリース日: 2021年5月5日

</td>
<td>

このバージョンのプラグインは、Android Studio 4.2 または Android Studio 2020.3.1 Canary 8 以降で使用してください。
* [Kotlin 1.5.0](https://kotlinlang.org/docs/whatsnew15.html) との互換性。
* [iOS 統合のための Kotlin Multiplatform モジュールで CocoaPods 依存関係マネージャーを使用する機能を追加](https://youtrack.jetbrains.com/issue/KT-45946)。

</td>
<td>

[Kotlin 1.5.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.3**

リリース日: 2021年4月5日

</td>
<td>

* [プロジェクトウィザード：モジュール命名の改善](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [iOS 統合のためのプロジェクトウィザードで CocoaPods 依存関係マネージャーを使用する機能を追加](https://youtrack.jetbrains.com/issue/KT-45478)。
* [新規プロジェクトにおける gradle.properties の可読性を向上](https://youtrack.jetbrains.com/issue/KT-42908)。
* ["Add sample tests for Shared Module" のチェックが外れている場合、サンプルテストが生成されないように修正](https://youtrack.jetbrains.com/issue/KT-43441)。
* [修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.2**

リリース日: 2021年3月3日

</td>
<td>

* [Xcode 関連ファイルを Xcode で開く機能を追加](https://youtrack.jetbrains.com/issue/KT-44970)。
* [iOS 実行構成で Xcode プロジェクトファイルの場所を設定する機能を追加](https://youtrack.jetbrains.com/issue/KT-44968)。
* [Android Studio 2020.3.1 Canary 8 をサポート](https://youtrack.jetbrains.com/issue/KT-45162)。
* [修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.1**

リリース日: 2021年2月15日

</td>
<td>

このバージョンのプラグインは Android Studio 4.2 で使用してください。
* インフラストラクチャの改善。
* [修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.0**

リリース日: 2020年11月23日

</td>
<td>

* [iPad デバイスをサポート](https://youtrack.jetbrains.com/issue/KT-41932)。
* [Xcode で構成されたカスタムスキーム名をサポート](https://youtrack.jetbrains.com/issue/KT-41677)。
* [iOS 実行構成にカスタムビルドステップを追加する機能を追加](https://youtrack.jetbrains.com/issue/KT-41678)。
* [カスタム Kotlin/Native バイナリをデバッグする機能を追加](https://youtrack.jetbrains.com/issue/KT-40954)。
* [Kotlin Multiplatform Mobile ウィザードで生成されるコードを簡素化](https://youtrack.jetbrains.com/issue/KT-41712)。
* [Kotlin Android Extensions プラグインのサポートを削除](https://youtrack.jetbrains.com/issue/KT-42121)（Kotlin 1.4.20 で非推奨となりました）。
* [ホストから切断した後の実機デバイス構成の保存に関する問題を修正](https://youtrack.jetbrains.com/issue/KT-42390)。
* その他の修正と改善。

</td>
<td>

[Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.3**

リリース日: 2020年10月2日

</td>
<td>

* iOS 14 および Xcode 12 との互換性を追加。
* Kotlin Multiplatform Mobile ウィザードで作成されるプラットフォームテストの命名を修正。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.2**

リリース日: 2020年9月29日

</td>
<td>

 * [Kotlin 1.4.20-M1](https://kotlinlang.org/docs/eap.html#build-details) との互換性を修正。
 * JetBrains へのエラーレポートをデフォルトで有効化。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

リリース日: 2020年9月10日

</td>
<td>

* Android Studio Canary 8 以降との互換性を修正。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.0**

リリース日: 2020年8月31日

</td>
<td>

* Kotlin Multiplatform Mobile プラグインの最初のバージョン。詳細は [ブログポスト](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/) をご覧ください。

</td>
<td>

* [Kotlin 1.4.0](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

</table>