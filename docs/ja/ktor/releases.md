[//]: # (title: Ktor リリース)

<show-structure for="chapter" depth="2"/>

Ktor は [セマンティックバージョニング](https://semver.org/) に従います:

- _メジャーバージョン_ (x.0.0) には、互換性のない API 変更が含まれます。
- _マイナーバージョン_ (x.y.0) は、後方互換性のある新機能を提供します。
- _パッチバージョン_ (x.y.z) には、後方互換性のある修正が含まれます。

各メジャーおよびマイナーリリースでは、新機能がリリースされる前に試用できるよう、複数のプレビュー (EAP) バージョンも提供しています。詳細については、[早期アクセスプログラム](https://ktor.io/eap/) を参照してください。

## Gradle プラグイン {id="gradle"}

[Gradle Ktor プラグイン](https://github.com/ktorio/ktor-build-plugins) とフレームワークは、同じリリースサイクルにあります。すべてのプラグインリリースは、[Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.ktor.plugin) で確認できます。

## IntelliJ Ultimate プラグイン {id="intellij"}

[IntelliJ Ktor プラグイン](https://www.jetbrains.com/help/idea/ktor.html) は、Ktor フレームワークとは独立してリリースされ、[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) と同じリリースサイクルを使用します。

### 新しいリリースへの更新 {id="update"}

IntelliJ Ktor プラグインを使用すると、Ktor プロジェクトを最新バージョンに移行できます。詳細については、[プロジェクトの移行](https://www.jetbrains.com/help/idea/ktor.html#migrate) セクションを参照してください。

## リリース詳細 {id="release-details"}

以下の表は、Ktor の最新リリースの詳細を示しています。

<table>

<tr>
<td>バージョン</td><td>リリース日</td><td>ハイライト</td>
</tr>

<tr>
<td>3.3.1</td><td>2025年10月8日</td><td>
<p>
Kotlin を 2.2.20 に更新し、Content-Length のパースエラー、<code>ClientSSESession</code> のシリアライザーの欠落、Netty の設定およびシャットダウンのバグなど、いくつかの問題を修正し、<code>bootJar</code> 内での静的リソースの提供のサポートを追加するパッチリリースです。
</p>
<var name="version" value="3.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.3.0</td><td>2025年9月11日</td><td>
<p>
実験的な OpenAPI 生成プレビュー、改善された静的コンテンツ処理、Android および JS/Wasm 用 WebRTC クライアントなどの主要な機能を導入し、Jetty、OkHttp、Kotlin 2.2 へアップグレードするマイナーリリースです。詳細については、<Links href="/ktor/whats-new-330" summary="undefined">Ktor 3.3.0 の新機能</Links> を参照してください。
</p>
<var name="version" value="3.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.2.3</td><td>2025年7月29日</td><td>
<p>
YAML 設定の処理、DI 解決、および Wasm/JS の安定性に対する改善を導入し、マルチパート解析、CIO の `100 Continue` レスポンスフォーマット、`ByteReadChannel` での無限読み取りループ、およびサーバーシャットダウンの問題に対する修正を含むパッチリリースです。
</p>
<var name="version" value="3.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.2.2</td><td>2025年7月14日</td><td>
<p>
SSE フィールドのシリアライズ順序を改善し、CORS プリフライト処理、テストアプリケーションのストリーミング、設定のデシリアライズにおけるバグ、およびプラットフォームを跨いだヘッダーの欠落 (<code>wasmJs</code> および <code>Darwin</code> ターゲットに影響する 3.2.1 からのリグレッションを含む) など、いくつかの問題を解決するパッチリリースです。
</p>
<var name="version" value="3.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.2.1</td><td>2025年7月4日</td><td>
<p>
タイム API、テンプレート処理、およびパブリッシングに対する改善、さらにプラグインの動作、Netty、OkHttp、および 3.2.0 で導入された起動の問題に対する重大なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="3.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.2.0</td><td>2025年6月12日</td><td>
<p>
型付き設定のデシリアライズ、新しい依存性注入と HTMX モジュール、Gradle バージョンカタログのサポート、および <code>suspend</code> モジュールのサポートを導入するマイナーリリースです。詳細については、<Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0 の新機能</Links> を参照してください。
</p>
<var name="version" value="3.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.1.3</td><td>2025年5月5日</td><td><p>
より高速なバイト操作やマルチパート処理、より安全なトークン更新処理など、パフォーマンスの改善を含むパッチリリースです。また、メトリクスにおけるメモリの問題を修正し、ヘッダーの動作を改善し、WebSockets、OkHttp、Apache5、Netty にわたるバグを解決するとともに、Kotlin 2.1.0 のサポートのために JTE を更新します。
</p>
<var name="version" value="3.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.1.2</td><td>2025年3月27日</td><td><p>
Kotlin を 2.1.20 に更新し、Base64 デコード、認証トークンのクリア、Android サーバーの起動エラー、WebSocket ヘッダーのフォーマット、SSE セッションのキャンセルなど、様々な問題を修正するパッチリリースです。
</p>
<var name="version" value="3.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.1.1</td><td>2025年2月24日</td><td><p>
ロギングを改善し、WebSocket タイムアウト処理を修正するパッチリリースです。HTTP キャッシュの不整合、フォームデータのコピーエラー、gzip 処理のクラッシュ、セグメントプール破損を引き起こす並行処理の問題など、複数のバグを修正します。
</p>
<var name="version" value="3.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.1.0</td><td>2025年2月11日</td><td><p>
様々な SSE 機能と拡張された CIO エンジンおよび WebSocket のサポートを導入するマイナーリリースです。プラットフォーム互換性、ロギング、認証を強化するとともに、バイトチャネル処理、HTTP リクエストの失敗、および並行処理の問題に関連する重大なバグを修正します。
</p>
<var name="version" value="3.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.3</td><td>2024年12月18日</td><td><p>
<code>browserProductionWebpack</code> でのビルドエラー、gzip されたコンテンツの処理、および <code>FormFieldLimit</code> 設定の上書きの修正を含む、様々なバグ修正を伴うパッチリリースです。このリリースには、コアパフォーマンスの改善と適切なテストアプリケーションのシャットダウンも含まれています。
</p>
<var name="version" value="3.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.2</td><td>2024年12月4日</td><td><p>
レスポンスの破損、切り詰められたボディ、接続処理、および不正確なヘッダーに関連する複数のバグ修正に対処するパッチリリースです。また、拡張されたバイナリエンコーディングサポートと Android のパフォーマンス強化も含まれています。
</p>
<var name="version" value="3.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.13</td><td>2024年11月20日</td><td><p>
バグ修正、セキュリティパッチ、および改善を含むパッチリリースで、<code>watchosDeviceArm64</code> ターゲットのサポートが追加されました。
</p>
<var name="version" value="2.3.13"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.1</td><td>2024年10月29日</td><td><p>
クライアントおよびサーバーのロギングの改善、および様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="3.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0</td><td>2024年10月9日</td><td><p>
Android Native ターゲットのサポートが追加されるなど、改善とバグ修正を含むメジャーリリースです。破壊的変更の詳細については、<Links href="/ktor/migrating-3" summary="undefined">移行ガイド</Links> を参照してください。
</p>
<var name="version" value="3.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-2</td><td>2024年10月2日</td><td><p>
XML のマルチプラットフォームサポートなど、破壊的変更、バグ修正、および機能を含む様々な改善を伴うメジャーリリースの候補版です。
</p>
<var name="version" value="3.0.0-rc-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-1</td><td>2024年9月9日</td><td><p>
大幅な改善とバグ修正を含むメジャーリリースの候補版です。このアップデートにより、後方互換性が強化され、拡張された <code>staticZip</code> のサポートが特徴です。
</p>
<var name="version" value="3.0.0-rc-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-2</td><td>2024年7月15日</td><td><p>
SSE サポートの改善や Kotlin/Wasm 用 Ktor クライアントなど、様々な改善とバグ修正を含むメジャーのプレリリースバージョンです。
</p>
<var name="version" value="3.0.0-beta-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.12</td><td>2024年6月20日</td><td><p>
Ktor Core および Ktor Server のバグ修正、および Netty と OpenAPI のバージョン更新を含むパッチリリースです。
</p>
<var name="version" value="2.3.12"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.11</td><td>2024年5月9日</td><td><p>
テストクライアントのエンジンにソケットタイムアウトを適用するバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.11"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.10</td><td>2024年4月8日</td><td><p>
<code>CallLogging</code> および <code>SSE</code> サーバープラグインの様々なバグ修正、Android クライアントのロギング改善などが含まれるパッチリリースです。
</p>
<var name="version" value="2.3.10"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.9</td><td>2024年3月4日</td><td><p>
<code>ContentNegotiation</code> クライアントプラグインのバグ修正、および HTTP 経由でセキュアなクッキーを送信するサポートが追加されたパッチリリースです。
</p>
<var name="version" value="2.3.9"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.8</td><td>2024年1月31日</td><td><p>
<code>URLBuilder</code>、<code>CORS</code>、および <code>WebSocket</code> プラグインの様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.7</td><td>2023年12月7日</td><td>
<p>
<code>ContentNegotiation</code>、WebSockets、および Native Server でのメモリ使用量におけるバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.7"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-1</td><td>2023年11月23日</td><td>
<p>
クライアントおよびサーバーの SSE サポートなど、様々な改善とバグ修正を含むメジャーのプレリリースバージョンです。
</p>
<var name="version" value="3.0.0-beta-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.6</td><td>2023年11月7日</td><td>
<p>
2.3.5 での破壊的変更に対する修正と、その他の様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.6"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.5</td><td>2023年10月5日</td><td>
<p>
Darwin および Apache5 エンジン設定の修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.5"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.4</td><td>2023年8月31日</td><td>
<p>
HTTP Cookie ヘッダーと NoTransformationFoundException エラーのバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.3</td><td>2023年8月1日</td><td>
<p>
<code>linuxArm64</code> のクライアントとサーバーのサポート、および様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.2</td><td>2023年6月28日</td><td>
<p>
Kotlin バージョンを `1.8.22` にアップグレードし、様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.1</td><td>2023年5月31日</td><td>
<p>
サーバー設定の改善と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.3.0</td><td>2023年4月19日</td><td>
<p>
複数の設定ファイル、ルーティングでの正規表現パターンなどのサポートを追加する機能リリースです。
</p>
<var name="version" value="2.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.2.4</td><td>2023年2月28日</td><td>
<p>
HTTP クライアント、ルーティング、および <code>ContentNegotiation</code> の様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.2.3</td><td>2023年1月31日</td><td>
<p>
<code>OAuth2</code> のマルチプラットフォーム機能と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.2.2</td><td>2023年1月3日</td><td>
<p>
<code>2.2.1</code> のバグ修正、Swagger プラグインの改善と修正などを含むパッチリリースです。
</p>
<var name="version" value="2.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.2.1</td><td>2022年12月7日</td><td>
<p>
<code>2.2.0</code> における `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` エラーに対するパッチリリースです。
</p>
<var name="version" value="2.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.2.0</td><td>2022年12月7日</td><td>
<p>
Swagger UI ホスティング、新しいプラグイン API、<code>Sessions</code> のマルチプラットフォームサポートなど、複数の機能リリースです。詳細については、<Links href="/ktor/migration-to-22x" summary="undefined"><code>2.0.x</code> から <code>2.2.x</code> への移行</Links> ガイドを参照してください。
</p>
<var name="version" value="2.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.1.3</td><td>2022年10月26日</td><td>
<p>
様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.1.2</td><td>2022年9月29日</td><td>
<p>
ルーティング、テストエンジン、および Ktor クライアントのバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.1.1</td><td>2022年9月6日</td><td>
<p>
Ktor クライアントおよびサーバーの様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.1.0</td><td>2022年8月11日</td><td>
<p>
YAML 設定のサポートを追加するマイナーリリースであり、その他様々な改善とバグ修正が含まれています。
</p>
<var name="version" value="2.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.0.3</td><td>2022年6月28日</td><td>
<p>
バグ修正と `kotlinx.coroutines` バージョンを `1.6.2` にアップグレードしたものを含むパッチリリースです。
</p>
<var name="version" value="2.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.0.2</td><td>2022年5月27日</td><td>
<p>
様々な改善、バグ修正、および依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="2.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.0.1</td><td>2022年4月28日</td><td>
<p>
様々なバグ修正と Kotlin バージョンを `1.6.21` に更新したものを含むパッチリリースです。
</p>
<var name="version" value="2.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>2.0.0</td><td>2022年4月11日</td><td>
<p>
更新された API ドキュメントと様々な新機能を含むメジャーリリースです。破壊的変更と `1.x.x` からの移行方法の詳細については、<Links href="/ktor/migration-to-20x" summary="undefined">移行ガイド</Links> を参照してください。
</p>
<var name="version" value="2.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

<tr>
<td>1.6.8</td><td>2022年3月15日</td><td>
<p>
依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="1.6.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub で変更履歴を見る</a>
</p>
</td>
</tr>

</table>