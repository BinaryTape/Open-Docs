[//]: # (title: 의존성 주입을 사용한 테스트)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[의존성 주입(DI) 플러그인](server-dependency-injection.md)은 테스트를 간소화하는 도구를 제공합니다.

애플리케이션 모듈을 로드하기 전에 의존성을 오버라이드할 수 있습니다:

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

위의 예제에서 `loadServices()`는 애플리케이션의 모듈을 부트스트랩하는 함수입니다. 예를 들어, 라우트와 서비스를 등록하는 함수이며 `application.yaml`의 `modules` 항목에 나열된 것과 동일합니다.

### 테스트에서 설정 로드하기

`configure()`를 사용하면 테스트에서 설정 파일을 쉽게 로드할 수 있습니다:

```kotlin
fun test() = testApplication {
  // 기본 설정 파일 경로에서 속성을 로드합니다.
  configure()
  // 오버라이드가 포함된 여러 파일을 로드합니다.
  configure("root-config.yaml", "test-overrides.yaml")
}
```

충돌하는 선언은 테스트 엔진에 의해 무시되므로 자유롭게 오버라이드할 수 있습니다.