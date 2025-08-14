[//]: # (title: リクエストの検証)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Nativeサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%は、受信リクエストのボディを検証する機能を提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html)プラグインは、受信リクエストのボディを検証する機能を提供します。`ContentNegotiation`プラグインが[シリアライザー](server-serialization.md#configure_serializer)とともにインストールされている場合、生のRequestBodyまたは指定されたリクエストオブジェクトのプロパティを検証できます。リクエストボディの検証が失敗すると、プラグインは`RequestValidationException`を発生させ、これは[StatusPages](server-status-pages.md)プラグインを使用して処理できます。

## 依存関係の追加 {id="add_dependencies"}

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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構成できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
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
    

    <p>
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにインストール</a>することもできます。
        これは、アプリケーションの異なるリソースに対して異なる<code>%plugin_name%</code>構成が必要な場合に役立つことがあります。
    </p>
    

## %plugin_name%の構成 {id="configure"}

`%plugin_name%`の構成には、主に3つのステップがあります:

1. [ボディコンテンツの受信](#receive-body)。
2. [検証関数の構成](#validation-function)。
3. [検証例外の処理](#validation-exception)。

### 1. ボディの受信 {id="receive-body"}

`%plugin_name%`プラグインは、型パラメータを指定して**[receive](server-requests.md#body_contents)**関数を呼び出すと、リクエストのボディを検証します。例えば、以下のコードスニペットは、ボディを`String`値として受信する方法を示しています:

[object Promise]

### 2. 検証関数の構成 {id="validation-function"}

リクエストボディを検証するには、`validate`関数を使用します。
この関数は、検証が成功したか失敗したかを示す`ValidationResult`オブジェクトを返します。
検証が失敗した場合は、**[RequestValidationException](#validation-exception)**が発生します。

`validate`関数には、リクエストボディを2つの方法で検証できる2つのオーバーロードがあります:

- 最初の`validate`オーバーロードは、指定された型のオブジェクトとしてリクエストボディにアクセスできます。
   以下の例は、`String`値を表すリクエストボディを検証する方法を示しています:
   [object Promise]

   `ContentNegotiation`プラグインが特定の[シリアライザー](server-serialization.md#configure_serializer)で構成されてインストールされている場合、オブジェクトのプロパティを検証できます。詳細については、[](#example-object)を参照してください。

- 2番目の`validate`オーバーロードは`ValidatorBuilder`を受け入れ、カスタム検証ルールを提供できます。
   詳細については、[](#example-byte-array)を参照してください。

### 3. 検証例外の処理 {id="validation-exception"}

リクエストの検証が失敗すると、`%plugin_name%`は`RequestValidationException`を発生させます。
この例外により、リクエストボディにアクセスし、このリクエストのすべての検証失敗の理由を取得できます。

`RequestValidationException`は、[StatusPages](server-status-pages.md)プラグインを使用して次のように処理できます:

[object Promise]

完全な例はこちらで確認できます: [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 例: オブジェクトプロパティの検証 {id="example-object"}

この例では、`%plugin_name%`プラグインを使用してオブジェクトのプロパティを検証する方法を見ていきます。
サーバーが以下のJSONデータを含む`POST`リクエストを受信すると仮定します:

[object Promise]

`id`プロパティの検証を追加するには、以下の手順に従います:

1. 上記のJSONオブジェクトを記述する`Customer`データクラスを作成します:
   [object Promise]

2. [JSONシリアライザー](server-serialization.md#register_json)を使用して`ContentNegotiation`プラグインをインストールします:
   [object Promise]

3. サーバー側で`Customer`オブジェクトを次のように受信します:
   [object Promise]
4. `%plugin_name%`プラグインの設定で、`id`プロパティが指定された範囲内にあることを確認する検証を追加します:
   [object Promise]
   
   この場合、`id`の値が`0`以下の場合、`%plugin_name%`は**[RequestValidationException](#validation-exception)**を発生させます。

## 例: バイト配列の検証 {id="example-byte-array"}

この例では、バイト配列として受信したリクエストボディを検証する方法を見ていきます。
サーバーが以下のテキストデータを含む`POST`リクエストを受信すると仮定します:

[object Promise]

データをバイト配列として受信し、それを検証するには、以下の手順を実行します:

1. サーバー側でデータを次のように受信します:
   [object Promise]
2. 受信したデータを検証するには、`ValidatorBuilder`を受け入れ、カスタム検証ルールを提供できる2番目の`validate`[関数オーバーロード](#validation-function)を使用します:
   [object Promise]

    ```