[//]: # (title: デフォルトヘッダー)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

[%plugin_name%](%plugin_api_link%)プラグインは、標準の`Server`および`Date`ヘッダーを各レスポンスに追加します。さらに、追加のデフォルトヘッダーを提供したり、`Server`ヘッダーをオーバーライドしたりできます。

## 依存関係を追加する {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name%をインストールする {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています。
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... 明示的に定義された<code>module</code> (これは<code>Application</code>クラスの拡張関数です) 内で。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立つことがあります。
</p>

## %plugin_name%を設定する {id="configure"}
### 追加のヘッダーを追加する {id="add"}
デフォルトヘッダーのリストをカスタマイズするには、<code>header(name, value)</code>関数を使用して、希望するヘッダーを<code>install</code>に渡します。<code>name</code>パラメーターは<code>HttpHeaders</code>値を受け入れます。例:
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
カスタムヘッダーを追加するには、その名前を文字列値として渡します:
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### ヘッダーをオーバーライドする {id="override"}
<code>Server</code>ヘッダーをオーバーライドするには、対応する<code>HttpHeaders</code>値を使用します:
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
<code>Date</code>ヘッダーはパフォーマンス上の理由からキャッシュされ、<code>%plugin_name%</code>を使用してオーバーライドできないことに注意してください。