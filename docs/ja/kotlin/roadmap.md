[//]: # (title: Kotlinロードマップ)

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2025年2月</strong></td>
    </tr>
    <tr>
        <td><strong>次回更新</strong></td>
        <td><strong>2025年8月</strong></td>
    </tr>
</table>

Kotlinロードマップへようこそ！JetBrainsチームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目標は、全体像をお伝えすることです。
以下に、私たちが提供に注力している最も重要な方向性である、主要な重点分野をリストアップします。

*   **言語の進化**: より効率的なデータ処理、抽象度の向上、明確なコードによるパフォーマンスの強化。
*   **Kotlin Multiplatform**: KotlinからSwiftへのダイレクトエクスポートのリリース、ビルド設定の合理化、マルチプラットフォームライブラリ作成の簡素化。
*   **サードパーティエコシステムの開発者エクスペリエンス**: Kotlinライブラリ、ツール、フレームワークの開発および公開プロセスの簡素化。

## サブシステム別Kotlinロードマップ

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

ロードマップまたはその項目についてご質問やフィードバックがございましたら、[YouTrackチケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)またはKotlin Slackの[#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4)チャンネル（[招待をリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）までお気軽にお寄せください。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>サブシステム</th>
        <th>現在の重点事項</th>
    </tr>
    <tr id="language">
        <td><strong>言語</strong></td>
        <td>
            <p>Kotlin言語の機能と提案の<a href="kotlin-language-features-and-proposals.md">全リストを見る</a>か、<a href="https://youtrack.jetbrains.com/issue/KT-54620">今後の言語機能に関するYouTrackイシュー</a>をフォローしてください。</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>コンパイラ</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecifyサポートの最終化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1コンパイラの非推奨化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (`wasm-js`ターゲット) のベータ版への昇格</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: ライブラリの`wasm-wasi`ターゲットをWASI Preview 2に切り替え</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Component Modelのサポート</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Exportの最初の公開リリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GCをデフォルトで有効化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">異なるプラットフォームでのklibクロスコンパイルの安定化</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">マルチプラットフォームライブラリの次世代配布形式を実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">プロジェクトレベルでのKotlin Multiplatform依存関係の宣言をサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべてのKotlinターゲット間でのインラインセマンティクスの統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib成果物のインクリメンタルコンパイルをデフォルトで有効化</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform開発ロードマップ</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEAにおけるKotlin/Wasmプロジェクトの開発体験の向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">インポートのパフォーマンス向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">XCFrameworksにおけるリソースのサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: よりスムーズなアクセスと改善されたエクスペリエンス</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2モードの完全リリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">Build Tools APIの設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Declarative GradleをサポートするKotlinエコシステムプラグイン</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Gradleプロジェクト分離のサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Kotlin/NativeツールチェインとGradleの統合を改善</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Kotlinビルドレポートの改善</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Gradle DSLにおける安定したコンパイラ引数の公開</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlinスクリプトと`.gradle.kts`での体験を改善</a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>ライブラリエコシステム</strong></td>
        <td>
            <p><b>ライブラリエコシステムのロードマップ項目:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Dokka HTML出力UIの洗練</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">未使用の非ユニット値を返すKotlin関数に対するデフォルトの警告/エラーの導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリの新しいマルチプラットフォームAPI: Unicodeとコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">`kotlinx-io`ライブラリの安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin配布のUXを改善: コードカバレッジとバイナリ互換性検証の追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">`kotlinx-datetime`のベータ版への昇格</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">KtorにgRPCサポートをジェネレータープラグインとチュートリアル付きで追加</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">バックエンドアプリケーションのプロジェクト構造化を簡素化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLIジェネレーターをSNAPに公開</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetesジェネレータープラグインの作成</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">依存性注入の使用を簡素化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3のサポート</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0のリリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBCサポートの追加</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップは、チームが取り組んでいるすべてのことを網羅したものではなく、最大規模のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを約束するものではありません。
> * 私たちは進捗に応じて優先順位を調整し、約6ヶ月ごとにロードマップを更新します。
> 
{style="note"}

## 2024年9月以降の変更点

### 完了した項目

以前のロードマップから以下の項目を**完了しました**。

*   ✅ コンパイラ: [Androidでのインライン関数のデバッグサポート](https://youtrack.jetbrains.com/issue/KT-60276)
*   ✅ コンパイラ: [コンパイラの診断品質の向上](https://youtrack.jetbrains.com/issue/KT-71275)
*   ✅ Multiplatform: [KotlinでのXcode 16サポート](https://youtrack.jetbrains.com/issue/KT-71287)
*   ✅ Multiplatform: [Kotlin Gradle Pluginの公開APIリファレンスの公開](https://youtrack.jetbrains.com/issue/KT-71288)
*   ✅ ツール: [Kotlin/Wasmターゲット向けにすぐに使えるデバッグ体験を提供](https://youtrack.jetbrains.com/issue/KT-71276)
*   ✅ ライブラリエコシステム: [Dokkatooベースの新しいDokka Gradleプラグインの実装](https://youtrack.jetbrains.com/issue/KT-71293)
*   ✅ ライブラリエコシステム: [標準ライブラリの新しいマルチプラットフォームAPI: アトミック](https://youtrack.jetbrains.com/issue/KT-62423)
*   ✅ ライブラリエコシステム: [ライブラリ作成者向けガイドラインの拡張](https://youtrack.jetbrains.com/issue/KT-71299)

### 新しい項目

ロードマップに以下の項目を**追加しました**。

*   🆕 コンパイラ: [JSpecifyサポートの最終化](https://youtrack.jetbrains.com/issue/KT-75371)
*   🆕 コンパイラ: [K1コンパイラの非推奨化](https://youtrack.jetbrains.com/issue/KT-75372)
*   🆕 コンパイラ: [Kotlin/Wasm (`wasm-js`ターゲット) のベータ版への昇格](https://youtrack.jetbrains.com/issue/KT-75370)
*   🆕 ツール: [IntelliJ IDEAにおけるKotlin/Wasmプロジェクトの開発体験の向上](https://youtrack.jetbrains.com/issue/KT-75374)
*   🆕 ツール: [インポートのパフォーマンス向上](https://youtrack.jetbrains.com/issue/KT-75376)
*   🆕 ツール: [XCFrameworksにおけるリソースのサポート](https://youtrack.jetbrains.com/issue/KT-75377)
*   🆕 ツール: [Kotlin Notebookでのよりスムーズなアクセスと改善されたエクスペリエンス](https://youtrack.jetbrains.com/issue/KTNB-898)
*   🆕 Ktor: [KtorにgRPCサポートをジェネレータープラグインとチュートリアル付きで追加](https://youtrack.jetbrains.com/issue/KTOR-1501)
*   🆕 Ktor: [バックエンドアプリケーションのプロジェクト構造化を簡素化](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   🆕 Ktor: [CLIジェネレーターをSNAPに公開](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   🆕 Ktor: [Kubernetesジェネレータープラグインの作成](https://youtrack.jetbrains.com/issue/KTOR-6026)
*   🆕 Ktor: [依存性注入の使用を簡素化](https://youtrack.jetbrains.com/issue/KTOR-6621)
*   🆕 Ktor: [HTTP/3のサポート](https://youtrack.jetbrains.com/issue/KTOR-7938)
*   🆕 Exposed: [1.0.0のリリース](https://youtrack.jetbrains.com/issue/EXPOSED-444)
*   🆕 Exposed: [R2DBCサポートの追加](https://youtrack.jetbrains.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 進行中の項目

その他、以前に特定されたすべてのロードマップ項目は進行中です。進捗状況は、それぞれの[YouTrackチケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)で確認できます。