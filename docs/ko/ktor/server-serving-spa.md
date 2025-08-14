[//]: # (title: 단일 페이지 애플리케이션 제공)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>

</tldr>

<link-summary>
Ktor는 React, Angular, Vue 등을 포함한 단일 페이지 애플리케이션을 제공하는 기능을 제공합니다.
</link-summary>

Ktor는 React, Angular 또는 Vue를 포함한 단일 페이지 애플리케이션을 제공하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

단일 페이지 애플리케이션을 제공하려면 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 의존성만 있으면 됩니다.
특정 의존성은 필요하지 않습니다.

## 애플리케이션 제공 {id="configure"}

단일 페이지 애플리케이션을 제공하려면 콘텐츠를 제공할 위치(로컬 파일 시스템 또는 클래스패스)를 정의해야 합니다.
단일 페이지 애플리케이션이 포함된 폴더/리소스 패키지를 최소한 지정해야 합니다.

### 프레임워크별 애플리케이션 제공 {id="serve-framework"}

React, Angular, Vue 등 특정 프레임워크를 사용하여 생성된 단일 페이지 애플리케이션의 빌드를 제공할 수 있습니다.
프로젝트 루트에 React 애플리케이션이 포함된 `react-app` 폴더가 있다고 가정해 봅시다.
애플리케이션은 다음과 같은 구조를 가지며, `index.html` 파일이 메인 페이지입니다:

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

이 애플리케이션을 제공하려면 [routing](server-routing.md) 블록 내에서 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)을 호출하고
`react` 함수에 폴더 이름을 전달합니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        singlePageApplication {
            react("react-app")
        }
    }
}
```

Ktor는 `index.html`을 자동으로 찾습니다.
기본 페이지를 사용자 정의하는 방법을 알아보려면 [](#serve-customize)를 참조하세요.

> 다른 프레임워크의 경우 `angular`, `vue`, `ember` 등 해당 함수를 사용하세요.

### 제공 설정 사용자 정의 {id="serve-customize"}

리소스로부터 단일 페이지 애플리케이션을 제공하는 방법을 설명하기 위해, 애플리케이션이 다음 구조를 갖는 `sample-web-app` 리소스 패키지 내에 위치한다고 가정해 봅시다:

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

이 애플리케이션을 제공하려면 다음 구성이 사용됩니다:

[object Promise]

- `useResources`: 리소스 패키지에서 애플리케이션 제공을 활성화합니다.
- `filesPath`: 애플리케이션이 위치한 경로를 지정합니다.
- `defaultPage`: `main.html`을 기본 리소스로 지정하여 제공합니다.
- `ignoreFiles`: 끝에 `.txt`가 포함된 경로를 무시합니다.

전체 예시는 여기에서 찾을 수 있습니다: [single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application).