[//]: # (title: 資源生命週期管理)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要的相依性</b>：<code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[相依注入 (DI) 外掛程式](server-dependency-injection.md) 會在應用程式關閉時自動處理生命週期與清理作業。

### AutoCloseable 支援

預設情況下，任何實作了 `AutoCloseable` 的相依性都會在您的應用程式停止時自動關閉：

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 關閉連線，釋放資源
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 自訂清理邏輯

您可以透過指定 `cleanup` 函式來定義自訂清理邏輯：

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### 使用 key 進行作用域清理

使用 `key` 來管理具名資源及其清理：

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

相依性會依照宣告的相反順序進行清理，以確保正確卸載。