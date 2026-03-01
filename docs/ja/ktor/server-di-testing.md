[//]: # (title: 依存関係注入（DI）を使用したテスト)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[依存関係注入 (DI) プラグイン](server-dependency-injection.md)は、テストを簡素化するためのツールを提供します。

アプリケーションモジュールをロードする前に、依存関係をオーバーライドできます。

```kotlin
fun test() = testApplication {
  application {
    dependencies.provide<MyService> {
      MockService()
    }
    loadServices()
  }
}
```

上記の例では、`loadServices()` はアプリケーションのモジュールをブートストラップする関数です。例えば、ルートやサービスを登録する関数であり、`application.yaml` の `modules` の下にリストされているものと同等です。

### テストでの設定の読み込み

テストで設定ファイルを簡単に読み込むには、`configure()` を使用します。

```kotlin
fun test() = testApplication {
  // デフォルトの設定ファイルパスからプロパティを読み込む
  configure()
  // オーバーライドを含む複数のファイルを読み込む
  configure("root-config.yaml", "test-overrides.yaml")
}
```

競合する宣言はテストエンジンによって無視されるため、自由にオーバーライドできます。