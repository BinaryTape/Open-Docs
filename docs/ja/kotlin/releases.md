[//]: # (title: Kotlinのリリース)

<tldr>
    <p>最新のKotlinバージョン: <strong>%kotlinVersion%</strong></p>
    <p>詳細については<a href="%kotlinLatestWhatsnew%">Kotlin 2.3.0 の新機能</a>を参照してください<!--and find the bug fix details in the <a href="%kotlinLatestUrl%">changelog</a>-->。</p>
</tldr>

Kotlin 2.0.0以降、以下の種類のリリースを提供しています。

*   _言語リリース_ (2._x_._0_): 言語におけるメジャーな変更をもたらし、ツールアップデートを含みます。6ヶ月に1回リリースされます。
*   _ツールリリース_ (2._x_._20_): 言語リリース間に提供され、ツールアップデート、パフォーマンス改善、およびバグ修正を含みます。対応する_言語リリース_の3ヶ月後にリリースされます。
*   _バグ修正リリース_ (2._x_._yz_): _ツールリリース_のバグ修正を含みます。これらのリリースには正確なリリーススケジュールはありません。

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

各言語リリースおよびツールリリースについては、リリース前に新機能を試すことができるように、いくつかのプレビュー版（_EAP_）も提供しています。詳細については[早期アクセスプレビュー](eap.md)を参照してください。

> 新しいKotlinリリースの通知を受け取りたい場合は、[Kotlinニュースレター](https://lp.jetbrains.com/subscribe-to-kotlin-news/)を購読するか、[XでKotlinをフォロー](https://x.com/kotlin)するか、または[Kotlin GitHubリポジトリ](https://github.com/JetBrains/kotlin)で**Watch | Custom | Releases**オプションを有効にしてください。
>
{style="note"}

## 今後のKotlinリリース

今後の安定版Kotlinリリースの概算スケジュールは以下の通りです:

*   **2.3.20**: 2026年3月～4月に予定
*   **2.4.0**: 2026年6月～7月に予定

## 新しいKotlinバージョンへのアップデート

プロジェクトを新しいリリースにアップグレードするには、ビルドシステムでKotlinのバージョンを更新してください。

### Gradle

Kotlin %kotlinVersion% に更新するには、`build.gradle(.kts)` ファイルでKotlin Gradleプラグインのバージョンを変更してください:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // <...>をターゲット環境に適したプラグイン名に置き換えてください
    kotlin("<...>") version "%kotlinVersion%"
    // たとえば、ターゲット環境がJVMの場合:
    // kotlin("jvm") version "%kotlinVersion%"
    // ターゲットがKotlin Multiplatformの場合:
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // <...>をターゲット環境に適したプラグイン名に置き換えてください
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // たとえば、ターゲット環境がJVMの場合: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // ターゲットがKotlin Multiplatformの場合:
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

以前のKotlinバージョンで作成されたプロジェクトがある場合、[kotlinxライブラリのバージョンを更新](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)する必要があるか確認してください。

新しい言語リリースに移行する場合、Kotlinプラグインの移行ツールがそのプロセスを支援します。

> プロジェクトでGradleを操作する方法の詳細については、[Gradleプロジェクトの設定](gradle-configure-project.md)を参照してください。
>
{style="tip"}

### Maven

Kotlin %kotlinVersion% に更新するには、`pom.xml` ファイルのバージョンを変更してください:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

または、`pom.xml` ファイルで`kotlin-maven-plugin` のバージョンを変更することもできます:

```xml
<plugins>
    <plugin>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-plugin</artifactId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

以前のKotlinバージョンで作成されたプロジェクトがある場合、[kotlinxライブラリのバージョンを更新](maven-configure-project.md#dependency-on-a-kotlinx-library)する必要があるか確認してください。

> プロジェクトでMavenを操作する方法の詳細については、[Maven](maven.md)を参照してください。
>
{style="tip"}

## IDEサポート

Kotlinは、JetBrainsが開発した公式Kotlinプラグインにより、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/)および[Android Studio](https://developer.android.com/kotlin/get-started)で完全にすぐに利用可能なサポートを提供します。

IntelliJ IDEAおよびAndroid StudioのK2モードは、K2コンパイラを使用してコード解析、コード補完、およびハイライトを改善します。

IntelliJ IDEA 2025.3以降、K2モードは常に使用されます。

Android Studioでは、2024.1以降で以下の手順に従ってK2モードを有効にできます:

1.  **Settings** | **Languages & Frameworks** | **Kotlin** に移動します。
2.  **Enable K2 mode** オプションを選択します。

K2モードの詳細については、[こちらのブログ](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)を参照してください。

## Kotlinリリースの互換性

[Kotlinリリースの種類とその互換性](kotlin-evolution-principles.md#language-and-tooling-releases)の詳細については、こちらをご覧ください。

## リリースの詳細

次の表に最新のKotlinリリースの詳細を示します。

> [Kotlinの早期アクセスプレビュー (EAP) バージョン](eap.md#build-details)も試すことができます。
>
{style="tip"}

<table>
    <tr>
        <th>ビルド情報</th>
        <th>ビルドのハイライト</th>
    </tr>
    <tr>
        <td><strong>2.3.0</strong>
            <p>リリース日: <strong>2025年12月16日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.3.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい安定した言語機能、ツールアップデート、さまざまなプラットフォーム向けのパフォーマンス改善、および重要な修正を含む言語リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.3.0">変更ログ</a>を参照してください。</p>
        </td>
    </tr> 
    <tr>
        <td><strong>2.2.21</strong>
            <p>リリース日: <strong>2025年10月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Xcode 26 のサポートを含むツールリリースで、その他の改善とバグ修正が含まれています。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">変更ログ</a>を参照してください。</p>
    </td>
    </tr>
    <tr>
        <td><strong>2.2.20</strong>
            <p>リリース日: <strong>2025年9月10日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 向けのツールリリースで、ウェブ開発における重要な変更やその他の改善が含まれています。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.10</strong>
            <p>リリース日: <strong>2025年8月14日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0 のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.2.0</strong>
            <p>リリース日: <strong>2025年6月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい安定した言語機能、ツールアップデート、さまざまなプラットフォーム向けのパフォーマンス改善、および重要な修正を含む言語リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0">変更ログ</a>を参照してください。</p>
        </td>
    </tr> 
    <tr>
        <td><strong>2.1.21</strong>
            <p>リリース日: <strong>2025年5月13日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.20 のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21">変更ログ</a>を参照してください。</p>
        </td>
    </tr> 
   <tr>
        <td><strong>2.1.20</strong>
            <p>リリース日: <strong>2025年3月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
           <p>Kotlin 2.1.0 向けのツールリリースで、新しい実験的機能、パフォーマンス改善、バグ修正が含まれています。</p>
            <p>Kotlin 2.1.20 の詳細については、<a href="whatsnew2120.md" target="_blank">Kotlin 2.1.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.10</strong>
            <p>リリース日: <strong>2025年1月27日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.0 のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.1.0</strong>
            <p>リリース日: <strong>2024年11月27日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能を導入する言語リリースです。</p>
            <p>Kotlin 2.1.0 の詳細については、<a href="whatsnew21.md" target="_blank">Kotlin 2.1.0 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.21</strong>
            <p>リリース日: <strong>2024年10月10日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.20 のバグ修正リリースです。</p>
            <p>詳細については、<a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">変更ログ</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.20</strong>
            <p>リリース日: <strong>2024年8月22日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
           <p>Kotlin 2.0.0 向けのツールリリースで、パフォーマンス改善とバグ修正が含まれています。機能には、Kotlin/Nativeのガベージコレクタにおける並行マーク機能、Kotlin共通標準ライブラリにおけるUUIDサポート、Composeコンパイラのアップデート、Gradle 8.8までのサポートも含まれます。
            </p>
            <p>Kotlin 2.0.20 の詳細については、<a href="whatsnew2020.md" target="_blank">Kotlin 2.0.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.10</strong>
            <p>リリース日: <strong>2024年8月6日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.0 のバグ修正リリースです。</p>
            <p>Kotlin 2.0.0 の詳細については、<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>2.0.0</strong>
            <p>リリース日: <strong>2024年5月21日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>安定版Kotlin K2コンパイラを含む言語リリースです。</p>
            <p>Kotlin 2.0.0 の詳細については、<a href="whatsnew20.md" target="_blank">Kotlin 2.0.0 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.25</strong>
            <p>リリース日: <strong>2024年7月19日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、1.9.23、および 1.9.24 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20 の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.24</strong>
            <p>リリース日: <strong>2024年5月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、1.9.22、および 1.9.23 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20 の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>リリース日: <strong>2024年3月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20、1.9.21、および 1.9.22 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20 の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>リリース日: <strong>2023年12月21日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 および 1.9.21 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20 の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>リリース日: <strong>2023年11月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.20 の詳細については、<a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>リリース日: <strong>2023年11月1日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin K2コンパイラのベータ版と安定版Kotlin Multiplatformを搭載した機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>リリース日: <strong>2023年8月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.0 のバグ修正リリースです。</p>
            <p>Kotlin 1.9.0 の詳細については、<a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 の新機能</a>を参照してください。</p>
            <note>Android Studio Giraffe および Hedgehog の場合、Kotlinプラグイン 1.9.10 は今後のAndroid Studioアップデートで提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>リリース日: <strong>2023年7月6日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin K2コンパイラのアップデート、新しいenumクラス値関数、オープンエンド範囲の新しい演算子、Kotlin MultiplatformでのGradle設定キャッシュのプレビュー、Kotlin MultiplatformでのAndroidターゲットサポートの変更、Kotlin/Nativeでのカスタムメモリアロケータのプレビューを含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 の新機能</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlinの最新情報YouTube動画</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>リリース日: <strong>2023年6月8日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 のバグ修正リリースです。</p>
            <p>Kotlin 1.8.20 の詳細については、<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 の新機能</a>を参照してください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>リリース日: <strong>2023年4月25日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20 のバグ修正リリースです。</p>
            <p>Kotlin 1.8.20 の詳細については、<a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 の新機能</a>を参照してください。</p>
            <note>Android Studio Flamingo および Giraffe の場合、Kotlinプラグイン 1.8.21 は今後のAndroid Studioアップデートで提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>リリース日: <strong>2023年4月3日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin K2コンパイラのアップデート、stdlibのAutoCloseableインターフェースとBase64エンコーディング、デフォルトで有効になった新しいJVMインクリメンタルコンパイル、新しいKotlin/Wasmコンパイラバックエンドを含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 の新機能</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlinの最新情報YouTube動画</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>リリース日: <strong>2023年2月2日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.0 のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a> の詳細については、こちらをご覧ください。</p>
            <note>Android Studio Electric Eel および Flamingo の場合、Kotlinプラグイン 1.8.10 は今後のAndroid Studioアップデートで提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>リリース日: <strong>2022年12月28日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>kotlin-reflectのパフォーマンス向上、JVM向けの新しい再帰的にディレクトリの内容をコピーまたは削除する実験的関数、Objective-C/Swiftの相互運用性改善を含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0 の新機能</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8.0 の互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>リリース日: <strong>2022年11月9日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.20 のバグ修正リリースです。</p>
            <p>Kotlin 1.7.20 の詳細については、<a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 の新機能</a>を参照してください。</p>
            <note>Android Studio Dolphin、Electric Eel、および Flamingo の場合、Kotlinプラグイン 1.7.21 は今後のAndroid Studioアップデートで提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>リリース日: <strong>2022年9月29日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、Kotlin K2コンパイラにおけるいくつかのコンパイラプラグインのサポート、デフォルトで有効になった新しいKotlin/Nativeメモリマネージャー、およびGradle 7.1のサポートを含むインクリメンタルリリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 の新機能</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlinの最新情報YouTube動画</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20 の互換性ガイド</a></li>
            </list>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>リリース日: <strong>2022年7月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.0 のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a> の詳細については、こちらをご覧ください。</p>
            <note>Android Studio Dolphin (213) および Android Studio Electric Eel (221) の場合、Kotlinプラグイン 1.7.10 は今後のAndroid Studioアップデートで提供されます。</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>リリース日: <strong>2022年6月9日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>JVM向けKotlin K2コンパイラのアルファ版、安定化された言語機能、パフォーマンス改善、実験的なAPIの安定化といった進化的な変更を含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0 の新機能</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlinの最新情報YouTube動画</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0 の互換性ガイド</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>リリース日: <strong>2022年4月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.20 のバグ修正リリースです。</p>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>リリース日: <strong>2022年4月4日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>以下のような様々な改善を含むインクリメンタルリリースです:</p>
            <list>
                <li>コンテキストレシーバのプロトタイプ</li>
                <li>関数型インターフェースコンストラクタへの呼び出し可能な参照</li>
                <li>Kotlin/Native: 新しいメモリマネージャーのパフォーマンス改善</li>
                <li>マルチプラットフォーム: デフォルトで階層的なプロジェクト構造</li>
                <li>Kotlin/JS: IRコンパイラの改善</li>
                <li>Gradle: コンパイラ実行戦略</li>
            </list>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>リリース日: <strong>2021年12月14日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.0 のバグ修正リリースです。</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>リリース日: <strong>2021年11月16日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、パフォーマンス改善、実験的なAPIの安定化といった進化的な変更を含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0 の新機能</a></li>
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
            <p>Kotlin 1.5.31 のバグ修正リリースです。</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>リリース日: <strong>2021年9月20日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.30 のバグ修正リリースです。</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>リリース日: <strong>2021年8月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>以下のような様々な改善を含むインクリメンタルリリースです:</p>
            <list>
                <li>JVMでのアノテーションクラスのインスタンス化</li>
                <li>オプトイン要件メカニズムと型推論の改善</li>
                <li>Kotlin/JS IRバックエンドのベータ版</li>
                <li>Apple Siliconターゲットのサポート</li>
                <li>CocoaPodsサポートの改善</li>
                <li>Gradle: Javaツールチェーンのサポートとデーモン設定の改善</li>
            </list>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30 の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>リリース日: <strong>2021年7月13日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.20 のバグ修正リリースです。</p>
            <p><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>リリース日: <strong>2021年6月24日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>以下のような様々な改善を含むインクリメンタルリリースです:</p>
            <list>
                <li>JVMでの<code>invokedynamic</code>を介した文字列結合がデフォルトで有効に</li>
                <li>Lombokのサポート改善とJSpecifyのサポート</li>
                <li>Kotlin/Native: Objective-CヘッダーへのKDocエクスポートと、単一配列内での<code>Array.copyInto()</code>の高速化</li>
                <li>Gradle: アノテーションプロセッサのクラスローダのキャッシュと<code>--parallel</code> Gradleプロパティのサポート</li>
                <li>プラットフォーム間でのstdlib関数の動作の統一</li>
            </list>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20 の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>リリース日: <strong>2021年5月24日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.0 のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2021/05/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>リリース日: <strong>2021年5月5日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>新しい言語機能、パフォーマンス改善、実験的なAPIの安定化といった進化的な変更を含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/05/kotlin-1-5-0-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0 の新機能</a></li>
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
            <p>Kotlin 1.4.30 のバグ修正リリースです。</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>リリース日: <strong>2021年2月25日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30 のバグ修正リリースです。</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>リリース日: <strong>2021年2月3日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>以下のような様々な改善を含むインクリメンタルリリースです:</p>
            <list>
                <li>新しいJVMバックエンド、現在ベータ版</li>
                <li>新しい言語機能のプレビュー</li>
                <li>Kotlin/Nativeのパフォーマンス改善</li>
                <li>標準ライブラリAPIの改善</li>
            </list>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30 の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>リリース日: <strong>2020年12月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.20 のバグ修正リリースです。</p>
            <p><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>リリース日: <strong>2020年11月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>以下のような様々な改善を含むインクリメンタルリリースです:</p>
            <list>
                <li><code>invokedynamic</code>による文字列結合など、新しいJVM機能のサポート</li>
                <li>Kotlin Multiplatform Mobileプロジェクトのパフォーマンスと例外処理の改善</li>
                <li>JDK Pathの拡張機能: <code>Path("dir") / "file.txt"</code></li>
            </list>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20 の新機能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>リリース日: <strong>2020年9月7日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.0 のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a> の詳細については、こちらをご覧ください。</p>
         </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p>リリース日: <strong>2020年8月17日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>主に品質とパフォーマンスに焦点を当てた、多くの機能と改善を含む機能リリースです。</p>
            <p>詳細はこちら:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">リリースブログ投稿</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0 の新機能</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">互換性ガイド</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">Kotlin 1.4.0 への移行</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p>リリース日: <strong>2020年4月15日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHubでのリリース</a></p>
        </td>
        <td>
            <p>Kotlin 1.3.70 のバグ修正リリースです。</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a> の詳細については、こちらをご覧ください。</p>
        </td>
    </tr>
</table>