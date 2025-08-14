[//]: # (title: 정적 콘텐츠 제공)

<show-structure for="chapter" depth="2"/>

<tldr>
<p><b>코드 예시</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files">static-files</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources">static-resources</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip">static-zip</a>
</p>
</tldr>

<link-summary>
스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.
</link-summary>

웹사이트를 만들든 HTTP 엔드포인트를 만들든, 애플리케이션은 스타일시트, 스크립트, 이미지 등과 같은 파일을 제공해야 할 것입니다.
Ktor로 파일 내용을 로드하여 클라이언트에게 [응답으로 전송](server-responses.md)하는 것이 물론 가능하지만, Ktor는 정적 콘텐츠 제공을 위한 추가 함수를 제공하여 이 과정을 간소화합니다.

Ktor를 사용하면 [폴더](#folders), [ZIP 파일](#zipped), 그리고 [임베디드 애플리케이션 리소스](#resources)에서 콘텐츠를 제공할 수 있습니다.

## 폴더 {id="folders"}

로컬 파일 시스템에서 정적 파일을 제공하려면 `staticFiles()` 함수를 사용하세요. 이 경우 상대 경로는 현재 작업 디렉토리를 사용하여 확인됩니다.

 [object Promise]

위 예시에서 `/resources`로부터의 모든 요청은 현재 작업 디렉토리의 `files` 물리적 폴더에 매핑됩니다.
Ktor는 URL 경로와 물리적 파일 이름이 일치하는 한 `files` 폴더의 모든 파일을 재귀적으로 제공합니다.

전체 예시는 [static-files](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-files)를 참조하세요.

## ZIP 파일 {id="zipped"}

ZIP 파일에서 정적 콘텐츠를 제공하기 위해 Ktor는 `staticZip()` 함수를 제공합니다.
이를 통해 아래 예시에서처럼 요청을 ZIP 아카이브의 콘텐츠에 직접 매핑할 수 있습니다:

 [object Promise]

이 예시에서는 루트 URL `/`로부터의 모든 요청이 `text-files.zip` ZIP 파일의 내용에 직접 매핑됩니다.

### 자동 리로드 (auto-reloading) 지원 {id="zip-auto-reload"}

`staticZip()` 함수는 자동 리로드 (auto-reloading)를 지원합니다. ZIP 파일의 상위 디렉토리에서 변경 사항이 감지되면 다음 요청 시 ZIP 파일 시스템이 다시 로드됩니다. 이를 통해 서버 재시작 없이 제공되는 콘텐츠가 최신 상태로 유지됩니다.

전체 예시는 [static-zip](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-zip)를 참조하세요.

## 리소스 {id="resources"}

클래스패스에서 콘텐츠를 제공하려면 `staticResources()` 함수를 사용하세요.

[object Promise]

이는 `/resources`로부터의 모든 요청을 애플리케이션 리소스의 `static` 패키지에 매핑합니다.
이 경우 Ktor는 URL 경로와 리소스 경로가 일치하는 한 `static` 패키지의 모든 파일을 재귀적으로 제공합니다.

전체 예시는 [static-resources](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/static-resources)를 참조하세요.

## 추가 구성 {id="configuration"}

Ktor는 정적 파일 및 리소스에 대한 추가 구성을 제공합니다.

### 인덱스 파일 {id="index"}

만약 `index.html`이라는 이름의 파일이 존재한다면, 디렉토리가 요청될 때 Ktor는 기본적으로 해당 파일을 제공합니다. `index` 파라미터를 사용하여 사용자 정의 인덱스 파일을 설정할 수 있습니다:

[object Promise]

이 경우 `/custom`이 요청되면 Ktor는 `/custom_index.html`을 제공합니다.

### 사전 압축 파일 {id="precompressed"}

Ktor는 사전 압축된 파일을 제공하고 [동적 압축](server-compression.md) 사용을 피할 수 있는 기능을 제공합니다.
이 기능을 사용하려면 블록 문 내에서 `preCompressed()` 함수를 정의하세요:

[object Promise]

이 예시에서 `/js/script.js`로 요청이 들어오면 Ktor는 `/js/script.js.br` 또는 `/js/script.js.gz`를 제공할 수 있습니다.

### HEAD 요청 {id="autohead"}

`enableAutoHeadResponse()` 함수를 사용하면 `GET`이 정의된 정적 라우트 내의 모든 경로에 대해 `HEAD` 요청에 자동으로 응답할 수 있습니다.

[object Promise]

### 기본 파일 응답 {id="default-file"}

`default()` 함수는 정적 라우트 내에서 해당 파일이 없는 모든 요청에 대해 파일로 응답하는 기능을 제공합니다.

[object Promise]

이 예시에서 클라이언트가 존재하지 않는 리소스를 요청하면, `index.html` 파일이 응답으로 제공됩니다.

### 콘텐츠 타입 {id="content-type"}

기본적으로 Ktor는 파일 확장자를 통해 `Content-Type` 헤더의 값을 추측하려고 합니다. `contentType()` 함수를 사용하여 `Content-Type` 헤더를 명시적으로 설정할 수 있습니다.

[object Promise]

이 예시에서 `html-file.txt` 파일에 대한 응답은 `Content-Type: text/html` 헤더를 가지며, 다른 모든 파일에 대해서는 기본 동작이 적용됩니다.

### 캐싱 {id="caching"}

`cacheControl()` 함수를 사용하면 HTTP 캐싱을 위한 `Cache-Control` 헤더를 구성할 수 있습니다.

[object Promise]

> Ktor의 캐싱에 대한 자세한 내용은 [캐싱 헤더](server-caching-headers.md)를 참조하세요.
>
{style="tip"}

### 제외된 파일 {id="exclude"}

`exclude()` 함수를 사용하면 제공되지 않도록 파일을 제외할 수 있습니다. 제외된 파일이 클라이언트에 의해 요청되면 서버는 `403 Forbidden` 상태 코드로 응답합니다.

[object Promise]

### 파일 확장자 폴백 (fallbacks) {id="extensions"}

요청된 파일을 찾을 수 없는 경우 Ktor는 파일 이름에 주어진 확장자를 추가하여 검색할 수 있습니다.

[object Promise]

이 예시에서 `/index`가 요청되면 Ktor는 `/index.html`을 검색하고 발견된 콘텐츠를 제공합니다.

### 사용자 정의 수정 {id="modify"}

`modify()` 함수를 사용하면 결과 응답에 사용자 정의 수정을 적용할 수 있습니다.

[object Promise]

## 오류 처리 {id="errors"}

요청된 콘텐츠를 찾을 수 없는 경우 Ktor는 자동으로 `404 Not Found` HTTP 상태 코드로 응답합니다.

오류 처리를 구성하는 방법을 알아보려면 [상태 페이지 (Status Pages)](server-status-pages.md)를 참조하세요.