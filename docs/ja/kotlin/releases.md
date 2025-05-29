[//]: # (title: Kotlinのリリース)

<tldr>
    <p>最新のKotlinバージョン: <strong>%kotlinVersion%</strong></p>
    <p>詳細については<a href="%kotlinLatestWhatsnew%">Kotlin %kotlinVersion% の新機能</a>を参照してください</p>
</tldr>

Kotlin 2.0.0以降、以下の種類のリリースを提供しています。

*   _言語リリース_ (2._x_._0_)：言語のメジャーな変更とツール更新を含むリリース。6ヶ月に1回リリースされます。
*   _ツールリリース_ (2._x_._20_)：言語リリースの間に提供され、ツールの更新、パフォーマンス改善、バグ修正を含むリリース。対応する_言語リリース_の3ヶ月後にリリースされます。
*   _バグ修正リリース_ (2._x_._yz_)：_ツールリリース_のバグ修正を含むリリース。これらのリリースの正確なスケジュールはありません。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

各言語リリースおよびツールリリースに加えて、新機能がリリースされる前に試せるプレビュー (_EAP_) バージョンもいくつか提供しています。詳細については[早期アクセスプレビュー](eap.md)を参照してください。

> 新しいKotlinリリースについて通知を受けたい場合は、[Kotlinニュースレター](https://lp.jetbrains.com/subscribe-to-kotlin-news/)を購読するか、[XでKotlinをフォロー](https://x.com/kotlin)するか、[Kotlin GitHubリポジトリ](https://github.com/JetBrains/kotlin)で**Watch | Custom | Releases**オプションを有効にしてください。
> 
{style="note"}

## 新しいKotlinバージョンへのアップデート

プロジェクトを新しいリリースにアップグレードするには、ビルドスクリプトファイルを更新する必要があります。
たとえば、Kotlin %kotlinVersion% に更新するには、`build.gradle(.kts)`ファイルでKotlin Gradleプラグインのバージョンを変更します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // `<...>`をターゲット環境に適したプラグイン名に置き換えてください
    kotlin("<...>") version "%kotlinVersion%"
    // 例として、ターゲット環境がJVMの場合：
    // kotlin("jvm") version "%kotlinVersion%"
    // ターゲットがKotlin Multiplatformの場合：
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // `<...>`をターゲット環境に適したプラグイン名に置き換えてください
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // 例として、ターゲット環境がJVMの場合： 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // ターゲットがKotlin Multiplatformの場合：
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

以前のKotlinバージョンで作成されたプロジェクトがある場合は、プロジェクト内のKotlinバージョンを変更し、必要に応じて`kotlinx`ライブラリを更新してください。

新しい言語リリースに移行する場合、Kotlinプラグインの移行ツールが移行を支援します。

## IDEのサポート

Kotlinは、JetBrainsが開発した公式Kotlinプラグインにより、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)と[Android Studio](https://developer.android.com/kotlin/get-started)で完全にすぐに使えるサポートを提供しています。

IntelliJ IDEAとAndroid StudioのK2モードは、K2コンパイラを使用してコード分析、コード補完、ハイライトを改善します。

IntelliJ IDEA 2025.1から、K2モードは[デフォルトで有効化されています](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

Android Studioでは、2024.1から以下の手順でK2モードを有効にできます。

1.  **Settings** | **Languages & Frameworks** | **Kotlin** に移動します。
2.  **Enable K2 mode** オプションを選択します。

K2モードの詳細については、[私たちのブログ](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)をご覧ください。

## Kotlinリリースの互換性

[Kotlinリリースの種類とその互換性](kotlin-evolution-principles.md#language-and-tooling-releases)について詳しく学ぶ

## リリースの詳細

以下の表に、最新のKotlinリリースの詳細を示します。

> [Kotlinの早期アクセスプレビュー (EAP) バージョン](eap.md#build-details)も試すことができます。
> 
{style="tip"}

<table>
    <tr>
        <th>ビルド情報</th>
        <th>ビルドのハイライト</th>
    </tr>
    <tr>
        <td><strong>2.1.21</strong>
            <p>リリース日: <strong>2025年5月13日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.20のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21">変更ログ</a>を参照してください。</p>
        </td>
    </tr> 
   <tr>
        <td><strong>2.1.20</strong>
            <p>リリース日: <strong>2025年3月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
           <p>Kotlin 2.1.0のツールリリースで、新しい実験的機能、パフォーマンス改善、バグ修正が含まれています。</p>
            <p>Kotlin 2.1.20の詳細については、<a href="whatsnew2120.md" target="_blank">Kotlin 2.1.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.10</strong>
            <p>リリース日: <strong>2025年1月27日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.0のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.0</strong>
            <p>リリース日: <strong>2024年11月27日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能が導入された言語リリースです。</p>
            <p>Kotlin 2.1.0の詳細については、<a href="whatsnew21.md" target="_blank">Kotlin 2.1.0の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.21</strong>
            <p>リリース日: <strong>2024年10月10日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.20のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.20</strong>
            <p>リリース日: <strong>2024年8月22日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
           <p>Kotlin 2.0.0のツールリリースで、パフォーマンス改善とバグ修正が含まれています。Kotlin/Nativeのガベージコレクターにおける並行マーキング、Kotlin共通標準ライブラリにおけるUUIDサポート、Composeコンパイラの更新、Gradle 8.8までのサポートも含まれています。
            </p>
            <p>Kotlin 2.0.20の詳細については、<a href="whatsnew2020.md" target="_blank">Kotlin 2.0.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.10</strong>
            <p>リリース日: <strong>2024年8月6日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.0のバグ修正リリースです。</p>
            <p>Kotlin 2.0.0の詳細については、<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.0</strong>
            <p>リリース日: <strong>2024年5月21日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>安定版Kotlin K2コンパイラを搭載した言語リリースです。</p>
            <p>Kotlin 2.0.0の詳細については、<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.25</strong>
            <p>リリース日: <strong>2024年7月19日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、1.9.23、および1.9.24のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.24</strong>
            <p>リリース日: <strong>2024年5月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、および1.9.23のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>リリース日: <strong>2024年3月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、および1.9.22のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>リリース日: <strong>2023年12月21日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20および1.9.21のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>リリース日: <strong>2023年11月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>リリース日: <strong>2023年11月1日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>ベータ版のKotlin K2コンパイラと安定版Kotlin Multiplatformを搭載した機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>リリース日: <strong>2023年8月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.0のバグ修正リリースです。</p>
            <p>Kotlin 1.9.0の詳細については、<a href="whatsnew19.md" target="_blank">Kotlin 1.9.0の新機能</a>をご覧ください。</p>
            <note>Android Studio GiraffeおよびHedgehogの場合、Kotlinプラグイン1.9.10は今後のAndroid Studioの更新と共に提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>リリース日: <strong>2023年7月6日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin K2コンパイラの更新、新しい列挙クラス値関数、オープンエンド範囲の新しい演算子、Kotlin MultiplatformでのGradle設定キャッシュのプレビュー、Kotlin MultiplatformでのAndroidターゲットサポートの変更、Kotlin/Nativeでのカスタムメモリ割り当てのプレビューを含む機能リリースです。
            </p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0の新機能</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlinの新機能YouTube動画</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>リリース日: <strong>2023年6月8日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20のバグ修正リリースです。</p>
            <p>Kotlin 1.8.20の詳細については、<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20の新機能</a>をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>リリース日: <strong>2023年4月25日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20のバグ修正リリースです。</p>
            <p>Kotlin 1.8.20の詳細については、<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20の新機能</a>をご覧ください。</p>
            <note>Android Studio FlamingoおよびGiraffeの場合、Kotlinプラグイン1.8.21は今後のAndroid Studioの更新と共に提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>リリース日: <strong>2023年4月3日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin K2コンパイラの更新、`stdlib`における`AutoCloseable`インターフェースと`Base64`エンコーディング、デフォルトで有効になった新しいJVMインクリメンタルコンパイル、新しいKotlin/Wasmコンパイラバックエンドを含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20の新機能</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlinの新機能YouTube動画</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>リリース日: <strong>2023年2月2日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.0のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>の詳細をご覧ください。</p>
            <note>Android Studio Electric EelおよびFlamingoの場合、Kotlinプラグイン1.8.10は今後のAndroid Studioの更新と共に提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>リリース日: <strong>2022年12月28日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>`kotlin-reflect`のパフォーマンス改善、JVM向けにディレクトリコンテンツを再帰的にコピーまたは削除する新しい実験的関数、Objective-C/Swiftとの相互運用性の改善を含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0の新機能</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8.0の互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>リリース日: <strong>2022年11月9日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.20のバグ修正リリースです。</p>
            <p>Kotlin 1.7.20の詳細については、<a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20の新機能</a>をご覧ください。</p>
            <note>Android Studio Dolphin、Electric Eel、およびFlamingoの場合、Kotlinプラグイン1.7.21は今後のAndroid Studioの更新と共に提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>リリース日: <strong>2022年9月29日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、Kotlin K2コンパイラにおけるいくつかのコンパイラプラグインのサポート、デフォルトで有効になった新しいKotlin/Nativeメモリマネージャー、およびGradle 7.1のサポートを含むインクリメンタルリリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20の新機能</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlinの新機能YouTube動画</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20の互換性ガイド</a></li>
            </list>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>リリース日: <strong>2022年7月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.0のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>の詳細をご覧ください。</p>
            <note>Android Studio Dolphin (213) およびAndroid Studio Electric Eel (221) の場合、Kotlinプラグイン1.7.10は今後のAndroid Studioの更新と共に提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>リリース日: <strong>2022年6月9日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>JVM向けにアルファ版のKotlin K2コンパイラ、安定化された言語機能、パフォーマンス改善、実験的APIの安定化といった進化的変更を含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0の新機能</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlinの新機能YouTube動画</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0の互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>リリース日: <strong>2022年4月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.20のバグ修正リリースです。</p>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>リリース日: <strong>2022年4月4日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>様々な改善を含むインクリメンタルリリースです。</p>
            <list>
                <li>コンテキストレシーバーのプロトタイプ</li>
                <li>関数型インターフェースコンストラクタへの呼び出し可能な参照</li>
                <li>Kotlin/Native: 新しいメモリマネージャーのパフォーマンス改善</li>
                <li>Multiplatform: デフォルトで階層的なプロジェクト構造</li>
                <li>Kotlin/JS: IRコンパイラの改善</li>
                <li>Gradle: コンパイラの実行戦略</li>
            </list>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>リリース日: <strong>2021年12月14日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.0のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>リリース日: <strong>2021年11月16日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、パフォーマンス改善、実験的APIの安定化といった進化的変更を含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0の新機能</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>リリース日: <strong>2021年11月29日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.31のバグ修正リリースです。</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>リリース日: <strong>2021年9月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.30のバグ修正リリースです。</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>リリース日: <strong>2021年8月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>様々な改善を含むインクリメンタルリリースです。</p>
            <list>
                <li>JVM上のアノテーションクラスのインスタンス化</li>
                <li>改善されたオプトイン要件メカニズムと型推論</li>
                <li>ベータ版のKotlin/JS IRバックエンド</li>
                <li>Apple Siliconターゲットのサポート</li>
                <li>改善されたCocoaPodsサポート</li>
                <li>Gradle: Javaツールチェーンのサポートとデーモン設定の改善</li>
            </list>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>リリース日: <strong>2021年7月13日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.20のバグ修正リリースです。</p>
            <p><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>リリース日: <strong>2021年6月24日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>様々な改善を含むインクリメンタルリリースです。</p>
            <list>
                <li>デフォルトでJVM上での`invokedynamic`を介した文字列連結</li>
                <li>改善されたLombokのサポートとJSpecifyのサポート</li>
                <li>Kotlin/Native: Objective-CヘッダーへのKDocエクスポートと、単一配列内でのより高速な`Array.copyInto()`</li>
                <li>Gradle: アノテーションプロセッサのクラスローダーのキャッシュと`--parallel` Gradleプロパティのサポート</li>
                <li>プラットフォーム間での`stdlib`関数の動作の統一</li>
            </list>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>リリース日: <strong>2021年5月24日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.0のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>リリース日: <strong>2021年5月5日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、パフォーマンス改善、実験的APIの安定化といった進化的変更を含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0の新機能</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>リリース日: <strong>2021年3月22日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30のバグ修正リリースです。</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>リリース日: <strong>2021年2月25日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30のバグ修正リリースです。</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>リリース日: <strong>2021年2月3日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>様々な改善を含むインクリメンタルリリースです。</p>
            <list>
                <li>新しいJVMバックエンド、現在ベータ版</li>
                <li>新しい言語機能のプレビュー</li>
                <li>Kotlin/Nativeのパフォーマンス改善</li>
                <li>標準ライブラリAPIの改善</li>
            </list>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>リリース日: <strong>2020年12月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.20のバグ修正リリースです。</p>
            <p><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a>の詳細をご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>リリース日: <strong>2020年11月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>様々な改善を含むインクリメンタルリリースです。</p>
            <list>
                <li>`invokedynamic`を介した文字列連結など、新しいJVM機能のサポート</li>
                <li>Kotlin Multiplatform Mobileプロジェクトのパフォーマンスと例外処理の改善</li>
                <li>JDK Pathの拡張: `Path("dir") / "file.txt"`</li>
            </list>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>リリース日: <strong>2020年9月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.0のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>の詳細をご覧ください。</p>
         </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p>リリース日: <strong>2020年8月17日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>品質とパフォーマンスに主に焦点を当てた多くの機能と改善を含む機能リリースです。</p>
            <p>詳細については以下をご覧ください：</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">リリースブログ記事</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0の新機能</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">互換性ガイド</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">Kotlin 1.4.0への移行</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p>リリース日: <strong>2020年4月15日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.3.70のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>の詳細をご覧ください。</p>
        </td>
    </tr>
</table>