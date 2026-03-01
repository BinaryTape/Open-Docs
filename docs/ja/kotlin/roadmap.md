[//]: # (title: Kotlin ロードマップ)

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2026年2月</strong></td>
    </tr>
    <tr>
        <td><strong>次回の更新</strong></td>
        <td><strong>2026年8月</strong></td>
    </tr>
</table>

Kotlin ロードマップへようこそ！JetBrains チームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目的は、全体像を提示することにあります。
以下は、私たちが提供に注力している最も重要な方向性である、主要な重点分野のリストです。

* **言語の進化**: 構文の儀式的な記述よりも有意義なセマンティクス（意味論）を重視することで、Kotlin を簡潔かつ表現力豊かな言語に保ちます。
* **マルチプラットフォーム**: 強固な iOS 体験、成熟した Web ターゲット、および信頼性の高い IDE ツーリングを備えた、現代的なクロスプラットフォーム・アプリの基盤を構築します。
* **特定のツールに依存しない（Staying agnostic）**: 開発者がどのようなツールやターゲットを使用していても、それをサポートします。
* **エコシステムのサポート**: Kotlin ライブラリ、ツール、フレームワークの開発および公開プロセスを簡素化します。

## サブシステム別の Kotlin ロードマップ

<!-- 私たちが取り組んでいる最大のプロジェクトを確認するには、[ロードマップの詳細](#roadmap-details) 表をご覧ください。 -->

ロードマップやその項目に関する質問やフィードバックがある場合は、[YouTrack チケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) または Kotlin Slack の [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) チャンネル（[招待をリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）に投稿してください。

<!-- ### YouTrack ボード
問題トラッカー YouTrack の [ロードマップボード](https://youtrack.jetbrains.com/agiles/153-1251/current) をご覧ください。 ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>サブシステム</th>
        <th>現在の注力事項</th>
    </tr>
    <tr id="language">
        <td><strong>言語</strong></td>
        <td>
            <p>Kotlin 言語機能とプロポーザルの<a href="kotlin-language-features-and-proposals.md">全リストを見る</a>。または、<a href="https://youtrack.jetbrains.com/issue/KT-54620">今後の言語機能に関する YouTrack の問題</a>をフォローしてください。</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>コンパイラ</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">ラムダの戻り値の型によるオーバーロード解決の安定化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">共通コードの K2 マルチプラットフォーム増分コンパイルをサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新しい JVM リフレクション：調査、プロトタイプ作成、および実装</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84568" target="_blank">Power-assert プラグインの進化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: ライブラリの <code>wasm-wasi</code> ターゲットを WASI Preview 2 に切り替え</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: コンポーネントモデルのサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-82064" target="_blank">Kotlin/Wasm: マルチモジュールコンパイルのサポート</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>マルチプラットフォーム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305" target="_blank">Swift Export: Alpha リリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84569" target="_blank">Compose Multiplatform の iOS 用に新しい <code>TextInputService</code> を実装</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84570" target="_blank">Swift 6.3 のサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84571" target="_blank">Compose Multiplatform 用の Navigation3 を安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323" target="_blank">マルチプラットフォーム・ライブラリの次世代配布形式を実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべての Kotlin ターゲット間でインライン・セマンティクスを統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS: Kotlin/JS のオンボーディング資料の改善</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS: モダンな JavaScript へのコンパイル</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS: JavaScript への Kotlin 宣言のエクスポートの可能性を拡張</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib アーティファクトの増分コンパイルをデフォルトで有効化</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin Multiplatform 開発ロードマップ</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native デバッガの健全性とパフォーマンスの向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84573" target="_blank">Maven での Kotlin のスマートなデフォルト設定（Java + Kotlin 混在）</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">Kotlin での Swift Package Manager パッケージのインポートをサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">Karma ランナーを非推奨でない代替ツールに置き換え</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin スクリプティングおよび <code>.gradle.kts</code> のエクスペリエンス向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Gradle Project Isolation における Kotlin/JS および Kotlin/Wasm のサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Build Tools API の設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Declarative Gradle をサポートする Kotlin エコシステム・プラグインのリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSP および VS Code のサポート</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>エコシステム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-83525" target="_blank">標準ライブラリのセキュリティ修正に対して 18 か月のサポート期間を導入</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">試験的な <code>kotlinx.serialization</code> API の安定化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank"><code>kotlinx.collections.immutable</code> の安定化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">サーバーサイド向け Kotlin での Lombok コンパイラプラグインのエクスペリエンス向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code> を Beta に昇格</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">KDoc のマシン読み取り可能な表現を実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 配布の UX 向上: コードカバレッジとバイナリ互換性の検証を追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリ用の新しいマルチプラットフォーム API: Unicode およびコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code> ライブラリの安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Unit 以外の値を返し、それが使用されていない Kotlin 関数に対するデフォルトの警告/エラーの導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80324" target="_blank">Kotlin Notebooks の安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">Kotlin DataFrame 1.0 のリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">Kandy 0.9 のリリース</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">Ktor での認証機能の向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938" target="_blank">HTTP/3 サポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026" target="_blank">Kubernetes ジェネレータープラグインの作成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">ジェネレータープラグインとチュートリアルによる Ktor への gRPC サポートの追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">Ktor の管理とオブザーバビリティ（観測可能性）の向上</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-778" target="_blank">Exposed DAO 2.0 のリリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-755" target="_blank">移行用の Gradle プラグインを作成</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップはチームが取り組んでいるすべての事項を網羅したリストではなく、最大のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを約束するものではありません。
> * 私たちは進捗に合わせて優先事項を調整し、約 6 か月ごとにロードマップを更新します。
> 
{style="note"}

## 2025年8月以降の変更点

### 完了した項目

以前のロードマップから以下の項目を**完了**しました。

* ✅ コンパイラ: [JSpecify サポートの仕上げ](https://youtrack.jetbrains.com/issue/KT-75371)
* ✅ コンパイラ: [K1 コンパイラの非推奨化](https://youtrack.jetbrains.com/issue/KT-75372)
* ✅ コンパイラ: [Kotlin/Wasm (<code>wasm-js</code> ターゲット) を Beta に昇格](https://youtrack.jetbrains.com/issue/KT-75370)
* ✅ マルチプラットフォーム: [Concurrent Mark and Sweep (CMS) GC をデフォルトで有効化](https://youtrack.jetbrains.com/issue/KT-71278)
* ✅ マルチプラットフォーム: [Kotlin Multiplatform IDE プラグインでの Windows および Linux のサポート](https://youtrack.jetbrains.com/issue/KMT-789)
* ✅ マルチプラットフォーム: [Compose Multiplatform for Web を Beta でリリース](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)
* ✅ マルチプラットフォーム: [Compose Hot Reload を Stable でリリース](https://blog.jetbrains.com/kotlin/2026/01/compose-multiplatform-1-10-0/)
* ✅ ツール: [Kotlin + JPA のエクスペリエンス向上](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* ✅ ツール: [Kotlin Notebooks: 新しいユースケースのサポート](https://youtrack.jetbrains.com/issue/KTNB-1133)
* ✅ ツール: [IntelliJ IDEA での Kotlin/Wasm プロジェクトの開発エクスペリエンス向上](https://youtrack.jetbrains.com/issue/KT-75374)
* ✅ ツール: [JS/Wasm アーティファクトの NPM 公開機能を追加](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.npm-publish)
* ✅ ツール: [IntelliJ IDEA K2 モードの完全リリース](https://youtrack.jetbrains.com/issue/KTIJ-31316)
* ✅ ツール: [インポートのパフォーマンス向上](https://youtrack.jetbrains.com/issue/KT-75376)
* ✅ エコシステム: [Ktor Client および Server アプリケーションでの OpenAPI 仕様のサポート](https://youtrack.jetbrains.com/issue/KTOR-8316)
* ✅ エコシステム: [Ktor WebRTC クライアント](https://youtrack.jetbrains.com/issue/KTOR-7958)
* ✅ エコシステム: [Ktor での依存関係注入（DI）の使用をシンプルにする](https://youtrack.jetbrains.com/issue/KTOR-6621)
* ✅ エコシステム: [Exposed 1.0.0 のリリース](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* ✅ エコシステム: [Exposed への R2DBC サポートの追加](https://youtrack.jetbrains.com/issue/EXPOSED-74)

### 新規項目

ロードマップに以下の項目を**追加**しました。

* 🆕 コンパイラ: [Kotlin/Wasm: マルチモジュールコンパイルのサポート](https://youtrack.jetbrains.com/issue/KT-82064)
* 🆕 コンパイラ: [Kotlin/Wasm: ライブラリの `wasm-wasi` ターゲットを WASI Preview 2 に切り替え](https://youtrack.jetbrains.com/issue/KT-64568)
* 🆕 コンパイラ: [Kotlin/Wasm: コンポーネントモデルのサポート](https://youtrack.jetbrains.com/issue/KT-64569)
* 🆕 コンパイラ: [ラムダの戻り値の型によるオーバーロード解決の安定化](https://youtrack.jetbrains.com/issue/KT-51107)
* 🆕 コンパイラ: [共通コードの K2 マルチプラットフォーム増分コンパイルをサポート](https://youtrack.jetbrains.com/issue/KT-84567)
* 🆕 コンパイラ: [新しい JVM リフレクション：調査、プロトタイプ作成、および実装](https://youtrack.jetbrains.com/issue/KT-75463)
* 🆕 コンパイラ: [Power-assert プラグインの進化](https://youtrack.jetbrains.com/issue/KT-84568)
* 🆕 マルチプラットフォーム: [Swift Export: Alpha リリース](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 マルチプラットフォーム: [Compose Multiplatform の iOS 用に新しい `TextInputService` を実装](https://youtrack.jetbrains.com/issue/KT-84569)
* 🆕 マルチプラットフォーム: [Swift 6.3 のサポート](https://youtrack.jetbrains.com/issue/KT-84570)
* 🆕 マルチプラットフォーム: [Compose Multiplatform 用の Navigation3 を安定化](https://youtrack.jetbrains.com/issue/KT-84571)
* 🆕 ツール: [Kotlin/Native デバッガの健全性とパフォーマンスの向上](https://youtrack.jetbrains.com/issue/KT-84572)
* 🆕 ツール: [Maven での Kotlin のスマートなデフォルト設定（Java + Kotlin 混在）](https://youtrack.jetbrains.com/issue/KT-84573)
* 🆕 ツール: [Kotlin での Swift Package Manager パッケージのインポートをサポート](https://youtrack.jetbrains.com/issue/KT-53877)
* 🆕 ツール: [Karma ランナーを非推奨でない代替ツールに置き換え](https://youtrack.jetbrains.com/issue/KT-66897)
* 🆕 エコシステム: [標準ライブラリのセキュリティ修正に対して 18 か月のサポート期間を導入](https://youtrack.jetbrains.com/issue/KT-83525)
* 🆕 エコシステム: [試験的な `kotlinx.serialization` API の安定化](https://youtrack.jetbrains.com/issue/KT-84574)
* 🆕 エコシステム: [<code>kotlinx.collections.immutable</code> の安定化](https://youtrack.jetbrains.com/issue/KT-84575)
* 🆕 エコシステム: [サーバーサイド向け Kotlin での Lombok コンパイラプラグインのエクスペリエンス向上](https://youtrack.jetbrains.com/issue/KT-84576)
* 🆕 エコシステム: [Ktor での認証機能の向上](https://youtrack.jetbrains.com/issue/KTOR-9266)
* 🆕 エコシステム: [Exposed DAO 2.0 のリリース](https://youtrack.jetbrains.com/issue/EXPOSED-778)
* 🆕 エコシステム: [Exposed 移行用の Gradle プラグインを作成](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 削除された項目

ロードマップから以下の項目を**削除**しました。

* ❌ コンパイラ: [Kotlin/Wasm: 新しいスレッドプロポーザルを使用したマルチスレッドサポートのプロトタイプ作成](https://youtrack.jetbrains.com/issue/KT-80304)

> 一部の項目はロードマップから削除されましたが、完全に中止されたわけではありません。場合によっては、以前のロードマップ項目を現在の項目に統合しました。
>
{style="note"}