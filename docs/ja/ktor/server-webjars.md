[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name%プラグインは、WebJarsによって提供されるクライアントサイドライブラリの提供を可能にします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html)プラグインは、[WebJars](https://www.webjars.org/)によって提供されるクライアントサイドライブラリの提供を可能にします。これにより、JavaScriptやCSSライブラリなどのアセットを[fat JAR](server-fatjar.md)の一部としてパッケージ化できます。

## 依存関係を追加する {id="add_dependencies"}
%plugin_name%を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります:
* `%artifact_name%`依存関係を追加します:

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 必要なクライアントサイドライブラリの依存関係を追加します。以下の例は、Bootstrapアーティファクトを追加する方法を示しています:

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  
  `$bootstrap_version`を、例えば`%bootstrap_version%`のような`bootstrap`アーティファクトの必要なバージョンに置き換えることができます。

## %plugin_name%をインストールする {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールは、ルートをグループ化することでアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
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

## %plugin_name%を設定する {id="configure"}

デフォルトでは、`%plugin_name%`は`/webjars`パスでWebJarsアセットを提供します。以下の例は、これを変更し、`/assets`パスで任意のWebJarsアセットを提供する方法を示しています:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.webjars.*

fun Application.module() {
    install(Webjars) {
        path = "assets"
    }
}
```

例えば、`org.webjars:bootstrap`依存関係をインストールしている場合、`bootstrap.css`を次のように追加できます:

```html
<head>
    <link rel="stylesheet" href="/assets/bootstrap/bootstrap.css">
</head>
```

注意点として、`%plugin_name%`は、依存関係のバージョンを、それらをロードするために使用されるパスを変更せずに変更することを可能にします。

> 完全な例は[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)で見つけることができます。