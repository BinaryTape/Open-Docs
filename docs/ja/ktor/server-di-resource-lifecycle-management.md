[//]: # (title: リソースのライフサイクル管理)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[依存性注入（DI）プラグイン](server-dependency-injection.md)は、アプリケーションのシャットダウン時に、ライフサイクルとクリーンアップを自動的に処理します。

### AutoCloseableのサポート

デフォルトでは、`AutoCloseable`を実装している依存関係は、アプリケーションの停止時に自動的にクローズされます。

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 接続を閉じ、リソースを解放する
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### カスタムクリーンアップロジック

`cleanup`関数を指定することで、カスタムのクリーンアップロジックを定義できます。

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### キーによるスコープ指定されたクリーンアップ

名前付きリソースとそのクリーンアップを管理するには、`key`を使用します。

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

適切なティアダウン（終了処理）を確実にするために、依存関係は宣言された順序とは逆の順序でクリーンアップされます。