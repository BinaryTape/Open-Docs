---
title: "Kotlin リリース"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   最新のKotlinバージョン: <strong>2.1.20</strong>
</p>
<p>
   詳細は<a href="whatsnew2120.md">Kotlin 2.1.20の新機能</a>を参照してください
</p>

:::

Kotlin 2.0.0以降、以下のリリースの種類を提供しています。

* _言語リリース_（2._x_._0_）。言語に大きな変更をもたらし、ツール更新が含まれます。6ヶ月に1回リリースされます。
* _ツールリリース_（2._x_._20_）。言語リリースの間に提供され、ツール、パフォーマンスの改善、およびバグ修正が含まれます。対応する_言語リリース_から3ヶ月後にリリースされます。
* _バグ修正リリース_（2._x_._yz_）。_ツールリリース_のバグ修正が含まれます。これらのリリースに対する正確なリリーススケジュールはありません。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

各言語およびツールリリースに対して、リリース前に新機能を試せるように、いくつかのプレビュー（_EAP_）バージョンも提供しています。詳細は[Early Access Preview](eap)を参照してください。

:::note
Kotlinの新しいリリースに関する通知を受け取りたい場合は、[Kotlin newsletter](https://lp.jetbrains.com/subscribe-to-kotlin-news/)を購読するか、[Kotlin on X](https://x.com/kotlin)をフォローするか、[Kotlin GitHub repository](https://github.com/JetBrains/kotlin)で**Watch | Custom | Releases**オプションを有効にしてください。

:::

## 新しいKotlinバージョンへのアップデート

プロジェクトを新しいリリースにアップグレードするには、ビルドスクリプトファイルを更新する必要があります。たとえば、Kotlin 2.1.20に更新するには、`build.gradle(.kts)`ファイルのKotlin Gradle pluginのバージョンを変更します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "2.1.20"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "2.1.20"
    // If your target is Kotlin Multiplatform:
    // kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
    // If your target is Kotlin Multiplatform:
    // id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

以前のKotlinバージョンで作成されたプロジェクトがある場合は、プロジェクト内のKotlinバージョンを変更し、必要に応じてkotlinxライブラリを更新してください。

新しい言語リリースに移行する場合は、Kotlin pluginの移行ツールが移行を支援します。

## IDEのサポート

K2 compilerのリリース後も、IntelliJ IDEAおよびAndroid Studioは、コード解析、コード補完、強調表示、およびその他のIDE関連機能のために、デフォルトで以前のコンパイラーを使用します。

2024.1以降、IntelliJ IDEAは新しいK2 compilerを使用して、K2 modeでコードを分析できます。
これを有効にするには、**Settings** | **Languages & Frameworks** | **Kotlin**に移動し、**Enable K2 mode**オプションを選択します。

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

K2 modeを有効にすると、コンパイラーの動作の変更により、IDE分析に違いが生じる場合があります。
新しいK2 compilerが以前のコンパイラーとどのように異なるかについては、[migration guide](k2-compiler-migration-guide)を参照してください。

## Kotlinリリース互換性

[Kotlinリリースの種類とその互換性](kotlin-evolution-principles#language-and-tooling-releases)についてさらに詳しく学びましょう。

## リリースの詳細

次の表に、最新のKotlinリリースの詳細を示します。

:::tip
[KotlinのEarly Access Preview (EAP) バージョン](eap#build-details)を試すこともできます。

:::
<table>
<tr>
        <th>ビルド情報</th>
        <th>ビルドのハイライト</th>
</tr>
<tr>
<td>
<strong>2.1.20</strong>
<p>
   リリース日: <strong>2025年3月20日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   新しい実験的機能、パフォーマンスの改善、およびバグ修正を含む、Kotlin 2.1.0のツールリリース。
</p>
<p>
   Kotlin 2.1.20の詳細については、<a href="whatsnew2120" target="_blank">Kotlin 2.1.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.10</strong>
<p>
   リリース日: <strong>2025年1月27日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0のバグ修正リリース
</p>
<p>
   詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">changelog</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.0</strong>
<p>
   リリース日: <strong>2024年11月27日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   新しい言語機能を導入する言語リリース。
</p>
<p>
   Kotlin 2.1.0の詳細については、<a href="whatsnew21" target="_blank">Kotlin 2.1.0の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.21</strong>
<p>
   リリース日: <strong>2024年10月10日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.20のバグ修正リリース
</p>
<p>
   詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">changelog</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.20</strong>
<p>
   リリース日: <strong>2024年8月22日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0のツールリリース。パフォーマンスの改善とバグ修正が含まれています。機能には、Kotlin/Nativeのガベージコレクターでの同時マーキング、Kotlin共通標準ライブラリでのUUIDサポート、Composeコンパイラーの更新、およびGradle 8.8までのサポートも含まれます。
</p>
<p>
   Kotlin 2.0.20の詳細については、<a href="whatsnew2020" target="_blank">Kotlin 2.0.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.10</strong>
<p>
   リリース日: <strong>2024年8月6日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0のバグ修正リリース。
</p>
<p>
   Kotlin 2.0.0の詳細については、<a href="whatsnew20" target="_blank">Kotlin 2.0.0の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.0</strong>
<p>
   リリース日: <strong>2024年5月21日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   安定版Kotlin K2 compilerを備えた言語リリース。
</p>
<p>
   Kotlin 2.0.0の詳細については、<a href="whatsnew20" target="_blank">Kotlin 2.0.0の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.25</strong>
<p>
   リリース日: <strong>2024年7月19日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22、1.9.23、および1.9.24のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.20の詳細については、<a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.24</strong>
<p>
   リリース日: <strong>2024年5月7日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、1.9.22、および1.9.23のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.20の詳細については、<a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.23</strong>
<p>
   リリース日: <strong>2024年3月7日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20、1.9.21、および1.9.22のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.20の詳細については、<a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.22</strong>
<p>
   リリース日: <strong>2023年12月21日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20および1.9.21のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.20の詳細については、<a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.21</strong>
<p>
   リリース日: <strong>2023年11月23日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.20の詳細については、<a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.20</strong>
<p>
   リリース日: <strong>2023年11月1日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   ベータ版のKotlin K2 compilerと安定版のKotlin Multiplatformを備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew1920" target="_blank">Kotlin 1.9.20の新機能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.9.10</strong>
<p>
   リリース日: <strong>2023年8月23日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.0のバグ修正リリース。
</p>
<p>
   Kotlin 1.9.0の詳細については、<a href="whatsnew19" target="_blank">Kotlin 1.9.0の新機能</a>を参照してください。
</p>
            <note>Android Studio GiraffeおよびHedgehogの場合、Kotlin plugin 1.9.10は今後のAndroid Studiosのアップデートで提供されます。</note>
</td>
</tr>
<tr>
<td>
<strong>1.9.0</strong>
<p>
   リリース日: <strong>2023年7月6日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin K2 compilerのアップデート、新しいenum class values関数、オープンエンド範囲の新しい演算子、Kotlin MultiplatformでのGradle configuration cacheのプレビュー、Kotlin MultiplatformでのAndroidターゲットサポートの変更、Kotlin/Nativeでのカスタムメモリアロケーターのプレビューを備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew19" target="_blank">Kotlin 1.9.0の新機能</a></li>
<li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlinの新機能YouTubeビデオ</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.22</strong>
<p>
   リリース日: <strong>2023年6月8日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20のバグ修正リリース。
</p>
<p>
   Kotlin 1.8.20の詳細については、<a href="whatsnew1820" target="_blank">Kotlin 1.8.20の新機能</a>を参照してください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.8.21</strong>
<p>
   リリース日: <strong>2023年4月25日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20のバグ修正リリース。
</p>
<p>
   Kotlin 1.8.20の詳細については、<a href="whatsnew1820" target="_blank">Kotlin 1.8.20の新機能</a>を参照してください。
</p>
            <note>Android Studio FlamingoおよびGiraffeの場合、Kotlin plugin 1.8.21は今後のAndroid Studiosのアップデートで提供されます。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.20</strong>
<p>
   リリース日: <strong>2023年4月3日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin K2 compilerのアップデート、stdlibのAutoCloseableインターフェースとBase64エンコーディング、デフォルトで有効になっている新しいJVMインクリメンタルコンパイル、新しいKotlin/Wasmコンパイラーバックエンドを備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew1820" target="_blank">Kotlin 1.8.20の新機能</a></li>
<li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlinの新機能YouTubeビデオ</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.10</strong>
<p>
   リリース日: <strong>2023年2月2日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.0のバグ修正リリース。
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>の詳細をご覧ください。
</p>
            <note>Android Studio Electric EelおよびFlamingoの場合、Kotlin plugin 1.8.10は今後のAndroid Studiosのアップデートで提供されます。</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.0</strong>
<p>
   リリース日: <strong>2022年12月28日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   kotlin-reflectパフォーマンスの向上、JVM用の新しい再帰的なコピーまたは削除ディレクトリコンテンツ実験的関数、Objective-C/Swiftの相互運用性の向上を備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew18" target="_blank">Kotlin 1.8.0の新機能</a></li>
<li><a href="compatibility-guide-18" target="_blank">Kotlin 1.8.0の互換性ガイド</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.7.21</strong>
<p>
   リリース日: <strong>2022年11月9日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.20のバグ修正リリース。
</p>
<p>
   Kotlin 1.7.20の詳細については、<a href="whatsnew1720" target="_blank">Kotlin 1.7.20の新機能</a>を参照してください。
</p>
            <note>Android Studio Dolphin、Electric Eel、およびFlamingoの場合、Kotlin plugin 1.7.21は今後のAndroid Studiosのアップデートで提供されます。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.20</strong>
<p>
   リリース日: <strong>2022年9月29日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   新しい言語機能、Kotlin K2 compilerでのいくつかのコンパイラープラグインのサポート、デフォルトで有効になっている新しいKotlin/Native memory manager、およびGradle 7.1のサポートを備えたインクリメンタルリリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew1720" target="_blank">Kotlin 1.7.20の新機能</a></li>
<li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlinの新機能YouTubeビデオ</a></li>
<li><a href="compatibility-guide-1720" target="_blank">Kotlin 1.7.20の互換性ガイド</a></li>
</list>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.7.10</strong>
<p>
   リリース日: <strong>2022年7月7日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.0のバグ修正リリース。
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>の詳細をご覧ください。
</p>
            <note>Android Studio Dolphin (213) および Android Studio Electric Eel (221) の場合、Kotlin plugin 1.7.10 は今後の Android Studios のアップデートで提供されます。</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.0</strong>
<p>
   リリース日: <strong>2022年6月9日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   JVM用のアルファ版のKotlin K2 compiler、安定化された言語機能、パフォーマンスの改善、および実験的APIの安定化などの進化的変更を備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="whatsnew17" target="_blank">Kotlin 1.7.0の新機能</a></li>
<li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlinの新機能YouTubeビデオ</a></li>
<li><a href="compatibility-guide-17" target="_blank">Kotlin 1.7.0の互換性ガイド</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.6.21</strong>
<p>
   リリース日: <strong>2022年4月20日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.20のバグ修正リリース。
</p>
<p>
   <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.20</strong>
<p>
   リリース日: <strong>2022年4月4日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   次のようなさまざまな改善を備えたインクリメンタルリリース。
</p>
<list>
<li>context receiversのプロトタイプ</li>
<li>関数型インターフェースコンストラクターへの呼び出し可能参照</li>
<li>Kotlin/Native：新しいmemory managerのパフォーマンス改善</li>
<li>Multiplatform：デフォルトによる階層的なプロジェクト構造</li>
<li>Kotlin/JS：IRコンパイラーの改善</li>
<li>Gradle：コンパイラー実行戦略</li>
</list>
<p>
   <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.10</strong>
<p>
   リリース日: <strong>2021年12月14日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.0のバグ修正リリース。
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.0</strong>
<p>
   リリース日: <strong>2021年11月16日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   新しい言語機能、パフォーマンスの改善、および実験的APIの安定化などの進化的変更を備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">リリースブログ投稿</a></li>
<li><a href="whatsnew16" target="_blank">Kotlin 1.6.0の新機能</a></li>
<li><a href="compatibility-guide-16" target="_blank">互換性ガイド</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.32</strong>
<p>
   リリース日: <strong>2021年11月29日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.31のバグ修正リリース。
</p>
<p>
   <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.31</strong>
<p>
   リリース日: <strong>2021年9月20日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.30のバグ修正リリース。
</p>
<p>
   <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.30</strong>
<p>
   リリース日: <strong>2021年8月23日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   次のようなさまざまな改善を備えたインクリメンタルリリース。
</p>
<list>
<li>JVMでのアノテーションクラスのインスタンス化</li>
<li>改善されたオプトイン要件メカニズムと型推論</li>
<li>ベータ版のKotlin/JS IRバックエンド</li>
<li>Apple Siliconターゲットのサポート</li>
<li>改善されたCocoaPodsサポート</li>
<li>Gradle：Java toolchainサポートと改善されたデーモン構成</li>
</list>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">リリースブログ投稿</a></li>
<li><a href="whatsnew1530" target="_blank">Kotlin 1.5.30の新機能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.21</strong>
<p>
   リリース日: <strong>2021年7月13日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.20のバグ修正リリース。
</p>
<p>
   <a href="whatsnew1520" target="_blank">Kotlin 1.5.20</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.20</strong>
<p>
   リリース日: <strong>2021年6月24日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   次のようなさまざまな改善を備えたインクリメンタルリリース。
</p>
<list>
<li>デフォルトでJVM上の`invokedynamic`経由の文字列連結</li>
<li>Lombokのサポートの改善とJSpecifyのサポート</li>
<li>Kotlin/Native：Objective-CヘッダーへのKDocエクスポートと、1つの配列内でのより高速な`Array.copyInto()`</li>
<li>Gradle：アノテーションプロセッサーのクラスローダーのキャッシュと`--parallel` Gradleプロパティのサポート</li>
<li>プラットフォーム間で調整されたstdlib関数の動作</li>
</list>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">リリースブログ投稿</a></li>
<li><a href="whatsnew1520" target="_blank">Kotlin 1.5.20の新機能</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.10</strong>
<p>
   リリース日: <strong>2021年5月24日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.0のバグ修正リリース。
</p>
<p>
   <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>の詳細をご覧ください。
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.0</strong>
<p>
   リリース日: <strong>2021年5月5日</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHubでのリリース</a>
</p>
</td>
<td>

<p>
   新しい言語機能、パフォーマンスの改善、および実験的APIの安定化などの進化的変更を備えた機能リリース。
</p>
<p>
   詳細については以下を参照してください。
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">リリースブログ投稿</a></li>
<li><a href="whatsnew15" target="_blank">Kotlin 1.5.0の新機能</a></li>
<li><a href="compatibility-guide-15" target="_blank">互換性ガイド</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.4.32</strong>
<p>
   リリース日: <strong>2021年3月22日</strong>
</p>
</td>
</tr>
</table>