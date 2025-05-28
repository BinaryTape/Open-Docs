[//]: # (title: Ktor 릴리스)

<show-structure for="chapter" depth="2"/>

Ktor는 [시맨틱 버저닝](https://semver.org/)을 따릅니다:

- _주요 버전_ (x.0.0): 호환되지 않는 API 변경 사항을 포함합니다.
- _마이너 버전_ (x.y.0): 이전 버전과 호환되는 새로운 기능을 제공합니다.
- _패치 버전_ (x.y.z): 이전 버전과 호환되는 수정 사항을 포함합니다.

각 주요 및 마이너 릴리스마다, 기능이 출시되기 전에 새로운 기능을 미리 사용해 볼 수 있도록 여러 프리뷰 (EAP) 버전을 제공합니다. 자세한 내용은 [얼리 액세스 프로그램](https://ktor.io/eap/)을 참조하세요.

## Gradle 플러그인 {id="gradle"}

[Gradle Ktor 플러그인](https://github.com/ktorio/ktor-build-plugins)과 프레임워크는 동일한 릴리스 주기를 따릅니다. 모든 플러그인 릴리스는 [Gradle 플러그인 포털](https://plugins.gradle.org/plugin/io.ktor.plugin)에서 찾을 수 있습니다.

## IntelliJ Ultimate 플러그인 {id="intellij"}

[IntelliJ Ktor 플러그인](https://www.jetbrains.com/help/idea/ktor.html)은 Ktor 프레임워크와 독립적으로 릴리스되며, [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html)와 동일한 릴리스 주기를 사용합니다.

### 새 릴리스로 업데이트 {id="update"}

IntelliJ Ktor 플러그인을 사용하면 Ktor 프로젝트를 최신 버전으로 마이그레이션할 수 있습니다. 자세한 내용은 [프로젝트 마이그레이션](https://www.jetbrains.com/help/idea/ktor.html#migrate) 섹션에서 알아볼 수 있습니다.

## 릴리스 세부 정보 {id="release-details"}

다음 표는 최신 Ktor 릴리스의 세부 정보를 나열합니다.

<table>
<tr><td>버전</td><td>릴리스 날짜</td><td>주요 내용</td></tr>
<tr><td>3.1.3</td><td>2025년 5월 5일</td><td><p>
더 빠른
<a href="https://youtrack.jetbrains.com/issue/KTOR-8412">
바이트 연산
</a>
및
<a href="https://youtrack.jetbrains.com/issue/KTOR-8407">
멀티파트 처리
</a>
, 더 안전한
<a href="https://youtrack.jetbrains.com/issue/KTOR-8107">
토큰 새로고침 처리
</a>
와 같은 성능 개선이 포함된 패치 릴리스입니다. 또한 메트릭의
<a href="https://youtrack.jetbrains.com/issue/KTOR-8276">
메모리 문제
</a>
,
<a href="https://youtrack.jetbrains.com/issue/KTOR-8326">
헤더 동작 개선
</a>
, WebSockets, OkHttp, Apache5, Netty 전반의 버그 해결, 그리고 Kotlin 2.1.0 지원을 위한
<a href="https://youtrack.jetbrains.com/issue/KTOR-8030">
JTE 업데이트
</a>
도 포함합니다.
</p>
<var name="version" value="3.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.2</td><td>2025년 3월 27일</td><td><p>
Kotlin을 2.1.20으로 업데이트하고 Base64 디코딩, 인증 토큰 초기화, Android 서버 시작 오류, WebSocket 헤더 포맷팅, SSE 세션 취소 등 다양한 문제를 수정한 패치 릴리스입니다.
</p>
<var name="version" value="3.1.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.1</td><td>2025년 2월 24일</td><td><p>
로깅을 개선하고 WebSocket 타임아웃 처리를 수정한 패치 릴리스입니다. HTTP 캐시 불일치, 폼 데이터 복사 오류, gzip 처리 충돌, 세그먼트 풀 손상을 유발하는 동시성 문제 등 여러 버그를 수정했습니다.
</p>
<var name="version" value="3.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.1.0</td><td>2025년 2월 11일</td><td><p>
다양한 SSE 기능과 확장된 CIO 엔진 및 WebSocket 지원을 도입하는 마이너 릴리스입니다. 바이트 채널 처리, HTTP 요청 실패, 동시성 문제와 관련된 주요 버그를 수정하면서 플랫폼 호환성, 로깅 및 인증을 향상시킵니다.
</p>
<var name="version" value="3.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.3</td><td>2024년 12월 18일</td><td><p>
`browserProductionWebpack` 빌드 오류, gzipped 콘텐츠 처리, `FormFieldLimit` 구성 덮어쓰기 수정 등 다양한 버그 수정이 포함된 패치 릴리스입니다. 이 릴리스에는 코어 성능 개선 및 올바른 테스트 애플리케이션 종료도 포함되어 있습니다.
</p>
<var name="version" value="3.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.2</td><td>2024년 12월 4일</td><td><p>
응답 손상, 잘린 바디, 연결 처리 및 잘못된 헤더와 관련된 여러 버그 수정과 확장된 바이너리 인코딩 지원 및 Android 성능 향상이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="3.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.13</td><td>2024년 11월 20일</td><td><p>
`watchosDeviceArm64` 타겟에 대한 지원 추가를 포함한 버그 수정, 보안 패치 및 개선 사항이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.13"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.1</td><td>2024년 10월 29일</td><td><p>
클라이언트 및 서버 로깅 개선과 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="3.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0</td><td>2024년 10월 9일</td><td><p>
Android 네이티브 타겟에 대한 지원 추가를 포함한 개선 사항 및 버그 수정이 포함된 주요 릴리스입니다. 호환성이 깨지는 변경 사항에 대한 자세한 내용은 <a href="https://ktor.io/docs/migrating-3.html">마이그레이션 가이드</a>를 참조하세요.
</p>
<var name="version" value="3.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-2</td><td>2024년 10월 2일</td><td><p>
호환성이 깨지는 변경 사항, 버그 수정, XML에 대한 멀티플랫폼 지원과 같은 기능을 포함한 다양한 개선 사항이 담긴 주요 릴리스 후보 버전입니다.
</p>
<var name="version" value="3.0.0-rc-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-rc-1</td><td>2024년 9월 9일</td><td><p>
상당한 개선 사항 및 버그 수정이 포함된 주요 릴리스 후보 버전입니다. 이 업데이트는 이전 버전과의 호환성을 향상시키고 확장된 `staticZip` 지원을 제공합니다. 호환성이 깨지는 변경 사항에 대한 자세한 내용은 <a href="https://ktor.io/docs/eap/migrating-3.html">마이그레이션 가이드</a>를 참조하세요.
</p>
<var name="version" value="3.0.0-rc-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-2</td><td>2024년 7월 15일</td><td><p>
SSE 지원 개선 및 Kotlin/Wasm용 Ktor 클라이언트를 포함한 다양한 개선 사항 및 버그 수정이 포함된 주요 프리릴리스 버전입니다. 호환성이 깨지는 변경 사항에 대한 자세한 내용은 <a href="https://ktor.io/docs/3.0.0-beta-2/migrating-3.html">마이그레이션 가이드</a>를 참조하세요.
</p>
<var name="version" value="3.0.0-beta-2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.12</td><td>2024년 6월 20일</td><td><p>
Ktor Core 및 Ktor Server의 버그 수정과 Netty 및 OpenAPI 버전 업데이트를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.12"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.11</td><td>2024년 5월 9일</td><td><p>
테스트 클라이언트 엔진에 소켓 타임아웃을 적용하는 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.11"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.10</td><td>2024년 4월 8일</td><td><p>
CallLogging 및 SSE 서버 플러그인에 대한 다양한 버그 수정, Android 클라이언트 로깅 개선 등이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.10"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.9</td><td>2024년 3월 4일</td><td><p>
ContentNegotiation 클라이언트 플러그인에 대한 버그 수정과 HTTP를 통해 보안 쿠키 전송 지원 추가가 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.9"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.8</td><td>2024년 1월 31일</td><td><p>
URLBuilder, CORS 및 WebSocket 플러그인에 대한 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.7</td><td>2023년 12월 7일</td><td>
<p>
ContentNegotiation, WebSockets 및 네이티브 서버의 메모리 사용량에 대한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.7"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>3.0.0-beta-1</td><td>2023년 11월 23일</td><td>
<p>
클라이언트 및 서버 SSE 지원을 포함한 다양한 개선 사항 및 버그 수정이 포함된 주요 프리릴리스 버전입니다.
</p>
<var name="version" value="3.0.0-beta-1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.6</td><td>2023년 11월 7일</td><td>
<p>
`2.3.5`의 호환성이 깨지는 변경 사항에 대한 수정 및 기타 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.6"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.5</td><td>2023년 10월 5일</td><td>
<p>
Darwin 및 Apache5 엔진 구성에 대한 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.5"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.4</td><td>2023년 8월 31일</td><td>
<p>
HTTP Cookie 헤더의 버그 수정 및 NoTransformationFoundException 오류를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.3</td><td>2023년 8월 1일</td><td>
<p>
`linuxArm64`에 대한 클라이언트 및 서버 지원과 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.2</td><td>2023년 6월 28일</td><td>
<p>
Kotlin 버전이 `1.8.22`로 업그레이드되었으며 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.1</td><td>2023년 5월 31일</td><td>
<p>
서버 구성 개선 및 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.3.0</td><td>2023년 4월 19일</td><td>
<p>
여러 구성 파일, 라우팅(Routing)의 정규식 패턴 등에 대한 지원을 추가하는 기능 릴리스입니다.
</p>
<var name="version" value="2.3.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.4</td><td>2023년 2월 28일</td><td>
<p>
HTTP 클라이언트, 라우팅(Routing) 및 ContentNegotiation의 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.4"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.3</td><td>2023년 1월 31일</td><td>
<p>
OAuth2에 대한 멀티플랫폼 기능 및 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.2</td><td>2023년 1월 3일</td><td>
<p>
`2.2.1`에 대한 버그 수정, Swagger 플러그인 개선 및 수정 등이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.1</td><td>2022년 12월 7일</td><td>
<p>
`2.2.0`의 `java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU` 오류에 대한 패치 릴리스입니다.
</p>
<var name="version" value="2.2.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.2.0</td><td>2022년 12월 7일</td><td>
<p>
Swagger UI 호스팅, 새로운 플러그인 API, 세션에 대한 멀티플랫폼 지원 등을 포함한 여러 기능 릴리스입니다. 자세한 내용은 <a href="migration-to-22x.md">2.0.x에서 2.2.x로 마이그레이션</a> 가이드를 참조하세요.
</p>
<var name="version" value="2.2.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.3</td><td>2022년 10월 26일</td><td>
<p>
다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.2</td><td>2022년 9월 29일</td><td>
<p>
라우팅(Routing), 테스트 엔진 및 Ktor 클라이언트의 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.1</td><td>2022년 9월 6일</td><td>
<p>
Ktor 클라이언트 및 서버의 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.1.0</td><td>2022년 8월 11일</td><td>
<p>
YAML 구성 지원 및 기타 다양한 개선 사항과 버그 수정을 추가하는 마이너 릴리스입니다.
</p>
<var name="version" value="2.1.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.3</td><td>2022년 6월 28일</td><td>
<p>
버그 수정 및 `kotlinx.coroutines` 버전이 `1.6.2`로 업그레이드된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.3"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.2</td><td>2022년 5월 27일</td><td>
<p>
다양한 개선 사항, 버그 수정 및 종속성 버전 업그레이드가 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.2"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.1</td><td>2022년 4월 28일</td><td>
<p>
다양한 버그 수정 및 Kotlin 버전이 `1.6.21`로 업데이트된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.1"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>2.0.0</td><td>2022년 4월 11일</td><td>
<p>
업데이트된 API 문서 및 다양한 새로운 기능을 포함하는 주요 릴리스입니다. 호환성이 깨지는 변경 사항 및 `1.x.x`에서 마이그레이션하는 방법에 대한 자세한 내용은 <a href="migration-to-20x.md">마이그레이션 가이드</a>를 참조하세요.
</p>
<var name="version" value="2.0.0"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
<tr><td>1.6.8</td><td>2022년 3월 15일</td><td>
<p>
종속성 버전 업그레이드가 포함된 패치 릴리스입니다.
</p>
<var name="version" value="1.6.8"/>
<include from="lib.topic" element-id="release_details_link"/>
</td></tr>
</table>