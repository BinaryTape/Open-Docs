[//]: # (title: 리소스 수명 주기 관리)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[종속성 주입(DI) 플러그인](server-dependency-injection.md)은 애플리케이션이 종료될 때 수명 주기(lifecycle)와 정리(cleanup)를 자동으로 처리합니다.

### AutoCloseable 지원

기본적으로 `AutoCloseable`을 구현하는 모든 종속성은 애플리케이션이 중지될 때 자동으로 닫힙니다.

```kotlin
class DatabaseConnection : AutoCloseable {
  override fun close() {
    // 연결을 닫고 리소스를 해제합니다.
  }
}

dependencies {
  provide<DatabaseConnection> { DatabaseConnection() }
}
```

### 사용자 정의 정리 로직

`cleanup` 함수를 지정하여 사용자 정의 정리 로직을 정의할 수 있습니다.

```kotlin
dependencies {
  provide<ResourceManager> { ResourceManagerImpl() } cleanup { manager ->
    manager.releaseResources()
  }
}
```

### key를 사용한 범위 지정 정리

`key`를 사용하여 명명된 리소스와 해당 정리를 관리할 수 있습니다.

```kotlin
dependencies {
  key<Closer>("second") {
    provide { CustomCloser() }
    cleanup { it.closeMe() }
  }
}
```

적절한 해체(teardown)를 보장하기 위해 종속성은 선언된 역순으로 정리됩니다.