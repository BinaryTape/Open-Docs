[//]: # (title: Ktor のリリース)

<show-structure for="chapter" depth="2"/>

Ktor は [Semantic Versioning](https://semver.org/) に準拠しています。

*   _メジャーバージョン_ (x.0.0) には、互換性のない API の変更が含まれます。
*   _マイナーバージョン_ (x.y.0) には、後方互換性のある新機能が含まれます。
*   _パッチバージョン_ (x.y.z) には、後方互換性のある修正が含まれます。

メジャーおよびマイナーリリースごとに、リリース前に新機能を試せるように複数のプレビュー (EAP) バージョンも提供しています。詳細については、[早期アクセスプログラム](https://ktor.io/eap/)を参照してください。

## Gradle プラグイン {id="gradle"}

[Gradle Ktor プラグイン](https://github.com/ktorio/ktor-build-plugins)とフレームワークは同じリリースサイクルでリリースされます。すべてのプラグインリリースは、[Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.ktor.plugin) で確認できます。

## IntelliJ Ultimate プラグイン {id="intellij"}

[IntelliJ Ktor プラグイン](https://www.jetbrains.com/help/idea/ktor.html)は Ktor フレームワークとは独立してリリースされ、[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html) と同じリリースサイクルを使用します。

### 新しいリリースへの更新 {id="update"}

IntelliJ Ktor プラグインを使用すると、Ktor プロジェクトを最新バージョンに移行できます。
詳細については、[プロジェクトの移行](https://www.jetbrains.com/help/idea/ktor.html#migrate)セクションを参照してください。

## リリース詳細 {id="release-details"}

次の表に、最新の Ktor リリースの詳細を示します。

<table>
<tr><td>バージョン</td><td>リリース日</td><td>ハイライト</td></tr>
<tr><td>3.1.3</td><td>May 5, 2025</td><td><p>
バイト操作の高速化 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8412">byte operations</a>) やマルチパート処理の改善 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8407">multipart handling</a>)、より安全なトークン更新処理 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8107">safer token refresh handling</a>) などのパフォーマンス改善を含むパッチリリースです。また、メトリクスにおけるメモリの問題 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8276">memory issues in metrics</a>) を修正し、ヘッダーの動作を改善 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8326">improves header behavior</a>) し、WebSockets、OkHttp、Apache5、Netty におけるバグを解決し、Kotlin 2.1.0 のサポートのために JTE を更新 (<a href="https://youtrack.jetbrains.com/issue/KTOR-8030">updates JTE for Kotlin 2.1.0 support</a>) します。
</p>
<var name="version" value="3.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.2</td><td>March 27, 2025</td><td><p>
Kotlin を 2.1.20 に更新し、Base64 デコード、認証トークンのクリア、Android サーバー起動エラー、WebSocket ヘッダーのフォーマット、SSE セッションのキャンセルなど、様々な問題を修正したパッチリリースです。
</p>
<var name="version" value="3.1.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.1</td><td>February 24, 2025</td><td><p>
ロギングを改善し、WebSocket のタイムアウト処理を修正するパッチリリースです。HTTP キャッシュの不整合、フォームデータコピーエラー、gzip 処理のクラッシュ、セグメントプール破損を引き起こす並行処理の問題など、複数のバグを修正します。
</p>
<var name="version" value="3.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.0</td><td>February 11, 2025</td><td><p>
様々な SSE 機能と拡張された CIO エンジンおよび WebSocket サポートを導入するマイナーリリースです。バイトチャネル処理、HTTP リクエストの失敗、並行処理の問題に関連する重大なバグを修正しつつ、プラットフォーム互換性、ロギング、認証を強化します。
</p>
<var name="version" value="3.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.3</td><td>December 18, 2024</td><td><p>
`browserProductionWebpack` におけるビルドエラー、gzipped コンテンツ処理、`FormFieldLimit` 設定の上書きの修正を含む、様々なバグ修正を伴うパッチリリースです。このリリースには、コアのパフォーマンス改善と適切なテストアプリケーションのシャットダウンも含まれています。
</p>
<var name="version" value="3.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.2</td><td>December 4, 2024</td><td><p>
レスポンスの破損、ボディの途切れ、接続処理、誤ったヘッダーに関連する複数のバグ修正に加え、バイナリエンコーディングの拡張サポートと Android 向けパフォーマンス強化を扱うパッチリリースです。
</p>
<var name="version" value="3.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.13</td><td>November 20, 2024</td><td><p>
`watchosDeviceArm64` ターゲットのサポート追加を含む、バグ修正、セキュリティパッチ、改善を伴うパッチリリースです。
</p>
<var name="version" value="2.3.13"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.1</td><td>October 29, 2024</td><td><p>
クライアントおよびサーバーのロギングの改善と、様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="3.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0</td><td>October 9, 2024</td><td><p>
Android Native ターゲットのサポート追加を含む、改善とバグ修正を伴うメジャーリリースです。破壊的変更の詳細については、[移行ガイド](https://ktor.io/docs/migrating-3.html)を参照してください。
</p>
<var name="version" value="3.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
破壊的変更、バグ修正、XML のマルチプラットフォームサポートなどの機能を伴う様々な改善を含むメジャーリリース候補版です。
</p>
<var name="version" value="3.0.0-rc-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
重要な改善とバグ修正を含むメジャーリリース候補版です。このアップデートは後方互換性を強化し、拡張された `staticZip` サポートを特徴としています。破壊的変更の詳細については、[移行ガイド](https://ktor.io/docs/eap/migrating-3.html)を参照してください。
</p>
<var name="version" value="3.0.0-rc-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
SSE サポートの改善や Kotlin/Wasm 用 Ktor クライアントなど、様々な改善とバグ修正を含むメジャープレリリースバージョンです。破壊的変更の詳細については、[移行ガイド](https://ktor.io/docs/3.0.0-beta-2/migrating-3.html)を参照してください。
</p>
<var name="version" value="3.0.0-beta-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.12</td><td>June 20, 2024</td><td><p>
Ktor Core および Ktor Server のバグ修正に加え、Netty および OpenAPI のバージョン更新を含むパッチリリースです。
</p>
<var name="version" value="2.3.12"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.11</td><td>May 9, 2024</td><td><p>
テストクライアントのエンジンにソケットタイムアウトを適用するバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.11"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.10</td><td>April 8, 2024</td><td><p>
CallLogging および SSE サーバープラグインに対する様々なバグ修正、Android クライアントのロギング改善などを含むパッチリリースです。
</p>
<var name="version" value="2.3.10"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.9</td><td>March 4, 2024</td><td><p>
ContentNegotiation クライアントプラグインのバグ修正と、HTTP 経由でセキュアなクッキーを送信するサポートの追加を含むパッチリリースです。
</p>
<var name="version" value="2.3.9"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.8</td><td>January 31, 2024</td><td><p>
URLBuilder、CORS、および WebSocket プラグインに対する様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.7</td><td>December 7, 2023</td><td>
<p>
ContentNegotiation、WebSockets、および Native Server のメモリ使用量に関するバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.7"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
クライアントおよびサーバー SSE サポートを含む、様々な改善とバグ修正を伴うメジャープレリリースバージョンです。
</p>
<var name="version" value="3.0.0-beta-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.6</td><td>November 7, 2023</td><td>
<p>
`2.3.5` における破壊的変更の修正と、その他様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.6"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.5</td><td>October 5, 2023</td><td>
<p>
Darwin および Apache5 エンジン構成の修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.5"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.4</td><td>August 31, 2023</td><td>
<p>
HTTP Cookie ヘッダーと NoTransformationFoundException エラーのバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.3</td><td>August 1, 2023</td><td>
<p>
`linuxArm64` のクライアントおよびサーバーサポートと様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.2</td><td>June 28, 2023</td><td>
<p>
Kotlin バージョンを `1.8.22` にアップグレードし、様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.1</td><td>May 31, 2023</td><td>
<p>
サーバー構成の改善と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.0</td><td>April 19, 2023</td><td>
<p>
複数の設定ファイル、ルーティングにおける正規表現パターンのサポートなどを追加する機能リリースです。
</p>
<var name="version" value="2.3.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.4</td><td>February 28, 2023</td><td>
<p>
HTTP クライアント、ルーティング、ContentNegotiation における様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.3</td><td>January 31, 2023</td><td>
<p>
OAuth2 のマルチプラットフォーム機能と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.2</td><td>January 3, 2023</td><td>
<p>
`2.2.1` のバグ修正、Swagger プラグインの改善と修正などを含むパッチリリースです。
</p>
<var name="version" value="2.2.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.1</td><td>December 7, 2022</td><td>
<p>
`2.2.0` における `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` エラーのパッチリリースです。
</p>
<var name="version" value="2.2.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.0</td><td>December 7, 2022</td><td>
<p>
Swagger UI ホスティング、新しいプラグイン API、Sessions のマルチプラットフォームサポートなど、複数の機能リリースです。詳細については、[2.0.xから2.2.xへの移行](migration-to-22x.md)ガイドを参照してください。
</p>
<var name="version" value="2.2.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.3</td><td>October 26, 2022</td><td>
<p>
様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.2</td><td>September 29, 2022</td><td>
<p>
ルーティング、テストエンジン、Ktor クライアントにおけるバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.1</td><td>September 6, 2022</td><td>
<p>
Ktor クライアントとサーバーにおける様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.0</td><td>August 11, 2022</td><td>
<p>
YAML 構成のサポートとその他様々な改善、バグ修正を追加するマイナーリリースです。
</p>
<var name="version" value="2.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.3</td><td>June 28, 2022</td><td>
<p>
バグ修正と `kotlinx.coroutines` バージョンを `1.6.2` にアップグレードしたパッチリリースです。
</p>
<var name="version" value="2.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.2</td><td>May 27, 2022</td><td>
<p>
様々な改善、バグ修正、依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="2.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.1</td><td>April 28, 2022</td><td>
<p>
様々なバグ修正と Kotlin バージョンを `1.6.21` に更新したパッチリリースです。
</p>
<var name="version" value="2.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.0</td><td>April 11, 2022</td><td>
<p>
更新された API ドキュメントと様々な新機能を備えたメジャーリリースです。破壊的変更と `1.x.x` からの移行方法の詳細については、[移行ガイド](migration-to-20x.md)を参照してください。
</p>
<var name="version" value="2.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>1.6.8</td><td>March 15, 2022</td><td>
<p>
依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="1.6.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
</table>