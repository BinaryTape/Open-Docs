[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>

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

Ktorは、[Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity)プラグインをインストールすることで、アプリケーション内で[Velocityテンプレート](https://velocity.apache.org/engine/)をビューとして使用できるようにします。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
    

## Velocityをインストールする {id="install_plugin"}

    <p>
        アプリケーションに<a href="#install"><code>%plugin_name%</code>プラグインをインストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

任意で、<code>VelocityTools</code>プラグインをインストールして、標準およびカスタムの[Velocityツール](#velocity_tools)を追加する機能を利用できます。

## Velocityを設定する {id="configure"}
### テンプレートの読み込みを設定する {id="template_loading"}
<code>install</code>ブロック内で、[VelocityEngine][velocity_engine]を設定できます。例えば、クラスパスからテンプレートを使用したい場合は、<code>classpath</code>用のリソースローダーを使用します。
[object Promise]

### レスポンスとしてテンプレートを送信する {id="use_template"}
<code>resources/templates</code>に<code>index.vl</code>テンプレートがあるとします。
[object Promise]

ユーザーのデータモデルは次のようになります。
[object Promise]

指定された[ルート](server-routing.md)にテンプレートを使用するには、<code>VelocityContent</code>を<code>call.respond</code>メソッドに次のように渡します。
[object Promise]

### Velocityツールを追加する {id="velocity_tools"}

<code>VelocityTools</code>プラグインを[インストール](#install_plugin)している場合、<code>install</code>ブロック内で<code>EasyFactoryConfiguration</code>インスタンスにアクセスして、標準およびカスタムのVelocityツールを追加できます。例えば：

```kotlin
install(VelocityTools) {
    engine {
        // Engine configuration
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // Add a default tool
    tool("foo", MyCustomTool::class.java) // Add a custom tool
}
```