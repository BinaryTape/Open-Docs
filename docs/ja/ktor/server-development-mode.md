```xml
<topic xmlns="" xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="server-development-mode" title="開発モード"
   help-id="development_mode;development-mode">
<show-structure for="chapter" depth="2"/>
<p>
    Ktorは開発向けの特別なモードを提供します。このモードでは以下の機能が有効になります。
</p>
<list>
    <li><Links href="/ktor/server-auto-reload" summary="コード変更時にアプリケーションクラスをリロードするオートリロードの使用方法を学習します。">オートリロード</Links>：サーバーを再起動せずにアプリケーションクラスをリロードします。
    </li>
    <li><a href="#pipelines">パイプライン</a>のデバッグ用拡張情報（スタックトレース付き）。
    </li>
    <li><Links href="/ktor/server-status-pages" summary="%plugin_name% を使用すると、Ktorアプリケーションは、スローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に応答できます。">応答ページ</Links>上の拡張デバッグ情報（<emphasis>5**</emphasis>サーバーエラーの場合）。
    </li>
</list>
<note>
    <p>
        開発モードはパフォーマンスに影響するため、本番環境では使用しないでください。
    </p>
</note>
<chapter title="開発モードを有効にする" id="enable">
    <p>
        開発モードは、アプリケーション設定ファイル、専用のシステムプロパティ、または環境変数など、さまざまな方法で有効にできます。
    </p>
    <chapter title="設定ファイル" id="application-conf">
        <p>
            <Links href="/ktor/server-configuration-file" summary="設定ファイルでさまざまなサーバーパラメーターを設定する方法を学習します。">設定ファイル</Links>で開発モードを有効にするには、<code>development</code> オプションを <code>true</code> に設定します。
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="'io.ktor.development' システムプロパティ" id="system-property">
        <p>
            <control>io.ktor.development</control>
            <a href="https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html">システムプロパティ</a>を使用すると、アプリケーションの実行時に開発モードを有効にできます。
        </p>
        <p>
            IntelliJ IDEAを使用してアプリケーションを開発モードで実行するには、<code>io.ktor.development</code> を <code>-D</code> フラグとともに<a href="https://www.jetbrains.com/help/idea/run-debug-configuration-kotlin.html#1">VMオプション</a>に渡します。
        </p>
        [object Promise]
        <p>
            <Links href="/ktor/server-dependencies" summary="既存のGradle/MavenプロジェクトにKtor Serverの依存関係を追加する方法を学習します。">Gradle</Links>タスクを使用してアプリケーションを実行する場合、開発モードを有効にするには2つの方法があります。
        </p>
        <list>
            <li>
                <p>
                    <Path>build.gradle.kts</Path>ファイルで<code>ktor</code>ブロックを設定します。
                </p>
                [object Promise]
            </li>
            <li>
                <p>
                    Gradle CLIフラグを渡して、1回の実行で開発モードを有効にします。
                </p>
                [object Promise]
            </li>
        </list>
        <tip>
            <p>
                <code>-ea</code>フラグを使用して開発モードを有効にすることもできます。
                <code>-D</code>フラグで渡される<code>io.ktor.development</code>システムプロパティは、<code>-ea</code>よりも優先されることに注意してください。
            </p>
        </tip>
    </chapter>
    <chapter title="'io.ktor.development' 環境変数" id="environment-variable">
        <p>
            <a href="#native">ネイティブクライアント</a>の開発モードを有効にするには、<code>io.ktor.development</code> 環境変数を使用します。
        </p>
    </chapter>
</chapter>
</topic>