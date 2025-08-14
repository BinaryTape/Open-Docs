<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="サーバーの依存関係を追加する"
       id="server-dependencies" help-id="Gradle">
<show-structure for="chapter" depth="2"/>
<link-summary>既存のGradle/MavenプロジェクトにKtorサーバーの依存関係を追加する方法を学びます。</link-summary>
<p>
    このトピックでは、既存のGradle/MavenプロジェクトにKtorサーバーに必要な依存関係を追加する方法を示します。
</p>
<chapter title="リポジトリを構成する" id="repositories">
    <p>
        Ktorの依存関係を追加する前に、このプロジェクトのリポジトリを構成する必要があります。
    </p>
    <list>
        <li>
            <p>
                <control>プロダクション</control>
            </p>
            <p>
                KtorのプロダクションリリースはMavenセントラルリポジトリで利用可能です。
                このリポジトリは、ビルドスクリプトで次のように宣言できます。
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    <note>
                        <p>
                            プロジェクトは<a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a>からセントラルリポジトリを継承しているため、<Path>pom.xml</Path>ファイルにMavenセントラルリポジトリを追加する必要はありません。
                        </p>
                    </note>
                </tab>
            </tabs>
        </li>
        <li>
            <p>
                <control>早期アクセスプログラム (EAP)</control>
            </p>
            <p>
                Ktorの<a href="https://ktor.io/eap/">EAP</a>バージョンにアクセスするには、<a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Spaceリポジトリ</a>を参照する必要があります。
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                Ktor EAPには、<a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin開発リポジトリ</a>が必要になる場合があることに注意してください。
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    [object Promise]
                </tab>
            </tabs>
        </li>
    </list>
</chapter>
<chapter title="依存関係を追加する" id="add-ktor-dependencies">
    <chapter title="コア依存関係" id="core-dependencies">
        <p>
            すべてのKtorアプリケーションには、少なくとも以下の依存関係が必要です。
        </p>
        <list>
            <li>
                <p>
                    <code>ktor-server-core</code>: Ktorのコア機能を含みます。
                </p>
            </li>
            <li>
                <p>
                    <Links href="/ktor/server-engines" summary="ネットワークリクエストを処理するエンジンについて学びます。">エンジン</Links>の依存関係 (例: <code>ktor-server-netty</code>)。
                </p>
            </li>
        </list>
        <p>
            異なるプラットフォーム向けに、Ktorは<code>jvm</code>などのサフィックスを持つプラットフォーム固有のアーティファクトを提供します。例えば、<code>ktor-server-core-jvm</code>や<code>ktor-server-netty-jvm</code>などです。
            Gradleは特定のプラットフォームに適したアーティファクトを解決しますが、Mavenはこの機能をサポートしていないことに注意してください。
            これは、Mavenの場合、プラットフォーム固有のサフィックスを手動で追加する必要があることを意味します。
            基本的なKtorアプリケーションの<code>dependencies</code>ブロックは次のようになります。
        </p>
        <tabs group="languages">
            <tab title="Gradle (Kotlin)" group-key="kotlin">
                [object Promise]
            </tab>
            <tab title="Gradle (Groovy)" group-key="groovy">
                [object Promise]
            </tab>
            <tab title="Maven" group-key="maven">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="ロギング依存関係" id="logging-dependency">
        <p>
            Ktorは、さまざまなロギングフレームワーク（例: LogbackやLog4j）のファサードとしてSLF4J APIを使用し、アプリケーションイベントをログに記録できます。
            必要なアーティファクトを追加する方法については、<a href="server-logging.md#add_dependencies">ロガーの依存関係を追加する</a>を参照してください。
        </p>
    </chapter>
    <chapter title="プラグインの依存関係" id="plugin-dependencies">
        <p>
            Ktorの機能を拡張する<Links href="/ktor/server-plugins" summary="プラグインは、シリアライゼーション、コンテンツエンコーディング、圧縮などの一般的な機能を提供します。">プラグイン</Links>は、追加の依存関係を必要とする場合があります。
            詳細については、対応するトピックを参照してください。
        </p>
    </chapter>
</chapter>
<var name="target_module" value="server"/>
<chapter title="Ktorバージョンの整合性を確保する" id="ensure-version-consistency">
    <chapter id="using-gradle-plugin" title="Ktor Gradleプラグインの使用">
        <p>
            <a href="https://github.com/ktorio/ktor-build-plugins">Ktor Gradleプラグイン</a>を適用すると、
            Ktor BOMの依存関係が暗黙的に追加され、すべてのKtor依存関係が同じバージョンであることを保証できます。
            この場合、Ktorアーティファクトに依存する際にバージョンを指定する必要がなくなります。
        </p>
        <tabs group="languages">
            <tab title="Gradle (Kotlin)" group-key="kotlin">
                [object Promise]
            </tab>
            <tab title="Gradle (Groovy)" group-key="groovy">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter id="using-version-catalog" title="公開されたバージョンカタログの使用">
        <p>
            公開されたバージョンカタログを使用して、Ktorの依存関係の宣言を一元化することもできます。
            このアプローチには、以下の利点があります。
        </p>
        <list id="published-version-catalog-benefits">
            <li>
                Ktorのバージョンを独自のカタログで手動で宣言する必要がなくなります。
            </li>
            <li>
                すべてのKtorモジュールを単一の名前空間の下に公開します。
            </li>
        </list>
        <p>
            カタログを宣言するには、<Path>settings.gradle.kts</Path>で、選択した名前でバージョンカタログを作成します。
        </p>
        [object Promise]
        <p>
            その後、モジュールの<Path>build.gradle.kts</Path>でカタログ名を参照して依存関係を追加できます。
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="アプリケーション実行のエントリポイントを作成する" id="create-entry-point">
    <p>
        Gradle/Mavenを使用してKtorサーバーを<Links href="/ktor/server-run" summary="サーバーKtorアプリケーションを実行する方法を学びます。">実行する</Links>方法は、<Links href="/ktor/server-create-and-configure" summary="アプリケーションのデプロイ要件に応じてサーバーを作成する方法を学びます。">サーバーを作成する</Links>方法に依存します。
        アプリケーションのメインクラスは、以下のいずれかの方法で指定できます。
    </p>
    <list>
        <li>
            <p>
                <a href="#embedded-server">embeddedServer</a>を使用する場合、メインクラスを次のように指定します。
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    [object Promise]
                </tab>
            </tabs>
        </li>
        <li>
            <p>
                <a href="#engine-main">EngineMain</a>を使用する場合、それをメインクラスとして構成する必要があります。
                Nettyの場合、次のようになります。
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    [object Promise]
                </tab>
            </tabs>
        </li>
    </list>
    <note>
        <p>
            アプリケーションをFat JARとしてパッケージ化する場合、対応するプラグインを構成する際にサーバーを作成するために使用する方法も考慮する必要があります。
            以下のトピックで詳細を確認してください。
        </p>
        <list>
            <li>
                <p>
                    <Links href="/ktor/server-fatjar" summary="Ktor Gradleプラグインを使用して実行可能なFat JARを作成および実行する方法を学びます。">Ktor Gradleプラグインを使用したFat JARの作成</Links>
                </p>
            </li>
            <li>
                <p>
                    <Links href="/ktor/maven-assembly-plugin" summary="サンプルプロジェクト: tutorial-server-get-started-maven">Maven Assemblyプラグインを使用したFat JARの作成</Links>
                </p>
            </li>
        </list>
    </note>
</chapter>
</topic>