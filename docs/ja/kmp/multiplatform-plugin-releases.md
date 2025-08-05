[//]: # (title: Kotlin Multiplatform IDEプラグインのリリース)

[Kotlin Multiplatform IDEプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)は、Android、iOS、デスクトップ、ウェブ向けのクロスプラットフォームアプリケーションの開発を支援します。
Kotlin Multiplatformプロジェクトで作業するには、プラグインの最新バージョンを使用していることを確認してください。

> このIDEプラグインは現在macOSのみで利用可能ですが、WindowsおよびLinuxのサポートも近日中に提供される予定です。
> 
{style="note"}

このプラグインは、IntelliJ IDEA (バージョン 2025.1.1.1 以降) と Android Studio (Narwhal 2025.1.1 以降) の両方に対応しています。

> Kotlin Multiplatform Gradleプラグインの詳細については、[DSLリファレンス](multiplatform-dsl-reference.md)と[互換性ガイド](multiplatform-compatibility-guide.md)を参照してください。
> 
{style="tip"}

## 最新リリースへの更新

新しいKotlin Multiplatformプラグインのリリースが利用可能になると、IDEは更新を提案します。
この提案を受け入れると、プラグインは最新バージョンに更新されます。
プラグインのインストールを完了するには、IDEを再起動してください。

プラグインのバージョンを確認し、手動で更新するには、**Settings** | **Plugins** にアクセスします。

プラグインが正しく機能するには、互換性のあるKotlinバージョンが必要です。互換バージョンは[リリース詳細](#release-details)で確認できます。
Kotlinのバージョンを確認して更新するには、**Settings** | **Plugins** または **Tools** | **Kotlin** | **Configure Kotlin in Project** にアクセスします。

> 互換性のあるKotlinバージョンがインストールされていない場合、Kotlin Multiplatformプラグインは無効になります。
> Kotlinのバージョンを更新してから、**Settings** | **Plugins** で再度プラグインを有効にしてください。
>
{style="note"}

## リリース詳細

以下の表に、Kotlin Multiplatform IDEプラグインのリリースをリストします。

<table> 
<tr>
<th>
リリース情報
</th>
<th>
リリースのハイライト
</th>
<th>
互換Kotlinバージョン
</th>
</tr>
<tr id="0.9">
<td>

**0.9**

リリース日: 2025年5月19日

</td>
<td>

Kotlin Multiplatformプラグインはゼロから再構築されました。

* サポートされるIDE向けに統合された**新規プロジェクト**ウィザード。
* Java、Android、Xcode、Gradleなどのセットアップに関する問題を見つけて解決するのに役立つプレフライト環境チェック。
* iOSおよびAndroid向けのデバイスセレクターを備えた、すべてのサポートされるプラットフォーム用の自動生成される実行構成。
* クロス言語サポート: SwiftおよびKotlin向けのクロス言語ナビゲーションとデバッグ、Swift構文のハイライト、およびクイックドキュメント。
* Compose Multiplatformサポート: Kotlin Multiplatformプラグインは、Compose Multiplatformリソース、オートコンプリート、および共通コードのUIプレビューをサポートするようになりました（[以前のCompose Multiplatformプラグイン](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)は安全にアンインストールできます）。
* Compose ホットリロード: アプリケーションを再起動することなくUIの変更を即座に確認できます（デスクトップJVMターゲットの場合）。
    詳細については、[ホットリロードドキュメント](compose-hot-reload.md)を参照してください。

既知の問題:

* Android Studioでは、Composeデバッガーは現在Kotlin 2.1.20および2.1.21では動作しません。
    この問題はKotlin 2.2.0-RC2で修正される予定です。

</td>
<td>

このプラグインは[任意のKotlinバージョン](https://kotlinlang.org/docs/releases.html#release-details)で動作しますが、その機能のほとんどはKotlin 2.1.21に依存しています。
最新の安定版Kotlinバージョンに更新することで、最高の体験が保証されます。

このバージョンではK2モードも必要となるため、**Settings** | **Languages & Frameworks** | **Kotlin** で**Enable K2 mode**にチェックを入れて有効にしてください。

</td>
</tr>
<tr>
<td>

**0.8.4**

リリース日: 2024年12月6日

</td>
<td>

* 安定性とコード解析の改善のために、Kotlinの[K2モード](https://kotlinlang.org/docs/k2-compiler-migration-guide.html#support-in-ides)をサポート。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.3**

リリース日: 2024年7月23日

</td>
<td>

* Xcode互換性問題の修正。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.2**

リリース日: 2024年5月16日

</td>
<td>

* Android Studio Jellyfishと、新しいCanaryバージョンであるKoalaのサポート。
* 共有モジュールに`sourceCompatibility`と`targetCompatibility`の宣言を追加。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.1**

リリース日: 2023年11月9日

</td>
<td>

* Kotlinを1.9.20に更新。
* Jetpack Composeを1.5.4に更新。
* Gradleビルドキャッシュと構成キャッシュをデフォルトで有効化。
* 新しいKotlinバージョンに合わせてビルド構成をリファクタリング。
* iOSフレームワークはデフォルトで静的になりました。
* Xcode 15を搭載したiOSデバイスでの実行に関する問題を修正。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.0**

リリース日: 2023年10月5日

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Gradleバージョンカタログに移行。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android`を`androidTarget`に名前変更。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Kotlinと依存関係のバージョンを更新。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) `-sdk`と`-arch`の代わりに`-destination`引数を使用するようにリファクタリング。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 生成されるファイル名をリファクタリング。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) JVMターゲット構成を追加。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Xcode 15.0をサポート。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 新規モジュールウィザードを実験的状態に移行。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.6.0**

リリース日: 2023年5月24日

</td>
<td>

* 新しいCanary Android Studio Hedgehogのサポート。
* MultiplatformプロジェクトにおけるKotlin、Gradle、およびライブラリのバージョンを更新。
* Multiplatformプロジェクトで新しい[`targetHierarchy.default()`](https://kotlinlang.org/docs/whatsnew1820.html#new-approach-to-source-set-hierarchy)を適用。
* Multiplatformプロジェクトのプラットフォーム固有のファイルにソースセット名サフィックスを適用。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.3**

リリース日: 2023年4月12日

</td>
<td>

* KotlinとComposeのバージョンを更新。
* Xcodeプロジェクトスキームの解析を修正。
* スキームプロダクトタイプのチェックを追加。
* `iosApp`スキームが存在する場合、デフォルトで選択されるようになりました。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.2**

リリース日: 2023年1月30日

</td>
<td>

* [Kotlin/Nativeデバッガーの問題を修正（Spotlightインデックス作成の遅延）](https://youtrack.jetbrains.com/issue/KT-55988)。
* [マルチモジュールプロジェクトでのKotlin/Nativeデバッガーを修正](https://youtrack.jetbrains.com/issue/KT-24450)。
* [Android Studio Giraffe 2022.3.1 Canaryの新しいビルド](https://youtrack.jetbrains.com/issue/KT-55274)。
* [iOSアプリビルド用のプロビジョニングフラグを追加](https://youtrack.jetbrains.com/issue/KT-55204)。
* [生成されたiOSプロジェクトの**Framework Search Paths**オプションに継承されたパスを追加](https://youtrack.jetbrains.com/issue/KT-55402)。

</td>
<td>

[任意のKotlinプラグインバージョン](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.1**

リリース日: 2022年11月30日

</td>
<td>

* [新規プロジェクト生成の修正: 余分な「app」ディレクトリを削除](https://youtrack.jetbrains.com/issue/KTIJ-23790)。

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

* [iOSフレームワーク配布のデフォルトオプションを変更: **Regular framework**になりました](https://youtrack.jetbrains.com/issue/KT-54086)。
* [生成されたAndroidプロジェクトで`MyApplicationTheme`を別のファイルに移動](https://youtrack.jetbrains.com/issue/KT-53991)。
* [生成されたAndroidプロジェクトを更新](https://youtrack.jetbrains.com/issue/KT-54658)。
* [新規プロジェクトディレクトリの予期せぬ消去に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-23707)。

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

* [AndroidアプリをJetpack Composeに移行](https://youtrack.jetbrains.com/issue/KT-53162)。
* [古いHMPPフラグを削除](https://youtrack.jetbrains.com/issue/KT-52248)。
* [Androidマニフェストからパッケージ名を削除](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [Xcodeプロジェクトの`.gitignore`を更新](https://youtrack.jetbrains.com/issue/KT-53703)。
* [expect/actualをよりよく示すためにウィザードプロジェクトを更新](https://youtrack.jetbrains.com/issue/KT-53928)。
* [Android StudioのCanaryビルドとの互換性を更新](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [Androidアプリの最小Android SDKを21に更新](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [Xcodeインストール後の初回起動に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [M1上のApple実行構成に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [Windows OS上の`local.properties`に関する問題を修正](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [Android StudioのCanaryビルドにおけるKotlin/Nativeデバッガーの問題を修正](https://youtrack.jetbrains.com/issue/KT-53976)。

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

* Kotlin IDEプラグイン1.7.0への依存関係を更新。

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

* Android Studio 2021.2および2021.3におけるiOSアプリケーションデバッグのパフォーマンス問題を修正。

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

* [Kotlin Multiplatform MobileウィザードでM1 iOSシミュレーターを有効化](https://youtrack.jetbrains.com/issue/KT-51105)。
* XcProjectsのインデックス作成パフォーマンスを改善: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777)、[KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* ビルドスクリプトのクリーンアップ: `kotlin("test-common")`および`kotlin("test-annotations-common")`の代わりに`kotlin("test")`を使用。
* [Kotlinプラグインバージョン](https://youtrack.jetbrains.com/issue/KTIJ-20167)との互換範囲を拡大。
* [Windowsホスト上でのJVMデバッグの問題を修正](https://youtrack.jetbrains.com/issue/KT-50699)。
* [プラグイン無効化後の無効なバージョンに関する問題を修正](https://youtrack.jetbrains.com/issue/KT-50966)。

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

* [新規Kotlin Multiplatformライブラリウィザード](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* 新しいタイプのKotlin Multiplatformライブラリ配布: [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)をサポート。
* 新しいクロスプラットフォームモバイルプロジェクトで[階層型プロジェクト構造](multiplatform-hierarchy.md#manual-configuration)を有効化。
* [明示的なiOSターゲット宣言](https://youtrack.jetbrains.com/issue/KT-46861)のサポート。
* [Mac以外のマシンでKotlin Multiplatform Mobileプラグインウィザードを有効化](https://youtrack.jetbrains.com/issue/KT-48614)。
* [Kotlin Multiplatformモジュールウィザードにおけるサブフォルダのサポート](https://youtrack.jetbrains.com/issue/KT-47923)。
* [Xcodeの`Assets.xcassets`ファイルのサポート](https://youtrack.jetbrains.com/issue/KT-49571)。
* [プラグインクラスローダーの例外を修正](https://youtrack.jetbrains.com/issue/KT-48103)。
* CocoaPods Gradleプラグインテンプレートを更新。
* Kotlin/Nativeデバッガーの型評価改善。
* Xcode 13でのiOSデバイス起動を修正。

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

* [AppleRunConfigurationのXcode構成オプションを追加](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
* [Apple M1シミュレーターのサポートを追加](https://youtrack.jetbrains.com/issue/KT-47618)。
* [プロジェクトウィザードにXcode統合オプションに関する情報を追加](https://youtrack.jetbrains.com/issue/KT-47466)。
* [CocoaPodsを含むプロジェクトが生成されたが、CocoaPods gemがインストールされていない場合にエラー通知を追加](https://youtrack.jetbrains.com/issue/KT-47329)。
* [Kotlin 1.5.30で生成された共有モジュールにApple M1シミュレーターターゲットのサポートを追加](https://youtrack.jetbrains.com/issue/KT-47631)。
* [Kotlin 1.5.20で生成されたXcodeプロジェクトをクリーンアップ](https://youtrack.jetbrains.com/issue/KT-47465)。
* 実iOSデバイスでのXcodeリリース構成の起動を修正。
* Xcode 12.5でのシミュレーター起動を修正。

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

* Android Studio Bumblebee Canary 1との互換性。
* [Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html)のサポート: プロジェクトウィザードでKotlin/Native用の新しいフレームワークパッキングタスクを使用。

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

* [Android Studio Arctic Fox 2020.3.1 Beta 1以降との互換性を修正](https://youtrack.jetbrains.com/issue/KT-46834)。

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

Android Studio 4.2またはAndroid Studio 2020.3.1 Canary 8以降でこのバージョンのプラグインを使用してください。
* [Kotlin 1.5.0](https://kotlinlang.org/docs/whatsnew15.html)との互換性。
* [iOS統合のためにKotlin MultiplatformモジュールでCocoaPods依存関係マネージャーを使用する機能](https://youtrack.jetbrains.com/issue/KT-45946)。

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

* [プロジェクトウィザード: モジュール命名の改善](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [iOS統合のためにプロジェクトウィザードでCocoaPods依存関係マネージャーを使用する機能](https://youtrack.jetbrains.com/issue/KT-45478)。
* [新規プロジェクトにおける`gradle.properties`の可読性の向上](https://youtrack.jetbrains.com/issue/KT-42908)。
* [「共有モジュールのサンプルテストを追加」のチェックが外されている場合、サンプルテストは生成されなくなりました](https://youtrack.jetbrains.com/issue/KT-43441)。
* [修正およびその他の改善](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%2C%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。

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

* [Xcode関連ファイルをXcodeで開く機能](https://youtrack.jetbrains.com/issue/KT-44970)。
* [iOS実行構成でXcodeプロジェクトファイルの場所を設定する機能](https://youtrack.jetbrains.com/issue/KT-44968)。
* [Android Studio 2020.3.1 Canary 8のサポート](https://youtrack.jetbrains.com/issue/KT-45162)。
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

Android Studio 4.2でこのバージョンのプラグインを使用してください。
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

* [iPadデバイスのサポート](https://youtrack.jetbrains.com/issue/KT-41932)。
* [Xcodeで構成されているカスタムスキーム名のサポート](https://youtrack.jetbrains.com/issue/KT-41677)。
* [iOS実行構成にカスタムビルドステップを追加する機能](https://youtrack.jetbrains.com/issue/KT-41678)。
* [カスタムKotlin/Nativeバイナリをデバッグする機能](https://youtrack.jetbrains.com/issue/KT-40954)。
* [Kotlin Multiplatform Mobileウィザードで生成されるコードを簡素化](https://youtrack.jetbrains.com/issue/KT-41712)。
* Kotlin 1.4.20で非推奨となった[Kotlin Android Extensionsプラグインのサポートを削除](https://youtrack.jetbrains.com/issue/KT-42121)。
* [ホストからの切断後に物理デバイス構成が保存されない問題を修正](https://youtrack.jetbrains.com/issue/KT-42390)。
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

* iOS 14およびXcode 12との互換性を追加。
* Kotlin Multiplatform Mobileウィザードで作成されるプラットフォームテストの命名を修正。

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

 * [Kotlin 1.4.20-M1](https://kotlinlang.org/docs/eap.html#build-details)との互換性を修正。
 * デフォルトでJetBrainsへのエラー報告を有効化。

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

* Android Studio Canary 8以降との互換性を修正。

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

* Kotlin Multiplatform Mobileプラグインの最初のバージョン。詳細については[ブログ記事](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)を参照してください。

</td>
<td>

* [Kotlin 1.4.0](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

</table>