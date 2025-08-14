[//]: # (title: Ktorのリリース)

<show-structure for="chapter" depth="2"/>

Ktorは[セマンティックバージョニング](https://semver.org/)に従っています。

-   _メジャーバージョン_ (x.0.0) には、互換性のないAPI変更が含まれます。
-   _マイナーバージョン_ (x.y.0) には、下位互換性のある新機能が提供されます。
-   _パッチバージョン_ (x.y.z) には、下位互換性のある修正が含まれます。

各メジャーおよびマイナーリリースでは、新機能がリリースされる前に試せるように、いくつかのプレビュー (EAP) バージョンも提供しています。詳細については、[Early Access Program](https://ktor.io/eap/)を参照してください。

## Gradleプラグイン {id="gradle"}

[Gradle Ktorプラグイン](https://github.com/ktorio/ktor-build-plugins)とフレームワークは同じリリースサイクルです。すべてのプラグインリリースは[Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.ktor.plugin)で見つけることができます。

## IntelliJ Ultimateプラグイン {id="intellij"}

[IntelliJ Ktorプラグイン](https://www.jetbrains.com/help/idea/ktor.html)はKtorフレームワークとは独立してリリースされ、[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html)と同じリリースサイクルを使用します。

### 新しいリリースへの更新 {id="update"}

IntelliJ Ktorプラグインを使用すると、Ktorプロジェクトを最新バージョンに移行できます。詳細については、[プロジェクトの移行](https://www.jetbrains.com/help/idea/ktor.html#migrate)セクションを参照してください。

## リリース詳細 {id="release-details"}

以下の表に、最新のKtorリリースの詳細が記載されています。

<table>
<tr><td>バージョン</td><td>リリース日</td><td>ハイライト</td></tr>
<tr><td>3.2.3</td><td>2025年7月29日</td><td>
<p>
YAML設定処理、DI解決、およびWasm/JSの安定性に対する改善を導入し、マルチパート解析、CIO <code>100 Continue</code>レスポンスフォーマット、<code>ByteReadChannel</code>における無限読み込みループ、およびサーバーシャットダウンの問題に対する修正を含むパッチリリースです。
</p>
<var name="version" value="3.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.2.2</td><td>2025年7月14日</td><td>
<p>
SSEフィールドのシリアライズ順序を改善し、CORSプリフライト処理、テストアプリケーションのストリーミング、設定デシリアライズのバグ、およびプラットフォーム間でのヘッダー欠落（wasmJsおよびDarwinターゲットに影響を与える3.2.1からのリグレッションを含む）など、いくつかの問題を解決するパッチリリースです。
</p>
<var name="version" value="3.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.2.1</td><td>2025年7月4日</td><td>
<p>
時間API、テンプレート、および公開に関する改善に加え、プラグインの動作、Netty、OkHttp、および3.2.0で導入された起動時の問題に対する重大なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="3.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.2.0</td><td>2025年6月12日</td><td>
<p>
型付き設定のデシリアライズ、新しい依存性注入およびHTMXモジュール、Gradleバージョンカタログのサポート、およびサスペンドモジュールのサポートを導入するマイナーリリースです。詳細については、<Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0の新機能</Links>を参照してください。
</p>
<var name="version" value="3.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.1.3</td><td>2025年5月5日</td><td><p>
バイト操作の高速化やマルチパート処理、より安全なトークンリフレッシュ処理など、パフォーマンス改善を含むパッチリリースです。また、メトリクスにおけるメモリの問題を修正し、ヘッダーの動作を改善し、WebSockets、OkHttp、Apache5、Nettyにわたるバグを解決し、さらにKotlin 2.1.0のサポートのためにJTEを更新しています。
</p>
<var name="version" value="3.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.1.2</td><td>2025年3月27日</td><td><p>
Kotlinを2.1.20に更新し、Base64デコード、認証トークンのクリア、Androidサーバーの起動エラー、WebSocketヘッダーのフォーマット、SSEセッションのキャンセルなど、様々な問題を修正するパッチリリースです。
</p>
<var name="version" value="3.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.1.1</td><td>2025年2月24日</td><td><p>
ロギングを改善し、WebSocketのタイムアウト処理を修正するパッチリリースです。HTTPキャッシュの不整合、フォームデータのコピーエラー、gzip処理のクラッシュ、セグメントプール破損を引き起こす並行処理の問題など、複数のバグを修正しています。
</p>
<var name="version" value="3.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.1.0</td><td>2025年2月11日</td><td><p>
様々なSSE機能と拡張されたCIOエンジンおよびWebSocketのサポートを導入するマイナーリリースです。プラットフォーム互換性、ロギング、認証を強化しつつ、バイトチャネル処理、HTTPリクエストの失敗、および並行処理の問題に関連する重大なバグを修正しています。
</p>
<var name="version" value="3.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.3</td><td>2024年12月18日</td><td><p>
<code>browserProductionWebpack</code>におけるビルドエラー、gzip圧縮コンテンツの処理、<code>FormFieldLimit</code>設定の上書きの修正を含む、様々なバグ修正を含むパッチリリースです。このリリースには、コアパフォーマンスの改善と適切なテストアプリケーションのシャットダウンも含まれています。
</p>
<var name="version" value="3.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.2</td><td>2024年12月4日</td><td><p>
レスポンス破損、切り詰められたボディ、接続処理、および不正なヘッダーに関連する複数のバグ修正に対処するパッチリリースであり、拡張されたバイナリエンコーディングサポートとAndroidのパフォーマンス強化も含まれています。
</p>
<var name="version" value="3.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.13</td><td>2024年11月20日</td><td><p>
<code>watchosDeviceArm64</code>ターゲットのサポートを追加するバグ修正、セキュリティパッチ、および改善を含むパッチリリースです。
</p>
<var name="version" value="2.3.13"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.1</td><td>2024年10月29日</td><td><p>
クライアントおよびサーバーのロギングの改善、および様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="3.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.0</td><td>2024年10月9日</td><td><p>
Android Nativeターゲットのサポートを追加する改善とバグ修正を含むメジャーリリースです。破壊的変更の詳細については、<Links href="/ktor/migrating-3" summary="undefined">移行ガイド</Links>を参照してください。
</p>
<var name="version" value="3.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-2</td><td>2024年10月2日</td><td><p>
破壊的変更、バグ修正、およびXMLのマルチプラットフォームサポートなどの機能を含む様々な改善を含むメジャーリリース候補です。
</p>
<var name="version" value="3.0.0-rc-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-1</td><td>2024年9月9日</td><td><p>
大幅な改善とバグ修正を含むメジャーリリース候補です。このアップデートは下位互換性を強化し、拡張された<code>staticZip</code>サポートを特徴としています。
</p>
<var name="version" value="3.0.0-rc-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-2</td><td>2024年7月15日</td><td><p>
SSEサポートの改善やKotlin/Wasm用Ktorクライアントなど、様々な改善とバグ修正を含むメジャープレリリースバージョンです。
</p>
<var name="version" value="3.0.0-beta-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.12</td><td>2024年6月20日</td><td><p>
Ktor CoreとKtor Serverにおけるバグ修正、およびNettyとOpenAPIのバージョン更新を含むパッチリリースです。
</p>
<var name="version" value="2.3.12"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.11</td><td>2024年5月9日</td><td><p>
テストクライアントのエンジンへのソケットタイムアウト適用に関するバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.11"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.10</td><td>2024年4月8日</td><td><p>
CallLoggingおよびSSEサーバープラグインに対する様々なバグ修正、Androidクライアントロギングの改善などを含むパッチリリースです。
</p>
<var name="version" value="2.3.10"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.9</td><td>2024年3月4日</td><td><p>
ContentNegotiationクライアントプラグインのバグ修正、およびHTTP経由でセキュアなCookieを送信するためのサポートを追加したパッチリリースです。
</p>
<var name="version" value="2.3.9"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.8</td><td>2024年1月31日</td><td><p>
URLBuilder、CORS、およびWebSocketプラグインに対する様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.7</td><td>2023年12月7日</td><td>
<p>
ContentNegotiation、WebSockets、およびNative Serverでのメモリ使用量におけるバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.7"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-1</td><td>2023年11月23日</td><td>
<p>
クライアントおよびサーバーのSSEサポートを含む、様々な改善とバグ修正を含むメジャープレリリースバージョンです。
</p>
<var name="version" value="3.0.0-beta-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.6</td><td>2023年11月7日</td><td>
<p>
2.3.5における破壊的変更の修正、およびその他様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.6"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.5</td><td>2023年10月5日</td><td>
<p>
DarwinおよびApache5エンジン設定における修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.5"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.4</td><td>2023年8月31日</td><td>
<p>
HTTP CookieヘッダーおよびNoTransformationFoundExceptionエラーにおけるバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.3</td><td>2023年8月1日</td><td>
<p>
<code>linuxArm64</code>のクライアントおよびサーバーサポートと、様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.2</td><td>2023年6月28日</td><td>
<p>
Kotlinバージョンを<code>1.8.22</code>にアップグレードし、様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.1</td><td>2023年5月31日</td><td>
<p>
サーバー設定の改善と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.3.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.3.0</td><td>2023年4月19日</td><td>
<p>
複数の設定ファイル、ルーティングにおける正規表現パターンなどのサポートを追加する機能リリースです。
</p>
<var name="version" value="2.3.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.2.4</td><td>2023年2月28日</td><td>
<p>
HTTPクライアント、ルーティング、およびContentNegotiationにおける様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.2.3</td><td>2023年1月31日</td><td>
<p>
OAuth2のマルチプラットフォーム機能と様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.2.2</td><td>2023年1月3日</td><td>
<p>
<code>2.2.1</code>のバグ修正、Swaggerプラグインの改善と修正などを含むパッチリリースです。
</p>
<var name="version" value="2.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.2.1</td><td>2022年12月7日</td><td>
<p>
<code>2.2.0</code>における<code>java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU</code>エラーに対するパッチリリースです。
</p>
<var name="version" value="2.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.2.0</td><td>2022年12月7日</td><td>
<p>
Swagger UIホスティング、新しいプラグインAPI、セッションのマルチプラットフォームサポートなどを含む複数の機能リリースです。詳細については、<Links href="/ktor/migration-to-22x" summary="undefined">2.0.xから2.2.xへの移行</Links>ガイドを参照してください。
</p>
<var name="version" value="2.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.1.3</td><td>2022年10月26日</td><td>
<p>
様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.1.2</td><td>2022年9月29日</td><td>
<p>
ルーティング、テストエンジン、およびKtorクライアントにおけるバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.1.1</td><td>2022年9月6日</td><td>
<p>
Ktorクライアントおよびサーバーにおける様々なバグ修正を含むパッチリリースです。
</p>
<var name="version" value="2.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.1.0</td><td>2022年8月11日</td><td>
<p>
YAML設定のサポートとその他様々な改善およびバグ修正を追加するマイナーリリースです。
</p>
<var name="version" value="2.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.0.3</td><td>2022年6月28日</td><td>
<p>
バグ修正と<code>kotlinx.coroutines</code>バージョンを<code>1.6.2</code>にアップグレードしたパッチリリースです。
</p>
<var name="version" value="2.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.0.2</td><td>2022年5月27日</td><td>
<p>
様々な改善、バグ修正、および依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="2.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.0.1</td><td>2022年4月28日</td><td>
<p>
様々なバグ修正とKotlinバージョンを<code>1.6.21</code>に更新したパッチリリースです。
</p>
<var name="version" value="2.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>2.0.0</td><td>2022年4月11日</td><td>
<p>
APIドキュメントの更新と様々な新機能を含むメジャーリリースです。破壊的変更と<code>1.x.x</code>からの移行方法については、<Links href="/ktor/migration-to-20x" summary="undefined">移行ガイド</Links>を参照してください。
</p>
<var name="version" value="2.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
<tr><td>1.6.8</td><td>2022年3月15日</td><td>
<p>
依存関係のバージョンアップグレードを含むパッチリリースです。
</p>
<var name="version" value="1.6.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHubでチェンジログを見る</a>
    </p>
    
</td></tr>
</table>