[//]: # (title: Ktor 릴리스)

<show-structure for="chapter" depth="2"/>

Ktor는 [시맨틱 버저닝](https://semver.org/)을 따릅니다:

- _메이저 버전_ (x.0.0)은 호환되지 않는 API 변경 사항을 포함합니다.
- _마이너 버전_ (x.y.0)은 이전 버전과 호환되는 새로운 기능을 제공합니다.
- _패치 버전_ (x.y.z)은 이전 버전과 호환되는 수정 사항을 포함합니다.

각 메이저 및 마이너 릴리스에 대해, 새로운 기능이 출시되기 전에 미리 사용해 볼 수 있도록 여러 미리 보기(EAP) 버전을 함께 제공합니다. 자세한 내용은 [얼리 액세스 프로그램](https://ktor.io/eap/)을 참조하세요.

## Gradle 플러그인 {id="gradle"}

[Gradle Ktor 플러그인](https://github.com/ktorio/ktor-build-plugins)과 프레임워크는 동일한 릴리스 주기를 따릅니다. 모든 플러그인 릴리스는 [Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.ktor.plugin)에서 찾을 수 있습니다.

## IntelliJ Ultimate 플러그인 {id="intellij"}

[IntelliJ Ktor 플러그인](https://www.jetbrains.com/help/idea/ktor.html)은 Ktor 프레임워크와는 독립적으로 릴리스되며, [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html)와 동일한 릴리스 주기를 사용합니다.

### 새 릴리스로 업데이트 {id="update"}

IntelliJ Ktor 플러그인을 사용하면 Ktor 프로젝트를 최신 버전으로 마이그레이션할 수 있습니다. 자세한 내용은 [프로젝트 마이그레이션](https://www.jetbrains.com/help/idea/ktor.html#migrate) 섹션에서 확인할 수 있습니다.

## 릴리스 상세 정보 {id="release-details"}

다음 표는 최신 Ktor 릴리스에 대한 상세 정보를 나열합니다.

<table>

<tr>
<td>버전</td><td>릴리스 날짜</td><td>주요 내용</td>
</tr>

<tr>
<td>3.3.3</td><td>2025년 11월 26일</td><td>
<p>
Jetty 클라이언트에서 클리어텍스트(h2c)를 통한 HTTP/2 지원을 추가하고, 로깅 및 OpenAPI 생성을 개선하며, 엔진, SSE 처리, 이중 응답, HTTP/2 헤더 및 클라이언트 캐싱의 버그를 수정하는 패치 릴리스입니다.
</p>
<var name="version" value="3.3.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.3.2</td><td>2025년 11월 5일</td><td>
<p>
Darwin용 SOCKS 프록시 지원을 추가하고, WebRTC 클라이언트 타겟 및 Java 프록시 처리를 개선하며, HTTP 재시도, OpenAPI, 캐싱, Android의 Netty에서 발생하는 여러 문제를 해결하는 패치 릴리스입니다.
</p>
<var name="version" value="3.3.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.3.1</td><td>2025년 10월 8일</td><td>
<p>
Kotlin을 2.2.20으로 업데이트하고, `Content-Length` 파싱 오류, `ClientSSESession`에 대한 누락된 직렬화 도구, Netty 설정 및 종료 버그 등 여러 문제를 해결하며, `bootJar` 내에서 정적 리소스를 제공하는 지원을 추가하는 패치 릴리스입니다.
</p>
<var name="version" value="3.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.3.0</td><td>2025년 9월 11일</td><td>
<p>
실험적 OpenAPI 생성 미리보기, 개선된 정적 콘텐츠 처리, Android 및 JS/Wasm용 WebRTC 클라이언트와 같은 주요 기능을 도입하고, Jetty, OkHttp 및 Kotlin 2.2로 업그레이드하는 마이너 릴리스입니다. 자세한 내용은 <Links href="/ktor/whats-new-330" summary="undefined">Ktor 3.3.0의 새로운 기능</Links>을 참조하세요.
</p>
<var name="version" value="3.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.2.3</td><td>2025년 7월 29일</td><td>
<p>
YAML 설정 처리, DI 해상도 및 Wasm/JS 안정성 개선과 함께 멀티파트 파싱, CIO `100 Continue` 응답 형식 지정, `ByteReadChannel`의 무한 읽기 루프, 서버 종료 문제에 대한 수정 사항을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="3.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.2.2</td><td>2025년 7월 14일</td><td>
<p>
SSE 필드 직렬화 순서를 개선하고, CORS 사전 요청 처리, 테스트 애플리케이션 스트리밍, 설정 역직렬화 버그, 플랫폼 전반의 누락된 헤더 등 여러 문제를 해결하는 패치 릴리스입니다. 여기에는 wasmJs 및 Darwin 타겟에 영향을 미치는 3.2.1 버전의 회귀(regression)도 포함됩니다.
</p>
<var name="version" value="3.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.2.1</td><td>2025년 7월 4일</td><td>
<p>
시간 API, 템플릿, 퍼블리싱 개선 사항과 함께 3.2.0에서 도입된 플러그인 동작, Netty, OkHttp, 시작 문제에 대한 중요한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="3.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.2.0</td><td>2025년 6월 12일</td><td>
<p>
타입 기반 설정 역직렬화, 새로운 의존성 주입 및 HTMX 모듈, Gradle 버전 카탈로그 지원, suspend 모듈 지원을 도입하는 마이너 릴리스입니다. 자세한 내용은 <Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0의 새로운 기능</Links>을 참조하세요.
</p>
<var name="version" value="3.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.1.3</td><td>2025년 5월 5일</td><td><p>
더 빠른 바이트 연산 및 멀티파트 처리, 더 안전한 토큰 갱신 처리와 같은 성능 개선 사항을 포함하는 패치 릴리스입니다. 또한, 메트릭의 메모리 문제, 헤더 동작 개선, WebSockets, OkHttp, Apache5, Netty의 버그 해결, Kotlin 2.1.0 지원을 위한 JTE 업데이트를 포함합니다.
</p>
<var name="version" value="3.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.1.2</td><td>2025년 3월 27일</td><td><p>
Kotlin을 2.1.20으로 업데이트하고 Base64 디코딩, 인증 토큰 삭제, Android 서버 시작 오류, WebSocket 헤더 형식 지정, SSE 세션 취소 등 다양한 문제를 해결하는 패치 릴리스입니다.
</p>
<var name="version" value="3.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.1.1</td><td>2025년 2월 24일</td><td><p>
로깅 개선 및 WebSocket 타임아웃 처리 문제를 해결하는 패치 릴리스입니다. HTTP 캐시 불일치, 폼 데이터 복사 오류, gzip 처리 충돌, 세그먼트 풀 손상을 유발하는 동시성 문제 등 여러 버그를 수정했습니다.
</p>
<var name="version" value="3.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.1.0</td><td>2025년 2월 11일</td><td><p>
다양한 SSE 기능과 확장된 CIO 엔진 및 WebSocket 지원을 도입하는 마이너 릴리스입니다. 플랫폼 호환성, 로깅, 인증을 강화하며 바이트 채널 처리, HTTP 요청 실패, 동시성 문제와 관련된 중요한 버그를 수정합니다.
</p>
<var name="version" value="3.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.3</td><td>2024년 12월 18일</td><td><p>
`browserProductionWebpack` 빌드 오류, gzip 콘텐츠 처리, `FormFieldLimit` 설정 덮어쓰기 등 다양한 버그 수정을 포함하는 패치 릴리스입니다. 이 릴리스에는 핵심 성능 개선 사항 및 올바른 테스트 애플리케이션 종료 기능도 포함됩니다.
</p>
<var name="version" value="3.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.2</td><td>2024년 12월 4일</td><td><p>
응답 손상, 잘린 본문, 연결 처리, 잘못된 헤더와 관련된 여러 버그 수정과 함께 확장된 바이너리 인코딩 지원 및 Android 성능 향상을 다루는 패치 릴리스입니다.
</p>
<var name="version" value="3.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.13</td><td>2024년 11월 20일</td><td><p>
버그 수정, 보안 패치 및 개선 사항을 포함하는 패치 릴리스로, `watchosDeviceArm64` 타겟에 대한 지원이 추가되었습니다.
</p>
<var name="version" value="2.3.13"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.1</td><td>2024년 10월 29일</td><td><p>
클라이언트 및 서버 로깅 개선과 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="3.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0</td><td>2024년 10월 9일</td><td><p>
Android Native 타겟 지원 추가를 포함한 개선 사항 및 버그 수정을 포함하는 메이저 릴리스입니다. 호환성이 깨지는 변경 사항에 대한 자세한 내용은 <Links href="/ktor/migrating-3" summary="undefined">마이그레이션 가이드</Links>를 참조하세요.
</p>
<var name="version" value="3.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-2</td><td>2024년 10월 2일</td><td><p>
다양한 개선 사항(호환성이 깨지는 변경 사항 포함), 버그 수정, 그리고 XML 멀티플랫폼 지원과 같은 기능을 포함하는 메이저 릴리스 후보입니다.
</p>
<var name="version" value="3.0.0-rc-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-rc-1</td><td>2024년 9월 9일</td><td><p>
중요한 개선 사항 및 버그 수정을 포함하는 메이저 릴리스 후보입니다. 이 업데이트는 이전 버전과의 호환성을 향상하고 확장된 `staticZip` 지원을 제공합니다.
</p>
<var name="version" value="3.0.0-rc-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-2</td><td>2024년 7월 15일</td><td><p>
SSE 지원 개선 및 Kotlin/Wasm용 Ktor 클라이언트를 포함한 다양한 개선 사항 및 버그 수정을 포함하는 메이저 사전 릴리스 버전입니다.
</p>
<var name="version" value="3.0.0-beta-2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.12</td><td>2024년 6월 20일</td><td><p>
Ktor Core 및 Ktor Server의 버그 수정과 Netty 및 OpenAPI 버전 업데이트를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.12"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.11</td><td>2024년 5월 9일</td><td><p>
Test Client 엔진에 소켓 타임아웃 적용에 대한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.11"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.10</td><td>2024년 4월 8일</td><td><p>
CallLogging 및 SSE 서버 플러그인에 대한 다양한 버그 수정, Android 클라이언트 로깅 개선 등을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.10"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.9</td><td>2024년 3월 4일</td><td><p>
ContentNegotiation 클라이언트 플러그인에 대한 버그 수정과 HTTP를 통한 보안 쿠키 전송 지원이 추가된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.9"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.8</td><td>2024년 1월 31일</td><td><p>
URLBuilder, CORS, WebSocket 플러그인에 대한 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.7</td><td>2023년 12월 7일</td><td>
<p>
ContentNegotiation, WebSockets, Native Server의 메모리 사용량에 대한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.7"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>3.0.0-beta-1</td><td>2023년 11월 23일</td><td>
<p>
클라이언트 및 서버 SSE 지원을 포함한 다양한 개선 사항 및 버그 수정을 포함하는 메이저 사전 릴리스 버전입니다.
</p>
<var name="version" value="3.0.0-beta-1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.6</td><td>2023년 11월 7일</td><td>
<p>
2.3.5의 호환성이 깨지는 변경 사항에 대한 수정 및 다양한 다른 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.6"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.5</td><td>2023년 10월 5일</td><td>
<p>
Darwin 및 Apache5 엔진 구성의 수정 사항을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.5"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.4</td><td>2023년 8월 31일</td><td>
<p>
HTTP Cookie 헤더 및 NoTransformationFoundException 오류의 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.3</td><td>2023년 8월 1일</td><td>
<p>
`linuxArm64` 클라이언트 및 서버 지원과 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.2</td><td>2023년 6월 28일</td><td>
<p>
Kotlin 버전이 `1.8.22`로 업그레이드되었으며 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.1</td><td>2023년 5월 31일</td><td>
<p>
서버 구성 개선 및 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.3.0</td><td>2023년 4월 19일</td><td>
<p>
다중 설정 파일, 라우팅의 정규 표현식 패턴 등에 대한 지원을 추가하는 기능 릴리스입니다.
</p>
<var name="version" value="2.3.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.2.4</td><td>2023년 2월 28일</td><td>
<p>
HTTP 클라이언트, 라우팅, ContentNegotiation의 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.2.4"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.2.3</td><td>2023년 1월 31일</td><td>
<p>
OAuth2의 멀티플랫폼 기능과 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.2.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.2.2</td><td>2023년 1월 3일</td><td>
<p>
`2.2.1` 버그 수정, Swagger 플러그인 개선 및 수정 등을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.2.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.2.1</td><td>2022년 12월 7일</td><td>
<p>
`2.2.0`에서 발생한 `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` 오류에 대한 패치 릴리스입니다.
</p>
<var name="version" value="2.2.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.2.0</td><td>2022년 12월 7일</td><td>
<p>
Swagger UI 호스팅, 새로운 플러그인 API, 세션의 멀티플랫폼 지원 등 여러 기능이 추가된 릴리스입니다. 자세한 내용은 <Links href="/ktor/migration-to-22x" summary="undefined">2.0.x에서 2.2.x로 마이그레이션</Links> 가이드를 참조하세요.
</p>
<var name="version" value="2.2.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.1.3</td><td>2022년 10월 26일</td><td>
<p>
다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.1.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.1.2</td><td>2022년 9월 29일</td><td>
<p>
라우팅, Testing 엔진, Ktor 클라이언트의 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.1.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.1.1</td><td>2022년 9월 6일</td><td>
<p>
Ktor 클라이언트 및 서버의 다양한 버그 수정을 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.1.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.1.0</td><td>2022년 8월 11일</td><td>
<p>
YAML 구성 지원 추가 및 기타 다양한 개선 사항과 버그 수정을 포함하는 마이너 릴리스입니다.
</p>
<var name="version" value="2.1.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.0.3</td><td>2022년 6월 28일</td><td>
<p>
버그 수정 및 `kotlinx.coroutines` 버전이 `1.6.2`로 업그레이드된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.3"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.0.2</td><td>2022년 5월 27일</td><td>
<p>
다양한 개선 사항, 버그 수정 및 의존성 버전 업그레이드를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.0.2"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.0.1</td><td>2022년 4월 28일</td><td>
<p>
다양한 버그 수정 및 Kotlin 버전이 `1.6.21`로 업데이트된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.1"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>2.0.0</td><td>2022년 4월 11일</td><td>
<p>
업데이트된 API 문서 및 다양한 새로운 기능을 포함하는 메이저 릴리스입니다. 호환성이 깨지는 변경 사항 및 `1.x.x`에서 마이그레이션하는 방법에 대한 자세한 내용은 <Links href="/ktor/migration-to-20x" summary="undefined">마이그레이션 가이드</Links>를 참조하세요.
</p>
<var name="version" value="2.0.0"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

<tr>
<td>1.6.8</td><td>2022년 3월 15일</td><td>
<p>
의존성 버전 업그레이드를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="1.6.8"/>
<p>
    <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
</p>
</td>
</tr>

</table>