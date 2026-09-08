[//]: # (title: Kotlin ロードマップ)

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2026年8月</strong></td>
    </tr>
    <tr>
        <td><strong>次回の更新</strong></td>
        <td><strong>2027年2月</strong></td>
    </tr>
</table>

Kotlin ロードマップへようこそ！JetBrains チームの優先事項をいち早くご紹介します。

## 主要な優先事項 {id="key-priorities"}

このロードマップの目的は、全体像を提示することにあります。
以下は、私たちが提供に注力している最も重要な方向性である、主要な重点分野のリストです。

* **言語の進化**: 構文の儀式的な記述よりも使いやすさ（エルゴノミクス）と安全性を重視することで、Kotlin を簡潔かつ表現力豊かな言語に保ちます。
* **Kotlin マルチプラットフォーム**: 強固な iOS 体験、成熟した Web ターゲット、および信頼性の高い IDE ツーリングを備えた、現代的なクロスプラットフォーム・アプリの基盤を構築します。
* **特定のツールに依存しない（Staying agnostic）**: 開発者がどのようなツールやターゲットを使用していても、それをサポートします。
* **サードパーティ製エコシステム作者のエクスペリエンス**: Kotlin ライブラリ、ツール、フレームワークの開発および公開プロセスを簡素化します。

## サブシステム別の Kotlin ロードマップ {id="kotlin-roadmap-by-subsystem"}

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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88663" target="_blank">Kotlin/Wasm を Stable に昇格</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88664" target="_blank">KAPT のパフォーマンスを Java APT に匹敵するレベルに向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">ラムダの戻り値の型によるオーバーロード解決の安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">共通コードの K2 マルチプラットフォーム増分コンパイルをサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">新しい JVM リフレクション：調査、プロトタイプ作成、および実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: ライブラリの <code>wasm-wasi</code> ターゲットを WASI Preview 2 に切り替え</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: コンポーネントモデルのサポート</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>マルチプラットフォーム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/SKIKO-982" target="_blank">Skiko の Graphite によるレンダリングの信頼性向上と将来を見据えた GPU サポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">Kotlin/Native デバッガの Xcode 統合</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86791" target="_blank">Swift Export: Alpha から Beta へ</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/CMP-10598" target="_blank">Compose Multiplatform for iOS で Native Text Input をデフォルトに設定</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86492" target="_blank">リリースモードでの Native コンパイラキャッシュ</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべての Kotlin ターゲット間でインライン・セマンティクスを統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS: Kotlin/JS のオンボーディング資料の改善</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS: モダンな JavaScript へのコンパイル</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS: JavaScript への Kotlin 宣言のエクスポートの可能性を拡張</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib アーティファクトの増分コンパイルをデフォルトで有効化</a></li>
            </list>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88545" target="_blank">統合されたコンパイラプラグイン・バンドルにより、Maven での Kotlin 導入を効率化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">Kotlin/Native デバッガの Xcode 統合</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88546" target="_blank">構成キャッシュを有効にせずに Native タスクの並列化を可能にする</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTC-5718" target="_blank">Kotlin Toolchain: Kotlin への単一のエントリポイント</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native デバッガの健全性とパフォーマンスの向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">Kotlin での Swift Package Manager パッケージのインポートをサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">Karma ランナーを非推奨でない代替ツールに置き換え</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Gradle Project Isolation における Kotlin/JS および Kotlin/Wasm のサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Build Tools API の設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSP および VS Code のサポート</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>エコシステム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88665" target="_blank">Kotlin 標準ライブラリ型に対する JPA/Hibernate のファーストクラスのサポートを実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">試験的な <code>kotlinx.serialization</code> API の安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">サーバーサイド向け Kotlin での Lombok コンパイラプラグインのエクスペリエンス向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank"><code>kotlinx.collections.immutable</code> の安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code> を Beta に昇格</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">KDoc のマシン読み取り可能な表現を実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリ用の新しいマルチプラットフォーム API: Unicode およびコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code> ライブラリの安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Unit 以外の値を返し、それが使用されていない Kotlin 関数に対するデフォルトの警告/エラーの導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">Kotlin DataFrame 1.0 のリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">Kandy 0.9 のリリース</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">Ktor での認証機能の向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9498" target="_blank">HTTP/3 サポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">ジェネレータープラグインとチュートリアルによる Ktor への gRPC サポートの追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">Ktor の管理とオブザーバビリティ（観測可能性）の向上</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-819" target="_blank">Exposed DAO 2.0 のリリース</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップはチームが取り組んでいるすべての事項を網羅したリストではなく、最大のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを約束するものではありません。
> * 私たちは進捗に合わせて優先事項を調整し、約 6 か月ごとにロードマップを更新します。
> 
{style="note"}

## 2026年2月以降の変更点 {id="what-s-changed-since-february-2026"}

### 完了した項目 {id="completed-items"}

以前のロードマップから以下の項目を**完了**しました。

* ✅ コンパイラ: [Power-assert プラグインの進化](https://youtrack.jetbrains.com/issue/KT-84568)
* ✅ コンパイラ: [Kotlin/Wasm: マルチモジュールコンパイルのサポート](https://youtrack.jetbrains.com/issue/KT-82064)
* ✅ マルチプラットフォーム: [Swift Export: Alpha リリース](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ マルチプラットフォーム: [Compose Multiplatform の iOS 用に新しい <code>TextInputService</code> を実装](https://youtrack.jetbrains.com/issue/KT-84569)
* ✅ マルチプラットフォーム: [Swift 6.3 のサポート](https://youtrack.jetbrains.com/issue/KT-84570)
* ✅ マルチプラットフォーム: [Compose Multiplatform 用の Navigation3 を安定化](https://youtrack.jetbrains.com/issue/KT-84571)
* ✅ ツール: [Maven での Kotlin のスマートなデフォルト設定（Java + Kotlin 混在）](https://youtrack.jetbrains.com/issue/KT-84573)
* ✅ ツール: [Declarative Gradle をサポートする Kotlin エコシステム・プラグインのリリース](https://youtrack.jetbrains.com/issue/KT-71292)
* ✅ エコシステム: [Kotlin 配布の UX 向上: コードカバレッジとバイナリ互換性の検証を追加](https://youtrack.jetbrains.com/issue/KT-71297)
* ✅ エコシステム: [標準ライブラリのセキュリティ修正に対して 18 か月のサポート期間を導入](https://youtrack.jetbrains.com/issue/KT-83525)
* ✅ エコシステム: [Exposed 移行用の Gradle プラグインを作成](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 新規項目 {id="new-items"}

ロードマップに以下の項目を**追加**しました。

* 🆕 コンパイラ: [Kotlin/Wasm を Stable に昇格](https://youtrack.jetbrains.com/issue/KT-88663)
* 🆕 コンパイラ: [KAPT のパフォーマンスを Java APT に匹敵するレベルに向上](https://youtrack.jetbrains.com/issue/KT-88664)
* 🆕 マルチプラットフォーム: [Skiko の Graphite によるレンダリングの信頼性向上と将来を見据えた GPU サポート](https://youtrack.jetbrains.com/issue/SKIKO-982)
* 🆕 マルチプラットフォーム: [Swift Export: Alpha から Beta へ](https://youtrack.jetbrains.com/issue/KT-86791)
* 🆕 マルチプラットフォーム: [Compose Multiplatform for iOS で Native Text Input をデフォルトに設定](https://youtrack.jetbrains.com/issue/CMP-10598)
* 🆕 マルチプラットフォーム: [リリースモードでの Native コンパイラキャッシュ](https://youtrack.jetbrains.com/issue/KT-86492)
* 🆕 ツール: [統合されたコンパイラプラグイン・バンドルにより、Maven での Kotlin 導入を効率化](https://youtrack.jetbrains.com/issue/KT-88545)
* 🆕 ツール: [Kotlin/Native デバッガの Xcode 統合](https://youtrack.jetbrains.com/issue/KMT-2910)
* 🆕 ツール: [構成キャッシュを有効にせずに Native タスク의 並列化を可能にする](https://youtrack.jetbrains.com/issue/KT-88546)
* 🆕 ツール: [Kotlin Toolchain: Kotlin への単一のエントリポイント](https://youtrack.jetbrains.com/issue/KTC-5718)
* 🆕 エコシステム: [Kotlin 標準ライブラリ型に対する JPA/Hibernate のファーストクラスのサポートを実装](https://youtrack.jetbrains.com/issue/KT-88665)

### 削除された項目 {id="removed-items"}

ロードマップから以下の項目を**削除**しました。

* ❌ マルチプラットフォーム: [マルチプラットフォーム・ライブラリの次世代配布形式を実装](https://youtrack.jetbrains.com/issue/KT-68323)
* ❌ ツール: [Kotlin スクリプティングおよび <code>.gradle.kts</code> のエクスペリエンス向上](https://youtrack.jetbrains.com/issue/KT-49511)
* ❌ エコシステム: [Kotlin Notebooks の安定化](https://youtrack.jetbrains.com/issue/KT-80324)